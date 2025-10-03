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
  const tools = [
    {
      id: 1,
      name: 'AI Image Editor',
      description: 'Edit and enhance your images with AI',
      icon: Edit3,
      color: 'purple'
    },
    {
      id: 2,
      name: 'AI Image Generator',
      description: 'Generate stunning images from text',
      icon: Image,
      color: 'blue'
    },
    {
      id: 3,
      name: 'AI Upscaler',
      description: 'Enhance image resolution and quality',
      icon: ArrowUp,
      color: 'green'
    },
    {
      id: 4,
      name: 'AI Video Generator',
      description: 'Create videos from images and text',
      icon: Video,
      color: 'orange'
    },
    {
      id: 5,
      name: 'Generate Product',
      description: 'Create product images and mockups',
      icon: Package,
      color: 'green'
    },
    {
      id: 6,
      name: 'Generate Prompt',
      description: 'Create AI prompts for better results',
      icon: Sparkles,
      color: 'purple'
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
              const iconColors = {
                purple: 'bg-purple-500/20 text-purple-400',
                blue: 'bg-purple-500/20 text-purple-400', 
                green: 'bg-green-500/20 text-green-400',
                orange: 'bg-orange-500/20 text-orange-400',
                pink: 'bg-pink-500/20 text-pink-400',
                indigo: 'bg-indigo-500/20 text-indigo-400'
              }
              
              return (
                <div 
                  key={tool.id} 
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 ${iconColors[tool.color]} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6" />
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
