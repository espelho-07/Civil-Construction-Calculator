import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

// Mastic Asphalt Coarse Aggregate Grading (MORTH Table 500-30)
const MASTIC_DATA = {
    title: 'Coarse Aggregate for Mastic Asphalt',
    desc: 'Grading of Coarse Aggregate (Nominal Size 13mm)',
    sieves: [
        { size: '19 mm', min: 100, max: 100 },
        { size: '13.2 mm', min: 88, max: 96 },
        { size: '2.36 mm', min: 0, max: 5 }
    ]
};

export default function MasticAsphaltCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});
    const sidebarRef = useRef(null);

    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const newResults = {};
        MASTIC_DATA.sieves.forEach(sieve => {
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
            <CategoryNav activeCategory={isBlending ? 'blending-aggregates' : 'sieve-analysis-aggregates'} />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Mastic Asphalt Calculator</h1>
                            <p className="text-[#6b7280]">Mastic Asphalt Grading Analysis (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="mastic-asphalt"
                            calculatorName="Mastic Asphalt Calculator"
                            calculatorIcon="fa-cube"
                            category="Sieve Analysis"
                            inputs={{ inputs }}
                            outputs={results}
                        />
                    </div>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-cube text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Grading Analysis</h3>
                                        <p className="text-white/80 text-xs">Coarse Aggregate</p>
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
                                        {MASTIC_DATA.sieves.map((sieve, idx) => (
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
                                Mastic Asphalt is a dense, voidless mixture of bitumen, fine aggregate, and mineral filler, to which coarse aggregate is added. It is applied in a molten state and smoothed by hand floating. It acts as an impervious, durable, and deformation-resistant surfacing, often used on bridge decks and high-stress areas like junctions.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The mix is characterized by a high binder content (14-17%) and a large proportion of filler. The coarse aggregate (typically 13mm nominal size) is added to the mastic cooked in a mechanical mixer (cooker). The grading of the coarse aggregate is crucial to ensure proper interlocking within the mastic mortar.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 19mm, 13.2mm, 2.36mm (for coarse aggregate); additional fine sieves for filler analysis.</li>
                                <li><strong>Mastic Cooker:</strong> Mechanically agitated cooker for preparing the mix.</li>
                                <li><strong>Hardness Number Apparatus:</strong> To test the hardness of the final mastic.</li>
                                <li><strong>Thermometers:</strong> To monitor temperature (175-205°C).</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Aggregates:</strong> Test Coarse and Fine aggregates separately for grading.</li>
                                <li><strong>Cooking:</strong> Heat the filler and fine aggregates, then add bitumen. Cook for specified time.</li>
                                <li><strong>Addition of Stone:</strong> Add the graded coarse aggregate to the cooked mastic and mix until uniform.</li>
                                <li><strong>Hardness:</strong> Perform the Hardness Number test on the finished block to ensure it meets requirements (ranges between 15-50 typically depending on grade).</li>
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
                                    <i className="fas fa-cube text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">Mastic Asphalt Grade</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-xs text-[#6b7280] mt-2">
                                Voidless bituminous mixture analysis.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
