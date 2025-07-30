import React from 'react';
import { 
  Image, 
  Compass, 
  Settings, 
  Crown, 
  Menu, 
  X,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  generatedCount: number;
  maxGenerations: number;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  currentPage, 
  onPageChange, 
  generatedCount, 
  maxGenerations 
}: SidebarProps) {
  const { isDark } = useTheme();

  const menuItems = [
    {
      id: 'generate',
      label: 'Generate Image',
      icon: Image,
      description: 'Create AI images'
    },
    {
      id: 'explore',
      label: 'Explore Images',
      icon: Compass,
      description: 'Browse community'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Account settings'
    }
  ];

  const handleItemClick = (pageId: string) => {
    onPageChange(pageId);
    onClose();
  };

  const progressPercentage = (generatedCount / maxGenerations) * 100;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
        ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
        border-r shadow-2xl flex flex-col
      `}>
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-6 overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 text-left group
                  ${currentPage === item.id
                    ? isDark
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-md'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${currentPage === item.id
                    ? isDark
                      ? 'bg-blue-500'
                      : 'bg-blue-100'
                    : isDark
                      ? 'bg-gray-800 group-hover:bg-gray-700'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.label}</div>
                  <div className={`text-sm ${
                    currentPage === item.id
                      ? isDark ? 'text-blue-200' : 'text-blue-600'
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Generation Tracking */}
        <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Total Generations
              </h3>
              <div className="flex items-center space-x-1">
                <TrendingUp className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {generatedCount}/{maxGenerations}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className={`w-full h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    progressPercentage >= 100
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : progressPercentage >= 80
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  {generatedCount} used
                </span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  {maxGenerations - generatedCount} remaining
                </span>
              </div>
            </div>

            {/* Upgrade Button */}
            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group">
              <Crown className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Upgrade to Pro</span>
            </button>

            {/* Status Message */}
            {generatedCount >= maxGenerations ? (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  Generation limit reached! Upgrade for unlimited generations.
                </p>
              </div>
            ) : generatedCount >= maxGenerations * 0.8 ? (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  {maxGenerations - generatedCount} generations remaining.
                </p>
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                  You're doing great! Keep creating.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}