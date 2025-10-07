import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import LimitReachedModal from '../components/LimitReachedModal'
import { Edit3, Upload, ChevronDown } from 'lucide-react'

const EditImagePage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [safetyTolerance, setSafetyTolerance] = useState(6)
  const [showEditImageLimitModal, setShowEditImageLimitModal] = useState(false)

  const handleImageUpload = (event) => {
    setShowEditImageLimitModal(true)
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-black text-white min-h-screen">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-black">
              <div className="bg-black rounded-xl p-8 max-w-2xl w-full text-center">
                        {/* Large Icon */}
                        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <Edit3 className="h-10 w-10 text-purple-400" />
                          </div>
                        </div>
                
                {/* Main Message */}
                <h2 className="text-2xl font-bold text-white mb-4">No edited images yet</h2>
                <p className="text-white mb-8 text-sm leading-relaxed">
                  Select an image and enter a prompt to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Settings */}
          <div className="w-full lg:w-80 bg-black border border-gray-900 lg:border-l rounded-lg lg:rounded-none p-6 mt-6 lg:mt-0">
          <h3 className="text-lg font-semibold text-white mb-6">Input Image</h3>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Input Image</label>
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
                <p className="text-gray-400 text-sm">Select Image to Edit</p>
              </label>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Aspect Ratio</label>
            <div className="relative">
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1 px-2 text-white text-sm appearance-none">
                <option>Match Input</option>
                <option>1:1</option>
                <option>16:9</option>
                <option>9:16</option>
                <option>4:3</option>
                <option>3:4</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Output Format</label>
            <div className="relative">
              <select className="w-full bg-black border border-gray-700 rounded-lg py-1 px-2 text-white text-sm appearance-none">
                <option>JPG</option>
                <option>PNG</option>
                <option>WEBP</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                  background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(safetyTolerance - 1) * 20}%, #374151 ${(safetyTolerance - 1) * 20}%, #374151 100%)`
                }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: black;
                  border: 2px solid #6b7280;
                  cursor: pointer;
                }
                .slider::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: black;
                  border: 2px solid #6b7280;
                  cursor: pointer;
                }
              `}</style>
              <p className="text-gray-400 text-xs">
                Higher values allow more creative edits (1-6)
              </p>
            </div>
          </div>
        </div>

          {/* Bottom Button */}
          <div className="mt-6 lg:mt-0">
            <div className="flex justify-center">
              <button 
                onClick={() => setShowEditImageLimitModal(true)}
                className="bg-black border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2 w-full lg:w-auto"
              >
                <Edit3 className="h-5 w-5" />
                <span>Edit Image (10 gems)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showEditImageLimitModal}
        onClose={() => setShowEditImageLimitModal(false)}
        type="edit-image"
      />
    </DashboardLayout>
  )
}

export default EditImagePage
