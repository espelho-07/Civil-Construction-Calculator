import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';

// SMA Grading Data (MORTH Table 500-37)
const SMA_DATA = {
    '13mm SMA': {
        title: '13 mm SMA',
        desc: 'Wearing Course (40-50mm)',
        sieves: [
            { size: '19 mm', min: 100, max: 100 },
            { size: '13.2 mm', min: 90, max: 100 },
            { size: '9.5 mm', min: 50, max: 75 },
            { size: '4.75 mm', min: 20, max: 28 },
            { size: '2.36 mm', min: 16, max: 24 },
            { size: '1.18 mm', min: 13, max: 21 },
            { size: '0.600 mm', min: 12, max: 18 },
            { size: '0.300 mm', min: 10, max: 20 },
            { size: '0.075 mm', min: 8, max: 12 }
        ]
    },
    '19mm SMA': {
        title: '19 mm SMA',
        desc: 'Binder Course (45-75mm)',
        sieves: [
            { size: '26.5 mm', min: 100, max: 100 },
            { size: '19 mm', min: 90, max: 100 },
            { size: '13.2 mm', min: 45, max: 70 },
            { size: '9.5 mm', min: 25, max: 60 },
            { size: '4.75 mm', min: 20, max: 28 },
            { size: '2.36 mm', min: 16, max: 24 },
            { size: '1.18 mm', min: 13, max: 21 },
            { size: '0.600 mm', min: 12, max: 18 },
            { size: '0.300 mm', min: 10, max: 20 },
            { size: '0.075 mm', min: 8, max: 12 }
        ]
    }
};

export default function SMACalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');

    // Extract grade from URL
    const getGradeFromURL = () => {
        if (location.pathname.includes('sma-13mm')) return '13mm SMA';
        if (location.pathname.includes('sma-19mm')) return '19mm SMA';
        return '13mm SMA';
    };

    const [grade, setGrade] = useState(getGradeFromURL());
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});

    const currentData = SMA_DATA[grade];
    const sidebarRef = useRef(null);

    // Update grade when URL changes
    useEffect(() => {
        const newGrade = getGradeFromURL();
        if (newGrade !== grade) {
            setGrade(newGrade);
            setInputs({});
            setResults({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

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

    const gradeOptions = Object.keys(SMA_DATA).map(g => ({ value: g, label: g }));

    // Handle grade change - navigate to correct URL
    const handleGradeChange = (newGrade) => {
        const size = newGrade === '13mm SMA' ? '13mm' : '19mm';
        const basePath = isBlending ? '/blending-aggregates' : '/sieve-analysis';
        navigate(`${basePath}/sma-${size}`);
    };

    // Back to category
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">SMA Grading Calculator</h1>
                            <p className="text-[#6b7280]">Stone Matrix Asphalt Analysis (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="sma-grading"
                            calculatorName="SMA Grading Calculator"
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

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-cubes text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Grading Analysis</h3>
                                        <p className="text-white/80 text-xs">{grade}</p>
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
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={reset}
                                        className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                                    >
                                        <i className="fas fa-redo mr-1"></i> Reset
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
                                Stone Matrix Asphalt (SMA) is a gap-graded bituminous mixture that maximizes stone-on-stone contact to provide a stable, durable, and rut-resistant pavement structure. The coarse aggregate skeleton is filled with a mastic of fine aggregate, filler, and binder. Stabilizing additives (like cellulose fiber) are often used to prevent drain-down of the binder.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                MORTH specifications use 13 mm SMA for wearing courses (40-50 mm thick) and 19 mm SMA for binder courses (45-75 mm thick). The gap grading ensures a high coarse aggregate content (&gt;70%), creating a strong skeleton.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> Set including 26.5mm, 19mm, 13.2mm, 9.5mm, 4.75mm, 2.36mm, 1.18mm, 0.600mm, 0.300mm, and 0.075mm.</li>
                                <li><strong>Balance:</strong> Sensitive balance for weighing aggregates and fillers.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled.</li>
                                <li><strong>Apparatus for Drain-down test:</strong> Wire basket assembly.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Aggregates:</strong> Aggregates must be highly durable, cubical, and clean.</li>
                                <li><strong>Sieve Analysis:</strong> Check the gradation of combined aggregates against the specific gap-graded limits (Table 500-37). Notice the high percentage retained on coarse sieves and the 'gap' typically between 4.75mm and 9.5mm/13.2mm.</li>
                                <li><strong>Binder Content:</strong> Minimum bitumen content is usually high (around 5.8% to 6.0%) to ensure durability.</li>
                                <li><strong>Drain-down:</strong> A drain-down test is mandatory to ensure the mastic holds the binder at mixing temperatures.</li>
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
                                    <i className="fas fa-cubes text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">SMA Calculator</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-1 block font-medium">Select Grading</label>
                                <CustomDropdown
                                    options={gradeOptions}
                                    value={grade}
                                    onChange={handleGradeChange}
                                    theme={theme}
                                />
                            </div>
                            <div className="text-xs text-[#6b7280] mt-2">
                                {currentData.desc}
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
