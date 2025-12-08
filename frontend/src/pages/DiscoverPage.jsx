import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { trackViewContent } from '../utils/metaPixel';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceModels } from '../data/marketplaceModels';
import { saveReturnPath } from '../utils/redirectHelper';

const DiscoverPage = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentInfluencerIndex, setCurrentInfluencerIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Age verification - check sessionStorage (shows once per browser session)
  const [showAgeVerification, setShowAgeVerification] = useState(() => {
    if (typeof window === 'undefined') return true;
    const verified = window.sessionStorage.getItem('discoverAgeVerified');
    return verified !== 'true';
  });

  const handleAgeVerification = (isAdult) => {
    if (isAdult) {
      window.sessionStorage.setItem('discoverAgeVerified', 'true');
      setShowAgeVerification(false);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };


  // Track ViewContent when discover page loads
  useEffect(() => {
    trackViewContent({
      contentName: 'AI Influencer Discover',
      contentCategory: 'Discover',
      value: 0,
      currency: 'USD',
      userEmail: user?.email
    });
  }, [user?.email]);

  // Use shared models data - order can be changed in /src/data/marketplaceModels.js
  // Filter out archived/blacked-out models
  const models = marketplaceModels.filter(model => !model.isBlackedOut);

  const nextImage = () => {
    if (selectedModel) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedModel.images.length);
    }
  };

  const prevImage = () => {
    if (selectedModel) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedModel.images.length) % selectedModel.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Age Verification Modal Overlay */}
      {showAgeVerification && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[99999]" />
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-black/90 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-12 max-w-md w-full text-center shadow-2xl shadow-pink-500/20 pointer-events-auto">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-pink-500/30 mb-6 ring-2 ring-pink-500/30">
                  <div className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                    18+
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Age Verification Required
                  </span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  You must be 18 years or older to access this content.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => handleAgeVerification(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  I am 18 or older
                </button>
                <button
                  onClick={() => handleAgeVerification(false)}
                  className="w-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 px-6 py-4 rounded-xl font-medium transition-all border border-gray-600/50 hover:border-gray-500"
                >
                  I am under 18
                </button>
              </div>
              
              <p className="text-gray-400 text-xs leading-relaxed">
                By entering, you confirm that you are of legal age and agree to our terms of service.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Hamburger Menu - Far Left */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex-shrink-0">
                <Link to="/discover" className="flex items-center">
                  <img src="/logo.png" alt="Eromify" className="h-40 w-auto" />
                </Link>
              </div>
            </div>
            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <Link to="/discover" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/chat" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Chat</Link>
              <Link to="/generation" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Generate Image</Link>
              <Link to="/ai-girlfriend-pricing" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Pricing</Link>
              <Link to="/account" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Account</Link>
            </div>
            {/* Desktop Auth Buttons - Right */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" onClick={saveReturnPath} className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" onClick={saveReturnPath} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
            {/* Mobile buttons */}
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/login" onClick={saveReturnPath} className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" onClick={saveReturnPath} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Chat</Link>
              <Link to="/generation" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Generate Image</Link>
              <Link to="/ai-girlfriend-pricing" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Account</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-semibold mb-4">
            Your <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">Naughty Little Secret</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-4">
            Ready to chat and send exclusive photos. Connect with your perfect AI companion.
          </p>
        </div>

        {/* Banner Image */}
        <div className="mb-12 flex justify-center">
          <img 
            src="/main.webp" 
            alt="Eromify Banner" 
            className="w-full max-w-2xl h-auto rounded-2xl"
          />
        </div>

        {/* Instagram Story-like Profile Section */}
        <div className="mb-4">
          <div className="flex items-center gap-6 overflow-x-auto pb-4 px-4 sm:px-6">
            {(() => {
              // Models in order: Hailey, Amber, Kim, Ava, Riya, Tara, Clara, Bria, Kimberly, Jessica, Gaia, Alexis, Madison, Lauren, Brianna, Naima
              const featuredModelIds = [66, 69, 43, 59, 22, 74, 72, 24, 60, 67, 62, 61, 68, 70, 73, 30];
              const featuredModels = featuredModelIds
                .map(id => marketplaceModels.find(model => model.id === id))
                .filter(model => model !== undefined && !model.isBlackedOut);

              return featuredModels.map((model, index) => (
                <div 
                  key={model.id}
                  onClick={() => {
                    setCurrentInfluencerIndex(index);
                    setCurrentStoryIndex(0);
                    setSelectedStory(featuredModels);
                  }}
                  className="flex flex-col items-center cursor-pointer flex-shrink-0"
                >
                  <div className="relative w-20 h-20 mb-2">
                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-black"></div>
                    </div>
                    {/* Profile Image */}
                    <div className="absolute inset-0.5 rounded-full overflow-hidden">
                      <img 
                        src={model.images[0]} 
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-white text-xs text-center max-w-[80px] truncate">
                    {model.name.split(' ')[0]}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-2xl font-semibold">
            Eromify AI <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">Characters</span>
          </h2>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <div 
              key={model.id}
              onClick={() => {
                if (!model.fullyClaimed && !model.isBlackedOut) {
                  // Navigate to chat page with modelId (same as Chat CTA button)
                  navigate(`/chat?modelId=${model.id}`);
                }
              }}
              className={`bg-black rounded-2xl overflow-hidden border border-gray-800 relative group aspect-[9/16] ${
                model.fullyClaimed || model.isBlackedOut ? 'opacity-75' : 'cursor-pointer hover:border-gray-600'
              } transition-colors`}
            >
              {!model.isBlackedOut ? (
                <>
                  <img 
                    src={model.images[0]} 
                    alt={model.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transform scale-110 transition-transform duration-300 group-hover:scale-100"
                  />
                  
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  {/* Name and Age Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {model.name.split(' ')[0]} <span className="text-gray-300">({model.age})</span>
                    </h3>
                    {model.about && (
                      <p className="text-white/90 text-sm line-clamp-2 mb-2">
                        {model.about.length > 60 ? `${model.about.substring(0, 60)}...` : model.about}
                      </p>
                    )}
                    {/* Chat Button */}
                    <Link
                      to={`/chat?modelId=${model.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-xs shadow-lg"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat
                    </Link>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-gray-900" />
              )}
              
              {/* Fully Claimed Overlay */}
              {model.fullyClaimed && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center px-4 z-20">
                  <div className="bg-red-900 border-2 border-red-600 text-white px-6 py-3 rounded-lg font-bold text-sm mb-3 text-center">
                    FULLY CLAIMED
                  </div>
                  <p className="text-white text-xs text-center mb-1">All 5 licenses taken</p>
                  <p className="text-gray-400 text-xs text-center">Check back for new models</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-black border border-gray-600 rounded-2xl p-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black border border-pink-400 text-white mb-6">
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Build Your Perfect{' '}
                <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                  AI Girlfriend From Scratch
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Choose every detail—her face, body, hair, voice, personality, and exact kinks—then watch her come to life, ready to flirt, obey, and send you unlimited exclusive, uncensored photos and videos made only for you, whenever you're in the mood 🔥💦
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                  Get Started Today
                </Link>
                <Link to="/#pricing" className="bg-transparent border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all text-center">
                  See Pricing
                </Link>
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
        </div>

        {/* Footer Logo */}
        <div className="flex justify-center mb-12">
          <img src="/logo.png" alt="Eromify" className="h-32 w-auto opacity-50" />
        </div>
      </main>

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 lg:p-4">
          <div className="bg-black border-0 lg:border border-gray-800 rounded-none lg:rounded-2xl max-w-6xl w-full h-full lg:max-h-[90vh] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 relative bg-gray-900 flex-shrink-0">
              <div className="aspect-[3/4] lg:h-full relative">
                {/* Model image */}
                <img 
                  src={selectedModel.images[currentImageIndex]} 
                  alt={selectedModel.name}
                  className="w-full h-full object-cover object-top"
                />
                
                {/* V2 Model Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-500 text-white text-xs px-3 py-1.5 rounded-full">V2 Model</span>
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedModel.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:w-1/2 p-6 lg:p-8 lg:overflow-y-auto">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedModel(null)}
                className="fixed lg:absolute top-4 right-4 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Model Name */}
              <h2 className="text-3xl font-bold mb-4">{selectedModel.name}</h2>

              {/* Status Badges */}
              <div className="flex items-center gap-3 mb-6">
                {selectedModel.isLive && (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    LIVE
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {selectedModel.claimed} claimed
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Hair</div>
                  <div className="text-white font-medium">{selectedModel.hair}</div>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Body</div>
                  <div className="text-white font-medium">{selectedModel.body}</div>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Ethnicity</div>
                  <div className="text-white font-medium">{selectedModel.ethnicity}</div>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Age</div>
                  <div className="text-white font-medium">{selectedModel.age}</div>
                </div>
              </div>

              {/* About Section */}
              {selectedModel.about && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">ABOUT</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedModel.about}</p>
                </div>
              )}

              {/* Tier */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl mb-6 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Tier</span>
                <span className="text-white font-medium">{selectedModel.tier}</span>
              </div>

              {/* Claim Button */}
              <Link to="/login" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                Claim Model
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Social Proof */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Join {selectedModel.claimed.split('/')[0]} others who have claimed this model
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Story Viewer */}
      {selectedStory && selectedStory[currentInfluencerIndex] && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="w-full h-full max-w-md mx-auto relative aspect-[9/16]">
            {/* Progress Bars - Per Influencer */}
            <div className="absolute top-2 left-2 right-2 z-10 flex gap-1">
              {(() => {
                const currentInfluencer = selectedStory[currentInfluencerIndex];
                const storyImages = currentInfluencer?.storyImages || currentInfluencer?.images || [];
                return storyImages.map((_, index) => (
                  <div
                    key={index}
                    className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        index < currentStoryIndex
                          ? 'w-full'
                          : index === currentStoryIndex
                          ? 'w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                ));
              })()}
            </div>

            {/* Story Image - 9:16 aspect ratio */}
            <div className="w-full h-full relative">
              {(() => {
                const currentInfluencer = selectedStory[currentInfluencerIndex];
                const storyImages = currentInfluencer?.storyImages || currentInfluencer?.images || [];
                const currentImage = storyImages[currentStoryIndex] || "/main.webp";
                return (
                  <img
                    src={currentImage}
                    alt={currentInfluencer?.name || "Story"}
                    className="w-full h-full object-cover"
                  />
                );
              })()}
              
              {/* Story Info Overlay - Top Left */}
              <div 
                onClick={() => {
                  const currentInfluencer = selectedStory[currentInfluencerIndex];
                  if (currentInfluencer && currentInfluencer.id) {
                    // Close story viewer and navigate to chat
                    setSelectedStory(null);
                    navigate(`/chat?modelId=${currentInfluencer.id}`);
                  }
                }}
                className="absolute top-8 left-4 flex items-center gap-2 z-10 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50">
                  <img
                    src={selectedStory[currentInfluencerIndex]?.images[0] || "/main.webp"}
                    alt={selectedStory[currentInfluencerIndex]?.name || "Story"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {selectedStory[currentInfluencerIndex]?.name.split(' ')[0] || "Story"}
                  </p>
                  <p className="text-white/70 text-xs">
                    {(() => {
                      // Generate varied time based on influencer ID for consistency
                      const influencerId = selectedStory[currentInfluencerIndex]?.id || 0;
                      const timeOptions = [
                        '2 hours ago',
                        '5 hours ago',
                        '8 hours ago',
                        '12 hours ago',
                        '15 hours ago',
                        '18 hours ago',
                        '1 day ago',
                        '2 days ago',
                        '3 hours ago',
                        '6 hours ago',
                        '9 hours ago',
                        '14 hours ago',
                        '20 hours ago',
                        '1 day ago',
                        '2 days ago',
                        '4 hours ago'
                      ];
                      // Use influencer ID to consistently assign a time
                      return timeOptions[influencerId % timeOptions.length];
                    })()}
                  </p>
                </div>
              </div>

              {/* Close Button - Top Right */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all z-10"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation - Left */}
              <button
                onClick={() => {
                  const currentInfluencer = selectedStory[currentInfluencerIndex];
                  const storyImages = currentInfluencer?.storyImages || currentInfluencer?.images || [];
                  if (currentStoryIndex > 0) {
                    setCurrentStoryIndex(currentStoryIndex - 1);
                  } else if (currentInfluencerIndex > 0) {
                    // Move to previous influencer's last story
                    const prevInfluencer = selectedStory[currentInfluencerIndex - 1];
                    const prevStoryImages = prevInfluencer?.storyImages || prevInfluencer?.images || [];
                    const prevStoryCount = prevStoryImages.length || 1;
                    setCurrentInfluencerIndex(currentInfluencerIndex - 1);
                    setCurrentStoryIndex(prevStoryCount - 1);
                  } else {
                    setSelectedStory(null);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-10"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Navigation - Right */}
              <button
                onClick={() => {
                  const currentInfluencer = selectedStory[currentInfluencerIndex];
                  const storyImages = currentInfluencer?.storyImages || currentInfluencer?.images || [];
                  if (currentStoryIndex < storyImages.length - 1) {
                    setCurrentStoryIndex(currentStoryIndex + 1);
                  } else if (currentInfluencerIndex < selectedStory.length - 1) {
                    // Move to next influencer's first story
                    setCurrentInfluencerIndex(currentInfluencerIndex + 1);
                    setCurrentStoryIndex(0);
                  } else {
                    setSelectedStory(null);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-10"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DiscoverPage;

