import { supabase } from './supabase';
import { GoogleUser } from './googleAuth';

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

class UserService {
  private currentUser: User | null = null;

  // Set current user context for RLS
  private async setUserContext(userId: string, googleId: string) {
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: userId,
      is_local: true
    });
    
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_google_id',
      setting_value: googleId,
      is_local: true
    });
  }

  // Create or update user from Google OAuth data
  async upsertUser(googleUser: GoogleUser): Promise<User> {
    try {
      // First, try to find existing user by Google ID
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleUser.id)
        .single();

      if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw findError;
      }

      let user: User;

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            email: googleUser.email,
            name: googleUser.name,
            given_name: googleUser.given_name,
            family_name: googleUser.family_name,
            picture: googleUser.picture,
            locale: googleUser.locale,
            verified_email: googleUser.verified_email,
            last_login: new Date().toISOString(),
          })
          .eq('google_id', googleUser.id)
          .select()
          .single();

        if (error) throw error;
        user = data;
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert({
            google_id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            given_name: googleUser.given_name,
            family_name: googleUser.family_name,
            picture: googleUser.picture,
            locale: googleUser.locale,
            verified_email: googleUser.verified_email,
          })
          .select()
          .single();

        if (error) throw error;
        user = data;
      }

      // Set user context for RLS
      await this.setUserContext(user.id, user.google_id);
      
      // Store in memory and localStorage
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));

      return user;
    } catch (error: any) {
      console.error('Error upserting user:', error);
      throw new Error(`Failed to save user data: ${error.message}`);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to load from localStorage
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        // Set user context for RLS
        if (this.currentUser) {
          this.setUserContext(this.currentUser.id, this.currentUser.google_id);
        }
        return this.currentUser;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }

    return null;
  }

  // Sign out user
  signOut(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Clear user context
    supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: '',
      is_local: true
    });
    
    supabase.rpc('set_config', {
      setting_name: 'app.current_user_google_id',
      setting_value: '',
      is_local: true
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<User, 'name' | 'given_name' | 'family_name' | 'picture' | 'locale'>>): Promise<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) throw error;

      // Update stored user
      this.currentUser = data;
      localStorage.setItem('currentUser', JSON.stringify(data));

      return data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
}

export const userService = new UserService();