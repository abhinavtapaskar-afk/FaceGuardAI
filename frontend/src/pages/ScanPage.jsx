import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Upload, ArrowLeft, Loader, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanAPI } from '../services/api';

const ScanPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('photo', selectedImage);

      const response = await scanAPI.uploadScan(formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success('Analysis complete!');
      
      // Navigate to results page
      setTimeout(() => {
        navigate(`/results/${response.data.scanId}`);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Scan error:', error);
      toast.error(error.response?.data?.message || 'Analysis failed. Please try again.');
      setAnalyzing(false);
      setProgress(0);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setPreview(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Skin Scan
              </span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {!preview ? (
          /* Upload Section */
          <div className="card text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Upload Your Selfie
              </h1>
              <p className="text-gray-600">
                Get instant AI-powered skin analysis
              </p>
            </div>

            {/* Upload Area */}
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-primary-500 transition-colors cursor-pointer mb-6"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose a photo
                </h3>
                <p className="text-gray-600 mb-4">
                  or drag and drop here
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG or WEBP (max 10MB)
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary-50 rounded-xl p-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-3">
                📸 Tips for best results:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Use good lighting (natural light is best)</li>
                <li>✓ Face the camera directly</li>
                <li>✓ Remove glasses and accessories</li>
                <li>✓ Keep a neutral expression</li>
                <li>✓ Ensure your face is clearly visible</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Preview & Analyze Section */
          <div className="card">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {analyzing ? 'Analyzing Your Skin...' : 'Preview Your Photo'}
              </h2>
              <p className="text-gray-600">
                {analyzing ? 'This may take a few seconds' : 'Make sure your face is clearly visible'}
              </p>
            </div>

            {/* Image Preview */}
            <div className="mb-6">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto"
                />
                {analyzing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="loading-spinner mx-auto mb-4"></div>
                      <p className="text-white font-medium">
                        Analyzing... {progress}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {analyzing && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleRetake}
                disabled={analyzing}
                className="btn-secondary flex-1"
              >
                Choose Another
              </button>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Steps */}
            {analyzing && (
              <div className="mt-6 bg-primary-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  AI is analyzing:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className={progress >= 20 ? 'text-primary-600 font-medium' : ''}>
                    {progress >= 20 ? '✓' : '○'} Detecting skin type
                  </li>
                  <li className={progress >= 40 ? 'text-primary-600 font-medium' : ''}>
                    {progress >= 40 ? '✓' : '○'} Analyzing texture & pores
                  </li>
                  <li className={progress >= 60 ? 'text-primary-600 font-medium' : ''}>
                    {progress >= 60 ? '✓' : '○'} Identifying issues
                  </li>
                  <li className={progress >= 80 ? 'text-primary-600 font-medium' : ''}>
                    {progress >= 80 ? '✓' : '○'} Calculating Glow Score
                  </li>
                  <li className={progress >= 100 ? 'text-primary-600 font-medium' : ''}>
                    {progress >= 100 ? '✓' : '○'} Generating recommendations
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanPage;
