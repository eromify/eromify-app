import { useEffect } from 'react'
import api from '../utils/api'

const OAuthCallbackHandler = () => {
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuthCallbackHandler: Processing OAuth callback')
        
        // Check if we have a token from production domain
        const oauthToken = localStorage.getItem('oauth_token')
        const oauthSource = localStorage.getItem('oauth_source')
        
        if (oauthToken && oauthSource === 'production') {
          console.log('OAuthCallbackHandler: Processing token from production domain')
          
          // Clear the temporary storage
          localStorage.removeItem('oauth_token')
          localStorage.removeItem('oauth_source')
          
          try {
            // Try to call backend to convert Supabase token to JWT
            console.log('OAuthCallbackHandler: Calling backend /auth/google-callback...')
            const response = await api.post('/auth/google-callback', {
              access_token: oauthToken
            })
            
            console.log('OAuthCallbackHandler: Backend response:', response.data)
            
            if (response.data.success) {
              console.log('OAuthCallbackHandler: Successfully converted to JWT token')
              localStorage.setItem('token', response.data.token)
              
              // Redirect to dashboard
              window.location.href = '/dashboard'
              return
            }
          } catch (callbackError) {
            console.error('OAuthCallbackHandler: Backend failed, trying fallback:', callbackError)
            
            // Fallback: decode the token and create user
            try {
              const payload = JSON.parse(atob(oauthToken.split('.')[1]))
              console.log('OAuthCallbackHandler: Decoded token payload:', payload)
              
              const mockUser = {
                email: payload.email,
                fullName: payload.user_metadata?.full_name || payload.email?.split('@')[0] || 'Google User'
              }
              
              console.log('OAuthCallbackHandler: Creating user:', mockUser)
              
              // Register the user to get a JWT token
              const jwtResponse = await api.post('/auth/register', {
                email: mockUser.email,
                password: 'google_oauth_user_' + Date.now(),
                fullName: mockUser.fullName
              })
              
              if (jwtResponse.data.success) {
                console.log('OAuthCallbackHandler: Successfully created user')
                localStorage.setItem('token', jwtResponse.data.token)
                
                // Redirect to dashboard
                window.location.href = '/dashboard'
                return
              }
            } catch (decodeError) {
              console.error('OAuthCallbackHandler: Fallback failed:', decodeError)
            }
          }
        }
        
        // Check for token in current URL hash (direct callback)
        const hash = window.location.hash
        console.log('OAuthCallbackHandler: Checking URL hash:', hash)
        
        if (hash) {
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          
          if (accessToken) {
            console.log('OAuthCallbackHandler: Found access token in URL hash')
            
            try {
              // Try backend first
              const response = await api.post('/auth/google-callback', {
                access_token: accessToken
              })
              
              if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                window.location.href = '/dashboard'
                return
              }
            } catch (error) {
              console.error('OAuthCallbackHandler: Backend failed, trying fallback')
              
              // Fallback
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
                window.location.href = '/dashboard'
                return
              }
            }
          }
        }
        
        // If we get here, something went wrong
        console.log('OAuthCallbackHandler: Failed to process OAuth, redirecting to login')
        window.location.href = '/login'
        
      } catch (error) {
        console.error('OAuthCallbackHandler error:', error)
        window.location.href = '/login'
      }
    }

    handleOAuthCallback()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Processing Google OAuth...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  )
}

export default OAuthCallbackHandler
