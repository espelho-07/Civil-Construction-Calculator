import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { QUANTITY_ESTIMATOR_NAV } from '../constants/calculatorRoutes';

export default function CarpetAreaCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Feet');
    const [builtUpArea, setBuiltUpArea] = useState(1200);
    const [loading, setLoading] = useState(10);

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const bua = unit === 'Feet' ? builtUpArea : builtUpArea * 10.7639;
        const carpetFactor = 0.70; // 70% of built-up area
        const superFactor = 1.25; // 125% of built-up area

        const carpetArea = bua * carpetFactor;
        const superBuiltUp = bua * superFactor;

        setResults({
            carpetArea: carpetArea.toFixed(2),
            builtUpArea: bua.toFixed(2),
            superBuiltUp: superBuiltUp.toFixed(2),
            loadingPercent: ((superBuiltUp - bua) / bua * 100).toFixed(1),
            carpetM: (carpetArea / 10.7639).toFixed(2),
            buaM: (bua / 10.7639).toFixed(2),
            sbaM: (superBuiltUp / 10.7639).toFixed(2),
        });
    };

    useEffect(() => {
        calculate();
    }, [builtUpArea, loading, unit]);

    useEffect(() => {
        const update = () => {
            if (sidebarRef.current) {
                const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight;
                sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px';
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const relatedCalculators = [
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Countertop Calculator', icon: 'fa-ruler-combined', slug: '/countertop' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Carpet Area Calculator</h1>
                            <p className="text-[#6b7280]">Understand and calculate different types of property areas</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="carpet-area"
                            calculatorName="Carpet Area Calculator"
                            calculatorIcon="fa-vector-square"
                            category="Quantity Estimator"
                            inputs={{ unit, builtUpArea, loading }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* What is Carpet Area */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Carpet area?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                Carpet area is The actual usable floor area of an apartment, or the area covered by the carpet. It includes bedrooms, living room, kitchen, bathroom, study and toilets but excludes the external and internal walls, balcony, terrace. Under RERA, carpet area includes usable space within the outer walls.
                            </p>

                            {/* Diagram */}
                            <div className="bg-[#f8f9fa] p-6 rounded-xl mb-4">
                                <div className="text-center mb-4 text-sm text-gray-600">
                                    <i className={`fas fa-hand-pointer ${theme.text} mr-2`}></i>
                                    On this image, following areas are considered in <span className={`font-bold ${theme.text}`}>Carpet area</span>
                                </div>
                                <div className="flex justify-center">
                                    <div className="border-4 border-gray-300 p-8 relative bg-white" style={{ width: '280px' }}>
                                        <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                            <div className="bg-blue-100 p-4 rounded">Bedroom 1</div>
                                            <div className="bg-green-100 p-4 rounded">Kitchen</div>
                                            <div className="bg-purple-100 p-4 rounded">Bathroom</div>
                                            <div className="bg-yellow-100 p-4 rounded col-span-2">Living Room</div>
                                            <div className="bg-pink-100 p-4 rounded">WC</div>
                                            <div className="bg-orange-100 p-4 rounded col-span-2">Bedroom 2</div>
                                            <div className="bg-gray-200 p-4 rounded">Balcony</div>
                                        </div>
                                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 ${theme.bg} text-white px-4 py-1 rounded text-sm font-bold`}>
                                            CARPET AREA
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <div className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                        <i className="fas fa-check-circle"></i>
                                        What carpet area cover?
                                    </div>
                                    <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
                                        <li>Living room, Bedroom, Kitchen</li>
                                        <li>Verandah (opened space at front of home)</li>
                                        <li>bathroom and toilet</li>
                                        <li>internal corridor</li>
                                        <li>Store room and store (if they are include)</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <div className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                        <i className="fas fa-times-circle"></i>
                                        What carpet area does not cover?
                                    </div>
                                    <ul className="text-sm text-red-700 space-y-1 list-disc pl-5">
                                        <li>External walls</li>
                                        <li>internal walls</li>
                                        <li>Balcony or terrace</li>
                                        <li>Service shaft</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 bg-[#f8f9fa] p-4 rounded-lg">
                                <div className="font-semibold mb-2">How to calculate carpet area?</div>
                                <code className={`text-sm ${theme.text}`}>
                                    Carpet area = Sum of the area (Bedroom + Livingroom + Bathroom + Toilets) × 70 to 80 Increase of the Built up area.
                                </code>
                            </div>
                        </div>
                    </section>

                    {/* What is Built-up Area */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-building ${theme.text}`}></i>
                            What is Built-up area?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                Built-up area as the Total area measured on the outer line of your apartment. It includes carpet area, area of walls, ducts, exclusive balcony. It specifically excludes common area such as lifts, stairs, lobbies, play area, common corridor, etc.
                            </p>

                            {/* Diagram */}
                            <div className="bg-[#f8f9fa] p-6 rounded-xl mb-4">
                                <div className="flex justify-center">
                                    <div className="border-8 border-gray-400 p-6 relative bg-white" style={{ width: '280px' }}>
                                        <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                            <div className="bg-blue-100 p-3 rounded border border-gray-300">Bedroom</div>
                                            <div className="bg-green-100 p-3 rounded border border-gray-300">Kitchen</div>
                                            <div className="bg-purple-100 p-3 rounded border border-gray-300">Bath</div>
                                            <div className="bg-yellow-100 p-3 rounded col-span-2 border border-gray-300">Living</div>
                                            <div className="bg-orange-100 p-3 rounded border border-gray-300">Balcony</div>
                                        </div>
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-600 text-white px-4 py-1 rounded text-sm font-bold">
                                            BUILT UP AREA
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <div className="font-bold text-green-800 mb-2">What Built-up area cover?</div>
                                    <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
                                        <li>Carpet area</li>
                                        <li>Area of inner walls + walls (if any)</li>
                                        <li>Balcony + Flower beds (if any)</li>
                                        <li>Area of exterior walls</li>
                                    </ul>
                                </div>
                                <div className={`${theme.bgLight} border ${theme.border} p-4 rounded-lg`}>
                                    <div className={`font-bold ${theme.text} mb-2`}>How to calculate Built-up area?</div>
                                    <code className={`text-sm ${theme.text}`}>
                                        Built-up Area = Carpet Area + Area of walls + 10% to 18% the Area of balcony
                                    </code>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Super Built-up Area */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-city ${theme.text}`}></i>
                            What is Super Built-up area?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                Super Built-up area is your built-up area plus your proportionate share in the common area. Common areas such as lobby, staircase, lift area, clubhouse, gym, swimming pool, garden etc. The super built-up area is also called <strong>'saleable area'</strong>. In the case of RERA, common areas include lift shaft, lobby, corridor, staircase, common entrances and exits of buildings, common basement and terrace.
                            </p>

                            {/* Diagram */}
                            <div className="bg-[#f8f9fa] p-6 rounded-xl mb-4">
                                <div className="flex justify-center">
                                    <div className={`border-8 ${theme.border} p-4 relative ${theme.bgLight}`} style={{ width: '320px' }}>
                                        <div className="grid grid-cols-4 gap-1 text-xs text-center mb-2">
                                            <div className="bg-gray-300 p-2 rounded text-xs">CORRIDOR</div>
                                            <div className="bg-gray-300 p-2 rounded text-xs">LIFT</div>
                                            <div className="bg-gray-300 p-2 rounded text-xs">STAIRS</div>
                                            <div className="bg-gray-300 p-2 rounded text-xs">LOBBY</div>
                                        </div>
                                        <div className="border-4 border-gray-400 p-4 bg-white">
                                            <div className="grid grid-cols-3 gap-1 text-xs text-center">
                                                <div className="bg-green-100 p-2 rounded">Bed</div>
                                                <div className="bg-emerald-100 p-2 rounded">Kit</div>
                                                <div className="bg-teal-100 p-2 rounded">WC</div>
                                            </div>
                                        </div>
                                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 ${theme.bg} text-white px-4 py-1 rounded text-sm font-bold`}>
                                            SUPER BUILT UP AREA
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <div className="font-bold text-green-800 mb-2">What super Built-up area contains</div>
                                    <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
                                        <li>Built-up area of the flat</li>
                                        <li>proportionate area of the common areas</li>
                                        <li>like lift, stairs, lobby, common bathroom, corridors, etc.</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <div className="font-bold text-red-800 mb-2">What it does not contains</div>
                                    <ul className="text-sm text-red-700 space-y-1 list-disc pl-5">
                                        <li>Open areas</li>
                                        <li>Swimming pool</li>
                                        <li>tennis court, rooftop terrace</li>
                                        <li>Any external infrastructure</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 bg-[#f8f9fa] p-4 rounded-lg">
                                <div className="font-semibold mb-2">How do we calculate built-up area?</div>
                                <code className={`text-sm ${theme.text}`}>
                                    Super Built-up Area = Built-up Area × (1.0 + Loading % or 25 to 30% the area of staircase, etc.)
                                </code>
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-th-large ${theme.text}`}></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className={`bg-white border rounded-lg p-4 hover:shadow-lg ${theme.border} ${theme.hover.replace('bg-', 'border-')} transition-all group`}>
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} ${theme.text} group-hover:scale-110 transition-transform`}></i>
                                        <span className={`text-sm font-medium text-[#0A0A0A] group-hover:${theme.text}`}>{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Inline Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Calculator Widget (Sidebar) */}
                <aside ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="green" />

                    <div className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} flex items-center gap-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <i className="fas fa-vector-square text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Carpet Area Calculator</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden">
                                    <button onClick={() => setUnit('Feet')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Feet' ? `${theme.button}` : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Sq. Feet</button>
                                    <button onClick={() => setUnit('Meter')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Meter' ? `${theme.button}` : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Sq. Meter</button>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Area (Builtup)</label>
                                <div className="relative">
                                    <input type="number" value={builtUpArea} onChange={(e) => setBuiltUpArea(Number(e.target.value))} className={`w-full px-3 py-2 pr-16 border rounded-lg text-sm ${theme.border} ${theme.focus}`} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Feet' ? 'sq.ft' : 'sq.m'}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Loading % (for Super Built-up)</label>
                                <input type="number" value={loading} onChange={(e) => setLoading(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} ${theme.border}`} />
                            </div>

                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium transition-colors`}>Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="space-y-3">
                                <div className={`${theme.bgLight} border ${theme.border} rounded-xl p-4 text-center`}>
                                    <div className={`text-xs ${theme.text} mb-1`}>Carpet Area (70% of Built-up)</div>
                                    <div className={`text-2xl font-bold ${theme.text}`}>{results?.carpetArea} sq.ft</div>
                                    <div className={`text-xs ${theme.text}`}>{results?.carpetM} sq.m</div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                    <div className="text-xs text-gray-700 mb-1">Built-up Area</div>
                                    <div className="text-2xl font-bold text-gray-600">{results?.builtUpArea} sq.ft</div>
                                    <div className="text-xs text-gray-600">{results?.buaM} sq.m</div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                                    <div className="text-xs text-blue-700 mb-1">Super Built-up Area (125%)</div>
                                    <div className="text-2xl font-bold text-blue-600">{results?.superBuiltUp} sq.ft</div>
                                    <div className="text-xs text-blue-600">{results?.sbaM} sq.m</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Quick Nav */}
                    <CategoryQuickNav
                        items={QUANTITY_ESTIMATOR_NAV}
                        title="Quantity Estimator Calculators"
                        themeName="green"
                    />

                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
