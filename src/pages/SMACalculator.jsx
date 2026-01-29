import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

const SMA_GRADINGS = {
    '13mm': {
        title: 'Stone Matrix Asphalt (SMA) 13mm - Wearing Course',
        sieves: ['19 mm', '13.2 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.6 mm', '0.3 mm', '0.075 mm', 'Pan'],
        limits: { '19 mm': [100, 100], '13.2 mm': [90, 100], '9.5 mm': [50, 75], '4.75 mm': [20, 28], '2.36 mm': [16, 24], '0.6 mm': [12, 20], '0.3 mm': [10, 18], '0.075 mm': [8, 12] }
    },
    '19mm': {
        title: 'Stone Matrix Asphalt (SMA) 19mm - Binder/Intermediate Course',
        sieves: ['26.5 mm', '19 mm', '13.2 mm', '9.5 mm', '4.75 mm', '2.36 mm', '0.6 mm', '0.3 mm', '0.075 mm', 'Pan'],
        limits: { '26.5 mm': [100, 100], '19 mm': [90, 100], '13.2 mm': [65, 80], '9.5 mm': [25, 35], '4.75 mm': [20, 28], '2.36 mm': [16, 24], '0.6 mm': [12, 20], '0.3 mm': [10, 18], '0.075 mm': [8, 12] }
    }
};

export default function SMACalculator() {
    const [grading, setGrading] = useState('13mm');
    const [numMaterials, setNumMaterials] = useState(2);
    const [sampleWeight, setSampleWeight] = useState(5000);
    const [materialsData, setMaterialsData] = useState({});
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const currentGrading = SMA_GRADINGS[grading];

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
        { name: 'BC Grading', icon: 'fa-road', slug: '/bituminous-concrete' },
        { name: 'DBM Grading', icon: 'fa-road', slug: '/dbm-grading' },
        { name: 'Mastic Asphalt', icon: 'fa-fill-drip', slug: '/mastic-asphalt' },
        { name: 'MSS Grading', icon: 'fa-brush', slug: '/mss-grading' },
        { name: 'Surface Dressing', icon: 'fa-brush', slug: '/surface-dressing' },
        { name: 'Slurry Seal', icon: 'fa-water', slug: '/slurry-seal' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="sieve-analysis-aggregates" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Stone Matrix Asphalt (SMA)</h1>
                            <p className="text-[#6b7280]">{currentGrading.title}</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="sma-grading"
                            calculatorName="SMA Grading Calculator"
                            calculatorIcon="fa-layer-group"
                            category="Sieve Analysis"
                            inputs={{ grading, numMaterials, sampleWeight }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* What is SMA? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Stone Matrix Asphalt?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Stone Matrix Asphalt (SMA) is a gap-graded hot mix asphalt that maximizes the coarse aggregate content and uses a stabilizing additive and modified binder. It creates a stone-on-stone contact that provides excellent rut resistance.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                SMA is widely used on high-traffic roads and offers superior performance with excellent durability and resistance to permanent deformation. Two gradings: <strong>13mm (Wearing)</strong> and <strong>19mm (Binder)</strong>.
                            </p>
                        </div>
                    </section>

                    {/* Grading Selection */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-sliders-h text-[#3B68FC]"></i>
                            Select SMA Grading
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(SMA_GRADINGS).map(([key, g]) => (
                                <div key={key} onClick={() => setGrading(key)} className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${grading === key ? 'border-[#3B68FC] shadow-lg' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`}>
                                    <div className="text-center font-medium text-[#0A0A0A]">{key} SMA</div>
                                    <div className="text-center text-xs text-[#6b7280]">{key === '13mm' ? 'Wearing Course' : 'Binder/Intermediate'}</div>
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
                                    <thead><tr className="bg-gradient-to-r from-indigo-50 to-purple-50"><th className="border px-3 py-2">Sieve</th><th className="border px-3 py-2">Retained (g)</th><th className="border px-3 py-2">Cum. Retained %</th><th className="border px-3 py-2">% Passing</th><th className="border px-3 py-2">Status</th></tr></thead>
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
                                    { title: 'Stabilizing Additive', desc: 'Cellulose or mineral fibers', icon: 'fa-plus-circle' },
                                    { title: 'Modified Binder', desc: 'PMB 40 or polymer modified', icon: 'fa-tint' },
                                    { title: 'Voids in Mix', desc: '2-4% air voids target', icon: 'fa-circle' },
                                    { title: 'Stone-on-Stone', desc: 'Interlocking aggregate skeleton', icon: 'fa-cubes' },
                                    { title: 'High Bitumen', desc: '6-7% binder content', icon: 'fa-fill-drip' },
                                    { title: 'Rut Resistance', desc: 'Excellent deformation resistance', icon: 'fa-road' },
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
                        <div className="px-5 py-4 border-b border-[#e5e7eb] bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center gap-3">
                            <i className="fas fa-layer-group text-xl text-indigo-600"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">SMA Grading Calculator</h2>
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
