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
              El editor de iconos y logos <span className="gradient-text">open-source</span>
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
                Vista previa referencial. La edición real está en el editor.
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

        {/* Herramientas — accesos directos */}
        <section className="mt-24 lg:mt-32">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-8">
            Herramientas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/editor/iconos"
              className="group flex items-start gap-4 p-6 rounded-2xl border-2 border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-105 transition-transform">
                <span className="material-icons-round text-2xl">brush</span>
              </span>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Editor de iconos</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Crea y personaliza iconos SVG con plantillas, marcos y colores.
                </p>
              </div>
            </Link>
            <Link
              to="/editor/logos"
              className="group flex items-start gap-4 p-6 rounded-2xl border-2 border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-105 transition-transform">
                <span className="material-icons-round text-2xl">text_fields</span>
              </span>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Editor de logos</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Diseña logos con texto, fuentes, peso y fondos personalizables.
                </p>
              </div>
            </Link>
            <Link
              to="/svg-converter"
              className="group flex items-start gap-4 p-6 rounded-2xl border-2 border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-105 transition-transform">
                <span className="material-icons-round text-2xl">image</span>
              </span>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Conversor a SVG</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Convierte PNG, JPEG o WebP a SVG para uso vectorial.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Info básica del proyecto */}
        <section className="mt-24 lg:mt-32 pb-16">
          <div className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-stone-50/80 dark:bg-slate-900/50 p-8 lg:p-10">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">
              Sobre el proyecto
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4">
              VectorLab es una aplicación web de código abierto para crear iconos SVG y logos, y exportarlos en SVG, PNG y WebP. Pensada para desarrolladores y diseñadores que necesitan recursos vectoriales sin depender de software de pago.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Licencia MIT · Código abierto. Desarrollado con React, TypeScript y Vite.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  )
}
