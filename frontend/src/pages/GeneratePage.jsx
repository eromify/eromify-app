import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { contentService } from '../services/contentService'
import influencerService from '../services/influencerService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Sparkles, Image as ImageIcon, Loader2, ChevronDown } from 'lucide-react'

const GeneratePage = () => {
  const { user } = useAuth()
  const [influencers, setInfluencers] = useState([])
  const [selectedInfluencerType, setSelectedInfluencerType] = useState('')
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('photorealistic')
  const [aspectRatio, setAspectRatio] = useState('2:3')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([])
  const [creditsRemaining, setCreditsRemaining] = useState(null)

  useEffect(() => {
    fetchInfluencers()
  }, [])

  const fetchInfluencers = async () => {
    try {
      const response = await influencerService.getInfluencers()
      if (response.success && response.influencers?.length > 0) {
        setInfluencers(response.influencers)
        // Auto-select first influencer
        setSelectedInfluencerType(response.influencers[0].id)
        setSelectedInfluencer(response.influencers[0])
      }
    } catch (error) {
      console.error('Error fetching influencers:', error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setGenerating(true)
    try {
      const influencerId = selectedInfluencerType

      console.log('📤 Generating image with params:', { influencerId, prompt: prompt.trim(), style, aspectRatio })

      const response = await contentService.generateImage({
        influencerId: influencerId,
        prompt: prompt.trim(),
        style,
        aspectRatio
      })

      console.log('✅ Full response from API:', response)
      console.log('🖼️ Image URL:', response.image?.url)

      if (response.success) {
        // Only keep the latest image (clear previous ones to avoid memory issues)
        setGeneratedImages([response.image.url])
        setCreditsRemaining(response.image.creditsRemaining)
        toast.success(`Image generated! Credits remaining: ${response.image.creditsRemaining ?? 'Unlimited'}`)
      }
    } catch (error) {
      console.error('❌ Generation error:', error)
      console.error('❌ Error response:', error.response?.data)
      const errorMsg = error.response?.data?.error || 'Failed to generate image'
      toast.error(errorMsg)

      if (error.response?.data?.credits !== undefined) {
        setCreditsRemaining(error.response.data.credits)
      }
    } finally {
      setGenerating(false)
    }
  }

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)', icon: '▢' },
    { value: '2:3', label: 'Portrait (2:3)', icon: '▮' },
    { value: '3:2', label: 'Landscape (3:2)', icon: '▬' },
    { value: '4:5', label: 'Instagram Post (4:5)', icon: '▭' },
    { value: '9:16', label: 'Story (9:16)', icon: '▯' },
  ]

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top 3 Controls - Horizontal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Influencer Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Influencer</label>
              <div className="relative">
                <select
                  value={selectedInfluencerType}
                  onChange={(e) => {
                    setSelectedInfluencerType(e.target.value)
                    setSelectedInfluencer(influencers.find(inf => inf.id === e.target.value) || null)
                  }}
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                >
                  {influencers.map((inf) => (
                    <option key={inf.id} value={inf.id}>
                      {inf.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
              <div className="relative">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                >
                  {aspectRatios.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim() || !selectedInfluencerType}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium mb-3">Describe the image you want to generate...</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A high resolution DSLR photo. Beautiful woman with long blonde hair wearing a black dress, professional photography, golden hour lighting, city skyline background"
              className="w-full h-32 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white resize-none focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Creations</h3>
              <div className="grid grid-cols-1 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Generated ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-center">
                No generation history found<br />
                Your creations will appear here once you generate them.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GeneratePage
