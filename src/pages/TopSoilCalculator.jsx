import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

export default function TopSoilCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(7);
    const [widthCm, setWidthCm] = useState(0);
    const [depth, setDepth] = useState(10);
    const [depthCm, setDepthCm] = useState(0);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const DENSITY_SOIL = 1600; // kg/m³

    const calculate = () => {
        let l, w, d;
        if (unit === 'Meter') {
            l = length + lengthCm / 100;
            w = width + widthCm / 100;
            d = (depth + depthCm / 100) / 100; // depth in cm to m
        } else {
            l = (length + lengthCm / 12) * 0.3048;
            w = (width + widthCm / 12) * 0.3048;
            d = (depth + depthCm / 12) * 0.0254; // depth in inch to m
        }

        const volumeM3 = l * w * d;
        const volumeFt3 = volumeM3 * 35.3147;
        const totalWeightKg = volumeM3 * DENSITY_SOIL;
        const totalWeightTon = totalWeightKg / 1000;

        setResults({
            volumeM3: volumeM3.toFixed(2),
            volumeFt3: volumeFt3.toFixed(2),
            totalWeightKg: totalWeightKg.toFixed(2),
            totalWeightTon: totalWeightTon.toFixed(2),
            lengthM: l.toFixed(2),
            widthM: w.toFixed(2),
            depthM: d.toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10); setLengthCm(0);
        setWidth(7); setWidthCm(0);
        setDepth(10); setDepthCm(0);
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Top Soil Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the quantity of top soil required</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="top-soil-calculator"
                            calculatorName="Top Soil Calculator"
                            calculatorIcon="fa-seedling"
                            category="Quantity Estimator"
                            inputs={{ unit, length, lengthCm, width, widthCm, depth, depthCm }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Display */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-6">
                                <div className="text-sm text-gray-500">Total Quantity of Top Soil</div>
                                <div className={`text-4xl font-bold ${theme.text}`}>{results?.totalWeightTon} Ton</div>
                                <div className="text-lg text-gray-600 mt-2">{results?.totalWeightKg} Kg <span className="text-gray-400">|</span> {results?.volumeM3} m³</div>
                            </div>

                            <div className={`${theme.bgLight} p-4 rounded-lg text-center`}>
                                <div className="text-sm text-gray-600 mb-2">Top Soil calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Total Volume = Length × Width × Depth</p>
                                    <p>Total Volume = {results?.lengthM} × {results?.widthM} × {results?.depthM}</p>
                                    <p className={`font-bold ${theme.text}`}>Total Volume = {results?.volumeM3} m³</p>
                                    <p className="mt-2">Total Weight = Volume × Density ({DENSITY_SOIL} kg/m³)</p>
                                    <p className={`font-bold ${theme.text}`}>Total Weight = {results?.totalWeightTon} Ton</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Calculation Details */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Top Soil Calculation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <div className={`${theme.bgLight} p-4 rounded-lg font-mono text-xl text-center ${theme.text} mb-4`}>
                                    Total Weight = Length × Width × Depth × Density
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5">
                                        <li>ft³ is a total volume (Cubic feet) and m³ is a cubic meter</li>
                                        <li>length, breadth and depth in feet/inch</li>
                                        <li>Density of Soil assumed as 1600 kg/m³</li>
                                    </ul>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Soil" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Information */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Top Soil?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4">Topsoil is the upper, outermost layer of soil, usually the top 5–10 inches (13–25 cm). It has the highest concentration of organic matter and microorganisms and is where most of the Earth's biological soil activity occurs.</p>
                            <p className="text-gray-600">Topsoil acts as a filter, trapping water and other elements. It is the primary resource for plants to grow and crops to thrive.</p>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-seedling text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Top Soil Calculator</h2>
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
                                <label className="text-xs text-gray-500 mb-1 block">Depth (Layer)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={depth}
                                            onChange={(e) => setDepth(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={depthCm}
                                            onChange={(e) => setDepthCm(Number(e.target.value))}
                                            className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'mm' : 'fraction'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Total Weight</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.totalWeightTon} Ton</div>
                                <div className="text-sm text-gray-600">{results?.volumeM3} m³</div>
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
