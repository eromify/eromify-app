import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { contentService } from '../services/contentService'
import influencerService from '../services/influencerService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Video, Sparkles, CheckCircle, Loader2, ChevronDown } from 'lucide-react'

const GenerateVideoPage = () => {
  const { user } = useAuth()
  const [influencers, setInfluencers] = useState([])
  const [selectedInfluencerType, setSelectedInfluencerType] = useState('')
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('2:3')
  const [duration, setDuration] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)

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

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)', icon: '▢' },
    { value: '2:3', label: 'Portrait (2:3)', icon: '▮' },
    { value: '3:2', label: 'Landscape (3:2)', icon: '▬' },
    { value: '4:5', label: 'Instagram Post (4:5)', icon: '▭' },
    { value: '9:16', label: 'Story (9:16)', icon: '▯' },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setGenerating(true)
    try {
      const response = await contentService.generateVideo({
        influencerId: selectedInfluencerType,
        prompt: prompt.trim(),
        aspectRatio,
        duration
      })

      setJobId(response.jobId)
      setStatus(response.status)
      
      // Check if video is already completed (RunPod returns it immediately)
      if (response.status === 'completed' && response.videoUrl) {
        setVideoUrl(response.videoUrl)
        setGenerating(false)
        toast.success('Video generated successfully!')
      } else {
        toast.success('Video generation started!')
        // Start polling for status only if not completed
        pollStatus(response.jobId)
      }

    } catch (error) {
      console.error('Video generation error:', error)
      toast.error(error.response?.data?.error || 'Failed to generate video')
      setGenerating(false)
    }
  }

  const pollStatus = async (jobId) => {
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    const checkStatus = async () => {
      try {
        const response = await contentService.getVideoStatus(jobId)
        setStatus(response.status)
        setVideoUrl(response.videoUrl)

        if (response.status === 'completed' && response.videoUrl) {
          setGenerating(false)
          toast.success('Video generated successfully!')
          return
        }

        if (response.status === 'failed') {
          setGenerating(false)
          toast.error('Video generation failed')
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000) // Check every 5 seconds
        } else {
          setGenerating(false)
          toast.error('Video generation timeout')
        }
      } catch (error) {
        console.error('Status check error:', error)
        setTimeout(checkStatus, 5000)
      }
    }

    checkStatus()
  }

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
            <label className="block text-sm font-medium mb-3">Describe the video you want to generate...</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., beautiful woman walking on the beach, gentle breeze, golden hour, cinematic smooth camera movement"
              className="w-full h-32 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white resize-none focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Duration Slider - Full Width Below Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration: {duration} seconds</label>
            <input
              type="range"
              min="3"
              max="10"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Status */}
          {status && !videoUrl && (
            <div className="p-4">
              <p className="text-sm text-gray-400">Status: <span className="text-white">{status}</span></p>
              {status === 'processing' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generated Video */}
          {videoUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Video</h3>
              <div className="relative group">
                <video src={videoUrl} controls className="w-full rounded-lg" />
              </div>
              <button
                onClick={() => {
                  setVideoUrl(null)
                  setStatus(null)
                  setJobId(null)
                  setPrompt('')
                }}
                className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Generate Another
              </button>
            </div>
          )}

          {/* Empty State */}
          {!videoUrl && !status && (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <Video className="w-20 h-20 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-center">
                No videos generated yet<br />
                Your video will appear here once generated.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GenerateVideoPage
