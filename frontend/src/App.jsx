import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/influencers" element={<InfluencersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/generate-video" element={<GenerateVideoPage />} />
        <Route path="/upscale" element={<UpscalePage />} />
        <Route path="/edit-image" element={<EditImagePage />} />
        <Route path="/generate-prompt" element={<GeneratePromptPage />} />
        <Route path="/view-all" element={<ToolsPage />} />
        <Route path="/credits" element={<GetCreditsPage />} />
        <Route path="/subscriptions" element={<ManageSubscriptionPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
