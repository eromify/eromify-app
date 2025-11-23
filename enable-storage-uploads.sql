-- Enable public uploads to marketplace-assets bucket
-- Run this in Supabase SQL Editor

-- Allow anyone to INSERT (upload) files to marketplace-assets
CREATE POLICY "Allow public uploads to marketplace-assets"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'marketplace-assets');

-- Allow anyone to SELECT (read) files from marketplace-assets  
CREATE POLICY "Allow public reads from marketplace-assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'marketplace-assets');

-- Allow anyone to UPDATE files in marketplace-assets
CREATE POLICY "Allow public updates to marketplace-assets"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'marketplace-assets');

