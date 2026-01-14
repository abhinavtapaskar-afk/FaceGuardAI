import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const SignupPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Signup form submitted');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Check consent checkbox
    if (!agreedToTerms) {
      toast.error('Please agree to the Privacy Policy and Terms of Use');
      return;
    }

    setLoading(true);
    console.log('Starting signup process...');
    
    try {
      // Get user's IP address (optional - for consent tracking)
      let userIP = null;
      try {
        console.log('Fetching user IP...');
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIP = ipData.ip;
        console.log('User IP:', userIP);
      } catch (error) {
        console.log('Could not fetch IP:', error);
      }

      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        consent_accepted: true,
        consent_timestamp: new Date().toISOString(),
        consent_ip_address: userIP,
      };

      console.log('Sending signup request with data:', {
        ...signupData,
        password: '***hidden***'
      });

      const response = await authAPI.signup(signupData);
      
      console.log('Signup response:', response);

      if (response.success && response.data) {
        // Store auth data
        setAuth(response.data.user, response.data.token);
        
        toast.success('Account created successfully! 🎉');
        console.log('Navigating to dashboard...');
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Signup failed. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('Signup process completed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <Sparkles className="w-10 h-10 text-primary-600" />
          <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            FaceGuard AI
          </span>
        </Link>

        {/* Card */}
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Start your journey to better skin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Consent Checkbox - REQUIRED */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Privacy Policy
                  </Link>
                  {', '}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Terms of Use
                  </Link>
                  {', '}
                  <Link
                    to="/medical-disclaimer"
                    target="_blank"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Medical Disclaimer
                  </Link>
                  {', and '}
                  <Link
                    to="/affiliate-disclaimer"
                    target="_blank"
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Affiliate Disclaimer
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}</p>
            <p>Agreed to terms: {agreedToTerms ? 'Yes' : 'No'}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
