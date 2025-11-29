import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Menu, X, CreditCard } from 'lucide-react';
import aiGirlfriendPaymentService from '../services/aiGirlfriendPaymentService';
import { saveReturnPath } from '../utils/redirectHelper';

const AIGirlfriendPricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [countdown, setCountdown] = useState(43200); // 12 hours in seconds
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const premiumBenefits = [
    'Create your own AI Girlfriend(s)',
    'Unlimited text messages',
    'Get 100 FREE tokens / month',
    'Remove image blur',
    'Generate images',
    'Fast response time'
  ];

  const plans = [
    {
      id: '12months',
      name: '12 months',
      badge: 'BEST CHOICE',
      originalPrice: 12.99,
      price: 3.99,
      discount: 70,
      billing: 'yearly',
      planId: '12months', // AI girlfriend plan ID
      features: premiumBenefits
    },
    {
      id: '3months',
      name: '3 months',
      originalPrice: 12.99,
      price: 7.99,
      discount: 40,
      billing: 'quarterly',
      planId: '3months', // AI girlfriend plan ID
      features: premiumBenefits
    },
    {
      id: '1month',
      name: '1 month',
      originalPrice: 12.99,
      price: 12.99,
      discount: 0,
      billing: 'monthly',
      planId: '1month', // AI girlfriend plan ID
      features: premiumBenefits
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    
    if (selectedPaymentMethod === 'crypto') {
      alert('Crypto payment coming soon!');
      return;
    }
    
    setIsProcessingCheckout(true);
    
    try {
      // Use AI girlfriend payment service with the plan ID
      const response = await aiGirlfriendPaymentService.createCheckoutSession(
        selectedPlan.planId // '1month', '3months', or '12months'
      );
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session. Please try again.');
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-1 md:gap-2">
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
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/login" onClick={saveReturnPath} className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" onClick={saveReturnPath} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Black Friday Sale Banner */}
        <div className="text-left mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-semibold text-white mb-2">
            Black Friday Sale
          </h2>
          <p className="text-white text-base md:text-lg mb-1">
            Discount ends soon. <span className="text-red-500">Don't miss out!</span>
          </p>
          <div className="text-orange-500 text-sm md:text-base font-medium">
            🔥 Offer ends in {formatCountdown(countdown)}
          </div>
        </div>

        {/* Pricing Plans - 3 columns */}
        <div className="mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-gray-900/50 border rounded-xl p-4 relative flex flex-col ${
                  plan.badge ? 'border-purple-500' : 'border-gray-800'
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {plan.badge}
                  </div>
                )}
                
                <h3 className="text-white text-lg font-bold mb-1">{plan.name}</h3>
                
                <div className="mb-1">
                  <span className="text-white text-2xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400 text-sm"> /month</span>
                </div>
                
                {plan.discount > 0 ? (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-500 line-through text-sm">${plan.originalPrice}</span>
                    <span className="text-green-500 font-semibold text-sm">SAVE {plan.discount}%</span>
                  </div>
                ) : (
                  <div className="mb-2 h-6"></div>
                )}

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors mt-auto text-sm ${
                    plan.badge
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.badge ? 'Get Started' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-3 md:gap-6 text-sm md:text-base">
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">No adult transaction in your bank statement</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">No hidden fees • Cancel subscription at any time</span>
            </div>
          </div>
        </div>

        {/* Premium Benefits */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">Premium Benefits</h2>
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 md:p-6 max-w-2xl mx-auto">
            <div className="space-y-3">
              {premiumBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Info Footer */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg py-4 md:py-6 px-4 md:px-6 flex flex-col justify-center max-w-2xl mx-auto">
          <p className="text-gray-400 text-xs text-center mb-3">SECURE PAYMENT</p>
          <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs">💳</span>
              </div>
              <span>Card</span>
            </div>
            <span>•</span>
            <span>PayPal</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-500 text-xs">
            <span>🔒 Private & Secure</span>
            <span>•</span>
            <span>Instant Access</span>
            <span>•</span>
            <span>Cancel Anytime</span>
          </div>
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          All plans include PPV content generation - No hidden fees
        </p>
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/30 via-black to-purple-900/20 border border-gray-800 rounded-2xl max-w-lg md:max-w-lg w-full shadow-2xl relative overflow-hidden my-4 max-h-[90vh] flex flex-col">
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

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Header */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-white mb-1">Complete Your Purchase</h2>
                <p className="text-gray-400 text-xs">
                  {selectedPlan.name} - ${selectedPlan.price}/month
                </p>
              </div>

              {/* Plan Summary */}
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{selectedPlan.name}</h3>
                    <p className="text-xs text-gray-400">
                      {selectedPlan.billing === 'yearly' ? 'Annual subscription' : selectedPlan.billing === 'quarterly' ? 'Quarterly subscription' : 'Monthly subscription'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${selectedPlan.price}
                    </div>
                    <div className="text-xs text-gray-400">per month</div>
                  </div>
                </div>

                {selectedPlan.discount > 0 && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
                    <span className="text-gray-500 line-through text-xs">${selectedPlan.originalPrice}</span>
                    <span className="text-green-400 font-semibold text-xs">SAVE {selectedPlan.discount}%</span>
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
  );
};

export default AIGirlfriendPricingPage;
