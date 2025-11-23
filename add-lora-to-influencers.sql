-- Add metadata column to influencers table for storing LoRA model names
-- Run this in your Supabase SQL Editor

-- Add metadata column (JSONB for flexibility)
ALTER TABLE public.influencers 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add an index for better performance when querying metadata
CREATE INDEX IF NOT EXISTS idx_influencers_metadata ON public.influencers USING gin(metadata);

-- Example: Update your influencers with their LoRA model names
-- Replace the UUIDs and lora names with your actual values

-- For Riya Yasin (replace 'riya-uuid-here' with actual UUID)
-- UPDATE public.influencers 
-- SET metadata = jsonb_set(
--   COALESCE(metadata, '{}'::jsonb),
--   '{lora_model}',
--   '"riya.safetensors"'
-- )
-- WHERE name = 'Riya Yasin';

-- For your second influencer (replace with actual name and lora file)
-- UPDATE public.influencers 
-- SET metadata = jsonb_set(
--   COALESCE(metadata, '{}'::jsonb),
--   '{lora_model}',
--   '"influencer2.safetensors"'
-- )
-- WHERE name = 'Influencer Name';

-- Verify the updates
SELECT id, name, metadata FROM public.influencers;

