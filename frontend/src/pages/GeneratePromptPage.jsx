import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { MessageSquare, Upload, Lightbulb, Sparkles } from 'lucide-react'

const GeneratePromptPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [customPrompt, setCustomPrompt] = useState('')

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
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              
              {/* Main Message */}
              <h2 className="text-2xl font-bold text-white mb-4">No generated prompts yet</h2>
              <p className="text-gray-400 mb-8">
                Upload an image and generate your first prompt!
              </p>
            </div>
          </div>
          
          {/* Image Upload and Generate Button */}
          <div className="flex justify-center items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload" 
                className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 text-gray-300 hover:border-gray-600 transition-colors cursor-pointer flex items-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose an image to analyze...
              </label>
            </div>
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Prompt
            </button>
          </div>
        </div>

        {/* Right Sidebar - Custom Prompt and Instructions */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
          {/* Custom Prompt Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Custom Prompt</h3>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe this image"
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
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
      </div>
    </DashboardLayout>
  )
}

export default GeneratePromptPage
