import { useState } from 'react'
import type { ExportFormat } from '../types'
import { svgToCanvasDataUrl, downloadBlob, downloadDataUrl } from '../utils/exportUtils'

interface ExportPanelProps {
  svgString: string
  defaultFilename: string
  /** Para logos: ancho y alto de exportación (ej. 400x160). Si no se pasan, se usa size×size. */
  exportWidth?: number
  exportHeight?: number
}

const SIZES = [32, 64, 128, 256, 512, 1024]

export function ExportPanel({
  svgString,
  defaultFilename,
  exportWidth,
  exportHeight,
}: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('png')
  const [size, setSize] = useState(128)
  const [loading, setLoading] = useState(false)

  const isFixedRatio = exportWidth != null && exportHeight != null
  const w = isFixedRatio
    ? Math.round((exportWidth as number) * (size / 128))
    : size
  const h = isFixedRatio
    ? Math.round((exportHeight as number) * (size / 128))
    : size

  const handleDownload = async () => {
    if (!svgString.trim()) return
    setLoading(true)
    const base = defaultFilename || 'vectorlab-export'
    try {
      if (format === 'svg') {
        const filename = `${base}.svg`
        downloadBlob(svgString, filename, 'image/svg+xml;charset=utf-8')
      } else {
        const mime = format === 'webp' ? 'image/webp' : 'image/png'
        const dataUrl = await svgToCanvasDataUrl(
          svgString,
          mime,
          w,
          h,
          format === 'webp' ? 0.92 : 1
        )
        const ext = format === 'webp' ? 'webp' : 'png'
        downloadDataUrl(dataUrl, `${base}-${w}x${h}.${ext}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const canExport = svgString.trim().length > 0

  return (
    <div className="editor-panel export-panel">
      <h3>Exportar</h3>
      <div className="controls">
        <label>
          <span>Formato</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
          >
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </label>
        {(format === 'png' || format === 'webp') && (
          <label>
            <span>{exportWidth != null ? 'Alto (px)' : 'Tamaño (px)'}</span>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {exportWidth != null ? `${s}px` : `${s}×${s}`}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          type="button"
          className="btn-download"
          onClick={handleDownload}
          disabled={!canExport || loading}
        >
          {loading ? 'Exportando…' : `Descargar ${format.toUpperCase()}`}
        </button>
      </div>
    </div>
  )
}
