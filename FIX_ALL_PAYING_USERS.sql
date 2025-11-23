-- 🚨 CRITICAL: Activate all paying users who have Stripe customer IDs
-- These users paid but the webhook failed to set subscription_status to 'active'

-- First, let's see how many users are affected
SELECT 
  COUNT(*) as affected_users,
  'Users with Stripe ID but no active status' as description
FROM public.users
WHERE stripe_customer_id IS NOT NULL
  AND (subscription_status IS NULL OR subscription_status != 'active');

-- Fix all paying users at once
UPDATE public.users
SET 
  subscription_status = 'active'
WHERE stripe_customer_id IS NOT NULL
  AND (subscription_status IS NULL OR subscription_status != 'active');

-- Verify the fix
SELECT 
  email,
  subscription_status,
  subscription_plan,
  subscription_billing,
  credits,
  stripe_customer_id
FROM auth.users u
JOIN public.users pu ON u.id = pu.id
WHERE pu.stripe_customer_id IS NOT NULL
ORDER BY pu.created_at DESC
LIMIT 20;

