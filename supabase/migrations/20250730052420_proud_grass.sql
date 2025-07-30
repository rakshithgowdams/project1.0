/*
  # Update generated_images table to reference custom users table

  1. Changes
    - Drop foreign key constraint to auth.users
    - Add foreign key constraint to custom users table
    - Update RLS policies to work with custom users table

  2. Security
    - Update RLS policies to use custom user identification
*/

-- Drop existing foreign key constraint
ALTER TABLE generated_images 
DROP CONSTRAINT IF EXISTS generated_images_user_id_fkey;

-- Add new foreign key constraint to custom users table
ALTER TABLE generated_images 
ADD CONSTRAINT generated_images_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can insert own images" ON generated_images;
DROP POLICY IF EXISTS "Users can read own images" ON generated_images;

-- Create new RLS policies for custom users table
CREATE POLICY "Users can insert own images"
  ON generated_images
  FOR INSERT
  WITH CHECK (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Users can read own images"
  ON generated_images
  FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true));

-- Create policy for public read access (for explore feature)
CREATE POLICY "Public can read all images"
  ON generated_images
  FOR SELECT
  USING (true);