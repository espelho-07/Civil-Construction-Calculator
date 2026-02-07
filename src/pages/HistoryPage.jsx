import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import {
    getCalculations,
    getCalculationStats,
    deleteCalculation,
} from '../services/supabaseService';

export default function HistoryPage() {
    const { isAuthenticated, user } = useAuth();
    const { isDarkMode } = useSettings();
    const [calculations, setCalculations] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadCalculations();
            loadStats();
        } else {
            const savedHistory = localStorage.getItem('calculationHistory');
            if (savedHistory) {
                try {
                    setCalculations(JSON.parse(savedHistory));
                } catch {
                    setCalculations([]);
                }
            }
            setLoading(false);
        }
    }, [isAuthenticated, user?.id]);

    const loadCalculations = async () => {
        try {
            const res = await getCalculations(user.id);
            const mapped = (res.calculations || []).map((c) => ({
                id: c.id,
                calculatorSlug: c.calculator_slug,
                calculatorName: c.calculator_name,
                calculatorIcon: c.calculator_icon,
                inputs: c.inputs || {},
                outputs: c.outputs || {},
                isSaved: c.is_saved,
                createdAt: c.created_at,
                date: c.created_at,
            }));
            setCalculations(mapped);
        } catch (err) {
            console.error('Failed to load calculations:', err);
            const savedHistory = localStorage.getItem('calculationHistory');
            if (savedHistory) {
                try {
                    setCalculations(JSON.parse(savedHistory));
                } catch {
                    setCalculations([]);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const data = await getCalculationStats(user.id);
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const getFilteredCalculations = () => {
        const now = new Date();
        return calculations.filter((item) => {
            const itemDate = new Date(item.createdAt || item.date);
            switch (filter) {
                case 'today':
                    return itemDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return itemDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return itemDate >= monthAgo;
                case 'saved':
                    return item.isSaved;
                default:
                    return true;
            }
        });
    };

    const deleteItem = async (id) => {
        if (isAuthenticated && user?.id) {
            try {
                await deleteCalculation(user.id, id);
                setCalculations((prev) => prev.filter((item) => item.id !== id));
            } catch (err) {
                console.error('Failed to delete calculation:', err);
            }
        } else {
            const updated = calculations.filter((item) => item.id !== id);
            setCalculations(updated);
            localStorage.setItem('calculationHistory', JSON.stringify(updated));
        }
    };

    const clearAll = async () => {
        if (window.confirm('Are you sure you want to delete all history?')) {
            if (isAuthenticated && user?.id) {
                try {
                    for (const calc of calculations) {
                        await deleteCalculation(user.id, calc.id);
                    }
                    setCalculations([]);
                } catch (err) {
                    console.error('Failed to clear history:', err);
                }
            } else {
                setCalculations([]);
                localStorage.removeItem('calculationHistory');
            }
        }
    };

    const bgClass = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F7F9FF]';
    const cardClass = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const textClass = isDarkMode ? 'text-white' : 'text-[#0A0A0A]';
    const subTextClass = isDarkMode ? 'text-[#94a3b8]' : 'text-[#6b7280]';
    const selectClass = isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'bg-white border-[#e5e7eb]';

    const filteredCalculations = getFilteredCalculations();

    const slugToPath = (slug) => (slug?.startsWith('/') ? slug : `/${slug || ''}`);

    return (
        <div className={`min-h-screen ${bgClass} py-8`}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-[#334155]' : ''} transition-colors`}
                        >
                            <i className={`fas fa-arrow-left ${textClass}`}></i>
                        </Link>
                        <div>
                            <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Calculation History</h1>
                            <p className={subTextClass}>View and manage your saved calculations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={`px-4 py-2.5 border-2 rounded-xl outline-none focus:border-[#3B68FC] ${selectClass}`}
                        >
                            <option value="all">All Time</option>
                            <option value="saved">Saved Only</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        {calculations.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                            >
                                <i className="fas fa-trash-alt mr-2"></i>
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className={`${cardClass} rounded-2xl p-6 mb-6 border border-yellow-300 bg-yellow-50`}>
                        <div className="flex items-center gap-3">
                            <i className="fas fa-info-circle text-yellow-500 text-xl"></i>
                            <div>
                                <p className="text-yellow-800 font-medium">Login to save calculations to your account</p>
                                <p className="text-yellow-600 text-sm">Currently showing local history only. <Link to="/login" className="underline font-medium">Login now</Link></p>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className={`${cardClass} rounded-2xl p-12 text-center border`}>
                        <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className={`mt-4 ${subTextClass}`}>Loading history...</p>
                    </div>
                ) : filteredCalculations.length === 0 ? (
                    <div className={`${cardClass} rounded-2xl p-12 text-center border`}>
                        <div className="w-20 h-20 bg-gradient-to-br from-[#3B68FC]/10 to-[#8B5CF6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-history text-4xl text-[#3B68FC]"></i>
                        </div>
                        <h3 className={`text-xl font-semibold ${textClass} mb-2`}>No calculations yet</h3>
                        <p className={`${subTextClass} mb-6`}>
                            {filter === 'all'
                                ? 'Use the Save button on any calculator to save your work here'
                                : 'No calculations found for the selected period'}
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B68FC] to-[#6366F1] text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-[#3B68FC]/20">
                            <i className="fas fa-calculator"></i>
                            Browse Calculators
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCalculations.map((item) => (
                            <div key={item.id} className={`${cardClass} rounded-xl p-5 border hover:shadow-md transition-all`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f5ff]'}`}>
                                            <i className={`fas ${item.calculatorIcon || 'fa-calculator'} text-lg text-[#3B68FC]`}></i>
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${textClass} flex items-center gap-2`}>
                                                {item.calculatorName}
                                                {item.isSaved && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                                                        <i className="fas fa-bookmark mr-1"></i>Saved
                                                    </span>
                                                )}
                                            </h3>
                                            <p className={`text-sm ${subTextClass}`}>
                                                {new Date(item.createdAt || item.date).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={slugToPath(item.calculatorSlug)}
                                            className="px-4 py-2 bg-[#3B68FC]/10 text-[#3B68FC] rounded-lg text-sm font-medium hover:bg-[#3B68FC]/20 transition-colors"
                                        >
                                            <i className="fas fa-redo mr-2"></i>
                                            Open
                                        </Link>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                {(item.inputs || item.outputs) && Object.keys(item.inputs || {}).length + Object.keys(item.outputs || {}).length > 0 && (
                                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#f3f4f6]'}`}>
                                        <div className="grid grid-cols-2 gap-4">
                                            {item.inputs && Object.keys(item.inputs).length > 0 && (
                                                <div>
                                                    <p className={`text-xs font-medium ${subTextClass} mb-2`}>Inputs</p>
                                                    <div className="space-y-1">
                                                        {Object.entries(item.inputs).slice(0, 3).map(([key, value]) => (
                                                            <p key={key} className={`text-sm ${textClass}`}>
                                                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {value}
                                                            </p>
                                                        ))}
                                                        {Object.keys(item.inputs).length > 3 && (
                                                            <p className={`text-xs ${subTextClass}`}>+{Object.keys(item.inputs).length - 3} more</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {item.outputs && Object.keys(item.outputs).length > 0 && (
                                                <div>
                                                    <p className={`text-xs font-medium ${subTextClass} mb-2`}>Results</p>
                                                    <div className="space-y-1">
                                                        {Object.entries(item.outputs).slice(0, 3).map(([key, value]) => (
                                                            <p key={key} className={`text-sm ${textClass}`}>
                                                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {typeof value === 'object' ? JSON.stringify(value).slice(0, 30) : value}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {(stats || calculations.length > 0) && (
                    <div className={`mt-8 ${cardClass} rounded-xl p-6 border`}>
                        <h3 className={`font-semibold ${textClass} mb-4`}>Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8f9fa]'}`}>
                                <p className={`text-2xl font-bold ${textClass}`}>{stats?.total ?? calculations.length}</p>
                                <p className={`text-sm ${subTextClass}`}>Total Calculations</p>
                            </div>
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8f9fa]'}`}>
                                <p className={`text-2xl font-bold ${textClass}`}>{stats?.savedCount ?? calculations.filter((c) => c.isSaved).length}</p>
                                <p className={`text-sm ${subTextClass}`}>Saved</p>
                            </div>
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8f9fa]'}`}>
                                <p className={`text-2xl font-bold ${textClass}`}>
                                    {stats?.thisWeek ?? calculations.filter((c) => {
                                        const d = new Date(c.createdAt || c.date);
                                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                                        return d >= weekAgo;
                                    }).length}
                                </p>
                                <p className={`text-sm ${subTextClass}`}>This Week</p>
                            </div>
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8f9fa]'}`}>
                                <p className={`text-2xl font-bold ${textClass}`}>{stats?.mostUsed?.calculatorName?.split(' ')[0] || '-'}</p>
                                <p className={`text-sm ${subTextClass}`}>Most Used</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
