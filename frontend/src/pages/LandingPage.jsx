import { useState } from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const [billingToggle, setBillingToggle] = useState('monthly')
  const [openFAQ, setOpenFAQ] = useState(null)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <img src="/logo.png" alt="Eromify" className="h-40 w-auto" />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#pricing" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Pricing</a>
                <a href="#faq" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">FAQ</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-left px-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
            The Future of AI Influencers
          </div>
          
          <h1 className="text-6xl md:text-8xl font-medium mb-6">
            Create Your<br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent relative">
              AI Influencer
              <svg className="absolute -bottom-2 left-0 w-full h-8" viewBox="0 0 400 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M20 25 Q200 4 380 25" stroke="url(#gradient)" strokeWidth="6" fill="none"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f472b6"/>
                    <stop offset="100%" stopColor="#93c5fd"/>
                  </linearGradient>
                </defs>
              </svg>
            </span><br />
            Empire
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl">
            Build, customize and monetize stunning AI personas that look and sound like real influencers. 
            Create authentic UGC ads that drive <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent font-medium">3x higher</span> conversion rates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-start mb-8">
            <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-500 transition-all text-center">
              Create Your AI Persona
            </Link>
            <a href="#how-it-works" className="border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all">
              How It Works
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <img src="/11.jpeg" alt="Creator 1" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                <img src="/12.png" alt="Creator 2" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
                <img src="/13.png" alt="Creator 3" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
              </div>
              <span className="ml-3">1,000+ creators already building</span>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                ★★★★★
              </div>
              <span className="ml-2">4.9/5 from 500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">
              Everything You Need to<br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black border border-gray-600 rounded-2xl p-8 py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Persona Creation</h3>
              <p className="text-gray-400">
                Build stunning AI influencers with custom appearances, voices, and personalities that resonate with your audience.
              </p>
            </div>
            
            <div className="bg-black border border-gray-600 rounded-2xl p-8 py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16h8V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Content Generation</h3>
              <p className="text-gray-400">
                Generate engaging posts, videos, and UGC ads that drive conversions and build authentic connections.
              </p>
            </div>
            
            <div className="bg-black border border-gray-600 rounded-2xl p-8 py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Monetization</h3>
              <p className="text-gray-400">
                Turn your AI influencers into revenue streams with brand partnerships, affiliate marketing, and digital products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">
              How{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Eromify Works
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Build your AI influencer empire with our intuitive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Step 1 */}
            <div className="space-y-6">
              <div className="w-16 h-16 bg-black border border-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">01</span>
              </div>
              <h3 className="text-xl font-semibold">Create Your AI Persona</h3>
              <p className="text-gray-400">
                Design your AI influencer with custom appearance, voice, and personality traits that match your brand.
              </p>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-pink-950 to-purple-900 rounded-3xl flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <button className="bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Step 01
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-6">
              <div className="w-16 h-16 bg-black border border-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">02</span>
              </div>
              <h3 className="text-xl font-semibold">Generate Content</h3>
              <p className="text-gray-400">
                Create engaging posts, videos, and UGC ads using our AI-powered content generation tools.
              </p>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-pink-950 to-purple-900 rounded-3xl flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <button className="bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Step 02
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-6">
              <div className="w-16 h-16 bg-black border border-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">03</span>
              </div>
              <h3 className="text-xl font-semibold">Scale Your Reach</h3>
              <p className="text-gray-400">
                Deploy your AI influencer across multiple platforms and reach thousands of potential customers.
              </p>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-pink-950 to-purple-900 rounded-3xl flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <button className="bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Step 03
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-6">
              <div className="w-16 h-16 bg-black border border-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">04</span>
              </div>
              <h3 className="text-xl font-semibold">Monetize & Grow</h3>
              <p className="text-gray-400">
                Turn your AI influencer into a revenue stream with brand deals, affiliate marketing, and more.
              </p>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-pink-950 to-purple-900 rounded-3xl flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <button className="bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Step 04
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
              Pricing
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Transparent{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Choose the perfect plan to start building your AI influencer empire. No hidden fees, cancel anytime.
            </p>
            
            <div className="flex items-center justify-center mb-16">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 w-80 p-1 rounded-2xl">
                <button
                  onClick={() => setBillingToggle('monthly')}
                  className={`px-8 py-3 text-sm rounded-xl flex-1 transition-all duration-300 font-medium ${
                    billingToggle === 'monthly'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingToggle('yearly')}
                  className={`px-8 py-3 text-sm rounded-xl flex-1 transition-all duration-300 font-medium relative ${
                    billingToggle === 'yearly'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Save 25%
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Builder Plan */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 mb-4">
                  Starter
                </div>
                <h3 className="text-2xl font-bold mb-2">Builder</h3>
                <p className="text-gray-400 mb-6">Perfect for getting started</p>
                <div className="mb-4">
                  <span className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    {billingToggle === 'monthly' ? '$12' : '$9'}
                  </span>
                  <span className="text-gray-400 text-lg ml-2">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-green-400 text-sm font-medium">Save $36/year</p>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">500 credits/month</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">1 AI influencer training</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Image & video generation</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Content templates</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Email support</span>
                </div>
              </div>
              
              <Link to="/register" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all text-center block shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105">
                Start Building
              </Link>
            </div>

            {/* Launch Plan - Featured */}
            <div className="group relative bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm border-2 border-pink-500/50 rounded-3xl p-8 hover:border-pink-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 transform lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-pink-500/25">
                  ⭐ Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-500/50 text-pink-300 mb-4">
                  Professional
                </div>
                <h3 className="text-2xl font-bold mb-2">Launch</h3>
                <p className="text-gray-300 mb-6">For serious creators</p>
                <div className="mb-4">
                  <span className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    {billingToggle === 'monthly' ? '$25' : '$19'}
                  </span>
                  <span className="text-gray-400 text-lg ml-2">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-green-400 text-sm font-medium">Save $72/year</p>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">2,000 credits/month</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">2 AI influencer trainings</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Advanced video generation</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Voice cloning</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Priority support</span>
                </div>
              </div>
              
              <Link to="/register" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all text-center block shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105">
                Launch Now
              </Link>
            </div>

            {/* Growth Plan */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 mb-4">
                  Enterprise
                </div>
                <h3 className="text-2xl font-bold mb-2">Growth</h3>
                <p className="text-gray-400 mb-6">For agencies & businesses</p>
                <div className="mb-4">
                  <span className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                    {billingToggle === 'monthly' ? '$79' : '$65'}
                  </span>
                  <span className="text-gray-400 text-lg ml-2">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-green-400 text-sm font-medium">Save $168/year</p>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">8,000 credits/month</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">5 AI influencer trainings</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Unlimited generations</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">White-label options</span>
                </div>
                <div className="flex items-center py-3 px-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Dedicated support</span>
                </div>
              </div>
              
              <Link to="/register" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all text-center block shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105">
                Scale Up
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">All plans include 14-day free trial • Cancel anytime • No setup fees</p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                SSL Security
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-300">Everything you need to know about Eromify</p>
          </div>
          
          <div className="space-y-3">
            <div className={`bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${openFAQ === 1 ? 'border-gray-600 shadow-lg' : 'hover:border-gray-600 hover:shadow-lg'}`}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                className="w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-300 hover:bg-gray-800/50"
              >
                <span className="text-xl font-medium text-white pr-4">What is Eromify?</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === 1 ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-300 ${openFAQ === 1 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 1 && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Eromify is a platform for creating, customizing, and monetizing AI influencers. Our technology allows you to build virtual personas that can generate content, engage with audiences, and create authentic UGC ads that drive conversions.
                  </p>
                </div>
              )}
            </div>

            <div className={`bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${openFAQ === 2 ? 'border-gray-600 shadow-lg' : 'hover:border-gray-600 hover:shadow-lg'}`}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                className="w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-300 hover:bg-gray-800/50"
              >
                <span className="text-xl font-medium text-white pr-4">Do I need technical skills to use Eromify?</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === 2 ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-300 ${openFAQ === 2 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 2 && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Not at all! Our platform is designed for creators and brands of all sizes with an intuitive step-by-step process - no coding or technical expertise required.
                  </p>
                </div>
              )}
            </div>

            <div className={`bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${openFAQ === 3 ? 'border-gray-600 shadow-lg' : 'hover:border-gray-600 hover:shadow-lg'}`}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                className="w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-300 hover:bg-gray-800/50"
              >
                <span className="text-xl font-medium text-white pr-4">How much can I earn with my AI influencer?</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === 3 ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-300 ${openFAQ === 3 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 3 && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Earnings vary based on your niche and content strategy. Our top creators earn $5,000-$10,000 monthly through brand deals, UGC ads, and digital product sales, with UGC ads typically driving 3-5x higher conversion rates.
                  </p>
                </div>
              )}
            </div>

            <div className={`bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${openFAQ === 4 ? 'border-gray-600 shadow-lg' : 'hover:border-gray-600 hover:shadow-lg'}`}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}
                className="w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-300 hover:bg-gray-800/50"
              >
                <span className="text-xl font-medium text-white pr-4">Is creating AI influencers ethical?</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === 4 ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-300 ${openFAQ === 4 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 4 && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Eromify promotes ethical AI creation. We recommend clearly disclosing AI-generated content when required by platform policies, and we provide tools to ensure transparency with your audience.
                  </p>
                </div>
              )}
            </div>

            <div className={`bg-gray-950 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${openFAQ === 5 ? 'border-gray-600 shadow-lg' : 'hover:border-gray-600 hover:shadow-lg'}`}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 5 ? null : 5)}
                className="w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-300 hover:bg-gray-800/50"
              >
                <span className="text-xl font-medium text-white pr-4">Can I create both influencer content and UGC ads?</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFAQ === 5 ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-300 ${openFAQ === 5 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 5 && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Yes! You can create multiple AI influencers for different purposes - from building an influencer presence to generating authentic UGC ads for various products and brands.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-black border border-gray-600 rounded-2xl p-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black border border-pink-400 text-white mb-6">
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Ready to Build Your{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                AI Influencer Empire?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators and brands already succeeding with their AI influencers and UGC ads. 
              Get started today with 50% off your first month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started Today
              </Link>
              <a href="#pricing" className="bg-transparent border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all text-center">
                See Pricing
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage