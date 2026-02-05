import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { SOIL_TEST_NAV } from '../constants/calculatorRoutes';

export default function FreeSwellIndexCalculator() {
    const theme = getThemeClasses('amber');
    const [vd, setVd] = useState(110);
    const [vk, setVk] = useState(106);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const freeSwellIndex = ((vd - vk) / vk) * 100;
        setResults({
            freeSwellIndex: freeSwellIndex.toFixed(1),
            diff: (vd - vk).toFixed(0),
        });
    };

    useEffect(() => { calculate(); }, [vd, vk]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Determination of Free Swell Index of Soil <span className="text-sm font-normal text-gray-500">Calculate Free Swell Index of Soil</span></h1>
                        <CalculatorActions
                            calculatorSlug="free-swell-index"
                            calculatorName="Free Swell Index Calculator"
                            calculatorIcon="fa-expand-arrows-alt"
                            category="Soil Test"
                            inputs={{ vd, vk }}
                            outputs={results || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate free swell index to determine soil expansion potential</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is Free Swell Index of Soil?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify"><strong>Free swell</strong> is the increase in volume of a soil, without any external constraints, on submergence in water.</p>
                            <p className="text-gray-600 mb-4 text-justify">The possibility of damage to structures due to swelling of expensive clays need be identified, at the outset, by an investigation of those soils likely to possess undesirable expansion characteristics. Inferential testing is resorted to reflect the potential of the system to swell under different simulated conditions. Actual magnitude of swelling pressures developed depends upon the dry density, initial water content, surcharge loading and several other environmental factors.</p>
                            <h3 className="font-bold text-gray-800 mb-2">Why need to determine Free swell index of Soil?</h3>
                            <p className="text-gray-600 text-justify">Free swell index determination of soil helps to identify the potential of a soil to swell which might need further detailed investigation regarding swelling and swelling pressures under different field conditions.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-flask ${theme.text} mr-2`}></i>Apparatus</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                <li><strong>Sieve</strong> - 425-micron IS Sieve.</li>
                                <li><strong>Glass Graduated Cylinders</strong> - 100-ml capacity 2 Numbers (IS: 878 -1956)</li>
                                <li><strong>Glass rod</strong> for stirring</li>
                                <li><strong>Balance</strong> of capacity 500 grams and sensitivity 0.01 gram.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-clipboard-list ${theme.text} mr-2`}></i>Procedure to determine Free Swell Index of Soil</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-2 text-justify">
                                <li>Take two 10 g soil specimens of oven dry soil passing through 425 micron IS Sieve.</li>
                                <li>Each soil specimen shall be poured in each of the two glass graduated cylinders of 100 ml capacity.</li>
                                <li>One cylinder shall then be filled with kerosene oil and the other with distilled water up to the 100 ml mark. After removal of entrapped air (by gentle shaking or stirring with a glass rod), the soils in both the cylinders shall be allowed to settle. Sufficient time (not less than 24 h) shall be allowed for the soil sample to attain equilibrium state of volume without any further change in the volume of the soils.</li>
                                <li>The final volume of soils in each of the cylinders shall be read out.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-calculator ${theme.text} mr-2`}></i>How to Calculate Free swell Index of soil?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">The level of the soil in the kerosene graduated cylinder shall be read as the original volume of the soil sample & kerosene being a non-polar liquid does not cause swelling of the soil. The level of the soil in the distilled water cylinder shall be read as the free swell level.</p>
                            <h3 className="font-bold text-gray-800 mb-2">The free swell index of the soil shall be calculated as follows:</h3>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                <div className={`font-mono text-xl ${theme.text}`}>Free swell index = (V<sub>d</sub> - V<sub>k</sub>) / V<sub>k</sub> × 100 %</div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>V<sub>d</sub> is the volume of soil specimen read from the graduated cylinder containing distilled water</li>
                                    <li>V<sub>k</sub> is the volume of soil specimen read from the graduated cylinder containing kerosene</li>
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

                <aside ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="amber" />

                    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${theme.border}`}>
                        {/* Standardized Gradient Header */}
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <i className="fas fa-expand-arrows-alt text-white"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Free Swell Index</h3>
                                <p className="text-white/80 text-xs">Determination (Soil)</p>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block font-medium">Vol. in Distilled Water (Vd)</label><div className="flex gap-2"><input type="number" value={vd} onChange={(e) => setVd(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">cc</span></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block font-medium">Vol. in Kerosene (Vk)</label><div className="flex gap-2"><input type="number" value={vk} onChange={(e) => setVk(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">cc</span></div></div>

                            <button onClick={calculate} className={`w-full ${theme.button} py-2.5 rounded-lg font-medium mb-5 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30`}>Calculate Free Swell Index</button>

                            <div className={`${theme.bgLight} rounded-xl p-4 border ${theme.border}`}>
                                <div className="text-center mb-4">
                                    <div className={`text-4xl font-bold ${theme.text} mb-1`}>{results?.freeSwellIndex} %</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Free Swell Index</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-xs space-y-2 border border-amber-100 shadow-sm">
                                    <div className="flex justify-between text-gray-600"><span>Volume Diff.</span> <span>{results?.diff} cc</span></div>
                                    <div className="border-t border-gray-100 pt-2 font-mono text-center text-gray-500 mt-1 text-[10px]">FSI = (Vd - Vk) / Vk × 100</div>
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

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
