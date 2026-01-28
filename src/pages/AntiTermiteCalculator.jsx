import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function AntiTermiteCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(5);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(4);
    const [widthCm, setWidthCm] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let l, w;
        if (unit === 'Meter') {
            l = length + lengthCm / 100;
            w = width + widthCm / 100;
        } else {
            l = (length + lengthCm / 12) * 0.3048;
            w = (width + widthCm / 12) * 0.3048;
        }
        const areaM2 = l * w;
        const areaFt2 = areaM2 * 10.764;
        const quantityMl = areaM2 * 30; // 30 ml per sq meter

        setResults({ areaM2: areaM2.toFixed(2), areaFt2: areaFt2.toFixed(2), quantityMl: quantityMl.toFixed(2), l: l.toFixed(2), w: w.toFixed(2) });
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, width, widthCm]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Anti-Termite Calculator <span className="text-sm font-normal text-gray-500">IS 6313-2</span></h1>
                    <p className="text-[#6b7280] mb-6">Calculate the quantity of anti-termite chemical required</p>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500">Quantity of Anti Termite</div>
                                <div className="text-4xl font-bold text-[#3B68FC]">{results?.quantityMl} ml</div>
                            </div>
                            <div className="text-center mb-4">
                                <div className="text-lg text-gray-600">Area = {results?.areaM2} m² <span className="text-gray-400">|</span> {results?.areaFt2} ft²</div>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className="text-sm text-gray-600 mb-2">Anti-Termite calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Area = Length × Width</p>
                                    <p>Total Area = {results?.l} × {results?.w}</p>
                                    <p className="font-bold text-[#3B68FC]">Total Area = {results?.areaM2} m²</p>
                                    <p className="mt-2">Total Quantity = Total Area × 30</p>
                                    <p>Total quantity = {results?.areaM2} × 30</p>
                                    <p className="font-bold text-[#3B68FC]">Total quantity = {results?.quantityMl} ml</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is anti-termite calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Anti-termite treatment is a process of spraying the strong termite chemicals in the foundation pits. The purpose of anti termite treatment is to kill and resist the entry of termites.</p>
                                <p className="text-gray-600 mb-4">Pre constructional anti-termite treatment is a process in which soil treatment is applied to a building in early stages of its construction.</p>
                                <p className="text-gray-600">Anti termite treatment being a specialized job, calls for thorough knowledge of the chemicals, soils, termite to be dealt with and the environmental conditions, in order to give effective treatment and lasting protection to the property undergoing treatment.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Construction" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Anti-Termite calculation</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-[#3B68FC] space-y-2 mb-4">
                                    <p>Area For Anti Termite = Length × Width</p>
                                    <p>Quantity of Anti Termite = Square Meter × 30</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5"><li>m² is a total area (square meter) and ft² is a square feet</li><li>length and breadth in meter/cm and quantity in ml (milliliter)</li></ul>
                                </div>
                                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm"><strong>Note:</strong> 1m² = 10.7639ft²</div>
                            </div>
                            <svg viewBox="0 0 200 150" className="w-48 h-36">
                                <defs><linearGradient id="termiteGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b68fc" stopOpacity="0.8" /><stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" /></linearGradient></defs>
                                <polygon points="30,100 100,100 100,50 30,50" fill="url(#termiteGrad)" />
                                <polygon points="100,100 170,70 170,20 100,50" fill="#1e40af" />
                                <polygon points="30,50 100,50 170,20 100,20" fill="#60a5fa" />
                                <text x="65" y="130" fontSize="12" fill="#666">length</text>
                                <text x="130" y="50" fontSize="12" fill="#666">breadth</text>
                            </svg>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-exclamation-circle text-[#3B68FC] mr-2"></i>What are the important anti-termite</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600">Termite control in buildings is very important as the damage likely to be caused by the termites is huge. Wood is one of the cellulosic materials which termites damage, cellulose forming their basic nutrient. They also damage materials of organic origin with a cellulosic base, household articles like furniture, furnishings, clothing, stationery, etc. Termites are also known to damage noncellulosic substances in their search for food rubber, leather, plastics, neoprene as well as lead coating used for covering of underground cables are damaged by termites. The widespread damage by termites, high constructional cost of buildings have necessitated evolving suitable measures for preventing access of termites to buildings.</p>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-red-50 to-orange-50 flex items-center gap-3">
                            <i className="fas fa-bug text-xl text-red-600"></i>
                            <h2 className="font-semibold">ANTI-TERMITE CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Width</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Quantity of Anti Termite</div><div className="text-2xl font-bold text-red-600">{results?.quantityMl} ml</div><div className="text-sm text-gray-600">Area: {results?.areaM2} m² | {results?.areaFt2} ft²</div></div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
