import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, Mail, Lock, User, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Try: customer@example.com / password or admin@optical.com / password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28 pb-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center space-x-3 group mb-8">
            <div className="p-2.5 bg-gradient-to-br from-gray-50 to-white rounded-full border border-gray-200 shadow-sm group-hover:shadow-md transition-all">
              <Eye className="h-7 w-7 text-gray-900" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-light tracking-tight text-gray-900">Optieye Care</div>
              <div className="text-xs text-gray-500 font-light">Vision Perfected</div>
            </div>
          </Link>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 font-light">Sign in to continue to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm font-light">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500" />
                <span className="ml-2 text-sm text-gray-600 font-light group-hover:text-gray-900">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 font-light transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 px-6 font-light hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 group flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              {!loading && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-4 bg-white text-gray-500 font-light">Or continue with</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 font-light">
              Don't have an account?{' '}
              <Link to="/register" className="text-gray-900 hover:text-gray-700 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-700 font-medium">Demo Credentials</p>
            </div>
            <div className="text-sm text-gray-600 space-y-1.5 font-light">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Customer:</span>
                <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">customer@example.com / password</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Admin:</span>
                <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200">admin@optical.com / password</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const success = await register(email, password, name);
    if (success) {
      navigate('/');
    } else {
      setError('Email already exists or registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center space-x-3 group mb-8">
            <div className="p-2.5 bg-gradient-to-br from-gray-50 to-white rounded-full border border-gray-200 shadow-sm group-hover:shadow-md transition-all">
              <Eye className="h-7 w-7 text-gray-900" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-light tracking-tight text-gray-900">Optieye Care</div>
              <div className="text-xs text-gray-500 font-light">Vision Perfected</div>
            </div>
          </Link>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600 font-light">Join thousands of satisfied customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm font-light">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light transition-all"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 font-light">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-11 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light transition-all"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3.5 px-6 font-light hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 group flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Creating account...' : 'Create account'}</span>
                {!loading && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-600 font-light">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 font-light">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-gray-700 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-gray-700 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}