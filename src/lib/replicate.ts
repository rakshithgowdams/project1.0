// src/lib/replicate.ts
// This file handles AI image generation through Supabase Edge Function -> Replicate API
export const generateImage = async (
  prompt: string, 
  aspectRatio: string = '1:1',
  outputFormat: string = 'png',
  safetyFilterLevel: string = 'block_medium_and_above'
): Promise<string> => {
  if (!prompt.trim()) {
    throw new Error('Please enter a prompt to generate an image');
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
    
    if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseUrl.includes('placeholder')) {
      throw new Error('Supabase URL is not configured. Please set VITE_SUPABASE_URL in your environment.');
    }
    if (!supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY' || supabaseKey.includes('placeholder')) {
      throw new Error('Supabase Anon Key is not configured. Please set VITE_SUPABASE_ANON_KEY in your environment.');
    }

    console.log('Sending AI generation request with prompt:', prompt);
    console.log('Aspect ratio:', aspectRatio);
    console.log('Output format:', outputFormat);
    console.log('Safety filter level:', safetyFilterLevel);
    
    const apiUrl = `${supabaseUrl}/functions/v1/generate-image`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: aspectRatio,
        output_format: outputFormat,
        safety_filter_level: safetyFilterLevel
      })
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Use default error message if parsing fails
      }

      if (response.status === 400) {
        throw new Error('Invalid request. Please check your prompt and settings.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Check your Supabase configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 503) {
        throw new Error('AI model is currently overloaded or loading. Please try again in a few moments.');
      } else if (response.status === 500) {
        throw new Error('Replicate API configuration error. Please check your REPLICATE_API_TOKEN in Supabase Edge Functions settings.');
      } else {
        throw new Error(`AI Image Generation Error: ${errorMessage}`);
      }
    }

    const data = await response.json();
    
    if (!data.image_url) {
      throw new Error('Invalid response from AI model: No image received.');
    }

    console.log('Successfully received AI-generated image');
    return data.image_url;
    
  } catch (error: any) {
    console.error('AI Image Generation Error:', error);
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error during AI image generation. Please check your internet connection.');
    }
    
    throw error;
  }
};