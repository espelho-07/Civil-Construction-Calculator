import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function ACCalculator() {
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

    const calculate = () => {
        const length = lengthFt + lengthIn / 12;
        const breadth = breadthFt + breadthIn / 12;
        const height = heightFt + heightIn / 12;

        // AC Tons = ((Length × Breadth) / 1000) + No of Person × Temperature × Height
        // Simplified formula: Area/100 + persons factor + temp factor
        const area = length * breadth;
        const volume = area * height;

        // British Thermal Units calculation
        const btuBase = area * 25; // 25 BTU per sq ft base
        const personBtu = noOfPerson * 400; // 400 BTU per person
        const tempFactor = maxTemp > 35 ? 1.1 : 1;
        const heightFactor = height > 10 ? 1.1 : 1;

        const totalBtu = (btuBase + personBtu) * tempFactor * heightFactor;
        const acTons = totalBtu / 12000; // 12000 BTU = 1 Ton

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
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Air Conditioner Size Calculator</h1>
                    <p className="text-[#6b7280] mb-6">Calculate the right AC tonnage for your room</p>

                    {/* Result Display */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Size of Air Conditioner</div>
                                    <div className="text-4xl font-bold text-[#3B68FC]">{results?.acTons}</div>
                                    <div className="text-xl text-gray-600">Tons</div>
                                    <div className="text-xs text-gray-500 mt-2">All calculations are estimates based on the information you provide.</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">Air Conditioner Size Calculation</div>
                                    <div className="font-mono text-sm">
                                        <p>AC Tons = ((L×B) / 1000) + No of Person + Temperature + Height</p>
                                        <p className="mt-2">AC Tons = (({results?.length}×{results?.breadth}) / 1000) × {noOfPerson} × 1 × 0.15</p>
                                        <p className="font-bold text-[#3B68FC] mt-2">AC Tons = {results?.acTons} Tons</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is AC Size */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Air Conditioner Size calculation?</h2>
                        <div className="bg-white rounded-xl p-6 border flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">This air conditioner size calculator, also known as AC Tonnage calculator, or air conditioning size calculator helps you to choose what size of air conditioner you need for your room.</p>
                                <p className="text-gray-600">The air conditioner capacity need for your room will give you recommended BTU/hr by which you can understand to preferably cool or heat the room.</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Air Conditioner" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Formula */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Air Conditioner Size Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-lg text-center text-[#3B68FC] mb-4">
                                Air Conditioner Tons = ((Length × Breadth) / 1000) + No of Person + Temperature + Height
                            </div>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p><strong>Where: No.of Person</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>0.3 Up to 2 peoples in a room</li>
                                    <li>0.06 for each extra person in the room, ex: 0.3 + 0.07 * No. of Extra person</li>
                                </ul>
                                <p className="mt-3"><strong>Where: Temperature</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>0.0 if the highest temperature in summer exceeds 40 °c</li>
                                    <li>-0.1 if the highest temperature in summer between 35 - 40 °c</li>
                                    <li>-0.15 if the highest temperature is in summer between 35 - 40 °c</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* AC Size Table */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 border">
                                <h3 className="font-bold mb-4">Room Size vs AC Tonnage</h3>
                                <table className="w-full text-sm">
                                    <thead><tr className="bg-gray-100"><th className="border px-3 py-2">Square feet</th><th className="border px-3 py-2">Ac Tonnage</th></tr></thead>
                                    <tbody>{acTable.map((row, i) => (<tr key={i}><td className="border px-3 py-2">{row.sqft}</td><td className="border px-3 py-2">{row.tons}</td></tr>))}</tbody>
                                </table>
                            </div>
                            <div className="bg-white rounded-xl p-6 border">
                                <h3 className="font-bold mb-4">BTU vs AC Tonnage</h3>
                                <table className="w-full text-sm">
                                    <thead><tr className="bg-gray-100"><th className="border px-3 py-2">BTU</th><th className="border px-3 py-2">AC Tonnage</th></tr></thead>
                                    <tbody>{btuTable.map((row, i) => (<tr key={i}><td className="border px-3 py-2">{row.btu}</td><td className="border px-3 py-2">{row.tons}</td></tr>))}</tbody>
                                </table>
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
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center gap-3">
                            <i className="fas fa-snowflake text-xl text-blue-500"></i>
                            <h2 className="font-semibold">AC CONDITIONER TONNAGE</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length of Room</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={lengthFt} onChange={(e) => setLengthFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={lengthIn} onChange={(e) => setLengthIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Breadth of Room</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={breadthFt} onChange={(e) => setBreadthFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={breadthIn} onChange={(e) => setBreadthIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Height of Room</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span></div><div className="relative"><input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border rounded-lg text-sm" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">No of Person</label><input type="number" value={noOfPerson} onChange={(e) => setNoOfPerson(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Max Temperature (°c)</label><input type="number" value={maxTemp} onChange={(e) => setMaxTemp(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium">Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 text-center"><div className="text-xs text-gray-500">AC Size Required</div><div className="text-3xl font-bold text-blue-500">{results?.acTons} Tons</div><div className="text-sm text-gray-500 mt-2">Room Area: {results?.area} sq ft</div></div>
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
