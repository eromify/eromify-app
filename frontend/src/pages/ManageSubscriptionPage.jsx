import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { CreditCard, Loader2 } from 'lucide-react'
import paymentService from '../services/paymentService'

const PLAN_DETAILS = {
  builder: {
    label: 'Builder Plan',
    description: 'Starter package with 500 credits and 1 influencer training.',
    gradient: 'from-blue-500/20 to-blue-400/10 border-blue-500/30'
  },
  launch: {
    label: 'Launch Plan',
    description: 'Perfect to get going with 2 influencer trainings and 2000 credits.',
    gradient: 'from-purple-500/20 to-pink-500/10 border-purple-500/30'
  },
  growth: {
    label: 'Growth Plan',
    description: 'Unlimited credits and trainings for teams scaling content output.',
    gradient: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/30'
  }
}

const CANCEL_FLAG_KEY = 'eromify/mockSubscriptionCancelled'

const ManageSubscriptionPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [showCancelNotice, setShowCancelNotice] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const storedFlag = localStorage.getItem(CANCEL_FLAG_KEY)
      if (storedFlag === 'true') {
        setCancelled(true)
      }
    } catch (error) {
      console.warn('Unable to read cancellation flag from storage', error)
    }
  }, [])

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoading(true)
        const response = await paymentService.getSubscription()
        setSubscription(response)
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
        setSubscription(null)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [])

  const hasSubscription =
    subscription?.hasActiveSubscription ||
    subscription?.status === 'active' ||
    Boolean(subscription?.plan)

  const activePlanKey = subscription?.plan?.toLowerCase()
  const planConfig = PLAN_DETAILS[activePlanKey] || null
  const creditsText =
    subscription?.credits === null || subscription?.credits === undefined
      ? 'Unlimited credits'
      : `${Number(subscription.credits).toLocaleString()} credits`
  const trainingsValue = subscription?.influencerTrainings
  const trainingsText =
    trainingsValue === null || trainingsValue === undefined
      ? 'Unlimited influencer trainings'
      : `${trainingsValue} influencer training${trainingsValue === 1 ? '' : 's'}`
  const billingText = subscription?.billing
    ? `${subscription.billing.charAt(0).toUpperCase() + subscription.billing.slice(1)} billing`
    : 'Monthly billing'

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Manage Subscriptions</h1>
            <p className="text-gray-400">
              View the details of your current subscription. Changes here are simulated for testing purposes.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                <p className="text-gray-400">Loading subscription details...</p>
              </div>
            </div>
          ) : hasSubscription ? (
            <div className="space-y-6">
              <div
                className={`bg-black border ${
                  planConfig?.gradient || 'from-purple-500/15 to-pink-500/5 border-purple-500/20'
                } rounded-2xl p-8`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-black border border-gray-800 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-purple-300" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-3">
                        Current Plan
                      </span>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {planConfig?.label || 'Active Subscription'}
                      </h2>
                      <p className="text-gray-400 max-w-xl">
                        {planConfig?.description ||
                          'You currently have an active subscription with full access to your plan benefits.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                      Billing Cycle
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {subscription?.billing
                        ? subscription.billing.charAt(0).toUpperCase() +
                          subscription.billing.slice(1)
                        : 'Monthly'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[creditsText, trainingsText, billingText].map(highlight => (
                    <div
                      key={highlight}
                      className="bg-black/40 border border-gray-900 rounded-xl p-4 text-center"
                    >
                      <p className="text-sm text-gray-400">{highlight}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <button
                    onClick={() => !cancelled && setShowCancelNotice(true)}
                    disabled={cancelled}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all ${
                      cancelled
                        ? 'bg-gray-900/80 border border-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20'
                    }`}
                  >
                    {cancelled ? 'Subscription Canceled' : 'Cancel Subscription'}
                  </button>
                  {cancelled && (
                    <p className="text-xs text-gray-500 mt-3">
                      This cancellation is simulated locally for testing purposes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center">
                    <CreditCard className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No Active Subscription Found</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  You don&apos;t have an active subscription. Choose a plan to unlock full access.
                </p>
                <button
                  onClick={() => navigate('/credits')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Browse Plans
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCancelNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-black border border-gray-900 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-purple-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Subscription Canceled</h3>
            <p className="text-gray-400">
              Your subscription has been canceled. You&apos;ll continue to have access for the remainder of the billing cycle.
            </p>
            <button
              onClick={() => {
                setShowCancelNotice(false)
                try {
                  localStorage.setItem(CANCEL_FLAG_KEY, 'true')
                } catch (error) {
                  console.warn('Unable to store cancellation flag', error)
                }
                setCancelled(true)
              }}
              className="w-full px-6 py-3 rounded-lg font-semibold bg-gray-900 border border-gray-800 text-white hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ManageSubscriptionPage
