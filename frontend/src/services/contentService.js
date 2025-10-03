import api from '../utils/api'

export const contentService = {
  // Get all content for user
  getContent: async () => {
    const response = await api.get('/content')
    return response.data
  },

  // Get single content item
  getContentItem: async (id) => {
    const response = await api.get(`/content/${id}`)
    return response.data
  },

  // Generate new content
  generateContent: async (contentData) => {
    const response = await api.post('/content/generate', contentData)
    return response.data
  },

  // Update content
  updateContent: async (id, contentData) => {
    const response = await api.put(`/content/${id}`, contentData)
    return response.data
  },

  // Delete content
  deleteContent: async (id) => {
    const response = await api.delete(`/content/${id}`)
    return response.data
  }
}

export default contentService
