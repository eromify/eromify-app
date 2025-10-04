import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and if this is a real authentication error (not mock mode)
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register') {
        console.warn('Authentication error - token may be invalid')
        // Don't auto-redirect in development mode
        if (import.meta.env.PROD) {
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api


