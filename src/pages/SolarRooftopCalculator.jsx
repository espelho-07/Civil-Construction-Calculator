import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function SolarRooftopCalculator() {
    const theme = getThemeClasses('green');
    const [consumptionType, setConsumptionType] = useState('monthly');
    const [units, setUnits] = useState(600);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const dailyUnits = consumptionType === 'monthly' ? units / 30 : units;
        const kwCapacity = dailyUnits / 4;
        const panels = Math.ceil(kwCapacity / 0.335);
        const rooftopAreaSqm = kwCapacity * 10;
        const rooftopAreaSqft = rooftopAreaSqm * 10.764;

        setResults({
            dailyUnits: dailyUnits.toFixed(2),
            kwCapacity: kwCapacity.toFixed(2),
            noOfPanels: panels,
            rooftopAreaSqm: rooftopAreaSqm.toFixed(2),
            rooftopAreaSqft: rooftopAreaSqft.toFixed(2),
        });
    };

    const reset = () => {
        setConsumptionType('monthly');
        setUnits(600);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [consumptionType, units]);
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

    const solarData = [
        { capacity: '2.240', panels: 7, areaSqft: '213.22', areaSqm: '19.81', yearly: 3530, monthly: 285 },
        { capacity: '2.970', panels: 9, areaSqft: '280.18', areaSqm: '26.22', yearly: 4512, monthly: 391 },
        { capacity: '3.300', panels: 10, areaSqft: '313.15', areaSqm: '29.08', yearly: 4915, monthly: 5340 },
        { capacity: '3.960', panels: 12, areaSqft: '375.78', areaSqm: '34.91', yearly: 534, monthly: 5428 },
        { capacity: '4.950', panels: 15, areaSqft: '469.27', areaSqm: '45.61', yearly: 607, monthly: 8004 },
        { capacity: '5.940', panels: 18, areaSqft: '564.37', areaSqm: '52.43', yearly: 802, monthly: 9624 },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Solar-Rooftop Calculator</h1>
                            <p className="text-[#6b7280]">Calculate solar panel requirements based on electricity consumption</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="solar-rooftop-calculator"
                            calculatorName="Solar Rooftop Calculator"
                            calculatorIcon="fa-solar-panel"
                            category="Quantity Estimator"
                            inputs={{ consumptionType, units }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Cards */}
                    <section className="mb-8">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className={`fas fa-calculator ${theme.text}`}></i>
                                Calculation Result
                            </h2>
                            <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-[#f8f9fa] p-4 rounded-xl text-center border-b-2 border-transparent hover:border-green-500 transition-colors">
                                        <div className="text-sm text-gray-500 mb-2">Solar Panels</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>{results?.noOfPanels}</div>
                                        <div className="text-xs text-gray-400">Modules</div>
                                    </div>
                                    <div className="bg-[#f8f9fa] p-4 rounded-xl text-center border-b-2 border-transparent hover:border-green-500 transition-colors">
                                        <div className="text-sm text-gray-500 mb-2">System Size</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>{results?.kwCapacity}</div>
                                        <div className="text-xs text-gray-400">Kilowatts</div>
                                    </div>
                                    <div className="bg-[#f8f9fa] p-4 rounded-xl text-center border-b-2 border-transparent hover:border-green-500 transition-colors">
                                        <div className="text-sm text-gray-500 mb-2">Area (Sqft)</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>{results?.rooftopAreaSqft}</div>
                                        <div className="text-xs text-gray-400">Square Feet</div>
                                    </div>
                                    <div className="bg-[#f8f9fa] p-4 rounded-xl text-center border-b-2 border-transparent hover:border-green-500 transition-colors">
                                        <div className="text-sm text-gray-500 mb-2">Daily Usage</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>{results?.dailyUnits}</div>
                                        <div className="text-xs text-gray-400">Units/Day</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>

                    {/* Calculation Details */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-list-ul ${theme.text}`}></i>
                            Calculation Breakdown
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Daily Unit Consumption</span>
                                    <span className="font-mono">{units} ÷ 30 = <strong>{results?.dailyUnits}</strong></span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">RoofTop Capacity (Kw)</span>
                                    <span className="font-mono">{results?.dailyUnits} ÷ 4 = <strong>{results?.kwCapacity}</strong></span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Number of Solar Panels (335W)</span>
                                    <span className="font-mono">{results?.kwCapacity} ÷ 0.335 = <strong>{results?.noOfPanels}</strong></span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Common Solar RoofTop Style */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Standard Market Capacities
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} overflow-hidden`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold text-gray-600">KW Capacity</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600">No. Modules</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600">Area (Sq ft)</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600">Area (Sq m)</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600">Yearly Units</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {solarData.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{row.capacity}</td>
                                                <td className="px-4 py-3">{row.panels}</td>
                                                <td className="px-4 py-3 text-gray-500">{row.areaSqft}</td>
                                                <td className="px-4 py-3 text-gray-500">{row.areaSqm}</td>
                                                <td className="px-4 py-3 text-gray-500">{row.yearly}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* What is Solar Rooftop */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Solar RoofTop Calculation?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1 text-justify">
                                <p className="text-gray-600 mb-4 text-justify">Solar rooftops are solar panels placed on top of roofs of commercial, institutional or residential buildings. They capture the light energy emitted by the sun and convert it into electrical energy.</p>
                                <p className="text-gray-600 text-justify">Solar rooftop photo-voltaic systems produce a clean, Eco-friendly form of energy that does not produce any type of pollution or harmful gases.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Solar panels" className="w-full md:w-48 h-40 object-cover rounded-lg" />
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
                            <i className="fas fa-solar-panel text-xl text-white"></i>
                            <h2 className="font-semibold text-white">SOLAR-ROOFTOP CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Consumption Type</label>
                                <select
                                    value={consumptionType}
                                    onChange={(e) => setConsumptionType(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}
                                >
                                    <option value="monthly">Monthly Unit Consumption</option>
                                    <option value="daily">Daily Unit Consumption</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Units</label>
                                <input
                                    type="number"
                                    value={units}
                                    onChange={(e) => setUnits(Number(e.target.value))}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}
                                />
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>

                            {results && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                    <div className="text-xs text-gray-500">System Capacity</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results.kwCapacity} Kw</div>
                                    <div className="text-sm text-gray-500 mt-2">{results.noOfPanels} Panels Required</div>
                                </div>
                            )}
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
