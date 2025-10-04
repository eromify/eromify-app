import api from '../utils/api'

export const paymentService = {
  // Create checkout session
  createCheckoutSession: async (plan, billing, promoCode = '') => {
    const response = await api.post('/payments/create-checkout-session', {
      plan,
      billing,
      promoCode
    })
    return response.data
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