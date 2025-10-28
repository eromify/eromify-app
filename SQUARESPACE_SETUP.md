# Squarespace Domain Setup for Eromify

## Domain Structure
- **Landing Page**: `eromify.com` (Squarespace)
- **Application**: `app.eromify.com` (Vercel/Netlify)
- **API**: `api.eromify.com` (Vercel/Netlify)

## Step 1: Squarespace Landing Page Setup

### Create Landing Page on Squarespace
1. Go to [Squarespace.com](https://squarespace.com)
2. Create a new site or use existing
3. Choose a template that matches your brand
4. Customize with Eromify branding

### Key Landing Page Elements
- Hero section with value proposition
- Features showcase
- Pricing plans
- Testimonials/social proof
- Call-to-action buttons
- Contact information

## Step 2: Configure DNS in Squarespace

### Access DNS Settings
1. Log into Squarespace
2. Go to **Settings** > **Domains**
3. Click on **eromify.com**
4. Click **DNS Settings**

### Add DNS Records

#### For App Subdomain (app.eromify.com)
```
Type: CNAME
Host: app
Points to: [Your hosting provider's domain]
TTL: 300
```

#### For API Subdomain (api.eromify.com)
```
Type: CNAME
Host: api
Points to: [Your hosting provider's domain]
TTL: 300
```

#### For WWW (www.eromify.com)
```
Type: CNAME
Host: www
Points to: eromify.com
TTL: 300
```

## Step 3: Deploy Application

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend to app.eromify.com
cd frontend
vercel --prod
# When prompted, enter: app.eromify.com

# Deploy backend to api.eromify.com
cd ../backend
vercel --prod
# When prompted, enter: api.eromify.com
```

### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy frontend
cd frontend
netlify deploy --prod --dir=dist
# Configure custom domain: app.eromify.com

# Deploy backend separately
# Use your preferred Node.js hosting service
```

## Step 4: Update Environment Variables

### Frontend (.env.production)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://api.eromify.com/api
VITE_APP_NAME=Eromify
VITE_APP_DESCRIPTION=AI Influencer Generator
```

### Backend (.env.production)
```env
PORT=3001
NODE_ENV=production
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://app.eromify.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 5: Update Supabase Settings

### Authentication URLs
1. Go to Supabase Dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Update the following:
   - **Site URL**: `https://app.eromify.com`
   - **Redirect URLs**: 
     - `https://app.eromify.com/dashboard`
     - `https://app.eromify.com/login`
     - `https://app.eromify.com/register`

## Step 6: Update Google OAuth

### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** > **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs**:
   - `https://app.eromify.com/auth/callback`

## Step 7: Test Everything

### Test URLs
```bash
# Test landing page
curl -I https://eromify.com

# Test app
curl -I https://app.eromify.com

# Test API
curl -I https://api.eromify.com/health
```

### Test Authentication Flow
1. Visit `https://eromify.com`
2. Click "Get Started" or "Sign Up"
3. Should redirect to `https://app.eromify.com/register`
4. Test registration and login
5. Verify Google OAuth works

## Step 8: SEO and Analytics

### Squarespace SEO
1. Go to **Settings** > **SEO**
2. Set up meta descriptions
3. Configure social sharing
4. Add Google Analytics

### Application Analytics
1. Add Google Analytics to React app
2. Set up conversion tracking
3. Monitor user behavior

## Troubleshooting

### DNS Issues
- DNS propagation can take 24-48 hours
- Use `dig` or `nslookup` to check DNS resolution
- Clear browser cache after changes

### SSL Issues
- Most hosting providers provide automatic SSL
- Check SSL certificate status
- Ensure HTTPS is working

### CORS Issues
- Update CORS settings in backend
- Check environment variables
- Verify domain URLs are correct

## Benefits of This Setup

1. **Professional Appearance**: Clean separation of marketing and app
2. **SEO Optimization**: Landing page gets full SEO benefits
3. **Scalability**: Easy to manage and scale separately
4. **User Experience**: Clear navigation between marketing and app
5. **Analytics**: Separate tracking for marketing vs app usage










