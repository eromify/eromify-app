import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Mail, CreditCard, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';

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
        const response = await paymentService.getSubscription();
        setSubscription(response);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, navigate]);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelling(true);
      await paymentService.cancelSubscription();
      toast.success('Subscription cancelled successfully');
      // Refresh subscription data
      const response = await paymentService.getSubscription();
      setSubscription(response);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const hasActiveSubscription = subscription?.hasActiveSubscription || subscription?.status === 'active' || Boolean(subscription?.plan);

  const getPlanLabel = (plan) => {
    const planMap = {
      builder: 'Basic Plan',
      launch: 'Pro Plan',
      growth: 'Elite Plan'
    };
    return planMap[plan?.toLowerCase()] || plan || 'No Plan';
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
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
            {/* Mobile buttons */}
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
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
                  {subscription?.credits !== null && subscription?.credits !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Credits</span>
                      <span className="text-white font-medium">{Number(subscription.credits).toLocaleString()}</span>
                    </div>
                  )}
                  {subscription?.credits === null || subscription?.credits === undefined ? (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Credits</span>
                      <span className="text-white font-medium">Unlimited</span>
                    </div>
                  ) : null}
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

