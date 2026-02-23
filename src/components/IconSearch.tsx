import { useState, useEffect, useCallback } from 'react'

const ICONIFY_SEARCH = 'https://api.iconify.design/search'
const ICONIFY_ICON_DATA = 'https://api.iconify.design'
const DEBOUNCE_MS = 320
const LIMIT = 32

interface IconifySearchResult {
  icons: string[]
}

interface IconifyIconData {
  prefix: string
  width?: number
  height?: number
  icons: Record<string, { body: string }>
}

interface IconSearchProps {
  onSelect: (customSvg: string, iconifyId: string) => void
  currentColor?: string
}

export function IconSearch({ onSelect, currentColor = '#0c6bdc' }: IconSearchProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(
      `${ICONIFY_SEARCH}?query=${encodeURIComponent(debouncedQuery)}&limit=${LIMIT}`
    )
      .then((r) => r.json())
      .then((data: IconifySearchResult) => {
        if (cancelled) return
        setResults(data.icons ?? [])
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e.message || 'Error al buscar')
        setResults([])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const handleSelect = useCallback(
    async (iconId: string) => {
      const [prefix, name] = iconId.split(':')
      if (!prefix || !name) return
      try {
        const url = `${ICONIFY_ICON_DATA}/${prefix}.json?icons=${encodeURIComponent(name)}`
        const res = await fetch(url)
        const data: IconifyIconData = await res.json()
        const icon = data.icons?.[name]
        const w = data.width ?? 24
        const h = data.height ?? 24
        const body = icon?.body?.trim()
        if (!body) {
          setError('No se pudo cargar el icono')
          return
        }
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`
        onSelect(svg, iconId)
      } catch (e) {
        setError((e as Error).message || 'Error al cargar el icono')
      }
    },
    [onSelect]
  )

  const thumbnailUrl = (iconId: string) =>
    `${ICONIFY_ICON_DATA}/${iconId.replace(':', '/')}.svg?width=32&height=32&color=${encodeURIComponent(currentColor)}`

  return (
    <div className="icon-search">
      <label className="icon-search-label">
        <span>Buscar iconos</span>
        <input
          type="search"
          className="icon-search-input"
          placeholder="Ej: home, heart, star..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </label>
      {error && <p className="icon-search-error">{error}</p>}
      {loading && <p className="icon-search-loading">Buscando...</p>}
      {!loading && debouncedQuery && results.length === 0 && !error && (
        <p className="icon-search-empty">Sin resultados para &quot;{debouncedQuery}&quot;</p>
      )}
      <div className="icon-search-grid" role="list">
        {results.map((iconId) => (
          <button
            key={iconId}
            type="button"
            className="icon-search-item"
            onClick={() => handleSelect(iconId)}
            title={iconId}
            role="listitem"
          >
            <img
              src={thumbnailUrl(iconId)}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                el.nextElementSibling?.classList.add('icon-search-placeholder-visible')
              }}
            />
            <span className="icon-search-placeholder" aria-hidden>?</span>
          </button>
        ))}
      </div>
    </div>
  )
}
