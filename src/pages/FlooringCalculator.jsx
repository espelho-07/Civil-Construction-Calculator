import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FlooringCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Feet');
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [tileSize, setTileSize] = useState('2x2');
    const [ratio, setRatio] = useState('1:6');

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
        // Reference: No. of Tile Require = Area of Flooring / Area of Tile
        const noOfTiles = Math.ceil(totalArea / tileArea);

        // Reference: Assuming Thickness of Bedding is 0.07m, Ratio of Mortar 1:6
        const mortarThickness = 0.07; // 70mm in meters as per reference
        const mortarVolume = totalAreaM * mortarThickness;

        // Reference uses 1:6 ratio for flooring
        const parts = ratio.split(':').map(Number);
        const totalParts = parts[0] + parts[1];

        // Reference: Cement = Volume With Bedding × Cement Ratio / Total Ratio ÷ 0.035
        const cementVol = (mortarVolume * parts[0]) / totalParts;
        const cementBags = cementVol / 0.035;
        const cementKg = cementBags * 50;

        // Reference: Sand = Volume With Bedding × Sand Ratio / Total Ratio × 1550
        const sandVol = (mortarVolume * parts[1]) / totalParts;
        const sandKg = sandVol * 1550;
        const sandTon = sandKg / 1000;

        setResults({
            totalArea: totalArea.toFixed(2),
            totalAreaM: totalAreaM.toFixed(2),
            noOfTiles,
            tileArea: tileArea.toFixed(2),
            mortarVolume: mortarVolume.toFixed(4),
            dryVolume: mortarVolume.toFixed(4), // For flooring, wet = dry (no bulking needed for bedding mortar)
            cement: cementBags.toFixed(2),
            cementVol: cementVol.toFixed(4),
            cementKg: cementKg.toFixed(2),
            sand: sandTon.toFixed(2),
            sandVol: sandVol.toFixed(4),
            sandKg: sandKg.toFixed(2),
        });
    };

    const reset = () => {
        setUnit('Feet');
        setLength(10);
        setWidth(10);
        setTileSize('2x2');
        setRatio('1:4');
        setResults(null);
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
            backgroundColor: ['#16a34a', '#3b82f6', '#f59e0b'],
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
                            <i className={`fa-solid fa-calculator ${theme.text}`}></i>
                            Flooring calculation
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>

                            {/* Total Area & No of Tiles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-[#f8f9fa] p-5 rounded-xl text-center">
                                    <div className="text-sm text-gray-600 mb-2">Total Area</div>
                                    <div className="bg-gray-100 p-3 rounded mb-3">
                                        <div className="text-xs text-gray-500">Area of Flooring = Length × Width</div>
                                        <div className="text-sm">Area of Flooring = {length} × {width}</div>
                                        <div className={`text-lg font-bold ${theme.text}`}>Area of Flooring = {results?.totalArea} ft²</div>
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
                                <div className={`bg-white border ${theme.border} rounded-xl p-5 shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fa-solid fa-cubes text-blue-500"></i>
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

                                <div className={`bg-white border ${theme.border} rounded-xl p-5 shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fa-solid fa-truck-loading text-amber-500"></i>
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
                            <i className={`fa-solid fa-info-circle ${theme.text}`}></i>
                            What is Flooring calculation?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                    Flooring calculator is calculating how many numbers of tiles required for flooring. We use length, width, and depth to calculate the flooring. Here, three shapes are available to calculate the flooring: Square, U-shape, and L-shape.
                                </p>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2">Flooring Formulas:</div>
                                    <div className={`font-mono text-sm space-y-1 ${theme.text}`}>
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
                            <i className="fa-solid fa-exclamation-triangle text-yellow-500"></i>
                            What are the important factors in Flooring?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
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
                                        <i className={`fa-solid ${item.icon} ${theme.text} mt-1`}></i>
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
                            <i className={`fa-solid fa-th ${theme.text}`}></i>
                            What is tile calculation?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">
                                Tiles are thin, flat slabs or pieces of material such as ceramic, stone, metal, baked clay, or glass. Tiles are often used for covering walls, floors, and other objects such as shower enclosures, bathtubs, and tabletops.
                            </p>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                <div className="font-semibold mb-2">Tile Calculation:</div>
                                <div className={`font-mono text-sm ${theme.text}`}>
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
                            <i className={`fa-solid fa-th-large ${theme.text}`}></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className={`bg-white border rounded-lg p-4 hover:shadow-lg ${theme.border} ${theme.hover.replace('bg-', 'border-')} transition-all group`}>
                                    <div className="flex items-center gap-3">
                                        <i className={`fa-solid ${calc.icon} ${theme.text} group-hover:scale-110 transition-transform`}></i>
                                        <span className={`text-sm font-medium text-[#0A0A0A] group-hover:${theme.text}`}>{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Inline Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fa-solid fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Calculator Widget (Sidebar) */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    {/* THEME BORDER APPLIED HERE */}
                    <div className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} flex items-center gap-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <i className="fa-solid fa-th-large text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Flooring Calculator</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <div className={`flex ${theme.border} rounded-lg overflow-hidden`}>
                                    <button onClick={() => setUnit('Feet')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Feet' ? theme.button : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Feet</button>
                                    <button onClick={() => setUnit('Meter')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Meter' ? theme.button : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Meter</button>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} />
                                </div>
                            </div>

                            {/* Tile Size */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Tile Dimension</label>
                                <CustomDropdown
                                    options={Object.entries(tileSizes).map(([key, val]) => ({ value: key, label: val.label }))}
                                    value={tileSize}
                                    onChange={setTileSize}
                                    theme={theme}
                                />
                            </div>

                            {/* Ratio */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Mortar Ratio</label>
                                <CustomDropdown
                                    options={[
                                        { value: '1:3', label: '1:3' },
                                        { value: '1:4', label: '1:4' },
                                        { value: '1:5', label: '1:5' },
                                        { value: '1:6', label: '1:6' }
                                    ]}
                                    value={ratio}
                                    onChange={setRatio}
                                    theme={theme}
                                />
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium transition-colors`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Total Area of Flooring</div>
                                        <div className={`text-xl font-bold ${theme.text}`}>{results?.totalArea} ft²</div>
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
