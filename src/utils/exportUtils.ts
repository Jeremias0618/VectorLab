/**
 * Convierte un elemento SVG a Data URL (PNG o WebP) vía canvas
 */
export function svgToCanvasDataUrl(
  svgString: string,
  format: 'image/png' | 'image/webp',
  width: number,
  height: number,
  quality?: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('No canvas context'))
      return
    }

    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      ctx.fillStyle = 'transparent'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      const mime = format === 'image/webp' ? 'image/webp' : 'image/png'
      const dataUrl = canvas.toDataURL(mime, quality ?? 1)
      resolve(dataUrl)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Error al cargar SVG'))
    }
    img.src = url
  })
}

/**
 * Descarga un string como archivo
 */
export function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Descarga una Data URL como archivo
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
