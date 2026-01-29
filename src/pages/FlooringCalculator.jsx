import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FlooringCalculator() {
    const [unit, setUnit] = useState('Feet');
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [tileSize, setTileSize] = useState('2x2');
    const [ratio, setRatio] = useState('1:4');

    const tileSizes = {
        '2x2': { l: 2, w: 2, label: '2 x 2 Feet' },
        '2x1': { l: 2, w: 1, label: '2 x 1 Feet' },
        '4x2': { l: 4, w: 2, label: '4 x 2 Feet' },
        '1x1': { l: 1, w: 1, label: '1 x 1 Feet' },
        '60x60': { l: 2, w: 2, label: '60 x 60 cm' },
        '60x120': { l: 4, w: 2, label: '60 x 120 cm' },
    };

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const l = unit === 'Feet' ? length : length * 3.281;
        const w = unit === 'Feet' ? width : width * 3.281;

        const totalArea = l * w;
        const totalAreaM = totalArea / 10.7639;

        const tile = tileSizes[tileSize];
        const tileArea = tile.l * tile.w;
        const noOfTiles = Math.ceil((totalArea / tileArea) * 1.05); // 5% wastage

        // Flooring mortar calculation (12mm thick bed)
        const mortarThickness = 0.012; // 12mm in meters
        const mortarVolume = totalAreaM * mortarThickness;
        const dryVolume = mortarVolume * 1.33;

        const parts = ratio.split(':').map(Number);
        const totalParts = parts[0] + parts[1];

        const cementVol = (dryVolume * parts[0]) / totalParts;
        const sandVol = (dryVolume * parts[1]) / totalParts;

        const cementBags = Math.ceil(cementVol * 28.8);
        const sandTon = (sandVol * 1.55).toFixed(2);

        setResults({
            totalArea: totalArea.toFixed(2),
            totalAreaM: totalAreaM.toFixed(2),
            noOfTiles,
            tileArea: tileArea.toFixed(2),
            mortarVolume: mortarVolume.toFixed(4),
            dryVolume: dryVolume.toFixed(4),
            cement: cementBags,
            cementVol: cementVol.toFixed(4),
            sand: sandTon,
            sandVol: sandVol.toFixed(4),
        });
    };

    useEffect(() => {
        calculate();
    }, [length, width, tileSize, ratio, unit]);

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
        labels: ['Tiles', 'Cement', 'Sand'],
        datasets: [{
            data: [60, 20, 20],
            backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b'],
            borderWidth: 0,
        }],
    };

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Carpet Area', icon: 'fa-vector-square', slug: '/carpet-area' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Flooring Calculator</h1>
                            <p className="text-[#6b7280]">Calculate number of tiles, cement and sand for flooring work</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="flooring-calculator"
                            calculatorName="Flooring Calculator"
                            calculatorIcon="fa-border-all"
                            category="Quantity Estimator"
                            inputs={{ unit, length, width, tileSize, ratio }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Flooring Calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Flooring calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">

                            {/* Total Area & No of Tiles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-[#f8f9fa] p-5 rounded-xl text-center">
                                    <div className="text-sm text-gray-600 mb-2">Total Area</div>
                                    <div className="bg-gray-100 p-3 rounded mb-3">
                                        <div className="text-xs text-gray-500">Area of Flooring = Length × Width</div>
                                        <div className="text-sm">Area of Flooring = {length} × {width}</div>
                                        <div className="text-lg font-bold text-[#3B68FC]">Area of Flooring = {results?.totalArea} ft²</div>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Flooring" className="w-full h-24 object-cover rounded-lg" />
                                </div>

                                <div className="bg-[#f8f9fa] p-5 rounded-xl text-center">
                                    <div className="text-sm text-gray-600 mb-2">No. of Tiles</div>
                                    <div className="bg-gray-100 p-3 rounded mb-3">
                                        <div className="text-xs text-gray-500">No of Tiles = Total Area / Tile Area</div>
                                        <div className="text-sm">No of Tiles = {results?.totalArea} / {results?.tileArea}</div>
                                        <div className="text-lg font-bold text-red-500">No of Tiles = {results?.noOfTiles}</div>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Tiles" className="w-full h-24 object-cover rounded-lg" />
                                </div>
                            </div>

                            {/* Cement & Sand Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Cement</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">Mortar Wet Volume = Flooring Area × 0.012m</div>
                                    <div className="bg-blue-50 p-3 rounded text-sm mb-3">
                                        <div>Wet Volume = {results?.totalAreaM} × 0.012</div>
                                        <div>Wet Volume = {results?.mortarVolume} m³</div>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded text-sm mb-3">
                                        <div>Dry Volume = {results?.mortarVolume} × 1.33</div>
                                        <div>Dry Volume = <strong>{results?.dryVolume} m³</strong></div>
                                    </div>
                                    <div className="text-center border-t pt-3">
                                        <div className="text-xs text-gray-500">No. of Cement Bag Required</div>
                                        <div className="text-2xl font-bold text-blue-600">{results?.cement} Bags</div>
                                        <div className="text-xs text-gray-400">Require Cement in Kg: {results?.cement * 50} Kg</div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Sand</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">Volume of Cement = Dry Volume × Ratio</div>
                                    <div className="bg-amber-50 p-3 rounded text-sm mb-3">
                                        <div>Sand = {results?.dryVolume} × (4/5)</div>
                                        <div>Sand = {results?.sandVol} m³</div>
                                    </div>
                                    <div className="bg-amber-100 p-3 rounded text-sm mb-3">
                                        <div>By Considering dry loose bulk density of sand: 1550 kg/m³</div>
                                    </div>
                                    <div className="text-center border-t pt-3">
                                        <div className="text-xs text-gray-500">Require Sand in Cft</div>
                                        <div className="text-2xl font-bold text-amber-600">{results?.sand} Ton</div>
                                        <div className="text-xs text-gray-400">Approx {(results?.sandVol * 35.315).toFixed(2)} CFT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Flooring calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Flooring calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Flooring calculator is calculating how many numbers of tiles required for flooring. We use length, width, and depth to calculate the flooring. Here, three shapes are available to calculate the flooring: Square, U-shape, and L-shape.
                                </p>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2">Flooring Formulas:</div>
                                    <div className="font-mono text-sm space-y-1 text-[#3B68FC]">
                                        <p>Total Area = Length × Width</p>
                                        <p>Amount of Cement = (Dry Vol × Cement Ratio / Sum Ratio)</p>
                                        <p>Amount of Sand = (Wet Vol × Dry Bulking × Sand Ratio / Sum Ratio) × 1550</p>
                                    </div>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Flooring work" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Important factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            What are the important factors in Flooring?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 mb-4">
                                It can be said that flooring kind of adds value to the area. But there are factors to consider while choosing the right type of flooring that would meet your requirements.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Tile Size', desc: '2x2, 2x1, 4x2 feet common sizes', icon: 'fa-th' },
                                    { title: 'Mortar Thickness', desc: '12mm bed thickness for tiles', icon: 'fa-layer-group' },
                                    { title: 'Wastage Factor', desc: 'Add 5-10% for cutting/breakage', icon: 'fa-recycle' },
                                    { title: 'Mortar Ratio', desc: '1:4, 1:5, 1:6 cement:sand', icon: 'fa-percentage' },
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

                    {/* What is tile? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-th text-[#3B68FC]"></i>
                            What is tile calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 mb-4">
                                Tiles are thin, flat slabs or pieces of material such as ceramic, stone, metal, baked clay, or glass. Tiles are often used for covering walls, floors, and other objects such as shower enclosures, bathtubs, and tabletops.
                            </p>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                <div className="font-semibold mb-2">Tile Calculation:</div>
                                <div className="font-mono text-sm text-[#3B68FC]">
                                    No. of Tiles = Flooring Area (Length × Width) ÷ Tile Size
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="font-semibold mb-2">Quantity of Tiles:</div>
                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                    <li>2 Feet or less in size of tiles, then calculate 5% extra for Normal cutting.</li>
                                    <li>2 × 4 feet tile, then calculate 10% extra for bigger tile needs.</li>
                                    <li>If tile is diagonal pattern, add 15% as wastage.</li>
                                </ul>
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
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50">
                            <i className="fas fa-border-all text-xl text-red-500"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">FLOORING CALCULATION</h2>
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
                                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm" />
                                </div>
                            </div>

                            {/* Tile Size */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Tile Dimension</label>
                                <select value={tileSize} onChange={(e) => setTileSize(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                    {Object.entries(tileSizes).map(([key, val]) => (
                                        <option key={key} value={key}>{val.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ratio */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Mortar Ratio</label>
                                <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                    <option value="1:3">1:3</option>
                                    <option value="1:4">1:4</option>
                                    <option value="1:5">1:5</option>
                                    <option value="1:6">1:6</option>
                                </select>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Total Area of Flooring</div>
                                        <div className="text-xl font-bold text-[#3B68FC]">{results?.totalArea} ft²</div>
                                        <div className="text-lg font-bold text-gray-600">{results?.totalAreaM} m²</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20">
                                            <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                    <div className="bg-white p-2 rounded border">
                                        <i className="fas fa-th text-red-500"></i>
                                        <div className="text-gray-500">Tiles</div>
                                        <div className="font-bold">{results?.noOfTiles}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded border">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <div className="text-gray-500">Cement</div>
                                        <div className="font-bold">{results?.cement} Bags</div>
                                    </div>
                                    <div className="bg-white p-2 rounded border">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <div className="text-gray-500">Sand</div>
                                        <div className="font-bold">{results?.sand} Ton</div>
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
