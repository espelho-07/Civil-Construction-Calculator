import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ConcreteBlockCalculator() {
    const [unit, setUnit] = useState('Feet');
    const [length, setLength] = useState(10);
    const [lengthInch, setLengthInch] = useState(0);
    const [height, setHeight] = useState(10);
    const [heightInch, setHeightInch] = useState(0);
    const [wallThickness, setWallThickness] = useState(0.33); // 4 inch in feet
    const [blockL, setBlockL] = useState(16); // inches
    const [blockW, setBlockW] = useState(8); // inches
    const [blockH, setBlockH] = useState(8); // inches
    const [ratio, setRatio] = useState('1:6');

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        // Convert to meters
        const l = (length + lengthInch / 12) * 0.3048;
        const h = (height + heightInch / 12) * 0.3048;
        const t = wallThickness * 0.3048;

        // Block size in meters
        const bL = blockL * 0.0254;
        const bW = blockW * 0.0254;
        const bH = blockH * 0.0254;

        // Wall volume
        const wallVolume = l * h * t;

        // Block volume (with mortar - add 10mm on each dimension)
        const blockVolWithMortar = (bL + 0.01) * (bW + 0.01) * (bH + 0.01);
        const blockVolWithoutMortar = bL * bW * bH;

        // Number of blocks
        const noOfBlocks = Math.ceil(wallVolume / blockVolWithMortar);

        // Actual volume of blocks
        const actualBlockVolume = noOfBlocks * blockVolWithoutMortar;

        // Mortar volume
        const mortarVolume = wallVolume - actualBlockVolume;
        const dryMortarVolume = mortarVolume * 1.33; // Add 33% for dry volume

        // Cement and Sand calculation
        const parts = ratio.split(':').map(Number);
        const totalParts = parts[0] + parts[1];

        const cementVol = (dryMortarVolume * parts[0]) / totalParts;
        const sandVol = (dryMortarVolume * parts[1]) / totalParts;

        const cementBags = Math.ceil(cementVol * 28.8);
        const sandTon = (sandVol * 1.55).toFixed(2);

        setResults({
            wallVolume: wallVolume.toFixed(4),
            blockVolWithMortar: blockVolWithMortar.toFixed(6),
            blockVolWithoutMortar: blockVolWithoutMortar.toFixed(6),
            noOfBlocks,
            actualBlockVolume: actualBlockVolume.toFixed(4),
            mortarVolume: mortarVolume.toFixed(4),
            dryMortarVolume: dryMortarVolume.toFixed(4),
            cement: cementBags,
            cementVol: cementVol.toFixed(4),
            sand: sandTon,
            sandVol: sandVol.toFixed(4),
            lengthM: l.toFixed(2),
            heightM: h.toFixed(2),
            thicknessM: t.toFixed(3),
            blockLM: bL.toFixed(4),
            blockWM: bW.toFixed(4),
            blockHM: bH.toFixed(4),
        });
    };

    useEffect(() => {
        calculate();
    }, [length, lengthInch, height, heightInch, wallThickness, blockL, blockW, blockH, ratio, unit]);

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
        labels: ['Blocks', 'Mortar'],
        datasets: [{
            data: [75, 25],
            backgroundColor: ['#ef4444', '#3b82f6'],
            borderWidth: 0,
        }],
    };

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Precast Wall', icon: 'fa-border-style', slug: '/precast-boundary-wall' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Concrete Block Calculator <span className="text-sm font-normal text-gray-500">IS 2185</span></h1>
                    <p className="text-[#6b7280] mb-6">Calculate number of concrete blocks, cement and sand for masonry work</p>

                    {/* Concrete Block Calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Concrete Block calculations
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">

                            {/* Step 1 */}
                            <div className="mb-6">
                                <div className="font-bold text-gray-800 mb-3">Step 1:</div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2">
                                    <p><span className="text-[#3B68FC]">Volume of Concrete Block</span> = Length(m) × Depth(m) × Wall Thickness (m)</p>
                                    <p>Volume of Concrete Block = {results?.lengthM} × {results?.heightM} × {results?.thicknessM}</p>
                                    <p>Volume of Concrete Block = <strong>{results?.wallVolume} m³</strong></p>
                                </div>

                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 mt-4">
                                    <p><span className="text-green-600">Block Size</span> = (L + 0.01)(m) × (W + 0.01)(m) × (H + 0.01)(m)</p>
                                    <p>Block Size = ({results?.blockLM} + 0.01) × ({results?.blockWM} + 0.01) × ({results?.blockHM} + 0.01)</p>
                                    <p>Block Size = <strong>{results?.blockVolWithMortar} m³</strong></p>
                                </div>

                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 mt-4">
                                    <p><span className="text-amber-600">Size of Block with Mortar</span> = ({blockL} + 0.01)(m) × ({blockW} + 0.01)(m) × ({blockH} + 0.01)(m)</p>
                                    <p>= ({(blockL * 0.0254 + 0.01).toFixed(4)}) × ({(blockW * 0.0254 + 0.01).toFixed(4)}) × ({(blockH * 0.0254 + 0.01).toFixed(4)}) m³</p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                                    <div className="font-mono text-sm">
                                        <p>No. of Blocks = <span className="text-[#3B68FC]">Volume of Concrete Block</span> / <span className="text-green-600">Volume of one Block</span></p>
                                        <p>No. of Blocks = {results?.wallVolume} / {results?.blockVolWithMortar}</p>
                                        <p className="text-xl font-bold text-red-500 mt-2">No. of Blocks = {results?.noOfBlocks} Blocks</p>
                                    </div>
                                </div>

                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 mt-4">
                                    <p>Actual Volume of Blocks Mortar = No. of Blocks × Volume of Block Without Mortar</p>
                                    <p>Actual Volume of Blocks Mortar = {results?.noOfBlocks} × {results?.blockVolWithoutMortar}</p>
                                    <p>Actual Volume of Blocks Mortar = <strong>{results?.actualBlockVolume} m³</strong></p>
                                </div>

                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 mt-4">
                                    <p><span className="text-purple-600">Quantity of Mortar</span> = Volume of Block Masonary – Actual Volume of Blocks without mortar</p>
                                    <p>Quantity of Mortar = {results?.wallVolume} - {results?.actualBlockVolume}</p>
                                    <p>Quantity of Mortar = <strong>{results?.mortarVolume} m³</strong></p>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4 text-sm">
                                    <strong>Note:</strong> Add 10% more for wastage, non-uniform thickness of mortar joint
                                </div>

                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 mt-4">
                                    <p>Quantity of Mortar = {results?.mortarVolume} × 1.1</p>
                                    <p>= {(parseFloat(results?.mortarVolume || 0) * 1.1).toFixed(4)} m³</p>
                                </div>

                                <div className="bg-green-50 border border-green-200 p-3 rounded-lg mt-4 text-sm">
                                    <strong>Add 30% more for Dry Volume:</strong>
                                </div>

                                <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2 mt-4">
                                    <p>Quantity of Mortar = {(parseFloat(results?.mortarVolume || 0) * 1.1).toFixed(4)} × 1.33</p>
                                    <p>Quantity of Mortar = <strong>{results?.dryMortarVolume} m³</strong></p>
                                </div>
                            </div>

                            {/* Step 2 & 3 Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Step 2: Amount of Cement</span>
                                    </div>
                                    <div className="text-sm space-y-2 font-mono bg-blue-50 p-3 rounded">
                                        <p>Cement = <span className="text-[#3B68FC]">Quantity Of Mortar</span></p>
                                        <p>Cement = {results?.dryMortarVolume} × (1/7)</p>
                                        <p>Cement = {results?.cementVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="text-xs text-gray-500">No. of Cement Bags</div>
                                        <div className="text-2xl font-bold text-blue-600">{results?.cement}</div>
                                    </div>
                                    <div className="mt-2 bg-blue-100 p-2 rounded text-xs text-center">
                                        No. Of Cement Bags = {results?.cement} Bags ({results?.cement * 50} Kg)
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">Step 3: Amount of Sand Required</span>
                                    </div>
                                    <div className="text-sm space-y-2 font-mono bg-amber-50 p-3 rounded">
                                        <p>Sand = <span className="text-amber-600">Quantity Of Mortar</span></p>
                                        <p>Sand = {results?.dryMortarVolume} × (6/7)</p>
                                        <p>Sand = {results?.sandVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="text-xs text-gray-500">Sand in Ton</div>
                                        <div className="text-2xl font-bold text-amber-600">{results?.sand}</div>
                                    </div>
                                    <div className="mt-2 bg-amber-100 p-2 rounded text-xs text-center">
                                        By Considering dry loose bulk density of sand: 1550 kg/m³
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is concrete blocks */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is concrete blocks calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    A concrete block is primarily used as a building material in the construction of walls. It is sometimes called a concrete masonry unit (CMU). A concrete block is one of several precast concrete products used in construction.
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Concrete blocks can be solid or hollow, with two or three cores or voids. The blocks also come in a range of standard shapes. Generally, concrete blocks are manufactured in required sizes, which can be used for a range of applications.
                                </p>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2">Concrete Block Formulas:</div>
                                    <div className="font-mono text-sm space-y-1">
                                        <p className="text-[#3B68FC]">Volume of Concrete Block = Length (m) × Depth (m) × Wall Thickness</p>
                                        <p className="text-green-600">Block Size = Block Length × Block Width × Block Height</p>
                                        <p className="text-amber-600">No. of Blocks = Volume of Concrete Block / Volume of one Block</p>
                                        <p className="text-purple-600">Quantity of Mortar = Volume of Concrete Block – Actual Volume of Blocks without mortar</p>
                                    </div>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Concrete blocks" className="w-full md:w-56 h-48 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Important factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            What are the important concrete block?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 leading-relaxed mb-4">
                                The most significant building and construction and Ceramic industries are cement of brick masonry and Concrete Block. They are larger in comparison with regular masonry and modular bricks, and therefore can be laid more quickly.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Standard Block Size', desc: '16" × 8" × 8" (400×200×200mm)', icon: 'fa-cube' },
                                    { title: 'Mortar Joint', desc: '10mm thickness assumed', icon: 'fa-layer-group' },
                                    { title: 'Wastage Factor', desc: 'Add 10% for breakage/cutting', icon: 'fa-recycle' },
                                    { title: 'Mortar Ratio', desc: '1:6 cement:sand for blocks', icon: 'fa-percentage' },
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
                            <i className="fas fa-cube text-xl text-red-500"></i>
                            <div>
                                <h2 className="font-semibold text-[#0A0A0A]">CONCRETE BLOCK CALCULATION</h2>
                                <div className="text-xs text-red-500 font-bold">Total Concrete Block required {results?.noOfBlocks}</div>
                            </div>
                        </div>

                        <div className="p-5">
                            {/* Unit */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                    <option value="Feet">Feet/Inch</option>
                                </select>
                            </div>

                            {/* Length */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={lengthInch} onChange={(e) => setLengthInch(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Height/Depth */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Height/Depth</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={heightInch} onChange={(e) => setHeightInch(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Wall Thickness */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Wall Thickness</label>
                                <select value={wallThickness} onChange={(e) => setWallThickness(Number(e.target.value))} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                    <option value={0.33}>4 Inch (0.10 Meter)</option>
                                    <option value={0.5}>6 Inch (0.15 Meter)</option>
                                    <option value={0.67}>8 Inch (0.20 Meter)</option>
                                </select>
                            </div>

                            {/* Block Size */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Size of Block (L × W × H in inches)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="number" value={blockL} onChange={(e) => setBlockL(Number(e.target.value))} placeholder="Length" className="w-full px-2 py-2 border border-[#e5e7eb] rounded-lg text-sm text-center" />
                                    <input type="number" value={blockW} onChange={(e) => setBlockW(Number(e.target.value))} placeholder="Width" className="w-full px-2 py-2 border border-[#e5e7eb] rounded-lg text-sm text-center" />
                                    <input type="number" value={blockH} onChange={(e) => setBlockH(Number(e.target.value))} placeholder="Height" className="w-full px-2 py-2 border border-[#e5e7eb] rounded-lg text-sm text-center" />
                                </div>
                            </div>

                            {/* Ratio */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Ratio</label>
                                <select value={ratio} onChange={(e) => setRatio(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
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
                                        <div className="text-xs text-gray-500">Total Concrete Block Required</div>
                                        <div className="text-2xl font-bold text-red-500">{results?.noOfBlocks}</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20">
                                            <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full text-xs border-collapse mb-3">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-2 py-1 text-left">Sr. No</th>
                                            <th className="border px-2 py-1 text-left">Materials</th>
                                            <th className="border px-2 py-1 text-left">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border px-2 py-1">1</td>
                                            <td className="border px-2 py-1">Blocks</td>
                                            <td className="border px-2 py-1 font-bold">{results?.noOfBlocks} Nos</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-2 py-1">2</td>
                                            <td className="border px-2 py-1">Cement</td>
                                            <td className="border px-2 py-1 font-bold">{results?.cement} bag</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-2 py-1">3</td>
                                            <td className="border px-2 py-1">Sand</td>
                                            <td className="border px-2 py-1 font-bold">{results?.sand} Ton</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="text-xs text-gray-600">
                                    Volume = {results?.wallVolume} m³ | {(parseFloat(results?.wallVolume || 0) * 35.315).toFixed(2)} ft³
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
