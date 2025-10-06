# Authentication Setup Guide

## Overview
The authentication system has been fixed to support both normal email/password authentication and Google OAuth. The system works with Supabase for authentication but has fallback mock mode when Supabase is not configured.

## Environment Variables Required

### Frontend (.env)
Create `/Users/vincent/Eromify/frontend/.env`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Eromify
VITE_APP_DESCRIPTION=AI Influencer Generator

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Backend (.env)
Create `/Users/vincent/Eromify/backend/.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your project settings, go to "API" section
3. Copy the "Project URL" and "anon public" key
4. Update your environment files with these values
5. In Authentication settings, enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Set redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

## How It Works

### Normal Authentication
- Users can register with email/password
- Passwords are hashed and stored securely in Supabase
- JWT tokens are generated for API authentication

### Google OAuth
- Users click "Continue with Google"
- Redirected to Google OAuth flow
- Supabase handles the OAuth callback
- Access token is exchanged for JWT token
- User is logged in and redirected to dashboard

### Fallback Mode
- If Supabase is not configured, the system falls back to mock authentication
- This allows development without Supabase setup
- Mock users are created with temporary IDs

## Testing

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm run dev`
3. Try registering with email/password
4. Try Google OAuth login
5. Check browser console for any errors

## Features Fixed

✅ Email/password registration
✅ Email/password login  
✅ Google OAuth registration/login
✅ JWT token management
✅ User session persistence
✅ Proper error handling
✅ Fallback mock mode
✅ OAuth callback handling



