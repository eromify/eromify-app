#!/bin/bash

# Eromify Deployment Script
# This script prepares the application for production deployment

echo "🚀 Starting Eromify deployment preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create production environment files if they don't exist
echo "📝 Creating production environment files..."

# Frontend production env
if [ ! -f "frontend/.env.production" ]; then
    echo "Creating frontend/.env.production..."
    cat > frontend/.env.production << EOF
# Production Environment Variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://api.eromify.com/api
VITE_APP_NAME=Eromify
VITE_APP_DESCRIPTION=AI Influencer Generator
EOF
fi

# Backend production env
if [ ! -f "backend/.env.production" ]; then
    echo "Creating backend/.env.production..."
    cat > backend/.env.production << EOF
# Production Environment Variables
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
EOF
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm install
cd ../backend && npm install
cd ..

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p deployment
cp -r frontend/dist deployment/frontend
cp -r backend deployment/backend
cp -r deployment/backend/node_modules deployment/backend/
cp deployment/backend/.env.production deployment/backend/.env

# Create deployment README
cat > deployment/README.md << EOF
# Eromify Production Deployment

## Files Structure
- \`frontend/\` - Built React application
- \`backend/\` - Node.js backend with dependencies

## Deployment Instructions

### Vercel (Recommended)
\`\`\`bash
# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
cd ../backend
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
# Deploy frontend
netlify deploy --prod --dir=frontend

# Deploy backend separately
# Use your preferred Node.js hosting service
\`\`\`

### Manual Server
\`\`\`bash
# Upload files to your server
# Install PM2 for process management
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "eromify-backend"

# Serve frontend with nginx or similar
\`\`\`

## Environment Variables
Make sure to update the environment variables in both frontend and backend with your actual values:
- Supabase credentials
- OpenAI API key
- JWT secret
- Domain URLs
EOF

echo "✅ Deployment preparation complete!"
echo "📁 Deployment files created in: ./deployment/"
echo "📖 See deployment/README.md for deployment instructions"
echo ""
echo "🔧 Next steps:"
echo "1. Update environment variables with your actual values"
echo "2. Choose your hosting provider"
echo "3. Follow the deployment instructions in deployment/README.md"
echo "4. Configure your domain DNS settings"
echo "5. Test the deployment"
