-- Migration: Add onboarding_completed column to users table
-- Run this in your Supabase SQL editor if your database already exists

-- Add the onboarding_completed column to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing users to have onboarding_completed = true
-- (assuming they've already been using the platform)
-- Comment out the line below if you want existing users to go through onboarding
UPDATE public.users SET onboarding_completed = TRUE WHERE created_at < NOW();

-- Or uncomment this line if you want ALL users (including existing) to go through onboarding
-- UPDATE public.users SET onboarding_completed = FALSE;

