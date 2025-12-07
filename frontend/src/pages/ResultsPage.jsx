import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanAPI } from '../services/api';

const ResultsPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanData, setScData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    fetchScanResults();
  }, [scanId]);

  const fetchScanResults = async () => {
    try {
      setLoading(true);
      const response = await scanAPI.getScanById(scanId);
      setScData(response.data.scan);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Fetch results error:', error);
      toast.error('Failed to load results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My FaceGuard AI Results',
        text: `I got a Glow Score of ${scanData.glow_score}! Check out FaceGuard AI`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!scanData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold">Your Results</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Scan Image */}
        {scanData.image_url && (
          <div className="card mb-8">
            <img
              src={scanData.image_url}
              alt="Scan"
              className="w-full h-auto rounded-xl"
            />
          </div>
        )}

        {/* Glow Score */}
        <div className="card mb-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Your Glow Score</span>
          </div>
          
          <div className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            {scanData.glow_score}/100
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-primary-600 to-accent-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${scanData.glow_score}%` }}
            ></div>
          </div>
          
          <p className="text-gray-600">
            {scanData.glow_score >= 80 ? '🌟 Excellent! Your skin is glowing!' :
             scanData.glow_score >= 60 ? '✨ Good! Keep up the routine!' :
             scanData.glow_score >= 40 ? '💪 Fair. Let\'s improve together!' :
             '🎯 Let\'s work on your skin health!'}
          </p>
        </div>

        {/* Skin Analysis */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Skin Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Skin Type */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Skin Type</div>
              <div className="text-xl font-bold text-gray-900">{scanData.skin_type}</div>
            </div>

            {/* Face Age */}
            {scanData.face_age && (
              <div className="bg-accent-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Face Age</div>
                <div className="text-xl font-bold text-gray-900">{scanData.face_age} years</div>
              </div>
            )}

            {/* Acne Severity */}
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Acne Severity</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${scanData.acne_severity * 10}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{scanData.acne_severity}/10</span>
              </div>
            </div>

            {/* Texture Score */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Texture Quality</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${scanData.texture_score * 10}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{scanData.texture_score}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Issues */}
        {scanData.issues && scanData.issues.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detected Issues</h2>
            <div className="space-y-4">
              {scanData.issues.map((issue, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {issue.category}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {issue.details}
                      </div>
                      <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {issue.severity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && (
          <>
            {/* Product Recommendations */}
            {recommendations.products && recommendations.products.length > 0 && (
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recommended Products
                </h2>
                <div className="space-y-4">
                  {recommendations.products.map((product, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-2">
                        {product.type}
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        {product.product}
                      </div>
                      {product.activeIngredients && (
                        <div className="text-xs text-gray-600 mb-2">
                          Active: {product.activeIngredients.join(', ')}
                        </div>
                      )}
                      <div className="text-sm text-primary-600">
                        {product.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skincare Routine */}
            {recommendations.routine && (
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Skincare Routine
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Morning Routine */}
                  {recommendations.routine.morning && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-2">☀️</span>
                        Morning Routine
                      </h3>
                      <div className="space-y-3">
                        {recommendations.routine.morning.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary-600">
                                {step.step}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {step.type}
                              </div>
                              <div className="text-xs text-gray-600">
                                {step.product}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Night Routine */}
                  {recommendations.routine.night && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🌙</span>
                        Night Routine
                      </h3>
                      <div className="space-y-3">
                        {recommendations.routine.night.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-accent-600">
                                {step.step}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {step.type}
                              </div>
                              <div className="text-xs text-gray-600">
                                {step.product}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diet Tips */}
            {recommendations.diet && recommendations.diet.length > 0 && (
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Diet & Nutrition Tips
                </h2>
                <ul className="space-y-2">
                  {recommendations.diet.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle Tips */}
            {recommendations.lifestyle && recommendations.lifestyle.length > 0 && (
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Lifestyle Recommendations
                </h2>
                <ul className="space-y-2">
                  {recommendations.lifestyle.map((tip, index) => (
                    <li key={index} className="text-gray-700">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Warnings */}
            {recommendations.safetyWarnings && recommendations.safetyWarnings.length > 0 && (
              <div className="card bg-orange-50 border-orange-200">
                <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Important Safety Information
                </h2>
                <ul className="space-y-2">
                  {recommendations.safetyWarnings.map((warning, index) => (
                    <li key={index} className="text-orange-800 text-sm">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleShare}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Results</span>
          </button>
          <Link to="/scan" className="btn-secondary text-center">
            Scan Again
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
