import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const categories = [
    { name: 'Concrete Technology', count: 6, icon: 'fa-cubes', color: 'text-gray-600', slug: 'concrete-technology' },
    { name: 'Quantity Estimator', count: 27, icon: 'fa-calculator', color: 'text-green-600', slug: 'quantity-estimator' },
    { name: 'Road Construction', count: 2, icon: 'fa-road', color: 'text-gray-700', slug: 'road-construction' },
    { name: 'Soil Test', count: 12, icon: 'fa-vial', color: 'text-amber-600', slug: 'soil-test' },
    { name: 'Sieve Analysis', count: 31, icon: 'fa-filter', color: 'text-blue-600', slug: 'sieve-analysis-aggregates' },
    { name: 'Blending of Aggregates', count: 31, icon: 'fa-blender', color: 'text-purple-600', slug: 'blending-aggregates' },
    { name: 'Environmental Eng.', count: 3, icon: 'fa-leaf', color: 'text-green-600', slug: 'environmental-engineering' },
];

const mostSearched = [
    { name: 'Countertop Calculator', slug: '/countertop', icon: 'fa-ruler-combined', searches: '45.2K', category: 'Quantity Estimator' },
    { name: 'Flooring Calculator', slug: '/flooring', icon: 'fa-th', searches: '42.1K', category: 'Quantity Estimator' },
    { name: 'Brick Calculator', slug: '/brick-masonry', icon: 'fa-th-large', searches: '32.1K', category: 'Quantity Estimator' },
    { name: 'Tank Volume Calculator', slug: '/tank-volume', icon: 'fa-tint', searches: '28.5K', category: 'Quantity Estimator' },
    { name: 'Concrete Block Calculator', slug: '/concrete-block', icon: 'fa-th', searches: '25.3K', category: 'Quantity Estimator' },
    { name: 'Precast Wall Calculator', slug: '/precast-boundary-wall', icon: 'fa-border-all', searches: '22.8K', category: 'Quantity Estimator' },
    { name: 'Plastering Calculator', slug: '/plastering', icon: 'fa-brush', searches: '20.1K', category: 'Quantity Estimator' },
    { name: 'Cement Concrete', slug: '/cement-concrete', icon: 'fa-cubes', searches: '18.9K', category: 'Quantity Estimator' },
];

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


