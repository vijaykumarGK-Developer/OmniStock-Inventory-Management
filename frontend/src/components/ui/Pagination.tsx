import { cn } from '../../utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  if (current > 3) pages.push('ellipsis')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('ellipsis')
  pages.push(total)
  return pages
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-body-sm text-body-sm text-on-surface-variant">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            page <= 1
              ? 'opacity-30 cursor-not-allowed text-on-surface-variant'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          )}
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        {getPageNumbers(page, totalPages).map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-on-surface-variant font-body-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-10 h-10 rounded-xl font-body-sm text-body-sm transition-colors',
                p === page
                  ? 'bg-primary-container text-primary-fixed'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            page >= totalPages
              ? 'opacity-30 cursor-not-allowed text-on-surface-variant'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          )}
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  )
}
