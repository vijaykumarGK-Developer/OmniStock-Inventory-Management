import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as authLogin, signup as authSignup, getMe } from '../services/authService'
import type { User } from '../../shared/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      getMe()
        .then((u) => setUser(u))
        .catch(() => { localStorage.removeItem('token'); setToken(null) })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const res = await authLogin(email, password)
      localStorage.setItem('token', res.token)
      setToken(res.token)
      setUser(res.user)
      navigate('/dashboard')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Login failed'
      setError(msg)
      throw e
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setError(null)
    try {
      const res = await authSignup(name, email, password)
      localStorage.setItem('token', res.token)
      setToken(res.token)
      setUser(res.user)
      navigate('/dashboard')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Signup failed'
      setError(msg)
      throw e
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, error, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
