import api from '../utils/api'

export const influencerService = {
  // Get all influencers for user
  getInfluencers: async () => {
    const response = await api.get('/influencers')
    return response.data
  },

  // Get single influencer
  getInfluencer: async (id) => {
    const response = await api.get(`/influencers/${id}`)
    return response.data
  },

  // Create new influencer
  createInfluencer: async (influencerData) => {
    const response = await api.post('/influencers', influencerData)
    return response.data
  },

  // Update influencer
  updateInfluencer: async (id, influencerData) => {
    const response = await api.put(`/influencers/${id}`, influencerData)
    return response.data
  },

  // Delete influencer
  deleteInfluencer: async (id) => {
    const response = await api.delete(`/influencers/${id}`)
    return response.data
  }
}

export default influencerService




