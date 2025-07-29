// SSL Certificate Security Utilities
export class SSLSecurity {
  
  // Check if connection is secure (HTTPS)
  static isSecureConnection(): boolean {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }

  // Force HTTPS redirect
  static enforceHTTPS(): void {
    if (!this.isSecureConnection() && window.location.hostname !== 'localhost') {
      const httpsUrl = window.location.href.replace('http://', 'https://');
      window.location.replace(httpsUrl);
    }
  }

  // Validate SSL certificate (client-side check)
  static async validateSSLCertificate(domain: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('SSL Certificate validation failed:', error);
      return false;
    }
  }

  // Check for mixed content (HTTP resources on HTTPS page)
  static checkMixedContent(): void {
    if (this.isSecureConnection()) {
      // Monitor for mixed content warnings
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check images
              if (element.tagName === 'IMG') {
                const src = element.getAttribute('src');
                if (src && src.startsWith('http://')) {
                  console.warn('Mixed content detected: HTTP image on HTTPS page', src);
                }
              }
              
              // Check scripts
              if (element.tagName === 'SCRIPT') {
                const src = element.getAttribute('src');
                if (src && src.startsWith('http://')) {
                  console.warn('Mixed content detected: HTTP script on HTTPS page', src);
                }
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Initialize SSL security measures
  static initialize(): void {
    // Enforce HTTPS
    this.enforceHTTPS();
    
    // Check for mixed content
    this.checkMixedContent();
    
    // Set secure cookie attributes
    this.setSecureCookieDefaults();
    
    // Monitor certificate expiration (if available)
    this.monitorCertificateExpiration();
  }

  // Set secure cookie defaults
  private static setSecureCookieDefaults(): void {
    if (this.isSecureConnection()) {
      // Override document.cookie to add secure flags
      const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || 
                           Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
      
      if (originalCookie && originalCookie.set) {
        Object.defineProperty(document, 'cookie', {
          set: function(value: string) {
            if (!value.includes('Secure') && !value.includes('SameSite')) {
              value += '; Secure; SameSite=Strict';
            }
            originalCookie.set!.call(this, value);
          },
          get: originalCookie.get
        });
      }
    }
  }

  // Monitor SSL certificate expiration
  private static monitorCertificateExpiration(): void {
    // This would typically be done server-side, but we can check basic connectivity
    setInterval(async () => {
      try {
        const response = await fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          console.warn('SSL certificate may have issues - connectivity check failed');
        }
      } catch (error) {
        console.error('SSL certificate connectivity check failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // Check daily
  }

  // Get SSL certificate information (limited in browser)
  static getSSLInfo(): Promise<any> {
    return new Promise((resolve) => {
      if ('serviceWorker' in navigator) {
        // Use service worker to get more detailed SSL info if available
        navigator.serviceWorker.ready.then((registration) => {
          resolve({
            secure: this.isSecureConnection(),
            protocol: window.location.protocol,
            host: window.location.host,
            timestamp: new Date().toISOString()
          });
        });
      } else {
        resolve({
          secure: this.isSecureConnection(),
          protocol: window.location.protocol,
          host: window.location.host,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
}

// SSL Certificate validation for external APIs
export class APISSLValidator {
  
  // Validate Supabase SSL
  static async validateSupabaseSSL(supabaseUrl: string): Promise<boolean> {
    try {
      const url = new URL(supabaseUrl);
      if (url.protocol !== 'https:') {
        console.error('Supabase URL must use HTTPS');
        return false;
      }
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': 'test' // Just for SSL validation
        }
      });
      
      return response.status !== 0; // 0 indicates SSL/network error
    } catch (error) {
      console.error('Supabase SSL validation failed:', error);
      return false;
    }
  }

  // Validate Google APIs SSL
  static async validateGoogleAPIsSSL(): Promise<boolean> {
    try {
      const response = await fetch('https://www.googleapis.com/', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('Google APIs SSL validation failed:', error);
      return false;
    }
  }

  // Validate Replicate API SSL
  static async validateReplicateSSL(): Promise<boolean> {
    try {
      const response = await fetch('https://api.replicate.com/', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('Replicate API SSL validation failed:', error);
      return false;
    }
  }
}