import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { getThemeClasses } from '../constants/categories';

// All calculators for search
const allCalculators = [
    // Quantity Estimator
    { name: 'Construction Cost Calculator', slug: '/construction-cost', icon: 'fa-rupee-sign', category: 'Quantity Estimator' },
    { name: 'Carpet Area Calculator', slug: '/carpet-area', icon: 'fa-vector-square', category: 'Quantity Estimator' },
    { name: 'Cement Concrete Calculator', slug: '/cement-concrete', icon: 'fa-cubes', category: 'Quantity Estimator' },
    { name: 'Plastering Calculator', slug: '/plastering', icon: 'fa-brush', category: 'Quantity Estimator' },
    { name: 'Brick Calculator', slug: '/brick-masonry', icon: 'fa-th-large', category: 'Quantity Estimator' },
    { name: 'Concrete Block Calculator', slug: '/concrete-block', icon: 'fa-th', category: 'Quantity Estimator' },
    { name: 'Precast Compound Wall Calculator', slug: '/precast-boundary-wall', icon: 'fa-border-all', category: 'Quantity Estimator' },
    { name: 'Flooring Calculator', slug: '/flooring', icon: 'fa-th', category: 'Quantity Estimator' },
    { name: 'Countertop Calculator', slug: '/countertop', icon: 'fa-ruler-combined', category: 'Quantity Estimator' },
    { name: 'Tank Volume Calculator', slug: '/tank-volume', icon: 'fa-tint', category: 'Quantity Estimator' },
    { name: 'Air Conditioner Size Calculator', slug: '/ac-calculator', icon: 'fa-snowflake', category: 'Quantity Estimator' },
    { name: 'Solar Rooftop Calculator', slug: '/solar-rooftop', icon: 'fa-solar-panel', category: 'Quantity Estimator' },
    { name: 'Solar Water Heater Calculator', slug: '/solar-water-heater', icon: 'fa-sun', category: 'Quantity Estimator' },
    { name: 'Paint Work Calculator', slug: '/paint-work', icon: 'fa-paint-roller', category: 'Quantity Estimator' },
    { name: 'Excavation Calculator', slug: '/excavation', icon: 'fa-truck-loading', category: 'Quantity Estimator' },
    { name: 'Wood Framing Calculator', slug: '/wood-frame', icon: 'fa-tree', category: 'Quantity Estimator' },
    { name: 'Plywood Sheets Calculator', slug: '/plywood', icon: 'fa-layer-group', category: 'Quantity Estimator' },
    { name: 'Anti Termite Calculator', slug: '/anti-termite', icon: 'fa-bug', category: 'Quantity Estimator' },
    { name: 'Round Column Calculator', slug: '/round-column', icon: 'fa-circle', category: 'Quantity Estimator' },
    { name: 'Stair Case Calculator', slug: '/stair-case', icon: 'fa-stairs', category: 'Quantity Estimator' },
    { name: 'Top Soil Calculator', slug: '/top-soil', icon: 'fa-seedling', category: 'Quantity Estimator' },
    { name: 'Steel Weight Calculator', slug: '/steel-weight', icon: 'fa-weight-hanging', category: 'Quantity Estimator' },
    { name: 'Concrete Tube Calculator', slug: '/concrete-tube', icon: 'fa-circle-notch', category: 'Quantity Estimator' },
    { name: 'Roof Pitch Calculator', slug: '/roof-pitch', icon: 'fa-home', category: 'Quantity Estimator' },
    { name: 'Asphalt Calculator', slug: '/asphalt', icon: 'fa-road', category: 'Quantity Estimator' },
    { name: 'Steel Quantity Calculator', slug: '/steel-quantity', icon: 'fa-bars', category: 'Quantity Estimator' },
    { name: 'Civil Unit Converter', slug: '/unit-converter', icon: 'fa-exchange-alt', category: 'Quantity Estimator' },
    // Concrete Technology
    { name: 'Sieve Analysis of Aggregates', slug: '/sieve-analysis', icon: 'fa-filter', category: 'Concrete Technology' },
    { name: 'Blending of Aggregates', slug: '/blending-aggregates', icon: 'fa-blender', category: 'Concrete Technology' },
    { name: 'Aggregate Impact Value', slug: '/aggregate-impact-value', icon: 'fa-hammer', category: 'Concrete Technology' },
    { name: 'Aggregate Crushing Value', slug: '/aggregate-crushing-value', icon: 'fa-compress-alt', category: 'Concrete Technology' },
    { name: 'Aggregate Abrasion Value', slug: '/aggregate-abrasion-value', icon: 'fa-cogs', category: 'Concrete Technology' },
    { name: 'Aggregate Water Absorption', slug: '/aggregate-water-absorption', icon: 'fa-tint', category: 'Concrete Technology' },
    // Road Construction
    { name: 'Bitumen Prime Coat', slug: '/bitumen-prime-coat', icon: 'fa-fill-drip', category: 'Road Construction' },
    { name: 'Bitumen Tack Coat', slug: '/bitumen-tack-coat', icon: 'fa-brush', category: 'Road Construction' },
    // Soil Test
    { name: 'Water Content Determination', slug: '/water-content', icon: 'fa-tint', category: 'Soil Test' },
    { name: 'Specific Gravity Determination', slug: '/specific-gravity', icon: 'fa-balance-scale-right', category: 'Soil Test' },
    { name: 'Sieve Analysis of Soil', slug: '/soil-sieve-analysis', icon: 'fa-filter', category: 'Soil Test' },
    { name: 'Free Swell Index of Soil', slug: '/free-swell-index', icon: 'fa-expand-arrows-alt', category: 'Soil Test' },
    { name: 'Liquid Limit of Soil', slug: '/liquid-limit', icon: 'fa-water', category: 'Soil Test' },
    { name: 'Permeability by Falling Head', slug: '/permeability-falling-head', icon: 'fa-arrow-down', category: 'Soil Test' },
    { name: 'Permeability by Constant Head', slug: '/permeability-constant-head', icon: 'fa-arrows-alt-h', category: 'Soil Test' },
    { name: 'Vane Shear Calculator', slug: '/vane-shear', icon: 'fa-fan', category: 'Soil Test' },
    { name: 'Direct Shear Test', slug: '/direct-shear', icon: 'fa-compress-arrows-alt', category: 'Soil Test' },
    { name: 'UCS Test Calculator', slug: '/ucs-test', icon: 'fa-compress', category: 'Soil Test' },
    { name: 'IN-SITU Density by Core Cutter', slug: '/in-situ-density', icon: 'fa-circle', category: 'Soil Test' },
    { name: 'California Bearing Ratio (CBR)', slug: '/cbr-test', icon: 'fa-road', category: 'Soil Test' },
    // Environmental Engineering
    { name: 'Chemical Oxygen Demand (COD)', slug: '/cod-calculator', icon: 'fa-flask', category: 'Environmental Eng.' },
    { name: 'Biochemical Oxygen Demand (BOD)', slug: '/bod-calculator', icon: 'fa-vial', category: 'Environmental Eng.' },
    { name: 'Ammonical Nitrogen Test', slug: '/ammonical-nitrogen', icon: 'fa-atom', category: 'Environmental Eng.' },
    // Sieve Analysis Aggregates
    { name: 'GSB Grading Calculator', slug: '/sieve-analysis/gsb-grading-1', icon: 'fa-layer-group', category: 'Sieve Analysis' },
    { name: 'WBM Grading Calculator', slug: '/sieve-analysis/wbm-coarse-1', icon: 'fa-road', category: 'Sieve Analysis' },
    { name: 'WMM Grading Calculator', slug: '/sieve-analysis/wmm', icon: 'fa-road', category: 'Sieve Analysis' },
    { name: 'Bituminous Macadam Calculator', slug: '/sieve-analysis/bm-grading-1', icon: 'fa-fill-drip', category: 'Sieve Analysis' },
    { name: 'DBM Grading Calculator', slug: '/sieve-analysis/dbm-grading-1', icon: 'fa-fill-drip', category: 'Sieve Analysis' },
    { name: 'Bituminous Concrete Grading', slug: '/sieve-analysis/bc-grading-1', icon: 'fa-fill-drip', category: 'Sieve Analysis' },
    { name: 'Surface Dressing Calculator', slug: '/sieve-analysis/sd-19mm', icon: 'fa-brush', category: 'Sieve Analysis' },
    { name: 'Slurry Seal Calculator', slug: '/sieve-analysis/slurry-type-1', icon: 'fa-water', category: 'Sieve Analysis' },
    { name: 'SMA Grading Calculator', slug: '/sieve-analysis/sma-13mm', icon: 'fa-layer-group', category: 'Sieve Analysis' },
    { name: 'Mastic Asphalt Calculator', slug: '/sieve-analysis/mastic-coarse', icon: 'fa-fill-drip', category: 'Sieve Analysis' },
    { name: 'MSS Calculator', slug: '/sieve-analysis/mss-type-a', icon: 'fa-brush', category: 'Sieve Analysis' },
    { name: 'Sand Asphalt Calculator', slug: '/sieve-analysis/sand-asphalt', icon: 'fa-road', category: 'Sieve Analysis' },
];

