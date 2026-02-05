import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { QUANTITY_ESTIMATOR_NAV } from '../constants/calculatorRoutes';

export default function TankVolumeCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(2);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(1);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(1);
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
        const liters = volumeM3 * 1000;

        setResults({
            volumeM3: volumeM3.toFixed(3),
            volumeFt3: volumeFt3.toFixed(2),
            liters: liters.toFixed(1),
            lengthM: l.toFixed(2),
            widthM: w.toFixed(2),
            depthM: d.toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(2); setLengthCm(0);
        setWidth(1); setWidthCm(0);
        setDepth(1); setDepthCm(0);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, width, widthCm, depth, depthCm]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const tankSizes = [
        { capacity: 500, diameter: 860, height: 970, manhole: 400 },
        { capacity: 750, diameter: 1000, height: 1060, manhole: 400 },
        { capacity: 1000, diameter: 1100, height: 1225, manhole: 400 },
        { capacity: 1500, diameter: 1270, height: 1390, manhole: 400 },
        { capacity: 2000, diameter: 1350, height: 1560, manhole: 450 },
        { capacity: 3000, diameter: 1520, height: 1845, manhole: 450 },
        { capacity: 5000, diameter: 1850, height: 2160, manhole: 520 },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Tank Volume Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the capacity of water sump or tank</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="tank-volume-calculator"
                            calculatorName="Tank Volume Calculator"
                            calculatorIcon="fa-water"
                            category="Quantity Estimator"
                            inputs={{ unit, length, lengthCm, width, widthCm, depth, depthCm }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Display */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-6">
                                <div className="text-sm text-gray-500">Total Water Capacity</div>
                                <div className={`text-4xl font-bold ${theme.text}`}>{results?.liters} Liters</div>
                                <div className="text-lg text-gray-600 mt-2">{results?.volumeM3} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
                            </div>

                            <div className={`${theme.bgLight} p-4 rounded-lg text-center`}>
                                <div className="text-sm text-gray-600 mb-2">Tank Volume calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Volume = Length × Width × Depth</p>
                                    <p>Volume = {results?.lengthM} × {results?.widthM} × {results?.depthM}</p>
                                    <p className={`font-bold ${theme.text}`}>Volume = {results?.volumeM3} m³</p>
                                    <p className="mt-2">Capacity = Volume m³ × 1000</p>
                                    <p className={`font-bold ${theme.text}`}>Capacity = {results?.liters} Liters</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tank Calculation Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Water Sump/Tank Calculation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="flex-1">
                                    <div className={`${theme.bgLight} p-4 rounded-lg font-mono ${theme.text} mb-4`}>
                                        <p className="text-lg font-bold">Total Volume of Water-Sump/Tank = Length × Breadth × Depth</p>
                                        <p className="text-lg font-bold mt-2">Total Quantity in Liter(lt.) = Volume of Water-Sump/Tank × 1000</p>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p><strong>Where,</strong></p>
                                        <ul className="list-disc pl-5">
                                            <li>m³ (Cubic meter) and ft³ (Cubic feet) is a total volume and Lt (liter) is a total volume in liter.</li>
                                            <li>Length, breadth, and depth in meter/cm and total volume in Lt (liter).</li>
                                        </ul>
                                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
                                            <strong>Note:</strong> 1 m³ = 35.3147 ft³
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="relative">
                                        <svg width="200" height="150" viewBox="0 0 200 150">
                                            <defs><linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} /><stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 0.5 }} /></linearGradient></defs>
                                            <path d="M30,40 L150,40 L170,60 L170,130 L50,130 L30,110 L30,40" fill="url(#tankGrad)" stroke="#3b82f6" strokeWidth="2" />
                                            <path d="M30,40 L150,40 L170,60 L50,60 L30,40" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
                                            <path d="M150,40 L170,60 L170,130 L150,110 L150,40" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2" />
                                            <text x="90" y="145" fontSize="12" fill="#333">length</text>
                                            <text x="175" y="95" fontSize="12" fill="#333">depth</text>
                                            <text x="5" y="75" fontSize="12" fill="#333">breadth</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Importance Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            Importance of water-sump/tank
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4 text-justify">A sump is an area of lower elevation used to collect water or other liquids. It is often created as a basin to manage fluid runoff or collection.</p>
                            <p className="text-gray-600 text-justify">The sump tank is mainly used to store water for use in emergencies (fire), especially in high-rise buildings. In India, water is often supplied only for a few hours in the morning and/or evening, so the sump is used to store water for the rest of the day.</p>
                        </div>
                    </section>

                    {/* Tank Sizes Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Standard Tank Sizes
                        </h2>
                        <div className="overflow-x-auto bg-white rounded-xl border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8f9fa] border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Capacity (Liters)</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Diameter (mm)</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Height (mm)</th>
                                        <th className="px-4 py-3 font-semibold text-gray-700">Manhole Dia (mm)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tankSizes.map((tank, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 font-medium">{tank.capacity}</td>
                                            <td className="px-4 py-2 text-gray-600">{tank.diameter}</td>
                                            <td className="px-4 py-2 text-gray-600">{tank.height}</td>
                                            <td className="px-4 py-2 text-gray-600">{tank.manhole}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="green" />

                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-water text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Tank Volume Calculator</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <CustomDropdown
                                    options={[
                                        { value: 'Meter', label: 'Meter/CM' },
                                        { value: 'Feet', label: 'Feet/Inch' }
                                    ]}
                                    value={unit}
                                    onChange={setUnit}
                                    theme={theme}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={length}
                                            onChange={(e) => setLength(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={lengthCm}
                                            onChange={(e) => setLengthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={widthCm}
                                            onChange={(e) => setWidthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Depth</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={depth}
                                            onChange={(e) => setDepth(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={depthCm}
                                            onChange={(e) => setDepthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Total Capacity</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.liters} Liters</div>
                                <div className="text-sm text-gray-600">{results?.volumeM3} m³</div>
                            </div>
                        </div>
                    </div>

                    {/* Category Quick Nav */}
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
