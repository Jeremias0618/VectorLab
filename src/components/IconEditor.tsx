import { useState, useEffect } from 'react'
import type { IconState } from '../types'
import { ICON_PRESETS } from '../data/iconPresets'
import { IconSearch } from './IconSearch'

const VIEWBOX = '0 0 24 24'

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

export function IconEditor({ state, onChange, hidePreview }: IconEditorProps) {
  const svgString = getIconSvg(state)

  return (
    <div className="editor-panel icon-editor">
      {!hidePreview && (
        <div className="preview-wrap">
          <div
            className="preview-svg"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>
      )}

      <section className="editor-section">
        <h4 className="editor-section-title">Buscar icono</h4>
        <IconSearch
          currentColor={state.color}
          onSelect={(customSvg, iconifyId) =>
            onChange({ ...state, customSvg, iconifyId })
          }
        />
      </section>

      <section className="editor-section">
        <h4 className="editor-section-title">Solo el icono</h4>
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

      <section className="editor-section">
        <h4 className="editor-section-title">Marco contenedor</h4>
        <div className="controls">
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
            onChange={(frameColor) => onChange({ ...state, frameColor })}
          />
          <ColorRow
            label="Relleno"
            value={state.frameFillColor ?? ''}
            onChange={(frameFillColor) =>
              onChange({ ...state, frameFillColor: frameFillColor || '' })
            }
            allowEmpty
          />
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
        </div>
      </section>
    </div>
  )
}

/** Genera el SVG del icono (solo contenido, con color y tamaño) para meter dentro del marco */
function getInnerIconSvg(state: IconState): string {
  const innerSize = Math.max(8, state.frameSize - 2 * state.frameThickness)
  if (state.customSvg) {
    const withColor = state.color
      ? state.customSvg.replace(/currentColor/g, state.color)
      : state.customSvg
    const withSize = withColor.replace(
      /(\s)(width|height)=["'][^"']*["']/gi,
      (_, s, attr) => `${s}${attr}="${innerSize}"`
    )
    if (!/width=/.test(withSize)) {
      return withSize.replace(
        /<svg/,
        `<svg width="${innerSize}" height="${innerSize}"`
      )
    }
    return withSize
  }
  const path = ICON_PRESETS[state.shape] ?? ICON_PRESETS.home
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="${innerSize}" height="${innerSize}"><path fill="${state.color}" d="${path}"/></svg>`
}

export function getIconSvg(state: IconState): string {
  const fs = state.frameSize
  const t = Math.min(state.frameThickness, Math.floor(fs / 4))
  const innerSize = Math.max(8, fs - 2 * t)
  const inner = getInnerIconSvg(state)
  const innerContent = inner.replace(/<svg[\s\S]*?>/, '').replace(/<\/svg>/, '').trim()
  const rx = Math.min(12, Math.floor(fs / 8))
  const fill = state.frameFillColor?.trim() && state.frameFillColor !== 'transparent'
    ? state.frameFillColor
    : 'none'
  const frameRect = `<rect x="${t / 2}" y="${t / 2}" width="${fs - t}" height="${fs - t}" rx="${rx}" fill="${fill}" stroke="${state.frameColor}" stroke-width="${t}"/>`
  const scale = innerSize / 24
  const innerGroup = `<g transform="translate(${t}, ${t}) scale(${scale})">${innerContent}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fs} ${fs}" width="${fs}" height="${fs}">${frameRect}${innerGroup}</svg>`
}
