import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function CBRTestCalculator() {
    const theme = getThemeClasses('amber');
    const [surcharge, setSurcharge] = useState(5);
    const [penetrationRate, setPenetrationRate] = useState(1.25);
    const [readings, setReadings] = useState([
        { penetration: 0.5, load: 12 },
        { penetration: 1.0, load: 26 },
        { penetration: 1.5, load: 38 },
        { penetration: 2.0, load: 52 },
        { penetration: 2.5, load: 66 },
        { penetration: 3.0, load: 76 },
        { penetration: 4.0, load: 94 },
        { penetration: 5.0, load: 110 },
        { penetration: 7.5, load: 140 },
        { penetration: 10.0, load: 168 },
        { penetration: 12.5, load: 190 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        // Standard loads for CBR calculation (kg)
        const standardLoad25 = 1370; // Load at 2.5mm penetration for standard crushed stone
        const standardLoad50 = 2055; // Load at 5.0mm penetration for standard crushed stone

        // Find loads at 2.5mm and 5.0mm penetration
        let load25 = 0, load50 = 0;
        readings.forEach(r => {
            if (r.penetration === 2.5) load25 = r.load;
            if (r.penetration === 5.0) load50 = r.load;
        });

        // Calculate CBR values
        const cbr25 = (load25 / standardLoad25) * 100;
        const cbr50 = (load50 / standardLoad50) * 100;

        // CBR value is the greater of the two
        const cbrValue = Math.max(cbr25, cbr50);

        // Calculate unit loads
        const plungerArea = (Math.PI / 4) * Math.pow(4.96, 2); // Standard plunger area 19.35 cm²
        const calculatedReadings = readings.map(r => ({
            ...r,
            unitLoad: (r.load / plungerArea).toFixed(2),
        }));

        setResults({
            readings: calculatedReadings,
            load25,
            load50,
            cbr25: cbr25.toFixed(2),
            cbr50: cbr50.toFixed(2),
            cbrValue: cbrValue.toFixed(2),
            plungerArea: plungerArea.toFixed(2),
        });
    };

    const updateReading = (index, field, value) => {
        const newReadings = [...readings];
        newReadings[index][field] = Number(value);
        setReadings(newReadings);
    };

    useEffect(() => { calculate(); }, [surcharge, penetrationRate, readings]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">California Bearing Ratio (CBR) Test Calculator <span className="text-sm font-normal text-gray-500">IS: 2720</span></h1>
                        <CalculatorActions
                            calculatorSlug="cbr-test"
                            calculatorName="CBR Test Calculator"
                            calculatorIcon="fa-road"
                            category="Soil Test"
                            inputs={{ surcharge, penetrationRate, readings }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate CBR value of soil for pavement design</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is California Bearing Ratio?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">The California Bearing Ratio (CBR) is a penetration test for evaluation of the mechanical strength of natural ground, subgrades and basecourses beneath new carriageway construction. It was developed by the California Department of Transportation.</p>
                            <div className={`${theme.bgLight} border ${theme.border} p-3 rounded-lg`}>
                                <strong>CBR Value</strong> = (Test Load / Standard Load) × 100
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-table ${theme.text} mr-2`}></i>Standard CBR Loads</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-3 py-2">Penetration (mm)</th><th className="border px-3 py-2">Unit Std. Load (kg/cm²)</th><th className="border px-3 py-2">Total Std. Load (kg)</th></tr></thead>
                                <tbody>
                                    <tr><td className="border px-3 py-2 text-center">2.5</td><td className="border px-3 py-2 text-center">70</td><td className={`border px-3 py-2 text-center font-bold ${theme.text}`}>1370</td></tr>
                                    <tr><td className="border px-3 py-2 text-center">5.0</td><td className="border px-3 py-2 text-center">105</td><td className={`border px-3 py-2 text-center font-bold ${theme.text}`}>2055</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-flask ${theme.text} mr-2`}></i>Apparatus</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                <li><strong>CBR Mould:</strong> Cylindrical mould - 150mm dia × 175mm height with detachable collar (50mm) and base plate</li>
                                <li><strong>Spacer Disc:</strong> 148mm dia × 47.7mm thick metal disc</li>
                                <li><strong>Surcharge Weights:</strong> Annular metal weights 147mm dia with central hole of 53mm</li>
                                <li><strong>Compression Machine:</strong> Capacity 5000kg with rate of strain 1.25mm/min</li>
                                <li><strong>Penetration Plunger:</strong> 50mm diameter with loading rate gauge</li>
                                <li><strong>Dial Gauges:</strong> To measure penetration (0-25mm) and expansion (0-10mm)</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-calculator ${theme.text} mr-2`}></i>CBR Calculation Formula</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center space-y-3 font-mono">
                                <div className={`text-lg ${theme.text}`}>CBR at 2.5mm = (Load at 2.5mm / 1370) × 100 %</div>
                                <div className={`text-lg ${theme.text}`}>CBR at 5.0mm = (Load at 5.0mm / 2055) × 100 %</div>
                                <div className="text-lg font-bold">CBR Value = Maximum of (CBR at 2.5mm, CBR at 5.0mm)</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p className="text-justify"><strong>Note:</strong> Generally CBR at 2.5mm penetration is greater than that at 5.0mm. If CBR at 5.0mm is greater, repeat the test. If the same result is obtained again, CBR at 5.0mm is reported.</p>
                            </div>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                            <i className="fas fa-road text-xl text-white"></i>
                            <h2 className="font-semibold text-sm text-white">CALIFORNIA BEARING RATIO (CBR) TEST</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">Surcharge (kg)</label><input type="number" value={surcharge} onChange={(e) => setSurcharge(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">Rate (mm/min)</label><input type="number" step="0.01" value={penetrationRate} onChange={(e) => setPenetrationRate(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>

                            <div className="overflow-y-auto max-h-48 mb-3">
                                <table className="w-full text-xs">
                                    <thead className="sticky top-0 bg-gray-100"><tr><th className="px-2 py-1">Penet. (mm)</th><th className="px-2 py-1">Load (kg)</th></tr></thead>
                                    <tbody>
                                        {readings.map((r, i) => (
                                            <tr key={i} className={r.penetration === 2.5 || r.penetration === 5.0 ? theme.bgLight : ''}>
                                                <td className="px-2 py-1"><input type="number" step="0.5" value={r.penetration} onChange={(e) => updateReading(i, 'penetration', e.target.value)} className="w-full px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-2 py-1"><input type="number" value={r.load} onChange={(e) => updateReading(i, 'load', e.target.value)} className="w-full px-1 py-0.5 border rounded text-xs" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button onClick={calculate} className={`w-full ${theme.button} py-2 rounded-lg font-medium mb-4`}>Calculate</button>
                            <div className={`${theme.bgLight} rounded-xl p-4`}>
                                <div className="text-center mb-3">
                                    <div className="text-xs text-gray-500">CBR Value</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results?.cbrValue} %</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded text-center">
                                        <div className="text-gray-500">CBR at 2.5mm</div>
                                        <div className={`font-bold ${theme.text}`}>{results?.cbr25}%</div>
                                        <div className="text-gray-400">Load: {results?.load25} kg</div>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                        <div className="text-gray-500">CBR at 5.0mm</div>
                                        <div className={`font-bold ${theme.text}`}>{results?.cbr50}%</div>
                                        <div className="text-gray-400">Load: {results?.load50} kg</div>
                                    </div>
                                </div>
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
