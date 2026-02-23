import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Studio from './pages/Studio'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/editor" element={<Navigate to="/editor/iconos" replace />} />
        <Route path="/editor/iconos" element={<Studio />} />
        <Route path="/editor/logos" element={<Studio />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
