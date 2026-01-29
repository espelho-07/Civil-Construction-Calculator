import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function WMMCalculator() {
    const [numMaterials, setNumMaterials] = useState(2);
    const [sampleWeight, setSampleWeight] = useState(5000);
    const [materialsData, setMaterialsData] = useState({});
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const WMM_GRADING = {
        title: 'Wet Mix Macadam (WMM)',
        sieves: ['53 mm', '45 mm', '22.4 mm', '11.2 mm', '4.75 mm', '2.36 mm', '0.6 mm', '0.075 mm', 'Pan'],
        limits: { '53 mm': [100, 100], '45 mm': [95, 100], '22.4 mm': [60, 80], '11.2 mm': [40, 60], '4.75 mm': [25, 40], '2.36 mm': [15, 30], '0.6 mm': [8, 22], '0.075 mm': [0, 8] }
    };

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
        const key = `material_${materialIndex}`;
        setMaterialsData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [sieve]: Number(value)
            }
        }));
    };

    useEffect(() => { if (Object.keys(materialsData).length > 0) calculate(); }, [materialsData, sampleWeight]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="sieve-analysis-aggregates" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Wet Mix Macadam (WMM)</h1>
                    <p className="text-[#6b7280] mb-6">Blending of aggregates as per MoRTH specifications</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Wet Mix Macadam?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Wet Mix Macadam (WMM) is a sub-base/base course material used in flexible pavements. It consists of crushed aggregates and granular material premixed with water at optimum moisture content. WMM provides good drainage and structural support to the pavement.</p>
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
                                <strong>Key Properties:</strong>
                                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                                    <li>Thickness: 75-200mm per layer</li>
                                    <li>Compaction: 97-100% of MDD</li>
                                    <li>OMC: Optimum Moisture Content</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-table text-[#3B68FC] mr-2"></i>Grading Requirements - WMM</h2>
                        <div className="bg-white rounded-xl p-6 border">
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

                    {results && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-chart-bar text-[#3B68FC] mr-2"></i>Blended Result</h2>
                            <div className="bg-white rounded-xl p-6 border">
                                <table className="w-full text-sm">
                                    <thead><tr className="bg-green-50"><th className="border px-3 py-2">Sieve</th><th className="border px-3 py-2">Retained (g)</th><th className="border px-3 py-2">Cum. %</th><th className="border px-3 py-2">% Passing</th><th className="border px-3 py-2">Status</th></tr></thead>
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
                                                        {sieve === 'Pan' ? '-' : (isWithinLimits ? '✓' : '✗')}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 flex items-center gap-3">
                            <i className="fas fa-road text-xl text-green-600"></i>
                            <h2 className="font-semibold text-sm">WET MIX MACADAM (WMM)</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">No. of Material</label>
                                    <select value={numMaterials} onChange={(e) => setNumMaterials(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm">
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                    </select>
                                </div>
                                <div><label className="text-xs text-gray-500 mb-1 block">Sample Wt (g)</label><input type="number" value={sampleWeight} onChange={(e) => setSampleWeight(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>

                            <div className="overflow-x-auto mb-3 max-h-64 overflow-y-auto">
                                <table className="w-full text-xs">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="px-1 py-1">Sieve</th>
                                            {Array.from({ length: numMaterials }).map((_, i) => (
                                                <th key={i} className="px-1 py-1">Mat. {String.fromCharCode(65 + i)}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {WMM_GRADING.sieves.map(sieve => (
                                            <tr key={sieve}>
                                                <td className="px-1 py-1 font-medium text-xs">{sieve}</td>
                                                {Array.from({ length: numMaterials }).map((_, m) => (
                                                    <td key={m} className="px-1 py-1">
                                                        <input type="number" value={materialsData[`material_${m}`]?.[sieve] || 0} onChange={(e) => updateMaterialData(m, sieve, e.target.value)} className="w-14 px-1 py-0.5 border rounded text-xs" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setMaterialsData({})} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm">Reset</button>
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2 rounded-lg font-medium text-sm">Calculate</button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
