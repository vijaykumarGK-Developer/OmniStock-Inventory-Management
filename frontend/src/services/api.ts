import axios from 'axios'

let onError: ((msg: string) => void) | null = null

export function setApiErrorHandler(handler: (msg: string) => void) {
  onError = handler
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status !== 404 && onError) {
      const msg = error.response?.data?.error || error.message || 'An error occurred'
      onError(msg)
    }
    return Promise.reject(error)
  }
)

export default api
