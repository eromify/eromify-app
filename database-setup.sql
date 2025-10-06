-- Eromify AI Influencer Generator Database Schema
-- Run this in your Supabase SQL Editor

-- First, let's create the basic tables we need for our SaaS

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencers table (our main feature)
CREATE TABLE public.influencers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    niche TEXT NOT NULL,
    personality TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    content_style TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content table
CREATE TABLE public.generated_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
    content_type TEXT NOT NULL, -- 'post', 'story', 'caption', etc.
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own influencers" ON public.influencers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own influencers" ON public.influencers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own influencers" ON public.influencers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own influencers" ON public.influencers
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own content" ON public.generated_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content" ON public.generated_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content" ON public.generated_content
    FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create user profile when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



