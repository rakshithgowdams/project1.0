import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form data
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (!isLogin && !formData.username) {
      setError('Username is required for signup');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) throw error;
        
        // For signup, show success message
        if (!error) {
          setError('');
          alert('Account created successfully! Please check your email to verify your account.');
        }
      }
      
      onSuccess();
      onClose();
      // Reset form
      setFormData({ email: '', password: '', username: '' });
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Handle specific Supabase auth errors
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.message?.includes('Password should be at least 6 characters')) {
        setError('Password must be at least 6 characters long.');
      } else if (err.message?.includes('Unable to validate email address')) {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95 duration-300 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue generating amazing images' : 'Join us and start creating with AI'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                  required={!isLogin}
                  minLength={3}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {!isLogin && formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-600' : passwordStrength >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password requirements:</p>
                  <ul className="grid grid-cols-2 gap-1">
                    <li className={`flex items-center space-x-1 ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="text-xs">•</span>
                      <span>6+ characters</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="text-xs">•</span>
                      <span>Uppercase</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="text-xs">•</span>
                      <span>Lowercase</span>
                    </li>
                    <li className={`flex items-center space-x-1 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="text-xs">•</span>
                      <span>Number</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', username: '' });
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-lg"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {!isLogin && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy. 
                You'll receive a confirmation email to verify your account.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}