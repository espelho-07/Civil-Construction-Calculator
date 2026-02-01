import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import { SIEVE_ANALYSIS_NAV, BLENDING_NAV } from '../constants/calculatorRoutes';
import GlobalSearch from '../components/GlobalSearch';

// BC Grading Data (MORTH Table 500-17)
const BC_DATA = {
    'Grading I': {
        title: 'Grading I (19mm Nominal)',
        desc: 'Wearing Course (50-65mm Thickness)',
        sieves: [
            { size: '26.5 mm', min: 100, max: 100 },
            { size: '19 mm', min: 90, max: 100 },
            { size: '13.2 mm', min: 59, max: 79 },
            { size: '9.5 mm', min: 52, max: 72 },
            { size: '4.75 mm', min: 35, max: 55 },
            { size: '2.36 mm', min: 28, max: 44 },
            { size: '1.18 mm', min: 20, max: 34 },
            { size: '0.600 mm', min: 15, max: 27 },
            { size: '0.300 mm', min: 10, max: 20 },
            { size: '0.150 mm', min: 5, max: 13 },
            { size: '0.075 mm', min: 2, max: 8 }
        ]
    },
    'Grading II': {
        title: 'Grading II (13mm Nominal)',
        desc: 'Wearing Course (30-40mm Thickness)',
        sieves: [
            { size: '19 mm', min: 100, max: 100 },
            { size: '13.2 mm', min: 90, max: 100 },
            { size: '9.5 mm', min: 70, max: 88 },
            { size: '4.75 mm', min: 53, max: 71 },
            { size: '2.36 mm', min: 42, max: 58 },
            { size: '1.18 mm', min: 34, max: 48 },
            { size: '0.600 mm', min: 26, max: 38 },
            { size: '0.300 mm', min: 18, max: 28 },
            { size: '0.150 mm', min: 12, max: 20 },
            { size: '0.075 mm', min: 4, max: 10 }
        ]
    }
};

// Map URL grade number to Grade name
const GRADE_URL_MAP = {
    '1': 'Grading I',
    '2': 'Grading II'
};

