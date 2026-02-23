import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Studio from './pages/Studio'
import SvgConverter from './pages/SvgConverter'
import Documentation from './pages/Documentation'

// Basename para GitHub Pages: en producción la app está en /VectorLab/, en dev en /
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

const PAGE_TITLES: Record<string, string> = {
  '/home': 'VectorLab — Iconos y logos en código abierto',
  '/editor/iconos': 'Editor de iconos — VectorLab',
  '/editor/logos': 'Editor de logos — VectorLab',
  '/svg-converter': 'Conversor a SVG — VectorLab',
  '/documentation': 'Documentación — VectorLab',
}

function PageTitle() {
  const location = useLocation()
  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] ?? 'VectorLab'
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <PageTitle />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/editor" element={<Navigate to="/editor/iconos" replace />} />
        <Route path="/editor/iconos" element={<Studio />} />
        <Route path="/editor/logos" element={<Studio />} />
        <Route path="/svg-converter" element={<SvgConverter />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
