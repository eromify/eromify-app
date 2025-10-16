import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import InfluencersPage from './pages/InfluencersPage'
import ProductsPage from './pages/ProductsPage'
import ToolsPage from './pages/ToolsPage'
import GeneratePage from './pages/GeneratePage'
import GenerateVideoPage from './pages/GenerateVideoPage'
import UpscalePage from './pages/UpscalePage'
import EditImagePage from './pages/EditImagePage'
import GeneratePromptPage from './pages/GeneratePromptPage'
import GetCreditsPage from './pages/GetCreditsPage'
import ManageSubscriptionPage from './pages/ManageSubscriptionPage'
import SupportPage from './pages/SupportPage'
import OAuthCallbackHandler from './pages/OAuthCallbackHandler'
import './App.css'

function GlobalMetaTracking() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  useEffect(() => {
    // Debug: Log current URL and all search params
    console.log('🔍 GlobalMetaTracking - Current URL:', window.location.href)
    console.log('🔍 GlobalMetaTracking - Search params:', Object.fromEntries(searchParams.entries()))
    console.log('🔍 GlobalMetaTracking - Meta Pixel available:', !!window.fbq)
    
    // Check if user just completed a payment
    const paymentStatus = searchParams.get('payment')
    const plan = searchParams.get('plan') || 'launch' // default to launch
    const billing = searchParams.get('billing') || 'monthly'
    
    console.log('🔍 GlobalMetaTracking - Payment status:', paymentStatus)
    console.log('🔍 GlobalMetaTracking - Plan:', plan, 'Billing:', billing)
    
    if (paymentStatus === 'success') {
      console.log('🎉 GlobalMetaTracking - Payment success detected!')
      
      // Calculate purchase value based on plan and billing
      const purchaseValues = {
        builder: { monthly: 12.00, yearly: 108.00 },
        launch: { monthly: 25.00, yearly: 228.00 },
        growth: { monthly: 79.00, yearly: 780.00 }
      }
      
      const value = purchaseValues[plan]?.[billing] || 25.00
      
      // Track Meta Purchase Event with actual value
      if (window.fbq) {
        // Use setTimeout to ensure this fires after the automatic PageView
        setTimeout(() => {
          window.fbq('track', 'Purchase', {
            value: value,
            currency: 'USD',
            content_name: `${plan} - ${billing}`,
            content_type: 'subscription'
          })
          console.log(`✅ GlobalMetaTracking - Purchase event tracked: $${value} (${plan} - ${billing})`)
        }, 100) // Small delay to ensure PageView has completed
      } else {
        console.warn('⚠️ GlobalMetaTracking - Meta Pixel (fbq) not found')
      }
      
      // Clean up the URL after tracking
      setTimeout(() => {
        searchParams.delete('payment')
        searchParams.delete('plan')
        searchParams.delete('billing')
        setSearchParams(searchParams, { replace: true })
      }, 500)
    }
    
    // Test function for debugging - call this in console: window.testMetaPurchase()
    window.testMetaPurchase = (testValue = 25.00) => {
      console.log('🧪 Testing Meta Purchase event...')
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: testValue,
          currency: 'USD',
          content_name: 'Test Purchase',
          content_type: 'subscription'
        })
        console.log('✅ Test Purchase event fired with value:', testValue)
      } else {
        console.error('❌ Meta Pixel (fbq) not found!')
      }
    }
    
    // Force test the payment success detection
    window.forcePaymentSuccess = () => {
      console.log('🧪 Forcing payment success detection...')
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set('payment', 'success')
      setSearchParams(newSearchParams, { replace: true })
    }
    
    // Test if GlobalMetaTracking is working
    window.testGlobalTracking = () => {
      console.log('🧪 Testing GlobalMetaTracking component...')
      console.log('Current URL:', window.location.href)
      console.log('Search params:', Object.fromEntries(searchParams.entries()))
      console.log('Meta Pixel available:', !!window.fbq)
      return 'GlobalMetaTracking is working!'
    }
  }, [searchParams, setSearchParams])
  
  return null
}

function App() {
  return (
    <>
      <GlobalMetaTracking />
      <AuthProvider>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/influencers" element={
          <ProtectedRoute>
            <InfluencersPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } />
        <Route path="/tools" element={
          <ProtectedRoute>
            <ToolsPage />
          </ProtectedRoute>
        } />
        <Route path="/generate" element={
          <ProtectedRoute>
            <GeneratePage />
          </ProtectedRoute>
        } />
        <Route path="/generate-video" element={
          <ProtectedRoute>
            <GenerateVideoPage />
          </ProtectedRoute>
        } />
        <Route path="/upscale" element={
          <ProtectedRoute>
            <UpscalePage />
          </ProtectedRoute>
        } />
        <Route path="/edit-image" element={
          <ProtectedRoute>
            <EditImagePage />
          </ProtectedRoute>
        } />
        <Route path="/generate-prompt" element={
          <ProtectedRoute>
            <GeneratePromptPage />
          </ProtectedRoute>
        } />
        <Route path="/view-all" element={
          <ProtectedRoute>
            <ToolsPage />
          </ProtectedRoute>
        } />
        <Route path="/credits" element={
          <ProtectedRoute>
            <GetCreditsPage />
          </ProtectedRoute>
        } />
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <ManageSubscriptionPage />
          </ProtectedRoute>
        } />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/oauth-callback" element={<OAuthCallbackHandler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
