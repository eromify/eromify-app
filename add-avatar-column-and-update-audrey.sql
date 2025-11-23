-- Add avatar_url column to influencers table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Add avatar_url column (will do nothing if column already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'influencers' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.influencers 
        ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Update Audrey with the marketplace model image
-- If Audrey was based on Riya Yasin, use this:
UPDATE public.influencers
SET avatar_url = '/model22 3.jpeg'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vintorpzo@gmail.com'
)
AND name = 'Audrey';

-- If Audrey was based on another model, change '/model22 3.jpeg' to the correct image path
-- Common models:
-- Adriana Perez: '/model19 1.jpeg'
-- Veronica Millsap: '/model20 1.webp'
-- Luna Williams: '/model24.webp'
-- Riya Yasin: '/model22 3.jpeg'

