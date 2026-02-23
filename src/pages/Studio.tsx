import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../Studio.css'
import type { TabKind, IconState, LogoState } from '../types'
import { IconEditor, getIconSvg } from '../components/IconEditor'
import { LogoEditor, getLogoSvg } from '../components/LogoEditor'
import { ExportPanel } from '../components/ExportPanel'
import { Layout } from '../components/layout'

const initialIconState: IconState = {
  shape: 'home',
  color: '#ffffff',
  size: 48,
  frameSize: 64,
  frameColor: '#1e293b',
  frameFillColor: '',
  frameThickness: 4,
}

const initialLogoState: LogoState = {
  text: 'VectorLab',
  fontSize: 28,
  color: '#1e293b',
  backgroundColor: '#e2e8f0',
  shape: 'rounded',
}

export default function Studio() {
  const location = useLocation()
  const tab: TabKind = location.pathname === '/editor/logos' ? 'logos' : 'icons'
  const [iconState, setIconState] = useState<IconState>(initialIconState)
  const [logoState, setLogoState] = useState<LogoState>(initialLogoState)

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
        <div className="studio-app">
          <div className="studio-grid">
            {/* Columna izquierda: solo selección de icono/logo */}
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

            {/* Columna derecha: vista previa + exportar (mismo ancho) */}
            <div className="studio-preview-box">
              <span className="studio-preview-label">Vista previa</span>
              <div className="studio-preview-content">
                <div className="studio-preview-canvas">
                  {svgString ? (
                    <div
                      className="studio-preview-inner"
                      dangerouslySetInnerHTML={{ __html: svgString }}
                    />
                  ) : (
                    <p className="studio-preview-empty">Selecciona opciones para ver la vista previa</p>
                  )}
                </div>
              </div>
              <div className="studio-preview-export">
                <ExportPanel
                  svgString={svgString}
                  defaultFilename={defaultFilename}
                  {...exportDims}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
