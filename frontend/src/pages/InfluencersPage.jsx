import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import CreateInfluencerModal from '../components/CreateInfluencerModal'
import LimitReachedModal from '../components/LimitReachedModal'
import influencerService from '../services/influencerService'
import paymentService from '../services/paymentService'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const ONBOARDING_SELECTION_STORAGE_KEY = 'eromify/onboardingSelection'

const InfluencersPage = () => {
  const [influencers, setInfluencers] = useState([])
  const [fallbackInfluencer, setFallbackInfluencer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInfluencerLimitModal, setShowInfluencerLimitModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, influencer: null })
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchInfluencers()
  }, [])

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setSubscriptionLoading(true)
        const response = await paymentService.getSubscription()
        setSubscription(response)
      } catch (error) {
        console.error('Failed to fetch subscription information for influencer limit', error)
      } finally {
        setSubscriptionLoading(false)
      }
    }

    loadSubscription()
  }, [])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const response = await influencerService.getInfluencers()
      if (response.success) {
        setInfluencers(response.influencers || [])
      }
    } catch (error) {
      console.error('Error fetching influencers:', error)
      toast.error('Failed to fetch influencers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loading) return

    if (influencers && influencers.length > 0) {
      setFallbackInfluencer(null)
      return
    }

    if (typeof window === 'undefined') return

    try {
      const storedSelection = localStorage.getItem(ONBOARDING_SELECTION_STORAGE_KEY)
      if (!storedSelection) {
        setFallbackInfluencer(null)
        return
      }

      const parsed = JSON.parse(storedSelection)
      if (!parsed?.modelId) {
        setFallbackInfluencer(null)
        return
      }

      const {
        aiName,
        modelName,
        selectedNiche,
        selectedVisualStyle,
        selectedPlatforms,
        selectedContentTypes,
        selectedFrequency,
        description,
        personality,
        targetAudience,
        contentStyle
      } = parsed

      const platformsText = Array.isArray(selectedPlatforms) && selectedPlatforms.length
        ? selectedPlatforms.join(', ')
        : 'major social platforms'

      const contentTypesText = Array.isArray(selectedContentTypes) && selectedContentTypes.length
        ? selectedContentTypes.join(', ')
        : 'high-impact formats'

      setFallbackInfluencer({
        id: `local-${parsed.modelId}`,
        name: aiName || modelName || 'Marketplace Influencer',
        niche: selectedNiche || 'lifestyle',
        description:
          description ||
          `AI influencer inspired by ${modelName || 'your selected marketplace model'}.`,
        personality:
          personality ||
          `Confident and engaging persona with a ${selectedVisualStyle || 'signature'} visual style.`,
        target_audience:
          targetAudience ||
          `Ideal for audiences on ${platformsText}.`,
        content_style:
          contentStyle ||
          `Delivers ${contentTypesText} at a ${selectedFrequency || 'steady'} cadence.`,
        created_at: new Date().toISOString(),
        _isLocal: true
      })
    } catch (error) {
      console.error('Failed to load onboarding selection as fallback influencer:', error)
      setFallbackInfluencer(null)
    }
  }, [loading, influencers])

  const handleDelete = (influencer) => {
    setDeleteConfirmModal({ show: true, influencer })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmModal.influencer) return

    setDeleting(true)
    try {
      console.log('🗑️ Deleting influencer:', deleteConfirmModal.influencer.id)
      const response = await influencerService.deleteInfluencer(deleteConfirmModal.influencer.id)
      if (response.success) {
        console.log('✅ Influencer deleted successfully')
        toast.success('Influencer deleted successfully')
        
        // Refresh both influencers list and subscription to update the count
        await Promise.all([
          fetchInfluencers(),
          fetchSubscription()
        ])
        
        console.log('✅ Data refreshed after deletion')
        setDeleteConfirmModal({ show: false, influencer: null })
      }
    } catch (error) {
      console.error('❌ Error deleting influencer:', error)
      toast.error(error.response?.data?.error || 'Failed to delete influencer')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmModal({ show: false, influencer: null })
  }

  const fetchSubscription = async () => {
    try {
      const subResponse = await paymentService.getSubscription()
      setSubscription(subResponse)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }


  const handleCreateSuccess = () => {
    fetchInfluencers()
  }

  const handleCreateInfluencer = () => {
    const maxInfluencers = subscription?.influencerTrainings
    const currentInfluencers = influencers.length
    
    console.log('🎨 Create Influencer clicked (Influencers Page):', {
      currentInfluencers,
      maxInfluencers: maxInfluencers === null ? 'unlimited' : maxInfluencers,
      hasSlots: maxInfluencers === null ? true : currentInfluencers < maxInfluencers
    })
    
    // Check if user has reached their influencer limit (skip check if unlimited)
    if (maxInfluencers !== null && currentInfluencers >= maxInfluencers) {
      console.log('❌ Influencer limit reached, showing upgrade modal')
      setShowInfluencerLimitModal(true)
    } else {
      console.log('✅ User has available influencer slots, proceeding...')
      // TODO: Navigate to influencer creation page (to be implemented later)
      if (maxInfluencers === null) {
        alert(`You have unlimited influencers! Creation flow coming soon.`)
      } else {
        alert(`You can create ${maxInfluencers - currentInfluencers} more influencer(s)! Creation flow coming soon.`)
      }
    }
  }

  const displayedInfluencers =
    influencers && influencers.length > 0
      ? influencers
      : fallbackInfluencer
      ? [fallbackInfluencer]
      : []

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-black text-white min-h-screen">
        <div className="space-y-8">
          <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Influencers</h1>
              <p className="text-gray-400">
                Every AI persona you launch is collected here with the strategy you set during onboarding.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 border border-yellow-500/30 text-white px-4 py-2 rounded-lg whitespace-nowrap">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span>{subscription && (subscription.credits === null || subscription.credits === undefined) ? '∞' : (subscription?.credits ?? 0)} Credits</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-purple-900/20 to-purple-700/20 border border-purple-500/30 text-white px-4 py-2 rounded-lg whitespace-nowrap">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                <span>{influencers.length}/{subscription && (subscription.influencerTrainings === null || subscription.influencerTrainings === undefined) ? '∞' : (subscription?.influencerTrainings ?? 0)} Influencers</span>
              </div>
              <button
                onClick={handleCreateInfluencer}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center w-full sm:w-auto whitespace-nowrap"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Influencer
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayedInfluencers.map((influencer) => (
              <article
                key={influencer.id}
                className="relative overflow-hidden rounded-2xl border border-gray-900 bg-gradient-to-br from-gray-950 to-gray-900/60 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-purple-900/30"
              >
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#a855f720_1px,transparent_1px)] [background-size:18px_18px]" />
                
                {/* Image Carousel */}
                {influencer.avatar_url && (() => {
                  const images = influencer.images || [influencer.avatar_url]
                  const currentIndex = currentImageIndex[influencer.id] || 0
                  
                  const nextImage = () => {
                    setCurrentImageIndex(prev => ({
                      ...prev,
                      [influencer.id]: (currentIndex + 1) % images.length
                    }))
                  }
                  
                  const prevImage = () => {
                    setCurrentImageIndex(prev => ({
                      ...prev,
                      [influencer.id]: currentIndex === 0 ? images.length - 1 : currentIndex - 1
                    }))
                  }
                  
                  return (
                    <div className="relative w-full aspect-[3/4] overflow-hidden group">
                      <img 
                        src={images[currentIndex]} 
                        alt={`${influencer.name} - Image ${currentIndex + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                        Live
                      </div>
                      
                      {/* Navigation Arrows - Only show if multiple images */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          
                          {/* Image Indicator Dots */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                            {images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })()}
                
                <div className="p-6">
                  <div className="relative flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">{influencer.name}</h2>
                      <p className="text-xs uppercase tracking-wider text-purple-300">
                        {influencer.niche || 'Niche Unspecified'}
                      </p>
                    </div>
                    {!influencer._isLocal && (
                      <button
                        onClick={() => handleDelete(influencer)}
                        className="rounded-lg border border-transparent px-3 py-1 text-xs text-red-400 transition-colors duration-200 hover:border-red-500/40 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="relative mt-6 space-y-4 text-sm text-gray-300">
                  <div className="rounded-xl border border-gray-800/60 bg-black/30 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Voice & Personality
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {influencer.personality || 'Defined during onboarding to match your brand tone.'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-800/60 bg-black/30 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      Target Audience
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {influencer.target_audience || 'Audience priorities synced from the onboarding questions.'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-800/60 bg-black/30 p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
                      <p className="text-sm text-white">
                        {influencer._isLocal
                          ? 'Synced from onboarding'
                          : influencer.created_at
                          ? new Date(influencer.created_at).toLocaleDateString()
                          : 'Recently'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
                      <p className="text-sm text-green-400">
                        {influencer._isLocal ? 'Pending sync' : 'Live'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate('/generate')}
                      className="flex-1 rounded-lg border border-gray-800/80 bg-black/30 px-3 py-2 text-xs text-gray-400 transition-colors duration-200 hover:border-purple-400/60 hover:text-white"
                    >
                      Generate Image
                    </button>
                    <button
                      onClick={() => navigate('/generate-video')}
                      className="flex-1 rounded-lg border border-gray-800/80 bg-black/30 px-3 py-2 text-xs text-gray-400 transition-colors duration-200 hover:border-purple-400/60 hover:text-white"
                    >
                      Generate Video
                    </button>
                  </div>
                </div>
                </div>
              </article>
            ))}

            {displayedInfluencers.length === 0 && !loading && (
              <div className="rounded-2xl border border-dashed border-gray-800/80 bg-black/40 p-8 text-center text-gray-400">
                <p className="text-sm">
                  Claim an influencer during onboarding or use &ldquo;Create New Influencer&rdquo; to launch one
                  instantly.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Create Modal */}
        <CreateInfluencerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />

        {/* Limit Reached Modal */}
        <LimitReachedModal
          isOpen={showInfluencerLimitModal}
          onClose={() => setShowInfluencerLimitModal(false)}
          type="influencer"
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative bg-gradient-to-b from-gray-900 to-black border border-purple-500/30 rounded-xl max-w-sm w-full p-5">
              {/* Header */}
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-purple-500/10 rounded-full">
                  <Trash2 className="h-6 w-6 text-purple-400" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Delete Influencer?
              </h2>
              <p className="text-gray-400 text-center text-sm mb-5">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirmModal.influencer?.name}</span>? This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default InfluencersPage
