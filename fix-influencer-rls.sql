-- Add RLS policies to allow backend to create and manage influencers
-- Run this in Supabase SQL Editor

-- Allow anon role (backend) to insert influencers
CREATE POLICY "Anon can insert influencers" ON public.influencers
FOR INSERT TO anon
WITH CHECK (true);

-- Allow anon role (backend) to read all influencers (for fetching)
CREATE POLICY "Anon can read all influencers" ON public.influencers
FOR SELECT TO anon
USING (true);

-- Allow anon role (backend) to update influencers
CREATE POLICY "Anon can update influencers" ON public.influencers
FOR UPDATE TO anon
USING (true);

-- Allow anon role (backend) to delete influencers
CREATE POLICY "Anon can delete influencers" ON public.influencers
FOR DELETE TO anon
USING (true);

