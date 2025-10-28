import api from '../utils/api'

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData)
    return response.data
  },

  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/users/dashboard')
    return response.data
  },

  // Get subscription info
  getSubscription: async () => {
    const response = await api.get('/users/subscription')
    return response.data
  }
}

export default userService










