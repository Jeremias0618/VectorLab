export type TabKind = 'icons' | 'logos'

export type ExportFormat = 'svg' | 'png' | 'webp'

export interface IconState {
  /** Forma predefinida cuando no hay customSvg (uso interno) */
  shape: string
  color: string
  /** Tamaño del icono dentro del marco (px) */
  size: number
  /** SVG completo del icono elegido desde el buscador (Iconify, etc.) */
  customSvg?: string
  /** Imagen raster en data URL (PNG, JPEG, WebP subida o pegada) */
  customImageDataUrl?: string
  /** ID del icono en Iconify (ej: "mdi:home") para referencia */
  iconifyId?: string
  /** Si false, no se dibuja marco (solo el icono) */
  frameEnabled: boolean
  /** Forma del marco cuando frameEnabled es true */
  frameShape: 'circle' | 'square' | 'rectangle' | 'triangle' | 'rhombus'
  /** Radio de redondeado (esquinas) cuando la forma lo permite (0 = sin redondear) */
  frameRounded: number
  /** Tamaño total del marco contenedor (px) */
  frameSize: number
  /** Color del borde del marco */
  frameColor: string
  /** Si true, el borde usa el mismo color que el relleno (cuando hay relleno) */
  frameBorderSameAsFill: boolean
  /** Si true, se aplica color de relleno al marco (usar frameFillColor) */
  frameFillEnabled: boolean
  /** Color de relleno del marco cuando frameFillEnabled es true */
  frameFillColor: string
  /** Grosor del borde del marco (px) */
  frameThickness: number
}

export interface LogoState {
  text: string
  fontSize: number
  color: string
  backgroundColor: string
  shape: 'none' | 'circle' | 'rounded'
}

/** Configuración guardada para exportar/importar el estado completo del Studio */
export interface StudioConfig {
  version: number
  tab: TabKind
  iconState: IconState
  logoState: LogoState
}
