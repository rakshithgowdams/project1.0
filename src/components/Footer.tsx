import React from 'react';
import { Heart, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fast Image Generator
              </h3>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 max-w-md`}>
              The world's fastest AI image generator. Create stunning, professional-quality images from text in just seconds.
            </p>
            <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Developed by{' '}
              <a 
                href="https://www.mydesignnexus.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                www.mydesignnexus.in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Features</a></li>
              <li><a href="#how-it-works" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>How It Works</a></li>
              <li><a href="#testimonials" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Testimonials</a></li>
              <li><a href="#pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Support</h4>
            <ul className="space-y-2">
              <li><a href="#help" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Help Center</a></li>
              <li><a href="#contact" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact Us</a></li>
              <li><a href="#privacy" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</a></li>
              <li><a href="#terms" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2025 Fast Image Generator. All rights reserved.
            </span>
          </div>
          
          <div className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}