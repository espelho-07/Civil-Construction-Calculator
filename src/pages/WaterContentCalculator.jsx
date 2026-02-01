import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function WaterContentCalculator() {
    const theme = getThemeClasses('amber');
    const [w1, setW1] = useState(30);
    const [w2, setW2] = useState(50);
    const [w3, setW3] = useState(45);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const waterContent = ((w2 - w3) / (w3 - w1)) * 100;
        setResults({
            waterContent: waterContent.toFixed(2),
            w2MinusW3: (w2 - w3).toFixed(2),
            w3MinusW1: (w3 - w1).toFixed(2),
        });
    };

    useEffect(() => { calculate(); }, [w1, w2, w3]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const specimenTable = [
        { sr: 1, sieve: '425-μm IS Sieve', qty: '25 g' },
        { sr: 2, sieve: '2-mm IS Sieve', qty: '50 g' },
        { sr: 3, sieve: '4.75-mm IS Sieve', qty: '200 g' },
        { sr: 4, sieve: '9.5-mm IS Sieve', qty: '300 g' },
        { sr: 5, sieve: '19-mm IS Sieve', qty: '500 g' },
        { sr: 6, sieve: '37.5-mm IS Sieve', qty: '1000 g' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Determination of water content for soil</h1>
                            <p className="text-[#6b7280]">Calculate water content (moisture) of soil</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="water-content"
                            calculatorName="Water Content Calculator"
                            calculatorIcon="fa-tint"
                            category="Soil Engineering"
                            inputs={{ w1, w2, w3 }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is the need of water content determination (determination of moisture) of Soil?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 italic text-justify">In almost all soil tests natural moisture content of the soil is to be determined. The knowledge of the natural moisture content is essential in all studies of soil mechanics. To sight a few, natural moisture content is used in determining the index properties of the Soil. The natural moisture content will give an idea of the state of soil in the field.</p>
                            <h3 className="font-bold text-gray-800 mb-2">Apparatus</h3>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-1">
                                <li><strong>Container:</strong> Any suitable non-corrodible airtight container</li>
                                <li><strong>Balance:</strong> of sufficient sensitivity to weigh the soil samples to an accuracy of 0.04 percent of the weight of the soil taken for the test</li>
                                <li><strong>Oven:</strong> thermostatically controlled, with interior of non-corroding material to maintain the temperature at 110 ± 5°C.</li>
                                <li><strong>Desiccator:</strong> A desiccator with any suitable desiccating agent</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-vial ${theme.text} mr-2`}></i>Soil Specimen</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">The soil specimen taken shall be representative of the soil mass. The size of the specimen selected depends on the quantity required for good representation, which is influenced by the gradation and the maximum size of particles, and on the accuracy of weighing.</p>
                            <h3 className="font-bold text-gray-800 mb-2">Recommended quantities for general laboratory use:</h3>
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-100"><th className="border px-3 py-2 text-left">Sr.</th><th className="border px-3 py-2 text-left">Size of Particles More Than 90 Percent Passing</th><th className="border px-3 py-2 text-left">Minimum Quantity of Soil Specimen to be Taken for Test, Mass in g</th></tr></thead>
                                <tbody>{specimenTable.map(row => <tr key={row.sr}><td className="border px-3 py-2">{row.sr}</td><td className="border px-3 py-2">{row.sieve}</td><td className="border px-3 py-2">{row.qty}</td></tr>)}</tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-clipboard-list ${theme.text} mr-2`}></i>How to determine the water content (moisture) of Soil?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <h3 className="font-bold text-gray-800 mb-2">Procedure</h3>
                            <p className="text-gray-600 mb-4 text-justify">Clean the container with lid, dry and weigh (W₁). Take the required quantity of the soil specimen in the container crumbled and placed loosely, and weigh with lid (W₂). Then keep it in an oven with the lid removed, and maintain the temperature of the oven at 110 ± 5°C (see Note). Dry the specimen in the oven for 24 h. Every time the container is taken out for weighing, replace the lid on the container and cool the container in a desiccator. Record the final mass (W₃) of the container with lid with dried soil sample.</p>
                            <div className={`${theme.bgLight} border ${theme.border} p-3 rounded-lg text-sm mb-4`}>
                                <strong>Note:</strong> Oven-drying at 110 ± 5°C does not result in reliable water content values for soil containing gypsum or other minerals having loosely bound water of hydration or for soil containing significant amounts of organic material. Reliable water content values for these soils can be obtained by drying in an oven at approximately 60 to 80°C.
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">The percent of water content shall be calculated as follows:</h3>
                            <div className={`bg-[#f8f9fa] p-4 rounded-lg font-mono text-center text-lg ${theme.text}`}>
                                w = (W₂ - W₃) / (W₃ - W₁) × 100
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Where,</strong></p>
                                <ul className="list-disc pl-5">
                                    <li>w is Water Content Percent</li>
                                    <li>W₁ is mass of container (bowl) in gram</li>
                                    <li>W₂ is mass of container (bowl) with wet soil in gram</li>
                                    <li>W₃ is mass of container (bowl) with dry soil in gram</li>
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
                        {/* Standardized Gradient Header */}
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <i className="fas fa-tint text-white"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Water Content</h3>
                                <p className="text-white/80 text-xs">Determination</p>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Container (W₁)</label><div className="flex gap-2"><input type="number" value={w1} onChange={(e) => setW1(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Container + Wet Soil (W₂)</label><div className="flex gap-2"><input type="number" value={w2} onChange={(e) => setW2(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block font-medium">Mass of Container + Dry Soil (W₃)</label><div className="flex gap-2"><input type="number" value={w3} onChange={(e) => setW3(Number(e.target.value))} className={`flex-1 px-3 py-2 border ${theme.border} rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20`} /><span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">g</span></div></div>

                            <button onClick={calculate} className={`w-full ${theme.button} py-2.5 rounded-lg font-medium mb-5 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30`}>Calculate Water Content</button>

                            <div className={`${theme.bgLight} rounded-xl p-4 border ${theme.border}`}>
                                <div className="text-center mb-4">
                                    <div className={`text-4xl font-bold ${theme.text} mb-1`}>{results?.waterContent} %</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Moisture Content</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-xs space-y-2 border border-amber-100 shadow-sm">
                                    <div className="flex justify-between text-gray-600"><span>Net Water</span> <span>{results?.w2MinusW3} g</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Dry Soil</span> <span>{results?.w3MinusW1} g</span></div>
                                    <div className="border-t border-gray-100 pt-2 font-mono text-center text-gray-500 mt-1">w = ({results?.w2MinusW3} / {results?.w3MinusW1}) × 100</div>
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
