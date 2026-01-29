import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function RoundColumnCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [gradeOfConcrete, setGradeOfConcrete] = useState('M20 (1:1.5:3)');
    const [diameter, setDiameter] = useState(1);
    const [diameterCm, setDiameterCm] = useState(0);
    const [height, setHeight] = useState(3);
    const [heightCm, setHeightCm] = useState(0);
    const [noOfColumns, setNoOfColumns] = useState(1);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const gradeRatios = {
        'M20 (1:1.5:3)': { cement: 1, sand: 1.5, aggregate: 3 },
        'M25 (1:1:2)': { cement: 1, sand: 1, aggregate: 2 },
        'M15 (1:2:4)': { cement: 1, sand: 2, aggregate: 4 },
        'M10 (1:3:6)': { cement: 1, sand: 3, aggregate: 6 },
    };

    const calculate = () => {
        let d, h;
        if (unit === 'Meter') {
            d = diameter + diameterCm / 100;
            h = height + heightCm / 100;
        } else {
            d = (diameter + diameterCm / 12) * 0.3048;
            h = (height + heightCm / 12) * 0.3048;
        }
        const r = d / 2;
        const volume = Math.PI * r * r * h * noOfColumns;
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
            radius: r.toFixed(2),
            volume: volume.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            dryVolume: dryVolume.toFixed(2),
            cementVolume: cementVolume.toFixed(2),
            sandVolume: sandVolume.toFixed(2),
            aggregateVolume: aggregateVolume.toFixed(2),
            cementBags: Math.ceil(cementBags),
            sandTons: sandTons.toFixed(2),
            aggregateTons: aggregateTons.toFixed(2),
        });
    };

    useEffect(() => { calculate(); }, [unit, gradeOfConcrete, diameter, diameterCm, height, heightCm, noOfColumns]);
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Round Column Calculator</h1>
                            <p className="text-[#6b7280]">Calculate concrete quantity for circular columns</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="round-column-calculator"
                            calculatorName="Round Column Calculator"
                            calculatorIcon="fa-circle"
                            category="Quantity Estimator"
                            inputs={{ unit, gradeOfConcrete, diameter, height, noOfColumns }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Total Volume of Round Column</div>
                                    <div className="text-3xl font-bold text-[#3B68FC]">{results?.volume} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
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
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Round Column Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm font-bold mb-2">Radius</div>
                                    <div className="text-xs text-gray-500">= Diameter / 2</div>
                                    <div className="font-bold text-[#3B68FC]">= {results?.radius} m</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm font-bold mb-2">Volume</div>
                                    <div className="text-xs text-gray-500">= πr² × h × No. of Columns</div>
                                    <div className="font-bold text-[#3B68FC]">= {results?.volume} Cubic Meter</div>
                                    <div className="text-sm text-gray-500">= {results?.volumeFt3} Cubic Feet</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm font-bold mb-2">Dry Volume</div>
                                    <div className="text-xs text-gray-500">= Volume × 1.524</div>
                                    <div className="font-bold text-[#3B68FC]">= {results?.dryVolume}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                                    <div className="text-sm font-bold text-amber-700 mb-2"><i className="fas fa-box mr-1"></i> Amount of Cement Required</div>
                                    <div className="text-xs">Cement Volume = {results?.cementVolume} m³</div>
                                    <div className="text-lg font-bold text-amber-600">= {results?.cementBags} Bags</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-amber-100 p-2 rounded">Note: 1 bag of cement = 0.035m³</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                    <div className="text-sm font-bold text-yellow-700 mb-2"><i className="fas fa-mountain mr-1"></i> Amount of Sand Required</div>
                                    <div className="text-xs">Sand Volume = {results?.sandVolume} m³</div>
                                    <div className="text-lg font-bold text-yellow-600">= {results?.sandTons} Tons</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-yellow-100 p-2 rounded">Note: 1m³ sand dry = 1600 kg = 1.6 ton</div>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                    <div className="text-sm font-bold text-gray-700 mb-2"><i className="fas fa-rock mr-1"></i> Amount of Aggregate Required</div>
                                    <div className="text-xs">Aggregate Volume = {results?.aggregateVolume} m³</div>
                                    <div className="text-lg font-bold text-gray-600">= {results?.aggregateTons} Tons</div>
                                    <div className="text-xs text-gray-500 mt-2 bg-gray-100 p-2 rounded">Note: 1m³ aggregate = 1500 kg</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is circular column calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Circular columns are cylindrical in shape, used in construction to carry compressive loads. A reinforced circular concrete column is a structural member designed to carry compressive loads.</p>
                                <p className="text-gray-600">Spiral columns are cylindrical columns with a continuous helical bar wrapping around the column. The spiral acts to provide lateral confinement and prevent the column from buckling.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Round Columns" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Circular Column Calculation Formula</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 text-[#3B68FC]">
                                <p>Radius = Diameter / 2</p>
                                <p>Volume of round column = πr²h</p>
                                <p>Dry Volume = Volume (Cubic Meter) × 1.524</p>
                                <p>Cement Volume = Dry Volume × Cement Ratio / Sum of Ratio</p>
                                <p>No. of Cement Bags = Cement Volume / 0.035</p>
                                <p>Sand Volume = Dry Volume × Sand Ratio / Sum of Ratio</p>
                                <p>Sand in Tons = Sand Volume × 1600 / 1000</p>
                                <p>Aggregate Volume = Dry Volume × Aggregate Ratio / Sum of Ratio</p>
                                <p>Aggregate in Ton = Aggregate Volume × 1500 / 1000</p>
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
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-3">
                            <i className="fas fa-circle text-xl text-blue-600"></i>
                            <h2 className="font-semibold">ROUND COLUMN CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Grade of Concrete</label><select value={gradeOfConcrete} onChange={(e) => setGradeOfConcrete(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">{Object.keys(gradeRatios).map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Diameter</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={diameterCm} onChange={(e) => setDiameterCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Height</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">No. of Columns</label><input type="number" value={noOfColumns} onChange={(e) => setNoOfColumns(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Total Volume</div><div className="text-xl font-bold text-[#3B68FC]">{results?.volume} m³</div><div className="text-sm text-gray-500">{results?.volumeFt3} ft³</div></div>
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
