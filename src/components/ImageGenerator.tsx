import React, { useState } from 'react';
import { Wand2, Download, Copy, Sparkles, Image as ImageIcon, Palette, Zap, Shield, FileImage, Menu } from 'lucide-react';
import { stylePresets } from '../data/styles';
import { enhancePrompt } from '../lib/gemini';
import { generateImage } from '../lib/replicate';
import { saveGeneratedImage } from '../lib/supabase';
import ErrorModal from './ErrorModal';
import Sidebar from './Sidebar';
import ExplorePage from './ExplorePage';
import SettingsPage from './SettingsPage';
import ImageHistory from './ImageHistory';
import { useTheme } from '../contexts/ThemeContext';

interface ImageGeneratorProps {
  generatedCount: number;
  onImageGenerated: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ generatedCount, onImageGenerated }) => {
  const { isDark } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1');
  const [selectedOutputFormat, setSelectedOutputFormat] = useState('png');
  const [selectedSafetyFilter, setSelectedSafetyFilter] = useState('block_medium_and_above');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('generate');

  const MAX_GENERATIONS = 5;
  const MAX_CHARACTERS = 5000; // Increased limit for longer prompts

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      setShowErrorModal(true);
      return;
    }

    if (prompt.length > MAX_CHARACTERS) {
      setError(`Prompt is too long. Please keep it under ${MAX_CHARACTERS} characters.`);
      setShowErrorModal(true);
      return;
    }

    if (generatedCount >= MAX_GENERATIONS) {
      setError(`You've reached your daily limit of ${MAX_GENERATIONS} images. Upgrade to Pro for unlimited generations!`);
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      let fullPrompt = prompt;
      if (selectedStyle) {
        const style = stylePresets.find(s => s.id === selectedStyle);
        if (style) {
          fullPrompt += style.prompt_addition;
        }
      }
      
      const imageUrl = await generateImage(fullPrompt, selectedAspectRatio, selectedOutputFormat, selectedSafetyFilter);
      setGeneratedImage(imageUrl);

      // Save to database
      try {
        const styleName = selectedStyle ? stylePresets.find(s => s.id === selectedStyle)?.name || '' : '';
        const saveResult = await saveGeneratedImage(
          prompt,
          imageUrl,
          styleName,
          selectedAspectRatio,
          selectedOutputFormat,
          selectedSafetyFilter
        );
        
        if (saveResult.error) {
          console.error('Failed to save image:', saveResult.error);
        }
        onImageGenerated(); // Increment the counter
      } catch (saveError) {
        console.error('Failed to save image to history:', saveError);
        // Don't show error to user as image generation was successful
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate image';
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to enhance');
      setShowErrorModal(true);
      return;
    }

    setEnhancing(true);
    setError('');

    try {
      const enhanced = await enhancePrompt(prompt);
      if (enhanced.length > MAX_CHARACTERS) {
        // If enhanced prompt is too long, truncate it intelligently
        const truncated = enhanced.substring(0, MAX_CHARACTERS - 3) + '...';
        setPrompt(truncated);
      } else {
        setPrompt(enhanced);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to enhance prompt';
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setEnhancing(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      let url: string;
      
      // Check if it's a data URL (base64 encoded image)
      if (generatedImage.startsWith('data:')) {
        // For data URLs, use directly without fetching
        url = generatedImage;
      } else {
        // For external URLs, fetch and create object URL
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        url = window.URL.createObjectURL(blob);
      }
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Only revoke object URLs, not data URLs
      if (!generatedImage.startsWith('data:')) {
        window.URL.revokeObjectURL(url);
      }
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRetry = () => {
    setShowErrorModal(false);
    setError('');
    if (enhancing) {
      handleEnhancePrompt();
    } else {
      handleGenerate();
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Allow typing beyond 3000 characters but show warning
    setPrompt(newValue);
  };

  const getCharacterCountColor = () => {
    const length = prompt.length;
    if (length > MAX_CHARACTERS) return 'text-red-600 font-bold';
    if (length > MAX_CHARACTERS * 0.9) return 'text-orange-600 font-semibold';
    if (length > MAX_CHARACTERS * 0.8) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getCharacterCountMessage = () => {
    const length = prompt.length;
    if (length > MAX_CHARACTERS) {
      return `Prompt is ${length - MAX_CHARACTERS} characters over the limit`;
    }
    return `${length}/${MAX_CHARACTERS} characters`;
  };

  // Handle page changes
  if (currentPage === 'explore') {
    return <ExplorePage onBack={() => setCurrentPage('generate')} generatedCount={generatedCount} maxGenerations={MAX_GENERATIONS} />;
  }

  if (currentPage === 'settings') {
    return <SettingsPage onBack={() => setCurrentPage('generate')} generatedCount={generatedCount} maxGenerations={MAX_GENERATIONS} />;
  }

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        generatedCount={generatedCount}
        maxGenerations={MAX_GENERATIONS}
      />
      
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          generatedCount={generatedCount}
          maxGenerations={MAX_GENERATIONS}
        />
      </div>
      
      <div className={`transition-all duration-300 lg:ml-80 min-h-screen`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`flex items-center space-x-2 p-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
            >
              <Menu className="h-6 w-6" />
              <span>Menu</span>
            </button>
          </div>

      {/* Hero Section */}
      <div className="text-center mb-8 lg:mb-12">
        
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Create Stunning Images with
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> AI Magic</span>
        </h1>
        <p className={`text-lg lg:text-xl ${isDark ? 'text-white' : 'text-gray-900'} max-w-3xl mx-auto`}>
          Transform your imagination into reality. Describe what you want to see, and our AI will create it for you in seconds.
        </p>
        
        {/* Generation Counter */}
        <div className={`mt-6 inline-flex items-center space-x-2 ${isDark ? 'bg-gray-800' : 'bg-white'} px-3 lg:px-4 py-2 rounded-full shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Total generations: 
          </span>
          <span className={`font-bold ${generatedCount >= MAX_GENERATIONS ? 'text-red-600' : 'text-blue-600'}`}>
            {generatedCount}/{MAX_GENERATIONS}
          </span>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-2xl border mb-6 lg:mb-8`}>
        <div className="space-y-8">
          {/* Prompt Input Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <ImageIcon className="h-5 w-5 text-gray-700" />
              <label className="text-lg font-semibold text-gray-900">
                Describe your vision
              </label>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder="A majestic dragon soaring through a starlit sky above ancient mountains, with scales that shimmer like precious gems in the moonlight. The dragon's wings are spread wide, casting dramatic shadows on the snow-capped peaks below. Ancient ruins are visible in the valley, glowing with mysterious blue light. The scene is rendered in a fantasy art style with incredible detail, dramatic lighting, and epic composition. The sky is filled with swirling galaxies and nebulae, creating a sense of otherworldly magic and wonder..."
                className="w-full p-6 pr-16 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-40 text-lg bg-white/50 backdrop-blur-sm"
              />
              <button
                onClick={() => copyToClipboard(prompt)}
                disabled={!prompt.trim()}
                className="absolute bottom-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/copy"
                title="Copy prompt to clipboard"
              >
                <Copy className="h-4 w-4 text-gray-700 group-hover/copy:scale-110 transition-transform" />
              </button>
              <button
                onClick={handleEnhancePrompt}
                disabled={enhancing || !prompt.trim()}
                className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Magic Prompt - MDN 1.O Advance"
              >
                <Sparkles className={`h-5 w-5 ${enhancing ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
              </button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-500">💡 Be specific about colors, lighting, mood, and style for best results</p>
              <div className={getCharacterCountColor()}>
                {getCharacterCountMessage()}
              </div>
            </div>
            {prompt.length > MAX_CHARACTERS && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">Error</span>
                  <p className="text-red-700 text-sm font-medium">
                    Your prompt is too long and may not generate properly. Please shorten it to under {MAX_CHARACTERS} characters for best results.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Style Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-700" />
              <label className="text-lg font-semibold text-gray-900">
                Choose your style
              </label>
              <span className="text-sm text-gray-500">(optional)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stylePresets.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(selectedStyle === style.id ? '' : style.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                    selectedStyle === style.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm hover:shadow-md'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{style.name}</div>
                  <div className="text-xs text-gray-500">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Select aspect ratio</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { ratio: '1:1', name: 'Square', desc: 'Perfect for Instagram posts'},
                { ratio: '16:9', name: 'Landscape', desc: 'Great for YouTube thumbnails'},
                { ratio: '9:16', name: 'Portrait', desc: 'Ideal for stories & reels' },
                { ratio: '4:3', name: 'Classic', desc: 'Traditional photo format'},
                { ratio: '3:4', name: 'Vertical', desc: 'Portrait photography' }
              ].map((format) => (
                <button
                  key={format.ratio}
                  onClick={() => setSelectedAspectRatio(format.ratio)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                    selectedAspectRatio === format.ratio
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-2">{format.icon}</div>
                  <div className="font-semibold text-base mb-1">{format.name}</div>
                  <div className="text-sm text-gray-500 mb-1">{format.ratio}</div>
                  <div className="text-xs text-gray-400">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Output Format Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileImage className="h-5 w-5 text-gray-700" />
              <label className="text-lg font-semibold text-gray-900">
                Output format
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { format: 'png', name: 'PNG', desc: 'High quality with transparency support', icon: '🖼️' },
                { format: 'jpg', name: 'JPG', desc: 'Smaller file size, good for sharing', icon: '📸' }
              ].map((formatOption) => (
                <button
                  key={formatOption.format}
                  onClick={() => setSelectedOutputFormat(formatOption.format)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                    selectedOutputFormat === formatOption.format
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-2">{formatOption.icon}</div>
                  <div className="font-semibold text-base mb-1">{formatOption.name}</div>
                  <div className="text-xs text-gray-400">{formatOption.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Safety Filter Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-700" />
              <label className="text-lg font-semibold text-gray-900">
                Safety filter level
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { level: 'block_only_high', name: 'Minimal', desc: 'Block only high-risk content' },
                { level: 'block_medium_and_above', name: 'Balanced', desc: 'Block medium and high-risk content' },
                { level: 'block_low_above', name: 'Strict', desc: 'Block low, medium and high-risk content'}
              ].map((safetyOption) => (
                <button
                  key={safetyOption.level}
                  onClick={() => setSelectedSafetyFilter(safetyOption.level)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                    selectedSafetyFilter === safetyOption.level
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-2">{safetyOption.icon}</div>
                  <div className="font-semibold text-base mb-1">{safetyOption.name}</div>
                  <div className="text-xs text-gray-400">{safetyOption.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || enhancing || !prompt.trim() || generatedCount >= MAX_GENERATIONS || prompt.length > MAX_CHARACTERS}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
          >
            <Wand2 className={`h-6 w-6 ${loading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
            <span>
              {generatedCount >= MAX_GENERATIONS ? 'Generation limit reached - Upgrade to continue' :
                prompt.length > MAX_CHARACTERS ? 'Prompt too long - Please shorten' :
                loading ? 'Creating your masterpiece...' : 
                enhancing ? 'Magic Prompt enhancing...' : 
                'Generate Image'}
            </span>
          </button>
        </div>
      </div>

      {/* Limit Warning */}
      {generatedCount >= MAX_GENERATIONS && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <h3 className={`font-bold ${isDark ? 'text-red-400' : 'text-red-700'} mb-2`}>Daily Limit Reached</h3>
          <p className={`${isDark ? 'text-red-300' : 'text-red-600'} mb-4`}>
            You've used all {MAX_GENERATIONS} of your free generations. Upgrade to Pro for unlimited image generation!
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Upgrade to Pro
          </button>
        </div>
      )}
      
      {/* Warning when approaching limit */}
      {generatedCount >= MAX_GENERATIONS * 0.8 && generatedCount < MAX_GENERATIONS && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-yellow-700 mb-2">Almost at your generation limit!</h3>
          <p className="text-yellow-600 mb-4">
            You have {MAX_GENERATIONS - generatedCount} generations remaining. Consider upgrading for unlimited access!
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <div className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-sm rounded-3xl p-8 shadow-2xl border`}>
          <div className="text-center">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center justify-center space-x-2`}>
              <span>✨ Your AI Creation</span>
            </h3>
            <div className="relative inline-block group">
              <img
                src={generatedImage}
                alt="AI Generated Image"
                className="max-w-full h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleDownload}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-lg hover:shadow-xl group/btn"
                  title="Download Image"
                >
                  <Download className="h-5 w-5 text-gray-700 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => copyToClipboard(generatedImage)}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-lg hover:shadow-xl group/btn"
                  title="Copy Image URL"
                >
                  <Copy className="h-5 w-5 text-gray-700 group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className={`mt-6 p-6 ${isDark ? 'bg-gray-700/80 border-gray-600/50' : 'bg-gray-50/80 border-gray-200/50'} backdrop-blur-sm rounded-2xl border`}>
              <div className="text-left space-y-2">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Prompt:</span> {prompt.length > 200 ? prompt.substring(0, 200) + '...' : prompt}
                </p>
                {selectedStyle && (
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Style:</span> {stylePresets.find(s => s.id === selectedStyle)?.name}
                  </p>
                )}
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Aspect Ratio:</span> {selectedAspectRatio}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Format:</span> {selectedOutputFormat.toUpperCase()}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Safety Filter:</span> {selectedSafetyFilter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Tips */}
      <div className={`mt-8 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'} rounded-3xl p-8 border`}>
        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 text-xl flex items-center space-x-2`}>
          <span>Pro Tips for Amazing Results</span>
        </h4>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="space-y-2">
            <p>• <strong>Be descriptive:</strong> Write detailed, vivid descriptions for better results</p>
            <p>• <strong>Use the Magic Prompt:</strong> Let MDN 1.O Advance enhance your ideas</p>
            <p>• <strong>Include atmosphere:</strong> Describe lighting, mood, and environment</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Add artistic styles:</strong> Try "digital art", "oil painting", "photorealistic"</p>
            <p>• <strong>Quality terms help:</strong> "highly detailed", "8k resolution", "masterpiece"</p>
            <p>• <strong>Long prompts work:</strong> Don't hesitate to write detailed descriptions</p>
          </div>
        </div>
      </div>
          <Br />

      {/* Image Library */}
      <ImageHistory />

      {/* Copy Success Notification */}
      {showCopySuccess && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in-0 slide-in-from-left-2 duration-300">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Prompt copied successfully!</span>
          </div>
        </div>
      )}

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
        onRetry={handleRetry}
      />
        </div>
      </div>
    </>
  );
};