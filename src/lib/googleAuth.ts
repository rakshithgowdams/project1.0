// Direct Google OAuth implementation without Supabase Auth
interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  email_verified: boolean;
}

class GoogleAuthManager {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = `${window.location.origin}/auth/callback`;
    
    if (!this.clientId) {
      throw new Error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
    }
    if (!this.clientSecret) {
      throw new Error('Google Client Secret is not configured. Please set VITE_GOOGLE_CLIENT_SECRET in your .env file');
    }
  }

  // Generate Google OAuth URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
    }

    return response.json();
  }

  // Decode JWT token to get user info
  decodeJWT(token: string): GoogleUserInfo {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Failed to decode JWT token');
    }
  }

  // Start OAuth flow
  signIn(): void {
    window.location.href = this.getAuthUrl();
  }

  // Handle OAuth callback
  async handleCallback(): Promise<GoogleUserInfo> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(`Google OAuth error: ${error}`);
    }

    if (!code) {
      throw new Error('No authorization code received from Google');
    }

    try {
      // Exchange code for token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      // Decode ID token to get user info
      const userInfo = this.decodeJWT(tokenResponse.id_token);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return userInfo;
    } catch (error: any) {
      throw new Error(`OAuth callback failed: ${error.message}`);
    }
  }

  // Check if current URL is a callback
  isCallback(): boolean {
    return window.location.search.includes('code=') || window.location.search.includes('error=');
  }
}

export const googleAuth = new GoogleAuthManager();
export type { GoogleUserInfo };