import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { SOIL_TEST_NAV } from '../constants/calculatorRoutes';

export default function SpecificGravityCalculator() {
    const theme = getThemeClasses('amber');
    const [m1, setM1] = useState(31.45);
    const [m2, setM2] = useState(39.9);
    const [m3, setM3] = useState(86.61);
    const [m4, setM4] = useState(81.41);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const numerator = m2 - m1;
        const denominator = (m4 - m1) - (m3 - m2);
        const specificGravity = numerator / denominator;
        setResults({
            specificGravity: specificGravity.toFixed(2),
            numerator: numerator.toFixed(2),
            denominator: denominator.toFixed(2),
        });
    };

    useEffect(() => { calculate(); }, [m1, m2, m3, m4]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Determination of Specific Gravity</h1>
                            <p className="text-[#6b7280]">Calculate specific gravity of soil particles</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="specific-gravity"
                            calculatorName="Specific Gravity Calculator"
                            calculatorIcon="fa-balance-scale-right"
                            category="Soil Engineering"
                            inputs={{ m1, m2, m3, m4 }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is the need of specific gravity determination of Soil?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">Specific gravity G is defined as the ratio of the weight of a given volume of soil solids to the weight of a equal volume of distilled water.</p>
                            <p className="text-gray-600 text-justify">It deals with the method of test for determination of specific gravity of soils which finds application in finding out the degree of saturation and unit weight of most soils. The unit weights are needed in pressure, settlement and stability problems in soil engineering.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-flask ${theme.text} mr-2`}></i>Apparatus</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                <li><strong>Two density bottles</strong> (Pycnometer) of approximately 50 ml capacity with stoppers.</li>
                                <li>A <strong>water-bath</strong> maintained at a constant temperature to within ± 0.20C (if standard density bottles are used, this constant temperature is 27°C.)</li>
                                <li>A <strong>vacuum desiccator</strong> (a convenient size is one about 200 mm to 250 mm in diameter)</li>
                                <li>A <strong>desiccator</strong> (a convenient size is one about 200 mm to 250 mm in diameter) containing anhydrous silica gel</li>
                                <li>A <strong>thermostatically controlled drying oven</strong>, capable of maintaining a temperature of 105 to 110°C.</li>
                                <li>A <strong>balance</strong> readable and accurate to 0.001 g</li>
                                <li>A <strong>source</strong> of vacuum, such as a good filter pump or a vacuum pump.</li>
                                <li>A <strong>spatula</strong> (a convenient size is one having a blade 150 mm long and 3 mm wide, the blade has to be small enough to go through the neck of the density bottle), or piece of glass rod about 150 mm long and 3 mm diameter.</li>
                                <li>A <strong>wash bottle</strong>, preferably made of plastics, containing air-free distilled water.</li>
                                <li>A <strong>sample divider</strong> of the multiple slot type (riffle box) with 7 mm width of opening</li>
                                <li>A length of <strong>rubber tubing</strong> to fit the vacuum pump and the desiccator</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-clipboard-list ${theme.text} mr-2`}></i>How to determine the Specific Gravity of Soil?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <h3 className="font-bold text-gray-800 mb-2">Procedures</h3>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                <li>The complete density bottle with stopper shall be dried at 105 to 110°C, cooled in the desiccator and weighed to the nearest 0.001 g (m1)</li>
                                <li>The 50 g sample obtained as described in the procedure for the preparation of disturbed samples for testing shall, if necessary, be ground to pass a 2-mm IS test sieve.</li>
                                <li>A 5 to 10 g subsample shall be obtained by riffling, and oven-dried at 105 to 1100 C.</li>
                                <li>This sample shall be transferred to the density bottle direct from the desiccator in which it has been cooled.</li>
                                <li>The bottle and contents together with the stopper shall be weighed to the nearest 0.001 g (m2)</li>
                                <li>The stoppered bottle shall then be taken out of the bath, wiped dry and the whole weighed to the nearest 0.001 g (m3)</li>
                                <li>The bottle shall then be taken out of the bath, wiped dry and the whole weighed to the nearest 0.001 g (m3)</li>
                                <li>Two determinations of the specific gravity of the same soils sample shall be made.</li>
                            </ol>
                            <h3 className="font-bold text-gray-800 mt-4 mb-2">The specific gravity of soil shall be calculated as follows:</h3>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className="font-mono text-lg">G = (Density of water at 27°C) / (Weight of soil of equal volume)</div>
                                <div className={`font-mono text-xl ${theme.text} mt-2`}>G = (M₂ - M₁) / ((M₄ - M₁) - (M₃ - M₂))</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>G is Specific Gravity</li>
                                    <li>M₁ is mass of density bottle in gram</li>
                                    <li>M₂ is mass of bottle and dry soil in gram</li>
                                    <li>M₃ is mass of bottle, soil and liquid in gram</li>
                                    <li>M₄ is mass of bottle when full of liquid only in gram</li>
                                </ul>
                            </div>
                            <div className={`${theme.bgLight} border ${theme.border} p-3 rounded-lg text-sm mt-4`}>
                                <strong>Note:</strong> The specific gravity of the soil particles lie with in the range of 2.65 to 2.85. Soils containing organic matter and porous particles may have specific gravity values below 2.0. Soils having heavy substances may have values above 3.0.
                            </div>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="amber" />

                    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${theme.border}`}>
                        {/* Standardized Gradient Header */}
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <i className="fas fa-balance-scale-right text-white"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Specific Gravity</h3>
                                <p className="text-white/80 text-xs">Determination (Pycnometer)</p>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Density Bottle (M₁)</label><div className="flex gap-2"><input type="number" step="0.01" value={m1} onChange={(e) => setM1(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Bottle & Dry Soil (M₂)</label><div className="flex gap-2"><input type="number" step="0.01" value={m2} onChange={(e) => setM2(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Bottle, Soil & Liquid (M₃)</label><div className="flex gap-2"><input type="number" step="0.01" value={m3} onChange={(e) => setM3(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Bottle + Liquid (M₄)</label><div className="flex gap-2"><input type="number" step="0.01" value={m4} onChange={(e) => setM4(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>

                            <button onClick={calculate} className={`w-full ${theme.button} py-2.5 rounded-lg font-medium mb-5 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30`}>Calculate Specific Gravity</button>

                            <div className={`${theme.bgLight} rounded-xl p-4 border ${theme.border}`}>
                                <div className="text-center mb-4">
                                    <div className={`text-4xl font-bold ${theme.text} mb-1`}>{results?.specificGravity}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Specific Gravity (G)</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-xs space-y-2 border border-amber-100 shadow-sm">
                                    <div className="flex justify-between text-gray-600"><span>Mass of Soil</span> <span>{results?.numerator} g</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Vol. of Water Displaced</span> <span>{results?.denominator} g</span></div>
                                    <div className="border-t border-gray-100 pt-2 font-mono text-center text-gray-500 mt-1 text-[10px]">G = (M₂ - M₁) / ((M₄ - M₁) - (M₃ - M₂))</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Quick Nav */}
                    <CategoryQuickNav
                        items={SOIL_TEST_NAV}
                        title="Soil Test Calculators"
                        themeName="amber"
                    />
                </aside>
            </div>
        </main>
    );
}
