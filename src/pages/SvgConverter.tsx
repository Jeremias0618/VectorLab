import { useState, useCallback, useEffect } from 'react'
import { Layout } from '../components/layout'
import { downloadBlob } from '../utils/exportUtils'

const ACCEPT = 'image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg'

type PreviewFile = { file: File; objectUrl: string }

type ConvertedItem = {
  id: string
  name: string
  svgContent: string
  previewUrl: string
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(new Error('Error al leer el archivo'))
    r.readAsDataURL(file)
  })
}

function getImageDimensions(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth || 100, h: img.naturalHeight || 100 })
    img.onerror = () => resolve({ w: 100, h: 100 })
    img.src = dataUrl
  })
}

async function convertFileToSvg(file: File): Promise<string> {
  const type = file.type
  if (type === 'image/svg+xml') {
    const text = await file.text()
    return text.trim()
  }
  const dataUrl = await fileToDataUrl(file)
  const { w, h } = await getImageDimensions(dataUrl)
  const escaped = dataUrl.replace(/"/g, '&quot;')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><image href="${escaped}" width="${w}" height="${h}"/></svg>`
}

function minifySvg(svg: string): string {
  return svg.replace(/>\s+</g, '><').trim()
}

export default function SvgConverter() {
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [converted, setConverted] = useState<ConvertedItem[]>([])
  const [converting, setConverting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList?.length) return
    const newFiles: PreviewFile[] = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) continue
      newFiles.push({ file, objectUrl: URL.createObjectURL(file) })
    }
    if (newFiles.length) {
      setFiles((prev) => {
        prev.forEach((f) => URL.revokeObjectURL(f.objectUrl))
        return newFiles
      })
      setConverted([])
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
    e.target.value = ''
  }, [processFiles])

  const [isDragging, setIsDragging] = useState(false)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }, [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleConvert = useCallback(async () => {
    if (!files.length) return
    setConverting(true)
    setConverted((prev) => {
      prev.forEach((c) => URL.revokeObjectURL(c.previewUrl))
      return []
    })
    const results: ConvertedItem[] = []
    for (let i = 0; i < files.length; i++) {
      const { file } = files[i]
      try {
        const svgContent = await convertFileToSvg(file)
        const minified = minifySvg(svgContent)
        const blob = new Blob([minified], { type: 'image/svg+xml;charset=utf-8' })
        const previewUrl = URL.createObjectURL(blob)
        const base = file.name.replace(/\.[^.]+$/, '')
        results.push({
          id: `${i}-${file.name}-${Date.now()}`,
          name: `${base}.svg`,
          svgContent: minified,
          previewUrl,
        })
      } catch {
        // skip failed
      }
    }
    setConverted(results)
    setSelectedIds(new Set(results.map((r) => r.id)))
    setConverting(false)
  }, [files])

  useEffect(() => {
    return () => {
      converted.forEach((c) => URL.revokeObjectURL(c.previewUrl))
    }
  }, [converted])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(converted.map((c) => c.id)))
  }, [converted])

  const downloadOne = useCallback((item: ConvertedItem) => {
    downloadBlob(item.svgContent, item.name, 'image/svg+xml;charset=utf-8')
  }, [])

  const downloadSelected = useCallback(() => {
    const toDownload = converted.filter((c) => selectedIds.has(c.id))
    toDownload.forEach((item, i) => {
      setTimeout(() => downloadBlob(item.svgContent, item.name, 'image/svg+xml;charset=utf-8'), i * 200)
    })
  }, [converted, selectedIds])

  const downloadAll = useCallback(() => {
    converted.forEach((item, i) => {
      setTimeout(() => downloadBlob(item.svgContent, item.name, 'image/svg+xml;charset=utf-8'), i * 200)
    })
  }, [converted])

  const fixRemoveFile = (objectUrl: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.objectUrl !== objectUrl)
      URL.revokeObjectURL(objectUrl)
      return next
    })
    setConverted([])
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
            Conversor a SVG
          </h1>
          <p className="text-stone-600 dark:text-slate-400">
            Sube una o varias imágenes para obtener una vista previa y convertirlas a SVG.
          </p>
        </header>

        <div
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            isDragging
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20'
              : 'border-stone-300 dark:border-slate-600 bg-stone-50 dark:bg-slate-900/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={ACCEPT}
            multiple
            onChange={handleFileChange}
            id="svg-converter-input"
            className="sr-only"
            aria-label="Seleccionar imágenes"
          />
          <label
            htmlFor="svg-converter-input"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <span className="material-icons-round text-5xl text-stone-400 dark:text-slate-500">
              cloud_upload
            </span>
            <span className="text-sm font-medium text-stone-600 dark:text-slate-400">
              Arrastra aquí o haz clic para subir imágenes
            </span>
            <span className="text-xs text-stone-500 dark:text-slate-500">
              PNG, JPEG, WebP o SVG. Una o varias a la vez.
            </span>
          </label>
        </div>

        {files.length > 0 && converted.length === 0 && (
          <section className="mt-10 text-center">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
              {files.length} imagen{files.length !== 1 ? 'es' : ''} lista{files.length !== 1 ? 's' : ''} para convertir
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {files.map(({ file, objectUrl }) => (
                <div
                  key={objectUrl}
                  className="relative group rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 overflow-hidden aspect-square"
                >
                  <img src={objectUrl} alt="" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => fixRemoveFile(objectUrl)}
                    className="absolute top-1 right-1 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Quitar"
                  >
                    <span className="material-icons-round text-lg">close</span>
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 py-1 px-2 bg-black/60 text-white text-xs truncate">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleConvert}
              disabled={converting}
              className="mt-6 px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-95 disabled:opacity-60 transition-opacity"
            >
              {converting ? 'Convirtiendo…' : 'Continuar y convertir a SVG'}
            </button>
          </section>
        )}

        {converted.length > 0 && (
          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
                Vista previa — {converted.length} SVG{converted.length !== 1 ? 's' : ''} convertido{converted.length !== 1 ? 's' : ''}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-sm font-medium text-stone-600 dark:text-slate-400 hover:text-[var(--color-primary)]"
                >
                  Seleccionar todas
                </button>
                <button
                  type="button"
                  onClick={downloadSelected}
                  disabled={selectedIds.size === 0}
                  className="px-4 py-2 rounded-lg bg-stone-200 dark:bg-slate-700 text-stone-900 dark:text-white text-sm font-medium disabled:opacity-50 hover:bg-stone-300 dark:hover:bg-slate-600"
                >
                  Descargar seleccionadas ({selectedIds.size})
                </button>
                <button
                  type="button"
                  onClick={downloadAll}
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-95"
                >
                  Descargar todas
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {converted.map((item, index) => (
                <div
                  key={item.id}
                  className="relative group rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 overflow-hidden aspect-square"
                >
                  <label className="absolute top-2 left-2 z-10 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                    <span className="text-xs text-white drop-shadow">Seleccionar</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="absolute inset-0 flex items-center justify-center p-2 bg-black/0 hover:bg-black/20 transition-colors"
                  >
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 bg-black/60">
                    <span className="flex-1 truncate text-white text-xs">{item.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); downloadOne(item) }}
                      className="shrink-0 text-white hover:text-[var(--color-primary)]"
                      title="Descargar"
                    >
                      <span className="material-icons-round text-lg">download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {lightboxIndex !== null && converted[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa SVG"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              aria-label="Cerrar"
            >
              <span className="material-icons-round">close</span>
            </button>
            <div
              className="max-w-[90vw] max-h-[90vh] overflow-auto bg-white dark:bg-slate-900 rounded-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={converted[lightboxIndex].previewUrl}
                alt=""
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  )
}
