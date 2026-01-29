import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// All calculators for search
const allCalculators = [
    { name: 'Construction Cost Calculator', slug: '/construction-cost', icon: 'fa-rupee-sign', category: 'Quantity Estimator' },
    { name: 'Carpet Area Calculator', slug: '/carpet-area', icon: 'fa-vector-square', category: 'Quantity Estimator' },
    { name: 'Cement Concrete Calculator', slug: '/cement-concrete', icon: 'fa-cubes', category: 'Quantity Estimator' },
    { name: 'Plastering Calculator', slug: '/plastering', icon: 'fa-brush', category: 'Quantity Estimator' },
    { name: 'Brick Calculator', slug: '/brick-masonry', icon: 'fa-th-large', category: 'Quantity Estimator' },
    { name: 'Concrete Block Calculator', slug: '/concrete-block', icon: 'fa-th', category: 'Quantity Estimator' },
    { name: 'Flooring Calculator', slug: '/flooring', icon: 'fa-border-bottom', category: 'Quantity Estimator' },
    { name: 'Countertop Calculator', slug: '/countertop', icon: 'fa-ruler-combined', category: 'Quantity Estimator' },
    { name: 'Tank Volume Calculator', slug: '/tank-volume', icon: 'fa-tint', category: 'Quantity Estimator' },
    { name: 'Solar Rooftop Calculator', slug: '/solar-rooftop', icon: 'fa-solar-panel', category: 'Quantity Estimator' },
    { name: 'Paint Work Calculator', slug: '/paint-work', icon: 'fa-paint-roller', category: 'Quantity Estimator' },
    { name: 'Excavation Calculator', slug: '/excavation', icon: 'fa-truck-loading', category: 'Quantity Estimator' },
    { name: 'Steel Weight Calculator', slug: '/steel-weight', icon: 'fa-weight-hanging', category: 'Quantity Estimator' },
    { name: 'Sieve Analysis of Aggregates', slug: '/sieve-analysis', icon: 'fa-filter', category: 'Concrete Technology' },
    { name: 'Blending of Aggregates', slug: '/blending-aggregates', icon: 'fa-blender', category: 'Concrete Technology' },
    { name: 'Aggregate Impact Value', slug: '/aggregate-impact-value', icon: 'fa-hammer', category: 'Concrete Technology' },
    { name: 'Bitumen Prime Coat', slug: '/bitumen-prime-coat', icon: 'fa-fill-drip', category: 'Road Construction' },
    { name: 'Bitumen Tack Coat', slug: '/bitumen-tack-coat', icon: 'fa-brush', category: 'Road Construction' },
    { name: 'Water Content Determination', slug: '/water-content', icon: 'fa-tint', category: 'Soil Test' },
    { name: 'Specific Gravity', slug: '/specific-gravity', icon: 'fa-balance-scale-right', category: 'Soil Test' },
    { name: 'CBR Test', slug: '/cbr-test', icon: 'fa-road', category: 'Soil Test' },
    { name: 'COD Calculator', slug: '/cod-calculator', icon: 'fa-flask', category: 'Environmental' },
    { name: 'BOD Calculator', slug: '/bod-calculator', icon: 'fa-vial', category: 'Environmental' },
];

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const filteredCalculators = searchQuery.length > 0
        ? allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
        : [];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
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

    return (
        <header className="sticky top-0 z-[100] h-16 bg-white border-b border-[#e5e7eb]">
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 text-lg hover:opacity-80 transition-opacity shrink-0">
                    <i className="fas fa-hard-hat text-2xl text-[#3B68FC]"></i>
                    <span className="text-[#0A0A0A] hidden sm:inline font-bold">Construction Calculators</span>
                </Link>
                <div className="flex-1 max-w-md relative" ref={searchRef}>
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"></i>
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
                            className="w-full h-10 pl-10 pr-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-full text-sm outline-none focus:border-[#3B68FC] focus:bg-white transition-all"
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && filteredCalculators.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-[#e5e7eb] overflow-hidden z-[200]">
                            {filteredCalculators.map((calc, index) => (
                                <Link
                                    key={calc.slug}
                                    to={calc.slug}
                                    onClick={() => { setShowResults(false); setSearchQuery(''); }}
                                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8f9fa] transition-colors ${index === selectedIndex ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="w-8 h-8 bg-[#f0f4ff] rounded-lg flex items-center justify-center shrink-0">
                                        <i className={`fas ${calc.icon} text-[#3B68FC] text-sm`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#0A0A0A] text-sm truncate">{calc.name}</p>
                                        <p className="text-xs text-[#6b7280]">{calc.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {showResults && searchQuery.length > 0 && filteredCalculators.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-[#e5e7eb] p-4 text-center z-[200]">
                            <p className="text-[#6b7280] text-sm">No results for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
                <nav className="flex items-center gap-3 shrink-0">
                    <Link to="/coming-soon" className="text-sm font-medium text-[#0A0A0A] px-3 py-2 rounded-lg hover:bg-[#f8f9fa]">Log in</Link>
                    <Link to="/coming-soon" className="text-sm px-4 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add]">Sign up</Link>
                </nav>
            </div>
        </header>
    );
}

