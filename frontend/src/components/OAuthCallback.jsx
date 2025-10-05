import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import api from '../utils/api'

const OAuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
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
            // Set the session in Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('Error setting Supabase session:', error)
              console.error('Full error details:', JSON.stringify(error, null, 2))
              navigate(`/login?error=supabase_session_failed&details=${encodeURIComponent(error.message)}`)
              return
            }
            
            console.log('Supabase session set successfully')
            
            // Call our backend to convert Supabase token to JWT
            try {
              const response = await api.post('/auth/google-callback', {
                access_token: accessToken
              })
              
              if (response.data.success) {
                console.log('Successfully converted to JWT token')
                localStorage.setItem('token', response.data.token)
                
                // Clear the URL hash
                window.history.replaceState({}, document.title, window.location.pathname)
                
                // Redirect to dashboard
                navigate('/dashboard')
                return
              }
            } catch (callbackError) {
              console.error('Backend callback failed:', callbackError)
              console.error('Backend error details:', JSON.stringify(callbackError.response?.data || callbackError.message, null, 2))
              // Still try to proceed with Supabase token
            }
            
            // Fallback: store Supabase token and redirect
            localStorage.setItem('token', accessToken)
            window.history.replaceState({}, document.title, window.location.pathname)
            navigate('/dashboard')
          } else {
            console.log('No access token found in URL')
            navigate('/login?error=no_token')
          }
        } else {
          console.log('No hash found in URL')
          navigate('/login?error=no_hash')
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login?error=callback_failed')
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
