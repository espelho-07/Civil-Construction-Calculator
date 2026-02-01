import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

// WMM Grading Data (MORTH Table 400-11)
const WMM_DATA = {
    title: 'WMM Grading',
    desc: 'Grading requirements for Wet Mix Macadam (WMM) as per MORTH specifications.',
    sieves: [
        { size: '53.00 mm', min: 100, max: 100 },
        { size: '45.00 mm', min: 95, max: 100 },
        { size: '22.40 mm', min: 60, max: 80 },
        { size: '11.20 mm', min: 40, max: 60 },
        { size: '4.75 mm', min: 25, max: 40 },
        { size: '2.36 mm', min: 15, max: 30 },
        { size: '0.600 mm', min: 8, max: 22 },
        { size: '0.075 mm', min: 0, max: 8 }
    ]
};

export default function WMMCalculator() {
    const theme = getThemeClasses('blue');
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});
    const sidebarRef = useRef(null);

    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const newResults = {};
        WMM_DATA.sieves.forEach(sieve => {
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
    }, [inputs]);

    const reset = () => {
        setInputs({});
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

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="sieve-analysis-aggregates" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Wet Mix Macadam (WMM) Calculator</h1>
                            <p className="text-[#6b7280]">Grading Analysis for Wet Mix Macadam (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="wmm-grading"
                            calculatorName="WMM Grading Calculator"
                            calculatorIcon="fa-layer-group"
                            category="Sieve Analysis"
                            inputs={{ inputs }}
                            outputs={results}
                        />
                    </div>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 ${theme.bg}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-layer-group text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Grading Analysis</h3>
                                        <p className="text-white/80 text-xs">Standard WMM</p>
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
                                        {WMM_DATA.sieves.map((sieve, idx) => (
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
                                Wet Mix Macadam (WMM) serves as a base course in flexible pavement construction. It consists of clean, crushed, graded aggregates and granular material, premixed with water to a dense mass on a prepared sub-grade or sub-base. Unlike Water Bound Macadam (WBM), which uses dry aggregates and water sprinkled during compaction, WMM is mixed with water in a plant before laying, ensuring better moisture control and homogeneity.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The material for WMM should satisfy the grading requirements specified in MORTH Table 400-11. The combined aggregate must be well-graded to minimize voids and maximize stability. The Optimum Moisture Content (OMC) is determined in the laboratory (IS: 2720 Part 8), and the mix is laid at this moisture content to achieve Maximum Dry Density (MDD).
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 53mm, 45mm, 22.4mm, 11.2mm, 4.75mm, 2.36mm, 600 micron, and 75 micron.</li>
                                <li><strong>Balance:</strong> Heavy-duty balance (min 50kg capacity) and sensitive balance (0.1g accuracy).</li>
                                <li><strong>Oven:</strong> Thermostatically controlled oven (110 ± 5°C).</li>
                                <li><strong>Containers and Trays:</strong> For handling samples.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Sample Preparation:</strong> Take a representative sample of the WMM mix (dry aggregates). The sample size should be at least 25 kg.</li>
                                <li><strong>Washing (if required):</strong> If the material has significant fines adhering to coarse particles, wash the sample over a 75-micron sieve to separate fines. Dry the retained material.</li>
                                <li><strong>Sieving:</strong> Place the sample in the set of sieves arranged in descending order. Shake mechanically or manually for sufficient time.</li>
                                <li><strong>Weighing:</strong> Weigh the material retained on each sieve.</li>
                                <li><strong>Calculation:</strong> Calculate the cumulative percentage passing for each sieve size.</li>
                                <li><strong>Verification:</strong> Compare the results with the standard grading limits (MORTH Table 400-11). The material passing 425 micron should also be tested for plasticity index (PI should be less than 6).</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 ${theme.bg} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-layer-group text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">WMM Calculator</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-xs text-[#6b7280] mt-2">
                                Verify aggregate gradation for Wet Mix Macadam base course construction.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
