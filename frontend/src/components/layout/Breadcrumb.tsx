import { useLocation, Link } from 'react-router-dom'

export function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1 px-gutter pt-4 pb-2">
      <Link to="/" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
        Home
      </Link>
      {segments.map((seg, i) => {
        const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
        const href = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1
        return (
          <span key={href} className="flex items-center gap-1">
            <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">chevron_right</span>
            {isLast ? (
              <span className="font-body-sm text-body-sm text-on-surface font-medium">{label}</span>
            ) : (
              <Link to={href} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
