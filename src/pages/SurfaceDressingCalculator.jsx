import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';

// MORTH Table 500-21: Quantities of Materials for 10 sqm
// Converted to per sqm
// MORTH Table 500-21: Quantities of Materials for 10 sqm
// Converted to per sqm
const SURFACE_DRESSING_DATA = {
    '19 mm': {
        binder: 1.2,
        chips: 0.015,
        desc: 'Nominal Size: 19 mm',
        sieves: [
            { size: '26.5 mm', min: 100, max: 100 },
            { size: '19 mm', min: 85, max: 100 },
            { size: '13.2 mm', min: 0, max: 20 },
            { size: '9.5 mm', min: 0, max: 5 }
        ]
    },
    '13 mm': {
        binder: 1.0,
        chips: 0.010,
        desc: 'Nominal Size: 13 mm',
        sieves: [
            { size: '19 mm', min: 100, max: 100 },
            { size: '13.2 mm', min: 85, max: 100 },
            { size: '9.5 mm', min: 0, max: 20 },
            { size: '4.75 mm', min: 0, max: 5 }
        ]
    },
    '10 mm': {
        binder: 0.9,
        chips: 0.009,
        desc: 'Nominal Size: 10 mm',
        sieves: [
            { size: '13.2 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 85, max: 100 },
            { size: '4.75 mm', min: 0, max: 20 },
            { size: '2.36 mm', min: 0, max: 5 }
        ]
    },
    '6 mm': {
        binder: 0.75,
        chips: 0.0075,
        desc: 'Nominal Size: 6 mm',
        sieves: [
            { size: '9.5 mm', min: 100, max: 100 },
            { size: '6.3 mm', min: 85, max: 100 },
            { size: '2.36 mm', min: 0, max: 20 },
            { size: '1.18 mm', min: 0, max: 5 }
        ]
    }
};

export default function SurfaceDressingCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');

    // Extract size from URL
    const getSizeFromURL = () => {
        if (location.pathname.includes('sd-19mm')) return '19 mm';
        if (location.pathname.includes('sd-13mm')) return '13 mm';
        if (location.pathname.includes('sd-10mm')) return '10 mm';
        if (location.pathname.includes('sd-6mm')) return '6 mm';
        return '19 mm';
    };

    const [size, setSize] = useState(getSizeFromURL());
    const [area, setArea] = useState('');
    const [qtyResults, setQtyResults] = useState({ binder: 0, chips: 0 });

    // Grading States
    const [sieveInputs, setSieveInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [gradingResults, setGradingResults] = useState({});

    const currentData = SURFACE_DRESSING_DATA[size];
    const sidebarRef = useRef(null);

    const sizeOptions = Object.keys(SURFACE_DRESSING_DATA).map(s => ({ value: s, label: s }));

    // Update size when URL changes
    useEffect(() => {
        const newSize = getSizeFromURL();
        if (newSize !== size) {
            setSize(newSize);
            setSieveInputs({});
            setGradingResults({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Handle size change - navigate to correct URL
    const handleSizeChange = (newSize) => {
        const sizeMap = { '19 mm': '19mm', '13 mm': '13mm', '10 mm': '10mm', '6 mm': '6mm' };
        const basePath = isBlending ? '/blending-aggregates' : '/sieve-analysis';
        navigate(`${basePath}/sd-${sizeMap[newSize]}`);
    };

    // Back to category
    // Quantity Calculation
    useEffect(() => {
        const a = parseFloat(area);
        if (!isNaN(a) && a > 0) {
            setQtyResults({
                binder: (currentData.binder * a).toFixed(2),
                chips: (currentData.chips * a).toFixed(3)
            });
        } else {
            setQtyResults({ binder: 0, chips: 0 });
        }
    }, [size, area, currentData]);

    // Grading Calculation
    const handleSieveInputChange = (sieveSize, value) => {
        setSieveInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const totalWeight = parseFloat(sampleWeight);
        if (!totalWeight || totalWeight <= 0 || isNaN(totalWeight) || !isFinite(totalWeight)) {
            setGradingResults({});
            return;
        }

        const newResults = {};
        let cumRetainedWeight = 0;

        currentData.sieves.forEach(sieve => {
            const retained = Math.max(0, parseFloat(sieveInputs[sieve.size] || 0) || 0);
            if (isNaN(retained) || !isFinite(retained)) {
                newResults[sieve.size] = {
                    retained: 0,
                    percentRetained: '0.00',
                    cumPercentRetained: '0.00',
                    percentPassing: '100.00',
                    status: 'Fail'
                };
                return;
            }

            cumRetainedWeight += retained;

            const percentRetained = totalWeight > 0 ? (retained / totalWeight) * 100 : 0;
            const cumPercentRetained = totalWeight > 0 ? (cumRetainedWeight / totalWeight) * 100 : 0;
            const percentPassing = Math.max(0, Math.min(100, 100 - cumPercentRetained));

            let status = 'Fail';
            if (percentPassing >= sieve.min && percentPassing <= sieve.max) {
                status = 'Pass';
            }

            newResults[sieve.size] = {
                retained,
                percentRetained: percentRetained.toFixed(2),
                cumPercentRetained: cumPercentRetained.toFixed(2),
                percentPassing: percentPassing.toFixed(2),
                status
            };
        });
        setGradingResults(newResults);
    }, [sieveInputs, size, sampleWeight, currentData]);

    const reset = () => {
        setArea('');
        setQtyResults({ binder: 0, chips: 0 });
        setSieveInputs({});
        setSampleWeight('');
        setGradingResults({});
    };

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

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                {/* Main Content */}
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">Surface Dressing Calculator</h1>
                            <p className="text-[#6b7280]">Binder Rate & Grading Analysis (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="surface-dressing"
                            calculatorName="Surface Dressing Calculator"
                            calculatorIcon="fa-spray-can"
                            category={isBlending ? "Blending of Aggregates" : "Sieve Analysis"}
                            inputs={{ size, area, sieveInputs }}
                            outputs={{ qtyResults, gradingResults }}
                        />
                    </div>

                    {/* Top Ad Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center text-blue-600 mb-6">
                        <div className="flex items-center justify-center gap-2">
                            <i className="fas fa-ad"></i>
                            <span className="text-sm font-medium">Advertisement</span>
                        </div>
                        <p className="text-xs text-blue-400 mt-1">Your Ad Here - Support our free calculators</p>
                    </div>

                    {/* Quantity Calculator Section */}
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
                                                onChange={handleSizeChange}
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
                                                <span className={`text-2xl font-bold ${theme.text}`}>{qtyResults.binder}</span>
                                                <span className="text-gray-500 text-xs ml-1">kg</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm font-medium">Chips Required</span>
                                            <div className="text-right">
                                                <span className={`text-2xl font-bold ${theme.text}`}>{qtyResults.chips}</span>
                                                <span className="text-gray-500 text-xs ml-1">cum</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
                                    <i className="fas fa-info-circle mt-0.5"></i>
                                    <p>Rates are approximate based on MORTH specifications for pre-coated chips.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Grading Analysis Section */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-filter text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Grading Analysis</h3>
                                        <p className="text-white/80 text-xs">For {size} Chips</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {/* Sample Weight Input */}
                                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <i className="fas fa-balance-scale text-blue-500"></i>
                                        Total Sample Weight (g):
                                    </label>
                                    <input
                                        type="number"
                                        value={sampleWeight}
                                        onChange={(e) => setSampleWeight(e.target.value)}
                                        className={`w-32 px-3 py-1.5 border border-blue-300 rounded text-center outline-none ${theme.focus} focus:ring-2 bg-white`}
                                        placeholder="e.g. 5000"
                                    />
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                                <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-800">IS Sieve</th>
                                                <th className="border border-blue-200 px-4 py-3 text-center w-32 font-semibold text-blue-800">Weight Retained (g)</th>
                                                <th className="border border-blue-200 px-4 py-3 text-center bg-gray-50 font-semibold">% Retained</th>
                                                <th className="border border-blue-200 px-4 py-3 text-center bg-gray-50 font-semibold">Cum. % Retained</th>
                                                <th className="border border-blue-200 px-4 py-3 text-center font-bold bg-blue-100 text-blue-800">% Passing</th>
                                                <th className="border border-blue-200 px-4 py-3 text-center text-gray-600 font-semibold">Limits</th>
                                                <th className="border border-blue-200 px-4 py-3 text-center font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.sieves.map((sieve, idx) => {
                                                const res = gradingResults[sieve.size];

                                                return (
                                                    <tr key={idx}>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <i className="fas fa-circle text-blue-400 text-xs"></i>
                                                                {sieve.size}
                                                            </div>
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-2 py-1">
                                                            <input
                                                                type="number"
                                                                value={sieveInputs[sieve.size] || ''}
                                                                onChange={(e) => handleSieveInputChange(sieve.size, e.target.value)}
                                                                className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center outline-none ${theme.focus} focus:ring-2`}
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center text-gray-600 bg-gray-50">
                                                            {res ? res.percentRetained : '-'}
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center text-gray-600 bg-gray-50">
                                                            {res ? res.cumPercentRetained : '-'}
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center font-bold text-blue-700 bg-blue-50">
                                                            {res ? res.percentPassing : '-'}
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center text-xs text-gray-500">
                                                            {sieve.min} - {sieve.max}
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center">
                                                            {res && (
                                                                <>
                                                                    {res.status === 'Pass' && <span className="text-green-600 font-bold"><i className="fas fa-check mr-1"></i>Pass</span>}
                                                                    {res.status === 'Fail' && <span className="text-red-500 font-bold"><i className="fas fa-times mr-1"></i>Fail</span>}
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={reset}
                                        className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                                    >
                                        <i className="fas fa-redo mr-1"></i> Reset All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mid-Content Ad */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <i className="fas fa-ad text-2xl"></i>
                        </div>
                        <p className="text-sm font-medium">Advertisement</p>
                        <p className="text-xs text-gray-400">Premium Ad Space Available</p>
                    </div>

                    {/* Technical Content */}
                    <div className="space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Theory</h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Surface Dressing involves the application of a bituminous binder followed immediately by spreading uniform, single-sized cover aggregates, which are then rolled. It serves to seal the road surface, check oxidation, and improve skid resistance. It is not a structural layer but a surface treatment.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Success depends on achieving the correct rate of spread for both binder and chippings, and ensuring the chippings meet the grading requirements (MORTH Table 500-24) to ensure single-sized specification.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> As per nominal size (e.g. 26.5mm, 19mm, 13.2mm, 9.5mm, 4.75mm, 2.36mm, 1.18mm).</li>
                                <li><strong>Bitumen Sprayer:</strong> Calibrated pressure distributor.</li>
                                <li><strong>Chip Spreader:</strong> Mechanical spreader for uniform application.</li>
                                <li><strong>Balance:</strong> For gradation check.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Construction and Testing</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Gradation Check:</strong> Perform sieve analysis to ensure aggregates are single-sized and within limits.</li>
                                <li><strong>Flakiness Index:</strong> Determine FI of chips (Max 25%).</li>
                                <li><strong>Binder Application:</strong> Spray binder at specified rate.</li>
                                <li><strong>Chipping:</strong> Spread aggregates immediately.</li>
                            </ol>
                        </div>
                    </div>

                    {/* Bottom Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mt-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar />

                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
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
                                Surface treatment analysis, binder rates, and chip grading.
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-6">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
