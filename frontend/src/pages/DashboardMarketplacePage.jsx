import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import LimitReachedModal from '../components/LimitReachedModal'
import { marketplaceModels } from '../data/marketplaceModels'
import paymentService from '../services/paymentService'
import influencerService from '../services/influencerService'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

const DashboardMarketplacePage = () => {
  const navigate = useNavigate()
  const [selectedModel, setSelectedModel] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)

  // Filter out duplicate models (27, 11, 12) and archived/blacked-out models
  const filteredModels = marketplaceModels.filter(model => 
    ![27, 11, 12].includes(model.id) && !model.isBlackedOut
  )

  // Fetch subscription and influencers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [subResponse, infResponse] = await Promise.all([
          paymentService.getSubscription(),
          influencerService.getInfluencers()
        ])
        
        setSubscription(subResponse)
        setInfluencers(infResponse.influencers || [])
        
        console.log('📊 Marketplace data loaded:', {
          subscription: subResponse,
          influencersCount: infResponse.influencers?.length || 0,
          maxInfluencers: subResponse?.influencerTrainings || 0
        })
      } catch (error) {
        console.error('Error fetching marketplace data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Check if user can claim more influencers
  const canClaimMore = () => {
    const maxInfluencers = subscription?.influencerTrainings
    const currentInfluencers = influencers.length
    // If maxInfluencers is null (unlimited), always return true
    if (maxInfluencers === null) return true
    return currentInfluencers < maxInfluencers
  }

  const openModelDetails = (model) => {
    setSelectedModel(model)
  }

  const closeModelDetails = () => {
    setSelectedModel(null)
  }

  const handleClaimModel = async () => {
    if (!canClaimMore()) {
      console.log('❌ Influencer limit reached, showing upgrade modal')
      setShowLimitModal(true)
      return
    }

    console.log('✅ User can claim more influencers:', {
      current: influencers.length,
      max: subscription?.influencerTrainings || 0
    })

    setClaiming(true)
    
    try {
      console.log('🎨 Claiming model:', selectedModel.name)

      // Prepare the payload for claiming
      const claimPayload = {
        modelId: selectedModel.id,
        modelName: selectedModel.name || 'Unnamed Model',
        aiName: selectedModel.name || 'Unnamed Model', // Use model name as AI name
        modelImage: (selectedModel.images && selectedModel.images.length > 0) ? selectedModel.images[0] : null,
        modelImages: Array.isArray(selectedModel.images) ? selectedModel.images : [],
        niche: selectedModel.niche || 'lifestyle',
        description: selectedModel.about || `AI influencer ${selectedModel.name}`,
        personality: selectedModel.about || 'Confident and engaging persona',
        targetAudience: `Ideal for audiences interested in ${selectedModel.niche || 'lifestyle'} content`,
        contentStyle: 'Premium quality content with professional styling',
        visualStyle: '',
        goal: '',
        frequency: '',
        platforms: [],
        contentTypes: []
      }

      console.log('📤 Sending claim request with payload:', claimPayload)
      console.log('📤 Selected model full data:', selectedModel)

      // Call the backend to claim the marketplace influencer
      const response = await influencerService.claimMarketplaceInfluencer(claimPayload)

      if (response.success) {
        console.log('✅ Successfully claimed influencer:', response.influencer)
        toast.success(`Successfully claimed ${selectedModel.name}!`)
        
        // Close modal and redirect to influencers page
        closeModelDetails()
        
        // Small delay to let toast show, then redirect
        setTimeout(() => {
          navigate('/influencers')
        }, 500)
      } else {
        throw new Error(response.error || 'Failed to claim influencer')
      }
    } catch (error) {
      console.error('❌ Error claiming influencer:', error)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error status:', error.response?.status)
      
      // If backend returns 403 for limit reached, show the upgrade modal
      if (error.response?.status === 403 && error.response?.data?.error?.includes('limit')) {
        console.log('❌ Backend confirmed limit reached, showing upgrade modal')
        setShowLimitModal(true)
      } else {
        toast.error(error.response?.data?.error || error.message || 'Failed to claim influencer. Please try again.')
      }
    } finally {
      setClaiming(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-black text-white min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">
            Browse and select from our collection of professionally trained AI models
          </p>
        </div>

        {/* Models Grid - 3 columns, dynamic rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <button
              key={model.id}
              onClick={() => openModelDetails(model)}
              className="relative group rounded-2xl overflow-hidden border-2 border-gray-800 hover:border-purple-500 transition-all duration-200"
            >
              {/* V2 Badge */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-purple-600 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md z-10">
                V2
              </div>

              {/* Model Image */}
              <div className="aspect-[3/4] bg-gray-800 relative">
                <img 
                  src={model.images[0]} 
                  alt={model.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>

              {/* Model Info */}
              <div className="bg-gray-900/90 p-3 md:p-4 text-center">
                <h3 className="text-white font-semibold mb-1 text-sm md:text-base">{model.name}</h3>
                {model.tier && (
                  <p className="text-purple-400 text-xs">{model.tier}</p>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
                <div className="text-center px-4">
                  <p className="text-white text-xs md:text-sm font-medium">Click to view details</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Model Details Modal */}
        {selectedModel && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModelDetails}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeModelDetails}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left Side - Images */}
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={selectedModel.images[0]} 
                      alt={selectedModel.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  {selectedModel.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedModel.images.slice(1).map((image, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedModel.name} ${idx + 2}`}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side - Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedModel.name}</h2>
                    {selectedModel.tier && (
                      <div className="mb-4">
                        <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">
                          {selectedModel.tier}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* About */}
                  {selectedModel.about && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedModel.about}</p>
                    </div>
                  )}

                  {/* Attributes */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Attributes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedModel.ethnicity && (
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Ethnicity</p>
                          <p className="text-white text-sm capitalize">{selectedModel.ethnicity}</p>
                        </div>
                      )}
                      {selectedModel.age && (
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Age</p>
                          <p className="text-white text-sm">{selectedModel.age}</p>
                        </div>
                      )}
                      {selectedModel.hair && (
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Hair</p>
                          <p className="text-white text-sm capitalize">{selectedModel.hair}</p>
                        </div>
                      )}
                      {selectedModel.body && (
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Body</p>
                          <p className="text-white text-sm capitalize">{selectedModel.body}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={handleClaimModel}
                    disabled={loading || claiming}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming ? 'Claiming...' : 'Claim Model'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Limit Reached Modal */}
        <LimitReachedModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          type="influencer"
        />
      </div>
    </DashboardLayout>
  )
}

export default DashboardMarketplacePage
