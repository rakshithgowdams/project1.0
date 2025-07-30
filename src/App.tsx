import React, { useState, useEffect } from 'react';
import { isConfigured, supabase } from './lib/supabase';
import { ThemeProvider } from './contexts/ThemeContext';
import SEOHead from './components/SEOHead';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import ComparisonSection from './components/ComparisonSection';
import TestimonialsSection from './components/TestimonialsSection';
import Header from './components/Header';
import Footer from './components/Footer';
import SupabaseSetup from './components/SupabaseSetup';
import AuthModal from './components/AuthModal';
import { ImageGenerator } from './components/ImageGenerator';
import type { User } from '@supabase/supabase-js';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSupabaseSetup, setShowSupabaseSetup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  // Load generation count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('dailyGenerations');
    
    if (savedData) {
      const { date, count } = JSON.parse(savedData);
      if (date === today) {
        setGeneratedCount(count);
      } else {
        // Reset count for new day
        localStorage.setItem('dailyGenerations', JSON.stringify({ date: today, count: 0 }));
        setGeneratedCount(0);
      }
    } else {
      localStorage.setItem('dailyGenerations', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const handleImageGenerated = () => {
    const newCount = generatedCount + 1;
    setGeneratedCount(newCount);
    
    // Save to localStorage
    const today = new Date().toDateString();
    localStorage.setItem('dailyGenerations', JSON.stringify({ date: today, count: newCount }));
  };

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
          if (error.message === 'Auth session missing!') {
            console.info('No active session found - user not logged in');
          } else {
            console.error('Auth initialization error:', error);
          }
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

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  // Show Supabase setup modal if not configured
  if (showSupabaseSetup) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <SupabaseSetup onClose={() => setShowSupabaseSetup(false)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead />
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} flex flex-col transition-colors duration-300`}>
      <Header 
        user={user} 
        onAuthClick={() => setShowAuthModal(true)} 
        onSignOut={handleSignOut} 
      />
      
      <main className="flex-1">
        {supabaseConfigured && user ? (
          <ImageGenerator 
            generatedCount={generatedCount}
            onImageGenerated={handleImageGenerated}
          />
        ) : supabaseConfigured ? (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <HowItWorksSection />
            <ComparisonSection />
            <TestimonialsSection />
          </>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-sm rounded-3xl p-12 shadow-xl border`}>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Create Amazing Images with AI
              </h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
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
                  <div className={`w-12 h-12 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Lightning Fast</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Generate high-quality images in seconds with our optimized AI models</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Multiple Styles</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Choose from various artistic styles to match your creative vision</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 ${isDark ? 'bg-green-900/50' : 'bg-green-100'} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Easy to Use</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Simple interface that anyone can master in minutes</p>
                </div>
              </div>
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
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}