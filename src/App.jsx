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
    console.log('🔍 Current URL:', window.location.href)
    console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()))
    
    const paymentStatus = searchParams.get('payment')
    if (paymentStatus === 'success') {
      console.log('🎉 Payment success detected! Firing Meta Purchase event...')
      
      // Fire Meta Purchase event globally
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: 25.00,
          currency: 'USD'
        })
        console.log('✅ Meta Purchase event tracked globally from App.jsx')
      } else {
        console.error('❌ Meta Pixel (fbq) not found!')
      }
      
      // Clean up URL
      searchParams.delete('payment')
      setSearchParams(searchParams, { replace: true })
    }
    
    // Test function for debugging - call this in console: window.testMetaPurchase()
    window.testMetaPurchase = () => {
      console.log('🧪 Testing Meta Purchase event...')
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: 25.00,
          currency: 'USD'
        })
        console.log('✅ Test Purchase event fired!')
      } else {
        console.error('❌ Meta Pixel (fbq) not found!')
      }
    }
  }, [searchParams, setSearchParams])
  
  return null
}

function App() {
  return (
    <AuthProvider>
      <GlobalMetaTracking />
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
  )
}

export default App
