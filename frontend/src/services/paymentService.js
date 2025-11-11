import api from '../utils/api'

export const paymentService = {
  // Create checkout session
  createCheckoutSession: async (plan, billing, promoCode = null, additionalData = {}) => {
    console.log('💳 paymentService.createCheckoutSession called with:', { plan, billing, promoCode, additionalData })
    console.log('🌐 Making API call to /payments/create-checkout-session')
    
    try {
      const response = await api.post('/payments/create-checkout-session', {
        plan,
        billing,
        promoCode,
        ...additionalData
      })
      console.log('📨 API response received:', response.data)
      
      if (!response.data.url) {
        throw new Error('No checkout URL received from server')
      }
      
      return response.data
    } catch (error) {
      console.error('❌ Payment service error:', error)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error status:', error.response?.status)
      throw error
    }
  },

  // Get subscription status
  getSubscription: async () => {
    const response = await api.get('/payments/subscription')
    return response.data
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await api.post('/payments/cancel-subscription')
    return response.data
  },

  // Get pricing plans
  getPricingPlans: async () => {
    const response = await api.get('/payments/pricing-plans')
    return response.data
  }
}

export default paymentService