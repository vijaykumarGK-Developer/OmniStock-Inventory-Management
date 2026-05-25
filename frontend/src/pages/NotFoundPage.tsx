import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-7xl text-on-surface-variant/30 mb-6">error_outline</span>
      <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">404 — Page Not Found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="bg-primary-container text-primary-fixed rounded-xl px-6 py-3 font-title-sm hover:bg-inverse-primary transition-colors">
        Back to Dashboard
      </Link>
    </div>
  )
}
