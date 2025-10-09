#!/bin/bash

echo "🚀 Deploying Onboarding Process & Stripe Integration to Production..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build frontend with all onboarding changes
echo "🏗️  Building frontend with onboarding pages..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"
cd ..

# Copy built files to deployment folder
echo "📦 Copying frontend build to deployment folder..."
rm -rf deployment/frontend/dist
rm -rf deployment/frontend/assets
cp -r frontend/dist deployment/frontend/
cp frontend/dist/index.html deployment/frontend/
cp -r frontend/dist/assets deployment/frontend/

# Copy updated backend files
echo "📦 Copying updated backend routes..."
cp backend/routes/payments.js deployment/backend/routes/
cp backend/routes/payments.js deployment/backend/backend/routes/

echo ""
echo "✅ All files copied to deployment folder!"
echo ""
echo "🎯 What was deployed:"
echo "   ✅ Complete 7-step onboarding process"
echo "   ✅ Marketplace model selection"
echo "   ✅ Plan selection page (Pro, Basic, Elite)"
echo "   ✅ Stripe checkout integration"
echo "   ✅ Checkout modal with plan summary"
echo "   ✅ Mobile-responsive design"
echo "   ✅ Environment-aware payment URLs"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo ""
echo "1. 📊 Run Supabase Migration:"
echo "   - Open Supabase SQL Editor"
echo "   - Run: supabase-subscription-migration.sql"
echo "   - This adds subscription fields to users table"
echo ""
echo "2. 🔑 Configure Stripe:"
echo "   - Add STRIPE_SECRET_KEY to backend .env"
echo "   - Add STRIPE_WEBHOOK_SECRET to backend .env"
echo "   - Set up webhook: https://your-backend.com/api/payments/webhook"
echo "   - Select events: checkout.session.completed, invoice.payment_succeeded, customer.subscription.deleted"
echo ""
echo "3. 🚀 Deploy to Vercel:"
echo "   cd frontend"
echo "   npx vercel --prod --yes"
echo ""
echo "4. 🧪 Test the deployment:"
echo "   ✓ Login redirects to /onboarding"
echo "   ✓ All 7 onboarding steps work"
echo "   ✓ Model selection works"
echo "   ✓ Plan selection opens checkout modal"
echo "   ✓ Stripe checkout completes successfully"
echo "   ✓ Success URL redirects to /dashboard"
echo ""
echo "📝 Files ready for deployment in:"
echo "   - deployment/frontend/"
echo "   - deployment/backend/"
echo ""
echo "🔗 Deployment checklist in: DEPLOYMENT_ONBOARDING_STRIPE.md"
echo ""

