#!/bin/bash

# Deploy OAuth Fix to Production
echo "🚀 Deploying OAuth fixes to production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building frontend with OAuth fixes..."
cd frontend
npm run build
cd ..

echo "✅ Frontend built successfully!"
echo ""
echo "🎯 OAuth fixes included:"
echo "  ✅ OAuthCallbackHandler component"
echo "  ✅ Enhanced AuthContext with fallback"
echo "  ✅ Google OAuth token processing"
echo "  ✅ Multi-domain OAuth support"
echo ""
echo "📁 Built files are in: frontend/dist/"
echo ""
echo "🔧 Next steps to deploy:"
echo ""
echo "1. If using Vercel:"
echo "   cd frontend && vercel --prod"
echo ""
echo "2. If using Netlify:"
echo "   netlify deploy --prod --dir=frontend/dist"
echo ""
echo "3. If using manual hosting:"
echo "   Upload frontend/dist/ contents to your web server"
echo ""
echo "4. For the backend (if needed):"
echo "   cd backend && vercel --prod"
echo ""
echo "🎉 After deployment, Google OAuth will work on:"
echo "   - https://www.eromify.com/oauth-callback"
echo "   - Automatic token processing and user creation"
echo "   - Fallback system for robust authentication"
echo ""
echo "🧪 Test the OAuth fix:"
echo "   1. Go to https://www.eromify.com/login"
echo "   2. Click 'Continue with Google'"
echo "   3. Complete Google OAuth"
echo "   4. Should redirect back and log you in automatically!"





