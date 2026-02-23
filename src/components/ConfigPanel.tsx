import { useRef } from 'react'
import type { TabKind, IconState, LogoState, StudioConfig } from '../types'
import { downloadBlob } from '../utils/exportUtils'

const CONFIG_VERSION = 1

interface ConfigPanelProps {
  tab: TabKind
  iconState: IconState
  logoState: LogoState
  onImport: (config: StudioConfig) => void
}

function isStudioConfig(obj: unknown): obj is StudioConfig {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  return (
    typeof o.version === 'number' &&
    (o.tab === 'icons' || o.tab === 'logos') &&
    o.iconState != null &&
    typeof o.iconState === 'object' &&
    o.logoState != null &&
    typeof o.logoState === 'object'
  )
}

/** Aplica valores por defecto a un estado importado por si faltan campos (schema evolucionó) */
export function mergeIconState(imported: Partial<IconState>, fallback: IconState): IconState {
  const base = { ...fallback, ...imported }
  return {
    ...base,
    frameRounded: imported.frameRounded ?? fallback.frameRounded ?? 0,
  }
}

export function mergeLogoState(imported: Partial<LogoState>, fallback: LogoState): LogoState {
  return { ...fallback, ...imported }
}

export function ConfigPanel({
  tab,
  iconState,
  logoState,
  onImport,
}: ConfigPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const config: StudioConfig = {
      version: CONFIG_VERSION,
      tab,
      iconState,
      logoState,
    }
    const json = JSON.stringify(config, null, 2)
    const filename = `vectorlab-config-${new Date().toISOString().slice(0, 10)}.json`
    downloadBlob(json, filename, 'application/json')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = reader.result as string
        const data = JSON.parse(raw) as unknown
        if (!isStudioConfig(data)) {
          alert('El archivo no es una configuración válida de VectorLab.')
          return
        }
        onImport(data)
      } catch {
        alert('No se pudo leer el archivo JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="editor-panel config-panel">
      <h3>Configuración</h3>
      <p className="config-panel-desc">
        Guarda o restaura todo el diseño (icono, marco, colores, etc.) en un archivo JSON.
      </p>
      <div className="config-panel-actions">
        <button type="button" className="btn-download btn-export-config" onClick={handleExport}>
          Exportar JSON
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="config-file-input"
          aria-label="Importar configuración JSON"
        />
        <button
          type="button"
          className="btn-import-config"
          onClick={() => inputRef.current?.click()}
        >
          Importar JSON
        </button>
      </div>
    </div>
  )
}

