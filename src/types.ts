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
  /** ID del icono en Iconify (ej: "mdi:home") para referencia */
  iconifyId?: string
  /** Tamaño total del marco contenedor (px) */
  frameSize: number
  /** Color del borde del marco */
  frameColor: string
  /** Color de relleno del marco (vacío o "transparent" = sin relleno) */
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
