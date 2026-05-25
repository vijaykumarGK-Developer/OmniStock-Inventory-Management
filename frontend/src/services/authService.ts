import api from './api'
import type { User, AuthResponse } from '../../shared/types'

export function login(email: string, password: string): Promise<AuthResponse> {
  return api.post('/auth/login', { email, password }).then((r) => r.data.data)
}

export function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  return api.post('/auth/signup', { name, email, password }).then((r) => r.data.data)
}

export function getMe(): Promise<User> {
  return api.get('/auth/me').then((r) => r.data.data as User)
}