export default function BituminousConcreteCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');

    // Extract grade number from URL
    const getGradeFromURL = () => {
        const match = location.pathname.match(/bc-grading-(\d)/);
        if (match && GRADE_URL_MAP[match[1]]) {
            return GRADE_URL_MAP[match[1]];
        }
        return 'Grading II';
    };

    const [grade, setGrade] = useState(getGradeFromURL());
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});

    const currentData = BC_DATA[grade];
    const sidebarRef = useRef(null);
    const navItems = isBlending ? BLENDING_NAV : SIEVE_ANALYSIS_NAV;

    // Update grade when URL changes
    useEffect(() => {
        const newGrade = getGradeFromURL();
        if (newGrade !== grade) {
            setGrade(newGrade);
            setInputs({});
            setResults({});
        }
    }, [location.pathname]);

    // Handle grade change - navigate to correct URL
    const handleGradeChange = (newGrade) => {
        const gradeNum = newGrade === 'Grading I' ? '1' : '2';
        const basePath = isBlending ? '/blending-aggregates' : '/sieve-analysis';
        navigate(`${basePath}/bc-grading-${gradeNum}`);
    };

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

        currentData.sieves.forEach(sieve => {
            const retained = Math.max(0, parseFloat(inputs[sieve.size] || 0) || 0);
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
        setResults(newResults);
    }, [inputs, grade, sampleWeight, currentData]);

    const reset = () => {
        setInputs({});
        setSampleWeight('');
        setResults({});
    };

    const gradeOptions = Object.keys(BC_DATA).map(g => ({ value: g, label: g }));

    // Sidebar Scroll Logic
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
                    {/* Header with Back Button */}
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
                                <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">Bituminous Concrete (BC) Calculator</h1>
                                <p className="text-[#6b7280]">BC Grading Analysis (MORT&H Table 500-17)</p>
                            </div>
                        </div>
                        <CalculatorActions
                            calculatorSlug="bc-grading"
                            calculatorName="BC Grading Calculator"
                            calculatorIcon="fa-th"
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
                                        <i className="fas fa-th text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Sieve Analysis - Retained Weight Method</h3>
                                        <p className="text-white/80 text-xs">{grade} - MORTH Table 500-17</p>
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
                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm">
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
                        {/* What is BC */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-question-circle text-blue-500"></i>
                                What is Bituminous Concrete (BC)?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Bituminous Concrete (BC), also known as Asphalt Concrete (AC), is a dense graded bituminous mix used as a wearing course in flexible pavements. It provides a durable, smooth, and skid-resistant surface specifically designed to withstand heavy traffic loads and environmental conditions.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                MORTH specifications define two gradings: Grading I (19mm nominal) for 50-65mm thick layers and Grading II (13.2mm nominal) for 30-40mm thick layers. The mix requires careful design to achieve optimal bitumen content (typically 5.0-5.5% by mass), air voids (3-5%), and stability.
                            </p>
                        </div>

                        {/* MORTH Table */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-table text-blue-500"></i>
                                MORTH Table 500-17: BC Grading Requirements
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <th className="border border-blue-200 px-4 py-2 text-left font-semibold">IS Sieve (mm)</th>
                                            <th className="border border-blue-200 px-4 py-2 text-center font-semibold">Grading I (19mm)</th>
                                            <th className="border border-blue-200 px-4 py-2 text-center font-semibold">Grading II (13.2mm)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr><td className="border px-4 py-2 font-medium">26.5 mm</td><td className="border px-4 py-2 text-center">100</td><td className="border px-4 py-2 text-center">-</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">19 mm</td><td className="border px-4 py-2 text-center">90-100</td><td className="border px-4 py-2 text-center">100</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">13.2 mm</td><td className="border px-4 py-2 text-center">59-79</td><td className="border px-4 py-2 text-center">90-100</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">9.5 mm</td><td className="border px-4 py-2 text-center">52-72</td><td className="border px-4 py-2 text-center">70-88</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">4.75 mm</td><td className="border px-4 py-2 text-center">35-55</td><td className="border px-4 py-2 text-center">53-71</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">2.36 mm</td><td className="border px-4 py-2 text-center">28-44</td><td className="border px-4 py-2 text-center">42-58</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">1.18 mm</td><td className="border px-4 py-2 text-center">20-34</td><td className="border px-4 py-2 text-center">34-48</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">0.600 mm</td><td className="border px-4 py-2 text-center">15-27</td><td className="border px-4 py-2 text-center">26-38</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">0.300 mm</td><td className="border px-4 py-2 text-center">10-20</td><td className="border px-4 py-2 text-center">18-28</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-4 py-2 font-medium">0.150 mm</td><td className="border px-4 py-2 text-center">5-13</td><td className="border px-4 py-2 text-center">12-20</td></tr>
                                        <tr><td className="border px-4 py-2 font-medium">0.075 mm</td><td className="border px-4 py-2 text-center">2-8</td><td className="border px-4 py-2 text-center">4-10</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                Reference: MORTH Specifications for Road and Bridge Works, 5th Revision, Table 500-17
                            </p>
                        </div>

                        {/* Theory */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-book text-blue-500"></i>
                                Theory
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Bituminous Concrete is designed using the Marshall Mix Design method. The design aims to determine the optimum bitumen content that provides adequate stability, flow, air voids, and voids filled with bitumen (VFB). The aggregate gradation must fall within the specified envelope to ensure a dense, stable mix.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The stability of BC comes from the internal friction between aggregate particles and the cohesion provided by the bitumen binder. A well-graded aggregate skeleton provides interlocking strength, while the bitumen fills remaining voids and binds the particles together.
                            </p>
                        </div>

                        {/* Apparatus */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-tools text-blue-500"></i>
                                Apparatus Required
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 26.5mm, 19mm, 13.2mm, 9.5mm, 4.75mm, 2.36mm, 1.18mm, 0.600mm, 0.300mm, 0.150mm, and 0.075mm.</li>
                                <li><strong>Balance:</strong> Capacity 5kg, accurate to 0.1g for weighing aggregates.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled at 110 ± 5°C.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical shaker for consistent sieving.</li>
                                <li><strong>Marshall Apparatus:</strong> For mix design (stability and flow).</li>
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
                                <li>Bitumen content for BC typically ranges from 5.0% to 5.5% by weight of total mix.</li>
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
                    {/* Global Search */}
                    <GlobalSearch />

                    {/* Grade Selector */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-th text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">BC Grading</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-2 block font-medium">Select Grade</label>
                                <CustomDropdown
                                    options={gradeOptions}
                                    value={grade}
                                    onChange={handleGradeChange}
                                    theme={theme}
                                />
                            </div>
                            <div className="text-xs text-[#6b7280] mt-2 p-3 bg-blue-50 rounded-lg">
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
