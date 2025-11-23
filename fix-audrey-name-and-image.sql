-- Fix Audrey to show the marketplace model name and image
-- Run this in Supabase SQL Editor

-- Update Audrey's name to the marketplace model name (Riya Yasin) and add image
UPDATE public.influencers
SET 
  name = 'Riya Yasin',
  avatar_url = '/model22 3.jpeg'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vintorpzo@gmail.com'
)
AND name = 'Audrey';

-- If it was a different model, change both the name and image path:
-- Adriana Perez: name = 'Adriana Perez', avatar_url = '/model19 1.jpeg'
-- Veronica Millsap: name = 'Veronica Millsap', avatar_url = '/model20 1.webp'  
-- Luna Williams: name = 'Luna Williams', avatar_url = '/model24.webp'
-- Riya Yasin: name = 'Riya Yasin', avatar_url = '/model22 3.jpeg'

