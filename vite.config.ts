import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// GitHub Pages: al no encontrar un archivo sirve 404.html. Copiamos index.html → 404.html
// para que rutas como /VectorLab/home carguen la SPA en lugar de "File not found".
function copyIndexTo404() {
  return {
    name: 'copy-index-to-404',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const index = join(outDir, 'index.html')
      const notFound = join(outDir, '404.html')
      if (existsSync(index)) {
        copyFileSync(index, notFound)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copyIndexTo404()],
  base: '/VectorLab/',
})
