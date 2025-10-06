// Test script to verify OAuth callback is working on production
// Run this in the browser console on https://www.eromify.com

console.log('🧪 Testing OAuth callback on production domain...');

// Test 1: Check if OAuthCallbackHandler route exists
fetch('/oauth-callback')
  .then(response => {
    console.log('✅ OAuth callback route accessible:', response.status);
    return response.text();
  })
  .then(html => {
    if (html.includes('Processing Google OAuth')) {
      console.log('✅ OAuthCallbackHandler component is working!');
    } else {
      console.log('⚠️ OAuthCallbackHandler might not be deployed yet');
    }
  })
  .catch(error => {
    console.log('❌ OAuth callback route not accessible:', error);
  });

// Test 2: Check if the built files include OAuth components
fetch('/assets/')
  .then(response => response.text())
  .then(html => {
    if (html.includes('index-')) {
      console.log('✅ Built assets are accessible');
    }
  })
  .catch(error => {
    console.log('⚠️ Built assets might not be deployed:', error);
  });

// Test 3: Simulate OAuth callback with a test token
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V5dGV1ZXZibHh2aGpoeWVpdnFoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3ODQ2MTgwMC03NjcxLTQzMmYtYmM3OC0zOTlmNzE2NzcxZjEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU5NjcwODg3LCJpYXQiOjE3NTk2NjcyODcsImVtYWlsIjoiY2FtcGJlbGxmaWxtcHJvQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTDBPOTN3dGhUN0hiZXd4ZGRsS2dobEVIQ0RaYTJfX1RQY1BRYXpIbmRqRDhZNDh3PXM5Ni1jIiwiZW1haWwiOiJjYW1wYmVsbGZpbG1wcm9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlZpbmNlbnQgQ2FtcGJlbGwiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiVmluY2VudCBDYW1wYmVsbCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0wwTzkzd3RoVDdIYmV3eGRkbEtnaGxFSENEWmEyX19UUGNQUWF6SG5kakQ4WTQ4dz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTA4NzI1OTE2MTc5MDcxNDIxOTQzIiwic3ViIjoiMTA4NzI1OTE2MTc5MDcxNDIxOTQzIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NTk2NjcyODd9XSwic2Vzc2lvbl9pZCI6IjEzZTQ1ZGZmLTY2NzgtNGY0Zi1iNTJkLTE1YTk3Mjg5NTY2YiIsImlzX2Fub255bW91cyI6ZmFsc2V9.FyrrvKXAMi8hx_vFN-2jzBtNt2AD1gMwSC8F8GQlHsY';

console.log('🧪 To test OAuth callback manually:');
console.log('1. Go to: https://www.eromify.com/oauth-callback');
console.log('2. Or run this in console:');
console.log(`   localStorage.setItem('oauth_token', '${testToken}');`);
console.log('   localStorage.setItem("oauth_source", "production");');
console.log('   window.location.href = "/oauth-callback";');

console.log('🎯 OAuth fix deployment test complete!');



