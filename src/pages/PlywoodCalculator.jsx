import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function PlywoodCalculator() {
    const [unit, setUnit] = useState('Feet');
    const [roomLengthFt, setRoomLengthFt] = useState(12);
    const [roomLengthIn, setRoomLengthIn] = useState(0);
    const [roomWidthFt, setRoomWidthFt] = useState(14);
    const [roomWidthIn, setRoomWidthIn] = useState(0);
    const [plywoodLengthFt, setPlywoodLengthFt] = useState(4);
    const [plywoodLengthIn, setPlywoodLengthIn] = useState(0);
    const [plywoodWidthFt, setPlywoodWidthFt] = useState(8);
    const [plywoodWidthIn, setPlywoodWidthIn] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const roomLength = roomLengthFt + roomLengthIn / 12;
        const roomWidth = roomWidthFt + roomWidthIn / 12;
        const plywoodLength = plywoodLengthFt + plywoodLengthIn / 12;
        const plywoodWidth = plywoodWidthFt + plywoodWidthIn / 12;

        const roomAreaFt = roomLength * roomWidth;
        const roomAreaM = roomAreaFt / 10.764;
        const plywoodCoverFt = plywoodLength * plywoodWidth;
        const plywoodCoverM = plywoodCoverFt / 10.764;
        const sheetsRequired = roomAreaFt / plywoodCoverFt;

        setResults({
            roomAreaFt: roomAreaFt.toFixed(2),
            roomAreaM: roomAreaM.toFixed(2),
            plywoodCoverFt: plywoodCoverFt.toFixed(2),
            plywoodCoverM: plywoodCoverM.toFixed(2),
            sheetsRequired: sheetsRequired.toFixed(2),
            roomLength: roomLength.toFixed(0),
            roomWidth: roomWidth.toFixed(0),
            plywoodLength: plywoodLength.toFixed(0),
            plywoodWidth: plywoodWidth.toFixed(0),
        });
    };

    useEffect(() => { calculate(); }, [roomLengthFt, roomLengthIn, roomWidthFt, roomWidthIn, plywoodLengthFt, plywoodLengthIn, plywoodWidthFt, plywoodWidthIn, unit]);
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Plywood Sheets Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the number of plywood sheets required for your room</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="plywood-calculator"
                            calculatorName="Plywood Calculator"
                            calculatorIcon="fa-layer-group"
                            category="Quantity Estimator"
                            inputs={{ unit, roomLengthFt, roomWidthFt }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-[#3B68FC]">{results?.sheetsRequired} <span className="text-lg">Plywood Sheets Required</span></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Room Area</div>
                                    <div className="text-xl font-bold text-[#3B68FC]">{results?.roomAreaM} m² <span className="text-gray-400">|</span> {results?.roomAreaFt} ft²</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Plywood Cover</div>
                                    <div className="text-xl font-bold text-green-500">{results?.plywoodCoverM} m² <span className="text-gray-400">|</span> {results?.plywoodCoverFt} ft²</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Plywood sheets calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">Room Area</div>
                                    <div className="text-xs">= Room Length × Room Width</div>
                                    <div className="text-xs">= {results?.roomLength} × {results?.roomWidth}</div>
                                    <div className="font-bold text-[#3B68FC]">{results?.roomAreaFt} sq. ft.</div>
                                    <div className="text-sm text-gray-500">{results?.roomAreaM} sq. mt.</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">Plywood Cover</div>
                                    <div className="text-xs">= Plywood Length × Plywood Width</div>
                                    <div className="text-xs">= {results?.plywoodLength} × {results?.plywoodWidth}</div>
                                    <div className="font-bold text-green-500">{results?.plywoodCoverFt} sq. ft.</div>
                                    <div className="text-sm text-gray-500">{results?.plywoodCoverM} sq. mt.</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">No. of Sheets Required</div>
                                    <div className="text-xs">= Room Area / Plywood Cover</div>
                                    <div className="text-xs">= {results?.roomAreaFt} / {results?.plywoodCoverFt}</div>
                                    <div className="font-bold text-red-500">= {results?.sheetsRequired} Sheets</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is plywood sheets calculator?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Plywood as a building material is very widely used due to its many useful properties. It is an economical, factory-produced sheet of wood with precise dimensions that does not warp or crack with changes in atmospheric moisture. Ply is an engineered wood product made from three or more plies or thin sheets of wood.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-amber-700 mb-2">Exterior Plywood</h3>
                                    <p className="text-sm text-gray-600">This type of plywood is bound together by a water resistant glue and is typically for outdoor use. Suitable for: Walls, Outdoor floorings, Roof linings, Stables</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-blue-700 mb-2">Interior Plywood</h3>
                                    <p className="text-sm text-gray-600">Interior plywood is mainly used indoors and should not be exposed to the outdoor elements. Suitable for: Indoor furniture, Ceilings, Interior cladding</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Formula for plywood sheets calculation</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-[#3B68FC] space-y-2">
                                    <p>Room area = Room Length × Room Width</p>
                                    <p>Plywood cover = Plywood Length × Plywood Width</p>
                                    <p>No. of sheets required = Room Area / Plywood Cover</p>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Plywood" className="w-full md:w-48 h-40 object-cover rounded-lg" />
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
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 flex items-center gap-3">
                            <i className="fas fa-layer-group text-xl text-amber-600"></i>
                            <h2 className="font-semibold">PLYWOOD SHEETS CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Room Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={roomLengthFt} onChange={(e) => setRoomLengthFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={roomLengthIn} onChange={(e) => setRoomLengthIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Room Width</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={roomWidthFt} onChange={(e) => setRoomWidthFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={roomWidthIn} onChange={(e) => setRoomWidthIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Plywood Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={plywoodLengthFt} onChange={(e) => setPlywoodLengthFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={plywoodLengthIn} onChange={(e) => setPlywoodLengthIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Plywood Width</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={plywoodWidthFt} onChange={(e) => setPlywoodWidthFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={plywoodWidthIn} onChange={(e) => setPlywoodWidthIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-amber-600">{results?.sheetsRequired}</div><div className="text-sm text-gray-600">Plywood Sheets Required</div></div>
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
