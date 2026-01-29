import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function AsphaltCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(7);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(10);
    const [depthCm, setDepthCm] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const ASPHALT_DENSITY = 2322; // kg/m³

    const calculate = () => {
        let l, w, d;
        if (unit === 'Meter') {
            l = length + lengthCm / 100;
            w = width + widthCm / 100;
            d = (depth + depthCm / 100) / 100; // depth is in cm
        } else {
            l = (length + lengthCm / 12) * 0.3048;
            w = (width + widthCm / 12) * 0.3048;
            d = (depth + depthCm / 12) * 0.0254;
        }
        const volumeM3 = l * w * d;
        const volumeFt3 = volumeM3 * 35.3147;
        const totalQuantityKg = volumeM3 * ASPHALT_DENSITY;
        const totalQuantityTon = totalQuantityKg / 1000;

        setResults({
            volumeM3: volumeM3.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            totalQuantityKg: totalQuantityKg.toFixed(2),
            totalQuantityTon: totalQuantityTon.toFixed(2),
            l: l.toFixed(0),
            w: w.toFixed(0),
            d: d.toFixed(2),
        });
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
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Asphalt Calculator</h1>
                    <p className="text-[#6b7280] mb-6">Calculate the quantity of asphalt required for road construction</p>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500">Quantity of Asphalt</div>
                                <div className="text-4xl font-bold text-[#3B68FC]">{results?.totalQuantityTon} Ton</div>
                                <div className="text-lg text-gray-600 mt-2">Volume = {results?.volumeM3} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className="text-sm text-gray-600 mb-2">Asphalt calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Volume = Length × Width × Depth</p>
                                    <p>Total Volume = {results?.l} × {results?.w} × {results?.d}</p>
                                    <p className="font-bold text-[#3B68FC]">Total Volume = {results?.volumeM3} m³</p>
                                    <p className="mt-2">Total Quantity = Total Volume × Density of Asphalt</p>
                                    <p>Total Quantity = {results?.volumeM3} × {ASPHALT_DENSITY}</p>
                                    <p className="font-bold text-[#3B68FC]">Total Quantity = {results?.totalQuantityKg} kgs or {results?.totalQuantityTon} ton</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Asphalt calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Asphalt is a mixture of aggregates, binder and filler, used for constructing and maintaining roads, parking areas, railway tracks, ports, airport runways, bicycle lanes, sidewalks and also play- and sport areas.</p>
                            <p className="text-gray-600 mb-4">Aggregates used for asphalt mixtures could be crushed rock, sand, gravel or slags. Nowadays, certain waste and by-products, such as construction and demolition debris, are being used as aggregates, which increases the sustainability of asphalt.</p>
                            <p className="text-gray-600">Most commonly, bitumen is used as a binder, although nowadays, a series of bio-based binders are also under development with the aim of minimising the environmental impact of the roads.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Asphalt Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-[#3B68FC] space-y-2 mb-4">
                                    <p>Volume of Asphalt = Length × Width × Depth</p>
                                    <p>Total Quantity = Total Volume × Density of Asphalt</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5"><li>ft³ is a total volume (Cubic feet) and m³ is a cubic meter</li><li>length, breadth and depth in feet/inch.</li></ul>
                                </div>
                                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm"><strong>Note:</strong> 1 m³ = 35.3147 ft³</div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Asphalt Road" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-exclamation-circle text-[#3B68FC] mr-2"></i>Importance of asphalt calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600">Asphalt is a flexible pavement built in multiple layers with a continuous flow of material moving through the asphalt paver. Asphalt has low initial costs, lasts longer, and due to its recyclability, has residual value greater than other pavements. The smooth surface of asphalt provides maximum tire contact with the roadway, increasing skid resistance. The dark color of asphalt reduces glare, helps melt snow and ice, and provides a high contrast for lane markings. Asphalt pavements are fast to construct. Because asphalt effectively needs no "cure" time, motorists can use roadways as soon as the last roller leaves the construction zone.</p>
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
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-gray-100 to-slate-100 flex items-center gap-3">
                            <i className="fas fa-road text-xl text-gray-600"></i>
                            <h2 className="font-semibold">ASPHALT CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Width</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Depth (cm)</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div><div className="relative"><input type="number" value={depthCm} onChange={(e) => setDepthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">mm</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-[#f8f9fa] rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Quantity of Asphalt</div><div className="text-2xl font-bold text-[#3B68FC]">{results?.totalQuantityTon} Ton</div><div className="text-sm text-gray-600">Volume: {results?.volumeM3} m³</div></div>
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
