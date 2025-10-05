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
    // Check for existing token or handle OAuth callback
    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search)
    const hash = window.location.hash
    
    // Handle OAuth callback from URL hash
    if (hash && hash.includes('access_token')) {
      handleOAuthCallback()
    } else if (token) {
      getUserProfileFromToken()
    } else {
      setLoading(false)
    }
  }, [])

  const handleOAuthCallback = async () => {
    try {
      console.log('Handling OAuth callback...')
      const hash = window.location.hash
      console.log('URL hash:', hash)
      
      if (hash) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const error = params.get('error')
        
        if (error) {
          console.error('OAuth error in URL:', error)
          const errorDescription = params.get('error_description')
          console.error('OAuth error description:', errorDescription)
          setLoading(false)
          return
        }
        
        if (accessToken) {
          console.log('Found access token in URL hash:', accessToken.substring(0, 50) + '...')
          try {
            // Call backend to convert Supabase token to JWT
            console.log('Calling backend /auth/google-callback...')
            const response = await api.post('/auth/google-callback', {
              access_token: accessToken
            })
            
            console.log('Backend OAuth response:', response.data)
            
            if (response.data.success) {
              console.log('Successfully converted to JWT token')
              localStorage.setItem('token', response.data.token)
              setUser(response.data.user)
              
              // Clear URL hash
              window.history.replaceState({}, document.title, window.location.pathname)
              
              // Redirect to dashboard
              console.log('Redirecting to dashboard...')
              window.location.href = '/dashboard'
              return
            } else {
              console.error('Backend returned success: false', response.data)
            }
          } catch (callbackError) {
            console.error('Backend OAuth callback failed:', callbackError)
            console.error('Error response:', callbackError.response?.data)
            
            // If backend fails, try to decode the Supabase token directly
            try {
              console.log('Backend failed, trying to decode Supabase token directly...')
              // Decode the JWT token to get user info
              const payload = JSON.parse(atob(accessToken.split('.')[1]))
              console.log('Decoded token payload:', payload)
              
              // Create a mock user from the token
              const mockUser = {
                id: payload.sub,
                email: payload.email,
                fullName: payload.user_metadata?.full_name || payload.email?.split('@')[0] || 'Google User',
                avatar: payload.user_metadata?.avatar_url || null,
                emailConfirmed: true
              }
              
              console.log('Created mock user from token:', mockUser)
              
              // Generate a JWT token for our API
              const jwtResponse = await api.post('/auth/register', {
                email: mockUser.email,
                password: 'google_oauth_user_' + Date.now(),
                fullName: mockUser.fullName
              })
              
              if (jwtResponse.data.success) {
                console.log('Successfully created user and got JWT token')
                localStorage.setItem('token', jwtResponse.data.token)
                setUser(jwtResponse.data.user)
                
                // Clear URL hash
                window.history.replaceState({}, document.title, window.location.pathname)
                
                // Redirect to dashboard
                window.location.href = '/dashboard'
                return
              }
            } catch (decodeError) {
              console.error('Failed to decode token or create user:', decodeError)
            }
          }
        }
      }
      
      // If we get here, OAuth failed or no token found
      console.log('OAuth callback failed or no token found')
    } catch (error) {
      console.error('OAuth callback error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserProfileFromToken = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('getUserProfileFromToken called with token:', token ? token.substring(0, 20) + '...' : 'no token')
      
      if (!token) {
        console.log('No token found, setting loading to false')
        setLoading(false)
        return
      }
      
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
      // Force redirect to localhost for development
      const redirectUrl = window.location.hostname === 'localhost' 
        ? `${window.location.origin}/` 
        : `${window.location.origin}/`;
        
      console.log('Starting Google OAuth with redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        console.error('Google OAuth error:', error)
        return { data: null, error }
      }
      
      console.log('Google OAuth initiated, data:', data);
      // OAuth redirect will happen automatically
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