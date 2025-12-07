import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanAPI, progressAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const ProgressPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch all scans
      const scansResponse = await scanAPI.getScans(50);
      setScans(scansResponse.data.scans || []);
      
      // Fetch progress data
      try {
        const progressResponse = await progressAPI.getProgress(8);
        setProgressData(progressResponse.data.progress || []);
      } catch (error) {
        // Progress data might not exist yet
        console.log('No progress data yet');
      }
      
      // Get streak from user data
      setStreak(user?.streak_count || 0);
    } catch (error) {
      console.error('Progress error:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getBeforeAfterScans = () => {
    if (scans.length < 2) return null;
    
    return {
      before: scans[scans.length - 1], // Oldest
      after: scans[0], // Latest
      improvement: scans[0].glow_score - scans[scans.length - 1].glow_score
    };
  };

  const beforeAfter = getBeforeAfterScans();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
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
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold">Your Progress</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Streak Card */}
        <div className="card mb-8 text-center gradient-bg text-white">
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-4">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          
          <div className="text-6xl font-bold mb-4">
            {streak} days
          </div>
          
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(Math.min(streak, 30))].map((_, i) => (
              <Flame key={i} className="w-4 h-4" />
            ))}
          </div>
          
          <p className="opacity-90">
            {streak >= 30 ? '🏆 Amazing dedication!' :
             streak >= 14 ? '💪 Keep it up!' :
             streak >= 7 ? '🔥 Great start!' :
             '🎯 Build your streak!'}
          </p>
        </div>

        {/* Before/After Comparison */}
        {beforeAfter && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Transformation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Before */}
              <div>
                <div className="text-center mb-3">
                  <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    BEFORE
                  </span>
                </div>
                {beforeAfter.before.image_url && (
                  <img
                    src={beforeAfter.before.image_url}
                    alt="Before"
                    className="w-full h-64 object-cover rounded-xl mb-3"
                  />
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Glow Score:</span>
                    <span className="font-semibold">{beforeAfter.before.glow_score}</span>
                  </div>
                  {beforeAfter.before.face_age && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Face Age:</span>
                      <span className="font-semibold">{beforeAfter.before.face_age} years</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acne:</span>
                    <span className="font-semibold">{beforeAfter.before.acne_severity}/10</span>
                  </div>
                </div>
              </div>

              {/* After */}
              <div>
                <div className="text-center mb-3">
                  <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                    AFTER
                  </span>
                </div>
                {beforeAfter.after.image_url && (
                  <img
                    src={beforeAfter.after.image_url}
                    alt="After"
                    className="w-full h-64 object-cover rounded-xl mb-3"
                  />
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Glow Score:</span>
                    <span className="font-semibold text-primary-600">
                      {beforeAfter.after.glow_score}
                      {beforeAfter.improvement > 0 && (
                        <span className="text-green-600 ml-2">
                          (+{beforeAfter.improvement})
                        </span>
                      )}
                    </span>
                  </div>
                  {beforeAfter.after.face_age && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Face Age:</span>
                      <span className="font-semibold">{beforeAfter.after.face_age} years</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Acne:</span>
                    <span className="font-semibold">{beforeAfter.after.acne_severity}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Summary */}
            {beforeAfter.improvement !== 0 && (
              <div className={`text-center p-4 rounded-lg ${
                beforeAfter.improvement > 0 ? 'bg-green-50' : 'bg-orange-50'
              }`}>
                <div className="text-2xl font-bold mb-2">
                  {beforeAfter.improvement > 0 ? (
                    <span className="text-green-600">
                      🌟 +{beforeAfter.improvement} Glow Improvement!
                    </span>
                  ) : (
                    <span className="text-orange-600">
                      Keep going! 💪
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {beforeAfter.improvement > 0
                    ? 'Your skin is getting better! Keep up the great work!'
                    : 'Stay consistent with your routine for better results.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Glow Score Trend */}
        {scans.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Glow Score Trend
            </h2>
            
            {/* Simple Chart Visualization */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-end justify-between h-48 space-x-2">
                {scans.slice(0, 10).reverse().map((scan, index) => (
                  <div key={scan.id} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-primary-600 to-accent-600 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(scan.glow_score / 100) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {scans[0]?.glow_score || 0}
                  </div>
                  <div className="text-xs text-gray-600">Latest</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(scans.reduce((sum, s) => sum + s.glow_score, 0) / scans.length)}
                  </div>
                  <div className="text-xs text-gray-600">Average</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.max(...scans.map(s => s.glow_score))}
                  </div>
                  <div className="text-xs text-gray-600">Best</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan History */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Scan History</h2>
            <span className="text-sm text-gray-600">{scans.length} total scans</span>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No scans yet</p>
              <Link to="/scan" className="btn-primary">
                Take Your First Scan
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan) => (
                <Link
                  key={scan.id}
                  to={`/results/${scan.id}`}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {scan.image_url && (
                    <img
                      src={scan.image_url}
                      alt="Scan"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">
                        Glow Score: {scan.glow_score}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {scan.skin_type} • Acne: {scan.acne_severity}/10
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
