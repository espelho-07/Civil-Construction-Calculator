import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

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

export default function AggregateImpactValueCalculator() {
    // 2 Tests
    const [test1, setTest1] = useState({ originalWt: '', passingWt: '' });
    const [test2, setTest2] = useState({ originalWt: '', passingWt: '' });
    const [result1, setResult1] = useState(null);
    const [result2, setResult2] = useState(null);
    const [meanResult, setMeanResult] = useState(null);
    const sidebarRef = useRef(null);

    // Calculate Impact Value = (W2 / W1) × 100
    useEffect(() => {
        const calcImpact = (original, passing) => {
            const W1 = parseFloat(original) || 0;
            const W2 = parseFloat(passing) || 0;
            if (W1 > 0 && W2 > 0) {
                return ((W2 / W1) * 100).toFixed(1);
            }
            return null;
        };

        setResult1(calcImpact(test1.originalWt, test1.passingWt));
        setResult2(calcImpact(test2.originalWt, test2.passingWt));
    }, [test1, test2]);

    useEffect(() => {
        const validResults = [result1, result2].filter(r => r !== null).map(r => parseFloat(r));
        if (validResults.length > 0) {
            const mean = validResults.reduce((a, b) => a + b, 0) / validResults.length;
            setMeanResult(mean.toFixed(1));
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
        setTest1({ originalWt: '', passingWt: '' });
        setTest2({ originalWt: '', passingWt: '' });
    };

    const relatedCalculators = [
        { name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', slug: '/sieve-analysis' },
        { name: 'Blending of Aggregates', icon: 'fa-blender', slug: '/blending-aggregates' },
        { name: 'Aggregate Impact Value', icon: 'fa-hammer', slug: '/aggregate-impact-value', active: true },
        { name: 'Aggregate Crushing Value', icon: 'fa-compress-alt', slug: '/aggregate-crushing-value' },
        { name: 'Aggregate Abrasion Value', icon: 'fa-cogs', slug: '/aggregate-abrasion-value' },
        { name: 'Aggregate Water Absorption', icon: 'fa-tint', slug: '/aggregate-water-absorption' },
    ];

    const specTable = [
        { type: 'Wearing surfaces', max: '30%' },
        { type: 'Bituminous macadam, concrete wearing course', max: '35%' },
        { type: 'Base course', max: '40%' },
        { type: 'Sub-base course', max: '45%' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="concrete-technology" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Aggregate Impact Value</h1>
                    <p className="text-[#6b7280] mb-6">IS:2386 (Part IV) - 1963</p>

                    {/* Calculator */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-hammer text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">DETERMINE AGGREGATE IMPACT VALUE</h3>
                                        <p className="text-amber-100 text-xs">Enter weights for Test-I and Test-II</p>
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
                                                        Weight of oven dried sample (W<sub>1</sub>)
                                                        <InfoTooltip text="Total weight of oven-dried sample taken for test in grams" />
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
                                                        Weight of sample passing 2.36 mm IS Sieve (W<sub>2</sub>)
                                                        <InfoTooltip text="Weight of sample passing through 2.36mm IS sieve after impact test" />
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
                                    <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                                        <div className="text-3xl font-bold text-amber-600">{result1 || '0'} %</div>
                                        <div className="text-sm text-[#6b7280] mt-1">Impact Value %</div>
                                        <div className="text-xs text-amber-500 mt-2 font-medium">Result of Test - I</div>
                                        <div className="text-xs text-[#6b7280] mt-1">
                                            <sup>W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
                                        <div className="text-3xl font-bold text-amber-600">{result2 || '0'} %</div>
                                        <div className="text-sm text-[#6b7280] mt-1">Impact Value %</div>
                                        <div className="text-xs text-amber-500 mt-2 font-medium">Result of Test - II</div>
                                        <div className="text-xs text-[#6b7280] mt-1">
                                            <sup>W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                        </div>
                                    </div>
                                    <div className="bg-amber-100 rounded-xl p-4 text-center border border-amber-300">
                                        <div className="text-3xl font-bold text-amber-700">{meanResult || '0'} %</div>
                                        <div className="text-sm text-[#6b7280] mt-1">Aggregate Impact Value</div>
                                        <div className="text-xs text-amber-600 mt-2 font-medium">Mean Value</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Impact Value? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Aggregate Impact Value?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                The aggregate impact value gives a relative measure of the resistance of an aggregate to sudden shock or impact, which in some aggregates differs from its resistance to a slow compressive load. Aggregate with higher aggregate impact value is more suitable for road and pavement construction.
                            </p>
                            <h4 className="font-semibold text-[#0A0A0A] mb-2">Why to test Aggregate Impact Value?</h4>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The toughness of stones is defined as the resistance offered by the stones to impact. Road stones should possess sufficient toughness to resist impact caused due to moving traffic. The aggregate impact test is conducted to determine the aggregate impact value which is a measure of resistance offered by the aggregates to impact loads.
                            </p>
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Calculate Aggregate Impact Value
                        </h2>
                        <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 rounded-xl p-6 border border-[#3B68FC]/20">
                            <div className="text-center">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className="text-amber-600">Aggregate Impact Value</span> = <sup>W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>W<sub>1</sub> = Weight of oven-dried sample taken for test</p>
                                <p>W<sub>2</sub> = Weight of material passing through the 2.36 mm IS sieve after the impact test</p>
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
                                <li><strong>Impact testing machine</strong> – A machine conforming to IS: 9377.</li>
                                <li><strong>IS Sieves</strong> – 12.5 mm, 10 mm, and 2.36 mm.</li>
                                <li><strong>Cylindrical metal measure</strong> – 75 mm diameter and 50 mm deep.</li>
                                <li><strong>Tamping rod</strong> – Rounded at one end, 10 mm diameter and at least 230 mm long.</li>
                                <li><strong>Balance</strong> – Accurate to 1 g having capacity of at least 500 g.</li>
                                <li><strong>Oven</strong> – Thermostatically controlled, capable of maintaining temperature at 100°C to 110°C.</li>
                            </ol>
                            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-sm text-amber-800">
                                    <strong>Test Sample:</strong> The test sample consists of aggregates passing through 12.5 mm sieve and retained on 10 mm IS sieve. About 3 kg of aggregate sample that conforms to the grading is taken for conducting the test. The aggregate should be dried in an oven for 4 hours at 100-110°C and cooled.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Procedure */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-list-ol text-[#3B68FC]"></i>
                            Procedure
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ol className="list-decimal list-inside space-y-3 text-sm text-[#0A0A0A]">
                                <li>Sieve the sample through 12.5 mm and 10 mm IS sieves. The aggregate passing through 12.5 mm sieve and retained on 10 mm sieve comprises the test sample.</li>
                                <li>The aggregate shall be dried in an oven for a period of 4 hours at a temperature of 100-110°C and cooled.</li>
                                <li>Fill the cylindrical measure with the sample in 3 layers, each layer being tamped with 25 strokes of the tamping rod.</li>
                                <li>Weigh the aggregate filling the cylindrical measure to the nearest gram. This is W<sub>1</sub>.</li>
                                <li>Fix the cup firmly in position on the base, and place the whole sample in it.</li>
                                <li>The hammer is raised 380 mm above the upper surface of aggregate in the cup, and allowed to fall freely on the aggregate. Give 15 blows at an interval of not less than one second between successive blows.</li>
                                <li>Remove the crushed aggregate from the cup and sieve through 2.36 mm IS sieve.</li>
                                <li>Weigh the fraction passing through the sieve. This is W<sub>2</sub>.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Specifications */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-check-circle text-[#3B68FC]"></i>
                            Recommended Aggregate Impact Value
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Sr.</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Type of Pavement</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2">Maximum Impact Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specTable.map((row, i) => (
                                            <tr key={i}>
                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center">{i + 1}</td>
                                                <td className="border border-[#e5e7eb] px-4 py-2">{row.type}</td>
                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center font-medium">{row.max}</td>
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
                    {meanResult && (
                        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden mb-4">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4">
                                <h3 className="font-bold text-white text-sm">Aggregate Impact Value</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-4xl font-bold text-amber-600">{meanResult} %</div>
                                <div className="text-sm text-[#6b7280] mt-1">Mean Impact Value</div>
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
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-amber-50 text-amber-600 font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
