export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  verified_email: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  style: string;
  aspect_ratio: string;
  output_format: string;
  safety_filter_level: string;
  created_at: string;
}

export interface StyleSuggestion {
  id: string;
  name: string;
  prompt_addition: string;
  description: string;
}