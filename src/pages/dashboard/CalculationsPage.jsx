import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import {
    getCalculations,
    getCalculationStats,
    deleteCalculation,
    updateCalculation,
} from '../../services/supabaseService';

export default function CalculationsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { isDarkMode } = useSettings();
    const navigate = useNavigate();

    const [calculations, setCalculations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ saved: '', search: '' });
    const [stats, setStats] = useState(null);

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
        if (isAuthenticated && user?.id) {
            fetchCalculations();
            fetchStats();
        }
    }, [isAuthenticated, user?.id, pagination.page, filters]);

    const fetchCalculations = async () => {
        if (!user?.id) return;
        try {
            const res = await getCalculations(user.id, {
                page: pagination.page,
                limit: 10,
                saved: filters.saved === 'true' ? true : undefined,
                search: filters.search || undefined,
            });
            const mapped = (res.calculations || []).map((c) => ({
                id: c.id,
                calculatorSlug: c.calculator_slug,
                calculatorName: c.calculator_name,
                calculatorIcon: c.calculator_icon,
                inputs: c.inputs || {},
                outputs: c.outputs || {},
                isSaved: c.is_saved,
                createdAt: c.created_at,
            }));
            setCalculations(mapped);
            setPagination((prev) => ({
                ...prev,
                totalPages: res.pagination?.totalPages || 1,
                total: res.pagination?.total || 0,
            }));
        } catch (err) {
            console.error('Failed to load calculations:', err);
            setError('Failed to load calculations');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!user?.id) return;
        try {
            const data = await getCalculationStats(user.id);
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this calculation?')) return;
        try {
            await deleteCalculation(user.id, id);
            setCalculations((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error('Failed to delete:', err);
            alert('Failed to delete calculation');
        }
    };

    const toggleSaved = async (id, currentSaved) => {
        try {
            await updateCalculation(user.id, id, { isSaved: !currentSaved });
            setCalculations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isSaved: !currentSaved } : c))
            );
        } catch (err) {
            console.error('Failed to update:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const slugToPath = (slug) => (slug?.startsWith('/') ? slug : `/${slug || ''}`);

    if (authLoading || loading) {
        return (
            <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin"></div>
                    <p className={subTextColor}>Loading calculations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgColor} py-8 px-4`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className={`text-2xl font-bold ${textColor}`}>Calculation History</h1>
                        <p className={subTextColor}>View and manage your saved calculations</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={filters.search}
                            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                            className={`px-4 py-2 border rounded-lg outline-none focus:border-[#3B68FC] ${cardBg} ${textColor} border ${borderColor}`}
                        />
                        <select
                            value={filters.saved}
                            onChange={(e) => setFilters((p) => ({ ...p, saved: e.target.value }))}
                            className={`px-4 py-2 border rounded-lg outline-none focus:border-[#3B68FC] ${cardBg} ${textColor} border ${borderColor}`}
                        >
                            <option value="">All</option>
                            <option value="true">Saved Only</option>
                        </select>
                        <Link to="/history" className="px-4 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add]">
                            View All
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className={`${cardBg} p-4 rounded-xl border ${borderColor} text-red-500 mb-4`}>
                        {error}
                    </div>
                )}

                {calculations.length === 0 ? (
                    <div className={`${cardBg} p-12 rounded-xl border ${borderColor} text-center`}>
                        <i className="fas fa-calculator text-4xl text-gray-400 mb-4"></i>
                        <p className={subTextColor}>No calculations yet</p>
                        <Link to="/" className="text-[#3B68FC] hover:underline mt-2 inline-block">
                            Start calculating →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {calculations.map((calc) => (
                            <div
                                key={calc.id}
                                className={`${cardBg} p-4 rounded-xl border ${borderColor} flex items-center justify-between`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f4ff]'}`}>
                                        <i className={`fas ${calc.calculatorIcon || 'fa-calculator'} text-[#3B68FC]`}></i>
                                    </div>
                                    <div>
                                        <p className={`font-medium ${textColor}`}>{calc.calculatorName}</p>
                                        <p className={`text-sm ${subTextColor}`}>{formatDate(calc.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleSaved(calc.id, calc.isSaved)}
                                        className={`p-2 rounded-lg ${calc.isSaved ? 'text-yellow-500' : 'text-gray-400'}`}
                                        title={calc.isSaved ? 'Unsave' : 'Save'}
                                    >
                                        <i className="fas fa-bookmark"></i>
                                    </button>
                                    <Link
                                        to={slugToPath(calc.calculatorSlug)}
                                        className="px-4 py-2 bg-[#3B68FC]/10 text-[#3B68FC] rounded-lg text-sm font-medium hover:bg-[#3B68FC]/20"
                                    >
                                        Open
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(calc.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {stats && (
                    <div className={`mt-8 ${cardBg} p-6 rounded-xl border ${borderColor}`}>
                        <h3 className={`font-semibold ${textColor} mb-4`}>Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
                                <p className={`text-sm ${subTextColor}`}>Total</p>
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{stats.saved}</p>
                                <p className={`text-sm ${subTextColor}`}>Saved</p>
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{stats.thisMonth}</p>
                                <p className={`text-sm ${subTextColor}`}>This Month</p>
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{stats.mostUsed?.calculatorName?.split(' ')[0] || '-'}</p>
                                <p className={`text-sm ${subTextColor}`}>Most Used</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
