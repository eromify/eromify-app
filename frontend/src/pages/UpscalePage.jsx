import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { ArrowUp, Upload, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react'

const UpscalePage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [overlappingTiles, setOverlappingTiles] = useState(false)

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
                  <ArrowUp className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              
              {/* Main Message */}
              <h2 className="text-2xl font-bold text-white mb-4">No upscaled images found</h2>
              <p className="text-gray-400 mb-8">
                Your upscaled images will appear here.
              </p>
            </div>
          </div>
          
          {/* Upscale Button */}
          <div className="flex justify-center">
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center">
              <ArrowUp className="h-5 w-5 mr-2" />
              Upscale Image (10 gems)
            </button>
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Upscale Settings</h3>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Image to Upscale</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Select Image to Upscale</p>
              </label>
            </div>
          </div>

          {/* Upscaling Factor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Upscaling Factor</label>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white">4x (Fixed)</span>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                AuraSR provides consistent 4x upscaling for optimal results
              </p>
            </div>
          </div>

          {/* Model Checkpoint */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Model Checkpoint</label>
            <div className="relative">
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white appearance-none">
                <option>Version 2 (Improved)</option>
                <option>Version 1</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <p className="text-gray-400 text-xs mt-2">
                Choose between different model versions. V2 generally provides better results.
              </p>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Advanced Settings</h4>
            
            {/* Overlapping Tiles */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Overlapping Tiles</span>
              <button
                onClick={() => setOverlappingTiles(!overlappingTiles)}
                className="flex items-center"
              >
                {overlappingTiles ? (
                  <ToggleRight className="h-5 w-5 text-purple-500" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-4">
              Better quality, slower processing
            </p>
            <p className="text-gray-400 text-xs">
              Enabling overlapping tiles helps remove seams but doubles inference time.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UpscalePage
