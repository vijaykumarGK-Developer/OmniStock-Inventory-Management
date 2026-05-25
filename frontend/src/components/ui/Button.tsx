import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-danger' | 'ghost' | 'ghost-danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-container text-primary-fixed hover:bg-inverse-primary hover:text-surface shadow-sm',
  secondary: 'bg-secondary-container text-white hover:opacity-90',
  'outline-primary': 'border-2 border-primary-container text-primary-container hover:bg-primary-container hover:text-primary-fixed',
  'outline-danger': 'border-2 border-error text-error hover:bg-error hover:text-white',
  ghost: 'border border-surface-variant text-on-surface hover:bg-surface-container-high shadow-sm',
  'ghost-danger': 'border border-surface-variant text-error hover:bg-error-container/10',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'rounded-xl font-title-sm flex items-center gap-2 transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
      {children}
    </button>
  )
}
