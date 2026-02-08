import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/supabaseService';

const statCards = [
    { key: 'totalCalculations', label: 'Total Calculations', icon: 'fa-calculator', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-500/10', textColor: 'text-blue-500' },
    { key: 'savedCalculations', label: 'Saved Calculations', icon: 'fa-bookmark', color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-500/10', textColor: 'text-amber-500' },
    { key: 'totalUsers', label: 'Total Users', icon: 'fa-users', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-500/10', textColor: 'text-emerald-500' },
    { key: 'thisMonth', label: 'This Month', icon: 'fa-calendar-alt', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-500/10', textColor: 'text-violet-500' },
];

const CACHE_KEY = 'admin_dashboard_stats';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    // Load from cache
    const loadFromCache = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    return data;
                }
            }
        } catch (err) {
            console.error('Cache read error:', err);
        }
        return null;
    };

    // Save to cache
    const saveToCache = (data) => {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now(),
            }));
        } catch (err) {
            console.error('Cache write error:', err);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                // Try to load from cache first
                const cached = loadFromCache();
                if (cached) {
                    setStats(cached);
                    setLoading(false);
                    setLastFetch(Date.now());
                }

                // Fetch fresh data
                const freshData = await getAdminStats();
                setStats(freshData);
                saveToCache(freshData);
                setLastFetch(Date.now());
            } catch (err) {
                console.error('Stats fetch error:', err);
                setError(err.message || 'Failed to load statistics');
                // Use cached data if available
                const cached = loadFromCache();
                if (cached) {
                    setStats(cached);
                }
            } finally {
                setLoading(false);
            }
        };
        load();

        // Refresh every 5 minutes
        const interval = setInterval(load, CACHE_DURATION);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-[#6b7280] font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-600">
                <i className="fas fa-exclamation-circle text-xl mr-2"></i>
                <span className="font-medium">{error}</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#0A0A0A]">Admin Dashboard</h1>
                <p className="text-[#6b7280] mt-2 flex items-center gap-2">
                    <i className="fas fa-chart-line"></i>
                    Platform Overview & Management
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className="rounded-2xl bg-white border border-[#e5e7eb] p-6 hover:shadow-lg transition-all duration-300 hover:border-[#d0d9ff]"
                    >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-md`}>
                            <i className={`fas ${card.icon} text-white text-lg`}></i>
                        </div>
                        <p className="text-4xl font-bold text-[#0A0A0A]">{stats?.[card.key] ?? 0}</p>
                        <p className="text-[#6b7280] text-sm mt-2 font-medium">{card.label}</p>
                        <div className={`mt-3 inline-flex items-center gap-1 ${card.textColor} text-xs font-semibold`}>
                            <i className="fas fa-arrow-up"></i> Updated
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top Calculators */}
                <div className="rounded-2xl bg-white border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#0A0A0A] flex items-center gap-2">
                            <i className="fas fa-fire text-orange-500"></i>
                            Most Used Calculators
                        </h2>
                        <span className="text-xs font-semibold text-[#6b7280] bg-[#f3f4f6] px-3 py-1 rounded-full">Top 8</span>
                    </div>
                    <div className="space-y-3">
                        {(stats?.topCalculators || []).slice(0, 8).map((calc, i) => (
                            <div
                                key={calc.slug}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fa] transition-colors border border-transparent hover:border-[#e5e7eb]"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#3B68FC] to-[#2a4add] text-white text-xs flex items-center justify-center font-bold shrink-0`}>
                                        {i + 1}
                                    </span>
                                    <i className={`fas ${calc.icon || 'fa-calculator'} text-[#3B68FC] w-5 shrink-0`}></i>
                                    <span className="text-[#0A0A0A] truncate font-medium text-sm">{calc.name}</span>
                                </div>
                                <span className="text-[#3B68FC] font-bold whitespace-nowrap ml-2">{calc.count}</span>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/admin/calculators"
                        className="mt-6 inline-flex items-center gap-2 text-[#3B68FC] hover:text-[#2a4add] font-semibold text-sm transition-colors"
                    >
                        View all <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-white border border-[#e5e7eb] p-6 shadow-sm hover:shadow-md transition-all">
                    <h2 className="text-xl font-bold text-[#0A0A0A] mb-6 flex items-center gap-2">
                        <i className="fas fa-bolt text-yellow-500"></i>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <Link
                            to="/admin/calculations"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all group"
                        >
                            <i className="fas fa-list text-blue-500 group-hover:scale-110 transition-transform"></i>
                            <span className="text-[#0A0A0A] font-semibold">All Calculations</span>
                        </Link>
                        <Link
                            to="/admin/users"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all group"
                        >
                            <i className="fas fa-users text-green-500 group-hover:scale-110 transition-transform"></i>
                            <span className="text-[#0A0A0A] font-semibold">Users</span>
                        </Link>
                        <Link
                            to="/admin/site-settings"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 hover:border-purple-300 transition-all group"
                        >
                            <i className="fas fa-cog text-purple-500 group-hover:scale-110 transition-transform"></i>
                            <span className="text-[#0A0A0A] font-semibold">Settings</span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 hover:border-orange-300 transition-all group"
                        >
                            <i className="fas fa-home text-orange-500 group-hover:scale-110 transition-transform"></i>
                            <span className="text-[#0A0A0A] font-semibold">Visit Site</span>
                        </Link>
                    </div>

                    {/* Cache Status */}
                    {lastFetch && (
                        <div className="mt-4 p-3 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb]">
                            <p className="text-xs text-[#6b7280]">
                                <i className="fas fa-clock mr-1"></i>
                                Last updated: {new Date(lastFetch).toLocaleTimeString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Security Alert */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2 flex items-center gap-2">
                    <i className="fas fa-shield-alt text-blue-600"></i>
                    Security & Best Practices
                </h3>
                <p className="text-[#6b7280] text-justify">
                    This admin dashboard is restricted to authorized administrators only. All actions are logged for security and audit purposes. 
                    Please ensure you follow proper security protocols when managing site content and user data. Never share your admin credentials.
                </p>
            </div>
        </div>
    );
}
