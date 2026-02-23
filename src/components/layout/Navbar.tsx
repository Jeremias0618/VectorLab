import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

const DROPDOWN_CLOSE_DELAY_MS = 320

const REPO_URL = 'https://github.com/Jeremias0618/VectorLab'
const SQUOOSH_URL = 'https://squoosh.app/'

const profileLinks = [
  { href: 'mailto:yeremitantaraico@gmail.com', label: 'Correo', icon: 'mdi-email-outline' as const },
  { href: 'https://www.linkedin.com/in/yeremitantaraico/', label: 'LinkedIn', icon: 'mdi-linkedin' as const },
  { href: 'https://g.dev/yeremitantaraico', label: 'Google Developer', icon: 'mdi-google' as const },
  { href: REPO_URL, label: 'GitHub', icon: 'mdi-github' as const },
  { href: 'https://www.credly.com/users/yeremitantaraico', label: 'Credly', icon: 'mdi-certificate-outline' as const },
  { href: 'https://www.youtube.com/@yeremitantaraico', label: 'YouTube', icon: 'mdi-youtube' as const },
] as const

const navLinks = [{ to: '/home', label: 'Inicio' }] as const

const editorLinks = [
  { to: '/editor/iconos', label: 'Iconos' },
  { to: '/editor/logos', label: 'Logos' },
] as const

const exploreLinks = [
  { to: '/svg-converter', label: 'Conversor a SVG', internal: true },
  { href: SQUOOSH_URL, label: 'Conversor a WebP', internal: false },
] as const

export default function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const editorCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exploreCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const profileCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const isHome = location.pathname === '/home' || location.pathname === '/'
  const isEditor = location.pathname.startsWith('/editor')
  const isExplore = location.pathname === '/svg-converter' || location.pathname.endsWith('/svg-converter')

  const clearProfileTimer = () => {
    if (profileCloseTimerRef.current) {
      clearTimeout(profileCloseTimerRef.current)
      profileCloseTimerRef.current = null
    }
  }
  const handleProfileLeave = (e: React.MouseEvent) => {
    const target = e.relatedTarget
    if (target instanceof Node && profileDropdownRef.current?.contains(target)) return
    profileCloseTimerRef.current = setTimeout(() => setProfileOpen(false), DROPDOWN_CLOSE_DELAY_MS)
  }
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
            <Link
              to="/documentation"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/documentation'
                  ? 'text-[var(--color-primary)]'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Documentación
            </Link>
            <div
              className="relative"
              onMouseEnter={() => { clearExploreTimer(); setExploreOpen(true) }}
              onMouseLeave={scheduleExploreClose}
            >
              <span
                className={`text-sm font-medium cursor-default transition-colors ${
                  isExplore ? 'text-[var(--color-primary)]' : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
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
                    {exploreLinks.map((item) =>
                      item.internal ? (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`nav-tooltip-item ${location.pathname === item.to ? 'is-active' : ''}`}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="nav-tooltip-item"
                        >
                          {item.label}
                        </a>
                      )
                    )}
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

          {/* Derecha: tema + Perfil (desktop) o solo tema (móvil) */}
          <div className="flex items-center gap-1 pl-4 ml-2 border-l border-stone-200 dark:border-slate-700">
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-stone-500 dark:text-slate-400 hover:text-[var(--color-primary)] hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? (
                <span className="material-icons-round text-xl">light_mode</span>
              ) : (
                <span className="material-icons-round text-xl">dark_mode</span>
              )}
            </button>
            <div
              className="hidden md:block relative"
              onMouseEnter={() => { clearProfileTimer(); setProfileOpen(true) }}
              onMouseLeave={handleProfileLeave}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm shadow-sm hover:opacity-95 transition-opacity"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Perfil y enlaces"
              >
                <span className="material-icons-round text-lg">person</span>
                Perfil
              </button>
              {profileOpen && (
                <div
                  ref={profileDropdownRef}
                  className="nav-tooltip absolute right-0 top-full pt-1"
                  onMouseEnter={() => { clearProfileTimer(); setProfileOpen(true) }}
                  onMouseLeave={handleProfileLeave}
                >
                  <div className="nav-profile-panel">
                    {profileLinks.map(({ href, label, icon }) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                        className="nav-profile-item"
                      >
                        <span className={`mdi ${icon} nav-profile-icon`} aria-hidden />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
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
            <Link
              to="/documentation"
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/documentation'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800'
              }`}
            >
              Documentación
            </Link>
            <Link to="/svg-converter" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800">
              Conversor a SVG
            </Link>
            <a href={SQUOOSH_URL} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800">
              Conversor a WebP (Squoosh)
            </a>
            <span className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Perfil
            </span>
            {profileLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800 flex items-center gap-3"
              >
                <span className={`mdi ${icon} text-xl text-slate-500 dark:text-slate-400`} aria-hidden />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
