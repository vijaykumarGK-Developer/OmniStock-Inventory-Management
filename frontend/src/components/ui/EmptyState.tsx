import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'inventory_2', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">{icon}</span>
      <h3 className="font-title-sm text-title-sm text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
