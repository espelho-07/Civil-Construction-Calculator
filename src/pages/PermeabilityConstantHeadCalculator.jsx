import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function PermeabilityConstantHeadCalculator() {
    const theme = getThemeClasses('soil-test');
    const [crossSection, setcrossSection] = useState(100);
    const [length, setLength] = useState(12);
    const [tests, setTests] = useState([
        { dischargeMl: 76.07, time: 60, head: 70 },
        { dischargeMl: 59.33, time: 55, head: 65 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const calculatedTests = tests.map((test, i) => {
            const dischargeCm3 = test.dischargeMl; // ml = cm³
            // k = QL / (Aht) where Q in cm³, L in cm, A in cm², h in cm, t in sec
            const k = (dischargeCm3 * length) / (crossSection * test.head * test.time);
            return {
                ...test,
                permeability: k.toFixed(4),
            };
        });

        const avgPermeability = calculatedTests.reduce((sum, t) => sum + parseFloat(t.permeability), 0) / calculatedTests.length;

        setResults({
            tests: calculatedTests,
            avgPermeability: avgPermeability.toFixed(4),
        });
    };

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = Number(value);
        setTests(newTests);
    };

    useEffect(() => { calculate(); }, [crossSection, length, tests]);
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
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Permeability (Constant Head Test) Calculator <span className="text-sm font-normal text-gray-500">IS: 2720</span></h1>
                        <CalculatorActions
                            calculatorSlug="permeability-constant-head"
                            calculatorName="Permeability (Constant Head) Calculator"
                            calculatorIcon="fa-arrows-alt-h"
                            category="Soil Test"
                            inputs={{ crossSection, length, tests }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate coefficient of permeability using constant head method</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is Constant Head permeability Test?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4">The Constant-Head Permeability Test is used to find the permeability or hydraulic conductivity of relatively coarse-grained soils (sands and gravels). A constant head of water is maintained across the soil sample and the quantity of water flowing through the sample is measured over a period of time.</p>
                            <p className="text-gray-600">The test is performed by maintaining a constant head and measuring the quantity of water that passes through an undisturbed soil sample in a given length of time.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-clipboard-list ${theme.text} mr-2`}></i>Procedure</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li>The mould is fixed in the base and saturated by filling with water from the bottom.</li>
                                <li>Appropriate constant head is applied at the inlet.</li>
                                <li>Water is collected at the outlet and volume is measured.</li>
                                <li>Time taken for collecting the volume is recorded.</li>
                                <li>Temperature of water is also recorded.</li>
                                <li>The test is repeated for different heads.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-calculator ${theme.text} mr-2`}></i>Constant Head Test Calculations</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className={`font-mono text-lg ${theme.text}`}>Permeability Constant Head (K) = QL / (Aht)</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>Q = Quantity of water collected (cm³ or ml)</li>
                                    <li>L = Length of Specimen (cm)</li>
                                    <li>A = Cross-sectional area of specimen (cm²)</li>
                                    <li>h = Constant head of water (cm)</li>
                                    <li>t = Time of collection (seconds)</li>
                                </ul>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm mt-4">
                                <strong>Note:</strong> To present the results at temperature 27°C, if are reported as an index with units cm/s. The data of a sample is also expressed in terms of water content, void ratio and degree of saturation.
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
                        <div className={`px-5 py-4 border-b bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                            <i className="fas fa-arrows-alt-h text-xl text-white"></i>
                            <h2 className="font-semibold text-sm text-white">PERMEABILITY (CONSTANT HEAD TEST)</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">Cross Section (A) cm²</label><input type="number" value={crossSection} onChange={(e) => setcrossSection(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">Length (L) cm</label><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>

                            {tests.map((test, i) => (
                                <div key={i} className="bg-gray-50 p-2 rounded-lg mb-2">
                                    <div className="text-xs font-bold text-gray-700 mb-1">Test-{i + 1}</div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div><label className="text-gray-500">Q (ml)</label><input type="number" step="0.01" value={test.dischargeMl} onChange={(e) => updateTest(i, 'dischargeMl', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                        <div><label className="text-gray-500">Time (s)</label><input type="number" value={test.time} onChange={(e) => updateTest(i, 'time', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                        <div><label className="text-gray-500">Head (cm)</label><input type="number" value={test.head} onChange={(e) => updateTest(i, 'head', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                    </div>
                                </div>
                            ))}

                            <button onClick={calculate} className={`w-full ${theme.button} py-2 rounded-lg font-medium mb-4`}>Calculate</button>
                            <div className={`${theme.bgLight} rounded-xl p-4`}>
                                <div className="text-center mb-3">
                                    <div className="text-xs text-gray-500">Avg. Permeability</div>
                                    <div className={`text-2xl font-bold ${theme.text}`}>{results?.avgPermeability}</div>
                                    <div className="text-xs text-gray-500">cm/sec</div>
                                </div>
                                <div className="text-xs">
                                    {results?.tests?.map((t, i) => (
                                        <div key={i} className="flex justify-between bg-white px-2 py-1 rounded mb-1">
                                            <span>Test-{i + 1} (Q={t.dischargeMl}ml)</span>
                                            <span className={`font-bold ${theme.text}`}>{t.permeability} cm/s</span>
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
