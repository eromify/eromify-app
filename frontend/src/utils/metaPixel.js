// Meta Pixel tracking utilities
// Pixel ID: 752646057793043

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
 * Track AddToCart event - when user adds a product/plan to cart
 * @param {Object} cartData - Cart information
 * @param {string} cartData.contentName - Name of the item added to cart
 * @param {string} cartData.contentCategory - Category of the item
 * @param {Array<string>} cartData.contentIds - Array of content IDs
 * @param {number} cartData.value - Value of the item
 * @param {string} cartData.currency - Currency (e.g., USD)
 * @param {number} cartData.numItems - Number of items added
 * @param {string} cartData.userEmail - User's email
 */
export const trackAddToCart = (cartData) => {
  console.log('🎯 trackAddToCart called with:', cartData);

  // Skip tracking on localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Meta Pixel: AddToCart event tracked (localhost mode)', cartData);
    return;
  }

  if (typeof window !== 'undefined' && window.fbq) {
    console.log('🎯 Calling fbq("track", "AddToCart", ...)');
    window.fbq('track', 'AddToCart', {
      content_name: cartData.contentName,
      content_category: cartData.contentCategory,
      content_ids: cartData.contentIds,
      content_type: 'product',
      value: cartData.value,
      currency: cartData.currency,
      num_items: cartData.numItems,
      // User data for better matching
      em: hashEmail(cartData.userEmail),
      timestamp: new Date().toISOString()
    });
    console.log('Meta Pixel: AddToCart event tracked', cartData);
  }
};

/**
 * Track Purchase event - when user completes a successful payment
 * @param {Object} purchaseData - Purchase information
 * @param {number} purchaseData.value - Purchase value in cents
 * @param {string} purchaseData.currency - Currency code
 * @param {string} purchaseData.plan - Plan name
 * @param {string} purchaseData.sessionId - Payment session ID
 * @param {string} purchaseData.userEmail - User's email
 */
export const trackPurchase = (purchaseData) => {
  console.log('🎯 trackPurchase called with:', purchaseData);

  // Skip tracking on localhost for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Meta Pixel: Purchase event tracked (localhost mode)', purchaseData);
    return;
  }

  if (typeof window !== 'undefined' && window.fbq) {
    console.log('🎯 Calling fbq("track", "Purchase", ...)');
    window.fbq('track', 'Purchase', {
      content_name: purchaseData.plan || 'Subscription Plan',
      content_category: 'Subscription',
      value: purchaseData.value || 0,
      currency: purchaseData.currency || 'USD',
      num_items: 1,
      // User data for better matching
      em: hashEmail(purchaseData.userEmail),
      // Custom parameters
      plan_type: purchaseData.plan || 'unknown',
      session_id: purchaseData.sessionId,
      timestamp: new Date().toISOString()
    });
    console.log('Meta Pixel: Purchase event tracked', purchaseData);
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
