import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { contentService } from '../services/contentService'
import influencerService from '../services/influencerService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react'

const GeneratePage = () => {
  const { user } = useAuth()
  const [influencers, setInfluencers] = useState([])
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('photorealistic')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [creditsRemaining, setCreditsRemaining] = useState(null)

  useEffect(() => {
    fetchInfluencers()
  }, [])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const response = await influencerService.getInfluencers()
      if (response.success && response.influencers?.length > 0) {
        setInfluencers(response.influencers)
        // Auto-select first influencer
        setSelectedInfluencer(response.influencers[0])
      }
    } catch (error) {
      console.error('Error fetching influencers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedInfluencer) {
      toast.error('Please select an influencer')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setGenerating(true)
    try {
      const response = await contentService.generateImage({
        influencerId: selectedInfluencer.id,
        prompt: prompt.trim(),
        style
      })

      if (response.success) {
        setGeneratedImage(response.image.url)
        setCreditsRemaining(response.image.creditsRemaining)
        toast.success(`Image generated! Credits remaining: ${response.image.creditsRemaining ?? 'Unlimited'}`)
      }
    } catch (error) {
      console.error('Generation error:', error)
      const errorMsg = error.response?.data?.error || 'Failed to generate image'
      toast.error(errorMsg)
      
      // If insufficient credits, show credits
      if (error.response?.data?.credits !== undefined) {
        setCreditsRemaining(error.response.data.credits)
      }
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (influencers.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">No Influencers Available</h2>
              <p className="text-gray-400 mb-8">
                Create your first AI influencer to start generating content.
              </p>
              <button
                onClick={() => window.location.href = '/influencers'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Create Influencer
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-black text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Generate AI Image</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Influencer Selection & Prompt */}
            <div className="lg:col-span-2 space-y-6">
              {/* Influencer Selection */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <label className="block text-sm font-medium mb-3">Select Influencer</label>
                <div className="grid grid-cols-2 gap-3">
                  {influencers.map((inf) => (
                    <button
                      key={inf.id}
                      onClick={() => setSelectedInfluencer(inf)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedInfluencer?.id === inf.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{inf.name}</h3>
                        <p className="text-xs text-gray-400 capitalize">{inf.niche}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <label className="block text-sm font-medium mb-3">Image Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate... (e.g., 'Beautiful woman in a red dress on a beach at sunset')"
                  className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Style Selection */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <label className="block text-sm font-medium mb-3">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="photorealistic">Photorealistic</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="artistic">Artistic</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedInfluencer || !prompt.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Image (10 credits)
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Preview/Result */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
                {generatedImage ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Generated Image</h3>
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full rounded-lg mb-4"
                    />
                    <div className="space-y-2">
                      <a
                        href={generatedImage}
                        download
                        className="block w-full bg-purple-500 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => {
                          setGeneratedImage(null)
                          setPrompt('')
                        }}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                      >
                        Generate Another
                      </button>
                    </div>
                    {creditsRemaining !== null && (
                      <p className="text-sm text-gray-400 mt-4 text-center">
                        Credits: {creditsRemaining ?? 'Unlimited'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">Generated image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GeneratePage
