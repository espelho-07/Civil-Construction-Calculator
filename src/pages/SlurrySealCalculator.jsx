import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// Slurry Seal Grading Data (MORTH Table 500-29 / IRC:SP:81)
const SLURRY_SEAL_DATA = {
    'Type I': {
        title: 'Type I (Fine)',
        desc: 'Crack Filling / Low Traffic',
        sieves: [
            { size: '9.5 mm', min: 100, max: 100 },
            { size: '4.75 mm', min: 100, max: 100 },
            { size: '2.36 mm', min: 90, max: 100 },
            { size: '1.18 mm', min: 65, max: 90 },
            { size: '0.600 mm', min: 40, max: 65 },
            { size: '0.300 mm', min: 25, max: 42 },
            { size: '0.150 mm', min: 15, max: 30 },
            { size: '0.075 mm', min: 10, max: 20 }
        ]
    },
    'Type II': {
        title: 'Type II (General)',
        desc: 'Surface Sealing / Moderate Traffic',
        sieves: [
            { size: '9.5 mm', min: 100, max: 100 },
            { size: '4.75 mm', min: 90, max: 100 },
            { size: '2.36 mm', min: 65, max: 90 },
            { size: '1.18 mm', min: 45, max: 70 },
            { size: '0.600 mm', min: 30, max: 50 },
            { size: '0.300 mm', min: 18, max: 30 },
            { size: '0.150 mm', min: 10, max: 21 },
            { size: '0.075 mm', min: 5, max: 15 }
        ]
    },
    'Type III': {
        title: 'Type III (Coarse)',
        desc: 'High Friction / Heavy Traffic',
        sieves: [
            { size: '9.5 mm', min: 100, max: 100 },
            { size: '4.75 mm', min: 70, max: 90 },
            { size: '2.36 mm', min: 45, max: 70 },
            { size: '1.18 mm', min: 28, max: 50 },
            { size: '0.600 mm', min: 19, max: 34 },
            { size: '0.300 mm', min: 12, max: 25 },
            { size: '0.150 mm', min: 7, max: 18 },
            { size: '0.075 mm', min: 5, max: 12 }
        ]
    }
};

export default function SlurrySealCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Type II');
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});

    const currentData = SLURRY_SEAL_DATA[grade];
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

    const gradeOptions = Object.keys(SLURRY_SEAL_DATA).map(g => ({ value: g, label: g }));

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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Slurry Seal Calculator</h1>
                            <p className="text-[#6b7280]">Slurry Seal / Microsurfacing Grading (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="slurry-seal"
                            calculatorName="Slurry Seal Calculator"
                            calculatorIcon="fa-fill-drip"
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
                                        <i className="fas fa-fill-drip text-white"></i>
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
                                Slurry Seal is a cold-mix paving system composed of graded aggregate, asphalt emulsion, water, and mineral filler. It is applied as a slurry to the pavement surface to seal cracks, restore waterproofing, and improve skid resistance.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                <strong>Type I (Fine):</strong> Used for sealing cracks and low traffic areas.<br />
                                <strong>Type II (General):</strong> Used for moderate traffic and general surface sealing.<br />
                                <strong>Type III (Coarse):</strong> Used for heavy traffic and high friction applications.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 9.5mm, 4.75mm, 2.36mm, 1.18mm, 0.600mm, 0.300mm, 0.150mm, and 0.075mm.</li>
                                <li><strong>Balance:</strong> Sensitive balance for mix design.</li>
                                <li><strong>Slurry Machine:</strong> For field application (continuous flow).</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Component Analysis:</strong> Test aggregates for gradation (Type I, II, or III) and cleanliness (Sand Equivalent &gt; 50).</li>
                                <li><strong>Mix Design:</strong> Determine the optimum emulsion content and water content to achieve desired consistency and set time.</li>
                                <li><strong>Compatibility:</strong> Ensure emulsion is compatible with the aggregate (zeta potential/breaking time).</li>
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
                                    <i className="fas fa-fill-drip text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">Slurry Seal Calculator</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-1 block font-medium">Select Type</label>
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
