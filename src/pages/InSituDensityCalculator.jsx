import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function InSituDensityCalculator() {
    const theme = getThemeClasses('amber');
    const [diameterCore, setDiameterCore] = useState(10);
    const [heightCore, setHeightCore] = useState(12.73);
    const [massCore, setMassCore] = useState(1600);
    const [tests, setTests] = useState([
        { containerNo: 'A', wetSoilContainer: 93.10, drySoilContainer: 82.00, container: 18.00, waterContent: 0, wetDensity: 0, dryDensity: 0 },
        { containerNo: 'B', wetSoilContainer: 92.50, drySoilContainer: 80.00, container: 14.00, waterContent: 0, wetDensity: 0, dryDensity: 0 },
        { containerNo: 'C', wetSoilContainer: 95.32, drySoilContainer: 83.00, container: 16.00, waterContent: 0, wetDensity: 0, dryDensity: 0 },
        { containerNo: 'D', wetSoilContainer: 90.20, drySoilContainer: 78.00, container: 15.00, waterContent: 0, wetDensity: 0, dryDensity: 0 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const volumeCore = (Math.PI / 4) * Math.pow(diameterCore, 2) * heightCore; // cm³
        const bulkDensity = massCore / volumeCore;

        const calculatedTests = tests.map((test, i) => {
            const wetWeight = test.wetSoilContainer - test.container;
            const dryWeight = test.drySoilContainer - test.container;
            const waterContent = dryWeight > 0 ? ((wetWeight - dryWeight) / dryWeight) * 100 : 0;
            const wetDensity = bulkDensity;
            const dryDensity = wetDensity / (1 + waterContent / 100);
            return {
                ...test,
                waterContent: waterContent.toFixed(2),
                wetDensity: wetDensity.toFixed(2),
                dryDensity: dryDensity.toFixed(2),
            };
        });

        const avgWaterContent = calculatedTests.reduce((sum, t) => sum + parseFloat(t.waterContent), 0) / calculatedTests.length;
        const avgDryDensity = calculatedTests.reduce((sum, t) => sum + parseFloat(t.dryDensity), 0) / calculatedTests.length;

        setResults({
            tests: calculatedTests,
            volumeCore: volumeCore.toFixed(2),
            bulkDensity: bulkDensity.toFixed(2),
            avgWaterContent: avgWaterContent.toFixed(2),
            avgDryDensity: avgDryDensity.toFixed(2),
        });
    };

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = field === 'containerNo' ? value : Number(value);
        setTests(newTests);
    };

    useEffect(() => { calculate(); }, [diameterCore, heightCore, massCore, tests]);
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
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">IN-SITU Density By Core Cutter Method <span className="text-sm font-normal text-gray-500">IS: 2720-29</span></h1>
                        <CalculatorActions
                            calculatorSlug="in-situ-density"
                            calculatorName="In-Situ Density Calculator"
                            calculatorIcon="fa-circle"
                            category="Soil Test"
                            inputs={{ diameterCore, heightCore, massCore, tests }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Determine field density of soil by core cutter method</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is IN-SITU Density By Core Cutter Method?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">The Core cutter method is a fast and economical method for determining the field dry unit weight of fine grained also free from coarse particles like Pebbles or Gravels. This test is simple and gives accurate results and hence the test is used very commonly. If the soil contain particles more than 20% it is nor advisable.</p>
                            <p className="text-gray-600 text-justify"><strong>Applications:</strong> Highway Construction, Embankment, Dam Construction, Sub-grade, Earthwork</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-flask ${theme.text} mr-2`}></i>Apparatus</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Core_Cutter.jpg/220px-Core_Cutter.jpg" alt="Core Cutter" className="w-full rounded-lg mb-2" />
                                    <p className="text-center text-sm text-gray-500">Fig: Plane Earth Core Cutter</p>
                                </div>
                                <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                    <li><strong>Cylindrical Core Cutter</strong> – 100 mm internal diameter, 130 mm Long</li>
                                    <li><strong>Steel Dolly</strong> – 100 mm internal diameter, 25 mm Height</li>
                                    <li><strong>Steel Rammer</strong> – Weight of 9 kg or 14 kg</li>
                                    <li><strong>Balance</strong> – Accuracy of 1 g</li>
                                    <li>Palette Knife/Spatula</li>
                                    <li>Straightedge</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-calculator ${theme.text} mr-2`}></i>Calculations</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg space-y-3 font-mono text-center">
                                <div>Volume of core cutter (V) = π/4 × D² × H cm³</div>
                                <div>Bulk Density (γ) = M/V g/cm³</div>
                                <div className={theme.text}>Water Content (w) = (W₂ - W₃)/(W₃ - W₁) × 100 %</div>
                                <div className={theme.text}>Dry Density (γd) = γ / (1 + w/100) g/cm³</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>M = mass of wet soil in core cutter (g)</li>
                                    <li>V = volume of core cutter (cm³)</li>
                                    <li>W₁ = mass of container (g)</li>
                                    <li>W₂ = mass of wet soil + container (g)</li>
                                    <li>W₃ = mass of dry soil + container (g)</li>
                                </ul>
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
                            <i className="fas fa-circle text-xl text-white"></i>
                            <h2 className="font-semibold text-sm text-white">IN-SITU DENSITY BY CORE CUTTER METHOD</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">D (cm)</label><input type="number" value={diameterCore} onChange={(e) => setDiameterCore(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">H (cm)</label><input type="number" step="0.01" value={heightCore} onChange={(e) => setHeightCore(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">Mass (g)</label><input type="number" value={massCore} onChange={(e) => setMassCore(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>

                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-xs">
                                    <thead><tr className="bg-gray-100"><th className="px-1 py-1">No.</th><th className="px-1 py-1">Wet+C</th><th className="px-1 py-1">Dry+C</th><th className="px-1 py-1">C</th></tr></thead>
                                    <tbody>
                                        {tests.map((test, i) => (
                                            <tr key={i}>
                                                <td className="px-1 py-1"><input type="text" value={test.containerNo} onChange={(e) => updateTest(i, 'containerNo', e.target.value)} className="w-8 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" step="0.01" value={test.wetSoilContainer} onChange={(e) => updateTest(i, 'wetSoilContainer', e.target.value)} className="w-14 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" step="0.01" value={test.drySoilContainer} onChange={(e) => updateTest(i, 'drySoilContainer', e.target.value)} className="w-14 px-1 py-0.5 border rounded text-xs" /></td>
                                                <td className="px-1 py-1"><input type="number" step="0.01" value={test.container} onChange={(e) => updateTest(i, 'container', e.target.value)} className="w-14 px-1 py-0.5 border rounded text-xs" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button onClick={calculate} className={`w-full ${theme.button} py-2 rounded-lg font-medium mb-4`}>Calculate</button>
                            <div className={`${theme.bgLight} rounded-xl p-4`}>
                                <div className="grid grid-cols-2 gap-3 text-center mb-3">
                                    <div>
                                        <div className="text-xs text-gray-500">Bulk Density</div>
                                        <div className={`text-lg font-bold ${theme.text}`}>{results?.bulkDensity}</div>
                                        <div className="text-xs text-gray-400">g/cm³</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Field Dry Density</div>
                                        <div className={`text-lg font-bold ${theme.text}`}>{results?.avgDryDensity}</div>
                                        <div className="text-xs text-gray-400">g/cm³</div>
                                    </div>
                                </div>
                                <div className="text-center mb-2">
                                    <div className="text-xs text-gray-500">Avg. Water Content</div>
                                    <div className={`text-lg font-bold ${theme.text}`}>{results?.avgWaterContent} %</div>
                                </div>
                                <div className="text-xs">
                                    {results?.tests?.map((t, i) => (
                                        <div key={i} className="flex justify-between bg-white px-2 py-1 rounded mb-1">
                                            <span>Test-{t.containerNo}</span>
                                            <span className={`font-bold ${theme.text}`}>γd={t.dryDensity} | w={t.waterContent}%</span>
                                        </div>
                                    ))}
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
