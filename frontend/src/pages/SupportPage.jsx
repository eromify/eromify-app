import DashboardLayout from '../components/DashboardLayout'
import { Mail, MessageCircle } from 'lucide-react'

const SupportPage = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Support Card */}
          <div className="bg-black border border-gray-800 rounded-2xl p-8 text-center">
            {/* Large Icon */}
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            
            {/* Main Message */}
            <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We're here to assist you with any questions or concerns
            </p>
            
            {/* Contact Support Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Support</h3>
              <p className="text-gray-400 mb-6">
                Send us an email and we'll get back to you as soon as possible
              </p>
              
              {/* Contact Info */}
              <div className="flex items-center justify-center text-purple-400">
                <Mail className="h-5 w-5 mr-2" />
                <span>support@eromify.com</span>
              </div>
            </div>
            
            {/* Response Time */}
            <p className="text-gray-400 text-sm">
              Response Time: Usually within 24 hours
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SupportPage
