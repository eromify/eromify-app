import api from '../utils/api'

export const analyticsService = {
  // Get dashboard analytics
  getDashboard: async (period = '30d') => {
    const response = await api.get('/analytics/dashboard', {
      params: { period }
    })
    return response.data
  },

  // Get influencer analytics
  getInfluencerAnalytics: async (influencerId) => {
    const response = await api.get(`/analytics/influencer/${influencerId}`)
    return response.data
  },

  // Get usage statistics
  getUsage: async () => {
    const response = await api.get('/analytics/usage')
    return response.data
  }
}

export default analyticsService
