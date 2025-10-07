import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import LimitReachedModal from '../components/LimitReachedModal'
import { MessageSquare, Upload, Lightbulb, Sparkles } from 'lucide-react'

const GeneratePromptPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showGeneratePromptLimitModal, setShowGeneratePromptLimitModal] = useState(false)
  const [showImageLimitModal, setShowImageLimitModal] = useState(false)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
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
                    <MessageSquare className="h-10 w-10 text-purple-400" />
                  </div>
                </div>
                
                {/* Main Message */}
                <h2 className="text-2xl font-bold text-white mb-4">No generated prompts yet</h2>
                <p className="text-white mb-8 text-sm leading-relaxed">
                  Upload an image and generate your first prompt!
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Custom Prompt and Instructions */}
          <div className="w-full lg:w-80 bg-black border border-gray-900 lg:border-l rounded-lg lg:rounded-none p-6 mt-6 lg:mt-0">
          {/* Custom Prompt Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Custom Prompt</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe this image"
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg py-1 px-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none text-sm"
            />
            <p className="text-gray-400 text-xs mt-2">
              Customize how you want the AI to analyze the image
            </p>
          </div>

          {/* How to use Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              How to use:
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Use this tool to generate prompts from real images of influencers which you can then use in the generate tab to create the same images (to an extent) with your own influencers. The prompt generated only applies for Flux generations. Prompt generated isn't guaranteed to work all the time, try in batches of 4 while generating and pick best results.
            </p>
          </div>
        </div>

          {/* Bottom Buttons */}
          <div className="mt-6 lg:mt-0">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowImageLimitModal(true)}
                className="bg-black border border-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center w-full sm:w-auto"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose an image to analyse
              </button>
              <button 
                onClick={() => setShowGeneratePromptLimitModal(true)}
                className="bg-black border border-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center w-full sm:w-auto"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate prompt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Limit Reached Modals */}
      <LimitReachedModal
        isOpen={showGeneratePromptLimitModal}
        onClose={() => setShowGeneratePromptLimitModal(false)}
        type="generate-prompt"
      />
      <LimitReachedModal
        isOpen={showImageLimitModal}
        onClose={() => setShowImageLimitModal(false)}
        type="image"
      />
    </DashboardLayout>
  )
}

export default GeneratePromptPage
