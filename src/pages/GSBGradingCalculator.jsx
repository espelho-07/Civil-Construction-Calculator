import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

const GSB_GRADINGS = {
    'grading-1': {
        title: 'GSB Grading-I (Sub-base for pavements)',
        sieves: ['75 mm', '53 mm', '26.5 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.425 mm', '0.075 mm', 'Pan'],
        limits: { '75 mm': [100, 100], '53 mm': [80, 100], '26.5 mm': [55, 90], '9.5 mm': [35, 65], '4.75 mm': [25, 55], '2.36 mm': [20, 40], '0.425 mm': [10, 25], '0.075 mm': [3, 10] }
    },
    'grading-2': {
        title: 'GSB Grading-II (Sub-base for pavements)',
        sieves: ['75 mm', '53 mm', '26.5 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.425 mm', '0.075 mm', 'Pan'],
        limits: { '75 mm': [100, 100], '53 mm': [80, 100], '26.5 mm': [55, 90], '9.5 mm': [35, 65], '4.75 mm': [25, 55], '2.36 mm': [20, 40], '0.425 mm': [10, 25], '0.075 mm': [3, 10] }
    },
    'grading-3': {
        title: 'GSB Grading-III (Close graded)',
        sieves: ['53 mm', '26.5 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.425 mm', '0.075 mm', 'Pan'],
        limits: { '53 mm': [100, 100], '26.5 mm': [55, 75], '9.5 mm': [35, 60], '4.75 mm': [25, 45], '2.36 mm': [15, 35], '0.425 mm': [8, 22], '0.075 mm': [0, 8] }
    },
    'grading-4': {
        title: 'GSB Grading-IV (Coarse graded)',
        sieves: ['53 mm', '45 mm', '22.4 mm', '11.2 mm', '4.75 mm', '2.36 mm', '0.6 mm', '0.075 mm', 'Pan'],
        limits: { '53 mm': [100, 100], '45 mm': [95, 100], '22.4 mm': [60, 80], '11.2 mm': [40, 60], '4.75 mm': [25, 40], '2.36 mm': [15, 30], '0.6 mm': [8, 22], '0.075 mm': [0, 8] }
    },
    'grading-5': {
        title: 'GSB Grading-V (Fine graded)',
        sieves: ['26.5 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.425 mm', '0.075 mm', 'Pan'],
        limits: { '26.5 mm': [100, 100], '9.5 mm': [50, 80], '4.75 mm': [35, 60], '2.36 mm': [25, 45], '0.425 mm': [12, 28], '0.075 mm': [3, 10] }
    },
    'grading-6': {
        title: 'GSB Grading-VI (Open graded)',
        sieves: ['53 mm', '45 mm', '26.5 mm', '9.5 mm', '4.75 mm', '0.075 mm', 'Pan'],
        limits: { '53 mm': [100, 100], '45 mm': [95, 100], '26.5 mm': [25, 60], '9.5 mm': [0, 20], '4.75 mm': [0, 10], '0.075 mm': [0, 5] }
    }
};

