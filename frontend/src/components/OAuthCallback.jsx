import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import api from '../utils/api'

const OAuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('OAuthCallback component mounted')
    const handleOAuthCallback = async () => {
      try {
        console.log('Processing OAuth callback...')
        
        // Get the current URL hash
        const hash = window.location.hash
        console.log('URL hash:', hash)
        
        if (hash) {
          // Parse the hash parameters
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          
          console.log('Access token found:', accessToken ? 'Yes' : 'No')
          console.log('Refresh token found:', refreshToken ? 'Yes' : 'No')
          
          if (accessToken) {
            // Skip Supabase session setting due to API key issues
            console.log('Skipping Supabase session setting, using token directly')
            
            // Set the session in Supabase (commented out due to API key issues)
            // const { data, error } = await supabase.auth.setSession({
            //   access_token: accessToken,
            //   refresh_token: refreshToken
            // })
            
            // if (error) {
            //   console.error('Error setting Supabase session:', error)
            //   console.error('Full error details:', JSON.stringify(error, null, 2))
            //   // Don't redirect to login with error, just try to proceed
            // }
            
            console.log('Proceeding with token processing')
            
            // Call our backend to convert Supabase token to JWT
            try {
              console.log('Calling backend /auth/google-callback...')
              const response = await api.post('/auth/google-callback', {
                access_token: accessToken
              })
              
              console.log('Backend response:', response.data)
              
              if (response.data.success) {
                console.log('Successfully converted to JWT token')
                localStorage.setItem('token', response.data.token)
                
                // Clear the URL hash
                window.history.replaceState({}, document.title, window.location.pathname)
                
                // Redirect to dashboard
                navigate('/dashboard')
                return
              } else {
                console.error('Backend returned success: false', response.data)
              }
            } catch (callbackError) {
              console.error('Backend callback failed:', callbackError)
              console.error('Backend error details:', JSON.stringify(callbackError.response?.data || callbackError.message, null, 2))
              console.error('Full error object:', callbackError)
              // Still try to proceed with Supabase token
            }
            
            // Fallback: store Supabase token and redirect
            localStorage.setItem('token', accessToken)
            window.history.replaceState({}, document.title, window.location.pathname)
            navigate('/dashboard')
          } else {
            console.log('No access token found in URL')
            // Just redirect to dashboard, let the auth system handle it
            navigate('/dashboard')
          }
        } else {
          console.log('No hash found in URL')
          // Just redirect to dashboard, let the auth system handle it
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        // Just redirect to dashboard, let the auth system handle it
        navigate('/dashboard')
      }
    }

    handleOAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Processing Google login...</p>
      </div>
    </div>
  )
}

export default OAuthCallback
