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
    // Handle OAuth callback from URL hash
    const handleOAuthCallback = async () => {
      console.log('Checking for OAuth callback...', window.location.hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      
      if (accessToken) {
        console.log('OAuth callback detected, processing tokens...', accessToken.substring(0, 20) + '...')
        
        // Store the tokens
        localStorage.setItem('token', accessToken)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        
        console.log('Tokens stored, waiting for auth state...')
        
        // Clear the hash
        window.location.hash = ''
        
        // Wait a bit for Supabase to process the auth state
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          window.location.href = '/dashboard'
        }, 1000)
        return
      }
    }

    // Check for OAuth callback first
    handleOAuthCallback()

    // Check for existing token and get user profile
    const token = localStorage.getItem('token')
    if (token && !window.location.hash.includes('access_token')) {
      getUserProfileFromToken()
    } else if (!window.location.hash.includes('access_token')) {
      setLoading(false)
    }

    // Listen for auth changes (for Google OAuth)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      if (session?.user) {
        // Get user profile from backend
        await getUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
        localStorage.removeItem('token')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const getUserProfileFromToken = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Getting user profile from token:', token ? token.substring(0, 20) + '...' : 'no token')
      
      // Handle dev mode token
      if (token === 'dev-token-123') {
        console.log('Dev token detected, setting dev user')
        setUser({
          id: 'dev-user-123',
          email: 'dev@eromify.com',
          fullName: 'Dev User',
          isDev: true
        })
        setLoading(false)
        return
      }
      
      console.log('Calling /auth/me endpoint...')
      const response = await api.get('/auth/me')
      console.log('Auth me response:', response.data)
      
      if (response.data.success) {
        console.log('Setting user:', response.data.user)
        setUser(response.data.user)
      } else {
        console.log('Auth failed, clearing token')
        setUser(null)
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Failed to get user profile from token:', error)
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const getUserProfile = async (supabaseUser) => {
    try {
      console.log('Getting user profile from Supabase user:', supabaseUser?.email)
      
      // Get the session token from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        console.log('Setting token from Supabase session')
        localStorage.setItem('token', session.access_token)
      }

      // Get user profile from backend
      console.log('Calling /auth/me from getUserProfile...')
      const response = await api.get('/auth/me')
      console.log('Auth me response from getUserProfile:', response.data)
      
      if (response.data.success) {
        console.log('Setting user from backend:', response.data.user)
        setUser(response.data.user)
      } else {
        console.log('Backend auth failed, using Supabase user')
        setUser(supabaseUser)
      }
    } catch (error) {
      console.error('Failed to get user profile:', error)
      console.log('Using Supabase user as fallback')
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
