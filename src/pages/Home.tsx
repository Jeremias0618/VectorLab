import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Layout } from '../components/layout'

export default function Home() {
  const [iconColor, setIconColor] = useState('#0c6bdc')
  const [iconSize, setIconSize] = useState(128)

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Columna izquierda — Hero */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]" />
              </span>
              Ahora con soporte WebP
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              El estudio de iconos y logos <span className="gradient-text">open-source</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Crea recursos SVG de alta calidad en segundos. Personaliza cada detalle, exporta en varios formatos y mantén tu flujo de diseño sin fricciones.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/editor"
                className="bg-[var(--color-primary)] hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-0.5"
              >
                Empezar gratis
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-8 py-4 rounded-2xl font-bold transition-all"
              >
                <span className="material-icons-round">play_circle</span>
                Ver demo
              </button>
            </div>
            <div className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-2xl font-bold">12k+</div>
                <div className="text-sm text-slate-500">Usuarios activos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-slate-500">Plantillas</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Gratis</div>
                <div className="text-sm text-slate-500">Para siempre</div>
              </div>
            </div>
          </div>

          {/* Columna derecha — Tarjetas de vista previa */}
          <div className="space-y-6">
            <div className="glass-light dark:glass rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-icons-round text-[var(--color-primary)]">auto_fix_high</span>
                  Editor de iconos
                </h2>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
              <div className="aspect-square w-full max-w-[300px] mx-auto mb-10 bg-slate-100 dark:bg-slate-900/50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 relative group/preview">
                <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-3xl" />
                <span
                  className="material-icons-round animate-pulse-soft"
                  style={{ color: iconColor, fontSize: `${Math.floor(iconSize * 0.6)}px` }}
                >
                  home
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Forma</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-slate-100">
                      <option>Inicio</option>
                      <option>Ajustes</option>
                      <option>Buscar</option>
                      <option>Usuario</option>
                    </select>
                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Color</label>
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                      value={iconColor}
                      onChange={(e) => setIconColor(e.target.value)}
                    />
                    <span className="text-sm font-mono font-medium">{iconColor.toUpperCase()}</span>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tamaño del icono (px)</label>
                    <span className="text-xs font-bold text-[var(--color-primary)]">{iconSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="48"
                    max="200"
                    value={iconSize}
                    onChange={(e) => setIconSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>

            <div className="glass-light dark:glass rounded-[32px] p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-icons-round text-[var(--color-primary)]">download</span>
                <h2 className="text-lg font-bold">Opciones de exportación</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Formato</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-slate-100">
                      <option>SVG (vectorial)</option>
                      <option>PNG (mapa de bits)</option>
                      <option>WebP (optimizado)</option>
                    </select>
                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Resolución</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all text-slate-900 dark:text-slate-100">
                      <option>128 × 128</option>
                      <option>256 × 256</option>
                      <option>512 × 512</option>
                    </select>
                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                  </div>
                </div>
              </div>
              <Link
                to="/editor"
                className="w-full bg-[var(--color-primary)] hover:opacity-95 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="material-icons-round">file_download</span>
                Descargar recurso
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
