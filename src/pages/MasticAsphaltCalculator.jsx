import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

// Mastic Asphalt Grading Data (MORTH Table 500-30)
const MASTIC_DATA = {
    'Coarse': {
        title: 'Coarse Aggregate for Mastic Asphalt',
        desc: 'Grading of Coarse Aggregate (Nominal Size 13mm)',
        sieves: [
            { size: '19 mm', min: 100, max: 100 },
            { size: '13.2 mm', min: 88, max: 96 },
            { size: '2.36 mm', min: 0, max: 5 }
        ]
    },
    'Fine': {
        title: 'Fine Aggregate for Mastic Asphalt',
        desc: 'Grading of Fine Aggregate',
        sieves: [
            { size: '2.36 mm', min: 100, max: 100 },
            { size: '1.18 mm', min: 90, max: 100 },
            { size: '0.600 mm', min: 60, max: 80 },
            { size: '0.300 mm', min: 30, max: 50 },
            { size: '0.150 mm', min: 15, max: 30 },
            { size: '0.075 mm', min: 5, max: 15 }
        ]
    }
};

export default function MasticAsphaltCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');

    // Extract type from URL
    const getTypeFromURL = () => {
        if (location.pathname.includes('mastic-fine')) return 'Fine';
        return 'Coarse';
    };

    const [type, setType] = useState(getTypeFromURL());
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});
    const sidebarRef = useRef(null);

    const currentData = MASTIC_DATA[type];

    // Update type when URL changes
    useEffect(() => {
        const newType = getTypeFromURL();
        if (newType !== type) {
            setType(newType);
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
    }, [inputs, sampleWeight, currentData]);

    const reset = () => {
        setInputs({});
        setSampleWeight('');
        setResults({});
    };

    // Handle type change - navigate to correct URL
    const handleTypeChange = (newType) => {
        const typeSlug = newType === 'Coarse' ? 'coarse' : 'fine';
        const basePath = isBlending ? '/blending-aggregates' : '/sieve-analysis';
        navigate(`${basePath}/mastic-${typeSlug}`);
    };

    // Back to category
    const handleBack = () => {
        navigate(isBlending ? '/category/blending-aggregates' : '/category/sieve-analysis-aggregates');
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
                                <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">Mastic Asphalt Calculator</h1>
                                <p className="text-[#6b7280]">Mastic Asphalt Grading Analysis (MORTH)</p>
                            </div>
                        </div>
                        <CalculatorActions
                            calculatorSlug="mastic-asphalt"
                            calculatorName="Mastic Asphalt Calculator"
                            calculatorIcon="fa-cube"
                            category={isBlending ? "Blending of Aggregates" : "Sieve Analysis"}
                            inputs={{ type, inputs }}
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
                                        <i className="fas fa-cube text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">
                                            {isBlending ? 'Blending of Aggregates' : 'Sieve Analysis - Retained Weight Method'}
                                        </h3>
                                        <p className="text-white/80 text-xs">{currentData.title} - MORTH Table 500-30</p>
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

                    {/* Bottom Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mt-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
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
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-1 block font-medium">Select Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${theme.focus}`}
                                >
                                    <option value="Coarse">Coarse Aggregate</option>
                                    <option value="Fine">Fine Aggregate</option>
                                </select>
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
