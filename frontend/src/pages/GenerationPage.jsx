import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ChevronDown, Menu, X, Users, Loader2 } from 'lucide-react';
import { marketplaceModels } from '../data/marketplaceModels';
import api from '../utils/api';
import { saveReturnPath } from '../utils/redirectHelper';
import { useAuth } from '../contexts/AuthContext';
import aiGirlfriendPaymentService from '../services/aiGirlfriendPaymentService';

const GenerationPage = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [prompt, setPrompt] = useState('A high resolution DSLR photo. Ava takes a selfie of herself, wearing only a black thong, topless with her c cup tits.');
  const [aspectRatio, setAspectRatio] = useState('2:3');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsPaid(false);
        return;
      }
      
      try {
        const subscription = await aiGirlfriendPaymentService.getSubscription();
        const hasPaidSubscription = subscription?.status === 'active' && 
                                    subscription?.plan && 
                                    ['1month', '3months', '12months'].includes(subscription.plan);
        setIsPaid(hasPaidSubscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setIsPaid(false);
      }
    };

    checkSubscription();
  }, [user]);

  // Get Ava Diaz (id: 21) as default
  const defaultModel = marketplaceModels.find(model => model.id === 21) || marketplaceModels[0];
  const currentModel = selectedModel || defaultModel;

  // Get available models
  const availableModels = marketplaceModels.filter(model => !model.isBlackedOut && !model.fullyClaimed);

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)', icon: '▢' },
    { value: '2:3', label: 'Portrait (2:3)', icon: '▮' },
    { value: '3:2', label: 'Landscape (3:2)', icon: '▬' },
    { value: '4:5', label: 'Instagram Post (4:5)', icon: '▭' },
    { value: '9:16', label: 'Story (9:16)', icon: '▯' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Use AI girlfriend-specific generation endpoint (unlimited for all users)
      const response = await api.post('/ai-girlfriend-chat/generate-image', {
        modelId: currentModel.id,
        prompt: prompt.trim(),
        aspectRatio: aspectRatio || '2:3'
      });

      if (response.data.success && response.data.image?.url) {
        setGeneratedImage(response.data.image.url);
      } else {
        const backendError = response.data.error || response.data.message;
        setError(backendError || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Generation error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to generate image. Please try again.';
      setError(errorMsg);
      
      // If auth error, suggest logging in
      if (err.response?.status === 401) {
        setError('Please sign in to generate images');
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
            Generate Image
          </h1>
        </div>

        {/* Influencer Card - Slightly rounded, not fully circular */}
        <div className="mb-6">
          <div className="relative w-full max-w-[200px] md:max-w-sm mx-auto">
            <div className="w-full aspect-square rounded-[2.5rem] md:rounded-[4rem] overflow-visible bg-gray-900 border border-gray-800 relative">
              <div className="w-full h-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden">
                <img
                  src={currentModel.images[0]}
                  alt={currentModel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* V2 Badge */}
              <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
                <span className="bg-purple-500 text-white text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-full">V2</span>
              </div>
              
              {/* Purple/Pink Selection Icon - Half on, half off (Bottom Right) */}
              <button
                onClick={() => {
                  if (isPaid) {
                    // Paid users can select influencers
                    setShowModelSelector(!showModelSelector);
                  } else {
                    // Free users see upgrade modal
                    setShowUpgradeModal(true);
                  }
                }}
                className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center shadow-lg transition-all z-20 border-2 border-black"
              >
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            </div>

            {/* Model Selector Dropdown */}
            {showModelSelector && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowModelSelector(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg max-h-96 overflow-y-auto z-20">
                  {availableModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelSelector(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-3 border-b border-gray-800 last:border-b-0"
                    >
                      <img
                        src={model.images[0]}
                        alt={model.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="text-white font-medium">{model.name}</div>
                        {model.about && (
                          <div className="text-gray-400 text-xs line-clamp-1">{model.about}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white resize-none focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Aspect Ratio</label>
          <div className="relative">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
            >
              {aspectRatios.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Generated Image</h3>
            <div className="relative rounded-lg overflow-hidden border border-gray-800">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base md:text-lg"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              Generate Image
            </>
          )}
        </button>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div 
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-white mb-2">
                Upgrade Required
              </h2>
              
              <p className="text-gray-400 mb-6">
                To generate images with different influencers, you need an active subscription. Upgrade now to unlock this feature and more!
              </p>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  navigate('/ai-girlfriend-pricing');
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationPage;

