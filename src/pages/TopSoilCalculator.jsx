import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function TopSoilCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(7);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(0);
    const [depthCm, setDepthCm] = useState(10);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let l, w, d;
        if (unit === 'Meter') {
            l = length + lengthCm / 100;
            w = width + widthCm / 100;
            d = depth + depthCm / 100;
        } else {
            l = (length + lengthCm / 12) * 0.3048;
            w = (width + widthCm / 12) * 0.3048;
            d = (depth + depthCm / 12) * 0.3048;
        }
        const volumeM3 = l * w * d;
        const volumeFt3 = volumeM3 * 35.3147;

        setResults({ volumeM3: volumeM3.toFixed(2), volumeFt3: volumeFt3.toFixed(2), l: l.toFixed(2), w: w.toFixed(2), d: d.toFixed(4) });
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, width, widthCm, depth, depthCm]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Top Soil Calculator <span className="text-sm font-normal text-gray-500">IS 1904</span></h1>
                    <p className="text-[#6b7280] mb-6">Calculate the volume of top soil required</p>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500">Total Volume of Top Soil</div>
                                <div className="text-3xl font-bold text-[#3B68FC]">{results?.volumeM3} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className="text-sm text-gray-600 mb-2">Top soil calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Volume = Length × Width × Depth</p>
                                    <p>Total Volume = {results?.l} m × {results?.w} m × {results?.d} m</p>
                                    <p className="font-bold text-[#3B68FC]">Total Volume = {results?.volumeM3} m³</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is top soil calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Top soil is the upper, outermost layer of soil, usually the top 5 inches (13 cm) to 10 inches (25 cm). It has the highest concentration of organic matter and microorganisms and is where most of the Earth's biological soil activity occurs.</p>
                                <p className="text-gray-600">Top soil is composed of mineral particles, organic matter, water, and air. Organic matter varies in quantity on different soils. The strength of soil structure decreases with the presence of organic matter, creating weak bearing capacities.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Top Soil" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Top Soil Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4">
                                    <div className="text-xl font-mono text-[#3B68FC]">Volume of Top Soil = Length × Width × Depth</div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5"><li>ft³ is a total volume (Cubic feet) and m³ is a cubic meter</li><li>length, breadth and depth in feet/inch.</li></ul>
                                </div>
                                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm"><strong>Note:</strong> 1 m³ = 35.3147 ft³</div>
                            </div>
                            <svg viewBox="0 0 200 150" className="w-48 h-36">
                                <defs><linearGradient id="soilGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" /><stop offset="100%" stopColor="#4c1d95" stopOpacity="0.8" /></linearGradient></defs>
                                <polygon points="30,100 100,100 100,50 30,50" fill="url(#soilGrad)" />
                                <polygon points="100,100 170,70 170,20 100,50" fill="#4c1d95" />
                                <polygon points="30,50 100,50 170,20 100,20" fill="#8b5cf6" />
                                <text x="65" y="130" fontSize="12" fill="#666">length</text>
                                <text x="140" y="90" fontSize="12" fill="#666">depth</text>
                                <text x="130" y="10" fontSize="12" fill="#666">breadth</text>
                            </svg>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-exclamation-circle text-[#3B68FC] mr-2"></i>What are the important top soil?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600">Top soil is the second major substance to grow vegetable plants. Sunlight is the first major factor. The soil depth required for roots on vegetable plants in raised beds or ground-level home gardens Farmlands that have been exhausted may have no visible topsoil left. An undisturbed forest area will have a thick layer of topsoil that has built up over the years. Topsoil has two distinct layers. The visible layer will be organic materials at different levels of decomposition. Just below this layer will be completely decomposed materials called humus. When you make garden compost, you are creating a type of humus.</p>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center gap-3">
                            <i className="fas fa-seedling text-xl text-amber-600"></i>
                            <h2 className="font-semibold">TOP SOIL CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Width</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Depth</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={depthCm} onChange={(e) => setDepthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Total Volume of Top Soil</div><div className="text-2xl font-bold text-amber-600">{results?.volumeM3} m³</div><div className="text-lg font-bold text-gray-600">{results?.volumeFt3} ft³</div></div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
