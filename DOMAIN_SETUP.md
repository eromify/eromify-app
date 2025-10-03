# Domain Setup Guide for Eromify

## Domain Structure
- **Everything**: `eromify.com` (hosted on Squarespace)
- **Landing Page**: `eromify.com/` (Squarespace)
- **Application**: `eromify.com/app/` (Squarespace)
- **API**: `eromify.com/api/` (Squarespace)

## Prerequisites
- Domain: `eromify.com` (purchased with Squarespace)
- Squarespace account with developer access
- SSL certificate (provided by Squarespace)

## Step 1: Squarespace Setup

### Enable Developer Platform
1. Go to Squarespace Settings
2. Navigate to **Advanced** > **Developer Platform**
3. Enable Developer Platform
4. Create a new Developer Site

### Install Squarespace CLI
```bash
# Install Squarespace CLI
npm install -g @squarespace/cli

# Login to Squarespace
sqs login

# Initialize project
sqs init
```

## Step 2: Project Structure Setup

### Create Squarespace Project Structure
```
eromify-squarespace/
├── site/
│   ├── pages/
│   │   ├── index.html (Landing Page)
│   │   └── app.html (Application)
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── api/
│       └── server.js (Backend API)
├── package.json
└── sqs.config.json
```

## Step 3: Environment Variables Update

### Squarespace Environment Variables
```env
# In Squarespace Settings > Advanced > Code Injection
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_key
```

### API Configuration
```javascript
// In site/api/server.js
const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  openaiKey: process.env.OPENAI_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  baseUrl: 'https://eromify.com'
}
```

## Step 4: SSL Certificate
Squarespace automatically provides SSL certificates for all domains:
- Automatic HTTPS for eromify.com
- No additional configuration needed
- Certificate auto-renewal

## Step 5: Update Supabase Settings
1. Go to Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Add your domain to "Site URL" and "Redirect URLs":
   - Site URL: `https://eromify.com`
   - Redirect URLs: `https://eromify.com/app/dashboard`

## Step 6: Deploy to Squarespace
```bash
# Build and deploy
sqs build
sqs deploy

# Or use watch mode for development
sqs watch
```

## Step 7: Test Domain Connection
```bash
# Test landing page
curl -I https://eromify.com

# Test app
curl -I https://eromify.com/app

# Test API
curl -I https://eromify.com/api/health
```

## Step 8: Update Google OAuth (if using)
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Update authorized redirect URIs:
   - `https://eromify.com/app/auth/callback`

## Troubleshooting
- DNS propagation can take 24-48 hours
- Clear browser cache after domain setup
- Check SSL certificate status
- Verify environment variables are correctly set
