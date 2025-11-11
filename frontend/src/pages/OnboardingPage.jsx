import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Palette, Users, Zap, Check, ChevronLeft, Upload, Shirt, Dumbbell, Plane, Gamepad2, UtensilsCrossed, Paintbrush, Briefcase, Instagram, Youtube, Twitter, Video, Camera, Film, Play } from 'lucide-react'
import { paymentService } from '../services/paymentService'
import { trackAddToCart, trackInitiateCheckout } from '../utils/metaPixel'
import { useAuth } from '../contexts/AuthContext'
import { marketplaceModels } from '../data/marketplaceModels'

const ONBOARDING_SELECTION_STORAGE_KEY = 'eromify/onboardingSelection'

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  // Step 2 state
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [selectedExperience, setSelectedExperience] = useState(null)
  
  // Step 3 state
  const [selectedCreationMethod, setSelectedCreationMethod] = useState(null)
  const [selectedMarketplaceModel, setSelectedMarketplaceModel] = useState(null)
  
  // Step 4 state
  const [aiName, setAiName] = useState('Audrey')
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [selectedVisualStyle, setSelectedVisualStyle] = useState(null)
  
  // Step 5 state
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [selectedFrequency, setSelectedFrequency] = useState(null)
  const [selectedContentTypes, setSelectedContentTypes] = useState([])
  
  // Countdown timer for page 7
  const [countdown, setCountdown] = useState(86389) // 23:59:49 in seconds
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

  // If user already has an active subscription (or local flag/payment param), skip onboarding
  useEffect(() => {
    const maybeSkipOnboarding = async () => {
      try {
        const paymentParam = searchParams.get('payment')
        
        if (paymentParam === 'success') {
          navigate('/dashboard')
          return
        }

        const sub = await paymentService.getSubscription()
        if (sub?.status === 'active' || sub?.hasActiveSubscription || sub?.plan) {
          navigate('/dashboard')
        }
      } catch (_) {
        // ignore and remain on onboarding
      }
    }

    maybeSkipOnboarding()
  }, [navigate, searchParams])
  
  // Use shared marketplace models data - order can be changed in /src/data/marketplaceModels.js
  // Filter out fully claimed models - show all available models
  const allMarketplaceModels = marketplaceModels;
  const marketplaceModelsFiltered = allMarketplaceModels.filter(m => !m.fullyClaimed)

  // Countdown timer effect
  useEffect(() => {
    if (currentStep === 7) {
      const timer = setInterval(() => {
        setCountdown(prev => prev > 0 ? prev - 1 : 0)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentStep])

  // Format countdown as HH:MM:SS
  const formatCountdown = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    setShowCheckoutModal(true)
    
    // Track AddToCart event when user selects a plan
    trackAddToCart({
      contentName: plan.name,
      contentCategory: 'Subscription Plan',
      contentIds: [plan.name.toLowerCase().replace(' ', '_')],
      value: plan.price * 100, // Convert to cents
      currency: 'USD',
      numItems: 1,
      userEmail: user?.email
    })
  }

  const handleCheckout = async () => {
    if (!selectedPlan) return
    
    setIsProcessingCheckout(true)
    
    try {
      const selectedModel = selectedMarketplaceModel
        ? allMarketplaceModels.find(m => m.id === selectedMarketplaceModel)
        : null

      if (selectedModel) {
        const onboardingSelection = {
          modelId: selectedModel.id,
          modelName: selectedModel.name,
          aiName,
          niche: selectedNiche,
          visualStyle: selectedVisualStyle,
          goal: selectedGoal,
          frequency: selectedFrequency,
          platforms: selectedPlatforms,
          contentTypes: selectedContentTypes,
          description: selectedModel.about || null,
          personality: null,
          targetAudience: null,
          contentStyle: null
        }

        try {
          localStorage.setItem(ONBOARDING_SELECTION_STORAGE_KEY, JSON.stringify(onboardingSelection))
        } catch (storageError) {
          console.error('Failed to store onboarding selection:', storageError)
        }
      } else {
        try {
          localStorage.removeItem(ONBOARDING_SELECTION_STORAGE_KEY)
        } catch (storageError) {
          console.error('Failed to clear onboarding selection:', storageError)
        }
      }

      // Map the plan names to backend plan names
      let backendPlan
      if (selectedPlan.name === 'Pro Plan') {
        backendPlan = 'launch'
      } else if (selectedPlan.name === 'Basic Plan') {
        backendPlan = 'builder'
      } else if (selectedPlan.name === 'Elite Plan') {
        backendPlan = 'growth'
      }
      
      // Create checkout session
      const response = await paymentService.createCheckoutSession(
        backendPlan,
        'monthly', // Default to monthly billing
        null, // No promo code
        selectedModel
          ? {
              onboardingSelection: {
                modelId: selectedModel.id,
                modelName: selectedModel.name,
                aiName,
                niche: selectedNiche,
                visualStyle: selectedVisualStyle,
                goal: selectedGoal,
                frequency: selectedFrequency,
                platforms: selectedPlatforms,
                contentTypes: selectedContentTypes
              }
            }
          : {}
      )
      
      // Track InitiateCheckout event before redirecting to Stripe
      trackInitiateCheckout({
        plan: backendPlan,
        value: selectedPlan.price * 100, // Convert to cents
        currency: 'USD',
        userEmail: user?.email
      })
      
      // Redirect to Stripe checkout
      if (response.url) {
        window.location.href = response.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to create checkout session. Please try again.')
      setIsProcessingCheckout(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center max-w-4xl mx-auto">
            {/* 5-Minute Setup Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-12">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">5-Minute Setup</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Your AI Influencer
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-gray-300 mb-16 max-w-2xl mx-auto px-4">
              Join thousands of creators building unique AI models. We'll guide you through every step of the process.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 md:gap-20 mb-16">
              <div>
                <div className="text-2xl md:text-4xl font-bold text-white mb-2">5 min</div>
                <div className="text-gray-400 text-xs md:text-sm">Setup time</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold text-white mb-2">70+</div>
                <div className="text-gray-400 text-xs md:text-sm">Ready models</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold text-white mb-2">5K+</div>
                <div className="text-gray-400 text-xs md:text-sm">Active creators</div>
              </div>
            </div>

            {/* Start Creating Button */}
            <button
              onClick={handleNext}
              className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )
      case 2:
        return (
          <>
          <div className="w-full max-w-4xl mx-auto pt-16 pb-32">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What's your goal?
              </h2>
              <p className="text-gray-400 text-lg">Choose your path to get started</p>
            </div>

            {/* Goal Cards */}
            <div className="mb-12">
              <h3 className="text-white text-xl font-semibold mb-6">I want to:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Build a Business */}
                <button
                  onClick={() => setSelectedGoal('build-business')}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                    selectedGoal === 'build-business'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedGoal === 'build-business' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <FileText className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-white text-lg font-semibold mb-2">Build a Business</h4>
                  <p className="text-gray-400 text-sm">Create and monetize AI influencers</p>
                </button>

                {/* Content Creation */}
                <button
                  onClick={() => setSelectedGoal('content-creation')}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                    selectedGoal === 'content-creation'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedGoal === 'content-creation' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Palette className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-white text-lg font-semibold mb-2">Content Creation</h4>
                  <p className="text-gray-400 text-sm">Generate content for social media</p>
                </button>

                {/* Agency Services */}
                <button
                  onClick={() => setSelectedGoal('agency-services')}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                    selectedGoal === 'agency-services'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedGoal === 'agency-services' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-white text-lg font-semibold mb-2">Agency Services</h4>
                  <p className="text-gray-400 text-sm">Create AI models for clients</p>
                </button>

                {/* Explore Technology */}
                <button
                  onClick={() => setSelectedGoal('explore-technology')}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                    selectedGoal === 'explore-technology'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedGoal === 'explore-technology' && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Zap className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-white text-lg font-semibold mb-2">Explore Technology</h4>
                  <p className="text-gray-400 text-sm">Learn cutting-edge AI capabilities</p>
                </button>
              </div>
            </div>

            {/* Experience Level */}
            <div className="mb-12">
              <h3 className="text-white text-xl font-semibold mb-6">My experience level:</h3>
              <div className="space-y-3">
                {/* New to AI */}
                <button
                  onClick={() => setSelectedExperience('new')}
                  className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
                    selectedExperience === 'new'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedExperience === 'new' ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
                  }`}>
                    {selectedExperience === 'new' && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-white">I'm new to AI content creation</span>
                </button>

                {/* Created Some */}
                <button
                  onClick={() => setSelectedExperience('some')}
                  className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
                    selectedExperience === 'some'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedExperience === 'some' ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
                  }`}>
                    {selectedExperience === 'some' && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-white">I've created some AI content before</span>
                </button>

                {/* Experienced */}
                <button
                  onClick={() => setSelectedExperience('experienced')}
                  className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
                    selectedExperience === 'experienced'
                      ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedExperience === 'experienced' ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
                  }`}>
                    {selectedExperience === 'experienced' && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-white">I'm experienced with AI tools</span>
                </button>
              </div>
            </div>

            {/* Validation Message */}
            {(!selectedGoal || !selectedExperience) && (
              <p className="text-center text-gray-500 text-sm mb-6">
                Select your goal and experience level to continue
              </p>
            )}
          </div>

          {/* Fixed Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 px-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-gray-700 hover:border-gray-600 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedGoal || !selectedExperience}
                className={`inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] ${
                  (!selectedGoal || !selectedExperience) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
        )
      case 3:
        // Show marketplace selection if marketplace was chosen
        if (selectedCreationMethod === 'marketplace') {
          return (
            <>
              <div className="w-full max-w-6xl mx-auto pt-16 pb-32">
                {/* Header */}
                <div className="text-center mb-10 px-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Pick Your AI Influencer
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg">Select from our top-performing models. No training, just instant results.</p>
                </div>

                {/* Models Grid - 3 columns, dynamic rows */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 md:px-0">
                  {marketplaceModelsFiltered.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedMarketplaceModel(model.id)}
                      className="relative group rounded-2xl overflow-hidden border-2 border-gray-800 hover:border-purple-500 transition-all duration-200"
                    >
                      {/* V2 Badge */}
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-purple-600 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md z-10">
                        V2
                      </div>

                      {/* Selected Checkmark */}
                      {selectedMarketplaceModel === model.id && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 w-6 h-6 md:w-7 md:h-7 bg-purple-500 rounded-full flex items-center justify-center z-10">
                          <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                      )}

                      {/* Model Image */}
                      <div className="aspect-[3/4] bg-gray-800 relative">
                      <img 
                        src={model.images[0]} 
                        alt={model.name}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                      </div>

                      {/* Model Info */}
                      <div className="bg-gray-900/90 p-3 md:p-4 text-center">
                        <h3 className="text-white font-semibold mb-1 text-sm md:text-base">{model.name}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">{model.claimed} claimed</p>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fixed Navigation Bar */}
              <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 px-8">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                  <button
                    onClick={() => setSelectedCreationMethod(null)}
                    className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-gray-700 hover:border-gray-600 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )
        }

        // Show creation method selection by default
        return (
          <>
          <div className="w-full max-w-2xl mx-auto pt-16 pb-32">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Creation Method
              </h2>
              <p className="text-gray-400 text-lg">Choose how you want to create your AI influencer</p>
            </div>

            {/* Creation Method Cards */}
            <div className="space-y-3 mb-10">
              {/* Pick from Marketplace */}
              <button
                onClick={() => setSelectedCreationMethod('marketplace')}
                className="w-full py-6 px-5 rounded-2xl border border-gray-800 transition-all duration-200 text-left relative bg-gray-900/30 hover:border-gray-700"
              >
                {/* Recommended Badge */}
                <div className="absolute top-4 right-4 bg-gray-900 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <Users className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-bold mb-1.5">Pick from Marketplace</h3>
                    <p className="text-gray-400 text-sm mb-4">Choose from 70+ professionally trained and optimized models</p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Optimized and trained for best results</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Instant results, no setup required</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Proven high-performing models</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Create Custom Model */}
              <button
                onClick={() => {
                  setSelectedCreationMethod('custom')
                  handleNext()
                }}
                className="w-full py-6 px-5 rounded-2xl border border-gray-800 transition-all duration-200 text-left bg-gray-900/30 hover:border-gray-700"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <Upload className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-bold mb-1.5">Create Custom Model</h3>
                    <p className="text-gray-400 text-sm mb-4">Upload your own pictures to create a unique influencer</p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Completely unique to you</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Upload later after subscribing</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Full customization control</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Fixed Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 px-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-gray-700 hover:border-gray-600 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
        )
      case 4:
        return (
          <>
          <div className="w-full max-w-4xl mx-auto pt-16 pb-32">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Create Your AI Persona
              </h2>
              <p className="text-gray-400 text-lg">Give your AI influencer a unique identity</p>
            </div>

            {/* AI Name Input */}
            <div className="mb-10">
              <label className="text-white text-lg font-semibold mb-4 block">AI Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  placeholder="Enter a name..."
                  className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
              </div>
            </div>

            {/* Choose a Niche */}
            <div className="mb-10">
              <label className="text-white text-lg font-semibold mb-4 block">Choose a Niche</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Fashion & Beauty */}
                <button
                  onClick={() => setSelectedNiche('fashion')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'fashion'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">👗</div>
                  <div className="text-white text-sm font-medium">Fashion & Beauty</div>
                </button>

                {/* Fitness & Health */}
                <button
                  onClick={() => setSelectedNiche('fitness')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'fitness'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">💪</div>
                  <div className="text-white text-sm font-medium">Fitness & Health</div>
                </button>

                {/* Travel & Lifestyle */}
                <button
                  onClick={() => setSelectedNiche('travel')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'travel'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">✈️</div>
                  <div className="text-white text-sm font-medium">Travel & Lifestyle</div>
                </button>

                {/* Gaming & Tech */}
                <button
                  onClick={() => setSelectedNiche('gaming')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'gaming'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">🎮</div>
                  <div className="text-white text-sm font-medium">Gaming & Tech</div>
                </button>

                {/* Food & Cooking */}
                <button
                  onClick={() => setSelectedNiche('food')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'food'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">👨‍🍳</div>
                  <div className="text-white text-sm font-medium">Food & Cooking</div>
                </button>

                {/* Art & Creativity */}
                <button
                  onClick={() => setSelectedNiche('art')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'art'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="text-white text-sm font-medium">Art & Creativity</div>
                </button>

                {/* Business & Finance */}
                <button
                  onClick={() => setSelectedNiche('business')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'business'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">💼</div>
                  <div className="text-white text-sm font-medium">Business & Finance</div>
                </button>

                {/* Something Else */}
                <button
                  onClick={() => setSelectedNiche('other')}
                  className={`p-4 rounded-xl border transition-all duration-200 text-center ${
                    selectedNiche === 'other'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">✨</div>
                  <div className="text-white text-sm font-medium">Something Else</div>
                </button>
              </div>
            </div>

            {/* Visual Style */}
            <div className="mb-10">
              <label className="text-white text-lg font-semibold mb-4 block">Visual Style</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Ultra Realistic */}
                <button
                  onClick={() => setSelectedVisualStyle('realistic')}
                  className={`p-5 rounded-xl border transition-all duration-200 text-left relative ${
                    selectedVisualStyle === 'realistic'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedVisualStyle === 'realistic' && (
                    <div className="absolute top-4 right-4 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <h4 className="text-white text-lg font-bold mb-1">Ultra Realistic</h4>
                  <p className="text-gray-400 text-sm">Photorealistic AI models</p>
                </button>

                {/* Stylized */}
                <button
                  onClick={() => setSelectedVisualStyle('stylized')}
                  className={`p-5 rounded-xl border transition-all duration-200 text-left relative ${
                    selectedVisualStyle === 'stylized'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedVisualStyle === 'stylized' && (
                    <div className="absolute top-4 right-4 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <h4 className="text-white text-lg font-bold mb-1">Stylized</h4>
                  <p className="text-gray-400 text-sm">Artistic interpretation</p>
                </button>

                {/* Fantasy */}
                <button
                  onClick={() => setSelectedVisualStyle('fantasy')}
                  className={`p-5 rounded-xl border transition-all duration-200 text-left relative ${
                    selectedVisualStyle === 'fantasy'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedVisualStyle === 'fantasy' && (
                    <div className="absolute top-4 right-4 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <h4 className="text-white text-lg font-bold mb-1">Fantasy</h4>
                  <p className="text-gray-400 text-sm">Creative and imaginative</p>
                </button>

                {/* Anime-Inspired */}
                <button
                  onClick={() => setSelectedVisualStyle('anime')}
                  className={`p-5 rounded-xl border transition-all duration-200 text-left relative ${
                    selectedVisualStyle === 'anime'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedVisualStyle === 'anime' && (
                    <div className="absolute top-4 right-4 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <h4 className="text-white text-lg font-bold mb-1">Anime-Inspired</h4>
                  <p className="text-gray-400 text-sm">Japanese animation style</p>
                </button>
              </div>
            </div>

            {/* Validation Message */}
            {(!selectedNiche || !selectedVisualStyle) && (
              <p className="text-center text-gray-500 text-sm mb-6">
                Select a niche and visual style to continue
              </p>
            )}
          </div>

          {/* Fixed Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 px-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-gray-700 hover:border-gray-600 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedNiche || !selectedVisualStyle}
                className={`inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] ${
                  (!selectedNiche || !selectedVisualStyle) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
        )
      
      case 5:
        const togglePlatform = (platform) => {
          setSelectedPlatforms(prev => 
            prev.includes(platform) 
              ? prev.filter(p => p !== platform)
              : [...prev, platform]
          )
        }
        
        const toggleContentType = (type) => {
          setSelectedContentTypes(prev => 
            prev.includes(type) 
              ? prev.filter(t => t !== type)
              : [...prev, type]
          )
        }
        
        return (
          <>
          <div className="w-full max-w-4xl mx-auto pt-16 pb-32">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your Strategy
              </h2>
              <p className="text-gray-400 text-lg">Tell us how you plan to grow your AI influencer</p>
            </div>

            {/* Select Platforms */}
            <div className="mb-10">
              <label className="text-white text-lg font-semibold mb-4 block">Select Platforms</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Instagram */}
                <button
                  onClick={() => togglePlatform('instagram')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedPlatforms.includes('instagram')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedPlatforms.includes('instagram') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Instagram className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Instagram</div>
                </button>

                {/* YouTube */}
                <button
                  onClick={() => togglePlatform('youtube')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedPlatforms.includes('youtube')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedPlatforms.includes('youtube') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Youtube className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">YouTube</div>
                </button>

                {/* Twitter */}
                <button
                  onClick={() => togglePlatform('twitter')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedPlatforms.includes('twitter')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedPlatforms.includes('twitter') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Twitter className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Twitter</div>
                </button>

                {/* TikTok */}
                <button
                  onClick={() => togglePlatform('tiktok')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedPlatforms.includes('tiktok')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedPlatforms.includes('tiktok') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Video className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">TikTok</div>
                </button>
              </div>
            </div>

            {/* Posting Frequency */}
            <div className="mb-10">
              <label className="text-white text-lg font-semibold mb-4 block">Posting Frequency</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Daily */}
                <button
                  onClick={() => setSelectedFrequency('daily')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedFrequency === 'daily'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedFrequency === 'daily' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Zap className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Daily</div>
                </button>

                {/* 3-4x per week */}
                <button
                  onClick={() => setSelectedFrequency('regular')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedFrequency === 'regular'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedFrequency === 'regular' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">3-4x per week</div>
                </button>

                {/* Weekly */}
                <button
                  onClick={() => setSelectedFrequency('weekly')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedFrequency === 'weekly'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedFrequency === 'weekly' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <FileText className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Weekly</div>
                </button>

                {/* Occasionally */}
                <button
                  onClick={() => setSelectedFrequency('occasional')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedFrequency === 'occasional'
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedFrequency === 'occasional' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Palette className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Occasionally</div>
                </button>
              </div>
            </div>

            {/* Content Types */}
            <div className="mb-10">
              <label className="text-white text-lg font-semibold mb-4 block">Content Types</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Photos */}
                <button
                  onClick={() => toggleContentType('photos')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedContentTypes.includes('photos')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedContentTypes.includes('photos') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Photos</div>
                </button>

                {/* Reels/Shorts */}
                <button
                  onClick={() => toggleContentType('reels')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedContentTypes.includes('reels')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedContentTypes.includes('reels') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Film className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Reels/Shorts</div>
                </button>

                {/* Stories */}
                <button
                  onClick={() => toggleContentType('stories')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedContentTypes.includes('stories')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedContentTypes.includes('stories') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Play className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Stories</div>
                </button>

                {/* Long Videos */}
                <button
                  onClick={() => toggleContentType('long-videos')}
                  className={`p-6 rounded-xl border transition-all duration-200 text-center relative ${
                    selectedContentTypes.includes('long-videos')
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {selectedContentTypes.includes('long-videos') && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Video className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white text-base font-medium">Long Videos</div>
                </button>
              </div>
            </div>

            {/* Validation Message */}
            {(!selectedPlatforms.length || !selectedFrequency || !selectedContentTypes.length) && (
              <p className="text-center text-gray-500 text-sm mb-6">
                Select platforms, frequency, and content types to continue
              </p>
            )}
          </div>

          {/* Fixed Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 px-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-gray-700 hover:border-gray-600 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedPlatforms.length || !selectedFrequency || !selectedContentTypes.length}
                className={`inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] ${
                  (!selectedPlatforms.length || !selectedFrequency || !selectedContentTypes.length) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
        )
      
      case 6:
        // Get the selected model name if marketplace was chosen
        const selectedModel = selectedMarketplaceModel 
          ? allMarketplaceModels.find(m => m.id === selectedMarketplaceModel)
          : null
        
        // Format the niche name
        const nicheNames = {
          'fashion': 'Fashion & Beauty',
          'fitness': 'Fitness & Health',
          'travel': 'Travel & Lifestyle',
          'gaming': 'Gaming & Tech',
          'food': 'Food & Cooking',
          'art': 'Art & Creativity',
          'business': 'Business & Finance',
          'other': 'Other'
        }
        
        // Format the visual style name
        const visualStyleNames = {
          'realistic': 'Ultra Realistic',
          'artistic': 'Artistic',
          'cinematic': 'Cinematic',
          'anime': 'Anime-Inspired'
        }
        
        // Format frequency
        const frequencyNames = {
          'daily': 'Daily',
          'regular': '3-4 posts per week',
          'weekly': 'Weekly',
          'occasional': 'Occasionally'
        }
        
        return (
          <>
          <div className="w-full max-w-5xl mx-auto pt-16 pb-32">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {aiName} is ready to launch!
              </h2>
              <p className="text-gray-400 text-lg">Your AI influencer is configured and ready to start creating content</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Card - Model Preview */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 flex items-center justify-center">
                {selectedModel ? (
                  // Show marketplace model image
                  <div className="w-full max-w-sm">
                    <img 
                      src={selectedModel.images[0]} 
                      alt={selectedModel.name}
                      className="w-full rounded-xl object-cover"
                    />
                  </div>
                ) : (
                  // Show custom model placeholder
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg">Custom model ready to upload</p>
                  </div>
                )}
              </div>

              {/* Right Card - Summary */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-10 flex flex-col justify-center space-y-12">
                {/* AI Name & Niche */}
                <div className="flex items-start space-x-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white text-2xl font-semibold mb-2">{aiName}</h3>
                    <p className="text-gray-400 text-base">
                      {nicheNames[selectedNiche]} • {visualStyleNames[selectedVisualStyle]}
                    </p>
                  </div>
                </div>

                {/* AI Influencer Ready */}
                <div className="flex items-start space-x-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-2">AI Influencer Ready</h3>
                    <p className="text-gray-400 text-base">
                      {selectedModel ? `Based on ${selectedModel.name}` : 'Custom model setup'}
                    </p>
                  </div>
                </div>

                {/* Content Strategy Set */}
                <div className="flex items-start space-x-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-2">Content Strategy Set</h3>
                    <p className="text-gray-400 text-base">
                      {frequencyNames[selectedFrequency]}
                    </p>
                  </div>
                </div>

                {/* Ready to Monetize */}
                <div className="flex items-start space-x-4">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-2">Ready to Monetize</h3>
                    <p className="text-gray-400 text-base">
                      Platforms: {selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ').toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 py-3 px-8">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-gray-700 hover:border-gray-600 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <span>Start Earning Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          </>
        )
      
      case 7:
        // Get the selected model name if marketplace was chosen
        const selectedModelPage7 = selectedMarketplaceModel 
          ? allMarketplaceModels.find(m => m.id === selectedMarketplaceModel)
          : null
        
        return (
          <div className="min-h-screen bg-black w-full">
            {/* Header - Arrow and Text aligned at top */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-center h-10 z-20">
              <button
                onClick={handleBack}
                className="absolute left-6 flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-white transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <p className="text-gray-400 text-sm">
                Final Step <ArrowRight className="inline w-3 h-3 mx-1" /> <span className="text-purple-400">Choose Plan</span>
              </p>
            </div>
            
            {/* Content with top padding to account for fixed header */}
            <div className="pt-6">
              <div className="max-w-6xl mx-auto px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Model Preview */}
              <div className="relative">
                <div className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden">
                  {selectedModelPage7 ? (
                    <div className="relative">
                      <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>ACTIVE</span>
                      </div>
                      <img 
                        src={selectedModelPage7.images[0]} 
                        alt={selectedModelPage7.name}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-center">
                        <h3 className="text-white text-xl font-bold mb-1">{selectedModelPage7.name} is Ready</h3>
                        <p className="text-gray-300 text-sm">Ready to start earning</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">{aiName} is Ready</h3>
                      <p className="text-gray-300 text-sm">Ready to start earning</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Pricing */}
              <div className="space-y-4">
                {/* Pro Plan - Main */}
                <div className="bg-gray-900/50 border border-purple-500 rounded-xl p-3 relative">
                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    MOST POPULAR
                  </div>
                  <h3 className="text-white text-xl font-bold mb-1.5">Pro Plan</h3>
                  <div className="mb-2">
                    <span className="text-white text-3xl font-bold">$29</span>
                    <span className="text-gray-400 text-base"> /month</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-500 line-through text-sm">$50</span>
                    <span className="text-green-500 font-semibold text-sm">SAVE 50%</span>
                  </div>
                  <div className="text-orange-500 text-xs mb-3 flex items-center">
                    <span className="mr-1">🔥</span> Offer ends in {formatCountdown(countdown)}
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white text-sm">2000 Credits (photos & videos)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white text-sm">2 Model Tokens/month <span className="text-gray-400 text-xs">(claim or make 2 models)</span></span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white text-sm">60 scheduled posts</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSelectPlan({ name: 'Pro Plan', price: 29, originalPrice: 50, credits: 2000, features: ['2000 Credits (photos & videos)', '2 Model Tokens/month', '60 scheduled posts'] })}
                    className="w-full bg-white text-black py-2.5 rounded-lg font-bold text-base hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </button>
                </div>

                {/* Other Plans */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Basic Plan */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-3 flex flex-col h-full">
                    <h4 className="text-white text-lg font-bold mb-2">Basic Plan</h4>
                    <div className="mb-3">
                      <span className="text-white text-2xl font-bold">$15</span>
                      <span className="text-gray-400 text-xs"> /mo</span>
                    </div>
                    <div className="space-y-1 mb-3 text-xs">
                      <p className="text-gray-300">500 Credits</p>
                      <p className="text-red-400">No video</p>
                    </div>
                    <button 
                      onClick={() => handleSelectPlan({ name: 'Basic Plan', price: 15, credits: 500, features: ['500 Credits', 'Photos only', 'No video support'] })}
                      className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors mt-auto"
                    >
                      Select
                    </button>
                  </div>

                  {/* Elite Plan */}
                  <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-3 flex flex-col h-full">
                    <h4 className="text-white text-lg font-bold mb-2">Elite Plan</h4>
                    <div className="mb-3">
                      <span className="text-white text-2xl font-bold">$79</span>
                      <span className="text-gray-400 text-xs"> /mo</span>
                    </div>
                    <div className="space-y-1 mb-3 text-xs">
                      <p className="text-gray-300">Unlimited credits (photos & videos)</p>
                      <p className="text-purple-400">Premium features</p>
                    </div>
                    <button 
                      onClick={() => handleSelectPlan({ name: 'Elite Plan', price: 79, credits: null, features: ['Unlimited credits (photos & videos)', 'Unlimited models', 'Priority support', 'Premium features'] })}
                      className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors mt-auto"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-lg py-[22px] px-5 flex flex-col justify-center">
                  <p className="text-gray-400 text-[10px] text-center mb-2.5">SECURE PAYMENT</p>
                  <div className="flex items-center justify-center space-x-3 text-gray-400 text-xs mb-2.5">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-[10px]">💳</span>
                      </div>
                      <span>Card</span>
                    </div>
                    <span>•</span>
                    <span>PayPal</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-[10px]">
                    <span>🔒 Private & Secure</span>
                    <span>•</span>
                    <span>Instant Access</span>
                    <span>•</span>
                    <span>Cancel Anytime</span>
                  </div>
                </div>

                <p className="text-gray-500 text-[10px] text-center">
                  All plans include PPV content generation - No hidden fees
                </p>
              </div>
            </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Step {currentStep}</h2>
            <p className="text-gray-300 mb-8">Coming soon...</p>
            <button
              onClick={handleNext}
              className="inline-flex items-center space-x-2 bg-transparent border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <span>{currentStep < totalSteps ? 'Next' : 'Complete'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Gradient Orbs for atmosphere - Hide on step 7 */}
      {currentStep !== 7 && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </>
      )}

      {/* Progress Dots - Hide on step 7 */}
      {currentStep !== 7 && (
        <>
          <div className="absolute top-8 left-0 right-0 flex justify-center items-center space-x-3 z-10">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 === currentStep
                    ? 'w-8 bg-white'
                    : index + 1 < currentStep
                    ? 'w-2 bg-white/60'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Step Counter */}
          <div className="absolute top-20 left-0 right-0 text-center text-sm text-gray-400 z-10">
            {currentStep} of {totalSteps}
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        {renderStep()}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/30 via-black to-purple-900/20 border border-gray-800 rounded-2xl max-w-lg md:max-w-lg w-full shadow-2xl relative overflow-hidden">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-white mb-1">Complete Your Purchase</h2>
                <p className="text-gray-400 text-xs">{selectedPlan.name} - ${selectedPlan.price}.99/month</p>
              </div>

              {/* Plan Summary */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{selectedPlan.name}</h3>
                    <p className="text-xs text-gray-400">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${selectedPlan.price}.99</div>
                    <div className="text-xs text-gray-400">per month</div>
                  </div>
                </div>

                {selectedPlan.originalPrice && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
                    <span className="text-gray-500 line-through text-xs">${selectedPlan.originalPrice}</span>
                    <span className="text-green-400 font-semibold text-xs">SAVE 50%</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2 text-sm">Payment Method</h4>
                
                {/* Credit Card Option */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💳</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">Credit Card / PayPal</div>
                      <div className="text-gray-400 text-xs">Secure payment via credit card, debit card, or PayPal</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-purple-400" />
                      <span>Instant activation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-purple-400" />
                      <span>Visa, Mastercard, AmEx, Discover, PayPal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-purple-400" />
                      <span>Secure & encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={isProcessingCheckout}
                className="w-full bg-black border-[1.5px] border-purple-500/60 hover:border-purple-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-purple-500/10 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingCheckout ? 'Processing...' : 'Continue to Checkout'}
              </button>

              {/* Bottom Info */}
              <div className="text-center pt-3 border-t border-gray-800">
                <p className="text-gray-500 text-[10px] mb-1.5">🔒 Private & Secure • Instant Access • Cancel Anytime</p>
                <p className="text-gray-600 text-[10px] mb-1.5">All plans include PPV content generation - No hidden fees</p>
                <p className="text-gray-500 text-[10px]">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OnboardingPage

