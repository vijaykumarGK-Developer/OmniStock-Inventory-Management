import api from './api'
import type { User } from '../../shared/types'

export function getAllUsers(): Promise<User[]> {
  return api.get('/auth/users').then((r) => r.data.data)
}
