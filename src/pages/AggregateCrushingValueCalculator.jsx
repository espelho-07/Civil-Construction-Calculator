import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

// Info Tooltip Component
function InfoTooltip({ text }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block">
            <button
                type="button"
                className="w-4 h-4 bg-[#3B68FC] text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
            >
                i
            </button>
            {show && (
                <div className="absolute left-6 top-0 z-50 w-56 p-3 bg-white border border-[#e5e7eb] rounded-lg shadow-lg text-xs text-[#0A0A0A] leading-relaxed">
                    {text}
                </div>
            )}
        </div>
    );
}

export default function AggregateCrushingValueCalculator() {
    // Test I and Test II
    const [test1, setTest1] = useState({ originalWt: '', passingWt: '', retainedWt: '' });
    const [test2, setTest2] = useState({ originalWt: '', passingWt: '', retainedWt: '' });
    const [result1, setResult1] = useState(null);
    const [result2, setResult2] = useState(null);
    const [meanResult, setMeanResult] = useState(null);
    const sidebarRef = useRef(null);

    // Calculate Crushing Value = (W2 / W1) × 100
    useEffect(() => {
        const W1_1 = parseFloat(test1.originalWt) || 0;
        const W2_1 = parseFloat(test1.passingWt) || 0;

        if (W1_1 > 0 && W2_1 > 0) {
            const cv1 = (W2_1 / W1_1) * 100;
            setResult1(cv1.toFixed(1));
        } else {
            setResult1(null);
        }

        const W1_2 = parseFloat(test2.originalWt) || 0;
        const W2_2 = parseFloat(test2.passingWt) || 0;

        if (W1_2 > 0 && W2_2 > 0) {
            const cv2 = (W2_2 / W1_2) * 100;
            setResult2(cv2.toFixed(1));
        } else {
            setResult2(null);
        }
    }, [test1, test2]);

    useEffect(() => {
        if (result1 && result2) {
            const mean = (parseFloat(result1) + parseFloat(result2)) / 2;
            setMeanResult(mean.toFixed(1));
        } else if (result1) {
            setMeanResult(result1);
        } else if (result2) {
            setMeanResult(result2);
        } else {
            setMeanResult(null);
        }
    }, [result1, result2]);

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
        setTest1({ originalWt: '', passingWt: '', retainedWt: '' });
        setTest2({ originalWt: '', passingWt: '', retainedWt: '' });
    };

    const relatedCalculators = [
        { name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', slug: '/sieve-analysis' },
        { name: 'Blending of Aggregates', icon: 'fa-blender', slug: '/blending-aggregates' },
        { name: 'Aggregate Impact Value', icon: 'fa-hammer', slug: '/aggregate-impact-value' },
        { name: 'Aggregate Crushing Value', icon: 'fa-compress-alt', slug: '/aggregate-crushing-value', active: true },
        { name: 'Aggregate Abrasion Value', icon: 'fa-cogs', slug: '/aggregate-abrasion-value' },
        { name: 'Aggregate Water Absorption', icon: 'fa-tint', slug: '/aggregate-water-absorption' },
    ];

    const recommendedValues = [
        { desc: 'Sub-base course', max: '45%' },
        { desc: 'Sub-base course', max: '40%' },
        { desc: 'Bituminous base course / Water bound macadam', max: '35%' },
    ];

    const sieveTable = [
        { passing: '12.5 mm', retained: '10 mm', approxWt: '2.50 kg' },
        { passing: '10 mm', retained: '6.3 mm', approxWt: '1.00 kg' },
        { passing: '6.3 mm', retained: '3.35 mm', approxWt: '0.40 kg' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="concrete-technology" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Aggregate Crushing Value</h1>
                    <p className="text-[#6b7280] mb-6">IS:2386 (Part IV) - 1963</p>

                    {/* Calculator */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-compress-alt text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">DETERMINE AGGREGATE CRUSHING VALUE</h3>
                                        <p className="text-orange-100 text-xs">Enter weights for Test-I and Test-II</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {/* Input Table */}
                                <div className="overflow-x-auto mb-6">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-[#f8f9fa]">
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-left">Parameter</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center" colSpan={2}>Test I</th>
                                                <th className="border border-[#e5e7eb] px-4 py-2 text-center" colSpan={2}>Test II</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-[#e5e7eb] px-4 py-2">
                                                    <div className="flex items-center">
                                                        Original wt of the Sample (W<sub>1</sub>)
                                                        <InfoTooltip text="Weight of oven-dried sample before test in grams" />
                                                    </div>
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={test1.originalWt}
                                                        onChange={(e) => setTest1({ ...test1, originalWt: e.target.value })}
                                                        placeholder="gm"
                                                        className="w-full px-2 py-2 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1 text-center text-xs text-[#6b7280]">gm</td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={test2.originalWt}
                                                        onChange={(e) => setTest2({ ...test2, originalWt: e.target.value })}
                                                        placeholder="gm"
                                                        className="w-full px-2 py-2 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1 text-center text-xs text-[#6b7280]">gm</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-[#e5e7eb] px-4 py-2">
                                                    <div className="flex items-center">
                                                        Weight of the Sample passing 2.36 mm Sieve (W<sub>2</sub>)
                                                        <InfoTooltip text="Weight of material passing 2.36mm sieve after test" />
                                                    </div>
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={test1.passingWt}
                                                        onChange={(e) => setTest1({ ...test1, passingWt: e.target.value })}
                                                        placeholder="gm"
                                                        className="w-full px-2 py-2 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1 text-center text-xs text-[#6b7280]">gm</td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={test2.passingWt}
                                                        onChange={(e) => setTest2({ ...test2, passingWt: e.target.value })}
                                                        placeholder="gm"
                                                        className="w-full px-2 py-2 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1 text-center text-xs text-[#6b7280]">gm</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-[#e5e7eb] px-4 py-2">
                                                    <div className="flex items-center">
                                                        Weight of the Sample retained 2.36 mm Sieve (W<sub>3</sub>)
                                                        <InfoTooltip text="Weight of material retained on 2.36mm sieve after test" />
                                                    </div>
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={test1.retainedWt}
                                                        onChange={(e) => setTest1({ ...test1, retainedWt: e.target.value })}
                                                        placeholder="gm"
                                                        className="w-full px-2 py-2 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1 text-center text-xs text-[#6b7280]">gm</td>
                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={test2.retainedWt}
                                                        onChange={(e) => setTest2({ ...test2, retainedWt: e.target.value })}
                                                        placeholder="gm"
                                                        className="w-full px-2 py-2 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                                <td className="border border-[#e5e7eb] px-2 py-1 text-center text-xs text-[#6b7280]">gm</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-center gap-3 mb-6">
                                    <button className="px-6 py-2 bg-[#3B68FC] text-white rounded-lg text-sm font-medium hover:bg-[#2952d9] transition-colors">
                                        Calculate
                                    </button>
                                    <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                        Clear
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                                        <div className="text-3xl font-bold text-orange-600">{result1 || '0'} %</div>
                                        <div className="text-sm text-[#6b7280] mt-1">Crushing Value %</div>
                                        <div className="text-xs text-orange-500 mt-2 font-medium">Result of Test - I</div>
                                        <div className="text-xs text-[#6b7280] mt-1">
                                            <sup>W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                        </div>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                                        <div className="text-3xl font-bold text-orange-600">{result2 || '0'} %</div>
                                        <div className="text-sm text-[#6b7280] mt-1">Crushing Value %</div>
                                        <div className="text-xs text-orange-500 mt-2 font-medium">Result of Test - II</div>
                                        <div className="text-xs text-[#6b7280] mt-1">
                                            <sup>W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                        </div>
                                    </div>
                                    <div className="bg-orange-100 rounded-xl p-4 text-center border border-orange-300">
                                        <div className="text-3xl font-bold text-orange-700">{meanResult || '0'} %</div>
                                        <div className="text-sm text-[#6b7280] mt-1">Aggregate Crushing Value</div>
                                        <div className="text-xs text-orange-600 mt-2 font-medium">Mean Aggregate Crushing Value</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Crushing Value? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Aggregate Crushing Value?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                The aggregate crushing value provides a relative measure of resistance to crushing under a gradually applied compressive load. To achieve a high quality of pavement, aggregates possessing low aggregate crushing value should be preferred.
                            </p>
                            <h4 className="font-semibold text-[#0A0A0A] mb-2">Why to test Aggregate Crushing Value?</h4>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The principal mechanical properties required in road stones are:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-sm text-[#6b7280]">
                                <li>Satisfactory resistance to crushing under the roller during construction</li>
                                <li>Adequate resistance to surface abrasion under traffic after they get modified by their water absorption and wetting action.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Calculate Aggregate Crushing Value
                        </h2>
                        <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 rounded-xl p-6 border border-[#3B68FC]/20">
                            <div className="text-center">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className="text-orange-600">Aggregate Crushing Value</span> = <sup>W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>W<sub>1</sub> = Weight of oven-dry sample</p>
                                <p>W<sub>2</sub> = Weight of fraction passing the applicable sieve</p>
                            </div>
                        </div>
                    </section>

                    {/* Apparatus */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-tools text-[#3B68FC]"></i>
                            Apparatus
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ol className="list-decimal list-inside space-y-2 text-sm text-[#0A0A0A]">
                                <li>A 15-cm diameter open-ended steel cylinder, with plunger and base plate, of the general form and dimensions.</li>
                                <li>A straight metal tamping rod of circular cross-section 16 mm in diameter and 45 to 60 cm long, rounded at one end.</li>
                                <li>A balance of capacity 3 kg, readable and accurate to 1 g.</li>
                                <li>IS. sieves of sizes 12.5 mm, 10 mm, and 2.36 mm.</li>
                                <li>A compression testing machine capable of applying a load of 40 tonnes and which can be operated to give a uniform rate of loading.</li>
                                <li>An electric oven to heat the aggregate samples at 100-110°C.</li>
                            </ol>
                            <div className="mt-4 flex justify-center">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                    <i className="fas fa-compress-alt text-4xl text-orange-500 mb-2"></i>
                                    <p className="text-xs text-[#6b7280]">MODEL: AIMIL, H1-2018</p>
                                    <p className="text-xs text-[#6b7280]">MAKER: DU PIP LAB</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sieve Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-filter text-[#3B68FC]"></i>
                            Size of IS Sieve for Separating Fines
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Sr.</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Nominal Size(s)</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Retained on Sieve</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Character of Particles (minimum)</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Size of IS. Sieve for Separating Fines</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center">1</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">12.5 mm</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">10 mm</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">2.50 kg</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">2.36 mm</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center">2</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">10 mm</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">6.3 mm</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">1.00 kg</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">1.18 mm</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center">3</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">6.3 mm</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">3.35 mm</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.40 kg</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">600 mic</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Recommended Values */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-check-circle text-[#3B68FC]"></i>
                            Recommended Aggregate Crushing Value
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Sr.</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Description</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Maximum crushing value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center">1</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Sub-base course</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center font-medium">45%</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center">2</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Sub base course</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center font-medium">40%</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center">3</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Bituminous base course / Water bound macadam</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2 text-center font-medium">35%</td>
                                        </tr>
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
                    {meanResult && (
                        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden mb-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                                <h3 className="font-bold text-white text-sm">Aggregate Crushing Value</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-4xl font-bold text-orange-600">{meanResult} %</div>
                                <div className="text-sm text-[#6b7280] mt-1">Mean Crushing Value</div>
                            </div>
                        </div>
                    )}

                    {/* Related Calculators */}
                    <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
                        <h4 className="font-semibold text-[#0A0A0A] text-sm mb-3 flex items-center gap-2">
                            <span className="text-gray-600">Concrete Technology</span>
                            <span className="text-xs text-[#3B68FC] bg-blue-50 px-2 py-0.5 rounded">Calculators</span>
                        </h4>
                        <div className="space-y-2">
                            {relatedCalculators.map((calc) => (
                                <Link
                                    key={calc.name}
                                    to={calc.slug}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-orange-50 text-orange-600 font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