export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Filter calculators based on search query
    const filteredCalculators = searchQuery.length > 0
        ? allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8)
        : [];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
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
        <main>
            <section className="relative py-16 px-6 overflow-hidden min-h-[320px]">
                <div className="absolute inset-0 -top-24 overflow-hidden pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] bg-blue-200/70 rounded-full blur-[100px] -top-20 -left-32"></div>
                    <div className="absolute w-[400px] h-[400px] bg-yellow-200/70 rounded-full blur-[100px] top-0 right-[20%]"></div>
                    <div className="absolute w-[350px] h-[350px] bg-orange-200/70 rounded-full blur-[100px] top-16 -right-20"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-[48px] leading-[1.1] mb-8 text-[#0A0A0A]">
                                <span className="font-bold">Civil Engineering</span><br />
                                <span className="text-[#3B68FC]">Calculators</span>
                            </h1>
                            <p className="text-lg text-[#6b7280] mb-6 max-w-md">Free online tools for structural analysis, concrete design, geotechnical calculations and more.</p>
                            <div className="relative max-w-[500px]" ref={searchRef}>
                                <input
                                    type="text"
                                    placeholder="Search calculators..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                        setSelectedIndex(-1);
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full h-14 px-6 pr-14 rounded-full border border-[#e5e7eb] bg-white text-base outline-none focus:border-[#3B68FC] focus:shadow-[0_4px_20px_rgba(59,104,252,0.2)] transition-all"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B68FC] text-lg hover:scale-110 transition-transform">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col gap-3 bg-gradient-to-br from-blue-600 via-[#3B68FC] to-indigo-600 p-6 rounded-2xl shadow-[0_8px_32px_rgba(59,104,252,0.3)]">
                            <i className="fas fa-building text-white text-2xl"></i>
                            <i className="fas fa-drafting-compass text-white text-2xl"></i>
                            <i className="fas fa-hard-hat text-white text-2xl"></i>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-10 rounded-t-[40px] -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-6xl mx-auto">

                    {/* SEARCH RESULTS - Show when searching */}
                    {searchQuery.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#0A0A0A]">
                                    🔍 Search Results for "{searchQuery}"
                                </h2>
                                <button
                                    onClick={() => { setSearchQuery(''); setShowResults(false); }}
                                    className="text-[#3B68FC] text-sm hover:underline flex items-center gap-1"
                                >
                                    <i className="fas fa-times"></i> Clear
                                </button>
                            </div>

                            {filteredCalculators.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredCalculators.map((calc, index) => (
                                        <Link
                                            key={calc.slug}
                                            to={calc.slug}
                                            className={`flex items-start gap-4 p-4 bg-[#f8f9fa] border-2 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all group ${index === selectedIndex ? 'border-[#3B68FC] bg-blue-50' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`}
                                        >
                                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-xl shrink-0 shadow-md">
                                                <i className={`fas ${calc.icon} text-white text-lg`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-[#0A0A0A] text-sm group-hover:text-[#3B68FC]">{calc.name}</h3>
                                                <span className="text-xs text-[#6b7280] mt-1 inline-block">{calc.category}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-[#f8f9fa] rounded-2xl">
                                    <i className="fas fa-search text-5xl text-[#e5e7eb] mb-4"></i>
                                    <p className="text-[#6b7280] text-lg">No calculators found for "{searchQuery}"</p>
                                    <p className="text-sm text-[#9ca3af] mt-2">Try different keywords</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Most Searched Calculators - Always visible, moves below search results */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#0A0A0A]">🔥 Most Searched Calculators</h2>
                            <Link to="/category/quantity-estimator" className="text-[#3B68FC] text-sm hover:underline">View all →</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mostSearched.map((calc, index) => (
                                <Link
                                    key={calc.name}
                                    to={calc.slug}
                                    className="flex items-start gap-4 p-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-lg shrink-0 shadow-md">
                                        <i className={`fas ${calc.icon} text-white`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-[#0A0A0A] text-sm group-hover:text-[#3B68FC] truncate">{calc.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-[#6b7280]">{calc.category}</span>
                                            <span className="text-xs text-[#9ca3af]">•</span>
                                            <span className="text-xs text-[#3B68FC] font-medium">{calc.searches}</span>
                                        </div>
                                    </div>
                                    {index < 3 && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'}`}>
                                            #{index + 1}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {categories.map((cat) => (
                            <Link key={cat.name} to={`/category/${cat.slug}`} className="flex flex-col items-center p-6 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl text-center hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all">
                                <i className={`fas ${cat.icon} text-2xl ${cat.color} mb-3`}></i>
                                <span className="font-medium text-[#0A0A0A] text-sm">{cat.name}</span>
                                <span className="text-xs text-[#6b7280] mt-1">{cat.count} calculators</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile App Promotion - Light Theme */}
                    <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-100/80 via-yellow-100/60 to-orange-100/70 p-8 md:p-12 border border-[#e5e7eb]">
                        {/* Background decorations */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-[100px] opacity-50"></div>
                        <div className="absolute top-0 right-[30%] w-48 h-48 bg-yellow-200 rounded-full blur-[80px] opacity-60"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-200 rounded-full blur-[80px] opacity-50"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                            {/* Left Content */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-[#e5e7eb] rounded-full mb-6 shadow-sm">
                                    <i className="fab fa-android text-green-500 text-lg"></i>
                                    <span className="text-[#0A0A0A] text-sm font-medium">Available on Android</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">
                                    Construction Calculators
                                    <span className="block text-[#3B68FC] mt-1">Mobile App</span>
                                </h2>

                                <p className="text-[#6b7280] mb-6 max-w-md">
                                    All your favorite calculators in your pocket! Estimate Cement, Concrete, Bricks, Blocks, Paint, Steel, Flooring, and more on the go.
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-[#e5e7eb] rounded-lg text-[#0A0A0A] text-sm shadow-sm">
                                        <i className="fas fa-calculator text-[#3B68FC]"></i> 25+ Calculators
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-[#e5e7eb] rounded-lg text-[#0A0A0A] text-sm shadow-sm">
                                        <i className="fas fa-wifi-slash text-green-500"></i> Works Offline
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-[#e5e7eb] rounded-lg text-[#0A0A0A] text-sm shadow-sm">
                                        <i className="fas fa-star text-yellow-500"></i> 4.5 Rating
                                    </span>
                                </div>

                                {/* Play Store Button */}
                                <a
                                    href="http://diet.vc/a_acqe"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-[#0A0A0A] text-white rounded-xl hover:bg-[#1a1a1a] transition-all hover:shadow-lg hover:-translate-y-1 group"
                                >
                                    <i className="fab fa-google-play text-2xl"></i>
                                    <div className="text-left">
                                        <span className="block text-xs text-gray-400 leading-tight">GET IT ON</span>
                                        <span className="block text-lg font-semibold leading-tight">Google Play</span>
                                    </div>
                                </a>
                            </div>

                            {/* Right - Phone Mockup */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-24 h-40 md:w-28 md:h-48 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-2xl flex flex-col items-center justify-center p-3 shadow-xl">
                                    <i className="fas fa-th text-white text-xl mb-2"></i>
                                    <i className="fas fa-drafting-compass text-white text-xl mb-2"></i>
                                    <i className="fas fa-hard-hat text-white text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


