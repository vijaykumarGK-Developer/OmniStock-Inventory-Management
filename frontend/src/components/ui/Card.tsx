import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  variant?: 'default' | 'stat'
  icon?: string
  accentColor?: 'primary' | 'secondary' | 'tertiary' | 'none'
  className?: string
  action?: ReactNode
}

const accentBorder: Record<string, string> = {
  primary: 'border-t-primary-container',
  secondary: 'border-t-secondary-container',
  tertiary: 'border-t-tertiary-container',
  none: '',
}

const accentOrb: Record<string, string> = {
  primary: 'bg-primary-container/10',
  secondary: 'bg-secondary-container/10',
  tertiary: 'bg-tertiary-container/10',
  none: '',
}

export function Card({
  title,
  subtitle,
  children,
  variant = 'default',
  icon,
  accentColor = 'none',
  className,
  action,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm relative overflow-hidden',
        variant === 'stat' && accentColor !== 'none' && `border-t-2 ${accentBorder[accentColor]}`,
        className
      )}
    >
      {variant === 'stat' && accentColor !== 'none' && (
        <div
          className={cn(
            'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-0',
            accentOrb[accentColor]
          )}
        />
      )}
      {(title || subtitle || icon || action) && (
        <div className={cn('flex items-start gap-4', children ? 'border-b border-surface-variant/50 pb-4 mb-4' : '')}>
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary-container text-2xl">
                {icon}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && <h3 className="font-title-md text-title-md text-on-surface truncate">{title}</h3>}
            {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
