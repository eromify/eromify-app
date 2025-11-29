import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Mail, CreditCard, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import aiGirlfriendPaymentService from '../services/aiGirlfriendPaymentService';
import toast from 'react-hot-toast';
import { saveReturnPath } from '../utils/redirectHelper';

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        // Fetch AI girlfriend subscription (separate from influencer subscription)
        const response = await aiGirlfriendPaymentService.getSubscription();
        setSubscription(response);
      } catch (error) {
        console.error('Failed to fetch AI girlfriend subscription:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, navigate]);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your AI girlfriend subscription? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelling(true);
      await aiGirlfriendPaymentService.cancelSubscription();
      toast.success('AI girlfriend subscription cancelled successfully');
      // Refresh subscription data
      const response = await aiGirlfriendPaymentService.getSubscription();
      setSubscription(response);
    } catch (error) {
      console.error('Failed to cancel AI girlfriend subscription:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const hasActiveSubscription = subscription?.hasActiveSubscription || subscription?.status === 'active' || Boolean(subscription?.plan);

  const getPlanLabel = (plan) => {
    const planMap = {
      '1month': 'Monthly Plan',
      '3months': 'Quarterly Plan',
      '12months': 'Yearly Plan'
    };
    return planMap[plan] || plan || 'No Plan';
  };

  const getBillingLabel = (billing) => {
    if (!billing) return 'Monthly';
    return billing.charAt(0).toUpperCase() + billing.slice(1);
  };

  if (!user) {
    return null;
  }

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account</h1>
          <p className="text-gray-400">Manage your account information and subscription</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading account information...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email Section */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Email Address</h2>
                  <p className="text-gray-400 text-sm">Your account email</p>
                </div>
              </div>
              <p className="text-white text-base">{user.email}</p>
            </div>

            {/* Subscription Section */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Subscription</h2>
                  <p className="text-gray-400 text-sm">Your current plan status</p>
                </div>
              </div>

              {hasActiveSubscription ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Plan</span>
                    <span className="text-white font-medium">{getPlanLabel(subscription?.plan)}</span>
                  </div>
                  {subscription?.billing && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Billing</span>
                      <span className="text-white font-medium">{getBillingLabel(subscription.billing)}</span>
                    </div>
                  )}
                  {subscription?.tokens !== null && subscription?.tokens !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Monthly Tokens</span>
                      <span className="text-white font-medium">{Number(subscription.tokens).toLocaleString()}</span>
                    </div>
                  )}
                  {subscription?.isFree && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-yellow-500 font-medium">Free Tier</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-4">You don't have an active subscription</p>
                  <Link
                    to="/ai-girlfriend-pricing"
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Account Actions</h2>
                  <p className="text-gray-400 text-sm">Manage your account</p>
                </div>
              </div>

              <div className="text-center">
                {hasActiveSubscription ? (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                ) : (
                  <Link
                    to="/ai-girlfriend-pricing"
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Get Credits
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountPage;