// Map category name to theme
const getCategoryTheme = (category) => {
    const categoryThemeMap = {
        'Quantity Estimator': 'green',
        'Concrete Technology': 'gray',
        'Road Construction': 'zinc',
        'Soil Test': 'amber',
        'Sieve Analysis': 'blue',
        'Blending of Aggregates': 'purple',
        'Environmental Eng.': 'emerald',
    };
    return categoryThemeMap[category] || 'blue';
};

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [lastUsedCalc, setLastUsedCalc] = useState(null);
    const [recentCalcs, setRecentCalcs] = useState([]);
    const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);
    const historyRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
    const { isDarkMode } = useSettings();

    // Dark mode classes
    const headerBg = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const textColor = isDarkMode ? 'text-white' : 'text-[#0A0A0A]';
    const subTextColor = isDarkMode ? 'text-[#94a3b8]' : 'text-[#6b7280]';
    const inputBg = isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white placeholder:text-[#64748b]' : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#0A0A0A] placeholder:text-[#9ca3af]';
    const dropdownBg = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const hoverBg = isDarkMode ? 'hover:bg-[#0f172a]' : 'hover:bg-[#f8f9fa]';
    const chipBg = isDarkMode ? 'bg-[#0f172a] hover:bg-[#1e293b]' : 'bg-[#f0f4ff] hover:bg-[#e0e8ff]';

    const filteredCalculators = searchQuery.length > 0
        ? allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
        : [];

    // Load recent calculators from localStorage
    useEffect(() => {
        const savedLast = localStorage.getItem('lastUsedCalculator');
        const savedHistory = localStorage.getItem('recentCalculators');
        if (savedLast) {
            setLastUsedCalc(JSON.parse(savedLast));
        }
        if (savedHistory) {
            setRecentCalcs(JSON.parse(savedHistory));
        }
    }, []);

    // Track calculator usage when path changes
    useEffect(() => {
        const currentCalc = allCalculators.find(calc => calc.slug === location.pathname);
        if (currentCalc) {
            const calcData = { ...currentCalc, usedAt: new Date().toISOString() };
            setLastUsedCalc(calcData);
            localStorage.setItem('lastUsedCalculator', JSON.stringify(calcData));

            // Add to history (keep last 5, no duplicates)
            setRecentCalcs(prev => {
                const filtered = prev.filter(c => c.slug !== currentCalc.slug);
                const updated = [calcData, ...filtered].slice(0, 5);
                localStorage.setItem('recentCalculators', JSON.stringify(updated));
                return updated;
            });
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
            if (historyRef.current && !historyRef.current.contains(e.target)) {
                setShowHistoryDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCalculators.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            navigate(filteredCalculators[selectedIndex].slug);
            setShowResults(false);
            setSearchQuery('');
        } else if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/');
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    // Get avatar color based on name
    const getAvatarColor = () => {
        if (!user?.name) return '#3B68FC';
        const colors = ['#3B68FC', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
        const index = user.name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <header className={`sticky top-0 z-[100] h-16 border-b transition-colors ${headerBg}`}>
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 text-lg hover:opacity-80 transition-opacity shrink-0">
                    <img src="/logo-new.png" alt="Civil Engineering Calculators" className="h-10 w-auto" />
                </Link>

                <div className="flex-1 max-w-md relative" ref={searchRef}>
                    <div className="relative">
                        <i className={`fas fa-search absolute left-4 top-1/2 -translate-y-1/2 ${subTextColor}`}></i>
                        <input
                            type="text"
                            placeholder="Search calculator..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowResults(true);
                                setSelectedIndex(-1);
                            }}
                            onFocus={() => setShowResults(true)}
                            onKeyDown={handleKeyDown}
                            className={`w-full h-10 pl-10 pr-4 border rounded-full text-sm outline-none focus:border-[#3B68FC] transition-all ${inputBg}`}
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && filteredCalculators.length > 0 && (
                        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border overflow-hidden z-[200] ${dropdownBg}`}>
                            {filteredCalculators.map((calc, index) => {
                                const theme = getThemeClasses(getCategoryTheme(calc.category));
                                return (
                                    <Link
                                        key={calc.slug}
                                        to={calc.slug}
                                        onClick={() => { setShowResults(false); setSearchQuery(''); }}
                                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg} ${index === selectedIndex ? (isDarkMode ? 'bg-[#0f172a]' : theme.bgSoft) : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${theme.gradient}`}>
                                            <i className={`fas ${calc.icon} text-white text-sm`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium text-sm truncate ${textColor}`}>{calc.name}</p>
                                            <span className={`text-xs ${theme.text} inline-block px-2 py-0.5 ${theme.bgSoft} rounded-full`}>{calc.category}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {showResults && searchQuery.length > 0 && filteredCalculators.length === 0 && (
                        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border p-4 text-center z-[200] ${dropdownBg}`}>
                            <p className={`text-sm ${subTextColor}`}>No results for "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                {/* History chip - between Search and Login/Avatar (same for guest and logged-in, uses localStorage) */}
                {lastUsedCalc && (
                    <div
                        className="hidden md:block relative shrink-0"
                        ref={historyRef}
                        onMouseEnter={() => {
                            if (historyRef.current?.hideTimeout) {
                                clearTimeout(historyRef.current.hideTimeout);
                            }
                            setShowHistoryDropdown(true);
                        }}
                        onMouseLeave={() => {
                            historyRef.current.hideTimeout = setTimeout(() => {
                                setShowHistoryDropdown(false);
                            }, 200);
                        }}
                    >
                        <Link
                            to={lastUsedCalc.slug}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${chipBg} ${textColor}`}
                            title={`Last used: ${lastUsedCalc.name}`}
                        >
                            <i className={`fas ${lastUsedCalc.icon} text-[#3B68FC] text-xs`}></i>
                            <span className="max-w-[120px] truncate font-medium">
                                {lastUsedCalc.name.replace(' Calculator', '').replace(' Determination', '')}
                            </span>
                            <i className={`fas fa-chevron-down text-[10px] ${subTextColor} transition-transform ${showHistoryDropdown ? 'rotate-180' : ''}`}></i>
                        </Link>

                        {/* History Dropdown */}
                        {showHistoryDropdown && recentCalcs.length > 0 && (
                            <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border overflow-hidden z-[300] ${dropdownBg}`}>
                                <div className={`px-4 py-2 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e5e7eb]'}`}>
                                    <p className={`text-xs font-semibold ${subTextColor} uppercase tracking-wide`}>Recent Calculators</p>
                                </div>
                                <div className="py-1 max-h-64 overflow-y-auto">
                                    {recentCalcs.map((calc, index) => (
                                        <Link
                                            key={calc.slug + index}
                                            to={calc.slug}
                                            onClick={() => setShowHistoryDropdown(false)}
                                            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f4ff]'}`}>
                                                <i className={`fas ${calc.icon} text-[#3B68FC] text-sm`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium text-sm truncate ${textColor}`}>{calc.name}</p>
                                                <p className={`text-xs ${subTextColor}`}>{calc.category}</p>
                                            </div>
                                            {index === 0 && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#3B68FC]/10 text-[#3B68FC] font-medium">Latest</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    to="/history"
                                    onClick={() => setShowHistoryDropdown(false)}
                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 border-t transition-colors ${isDarkMode ? 'border-[#334155]' : 'border-[#e5e7eb]'} ${hoverBg}`}
                                >
                                    <i className={`fas fa-history text-xs ${subTextColor}`}></i>
                                    <span className={`text-sm font-medium ${subTextColor}`}>View All History</span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* User Navigation (right side) */}
                <nav className="flex items-center gap-2 shrink-0">
                    {loading ? (
                        <div className={`w-10 h-10 rounded-full animate-pulse ${isDarkMode ? 'bg-[#334155]' : 'bg-[#f8f9fa]'}`}></div>
                    ) : isAuthenticated ? (
                        <>
                            {/* User Avatar with Dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center gap-2 p-1 rounded-full transition-colors ${hoverBg}`}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md transition-transform hover:scale-105"
                                        style={{ backgroundColor: getAvatarColor() }}
                                    >
                                        {getUserInitials()}
                                    </div>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border overflow-hidden z-[300] ${dropdownBg}`}>
                                        {/* User Info Header */}
                                        <div className="p-4 bg-gradient-to-r from-[#3B68FC] to-[#6366F1]">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30"
                                                    style={{ backgroundColor: getAvatarColor() }}
                                                >
                                                    {getUserInitials()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-white truncate">{user?.name}</p>
                                                    <p className="text-sm text-white/80 truncate">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f0f4ff]'}`}>
                                                    <i className="fas fa-user text-[#3B68FC]"></i>
                                                </div>
                                                <div>
                                                    <p className={`font-medium text-sm ${textColor}`}>My Profile</p>
                                                    <p className={`text-xs ${subTextColor}`}>View and edit your profile</p>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/saved"
                                                onClick={() => setShowUserMenu(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#422006]' : 'bg-[#fef3c7]'}`}>
                                                    <i className="fas fa-bookmark text-[#F59E0B]"></i>
                                                </div>
                                                <div>
                                                    <p className={`font-medium text-sm ${textColor}`}>Saved Calculators</p>
                                                    <p className={`text-xs ${subTextColor}`}>Your favorite calculators</p>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/history"
                                                onClick={() => setShowUserMenu(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#064e3b]' : 'bg-[#d1fae5]'}`}>
                                                    <i className="fas fa-history text-[#10B981]"></i>
                                                </div>
                                                <div>
                                                    <p className={`font-medium text-sm ${textColor}`}>History</p>
                                                    <p className={`text-xs ${subTextColor}`}>Your calculation history</p>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/settings"
                                                onClick={() => setShowUserMenu(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#4c1d95]' : 'bg-[#ede9fe]'}`}>
                                                    <i className="fas fa-cog text-[#8B5CF6]"></i>
                                                </div>
                                                <div>
                                                    <p className={`font-medium text-sm ${textColor}`}>Settings</p>
                                                    <p className={`text-xs ${subTextColor}`}>Preferences & notifications</p>
                                                </div>
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${hoverBg}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-amber-500/30' : 'bg-amber-100'}`}>
                                                        <i className="fas fa-shield-halved text-amber-500"></i>
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium text-sm ${textColor}`}>Admin Dashboard</p>
                                                        <p className={`text-xs ${subTextColor}`}>Manage site & calculators</p>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>

                                        {/* Logout */}
                                        <div className={`border-t py-2 ${isDarkMode ? 'border-[#334155]' : 'border-[#e5e7eb]'}`}>
                                            <button
                                                onClick={handleLogout}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-red-900/50' : 'bg-[#fee2e2]'}`}>
                                                    <i className="fas fa-sign-out-alt text-[#EF4444]"></i>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#EF4444] text-sm">Logout</p>
                                                    <p className={`text-xs ${subTextColor}`}>Sign out of your account</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`text-sm font-medium px-3 py-2 rounded-lg ${textColor} ${hoverBg}`}>Log in</Link>
                            <Link to="/signup" className="text-sm px-4 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add]">Sign up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
