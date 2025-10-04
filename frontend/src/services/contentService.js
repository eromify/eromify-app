import api from '../utils/api'

export const contentService = {
  // Get all content for user
  getContent: async (params = {}) => {
    const response = await api.get('/content', { params })
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

  // Generate AI image
  generateImage: async (imageData) => {
    const response = await api.post('/content/generate-image', imageData)
    return response.data
  },

  // Upscale image
  upscaleImage: async (imageData) => {
    const response = await api.post('/content/upscale-image', imageData)
    return response.data
  },

  // Delete content
  deleteContent: async (id) => {
    const response = await api.delete(`/content/${id}`)
    return response.data
  }
}

export default contentService

