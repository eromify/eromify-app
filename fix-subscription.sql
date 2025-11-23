-- Fix subscription for vintorpzo@gmail.com
-- Run this in Supabase SQL Editor

UPDATE public.users
SET 
  subscription_status = 'active',
  subscription_plan = 'launch',
  subscription_billing = 'monthly',
  credits = 2000,
  influencer_trainings = 2
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'vintorpzo@gmail.com'
);

