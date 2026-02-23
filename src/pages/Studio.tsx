import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../Studio.css'
import type { TabKind, IconState, LogoState, StudioConfig } from '../types'
import { IconEditor, getIconSvg, processImageFile } from '../components/IconEditor'
import { LogoEditor, getLogoSvg } from '../components/LogoEditor'
import { ExportPanel } from '../components/ExportPanel'
import { ConfigPanel, mergeIconState, mergeLogoState } from '../components/ConfigPanel'
import { Layout } from '../components/layout'

const PREVIEW_ZOOM_MIN = 0.25
const PREVIEW_ZOOM_MAX = 8
const PREVIEW_ZOOM_STEP = 0.25
const PREVIEW_ZOOM_DEFAULT = 1.5

const initialIconState: IconState = {
  shape: 'home',
  color: '#ffffff',
  size: 48,
  frameEnabled: true,
  frameShape: 'rectangle',
  frameRounded: 8,
  frameSize: 64,
  frameColor: '#475569',
  frameBorderSameAsFill: false,
  frameFillEnabled: false,
  frameFillColor: '#e2e8f0',
  frameThickness: 4,
}

const initialLogoState: LogoState = {
  text: 'VectorLab',
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontSize: 28,
  letterSpacing: 0,
  color: '#1e293b',
  backgroundColor: '#e2e8f0',
  shape: 'rounded',
  frameEnabled: false,
  frameColor: '#475569',
  frameBorderSameAsContent: false,
}

export default function Studio() {
  const location = useLocation()
  const navigate = useNavigate()
  const tab: TabKind = location.pathname === '/editor/logos' ? 'logos' : 'icons'
  const [iconState, setIconState] = useState<IconState>(initialIconState)
  const [logoState, setLogoState] = useState<LogoState>(initialLogoState)
  const [previewZoom, setPreviewZoom] = useState(PREVIEW_ZOOM_DEFAULT)
  const previewContentRef = useRef<HTMLDivElement>(null)

  const handlePreviewDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (tab !== 'icons') return
      const file = e.dataTransfer.files[0]
      if (!file || !['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return
      processImageFile(file).then((partial) => setIconState((s) => ({ ...s, ...partial })))
    },
    [tab]
  )
  const handlePreviewDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleImportConfig = useCallback(
    (config: StudioConfig) => {
      setIconState(mergeIconState(config.iconState, initialIconState))
      setLogoState(mergeLogoState(config.logoState, initialLogoState))
      if (config.tab === 'logos') navigate('/editor/logos')
      else navigate('/editor/iconos')
    },
    [navigate]
  )

  const zoomIn = useCallback(() => {
    setPreviewZoom((z) => Math.min(PREVIEW_ZOOM_MAX, z + PREVIEW_ZOOM_STEP))
  }, [])
  const zoomOut = useCallback(() => {
    setPreviewZoom((z) => Math.max(PREVIEW_ZOOM_MIN, z - PREVIEW_ZOOM_STEP))
  }, [])

  useEffect(() => {
    const el = previewContentRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) zoomIn()
      else if (e.deltaY > 0) zoomOut()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomIn, zoomOut])

  const svgString =
    tab === 'icons' ? getIconSvg(iconState) : getLogoSvg(logoState)
  const defaultFilename =
    tab === 'icons'
      ? `icon-${iconState.iconifyId?.replace(':', '-') ?? iconState.shape}`
      : 'logo'
  const exportDims =
    tab === 'logos'
      ? { exportWidth: 400, exportHeight: 160 }
      : undefined

  return (
    <Layout>
      <main className="studio-main">
        <header className="studio-header-title">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            {tab === 'icons' ? 'Editor de iconos' : 'Editor de logos'}
          </h1>
        </header>
        <div className="studio-app">
          <div className="studio-grid">
            {/* Columna izquierda: misma altura que solo el cuadro Vista previa */}
            <div className="studio-left">
              {tab === 'icons' && (
                <IconEditor
                  state={iconState}
                  onChange={setIconState}
                  hidePreview
                />
              )}
              {tab === 'logos' && (
                <LogoEditor
                  state={logoState}
                  onChange={setLogoState}
                  hidePreview
                />
              )}
            </div>

            {/* Cuadro Vista previa (misma fila que el editor, misma altura) */}
            <div className="studio-preview-box">
              <span className="studio-preview-label">Vista previa</span>
              <div
                ref={previewContentRef}
                className="studio-preview-content"
                role="region"
                aria-label="Vista previa con zoom con rueda del ratón. Arrastra aquí una imagen para reemplazar el icono."
                onDrop={handlePreviewDrop}
                onDragOver={handlePreviewDragOver}
              >
                <div className="studio-preview-canvas">
                  {svgString ? (
                    <div
                      className="studio-preview-inner"
                      style={{ transform: `scale(${previewZoom})` }}
                      dangerouslySetInnerHTML={{ __html: svgString }}
                    />
                  ) : (
                    <p className="studio-preview-empty">Selecciona opciones para ver la vista previa</p>
                  )}
                </div>
                <div className="studio-preview-zoom-btns">
                  <button
                    type="button"
                    className="studio-preview-zoom-btn"
                    onClick={zoomOut}
                    aria-label="Reducir zoom"
                    title="Reducir zoom"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="studio-preview-zoom-btn"
                    onClick={zoomIn}
                    aria-label="Aumentar zoom"
                    title="Aumentar zoom"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Exportar y Configuración: debajo del cuadro Vista previa, solo columna derecha */}
            <div className="studio-preview-export">
              <ExportPanel
                svgString={svgString}
                defaultFilename={defaultFilename}
                {...exportDims}
              />
              <ConfigPanel
                tab={tab}
                iconState={iconState}
                logoState={logoState}
                onImport={handleImportConfig}
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
