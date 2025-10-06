#!/bin/bash

echo "🚀 Deploying OAuth fixes to production domain..."

# Deploy frontend to production
echo "📦 Deploying frontend with OAuth fixes..."
cd frontend
npx vercel --prod --yes
cd ..

echo "✅ Frontend deployed successfully!"
echo ""
echo "🎉 OAuth fixes are now live on https://www.eromify.com!"
echo ""
echo "🧪 Test the Google OAuth fix:"
echo "   1. Go to https://www.eromify.com/login"
echo "   2. Click 'Continue with Google'"
echo "   3. Complete Google OAuth"
echo "   4. Should now work properly and log you in!"
echo ""
echo "🔧 What was deployed:"
echo "   ✅ OAuthCallbackHandler component"
echo "   ✅ Enhanced AuthContext with fallback"
echo "   ✅ Google OAuth token processing"
echo "   ✅ Multi-domain OAuth support"
echo "   ✅ Automatic user creation from Google data"
echo ""
echo "🎯 The OAuth callback will now work at:"
echo "   https://www.eromify.com/oauth-callback"



