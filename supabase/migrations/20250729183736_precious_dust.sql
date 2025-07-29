/*
  # Create generated_images table for user image history

  1. New Tables
    - `generated_images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `prompt` (text, the user's prompt)
      - `image_url` (text, the generated image URL)
      - `style` (text, selected style preset)
      - `aspect_ratio` (text, selected aspect ratio)
      - `output_format` (text, jpg or png)
      - `safety_filter_level` (text, safety filter setting)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `generated_images` table
    - Add policy for users to read their own images
    - Add policy for users to insert their own images

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS generated_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt text NOT NULL,
  image_url text NOT NULL,
  style text DEFAULT '',
  aspect_ratio text DEFAULT '1:1',
  output_format text DEFAULT 'png',
  safety_filter_level text DEFAULT 'block_medium_and_above',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own images"
  ON generated_images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON generated_images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at DESC);