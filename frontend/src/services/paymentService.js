import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create checkout session
export const createCheckoutSession = async (plan, billing) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/payments/create-checkout-session`,
      { plan, billing },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Get user subscription status
export const getSubscriptionStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/payments/subscription`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/payments/cancel-subscription`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

// Get pricing plans
export const getPricingPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/payments/pricing-plans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    throw error;
  }
};
