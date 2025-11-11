import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import MarketplacePage from './pages/MarketplacePage'
import AffiliatePage from './pages/AffiliatePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import InfluencersPage from './pages/InfluencersPage'
import ProductsPage from './pages/ProductsPage'
import GeneratePage from './pages/GeneratePage'
import GenerateVideoPage from './pages/GenerateVideoPage'
import GeneratePromptPage from './pages/GeneratePromptPage'
import GetCreditsPage from './pages/GetCreditsPage'
import ManageSubscriptionPage from './pages/ManageSubscriptionPage'
import SupportPage from './pages/SupportPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import OAuthCallbackHandler from './pages/OAuthCallbackHandler'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LandingPageSuccess from './pages/LandingPageSuccess'
import './App.css'

// Force deployment
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/affiliate" element={<AffiliatePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
        <Route path="/generate-prompt" element={
          <ProtectedRoute>
            <GeneratePromptPage />
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
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/oauth-callback" element={<OAuthCallbackHandler />} />
        <Route path="/landing-page" element={<LandingPageSuccess />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
