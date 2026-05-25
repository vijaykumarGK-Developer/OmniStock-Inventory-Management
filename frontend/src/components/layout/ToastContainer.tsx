import { useNotification } from '../../context/NotificationContext'
import { Toast } from '../ui/Toast'

export function ToastContainer() {
  const { notifications, dismissNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {notifications.map((n) => (
        <Toast
          key={n.id}
          type={n.type}
          message={n.message}
          description={n.description}
          duration={n.duration}
          onDismiss={() => dismissNotification(n.id)}
        />
      ))}
    </div>
  )
}
