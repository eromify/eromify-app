-- Link Bria Sanchez to bria.safetensors
UPDATE public.influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"bria.safetensors"'
)
WHERE name ILIKE '%bria%';

-- Link Riya Yasin to riya.safetensors
UPDATE public.influencers 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{lora_model}',
  '"riya.safetensors"'
)
WHERE name ILIKE '%riya%';

-- Verify it worked
SELECT id, name, metadata->'lora_model' as lora_model FROM public.influencers;

