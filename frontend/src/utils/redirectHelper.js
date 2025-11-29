// Helper to determine redirect path based on where user came from
// AI girlfriend pages should not redirect to onboarding

const AI_GIRLFRIEND_PAGES = [
  '/discover',
  '/chat',
  '/ai-girlfriend-pricing',
  '/account',
  '/generation'
];

export const getRedirectPath = (hasPaidSubscription, returnTo = null) => {
  // PRIORITY 1: If user came from an AI girlfriend page, ALWAYS redirect them back there
  // This takes precedence over subscription status
  if (returnTo && AI_GIRLFRIEND_PAGES.some(page => returnTo.startsWith(page))) {
    console.log('🔄 [redirectHelper] AI girlfriend page detected, redirecting to:', returnTo);
    return returnTo;
  }
  
  // PRIORITY 2: If returnTo is set but not an AI girlfriend page, use it (for main workflow)
  if (returnTo && !returnTo.startsWith('/onboarding')) {
    return returnTo;
  }
  
  // PRIORITY 3: Default behavior for main workflow (only if no returnTo)
  if (hasPaidSubscription) {
    return '/dashboard';
  } else {
    return '/onboarding';
  }
};

export const saveReturnPath = () => {
  const currentPath = window.location.pathname + window.location.search;
  console.log('💾 [saveReturnPath] Current path:', currentPath);
  
  // If we're on /login or /register, check referrer instead
  if (currentPath === '/login' || currentPath === '/register') {
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const referrerPath = referrerUrl.pathname + referrerUrl.search;
        console.log('💾 [saveReturnPath] Checking referrer:', referrerPath);
        
        // Only save if referrer is an AI girlfriend page
        if (AI_GIRLFRIEND_PAGES.some(page => referrerPath.startsWith(page))) {
          sessionStorage.setItem('aiGirlfriendReturnTo', referrerPath);
          console.log('💾 [saveReturnPath] Saved return path from referrer:', referrerPath);
          return;
        }
      } catch (e) {
        console.log('💾 [saveReturnPath] Could not parse referrer:', e);
      }
    }
  }
  
  // Only save if it's an AI girlfriend page
  if (AI_GIRLFRIEND_PAGES.some(page => currentPath.startsWith(page))) {
    sessionStorage.setItem('aiGirlfriendReturnTo', currentPath);
    console.log('💾 [saveReturnPath] Saved return path from current path:', currentPath);
  }
};

export const getReturnPath = () => {
  const returnTo = sessionStorage.getItem('aiGirlfriendReturnTo');
  sessionStorage.removeItem('aiGirlfriendReturnTo'); // Clear after use
  return returnTo;
};

