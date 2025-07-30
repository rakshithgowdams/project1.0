import React from 'react';
import { Edit3, Zap, Download, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function HowItWorksSection() {
  const { isDark } = useTheme();

  const steps = [
    {
      icon: Edit3,
      title: "Describe Your Vision",
      description: "Simply type what you want to see. Be as creative and detailed as you like - our AI understands natural language perfectly.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Sparkles,
      title: "AI Magic Happens",
      description: "Our advanced AI models process your prompt and generate stunning, high-quality images in just 2-5 seconds.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Watch as your imagination comes to life with professional-quality images that exceed your expectations.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Download,
      title: "Download & Share",
      description: "Get your images in high resolution, share them instantly, or use our built-in editing tools for final touches.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            How It Works
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Creating stunning AI images has never been easier. Follow these simple steps to bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-16 left-full w-full h-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} z-0`}>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
              )}
              
              <div className={`relative z-10 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {step.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className={`mt-16 text-center p-8 ${isDark ? 'bg-gray-900' : 'bg-blue-50'} rounded-2xl border ${isDark ? 'border-gray-700' : 'border-blue-100'}`}>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            🚀 Pro Tip: Use Our Magic Prompt Feature
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg max-w-3xl mx-auto`}>
            Not sure how to describe your vision? Use our Magic Prompt feature powered by advanced AI to enhance your ideas and get even better results!
          </p>
        </div>
      </div>
    </section>
  );
}