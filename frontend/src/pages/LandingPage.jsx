import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const LandingPage = () => {
  const [billingToggle, setBillingToggle] = useState('monthly')
  const [openFAQ, setOpenFAQ] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Home</Link>
                <Link to="/marketplace" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Marketplace</Link>
                <a href="#features" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#pricing" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Pricing</a>
                <Link to="/affiliate" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Affiliate</Link>
                <a href="#faq" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">FAQ</a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
            {/* Mobile buttons and menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/marketplace" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Marketplace</Link>
              <a href="#features" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Features</a>
              <a href="#pricing" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
              <Link to="/affiliate" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Affiliate</Link>
              <a href="#faq" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">FAQ</a>
            </div>
          </div>
        )}
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

      {/* Video Section */}
      <section className="-mt-12 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
            <video 
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            >
              <source src="/Hero-Landing-Video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">Features</p>
            <h2 className="text-5xl md:text-6xl font-semibold mb-4">
              Built for <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">PPV Money</span>
            </h2>
            <p className="text-lg text-gray-400">
              Every feature designed to maximize your content earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Model Marketplace */}
            <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
              <div className="h-[18.5rem] overflow-hidden">
                <img 
                  src="/marketplace.webp" 
                  alt="AI Model Marketplace" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6 pt-10">
                <h3 className="text-xl font-semibold mb-2">70+ Marketplace Models</h3>
                <p className="text-gray-400 text-sm">
                  Pre-trained models ready to use. No training, no waiting. Start earning immediately.
                </p>
              </div>
            </div>

            {/* SDXL + Flux + Latest Models */}
            <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
              <img 
                src="/generation-screenshot.webp" 
                alt="SDXL + Flux + Latest Models" 
                className="w-full h-auto"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">SDXL + Flux + Latest Models</h3>
                <p className="text-gray-400 text-sm">
                  Premium AI models with custom workflows built-in. No ComfyUI complexity, just click and create with the industry's best technology.
                </p>
              </div>
            </div>

            {/* Skin Upscale */}
            <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
              <img 
                src="/skin-upscale.webp" 
                alt="Skin Upscale" 
                className="w-full h-auto"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Skin Upscale</h3>
                <p className="text-gray-400 text-sm">
                  Generate crystal-clear images with perfect skin details. Every image comes out premium-quality and subscription-ready.
                </p>
              </div>
            </div>

            {/* Advanced Video Generation */}
            <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
              <img 
                src="/video-generation.webp" 
                alt="Advanced Video Generation" 
                className="w-full h-auto"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Advanced Video Generation</h3>
                <p className="text-gray-400 text-sm">
                  Turn static images into engaging videos with Kling, Wan, and the latest models. Create content that converts viewers to subscribers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">Showcase</p>
            <h2 className="text-5xl md:text-6xl font-semibold mb-4">
              Quality That <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">Sells</span>
            </h2>
            <p className="text-lg text-gray-400">
              The same quality your subscribers pay $50+ for.
            </p>
          </div>

          {/* Showcase Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="/showcase1.webp" 
                alt="Quality Showcase 1" 
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="/showcase2.webp" 
                alt="Quality Showcase 2" 
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="/showcase3.webp" 
                alt="Quality Showcase 3" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <p className="text-lg text-gray-300 mb-6">
              Ready to create content that sells for $50+ per PPV?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace" className="bg-black border border-gray-600 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-900 transition-all">
                View All Models
              </Link>
              <Link to="/register" className="bg-transparent border border-purple-500 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-900/20 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">How It Works</p>
            <h2 className="text-5xl md:text-6xl font-semibold mb-4">
              Start Earning in <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">3 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-400">
              From selection to monetization in minutes.
            </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            {/* Step 1 - Text Left, Image Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="md:pl-12 text-center md:text-left">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-3xl mb-6 mx-auto md:mx-0">🛍️</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Choose Your Model</h3>
                <p className="text-gray-400 text-base md:text-lg">
                  Select from 70+ pre-trained AI models or create your own custom influencer persona.
                </p>
              </div>
              <div>
                <img 
                  src="/marketplace.webp" 
                  alt="Step 1" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>

            {/* Step 2 - Image Left, Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <img 
                  src="/step2-create-content.webp" 
                  alt="Step 2" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <div className="order-1 md:order-2 md:pl-12 text-center md:text-left">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-3xl mb-6 mx-auto md:mx-0">✨</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Generate Content</h3>
                <p className="text-gray-400 text-base md:text-lg">
                  Create premium-quality images and videos with our advanced AI technology.
                </p>
              </div>
            </div>

            {/* Step 3 - Text Left, Image Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="md:pl-12 text-center md:text-left">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-3xl mb-6 mx-auto md:mx-0">💰</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Monetize & Profit</h3>
                <p className="text-gray-400 text-base md:text-lg">
                  Sell your content for $50+ per PPV and start earning immediately.
                </p>
              </div>
              <div>
                <img 
                  src="/step3-export-monetize.webp" 
                  alt="Step 3" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Numbers Work Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">The Math</p>
            <h2 className="text-5xl md:text-6xl font-semibold mb-4">
              The <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">Numbers</span> Work
            </h2>
            <p className="text-lg text-gray-400">
              Quick breakeven math with conservative assumptions.
            </p>
          </div>

          {/* Two Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Your Investment */}
            <div className="bg-black border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-8">Your Investment</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Creator plan</span>
                  <span className="text-white font-medium">$29/mo</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Time to first content</span>
                  <span className="text-white font-medium">~5 minutes</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Learning curve</span>
                  <span className="text-white font-medium">Minimal</span>
                </div>
                
                <div className="border-t border-gray-800 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total monthly cost</span>
                    <span className="text-white font-bold text-xl">$29</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Returns */}
            <div className="bg-black border border-gray-800 rounded-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Your Returns</h3>
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ~1 sale to break even
                </span>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average PPV price</span>
                  <span className="text-white font-medium">$50</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">PPVs to break even</span>
                  <span className="text-white font-medium">1 sale</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Typical monthly</span>
                  <span className="text-white font-medium">60+ sales</span>
                </div>
                
                <div className="border-t border-gray-800 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Potential monthly</span>
                    <span className="text-white font-bold text-xl">$3,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Based on average creator performance. Individual results vary and are not guaranteed.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">Pricing</p>
            <h2 className="text-5xl md:text-6xl font-semibold mb-4">
              Pay as you{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                grow
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-12">Credits that scale with your business. No hidden fees.</p>
            
            <div className="flex items-center justify-center">
              <div className="bg-gray-900 w-60 p-1 rounded-xl">
                <button
                  onClick={() => setBillingToggle('monthly')}
                  className={`px-8 py-2 text-sm rounded-lg flex-1 transition-all duration-200 ${
                    billingToggle === 'monthly'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingToggle('yearly')}
                  className={`px-8 py-2 text-sm rounded-lg flex-1 transition-all duration-200 ${
                    billingToggle === 'yearly'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Builder Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-10 relative h-full">
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold mb-2">Builder</h3>
                <p className="text-gray-400 text-sm mb-6">For growing creators</p>
                <div className="mb-4">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$15' : '$12'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-xs mb-6">Billed $144 yearly</p>
                )}
                
                {/* Credits - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-2 mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-yellow-400 font-medium text-sm">500 credits</span>
                  </div>
                </div>
                
            {/* Influencer Training - Prominent like CelebifyAI */}
            <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-2 mb-1">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-purple-400 font-medium text-sm">1 Influencer Training</span>
              </div>
            </div>
          </div>
          
          {/* CTA Button Above Features */}
              <Link to="/register" className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all text-center block mb-8">
                Get Credits
              </Link>
              
              {/* Separator Line */}
              <div className="border-t border-gray-700 mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">1 Influencer trainings</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">500 credits/month</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Standard support</span>
                </div>
              </div>
            </div>

            {/* Launch Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-10 relative h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 border border-pink-500/50 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg shadow-pink-500/20">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold mb-2">Launch</h3>
                <p className="text-gray-400 text-sm mb-6">Ready to scale</p>
                <div className="mb-4">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$29' : '$23'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-xs mb-6">Billed $276 yearly</p>
                )}
                
                {/* Credits - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-2 mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-yellow-400 font-medium text-sm">2,000 credits</span>
                  </div>
                </div>
                
            {/* Influencer Training - Prominent like CelebifyAI */}
            <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-2 mb-1">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-purple-400 font-medium text-sm">2 Influencer Trainings</span>
              </div>
            </div>
          </div>
          
          {/* CTA Button Above Features */}
              <Link to="/register" className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all text-center block mb-8">
                Get Credits
              </Link>
              
              {/* Separator Line */}
              <div className="border-t border-gray-700 mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">2 Influencer trainings</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">2,000 credits/month</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Standard support</span>
                </div>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="bg-black border border-gray-800 rounded-2xl p-10 relative h-full">
              <div className="text-center mb-10">
                <h3 className="text-xl font-semibold mb-2">Growth</h3>
                <p className="text-gray-400 text-sm mb-6">Best for businesses</p>
                <div className="mb-4">
                  <span className="text-5xl font-semibold">
                    {billingToggle === 'monthly' ? '$79' : '$65'}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                {billingToggle === 'yearly' && (
                  <p className="text-gray-400 text-xs mb-6">Billed $780 yearly</p>
                )}
                
                {/* Credits - Prominent like CelebifyAI */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 rounded-lg p-2 mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-yellow-400 font-medium text-sm">8,000 credits</span>
                  </div>
                </div>
                
            {/* Influencer Training - Prominent like CelebifyAI */}
            <div className="bg-gradient-to-r from-purple-900/20 to-purple-700/20 rounded-lg p-2 mb-1">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-purple-400 font-medium text-sm">5 Influencer Trainings</span>
              </div>
            </div>
          </div>
          
          {/* CTA Button Above Features */}
              <Link to="/register" className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all text-center block mb-8">
                Get Credits
              </Link>
              
              {/* Separator Line */}
              <div className="border-t border-gray-700 mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">5 Influencer trainings</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">8,000 credits/month</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Image & video generation</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Video face swap</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Priority support</span>
                </div>
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
                24/7 support
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage