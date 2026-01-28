import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function TankVolumeCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(12);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(9);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(15);
    const [depthCm, setDepthCm] = useState(0);

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let l, w, d;

        if (unit === 'Meter') {
            l = length + (lengthCm / 100);
            w = width + (widthCm / 100);
            d = depth + (depthCm / 100);
        } else {
            l = (length + (lengthCm / 12)) * 0.3048; // Convert feet+inch to meters
            w = (width + (widthCm / 12)) * 0.3048;
            d = (depth + (depthCm / 12)) * 0.3048;
        }

        const volumeM3 = l * w * d;
        const volumeFt3 = volumeM3 * 35.3147;
        const liters = volumeM3 * 1000;
        const gallons = liters * 0.264172;

        setResults({
            volumeM3: volumeM3.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            liters: liters.toFixed(2),
            gallons: gallons.toFixed(2),
            lengthM: l.toFixed(2),
            widthM: w.toFixed(2),
            depthM: d.toFixed(2),
        });
    };

    useEffect(() => {
        calculate();
    }, [length, lengthCm, width, widthCm, depth, depthCm, unit]);

    useEffect(() => {
        const update = () => {
            if (sidebarRef.current) {
                const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight;
                sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px';
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Flooring Calculator', icon: 'fa-border-all', slug: '/flooring' },
        { name: 'Carpet Area', icon: 'fa-vector-square', slug: '/carpet-area' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Water-Sump/Tank Calculator <span className="text-sm font-normal text-gray-500">IS 3370-1</span></h1>
                    <p className="text-[#6b7280] mb-6">Calculate water tank capacity in liters and cubic meters</p>

                    {/* What is water-sump/tank calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is water-sump/tank calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    <strong>A water tank is a container for storing water.</strong>
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Water tanks are used to provide storage of water for use in many applications, drinking water, irrigation agriculture, fire suppression, agricultural farming, both for plants and livestock, chemical manufacturing, food preparation as well as many other uses.
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    A lot of variety exists in water tank and there are different types of tank:
                                </p>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Chemical contact tank</li>
                                    <li>Ground water tank</li>
                                    <li>Elevated water tank</li>
                                </ul>
                            </div>
                            <img src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Water tank" className="w-full md:w-56 h-48 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Water-Sump/Tank calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Water-Sump/Tank calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="bg-[#f8f9fa] p-6 rounded-xl mb-6">
                                <div className="text-lg font-bold text-[#0A0A0A] mb-4">
                                    <span className="text-[#3B68FC]">Volume of Water-Sump/Tank</span> = Length × Width × Depth
                                </div>
                                <div className="text-lg font-bold text-[#0A0A0A]">
                                    <span className="text-green-600">Total Quantity in Liter(lt.)</span> = Volume of Water-Sump/Tank × 1000
                                </div>
                            </div>

                            {/* Tank Diagram */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <svg width="200" height="150" viewBox="0 0 200 150">
                                        <defs>
                                            <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                                                <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 0.5 }} />
                                            </linearGradient>
                                        </defs>
                                        {/* 3D Tank */}
                                        <path d="M30,40 L150,40 L170,60 L170,130 L50,130 L30,110 L30,40" fill="url(#tankGrad)" stroke="#3b82f6" strokeWidth="2" />
                                        <path d="M30,40 L150,40 L170,60 L50,60 L30,40" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
                                        <path d="M150,40 L170,60 L170,130 L150,110 L150,40" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />

                                        {/* Labels */}
                                        <text x="90" y="145" fontSize="12" fill="#333">length</text>
                                        <text x="175" y="95" fontSize="12" fill="#333">depth</text>
                                        <text x="5" y="75" fontSize="12" fill="#333">breadth</text>
                                    </svg>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 space-y-2">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>m³ (Cubic meter) and ft³ (Cubic feet) is a total volume and Lt (liter) is a total volume in liter.</li>
                                    <li>Length, breadth, and depth in meter/cm and total volume in Lt (liter).</li>
                                </ul>
                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
                                    <strong>Note:</strong><br />
                                    1 m³ = 35.3147 ft³
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Importance of water-sump/tank */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-circle text-[#3B68FC]"></i>
                            Importance of water-sump/tank
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 leading-relaxed">
                                CA water tank or container should do no harm to the water. Water is susceptible to a number of ambient negative influences, including bacteria, viruses, algae, changes in pH, and accumulation of minerals, accumulated gas. The contamination can come from a variety of origins including piping, tank construction materials, animal and bird feces, mineral and gas intrusion. A correctly designed water tank works to address and mitigate these negative effects. It is imperative that water tanks be cleaned annually to preclude delivery of algae, bacteria and viruses to people or animals.
                            </p>
                        </div>
                    </section>

                    {/* Tank capacity table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-table text-[#3B68FC]"></i>
                            Standard Tank Sizes
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-3 py-2 text-left">Tank Type</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Dimensions (L×W×D)</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Capacity (Liters)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-3 py-2">Small Sump</td>
                                            <td className="border border-gray-300 px-3 py-2">3m × 2m × 1.5m</td>
                                            <td className="border border-gray-300 px-3 py-2 font-medium">9,000 Lt</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 px-3 py-2">Medium Sump</td>
                                            <td className="border border-gray-300 px-3 py-2">4m × 3m × 2m</td>
                                            <td className="border border-gray-300 px-3 py-2 font-medium">24,000 Lt</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-3 py-2">Large Sump</td>
                                            <td className="border border-gray-300 px-3 py-2">6m × 4m × 2.5m</td>
                                            <td className="border border-gray-300 px-3 py-2 font-medium">60,000 Lt</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 px-3 py-2">Overhead Tank</td>
                                            <td className="border border-gray-300 px-3 py-2">2m × 2m × 1m</td>
                                            <td className="border border-gray-300 px-3 py-2 font-medium">4,000 Lt</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-th-large text-[#3B68FC]"></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className="bg-white border border-[#e5e7eb] rounded-lg p-4 hover:shadow-lg hover:border-[#3B68FC] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} text-[#3B68FC] group-hover:scale-110 transition-transform`}></i>
                                        <span className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#3B68FC]">{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Inline Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Calculator Widget (Sidebar) */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <i className="fas fa-water text-xl text-blue-500"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">WATER-SUMP/TANK CALCULATION</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                    <option value="Meter">Meter/CM</option>
                                    <option value="Feet">Feet/Inch</option>
                                </select>
                            </div>

                            {/* Length */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Width */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={widthCm} onChange={(e) => setWidthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Depth */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Depth</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full px-3 py-2 pr-14 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={depthCm} onChange={(e) => setDepthCm(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white text-center mb-4">
                                <div className="text-sm opacity-80 mb-1">Capacity of Water-Sump/Tank</div>
                                <div className="text-3xl font-bold text-green-300">{parseFloat(results?.liters || 0).toLocaleString('en-IN')} lt</div>
                            </div>

                            <div className="bg-[#f8f9fa] rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Volume</span>
                                    <span className="font-bold text-[#3B68FC]">{results?.volumeM3} m³ | {results?.volumeFt3} ft³</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="text-xs text-gray-500 mb-1">Water-sump/Tank Calculation</div>
                                    <div className="font-mono text-xs space-y-1">
                                        <p>Total Volume = Length × Width × Depth</p>
                                        <p>Total Volume = <span className="text-[#3B68FC]">{results?.lengthM}</span> × <span className="text-green-600">{results?.widthM}</span> × <span className="text-amber-600">{results?.depthM}</span></p>
                                        <p>Total Volume = <strong>{results?.volumeM3} m³</strong></p>
                                        <p className="mt-2">Total Quantity = Total Volume × 1000</p>
                                        <p>Total Quantity = {results?.volumeM3} × 1000</p>
                                        <p className="text-green-600 font-bold">Total Quantity = {parseFloat(results?.liters || 0).toLocaleString('en-IN')} lt</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
