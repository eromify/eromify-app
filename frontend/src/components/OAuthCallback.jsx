import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // The AuthContext will handle the OAuth callback
    // This component just shows loading and redirects
    console.log('OAuthCallback component - redirecting to dashboard')
    
    // Small delay to allow AuthContext to process the callback
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 1000)

    return () => clearTimeout(timer)
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
