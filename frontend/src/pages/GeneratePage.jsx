import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { Users, Plus, Sparkles } from 'lucide-react'

const GeneratePage = () => {
  const navigate = useNavigate()
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            {/* Large Icon */}
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            
            {/* Main Message */}
            <h2 className="text-2xl font-bold text-white mb-4">No Influencers Available</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You can generate images without an influencer, or create your first AI influencer to enhance your generations.
            </p>
            
            {/* Call to Action Button */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Influencer
            </button>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors">
            <Sparkles className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GeneratePage
