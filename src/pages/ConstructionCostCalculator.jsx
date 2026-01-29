import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ConstructionCostCalculator() {
    const [builtUpArea, setBuiltUpArea] = useState(1000);
    const [costPerSqFt, setCostPerSqFt] = useState(1800);

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const totalCost = builtUpArea * costPerSqFt;
        const months = Math.ceil(builtUpArea / 150);

        // Cost distribution (approximate for residential construction)
        const materials = {
            cement: { percent: 16.5, price: 350, unit: 'bag' },
            steel: { percent: 23, price: 55, unit: 'kg' },
            aggregate: { percent: 7, price: 50, unit: 'cft' },
            sand: { percent: 12, price: 50, unit: 'cft' },
            paint: { percent: 5, price: 250, unit: 'ltr' },
            bricks: { percent: 8, price: 8, unit: 'nos' },
            flooring: { percent: 8, price: 80, unit: 'sqft' },
            plumbing: { percent: 7, price: null, unit: 'lumpsum' },
            electrical: { percent: 6, price: null, unit: 'lumpsum' },
            miscellaneous: { percent: 7.5, price: null, unit: 'lumpsum' },
        };

        const breakdown = {};
        Object.entries(materials).forEach(([key, val]) => {
            const cost = (totalCost * val.percent) / 100;
            breakdown[key] = {
                cost: Math.round(cost),
                quantity: val.price ? Math.ceil(cost / val.price) : null,
                unit: val.unit,
                percent: val.percent,
            };
        });

        setResults({
            totalCost,
            months,
            breakdown,
        });
    };

    useEffect(() => {
        calculate();
    }, [builtUpArea, costPerSqFt]);

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

    const pieData = {
        labels: ['Cement', 'Steel', 'Sand', 'Aggregate', 'Bricks', 'Flooring', 'Plumbing', 'Electrical', 'Paint', 'Misc'],
        datasets: [{
            data: [16.5, 23, 12, 7, 8, 8, 7, 6, 5, 7.5],
            backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6b7280'],
            borderWidth: 0,
        }],
    };

    const barData = {
        labels: ['Cement', 'Steel', 'Sand', 'Aggregate', 'Bricks', 'Flooring', 'Plumbing', 'Electrical', 'Paint', 'Misc.'],
        datasets: [{
            label: 'Cost (₹)',
            data: results ? Object.values(results.breakdown).map(v => v.cost) : [],
            backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6b7280'],
        }],
    };

    const relatedCalculators = [
        { name: 'Carpet Area', icon: 'fa-vector-square', slug: '/carpet-area' },
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Countertop Calculator', icon: 'fa-ruler-combined', slug: '/countertop' },
    ];

    const formatCurrency = (num) => {
        if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
        if (num >= 100000) return (num / 100000).toFixed(2) + ' Lac';
        return num.toLocaleString('en-IN');
    };

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Construction Cost Calculator</h1>
                            <p className="text-[#6b7280]">Estimate total construction cost and material requirements</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="construction-cost"
                            calculatorName="Construction Cost Calculator"
                            calculatorIcon="fa-rupee-sign"
                            category="Quantity Estimator"
                            inputs={{ builtUpArea, costPerSqFt }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Calculation of Cost */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            1. Calculation of Cost | Approx amount of cost for given construction is ₹{formatCurrency(results?.totalCost || 0)}
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">Approximate cost for various work of material per/Square Feet</div>
                                    <div className="h-64">
                                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-center mb-4">
                                        <div className="text-sm text-gray-600">To complete this construction in</div>
                                        <div className="text-4xl font-bold text-green-600">{results?.months} months</div>
                                        <div className="text-sm text-gray-600">the extra money required is <span className="font-bold text-red-500">1.5x base</span></div>
                                    </div>
                                    <div className="w-48 h-48">
                                        <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Material Quantity */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-boxes text-[#3B68FC]"></i>
                            2. Quantity of material required for given construction area
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="text-center mb-4">
                                <span className="text-sm text-gray-600">Quantity of material required for <span className="text-[#3B68FC] font-bold">{builtUpArea} ft²</span></span>
                            </div>

                            <div className="text-center mb-6 bg-[#f8f9fa] p-4 rounded-xl">
                                <span className="text-sm text-gray-600">Approx wise <span className="font-bold text-[#3B68FC]">cost on various work of material</span></span>
                                <div className="text-sm text-gray-600">to complete the construction</div>
                                <div className="text-2xl font-bold text-[#3B68FC]">Rs. {formatCurrency(results?.totalCost || 0)}</div>
                            </div>

                            {/* Material Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Total Cost */}
                                <div className="bg-white border-2 border-blue-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-rupee-sign text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Total Cost</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Estimate = Approx cost/sq.ft)</div>
                                    <div className="text-sm text-gray-500">₹ {costPerSqFt}/sq.ft</div>
                                    <div className="text-2xl font-bold text-blue-600 mt-2">₹{formatCurrency(results?.totalCost || 0)}</div>
                                </div>

                                {/* Cement */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Cement Required</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 350)</div>
                                    <div className="text-sm">Cement cost</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">= Totalcost</span>
                                    </div>
                                    <div className="text-xl font-bold text-blue-600">₹ {formatCurrency(results?.breakdown?.cement?.cost || 0)}</div>
                                    <div className="mt-2 bg-blue-50 p-2 rounded text-xs">
                                        Cement Required = <strong>{results?.breakdown?.cement?.quantity} Bags</strong>
                                    </div>
                                </div>

                                {/* Steel */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-hammer text-red-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Steel Required</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 55)</div>
                                    <div className="text-sm">Steel cost</div>
                                    <div className="text-xl font-bold text-red-600">₹ {formatCurrency(results?.breakdown?.steel?.cost || 0)}</div>
                                    <div className="mt-2 bg-red-50 p-2 rounded text-xs">
                                        Steel Amount = <strong>{results?.breakdown?.steel?.quantity} Kg</strong>
                                    </div>
                                </div>

                                {/* Aggregate */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-gem text-green-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Aggregate Required</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 50)</div>
                                    <div className="text-xl font-bold text-green-600">₹ {formatCurrency(results?.breakdown?.aggregate?.cost || 0)}</div>
                                    <div className="mt-2 bg-green-50 p-2 rounded text-xs">
                                        Aggregate Amount = <strong>{results?.breakdown?.aggregate?.quantity} cft</strong>
                                    </div>
                                </div>

                                {/* Sand */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Sand Required</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 50)</div>
                                    <div className="text-xl font-bold text-amber-600">₹ {formatCurrency(results?.breakdown?.sand?.cost || 0)}</div>
                                    <div className="mt-2 bg-amber-50 p-2 rounded text-xs">
                                        Sand Amount = <strong>{results?.breakdown?.sand?.quantity} cft</strong>
                                    </div>
                                </div>

                                {/* Paint */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-paint-roller text-purple-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Paint Required</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 250)</div>
                                    <div className="text-xl font-bold text-purple-600">₹ {formatCurrency(results?.breakdown?.paint?.cost || 0)}</div>
                                    <div className="mt-2 bg-purple-50 p-2 rounded text-xs">
                                        Paint Required = <strong>{results?.breakdown?.paint?.quantity} Ltr</strong>
                                    </div>
                                </div>

                                {/* Bricks */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-th-large text-orange-500"></i>
                                        <span className="font-bold text-gray-800">Amount of Bricks Required</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 8)</div>
                                    <div className="text-xl font-bold text-orange-600">₹ {formatCurrency(results?.breakdown?.bricks?.cost || 0)}</div>
                                    <div className="mt-2 bg-orange-50 p-2 rounded text-xs">
                                        Amount of Bricks Required = <strong>{results?.breakdown?.bricks?.quantity} nos</strong>
                                    </div>
                                </div>

                                {/* Flooring */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-border-all text-cyan-500"></i>
                                        <span className="font-bold text-gray-800">Flooring</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Selling price : ₹ 80)</div>
                                    <div className="text-xl font-bold text-cyan-600">₹ {formatCurrency(results?.breakdown?.flooring?.cost || 0)}</div>
                                    <div className="mt-2 bg-cyan-50 p-2 rounded text-xs">
                                        Floor Tiles = <strong>{results?.breakdown?.flooring?.quantity} sqft</strong>
                                    </div>
                                </div>

                                {/* Fittings */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-faucet text-teal-500"></i>
                                        <span className="font-bold text-gray-800">Fittings</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">(Plumbing + Electrical)</div>
                                    <div className="text-xl font-bold text-teal-600">₹ {formatCurrency((results?.breakdown?.plumbing?.cost || 0) + (results?.breakdown?.electrical?.cost || 0))}</div>
                                    <div className="mt-2 bg-teal-50 p-2 rounded text-xs">
                                        Plumbing: ₹{formatCurrency(results?.breakdown?.plumbing?.cost || 0)}<br />
                                        Electrical: ₹{formatCurrency(results?.breakdown?.electrical?.cost || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Construction Cost Estimator Explanation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            3. Construction Cost Estimator Calculator
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                This is a tool to calculate a Average cost of constructing a residential in terms that equals the area of 1 sq.ft that = 144 square inch. Construction cost in India can vary significantly depending on several factors, including location, type of construction, labor costs, material costs, etc.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                The main area shows that the cost of an average construction building can be costly. For construction where all walls considered a load are typically calculated using square feet based on the type of construction and the materials used.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The Quantity of Material required determines how much material is used to complete the construction of each task. And use appropriate construction to reach the goal efficiently.
                            </p>
                        </div>
                    </section>

                    {/* Thumb Rules */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-thumbs-up text-green-500"></i>
                            Thumb Rule of Quantity of Material for 1000 sq. ft.
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 mb-4">
                                Thumb rule is an approximate value according to which various engineers, architects based on their experience estimates the quantity of material per square ft. and other.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Thumb rule is derived according to Indian Standard Codes and is based on past practical and their experiences, that reduces time.
                            </p>

                            <div className="mt-4">
                                <div className="font-bold text-gray-800 mb-3">4. Total Cost (Thumb Rule) Materials :</div>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> <strong>Cement:</strong> 400 bags = 400 × 350 = ₹1,40,000</li>
                                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> <strong>TMT Steel:</strong> 3.5 to 4.5 tonnes @ 55000/T = ₹2,47,500</li>
                                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> <strong>Aggregate 20mm:</strong> 100 tonnes @ 90/T = ₹9,000</li>
                                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> <strong>M Sand:</strong> 1600 cft @ 50/cft = ₹80,000</li>
                                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> <strong>Brick:</strong> 12,000 nos @ 8/pc = ₹96,000</li>
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
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50">
                            <i className="fas fa-rupee-sign text-xl text-emerald-500"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">CONSTRUCTION COST ESTIMATOR</h2>
                        </div>

                        <div className="p-5">
                            {/* Inputs */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Built-up Area</label>
                                <div className="relative">
                                    <input type="number" value={builtUpArea} onChange={(e) => setBuiltUpArea(Number(e.target.value))} className="w-full px-3 py-2 pr-16 border border-[#e5e7eb] rounded-lg text-sm" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ft²</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Approx Cost (Per Square Feet)</label>
                                <div className="relative">
                                    <input type="number" value={costPerSqFt} onChange={(e) => setCostPerSqFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rs.</span>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-4 mb-4 text-white text-center">
                                <div className="text-xs opacity-80 mb-1">Total Construction Cost</div>
                                <div className="text-3xl font-bold">₹ {formatCurrency(results?.totalCost || 0)}</div>
                                <div className="text-xs opacity-80 mt-2">Estimated time: {results?.months} months</div>
                            </div>

                            {/* Quick Summary */}
                            <div className="bg-[#f8f9fa] rounded-xl p-3 space-y-2 text-xs">
                                <div className="flex justify-between"><span>Cement ({results?.breakdown?.cement?.quantity} bags)</span><span className="font-bold text-blue-600">₹{formatCurrency(results?.breakdown?.cement?.cost || 0)}</span></div>
                                <div className="flex justify-between"><span>Steel ({results?.breakdown?.steel?.quantity} kg)</span><span className="font-bold text-red-600">₹{formatCurrency(results?.breakdown?.steel?.cost || 0)}</span></div>
                                <div className="flex justify-between"><span>Sand ({results?.breakdown?.sand?.quantity} cft)</span><span className="font-bold text-amber-600">₹{formatCurrency(results?.breakdown?.sand?.cost || 0)}</span></div>
                                <div className="flex justify-between"><span>Aggregate ({results?.breakdown?.aggregate?.quantity} cft)</span><span className="font-bold text-green-600">₹{formatCurrency(results?.breakdown?.aggregate?.cost || 0)}</span></div>
                                <div className="flex justify-between"><span>Bricks ({results?.breakdown?.bricks?.quantity} nos)</span><span className="font-bold text-orange-600">₹{formatCurrency(results?.breakdown?.bricks?.cost || 0)}</span></div>
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
