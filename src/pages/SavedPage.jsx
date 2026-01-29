import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

// Sample calculator data for saved items
const CALCULATORS = {
    'concrete': { name: 'Cement Concrete Calculator', icon: 'fa-cube', path: '/concrete-calculator', category: 'Concrete' },
    'brick-masonry': { name: 'Brick Masonry Calculator', icon: 'fa-th-large', path: '/brick-masonry-calculator', category: 'Masonry' },
    'steel-weight': { name: 'Steel Weight Calculator', icon: 'fa-weight', path: '/steel-weight-calculator', category: 'Steel' },
    'paint-work': { name: 'Paint Work Calculator', icon: 'fa-paint-roller', path: '/paint-work-calculator', category: 'Finishing' },
    'flooring': { name: 'Flooring Calculator', icon: 'fa-border-all', path: '/flooring-calculator', category: 'Finishing' },
    'excavation': { name: 'Excavation Calculator', icon: 'fa-mountain', path: '/excavation-calculator', category: 'Earthwork' },
    'plaster': { name: 'Plaster Calculator', icon: 'fa-brush', path: '/plaster-calculator', category: 'Masonry' },
    'construction-cost': { name: 'Construction Cost Estimator', icon: 'fa-rupee-sign', path: '/construction-cost-calculator', category: 'Estimation' },
};

export default function SavedPage() {
    const { isDarkMode } = useSettings();
    const [savedItems, setSavedItems] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Load saved items from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedCalculators');
        if (saved) {
            const savedIds = JSON.parse(saved);
            const items = savedIds.map(id => ({
                id,
                ...CALCULATORS[id],
                savedAt: new Date().toISOString() // Mock date
            })).filter(item => item.name);
            setSavedItems(items);
        }
        setLoading(false);
    }, []);

    const removeItem = (id) => {
        const updated = savedItems.filter(item => item.id !== id);
        setSavedItems(updated);
        localStorage.setItem('savedCalculators', JSON.stringify(updated.map(i => i.id)));
    };

    const filteredItems = savedItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const bgClass = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F7F9FF]';
    const cardClass = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const textClass = isDarkMode ? 'text-white' : 'text-[#0A0A0A]';
    const subTextClass = isDarkMode ? 'text-[#94a3b8]' : 'text-[#6b7280]';
    const inputClass = isDarkMode
        ? 'bg-[#0f172a] border-[#334155] text-white placeholder:text-[#64748b]'
        : 'bg-white border-[#e5e7eb] text-[#0A0A0A] placeholder:text-[#9ca3af]';

    return (
        <div className={`min-h-screen ${bgClass} py-8`}>
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Saved Calculators</h1>
                        <p className={subTextClass}>Your bookmarked calculators for quick access</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 p-1 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#f3f4f6]'}`}>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#3B68FC] text-white' : subTextClass}`}
                            >
                                <i className="fas fa-th-large"></i>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#3B68FC] text-white' : subTextClass}`}
                            >
                                <i className="fas fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className={`relative ${cardClass} rounded-xl border`}>
                        <i className={`fas fa-search absolute left-4 top-1/2 -translate-y-1/2 ${subTextClass}`}></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search saved calculators..."
                            className={`w-full pl-11 pr-4 py-3.5 rounded-xl border-0 outline-none ${inputClass}`}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {loading ? (
                    <div className={`${cardClass} rounded-2xl p-12 text-center border`}>
                        <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className={`mt-4 ${subTextClass}`}>Loading saved calculators...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className={`${cardClass} rounded-2xl p-12 text-center border`}>
                        <div className="w-20 h-20 bg-gradient-to-br from-[#F59E0B]/10 to-[#EF4444]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-bookmark text-4xl text-[#F59E0B]"></i>
                        </div>
                        <h3 className={`text-xl font-semibold ${textClass} mb-2`}>
                            {searchTerm ? 'No results found' : 'No saved calculators'}
                        </h3>
                        <p className={`${subTextClass} mb-6`}>
                            {searchTerm
                                ? 'Try a different search term'
                                : 'Bookmark your favorite calculators for quick access'
                            }
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-[#F59E0B]/20">
                            <i className="fas fa-search"></i>
                            Browse Calculators
                        </Link>
                    </div>
                ) : (
                    /* Saved Items Grid/List */
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map((item) => (
                                <div key={item.id} className={`${cardClass} rounded-xl p-5 border hover:shadow-md transition-all group`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-[#3B68FC]/10 to-[#8B5CF6]/10'
                                            }`}>
                                            <i className={`fas ${item.icon} text-lg text-[#3B68FC]`}></i>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove from saved"
                                        >
                                            <i className="fas fa-bookmark"></i>
                                        </button>
                                    </div>
                                    <h3 className={`font-semibold ${textClass} mb-1`}>{item.name}</h3>
                                    <p className={`text-sm ${subTextClass} mb-4`}>{item.category}</p>
                                    <Link
                                        to={item.path}
                                        className="block w-full text-center py-2.5 bg-[#3B68FC]/10 text-[#3B68FC] rounded-lg text-sm font-medium hover:bg-[#3B68FC]/20 transition-colors"
                                    >
                                        <i className="fas fa-calculator mr-2"></i>
                                        Open Calculator
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredItems.map((item) => (
                                <div key={item.id} className={`${cardClass} rounded-xl p-4 border hover:shadow-md transition-all`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f5ff]'
                                                }`}>
                                                <i className={`fas ${item.icon} text-lg text-[#3B68FC]`}></i>
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold ${textClass}`}>{item.name}</h3>
                                                <p className={`text-sm ${subTextClass}`}>{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={item.path}
                                                className="px-4 py-2 bg-gradient-to-r from-[#3B68FC] to-[#6366F1] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm"
                                            >
                                                <i className="fas fa-external-link-alt mr-2"></i>
                                                Open
                                            </Link>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Quick Add Section */}
                {savedItems.length < 3 && (
                    <div className={`mt-8 ${cardClass} rounded-xl p-6 border`}>
                        <h3 className={`font-semibold ${textClass} mb-4`}>
                            <i className="fas fa-lightbulb text-[#F59E0B] mr-2"></i>
                            Popular Calculators
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(CALCULATORS).slice(0, 4).map(([id, calc]) => (
                                <Link
                                    key={id}
                                    to={calc.path}
                                    className={`p-4 rounded-xl text-center hover:shadow-md transition-all ${isDarkMode ? 'bg-[#0f172a] hover:bg-[#1e293b]' : 'bg-[#f8f9fa] hover:bg-white'
                                        }`}
                                >
                                    <i className={`fas ${calc.icon} text-2xl text-[#3B68FC] mb-2`}></i>
                                    <p className={`text-sm font-medium ${textClass} line-clamp-2`}>{calc.name.replace(' Calculator', '')}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
