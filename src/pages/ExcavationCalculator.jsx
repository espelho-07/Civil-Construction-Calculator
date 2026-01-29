import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function ExcavationCalculator() {
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(7);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(4);
    const [depthCm, setDepthCm] = useState(0);

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

        setResults({
            volumeM3: volumeM3.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
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
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Top Soil Calculator', icon: 'fa-seedling', slug: '#' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Excavation Calculator <span className="text-sm font-normal text-gray-500">IS 3764</span></h1>
                            <p className="text-[#6b7280]">Calculate the total volume of excavation for earthwork</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="excavation"
                            calculatorName="Excavation Calculator"
                            calculatorIcon="fa-mountain"
                            category="Quantity Estimator"
                            inputs={{ unit, length, lengthCm, width, widthCm, depth, depthCm }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Display */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="text-center mb-6">
                                <div className="text-sm text-gray-500">Total Volume of Excavation</div>
                                <div className="text-3xl font-bold text-[#3B68FC]">{results?.volumeM3} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
                            </div>

                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className="text-sm text-gray-600 mb-2">Excavation calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Volume = Length × Width × Depth</p>
                                    <p>Total Volume = {results?.lengthM} × {results?.widthM} × {results?.depthM}</p>
                                    <p className="font-bold text-[#3B68FC]">Total Volume = {results?.volumeM3} m³</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Excavation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is excavation calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Excavation is the process of digging. Excavation will be understood as the process of excavating and removing volumes of earth or other materials for the conformation of spaces.
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Excavation is used in construction to create building foundations, reservoirs and roads. Some of the different processes used in excavation include trenching, digging, and dredging and site development.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    We determine excavation method to use to find the volume. In this case we are dealing with a rectangular box because it describes a length, width and depth.
                                </p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Excavation work" className="w-full md:w-56 h-48 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Excavation Calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4">
                                    <div className="text-xl font-mono text-[#3B68FC]">
                                        Volume of Excavation = Length × Width × Depth
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5">
                                        <li>ft³ is a total volume (cubic feet) and m³ is a cubic meter</li>
                                        <li>length, breadth and depth in feet/inch.</li>
                                    </ul>
                                </div>
                                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                                    <strong>Note:</strong> 1 m³ = 35.3147 ft³
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <svg viewBox="0 0 200 150" className="w-48 h-36">
                                    <defs>
                                        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#3B68FC" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
                                        </linearGradient>
                                    </defs>
                                    {/* 3D Box */}
                                    <polygon points="30,100 100,100 100,50 30,50" fill="url(#boxGrad)" />
                                    <polygon points="100,100 170,70 170,20 100,50" fill="#1e40af" />
                                    <polygon points="30,50 100,50 170,20 100,20" fill="#60a5fa" />
                                    {/* Labels */}
                                    <text x="65" y="130" fontSize="12" fill="#666">length</text>
                                    <text x="140" y="90" fontSize="12" fill="#666">depth</text>
                                    <text x="130" y="10" fontSize="12" fill="#666">breadth</text>
                                </svg>
                            </div>
                        </div>
                    </section>

                    {/* Important factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            What are the important excavation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 leading-relaxed mb-4">
                                The excavations pose the risks related to falls, falling loads, hazardous atmospheres, and incidents involving mobile equipment. Trench collapses cause dozens of fatalities and hundreds of injuries each year. Hence, employer needs to follow strict Excavation Rule to ensure safety of the workers in excavation process.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Safety First', desc: 'Follow IS 3764 safety guidelines', icon: 'fa-hard-hat' },
                                    { title: 'Soil Type', desc: 'Affects excavation method and shoring', icon: 'fa-mountain' },
                                    { title: 'Water Table', desc: 'Dewatering may be required', icon: 'fa-water' },
                                    { title: 'Disposal', desc: 'Plan for earth disposal/reuse', icon: 'fa-truck' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                                        <i className={`fas ${item.icon} text-[#3B68FC] mt-1`}></i>
                                        <div>
                                            <div className="font-medium text-[#0A0A0A]">{item.title}</div>
                                            <div className="text-sm text-[#6b7280]">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-th-large text-[#3B68FC]"></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </div>

                {/* Calculator Widget (Sidebar) */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50">
                            <i className="fas fa-truck-loading text-xl text-amber-600"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">EXCAVATION CALCULATION</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit */}
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
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">Total Volume of Excavation</div>
                                    <div className="text-2xl font-bold text-amber-600">{results?.volumeM3} m³</div>
                                    <div className="text-lg font-bold text-gray-600">{results?.volumeFt3} ft³</div>
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
