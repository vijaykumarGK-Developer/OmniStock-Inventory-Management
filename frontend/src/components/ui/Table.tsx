import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface TableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  render?: (item: T) => ReactNode
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: string
  rowClassName?: (item: T) => string | undefined
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="h-[56px]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 shimmer rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  loading,
  emptyMessage = 'No data found',
  emptyIcon = 'inventory_2',
  rowClassName,
}: TableProps<T>) {
  return (
    <div className="bg-surface-container-low border border-surface-variant rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-dim">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 font-label-uppercase text-label-uppercase text-on-surface-variant',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.sortable && 'cursor-pointer hover:text-on-surface select-none'
                )}
                onClick={() => {
                  if (col.sortable && onSort) {
                    const dir = sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc'
                    onSort(col.key, dir)
                  }
                }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-sm">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">{emptyIcon}</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  'h-[56px] border-b border-surface-variant/30 hover:bg-surface-container/50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  rowClassName?.(item)
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 font-body-sm text-body-sm text-on-surface',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center'
                    )}
                  >
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
