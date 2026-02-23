import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

const DROPDOWN_CLOSE_DELAY_MS = 320

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
  const editorCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exploreCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHome = location.pathname === '/home' || location.pathname === '/'
  const isEditor = location.pathname.startsWith('/editor')

  const clearEditorTimer = () => {
    if (editorCloseTimerRef.current) {
      clearTimeout(editorCloseTimerRef.current)
      editorCloseTimerRef.current = null
    }
  }
  const clearExploreTimer = () => {
    if (exploreCloseTimerRef.current) {
      clearTimeout(exploreCloseTimerRef.current)
      exploreCloseTimerRef.current = null
    }
  }
  const scheduleEditorClose = () => {
    editorCloseTimerRef.current = setTimeout(() => setEditorOpen(false), DROPDOWN_CLOSE_DELAY_MS)
  }
  const scheduleExploreClose = () => {
    exploreCloseTimerRef.current = setTimeout(() => setExploreOpen(false), DROPDOWN_CLOSE_DELAY_MS)
  }

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
              onMouseEnter={() => {
                clearEditorTimer()
                setEditorOpen(true)
              }}
              onMouseLeave={scheduleEditorClose}
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
                <div
                  className="nav-tooltip absolute left-0 top-full -mt-2 pt-3"
                  onMouseEnter={() => {
                    clearEditorTimer()
                    setEditorOpen(true)
                  }}
                  onMouseLeave={scheduleEditorClose}
                >
                  <div className="nav-tooltip-panel">
                    {editorLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`nav-tooltip-item ${location.pathname === to ? 'is-active' : ''}`}
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
            <div
              className="relative"
              onMouseEnter={() => {
                clearExploreTimer()
                setExploreOpen(true)
              }}
              onMouseLeave={scheduleExploreClose}
            >
              <span className="text-sm font-medium text-stone-700 dark:text-slate-300 cursor-default transition-colors">
                Explorar
              </span>
              {exploreOpen && (
                <div
                  className="nav-tooltip absolute left-0 top-full -mt-2 pt-3"
                  onMouseEnter={() => {
                    clearExploreTimer()
                    setExploreOpen(true)
                  }}
                  onMouseLeave={scheduleExploreClose}
                >
                  <div className="nav-tooltip-panel">
                    <a
                      href={SQUOOSH_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="nav-tooltip-item"
                    >
                      Conversor a WebP
                    </a>
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
