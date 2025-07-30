import { createClient } from '@supabase/supabase-js';
import { GeneratedImage } from '../types';
import { userService } from './userService';

// Get environment variables
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate and set URL - ensure it's a valid URL format
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.startsWith('https://') && url.includes('.supabase.co');
  } catch {
    return false;
  }
};

// Use valid URL or fallback to placeholder
const supabaseUrl = (envSupabaseUrl && isValidUrl(envSupabaseUrl)) 
  ? envSupabaseUrl 
  : 'https://placeholder.supabase.co';

// Use valid key or fallback to placeholder
const supabaseAnonKey = (envSupabaseAnonKey && 
                        envSupabaseAnonKey !== 'your_supabase_anon_key' && 
                        envSupabaseAnonKey.length > 20) 
  ? envSupabaseAnonKey 
  : 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = envSupabaseUrl && 
                            envSupabaseAnonKey && 
                            isValidUrl(envSupabaseUrl) &&
                            envSupabaseAnonKey !== 'your_supabase_anon_key' &&
                            envSupabaseAnonKey.length > 20;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase is not configured. Please set up your environment variables.');
}

// Create the Supabase client with validated values
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const auth = supabase.auth;

// Export configuration status
export const isConfigured = isSupabaseConfigured;

// ✅ Upload image to Supabase Storage
export const uploadImageToStorage = async (imageUrl: string, fileName: string) => {
  try {
    // Download the image from Replicate
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const imageBlob = await response.blob();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(fileName, imageBlob, {
        contentType: imageBlob.type || 'image/png',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image to storage:', error);
    throw new Error(`Failed to store image: ${error.message}`);
  }
};

// ✅ Save generated image to Supabase table
export const saveGeneratedImage = async (
  prompt: string, 
  replicateImageUrl: string, 
  style: string,
  aspectRatio: string = '1:1',
  outputFormat: string = 'png',
  safetyFilterLevel: string = 'block_medium_and_above'
) => {
  // Check if Supabase is properly configured
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set up your Supabase project first.');
  }

  const currentUser = userService.getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${currentUser.id}/${timestamp}-${randomId}.${outputFormat}`;
    
    // Upload image to Supabase Storage and get the storage URL
    const storageImageUrl = await uploadImageToStorage(replicateImageUrl, fileName);
    
    // Save to database with storage URL
    const { data, error } = await supabase
      .from('generated_images')
      .insert([
        {
          user_id: currentUser.id,
          prompt,
          image_url: storageImageUrl, // Use storage URL instead of Replicate URL
          style,
          aspect_ratio: aspectRatio,
          output_format: outputFormat,
          safety_filter_level: safetyFilterLevel,
        }
      ])
      .select();

    return { data, error };
  } catch (storageError: any) {
    console.error('Failed to store image in Supabase Storage:', storageError);
    
    // Fallback: Save with original Replicate URL if storage fails
    console.log('Falling back to storing Replicate URL directly');
    const { data, error } = await supabase
      .from('generated_images')
      .insert([
        {
          user_id: currentUser.id,
          prompt,
          image_url: replicateImageUrl, // Fallback to original URL
          style,
          aspect_ratio: aspectRatio,
          output_format: outputFormat,
          safety_filter_level: safetyFilterLevel,
        }
      ])
      .select();

    return { data, error };
  }
};

// ✅ Get user's image history
export const getUserImages = async () => {
  // Check if Supabase is properly configured
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set up your Supabase project first.');
  }

  const currentUser = userService.getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  return { data, error };
};

// ✅ Get all public images for explore section
export const getExploreImages = async () => {
  // Check if Supabase is properly configured
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set up your Supabase project first.');
  }

  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100); // Limit to recent 100 images for performance

  return { data, error };
};