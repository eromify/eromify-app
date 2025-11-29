import api from '../utils/api';

const aiGirlfriendPaymentService = {
  /**
   * Create checkout session for AI girlfriend subscription
   * @param {string} plan - '1month', '3months', or '12months'
   * @returns {Promise} Checkout session with URL
   */
  async createCheckoutSession(plan) {
    try {
      const response = await api.post('/ai-girlfriend-payments/create-checkout-session', {
        plan
      });
      return response.data;
    } catch (error) {
      console.error('AI Girlfriend checkout error:', error);
      throw error;
    }
  },

  /**
   * Get AI girlfriend subscription status
   * @returns {Promise} Subscription data
   */
  async getSubscription() {
    try {
      const response = await api.get('/ai-girlfriend-payments/subscription');
      return response.data;
    } catch (error) {
      console.error('AI Girlfriend subscription fetch error:', error);
      throw error;
    }
  },

  /**
   * Cancel AI girlfriend subscription
   * @returns {Promise} Cancellation result
   */
  async cancelSubscription() {
    try {
      const response = await api.post('/ai-girlfriend-payments/cancel-subscription');
      return response.data;
    } catch (error) {
      console.error('AI Girlfriend subscription cancellation error:', error);
      throw error;
    }
  },

  /**
   * Get pricing plans
   * @returns {Promise} Pricing plans data
   */
  async getPricingPlans() {
    try {
      const response = await api.get('/ai-girlfriend-payments/pricing-plans');
      return response.data;
    } catch (error) {
      console.error('AI Girlfriend pricing plans fetch error:', error);
      throw error;
    }
  },

  /**
   * Get user limits (free vs paid)
   * @returns {Promise} Limits data
   */
  async getLimits() {
    try {
      const response = await api.get('/ai-girlfriend-payments/limits');
      return response.data;
    } catch (error) {
      console.error('AI Girlfriend limits fetch error:', error);
      throw error;
    }
  }
};

export default aiGirlfriendPaymentService;

