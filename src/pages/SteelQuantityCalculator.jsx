import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function SteelQuantityCalculator() {
    const [memberType, setMemberType] = useState('Footing');
    const [concreteQuantity, setConcreteQuantity] = useState(30);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const memberSteelRates = {
        'Footing': 80,
        'Beam': 160,
        'Column': 110,
        'Slab': 80,
        'StairCase': 85,
        'Lintle/Chhajja/Coping': 50,
        'Retaining Wall': 60,
    };

    const calculate = () => {
        const steelRate = memberSteelRates[memberType];
        const weightKg = steelRate * concreteQuantity;
        const weightTon = weightKg / 1000;

        setResults({ weightKg: weightKg.toFixed(2), weightTon: weightTon.toFixed(2), steelRate });
    };

    useEffect(() => { calculate(); }, [memberType, concreteQuantity]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const steelTable = [
        { type: 'Footing', concrete: '1 m³', steel: '80 kg.' },
        { type: 'Beam', concrete: '1 m³', steel: '160 kg.' },
        { type: 'Column', concrete: '1 m³', steel: '110 kg.' },
        { type: 'Slab', concrete: '1 m³', steel: '80 kg.' },
        { type: 'StairCase', concrete: '1 m³', steel: '85 kg.' },
        { type: 'Lintle/Chhajja/Coping', concrete: '1 m³', steel: '50 kg.' },
        { type: 'Retaining Wall', concrete: '1 m³', steel: '60 kg.' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Steel Quantity Calculator</h1>
                        <CalculatorActions
                            calculatorSlug="steel-quantity"
                            calculatorName="Steel Quantity Calculator"
                            calculatorIcon="fa-calculator"
                            category="Quantity Estimator"
                            inputs={{ memberType, concreteQuantity }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate steel quantity based on member type and concrete volume</p>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500">Weight of steel in kg.</div>
                                <div className="text-4xl font-bold text-[#3B68FC]">{results?.weightKg} kg.</div>
                                <div className="text-sm text-gray-500 mt-2">Weight of steel in ton</div>
                                <div className="text-2xl font-bold text-gray-600">{results?.weightTon} ton</div>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className="text-sm text-gray-600 mb-2">Steel Quantity Calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Steel quantity = Member type × Concrete quantity</p>
                                    <p>Steel quantity = {results?.steelRate} × {concreteQuantity}</p>
                                    <p className="font-bold text-[#3B68FC]">Total Quantity = {results?.weightKg} kg or {results?.weightTon} ton</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Steel Quantity calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">A steel used in building structure fabricated with steel for the internal support and for exterior cladding, as opposed to steel framed buildings which generally use other materials for floors, walls, and external envelope. Steel buildings are used for a variety of purposes including storage, work spaces and living accommodation.</p>
                                <p className="text-gray-600">Steel is used because it binds well to concrete, has a similar thermal expansion coefficient and is strong and relatively cost-effective. Reinforced concrete is also used to provide deep foundations and basements and is currently the world's primary building material.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Steel Construction" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-table text-[#3B68FC] mr-2"></i>How many steel quantity require for member types?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm text-red-700">
                                <i className="fas fa-info-circle mr-2"></i>Some common types of steel construction is footing, beam, column, slab, lintle, retaining wall, stair case for that require steel weight is given below in table.
                            </div>
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-3 py-2 text-left">Member Type</th><th className="border px-3 py-2 text-left">Concrete Quantity</th><th className="border px-3 py-2 text-left">Steel Weight</th></tr></thead>
                                <tbody>{steelTable.map((row, i) => <tr key={i}><td className="border px-3 py-2">{row.type}</td><td className="border px-3 py-2">{row.concrete}</td><td className="border px-3 py-2">{row.steel}</td></tr>)}</tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-gray-100 to-slate-100 flex items-center gap-3">
                            <i className="fas fa-bars text-xl text-gray-600"></i>
                            <h2 className="font-semibold">STEEL QUANTITY CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Member Type</label><select value={memberType} onChange={(e) => setMemberType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">{Object.keys(memberSteelRates).map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Concrete Quantity (m³)</label><div className="relative"><input type="number" value={concreteQuantity} onChange={(e) => setConcreteQuantity(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">m³</span></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-[#f8f9fa] rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Weight of steel</div><div className="text-2xl font-bold text-[#3B68FC]">{results?.weightKg} kg</div><div className="text-lg font-bold text-gray-600">{results?.weightTon} ton</div></div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
