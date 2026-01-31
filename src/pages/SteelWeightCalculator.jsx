import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function SteelWeightCalculator() {
    const theme = getThemeClasses('quantity-estimator');
    const [unit, setUnit] = useState('Meter');
    const [diameter, setDiameter] = useState(12);
    const [length, setLength] = useState(15);
    const [lengthCm, setLengthCm] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let lengthM = unit === 'Meter' ? length + lengthCm / 100 : (length + lengthCm / 12) * 0.3048;
        // Steel weight formula: D²/162.28 × Length × Quantity (in kg)
        const weightKg = (diameter * diameter / 162.28) * lengthM * quantity;
        const weightTon = weightKg / 1000;

        setResults({
            weightKg: weightKg.toFixed(4),
            weightTon: weightTon.toFixed(4),
            lengthM: lengthM.toFixed(2),
        });
    };

    const reset = () => {
        setUnit('Meter');
        setDiameter(12);
        setLength(15);
        setLengthCm(0);
        setQuantity(1);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, diameter, length, lengthCm, quantity]);
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

    const barWeights = [
        { dia: '8mm', meter: '0.395 kg/m', foot: '0.120 kg/ft' },
        { dia: '10mm', meter: '0.617 kg/m', foot: '0.188 kg/ft' },
        { dia: '12mm', meter: '0.888 kg/m', foot: '0.270 kg/ft' },
        { dia: '16mm', meter: '1.580 kg/m', foot: '0.480 kg/ft' },
        { dia: '20mm', meter: '2.469 kg/m', foot: '0.753 kg/ft' },
        { dia: '25mm', meter: '3.858 kg/m', foot: '1.172 kg/ft' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Steel Weight Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the weight of steel bars/rods</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="steel-weight-calculator"
                            calculatorName="Steel Weight Calculator"
                            calculatorIcon="fa-weight-hanging"
                            category="Quantity Estimator"
                            inputs={{ unit, diameter, length, quantity }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Weight of steel in kg.</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>{results?.weightKg} kg.</div>
                                    <div className="text-sm text-gray-500 mt-2">Weight of steel in ton</div>
                                    <div className="text-2xl font-bold text-gray-600">{results?.weightTon} Ton</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">Steel Weight Calculation</div>
                                    <div className="font-mono text-sm">
                                        <p>= D²/162.28 × Length × Quantity</p>
                                        <p>= {diameter}²/162.28 × {results?.lengthM} × {quantity}</p>
                                        <p className={`font-bold ${theme.text}`}>= {results?.weightKg} kg.</p>
                                        <p className="mt-2 text-gray-500">= {results?.weightKg} / 1000</p>
                                        <p className="font-bold text-gray-600">= {results?.weightTon} Ton</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2"><i className={`fas fa-info-circle ${theme.text}`}></i>What is steel weight calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4 text-justify">Steel is an alloy of iron and carbon. Steel is created by heating iron in the presence of oxygen. Iron is a soft, malleable metal. Adding 1.5 to 2 percent carbon creates steel, which is a stronger but less malleable metal.</p>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4">
                                <div className="font-bold mb-2">Steel weight calculation</div>
                                <div className={`text-lg font-mono ${theme.text}`}>Steel weight in kg = D²/162.28 × Length × Quantity</div>
                                <div className="text-lg font-mono text-gray-600 mt-2">Steel weight in ton = Weight in kg / 1000</div>
                            </div>
                            <div className="flex items-center justify-center">
                                <svg viewBox="0 0 300 100" className="w-64 h-24">
                                    <rect x="50" y="30" width="200" height="40" rx="20" fill="#4B5563" />
                                    <text x="150" y="55" textAnchor="middle" fill="white" fontSize="12">length</text>
                                    <line x1="250" y1="50" x2="280" y2="30" stroke="#666" strokeDasharray="3" />
                                    <line x1="250" y1="50" x2="280" y2="70" stroke="#666" strokeDasharray="3" />
                                    <text x="285" y="55" fill="#666" fontSize="10">diameter</text>
                                </svg>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2"><i className={`fas fa-table ${theme.text}`}></i>Standard Bar Unit Weights</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold text-red-500 mb-2">If The L is in meter:</h3>
                                    <ul className="text-sm space-y-1">
                                        {barWeights.map(b => <li key={b.dia}>{b.dia} a bar = {b.meter}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-500 mb-2">If the L is in foot:</h3>
                                    <ul className="text-sm space-y-1">
                                        {barWeights.map(b => <li key={b.dia}>{b.dia} a bar = {b.foot}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2"><i className={`fas fa-cog ${theme.text}`}></i>Characteristics of steel</h2>
                        <div className="bg-white rounded-xl p-6 border space-y-4 text-gray-600">
                            <p><strong>High tensile strength:</strong> The high tensile strength offered by steel products and especially steel reinforcement makes it ideal to strengthen concrete structures.</p>
                            <p><strong>High compressive strength:</strong> Steel, just like concrete, is resistant to high compression forces present in larger building an structures.</p>
                            <p><strong>Difficult to mould and shape:</strong> Steel is not as easy to mould and shape like fresh concrete, but can be moulded and shaped under extremely high temperatures.</p>
                            <p><strong>Relatively expensive:</strong> Although steel is relatively expensive, it is 100% recyclable, and there will be no material wastage.</p>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className={`px-5 py-4 border-b ${theme.gradient} flex items-center gap-3 bg-gradient-to-r`}>
                            <i className="fas fa-weight-hanging text-xl text-white"></i>
                            <h2 className="font-semibold text-white">STEEL WEIGHT CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unit} onChange={(e) => setUnit(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}><option value="Meter">Meter/CM</option><option value="Feet">Feet/Inch</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Diameter (mm)</label><input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} /></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span></div><div className="relative"><input type="number" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} /></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button><button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button></div>
                            <div className="bg-[#f8f9fa] rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Weight of steel</div><div className={`text-2xl font-bold ${theme.text}`}>{results?.weightKg} kg</div><div className="text-lg font-bold text-gray-600">{results?.weightTon} Ton</div></div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
