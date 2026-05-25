import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { SearchInput } from '../ui/SearchInput'

export function Topbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addNotification } = useNotification()

  return (
    <header className="h-16 sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center px-gutter gap-4">
      <div className="w-full max-w-md">
        <SearchInput value="" onChange={() => {}} placeholder="Search across system..." />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors relative"
          onClick={() => addNotification('info', 'No new notifications')}
        >
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(107,216,203,0.8)]" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
          onClick={() => navigate('/settings')}
        >
          <span className="material-symbols-outlined text-on-surface-variant">settings</span>
        </button>
        <button
          className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm text-label-sm text-on-surface cursor-pointer hover:bg-surface-container-highest transition-colors"
          onClick={() => navigate('/settings')}
          title={user?.name ?? 'User'}
        >
          {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </button>
      </div>
    </header>
  )
}
