import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import DualInput from '../components/DualInput';
import InfoTooltip from '../components/InfoTooltip';
import { STANDARDS_DATA } from '../constants/STANDARDS_DATA';

export default function ConcreteBlockCalculator() {
    const theme = getThemeClasses('gray');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [height, setHeight] = useState(10);
    const [heightCm, setHeightCm] = useState(0);
    const [thick, setThick] = useState(20);
    const [blockL, setBlockL] = useState(40);
    const [blockH, setBlockH] = useState(20);
    const [ratio, setRatio] = useState('1:4');
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let wallL, wallH, wallT_mm;
        if (unit === 'Meter') {
            wallL = length + lengthCm / 100;
            wallH = height + heightCm / 100;
        } else {
            wallL = (length + lengthCm / 12) * 0.3048;
            wallH = (height + heightCm / 12) * 0.3048;
        }
        wallT_mm = thick; // mm

        // Wall Volume
        const wallVol = wallL * wallH * (wallT_mm / 1000);

        // Block Volume (including mortar allowance approx or exact?)
        // Standard approach: Size of block with mortar = (L+0.01)x(H+0.01)x(T)
        // Let's assume mortar thickness 10mm = 0.01m
        const mortar = 0.01;
        const bL_m = blockL / 100; // cm to m
        const bH_m = blockH / 100;
        const bT_m = thick / 1000; // mm to m

        const blockVolWithMortar = (bL_m + mortar) * (bH_m + mortar) * bT_m;
        const noOfBlocks = Math.ceil(wallVol / blockVolWithMortar);

        // Mortar Volume
        const actualBlockVol = bL_m * bH_m * bT_m;
        const totalBlockVol = noOfBlocks * actualBlockVol;
        const dryMortarVol = (wallVol - totalBlockVol) * 1.33; // 1.33 for dry volume

        // Ratio calc
        const [cementPart, sandPart] = ratio.split(':').map(Number);
        const totalPart = cementPart + sandPart;

        const cementVol = (dryMortarVol * cementPart) / totalPart;
        const cementBags = cementVol / 0.035; // 0.035 m3 per bag
        const sandVol = (dryMortarVol * sandPart) / totalPart;

        setResults({
            noOfBlocks,
            cementBags: cementBags.toFixed(2),
            sandVol: sandVol.toFixed(3),
            wallVol: wallVol.toFixed(2),
            wallL: wallL.toFixed(2),
            wallH: wallH.toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10); setLengthCm(0);
        setHeight(10); setHeightCm(0);
        setThick(20);
        setBlockL(40);
        setBlockH(20);
        setRatio('1:4');
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, height, heightCm, thick, blockL, blockH, ratio]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <CategoryNav activeCategory="concrete-technology" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Sticky Sidebar Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
                    {/* Main Content */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Concrete Block Calculator</h1>
                                <p className="text-gray-600">Calculate concrete blocks and mortar per IS 2185</p>
                            </div>
                            <CalculatorActions
                                calculatorSlug="concrete-block-calculator"
                                calculatorName="Concrete Block Calculator"
                                calculatorIcon="fa-th-large"
                                category="Concrete Technology"
                                inputs={{ unit, length, height, thick, blockL, blockH, ratio }}
                                outputs={results || {}}
                            />
                        </div>

                        {/* Result Display */}
                        <section className="mb-8">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    <div className={`p-4 rounded-lg ${theme.bgLight} border ${theme.border}`}>
                                        <div className="text-sm text-gray-600 font-semibold mb-2">Number of Blocks</div>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{results?.noOfBlocks}</div>
                                        <div className="text-xs text-gray-500 mt-1">Pieces</div>
                                    </div>
                                    <div className={`p-4 rounded-lg ${theme.bgLight} border ${theme.border}`}>
                                        <div className="text-sm text-gray-600 font-semibold mb-2">Cement Bags</div>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{results?.cementBags}</div>
                                        <div className="text-xs text-gray-500 mt-1">Bags (50kg)</div>
                                    </div>
                                    <div className={`p-4 rounded-lg ${theme.bgLight} border ${theme.border}`}>
                                        <div className="text-sm text-gray-600 font-semibold mb-2">Sand Volume</div>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{results?.sandVol}</div>
                                        <div className="text-xs text-gray-500 mt-1">m³</div>
                                    </div>
                                </div>

                            <div className={`${theme.bgLight} p-4 rounded-lg text-center mt-6`}>
                                <div className="text-sm text-gray-600 mb-2">Wall Volume</div>
                                <div className={`font-bold ${theme.text}`}>{results?.wallVol} m³</div>
                            </div>
                        </div>
                    </section>

                    {/* Calculation Details */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Calculation Process
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-sm space-y-3`}>
                            <p><strong>1. Wall Volume:</strong> Length × Height × Thickness</p>
                            <p><strong>2. Block Volume with Mortar:</strong> (Block Length + Mortar) × (Block Height + Mortar) × Thickness</p>
                            <p><strong>3. Number of Blocks:</strong> Wall Volume / Block Volume with Mortar</p>
                            <p><strong>4. Mortar Volume:</strong> (Wall Volume - (No. of Blocks × Actual Block Volume)) × 1.33 (Dry Coeff)</p>
                            <p><strong>5. Material Breakdown:</strong> Using Ratio {ratio} to split Cement and Sand</p>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className={`px-5 py-4 border-b ${theme.gradient} flex items-center gap-3`}>
                            <i className="fas fa-th-large text-xl text-white"></i>
                            <h2 className="font-semibold text-white">BLOCK WALL CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}
                                >
                                    <option value="Meter">Meter/CM</option>
                                    <option value="Feet">Feet/Inch</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Wall Length</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={length}
                                            onChange={(e) => setLength(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={lengthCm}
                                            onChange={(e) => setLengthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Wall Height</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={heightCm}
                                            onChange={(e) => setHeightCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Wall Thickness (mm)</label>
                                <select
                                    value={thick}
                                    onChange={(e) => setThick(Number(e.target.value))}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}
                                >
                                    <option value="100">100 mm</option>
                                    <option value="150">150 mm</option>
                                    <option value="200">200 mm</option>
                                    <option value="230">230 mm</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Block Size (cm)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-400">Length</label>
                                        <input type="number" value={blockL} onChange={(e) => setBlockL(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400">Height</label>
                                        <input type="number" value={blockH} onChange={(e) => setBlockH(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Mix Ratio</label>
                                <select
                                    value={ratio}
                                    onChange={(e) => setRatio(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}
                                >
                                    <option value="1:3">1:3 (Cement:Sand)</option>
                                    <option value="1:4">1:4 (Cement:Sand)</option>
                                    <option value="1:5">1:5 (Cement:Sand)</option>
                                    <option value="1:6">1:6 (Cement:Sand)</option>
                                </select>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Blocks Required</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.noOfBlocks} Nos</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
