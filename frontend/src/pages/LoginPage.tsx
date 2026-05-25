import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Toggle } from '../components/ui/Toggle'

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('admin@omni.com')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try { await login(email, password) } catch { /* error shown via context */ }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-violet-600 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10vw] left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-indigo-500 blur-[100px] mix-blend-screen opacity-30" />
      <div className="absolute bottom-[-10vw] right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-teal-400 blur-[100px] mix-blend-screen opacity-30" />
      <div className="absolute top-[50%] right-[5vw] w-[30vw] h-[30vw] rounded-full bg-violet-500 blur-[100px] mix-blend-screen opacity-20" />

      <div className="max-w-[420px] w-full glass-panel p-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-white">inventory_2</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white leading-none">StockPro</h1>
            <p className="text-teal-300 font-label-uppercase text-label-uppercase tracking-wider mt-1">Enterprise Logistics</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 material-symbols-outlined text-lg pointer-events-none">mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 font-body-md text-body-md text-white placeholder:text-white/40 outline-none focus:border-white/50 transition-colors"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 material-symbols-outlined text-lg pointer-events-none">lock</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-12 font-body-md text-body-md text-white placeholder:text-white/40 outline-none focus:border-white/50 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
            >
              <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Toggle checked={remember} onChange={setRemember} label="Remember this device" />
            <button type="button" className="text-teal-300 hover:text-white text-sm transition-colors">Forgot password?</button>
          </div>

          {error && <p className="text-red-400 text-sm font-body-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl py-3.5 font-title-sm shadow-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center gap-4 my-2">
            <hr className="flex-1 border-white/10" />
            <span className="text-white/50 text-sm">OR</span>
            <hr className="flex-1 border-white/10" />
          </div>

          <button
            type="button"
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 font-title-sm text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-white/60 text-sm mt-2">
            Don&apos;t have an account? <button type="button" className="text-teal-300 hover:text-white transition-colors">Sign up</button>
          </p>
        </form>
      </div>
    </div>
  )
}
