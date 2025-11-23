-- Check user ID and subscription status
-- Run this in Supabase SQL Editor

SELECT 
  au.id as auth_user_id,
  au.email,
  pu.id as public_user_id,
  pu.subscription_status,
  pu.subscription_plan,
  pu.credits,
  pu.influencer_trainings
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'vintorpzo@gmail.com';

