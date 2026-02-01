import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// MORTH Table 500-21: Quantities of Materials for 10 sqm
// Converted to per sqm
const SURFACE_DRESSING_DATA = {
    '19 mm': { binder: 1.2, chips: 0.015, desc: 'Nominal Size: 19 mm' },
    '13 mm': { binder: 1.0, chips: 0.010, desc: 'Nominal Size: 13 mm' },
    '10 mm': { binder: 0.9, chips: 0.009, desc: 'Nominal Size: 10 mm' },
    '6 mm': { binder: 0.75, chips: 0.0075, desc: 'Nominal Size: 6 mm' }
};

export default function SurfaceDressingCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [size, setSize] = useState('19 mm');
    const [area, setArea] = useState('');
    const [results, setResults] = useState({ binder: 0, chips: 0 });
    const sidebarRef = useRef(null);

    const sizeOptions = Object.keys(SURFACE_DRESSING_DATA).map(s => ({ value: s, label: s }));

    useEffect(() => {
        const a = parseFloat(area);
        if (!isNaN(a) && a > 0) {
            const data = SURFACE_DRESSING_DATA[size];
            setResults({
                binder: (data.binder * a).toFixed(2),
                chips: (data.chips * a).toFixed(3)
            });
        } else {
            setResults({ binder: 0, chips: 0 });
        }
    }, [size, area]);

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

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory={isBlending ? 'blending-aggregates' : 'sieve-analysis-aggregates'} />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Surface Dressing Calculator</h1>
                            <p className="text-[#6b7280]">Binder and Chip Application Rates (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="surface-dressing"
                            calculatorName="Surface Dressing Calculator"
                            calculatorIcon="fa-spray-can"
                            category="Sieve Analysis"
                            inputs={{ size, area }}
                            outputs={results}
                        />
                    </div>

                    {/* Calculator Card */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            {/* Header */}
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-calculator text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Material Estimator</h3>
                                        <p className="text-white/80 text-xs">Based on MORTH Table 500-21</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Aggregate Size</label>
                                            <CustomDropdown
                                                options={sizeOptions}
                                                value={size}
                                                onChange={setSize}
                                                theme={theme}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Surface Area (sq.m)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={area}
                                                    onChange={(e) => setArea(e.target.value)}
                                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 ${theme.focus} outline-none transition-all`}
                                                    placeholder="Enter area..."
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m²</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                            <span className="text-gray-600 text-sm font-medium">Bitumen Required</span>
                                            <div className="text-right">
                                                <span className={`text-2xl font-bold ${theme.text}`}>{results.binder}</span>
                                                <span className="text-gray-500 text-xs ml-1">kg</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm font-medium">Chips Required</span>
                                            <div className="text-right">
                                                <span className={`text-2xl font-bold ${theme.text}`}>{results.chips}</span>
                                                <span className="text-gray-500 text-xs ml-1">cum</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
                                    <i className="fas fa-info-circle mt-0.5"></i>
                                    <p>Rates are approximate based on MORTH specifications. Actual rates may vary depending on surface texture and binder type.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Content */}
                    <div className="space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Theory</h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Surface Dressing involves the application of a bituminous binder followed immediately by spreading uniform, single-sized cover aggregates, which are then rolled. It serves to seal the road surface, check oxidation, and improve skid resistance. It is not a structural layer but a surface treatment.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Success depends on achieving the correct rate of spread for both binder and chippings. The rate is determined based on the Average Least Dimension (ALD) of the chippings. MORTH defines recommended nominal sizes for aggregates (e.g., 19mm, 13mm, 10mm, 6mm) depending on the traffic and surface hardness.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Bitumen Sprayer:</strong> Calibrated pressure distributor.</li>
                                <li><strong>Chip Spreader:</strong> Mechanical spreader for uniform application.</li>
                                <li><strong>Roller:</strong> Pneumatic tired roller is preferred.</li>
                                <li><strong>Sieves and Flakiness Gauge:</strong> To determine gradation and shape factors (ALD) of chips.</li>
                                <li><strong>Tray Test:</strong> To check transverse distribution of binder.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Construction Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Preparation:</strong> Clean the existing surface thoroughly with brooms and compressed air.</li>
                                <li><strong>Binder Application:</strong> Spray the bituminous binder (bitumen or emulsion) at the specified temperature and rate.</li>
                                <li><strong>Chipping:</strong> Spread the cover aggregates immediately after spraying using a mechanical spreader. The chips must be clean and dry (for hot bitumen).</li>
                                <li><strong>Rolling:</strong> Roll the surface immediately to embed the chips into the binder.</li>
                                <li><strong>Sweeping:</strong> Remove loose aggregates after the binder has set.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-spray-can text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">Surface Dressing</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-xs text-[#6b7280] mt-2">
                                Surface treatment analysis and application rates.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
