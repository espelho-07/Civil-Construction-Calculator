import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// MSS Grading Data (IRC:SP:78-2008 / MORTH)
const MSS_DATA = {
    'Type A': {
        title: 'Type A (Close-Graded)',
        desc: 'For High Rainfall Areas (>1500 mm)',
        sieves: [
            { size: '13.2 mm', min: 100, max: 100 },
            { size: '11.2 mm', min: 100, max: 100 },
            { size: '5.6 mm', min: 52, max: 88 },
            { size: '2.8 mm', min: 14, max: 38 },
            { size: '0.090 mm', min: 0, max: 5 }
        ]
    },
    'Type B': {
        title: 'Type B (Open-Graded)',
        desc: 'For Low Rainfall Areas (<1500 mm)',
        sieves: [
            { size: '13.2 mm', min: 100, max: 100 },
            { size: '11.2 mm', min: 88, max: 100 },
            { size: '5.6 mm', min: 31, max: 52 },
            { size: '2.8 mm', min: 5, max: 25 },
            { size: '0.090 mm', min: 0, max: 5 }
        ]
    }
};

export default function MSSCalculator() {
    const location = useLocation();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');
    const [grade, setGrade] = useState('Type A');
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});

    const currentData = MSS_DATA[grade];
    const sidebarRef = useRef(null);

    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    useEffect(() => {
        const totalWeight = parseFloat(sampleWeight);
        if (!totalWeight || totalWeight <= 0) {
            setResults({});
            return;
        }

        const newResults = {};
        let cumRetainedWeight = 0;

        currentData.sieves.forEach(sieve => {
            const retained = parseFloat(inputs[sieve.size] || 0);
            cumRetainedWeight += retained;

            const percentRetained = (retained / totalWeight) * 100;
            const cumPercentRetained = (cumRetainedWeight / totalWeight) * 100;
            const percentPassing = 100 - cumPercentRetained;

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
    }, [inputs, grade, sampleWeight]);

    const reset = () => {
        setInputs({});
        setSampleWeight('');
        setResults({});
    };

    const gradeOptions = Object.keys(MSS_DATA).map(g => ({ value: g, label: g }));

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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Mix Seal Surfacing (MSS) Calculator</h1>
                            <p className="text-[#6b7280]">Close Graded Premix Surfacing (MORTH / IRC:SP:78)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="mss-grading"
                            calculatorName="MSS Grading Calculator"
                            calculatorIcon="fa-layer-group"
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
                                        <i className="fas fa-layer-group text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Grading Analysis</h3>
                                        <p className="text-white/80 text-xs">{grade}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {/* Sample Weight Input */}
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <i className="fas fa-balance-scale text-gray-500"></i>
                                        Total Sample Weight (g):
                                    </label>
                                    <input
                                        type="number"
                                        value={sampleWeight}
                                        onChange={(e) => setSampleWeight(e.target.value)}
                                        className={`w-32 px-3 py-1.5 border border-gray-300 rounded text-center outline-none ${theme.focus} focus:ring-2 bg-white`}
                                        placeholder="e.g. 5000"
                                    />
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-[#f8f9fa]">
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-left">IS Sieve</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center w-32">Weight Retained (g)</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center bg-gray-50">% Retained</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center bg-gray-50">Cum. % Retained</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center font-bold bg-blue-50/30">% Passing</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center text-gray-500">Limits</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.sieves.map((sieve, idx) => {
                                                const res = results[sieve.size];

                                                return (
                                                    <tr key={idx}>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 font-medium">{sieve.size}</td>
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
                                                        <td className="border border-[#e5e7eb] px-4 py-2 text-center font-bold text-blue-700 bg-blue-50/30">
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
                                    <div className="flex justify-center gap-3 mt-4">
                                        <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                            <i className="fas fa-redo mr-1"></i> Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* Technical Content */}
                    <div className="space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Theory</h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Mix Seal Surfacing (MSS) is a type of thin bituminous surfacing used to prevent the ingress of water into the pavement and to provide a skid-resistant wearing surface. It is usually 20 mm thick and laid on a prepared base.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Type A (Close-Graded) is dense and recommended for high rainfall areas to provide better waterproofing. Type B (Open-Graded) is suitable for low rainfall areas. The mix design is recipe-based, ensuring the aggregate gradation falls within the specified limits.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 13.2mm, 11.2mm, 5.6mm, 2.8mm, and 0.090mm (90 micron).</li>
                                <li><strong>Balance:</strong> Suitable capacity and accuracy.</li>
                                <li><strong>Oven:</strong> Thermostatically controlled.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Sampling:</strong> Sample aggregates from the stockpile.</li>
                                <li><strong>Sieving:</strong> Perform sieve analysis to determine the percentage passing each sieve.</li>
                                <li><strong>Mix Design:</strong> Combine aggregates to meet Type A or Type B gradation.</li>
                                <li><strong>Binder:</strong> Use the specified quantity of binder (typically 22 kg/10 sq.m for Type A and 19 kg/10 sq.m for Type B).</li>
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
                                    <i className="fas fa-layer-group text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">MSS Calculator</h3>
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
