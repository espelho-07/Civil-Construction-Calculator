import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function DirectShearCalculator() {
    const [provingRingConstant, setProvingRingConstant] = useState(1);
    const [tests, setTests] = useState([
        { area: 36, dialGauge: 0, provingRing: 1, normalStress: 0.5 },
        { area: 36, dialGauge: 0, provingRing: 1.5, normalStress: 1.5 },
        { area: 36, dialGauge: 0, provingRing: 2, normalStress: 2 },
        { area: 36, dialGauge: 0, provingRing: 2, normalStress: 2 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const calculatedTests = tests.map((test, i) => {
            const displacement = test.dialGauge / 100; // mm to cm
            const correctedArea = test.area * (1 - displacement / 6); // assuming 6cm specimen
            const horizontalLoad = test.provingRing * provingRingConstant;
            const shearStress = horizontalLoad / correctedArea;
            return {
                ...test,
                displacement: displacement.toFixed(2),
                correctedArea: correctedArea.toFixed(2),
                horizontalLoad: horizontalLoad.toFixed(2),
                shearStress: shearStress.toFixed(4),
            };
        });

        // Calculate angle of internal friction and cohesion using linear regression
        // τ = c + σ tan(φ)
        const n = calculatedTests.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        calculatedTests.forEach(t => {
            sumX += t.normalStress;
            sumY += parseFloat(t.shearStress);
            sumXY += t.normalStress * parseFloat(t.shearStress);
            sumX2 += t.normalStress * t.normalStress;
        });
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const phi = Math.atan(slope) * (180 / Math.PI);

        setResults({
            tests: calculatedTests,
            cohesion: Math.max(0, intercept).toFixed(4),
            phi: phi.toFixed(2),
        });
    };

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = Number(value);
        setTests(newTests);
    };

    useEffect(() => { calculate(); }, [provingRingConstant, tests]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Direct Shear Test</h1>
                    <p className="text-[#6b7280] mb-6">Calculate shear strength parameters of soil</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What Is Direct Shear Test?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">A Direct shear test is a laboratory or field test used by geotechnical engineers to measure the shear strength properties of soil or rock material, or of discontinuities in soil or rock masses.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-flask text-[#3B68FC] mr-2"></i>Apparatus</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li>The shear box grid plates, porous stones, base plate, and loading pad and water jacket/cell</li>
                                <li>Loading Yoke with arrangement to measure compression</li>
                                <li>Weights for applying normal force</li>
                                <li>Proving Ring for measuring horizontal shear force</li>
                                <li>Dial Gauges for measuring deformation</li>
                                <li>Balance with accuracy up to 1 g</li>
                                <li>Stop Clock</li>
                                <li>Spatula, moisture cup, etc.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Direct Shear Test Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center space-y-3">
                                <div className="font-mono text-lg">Horizontal Load(kg) = Proving Ring Reading × Proving Ring Constant</div>
                                <div className="font-mono text-lg">Corrected Area = A₀ × (1 - δ/L) cm²</div>
                                <div className="font-mono text-lg text-[#3B68FC]">Shear Stress(τ) = Horizontal Load(kg) / Corrected Area (cm²)</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>A₀ = Area of Sample or Initial Area of Specimen in cm²</li>
                                    <li>δ = Displacement in cm</li>
                                    <li>L = Length of specimen in cm</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-red-50 to-orange-50 flex items-center gap-3">
                            <i className="fas fa-compress-arrows-alt text-xl text-red-600"></i>
                            <h2 className="font-semibold text-sm">DIRECT SHEAR TEST</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Proving Ring Constant (k)</label><input type="number" value={provingRingConstant} onChange={(e) => setProvingRingConstant(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>

                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-xs">
                                    <thead><tr className="bg-gray-100"><th className="px-1 py-1">Test</th><th className="px-1 py-1">Area(cm²)</th><th className="px-1 py-1">Dial</th><th className="px-1 py-1">P.R.</th><th className="px-1 py-1">σ(kg/cm²)</th></tr></thead>
                                    <tbody>
                                        {tests.map((test, i) => (
                                            <tr key={i}>
                                                <td className="px-1 py-1 text-center">{i + 1}</td>
                                                <td className="px-1 py-1"><input type="number" value={test.area} onChange={(e) => updateTest(i, 'area', e.target.value)} className="w-12 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" value={test.dialGauge} onChange={(e) => updateTest(i, 'dialGauge', e.target.value)} className="w-12 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" step="0.1" value={test.provingRing} onChange={(e) => updateTest(i, 'provingRing', e.target.value)} className="w-12 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" step="0.1" value={test.normalStress} onChange={(e) => updateTest(i, 'normalStress', e.target.value)} className="w-12 px-1 py-0.5 border rounded text-xs" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button onClick={calculate} className="w-full bg-[#3B68FC] text-white py-2 rounded-lg font-medium mb-4">Calculate</button>
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3 text-center mb-3">
                                    <div>
                                        <div className="text-xs text-gray-500">Cohesion (C)</div>
                                        <div className="text-lg font-bold text-[#3B68FC]">{results?.cohesion} kg/cm²</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Angle of Friction (φ)</div>
                                        <div className="text-lg font-bold text-red-600">{results?.phi}°</div>
                                    </div>
                                </div>
                                <div className="text-xs">
                                    <div className="font-bold mb-1">Shear Stress (τ) Results:</div>
                                    {results?.tests?.map((t, i) => (
                                        <div key={i} className="flex justify-between bg-white px-2 py-1 rounded mb-1">
                                            <span>Test-{i + 1} (σ={t.normalStress})</span>
                                            <span className="font-bold text-[#3B68FC]">{t.shearStress} kg/cm²</span>
                                        </div>
                                    ))}
                                </div>
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
