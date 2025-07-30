import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Copy, Eye, X, Heart, Share2 } from 'lucide-react';
import { getExploreImages } from '../lib/supabase';
import { GeneratedImage } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ExplorePageProps {
  onBack: () => void;
}

export default function ExplorePage({ onBack }: ExplorePageProps) {
  const { isDark } = useTheme();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadExploreImages();
  }, []);

  const loadExploreImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await getExploreImages();
      if (error) throw error;
      
      setImages(data || []);
      
      // Initialize loading states
      const loadingStates: {[key: string]: boolean} = {};
      (data || []).forEach(image => {
        loadingStates[image.id] = true;
      });
      setImageLoadingStates(loadingStates);
    } catch (err: any) {
      setError(err.message || 'Failed to load community images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: false
    }));
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${image.id}.${image.output_format || 'png'}`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Generator</span>
            </button>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading community images...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Generator</span>
            </button>
          </div>
          
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">Error loading images</div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{error}</p>
            <button
              onClick={loadExploreImages}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
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
                🌍 Explore Community
              </h1>
            </div>
            
            <div className={`flex items-center space-x-2 ${isDark ? 'bg-gray-800' : 'bg-white'} px-4 py-2 rounded-full shadow-lg`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {images.length} amazing creations
              </span>
            </div>
          </div>

          {/* Images Grid */}
          {images.length === 0 ? (
            <div className="text-center py-20">
              <div className={`w-20 h-20 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                <Eye className={`h-10 w-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                No Community Images Yet
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Be the first to share your amazing AI creations with the community!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`group relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <div className="aspect-square relative overflow-hidden">
                    {/* Loading Animation */}
                    {imageLoadingStates[image.id] && (
                      <div className={`absolute inset-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                        <div className="flex flex-col items-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Loading...</div>
                        </div>
                      </div>
                    )}
                    
                    <img
                      src={image.image_url}
                      alt={image.prompt}
                      className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                        imageLoadingStates[image.id] ? 'opacity-0' : 'opacity-100'
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(image.id)}
                      onError={() => handleImageLoad(image.id)}
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDownload(image)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(image.prompt)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                        title="Copy Prompt"
                      >
                        <Copy className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Image info */}
                  <div className="p-4">
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 mb-2`}>
                      {image.prompt.length > 60 ? image.prompt.substring(0, 60) + '...' : image.prompt}
                    </p>
                    <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{formatDate(image.created_at)}</span>
                      <div className="flex items-center space-x-1">
                        <span className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>
                          {image.aspect_ratio}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Community Creation</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="space-y-4">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.prompt}
                    className="w-full rounded-2xl shadow-lg"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDownload(selectedImage)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(selectedImage.image_url)}
                      className={`flex-1 ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
                    >
                      <Copy className="h-5 w-5" />
                      <span>Copy URL</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>Prompt</label>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={isDark ? 'text-gray-200' : 'text-gray-800'}>{selectedImage.prompt}</p>
                      <button
                        onClick={() => copyToClipboard(selectedImage.prompt)}
                        className={`mt-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} text-sm font-medium flex items-center space-x-1`}
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy Prompt</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Aspect Ratio</label>
                      <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-xl border ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {selectedImage.aspect_ratio}
                      </div>
                    </div>
                    <div>
                      <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Format</label>
                      <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-xl border ${isDark ? 'text-gray-200' : 'text-gray-800'} uppercase`}>
                        {selectedImage.output_format}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Created</label>
                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-xl border ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {new Date(selectedImage.created_at).toLocaleString()}
                    </div>
                  </div>

                  {selectedImage.style && (
                    <div>
                      <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1 block`}>Style</label>
                      <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-xl border ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {selectedImage.style}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Notification */}
      {showCopySuccess && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in-0 slide-in-from-left-2 duration-300">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Copied successfully!</span>
          </div>
        </div>
      )}
    </>
  );
}