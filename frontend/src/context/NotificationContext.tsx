import { createContext, useContext, useCallback, useReducer, type ReactNode } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
}

type Action = 
  | { type: 'ADD'; payload: Notification }
  | { type: 'DISMISS'; payload: string }
  | { type: 'CLEAR' }

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (type: Notification['type'], message: string, description?: string, duration?: number) => void
  dismissNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

function reducer(state: Notification[], action: Action): Notification[] {
  switch (action.type) {
    case 'ADD': return [...state, action.payload]
    case 'DISMISS': return state.filter((n) => n.id !== action.payload)
    case 'CLEAR': return []
    default: return state
  }
}

let nextId = 1

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, dispatch] = useReducer(reducer, [])

  const addNotification = useCallback((type: Notification['type'], message: string, description?: string, duration = 5000) => {
    const id = `n-${nextId++}`
    dispatch({ type: 'ADD', payload: { id, type, message, description, duration } })
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'DISMISS', payload: id }), duration)
    }
  }, [])

  const dismissNotification = useCallback((id: string) => dispatch({ type: 'DISMISS', payload: id }), [])
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
