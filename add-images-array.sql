-- Add images column to store multiple images as JSON array
-- Run this in Supabase SQL Editor

-- Add images column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'influencers' 
        AND column_name = 'images'
    ) THEN
        ALTER TABLE public.influencers 
        ADD COLUMN images JSONB;
    END IF;
END $$;

-- Update Riya Yasin with all 3 images
UPDATE public.influencers
SET images = '["/model22 3.jpeg", "/model 22 11.jpeg", "/model 22 5.png"]'::jsonb
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vintorpzo@gmail.com'
)
AND name = 'Riya Yasin';

