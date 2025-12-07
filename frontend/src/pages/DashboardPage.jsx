import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, Award, Flame, Sparkles, Calendar, BarChart3, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanAPI, userAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    glowScore: 0,
    streak: 0,
    totalScans: 0,
    rank: null,
  });
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile for stats
      const profileResponse = await userAPI.getProfile();
      const userData = profileResponse.data.user;
      
      // Fetch recent scans
      const scansResponse = await scanAPI.getScans(5);
      
      setStats({
        glowScore: userData.glow_score || 0,
        streak: userData.streak_count || 0,
        totalScans: userData.total_scans || 0,
        rank: userData.weekly_rank || null,
      });
      
      setRecentScans(scansResponse.data.scans || []);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

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
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                FaceGuard AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to track your skin's progress today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Glow Score */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm text-gray-500">Glow Score</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.glowScore}/100
            </div>
            <div className="text-sm text-green-600">
              {stats.glowScore > 70 ? '🌟 Excellent!' : stats.glowScore > 50 ? '✨ Good' : '💪 Keep going!'}
            </div>
          </div>

          {/* Streak */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Streak</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.streak} days
            </div>
            <div className="text-sm text-orange-600">
              🔥 Keep it going!
            </div>
          </div>

          {/* Total Scans */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-accent-600" />
              </div>
              <span className="text-sm text-gray-500">Total Scans</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalScans}
            </div>
            <div className="text-sm text-accent-600">
              📸 Scans completed
            </div>
          </div>

          {/* Rank */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Rank</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.rank ? `#${stats.rank}` : 'N/A'}
            </div>
            <div className="text-sm text-yellow-600">
              🏆 This week
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Scan Now */}
          <Link
            to="/scan"
            className="gradient-bg rounded-2xl p-8 text-white hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Start New Scan</h3>
                <p className="opacity-90">Analyze your skin today</p>
              </div>
              <Camera className="w-12 h-12 opacity-80" />
            </div>
          </Link>

          {/* View Progress */}
          <Link
            to="/progress"
            className="bg-white border-2 border-primary-200 rounded-2xl p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">View Progress</h3>
                <p className="text-gray-600">Track your improvements</p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary-600" />
            </div>
          </Link>
        </div>

        {/* Recent Scans */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Scans</h2>
            <Link
              to="/progress"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {recentScans.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No scans yet</p>
              <Link to="/scan" className="btn-primary">
                Take Your First Scan
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  to={`/results/${scan.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {scan.image_url && (
                    <img
                      src={scan.image_url}
                      alt="Scan"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Glow Score: {scan.glow_score}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {scan.skin_type}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
          <div className="flex items-center justify-around py-3">
            <Link to="/dashboard" className="flex flex-col items-center text-primary-600">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link to="/scan" className="flex flex-col items-center text-gray-600">
              <Camera className="w-6 h-6" />
              <span className="text-xs mt-1">Scan</span>
            </Link>
            <Link to="/progress" className="flex flex-col items-center text-gray-600">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs mt-1">Progress</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center text-gray-600">
              <Award className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
