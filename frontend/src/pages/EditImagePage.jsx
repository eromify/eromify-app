import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Edit3, Upload, ChevronDown } from 'lucide-react'

const EditImagePage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [safetyTolerance, setSafetyTolerance] = useState(6)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-full">
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              {/* Large Icon */}
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center">
                  <Edit3 className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              
              {/* Main Message */}
              <h2 className="text-2xl font-bold text-white mb-4">No edited images yet</h2>
              <p className="text-gray-400 mb-8">
                Select an image and enter a prompt to get started.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Input Image</h3>
          
          {/* Image Upload */}
          <div className="mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Select Image</p>
              </label>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Aspect Ratio</label>
            <div className="relative">
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white appearance-none">
                <option>Match Input</option>
                <option>1:1</option>
                <option>16:9</option>
                <option>9:16</option>
                <option>4:3</option>
                <option>3:4</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Output Format</label>
            <div className="relative">
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white appearance-none">
                <option>JPG</option>
                <option>PNG</option>
                <option>WEBP</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Safety Tolerance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Safety Tolerance: {safetyTolerance}
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="6"
                value={safetyTolerance}
                onChange={(e) => setSafetyTolerance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(safetyTolerance - 1) * 20}%, #374151 ${(safetyTolerance - 1) * 20}%, #374151 100%)`
                }}
              />
              <p className="text-gray-400 text-xs">
                Higher values allow more creative edits (1-6)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Prompt Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-4">
            <input
              type="text"
              placeholder="Describe what you want to change in the image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors">
              Edit Image (15 credits)
            </button>
          </div>
        </div>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditImagePage
