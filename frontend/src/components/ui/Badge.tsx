import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  removable?: boolean
  onRemove?: () => void
}

const variantStyles: Record<string, string> = {
  success: 'bg-[#D1FAE5] text-[#065F46]',
  error: 'bg-[#FEE2E2] text-[#991B1B]',
  warning: 'bg-[#FEF3C7] text-[#92400E]',
  info: 'bg-[#DBEAFE] text-[#1E40AF]',
  neutral: 'bg-[#F1F5F9] text-[#475569]',
}

export function Badge({
  children,
  variant = 'neutral',
  removable,
  onRemove,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm tracking-wide',
        variantStyles[variant]
      )}
    >
      {children}
      {removable && (
        <span
          className="material-symbols-outlined text-sm ml-1 cursor-pointer hover:opacity-80"
          onClick={onRemove}
        >
          close
        </span>
      )}
    </span>
  )
}
