import React from 'react';
import { Zap, User, LogOut, Sun, Moon } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  user: SupabaseUser | null;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export default function Header({ user, onAuthClick, onSignOut }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`${isDark ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fastest AI Image Generator
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <User className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user.user_metadata?.username || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className={`p-2 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'} rounded-lg transition-all duration-200`}
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className={`p-2 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'} rounded-lg transition-all duration-200`}
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
              </div>
            )}
            
            {/* Theme Toggle for Authenticated Users */}
            {user && (
              <button
                onClick={toggleTheme}
                className={`p-2 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'} rounded-lg transition-all duration-200 ml-2`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}