import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import { SIEVE_ANALYSIS_NAV, BLENDING_NAV } from '../constants/calculatorRoutes';
import GlobalSearch from '../components/GlobalSearch';

// WBM Grading Data (MORTH Table 400-8 & 400-9) with Pan
const GRADING_DATA = {
    'Grading 1': {
        title: 'Grading 1 (90mm to 45mm)',
        desc: 'Coarse aggregates for WBM Grade 1.',
        sieves: [
            { size: '125 mm', min: 100, max: 100 },
            { size: '90 mm', min: 90, max: 100 },
            { size: '63 mm', min: 25, max: 60 },
            { size: '45 mm', min: 0, max: 15 },
            { size: '22.4 mm', min: 0, max: 5 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grading 2': {
        title: 'Grading 2 (63mm to 45mm)',
        desc: 'Coarse aggregates for WBM Grade 2.',
        sieves: [
            { size: '90 mm', min: 100, max: 100 },
            { size: '63 mm', min: 90, max: 100 },
            { size: '53 mm', min: 25, max: 75 },
            { size: '45 mm', min: 0, max: 15 },
            { size: '22.4 mm', min: 0, max: 5 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grading 3': {
        title: 'Grading 3 (53mm to 22.4mm)',
        desc: 'Coarse aggregates for WBM Grade 3.',
        sieves: [
            { size: '63 mm', min: 100, max: 100 },
            { size: '53 mm', min: 95, max: 100 },
            { size: '45 mm', min: 65, max: 90 },
            { size: '22.4 mm', min: 0, max: 10 },
            { size: '11.2 mm', min: 0, max: 5 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Screenings Type A': {
        title: 'Screenings Type A (13.2mm)',
        desc: 'Screenings to fill voids in coarse aggregates.',
        sieves: [
            { size: '13.2 mm', min: 100, max: 100 },
            { size: '11.2 mm', min: 95, max: 100 },
            { size: '5.6 mm', min: 15, max: 35 },
            { size: '0.18 mm', min: 0, max: 10 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Screenings Type B': {
        title: 'Screenings Type B (11.2mm)',
        desc: 'Screenings to fill voids in coarse aggregates.',
        sieves: [
            { size: '11.2 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 80, max: 100 },
            { size: '5.6 mm', min: 50, max: 70 },
            { size: '0.18 mm', min: 15, max: 35 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    }
};


export default function WBMGradingCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Grading 1');
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});

    const currentData = GRADING_DATA[grade];
    const sidebarRef = useRef(null);
    const navItems = isBlending ? BLENDING_NAV : SIEVE_ANALYSIS_NAV;

    const handleBack = () => {
        navigate(isBlending ? '/category/blending-aggregates' : '/category/sieve-analysis-aggregates');
    };

    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const totalWeight = parseFloat(sampleWeight);
        if (!totalWeight || totalWeight <= 0) {
            setResults({});
            return;
        }

        const newResults = {};
        let cumRetainedWeight = 0;

        currentData.sieves.forEach(sieve => {
            const retained = parseFloat(inputs[sieve.size] || 0);
            cumRetainedWeight += retained;

            const percentRetained = (retained / totalWeight) * 100;
            const cumPercentRetained = (cumRetainedWeight / totalWeight) * 100;
            const percentPassing = 100 - cumPercentRetained;

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
    }, [inputs, grade, sampleWeight]);

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

    const gradeOptions = Object.keys(GRADING_DATA).map(g => ({ value: g, label: g }));

    // Search Filter for Quick Nav
    const filteredCalcs = SIEVE_ANALYSIS_CALCS.filter(calc =>
        calc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory={isBlending ? 'blending-aggregates' : 'sieve-analysis-aggregates'} />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Water Bound Macadam (WBM) Calculator</h1>
                            <p className="text-[#6b7280]">Grading Analysis for Water Bound Macadam (MORTH Table 400-8 & 400-9)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="wbm-grading"
                            calculatorName="WBM Grading Calculator"
                            calculatorIcon="fa-road"
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
                                        <i className="fas fa-road text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Sieve Analysis - Retained Weight Method</h3>
                                        <p className="text-white/80 text-xs">{grade} - MORTH Table 400-8 & 400-9</p>
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
                        {/* What is WBM */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-question-circle text-blue-500"></i>
                                What is Water Bound Macadam (WBM)?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Water Bound Macadam (WBM) is a type of road base or sub-base course consisting of crushed or broken aggregate mechanically interlocked by rolling and voids filled with screening and binding material with the assistance of water. The stability of WBM depends on the particle friction and interlocking property of the aggregates. Proper gradation of the coarse aggregates and screenings is vital to achieve a dense and stable layer capable of transmitting traffic loads to the underlying sub-grade.
                            </p>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                MORTH specifications classify WBM into three grades (Grade 1, 2, and 3) based on the size range of coarse aggregates (e.g., 90-45mm, 63-45mm, 53-22.4mm). The grading ensures minimum voids and maximum strength.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                WBM is one of the oldest road construction techniques and is still widely used for low-volume roads and as a sub-base for flexible pavements. It provides good drainage and load distribution when properly constructed.
                            </p>
                        </div>

                        {/* MORTH Tables */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-table text-blue-500"></i>
                                MORTH Table 400-8: WBM Coarse Aggregate Grading
                            </h2>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <th className="border border-blue-200 px-3 py-2 text-left">IS Sieve (mm)</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grading 1</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grading 2</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grading 3</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs">
                                        <tr><td className="border px-3 py-1.5 font-medium">125 mm</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">90 mm</td><td className="border px-3 py-1.5 text-center">90-100</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">-</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">63 mm</td><td className="border px-3 py-1.5 text-center">25-60</td><td className="border px-3 py-1.5 text-center">90-100</td><td className="border px-3 py-1.5 text-center">100</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">53 mm</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">25-75</td><td className="border px-3 py-1.5 text-center">95-100</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">45 mm</td><td className="border px-3 py-1.5 text-center">0-15</td><td className="border px-3 py-1.5 text-center">0-15</td><td className="border px-3 py-1.5 text-center">65-90</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">22.4 mm</td><td className="border px-3 py-1.5 text-center">0-5</td><td className="border px-3 py-1.5 text-center">0-5</td><td className="border px-3 py-1.5 text-center">0-10</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">11.2 mm</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">0-5</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                Reference: MORTH Specifications for Road and Bridge Works, 5th Revision
                            </p>
                        </div>

                        {/* Theory */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-book text-blue-500"></i>
                                Theory
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                The construction of WBM involves spreading the coarse aggregates on the prepared surface, rolling with a power roller, spreading screenings and binding materials, and applying water while rolling to achieve mechanical interlocking. The water helps in binding the fines and filling the voids between the coarse aggregates.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The strength of WBM comes from the interlocking of angular aggregate particles. The screenings fill the voids and the binding material (stone dust or locally available material) along with water creates a dense, stable layer. Proper gradation of both coarse aggregates and screenings is essential for achieving the desired compaction and strength.
                            </p>
                        </div>

                        {/* Apparatus */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-tools text-blue-500"></i>
                                Apparatus Required
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 125mm, 90mm, 63mm, 53mm, 45mm, 22.4mm, 13.2mm, 11.2mm, 9.5mm, 5.6mm with pan.</li>
                                <li><strong>Balance:</strong> Capacity 30kg, accurate to 5g for large aggregates.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled at 110 ± 5°C.</li>
                                <li><strong>Sample Splitter:</strong> For obtaining representative samples.</li>
                                <li><strong>Trays and Brushes:</strong> For handling aggregates.</li>
                            </ul>
                        </div>

                        {/* Test Procedure */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-clipboard-list text-blue-500"></i>
                                Test Procedure
                            </h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-3 text-justify">
                                <li><strong>Sample Collection:</strong> Obtain a representative sample of WBM coarse aggregates or screenings.</li>
                                <li><strong>Drying:</strong> Dry the sample at 110 ± 5°C to constant weight.</li>
                                <li><strong>Weighing:</strong> Record the total dry weight of the sample.</li>
                                <li><strong>Sieving:</strong> Stack sieves in descending order and sieve for adequate time.</li>
                                <li><strong>Recording:</strong> Weigh material retained on each sieve including pan.</li>
                                <li><strong>Calculation:</strong> Calculate percentages and compare with MORTH limits.</li>
                            </ol>
                        </div>

                        {/* Important Notes */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-amber-500"></i>
                                Important Notes
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li>The coarse aggregates should be hard, durable, and free from weathered or disintegrated pieces.</li>
                                <li>Los Angeles Abrasion Value should not exceed 40%.</li>
                                <li>The aggregates should satisfy the specified grading requirements.</li>
                                <li>Screenings should be angular, clean, and free from organic matter.</li>
                                <li>Minimum compacted thickness of each WBM layer is 75mm.</li>
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

                    {/* Grade Selector */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-road text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">WBM Grading</h3>
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
