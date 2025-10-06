import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { CreditCard } from 'lucide-react'

const ManageSubscriptionPage = () => {
  const navigate = useNavigate()
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Manage Subscriptions</h1>
            <p className="text-gray-400">
              View and manage your active subscriptions. You can cancel subscriptions at any time.
            </p>
          </div>

          {/* No Subscriptions Found */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              {/* Large Icon */}
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center">
                  <CreditCard className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              
              {/* Main Message */}
              <h2 className="text-2xl font-bold text-white mb-4">No Subscriptions Found</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You don't have any active subscriptions yet.
              </p>
              
              {/* Call to Action Button */}
              <button 
                onClick={() => navigate('/credits')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Browse Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageSubscriptionPage
