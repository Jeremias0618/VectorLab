import { Layout } from '../components/layout'
import { Link } from 'react-router-dom'

const docSections = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'funcionamiento', label: 'Funcionamiento y uso' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'tecnologias', label: 'Tecnologías' },
] as const

export default function Documentation() {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-10 lg:py-14">
        {/* Barra lateral — misma línea visual que el resto de la app */}
        <aside className="lg:w-56 shrink-0 lg:sticky lg:top-24 lg:self-start order-2 lg:order-1">
          <nav
            className="flex flex-wrap gap-2 lg:flex-col lg:gap-1 pb-8 lg:pb-0"
            aria-label="Documentación"
          >
            {docSections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] hover:bg-stone-100 dark:hover:bg-slate-800/80 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 min-w-0 lg:pl-12 order-1 lg:order-2 doc-content">
          <header className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-white tracking-tight mb-3">
              Documentación
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Funcionamiento, uso y stack tecnológico de VectorLab.
            </p>
          </header>

          <section id="introduccion" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-slate-700 pb-2">
              Introducción
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              VectorLab es una aplicación web de código abierto que permite crear iconos SVG y logos desde el navegador, sin instalar software. Los diseños se pueden exportar en varios formatos (SVG, PNG, WebP) para integrarlos en sitios web, apps o material de marca.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Está pensada para desarrolladores, diseñadores y equipos que necesitan recursos vectoriales de calidad sin depender de herramientas de pago. Toda la interfaz respeta tema claro/oscuro y es responsive.
            </p>
          </section>

          <section id="funcionamiento" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-slate-700 pb-2">
              Funcionamiento y uso
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              La aplicación se organiza en tres herramientas accesibles desde el menú superior y desde la página de inicio. Cada una genera salida lista para descargar o copiar.
            </p>
            <ul className="space-y-6 text-slate-600 dark:text-slate-300">
              <li className="pl-4 border-l-2 border-[var(--color-primary)]/30">
                <strong className="text-stone-900 dark:text-white">Editor de iconos</strong> — Eliges una plantilla (por ejemplo “home”, “star”), ajustas color, tamaño, marco (rectángulo, círculo, redondeado) y opciones de relleno o borde. La vista previa se actualiza al instante. Puedes arrastrar una imagen (PNG, SVG, etc.) sobre la vista previa para usarla como base. La exportación permite descargar en SVG, PNG o WebP.
              </li>
              <li className="pl-4 border-l-2 border-[var(--color-primary)]/30">
                <strong className="text-stone-900 dark:text-white">Editor de logos</strong> — Escribes el texto del logo, eliges fuente (con búsqueda y sugerencias), peso, tamaño, espaciado y color. Puedes configurar fondo (sin fondo, círculo, redondeado), color de fondo y opcionalmente un cuadro/borde. La vista previa muestra el resultado en tiempo real. Exportación en los mismos formatos que los iconos.
              </li>
              <li className="pl-4 border-l-2 border-[var(--color-primary)]/30">
                <strong className="text-stone-900 dark:text-white">Conversor a SVG</strong> — Subes una o varias imágenes (PNG, JPEG, WebP o SVG). Puedes arrastrarlas a la zona de subida o seleccionarlas con un clic. Tras la conversión se muestra una vista previa y puedes descargar cada SVG por separado o en lote.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              En el editor (iconos y logos) existe un panel de <strong className="text-stone-900 dark:text-white">Configuración</strong> desde el que se puede exportar e importar el estado en JSON, para guardar o compartir diseños y recuperarlos más tarde.
            </p>
          </section>

          <section id="herramientas" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-slate-700 pb-2">
              Herramientas
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Accesos directos a las tres herramientas disponibles:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/editor/iconos"
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <span className="material-icons-round">brush</span>
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 dark:text-white block truncate">Editor de iconos</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Crear iconos SVG</span>
                </div>
              </Link>
              <Link
                to="/editor/logos"
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <span className="material-icons-round">text_fields</span>
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 dark:text-white block truncate">Editor de logos</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Diseñar logos</span>
                </div>
              </Link>
              <Link
                to="/svg-converter"
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <span className="material-icons-round">image</span>
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 dark:text-white block truncate">Conversor a SVG</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Imagen → SVG</span>
                </div>
              </Link>
            </div>
          </section>

          <section id="tecnologias" className="scroll-mt-24 mb-14">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4 border-b border-stone-200 dark:border-slate-700 pb-2">
              Tecnologías
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              VectorLab está desarrollado con las siguientes tecnologías:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-200 font-bold text-sm">R</span>
                <span><strong className="text-stone-900 dark:text-white">React</strong> — Biblioteca para la interfaz de usuario y componentes reutilizables.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">TS</span>
                <span><strong className="text-stone-900 dark:text-white">TypeScript</strong> — Tipado estático para mayor seguridad y mantenibilidad del código.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white font-bold text-sm">V</span>
                <span><strong className="text-stone-900 dark:text-white">Vite</strong> — Herramienta de desarrollo y empaquetado rápido (build y dev server).</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-sm">SVG</span>
                <span><strong className="text-stone-900 dark:text-white">SVG nativo</strong> — Gráficos vectoriales generados como markup SVG, sin librerías externas de dibujo.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-600 text-white font-bold text-sm">T</span>
                <span><strong className="text-stone-900 dark:text-white">Tailwind CSS</strong> — Estilos utilitarios y diseño responsive.</span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              Las fuentes de texto del editor de logos se cargan desde Google Fonts. El proyecto es 100 % front-end: no requiere backend ni base de datos; todo el procesamiento se realiza en el navegador.
            </p>
          </section>
        </main>
      </div>
    </Layout>
  )
}
