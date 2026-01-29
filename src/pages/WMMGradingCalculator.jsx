import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

const WMM_GRADING = {
    title: 'Wet Mix Macadam (WMM) Grading',
    sieves: ['53 mm', '45 mm', '26.5 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.425 mm', '0.075 mm', 'Pan'],
    limits: { '53 mm': [100, 100], '45 mm': [95, 100], '26.5 mm': [60, 80], '9.5 mm': [40, 60], '4.75 mm': [25, 40], '2.36 mm': [15, 30], '0.425 mm': [8, 20], '0.075 mm': [0, 5] }
};

export default function WMMGradingCalculator() {
    const [numMaterials, setNumMaterials] = useState(2);
    const [sampleWeight, setSampleWeight] = useState(5000);
    const [materialsData, setMaterialsData] = useState({});
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const initialData = {};
        for (let m = 0; m < numMaterials; m++) {
            initialData[`material_${m}`] = {};
            WMM_GRADING.sieves.forEach(sieve => {
                initialData[`material_${m}`][sieve] = 0;
            });
        }
        setMaterialsData(initialData);
    }, [numMaterials]);

    const calculate = () => {
        const blendedResult = {};
        const materialPercentages = Array(numMaterials).fill(100 / numMaterials);

        WMM_GRADING.sieves.forEach(sieve => {
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
        WMM_GRADING.sieves.forEach(sieve => {
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
        { name: 'GSB Grading', icon: 'fa-layer-group', slug: '/gsb-grading' },
        { name: 'WBM Grading', icon: 'fa-road', slug: '/wbm-grading' },
        { name: 'DBM Grading', icon: 'fa-road', slug: '/dbm-grading' },
        { name: 'BC Grading', icon: 'fa-road', slug: '/bituminous-concrete' },
        { name: 'Bituminous Macadam', icon: 'fa-fill-drip', slug: '/bituminous-macadam' },
        { name: 'SMA Grading', icon: 'fa-layer-group', slug: '/sma-grading' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="blending" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Wet Mix Macadam (WMM)</h1>
                    <p className="text-[#6b7280] mb-6">{WMM_GRADING.title}</p>

                    {/* What is WMM? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Wet Mix Macadam (WMM)?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Wet Mix Macadam (WMM) is a mechanically stabilized base/sub-base course material prepared by mixing crushed aggregates with water at optimum moisture content and compacting to achieve maximum density.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                WMM provides excellent load distribution and is commonly used as a base course beneath bituminous layers. It has better strength characteristics than WBM due to proper grading and mechanical binding.
                            </p>
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
                                    {WMM_GRADING.sieves.filter(s => s !== 'Pan').map(sieve => (
                                        <tr key={sieve}>
                                            <td className="border px-3 py-2 font-medium">{sieve}</td>
                                            <td className="border px-3 py-2 text-center text-[#3B68FC]">{WMM_GRADING.limits[sieve]?.[0] || 0}</td>
                                            <td className="border px-3 py-2 text-center text-[#3B68FC]">{WMM_GRADING.limits[sieve]?.[1] || 100}</td>
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
                                    <thead><tr className="bg-gradient-to-r from-teal-50 to-emerald-50"><th className="border px-3 py-2">Sieve</th><th className="border px-3 py-2">Retained (g)</th><th className="border px-3 py-2">Cum. Retained %</th><th className="border px-3 py-2">% Passing</th><th className="border px-3 py-2">Status</th></tr></thead>
                                    <tbody>
                                        {WMM_GRADING.sieves.map(sieve => {
                                            const passing = parseFloat(results[sieve]?.passing || 0);
                                            const limits = WMM_GRADING.limits[sieve];
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
                                    { title: 'Aggregate Quality', desc: 'Clean, hard, durable crushed stone', icon: 'fa-gem' },
                                    { title: 'Moisture Content', desc: 'OMC ± 2% for proper compaction', icon: 'fa-tint' },
                                    { title: 'Compaction', desc: '98% of MDD required', icon: 'fa-compress-arrows-alt' },
                                    { title: 'Layer Thickness', desc: '150-200mm per compacted layer', icon: 'fa-ruler-vertical' },
                                    { title: 'CBR Value', desc: 'Min 30% after 4 days soaking', icon: 'fa-chart-line' },
                                    { title: 'Plasticity Index', desc: 'Max 6% for fines', icon: 'fa-filter' },
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
                        <div className="px-5 py-4 border-b border-[#e5e7eb] bg-gradient-to-r from-teal-50 to-emerald-50 flex items-center gap-3">
                            <i className="fas fa-road text-xl text-teal-700"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">WMM Grading Calculator</h2>
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
                                        {WMM_GRADING.sieves.map(sieve => (
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
