import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import api from '../../services/api';

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { isDarkMode } = useSettings();
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Theme classes
    const bgColor = isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-blue-50 via-white to-pink-50';
    const cardBg = isDarkMode ? 'bg-[#1e293b]' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = isDarkMode ? 'border-[#334155]' : 'border-gray-200';

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchDashboard();
        }
    }, [isAuthenticated]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (authLoading || loading) {
        return (
            <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin"></div>
                    <p className={subTextColor}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
                <div className={`${cardBg} p-8 rounded-2xl shadow-xl max-w-md text-center`}>
                    <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                    <h2 className={`text-xl font-bold ${textColor} mb-2`}>Error Loading Dashboard</h2>
                    <p className={subTextColor}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const data = dashboardData || {};
    const stats = data.stats || {};
    const profile = data.profile || {};
    const recentCalcs = data.recentCalculations || [];
    const favorites = data.favorites || [];

    return (
        <div className={`min-h-screen ${bgColor} py-8 px-4`}>
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl font-bold ${textColor}`}>
                                {getGreeting()}, {data.user?.fullName?.split(' ')[0] || 'User'}! 👋
                            </h1>
                            <p className={subTextColor}>
                                <span className="inline-flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${data.user?.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {data.user?.role || 'User'}
                                    </span>
                                    {data.user?.lastLoginAt && (
                                        <span className="text-sm">Last login: {formatDate(data.user.lastLoginAt)}</span>
                                    )}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/"
                                className="px-4 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add] flex items-center gap-2"
                            >
                                <i className="fas fa-calculator"></i>
                                New Calculation
                            </Link>
                            <Link
                                to="/dashboard/calculations"
                                className={`px-4 py-2 ${cardBg} ${textColor} border ${borderColor} rounded-lg hover:shadow flex items-center gap-2`}
                            >
                                <i className="fas fa-history"></i>
                                View History
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <i className="fas fa-calculator text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{stats.totalCalculations || 0}</p>
                                <p className={`text-sm ${subTextColor}`}>Total Calculations</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <i className="fas fa-bookmark text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{stats.savedCalculations || 0}</p>
                                <p className={`text-sm ${subTextColor}`}>Saved Calculations</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <i className={`fas ${stats.mostUsedCalculator?.icon || 'fa-star'} text-purple-600 text-xl`}></i>
                            </div>
                            <div>
                                <p className={`text-lg font-bold ${textColor} truncate max-w-[140px]`}>
                                    {stats.mostUsedCalculator?.name?.replace(' Calculator', '') || 'None'}
                                </p>
                                <p className={`text-sm ${subTextColor}`}>Most Used</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                <i className="fas fa-clock text-orange-600 text-xl"></i>
                            </div>
                            <div>
                                <p className={`text-lg font-bold ${textColor}`}>
                                    {stats.lastCalculationDate ?
                                        new Date(stats.lastCalculationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                        : 'Never'}
                                </p>
                                <p className={`text-sm ${subTextColor}`}>Last Calculation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Profile Card */}
                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-lg font-semibold ${textColor}`}>Profile</h2>
                            <Link to="/profile/edit" className="text-[#3B68FC] text-sm hover:underline">Edit</Link>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3B68FC] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold mb-4">
                                {data.user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <h3 className={`text-xl font-bold ${textColor}`}>{data.user?.fullName}</h3>
                            <p className={`text-sm ${subTextColor}`}>{data.user?.email}</p>
                            {profile.profession && (
                                <p className={`text-sm ${subTextColor} mt-1`}>{profile.profession} {profile.designation && `• ${profile.designation}`}</p>
                            )}
                            {profile.company && (
                                <p className={`text-sm ${subTextColor}`}>{profile.company}</p>
                            )}
                            {profile.location && (
                                <p className={`text-xs ${subTextColor} mt-1 flex items-center gap-1`}>
                                    <i className="fas fa-map-marker-alt"></i> {profile.location}
                                </p>
                            )}
                        </div>

                        <div className={`mt-4 pt-4 border-t ${borderColor} grid grid-cols-2 gap-4 text-center`}>
                            <div>
                                <p className={`text-xl font-bold ${textColor}`}>{stats.totalCalculations || 0}</p>
                                <p className={`text-xs ${subTextColor}`}>Calculations</p>
                            </div>
                            <div>
                                <p className={`text-xl font-bold ${textColor}`}>{favorites.length || 0}</p>
                                <p className={`text-xs ${subTextColor}`}>Favorites</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Calculations */}
                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor} lg:col-span-2`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-lg font-semibold ${textColor}`}>Recent Calculations</h2>
                            <Link to="/dashboard/calculations" className="text-[#3B68FC] text-sm hover:underline">View All</Link>
                        </div>

                        {recentCalcs.length === 0 ? (
                            <div className={`text-center py-8 ${subTextColor}`}>
                                <i className="fas fa-calculator text-4xl mb-3 opacity-50"></i>
                                <p>No calculations yet</p>
                                <Link to="/" className="text-[#3B68FC] text-sm hover:underline mt-2 inline-block">
                                    Start calculating →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentCalcs.map((calc) => (
                                    <Link
                                        key={calc.id}
                                        to={calc.calculatorSlug}
                                        className={`flex items-center gap-4 p-3 rounded-lg border ${borderColor} hover:shadow transition-shadow`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f4ff]'}`}>
                                            <i className={`fas ${calc.calculatorIcon || 'fa-calculator'} text-[#3B68FC]`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${textColor} truncate`}>{calc.calculatorName}</p>
                                            <p className={`text-xs ${subTextColor}`}>
                                                {formatDate(calc.createdAt)}
                                                {calc.projectName && ` • ${calc.projectName}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {calc.isSaved && (
                                                <i className="fas fa-bookmark text-green-500 text-sm"></i>
                                            )}
                                            <i className={`fas fa-chevron-right ${subTextColor} text-sm`}></i>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Favorite Calculators */}
                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor} lg:col-span-2`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-lg font-semibold ${textColor}`}>Favorite Calculators</h2>
                            <Link to="/saved" className="text-[#3B68FC] text-sm hover:underline">Manage</Link>
                        </div>

                        {favorites.length === 0 ? (
                            <div className={`text-center py-8 ${subTextColor}`}>
                                <i className="fas fa-star text-4xl mb-3 opacity-50"></i>
                                <p>No favorite calculators yet</p>
                                <p className="text-sm mt-1">Star calculators to access them quickly</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {favorites.slice(0, 8).map((fav) => (
                                    <Link
                                        key={fav.id}
                                        to={fav.calculatorSlug}
                                        className={`flex flex-col items-center p-4 rounded-lg border ${borderColor} hover:shadow hover:border-[#3B68FC] transition-all text-center`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f4ff]'}`}>
                                            <i className={`fas ${fav.calculatorIcon || 'fa-calculator'} text-[#3B68FC] text-lg`}></i>
                                        </div>
                                        <p className={`text-sm font-medium ${textColor} truncate w-full`}>
                                            {fav.calculatorName.replace(' Calculator', '')}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className={`${cardBg} p-6 rounded-xl shadow-sm border ${borderColor}`}>
                        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Quick Links</h2>
                        <div className="space-y-2">
                            <Link to="/profile/edit" className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-50'}`}>
                                <i className="fas fa-user text-[#3B68FC]"></i>
                                <span className={textColor}>Edit Profile</span>
                            </Link>
                            <Link to="/settings" className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-50'}`}>
                                <i className="fas fa-cog text-[#8B5CF6]"></i>
                                <span className={textColor}>Settings</span>
                            </Link>
                            <Link to="/dashboard/security" className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-50'}`}>
                                <i className="fas fa-shield-alt text-green-500"></i>
                                <span className={textColor}>Security</span>
                            </Link>
                            <Link to="/history" className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-50'}`}>
                                <i className="fas fa-history text-orange-500"></i>
                                <span className={textColor}>Calculation History</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
