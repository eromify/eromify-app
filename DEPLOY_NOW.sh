#!/bin/bash

echo "🚀 Deploying Onboarding to Production..."
echo ""

cd frontend

echo "📦 Building and deploying to Vercel..."
npx vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎯 What was deployed:"
echo "   ✅ Complete 7-step onboarding process"
echo "   ✅ Marketplace model selection"
echo "   ✅ Plan selection with Stripe checkout"
echo "   ✅ Mobile-responsive design"
echo ""
echo "🧪 Test it at: https://www.eromify.com/onboarding"
echo ""

