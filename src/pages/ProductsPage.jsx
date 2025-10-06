import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import LimitReachedModal from '../components/LimitReachedModal'
import { Plus, Package } from 'lucide-react'

const ProductsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showProductLimitModal, setShowProductLimitModal] = useState(false)

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    // Refresh products list
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Products</h1>
              <p className="text-gray-400">
                Manage your product collection and create new products.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gradient-to-r from-purple-900/20 to-purple-700/20 border border-purple-500/30 text-white px-4 py-2 rounded-lg">
                <Package className="h-5 w-5 mr-2 text-purple-400" />
                <span>0/0 Products</span>
              </div>
              <button 
                onClick={() => setShowProductLimitModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Product
              </button>
            </div>
          </div>

          {/* Empty State - Products */}
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Add your first product to start building your product collection
            </p>
            <button 
              onClick={() => setShowProductLimitModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center mx-auto"
            >
              <Plus className="h-6 w-6 mr-3" />
              Add Your First Product
            </button>
          </div>
        </div>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showProductLimitModal}
        onClose={() => setShowProductLimitModal(false)}
        type="product"
      />
    </DashboardLayout>
  )
}

export default ProductsPage
