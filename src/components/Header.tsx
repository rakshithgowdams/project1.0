import React from 'react';
import { Zap, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export default function Header({ user, onAuthClick, onSignOut }: HeaderProps) {

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fast Image Generator
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-700" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.given_name || user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}