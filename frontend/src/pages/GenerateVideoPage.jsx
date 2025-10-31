import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { contentService } from '../services/contentService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Video, Upload, Sparkles, CheckCircle } from 'lucide-react'

const GenerateVideoPage = () => {
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!imageUrl && !uploadedFile) {
      toast.error('Please upload or provide an image URL')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setGenerating(true)
    try {
      // If file uploaded, upload to server first
      let finalImageUrl = imageUrl
      if (uploadedFile) {
        // Upload file to get URL (you may need to add an upload endpoint)
        // For now, using data URL - may need server upload
        toast.error('File upload endpoint needed - using URL for now')
      }

      const response = await contentService.generateVideo({
        imageUrl: finalImageUrl,
        prompt,
        duration
      })

      setJobId(response.jobId)
      setStatus(response.status)
      toast.success('Video generation started!')
      
      // Start polling for status
      pollStatus(response.jobId)

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
      <div className="p-8 bg-black text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Generate AI Video</h1>

          {!videoUrl ? (
            <div className="space-y-6">
              {/* Image Upload/URL */}
              <div>
                <label className="block text-sm font-medium mb-2">Image Source</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">Upload Image</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Or enter image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full h-32 px-4 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
                {imageUrl && (
                  <div className="mt-4">
                    <img src={imageUrl} alt="Preview" className="max-w-md rounded-lg" />
                  </div>
                )}
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">Video Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video motion you want... (e.g., 'gentle camera movement, smooth panning, cinematic')"
                  className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">Duration: {duration} seconds</label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !imageUrl || !prompt.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Video (25 credits)
                  </>
                )}
              </button>

              {/* Status */}
              {status && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
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
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-4">Video Generated Successfully!</h2>
              <video src={videoUrl} controls className="max-w-full rounded-lg mb-4" />
              <div className="flex gap-4 justify-center">
                <a
                  href={videoUrl}
                  download
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                >
                  Download Video
                </a>
                <button
                  onClick={() => {
                    setVideoUrl(null)
                    setStatus(null)
                    setJobId(null)
                    setImageUrl('')
                    setPrompt('')
                  }}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GenerateVideoPage
