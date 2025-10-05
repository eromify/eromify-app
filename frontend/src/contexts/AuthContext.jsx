import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import api from '../utils/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simplified auth check - just check for existing token
    const token = localStorage.getItem('token')
    if (token) {
      getUserProfileFromToken()
    } else {
      setLoading(false)
    }
  }, [])

  const getUserProfileFromToken = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('getUserProfileFromToken called with token:', token ? token.substring(0, 20) + '...' : 'no token')
      
      // Handle dev mode token
      if (token === 'dev-token-123') {
        console.log('Using dev token, setting dev user')
        setUser({
          id: 'dev-user-123',
          email: 'dev@eromify.com',
          fullName: 'Dev User',
          isDev: true
        })
        setLoading(false)
        return
      }
      
      console.log('Calling /auth/me with token...')
      const response = await api.get('/auth/me')
      console.log('Auth me response:', response.data)
      
      if (response.data.success) {
        console.log('Setting user from response:', response.data.user)
        setUser(response.data.user)
      } else {
        console.log('Auth failed, clearing user and token')
        setUser(null)
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Failed to get user profile from token:', error)
      console.error('Error details:', error.response?.data)
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const getUserProfile = async (supabaseUser) => {
    try {
      // Get the session token from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token)
      }

      // Get user profile from backend
      const response = await api.get('/auth/me')
      if (response.data.success) {
        setUser(response.data.user)
      } else {
        setUser(supabaseUser)
      }
    } catch (error) {
      console.error('Failed to get user profile:', error)
      setUser(supabaseUser)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName
      })
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Registration failed' }
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
      }
      
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Backend logout failed:', error)
    }
    
    const { error } = await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('token')
    return { error }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Backend logout failed:', error)
    }
    
    const { error } = await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('token')
    return { error }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}