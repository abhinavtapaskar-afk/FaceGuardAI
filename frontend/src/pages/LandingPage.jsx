import { Link } from 'react-router-dom';
import { Sparkles, Camera, TrendingUp, Shield, Zap, Heart } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              FaceGuard AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Skin Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            Your Personal
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {' '}Skin Care Assistant
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up">
            Get personalized skincare recommendations powered by advanced AI. 
            Analyze your skin, track progress, and achieve your best skin ever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
            <Link
              to="/signup"
              className="btn-primary px-8 py-3 text-lg w-full sm:w-auto"
            >
              Start Free Analysis
            </Link>
            <a
              href="#features"
              className="btn-secondary px-8 py-3 text-lg w-full sm:w-auto"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="gradient-bg rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-8">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                <Camera className="w-24 h-24 text-primary-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose FaceGuard AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI technology meets personalized skincare
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI Skin Analysis
            </h3>
            <p className="text-gray-600">
              Upload a selfie and get instant analysis of your skin type, 
              issues, and concerns using advanced AI technology.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Personalized Routines
            </h3>
            <p className="text-gray-600">
              Get custom product recommendations, diet tips, and lifestyle 
              guidance tailored to your unique skin needs.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor your skin's improvement over time with weekly tracking 
              and visual progress charts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Safety First
            </h3>
            <p className="text-gray-600">
              Built-in safety warnings prevent harmful ingredient combinations 
              and ensure safe skincare practices.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Comprehensive Care
            </h3>
            <p className="text-gray-600">
              Beyond products - get diet, vitamin, and lifestyle recommendations 
              for holistic skin health.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Instant Results
            </h3>
            <p className="text-gray-600">
              Get your complete skin analysis and personalized routine in 
              seconds, not days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="gradient-bg rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users achieving their best skin with AI-powered guidance
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-primary-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Free Analysis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 FaceGuard AI. Built with ❤️ for better skin.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
