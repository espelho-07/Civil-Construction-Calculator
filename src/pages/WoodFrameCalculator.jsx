import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function WoodFrameCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [depth, setDepth] = useState(2);
    const [depthCm, setDepthCm] = useState(0);
    const [thickness, setThickness] = useState(6);
    const [thicknessCm, setThicknessCm] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let l, d, t;
        if (unit === 'Meter') {
            l = length + lengthCm / 100;
            d = depth + depthCm / 100;
            t = thickness + thicknessCm / 100;
        } else {
            l = (length + lengthCm / 12) * 0.3048;
            d = (depth + depthCm / 12) * 0.3048;
            t = (thickness + thicknessCm / 12) * 0.3048;
        }
        const volumeM3 = l * d * t;
        const volumeFt3 = volumeM3 * 35.3147;

        setResults({
            volumeM3: volumeM3.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            l: l.toFixed(0),
            d: d.toFixed(0),
            t: t.toFixed(0),
        });
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, depth, depthCm, thickness, thicknessCm]);
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Wood-Frame Calculator <span className="text-sm font-normal text-gray-500">IS 4021</span></h1>
                            <p className="text-[#6b7280]">Calculate the volume of wood required for framing</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="wood-frame-calculator"
                            calculatorName="Wood Frame Calculator"
                            calculatorIcon="fa-tree"
                            category="Quantity Estimator"
                            inputs={{ unit, length, depth, thickness }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is wood-frame calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Wood frame construction is the predominant method of building homes and apartments. Increasingly, wood framing is also being used in commercial and industrial buildings.</p>
                                <p className="text-gray-600 mb-4">Calculate wood log required in both cubic feet and cubic meter. With this calculator you can exactly know how much wood is required to build door and window frames.</p>
                                <p className="text-gray-600 mb-4">Wood is versatile and can be used in a wide variety of ways. Being light, it is easy to install and can be worked with simple equipment. This reduces the energy needed for construction. Different species of tree produce wood of differing colors, textures and functional qualities.</p>
                                <p className="text-gray-600">We determine wood-frame method to use to find the area. In this case we are dealing with a length, breadth, and thickness.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Wood Frame" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Wood-Frame calculation</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4">
                                    <div className="text-xl font-mono text-[#3B68FC]">Volume of wood frame = Length × Depth × Thickness</div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5"><li>ft³ is a total volume (cubic feet) and m³ is a cubic meter</li><li>length, breadth and thickness in feet/inch</li></ul>
                                </div>
                                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm"><strong>Note:</strong> 1 m³ = 35.3147 ft³</div>
                            </div>
                            <svg viewBox="0 0 200 150" className="w-48 h-36">
                                <defs><linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d97706" stopOpacity="0.8" /><stop offset="100%" stopColor="#92400e" stopOpacity="0.8" /></linearGradient></defs>
                                <polygon points="30,100 130,100 130,60 30,60" fill="url(#woodGrad)" />
                                <polygon points="130,100 180,70 180,30 130,60" fill="#92400e" />
                                <polygon points="30,60 130,60 180,30 80,30" fill="#fbbf24" />
                                <text x="80" y="120" fontSize="10" fill="#666">Length</text>
                                <text x="155" y="90" fontSize="10" fill="#666">Thickness</text>
                                <text x="130" y="25" fontSize="10" fill="#666">Width</text>
                            </svg>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-exclamation-circle text-[#3B68FC] mr-2"></i>What are the important wood-frame?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Wood is a natural insulator and can help reduce energy needs when it is used in windows, doors and floors. A wood frame allows more space for insulation than a brick building, and wood itself also has naturally thermally insulating properties. Of course, a better insulated home requires less energy to heat and cool, which typically means less fossil fuel use.</p>
                            <p className="text-gray-600">Wood also has better insulating properties than steel. Wood's structure contains minute air pockets, which limit its ability to conduct heat and help to minimize the energy needed for heating and cooling our eco timber houses providing very energy efficient homes.</p>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center gap-3">
                            <i className="fas fa-tree text-xl text-amber-600"></i>
                            <h2 className="font-semibold">WOOD-FRAME CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Depth</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={depthCm} onChange={(e) => setDepthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Thickness</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={thicknessCm} onChange={(e) => setThicknessCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4">
                                <div className="text-center mb-3">
                                    <div className="text-xs text-gray-500">Total Volume of Wood Frame</div>
                                    <div className="text-2xl font-bold text-[#3B68FC]">{results?.volumeM3} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center text-sm">
                                    <div className="text-gray-600">Wood-Frame calculation</div>
                                    <div className="font-mono text-xs mt-1">Total Volume = Length × Depth × Thickness</div>
                                    <div className="font-mono text-xs">Total Volume = {results?.l} × {results?.d} × {results?.t}</div>
                                    <div className="font-bold text-[#3B68FC]">Total Volume = {results?.volumeM3} m³</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
