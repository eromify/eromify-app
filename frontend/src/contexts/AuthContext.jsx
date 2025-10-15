import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import api from '../utils/api'
import { trackLead } from '../utils/metaPixel'

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
  const navigate = useNavigate()

  useEffect(() => {
    // Check for OAuth callback first
    const handleOAuthCallback = async () => {
      const hash = window.location.hash
      const search = window.location.search
      
      // Check both hash and query parameters for OAuth tokens
      if ((hash && hash.includes('access_token')) || (search && search.includes('access_token'))) {
        console.log('OAuth callback detected on app load:', { hash, search })
        
        try {
          // Extract token from hash or query parameters
          const params = new URLSearchParams(hash ? hash.substring(1) : search.substring(1))
          const accessToken = params.get('access_token')
          
          if (accessToken) {
            console.log('Processing OAuth token from main page...')
            
            try {
              // Call backend to convert Supabase token to JWT
              const response = await api.post('/auth/google-callback', {
                access_token: accessToken
              })
              
              if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                setUser(response.data.user)
                console.log('OAuth success, user set:', response.data.user)
                
                // Track Lead event for Google OAuth registration
                trackLead({
                  email: response.data.user.email,
                  fullName: response.data.user.fullName || response.data.user.email?.split('@')[0],
                  source: 'google'
                })
                
                // Clear the hash from URL and redirect to onboarding
                window.history.replaceState({}, document.title, '/')
                navigate('/onboarding', { replace: true })
                return
              }
            } catch (error) {
              console.error('OAuth backend failed, trying fallback:', error)
              
              // Fallback: decode token and create user
              try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]))
                const mockUser = {
                  email: payload.email,
                  fullName: payload.user_metadata?.full_name || payload.email?.split('@')[0] || 'Google User'
                }
                
                const jwtResponse = await api.post('/auth/register', {
                  email: mockUser.email,
                  password: 'google_oauth_user_' + Date.now(),
                  fullName: mockUser.fullName
                })
                
                if (jwtResponse.data.success) {
                  localStorage.setItem('token', jwtResponse.data.token)
                  setUser(jwtResponse.data.user)
                  console.log('OAuth fallback success, user set:', jwtResponse.data.user)
                  
                  // Track Lead event for Google OAuth fallback registration
                  trackLead({
                    email: mockUser.email,
                    fullName: mockUser.fullName,
                    source: 'google_fallback'
                  })
                  
                  // Clear the hash from URL and redirect to onboarding
                  window.history.replaceState({}, document.title, '/')
                  navigate('/onboarding', { replace: true })
                  return
                }
              } catch (fallbackError) {
                console.error('OAuth fallback failed:', fallbackError)
              }
            }
          }
          
          // Clear the hash from URL even if processing failed
          window.history.replaceState({}, document.title, '/')
        } catch (error) {
          console.error('OAuth callback handling error:', error)
          window.history.replaceState({}, document.title, '/')
        }
      }
    }
    
    // Handle OAuth callback first
    handleOAuthCallback().then(() => {
      // Then check for existing token
      const token = localStorage.getItem('token')
      
      if (token) {
        getUserProfileFromToken()
      } else {
        setLoading(false)
      }
    })
  }, [])


  const getUserProfileFromToken = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('getUserProfileFromToken called with token:', token ? token.substring(0, 20) + '...' : 'no token')
      
      if (!token) {
        console.log('No token found, setting loading to false')
        setLoading(false)
        return
      }
      
      // Dev token bypass removed for security
      
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
      console.error('Error status:', error.response?.status)
      
      // Only clear token if it's actually invalid (401)
      if (error.response?.status === 401) {
        console.log('Token is invalid, clearing it')
        setUser(null)
        localStorage.removeItem('token')
      } else {
        console.log('Network error, keeping token but clearing user')
        setUser(null)
      }
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
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        console.log('User set in AuthContext after registration:', response.data.user)
      }
      
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
    try {
      // Use the correct OAuth callback URL for production
      const redirectUrl = 'https://www.eromify.com/'
      
      console.log('Starting Google OAuth with redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true
        }
      })
      
      if (data?.url) {
        console.log('Redirecting to:', data.url)
        window.location.href = data.url
        return { data, error: null }
      }
      
      if (error) {
        console.error('Google OAuth error:', error)
        return { data: null, error }
      }
      
      console.log('Google OAuth initiated, data:', data);
      return { data, error: null }
    } catch (error) {
      console.error('Google OAuth catch error:', error)
      return { data: null, error }
    }
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