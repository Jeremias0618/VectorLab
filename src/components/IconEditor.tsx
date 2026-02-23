import { useState, useEffect, useRef, useCallback } from 'react'
import type { IconState } from '../types'
import { ICON_PRESETS } from '../data/iconPresets'
import { IconSearch } from './IconSearch'

const VIEWBOX = '0 0 24 24'
const ACCEPT_IMAGES = 'image/png,image/jpeg,image/svg+xml,image/webp,.png,.jpg,.jpeg,.svg,.webp'

function isValidHex(s: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(s) || /^[0-9A-Fa-f]{6}$/.test(s)
}

function normalizeHex(s: string): string {
  const m = s.replace(/^#/, '').match(/^([0-9A-Fa-f]{6})$/)
  return m ? '#' + m[1].toLowerCase() : s
}

interface ColorRowProps {
  label: string
  value: string
  onChange: (hex: string) => void
  allowEmpty?: boolean
}

function ColorRow({ label, value, onChange, allowEmpty }: ColorRowProps) {
  const [text, setText] = useState(value || '')
  useEffect(() => {
    setText(value || '')
  }, [value])

  const displayValue = value || (allowEmpty ? '' : '#000000')
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setText(v)
    if (allowEmpty && (v.trim() === '' || v.trim() === 'transparent')) {
      onChange('')
      return
    }
    const trimmed = v.trim()
    if (isValidHex(trimmed)) onChange(normalizeHex(trimmed))
    else if (trimmed.startsWith('#') && /^#[0-9A-Fa-f]{0,6}$/.test(trimmed) && trimmed.length === 7)
      onChange(normalizeHex(trimmed))
    else if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) onChange('#' + trimmed.toLowerCase())
  }
  const handleBlur = () => {
    const v = text.trim()
    if (allowEmpty && (v === '' || v === 'transparent')) {
      onChange('')
      setText('')
      return
    }
    if (isValidHex(v)) {
      const norm = normalizeHex(v)
      onChange(norm)
      setText(norm)
    } else {
      setText(value || '')
    }
  }
  return (
    <label className="control-row color-row">
      <span className="control-label">{label}</span>
      <input
        type="color"
        value={displayValue || '#000000'}
        onChange={(e) => {
          onChange(e.target.value)
          setText(e.target.value)
        }}
        className="color-picker"
        disabled={allowEmpty && !value}
      />
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        placeholder={allowEmpty ? 'vacío = sin relleno' : '#000000'}
        className="color-hex-input"
        maxLength={9}
      />
    </label>
  )
}

interface IconEditorProps {
  state: IconState
  onChange: (state: IconState) => void
  /** Si true, no se muestra la minipreview (útil cuando hay preview aparte) */
  hidePreview?: boolean
}

/** Procesa un archivo de imagen y devuelve el estado parcial (customSvg o customImageDataUrl). Exportado para uso en Studio (drop en vista previa). */
export function processImageFile(file: File): Promise<Partial<IconState>> {
  const type = file.type
  if (type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve({ customSvg: r.result as string, customImageDataUrl: undefined, iconifyId: undefined })
      r.onerror = () => reject(new Error('No se pudo leer el archivo'))
      r.readAsText(file)
    })
  }
  if (type === 'image/png' || type === 'image/jpeg' || type === 'image/webp') {
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve({ customImageDataUrl: r.result as string, customSvg: undefined, iconifyId: undefined })
      r.onerror = () => reject(new Error('No se pudo leer el archivo'))
      r.readAsDataURL(file)
    })
  }
  return Promise.resolve({})
}

type PasteImageOption = { type: string; blob: Blob; objectUrl: string }

