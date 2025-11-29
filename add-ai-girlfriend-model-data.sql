-- Add AI girlfriend model-specific data (first messages and NSFW photos)
-- Run this in your Supabase SQL Editor

-- Create table for AI girlfriend model data
CREATE TABLE IF NOT EXISTS public.ai_girlfriend_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id INTEGER NOT NULL UNIQUE, -- References the model ID from marketplaceModels
    first_message TEXT NOT NULL, -- Unique, dynamic first message for each model
    nsfw_photo_url TEXT, -- Pre-made NSFW photo URL (optional, can be added later)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_girlfriend_models_model_id ON public.ai_girlfriend_models(model_id);

-- Enable Row Level Security
ALTER TABLE public.ai_girlfriend_models ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read model data (for chat)
CREATE POLICY "Anyone can view AI girlfriend model data" ON public.ai_girlfriend_models
    FOR SELECT USING (true);

-- Only admins can insert/update (you can modify this based on your needs)
-- For now, allow authenticated users to insert/update for easier setup
CREATE POLICY "Authenticated users can manage AI girlfriend model data" ON public.ai_girlfriend_models
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert some example first messages (you can update these later)
-- These are unique, dynamic messages that start conversations
INSERT INTO public.ai_girlfriend_models (model_id, first_message) VALUES
(19, '*She smiles warmly* Hey! I just got back from the gym and I\'m feeling amazing. What are you up to?'),
(20, '*She adjusts her glasses* Oh hey there! I was just thinking about you. How\'s your day going?'),
(22, '*She stretches and yawns* Mmm, just woke up from the best nap. What did I miss?'),
(24, '*She looks at you with a playful grin* You know, I\'ve been waiting for you to message me. What took you so long?'),
(25, '*She sends a quick selfie* Just got ready and I\'m feeling cute today. Want to see more?'),
(59, '*She bites her lip* Hey stranger... I\'ve been thinking about you all day. What\'s on your mind?')
ON CONFLICT (model_id) DO NOTHING;

