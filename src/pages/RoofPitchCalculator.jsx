import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function RoofPitchCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [rise, setRise] = useState(10);
    const [riseCm, setRiseCm] = useState(0);
    const [run, setRun] = useState(15);
    const [runCm, setRunCm] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let riseM, runM;
        if (unit === 'Meter') {
            riseM = rise + riseCm / 100;
            runM = run + runCm / 100;
        } else {
            riseM = (rise + riseCm / 12) * 0.3048;
            runM = (run + runCm / 12) * 0.3048;
        }

        const pitchRatio = riseM / runM;
        const pitch = Math.round(pitchRatio * 12);
        const slope = (riseM / runM) * 100;
        const angleRad = Math.atan(riseM / runM);
        const angleDeg = angleRad * (180 / Math.PI);

        setResults({
            pitch: `${pitch}/12`,
            slope: slope.toFixed(3),
            angle: angleDeg.toFixed(3),
            riseM: riseM.toFixed(2),
            runM: runM.toFixed(2),
        });
    };

    useEffect(() => { calculate(); }, [unit, rise, riseCm, run, runCm]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Roof Pitch Calculator</h1>
                    <p className="text-[#6b7280] mb-6">Calculate roof pitch, slope, and angle from rise and run</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Roof Pitch Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                    <div className="text-sm text-gray-600 mb-2">Roof Pitch</div>
                                    <div className="font-mono text-sm">= S/N (12)</div>
                                    <div className="font-mono text-sm">= {results?.riseM}/{results?.runM} (12)</div>
                                    <div className="text-2xl font-bold text-[#3B68FC]">= {results?.pitch}</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                    <div className="text-sm text-gray-600 mb-2">Slope</div>
                                    <div className="font-mono text-sm">= S/N × 100</div>
                                    <div className="font-mono text-sm">= {results?.riseM}/{results?.runM} × 100</div>
                                    <div className="text-2xl font-bold text-[#3B68FC]">= {results?.slope} %</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                    <div className="text-sm text-gray-600 mb-2">Angle</div>
                                    <div className="font-mono text-sm">= tan⁻¹ (S/N)</div>
                                    <div className="font-mono text-sm">= tan⁻¹ ({results?.riseM}/{results?.runM})</div>
                                    <div className="text-2xl font-bold text-[#3B68FC]">= {results?.angle} Degree</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                            <p>Roof pitch is often expressed as a ratio between rise and run in the form of x:12. For example, a pitch 1:12 means that for every twelve yards of building length the rise will be equal to one yard.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is roof pitch calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Roof pitch is the measure of the slant of your roof. It is one of the many important elements of your roof. Roof pitch is one of the most visible aspects of a roof. It's the measure of the steepness of a roof, or its slope. Roof pitch is expressed as a ratio of the roof's vertical rise to its horizontal span, or "run".</p>
                            <p className="text-gray-600">The most commonly used roof pitches fall in a range between 4/12 and 9/12. Pitches lower than 4/12 have a slight angle, and they are defined as low-slope roofs. Pitches of less than 2/12 are considered flat roofs, even though they may be very slightly angled.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Roof pitch calculation</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-[#3B68FC] space-y-2">
                                    <p>Roof Pitch = S/N (12)</p>
                                    <p>Slope = S/N × 100</p>
                                    <p>Angle = tan⁻¹ (S/N)</p>
                                </div>
                            </div>
                            <svg viewBox="0 0 200 120" className="w-48 h-28">
                                <polygon points="20,100 180,100 100,30" fill="none" stroke="#3B68FC" strokeWidth="2" />
                                <line x1="100" y1="30" x2="100" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="5" />
                                <text x="105" y="70" fontSize="10" fill="#666">rise</text>
                                <line x1="20" y1="100" x2="100" y2="100" stroke="#22c55e" strokeWidth="2" />
                                <text x="50" y="115" fontSize="10" fill="#666">run</text>
                                <path d="M 40 100 A 20 20 0 0 1 50 85" fill="none" stroke="#f59e0b" strokeWidth="2" />
                                <text x="55" y="90" fontSize="8" fill="#666">roof angle</text>
                            </svg>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-list text-[#3B68FC] mr-2"></i>What are types of roof pitch?</h2>
                        <div className="bg-white rounded-xl p-6 border space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0"><span className="text-blue-600 font-bold text-sm">1</span></div>
                                <div><strong className="text-gray-800">Low Roof Pitch/Slope –</strong> <span className="text-gray-600">This type of roof would have at least a 3:12 pitch, which means that a roof rises 3 feet for every 12 feet of its base horizontal length (not greater than5:12). Roofing. This type of roof is considered to be "walk-able", and easy for performing a roof installation.</span></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0"><span className="text-amber-600 font-bold text-sm">2</span></div>
                                <div><strong className="text-gray-800">Medium Roof Pitch/Slope –</strong> <span className="text-gray-600">The roof of this type would fall within 6:12 – 9:12 roofing slope range Roofing. These roofs with intermediate pitch / average slope roofs are considered to be "non walk-able", as they represent a higher degree of complexity, therefore they are more expensive to install.</span></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0"><span className="text-red-600 font-bold text-sm">3</span></div>
                                <div><strong className="text-gray-800">High/Steep Roof Pitch/Slope –</strong> <span className="text-gray-600">Roofs in this category have a slope that is greater than 9 inches of rise for every foot of horizontal roof's run. Roofing. The high sloped roof is, perhaps, the most difficult and dangerous roofing surface to work on. You may expect to pay a higher price for this type of roof per square of installation.</span></div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-exclamation-circle text-[#3B68FC] mr-2"></i>Importance of roof pitch</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600">The roof covering that is intended to allow run-off of rain and snow, heat, wind, ultraviolet rays and all the other environmental effects that tend to cause materials to deteriorate. Most roof covers are installed over a water resistant underlayment frequently felt paper, the black material you may have noticed on roofs before application of the final roof covering that, as long as it stays in place, provides an extra surface where water that gets past the roof covering can drain off the roof. Most of the time, areas where higher levels of snow or rainfall are common prefer to build roofs with steeper pitch. Well-built roofs are designed to prevent pooling of water or accumulation of snow.</p>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center gap-3">
                            <i className="fas fa-home text-xl text-indigo-600"></i>
                            <h2 className="font-semibold">ROOF PITCH CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Rise (S)</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={rise} onChange={(e) => setRise(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={riseCm} onChange={(e) => setRiseCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Run (N)</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={run} onChange={(e) => setRun(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={runCm} onChange={(e) => setRunCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 text-center space-y-2">
                                <div><div className="text-xs text-gray-500">Roof Pitch</div><div className="text-xl font-bold text-[#3B68FC]">{results?.pitch}</div></div>
                                <div><div className="text-xs text-gray-500">Slope</div><div className="text-lg font-bold text-green-500">{results?.slope} %</div></div>
                                <div><div className="text-xs text-gray-500">Angle</div><div className="text-lg font-bold text-amber-500">{results?.angle} Degree</div></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
