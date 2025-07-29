import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  onRetry: () => void;
}

export default function ErrorModal({ isOpen, onClose, error, onRetry }: ErrorModalProps) {
  if (!isOpen) return null;

  const handleRefresh = () => {
    window.location.reload();
  };

  const isOverloadError = error.includes('overloaded') || error.includes('try again later');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isOverloadError ? 'Model Overloaded' : 'Generation Failed'}
            </h2>
            <p className="text-gray-600">
              {isOverloadError 
                ? 'The AI model is currently experiencing high demand. Please try again in a few moments.'
                : 'An error occurred while generating your image.'
              }
            </p>
          </div>

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              {error}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleRefresh}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh Page</span>
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 rounded-lg font-medium hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>

          {isOverloadError && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tips while waiting:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Try again in 1-2 minutes</li>
                <li>• Peak hours may have longer wait times</li>
                <li>• Consider simplifying your prompt</li>
                <li>• Refresh the page if issues persist</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}