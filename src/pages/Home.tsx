import { Link } from 'react-router-dom'
import { Layout } from '../components/layout'

export default function Home() {
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
                to="/editor/iconos"
                className="bg-[var(--color-primary)] hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-0.5"
              >
                Empezar ahora
              </Link>
            </div>
          </div>

          {/* Columna derecha — Diseño referencial del editor (solo visual, enlace a /editor/iconos) */}
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
                <span className="material-icons-round text-[var(--color-primary)]" style={{ fontSize: '96px' }}>
                  home
                </span>
              </div>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
                Vista previa referencial. La edición real está en el estudio.
              </p>
              <Link
                to="/editor/iconos"
                className="block w-full bg-[var(--color-primary)] hover:opacity-95 text-white py-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="material-icons-round">edit</span>
                Abrir editor de iconos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
