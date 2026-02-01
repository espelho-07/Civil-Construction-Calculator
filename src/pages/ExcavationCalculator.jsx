import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

export default function ExcavationCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(7);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(2);
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

        setResults({
            volumeM3: volumeM3.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            lengthM: l.toFixed(2),
            widthM: w.toFixed(2),
            depthM: d.toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10); setLengthCm(0);
        setWidth(7); setWidthCm(0);
        setDepth(2); setDepthCm(0);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, width, widthCm, depth, depthCm]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Excavation Calculator <span className="text-sm font-normal text-gray-500">IS 3764</span></h1>
                            <p className="text-[#6b7280]">Calculate the total volume of excavation for earthwork</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="excavation"
                            calculatorName="Excavation Calculator"
                            calculatorIcon="fa-mountain"
                            category="Quantity Estimator"
                            inputs={{ unit, length, lengthCm, width, widthCm, depth, depthCm }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Display */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-6">
                                <div className="text-sm text-gray-500">Total Volume of Excavation</div>
                                <div className={`text-3xl font-bold ${theme.text}`}>{results?.volumeM3} m³ <span className="text-gray-400">|</span> {results?.volumeFt3} ft³</div>
                            </div>

                            <div className={`${theme.bgLight} p-4 rounded-lg text-center`}>
                                <div className="text-sm text-gray-600 mb-2">Excavation calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Volume = Length × Width × Depth</p>
                                    <p>Total Volume = {results?.lengthM} × {results?.widthM} × {results?.depthM}</p>
                                    <p className={`font-bold ${theme.text}`}>{results?.volumeM3} m³</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Excavation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is excavation calculation?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1 text-justify">
                                <p className="text-gray-600 mb-4 text-justify">Excavation generally means work digging in the earth.</p>
                                <p className="text-gray-600 mb-4 text-justify">You can calculate Excavation required in both cubic feet and cubic meter. With this calculator you can exactly know how much Excavation is required for your construction.</p>
                                <p className="text-gray-600 text-justify">We determine Excavation method to use of find the volume. In this case we are dealing with a length, breadth, and depth.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1541888946425-d81bb1909332?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Excavation" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Excavation Calculation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <div className={`${theme.bgLight} p-4 rounded-lg font-mono text-xl text-center ${theme.text} mb-4`}>
                                    Total Volume = Length × Width × Depth
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5">
                                        <li>ft³ is a total volume (Cubic feet) and m³ is a cubic meter</li>
                                        <li>length, breadth and depth in feet/inch.</li>
                                    </ul>
                                </div>
                                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                                    <strong>Note:</strong> 1 m³ = 35.3147 ft³
                                </div>
                            </div>
                            <svg viewBox="0 0 200 150" className="w-48 h-40">
                                <defs><linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#92400e" /></linearGradient></defs>
                                <path d="M20,40 L160,40 L180,60 L180,120 L40,120 L20,100 Z" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4" />
                                <path d="M20,40 L160,40 L180,60 L40,60 Z" fill="#e5e7eb" stroke="#666" strokeWidth="1" />
                                <path d="M20,100 L160,100 L180,120 L40,120 Z" fill="url(#soilGrad)" stroke="#666" strokeWidth="1" opacity="0.8" />
                                <line x1="20" y1="40" x2="20" y2="100" stroke="#666" />
                                <line x1="160" y1="40" x2="160" y2="100" stroke="#666" />
                                <line x1="180" y1="60" x2="180" y2="120" stroke="#666" />
                                <text x="90" y="140" fontSize="10" fill="#666">Length</text>
                                <text x="5" y="80" fontSize="10" fill="#666">Depth</text>
                                <text x="185" y="90" fontSize="10" fill="#666">Width</text>
                            </svg>
                        </div>
                    </section>

                    {/* Importance Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-exclamation-circle ${theme.text}`}></i>
                            Importance of excavation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4 text-justify">Construction excavation is the process of removing earth, rock, and other materials to prepare a site for a construction project. It's a critical part of most projects because it creates a strong foundation for the structure.</p>
                            <p className="text-gray-600 text-justify">The process involves using heavy machinery and explosives to move earth, rock, and other materials. The excavated site can then be used for a variety of purposes, including: Foundations, Reservoirs, Roads.</p>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb]">
                        <div className={`px-5 py-4 border-b border-[#e5e7eb] ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-mountain text-xl text-white"></i>
                            <h2 className="font-semibold text-white">EXCAVATION CALCULATION</h2>
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
                                <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={widthCm}
                                            onChange={(e) => setWidthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`}
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
                                            className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={depthCm}
                                            onChange={(e) => setDepthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`}
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
                                <div className="text-xs text-gray-500">Total Volume</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.volumeM3} m³</div>
                                <div className="text-sm text-gray-600">{results?.volumeFt3} ft³</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
