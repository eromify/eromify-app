import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import paymentService from '../services/paymentService'
import toast from 'react-hot-toast'

const GetCreditsPage = () => {
  const [billingToggle, setBillingToggle] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (plan) => {
    try {
      setLoading(true)
      const { url } = await paymentService.createCheckoutSession(plan, billingToggle)
      window.location.href = url
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to start payment process')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Plan
              </span>
            </h2>
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
            <div className="bg-black border border-gray-800 rounded-2xl p-10 relative h-full">
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold mb-2">Builder</h3>
                <p className="text-gray-400 text-sm mb-6">For growing creators</p>
                <div className="mb-4">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$12' : '$9'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-xs mb-6">Billed $108 yearly</p>
                )}
                
                {/* Credits - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-2 mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-yellow-400 font-medium text-sm">500 credits</span>
                  </div>
                </div>
                
                {/* Influencer Training - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-2 mb-1">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className="text-purple-400 font-medium text-sm">1 Influencer Training</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Button Above Features */}
              <button 
                onClick={() => handleSubscribe('builder')}
                disabled={loading}
                className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all text-center block mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Credits
              </button>
              
              {/* Separator Line */}
              <div className="border-t border-gray-700 mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">1 Influencer trainings</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">500 credits/month</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Standard support</span>
                </div>
              </div>
            </div>

            {/* Launch Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-10 relative h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 border border-pink-500/50 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg shadow-pink-500/20">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold mb-2">Launch</h3>
                <p className="text-gray-400 text-sm mb-6">Ready to scale</p>
                <div className="mb-4">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$25' : '$19'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-xs mb-6">Billed $228 yearly</p>
                )}
                
                {/* Credits - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-2 mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-yellow-400 font-medium text-sm">2,000 credits</span>
                  </div>
                </div>
                
                {/* Influencer Training - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-2 mb-1">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className="text-purple-400 font-medium text-sm">2 Influencer Trainings</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Button Above Features */}
              <button 
                onClick={() => handleSubscribe('launch')}
                disabled={loading}
                className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all text-center block mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Credits
              </button>
              
              {/* Separator Line */}
              <div className="border-t border-gray-700 mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">2 Influencer trainings</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">2,000 credits/month</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Standard support</span>
                </div>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-10 relative h-full">
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <p className="text-gray-400 text-sm mb-6">Best for businesses</p>
                <div className="mb-4">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$79' : '$65'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-xs mb-6">Billed $780 yearly</p>
                )}
                
                {/* Credits - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-2 mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-yellow-400 font-medium text-sm">8,000 credits</span>
                  </div>
                </div>
                
                {/* Influencer Training - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-2 mb-1">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span className="text-purple-400 font-medium text-sm">5 Influencer Trainings</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Button Above Features */}
              <button 
                onClick={() => handleSubscribe('growth')}
                disabled={loading}
                className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all text-center block mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Credits
              </button>
              
              {/* Separator Line */}
              <div className="border-t border-gray-700 mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">5 Influencer trainings</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">8,000 credits/month</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription Benefit Accumulation Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-800/30 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl flex-shrink-0">📌</span>
              <h3 className="text-xl font-semibold text-white">Subscription Benefit Accumulation</h3>
            </div>
            
            <div className="space-y-4 text-white text-sm leading-relaxed">
              <p>
                Your plan benefits (like training slots and credits) accumulate every month. They do not reset — instead, they are incremented on each renewal.
              </p>
              <p>
                For example, if your plan includes 2 training slots per month, after 2 months you'll have 4 total slots, not just 2.
              </p>
              <p>
                The same applies when you upgrade your plan — you receive the full set of new benefits added on top of your current total. (e.g., if you already have 2 slots and upgrade to a plan with 4/month, your new total becomes 6)
              </p>
              <p>
                This ensures you always keep what you've earned while gaining the full value of your subscription over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GetCreditsPage