import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
  /** Clase opcional para el contenedor principal (ej. para fondo o padding global) */
  className?: string
}

const VISITOR_BADGE_URL = 'https://visitor-badge.laobi.icu/badge?page_id=Jeremias0618.VectorLab'

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div
      className={`min-h-screen flex flex-col scroll-smooth bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-stone-900 dark:text-slate-100 transition-colors duration-300 font-display ${className}`}
    >
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {/* Contador de visitas: invisible pero se carga para sumar la visita (solo visible en README) */}
      <img
        src={VISITOR_BADGE_URL}
        alt=""
        aria-hidden
        style={{ height: 0, width: 0, position: 'absolute' }}
      />
    </div>
  )
}
