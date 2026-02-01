import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

// Info Tooltip Component
function InfoTooltip({ text, theme }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block">
            <button
                type="button"
                className={`w-4 h-4 ${theme?.bg || 'bg-gray-600'} text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1`}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
            >
                i
            </button>
            {show && (
                <div className={`absolute left-6 top-0 z-50 w-56 p-3 bg-white border ${theme?.border || 'border-gray-200'} rounded-lg shadow-lg text-xs text-[#0A0A0A] leading-relaxed text-justify`}>
                    {text}
                </div>
            )}
        </div>
    );
}

export default function AggregateWaterAbsorptionCalculator() {
    const theme = getThemeClasses('gray');
    const [dryWeight, setDryWeight] = useState('');
    const [saturatedWeight, setSaturatedWeight] = useState('');
    const [result, setResult] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        // Water Absorption % = (Ws - Wd) / Wd × 100
        const Wd = parseFloat(dryWeight) || 0;
        const Ws = parseFloat(saturatedWeight) || 0;

        if (Wd > 0 && Ws > 0) {
            const absorption = ((Ws - Wd) / Wd) * 100;
            setResult(absorption.toFixed(2));
        } else {
            setResult(null);
        }
    }, [dryWeight, saturatedWeight]);

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

    const reset = () => {
        setDryWeight('');
        setSaturatedWeight('');
        setResult(null);
    };

    const getStatus = () => {
        if (!result) return null;
        const val = parseFloat(result);
        if (val <= 2) return { text: 'Water Absorption value is less than 2%', sub: 'Material is suited for construction', color: 'bg-green-100 text-green-700 border-green-300' };
        return { text: 'Water Absorption value is more than 2%', sub: 'Soundness test is required', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    };

    const status = getStatus();

    const relatedCalculators = [
        { name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', slug: '/sieve-analysis' },
        { name: 'Blending of Aggregates', icon: 'fa-blender', slug: '/blending-aggregates' },
        { name: 'Aggregate Impact Value', icon: 'fa-hammer', slug: '/aggregate-impact-value' },
        { name: 'Aggregate Crushing Value', icon: 'fa-compress-alt', slug: '/aggregate-crushing-value' },
        { name: 'Aggregate Abrasion Value', icon: 'fa-cogs', slug: '/aggregate-abrasion-value' },
        { name: 'Aggregate Water Absorption', icon: 'fa-tint', slug: '/aggregate-water-absorption', active: true },
    ];

    const maxAbsorptionTable = [
        { type: 'Granular Sub Base (GSB)', max: '2%' },
        { type: 'Base course W.B.M (Water Bound Macadam)', max: '2%' },
        { type: 'Base course W.M.M. (Wet Mix Macadam)', max: '2%' },
        { type: 'Base course Crusher Run Macadam', max: '2%' },
        { type: 'Base course / Binder course B.M. (Bituminous Macadam)', max: '2%' },
        { type: 'Base course / Binder course D.B.M. (Dense Bituminous Macadam)', max: '2%' },
        { type: 'Surface course / Wearing course S.D.B.C. (Semi Dense Bituminous Concrete)', max: '2%' },
        { type: 'Surface course / Wearing course B.C. (Bituminous Concrete)', max: '2%' },
        { type: 'Cement Concrete Pavement (Wearing Surface)', max: '2%' },
        { type: 'Cement Concrete Pavement (Other than Wearing Surface)', max: '2%' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="concrete-technology" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Aggregate Water Absorption Test</h1>
                        <CalculatorActions
                            calculatorSlug="aggregate-water-absorption"
                            calculatorName="Aggregate Water Absorption Calculator"
                            calculatorIcon="fa-tint"
                            category="Concrete Technology"
                            inputs={{ dryWeight, saturatedWeight }}
                            outputs={{ result: result || '' }}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">IS:2386 (Part III) - Determine water absorption of aggregates</p>

                    {/* Calculator */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`bg-gradient-to-r ${theme.gradient} px-5 py-4`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-tint text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">DETERMINE AGGREGATE WATER ABSORPTION</h3>
                                        <p className="text-white/80 text-xs">Enter dry and saturated weights</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="flex items-center text-sm text-[#0A0A0A] mb-2">
                                                Dry weight of aggregate (W<sub>d</sub>)
                                                <InfoTooltip text="Weight of oven-dried aggregate in gm" theme={theme} />
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={dryWeight}
                                                    onChange={(e) => setDryWeight(e.target.value)}
                                                    placeholder="Enter weight"
                                                    className={`w-full px-4 py-3 pr-12 ${theme.border} border rounded-lg outline-none ${theme.focus} text-sm`}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">gm</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm text-[#0A0A0A] mb-2">
                                                Weight of aggregate immersed in water (W<sub>s</sub>)
                                                <InfoTooltip text="Weight of saturated surface-dry aggregate in gm" theme={theme} />
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={saturatedWeight}
                                                    onChange={(e) => setSaturatedWeight(e.target.value)}
                                                    placeholder="Enter weight"
                                                    className={`w-full px-4 py-3 pr-12 ${theme.border} border rounded-lg outline-none ${theme.focus} text-sm`}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">gm</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => { }}
                                                className={`flex-1 py-3 ${theme.button} text-white rounded-lg text-sm font-medium transition-colors`}
                                            >
                                                Calculate
                                            </button>
                                            <button
                                                onClick={reset}
                                                className="px-4 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>

                                    {/* Results */}
                                    <div className="bg-[#f8f9fa] rounded-xl p-5">
                                        <div className="text-center mb-4">
                                            <div className={`text-5xl font-bold ${theme.text}`}>{result || '0'} %</div>
                                            <div className="text-sm text-[#6b7280] mt-1">Water Absorption %</div>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 text-xs space-y-1 mb-4">
                                            <div className="text-[#6b7280]">Aggregate Water Absorption</div>
                                            <div className="font-mono">
                                                Aggregate Water Absorption = <sup>W<sub>s</sub> - W<sub>d</sub></sup>/<sub>W<sub>d</sub></sub> × 100
                                            </div>
                                            {result && (
                                                <>
                                                    <div className="font-mono text-[#6b7280]">
                                                        = <sup>{saturatedWeight} - {dryWeight}</sup>/<sub>{dryWeight}</sub> × 100
                                                    </div>
                                                    <div className={`font-mono font-bold ${theme.text}`}>
                                                        Aggregate Water Absorption = {result} %
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {status && (
                                            <div className={`rounded-lg p-3 border ${status.color}`}>
                                                <div className="font-medium text-sm">{status.text}</div>
                                                <div className="text-xs mt-1">{status.sub}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Water Absorption? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Aggregate Water Absorption Test?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                Water absorption gives an idea of strength of aggregate. Aggregates having more water absorption are more porous in nature and are generally considered unsuitable unless they are found to be acceptable based on strength, impact and hardness tests.
                            </p>
                        </div>
                    </section>

                    {/* Apparatus */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-tools ${theme.text}`}></i>
                            Apparatus
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-[#0A0A0A]">
                                <li><strong>Balance</strong> – A balance of capacity not less than 3 kg, readable and accurate to 0.5 g and of such a type and shape as to permit the basket containing the sample to be suspended from the beam and weighed in water.</li>
                                <li><strong>Oven</strong> – A well ventilated oven thermostatically controlled to maintain a temperature of 100 to 110°C.</li>
                                <li><strong>Wire basket</strong> or not more than 6.3 mm mesh or a perforated container of convenient size, preferably chromium plated and polished, with wire hangers not thicker than the wire mesh for suspending it from the balance.</li>
                                <li>A stout watertight container in which the basket may be freely suspended.</li>
                                <li>Two dry soft absorbent cloths each not less than 75 × 45 cm.</li>
                                <li>A shallow tray of area not less than 650 cm².</li>
                                <li>An airtight container of capacity similar to that of the basket.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Procedure */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-list-ol ${theme.text}`}></i>
                            Procedure
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                The sample shall be thoroughly washed to remove finer particles and dust, drained and then placed in the wire basket and immersed in distilled water at a temperature between 22°C and 32°C with a cover of at least 5 cm of water above the top of the basket.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                Immediately after immersion the entrapped air shall be removed from the sample by lifting the basket containing it 25 mm above the base of the tank and allowing it to drop 25 times at the rate of about one drop per second. The basket and aggregate shall remain completely immersed during the operation and for a period of 24 ± 1/2 hours afterwards.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                The basket and the sample shall then be jolted and weighed in water at a temperature of 22° to 32°C. If it is necessary for them to be transferred to a different tank for weighing, they shall be jolted 25 times as described above in the new tank before weighing.
                            </p>
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Formula
                        </h2>
                        <div className={`bg-gradient-to-r ${theme.bgSoft} to-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className={`${theme.text}`}>Water absorption (% of dry weight)</span> = <sup>W<sub>s</sub> - W<sub>d</sub></sup>/<sub>W<sub>d</sub></sub> × 100 %
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>W<sub>d</sub> = Dry weight of aggregate (The weight in g of oven-dried aggregate in air)</p>
                                <p>W<sub>s</sub> = Weight of aggregate immersed in water (The weight in g of the saturated surface-dry aggregate in air)</p>
                            </div>
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                                <strong>Note:</strong> Water absorption shall not be more than 2% per unit by weight. In case water absorption is higher than 2%, then soundness test is required.
                            </div>
                        </div>
                    </section>

                    {/* Specifications Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Specifications: Water Absorption Values
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-sm text-[#6b7280] mb-4">Maximum Permissible Water absorption % for the different types of pavements</p>
                            <div className="overflow-x-auto">
                                <table className={`w-full text-sm border ${theme.border}`}>
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className={`border ${theme.border} px-4 py-2 text-left`}>Sr.</th>
                                            <th className={`border ${theme.border} px-4 py-2 text-left`}>Type of Pavements</th>
                                            <th className={`border ${theme.border} px-4 py-2 text-center`}>Maximum Water absorption %<br />(IRC Recommendations)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maxAbsorptionTable.map((row, i) => (
                                            <tr key={i}>
                                                <td className={`border ${theme.border} px-4 py-2`}>{i + 1}</td>
                                                <td className={`border ${theme.border} px-4 py-2`}>{row.type}</td>
                                                <td className={`border ${theme.border} px-4 py-2 text-center font-medium`}>{row.max}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Ad Slot - Inline */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    {/* Result Card */}
                    {result && (
                        <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} overflow-hidden mb-4`}>
                            <div className={`bg-gradient-to-r ${theme.gradient} px-5 py-4`}>
                                <h3 className="font-bold text-white text-sm">Water Absorption Result</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className={`text-4xl font-bold ${theme.text}`}>{result} %</div>
                                <div className="text-sm text-[#6b7280] mt-1">Water Absorption</div>
                                {status && (
                                    <div className={`mt-3 text-xs px-3 py-1 rounded-full inline-block ${parseFloat(result) <= 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {parseFloat(result) <= 2 ? 'Suitable' : 'Soundness test required'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Related Calculators */}
                    <div className={`bg-white rounded-xl p-4 border ${theme.border}`}>
                        <h4 className="font-semibold text-[#0A0A0A] text-sm mb-3 flex items-center gap-2">
                            <span className="text-gray-600">Concrete Technology</span>
                            <span className={`text-xs ${theme.text} ${theme.bgSoft} px-2 py-0.5 rounded`}>Calculators</span>
                        </h4>
                        <div className="space-y-2">
                            {relatedCalculators.map((calc) => (
                                <Link
                                    key={calc.name}
                                    to={calc.slug}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? `${theme.bgSoft} ${theme.text} font-medium` : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
                                >
                                    <i className={`fas ${calc.icon}`}></i>
                                    {calc.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
