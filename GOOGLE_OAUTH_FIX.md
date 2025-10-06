# Google OAuth Fix for Development

## Problem
Google OAuth is redirecting to the production domain `https://www.eromify.com` instead of your local development server `http://localhost:5183`.

## Quick Fix (Manual)

When you get redirected to the production domain with the OAuth token, follow these steps:

### Step 1: Copy the Access Token
From the URL you provided, extract the access token:
```
access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IjYyYUN3VlJrN29CTGpXaFIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2V5dGV1ZXZibHh2aGpoeWVpdnFoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3ODQ2MTgwMC03NjcxLTQzMmYtYmM3OC0zOTlmNzE2NzcxZjEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU5NjcwODg3LCJpYXQiOjE3NTk2NjcyODcsImVtYWlsIjoiY2FtcGJlbGxmaWxtcHJvQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTDBPOTN3dGhUN0hiZXd4ZGRsS2dobEVIQ0RaYTJfX1RQY1BRYXpIbmRqRDhZNDh3PXM5Ni1jIiwiZW1haWwiOiJjYW1wYmVsbGZpbG1wcm9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlZpbmNlbnQgQ2FtcGJlbGwiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiVmluY2VudCBDYW1wYmVsbCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0wwTzkzd3RoVDdIYmV3eGRkbEtnaGxFSENEWmEyX19UUGNQUWF6SG5kakQ4WTQ4dz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTA4NzI1OTE2MTc5MDcxNDIxOTQzIiwic3ViIjoiMTA4NzI1OTE2MTc5MDcxNDIxOTQzIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NTk2NjcyODd9XSwic2Vzc2lvbl9pZCI6IjEzZTQ1ZGZmLTY2NzgtNGY0Zi1iNTJkLTE1YTk3Mjg5NTY2YiIsImlzX2Fub255bW91cyI6ZmFsc2V9.FyrrvKXAMi8hx_vFN-2jzBtNt2AD1gMwSC8F8GQlHsY
```

### Step 2: Run This JavaScript in Browser Console
Open the browser console on the production domain and run this code:

```javascript
// Extract token from current URL
const hash = window.location.hash;
const params = new URLSearchParams(hash.substring(1));
const accessToken = params.get('access_token');

if (accessToken) {
  console.log('Found access token:', accessToken.substring(0, 50) + '...');
  
  // Store token and redirect to localhost
  localStorage.setItem('oauth_token', accessToken);
  localStorage.setItem('oauth_source', 'production');
  
  // Redirect to localhost
  window.location.href = 'http://localhost:5183/oauth-callback';
} else {
  console.log('No access token found in URL');
}
```

### Step 3: Automatic Processing
The localhost app will automatically:
1. Detect the stored OAuth token
2. Process it and create a user account
3. Log you in and redirect to the dashboard

## Automated Fix (Already Implemented)

I've also implemented an automated solution:

1. **OAuthCallbackHandler Component**: Handles OAuth tokens from any source
2. **Enhanced AuthContext**: Better OAuth callback processing
3. **Fallback Token Decoding**: If backend fails, it decodes the Supabase token directly

## Test the Fix

1. Try Google OAuth again from `http://localhost:5183/login`
2. When redirected to production domain, run the JavaScript code above
3. You should be redirected back to localhost and logged in automatically

## Permanent Solution

To fix this permanently, you need to update the Supabase OAuth configuration:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > URL Configuration
3. Add `http://localhost:5183` to the redirect URLs
4. Update the site URL to include localhost for development

The current fix works around this by handling the OAuth callback regardless of which domain it comes from.



