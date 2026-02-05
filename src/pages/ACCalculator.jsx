import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { QUANTITY_ESTIMATOR_NAV } from '../constants/calculatorRoutes';

export default function ACCalculator() {
    const theme = getThemeClasses('green');
    const [lengthFt, setLengthFt] = useState(16);
    const [lengthIn, setLengthIn] = useState(8);
    const [breadthFt, setBreadthFt] = useState(12);
    const [breadthIn, setBreadthIn] = useState(0);
    const [heightFt, setHeightFt] = useState(9);
    const [heightIn, setHeightIn] = useState(6);
    const [noOfPerson, setNoOfPerson] = useState(5);
    const [maxTemp, setMaxTemp] = useState(38);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const reset = () => {
        setLengthFt(16); setLengthIn(8);
        setBreadthFt(12); setBreadthIn(0);
        setHeightFt(9); setHeightIn(6);
        setNoOfPerson(5);
        setMaxTemp(38);
        setResults(null);
    };

    const calculate = () => {
        const length = lengthFt + lengthIn / 12;
        const breadth = breadthFt + breadthIn / 12;
        const height = heightFt + heightIn / 12;

        const area = length * breadth;
        const volume = area * height;

        const btuBase = area * 25;
        const personBtu = noOfPerson * 400;
        const tempFactor = maxTemp > 35 ? 1.1 : 1;
        const heightFactor = height > 10 ? 1.1 : 1;

        const totalBtu = (btuBase + personBtu) * tempFactor * heightFactor;
        const acTons = totalBtu / 12000;

        setResults({
            area: area.toFixed(2),
            volume: volume.toFixed(2),
            length: length.toFixed(2),
            breadth: breadth.toFixed(2),
            height: height.toFixed(2),
            btu: Math.round(totalBtu),
            acTons: acTons.toFixed(2),
        });
    };

    useEffect(() => { calculate(); }, [lengthFt, lengthIn, breadthFt, breadthIn, heightFt, heightIn, noOfPerson, maxTemp]);

    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const acTable = [
        { sqft: '100 - 200', tons: '1.0' },
        { sqft: '200 - 300', tons: '1.5' },
        { sqft: '300 - 400', tons: '2.0' },
        { sqft: '400 - 550', tons: '2.5' },
        { sqft: '550 - 700', tons: '3.0' },
    ];

    const btuTable = [
        { btu: '6,000', tons: '1/4 Ton' },
        { btu: '9,000', tons: '1 Ton' },
        { btu: '12,000', tons: '1 Ton' },
        { btu: '24,000', tons: '2 Ton' },
        { btu: '36,000', tons: '3 ton' },
        { btu: '48,000', tons: '4 ton' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Air Conditioner Size Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the right AC tonnage for your room</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="ac-calculator"
                            calculatorName="Air Conditioner Size Calculator"
                            calculatorIcon="fa-snowflake"
                            category="Quantity Estimator"
                            inputs={{ lengthFt, breadthFt, heightFt, noOfPerson }}
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
                                <div className="bg-[#f8f9fa] p-6 rounded-xl text-center">
                                    <div className="text-sm text-gray-500 mb-1">Recommended AC Size</div>
                                    <div className={`text-4xl font-bold ${theme.text} mb-2`}>{results?.acTons} Tons</div>
                                    <div className="text-xs text-gray-400">Based on room volume & occupancy</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-6 rounded-xl text-center">
                                    <div className="text-sm text-gray-500 mb-1">Cooling Load (BTU)</div>
                                    <div className={`text-4xl font-bold ${theme.text} mb-2`}>{results?.btu}</div>
                                    <div className="text-xs text-gray-400">British Thermal Units / Hour</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Formula */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-flask ${theme.text}`}></i>
                            Calculation Formula
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm mb-4 text-gray-700">
                                AC Tons = ((Length × Breadth) / 1000) + No of Person + Temperature + Height
                            </div>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p><strong>Adjustments:</strong></p>
                                  <ul className="list-disc pl-5">
                                      <li>If temp &gt; 35°C, add 10% load</li>
                                      <li>If height &gt; 10ft, add 10% load</li>
                                    <li>Each person adds approx 400 BTU heat load</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* AC Size Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Reference Tables
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                                <h3 className="font-bold mb-4 text-gray-800">Room Size vs AC Tonnage</h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="w-full text-sm">
                                        <thead><tr className="bg-gray-50"><th className="px-4 py-2 text-left font-medium text-gray-500">Square feet</th><th className="px-4 py-2 text-left font-medium text-gray-500">Ac Tonnage</th></tr></thead>
                                        <tbody className="divide-y divide-gray-100">{acTable.map((row, i) => (<tr key={i}><td className="px-4 py-2">{row.sqft}</td><td className="px-4 py-2">{row.tons}</td></tr>))}</tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                                <h3 className="font-bold mb-4 text-gray-800">BTU vs AC Tonnage</h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="w-full text-sm">
                                        <thead><tr className="bg-gray-50"><th className="px-4 py-2 text-left font-medium text-gray-500">BTU</th><th className="px-4 py-2 text-left font-medium text-gray-500">AC Tonnage</th></tr></thead>
                                        <tbody className="divide-y divide-gray-100">{btuTable.map((row, i) => (<tr key={i}><td className="px-4 py-2">{row.btu}</td><td className="px-4 py-2">{row.tons}</td></tr>))}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is AC Size */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Air Conditioner Size calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4 text-justify">This air conditioner size calculator, also known as AC Tonnage calculator, helps you to choose what size of air conditioner you need for your room.</p>
                                <p className="text-gray-600 text-justify">The air conditioner capacity need for your room will give you recommended BTU/hr by which you can understand to preferably cool or heat the room.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Air Conditioner" className="w-full md:w-48 h-40 object-cover rounded-lg" />
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

                    <div className="bg-white rounded-2xl shadow-lg data-[state=open]:animate-in border border-[#e5e7eb]">
                        <div className={`px-5 py-4 border-b border-[#e5e7eb] ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className={`fas fa-snowflake text-xl text-white`}></i>
                            <h2 className="font-semibold text-white">AC CONDITIONER TONNAGE</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length (L)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={lengthFt} onChange={(e) => setLengthFt(Number(e.target.value))} className={`w-full px-3 py-2 pr-8 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">ft</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={lengthIn} onChange={(e) => setLengthIn(Number(e.target.value))} className={`w-full px-3 py-2 pr-8 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">in</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Breadth (B)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={breadthFt} onChange={(e) => setBreadthFt(Number(e.target.value))} className={`w-full px-3 py-2 pr-8 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">ft</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={breadthIn} onChange={(e) => setBreadthIn(Number(e.target.value))} className={`w-full px-3 py-2 pr-8 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">in</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Height (H)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className={`w-full px-3 py-2 pr-8 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">ft</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className={`w-full px-3 py-2 pr-8 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">in</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">No of Person</label>
                                <input type="number" value={noOfPerson} onChange={(e) => setNoOfPerson(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Max Temperature (°c)</label>
                                <input type="number" value={maxTemp} onChange={(e) => setMaxTemp(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>

                            {results && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                                    <div className="text-xs text-gray-500">AC Size Required</div>
                                    <div className={`text-3xl font-bold ${theme.text}`}>{results.acTons} Tons</div>
                                </div>
                            )}
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
