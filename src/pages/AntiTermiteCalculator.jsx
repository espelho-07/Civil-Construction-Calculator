import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

export default function AntiTermiteCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(7);
    const [widthCm, setWidthCm] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let l, w;
        if (unit === 'Meter') {
            l = length + lengthCm / 100;
            w = width + widthCm / 100;
        } else {
            l = (length + lengthCm / 12) * 0.3048;
            w = (width + widthCm / 12) * 0.3048;
        }

        const areaM2 = l * w;
        const areaFt2 = areaM2 * 10.7639;
        const chemicalRequired = areaM2 * 5; // 5 liters per sq meter
        const chemicalRequiredFt = areaFt2 * 0.46; // approx conversion or separate logic

        setResults({
            areaM2: areaM2.toFixed(2),
            areaFt2: areaFt2.toFixed(2),
            chemicalRequired: chemicalRequired.toFixed(2),
            lengthM: l.toFixed(2),
            widthM: w.toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10); setLengthCm(0);
        setWidth(7); setWidthCm(0);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, width, widthCm]);
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Anti-Termite Calculator <span className="text-sm font-normal text-gray-500">IS 6313</span></h1>
                            <p className="text-[#6b7280]">Calculate the chemical required for anti-termite treatment</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="anti-termite-calculator"
                            calculatorName="Anti-Termite Calculator"
                            calculatorIcon="fa-bug"
                            category="Quantity Estimator"
                            inputs={{ unit, length, lengthCm, width, widthCm }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Display */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-6">
                                <div className="text-sm text-gray-500">Chemical Required</div>
                                <div className={`text-4xl font-bold ${theme.text}`}>{results?.chemicalRequired} Liters</div>
                            </div>

                            <div className={`${theme.bgLight} p-4 rounded-lg text-center`}>
                                <div className="text-sm text-gray-600 mb-2">Anti-Termite calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Area = Length × Width</p>
                                    <p>Total Area = {results?.lengthM} × {results?.widthM}</p>
                                    <p className={`font-bold ${theme.text}`}>Total Area = {results?.areaM2} m²</p>
                                    <p className="mt-2">Chemical Required = Area × 5 liters/m²</p>
                                    <p className={`font-bold ${theme.text}`}>Chemical Required = {results?.chemicalRequired} Liters</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Calculation Details */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Anti-Termite Calculation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <div className={`${theme.bgLight} p-4 rounded-lg font-mono text-xl text-center ${theme.text} mb-4`}>
                                    Chemical Required = Area × 5 Liters/m²
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5">
                                        <li>Area is total floor area in square meters</li>
                                        <li>Standard consumption is 5 liters per square meter</li>
                                    </ul>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1584666687093-575080e75520?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Termite Treatment" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Information */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Anti-Termite Treatment?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4 text-justify">Anti-termite treatment is a chemical procedure carried out for soil, masonry, wood, and electrical fixtures to provide a chemical barrier against subterranean termites before and after construction.</p>
                            <p className="text-gray-600 text-justify">Termites can cause significant damage to the structure of a building. Pre-construction treatment is the most effective way to prevent termite attacks.</p>
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
                            <i className="fas fa-bug text-xl text-white"></i>
                            <h2 className="font-semibold text-white">ANTI-TERMITE CALCULATION</h2>
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
                            <div className="mb-4">
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
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Chemical Required</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.chemicalRequired} Liters</div>
                                <div className="text-sm text-gray-600">Area: {results?.areaM2} m²</div>
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
