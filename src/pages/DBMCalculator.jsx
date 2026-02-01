import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// DBM Grading Data (MORTH Table 500-10)
const DBM_DATA = {
    'Grading I': {
        title: 'Grading I (37.5mm Nominal)',
        desc: 'Base/Binder Course (75-100mm)',
        sieves: [
            { size: '45 mm', min: 100, max: 100 },
            { size: '37.5 mm', min: 95, max: 100 },
            { size: '26.5 mm', min: 63, max: 93 },
            { size: '13.2 mm', min: 55, max: 75 },
            { size: '4.75 mm', min: 38, max: 54 },
            { size: '2.36 mm', min: 28, max: 42 },
            { size: '0.300 mm', min: 7, max: 21 },
            { size: '0.075 mm', min: 2, max: 8 }
        ]
    },
    'Grading II': {
        title: 'Grading II (26.5mm Nominal)',
        desc: 'Base/Binder Course (50-75mm)',
        sieves: [
            { size: '37.5 mm', min: 100, max: 100 },
            { size: '26.5 mm', min: 90, max: 100 },
            { size: '19 mm', min: 71, max: 95 },
            { size: '13.2 mm', min: 56, max: 80 },
            { size: '4.75 mm', min: 38, max: 54 },
            { size: '2.36 mm', min: 28, max: 42 },
            { size: '0.300 mm', min: 7, max: 21 },
            { size: '0.075 mm', min: 2, max: 8 }
        ]
    }
};

export default function DBMCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Grading II'); // Default to Grading II as it's more common
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});

    const currentData = DBM_DATA[grade];
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
            <CategoryNav activeCategory="sieve-analysis-aggregates" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">DBM Grading Calculator</h1>
                            <p className="text-[#6b7280]">Dense Bituminous Macadam Analysis (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="dbm-grading"
                            calculatorName="DBM Grading Calculator"
                            calculatorIcon="fa-road"
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
                                        <i className="fas fa-road text-white"></i>
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
                                Dense Bituminous Macadam (DBM) is a binder course used for roads with a high number of heavy commercial vehicles. It is a close-graded premix material having a void content of 5-10 percent. The DBM layer provides strength and transfers the traffic load to the base course.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                MORTH Grade I has a nominal aggregate size of 37.5 mm and is suitable for layer thicknesses of 75-100 mm. Grade II has a nominal aggregate size of 26.5 mm, suitable for layer thicknesses of 50-75 mm. The minimum bitumen content is 4.0% for Grade I and 4.5% for Grade II (by mass of total mix), subject to mix design criteria.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> Set of sieves including 45mm, 37.5mm, 26.5mm, 19mm, 13.2mm, 4.75mm, 2.36mm, 0.300mm, and 0.075mm.</li>
                                <li><strong>Balance:</strong> Sensitive balance for weighing aggregates and filler.</li>
                                <li><strong>Oven:</strong> For drying aggregates.</li>
                                <li><strong>Solvent extraction apparatus (Centrifuge/Reflux):</strong> If testing bitumen content from field mix.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Sampling:</strong> Obtain representative samples of the aggregates (coarse, fine, and filler).</li>
                                <li><strong>Proportioning:</strong> Combine the aggregates in specific proportions to achieve the target grading (Job Mix Formula).</li>
                                <li><strong>Sieve Analysis:</strong> Perform sieve analysis on the combined aggregate mix (dry) to check conformity with MORTH Grading I or II.</li>
                                <li><strong>Wash Sieve:</strong> For accurate determination of passing 0.075mm, a wet sieving is recommended.</li>
                                <li><strong>Result:</strong> Plot the gradation curve and ensure it fits within the specified envelopes.</li>
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
                                    <i className="fas fa-road text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">DBM Calculator</h3>
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