export function IconEditor({ state, onChange, hidePreview }: IconEditorProps) {
  const svgString = getIconSvg(state)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pasteModalImages, setPasteModalImages] = useState<PasteImageOption[] | null>(null)

  const closePasteModal = useCallback(() => {
    setPasteModalImages((prev) => {
      if (prev) prev.forEach((img) => URL.revokeObjectURL(img.objectUrl))
      return null
    })
  }, [])

  const applyImageFile = useCallback(
    (file: File) => {
      processImageFile(file).then(
        (partial) => onChange({ ...state, ...partial }),
        () => {}
      )
    },
    [state, onChange]
  )

  const handlePasteImage = useCallback(() => {
    if (!navigator.clipboard?.read) {
      alert('Su navegador no permite leer el portapapeles.')
      return
    }
    navigator.clipboard.read().then(async (items) => {
      const imageList: { type: string; blob: Blob }[] = []
      for (const item of items) {
        const types = item.types.filter((t) =>
          ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(t)
        )
        for (const type of types) {
          const blob = await item.getType(type)
          if (blob) imageList.push({ type, blob })
        }
      }
      if (imageList.length === 0) {
        alert('No hay ninguna imagen en el portapapeles o el formato no es compatible. Use PNG, JPEG, WebP o SVG.')
        return
      }
      if (imageList.length === 1) {
        const file = new File([imageList[0].blob], 'pasted', { type: imageList[0].type })
        applyImageFile(file)
        return
      }
      setPasteModalImages(
        imageList.map(({ type, blob }) => ({ type, blob, objectUrl: URL.createObjectURL(blob) }))
      )
    }).catch(() => {
      alert('No se pudo leer el portapapeles. Compruebe los permisos del navegador.')
    })
  }, [applyImageFile])

  const handleSelectPastedImage = useCallback(
    (opt: PasteImageOption) => {
      const file = new File([opt.blob], 'pasted', { type: opt.type })
      applyImageFile(file)
      closePasteModal()
    },
    [applyImageFile, closePasteModal]
  )

  return (
    <div className="editor-panel icon-editor">
      {pasteModalImages && (
        <div className="paste-modal-overlay" onClick={closePasteModal} role="dialog" aria-modal="true" aria-label="Elegir imagen del portapapeles">
          <div className="paste-modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="paste-modal-title">Varias imágenes en el portapapeles</h4>
            <p className="paste-modal-desc">Elige la imagen que quieres importar al editor.</p>
            <div className="paste-modal-grid">
              {pasteModalImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className="paste-modal-item"
                  onClick={() => handleSelectPastedImage(img)}
                  title="Usar esta imagen"
                >
                  <img src={img.objectUrl} alt="" />
                </button>
              ))}
            </div>
            <button type="button" className="paste-modal-cancel" onClick={closePasteModal}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      {!hidePreview && (
        <div className="preview-wrap">
          <div
            className="preview-svg"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>
      )}

      <div className="icon-editor-cards">
        <section className="icon-editor-card">
          <h4 className="icon-editor-card-title">
            <span className="icon-editor-card-num">1</span>
            Seleccionar icono
          </h4>
          <IconSearch
            currentColor={state.color}
            onSelect={(customSvg, iconifyId) =>
              onChange({ ...state, customSvg, iconifyId, customImageDataUrl: undefined })
            }
          />
          <div className="icon-upload-row">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_IMAGES}
              className="icon-upload-input"
              aria-label="Subir imagen"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) applyImageFile(file)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              className="icon-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Subir imagen
            </button>
            <button type="button" className="icon-upload-btn" onClick={handlePasteImage}>
              Pegar imagen
            </button>
          </div>
        </section>

        <section className="icon-editor-card">
          <h4 className="icon-editor-card-title">
            <span className="icon-editor-card-num">2</span>
            Edición del icono
          </h4>
          <div className="controls">
            <ColorRow
              label="Color"
              value={state.color}
              onChange={(color) => onChange({ ...state, color })}
            />
            <label className="control-row">
              <span className="control-label">Tamaño</span>
              <input
                type="range"
                min="16"
                max="96"
                value={state.size}
                onChange={(e) =>
                  onChange({ ...state, size: Number(e.target.value) })
                }
              />
              <span className="control-value">{state.size}</span>
            </label>
          </div>
        </section>

        <section className="icon-editor-card">
          <h4 className="icon-editor-card-title">
            <span className="icon-editor-card-num">3</span>
            Edición del marco
          </h4>
          <div className="controls">
          <label className="control-row control-row-checkbox">
            <input
              type="checkbox"
              checked={state.frameEnabled}
              onChange={(e) =>
                onChange({ ...state, frameEnabled: e.target.checked })
              }
            />
            <span className="control-label">Usar marco</span>
          </label>
          {state.frameEnabled && (
            <>
              <label className="control-row">
                <span className="control-label">Forma</span>
                <select
                  value={state.frameShape}
                  onChange={(e) =>
                    onChange({
                      ...state,
                      frameShape: e.target.value as IconState['frameShape'],
                    })
                  }
                >
                  <option value="circle">Círculo</option>
                  <option value="rectangle">Rectángulo</option>
                  <option value="square">Cuadrado</option>
                  <option value="triangle">Triángulo</option>
                  <option value="rhombus">Rombo</option>
                </select>
              </label>
              {state.frameShape !== 'circle' && (
                <label className="control-row">
                  <span className="control-label">Redondeado</span>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={state.frameRounded ?? 0}
                    onChange={(e) =>
                      onChange({ ...state, frameRounded: Number(e.target.value) })
                    }
                  />
                  <span className="control-value">{state.frameRounded ?? 0}</span>
                </label>
              )}
              <label className="control-row">
                <span className="control-label">Tamaño</span>
                <input
                  type="range"
                  min="48"
                  max="256"
                  value={state.frameSize}
                  onChange={(e) =>
                    onChange({ ...state, frameSize: Number(e.target.value) })
                  }
                />
                <span className="control-value">{state.frameSize} px</span>
              </label>
              <ColorRow
                label="Borde"
                value={state.frameColor}
                onChange={(frameColor) =>
                  onChange(
                    state.frameBorderSameAsFill && state.frameFillEnabled
                      ? { ...state, frameColor, frameFillColor: frameColor }
                      : { ...state, frameColor }
                  )
                }
              />
              <label className="control-row control-row-checkbox">
                <input
                  type="checkbox"
                  checked={state.frameFillEnabled}
                  onChange={(e) =>
                    onChange({ ...state, frameFillEnabled: e.target.checked })
                  }
                />
                <span className="control-label">Aplicar color de relleno</span>
              </label>
              {state.frameFillEnabled && (
                <>
                  <ColorRow
                    label="Color relleno"
                    value={state.frameFillColor ?? ''}
                    onChange={(frameFillColor) => {
                      const v = frameFillColor || '#e2e8f0'
                      onChange(
                        state.frameBorderSameAsFill
                          ? { ...state, frameFillColor: v, frameColor: v }
                          : { ...state, frameFillColor: v }
                      )
                    }}
                  />
                  <label className="control-row control-row-checkbox">
                    <input
                      type="checkbox"
                      checked={state.frameBorderSameAsFill}
                      onChange={(e) => {
                        const checked = e.target.checked
                        onChange({
                          ...state,
                          frameBorderSameAsFill: checked,
                          ...(checked
                            ? { frameFillColor: state.frameColor }
                            : {}),
                        })
                      }}
                    />
                    <span className="control-label">Mismo color para borde y relleno</span>
                  </label>
                </>
              )}
              <label className="control-row">
                <span className="control-label">Grosor borde</span>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={state.frameThickness}
                  onChange={(e) =>
                    onChange({ ...state, frameThickness: Number(e.target.value) })
                  }
                />
                <span className="control-value">{state.frameThickness} px</span>
              </label>
            </>
          )}
          </div>
        </section>
      </div>
    </div>
  )
}

