export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
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