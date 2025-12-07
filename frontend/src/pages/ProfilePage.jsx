import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Award, Crown, LogOut, Settings, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Mock badges data (replace with actual API call)
  const badges = [
    { id: 1, name: 'Glow Rookie', icon: '🌱', earned: true },
    { id: 2, name: 'Week Warrior', icon: '🔥', earned: true },
    { id: 3, name: 'Glow Guardian', icon: '⭐', earned: false },
    { id: 4, name: 'Top 10 Legend', icon: '👑', earned: false },
    { id: 5, name: 'Transformation King', icon: '🦋', earned: true },
  ];

  const earnedBadges = badges.filter(b => b.earned);

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
              <User className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold">Profile</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Profile Card */}
        <div className="card mb-8 text-center">
          {/* Profile Picture */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user?.name}
            </h1>
            <p className="text-gray-600">@{user?.email?.split('@')[0]}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {user?.glow_score || 0}
              </div>
              <div className="text-xs text-gray-600">Glow Score</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {user?.streak_count || 0}
              </div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
            <div className="bg-accent-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent-600 mb-1">
                {user?.total_scans || 0}
              </div>
              <div className="text-xs text-gray-600">Total Scans</div>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>
                Joined {new Date(user?.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Award className="w-6 h-6 mr-2 text-primary-600" />
              Badges
            </h2>
            <span className="text-sm text-gray-600">
              {earnedBadges.length}/{badges.length}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  badge.earned
                    ? 'border-primary-200 bg-primary-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-xs font-medium text-gray-900">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Status */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-600" />
              Premium Status
            </h2>
            {user?.is_premium ? (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                Free
              </span>
            )}
          </div>

          {user?.is_premium ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                You're enjoying all premium features! 🎉
              </p>
              <p className="text-xs text-gray-600">
                Expires: {user?.premium_expires_at 
                  ? new Date(user.premium_expires_at).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                Unlock unlimited scans, PDF reports, and more!
              </p>
              <button className="btn-primary w-full">
                Upgrade to Premium - ₹199/month
              </button>
            </div>
          )}
        </div>

        {/* Settings & Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            Settings & Actions
          </h2>

          <div className="space-y-2">
            <Link
              to="/progress"
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-gray-700">My Reports</span>
              <span className="text-gray-400">→</span>
            </Link>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span className="text-gray-700">Refer Friends</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span className="text-gray-700">Help & Support</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span className="text-gray-700">Privacy Policy</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <span className="text-gray-700">Terms of Service</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* App Version */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>FaceGuard AI v1.0.0</p>
          <p className="mt-1">Made with ❤️ for better skin</p>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Logout Confirmation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
