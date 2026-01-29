import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import api from '../../services/api';

export default function CalculationsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { isDarkMode } = useSettings();
    const navigate = useNavigate();

    const [calculations, setCalculations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ saved: '', search: '', project: '' });
    const [stats, setStats] = useState(null);

    // Theme classes
    const bgColor = isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-blue-50 via-white to-pink-50';
    const cardBg = isDarkMode ? 'bg-[#1e293b]' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = isDarkMode ? 'border-[#334155]' : 'border-gray-200';
    const inputBg = isDarkMode ? 'bg-[#0f172a]' : 'bg-white';

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        fetchCalculations();
        fetchStats();
    }, [isAuthenticated, pagination.page, filters]);

    const fetchCalculations = async () => {
        if (!isAuthenticated) return;
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: 10,
                ...(filters.saved && { saved: filters.saved }),
                ...(filters.search && { search: filters.search }),
                ...(filters.project && { project: filters.project })
            });

            const response = await api.get(`/calculations?${params}`);
            setCalculations(response.data.calculations || []);
            setPagination(prev => ({
                ...prev,
                totalPages: response.data.pagination.totalPages,
                total: response.data.pagination.total
            }));
        } catch (err) {
            console.error('Failed to load calculations:', err);
            setError('Failed to load calculations');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/calculations/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this calculation?')) return;
        try {
            await api.delete(`/calculations/${id}`);
            setCalculations(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to delete:', err);
            alert('Failed to delete calculation');
        }
    };

    const toggleSaved = async (id, currentSaved) => {
        try {
            await api.put(`/calculations/${id}`, { isSaved: !currentSaved });
            setCalculations(prev => prev.map(c =>
                c.id === id ? { ...c, isSaved: !currentSaved } : c
            ));
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
            minute: '2-digit'
        });
    };

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

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link to="/dashboard" className={`${subTextColor} hover:text-[#3B68FC]`}>
                                <i className="fas fa-arrow-left"></i> Dashboard
                            </Link>
                        </div>
                        <h1 className={`text-2xl font-bold ${textColor}`}>Calculation History</h1>
                        <p className={subTextColor}>
                            {pagination.total} calculations found
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className={`${cardBg} p-4 rounded-xl border ${borderColor}`}>
                            <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
                            <p className={`text-sm ${subTextColor}`}>Total</p>
                        </div>
                        <div className={`${cardBg} p-4 rounded-xl border ${borderColor}`}>
                            <p className={`text-2xl font-bold ${textColor}`}>{stats.saved}</p>
                            <p className={`text-sm ${subTextColor}`}>Saved</p>
                        </div>
                        <div className={`${cardBg} p-4 rounded-xl border ${borderColor}`}>
                            <p className={`text-2xl font-bold ${textColor}`}>{stats.thisMonth}</p>
                            <p className={`text-sm ${subTextColor}`}>This Month</p>
                        </div>
                        <div className={`${cardBg} p-4 rounded-xl border ${borderColor}`}>
                            <p className={`text-2xl font-bold ${textColor}`}>{stats.byType?.length || 0}</p>
                            <p className={`text-sm ${subTextColor}`}>Calculator Types</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className={`${cardBg} p-4 rounded-xl border ${borderColor} mb-6`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search calculations..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                            />
                        </div>
                        <select
                            value={filters.saved}
                            onChange={(e) => setFilters(prev => ({ ...prev, saved: e.target.value }))}
                            className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                        >
                            <option value="">All Calculations</option>
                            <option value="true">Saved Only</option>
                        </select>
                        <button
                            onClick={() => setFilters({ saved: '', search: '', project: '' })}
                            className={`px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-gray-100 dark:hover:bg-[#0f172a]`}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Calculations List */}
                <div className={`${cardBg} rounded-xl border ${borderColor} overflow-hidden`}>
                    {calculations.length === 0 ? (
                        <div className={`text-center py-12 ${subTextColor}`}>
                            <i className="fas fa-calculator text-4xl mb-3 opacity-50"></i>
                            <p>No calculations found</p>
                            <Link to="/" className="text-[#3B68FC] text-sm hover:underline mt-2 inline-block">
                                Start calculating →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={`${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'} border-b ${borderColor}`}>
                                        <tr>
                                            <th className={`px-6 py-3 text-left text-xs font-semibold ${subTextColor} uppercase`}>Calculator</th>
                                            <th className={`px-6 py-3 text-left text-xs font-semibold ${subTextColor} uppercase hidden md:table-cell`}>Project</th>
                                            <th className={`px-6 py-3 text-left text-xs font-semibold ${subTextColor} uppercase hidden lg:table-cell`}>Date</th>
                                            <th className={`px-6 py-3 text-center text-xs font-semibold ${subTextColor} uppercase`}>Status</th>
                                            <th className={`px-6 py-3 text-right text-xs font-semibold ${subTextColor} uppercase`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {calculations.map((calc) => (
                                            <tr key={calc.id} className={`${isDarkMode ? 'hover:bg-[#0f172a]' : 'hover:bg-gray-50'}`}>
                                                <td className="px-6 py-4">
                                                    <Link to={calc.calculatorSlug} className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f4ff]'}`}>
                                                            <i className={`fas ${calc.calculatorIcon || 'fa-calculator'} text-[#3B68FC]`}></i>
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium ${textColor}`}>{calc.calculatorName}</p>
                                                            <p className={`text-xs ${subTextColor} md:hidden`}>{formatDate(calc.createdAt)}</p>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className={`px-6 py-4 ${subTextColor} hidden md:table-cell`}>
                                                    {calc.projectName || '-'}
                                                </td>
                                                <td className={`px-6 py-4 ${subTextColor} hidden lg:table-cell`}>
                                                    {formatDate(calc.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleSaved(calc.id, calc.isSaved)}
                                                        className={calc.isSaved ? 'text-green-500' : subTextColor}
                                                    >
                                                        <i className={`fas fa-bookmark ${calc.isSaved ? '' : 'opacity-50'}`}></i>
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={calc.calculatorSlug}
                                                            className="p-2 text-[#3B68FC] hover:bg-blue-50 rounded-lg"
                                                            title="Re-open"
                                                        >
                                                            <i className="fas fa-external-link-alt"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(calc.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className={`flex items-center justify-between px-6 py-4 border-t ${borderColor}`}>
                                    <p className={subTextColor}>
                                        Page {pagination.page} of {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className={`px-3 py-1 rounded border ${borderColor} ${textColor} disabled:opacity-50`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.totalPages}
                                            className={`px-3 py-1 rounded border ${borderColor} ${textColor} disabled:opacity-50`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
