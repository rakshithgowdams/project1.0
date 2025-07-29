import React, { useState, useEffect } from 'react';
import { Clock, Download, Copy, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserImages, getExploreImages } from '../lib/supabase';
import { GeneratedImage } from '../types';

interface ImageHistoryProps {
  onImageSelect?: (image: GeneratedImage) => void;
}

export default function ImageHistory({ onImageSelect }: ImageHistoryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const [activeTab, setActiveTab] = useState<'library' | 'explore'>('library');
  
  const IMAGES_PER_PAGE = 8;

  useEffect(() => {
    if (activeTab === 'library') {
      loadImages();
    } else {
      loadExploreImages();
    }
  }, [activeTab]);

  const loadImages = async () => {
    try {
      setLoading(true);
      let data, error;
      
      if (activeTab === 'library') {
        ({ data, error } = await getUserImages());
      } else {
        ({ data, error } = await getExploreImages());
      }
      
      if (error) throw error;
      setImages(data || []);
      
      // Initialize loading states for all images
      const loadingStates: {[key: string]: boolean} = {};
      (data || []).forEach(image => {
        loadingStates[image.id] = true;
      });
      setImageLoadingStates(loadingStates);
    } catch (err: any) {
      setError(err.message || 'Failed to load image history');
    } finally {
      setLoading(false);
    }
  };

  const loadExploreImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await getExploreImages();
      if (error) throw error;
      setImages(data || []);
      
      // Initialize loading states for all images
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

  const copyPromptToClipboard = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const copyImageToClipboard = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      
      // Check if the browser supports clipboard API for images
      if (navigator.clipboard && window.ClipboardItem) {
        const clipboardItem = new ClipboardItem({
          [blob.type]: blob
        });
        
        await navigator.clipboard.write([clipboardItem]);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      } else {
        // Fallback: copy image URL if clipboard API doesn't support images
        await navigator.clipboard.writeText(image.image_url);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
      // Fallback: try to copy the URL instead
      try {
        await navigator.clipboard.writeText(image.image_url);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 3000);
      } catch (urlErr) {
        console.error('Failed to copy image URL as fallback:', urlErr);
      }
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

  // Pagination calculations
  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Reset loading states for new page images
    const newPageImages = images.slice((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE);
    const newLoadingStates: {[key: string]: boolean} = {};
    newPageImages.forEach(image => {
      newLoadingStates[image.id] = true;
    });
    setImageLoadingStates(prev => ({
      ...prev,
      ...newLoadingStates
    }));
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your creations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading images</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadImages}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'library' ? 'No Images Yet' : 'No Community Images'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'library' 
              ? 'Your generated images will appear here once you create them.'
              : 'Community images will appear here as users share their creations.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Tab Navigation - Always visible */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-2xl flex">
            <button
              onClick={() => {
                setActiveTab('library');
                loadImages();
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'library'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📚 Your Library
            </button>
            <button
              onClick={() => {
                setActiveTab('explore');
                loadExploreImages();
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌍 Explore
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'library' ? 'Your Creations' : 'Community Creations'}
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
              {images.length}
            </span>
          </div>
          
          {totalPages > 1 && (
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {currentImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="aspect-square relative overflow-hidden">
                {/* Loading Animation */}
                {imageLoadingStates[image.id] && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                      <div className="text-sm text-gray-500 font-medium">Loading...</div>
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
                    onClick={() => copyPromptToClipboard(image.prompt)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                    title="Copy Prompt"
                  >
                    <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image info */}
              <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {image.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(image.created_at)}</span>
                  <div className="flex items-center space-x-1">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {image.aspect_ratio}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded uppercase">
                      {image.output_format}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Image Details</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Copy className="h-5 w-5" />
                      <span>Copy URL</span>
                    </button>
                  </div>
                  
                  {/* Social Media Share Buttons */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Share on Social Media</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          const shareUrl = `https://www.instagram.com/`;
                          window.open(shareUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>Instagram</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedImage.image_url)}&quote=${encodeURIComponent(selectedImage.prompt)}`;
                          window.open(shareUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const shareText = `Check out this AI-generated image: ${selectedImage.prompt}`;
                          const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + selectedImage.image_url)}`;
                          window.open(shareUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(selectedImage.image_url)}&description=${encodeURIComponent(selectedImage.prompt)}`;
                          window.open(shareUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                        <span>Pinterest</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Prompt</label>
                    <div className="bg-gray-50 p-4 rounded-xl border">
                      <p className="text-gray-800">{selectedImage.prompt}</p>
                      <button
                        onClick={() => copyPromptToClipboard(selectedImage.prompt)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy Prompt</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Aspect Ratio</label>
                      <div className="bg-gray-50 p-3 rounded-xl border text-gray-800">
                        {selectedImage.aspect_ratio}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Format</label>
                      <div className="bg-gray-50 p-3 rounded-xl border text-gray-800 uppercase">
                        {selectedImage.output_format}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Safety Filter</label>
                    <div className="bg-gray-50 p-3 rounded-xl border text-gray-800">
                      {selectedImage.safety_filter_level?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>

                  {selectedImage.style && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Style</label>
                      <div className="bg-gray-50 p-3 rounded-xl border text-gray-800">
                        {selectedImage.style}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Created</label>
                    <div className="bg-gray-50 p-3 rounded-xl border text-gray-800">
                      {new Date(selectedImage.created_at).toLocaleString()}
                    </div>
                  </div>
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