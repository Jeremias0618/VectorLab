const GITHUB_URL = 'https://github.com/Jeremias0618'
const LINKTREE_URL = 'https://linktr.ee/yeremitantaraico'
const LINKEDIN_URL = 'https://www.linkedin.com/in/yeremitantaraico/'
const GDEV_URL = 'https://g.dev/yeremitantaraico'
const EMAIL = 'mailto:yeremitantaraico@gmail.com'

const linkClass =
  'w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:text-[var(--color-primary)] transition-colors text-slate-600 dark:text-slate-400'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-12 lg:py-20 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="material-icons-round text-[var(--color-primary)]">category</span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                VectorLab
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
              Hecho con pasión por la comunidad de código abierto.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              className={linkClass}
              href={EMAIL}
              aria-label="Correo"
              title="Correo"
            >
              <span className="material-icons-round text-xl">email</span>
            </a>
            <a
              className={linkClass}
              href={LINKTREE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Linktree"
              title="Linktree"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d="M7.953 0C3.578 0 0 3.578 0 7.953v8.094C0 20.422 3.578 24 7.953 24h8.094C20.422 24 24 20.422 24 16.047V7.953C24 3.578 20.422 0 16.047 0H7.953zm.422 4.687a.47.47 0 0 1 .469-.469h2.344a.47.47 0 0 1 .469.469v14.625a.47.47 0 0 1-.469.469H8.844a.47.47 0 0 1-.469-.469V4.687zm6.75 0a.47.47 0 0 1 .469-.469h2.344a.47.47 0 0 1 .469.469v14.625a.47.47 0 0 1-.469.469h-2.344a.47.47 0 0 1-.469-.469V4.687z" />
              </svg>
            </a>
            <a
              className={linkClass}
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              className={linkClass}
              href={GDEV_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Google Developer"
              title="Google Developer"
            >
              <span className="material-icons-round text-xl">code</span>
            </a>
            <a
              className={linkClass}
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-400 gap-4">
          <div className="flex gap-6">
            <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Política de privacidad
            </a>
            <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Términos de servicio
            </a>
            <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Política de cookies
            </a>
          </div>
          <p>© {year} VectorLab · Cybercode Labs</p>
        </div>
      </div>
    </footer>
  )
}
