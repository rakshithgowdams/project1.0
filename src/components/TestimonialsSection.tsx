import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function TestimonialsSection() {
  const { isDark } = useTheme();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Artist",
      company: "Creative Studio",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "This is absolutely game-changing! I can create concept art for my clients in seconds instead of hours. The quality is incredible and the speed is unmatched.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      company: "TechFlow Inc",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "We've tried every AI image generator out there. Nothing comes close to this speed and quality. Our social media engagement increased by 300% since we started using it.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Content Creator",
      company: "YouTube (2M subscribers)",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "I create thumbnails for my YouTube videos daily. This tool saves me 10+ hours per week and the results are always stunning. My CTR improved dramatically!",
      rating: 5
    },
    {
      name: "David Kim",
      role: "E-commerce Owner",
      company: "Fashion Forward",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Product mockups, lifestyle images, social media content - this tool does it all. ROI was immediate. Best investment I've made for my business.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Graphic Designer",
      company: "Freelancer",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "As a freelancer, speed is everything. This AI generator helps me deliver projects faster while maintaining premium quality. My clients are amazed!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Brand Manager",
      company: "Global Brands Co",
      image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "We use this for all our campaign visuals now. The consistency and quality are perfect for brand guidelines. It's revolutionized our creative process.",
      rating: 5
    }
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            What Our Users Say
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto mb-8`}>
            Join thousands of satisfied creators, marketers, and businesses who trust our AI image generator.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>4.9/5</span>
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>from 10,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-8 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative`}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg">
                  <Quote className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex text-yellow-400 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6 leading-relaxed text-lg`}>
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className={`inline-flex items-center space-x-8 ${isDark ? 'bg-gray-900' : 'bg-blue-50'} px-8 py-6 rounded-2xl border ${isDark ? 'border-gray-700' : 'border-blue-100'}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1M+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Images Generated</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>50K+</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Happy Users</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>99.9%</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>24/7</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}