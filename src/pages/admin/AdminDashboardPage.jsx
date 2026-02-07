import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/supabaseService';

const statCards = [
    { key: 'totalCalculations', label: 'Total Calculations', icon: 'fa-calculator', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-500/10', textColor: 'text-blue-400' },
    { key: 'savedCalculations', label: 'Saved Calculations', icon: 'fa-bookmark', color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-500/10', textColor: 'text-amber-400' },
    { key: 'totalUsers', label: 'Total Users', icon: 'fa-users', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
    { key: 'thisMonth', label: 'This Month', icon: 'fa-calendar-alt', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-500/10', textColor: 'text-violet-400' },
];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-red-400">
                <i className="fas fa-exclamation-circle text-xl mr-2"></i>
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 mt-1">Overview of calculators and users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 hover:border-slate-600 transition-colors"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                            <i className={`fas ${card.icon} text-white text-lg`}></i>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats?.[card.key] ?? 0}</p>
                        <p className="text-slate-400 text-sm mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-chart-pie text-amber-400"></i>
                        Top Calculators
                    </h2>
                    <div className="space-y-3">
                        {(stats?.topCalculators || []).slice(0, 8).map((calc, i) => (
                            <div
                                key={calc.slug}
                                className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 text-xs flex items-center justify-center font-medium">
                                        {i + 1}
                                    </span>
                                    <i className={`fas ${calc.icon || 'fa-calculator'} text-amber-400 w-5`}></i>
                                    <span className="text-white truncate max-w-[200px]">{calc.name}</span>
                                </div>
                                <span className="text-amber-400 font-semibold">{calc.count}</span>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/admin/calculators"
                        className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium"
                    >
                        View all <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-bolt text-emerald-400"></i>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            to="/admin/calculations"
                            className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition-colors"
                        >
                            <i className="fas fa-list text-blue-400"></i>
                            <span className="text-white font-medium">All Calculations</span>
                        </Link>
                        <Link
                            to="/admin/users"
                            className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition-colors"
                        >
                            <i className="fas fa-users text-emerald-400"></i>
                            <span className="text-white font-medium">Users</span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 transition-colors"
                        >
                            <i className="fas fa-home text-amber-400"></i>
                            <span className="text-white font-medium">Visit Site</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
