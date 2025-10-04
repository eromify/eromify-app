import { useState } from 'react'
import { X, Upload, Sparkles } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CreateInfluencerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    personality: '',
    target_audience: '',
    description: '',
    image: null
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('niche', formData.niche)
      submitData.append('personality', formData.personality)
      submitData.append('target_audience', formData.target_audience)
      submitData.append('description', formData.description)
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      const response = await api.post('/influencers', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success('AI Influencer created successfully!')
        onSuccess && onSuccess()
        onClose()
        // Reset form
        setFormData({
          name: '',
          niche: '',
          personality: '',
          target_audience: '',
          description: '',
          image: null
        })
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create influencer')
    } finally {
      setLoading(false)
    }
  }

  const generateWithAI = async () => {
    setLoading(true)
    try {
      // This would call your AI service to generate influencer details
      const response = await api.post('/influencers/generate', {
        niche: formData.niche
      })
      
      if (response.data.success) {
        const generated = response.data.influencer
        setFormData(prev => ({
          ...prev,
          personality: generated.personality,
          target_audience: generated.target_audience,
          description: generated.description
        }))
        toast.success('AI generated influencer details!')
      }
    } catch (error) {
      toast.error('Failed to generate with AI')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-white">Create AI Influencer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="e.g., Luna AI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Niche *
              </label>
              <select
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select niche</option>
                <option value="fashion">Fashion</option>
                <option value="fitness">Fitness</option>
                <option value="tech">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="beauty">Beauty</option>
                <option value="gaming">Gaming</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Describe your AI influencer's background and expertise..."
            />
          </div>

          {/* AI Generation Button */}
          {formData.niche && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={generateWithAI}
                disabled={loading}
                className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              >
                <Sparkles className="h-5 w-5" />
                <span>Generate with AI</span>
              </button>
            </div>
          )}

          {/* Personality */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Personality
            </label>
            <textarea
              name="personality"
              value={formData.personality}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Describe their personality traits, communication style, values..."
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Audience
            </label>
            <textarea
              name="target_audience"
              value={formData.target_audience}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Describe their ideal followers and target demographic..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Image
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-pink-400 hover:text-pink-300 font-medium"
              >
                Upload an image
              </label>
              <p className="text-gray-400 text-sm mt-2">
                {formData.image ? formData.image.name : 'PNG, JPG up to 10MB'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Influencer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInfluencerModal

