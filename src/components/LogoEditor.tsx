import { useState, useEffect } from 'react'
import type { LogoState } from '../types'

const FONTS_LIST = [
  'Poppins',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Raleway',
  'Oswald',
  'Source Sans 3',
]

const W = 200
const H = 80

interface LogoEditorProps {
  state: LogoState
  onChange: (state: LogoState) => void
  hidePreview?: boolean
}

export function LogoEditor({ state, onChange, hidePreview }: LogoEditorProps) {
  const fontFamily = state.fontFamily || 'Poppins'
  const [fontQuery, setFontQuery] = useState(fontFamily)
  // Sincronizar con la fuente aplicada cuando cambia desde fuera (ej. cargar proyecto)
  useEffect(() => {
    setFontQuery(state.fontFamily || 'Poppins')
  }, [state.fontFamily])

  const query = fontQuery.trim().toLowerCase()
  const suggestedFonts = query
    ? FONTS_LIST.filter((f) => f.toLowerCase().includes(query))
    : FONTS_LIST
  const showSuggestions = suggestedFonts.length > 0

  return (
    <div className="editor-panel logo-editor">
      {!hidePreview && (
        <div className="preview-wrap">
          <div
            className="preview-svg preview-logo"
            dangerouslySetInnerHTML={{ __html: getLogoSvg(state) }}
          />
        </div>
      )}
      <div className="icon-editor-cards">
        <section className="icon-editor-card">
          <h4 className="icon-editor-card-title">
            <span className="icon-editor-card-num">1</span>
            Texto del logo
          </h4>
          <div className="controls">
            <label className="control-row">
              <span className="control-label">Texto</span>
              <input
                type="text"
                value={state.text}
                onChange={(e) => onChange({ ...state, text: e.target.value })}
                placeholder="Tu marca"
                maxLength={24}
                className="flex-1 min-w-0"
              />
            </label>
          </div>
        </section>

        <section className="icon-editor-card">
          <h4 className="icon-editor-card-title">
            <span className="icon-editor-card-num">2</span>
            Fuente y estilo
          </h4>
          <div className="controls">
            <label className="control-row">
              <span className="control-label">Fuente</span>
              <input
                type="text"
                value={fontQuery}
                onChange={(e) => setFontQuery(e.target.value)}
                onBlur={() => {
                  const v = fontQuery.trim()
                  if (v) onChange({ ...state, fontFamily: v })
                }}
                placeholder="Escribe para buscar o elige abajo"
                className="flex-1 min-w-0 logo-font-input"
                autoComplete="off"
              />
            </label>
            {showSuggestions && (
              <div className="logo-font-suggestions" role="listbox">
                {suggestedFonts.map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="option"
                    className={`logo-font-suggestion-item ${fontFamily === name ? 'is-selected' : ''}`}
                    onClick={() => {
                      setFontQuery(name)
                      onChange({ ...state, fontFamily: name })
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            <label className="control-row control-row-select">
              <span className="control-label">Peso</span>
              <select
                value={state.fontWeight}
                onChange={(e) => onChange({ ...state, fontWeight: Number(e.target.value) })}
              >
                <option value={400}>Normal (400)</option>
                <option value={500}>Medium (500)</option>
                <option value={600}>SemiBold (600)</option>
                <option value={700}>Bold (700)</option>
                <option value={800}>ExtraBold (800)</option>
              </select>
            </label>
            <label className="control-row">
              <span className="control-label">Tamaño</span>
              <input
                type="range"
                min="12"
                max="56"
                value={state.fontSize}
                onChange={(e) => onChange({ ...state, fontSize: Number(e.target.value) })}
              />
              <span className="control-value">{state.fontSize}px</span>
            </label>
            <label className="control-row">
              <span className="control-label">Espaciado</span>
              <input
                type="range"
                min="-2"
                max="8"
                value={state.letterSpacing}
                onChange={(e) => onChange({ ...state, letterSpacing: Number(e.target.value) })}
              />
              <span className="control-value">{state.letterSpacing}px</span>
            </label>
            <label className="control-row color-row">
              <span className="control-label">Color texto</span>
              <input
                type="color"
                value={state.color}
                onChange={(e) => onChange({ ...state, color: e.target.value })}
                className="color-picker"
              />
              <input
                type="text"
                value={state.color}
                onChange={(e) => /^#[0-9A-Fa-f]{6}$/.test(e.target.value) && onChange({ ...state, color: e.target.value })}
                className="color-hex-input"
                maxLength={7}
              />
            </label>
          </div>
        </section>

        <section className="icon-editor-card">
          <h4 className="icon-editor-card-title">
            <span className="icon-editor-card-num">3</span>
            Fondo y cuadro
          </h4>
          <div className="controls">
            <label className="control-row control-row-select">
              <span className="control-label">Fondo</span>
              <select
                value={state.shape}
                onChange={(e) =>
                  onChange({ ...state, shape: e.target.value as LogoState['shape'] })
                }
              >
                <option value="none">Sin fondo</option>
                <option value="circle">Círculo</option>
                <option value="rounded">Redondeado</option>
              </select>
            </label>
            {(state.shape === 'circle' || state.shape === 'rounded') && (
              <label className="control-row color-row">
                <span className="control-label">Color fondo</span>
                <input
                  type="color"
                  value={state.backgroundColor}
                  onChange={(e) => onChange({ ...state, backgroundColor: e.target.value })}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={state.backgroundColor}
                  onChange={(e) => /^#[0-9A-Fa-f]{6}$/.test(e.target.value) && onChange({ ...state, backgroundColor: e.target.value })}
                  className="color-hex-input"
                  maxLength={7}
                />
              </label>
            )}
            <label className="control-row control-row-checkbox">
              <input
                type="checkbox"
                checked={state.frameEnabled}
                onChange={(e) => onChange({ ...state, frameEnabled: e.target.checked })}
              />
              <span className="control-label">Usar cuadro / borde</span>
            </label>
            {state.frameEnabled && (
              <>
                <label className="control-row color-row">
                  <span className="control-label">Color borde</span>
                  <input
                    type="color"
                    value={state.frameColor}
                    onChange={(e) => onChange({ ...state, frameColor: e.target.value })}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={state.frameColor}
                    onChange={(e) => /^#[0-9A-Fa-f]{6}$/.test(e.target.value) && onChange({ ...state, frameColor: e.target.value })}
                    className="color-hex-input"
                    maxLength={7}
                  />
                </label>
                <label className="control-row control-row-checkbox">
                  <input
                    type="checkbox"
                    checked={state.frameBorderSameAsContent}
                    onChange={(e) =>
                      onChange({ ...state, frameBorderSameAsContent: e.target.checked })
                    }
                  />
                  <span className="control-label">Mismo color para texto y borde</span>
                </label>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function getLogoSvg(state: LogoState): string {
  const text = state.text || 'Logo'
  const cx = W / 2
  const cy = H / 2
  const textColor =
    state.frameEnabled && state.frameBorderSameAsContent ? state.frameColor : state.color
  const fontFamily = (state.fontFamily || 'Poppins').replace(/"/g, "'")

  let bg = ''
  if (state.shape === 'circle') {
    const r = Math.min(W, H) / 2 - 4
    bg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${state.backgroundColor}"/>`
  } else if (state.shape === 'rounded') {
    bg = `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="12" fill="${state.backgroundColor}"/>`
  }

  let frame = ''
  if (state.frameEnabled && state.frameColor) {
    const pad = 2
    frame = `<rect x="${pad}" y="${pad}" width="${W - pad * 2}" height="${H - pad * 2}" rx="10" fill="none" stroke="${state.frameColor}" stroke-width="2"/>`
  }

  const textEl = `<text x="${cx}" y="${cy}" dominant-baseline="central" text-anchor="middle" font-family="${fontFamily}, system-ui, sans-serif" font-size="${state.fontSize}" font-weight="${state.fontWeight}" letter-spacing="${state.letterSpacing}px" fill="${textColor}">${escapeXml(text)}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${bg}${frame}${textEl}</svg>`
}
