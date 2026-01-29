import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function SolarRooftopCalculator() {
    const [consumptionType, setConsumptionType] = useState('monthly');
    const [units, setUnits] = useState(600);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const dailyUnits = consumptionType === 'monthly' ? units / 30 : units;
        const kwCapacity = dailyUnits / 4; // Assuming 4 units per kW per day
        const noOfPanels = Math.ceil(kwCapacity / 0.335); // 335W panels
        const rooftopAreaSqm = kwCapacity * 10; // 10 sqm per kW
        const rooftopAreaSqft = rooftopAreaSqm * 10.764;

        setResults({
            dailyUnits: dailyUnits.toFixed(2),
            kwCapacity: kwCapacity.toFixed(2),
            noOfPanels,
            rooftopAreaSqm: rooftopAreaSqm.toFixed(2),
            rooftopAreaSqft: rooftopAreaSqft.toFixed(2),
        });
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 border text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-solar-panel text-red-500"></i></div>
                                <div className="text-sm text-gray-500">No of Solar Panels</div>
                                <div className="text-2xl font-bold text-red-500">{results?.noOfPanels} Panels</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-bolt text-blue-500"></i></div>
                                <div className="text-sm text-gray-500">KW SYSTEM RECOMMENDED</div>
                                <div className="text-2xl font-bold text-blue-500">{results?.kwCapacity} Kw</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-tachometer-alt text-amber-500"></i></div>
                                <div className="text-sm text-gray-500">Daily Unit Consumption</div>
                                <div className="text-2xl font-bold text-amber-500">{results?.dailyUnits} units/day</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-home text-green-500"></i></div>
                                <div className="text-sm text-gray-500">Area For RoofTop</div>
                                <div className="text-lg font-bold text-green-500">{results?.rooftopAreaSqft} Sq ft</div>
                                <div className="text-sm font-bold text-gray-500">{results?.rooftopAreaSqm} Sq m</div>
                            </div>
                        </div>
                    </section>

                    {/* Calculation Details */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Solar Roof Top Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">Daily Unit Consumption</div>
                                    <div className="bg-[#f8f9fa] p-3 rounded font-mono text-sm">
                                        <p>= Monthly Unit Consumption ÷ 30</p>
                                        <p>= {units} ÷ 30</p>
                                        <p className="font-bold text-[#3B68FC]">= {results?.dailyUnits} units/day</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">RoofTop Capacity</div>
                                    <div className="bg-[#f8f9fa] p-3 rounded font-mono text-sm">
                                        <p>= Daily Consumption ÷ 4</p>
                                        <p>= {results?.dailyUnits} ÷ 4</p>
                                        <p className="font-bold text-[#3B68FC]">= {results?.kwCapacity} Kw</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">Number of Solar Panel</div>
                                    <div className="bg-[#f8f9fa] p-3 rounded font-mono text-sm">
                                        <p>= RoofTop Capacity ÷ 0.335</p>
                                        <p className="font-bold text-red-500">= {results?.noOfPanels} units/day</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">Area Require for Rooftop</div>
                                    <div className="bg-[#f8f9fa] p-3 rounded font-mono text-sm">
                                        <p>= RoofTop Capacity × 95</p>
                                        <p className="font-bold text-green-500">= {results?.rooftopAreaSqft} Sq feet</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Common Solar RoofTop Style */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-table text-[#3B68FC] mr-2"></i>Common Solar RoofTop Style Available in Market</h2>
                        <div className="bg-white rounded-xl p-6 border overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-2 py-2">Sr.</th><th className="border px-2 py-2">KW Capacity</th><th className="border px-2 py-2">No of Modules (Panel)</th><th className="border px-2 py-2">Require Area Sq ft</th><th className="border px-2 py-2">Require Area Sq m</th><th className="border px-2 py-2">Yearly Avg Production</th><th className="border px-2 py-2">Monthly Avg Production</th></tr></thead>
                                <tbody>
                                    {solarData.map((row, i) => (
                                        <tr key={i}><td className="border px-2 py-1 text-center">{i + 1}</td><td className="border px-2 py-1">{row.capacity}</td><td className="border px-2 py-1 text-center">{row.panels}</td><td className="border px-2 py-1">{row.areaSqft}</td><td className="border px-2 py-1">{row.areaSqm}</td><td className="border px-2 py-1">{row.yearly}</td><td className="border px-2 py-1">{row.monthly}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* What is Solar Rooftop */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Solar RoofTop Calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Solar rooftops are solar panels placed on top of roofs of commercial, institutional or residential buildings. They capture the light energy emitted by the sun and convert it into electrical energy.</p>
                                <p className="text-gray-600">Solar rooftop photo-voltaic systems, it produces a clean, Eco-friendly form of energy, meaning that it's which does not produce any type of pollution or harmful gases.</p>
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
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-orange-50 to-yellow-50 flex items-center gap-3">
                            <i className="fas fa-solar-panel text-xl text-orange-500"></i>
                            <h2 className="font-semibold">SOLAR-ROOFTOP CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Consumption Type</label><select value={consumptionType} onChange={(e) => setConsumptionType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="monthly">Monthly Unit Consumption</option><option value="daily">Daily Unit Consumption</option></select></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Units</label><input type="number" value={units} onChange={(e) => setUnits(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-[#f8f9fa] rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div><div className="text-xs text-gray-500">Solar Panels</div><div className="text-xl font-bold text-red-500">{results?.noOfPanels}</div></div>
                                    <div><div className="text-xs text-gray-500">KW System</div><div className="text-xl font-bold text-blue-500">{results?.kwCapacity} Kw</div></div>
                                    <div><div className="text-xs text-gray-500">Daily Units</div><div className="text-lg font-bold text-amber-500">{results?.dailyUnits}</div></div>
                                    <div><div className="text-xs text-gray-500">Area Required</div><div className="text-lg font-bold text-green-500">{results?.rooftopAreaSqft} ft²</div></div>
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
