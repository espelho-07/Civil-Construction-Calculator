import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import { SIEVE_ANALYSIS_NAV, BLENDING_NAV } from '../constants/calculatorRoutes';
import GlobalSearch from '../components/GlobalSearch';

// WMM Grading Data (MORTH Table 400-11) with Pan
const WMM_DATA = {
    title: 'WMM Grading',
    desc: 'Grading requirements for Wet Mix Macadam (WMM) as per MORTH Table 400-11.',
    sieves: [
        { size: '53.00 mm', min: 100, max: 100 },
        { size: '45.00 mm', min: 95, max: 100 },
        { size: '22.40 mm', min: 60, max: 80 },
        { size: '11.20 mm', min: 40, max: 60 },
        { size: '4.75 mm', min: 25, max: 40 },
        { size: '2.36 mm', min: 15, max: 30 },
        { size: '0.600 mm', min: 8, max: 22 },
        { size: '0.075 mm', min: 0, max: 8 },
        { size: 'Pan', min: 0, max: 0 }
    ]
};

export default function WMMCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});
    const sidebarRef = useRef(null);
    const handleBack = () => {
        navigate(isBlending ? '/category/blending-aggregates' : '/category/sieve-analysis-aggregates');
    };

    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const totalWeight = parseFloat(sampleWeight);
        if (!totalWeight || totalWeight <= 0 || isNaN(totalWeight) || !isFinite(totalWeight)) {
            setResults({});
            return;
        }

        const newResults = {};
        let cumRetainedWeight = 0;

        WMM_DATA.sieves.forEach(sieve => {
            const retained = Math.max(0, parseFloat(inputs[sieve.size] || 0) || 0);
            if (isNaN(retained) || !isFinite(retained)) {
                newResults[sieve.size] = {
                    retained: 0,
                    percentRetained: '0.00',
                    cumPercentRetained: '0.00',
                    percentPassing: '100.00',
                    status: sieve.size === 'Pan' ? '-' : 'Fail'
                };
                return;
            }

            cumRetainedWeight += retained;

            const percentRetained = totalWeight > 0 ? (retained / totalWeight) * 100 : 0;
            const cumPercentRetained = totalWeight > 0 ? (cumRetainedWeight / totalWeight) * 100 : 0;
            const percentPassing = Math.max(0, Math.min(100, 100 - cumPercentRetained));

            let status = 'Fail';
            if (sieve.size === 'Pan') {
                status = '-';
            } else if (percentPassing >= sieve.min && percentPassing <= sieve.max) {
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
        setResults(newResults);
    }, [inputs, sampleWeight]);

    const reset = () => {
        setInputs({});
        setSampleWeight('');
        setResults({});
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

    // Use imported nav based on context
    const navItems = isBlending ? BLENDING_NAV : SIEVE_ANALYSIS_NAV;

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory={isBlending ? 'blending-aggregates' : 'sieve-analysis-aggregates'} />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm"
                            >
                                <i className="fas fa-arrow-left"></i>
                                <span>Back</span>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">Wet Mix Macadam (WMM) Calculator</h1>
                                <p className="text-[#6b7280]">Grading Analysis for Wet Mix Macadam (MORTH Table 400-11)</p>
                            </div>
                        </div>
                        <CalculatorActions
                            calculatorSlug="wmm-grading"
                            calculatorName="WMM Grading Calculator"
                            calculatorIcon="fa-layer-group"
                            category={isBlending ? "Blending of Aggregates" : "Sieve Analysis"}
                            inputs={{ inputs }}
                            outputs={results}
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

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden shadow-sm`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-layer-group text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Sieve Analysis - Retained Weight Method</h3>
                                        <p className="text-white/80 text-xs">WMM - MORTH Table 400-11</p>
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
                                            {WMM_DATA.sieves.map((sieve, idx) => {
                                                const res = results[sieve.size];
                                                const isPan = sieve.size === 'Pan';

                                                return (
                                                    <tr key={idx} className={isPan ? 'bg-gray-50' : ''}>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <i className={`fas ${isPan ? 'fa-box' : 'fa-circle'} text-blue-400 text-xs`}></i>
                                                                {sieve.size}
                                                            </div>
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-2 py-1">
                                                            <input
                                                                type="number"
                                                                value={inputs[sieve.size] || ''}
                                                                onChange={(e) => handleInputChange(sieve.size, e.target.value)}
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
                                                            {isPan ? '-' : `${sieve.min} - ${sieve.max}`}
                                                        </td>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center">
                                                            {res && !isPan && (
                                                                <>
                                                                    {res.status === 'Pass' && <span className="text-green-600 font-bold"><i className="fas fa-check mr-1"></i>Pass</span>}
                                                                    {res.status === 'Fail' && <span className="text-red-500 font-bold"><i className="fas fa-times mr-1"></i>Fail</span>}
                                                                </>
                                                            )}
                                                            {isPan && <span className="text-gray-400">-</span>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-center gap-3 mt-4">
                                        <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                            <i className="fas fa-redo mr-1"></i> Reset
                                        </button>
                                    </div>
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
                        {/* What is WMM */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-question-circle text-blue-500"></i>
                                What is Wet Mix Macadam (WMM)?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Wet Mix Macadam (WMM) serves as a base course in flexible pavement construction. It consists of clean, crushed, graded aggregates and granular material, premixed with water to a dense mass on a prepared sub-grade or sub-base. Unlike Water Bound Macadam (WBM), which uses dry aggregates and water sprinkled during compaction, WMM is mixed with water in a plant before laying, ensuring better moisture control and homogeneity.
                            </p>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                The material for WMM should satisfy the grading requirements specified in MORTH Table 400-11. The combined aggregate must be well-graded to minimize voids and maximize stability. The Optimum Moisture Content (OMC) is determined in the laboratory (IS: 2720 Part 8), and the mix is laid at this moisture content to achieve Maximum Dry Density (MDD).
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                WMM provides excellent load-bearing capacity and serves as a strong base for the asphalt layers above. It is widely used in highway construction due to its superior performance compared to traditional WBM.
                            </p>
                        </div>

                        {/* MORTH Table */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-table text-blue-500"></i>
                                MORTH Table 400-11: WMM Grading Requirements
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <th className="border border-blue-200 px-4 py-2 text-left font-semibold">IS Sieve (mm)</th>
                                            <th className="border border-blue-200 px-4 py-2 text-center font-semibold">% Passing (by weight)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr><td className="border px-4 py-2 font-medium">53.00 mm</td><td className="border px-4 py-2 text-center">100</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">45.00 mm</td><td className="border px-4 py-2 text-center">95 - 100</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">22.40 mm</td><td className="border px-4 py-2 text-center">60 - 80</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">11.20 mm</td><td className="border px-4 py-2 text-center">40 - 60</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">4.75 mm</td><td className="border px-4 py-2 text-center">25 - 40</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">2.36 mm</td><td className="border px-4 py-2 text-center">15 - 30</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">0.600 mm</td><td className="border px-4 py-2 text-center">8 - 22</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">0.075 mm</td><td className="border px-4 py-2 text-center">0 - 8</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                Reference: MORTH Specifications for Road and Bridge Works, 5th Revision, Table 400-11
                            </p>
                        </div>

                        {/* Theory */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-book text-blue-500"></i>
                                Theory
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Wet Mix Macadam is prepared by mixing coarse aggregates, fine aggregates, and water in a pug mill or mixing plant. The mixing ensures uniform coating of aggregates with water and proper distribution of fines throughout the mix. This controlled mixing process results in a more consistent and durable base layer compared to field-mixed alternatives.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The grading of WMM material directly affects its compaction characteristics and load-bearing capacity. A well-graded mixture allows smaller particles to fill the voids between larger particles, resulting in a dense, stable layer after compaction. The moisture content at the time of compaction is critical for achieving maximum density.
                            </p>
                        </div>

                        {/* Apparatus Required */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-tools text-blue-500"></i>
                                Apparatus Required
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 53mm, 45mm, 22.4mm, 11.2mm, 4.75mm, 2.36mm, 0.600mm, 0.075mm with pan and lid.</li>
                                <li><strong>Balance:</strong> Capacity 20kg, readable to 1g for weighing aggregates.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled at 110 ± 5°C.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical shaker for consistent sieving.</li>
                                <li><strong>Sample Splitter:</strong> Riffle box for obtaining representative samples.</li>
                                <li><strong>Trays and Brushes:</strong> For handling and cleaning aggregates.</li>
                            </ul>
                        </div>

                        {/* Test Procedure */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-clipboard-list text-blue-500"></i>
                                Test Procedure
                            </h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-3 text-justify">
                                <li><strong>Sample Collection:</strong> Collect a representative sample of WMM material from the stockpile or plant.</li>
                                <li><strong>Drying:</strong> Dry the sample at 110 ± 5°C to constant weight.</li>
                                <li><strong>Weighing:</strong> Weigh the dried sample accurately (minimum 10 kg for 53mm max size).</li>
                                <li><strong>Sieving:</strong> Stack sieves in descending order and place sample on top. Sieve for 10-15 minutes.</li>
                                <li><strong>Recording:</strong> Weigh material retained on each sieve including the pan.</li>
                                <li><strong>Calculation:</strong> Calculate percentage retained, cumulative retained, and percentage passing.</li>
                                <li><strong>Verification:</strong> Compare results with MORTH Table 400-11 limits.</li>
                            </ol>
                        </div>

                        {/* Important Notes */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-amber-500"></i>
                                Important Notes
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li>The aggregate should have a minimum CBR value of 30% when tested at 98% of MDD.</li>
                                <li>Liquid Limit of fines passing 0.425mm should not exceed 25%.</li>
                                <li>Plasticity Index should not be more than 6%.</li>
                                <li>The WMM layer should be compacted to not less than 98% of laboratory MDD.</li>
                                <li>Minimum thickness of a compacted WMM layer is 75mm, maximum is 200mm.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Ad */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center text-blue-600 mt-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm font-medium">Advertisement</p>
                        <p className="text-xs text-blue-400">Premium Banner Space</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Global Search */}
                    <GlobalSearch />

                    {/* Calculator Info */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-layer-group text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">WMM Grading</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-xs text-[#6b7280] p-3 bg-blue-50 rounded-lg">
                                <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                                {WMM_DATA.desc}
                            </div>
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                <i className="fas fa-compass"></i>
                                Sieve Analysis Calculators
                            </h3>
                        </div>
                        <div className="p-3 max-h-64 overflow-y-auto">
                            {navItems.map((calc, idx) => (
                                <Link
                                    key={idx}
                                    to={calc.slug}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname.includes(calc.slug.split('/').pop())
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <i className={`fas ${calc.icon} w-4 text-center ${location.pathname.includes(calc.slug.split('/').pop()) ? 'text-blue-600' : 'text-gray-400'}`}></i>
                                    {calc.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Ad */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-100 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500">
                        <i className="fas fa-ad text-2xl mb-1 text-gray-400"></i>
                        <p className="text-xs font-medium">Ad Space</p>
                        <p className="text-[10px] text-gray-400 mt-1">300×250</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
