import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@supabase/supabase-js'
import api from '../utils/api'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),

      login: async (email, password) => {
        try {
          set({ loading: true })
          
          const response = await api.post('/auth/login', { email, password })
          
          if (response.data.success) {
            const { token, user } = response.data
            
            // Set token in localStorage and axios defaults
            localStorage.setItem('token', token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            set({ user, token, loading: false })
            return { success: true, user }
          }
          
          throw new Error(response.data.error || 'Login failed')
        } catch (error) {
          set({ loading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || error.message 
          }
        }
      },

      register: async (email, password, fullName) => {
        try {
          set({ loading: true })
          
          const response = await api.post('/auth/register', { 
            email, 
            password, 
            fullName 
          })
          
          if (response.data.success) {
            set({ loading: false })
            return { success: true, message: response.data.message }
          }
          
          throw new Error(response.data.error || 'Registration failed')
        } catch (error) {
          set({ loading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || error.message 
          }
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          // Clear local state
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          set({ user: null, token: null, loading: false })
        }
      },

      checkAuth: async () => {
        try {
          set({ loading: true })
          
          const token = localStorage.getItem('token')
          if (!token) {
            set({ loading: false })
            return
          }

          // Set token in axios defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Verify token with backend
          const response = await api.get('/auth/me')
          
          if (response.data.success) {
            set({ user: response.data.user, token, loading: false })
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
            set({ user: null, token: null, loading: false })
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          set({ user: null, token: null, loading: false })
        }
      },

      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/users/profile', profileData)
          
          if (response.data.success) {
            set({ user: { ...get().user, ...response.data.user } })
            return { success: true, user: response.data.user }
          }
          
          throw new Error(response.data.error || 'Update failed')
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.error || error.message 
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
)



