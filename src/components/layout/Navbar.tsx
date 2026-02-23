import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

const REPO_URL = 'https://github.com/Jeremias0618/VectorLab'
const SQUOOSH_URL = 'https://squoosh.app/'

const navLinks = [{ to: '/home', label: 'Inicio' }] as const

const editorLinks = [
  { to: '/editor/iconos', label: 'Iconos' },
  { to: '/editor/logos', label: 'Logos' },
] as const

export default function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const isHome = location.pathname === '/home' || location.pathname === '/'
  const isEditor = location.pathname.startsWith('/editor')

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] border-b border-stone-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — estilo Finch: tipografía clara, sin gradiente llamativo */}
          <Link
            to="/home"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--color-background-dark)] rounded-lg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white transition-transform group-hover:scale-105">
              <span className="material-icons-round text-xl">category</span>
            </span>
            <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Vector<span className="text-[var(--color-primary)]">Lab</span>
            </span>
          </Link>

          {/* Navegación desktop — enlaces en texto plano con chevrones */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  to === '/home' && isHome
                    ? 'text-[var(--color-primary)]'
                    : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setEditorOpen(true)}
              onMouseLeave={() => setEditorOpen(false)}
            >
              <span
                className={`text-sm font-medium transition-colors cursor-default ${
                  isEditor
                    ? 'text-[var(--color-primary)]'
                    : 'text-stone-700 dark:text-slate-300'
                }`}
              >
                Editor
              </span>
              {editorOpen && (
                <div className="absolute left-0 top-full mt-0 pt-2">
                  <div className="min-w-[140px] bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden py-1">
                    {editorLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          location.pathname === to
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                            : 'text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              Documentación
            </a>
            <div className="relative">
              <button
                type="button"
                onClick={() => setExploreOpen(!exploreOpen)}
                onBlur={() => setTimeout(() => setExploreOpen(false), 180)}
                className="text-sm font-medium text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-haspopup="true"
                aria-expanded={exploreOpen}
                aria-label="Explorar herramientas"
              >
                Explorar
              </button>
              {exploreOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 pt-2">
                  <div className="w-[420px] bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-2 gap-px bg-stone-100 dark:bg-slate-700">
                      <a
                        href={SQUOOSH_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700/80 transition-colors group/item"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-primary)]/30 text-[var(--color-primary)]">
                          <span className="material-icons-round text-2xl">image</span>
                        </span>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="font-semibold text-stone-900 dark:text-white block">Conversor a WebP</span>
                          <span className="text-xs text-stone-500 dark:text-slate-400">Squoosh</span>
                        </div>
                        <span className="material-icons-round text-stone-400 group-hover/item:text-[var(--color-primary)] transition-colors">arrow_forward</span>
                      </a>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 opacity-60 cursor-default">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-stone-200 dark:border-slate-600 text-stone-400">
                          <span className="material-icons-round text-2xl">add</span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-stone-500 dark:text-slate-500 block">Más pronto</span>
                          <span className="text-xs text-stone-400 dark:text-slate-500">Nuevas herramientas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* Derecha: tema + GitHub (con icono estrella) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 hover:text-[var(--color-primary)] transition-colors"
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? (
                <span className="material-icons-round text-lg">light_mode</span>
              ) : (
                <span className="material-icons-round text-lg">dark_mode</span>
              )}
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-9 px-5 rounded-full bg-[var(--color-primary)] text-white font-semibold text-sm shadow-sm hover:opacity-95 transition-opacity"
            >
              <span className="material-icons-round text-lg">star</span>
              GitHub
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-full bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300"
              aria-expanded={mobileOpen}
              aria-label="Abrir menú"
            >
              <span className="material-icons-round text-xl">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 pt-2 border-t border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-900/80">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  to === '/home' && isHome
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800'
                }`}
              >
                {label}
              </Link>
            ))}
            <span className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Editor
            </span>
            {editorLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800'
                }`}
              >
                {label}
              </Link>
            ))}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800">
              Documentación
            </a>
            <a href={SQUOOSH_URL} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800">
              Conversor a WebP (Squoosh)
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800">
              GitHub
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="mx-4 mt-2 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold text-sm text-center flex items-center justify-center gap-2">
              <span className="material-icons-round text-lg">star</span>
              Dar estrella en GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
