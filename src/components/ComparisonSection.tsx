import React from 'react';
import { Check, X, Zap, Clock, Star, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ComparisonSection() {
  const { isDark } = useTheme();

  const features = [
    {
      feature: "Generation Speed",
      us: "2-5 seconds",
      others: "30-120 seconds",
      icon: Zap
    },
    {
      feature: "Image Quality",
      us: "Ultra HD 8K",
      others: "Standard HD",
      icon: Star
    },
    {
      feature: "Daily Free Generations",
      us: "50 images",
      others: "5-10 images",
      icon: Check
    },
    {
      feature: "Prompt Enhancement",
      us: "AI-Powered Magic Prompt",
      others: "Basic prompts only",
      icon: Sparkles
    },
    {
      feature: "Multiple Styles",
      us: "8+ Art Styles",
      others: "2-3 styles",
      icon: Check
    },
    {
      feature: "Aspect Ratios",
      us: "5 ratios (1:1, 16:9, 9:16, 4:3, 3:4)",
      others: "1-2 ratios",
      icon: Check
    },
    {
      feature: "Download Quality",
      us: "PNG & JPG High-Res",
      others: "Compressed only",
      icon: Check
    },
    {
      feature: "Safety Filters",
      us: "3-Level Customizable",
      others: "Fixed basic filter",
      icon: Shield
    },
    {
      feature: "Image History",
      us: "Unlimited cloud storage",
      others: "Limited local storage",
      icon: Check
    },
    {
      feature: "Community Gallery",
      us: "Explore & get inspired",
      others: "Not available",
      icon: Check
    }
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Why We're Better Than Others
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-8`}>
            See how our AI image generator outperforms the competition in every aspect that matters.
          </p>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-medium">
            <Clock className="h-5 w-5" />
            <span>10x Faster • 5x Better Quality • 3x More Features</span>
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Header */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-8 py-6`}>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Feature</h3>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
                  <Zap className="h-5 w-5" />
                  <span className="font-bold">Fast Image Generator</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Other Generators</h3>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {features.map((item, index) => (
              <div key={index} className="px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="grid grid-cols-3 gap-8 items-center">
                  {/* Feature Name */}
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <item.icon className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.feature}
                    </span>
                  </div>

                  {/* Our Feature */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-semibold">
                      <Check className="h-4 w-4" />
                      <span>{item.us}</span>
                    </div>
                  </div>

                  {/* Others */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-full font-semibold">
                      <X className="h-4 w-4" />
                      <span>{item.others}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} px-8 py-8 text-center`}>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Ready to Experience the Difference?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Join thousands of creators who've already switched to the fastest AI image generator.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Start Creating for Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}