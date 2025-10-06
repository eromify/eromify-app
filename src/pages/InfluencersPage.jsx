import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateInfluencerModal from '../components/CreateInfluencerModal'
import LimitReachedModal from '../components/LimitReachedModal'
import influencerService from '../services/influencerService'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Users, Star } from 'lucide-react'

const InfluencersPage = () => {
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInfluencerLimitModal, setShowInfluencerLimitModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchInfluencers()
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this influencer?')) {
      try {
        const response = await influencerService.deleteInfluencer(id)
        if (response.success) {
          toast.success('Influencer deleted successfully')
          fetchInfluencers()
        }
      } catch (error) {
        console.error('Error deleting influencer:', error)
        toast.error('Failed to delete influencer')
      }
    }
  }


  const handleCreateSuccess = () => {
    fetchInfluencers()
  }

  return (
    <>
      <div className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Influencers</h1>
              <p className="text-gray-400">
                Manage your AI influencers and view analytics.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gradient-to-r from-purple-900/20 to-purple-700/20 border border-purple-500/30 text-white px-4 py-2 rounded-lg">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                <span>0/0 Influencers</span>
              </div>
              <button 
                onClick={() => setShowInfluencerLimitModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Influencer
              </button>
            </div>
          </div>

          {/* Influencers Grid */}
          {influencers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {influencers.map((influencer) => (
                <div key={influencer.id} className="bg-gradient-to-br from-gray-950/80 to-gray-900/50 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/20 flex items-center justify-center border border-pink-500/30 group-hover:from-pink-400/40 group-hover:to-purple-400/30 transition-all duration-300">
                        <Users className="h-6 w-6 text-pink-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-white">{influencer.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{influencer.niche}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(influencer.id)}
                        className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-900/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {influencer.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Personality:</span>
                      <p className="text-xs text-gray-400 line-clamp-2">{influencer.personality}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Target Audience:</span>
                      <p className="text-xs text-gray-400 line-clamp-2">{influencer.target_audience}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <span className="text-xs text-gray-500">
                      Created {new Date(influencer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Influencers Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Create your first AI influencer to get started with your virtual personality
              </p>
              <button 
                onClick={() => setShowInfluencerLimitModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center mx-auto"
              >
                <Plus className="h-6 w-6 mr-3" />
                Create Your First Influencer
              </button>
            </div>
          )}
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
      </div>
    </>
  )
}

export default InfluencersPage
