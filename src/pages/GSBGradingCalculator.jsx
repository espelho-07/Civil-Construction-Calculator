import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// GSB Grading Data (MORTH Table 400-1)
const GRADING_DATA = {
    'Grade I': {
        title: 'Grade I',
        desc: 'For coarse graded granular sub-base materials.',
        sieves: [
            { size: '75 mm', min: 100, max: 100 },
            { size: '53 mm', min: 80, max: 100 },
            { size: '26.5 mm', min: 55, max: 90 },
            { size: '9.5 mm', min: 35, max: 65 },
            { size: '4.75 mm', min: 25, max: 55 },
            { size: '2.36 mm', min: 20, max: 40 },
            { size: '0.425 mm', min: 10, max: 25 },
            { size: '0.075 mm', min: 3, max: 10 }
        ]
    },
    'Grade II': {
        title: 'Grade II',
        desc: 'For coarse graded granular sub-base materials.',
        sieves: [
            { size: '53 mm', min: 100, max: 100 },
            { size: '26.5 mm', min: 50, max: 80 },
            { size: '9.5 mm', min: 25, max: 50 },
            { size: '4.75 mm', min: 15, max: 40 },
            { size: '2.36 mm', min: 10, max: 30 },
            { size: '0.425 mm', min: 8, max: 25 },
            { size: '0.075 mm', min: 3, max: 10 }
        ]
    },
    'Grade III': {
        title: 'Grade III',
        desc: 'For coarse graded granular sub-base materials.',
        sieves: [
            { size: '26.5 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 65, max: 95 },
            { size: '4.75 mm', min: 50, max: 80 },
            { size: '0.425 mm', min: 20, max: 45 },
            { size: '0.075 mm', min: 3, max: 10 }
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

export default function GSBGradingCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Grade I');
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
            <CategoryNav activeCategory={isBlending ? 'blending-aggregates' : 'sieve-analysis-aggregates'} />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">GSB Grading Calculator</h1>
                            <p className="text-[#6b7280]">Granular Sub-Base Grading Analysis (MORT&H)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="gsb-grading"
                            calculatorName="GSB Grading Calculator"
                            calculatorIcon="fa-filter"
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
                                        <i className="fas fa-filter text-white"></i>
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

                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>

                    <div className="space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Theory</h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Granular Sub-Base (GSB) is typically the first layer of aggregate placed on top of the subgrade in road construction. It serves as a load-bearing layer and also acts as a drainage layer to prevent capillary rise of water and to drain away water that may enter the pavement structure. The material used for GSB typically consists of natural sand, moorum, gravel, crushed stone, or combination thereof depending upon the grading required. Strict adherence to grading requirements ensures the GSB layer has adequate stability, permeability, and load-spreading capacity.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The Ministry of Road Transport and Highways (MORTH) specifies different grades (I to VI) for GSB materials, each with limits on the percentage of material passing through standard IS sieves. This gradation ensures a dense, stable mix when compacted.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> A set of IS sieves of sizes 75mm, 53mm, 26.5mm, 9.5mm, 4.75mm, 2.36mm, 0.425mm, and 0.075mm, along with a bottom pan and lid.</li>
                                <li><strong>Balance:</strong> A balance readable and accurate to 0.1% of the weight of the test sample.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled oven capable of maintaining a temperature of 110 ± 5°C.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical sieve shaker (optional but recommended) or manual shaking arrangement.</li>
                                <li><strong>Trays and Brushes:</strong> For handling and cleaning aggregates.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Preparation of Sample:</strong> Take a representative sample of the GSB material. The weight of the sample depends on the maximum size of the aggregate but should be sufficient to be representative (e.g., 10-20 kg).</li>
                                <li><strong>Drying:</strong> Dry the sample in an oven at 110 ± 5°C to a constant weight. Allow it to cool.</li>
                                <li><strong>Weighing:</strong> Weigh the dried sample accurately (W<sub>total</sub>).</li>
                                <li><strong>Sieving:</strong> Arrange the sieves in descending order of size (largest aperture at the top). Place the sample on the top sieve and shake the nest of sieves manually or using a mechanical shaker for about 10-15 minutes.</li>
                                <li><strong>Weighing Retained Material:</strong> Weigh the material retained on each sieve (W<sub>retained</sub>).</li>
                                <li><strong>Calculation:</strong> Calculate the cumulative weight retained and the cumulative percentage retained for each sieve. Finally, calculate the percentage passing by subtracting the cumulative percentage retained from 100.</li>
                                <li><strong>Reporting:</strong> Compare the percentage passing values with the MORTH specified limits for the selected Grade (I, II, etc.) to determine if the material is suitable.</li>
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
                                    <i className="fas fa-filter text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">GSB Calculator</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-1 block font-medium">Select Grade</label>
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
