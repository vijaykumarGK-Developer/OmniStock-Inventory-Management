import { cn } from '../../utils/cn'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
}

const iconMap: Record<string, string> = {
  danger: 'error',
  warning: 'warning',
  info: 'info',
}

const iconColor: Record<string, string> = {
  danger: 'text-error',
  warning: 'text-tertiary',
  info: 'text-primary',
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{cancelLabel}</Button>
          <Button variant={variant === 'danger' ? 'outline-danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <span className={cn('material-symbols-outlined text-4xl', iconColor[variant])}>{iconMap[variant]}</span>
        <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
      </div>
    </Modal>
  )
}
