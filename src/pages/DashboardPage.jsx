import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import LimitReachedModal from '../components/LimitReachedModal'
import { Star, Users, Plus, Edit3, Image, ArrowUp, Video, Package, Sparkles } from 'lucide-react'
import userService from '../services/userService'
import { useAuth } from '../contexts/AuthContext'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInfluencerLimitModal, setShowInfluencerLimitModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    // Fire Purchase event with delay to avoid PageView conflict
    console.log('🔍 DashboardPage loaded - firing Purchase event')
    console.log('🔍 User:', user)
    console.log('🔍 Meta Pixel available:', !!window.fbq)
    
    if (window.fbq) {
      // Use setTimeout to fire after PageView
      setTimeout(() => {
        window.fbq('track', 'Purchase', {
          value: 25.00,
          currency: 'USD'
        })
        console.log('✅ Meta Purchase event fired from Dashboard Page')
      }, 500) // 500ms delay
    } else {
      console.warn('⚠️ Meta Pixel (fbq) not found')
    }
  }, [user])

  // Test function
  useEffect(() => {
    window.testDashboardMetaPurchase = () => {
      console.log('🧪 Testing Meta Purchase from Dashboard...')
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: 25.00,
          currency: 'USD'
        })
        console.log('✅ Test Purchase event fired')
      }
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await userService.getDashboard()
      if (response.success) {
        setDashboardData(response.dashboard)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInfluencer = () => {
    setShowInfluencerLimitModal(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
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

  return (
    <DashboardLayout>
      <div className="p-8 bg-black text-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Discover</h1>
            <p className="text-gray-400">Create and manage your AI influencers</p>
          </div>
          
          <div className="flex items-center space-x-4">
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
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
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
              onClick={() => navigate('/edit-image')}
              className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Edit3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Image Editor</h3>
              <p className="text-gray-400 text-sm">Edit and enhance your images with AI</p>
            </div>

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
              onClick={() => navigate('/upscale')}
              className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <ArrowUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Upscaler</h3>
              <p className="text-gray-400 text-sm">Enhance image resolution and quality</p>
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

            <div 
              onClick={() => navigate('/products')}
              className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Generate Product</h3>
              <p className="text-gray-400 text-sm">Create product images and content</p>
            </div>

            <div 
              onClick={() => navigate('/generate-prompt')}
              className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Generate Prompt</h3>
              <p className="text-gray-400 text-sm">Create AI prompts and descriptions</p>
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