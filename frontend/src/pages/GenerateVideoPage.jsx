import DashboardLayout from '../components/DashboardLayout'
import { Video, ArrowUp } from 'lucide-react'

const GenerateVideoPage = () => {
  return (
    <DashboardLayout>
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          {/* Video Icon */}
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Video className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Upgrade Required Message */}
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade Required</h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Video generation is available exclusively for Launch, Starter, Growth and Professional plan members. Upgrade your plan to unlock this feature and create amazing videos!
          </p>
          
          {/* Upgrade Button */}
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center">
            <ArrowUp className="h-5 w-5 mr-2" />
            Upgrade Now
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GenerateVideoPage
