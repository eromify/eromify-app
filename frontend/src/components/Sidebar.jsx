import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Compass, 
  Users, 
  Sparkles, 
  Video, 
  ChevronDown,
  ChevronUp,
  DollarSign,
  Settings,
  User,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    tools: true,
    payments: true,
    others: true
  })
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const userSectionRef = useRef(null)

  // Close sign out dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userSectionRef.current && !userSectionRef.current.contains(event.target)) {
        setShowSignOut(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const isActive = (path) => location.pathname === path

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const navigationItems = {
    overview: [
      { path: '/dashboard', icon: Compass, label: 'Discover', active: isActive('/dashboard') },
      { path: '/influencers', icon: Users, label: 'Influencers', active: isActive('/influencers') }
    ],
    tools: [
      { path: '/generate', icon: Sparkles, label: 'Generate Images', active: isActive('/generate') },
      { path: '/generate-video', icon: Video, label: 'Generate Video', active: isActive('/generate-video') }
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
      onClick={() => {
        navigate(item.path)
        // Close sidebar on mobile after navigation
        onClose()
      }}
              className={`w-full flex items-center px-3 py-2 text-left transition-all duration-200 rounded-lg mb-1 ${
        item.active 
          ? 'bg-gradient-to-l from-purple-900 to-[#601a2f] text-white' 
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
            <div className={`bg-black border-r border-gray-900 flex flex-col transition-all duration-300 h-screen ${
              isCollapsed ? 'w-16' : 'w-56'
            } ${
              // Mobile: show/hide based on isOpen prop, desktop: always fixed
              isOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0'
            }`}>
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-gray-900 flex-shrink-0">
        {!isCollapsed && <img src="/logo copy.png" alt="Eromify" className="h-7 w-auto" />}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 border border-gray-400 rounded"></div>
            </div>
          </button>
        )}
        
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="ml-auto p-1 text-gray-400 hover:text-white transition-colors lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Desktop collapse button */}
        {!isCollapsed && (
          <div className="hidden lg:flex flex-1 justify-end">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 border border-gray-400 rounded"></div>
              </div>
            </button>
          </div>
        )}
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

              {/* User Account Section - Fixed at bottom */}
              <div className="mt-auto p-4 border-t border-gray-900 bg-black flex-shrink-0">
        {!isCollapsed && (
          <div className="relative" ref={userSectionRef}>
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
              onClick={() => setShowSignOut(!showSignOut)}
            >
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {user?.email ? `${user.email.substring(0, 10)}...` : 'user@exam...'}
                </div>
                <div className="text-xs text-purple-400">FREE</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            
            {showSignOut && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-black border border-gray-700 rounded-lg p-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
