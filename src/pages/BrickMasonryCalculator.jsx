import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function InfoTooltip({ text }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block">
            <button
                type="button"
                className="w-4 h-4 bg-[#3B68FC] text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                i
            </button>
            {show && (
                <div className="absolute left-6 top-0 z-50 w-56 p-3 bg-white border border-[#e5e7eb] rounded-lg shadow-lg text-xs text-[#0A0A0A] leading-relaxed">
                    {text}
                </div>
            )}
        </div>
    );
}

export default function BrickMasonryCalculator() {
    const [unit, setUnit] = useState('Feet');
    const [length, setLength] = useState(10);
    const [height, setHeight] = useState(10);
    const [thickness, setThickness] = useState(20);
    const [ratio, setRatio] = useState('1:6');
    const [brickL, setBrickL] = useState(19);
    const [brickW, setBrickW] = useState(9);
    const [brickH, setBrickH] = useState(9);

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const l = unit === 'Feet' ? length * 0.3048 : length;
        const h = unit === 'Feet' ? height * 0.3048 : height;
        const t = thickness / 100;

        const wallVolume = l * h * t;
        const bL_m = (brickL + 1) / 100;
        const bW_m = (brickW + 1) / 100;
        const bH_m = (brickH + 1) / 100;

        const oneBrickVol = bL_m * bW_m * bH_m;
        const totalBricks = Math.ceil(wallVolume / oneBrickVol);

        const actualBrickVol = (brickL / 100) * (brickW / 100) * (brickH / 100);
        const bricksVolume = totalBricks * actualBrickVol;
        let wetMortarVol = wallVolume - bricksVolume;
        const dryMortarVol = wetMortarVol * 1.33;

        const parts = ratio.split(':').map(Number);
        const totalParts = parts[0] + parts[1];

        const cementVol = (dryMortarVol * parts[0]) / totalParts;
        const sandVol = (dryMortarVol * parts[1]) / totalParts;

        const cementBags = Math.ceil(cementVol * 28.8);
        const sandTon = sandVol * 1.6;

        setResults({
            bricks: totalBricks,
            cement: cementBags,
            sand: sandTon.toFixed(2),
            wallVolume: wallVolume.toFixed(3),
            mortarVol: wetMortarVol.toFixed(3),
            dryMortarVol: dryMortarVol.toFixed(3),
            cementVol: cementVol.toFixed(4),
            sandVol: sandVol.toFixed(4),
        });
    };

    useEffect(() => {
        calculate();
    }, [length, height, thickness, ratio, brickL, brickW, brickH, unit]);

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

    const chartData = {
        labels: ['Bricks', 'Mortar'],
        datasets: [{
            data: [70, 30],
            backgroundColor: ['#ef4444', '#3b82f6'],
            borderWidth: 0,
        }],
    };

    const relatedCalculators = [
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Carpet Area', icon: 'fa-vector-square', slug: '/carpet-area' },
        { name: 'Countertop Calculator', icon: 'fa-ruler-combined', slug: '/countertop' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Brick Masonry Calculator</h1>
                    <p className="text-[#6b7280] mb-6">Calculate bricks, cement and sand required for masonry work</p>

                    {/* What is Brick Masonry? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Brick Masonry calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Brick Masonry is the a strong and durable form of construction, and can be used in all types of climate and in any position. The best process used in modern times, the best materials, and proper supervision, may hold the structure in good condition for a long time.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                Brick masonry calculation helps determine the number of bricks and quantity of mortar (cement and sand) required for constructing walls. The calculation depends on wall dimensions, brick size, and mortar ratio.
                            </p>
                        </div>
                    </section>

                    {/* Brick Masonry Calculation Steps */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Brick masonry calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] space-y-4">
                            <div className="font-semibold text-gray-800">Step 1:</div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2">
                                <p><span className="text-[#3B68FC]">Volume of Brick Masonry</span> = Length(L) × Height(H) × Wall Thickness (T)</p>
                                <p>Volume of Brick Masonry = {length} × {height} × {thickness / 100}</p>
                                <p>Volume of Brick Masonry = <strong>{results?.wallVolume} m³</strong></p>
                            </div>

                            <div className="font-semibold text-gray-800">Dimension:</div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm">
                                <p>Dimension = 19 (cm) × 9 (cm) × 9 (cm)</p>
                                <p>Dimension = (0.19 m) × (0.09 m) × (0.09 m)</p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                                <strong>Note:</strong> Mortar thickness is assumed as 1 cm = 10mm
                            </div>

                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-1">
                                <p><span className="text-[#3B68FC]">Size of Brick with Mortar</span> = 0.20 × 0.10 × 0.10 = 0.002 m³</p>
                                <p>Actual Volume of Brick = 0.19 × 0.09 × 0.09 = 0.00154 m³</p>
                            </div>

                            <div className="font-semibold text-gray-800 mt-4">No. of Bricks:</div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm">
                                <p>No of Bricks = <span className="text-[#3B68FC]">Volume of Brick Masonry</span> / <span className="text-green-600">Actual Volume of 1 Brick with mortar</span></p>
                                <p>No of Bricks = {results?.wallVolume} / 0.002</p>
                                <p className="text-xl font-bold text-red-500 mt-2">= {results?.bricks} Bricks</p>
                            </div>

                            {/* Step 2: Cement */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Step 2: Amount of Cement Required</span>
                                    </div>
                                    <div className="text-sm space-y-2 font-mono bg-[#f8f9fa] p-3 rounded">
                                        <p>Dry Vol = {results?.dryMortarVol} m³</p>
                                        <p>Cement = Dry Vol × (Cement Ratio / Sum)</p>
                                        <p>Cement = {results?.dryMortarVol} × (1/7)</p>
                                        <p>= {results?.cementVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="text-xs text-gray-500">Cement in Bags</div>
                                        <div className="text-2xl font-bold text-blue-600">{results?.cement}</div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">Step 3: Amount of Sand Required</span>
                                    </div>
                                    <div className="text-sm space-y-2 font-mono bg-[#f8f9fa] p-3 rounded">
                                        <p>Sand = Dry Vol × (Sand Ratio / Sum)</p>
                                        <p>Sand = {results?.dryMortarVol} × (6/7)</p>
                                        <p>= {results?.sandVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="text-xs text-gray-500">Sand in Ton</div>
                                        <div className="text-2xl font-bold text-amber-600">{results?.sand}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Brick Masonry Formulas */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-square-root-alt text-[#3B68FC]"></i>
                            Brick Masonry Formulas
                        </h2>
                        <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 rounded-xl p-6 border border-[#3B68FC]/20">
                            <div className="space-y-3 font-mono text-sm">
                                <p><strong className="text-[#3B68FC]">Volume of Brick Masonry</strong> = Length × Height × Thickness | Wall Volume</p>
                                <p><strong className="text-[#3B68FC]">Dimension</strong> = Brick Length × Brick Width × Brick Height</p>
                                <p><strong className="text-green-600]">No. of Bricks</strong> = Volume of Brick Masonry / Volume of 1 Brick with mortar</p>
                                <p><strong className="text-amber-600">Amount of Cement</strong> = (Dry Volume × Cement Ratio) / Sum of Ratio | Volume of Cement</p>
                                <p><strong className="text-amber-600">Amount of Sand</strong> = (Dry Volume × Sand Ratio) / Sum of Ratio × Density of Sand</p>
                            </div>
                        </div>
                    </section>

                    {/* Important Notes */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            What are the important factors to consider?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Brick masonry is the a strong and durable form of construction, and can be used in all types of climate and in any position. But the raw materials of the best quality used in modern times, the best materials, and proper supervision, may hold the structure in good condition for a long time.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Brick Quality', desc: 'First class, second class bricks', icon: 'fa-check-circle' },
                                    { title: 'Mortar Ratio', desc: '1:4, 1:5, 1:6 depending on use', icon: 'fa-percentage' },
                                    { title: 'Wall Thickness', desc: '4 inch, 9 inch, 13.5 inch', icon: 'fa-ruler' },
                                    { title: 'Wastage Factor', desc: 'Add 5-10% for breakage', icon: 'fa-recycle' },
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
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50">
                            <i className="fas fa-th-large text-xl text-red-500"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">BRICK MASONRY CALCULATOR</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden">
                                    <button onClick={() => setUnit('Feet')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Feet' ? 'bg-[#3B68FC] text-white' : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Feet</button>
                                    <button onClick={() => setUnit('Meter')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Meter' ? 'bg-[#3B68FC] text-white' : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Meter</button>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                    <div className="relative">
                                        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit.slice(0, 2).toLowerCase()}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Height</label>
                                    <div className="relative">
                                        <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit.slice(0, 2).toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Wall Thickness</label>
                                    <select value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                        <option value={10}>10 cm (4")</option>
                                        <option value={20}>20 cm (9")</option>
                                        <option value={34}>34 cm (13.5")</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Ratio</label>
                                    <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                        <option value="1:4">1:4</option>
                                        <option value="1:5">1:5</option>
                                        <option value="1:6">1:6</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Size of Brick (L × W × H) cm</label>
                                <div className="flex gap-2">
                                    <input type="number" value={brickL} onChange={(e) => setBrickL(Number(e.target.value))} className="w-full px-2 py-2 border border-[#e5e7eb] rounded-lg text-sm text-center" />
                                    <span className="text-gray-400 self-center">×</span>
                                    <input type="number" value={brickW} onChange={(e) => setBrickW(Number(e.target.value))} className="w-full px-2 py-2 border border-[#e5e7eb] rounded-lg text-sm text-center" />
                                    <span className="text-gray-400 self-center">×</span>
                                    <input type="number" value={brickH} onChange={(e) => setBrickH(Number(e.target.value))} className="w-full px-2 py-2 border border-[#e5e7eb] rounded-lg text-sm text-center" />
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <div className="text-xs text-gray-500">Total Bricks required</div>
                                        <div className="text-3xl font-bold text-red-500">{results?.bricks}</div>
                                    </div>
                                    <div className="w-20 h-20">
                                        <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mb-1">Volume of Construction</div>
                                <div className="flex gap-3 text-xs">
                                    <span><i className="fas fa-cubes text-blue-500 mr-1"></i> Cement: <strong>{results?.cement} bags</strong></span>
                                    <span><i className="fas fa-truck-loading text-amber-500 mr-1"></i> Sand: <strong>{results?.sand} Ton</strong></span>
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
