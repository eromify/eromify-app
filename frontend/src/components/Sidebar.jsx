import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Compass, 
  Users, 
  Package, 
  Wrench, 
  Sparkles, 
  Video, 
  ArrowUp, 
  Edit3, 
  MessageSquare, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Settings,
  Clock,
  User,
  HelpCircle
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    tools: true,
    payments: true,
    others: true
  })
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const isActive = (path) => location.pathname === path

  const navigationItems = {
    overview: [
      { path: '/dashboard', icon: Compass, label: 'Discover', active: isActive('/dashboard') },
      { path: '/influencers', icon: Users, label: 'Influencers', active: isActive('/influencers') },
      { path: '/products', icon: Package, label: 'Products', active: isActive('/products') },
      { path: '/tools', icon: Wrench, label: 'Tools', active: isActive('/tools') }
    ],
    tools: [
      { path: '/generate', icon: Sparkles, label: 'Generate', active: isActive('/generate') },
      { path: '/generate-video', icon: Video, label: 'Generate Video', active: isActive('/generate-video') },
      { path: '/upscale', icon: ArrowUp, label: 'Upscale', active: isActive('/upscale') },
      { path: '/edit-image', icon: Edit3, label: 'Edit Image', active: isActive('/edit-image') },
      { path: '/generate-prompt', icon: MessageSquare, label: 'Generate Prompt', active: isActive('/generate-prompt') },
      { path: '/tools', icon: ChevronRight, label: 'View All', active: false }
    ],
    payments: [
      { path: '/credits', icon: DollarSign, label: 'Get Credits', active: isActive('/credits') },
      { path: '/subscriptions', icon: Settings, label: 'Manage Subscriptions', active: isActive('/subscriptions') }
    ],
    others: [
      { path: '/support', icon: HelpCircle, label: 'Support', active: isActive('/support') }
    ]
  }

  const NavItem = ({ item, isCollapsed }) => (
    <button
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 rounded-lg mb-1 ${
        item.active 
          ? 'bg-purple-500 text-white' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`}
    >
      <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
    </button>
  )

  const NavSection = ({ title, items, sectionKey }) => (
    <div className="mb-6">
      {!isCollapsed && (
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
          {expandedSections[sectionKey] ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      )}
      
      {(!isCollapsed && expandedSections[sectionKey]) || isCollapsed ? (
        <div className="space-y-1">
          {items.map((item, index) => (
            <NavItem key={index} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <div className={`bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                Eromify
              </h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 border border-gray-400 rounded"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 overflow-y-auto">
        <NavSection 
          title="Overview" 
          items={navigationItems.overview} 
          sectionKey="overview" 
        />
        
        <NavSection 
          title="Tools" 
          items={navigationItems.tools} 
          sectionKey="tools" 
        />
        
        <NavSection 
          title="Payments" 
          items={navigationItems.payments} 
          sectionKey="payments" 
        />
        
        <NavSection 
          title="Others" 
          items={navigationItems.others} 
          sectionKey="others" 
        />
      </div>

      {/* User Account Section */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">user@example.com</div>
                <div className="text-xs text-purple-400">FREE</div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          {!isCollapsed && (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
