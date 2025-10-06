import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Sparkles, Copy, Trash2, FileText, Search } from 'lucide-react'

const ContentPage = () => {
  const [content, setContent] = useState([])
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInfluencer, setSelectedInfluencer] = useState('')

  useEffect(() => {
    fetchContent()
    fetchInfluencers()
  }, [])

  const fetchContent = async () => {
    try {
      const params = selectedInfluencer ? { influencerId: selectedInfluencer } : {}
      const response = await api.get('/content', { params })
      if (response.data.success) {
        setContent(response.data.content)
      }
    } catch (error) {
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const fetchInfluencers = async () => {
    try {
      const response = await api.get('/influencers')
      if (response.data.success) {
        setInfluencers(response.data.influencers)
      }
    } catch (error) {
      console.error('Failed to fetch influencers:', error)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Content copied to clipboard!')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const response = await api.delete(`/content/${id}`)
        if (response.data.success) {
          toast.success('Content deleted successfully')
          fetchContent()
        }
      } catch (error) {
        toast.error('Failed to delete content')
      }
    }
  }

  const filteredContent = content.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.influencers?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generated Content</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage your AI-generated content.
            </p>
          </div>
          <button className="btn-primary flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Content
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={selectedInfluencer}
            onChange={(e) => setSelectedInfluencer(e.target.value)}
            className="input sm:w-48"
          >
            <option value="">All Influencers</option>
            {influencers.map((influencer) => (
              <option key={influencer.id} value={influencer.id}>
                {influencer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content List */}
        {filteredContent.length > 0 ? (
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                        {item.content_type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.platform}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {item.tone}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{item.topic}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by <span className="font-medium">{item.influencers?.name}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleCopy(item.content)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy content"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete content"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{item.content}</p>
                </div>
                
                {item.additional_context && (
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500">Additional Context:</span>
                    <p className="text-xs text-gray-600 mt-1">{item.additional_context}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Generated {new Date(item.created_at).toLocaleDateString()}</span>
                  <span>{new Date(item.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedInfluencer ? 'Try adjusting your filters.' : 'Start generating content for your influencers.'}
            </p>
            {!searchTerm && !selectedInfluencer && (
              <div className="mt-6">
                <button className="btn-primary">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ContentPage



