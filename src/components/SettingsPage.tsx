import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, Palette, Download, Trash2, Save } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';

interface SettingsPageProps {
  onBack: () => void;
  generatedCount: number;
  maxGenerations: number;
}

export default function SettingsPage({ onBack, generatedCount, maxGenerations }: SettingsPageProps) {
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    autoDownload: false,
    defaultStyle: 'photorealistic',
    defaultAspectRatio: '1:1',
    defaultFormat: 'png',
    safetyFilter: 'block_medium_and_above'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // Show success message
    alert('Settings saved successfully!');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.clear();
      alert('All data cleared successfully!');
    }
  };

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="settings"
        onPageChange={(page) => {
          if (page === 'generate') {
            onBack();
          }
        }}
        generatedCount={generatedCount}
        maxGenerations={maxGenerations}
      />
      
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          currentPage="settings"
          onPageChange={(page) => {
            if (page === 'generate') {
              onBack();
            }
          }}
          generatedCount={generatedCount}
          maxGenerations={maxGenerations}
        />
      </div>
      
      <div className={`transition-all duration-300 lg:ml-80`}>
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Generator</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ⚙️ Settings
            </h1>
          </div>
          
          <button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                  <User className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Account Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Receive updates about new features</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', !settings.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Generation Settings */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                  <Palette className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Generation Defaults</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Default Style
                  </label>
                  <select
                    value={settings.defaultStyle}
                    onChange={(e) => handleSettingChange('defaultStyle', e.target.value)}
                    className={`w-full p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">No default style</option>
                    <option value="photorealistic">Photorealistic</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="oil-painting">Oil Painting</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="watercolor">Watercolor</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="vintage">Vintage</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Default Aspect Ratio
                  </label>
                  <select
                    value={settings.defaultAspectRatio}
                    onChange={(e) => handleSettingChange('defaultAspectRatio', e.target.value)}
                    className={`w-full p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="1:1">Square (1:1)</option>
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="9:16">Portrait (9:16)</option>
                    <option value="4:3">Classic (4:3)</option>
                    <option value="3:4">Vertical (3:4)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Default Output Format
                  </label>
                  <select
                    value={settings.defaultFormat}
                    onChange={(e) => handleSettingChange('defaultFormat', e.target.value)}
                    className={`w-full p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="png">PNG (High Quality)</option>
                    <option value="jpg">JPG (Smaller Size)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy & Safety */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                  <Shield className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Privacy & Safety</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Default Safety Filter Level
                  </label>
                  <select
                    value={settings.safetyFilter}
                    onChange={(e) => handleSettingChange('safetyFilter', e.target.value)}
                    className={`w-full p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="block_only_high">Minimal (Block only high-risk)</option>
                    <option value="block_medium_and_above">Balanced (Block medium and high-risk)</option>
                    <option value="block_low_above">Strict (Block low, medium and high-risk)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Auto-download Images</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Automatically download generated images</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoDownload', !settings.autoDownload)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoDownload ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoDownload ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDark ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDark ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const data = JSON.stringify(settings, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ai-generator-settings.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Download className="h-5 w-5" />
                  <span>Export Settings</span>
                </button>

                <button
                  onClick={handleClearData}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    isDark 
                      ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                      : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Account Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Plan</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily Limit</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>5 images</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}