import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { 
  Edit3, 
  Image, 
  ArrowUp, 
  Video, 
  Package, 
  Sparkles
} from 'lucide-react'

const ToolsPage = () => {
  const navigate = useNavigate()
  
  const tools = [
    {
      id: 1,
      name: 'AI Image Editor',
      description: 'Edit and enhance your images with AI',
      icon: Edit3,
      color: 'purple',
      route: '/edit-image'
    },
    {
      id: 2,
      name: 'AI Image Generator',
      description: 'Generate stunning images from text',
      icon: Image,
      color: 'blue',
      route: '/generate'
    },
    {
      id: 3,
      name: 'AI Upscaler',
      description: 'Enhance image resolution and quality',
      icon: ArrowUp,
      color: 'green',
      route: '/upscale'
    },
    {
      id: 4,
      name: 'AI Video Generator',
      description: 'Create videos from images and text',
      icon: Video,
      color: 'orange',
      route: '/generate-video'
    },
    {
      id: 5,
      name: 'Generate Product',
      description: 'Create product images and mockups',
      icon: Package,
      color: 'green',
      route: '/products'
    },
    {
      id: 6,
      name: 'Generate Prompt',
      description: 'Create AI prompts for better results',
      icon: Sparkles,
      color: 'purple',
      route: '/generate-prompt'
    }
  ]


  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Tools</h1>
              <p className="text-gray-400">
                Powerful AI tools to enhance your content creation.
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              
              return (
                <div 
                  key={tool.id} 
                  onClick={() => navigate(tool.route)}
                  className="bg-black border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ToolsPage
