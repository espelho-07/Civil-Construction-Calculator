import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { QUANTITY_ESTIMATOR_NAV } from '../constants/calculatorRoutes';
import { getThemeClasses } from '../constants/categories';

export default function WoodFrameCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(1);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(10); // Using width as a cross-section dimension (e.g. 10cm x 7cm frame)
    const [widthCm, setWidthCm] = useState(0); // Actually input handles cm directly for cross section often, but let's stick to standard input pattern.
    // Wait, wood frame usually is length of frame member, and cross section size.
    // The previous calculators often had Height/Width/Depth.
    // For wood frame volume: Length x Width x Thickness (Height).
    // Let's assume standardized inputs: Length (m/ft), Width (cm/in), Thickness (cm/in).

    // Adjusted inputs for Wood Frame based on assumed logic:
    // User wants to calculate volume of wood in a frame.
    // Inputs: No. of items, Length, Width (Cross section), Thickness (Cross section).

    // Let's check previous inputs from view_file if possible or just implement standard volume calc.
    // Previous list had: unit, length, width, thickness, quantity.

    const [qty, setQty] = useState(1);
    const [l, setL] = useState(2); // Length in m/ft
    const [lCm, setLCm] = useState(0);
    const [w, setW] = useState(10); // Width in cm/in
    const [t, setT] = useState(7.5); // Thickness in cm/in

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const [price, setPrice] = useState(2500); // Price per CFT

    const calculate = () => {
        let len, wid, thk;

        // Convert everything to Feet for CFT calculation (Standard in wood)
        if (unit === 'Meter') {
            len = (l + lCm / 100) * 3.28084; // m to ft
            wid = (w / 100) * 3.28084; // cm to ft (Input is typically small like 10cm)
            thk = (t / 100) * 3.28084; // cm to ft
        } else {
            len = l + lCm / 12; // feet
            wid = w / 12; // inch to feet
            thk = t / 12; // inch to feet
        }

        const volPerItemCFT = len * wid * thk;
        const totalCFT = volPerItemCFT * qty;
        const totalCubicMeter = totalCFT / 35.3147;
        const totalCost = totalCFT * price;

        setResults({
            totalCFT: totalCFT.toFixed(3),
            totalCubicMeter: totalCubicMeter.toFixed(3),
            totalCost: totalCost.toFixed(2),
            lenFt: len.toFixed(2),
            widIn: unit === 'Meter' ? w + ' cm' : w + ' in',
            thkIn: unit === 'Meter' ? t + ' cm' : t + ' in'
        });
    };

    const reset = () => {
        setUnit('Meter');
        setQty(1);
        setL(2); setLCm(0);
        setW(10);
        setT(7.5);
        setPrice(2500);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, qty, l, lCm, w, t, price]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Wood Frame Calculator</h1>
                            <p className="text-[#6b7280]">Calculate volume (CFT) and cost of wood frames</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="wood-frame-calculator"
                            calculatorName="Wood Frame Calculator"
                            calculatorIcon="fa-tree"
                            category="Quantity Estimator"
                            inputs={{ unit, qty, l, w, t, price }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                                <div>
                                    <div className="text-sm text-gray-500">Total Volume (CFT)</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>{results?.totalCFT} ft³</div>
                                    <div className="text-sm text-gray-400 mt-1">{results?.totalCubicMeter} m³</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Total Cost</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>₹ {results?.totalCost}</div>
                                </div>
                            </div>
                            <div className={`${theme.bgLight} p-4 rounded-lg text-center mt-4`}>
                                <div className="text-sm text-gray-600 mb-2">Wood Frame calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Volume (CFT) = Length(ft) × Width(ft) × Thickness(ft) × Qty</p>
                                    <p>Total Cost = Volume (CFT) × Price/CFT</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Wood CFT?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4 text-justify">CFT stands for Cubic Feet. It is the standard unit used for measuring the volume of wood/timber in construction and carpentry. Pricing of wood is usually done per CFT.</p>
                            <p className="text-gray-600 text-justify">To calculate CFT, all dimensions (Length, Width, Thickness) must be converted to feet and multiplied together.</p>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 space-y-6">
                    <MiniNavbar themeName="green" />
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-tree text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Wood Frame Calculator</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <CustomDropdown
                                    options={[
                                        { value: 'Meter', label: 'Length in Meter, Section in CM' },
                                        { value: 'Feet', label: 'Length in Feet, Section in Inch' }
                                    ]}
                                    value={unit}
                                    onChange={setUnit}
                                    theme={theme}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Quantity (Nos)</label>
                                <input
                                    type="number"
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={l}
                                            onChange={(e) => setL(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={lCm}
                                            onChange={(e) => setLCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Width (Section)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={w}
                                        onChange={(e) => setW(Number(e.target.value))}
                                        className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Thickness (Section)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={t}
                                        onChange={(e) => setT(Number(e.target.value))}
                                        className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Price per CFT</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                />
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Total Volume</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.totalCFT} ft³</div>
                            </div>
                        </div>
                    </div>

                    <CategoryQuickNav
                        items={QUANTITY_ESTIMATOR_NAV}
                        title="Quantity Estimator Calculators"
                        themeName="green"
                    />

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
