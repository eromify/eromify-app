import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eromify-backend.onrender.com/api' : 'http://localhost:3001/api')

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
      console.log('401 error on path:', currentPath, 'Error:', error.response?.data)
      
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        console.warn('Authentication error - token may be invalid')
        // Don't auto-redirect in development mode, just log the error
        console.log('Would redirect to login in production mode')
        // localStorage.removeItem('token')
        // delete api.defaults.headers.common['Authorization']
        // window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api


