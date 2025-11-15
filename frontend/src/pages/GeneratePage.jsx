import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { contentService } from '../services/contentService'
import influencerService from '../services/influencerService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Sparkles, Image as ImageIcon, Loader2, ChevronDown, Zap } from 'lucide-react'

const GeneratePage = () => {
  const { user } = useAuth()
  const [influencers, setInfluencers] = useState([])
  const [selectedInfluencerType, setSelectedInfluencerType] = useState('new')
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
      // For "new" influencer, we'll generate without influencer context
      // For existing influencer, use their ID
      const influencerId = selectedInfluencerType === 'new' ? null : selectedInfluencerType

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
        setGeneratedImages(prev => {
          const newImages = [response.image.url, ...prev]
          console.log('📸 Updated generatedImages:', newImages)
          return newImages
        })
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side - Generation Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              {/* Select Influencer */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Influencer</label>
                <div className="relative">
                  <select
                    value={selectedInfluencerType}
                    onChange={(e) => {
                      setSelectedInfluencerType(e.target.value)
                      if (e.target.value !== 'new') {
                        setSelectedInfluencer(influencers.find(inf => inf.id === e.target.value) || null)
                      } else {
                        setSelectedInfluencer(null)
                      }
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    {influencers.map((inf) => (
                      <option key={inf.id} value={inf.id}>
                        {inf.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Model</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStyle('photorealistic')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      style === 'photorealistic'
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium text-sm">Flux</span>
                  </button>
                  <button
                    onClick={() => setStyle('photorealistic')}
                    className="p-3 rounded-lg border-2 border-gray-700 hover:border-gray-600 transition-all opacity-50"
                  >
                    <span className="font-medium text-sm">SDXL</span>
                  </button>
                </div>
              </div>

              {/* Number of Images */}
              <div>
                <label className="block text-sm font-medium mb-3">Number of Images</label>
                <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <button className="text-gray-400 hover:text-white">−</button>
                  <span className="font-medium">1 Image</span>
                  <button className="text-gray-400 hover:text-white">+</button>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium mb-3">Aspect Ratio</label>
                <div className="space-y-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                        aspectRatio === ratio.value
                          ? 'border-pink-500 bg-pink-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{ratio.icon}</span>
                      <span className="text-sm">{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation Settings */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Steps</label>
                    <span className="text-sm text-gray-400">28</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value="28"
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Guidance Scale</label>
                    <span className="text-sm text-gray-400">3.5</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value="3.5"
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center - Generated Images & Prompt */}
          <div className="lg:col-span-5 space-y-6">
            {/* Generated Images Grid */}
            {generatedImages.length > 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Your Creations</h3>
                <div className="grid grid-cols-1 gap-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Generated ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <a
                            href={image}
                            download={`generated-${index + 1}.png`}
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => setPrompt(prompt)}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                          >
                            Reuse Prompt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-center">
                  No generation history found<br />
                  Your creations will appear here once you generate them.
                </p>
              </div>
            )}

            {/* Prompt Input */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <label className="block text-sm font-medium mb-3">Describe the image you want to generate...</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., beautiful woman with long blonde hair wearing a black dress, professional photography, golden hour lighting, city skyline background"
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Right Side - Presets & Quick Actions */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 sticky top-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preset LoRAs</h3>
                <div className="space-y-2">
                  {['Mystic', 'Flux', 'Keywords: AiArtV'].map((preset, index) => (
                    <button
                      key={index}
                      className="w-full p-3 rounded-lg border-2 border-gray-700 hover:border-gray-600 transition-all text-left"
                    >
                      <Zap className="inline-block h-4 w-4 mr-2" />
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Be specific with details</li>
                  <li>• Mention lighting style</li>
                  <li>• Include camera angle</li>
                  <li>• Add style keywords</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GeneratePage
