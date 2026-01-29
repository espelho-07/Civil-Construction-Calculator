import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

const MASTIC_ASPHALT_TYPES = {
    'coarse': {
        title: 'Mastic Asphalt (Coarse Aggregate)',
        sieves: ['19 mm', '13.2 mm', '2.36 mm', 'Pan'],
        limits: { '19 mm': [100, 100], '13.2 mm': [95, 100], '2.36 mm': [0, 5] }
    },
    'fine': {
        title: 'Mastic Asphalt (Fine Aggregate)',
        sieves: ['2.36 mm', '0.6 mm', '0.212 mm', '0.075 mm', 'Pan'],
        limits: { '2.36 mm': [100, 100], '0.6 mm': [70, 100], '0.212 mm': [25, 75], '0.075 mm': [5, 25] }
    }
};

export default function MasticAsphaltCalculator() {
    const [type, setType] = useState('coarse');
    const [numMaterials, setNumMaterials] = useState(2);
    const [sampleWeight, setSampleWeight] = useState(5000);
    const [materialsData, setMaterialsData] = useState({});
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const currentType = MASTIC_ASPHALT_TYPES[type];

    useEffect(() => {
        const initialData = {};
        for (let m = 0; m < numMaterials; m++) {
            initialData[`material_${m}`] = {};
            currentType.sieves.forEach(sieve => {
                initialData[`material_${m}`][sieve] = 0;
            });
        }
        setMaterialsData(initialData);
    }, [type, numMaterials]);

    const calculate = () => {
        const blendedResult = {};
        const materialPercentages = Array(numMaterials).fill(100 / numMaterials);

        currentType.sieves.forEach(sieve => {
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
        currentType.sieves.forEach(sieve => {
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
        { name: 'SMA Grading', icon: 'fa-layer-group', slug: '/sma-grading' },
        { name: 'BC Grading', icon: 'fa-road', slug: '/bituminous-concrete' },
        { name: 'DBM Grading', icon: 'fa-road', slug: '/dbm-grading' },
        { name: 'Slurry Seal', icon: 'fa-water', slug: '/slurry-seal' },
        { name: 'Surface Dressing', icon: 'fa-brush', slug: '/surface-dressing' },
        { name: 'Sand Asphalt', icon: 'fa-road', slug: '/sand-asphalt' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="sieve-analysis-aggregates" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Mastic Asphalt</h1>
                    <p className="text-[#6b7280] mb-6">{currentType.title}</p>

                    {/* What is Mastic Asphalt? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Mastic Asphalt?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Mastic Asphalt is a voidless, impermeable mixture of fine and coarse aggregates with high bitumen content. It is heated to a workable consistency and laid in a continuous mass without compaction.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                It provides excellent waterproofing and is used for flooring, roofing, tanking, and road surfacing. Available in <strong>Coarse Aggregate</strong> and <strong>Fine Aggregate</strong> gradings.
                            </p>
                        </div>
                    </section>

                    {/* Type Selection */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-sliders-h text-[#3B68FC]"></i>
                            Select Aggregate Type
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(MASTIC_ASPHALT_TYPES).map(([key, t]) => (
                                <div key={key} onClick={() => setType(key)} className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${type === key ? 'border-[#3B68FC] shadow-lg' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`}>
                                    <div className="text-center font-medium text-[#0A0A0A]">{key === 'coarse' ? 'Coarse Aggregate' : 'Fine Aggregate'}</div>
                                    <div className="text-center text-xs text-[#6b7280]">{key === 'coarse' ? '13.2-19mm sizes' : '0.075-2.36mm sizes'}</div>
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
                                    {currentType.sieves.filter(s => s !== 'Pan').map(sieve => (
                                        <tr key={sieve}>
                                            <td className="border px-3 py-2 font-medium">{sieve}</td>
                                            <td className="border px-3 py-2 text-center text-[#3B68FC]">{currentType.limits[sieve]?.[0] || 0}</td>
                                            <td className="border px-3 py-2 text-center text-[#3B68FC]">{currentType.limits[sieve]?.[1] || 100}</td>
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
                                    <thead><tr className="bg-gradient-to-r from-orange-50 to-red-50"><th className="border px-3 py-2">Sieve</th><th className="border px-3 py-2">Retained (g)</th><th className="border px-3 py-2">Cum. Retained %</th><th className="border px-3 py-2">% Passing</th><th className="border px-3 py-2">Status</th></tr></thead>
                                    <tbody>
                                        {currentType.sieves.map(sieve => {
                                            const passing = parseFloat(results[sieve]?.passing || 0);
                                            const limits = currentType.limits[sieve];
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
                                    { title: 'Bitumen Content', desc: '7-10% high binder content', icon: 'fa-fill-drip' },
                                    { title: 'Application Temp', desc: '200-230°C heated application', icon: 'fa-thermometer-half' },
                                    { title: 'No Compaction', desc: 'Self-leveling, no roller needed', icon: 'fa-check' },
                                    { title: 'Waterproofing', desc: 'Excellent impermeability', icon: 'fa-tint-slash' },
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
                        <div className="px-5 py-4 border-b border-[#e5e7eb] bg-gradient-to-r from-orange-50 to-red-50 flex items-center gap-3">
                            <i className="fas fa-fill-drip text-xl text-orange-600"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">Mastic Asphalt Calculator</h2>
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
                                        {currentType.sieves.map(sieve => (
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
