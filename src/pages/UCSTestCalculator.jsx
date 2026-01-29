import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function UCSTestCalculator() {
    const [diameter, setDiameter] = useState(38);
    const [length, setLength] = useState(76);
    const [density, setDensity] = useState(1.65);
    const [provingRingConstant, setProvingRingConstant] = useState(0.5);
    const [readings, setReadings] = useState([
        { dialGauge: 0, provingRing: 0 },
        { dialGauge: 50, provingRing: 6 },
        { dialGauge: 100, provingRing: 7 },
        { dialGauge: 150, provingRing: 8 },
        { dialGauge: 200, provingRing: 9 },
        { dialGauge: 250, provingRing: 10 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const area = (Math.PI / 4) * Math.pow(diameter / 10, 2); // cm²
        const calculatedReadings = readings.map(r => {
            const deltaL = r.dialGauge / 100; // mm to cm
            const strain = (deltaL / (length / 10)) * 100; // %
            const load = r.provingRing * provingRingConstant;
            const correctedArea = area / (1 - strain / 100);
            const stress = load / correctedArea;
            return { ...r, strain: strain.toFixed(2), load: load.toFixed(2), correctedArea: correctedArea.toFixed(2), stress: stress.toFixed(4) };
        });

        const maxStress = Math.max(...calculatedReadings.map(r => parseFloat(r.stress)));
        const cohesion = maxStress / 2;

        setResults({
            area: area.toFixed(2),
            ucs: maxStress.toFixed(4),
            cohesion: cohesion.toFixed(4),
            readings: calculatedReadings,
        });
    };

    const updateReading = (index, field, value) => {
        const newReadings = [...readings];
        newReadings[index][field] = Number(value);
        setReadings(newReadings);
    };

    useEffect(() => { calculate(); }, [diameter, length, density, provingRingConstant, readings]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Unconfined Compressive Strength (UCS)</h1>
                        <CalculatorActions
                            calculatorSlug="ucs-test"
                            calculatorName="UCS Test Calculator"
                            calculatorIcon="fa-compress"
                            category="Soil Test"
                            inputs={{ diameter, length, density, provingRingConstant, readings }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate unconfined compressive strength of soil</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What Unconfined Compressive Strength?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">A measure of a material's strength. The unconfined compressive strength (UCS) is the maximum axial compressive stress that a right cylindrical sample of material can withstand under unconfined conditions—the confining stress is zero. It is also known as the uniaxial compressive strength of a medium.</p>
                            <p className="text-gray-600 mb-4"><strong>Alternate Form:</strong> UCS, uniaxial compressive strength.</p>
                            <p className="text-gray-600"><strong>Note:</strong> If the axial compressive force per unit area has not reached a maximum value up to 20 percent, axial strain, shall be considered the value obtained at 20 percent axial strain.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-flask text-[#3B68FC] mr-2"></i>Apparatus</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li><strong>Compression Device:</strong> Platform weighing scale equipped with a screw jack activated yoke, Hydraulic loading device, Screw jack with spring load measuring device, Any of live loading device</li>
                                <li><strong>Sample Ejector:</strong> When samples are pushed from the drive sampling tube, the ejecting device shall be capable of ejecting the soil core from the sampling tube in the same direction of travel in which the sample entered</li>
                                <li><strong>Deformation Dial Gauge:</strong> a dial gauge with 0.01 mm graduations and specific travel to permit 20 percent axial strain</li>
                                <li><strong>Calipers:</strong> suitable to measure physical dimensions of the test specimen to the nearest 0.1 mm</li>
                                <li><strong>Timer:</strong> timing device to indicate the elapsed testing time to the nearest second</li>
                                <li><strong>Oven:</strong> thermostatically controlled, with interior of non-corroding material, capable of maintaining the temperature at 110 ± 5°C</li>
                                <li><strong>Balances:</strong> suitable for weighing soil specimens specially</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>The Unconfined Compressive Strength is calculated as</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="space-y-2 text-gray-600">
                                <p>1. Initial Area Of Specimen (A₀) = π/4 × D₀²</p>
                                <p>2. Change in Length or Deformation: ΔL = Dial Reading in mm</p>
                                <p>3. Axial Strain (ε) = ΔL/L₀</p>
                                <p>4. Load (Kg) = Proving Ring Reading × Proving Ring Constant</p>
                                <p>5. Corrected Area = A₀/(1-ε) cm²</p>
                                <p>6. Stress (δ) = Load/Corrected Area Kg/cm²</p>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg mt-4 text-center">
                                <div className="font-bold text-lg">Result of Test</div>
                                <div className="font-mono text-xl text-[#3B68FC] mt-2">UCS (q<sub>u</sub>) = Maximum Value From Stress (δ)</div>
                                <div className="font-mono text-xl text-[#3B68FC] mt-2">Cohesion = q<sub>u</sub>/2 Kg/cm²</div>
                            </div>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center gap-3">
                            <i className="fas fa-compress text-xl text-purple-600"></i>
                            <h2 className="font-semibold text-sm">UCS TEST</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">Diameter (D₀) mm</label><input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">Length (L₀) mm</label><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">Density g/cc</label><input type="number" step="0.01" value={density} onChange={(e) => setDensity(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">P.R. Constant</label><input type="number" step="0.1" value={provingRingConstant} onChange={(e) => setProvingRingConstant(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-xs">
                                    <thead><tr className="bg-gray-100"><th className="px-1 py-1">Sr.</th><th className="px-1 py-1">Dial Gauge</th><th className="px-1 py-1">P.R. Reading</th></tr></thead>
                                    <tbody>
                                        {readings.map((r, i) => (
                                            <tr key={i}>
                                                <td className="px-1 py-1 text-center">{i + 1}</td>
                                                <td className="px-1 py-1"><input type="number" value={r.dialGauge} onChange={(e) => updateReading(i, 'dialGauge', e.target.value)} className="w-full px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" value={r.provingRing} onChange={(e) => updateReading(i, 'provingRing', e.target.value)} className="w-full px-1 py-0.5 border rounded text-xs" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={calculate} className="w-full bg-[#3B68FC] text-white py-2 rounded-lg font-medium mb-4">Calculate</button>
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div>
                                        <div className="text-xs text-gray-500">UCS (q<sub>u</sub>)</div>
                                        <div className="text-xl font-bold text-[#3B68FC]">{results?.ucs} Kg/cm²</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Cohesion (C<sub>u</sub>)</div>
                                        <div className="text-xl font-bold text-purple-600">{results?.cohesion} Kg/cm²</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2 text-center">Initial Area: {results?.area} cm²</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
