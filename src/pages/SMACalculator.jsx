import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

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
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('13mm SMA');
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});

    const currentData = SMA_DATA[grade];
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

    const gradeOptions = Object.keys(SMA_DATA).map(g => ({ value: g, label: g }));

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

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">SMA Grading Calculator</h1>
                            <p className="text-[#6b7280]">Stone Matrix Asphalt Analysis (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="sma-grading"
                            calculatorName="SMA Grading Calculator"
                            calculatorIcon="fa-cubes"
                            category="Sieve Analysis"
                            inputs={{ grade, inputs }}
                            outputs={results}
                        />
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

                    {/* Advertisement */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
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
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
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
