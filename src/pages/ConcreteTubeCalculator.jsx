import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function ConcreteTubeCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [gradeOfConcrete, setGradeOfConcrete] = useState('M20 (1:1.5:3)');
    const [innerDiameter, setInnerDiameter] = useState(2);
    const [innerDiameterCm, setInnerDiameterCm] = useState(40);
    const [outerDiameter, setOuterDiameter] = useState(3);
    const [outerDiameterCm, setOuterDiameterCm] = useState(0);
    const [height, setHeight] = useState(2);
    const [heightCm, setHeightCm] = useState(55);
    const [noOfTubes, setNoOfTubes] = useState(1);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const gradeRatios = {
        'M20 (1:1.5:3)': { cement: 1, sand: 1.5, aggregate: 3 },
        'M25 (1:1:2)': { cement: 1, sand: 1, aggregate: 2 },
        'M15 (1:2:4)': { cement: 1, sand: 2, aggregate: 4 },
        'M10 (1:3:6)': { cement: 1, sand: 3, aggregate: 6 },
    };

    const calculate = () => {
        let innerD, outerD, h;
        if (unit === 'Meter') {
            innerD = innerDiameter + innerDiameterCm / 100;
            outerD = outerDiameter + outerDiameterCm / 100;
            h = height + heightCm / 100;
        } else {
            innerD = (innerDiameter + innerDiameterCm / 12) * 0.3048;
            outerD = (outerDiameter + outerDiameterCm / 12) * 0.3048;
            h = (height + heightCm / 12) * 0.3048;
        }

        const innerRadius = innerD / 2;
        const outerRadius = outerD / 2;
        const innerArea = Math.PI * innerRadius * innerRadius;
        const outerArea = Math.PI * outerRadius * outerRadius;
        const tubeArea = (outerArea - innerArea) * noOfTubes;
        const volume = tubeArea * h;
        const volumeFt3 = volume * 35.3147;
        const dryVolume = volume * 1.524;

        const ratio = gradeRatios[gradeOfConcrete];
        const totalParts = ratio.cement + ratio.sand + ratio.aggregate;

        const cementVolume = (dryVolume * ratio.cement) / totalParts;
        const sandVolume = (dryVolume * ratio.sand) / totalParts;
        const aggregateVolume = (dryVolume * ratio.aggregate) / totalParts;

        const cementBags = cementVolume / 0.035;
        const sandTons = sandVolume * 1.6;
        const aggregateTons = aggregateVolume * 1.5;

        setResults({
            innerRadius: innerRadius.toFixed(2),
            outerRadius: outerRadius.toFixed(2),
            innerArea: innerArea.toFixed(2),
            outerArea: outerArea.toFixed(2),
            tubeArea: tubeArea.toFixed(2),
            volume: volume.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            dryVolume: dryVolume.toFixed(2),
            cementVolume: cementVolume.toFixed(4),
            sandVolume: sandVolume.toFixed(2),
            aggregateVolume: aggregateVolume.toFixed(2),
            cementBags: Math.ceil(cementBags),
            sandTons: sandTons.toFixed(2),
            aggregateTons: aggregateTons.toFixed(2),
        });
    };

    useEffect(() => { calculate(); }, [unit, gradeOfConcrete, innerDiameter, innerDiameterCm, outerDiameter, outerDiameterCm, height, heightCm, noOfTubes]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Concrete Tube Calculator <span className="text-sm font-normal text-gray-500">IS 516</span></h1>
                            <p className="text-[#6b7280]">Calculate concrete quantity for tube/pipe structures</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="concrete-tube-calculator"
                            calculatorName="Concrete Tube Calculator"
                            calculatorIcon="fa-circle-notch"
                            category="Quantity Estimator"
                            inputs={{ unit, gradeOfConcrete, innerDiameter, height, noOfTubes }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Total Area of Concrete Tube</div>
                                    <div className="text-3xl font-bold text-[#3B68FC]">{results?.tubeArea} m² <span className="text-gray-400">|</span> {(parseFloat(results?.tubeArea || 0) * 10.764).toFixed(2)} ft²</div>
                                </div>
                                <div>
                                    <table className="w-full text-sm">
                                        <thead><tr className="bg-gray-100"><th className="border px-2 py-1">Sr.</th><th className="border px-2 py-1">Material</th><th className="border px-2 py-1">Quantity</th></tr></thead>
                                        <tbody>
                                            <tr><td className="border px-2 py-1">1</td><td className="border px-2 py-1">Cement</td><td className="border px-2 py-1">{results?.cementBags} Bags</td></tr>
                                            <tr><td className="border px-2 py-1">2</td><td className="border px-2 py-1">Sand</td><td className="border px-2 py-1">{results?.sandTons} Ton</td></tr>
                                            <tr><td className="border px-2 py-1">3</td><td className="border px-2 py-1">Aggregate</td><td className="border px-2 py-1">{results?.aggregateTons} Ton</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <div className="w-40 h-40">
                                    <svg viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="#3B68FC" />
                                        <circle cx="50" cy="50" r="30" fill="none" stroke="#facc15" strokeWidth="8" />
                                        <circle cx="50" cy="50" r="15" fill="none" stroke="#22c55e" strokeWidth="8" />
                                    </svg>
                                    <div className="flex justify-center gap-4 text-xs mt-2">
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#3B68FC]"></span> Cement</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400"></span> Sand</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500"></span> Aggregate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Concrete Tube Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm font-bold mb-2">Tube Inner Area</div>
                                    <div className="text-xs text-gray-500">Inner Area = π × Inner Radius²</div>
                                    <div className="text-xs">= 3.14 × {results?.innerRadius}²</div>
                                    <div className="font-bold text-[#3B68FC]">Inner Area = {results?.innerArea}</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm font-bold mb-2">Tube Outer Area</div>
                                    <div className="text-xs text-gray-500">Outer Area = π × Outer Radius²</div>
                                    <div className="text-xs">= 3.14 × {results?.outerRadius}²</div>
                                    <div className="font-bold text-[#3B68FC]">Outer Area = {results?.outerArea}</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm font-bold mb-2">Tube Total Area</div>
                                    <div className="text-xs text-gray-500">Area = Outer - Inner Area</div>
                                    <div className="text-xs">Vol = {results?.tubeArea} × {height + heightCm / 100} × {noOfTubes}</div>
                                    <div className="font-bold text-[#3B68FC]">Dry Volume = {results?.dryVolume}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                                    <div className="text-sm font-bold text-amber-700 mb-2"><i className="fas fa-box mr-1"></i> Amount of Cement Required</div>
                                    <div className="text-xs">Cement Volume = {results?.cementVolume}</div>
                                    <div className="text-lg font-bold text-amber-600">= {results?.cementBags} Bags</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-amber-100 p-2 rounded">Note: 1 bag of cement = 0.035</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                    <div className="text-sm font-bold text-yellow-700 mb-2"><i className="fas fa-mountain mr-1"></i> Amount of Sand Required</div>
                                    <div className="text-xs">Sand Volume = {results?.sandVolume} m³</div>
                                    <div className="text-lg font-bold text-yellow-600">= {results?.sandTons} Tons</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-yellow-100 p-2 rounded">Note: 1m³ sand dry = 1600 kg = 1.6 Ton</div>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                    <div className="text-sm font-bold text-gray-700 mb-2"><i className="fas fa-rock mr-1"></i> Amount of Aggregate Required</div>
                                    <div className="text-xs">Aggregate Volume = {results?.aggregateVolume} m³</div>
                                    <div className="text-lg font-bold text-gray-600">= {results?.aggregateTons} Tons</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded">Note: 1m³ density of loose aggregate = 1500 = 460 kg = 1.5 Ton</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is concrete tube calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Reinforced concrete (RC) tube, known generically Reinforced concrete pipe (RCP), is a type of concrete pipe used most widely in storm sewer and sanitary systems. Its shape and rigidity offers corrosion resistance to water and soil, low porosity so as not to allow scale and are not susceptible to underground fires. Concrete pipes has been established as of up to about 100 years and so last century has started in 1850 and started using CPM technology from 1910.</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Class:</strong> Light-duty NP2, Medium-duty NP3, Heavy Duty NP4</li>
                                    <li><strong>Density:</strong> Complete cement cement mix with cement</li>
                                    <li><strong>Length:</strong> 2 to 2.5 meter or 6.56 to 8.20 feet</li>
                                    <li><strong>Diameter Of RCC Tube Pipe:</strong> 10, 100, 150, 200, 275, 300, 350, 400, 450, 500</li>
                                    <li><strong>Joints:</strong> Socket and Spigot, Collar joints and Butt Joint</li>
                                    <li><strong>NPC:</strong> Tube with Collar. Spigot and socket joint Type NPC Tube Pipe.</li>
                                </ul>
                            </div>
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Concrete Tubes" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-exclamation-circle text-[#3B68FC] mr-2"></i>What are the importance of concrete tube?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600">Concrete Tube usually for 6 to press in applications such as gravity flow or irrigation. Pipe for sewage and stormwater predominantly made from concrete or vitrified clay. Reinforced concrete can be used for large-diameter concrete pipes. This type of material can be used in almost types of construction, and is often utilized in places that require heavy duty or direct-fill, and accept pipe with sizes 8 inches or more or in neutral soil or where extra strength is needed a cement lined, with various treating materials applied at manufacture.</p>
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
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center gap-3">
                            <i className="fas fa-circle-notch text-xl text-purple-600"></i>
                            <h2 className="font-semibold">CONCRETE TUBE CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Grade of Concrete</label><select value={gradeOfConcrete} onChange={(e) => setGradeOfConcrete(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">{Object.keys(gradeRatios).map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Inner Diameter</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={innerDiameter} onChange={(e) => setInnerDiameter(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">meter</span></div><div className="relative"><input type="number" value={innerDiameterCm} onChange={(e) => setInnerDiameterCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Outer Diameter</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={outerDiameter} onChange={(e) => setOuterDiameter(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">meter</span></div><div className="relative"><input type="number" value={outerDiameterCm} onChange={(e) => setOuterDiameterCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Height</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">meter</span></div><div className="relative"><input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">No. of Tubes</label><input type="number" value={noOfTubes} onChange={(e) => setNoOfTubes(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Total Tube Area</div><div className="text-xl font-bold text-[#3B68FC]">{results?.tubeArea} m²</div><div className="text-sm text-gray-500">{results?.volume} m³ volume</div></div>
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
