-- Run this in Supabase SQL Editor to check your user's status
-- Replace YOUR_EMAIL with your actual email

SELECT 
  id,
  email,
  subscription_status,
  subscription_plan,
  subscription_billing,
  credits,
  influencer_trainings,
  stripe_customer_id
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
WHERE u.email = 'YOUR_EMAIL';

-- Check if there are any errors in the generated_content table
SELECT 
  COUNT(*) as total_generations,
  MAX(created_at) as last_generation
FROM public.generated_content
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');

