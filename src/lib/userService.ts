import { User } from '../types';

class UserService {
  private currentUser: User | null = null;

  // Set current user
  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
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
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Update user profile
  updateProfile(updates: Partial<User>): void {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }
}

export const userService = new UserService();