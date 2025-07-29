/*
  # Create Storage Bucket for Generated Images

  1. Storage Setup
    - Create 'generated-images' bucket for storing AI-generated images
    - Set up public access for image viewing
    - Configure appropriate policies for authenticated users

  2. Security
    - Users can only upload to their own folder (user_id/)
    - Public read access for viewing images
    - Authenticated users can manage their own images
*/

-- Create the storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload images to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'generated-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own images
CREATE POLICY "Users can view own images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'generated-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all images (for sharing)
CREATE POLICY "Public can view all images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'generated-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'generated-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);