import React from 'react';
import { Heart, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Fast Image Generator</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for creators worldwide</span>
          </div>
          
          <div className="text-sm text-gray-500">
            © 2025 Fast Image Generator. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}