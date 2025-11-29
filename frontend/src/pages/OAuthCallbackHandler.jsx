import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { getReturnPath, getRedirectPath } from '../utils/redirectHelper'
import paymentService from '../services/paymentService'

// AI girlfriend pages - need to check return path before subscription
const AI_GIRLFRIEND_PAGES = ['/discover', '/chat', '/ai-girlfriend-pricing', '/account', '/generation']

const OAuthCallbackHandler = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Processing Google OAuth...')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuthCallbackHandler: Processing OAuth callback')
        setStatus('Processing Google OAuth...')
        
        // Check if we have a token in the URL hash
        const hash = window.location.hash
        console.log('OAuthCallbackHandler: Checking URL hash:', hash)
        
        if (hash && hash.includes('access_token')) {
          console.log('OAuthCallbackHandler: Found OAuth token in hash')
          setStatus('Validating authentication...')
          
          // Extract token from hash
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          
          if (accessToken) {
            try {
              // Call backend to convert Supabase token to JWT
              const response = await api.post('/auth/google-callback', {
                access_token: accessToken
              })
              
              if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                setStatus('Authentication successful! Redirecting...')
                
                // Check for return path in multiple places:
                // 1. Query parameter (from redirect URL)
                const urlParams = new URLSearchParams(window.location.search)
                const returnToFromQuery = urlParams.get('returnTo')
                
                // 2. SessionStorage
                let returnTo = sessionStorage.getItem('aiGirlfriendReturnTo')
                
                // 3. If query param exists, use it and save to sessionStorage
                if (returnToFromQuery) {
                  returnTo = decodeURIComponent(returnToFromQuery)
                  sessionStorage.setItem('aiGirlfriendReturnTo', returnTo)
                  console.log('🔄 [OAuthCallbackHandler] Return path from query param:', returnTo)
                } else if (returnTo) {
                  console.log('🔄 [OAuthCallbackHandler] Return path from sessionStorage:', returnTo)
                } else {
                  console.log('⚠️ [OAuthCallbackHandler] No return path found!')
                }
                
                // If we have a return path from AI girlfriend page, redirect immediately (skip subscription check)
                if (returnTo && AI_GIRLFRIEND_PAGES.some(page => returnTo.startsWith(page))) {
                  console.log('🔄 [OAuthCallbackHandler] AI girlfriend page detected, redirecting immediately to:', returnTo)
                  window.history.replaceState({}, document.title, '/')
                  sessionStorage.removeItem('aiGirlfriendReturnTo')
                  setTimeout(() => {
                    navigate(returnTo, { replace: true })
                  }, 100)
                  return
                }
                
                // Only check subscription if NOT from AI girlfriend page
                setTimeout(async () => {
                  try {
                    const subscription = await paymentService.getSubscription()
                    const hasPaid = 
                      subscription?.hasActiveSubscription === true || 
                      subscription?.status === 'active' || 
                      Boolean(subscription?.plan && subscription?.plan !== null)
                    
                    const redirectPath = getRedirectPath(hasPaid, returnTo)
                    console.log('🔄 [OAuthCallbackHandler] Redirecting to:', redirectPath, { hasPaid, returnTo })
                    window.history.replaceState({}, document.title, '/')
                    
                    // Remove return path after using it
                    if (returnTo) {
                      sessionStorage.removeItem('aiGirlfriendReturnTo')
                    }
                    
                    navigate(redirectPath, { replace: true })
                  } catch (subError) {
                    const redirectPath = getRedirectPath(false, returnTo)
                    console.log('🔄 [OAuthCallbackHandler] Error, redirecting to:', redirectPath, { returnTo })
                    window.history.replaceState({}, document.title, '/')
                    
                    if (returnTo) {
                      sessionStorage.removeItem('aiGirlfriendReturnTo')
                    }
                    
                    navigate(redirectPath, { replace: true })
                  }
                }, 100)
                return
              }
            } catch (error) {
              console.error('OAuth backend failed:', error)
              setStatus('Authentication failed. Redirecting to login...')
              
              // Fallback: try to decode token and create user
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
                  setStatus('Account created! Redirecting...')
                  
                  // Check for return path (don't remove it yet)
                  const returnTo = sessionStorage.getItem('aiGirlfriendReturnTo')
                  console.log('🔄 [OAuthCallbackHandler Fallback] Found return path:', returnTo)
                  window.history.replaceState({}, document.title, '/')
                  setTimeout(() => {
                    const redirectPath = getRedirectPath(false, returnTo)
                    console.log('🔄 [OAuthCallbackHandler Fallback] Redirecting to:', redirectPath, { returnTo })
                    
                    if (returnTo) {
                      sessionStorage.removeItem('aiGirlfriendReturnTo')
                    }
                    
                    navigate(redirectPath, { replace: true })
                  }, 100)
                  return
                }
              } catch (fallbackError) {
                console.error('OAuth fallback failed:', fallbackError)
                setStatus('Authentication failed. Redirecting to login...')
              }
            }
          }
          
          // Clear the hash from URL even if processing failed
          window.history.replaceState({}, document.title, '/')
          setTimeout(() => navigate('/login', { replace: true }), 2000)
          return
        }
        
        // If no token in hash, redirect to login
        console.log('OAuthCallbackHandler: No token found, redirecting to login')
        setStatus('No authentication token found. Redirecting to login...')
        setTimeout(() => navigate('/login', { replace: true }), 2000)
        
      } catch (error) {
        console.error('OAuthCallbackHandler error:', error)
        setStatus('Authentication error. Redirecting to login...')
        setTimeout(() => navigate('/login', { replace: true }), 2000)
      }
    }

    handleOAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">{status}</p>
        <p className="text-gray-500 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  )
}

export default OAuthCallbackHandler