export default function GSBGradingCalculator() {
    const [grading, setGrading] = useState('grading-1');
    const [numMaterials, setNumMaterials] = useState(2);
    const [sampleWeight, setSampleWeight] = useState(5000);
    const [materialsData, setMaterialsData] = useState({});
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const currentGrading = GSB_GRADINGS[grading];

    useEffect(() => {
        const initialData = {};
        for (let m = 0; m < numMaterials; m++) {
            initialData[`material_${m}`] = {};
            currentGrading.sieves.forEach(sieve => {
                initialData[`material_${m}`][sieve] = 0;
            });
        }
        setMaterialsData(initialData);
    }, [grading, numMaterials]);

    const calculate = () => {
        const blendedResult = {};
        const materialPercentages = Array(numMaterials).fill(100 / numMaterials);

        currentGrading.sieves.forEach(sieve => {
            let blendedRetained = 0;
            for (let m = 0; m < numMaterials; m++) {
                const retained = materialsData[`material_${m}`]?.[sieve] || 0;
                blendedRetained += (retained * materialPercentages[m]) / 100;
            }
            blendedResult[sieve] = {
                retained: blendedRetained.toFixed(2),
                cumRetained: 0,
                passing: 0,
            };
        });

        let cumulative = 0;
        currentGrading.sieves.forEach(sieve => {
            cumulative += parseFloat(blendedResult[sieve].retained);
            blendedResult[sieve].cumRetained = ((cumulative / sampleWeight) * 100).toFixed(2);
            blendedResult[sieve].passing = (100 - parseFloat(blendedResult[sieve].cumRetained)).toFixed(2);
        });

        setResults(blendedResult);
    };

    const updateMaterialData = (materialIndex, sieve, value) => {
        setMaterialsData(prev => ({
            ...prev,
            [`material_${materialIndex}`]: {
                ...prev[`material_${materialIndex}`],
                [sieve]: Number(value)
            }
        }));
    };

    useEffect(() => { if (Object.keys(materialsData).length > 0) calculate(); }, [materialsData, sampleWeight]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const relatedCalculators = [
        { name: 'WBM Grading', icon: 'fa-road', slug: '/wbm-grading' },
        { name: 'WMM Grading', icon: 'fa-road', slug: '/wmm-grading' },
        { name: 'DBM Grading', icon: 'fa-road', slug: '/dbm-grading' },
        { name: 'BC Grading', icon: 'fa-road', slug: '/bituminous-concrete' },
        { name: 'Bituminous Macadam', icon: 'fa-fill-drip', slug: '/bituminous-macadam' },
        { name: 'SMA Grading', icon: 'fa-layer-group', slug: '/sma-grading' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="sieve-analysis-aggregates" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Granular Sub-Base (GSB) Grading</h1>
                    <p className="text-[#6b7280] mb-6">{currentGrading.title}</p>

                    {/* What is GSB? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Granular Sub-Base (GSB)?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Granular Sub-Base (GSB) is a layer of granular material placed between the subgrade and the base course of a pavement. It helps distribute loads from the upper layers and provides drainage and frost protection.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                GSB is constructed using natural gravel, crushed stone, or a blend of both. Six gradings are available as per MoRTH specifications for different applications.
                            </p>
                        </div>
                    </section>

                    {/* Grading Selection */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-sliders-h text-[#3B68FC]"></i>
                            Select GSB Grading
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(GSB_GRADINGS).map(([key, g]) => (
                                <div key={key} onClick={() => setGrading(key)} className={`bg-white rounded-xl p-3 border-2 cursor-pointer transition-all ${grading === key ? 'border-[#3B68FC] shadow-lg' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`}>
                                    <div className="text-center font-medium text-[#0A0A0A] text-sm">{key.replace('-', ' ').toUpperCase()}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Grading Requirements Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-table text-[#3B68FC]"></i>
                            MoRTH Grading Requirements
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-3 py-2">Sieve Size</th><th className="border px-3 py-2">Min % Passing</th><th className="border px-3 py-2">Max % Passing</th></tr></thead>
                                <tbody>
                                    {currentGrading.sieves.filter(s => s !== 'Pan').map(sieve => (
                                        <tr key={sieve}>
                                            <td className="border px-3 py-2 font-medium">{sieve}</td>
                                            <td className="border px-3 py-2 text-center text-[#3B68FC]">{currentGrading.limits[sieve]?.[0] || 0}</td>
                                            <td className="border px-3 py-2 text-center text-[#3B68FC]">{currentGrading.limits[sieve]?.[1] || 100}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Blended Result */}
                    {results && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-chart-bar text-[#3B68FC]"></i>
                                Blended Aggregate Result
                            </h2>
                            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="bg-gradient-to-r from-slate-50 to-gray-100"><th className="border px-3 py-2">Sieve</th><th className="border px-3 py-2">Retained (g)</th><th className="border px-3 py-2">Cum. Retained %</th><th className="border px-3 py-2">% Passing</th><th className="border px-3 py-2">Status</th></tr></thead>
                                    <tbody>
                                        {currentGrading.sieves.map(sieve => {
                                            const passing = parseFloat(results[sieve]?.passing || 0);
                                            const limits = currentGrading.limits[sieve];
                                            const isWithinLimits = sieve === 'Pan' || !limits || (passing >= limits[0] && passing <= limits[1]);
                                            return (
                                                <tr key={sieve}>
                                                    <td className="border px-3 py-2 font-medium">{sieve}</td>
                                                    <td className="border px-3 py-2 text-center">{results[sieve]?.retained}</td>
                                                    <td className="border px-3 py-2 text-center">{results[sieve]?.cumRetained}</td>
                                                    <td className="border px-3 py-2 text-center font-bold text-[#3B68FC]">{results[sieve]?.passing}</td>
                                                    <td className={`border px-3 py-2 text-center font-bold ${isWithinLimits ? 'text-green-600' : 'text-red-600'}`}>
                                                        {sieve === 'Pan' ? '-' : (isWithinLimits ? '✓ Within' : '✗ Out')}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Important Factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            Important Factors
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Material Quality', desc: 'Clean, hard, durable aggregates', icon: 'fa-gem' },
                                    { title: 'Compaction', desc: '98% of MDD required', icon: 'fa-compress-arrows-alt' },
                                    { title: 'Layer Thickness', desc: '100-200mm per layer', icon: 'fa-ruler-vertical' },
                                    { title: 'Moisture Content', desc: 'OMC ± 2% for compaction', icon: 'fa-tint' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                                        <i className={`fas ${item.icon} text-[#3B68FC] mt-1`}></i>
                                        <div>
                                            <div className="font-medium text-[#0A0A0A]">{item.title}</div>
                                            <div className="text-sm text-[#6b7280]">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-th-large text-[#3B68FC]"></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className="bg-white border border-[#e5e7eb] rounded-lg p-4 hover:shadow-lg hover:border-[#3B68FC] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} text-[#3B68FC] group-hover:scale-110 transition-transform`}></i>
                                        <span className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#3B68FC]">{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Calculator Sidebar */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] bg-gradient-to-r from-slate-50 to-gray-100 flex items-center gap-3">
                            <i className="fas fa-layer-group text-xl text-slate-600"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">GSB Grading Calculator</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">No. of Materials</label>
                                    <select value={numMaterials} onChange={(e) => setNumMaterials(Number(e.target.value))} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:border-[#3B68FC] outline-none">
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Sample Weight (g)</label>
                                    <input type="number" value={sampleWeight} onChange={(e) => setSampleWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:border-[#3B68FC] outline-none" />
                                </div>
                            </div>

                            <div className="overflow-x-auto mb-4 max-h-80 overflow-y-auto border border-[#e5e7eb] rounded-lg">
                                <table className="w-full text-xs">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="px-2 py-2 text-left">Sieve</th>
                                            {Array.from({ length: numMaterials }).map((_, i) => (
                                                <th key={i} className="px-2 py-2">Mat. {String.fromCharCode(65 + i)}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentGrading.sieves.map(sieve => (
                                            <tr key={sieve} className="border-t border-[#e5e7eb]">
                                                <td className="px-2 py-2 font-medium text-xs whitespace-nowrap">{sieve}</td>
                                                {Array.from({ length: numMaterials }).map((_, m) => (
                                                    <td key={m} className="px-1 py-1">
                                                        <input type="number" value={materialsData[`material_${m}`]?.[sieve] || 0} onChange={(e) => updateMaterialData(m, sieve, e.target.value)} className="w-16 px-2 py-1 border border-[#e5e7eb] rounded text-xs text-center focus:border-[#3B68FC] outline-none" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setMaterialsData({})} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                                    <i className="fas fa-redo mr-2"></i>Reset
                                </button>
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#2952d9] transition-colors">
                                    <i className="fas fa-calculator mr-2"></i>Calculate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
