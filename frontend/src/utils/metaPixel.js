// Meta Pixel tracking utilities
// Pixel ID: 1500086607802809

/**
 * Track Lead event - when user registers
 * @param {Object} userData - User information
 * @param {string} userData.email - User's email
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.source - Registration source (email, google, etc.)
 */
export const trackLead = (userData) => {
  console.log('🎯 trackLead called with:', userData);
  
  // Skip tracking on localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Meta Pixel: Lead event tracked (localhost mode)', userData);
    return;
  }
  
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('🎯 Calling fbq("track", "Lead", ...)');
    window.fbq('track', 'Lead', {
      content_name: 'User Registration',
      content_category: 'Sign Up',
      value: 0,
      currency: 'USD',
      // User data for better matching
      em: hashEmail(userData.email),
      fn: hashString(userData.fullName),
      // Custom parameters
      registration_source: userData.source || 'email',
      timestamp: new Date().toISOString()
    });
    
    console.log('Meta Pixel: Lead event tracked', userData);
  }
};

/**
 * Track InitiateCheckout event - when user starts subscription process
 * @param {Object} checkoutData - Checkout information
 * @param {string} checkoutData.plan - Subscription plan name
 * @param {number} checkoutData.value - Plan value in cents
 * @param {string} checkoutData.currency - Currency code
 * @param {string} checkoutData.userEmail - User's email
 */
export const trackInitiateCheckout = (checkoutData) => {
  console.log('🎯 trackInitiateCheckout called with:', checkoutData);
  
  // Skip tracking on localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Meta Pixel: InitiateCheckout event tracked (localhost mode)', checkoutData);
    return;
  }
  
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('🎯 Calling fbq("track", "InitiateCheckout", ...)');
    window.fbq('track', 'InitiateCheckout', {
      content_name: checkoutData.plan || 'Subscription Plan',
      content_category: 'Subscription',
      value: checkoutData.value || 0,
      currency: checkoutData.currency || 'USD',
      num_items: 1,
      // User data for better matching
      em: hashEmail(checkoutData.userEmail),
      // Custom parameters
      plan_type: checkoutData.plan || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    console.log('Meta Pixel: InitiateCheckout event tracked', checkoutData);
  }
};

/**
 * Track ViewContent event - when user views specific content
 * @param {Object} contentData - Content information
 * @param {string} contentData.contentName - Name of the content
 * @param {string} contentData.contentCategory - Category of content
 * @param {string} contentData.userEmail - User's email (optional)
 */
export const trackViewContent = (contentData) => {
  console.log('🎯 trackViewContent called with:', contentData);
  
  // Skip tracking on localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Meta Pixel: ViewContent event tracked (localhost mode)', contentData);
    return;
  }
  
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('🎯 Calling fbq("track", "ViewContent", ...)');
    const eventData = {
      content_name: contentData.contentName,
      content_category: contentData.contentCategory || 'General',
      value: contentData.value || 0,
      currency: contentData.currency || 'USD'
    };
    
    // Add user data if available
    if (contentData.userEmail) {
      eventData.em = hashEmail(contentData.userEmail);
    }
    
    window.fbq('track', 'ViewContent', eventData);
    
    console.log('Meta Pixel: ViewContent event tracked', contentData);
  }
};

/**
 * Track Custom Event - for specific app events
 * @param {string} eventName - Custom event name
 * @param {Object} eventData - Event data
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, {
      ...eventData,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Meta Pixel: Custom event '${eventName}' tracked`, eventData);
  }
};

/**
 * Hash email using SHA-256 for privacy
 * @param {string} email - Email to hash
 * @returns {string} Hashed email
 */
function hashEmail(email) {
  if (!email) return '';
  
  try {
    // Simple hash for frontend (in production, this should be done server-side)
    return btoa(email.toLowerCase().trim());
  } catch (error) {
    console.warn('Failed to hash email:', error);
    return '';
  }
}

/**
 * Hash string using base64 encoding
 * @param {string} str - String to hash
 * @returns {string} Hashed string
 */
function hashString(str) {
  if (!str) return '';
  
  try {
    return btoa(str.toLowerCase().trim());
  } catch (error) {
    console.warn('Failed to hash string:', error);
    return '';
  }
}

/**
 * Check if Meta Pixel is loaded and ready
 * @returns {boolean} True if pixel is ready
 */
export const isPixelReady = () => {
  return typeof window !== 'undefined' && window.fbq;
};

/**
 * Initialize Meta Pixel tracking for the app
 */
export const initializePixel = () => {
  if (isPixelReady()) {
    console.log('Meta Pixel initialized and ready');
    return true;
  } else {
    console.warn('Meta Pixel not loaded yet');
    return false;
  }
};

/**
 * Test Meta Pixel with a simple event
 */
export const testPixel = () => {
  console.log('🧪 Testing Meta Pixel...');
  
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'TestEvent', {
      test: true,
      timestamp: new Date().toISOString()
    });
    console.log('🧪 Test event sent to Meta Pixel');
  } else {
    console.error('🧪 Meta Pixel not available');
  }
};
