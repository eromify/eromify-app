import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import LimitReachedModal from '../components/LimitReachedModal'
import { Star, Users, Plus, Image, Video } from 'lucide-react'
import userService from '../services/userService'
import influencerService from '../services/influencerService'
import paymentService from '../services/paymentService'
import { useAuth } from '../contexts/AuthContext'
import { trackPurchase } from '../utils/metaPixel'

const ONBOARDING_SELECTION_STORAGE_KEY = 'eromify/onboardingSelection'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInfluencerLimitModal, setShowInfluencerLimitModal] = useState(false)
  const [hasPaid, setHasPaid] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [refreshCounter, setRefreshCounter] = useState(0)
  const hasAttemptedMarketplaceClaim = useRef(false)

  const refreshSubscription = useCallback(async () => {
    setCheckingPayment(true)
    try {
      const response = await paymentService.getSubscription()
      setSubscription(response)
      const active =
        response?.hasActiveSubscription ||
        response?.status === 'active' ||
        Boolean(response?.plan)
      setHasPaid(active)

      if (!active) {
        console.log('❌ No active subscription detected for user, redirecting to onboarding')
        navigate('/onboarding')
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      navigate('/onboarding')
    } finally {
      setCheckingPayment(false)
    }
  }, [navigate])

  // Check subscription status on load
  useEffect(() => {
    refreshSubscription()
  }, [refreshSubscription])

  // Track successful payment with Meta Pixel
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')
    const plan = searchParams.get('plan') || 'subscription'
    const amount = searchParams.get('amount') || '25'
    
    if (paymentStatus === 'success') {
      console.log('🎉 Payment successful! Tracking purchase event...')
      
      // Set payment flag in localStorage
      localStorage.setItem('hasPaid', 'true')
      setHasPaid(true)
      refreshSubscription()
      
      // Track purchase event
      trackPurchase({
        value: parseInt(amount) * 100, // Convert to cents
        currency: 'USD',
        plan: plan,
        sessionId: sessionId,
        userEmail: user?.email
      })
      
      // Clean up URL by removing query parameters
      searchParams.delete('payment')
      searchParams.delete('session_id')
      searchParams.delete('plan')
      searchParams.delete('amount')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, user?.email, setSearchParams, refreshSubscription])

  useEffect(() => {
    const attemptClaim = async () => {
      if (!hasPaid || hasAttemptedMarketplaceClaim.current) {
        return
      }

      if (typeof window === 'undefined') {
        return
      }

      const storedSelection = localStorage.getItem(ONBOARDING_SELECTION_STORAGE_KEY)
      if (!storedSelection) {
        return
      }

      let selectionPayload
      try {
        selectionPayload = JSON.parse(storedSelection)
      } catch (error) {
        console.error('Failed to parse stored onboarding selection:', error)
        localStorage.removeItem(ONBOARDING_SELECTION_STORAGE_KEY)
        return
      }

      if (!selectionPayload?.modelId) {
        localStorage.removeItem(ONBOARDING_SELECTION_STORAGE_KEY)
        return
      }

      hasAttemptedMarketplaceClaim.current = true

      try {
        const response = await influencerService.claimMarketplaceInfluencer(selectionPayload)
        if (response.success) {
          localStorage.removeItem(ONBOARDING_SELECTION_STORAGE_KEY)
          setRefreshCounter(prev => prev + 1)
        }
      } catch (error) {
        console.error('Failed to claim marketplace influencer:', error)
        hasAttemptedMarketplaceClaim.current = false
      }
    }

    attemptClaim()
  }, [hasPaid])

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      try {
        setLoading(true)
        const response = await userService.getDashboard()
        if (isMounted && response.success) {
          setDashboardData(response.dashboard)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [refreshCounter])

  const handleCreateInfluencer = () => {
    setShowInfluencerLimitModal(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show loading while checking payment status
  if (checkingPayment) {
    return (
      <DashboardLayout>
        <div className="p-4 lg:p-8 bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Checking payment status...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Only show dashboard if user has paid
  if (!hasPaid) {
    return null // This should not happen due to redirect, but just in case
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-black text-white min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Discover</h1>
            <p className="text-gray-400">Create and manage your AI influencers</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 border border-yellow-500/30 text-white px-4 py-2 rounded-lg">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              <span>75 Credits</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-purple-900/20 to-purple-700/20 border border-purple-500/30 text-white px-4 py-2 rounded-lg">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              <span>0/0 Influencers</span>
            </div>
            <button 
              onClick={handleCreateInfluencer}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center w-full sm:w-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Influencer
            </button>
          </div>
        </div>

        {/* Recent Influencers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Influencers</h2>
          <div className="bg-black border border-gray-900 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Influencers Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first AI influencer to get started with your virtual personality
            </p>
            <button 
              onClick={handleCreateInfluencer}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center mx-auto"
            >
              <Plus className="h-6 w-6 mr-3" />
              Create Your First Influencer
            </button>
          </div>
        </div>

        {/* AI Tools Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/generate')}
              className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Image className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Image Generator</h3>
              <p className="text-gray-400 text-sm">Generate stunning images from text</p>
            </div>

            <div 
              onClick={() => navigate('/generate-video')}
              className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Video Generator</h3>
              <p className="text-gray-400 text-sm">Create videos with AI technology</p>
            </div>

          </div>
        </div>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showInfluencerLimitModal}
        onClose={() => setShowInfluencerLimitModal(false)}
        type="influencer"
      />
    </DashboardLayout>
  )
}

export default DashboardPage