/** Genera el SVG del icono (contenido interno 24x24 con color) para escalar después */
function getInnerIconSvg(state: IconState): string {
  if (state.customImageDataUrl) {
    const href = state.customImageDataUrl.replace(/"/g, '&quot;')
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}"><image href="${href}" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet"/></svg>`
  }
  if (state.customSvg) {
    const withColor = state.color
      ? state.customSvg.replace(/currentColor/g, state.color)
      : state.customSvg
    return withColor.replace(/\s(width|height)=["'][^"']*["']/gi, '').trim()
  }
  const path = ICON_PRESETS[state.shape] ?? ICON_PRESETS.home
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}"><path fill="${state.color}" d="${path}"/></svg>`
}

function getFrameShapeElement(
  fs: number,
  t: number,
  shape: IconState['frameShape'],
  rounded: number,
  fill: string,
  stroke: string
): string {
  const cx = fs / 2
  const cy = fs / 2
  const half = (fs - t) / 2
  if (shape === 'circle') {
    const r = half
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${t}"/>`
  }
  const x = t / 2
  const y = t / 2
  const w = fs - t
  const h = fs - t
  const rx = Math.min(rounded, Math.floor(w / 2), Math.floor(h / 2))
  if (shape === 'square' || shape === 'rectangle') {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${t}"/>`
  }
  const pad = t / 2 + 1
  if (shape === 'triangle') {
    const x1 = cx
    const y1 = pad
    const x2 = fs - pad
    const y2 = fs - pad
    const x3 = pad
    const y3 = fs - pad
    const pts = `${x1},${y1} ${x2},${y2} ${x3},${y3}`
    return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${t}" stroke-linejoin="round"/>`
  }
  if (shape === 'rhombus') {
    const x1 = cx
    const y1 = pad
    const x2 = fs - pad
    const y2 = cy
    const x3 = cx
    const y3 = fs - pad
    const x4 = pad
    const y4 = cy
    const pts = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`
    return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${t}" stroke-linejoin="round"/>`
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${t}"/>`
}

export function getIconSvg(state: IconState): string {
  const fs = state.frameSize
  const inner = getInnerIconSvg(state)
  const innerContent = inner.replace(/<svg[\s\S]*?>/, '').replace(/<\/svg>/, '').trim()
  const iconSize = Math.max(16, Math.min(state.size, fs - 8))
  const scale = iconSize / 24

  if (!state.frameEnabled) {
    const outSize = Math.max(fs, iconSize)
    const dx = (outSize - iconSize) / 2
    const dy = (outSize - iconSize) / 2
    const group = `<g transform="translate(${dx}, ${dy}) scale(${scale})">${innerContent}</g>`
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${outSize} ${outSize}" width="${outSize}" height="${outSize}">${group}</svg>`
  }

  const t = Math.min(state.frameThickness, Math.floor(fs / 4))
  const innerArea = Math.max(8, fs - 2 * t)
  const dx = t + (innerArea - iconSize) / 2
  const dy = t + (innerArea - iconSize) / 2
  const fill = state.frameFillEnabled
    ? state.frameBorderSameAsFill
      ? state.frameColor
      : state.frameFillColor?.trim() && state.frameFillColor !== 'transparent'
        ? state.frameFillColor
        : 'none'
    : 'none'
  const stroke =
    state.frameBorderSameAsFill && state.frameFillEnabled
      ? state.frameColor
      : state.frameColor
  const frameEl = getFrameShapeElement(
    fs,
    t,
    state.frameShape,
    state.frameRounded ?? 0,
    fill,
    stroke
  )
  const innerGroup = `<g transform="translate(${dx}, ${dy}) scale(${scale})">${innerContent}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fs} ${fs}" width="${fs}" height="${fs}">${frameEl}${innerGroup}</svg>`
}
