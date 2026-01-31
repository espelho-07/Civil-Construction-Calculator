import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PlasterCalculator() {
    const theme = getThemeClasses('quantity-estimator');
    const [unit, setUnit] = useState('Meter');
    const [plasterType, setPlasterType] = useState('12');
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [ratio, setRatio] = useState('1:4');

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const l = unit === 'Meter' ? length : length * 0.3048;
        const w = unit === 'Meter' ? width : width * 0.3048;
        const t = parseFloat(plasterType) / 1000; // mm to m

        const area = l * w;
        const areaFt = area * 10.7639;
        const wetVol = area * t;
        const dryVol = wetVol * 1.33;

        const parts = ratio.split(':').map(Number);
        const totalParts = parts[0] + parts[1];

        const cementVol = (dryVol * parts[0]) / totalParts;
        const sandVol = (dryVol * parts[1]) / totalParts;

        const cementBags = Math.ceil(cementVol * 28.8);
        const sandTon = sandVol * 1.55; // density

        setResults({
            areaSqM: area.toFixed(2),
            areaSqFt: areaFt.toFixed(2),
            wetVol: wetVol.toFixed(4),
            dryVol: dryVol.toFixed(4),
            cement: cementBags,
            cementVol: cementVol.toFixed(4),
            sand: sandTon.toFixed(2),
            sandVol: sandVol.toFixed(4),
        });
    };

    useEffect(() => {
        calculate();
    }, [length, width, plasterType, ratio, unit]);

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
        labels: ['Cement', 'Sand'],
        datasets: [{
            data: [20, 80],
            backgroundColor: ['#16a34a', '#f59e0b'],
            borderWidth: 0,
        }],
    };

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Carpet Area', icon: 'fa-vector-square', slug: '/carpet-area' },
        { name: 'Countertop Calculator', icon: 'fa-ruler-combined', slug: '/countertop' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Plaster Calculator</h1>
                            <p className="text-[#6b7280]">Calculate cement and sand required for plastering work</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="plaster-calculator"
                            calculatorName="Plaster Calculator"
                            calculatorIcon="fa-paint-roller"
                            category="Quantity Estimator"
                            inputs={{ unit, plasterType, length, width, ratio }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Plaster Area Calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Plaster Area calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] space-y-4">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2">
                                <p><span className={`${theme.text}`}>Plaster Area</span> = Length × Width</p>
                                <p>Plaster Area = {length} × {width}</p>
                                <p>Plaster Area = <strong>{results?.areaSqM} m²</strong></p>
                                <p>Plaster Area = <strong>{results?.areaSqFt} ft²</strong></p>
                            </div>
                        </div>
                    </section>

                    {/* Material Calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-boxes ${theme.text}`}></i>
                            Material calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] space-y-4">

                            <div className="font-semibold text-gray-800">Step 1:</div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2">
                                <p><span className={`${theme.text}`}>Volume of Mortar</span> = Plaster Thickness In Meter</p>
                                <p>Volume Of Mortar = {results?.areaSqM} × 0.012</p>
                                <p>Volume Of Mortar = <strong>{results?.wetVol} m³</strong></p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                                <strong>Note:</strong> Add 33% to fill Joints and cover surface
                            </div>

                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-1">
                                <p>Volume Of Mortar = {results?.wetVol} × 1.33</p>
                                <p>Volume Of Mortar = <strong>{results?.dryVol} m³</strong></p>
                            </div>

                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                                <strong>Note:</strong> Considering 35% of the sand-bulking
                            </div>

                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-1">
                                <p>Dry Volume Of Mortar = {results?.dryVol} m³</p>
                            </div>

                            {/* Step 2 & 3 Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Step 2: Amount of Cement Require</span>
                                    </div>
                                    <div className="text-sm space-y-2 font-mono bg-[#f8f9fa] p-3 rounded">
                                        <p>Dry Volume = {results?.dryVol} m³</p>
                                        <p>Cement = {results?.dryVol} × (1/5)</p>
                                        <p>= {results?.cementVol} m³</p>
                                    </div>
                                    <div className="mt-3 bg-blue-50 p-2 rounded text-xs">
                                        No. of Cement Bag Require = {results?.cement} Bags
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Require Cement in Kg = {(results?.cement * 50).toFixed(0)} Kg
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">Step 3: Quantity of Sand Require</span>
                                    </div>
                                    <div className="text-sm space-y-2 font-mono bg-[#f8f9fa] p-3 rounded">
                                        <p>Sand = {results?.dryVol} × (4/5)</p>
                                        <p>= {results?.sandVol} m³</p>
                                    </div>
                                    <div className="mt-3 bg-amber-50 p-2 rounded text-xs">
                                        Density of Sand/aggregate = 1550 Kg/m³
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Quantity of Sand require = {results?.sand} Ton
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Plastering? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is plastering calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                    Plastering is the process of covering rough walls and uneven surfaces in the construction of houses and other structures with a plastic material called plaster, which is a mixture of lime or cement concrete and sand together with the required quantity of water.
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                    Plastering is done for surfaces to protect that from environmental changes and also to achieve an even, smooth, regular, clean, and durable finished surface including better appearance. Plaster works on walls with specific mix ratio of cement, sand or lime with water.
                                </p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1620626012053-972d7083f2a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Plastering work" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Plastering Calculation Formula */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-square-root-alt ${theme.text}`}></i>
                            Plastering Calculation
                        </h2>
                        <div className={`bg-gradient-to-r ${theme.gradient.replace('from-', 'from-green-50/50 ').replace('to-', 'to-')} rounded-xl p-6 border ${theme.border}`}>
                            <div className="space-y-4 font-mono text-sm">
                                <p><strong className={`${theme.text}`}>Area of Plastering</strong> = Length × Width</p>
                                <p><strong className={`${theme.text}`}>Amount of Cement</strong> = (Dry Volume × Cement Ratio) / Sum of Ratio ÷ Volume of Cement</p>
                                <p><strong className="text-amber-600">Amount of Sand</strong> = (Dry Volume × Sand Ratio) / Sum of Ratio × Density of Sand</p>
                            </div>
                        </div>
                    </section>

                    {/* Requirements of Good Plaster */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500"></i>
                            Requirements of good plaster:
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ol className="list-decimal pl-5 space-y-2 text-[#0A0A0A]">
                                <li>It should adhere to the background easily and should remain adhered during all climatic changes.</li>
                                <li>It should be cheap and economical.</li>
                                <li>It should be hard and durable.</li>
                                <li>It should be possible to apply it during all weather conditions.</li>
                                <li>It should effectively check the entry of moisture into the interior of exposed walls.</li>
                                <li>It should possess good workability.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Strength of Plastering */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-dumbbell ${theme.text}`}></i>
                            Strength of plastering (nominal mix):
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 mb-4">
                                According to BIS The following concrete mix ratios table is showing the properties of cement, sand and gravel in the plastering of the different types of cement and sand gravel of different grade of concrete.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-3 py-2 text-left">Plaster Type</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-3 py-2 font-medium">6mm</td>
                                            <td className="border border-gray-300 px-3 py-2">This cement plaster is done where the plain surface of brick masonry is plastered.</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 px-3 py-2 font-medium">12 MM</td>
                                            <td className="border border-gray-300 px-3 py-2">12 MM thick cement plaster in a single coat on the rough side of 9" and 4.5" wall.</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-3 py-2 font-medium">15mm</td>
                                            <td className="border border-gray-300 px-3 py-2">18 MM thick cement plaster in a two-coat: smooth quantity is required for masonry. Dusty with sufficient cement smooth flooring.</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className="border border-gray-300 px-3 py-2 font-medium">20mm</td>
                                            <td className="border border-gray-300 px-3 py-2">26 MM thick cement plaster in done in two coats in some cases or rough side of wall according to the design requirement.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-th-large ${theme.text}`}></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className={`bg-white border border-[#e5e7eb] rounded-lg p-4 hover:shadow-lg ${theme.hover.replace('bg-', 'border-')} transition-all group`}>
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} ${theme.text} group-hover:scale-110 transition-transform`}></i>
                                        <span className={`text-sm font-medium text-[#0A0A0A] group-hover:${theme.text}`}>{calc.name}</span>
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
                        <div className={`px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r ${theme.gradient}`}>
                            <i className="fas fa-brush text-xl text-white"></i>
                            <h2 className="font-semibold text-white">PLASTER CALCULATION</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden">
                                    <button onClick={() => setUnit('Meter')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Meter' ? theme.button : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Meter</button>
                                    <button onClick={() => setUnit('Feet')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Feet' ? theme.button : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Feet</button>
                                </div>
                            </div>

                            {/* Plaster Type */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Plaster Type</label>
                                <select value={plasterType} onChange={(e) => setPlasterType(e.target.value)} className={`w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm ${theme.focus} outline-none`}>
                                    <option value="6">6 MM</option>
                                    <option value="12">12 MM</option>
                                    <option value="15">15 MM</option>
                                    <option value="20">20 MM</option>
                                </select>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                    <div className="relative">
                                        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'm' : 'ft'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                    <div className="relative">
                                        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'm' : 'ft'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ratio */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Grade of Flooring</label>
                                <select value={ratio} onChange={(e) => setRatio(e.target.value)} className={`w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm ${theme.focus} outline-none`}>
                                    <option value="1:3">1:3</option>
                                    <option value="1:4">1:4</option>
                                    <option value="1:5">1:5</option>
                                    <option value="1:6">1:6</option>
                                </select>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium transition-colors`}>Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Total Area of Plaster</div>
                                        <div className={`text-xl font-bold ${theme.text}`}>{results?.areaSqM} m²</div>
                                        <div className="text-lg font-bold text-gray-600">{results?.areaSqFt} ft²</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20">
                                            <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-center">
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
                                    <div className="bg-white p-2 rounded border">
                                        <i className="fas fa-gem text-green-500"></i>
                                        <div className="text-gray-500">Aggregate</div>
                                        <div className="font-bold">-</div>
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
