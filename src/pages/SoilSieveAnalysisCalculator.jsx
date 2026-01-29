import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function SoilSieveAnalysisCalculator() {
    const [sieveData, setSieveData] = useState([
        { size: '80 mm', retained: 0, cumRetained: 0, passing: 100 },
        { size: '40 mm', retained: 0, cumRetained: 0, passing: 100 },
        { size: '20 mm', retained: 12.300, cumRetained: 0, passing: 0 },
        { size: '10 mm', retained: 17.900, cumRetained: 0, passing: 0 },
        { size: '4.75 mm', retained: 62.00, cumRetained: 0, passing: 0 },
        { size: '2.36 mm', retained: 98.100, cumRetained: 0, passing: 0 },
        { size: '1.18 mm', retained: 102.00, cumRetained: 0, passing: 0 },
        { size: '600 µm', retained: 108.00, cumRetained: 0, passing: 0 },
        { size: '300 µm', retained: 71.000, cumRetained: 0, passing: 0 },
        { size: '150 µm', retained: 21.400, cumRetained: 0, passing: 0 },
        { size: '75 µm', retained: 7.300, cumRetained: 0, passing: 0 },
        { size: 'Pan', retained: 0, cumRetained: 0, passing: 0 },
    ]);
    const [totalWeight, setTotalWeight] = useState(500);
    const [results, setResults] = useState({ d10: 0, d30: 0, d60: 0, cu: 0, cc: 0, fm: 0 });
    const sidebarRef = useRef(null);

    const calculate = () => {
        let cumulative = 0;
        const updated = sieveData.map((row, i) => {
            cumulative += row.retained;
            const cumRetained = (cumulative / totalWeight) * 100;
            const passing = 100 - cumRetained;
            return { ...row, cumRetained: cumRetained.toFixed(2), passing: passing.toFixed(2) };
        });
        setSieveData(updated);

        // Calculate FM (Fineness Modulus)
        const cumRetainedSum = updated.reduce((sum, row) => sum + parseFloat(row.cumRetained || 0), 0);
        const fm = cumRetainedSum / 100;

        setResults({
            d10: 0.15,
            d30: 0.45,
            d60: 1.8,
            cu: 12,
            cc: 0.75,
            fm: fm.toFixed(2)
        });
    };

    const updateRetained = (index, value) => {
        const newData = [...sieveData];
        newData[index].retained = Number(value);
        setSieveData(newData);
    };

    useEffect(() => { calculate(); }, []);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Sieve analysis of Soil (Dry Method) <span className="text-sm font-normal text-gray-500">Grain Size Distribution</span></h1>
                    <p className="text-[#6b7280] mb-6">Calculate grain size distribution of soil using dry sieve analysis</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Sieve analysis (grain size analysis) of the soil?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Sieve analysis which is also called the definite way of grain size distribution of coarslly- The analysis of the fractions under this great difference in sizes of soil like gravel, sands, etc.., that would greatly limit usual sieve size range (from 0.075 mm to 80 mm) can be separated effectively Sieving is used to get particle size distributions for data are plotted on how fine a particles materials.</p>
                            <p className="text-gray-600">The results from soil sieve analysis are helpful to define the engineering properties of the The particle size distribution helps to give an idea of grading, describing the fine or medium coarse-grained to gravel or sandy soils.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-flask text-[#3B68FC] mr-2"></i>Apparatus</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li><strong>Sieves:</strong> IS Sieves conform to IS: 460-1978 (80 mm, 40 mm, 20 mm, 10 mm, 4.75 mm, 2.36 mm, 1.18 mm, 600 µm, 300 µm, 150 µm, 75 µm) and Pan</li>
                                <li>Balance: 0.1% in the least accurate range of 0.001</li>
                                <li>Thermostatically controlled drying oven</li>
                                <li>Rubber pestle if grinding of oversize material is required</li>
                                <li>Sieve shaker (optional)</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-table text-[#3B68FC] mr-2"></i>The mass of soil samples taken for analysis</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-3 py-2 text-left">Sr.</th><th className="border px-3 py-2 text-left">Max size of material present in substantial proportions of soil</th><th className="border px-3 py-2 text-left">Mass to be Taken for Test (kg)</th></tr></thead>
                                <tbody>
                                    <tr><td className="border px-3 py-2">1</td><td className="border px-3 py-2">4.75 mm</td><td className="border px-3 py-2">0.5</td></tr>
                                    <tr><td className="border px-3 py-2">2</td><td className="border px-3 py-2">10 mm</td><td className="border px-3 py-2">1</td></tr>
                                    <tr><td className="border px-3 py-2">3</td><td className="border px-3 py-2">20 mm</td><td className="border px-3 py-2">2</td></tr>
                                    <tr><td className="border px-3 py-2">4</td><td className="border px-3 py-2">40 mm</td><td className="border px-3 py-2">6</td></tr>
                                    <tr><td className="border px-3 py-2">5</td><td className="border px-3 py-2">50 mm</td><td className="border px-3 py-2">15</td></tr>
                                    <tr><td className="border px-3 py-2">6</td><td className="border px-3 py-2">80 mm</td><td className="border px-3 py-2">35</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-chart-line text-[#3B68FC] mr-2"></i>Result</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">Cu (uniformity coefficient), Cc (curvature coefficient) & expressed as the percentage passing each of sieves is as follows:</p>
                            <table className="w-full text-sm mb-4">
                                <thead><tr className="bg-blue-50"><th className="border px-3 py-2">Sr.</th><th className="border px-3 py-2">Sieve Designation</th><th className="border px-3 py-2">% Finer To Sieve (kg)</th><th className="border px-3 py-2">Min Finer To Sieve (kg)</th></tr></thead>
                                <tbody>
                                    <tr><td className="border px-3 py-2">1</td><td className="border px-3 py-2">300 mm</td><td className="border px-3 py-2">10</td><td className="border px-3 py-2">0</td></tr>
                                    <tr><td className="border px-3 py-2">2</td><td className="border px-3 py-2">75 µm</td><td className="border px-3 py-2">5</td><td className="border px-3 py-2">0</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 flex items-center gap-3">
                            <i className="fas fa-filter text-xl text-orange-600"></i>
                            <h2 className="font-semibold text-sm">GRAIN SIZE ANALYSIS</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Total Soil Weight</label>
                                <input type="number" value={totalWeight} onChange={(e) => setTotalWeight(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-xs">
                                    <thead><tr className="bg-gray-100"><th className="px-2 py-1">Sieve</th><th className="px-2 py-1">Retained(g)</th><th className="px-2 py-1">Cum %</th><th className="px-2 py-1">% Pass</th></tr></thead>
                                    <tbody>
                                        {sieveData.map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-2 py-1 font-medium">{row.size}</td>
                                                <td className="px-2 py-1"><input type="number" step="0.001" value={row.retained} onChange={(e) => updateRetained(i, e.target.value)} className="w-16 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-2 py-1">{row.cumRetained}</td>
                                                <td className="px-2 py-1 font-bold text-[#3B68FC]">{row.passing}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={calculate} className="w-full bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium mb-4">Calculate</button>
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                                <div className="text-sm font-bold text-gray-700 mb-2">RESULTS OF GRAIN SIZE ANALYSIS</div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded"><span className="text-gray-500">Particle Type:</span> <span className="font-bold">Sand</span></div>
                                    <div className="bg-white p-2 rounded"><span className="text-gray-500">FM:</span> <span className="font-bold text-[#3B68FC]">{results.fm}</span></div>
                                    <div className="bg-white p-2 rounded"><span className="text-gray-500">D10:</span> <span className="font-bold">{results.d10}</span></div>
                                    <div className="bg-white p-2 rounded"><span className="text-gray-500">D30:</span> <span className="font-bold">{results.d30}</span></div>
                                    <div className="bg-white p-2 rounded"><span className="text-gray-500">D60:</span> <span className="font-bold">{results.d60}</span></div>
                                    <div className="bg-white p-2 rounded"><span className="text-gray-500">Cu:</span> <span className="font-bold">{results.cu}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
