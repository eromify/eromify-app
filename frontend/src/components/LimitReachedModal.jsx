import { X } from 'lucide-react'

const LimitReachedModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null

  const handleViewPlans = () => {
    window.location.href = '/credits'
  }

  const title = type === 'product' ? 'Product Limit Reached' : 
                type === 'upscale' ? 'Upscale Limit Reached' :
                type === 'edit-image' ? 'Edit Image Limit Reached' :
                type === 'generate-prompt' ? 'Generate Prompt Limit Reached' :
                type === 'image' ? 'Image Limit Reached' :
                'Influencer Limit Reached'
  
  const description = type === 'product' 
    ? "You've reached your maximum number of products. Choose an option below to continue creating."
    : type === 'upscale'
    ? "You've reached your upscaling limit. Choose an option below to continue upscaling."
    : type === 'edit-image'
    ? "You've reached your image editing limit. Choose an option below to continue editing."
    : type === 'generate-prompt'
    ? "You've reached your prompt generation limit. Choose an option below to continue generating."
    : type === 'image'
    ? "You've reached your image analysis limit. Choose an option below to continue analyzing."
    : "You've reached your maximum number of influencers. Choose an option below to continue creating."

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-700 rounded-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-3 pr-8">
          {title}
        </h2>

        {/* Description */}
        <p className="text-white text-sm mb-6">
          {description}
        </p>

        {/* Upgrade Plan Section */}
        <div className="bg-black border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-1">Upgrade Plan</h3>
          <p className="text-gray-400 text-sm mb-4">Get more slots and features</p>
          <button
            onClick={handleViewPlans}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
          >
            View Plans
          </button>
        </div>

        {/* Cancel Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LimitReachedModal
