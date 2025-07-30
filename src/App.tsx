import React, { useState, useEffect } from 'react';
import { isConfigured, supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import SupabaseSetup from './components/SupabaseSetup';
import AuthModal from './components/AuthModal';
import { ImageGenerator } from './components/ImageGenerator';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSupabaseSetup, setShowSupabaseSetup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    setSupabaseConfigured(isConfigured);
    
    if (!isConfigured) {
      setShowSupabaseSetup(true);
      setLoading(false);
      return;
    }

    // Initialize user authentication
    const initializeAuth = async () => {
      try {
        // Get current user session
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth initialization error:', error);
        }
        
        setUser(user);
      } catch (error) {
        console.error('User initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          setShowAuthModal(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // User state will be updated by the auth state change listener
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show Supabase setup modal if not configured
  if (showSupabaseSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <SupabaseSetup onClose={() => setShowSupabaseSetup(false)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header 
        user={user} 
        onAuthClick={() => setShowAuthModal(true)} 
        onSignOut={handleSignOut} 
      />
      
      <main className="flex-1">
        {supabaseConfigured && user ? (
          <ImageGenerator />
        ) : supabaseConfigured ? (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Create Amazing Images with AI
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Transform your ideas into stunning visuals using cutting-edge AI technology. 
                Sign up to start generating professional-quality images in seconds.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">Generate high-quality images in seconds with our optimized AI models</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Multiple Styles</h3>
                  <p className="text-gray-600 text-sm">Choose from various artistic styles to match your creative vision</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
                  <p className="text-gray-600 text-sm">Simple interface that anyone can master in minutes</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
              <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Supabase Configuration Required
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Please configure your Supabase project to enable authentication and database functionality.
              </p>
              <button
                onClick={() => setShowSupabaseSetup(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Setup Supabase
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}