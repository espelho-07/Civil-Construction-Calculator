import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function PermeabilityFallingHeadCalculator() {
    const theme = getThemeClasses('amber');
    const [length, setLength] = useState(10);
    const [diameterMold, setDiameterMold] = useState(20);
    const [diameterPipe, setDiameterPipe] = useState(10);
    const [tests, setTests] = useState([
        { h1: 55, h2: 20, time: 55 },
        { h1: 30, h2: 40, time: 40 },
        { h1: 30, h2: 30, time: 40 },
    ]);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const areaMold = (Math.PI / 4) * Math.pow(diameterMold, 2);
        const areaPipe = (Math.PI / 4) * Math.pow(diameterPipe, 2);

        const calculatedTests = tests.map((test, i) => {
            // k = 2.303 × (aL/At) × log10(h1/h2)
            const k = 2.303 * (areaPipe * length) / (areaMold * test.time) * Math.log10(test.h1 / test.h2);
            return {
                ...test,
                permeability: k.toFixed(2),
            };
        });

        const avgPermeability = calculatedTests.reduce((sum, t) => sum + parseFloat(t.permeability), 0) / calculatedTests.length;

        setResults({
            tests: calculatedTests,
            avgPermeability: avgPermeability.toFixed(2),
            areaMold: areaMold.toFixed(2),
            areaPipe: areaPipe.toFixed(2),
        });
    };

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = Number(value);
        setTests(newTests);
    };

    useEffect(() => { calculate(); }, [length, diameterMold, diameterPipe, tests]);
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
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Permeability (Falling Head Test) Calculator <span className="text-sm font-normal text-gray-500">IS: 2720</span></h1>
                        <CalculatorActions
                            calculatorSlug="permeability-falling-head"
                            calculatorName="Permeability (Falling Head) Calculator"
                            calculatorIcon="fa-arrow-down"
                            category="Soil Test"
                            inputs={{ length, diameterMold, diameterPipe, tests }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate coefficient of permeability using falling head method</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is Falling Head permeability Test?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">The Falling Head Method is used for the measurement of the hydraulic conductivity of fine-grained soils by using the falling head liquid permeameter. A measured quantity of water is allowed to pass through a saturated soil sample under a falling head until equilibrium is achieved.</p>
                            <p className="text-gray-600 text-justify">This method relies on a difference in head to induce water flow through a soil sample, measuring the time required for a drop in head from h₁ to h₂.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-flask ${theme.text} mr-2`}></i>Apparatus</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ul className="list-disc pl-5 text-gray-600 space-y-2 text-justify">
                                <li>The permeameter mould (internal diameter) 10 cm; height 12.73 cm</li>
                                <li>Stand Pipe / Glass tubes of varying internal diameters</li>
                                <li>Constant Head Tank - A suitable means capable of supplying water to the permeant circuit</li>
                                <li>Vacuum Pump</li>
                                <li>Miscellaneous Apparatus - Such as G.I. moist ring pan, graduated cylinder, indian rocks, stop watch, G.l. tray, wire gauge, thermometer and a source of de-aired water</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-calculator ${theme.text} mr-2`}></i>Falling Head Test Calculations</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className={`font-mono text-lg ${theme.text}`}>Permeability Falling Head (K) = 2.303 × (aL / At) × log₁₀(h₁/h₂)</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>a = Area of tube</li>
                                    <li>L = Length of Specimen</li>
                                    <li>A = Area of Mold</li>
                                    <li>t = Time (The time in sec)</li>
                                    <li>h₁ = Initial head</li>
                                    <li>h₂ = Final head</li>
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
                            <i className="fas fa-arrow-down text-xl text-white"></i>
                            <h2 className="font-semibold text-sm text-white">PERMEABILITY (FALLING HEAD TEST)</h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div><label className="text-xs text-gray-500 mb-1 block">Length (L) cm</label><input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">D Mold (D) cm</label><input type="number" value={diameterMold} onChange={(e) => setDiameterMold(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                                <div><label className="text-xs text-gray-500 mb-1 block">D Pipe (d) cm</label><input type="number" value={diameterPipe} onChange={(e) => setDiameterPipe(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded-lg text-sm" /></div>
                            </div>

                            {tests.map((test, i) => (
                                <div key={i} className={`${theme.bgLight} p-2 rounded-lg mb-2`}>
                                    <div className="text-xs font-bold text-gray-700 mb-1">Test-{i + 1}</div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div><label className="text-gray-500">h₁ (cm)</label><input type="number" value={test.h1} onChange={(e) => updateTest(i, 'h1', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                        <div><label className="text-gray-500">h₂ (cm)</label><input type="number" value={test.h2} onChange={(e) => updateTest(i, 'h2', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                        <div><label className="text-gray-500">Time (s)</label><input type="number" value={test.time} onChange={(e) => updateTest(i, 'time', e.target.value)} className="w-full px-2 py-1 border rounded text-xs" /></div>
                                    </div>
                                </div>
                            ))}

                            <button onClick={calculate} className={`w-full ${theme.button} py-2 rounded-lg font-medium mb-4`}>Calculate</button>
                            <div className={`${theme.bgLight} rounded-xl p-4`}>
                                <div className="text-center mb-3">
                                    <div className="text-xs text-gray-500">Avg. Permeability</div>
                                    <div className={`text-2xl font-bold ${theme.text}`}>{results?.avgPermeability}</div>
                                    <div className="text-xs text-gray-500">Permeability (k)</div>
                                </div>
                                <div className="text-xs">
                                    {results?.tests?.map((t, i) => (
                                        <div key={i} className="flex justify-between bg-white px-2 py-1 rounded mb-1">
                                            <span>Test-{i + 1}</span>
                                            <span className={`font-bold ${theme.text}`}>{t.permeability}</span>
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
