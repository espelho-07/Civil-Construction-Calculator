import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function VaneShearCalculator() {
    const [springConstant, setSpringConstant] = useState(4);
    const [tests, setTests] = useState([
        { initialReading: 0, finalReading: 30, diameter: 3.75, height: 7.5 },
        { initialReading: 0, finalReading: 60, diameter: 3.75, height: 7.5 },
        { initialReading: 0, finalReading: 90, diameter: 3.75, height: 7.5 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const calculatedTests = tests.map((test, i) => {
            const diffReading = test.finalReading - test.initialReading;
            const torque = springConstant * diffReading / 100;
            const d = test.diameter;
            const h = test.height;
            // Cohesion = T / (π × D² × (H/2 + D/6))
            const cohesion = torque / (Math.PI * Math.pow(d, 2) * (h / 2 + d / 6));
            return {
                ...test,
                diffReading,
                torque: torque.toFixed(2),
                cohesion: cohesion.toFixed(4),
            };
        });

        const avgCohesion = calculatedTests.reduce((sum, t) => sum + parseFloat(t.cohesion), 0) / calculatedTests.length;
        const avgShearStrength = avgCohesion;

        setResults({
            tests: calculatedTests,
            avgShearStrength: avgShearStrength.toFixed(4),
            avgCohesion: avgCohesion.toFixed(4),
        });
    };

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = Number(value);
        setTests(newTests);
    };

    useEffect(() => { calculate(); }, [springConstant, tests]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Vane Shear Test Calculator <span className="text-sm font-normal text-gray-500">IS: 2720 (Part 30)</span></h1>
                    <p className="text-[#6b7280] mb-6">Calculate shear strength of soil using vane shear test</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Vane Shear Test?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Vane shear test for the measurement of shear strength of cohesive soils is useful for soils of low shear strength (0-1 kN/m² to 6 kN/m²). This test gives the undrained strength of the soil and the same cannot be realized through other methods on account of the sensitivity of the soil.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-flask text-[#3B68FC] mr-2"></i>Apparatus</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <ul className="list-disc pl-5 text-gray-600 space-y-2">
                                <li>The apparatus may be either of the hand operated type or motorized</li>
                                <li>A set of vanes and shaft to the apparatus is such a way that the vane can be moved vertically and can rotate about the vane axis</li>
                                <li>Fixing the tube containing the soil specimen in the base of the equipment</li>
                                <li>A torque applicator for rotating the vane and for measuring the torque</li>
                                <li>Vanes: The vane shall consist of four blades, each fixed at 90°</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Vane Shear Test Calculations</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center space-y-3">
                                <div className="font-mono text-lg">Torque(T) = K × (Difference of Reading / 100)</div>
                                <div className="font-mono text-lg">Cohesion(C<sub>u</sub>) = T / (π × D² × (H/2 + D/6))</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>Difference in Reading = Final Reading - Initial Reading</li>
                                    <li>D is the Diameter of vane(cm) in the tube</li>
                                    <li>H is Height of vane(cm) in the tube</li>
                                    <li>T = Torque in cm-kgf</li>
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
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-teal-50 to-cyan-50 flex items-center gap-3">
                            <i className="fas fa-fan text-xl text-teal-600"></i>
                            <h2 className="font-semibold text-sm">VANES SHEAR CALCULATION</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Spring Constant (K) kg/cm²</label><input type="number" value={springConstant} onChange={(e) => setSpringConstant(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>

                            {tests.map((test, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded-lg mb-3">
                                    <div className="text-xs font-bold text-gray-700 mb-2">Test-{i + 1}</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                        <div><label className="text-gray-500">Initial Reading</label><input type="number" value={test.initialReading} onChange={(e) => updateTest(i, 'initialReading', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                        <div><label className="text-gray-500">Final Reading</label><input type="number" value={test.finalReading} onChange={(e) => updateTest(i, 'finalReading', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div><label className="text-gray-500">Diameter (D) cm</label><input type="number" step="0.01" value={test.diameter} onChange={(e) => updateTest(i, 'diameter', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                        <div><label className="text-gray-500">Height (H) cm</label><input type="number" step="0.01" value={test.height} onChange={(e) => updateTest(i, 'height', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                    </div>
                                </div>
                            ))}

                            <button onClick={calculate} className="w-full bg-[#3B68FC] text-white py-2 rounded-lg font-medium mb-4">Calculate</button>
                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Avg. Shear Strength</div>
                                        <div className="text-lg font-bold text-[#3B68FC]">{results?.avgShearStrength} Kg/cm²</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Avg. Cohesion (C<sub>u</sub>)</div>
                                        <div className="text-lg font-bold text-teal-600">{results?.avgCohesion} Kg/cm²</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs">
                                    {results?.tests?.map((t, i) => (
                                        <div key={i} className="flex justify-between bg-white px-2 py-1 rounded mb-1">
                                            <span>Test-{i + 1}</span>
                                            <span className="font-bold text-[#3B68FC]">{t.cohesion} Kg/cm²</span>
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
