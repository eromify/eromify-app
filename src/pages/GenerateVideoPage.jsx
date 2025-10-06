import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { Video, ArrowUp } from 'lucide-react'

const GenerateVideoPage = () => {
  const navigate = useNavigate()
  return (
    <DashboardLayout>
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="bg-black border border-gray-700 rounded-xl p-8 max-w-md w-full text-center">
          {/* Video Icon */}
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Video className="h-10 w-10 text-purple-400" />
            </div>
          </div>
          
          {/* Upgrade Required Message */}
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade Required</h2>
          <p className="text-white mb-8 text-sm leading-relaxed">
            Video generation is available exclusively for Launch, Starter, Growth and Professional plan members. Upgrade your plan to unlock this feature and create amazing videos!
          </p>
          
                  {/* Upgrade Button */}
                  <button 
                    onClick={() => navigate('/credits')}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                  >
                    Upgrade Now
                  </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GenerateVideoPage
