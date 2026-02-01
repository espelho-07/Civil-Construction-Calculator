import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function SoilSieveAnalysisCalculator() {
    const theme = getThemeClasses('amber');
    const [sieveData, setSieveData] = useState([
        { size: '80 mm', value: 80, retained: 0, cumRetained: 0, passing: 100 },
        { size: '40 mm', value: 40, retained: 0, cumRetained: 0, passing: 100 },
        { size: '20 mm', value: 20, retained: 12.3, cumRetained: 0, passing: 0 },
        { size: '10 mm', value: 10, retained: 17.9, cumRetained: 0, passing: 0 },
        { size: '4.75 mm', value: 4.75, retained: 62.0, cumRetained: 0, passing: 0 },
        { size: '2.36 mm', value: 2.36, retained: 98.1, cumRetained: 0, passing: 0 },
        { size: '1.18 mm', value: 1.18, retained: 102.0, cumRetained: 0, passing: 0 },
        { size: '600 µm', value: 0.600, retained: 108.0, cumRetained: 0, passing: 0 },
        { size: '300 µm', value: 0.300, retained: 71.0, cumRetained: 0, passing: 0 },
        { size: '150 µm', value: 0.150, retained: 21.4, cumRetained: 0, passing: 0 },
        { size: '75 µm', value: 0.075, retained: 7.3, cumRetained: 0, passing: 0 },
        { size: 'Pan', value: 0, retained: 0, cumRetained: 0, passing: 0 },
    ]);
    const [totalWeight, setTotalWeight] = useState(500);
    const [results, setResults] = useState({ d10: '-', d30: '-', d60: '-', cu: '-', cc: '-', fm: '-', type: '-' });
    const sidebarRef = useRef(null);

    const calculate = () => {
        let cumulative = 0;

        // Calculate total weight from sum of retained weights (standard practice in soil analysis)
        const sumRetained = sieveData.reduce((acc, row) => {
            const retained = Math.max(0, parseFloat(row.retained) || 0);
            return acc + (isNaN(retained) || !isFinite(retained) ? 0 : retained);
        }, 0);

        // Use sum of retained as total weight (standard in soil sieve analysis)
        const activeTotal = sumRetained > 0 ? sumRetained : totalWeight;
        
        if (activeTotal <= 0 || isNaN(activeTotal) || !isFinite(activeTotal)) {
            setSieveData(prev => prev.map(row => ({
                ...row,
                cumRetained: '0.00',
                passing: '100.00',
                passingVal: 100
            })));
            setResults({ d10: '-', d30: '-', d60: '-', cu: '-', cc: '-', fm: '-', type: '-' });
            return;
        }

        const updated = sieveData.map((row) => {
            const retained = Math.max(0, parseFloat(row.retained) || 0);
            const validRetained = isNaN(retained) || !isFinite(retained) ? 0 : retained;
            
            cumulative += validRetained;
            const percentRetained = activeTotal > 0 ? (validRetained / activeTotal) * 100 : 0;
            const cumRetained = activeTotal > 0 ? (cumulative / activeTotal) * 100 : 0;
            const passing = Math.max(0, Math.min(100, 100 - cumRetained));
            
            return {
                ...row,
                retained: validRetained,
                percentRetained: percentRetained.toFixed(2),
                cumRetained: cumRetained.toFixed(2),
                passing: passing.toFixed(2),
                passingVal: passing // numeric for interpolation
            };
        });

        setSieveData(updated);

        // Calculate FM
        // FM = (Sum of Cumulative % Retained of standard sieves) / 100
        // Standard sieves typically: 80, 40, 20, 10, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15. (Excluding 0.075 and Pan)
        // We will include all except Pan and 0.075 usually for Soil FM, or all > 150 micron? 
        // Standard definition often varies, usually includes up to 150 micron. 
        // Let's sum all excluding Pan and 75 micron for now, or just sum all Cumulative Retained / 100 as broad approximation.
        // Actually for sand FM: 4.75, 2.36, 1.18, 0.6, 0.3, 0.15. 
        // Let's use simple sum / 100 of all sieves except Pan.
        const cumRetainedSum = updated.reduce((sum, row) => row.size !== 'Pan' ? sum + parseFloat(row.cumRetained || 0) : sum, 0);
        const fm = (cumRetainedSum / 100).toFixed(2);

        // Interpolation for D-values
        // We need D10, D30, D60 (Size at 10%, 30%, 60% passing)
        // Log-linear interpolation: log(D) vs %Passing

        const getDValue = (targetPercent) => {
            // Find two points bracketing the target percent
            // Data is sorted descending by size (80mm -> 0.075mm)
            // Passing % decreases as index increases
            for (let i = 0; i < updated.length - 1; i++) {
                const p1 = updated[i].passingVal;
                const s1 = updated[i].value;
                const p2 = updated[i + 1].passingVal;
                const s2 = updated[i + 1].value;

                if (p1 >= targetPercent && p2 <= targetPercent) {
                    if (p1 === p2) return s1; // avoid division by zero
                    if (targetPercent === p1) return s1;
                    if (targetPercent === p2) return s2;

                    // Log interpolation formula
                    // log(D) = log(s2) + ( (target - p2) / (p1 - p2) ) * (log(s1) - log(s2))
                    const logS1 = Math.log10(s1);
                    const logS2 = Math.log10(s2);
                    const logD = logS2 + ((targetPercent - p2) / (p1 - p2)) * (logS1 - logS2);
                    return Math.pow(10, logD);
                }
            }
            return null;
        };

        const d10 = getDValue(10);
        const d30 = getDValue(30);
        const d60 = getDValue(60);

        let cu = '-';
        let cc = '-';
        let type = 'Unknown';

        if (d10 && d60) {
            cu = (d60 / d10).toFixed(2);
        }
        if (d10 && d30 && d60) {
            cc = ((d30 * d30) / (d60 * d10)).toFixed(2);
        }

        // Classification
        const p475 = updated.find(s => s.size === '4.75 mm')?.passingVal || 0;
        const p075 = updated.find(s => s.size === '75 µm')?.passingVal || 0;

        // Validating totals
        const gravel = 100 - p475;
        const sand = p475 - p075;
        const fines = p075;

        if (gravel > sand && gravel > fines) type = 'Gravel';
        else if (sand > gravel && sand > fines) type = 'Sand';
        else type = 'Silt/Clay (Fines)';

        setResults({
            d10: d10 ? d10.toFixed(3) : '-',
            d30: d30 ? d30.toFixed(3) : '-',
            d60: d60 ? d60.toFixed(3) : '-',
            cu,
            cc,
            fm,
            type
        });

        if (sumRetained > 0) setTotalWeight(sumRetained.toFixed(1));
    };

    const updateRetained = (index, value) => {
        const newData = [...sieveData];
        newData[index].retained = value;
        setSieveData(newData);
    };

    // Calculate once on mount for initial data
    useEffect(() => {
        calculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Sieve Analysis of Soil (Dry Method)</h1>
                            <p className="text-[#6b7280]">Grain size distribution and classification (D10, D30, D60)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="soil-sieve-analysis"
                            calculatorName="Soil Sieve Analysis"
                            calculatorIcon="fa-filter"
                            category="Soil Engineering"
                            inputs={{ totalWeight, sieveData }}
                            outputs={results}
                        />
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>Theory</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">
                                Sieve analysis is the mechanical particle size analysis used to determine the grain size distribution of coarse-grained soils (gravels and sands). The particle size distribution is a fundamental property used for soil classification (USCS/IS Classification) and estimating engineering properties like permeability and strength.
                            </p>
                            <p className="text-gray-600 text-justify">
                                Key parameters derived from the Grain Size Distribution Curve include:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li><strong>D10 (Effective Size):</strong> Particle size corresponding to 10% passing.</li>
                                    <li><strong>D30 & D60:</strong> Sizes corresponding to 30% and 60% passing respectively.</li>
                                    <li><strong>Cu (Coefficient of Uniformity):</strong> D60 / D10. Indicates the range of particle sizes.</li>
                                    <li><strong>Cc (Coefficient of Curvature):</strong> (D30²) / (D60 × D10). Indicates the shape of the curve.</li>
                                </ul>
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-flask ${theme.text} mr-2`}></i>Apparatus</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> 80mm, 40mm, 20mm, 10mm, 4.75mm, 2.36mm, 1.18mm, 600µm, 300µm, 150µm, 75µm, and Pan.</li>
                                <li><strong>Balance:</strong> Sensitive to 0.1% of the weight of the sample (0.01g or 0.1g accuracy).</li>
                                <li><strong>Oven:</strong> Thermostatically controlled at 105-110°C.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical shaker for uniform sieving (optional but recommended).</li>
                                <li><strong>Cleaning Brush:</strong> soft wire brush for cleaning sieve mesh.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-table ${theme.text} mr-2`}></i>Standard Sample Quantities</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-sm">Quantity depends on the maximum particle size present:</p>
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-3 py-2 text-left">Max Particle Size</th><th className="border px-3 py-2 text-left">Min. Sample Weight (kg)</th></tr></thead>
                                <tbody>
                                    <tr><td className="border px-3 py-2">80 mm</td><td className="border px-3 py-2">60 kg</td></tr>
                                    <tr><td className="border px-3 py-2">40 mm</td><td className="border px-3 py-2">25 kg</td></tr>
                                    <tr><td className="border px-3 py-2">20 mm</td><td className="border px-3 py-2">6.5 kg</td></tr>
                                    <tr><td className="border px-3 py-2">10 mm</td><td className="border px-3 py-2">1.5 kg</td></tr>
                                    <tr><td className="border px-3 py-2">4.75 mm</td><td className="border px-3 py-2">0.5 kg</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${theme.border}`}>
                        {/* Standardized Gradient Header */}
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <i className="fas fa-filter text-white"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Gradation Analysis</h3>
                                <p className="text-white/80 text-xs">Grain Size Distribution</p>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block font-medium">Total Soil Weight (g)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={totalWeight}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                                    />
                                    <span className="flex items-center text-xs text-gray-400 whitespace-nowrap">(Auto-Sum)</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto mb-4">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-2 py-2 text-left text-gray-600 font-semibold">Sieve</th>
                                            <th className="px-2 py-2 text-center text-gray-600 font-semibold">Retained</th>
                                            <th className="px-2 py-2 text-center text-gray-600 font-semibold">% Pass</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sieveData.map((row, i) => (
                                            <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                                                <td className="px-2 py-1.5 font-medium text-gray-700">{row.size}</td>
                                                <td className="px-2 py-1.5 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={row.retained}
                                                        onChange={(e) => updateRetained(i, e.target.value)}
                                                        className={`w-16 px-1.5 py-1 border ${theme.border} rounded text-center outline-none focus:ring-1 focus:ring-amber-500 text-gray-700`}
                                                    />
                                                </td>
                                                <td className={`px-2 py-1.5 text-center font-bold ${Number(row.passing) < 5 ? 'text-red-400' : theme.text}`}>
                                                    {row.passing}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button onClick={calculate} className={`w-full ${theme.button} py-2.5 rounded-lg font-medium mb-5 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30`}>Calculate Distribution</button>

                            <div className={`${theme.bgLight} rounded-xl p-4 border ${theme.border}`}>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme.text}`}>Analysis Results</h4>

                                {/* D-Values Grid */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-white p-2 rounded-lg border border-amber-100 shadow-sm text-center">
                                        <div className="text-[10px] text-gray-400">D₁₀</div>
                                        <div className="font-bold text-gray-800">{results.d10}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-amber-100 shadow-sm text-center">
                                        <div className="text-[10px] text-gray-400">D₃₀</div>
                                        <div className="font-bold text-gray-800">{results.d30}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-amber-100 shadow-sm text-center">
                                        <div className="text-[10px] text-gray-400">D₆₀</div>
                                        <div className="font-bold text-gray-800">{results.d60}</div>
                                    </div>
                                </div>

                                {/* Coefficients & Classification */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-amber-100">
                                        <span className="text-xs text-gray-500">Uniformity (Cu)</span>
                                        <span className={`text-sm font-bold ${theme.text}`}>{results.cu}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-amber-100">
                                        <span className="text-xs text-gray-500">Curvature (Cc)</span>
                                        <span className={`text-sm font-bold ${theme.text}`}>{results.cc}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-amber-100">
                                        <span className="text-xs text-gray-500">Fineness Modulus</span>
                                        <span className={`text-sm font-bold ${theme.text}`}>{results.fm}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-amber-100 px-3 py-2 rounded-lg border border-amber-200 mt-2">
                                        <span className="text-xs text-amber-800 font-medium">Dominant Type</span>
                                        <span className="text-sm font-bold text-amber-900">{results.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
