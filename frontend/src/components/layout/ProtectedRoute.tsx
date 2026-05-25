import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-7xl text-on-surface-variant/30 mb-6">block</span>
        <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">403 — Forbidden</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-primary-container text-primary-fixed rounded-xl px-6 py-3 font-title-sm hover:bg-inverse-primary transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  return <>{children}</>
}
