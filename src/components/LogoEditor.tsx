import type { LogoState } from '../types'

interface LogoEditorProps {
  state: LogoState
  onChange: (state: LogoState) => void
  /** Si true, no se muestra la minipreview (útil cuando hay preview aparte) */
  hidePreview?: boolean
}

const W = 200
const H = 80

export function LogoEditor({ state, onChange, hidePreview }: LogoEditorProps) {
  const svgString = getLogoSvg(state)

  return (
    <div className="editor-panel logo-editor">
      <h3>Logo</h3>
      {!hidePreview && (
        <div className="preview-wrap">
          <div
            className="preview-svg preview-logo"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>
      )}
      <div className="controls">
        <label>
          <span>Texto</span>
          <input
            type="text"
            value={state.text}
            onChange={(e) => onChange({ ...state, text: e.target.value })}
            placeholder="Tu marca"
            maxLength={20}
          />
        </label>
        <label>
          <span>Color texto</span>
          <input
            type="color"
            value={state.color}
            onChange={(e) => onChange({ ...state, color: e.target.value })}
          />
        </label>
        <label>
          <span>Tamaño fuente</span>
          <input
            type="range"
            min="12"
            max="48"
            value={state.fontSize}
            onChange={(e) =>
              onChange({ ...state, fontSize: Number(e.target.value) })
            }
          />
          <span>{state.fontSize}px</span>
        </label>
        <label>
          <span>Fondo</span>
          <select
            value={state.shape}
            onChange={(e) =>
              onChange({
                ...state,
                shape: e.target.value as LogoState['shape'],
              })
            }
          >
            <option value="none">Sin fondo</option>
            <option value="circle">Círculo</option>
            <option value="rounded">Redondeado</option>
          </select>
        </label>
        {(state.shape === 'circle' || state.shape === 'rounded') && (
          <label>
            <span>Color fondo</span>
            <input
              type="color"
              value={state.backgroundColor}
              onChange={(e) =>
                onChange({ ...state, backgroundColor: e.target.value })
              }
            />
          </label>
        )}
      </div>
    </div>
  )
}

export function getLogoSvg(state: LogoState): string {
  const text = state.text || 'Logo'
  const cx = W / 2
  const cy = H / 2

  let bg = ''
  if (state.shape === 'circle') {
    const r = Math.min(W, H) / 2 - 4
    bg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${state.backgroundColor}"/>`
  } else if (state.shape === 'rounded') {
    bg = `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="12" fill="${state.backgroundColor}"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${bg}<text x="${cx}" y="${cy}" dominant-baseline="central" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${state.fontSize}" font-weight="700" fill="${state.color}">${escapeXml(text)}</text></svg>`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
