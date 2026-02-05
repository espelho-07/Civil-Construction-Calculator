import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import { SIEVE_ANALYSIS_NAV, BLENDING_NAV } from '../constants/calculatorRoutes';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';

// DBM Grading Data (MORTH Table 500-10) with Pan
const DBM_DATA = {
    'Grading I': {
        title: 'Grading I (37.5mm Nominal)',
        desc: 'Base/Binder Course (75-100mm thick layer)',
        sieves: [
            { size: '45 mm', min: 100, max: 100 },
            { size: '37.5 mm', min: 95, max: 100 },
            { size: '26.5 mm', min: 63, max: 93 },
            { size: '13.2 mm', min: 55, max: 75 },
            { size: '4.75 mm', min: 38, max: 54 },
            { size: '2.36 mm', min: 28, max: 42 },
            { size: '0.300 mm', min: 7, max: 21 },
            { size: '0.075 mm', min: 2, max: 8 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grading II': {
        title: 'Grading II (26.5mm Nominal)',
        desc: 'Base/Binder Course (50-75mm thick layer)',
        sieves: [
            { size: '37.5 mm', min: 100, max: 100 },
            { size: '26.5 mm', min: 90, max: 100 },
            { size: '19 mm', min: 71, max: 95 },
            { size: '13.2 mm', min: 56, max: 80 },
            { size: '4.75 mm', min: 38, max: 54 },
            { size: '2.36 mm', min: 28, max: 42 },
            { size: '0.300 mm', min: 7, max: 21 },
            { size: '0.075 mm', min: 2, max: 8 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    }
};


export default function DBMCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Grading II');
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');

    const currentData = DBM_DATA[grade];
    const sidebarRef = useRef(null);
    const navItems = isBlending ? BLENDING_NAV : SIEVE_ANALYSIS_NAV;

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

        currentData.sieves.forEach(sieve => {
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
    }, [inputs, grade, sampleWeight, currentData]);

    const reset = () => {
        setInputs({});
        setSampleWeight('');
        setResults({});
    };

    const gradeOptions = Object.keys(DBM_DATA).map(g => ({ value: g, label: g }));

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
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Dense Bituminous Macadam (DBM) Calculator</h1>
                            <p className="text-[#6b7280]">Grading Analysis for DBM (MORTH Table 500-10)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="dbm-grading"
                            calculatorName="DBM Grading Calculator"
                            calculatorIcon="fa-cubes"
                            category={isBlending ? "Blending of Aggregates" : "Sieve Analysis"}
                            inputs={{ grade, inputs }}
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

                    {/* Calculator Section */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden shadow-sm`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-cubes text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Sieve Analysis - Retained Weight Method</h3>
                                        <p className="text-white/80 text-xs">{grade} - MORTH Table 500-10</p>
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
                                        placeholder="e.g. 1200"
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
                        {/* What is DBM */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-question-circle text-blue-500"></i>
                                What is Dense Bituminous Macadam (DBM)?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Dense Bituminous Macadam (DBM) is a hot mix asphalt layer used as a binder course or base course in flexible pavement construction. It is called "dense" graded because the aggregate gradation is designed to achieve maximum density with minimum air voids when compacted. DBM provides structural strength to the pavement and distributes traffic loads to the underlying layers.
                            </p>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                DBM consists of mineral aggregates (coarse aggregate, fine aggregate, and mineral filler) bound together with bitumen. The aggregate gradation follows the specifications laid out in MORTH Table 500-10. The mix is prepared and laid at temperatures between 150-163°C for VG-30 bitumen and compacted immediately to achieve the required density.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                DBM is typically laid in single or multiple layers with a minimum compacted thickness of 50mm per layer. The layer provides excellent resistance to fatigue cracking and rutting when designed properly using Marshall or Superpave mix design methods.
                            </p>
                        </div>

                        {/* MORTH Table */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-table text-blue-500"></i>
                                MORTH Table 500-10: DBM Grading Requirements
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <th className="border border-blue-200 px-4 py-2 text-left font-semibold">IS Sieve (mm)</th>
                                            <th className="border border-blue-200 px-4 py-2 text-center font-semibold">Grading I (37.5mm)</th>
                                            <th className="border border-blue-200 px-4 py-2 text-center font-semibold">Grading II (26.5mm)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr><td className="border px-4 py-2 font-medium">45 mm</td><td className="border px-4 py-2 text-center">100</td><td className="border px-4 py-2 text-center">-</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">37.5 mm</td><td className="border px-4 py-2 text-center">95-100</td><td className="border px-4 py-2 text-center">100</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">26.5 mm</td><td className="border px-4 py-2 text-center">63-93</td><td className="border px-4 py-2 text-center">90-100</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">19 mm</td><td className="border px-4 py-2 text-center">-</td><td className="border px-4 py-2 text-center">71-95</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">13.2 mm</td><td className="border px-4 py-2 text-center">55-75</td><td className="border px-4 py-2 text-center">56-80</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">4.75 mm</td><td className="border px-4 py-2 text-center">38-54</td><td className="border px-4 py-2 text-center">38-54</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">2.36 mm</td><td className="border px-4 py-2 text-center">28-42</td><td className="border px-4 py-2 text-center">28-42</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">0.300 mm</td><td className="border px-4 py-2 text-center">7-21</td><td className="border px-4 py-2 text-center">7-21</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">0.075 mm</td><td className="border px-4 py-2 text-center">2-8</td><td className="border px-4 py-2 text-center">2-8</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                Reference: MORTH Specifications for Road and Bridge Works, 5th Revision, Table 500-10
                            </p>
                        </div>

                        {/* Theory */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-book text-blue-500"></i>
                                Theory
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                DBM is designed using the Marshall Mix Design method in India. The design aims to determine the optimum bitumen content that provides adequate stability, flow, air voids, and voids filled with bitumen (VFB). The aggregate gradation must fall within the specified envelope to ensure a dense, stable mix.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The stability of DBM comes from the internal friction between aggregate particles and the cohesion provided by the bitumen binder. A well-graded aggregate skeleton provides interlocking strength, while the bitumen fills remaining voids and binds the particles together. The mix must have sufficient air voids (3-5%) to accommodate thermal expansion without bleeding or flushing.
                            </p>
                        </div>

                        {/* Apparatus */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-tools text-blue-500"></i>
                                Apparatus Required
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 45mm, 37.5mm, 26.5mm, 19mm, 13.2mm, 4.75mm, 2.36mm, 0.300mm, 0.075mm with pan.</li>
                                <li><strong>Balance:</strong> Capacity 5kg, accurate to 0.1g for weighing aggregates.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled at 110 ± 5°C.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical shaker for consistent sieving.</li>
                                <li><strong>Bitumen Extraction Apparatus:</strong> For extracting bitumen from samples.</li>
                                <li><strong>Trays and Brushes:</strong> For handling aggregates.</li>
                            </ul>
                        </div>

                        {/* Important Notes */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-amber-500"></i>
                                Important Notes
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li>Bitumen content for DBM typically ranges from 4.0% to 5.5% by weight of total mix.</li>
                                <li>Marshall Stability should be minimum 9 kN at 60°C.</li>
                                <li>Flow value should be between 2-4 mm.</li>
                                <li>Air voids in compacted mix should be 3-5%.</li>
                                <li>VFB (Voids Filled with Bitumen) should be 65-75%.</li>
                                <li>Aggregate must have Los Angeles Abrasion Value ≤ 35%.</li>
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
                    {/* Mini Navbar */}
                    <MiniNavbar themeName={isBlending ? 'purple' : 'blue'} />

                    {/* Grade Selector */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-cubes text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">DBM Grading</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-2 block font-medium">Select Grading</label>
                                <CustomDropdown
                                    options={gradeOptions}
                                    value={grade}
                                    onChange={setGrade}
                                    theme={theme}
                                />
                            </div>
                            <div className="text-xs text-[#6b7280] p-3 bg-blue-50 rounded-lg">
                                <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                                {currentData.desc}
                            </div>
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <CategoryQuickNav
                        items={navItems}
                        title={isBlending ? 'Blending Calculators' : 'Sieve Analysis Calculators'}
                        themeName={isBlending ? 'purple' : 'blue'}
                    />

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
