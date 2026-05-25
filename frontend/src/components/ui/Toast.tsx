import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  onDismiss: () => void
  duration?: number
}

const iconMap: Record<string, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const colorMap: Record<string, string> = {
  success: 'text-secondary',
  error: 'text-error',
  warning: 'text-tertiary',
  info: 'text-primary',
}

export function Toast({ type, message, description, onDismiss, duration = 5000 }: ToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        onDismiss()
      }
    }, 50)
    return () => clearInterval(timer)
  }, [duration, onDismiss])

  return (
    <div className="fixed top-4 right-4 z-[100] w-80 animate-slide-right">
      <div className="bg-surface border border-surface-variant shadow-soft rounded-xl p-4 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <span className={cn('material-symbols-outlined', colorMap[type])}>{iconMap[type]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-body-md text-body-md text-on-surface">{message}</p>
            {description && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-container-high shrink-0"
          >
            <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-100 ease-linear', colorMap[type])}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
