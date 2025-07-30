/*
  # Create users table for Google OAuth

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `google_id` (text, unique) - Google user ID
      - `email` (text, unique) - User email from Google
      - `name` (text) - Full name from Google
      - `given_name` (text) - First name from Google
      - `family_name` (text) - Last name from Google
      - `picture` (text) - Profile picture URL from Google
      - `locale` (text) - User locale from Google
      - `verified_email` (boolean) - Email verification status from Google
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data

  3. Indexes
    - Index on google_id for fast lookups
    - Index on email for fast lookups
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  name text,
  given_name text,
  family_name text,
  picture text,
  locale text,
  verified_email boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (google_id = current_setting('app.current_user_google_id', true));

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (google_id = current_setting('app.current_user_google_id', true));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();