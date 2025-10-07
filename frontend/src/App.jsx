import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
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

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
        <Route path="/auth/callback" element={<OAuthCallbackHandler />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
