import React from 'react';
import { Zap, Star, TrendingUp, Clock, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { isDark } = useTheme();

  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-20`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/30'} rounded-full blur-3xl`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isDark ? 'bg-purple-900/20' : 'bg-purple-200/30'} rounded-full blur-3xl`}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
            <Award className="h-5 w-5" />
            <span>World's #1 Fastest AI Image Generator</span>
            <TrendingUp className="h-5 w-5" />
          </div>

          {/* Main Heading */}
          <h1 className={`text-6xl md:text-7xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 leading-tight`}>
            Generate Stunning Images
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              In Lightning Speed
            </span>
          </h1>

          {/* Subheading */}
          <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto mb-8 leading-relaxed`}>
            Transform your imagination into reality with our revolutionary AI technology. 
            Create professional-quality images from simple text descriptions in just seconds.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>2-5 Second Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>1M+ Images Created</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <Zap className="h-6 w-6" />
              <span>Start Creating Now - Free</span>
            </button>
            <button className={`${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700 border-gray-200'} border-2 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200`}>
              View Examples
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            <p className="mb-4">Trusted by creators worldwide • No credit card required • Start free</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <span>✓ Enterprise Security</span>
              <span>✓ 99.9% Uptime</span>
              <span>✓ 24/7 Support</span>
              <span>✓ GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}