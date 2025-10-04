import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import paymentService from '../services/paymentService'

const GetCreditsPage = () => {
  const [billingToggle, setBillingToggle] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (plan) => {
    try {
      setLoading(true)
      const { url } = await paymentService.createCheckoutSession(plan, billingToggle)
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
              Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Plan
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">Start building your AI influencer empire today</p>
            
            <div className="flex items-center justify-center">
              <div className="bg-gray-900 w-60 p-1 rounded-xl">
                <button
                  onClick={() => setBillingToggle('monthly')}
                  className={`px-8 py-2 text-sm rounded-lg flex-1 transition-all duration-200 ${
                    billingToggle === 'monthly'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingToggle('yearly')}
                  className={`px-8 py-2 text-sm rounded-lg flex-1 transition-all duration-200 ${
                    billingToggle === 'yearly'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Builder Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Builder</h3>
                <p className="text-gray-400 text-sm mb-4">For growing creators</p>
                <div className="mb-2">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$12' : '$9'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-sm">Billed $108 yearly</p>
                )}
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">500 credits/mo</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">1 influencer training</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Standard support</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe('builder')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Get Credits'}
              </button>
            </div>

            {/* Launch Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Launch</h3>
                <p className="text-gray-400 text-sm mb-4">Ready to scale</p>
                <div className="mb-2">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$25' : '$19'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-sm">Billed $228 yearly</p>
                )}
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">2,000 credits/mo</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">2 influencer trainings</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Standard support</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe('launch')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Get Credits'}
              </button>
            </div>

            {/* Growth Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <p className="text-gray-400 text-sm mb-4">Best for businesses</p>
                <div className="mb-2">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$79' : '$65'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-sm">Billed $780 yearly</p>
                )}
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">8,000 credits/mo</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">5 influencer trainings</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center py-2 px-4 bg-gray-900 rounded-lg">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe('growth')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Get Credits'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GetCreditsPage
