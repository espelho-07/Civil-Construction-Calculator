import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// WBM Grading Data (MORTH Table 400-8 & 400-9)
const GRADING_DATA = {
    'Grading 1': {
        title: 'Grading 1 (90mm to 45mm)',
        desc: 'Coarse aggregates for WBM Grade 1.',
        sieves: [
            { size: '125 mm', min: 100, max: 100 },
            { size: '90 mm', min: 90, max: 100 },
            { size: '63 mm', min: 25, max: 60 },
            { size: '45 mm', min: 0, max: 15 },
            { size: '22.4 mm', min: 0, max: 5 }
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
            { size: '22.4 mm', min: 0, max: 5 }
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
            { size: '11.2 mm', min: 0, max: 5 }
        ]
    },
    'Screenings Type A': {
        title: 'Screenings Type A (13.2mm)',
        desc: 'Screenings to fill voids in coarse aggregates.',
        sieves: [
            { size: '13.2 mm', min: 100, max: 100 },
            { size: '11.2 mm', min: 95, max: 100 },
            { size: '5.6 mm', min: 15, max: 35 },
            { size: '0.18 mm', min: 0, max: 10 }
        ]
    },
    'Screenings Type B': {
        title: 'Screenings Type B (11.2mm)',
        desc: 'Screenings to fill voids in coarse aggregates.',
        sieves: [
            { size: '11.2 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 80, max: 100 },
            { size: '5.6 mm', min: 50, max: 70 },
            { size: '0.18 mm', min: 15, max: 35 }
        ]
    }
};

function InfoTooltip({ text, theme }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block">
            <button
                type="button"
                className="w-4 h-4 bg-gray-600 text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
            >
                i
            </button>
            {show && (
                <div className="absolute left-6 top-0 z-50 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-xs text-[#0A0A0A] leading-relaxed text-justify">
                    {text}
                </div>
            )}
        </div>
    );
}

export default function WBMGradingCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Grading 1');
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});

    const currentData = GRADING_DATA[grade];
    const sidebarRef = useRef(null);

    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const newResults = {};
        currentData.sieves.forEach(sieve => {
            const val = parseFloat(inputs[sieve.size]);
            if (!isNaN(val)) {
                if (val >= sieve.min && val <= sieve.max) {
                    newResults[sieve.size] = 'Pass';
                } else {
                    newResults[sieve.size] = 'Fail';
                }
            }
        });
        setResults(newResults);
    }, [inputs, grade]);

    const reset = () => {
        setInputs({});
        setResults({});
    };

    const gradeOptions = Object.keys(GRADING_DATA).map(g => ({ value: g, label: g }));

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
            <CategoryNav activeCategory="sieve-analysis-aggregates" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">WBM Grading Calculator</h1>
                            <p className="text-[#6b7280]">Water Bound Macadam Grading Analysis (MORT&H)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="wbm-grading"
                            calculatorName="WBM Grading Calculator"
                            calculatorIcon="fa-layer-group"
                            category="Sieve Analysis"
                            inputs={{ grade, inputs }}
                            outputs={results}
                        />
                    </div>

                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-layer-group text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Grading Analysis</h3>
                                        <p className="text-white/80 text-xs">{grade}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f9fa]">
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">IS Sieve</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-center">% Passing Range</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-center">Input % Passing</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.sieves.map((sieve, idx) => (
                                            <tr key={idx}>
                                                <td className="border border-[#e5e7eb] px-4 py-2 font-medium">{sieve.size}</td>
                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center text-[#6b7280]">
                                                    {sieve.min} - {sieve.max}
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={inputs[sieve.size] || ''}
                                                        onChange={(e) => handleInputChange(sieve.size, e.target.value)}
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center outline-none ${theme.focus} focus:ring-2 focus:ring-blue-100/50`}
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center">
                                                    {results[sieve.size] === 'Pass' && <span className="text-green-600 font-bold"><i className="fas fa-check mr-1"></i>Pass</span>}
                                                    {results[sieve.size] === 'Fail' && <span className="text-red-500 font-bold"><i className="fas fa-times mr-1"></i>Fail</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-center gap-3 mt-4">
                                    <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                        <i className="fas fa-redo mr-1"></i> Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>

                    <div className="space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Theory</h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Water Bound Macadam (WBM) is a type of road base or sub-base course consisting of crushed or broken aggregate mechanically interlocked by rolling and voids filled with screening and binding material with the assistance of water. The stability of WBM depends on the particle friction and interlocking property of the aggregates. Proper gradation of the coarse aggregates and screenings is vital to achieve a dense and stable layer capable of transmitting traffic loads to the underlying sub-grade.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                MORTH specifications classify WBM into three grades (Grade 1, 2, and 3) based on the size range of coarse aggregates (e.g., 90-45mm, 63-45mm, 53-22.4mm). The grading ensures minimum voids and maximum strength.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> A set of IS sieves depending on the grade tested (e.g., 125mm, 90mm, 63mm, 53mm, 45mm, 22.4mm, 11.2mm).</li>
                                <li><strong>Balance:</strong> A heavy-duty balance (capacity at least 50 kg) readable to 10g or 0.1% of sample weight.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled oven.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical sieve shaker appropriate for large apertures.</li>
                                <li><strong>Sample Splitter:</strong> For obtaining representative samples from large bulk.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Sampling:</strong> Obtain a representative sample of WBM aggregate (typically 25-50 kg depending on the nominal size).</li>
                                <li><strong>Drying:</strong> Dry the sample if necessary to remove surface moisture.</li>
                                <li><strong>Weighing:</strong> Weigh the total sample accurately.</li>
                                <li><strong>Sieving:</strong> Place the sample on the specified nest of sieves (e.g., for Grade 1: 125mm, 90mm, 63mm, 45mm, 22.4mm). Shake thoroughly.</li>
                                <li><strong>Weighing Retained:</strong> Weigh the material retained on each sieve.</li>
                                <li><strong>Computation:</strong> Calculate the percentage by weight passing each sieve.</li>
                                <li><strong>Check:</strong> Compare the results with MORTH Table 400-8 (Coarse Aggregates) or 400-9 (Screenings) to determine compliance.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-layer-group text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">WBM Calculator</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-1 block font-medium">Select Grading</label>
                                <CustomDropdown
                                    options={gradeOptions}
                                    value={grade}
                                    onChange={setGrade}
                                    theme={theme}
                                />
                            </div>
                            <div className="text-xs text-[#6b7280] mt-2">
                                {currentData.desc}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
