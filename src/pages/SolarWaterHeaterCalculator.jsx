import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function SolarWaterHeaterCalculator() {
    const theme = getThemeClasses('green');
    const [noOfPersons, setNoOfPersons] = useState(7);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        // Capacity = No. of persons × 50 liters per day
        const capacity = noOfPersons * 50;
        setResults({
            capacity,
            dailyLiters: noOfPersons * 50,
        });
    };

    const reset = () => {
        setNoOfPersons(7);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [noOfPersons]);
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

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Solar Water Heater Calculator</h1>
                            <p className="text-[#6b7280]">Calculate solar water heater capacity based on family size</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="solar-water-heater-calculator"
                            calculatorName="Solar Water Heater Calculator"
                            calculatorIcon="fa-solar-panel"
                            category="Quantity Estimator"
                            inputs={{ noOfPersons }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Result Display */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Calculation Result
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Capacity of Solar Water Heater</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>{results?.capacity}</div>
                                    <div className="text-xl text-gray-600">liters</div>
                                    <div className={`text-xs text-gray-500 mt-2 ${theme.bgLight} p-2 rounded`}>
                                        <i className={`fas fa-info-circle ${theme.text} mr-1`}></i>
                                        The thumb rule in deciding the capacity is that a person requires 30-50 litres of water per day.
                                    </div>
                                </div>
                                <div className={`${theme.bgLight} p-4 rounded-lg`}>
                                    <div className="text-sm text-gray-600 mb-2">Solar Water Heater Calculation</div>
                                    <div className="font-mono text-sm">
                                        <p>Capacity = No. of persons × 50</p>
                                        <p className="mt-2">Capacity = {noOfPersons} × 50</p>
                                        <p className={`font-bold ${theme.text} mt-2`}>Capacity = {results?.capacity} liters</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Solar Water Heater */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Solar Water Heater calculation?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1 text-justify">
                                <p className="text-gray-600 mb-4">Solar water heater (SWH) is the conversion of sunlight into heat for water heating using a solar thermal collector. A variety of configurations is available at varying cost to provide solutions in different climates and latitudes.</p>
                                <p className="text-gray-600 mb-4">Solar water heater are widely used for residential and some industrial applications. A sun-facing collector heats a working fluid that passes into a storage system for later use.</p>
                                <p className="text-gray-600">Solar water heater are active (pumped) and passive (convection driven). They use water only, or both water and a working fluid. They are heated directly or via light concentrating mirrors.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Solar water heater" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Thumb Rule */}
                    <section className="mb-8">
                        <div className={`bg-white border ${theme.border} rounded-xl p-6`}>
                            <h3 className={`font-bold ${theme.text} mb-2 flex items-center gap-2`}><i className="fas fa-lightbulb"></i>Thumb Rule</h3>
                            <p className="text-gray-600 text-justify">The thumb rule in deciding the capacity is that a person requires 30-50 litres of water per day for bathing. And considering average size of the family 3 - 4 person 250 Liter capacity solar water heater is ideal.</p>
                        </div>
                    </section>

                    {/* Formula */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-flask ${theme.text}`}></i>
                            Solar-Water-Heater calculation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <div className={`${theme.bgLight} p-4 rounded-lg font-mono text-xl text-center ${theme.text} mb-4`}>
                                    Capacity = No. of persons × 50
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>Where:</strong></p>
                                    <ul className="list-disc pl-5">
                                        <li>Where Capacity is calculate in liters</li>
                                        <li>This Capacity is for per day</li>
                                    </ul>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&q=80" alt="Solar heater diagram" className="w-full md:w-40 h-32 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Important Info */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-exclamation-circle ${theme.text}`}></i>
                            Important Factors
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">A solar water heater is a solar energy system that uses the sun to heat your domestic hot water. Just like a solar electric system, it uses panels to collect solar energy.</p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.text} font-bold`}>1</div>
                                    <div><strong className={theme.text}>Smaller carbon footprint</strong><p className="text-sm text-gray-600 text-justify">Although many homes use electricity for their water heating system, other systems use oil or natural gas. By installing a solar system, you reduce your dependency on natural resources and limit your carbon footprint.</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.text} font-bold`}>2</div>
                                    <div><strong className={theme.text}>Financial incentives</strong><p className="text-sm text-gray-600 text-justify">The federal government may offer tax credits to homeowners installing solar water heaters. Many city and state governments also offer tax credits, rebates and other incentives.</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.text} font-bold`}>3</div>
                                    <div><strong className={theme.text}>Lower energy bills</strong><p className="text-sm text-gray-600 text-justify">Homeowners with solar hot water heating systems can save a considerable amount money on their monthly gas and electric bills.</p></div>
                                </div>
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
                    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb]">
                        <div className={`px-5 py-4 border-b border-[#e5e7eb] ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-temperature-high text-xl text-white"></i>
                            <h2 className="font-semibold text-white">SOLAR WATER HEATER CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">No of Persons in Family</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={noOfPersons}
                                        onChange={(e) => setNoOfPersons(Number(e.target.value))}
                                        className={`w-full px-3 py-2 pr-12 border rounded-lg text-sm ${theme.focus} outline-none`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Nos.</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            {results && (
                                <div className={`${theme.bgLight} rounded-xl p-4 text-center border border-gray-100`}>
                                    <div className="text-xs text-gray-500">Capacity of Solar Water Heater</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results?.capacity}</div>
                                    <div className="text-lg text-gray-600">liters</div>
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
