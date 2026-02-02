import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

export default function ConcreteBlockCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [wallLength, setWallLength] = useState(10);
    const [wallHeight, setWallHeight] = useState(10);
    const [blockLength, setBlockLength] = useState(400); // mm
    const [blockHeight, setBlockHeight] = useState(200); // mm
    const [blockWidth, setBlockWidth] = useState(200); // mm
    const [mortarThickness, setMortarThickness] = useState(10); // mm
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        // Convert Wall Dims to meters
        let L = wallLength;
        let H = wallHeight;

        if (unit === 'Feet') {
            L = wallLength * 0.3048;
            H = wallHeight * 0.3048;
        }

        const wallArea = L * H; // sq m
        const wallVolume = wallArea * (blockWidth / 1000); // cubic meters

        // Block dimensions with mortar (in meters)
        const bL = (blockLength + mortarThickness) / 1000;
        const bH = (blockHeight + mortarThickness) / 1000;
        const bW = blockWidth / 1000;

        const blockVolumeWithMortar = bL * bH * bW;
        const totalBlocks = Math.ceil(wallVolume / blockVolumeWithMortar);

        // Reference: Actual Volume of Blocks = No of Blocks × Volume of Block Without Mortar
        const actualBlockVolume = (blockLength / 1000) * (blockHeight / 1000) * (blockWidth / 1000);
        const totalBlockVolume = totalBlocks * actualBlockVolume;
        
        // Reference: Quantity of Mortar = Volume of Block Masonry - Actual Volume of Blocks
        const wetMortarVolume = wallVolume - totalBlockVolume;
        
        // Reference: Add 15% more for wastage, Non-uniform thickness of mortar joins
        const mortarWithWastage = wetMortarVolume + wetMortarVolume * 0.15;
        
        // Reference: Add 25% more for Dry Volume
        const dryMortarVolume = mortarWithWastage + mortarWithWastage * 0.25;

        // Reference uses 1:6 ratio by default
        const cementRatio = 1;
        const sandRatio = 6;
        const totalRatio = cementRatio + sandRatio;

        // Reference: Cement = (Cement Ratio / Sum of Ratio) × Quantity of Mortar
        const cementVol = (cementRatio / totalRatio) * dryMortarVolume;
        // Reference: 1 Bag of Cement = 0.035 m³
        const cementBags = cementVol / 0.035;
        
        // Reference: Sand = (Sand Ratio / Sum of Ratio) × Quantity of Mortar
        const sandVol = (sandRatio / totalRatio) * dryMortarVolume;
        // Reference: By Considering dry loose bulk density of sand 1550 kg/m³
        const sandKg = sandVol * 1550;
        const sandTons = sandKg / 1000;

        setResults({
            totalBlocks,
            cementBags,
            sandTons: sandTons.toFixed(2),
            wallArea: wallArea.toFixed(2),
            mortarVolume: wetMortarVolume.toFixed(3)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setWallLength(10);
        setWallHeight(10);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, wallLength, wallHeight, blockLength, blockHeight, blockWidth, mortarThickness]);

    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Flooring Calculator', icon: 'fa-border-all', slug: '/flooring' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Concrete Block Calculator</h1>
                            <p className="text-[#6b7280]">Calculate blocks, cement, and sand required for masonry</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="concrete-block-calculator"
                            calculatorName="Concrete Block Calculator"
                            calculatorIcon="fa-th"
                            category="Quantity Estimator"
                            inputs={{ unit, wallLength, wallHeight }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Calculation Result
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-2">No. of Blocks</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results?.totalBlocks}</div>
                                    <div className="text-xs text-gray-400 mt-1">Units</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-2">Cement Bags</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results?.cementBags}</div>
                                    <div className="text-xs text-gray-400 mt-1">Bags (50kg)</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-2">Sand (Tons)</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results?.sandTons}</div>
                                    <div className="text-xs text-gray-400 mt-1">Tons</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Calculation Details */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Concrete Block Calculation Formula
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="space-y-4">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2 text-gray-800">1. Number of Blocks</div>
                                    <div className="font-mono text-sm text-gray-600">
                                        <p>Wall Volume = Length × Height × Thickness</p>
                                        <p>Block Volume (with mortar) = (L+m) × (H+m) × (W)</p>
                                        <p>No. of Blocks = Wall Volume / Block Volume</p>
                                    </div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2 text-gray-800">2. Mortar Volume</div>
                                    <div className="font-mono text-sm text-gray-600">
                                        <p>Wet Mortar Vol = Wall Vol - (No. of Blocks × Actual Block Vol)</p>
                                        <p>Dry Mortar Vol = Wet Vol × 1.33 (33% bulking)</p>
                                    </div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2 text-gray-800">3. Material Quantity</div>
                                    <div className="font-mono text-sm text-gray-600">
                                        <p>Cement = (Dry Vol × 1) / (1 + 5) / 0.035 (bags)</p>
                                        <p>Sand = (Dry Vol × 5) / (1 + 5) × 1550 (kg approx)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Concrete Block */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Concrete Block?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1 text-justify">
                                <p className="text-gray-600 mb-4">
                                    Concrete blocks (or check cinder blocks) are a standard size rectangular block used in building construction. They are one of the most versatile building products available because of the wide variety of appearances that can be achieved using them.
                                </p>
                                <p className="text-gray-600">
                                    Concrete blocks are made from cast concrete (e.g. Portland cement and aggregate, usually sand and fine gravel, for high-density blocks). Lower density blocks may use industrial wastes primarily fly ash or bottom ash as an aggregate.
                                </p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1590082725838-89c564344d95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Concrete Blocks" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Important Factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-amber-500"></i>
                            Important Factors
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Block Size', desc: 'Standard sizes: 400x200x200 mm', icon: 'fa-ruler-combined' },
                                    { title: 'Mortar Ratio', desc: 'Typically 1:4 or 1:5 for masonry', icon: 'fa-balance-scale' },
                                    { title: 'Wastage', desc: 'Consider 3-5% wastage for blocks', icon: 'fa-trash-alt' },
                                    { title: 'Curing', desc: 'Requires 7-14 days of water curing', icon: 'fa-tint' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                                        <i className={`fas ${item.icon} ${theme.text} mt-1`}></i>
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
                            <i className={`fas fa-th-large ${theme.text}`}></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                    {/* Ad Space */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb]">
                        <div className={`px-5 py-4 border-b border-[#e5e7eb] ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-th text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Concrete Block Calculator</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <CustomDropdown
                                    options={[{ value: 'Meter', label: 'Meter' }, { value: 'Feet', label: 'Feet' }]}
                                    value={unit}
                                    onChange={setUnit}
                                    theme={theme}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Wall Length</label>
                                <input type="number" value={wallLength} onChange={(e) => setWallLength(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Wall Height</label>
                                <input type="number" value={wallHeight} onChange={(e) => setWallHeight(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                            </div>

                            {/* Block Dimensions */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Block Size (mm)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-400">Length</label>
                                        <input type="number" value={blockLength} onChange={(e) => setBlockLength(Number(e.target.value))} className={`w-full px-2 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400">Height</label>
                                        <input type="number" value={blockHeight} onChange={(e) => setBlockHeight(Number(e.target.value))} className={`w-full px-2 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400">Width</label>
                                        <input type="number" value={blockWidth} onChange={(e) => setBlockWidth(Number(e.target.value))} className={`w-full px-2 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                </div>
                            </div>

                            {/* Mortar Thickness */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Mortar (mm)</label>
                                <input type="number" value={mortarThickness} onChange={(e) => setMortarThickness(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>

                            {/* Simple Result in Sidebar */}
                            {results && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <div>
                                            <div className="text-xs text-gray-500">Blocks</div>
                                            <div className={`text-xl font-bold ${theme.text}`}>{results.totalBlocks}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Cement</div>
                                            <div className={`text-xl font-bold ${theme.text}`}>{results.cementBags}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
