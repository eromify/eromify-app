-- Add AI Girlfriend subscription fields to users table
-- This creates a separate subscription system for AI girlfriend features
-- Run this in your Supabase SQL editor

-- Add AI girlfriend subscription fields
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS ai_girlfriend_subscription_plan TEXT,
ADD COLUMN IF NOT EXISTS ai_girlfriend_subscription_status TEXT CHECK (ai_girlfriend_subscription_status IN ('active', 'cancelled', 'past_due', NULL)),
ADD COLUMN IF NOT EXISTS ai_girlfriend_subscription_billing TEXT CHECK (ai_girlfriend_subscription_billing IN ('monthly', 'quarterly', 'yearly', NULL)),
ADD COLUMN IF NOT EXISTS ai_girlfriend_stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS ai_girlfriend_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS ai_girlfriend_tokens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_girlfriend_tokens_reset_date TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_ai_girlfriend_subscription_status 
ON public.users(ai_girlfriend_subscription_status) 
WHERE ai_girlfriend_subscription_status = 'active';

-- Add comment to document the fields
COMMENT ON COLUMN public.users.ai_girlfriend_subscription_plan IS 'AI girlfriend subscription plan: 1month, 3months, 12months';
COMMENT ON COLUMN public.users.ai_girlfriend_subscription_status IS 'AI girlfriend subscription status: active, cancelled, past_due';
COMMENT ON COLUMN public.users.ai_girlfriend_subscription_billing IS 'AI girlfriend billing period: monthly, quarterly, yearly';
COMMENT ON COLUMN public.users.ai_girlfriend_tokens IS 'Monthly tokens for AI girlfriend chat/generation (resets monthly)';
COMMENT ON COLUMN public.users.ai_girlfriend_tokens_reset_date IS 'Date when tokens should reset (typically start of next month)';

