import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { CONCRETE_TECHNOLOGY_NAV } from '../constants/calculatorRoutes';

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

export default function AggregateAbrasionValueCalculator() {
    const theme = getThemeClasses('gray');
    // 3 Tests
    const [test1, setTest1] = useState({ originalWt: '', afterWt: '' });
    const [test2, setTest2] = useState({ originalWt: '', afterWt: '' });
    const [test3, setTest3] = useState({ originalWt: '', afterWt: '' });
    const [result1, setResult1] = useState(null);
    const [result2, setResult2] = useState(null);
    const [result3, setResult3] = useState(null);
    const [meanResult, setMeanResult] = useState(null);
    const sidebarRef = useRef(null);

    // Calculate Abrasion Value = (W1 - W2) / W1 × 100
    useEffect(() => {
        const calcAbrasion = (original, after) => {
            const W1 = parseFloat(original) || 0;
            const W2 = parseFloat(after) || 0;
            if (W1 > 0 && W2 >= 0) {
                return ((W1 - W2) / W1 * 100).toFixed(1);
            }
            return null;
        };

        setResult1(calcAbrasion(test1.originalWt, test1.afterWt));
        setResult2(calcAbrasion(test2.originalWt, test2.afterWt));
        setResult3(calcAbrasion(test3.originalWt, test3.afterWt));
    }, [test1, test2, test3]);

    useEffect(() => {
        const validResults = [result1, result2, result3].filter(r => r !== null).map(r => parseFloat(r));
        if (validResults.length > 0) {
            const mean = validResults.reduce((a, b) => a + b, 0) / validResults.length;
            setMeanResult(mean.toFixed(1));
        } else {
            setMeanResult(null);
        }
    }, [result1, result2, result3]);

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
        setTest1({ originalWt: '', afterWt: '' });
        setTest2({ originalWt: '', afterWt: '' });
        setTest3({ originalWt: '', afterWt: '' });
    };

    const relatedCalculators = [
        { name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', slug: '/sieve-analysis' },
        { name: 'Blending of Aggregates', icon: 'fa-blender', slug: '/blending-aggregates' },
        { name: 'Aggregate Impact Value', icon: 'fa-hammer', slug: '/aggregate-impact-value' },
        { name: 'Aggregate Crushing Value', icon: 'fa-compress-alt', slug: '/aggregate-crushing-value' },
        { name: 'Aggregate Abrasion Value', icon: 'fa-cogs', slug: '/aggregate-abrasion-value', active: true },
        { name: 'Aggregate Water Absorption', icon: 'fa-tint', slug: '/aggregate-water-absorption' },
    ];

    const gradingTable = [
        { grade: 'A', wt: '1250 ± 25', size: '63 mm - 50 mm', balls: 12, revolutions: 1000 },
        { grade: 'A', wt: '1250 ± 25', size: '50 mm - 40 mm', balls: 12, revolutions: 1000 },
        { grade: 'A', wt: '1250 ± 10', size: '40 mm - 25 mm', balls: 12, revolutions: 1000 },
        { grade: 'A', wt: '1250 ± 10', size: '25 mm - 20 mm', balls: 12, revolutions: 1000 },
        { grade: 'A', wt: '1250 ± 10', size: '20 mm - 12.5 mm', balls: 12, revolutions: 1000 },
        { grade: 'B', wt: '2500 ± 10', size: '40 mm - 20 mm', balls: 11, revolutions: 500 },
        { grade: 'B', wt: '2500 ± 10', size: '20 mm - 12.5 mm', balls: 11, revolutions: 500 },
        { grade: 'C', wt: '2500 ± 10', size: '12.5 mm - 10 mm', balls: 8, revolutions: 500 },
        { grade: 'C', wt: '2500 ± 10', size: '10 mm - 6.3 mm', balls: 8, revolutions: 500 },
        { grade: 'C', wt: '2500 ± 10', size: '6.3 mm - 4.75 mm', balls: 8, revolutions: 500 },
    ];

    const specTable = [
        { type: 'Water Bound Macadam sub-base', max: '60%' },
        { type: 'Water Bound Macadam wearing course', max: '40%' },
        { type: 'Bituminous Macadam', max: '50%' },
        { type: 'Dense Bituminous Macadam', max: '40%' },
        { type: 'Semi Dense Bituminous Concrete', max: '35%' },
        { type: 'Bituminous Concrete', max: '30%' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="concrete-technology" />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Aggregate Abrasion Value</h1>
                    <p className="text-[#6b7280] mb-6">IS:2386 (Part IV) - Los Angeles Abrasion Test</p>

                    {/* Calculator */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`bg-gradient-to-r ${theme.gradient} px-5 py-4`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-cogs text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">DETERMINE AGGREGATE ABRASION VALUE</h3>
                                        <p className="text-white/80 text-xs">Los Angeles Abrasion Test - Enter weights for 3 tests</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {/* Input Table */}
                                <div className="overflow-x-auto mb-6">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-[#f8f9fa]">
                                                <th className={`border ${theme.border} px-4 py-2 text-left`}>Parameter</th>
                                                <th className={`border ${theme.border} px-4 py-2 text-center`} colSpan={2}>Test I</th>
                                                <th className={`border ${theme.border} px-4 py-2 text-center`} colSpan={2}>Test II</th>
                                                <th className={`border ${theme.border} px-4 py-2 text-center`} colSpan={2}>Test III</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className={`border ${theme.border} px-4 py-2`}>
                                                    <div className="flex items-center">
                                                        Mass of sample (W<sub>1</sub>)
                                                        <InfoTooltip text="Original weight of test sample in grams before test" theme={theme} />
                                                    </div>
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        value={test1.originalWt}
                                                        onChange={(e) => setTest1({ ...test1, originalWt: e.target.value })}
                                                        placeholder="gm"
                                                        className={`w-full px-2 py-2 ${theme.border} border rounded text-center text-sm ${theme.focus} outline-none`}
                                                    />
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1 text-center text-xs text-[#6b7280]`}>gm</td>
                                                <td className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        value={test2.originalWt}
                                                        onChange={(e) => setTest2({ ...test2, originalWt: e.target.value })}
                                                        placeholder="gm"
                                                        className={`w-full px-2 py-2 ${theme.border} border rounded text-center text-sm ${theme.focus} outline-none`}
                                                    />
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1 text-center text-xs text-[#6b7280]`}>gm</td>
                                                <td className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        value={test3.originalWt}
                                                        onChange={(e) => setTest3({ ...test3, originalWt: e.target.value })}
                                                        placeholder="gm"
                                                        className={`w-full px-2 py-2 ${theme.border} border rounded text-center text-sm ${theme.focus} outline-none`}
                                                    />
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1 text-center text-xs text-[#6b7280]`}>gm</td>
                                            </tr>
                                            <tr>
                                                <td className={`border ${theme.border} px-4 py-2`}>
                                                    <div className="flex items-center">
                                                        Wt retained on 1.70mm sieve (W<sub>2</sub>)
                                                        <InfoTooltip text="Weight retained on 1.70mm sieve after LA test" theme={theme} />
                                                    </div>
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        value={test1.afterWt}
                                                        onChange={(e) => setTest1({ ...test1, afterWt: e.target.value })}
                                                        placeholder="gm"
                                                        className={`w-full px-2 py-2 ${theme.border} border rounded text-center text-sm ${theme.focus} outline-none`}
                                                    />
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1 text-center text-xs text-[#6b7280]`}>gm</td>
                                                <td className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        value={test2.afterWt}
                                                        onChange={(e) => setTest2({ ...test2, afterWt: e.target.value })}
                                                        placeholder="gm"
                                                        className={`w-full px-2 py-2 ${theme.border} border rounded text-center text-sm ${theme.focus} outline-none`}
                                                    />
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1 text-center text-xs text-[#6b7280]`}>gm</td>
                                                <td className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        value={test3.afterWt}
                                                        onChange={(e) => setTest3({ ...test3, afterWt: e.target.value })}
                                                        placeholder="gm"
                                                        className={`w-full px-2 py-2 ${theme.border} border rounded text-center text-sm ${theme.focus} outline-none`}
                                                    />
                                                </td>
                                                <td className={`border ${theme.border} px-2 py-1 text-center text-xs text-[#6b7280]`}>gm</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-center gap-3 mb-6">
                                    <button className={`px-6 py-2 ${theme.button} rounded-lg text-sm font-medium transition-colors`}>
                                        Calculate
                                    </button>
                                    <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                        Clear
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className={`${theme.bgSoft} rounded-xl p-4 text-center border ${theme.border}`}>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{result1 || '0'} %</div>
                                        <div className={`text-xs ${theme.text} mt-1 font-medium`}>Test - I</div>
                                        <div className="text-xs text-[#6b7280] mt-1">Abrasion Value %</div>
                                    </div>
                                    <div className={`${theme.bgSoft} rounded-xl p-4 text-center border ${theme.border}`}>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{result2 || '0'} %</div>
                                        <div className={`text-xs ${theme.text} mt-1 font-medium`}>Test - II</div>
                                        <div className="text-xs text-[#6b7280] mt-1">Abrasion Value %</div>
                                    </div>
                                    <div className={`${theme.bgSoft} rounded-xl p-4 text-center border ${theme.border}`}>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{result3 || '0'} %</div>
                                        <div className={`text-xs ${theme.text} mt-1 font-medium`}>Test - III</div>
                                        <div className="text-xs text-[#6b7280] mt-1">Abrasion Value %</div>
                                    </div>
                                    <div className={`${theme.bgSoft} rounded-xl p-4 text-center border ${theme.border}`}>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{meanResult || '0'} %</div>
                                        <div className={`text-xs ${theme.text} mt-1 font-medium`}>Mean Value</div>
                                        <div className="text-xs text-[#6b7280] mt-1">Agg. Abrasion Value</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Abrasion Value? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is the need of Aggregate Abrasion value Test?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                Due to movements of traffic, the road stones used in the surfacing course are subjected to wearing action at the top. Abrasion resistance is another mechanical property of aggregates. Aggerates, especially those used in road works, should be hard enough to resist the abrasion caused due to movement of traffic.
                            </p>
                            <h4 className="font-semibold text-[#0A0A0A] mb-2">What is Los Angeles Rattler Test?</h4>
                            <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                The principle of Los Angeles Abrasion Test is to find the percentage wear due to relative rubbing action between the aggregate and steel balls used as abrasive charge. Los Angeles abrasion test is a measure of degradation of mineral aggregates of standard gradings resulting from a combination of actions including abrasion or attrition, impact, and grinding in a rotating steel drum containing a specified number of steel spheres.
                            </p>
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Calculate Aggregate Abrasion Value
                        </h2>
                        <div className={`bg-gradient-to-r ${theme.bgSoft} to-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className={`${theme.text}`}>Aggregate Abrasion Value</span> = <sup>W<sub>1</sub> - W<sub>2</sub></sup>/<sub>W<sub>1</sub></sub> × 100
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>W<sub>1</sub> = Weight of oven-dry sample</p>
                                <p>W<sub>2</sub> = Weight of the sample retained on the applicable sieve after the test</p>
                            </div>
                        </div>
                    </section>

                    {/* Los Angeles Machine */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-cog ${theme.text}`}></i>
                            Los Angeles Abrasion Machine
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-4">
                                <div className="inline-block bg-[#f8f9fa] p-4 rounded-lg">
                                    <i className={`fas fa-cogs text-6xl ${theme.text}`}></i>
                                    <p className="text-xs text-[#6b7280] mt-2">LOS ANGELES ABRASION MACHINE: AASHTO</p>
                                </div>
                            </div>
                            <p className="text-sm text-[#0A0A0A] leading-relaxed text-justify">
                                The Los Angeles abrasion testing machine consists of a hollow steel cylinder, closed at both ends, having an inside diameter of 711 ± 5 mm and an inside length of 508 ± 5 mm. The cylinder is mounted on stub shafts attached to the ends of the cylinder but not entering it, and is mounted in such a manner that it may be rotated about an axis in a horizontal position. An opening in the cylinder is provided for introducing the test sample. A steel shelf projecting radially 89 mm into the cylinder is fixed along one element of the interior surface.
                            </p>
                        </div>
                    </section>

                    {/* Grading Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Grading of Test Sample
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="overflow-x-auto">
                                <table className={`w-full text-sm border ${theme.border}`}>
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className={`border ${theme.border} px-3 py-2`}>Grading</th>
                                            <th className={`border ${theme.border} px-3 py-2`}>Weight (gm)</th>
                                            <th className={`border ${theme.border} px-3 py-2`}>Passing - Retained Size</th>
                                            <th className={`border ${theme.border} px-3 py-2`}>No. of Steel Balls</th>
                                            <th className={`border ${theme.border} px-3 py-2`}>No. of Revolutions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradingTable.map((row, i) => (
                                            <tr key={i}>
                                                <td className={`border ${theme.border} px-3 py-2 text-center`}>{row.grade}</td>
                                                <td className={`border ${theme.border} px-3 py-2 text-center`}>{row.wt}</td>
                                                <td className={`border ${theme.border} px-3 py-2`}>{row.size}</td>
                                                <td className={`border ${theme.border} px-3 py-2 text-center`}>{row.balls}</td>
                                                <td className={`border ${theme.border} px-3 py-2 text-center`}>{row.revolutions}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Specifications */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-check-circle ${theme.text}`}></i>
                            Specifications: Los Angeles Abrasion Values
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="overflow-x-auto">
                                <table className={`w-full text-sm border ${theme.border}`}>
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className={`border ${theme.border} px-4 py-2`}>Sr.</th>
                                            <th className={`border ${theme.border} px-4 py-2 text-left`}>Type</th>
                                            <th className={`border ${theme.border} px-4 py-2`}>Max. Los Angeles Abrasion Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specTable.map((row, i) => (
                                            <tr key={i}>
                                                <td className={`border ${theme.border} px-4 py-2 text-center`}>{i + 1}</td>
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
                <div ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="gray" />

                    {/* Result Card */}
                    {meanResult && (
                        <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} overflow-hidden mb-4`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <h3 className="font-bold text-white text-sm">Aggregate Abrasion Value</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className={`text-4xl font-bold ${theme.text}`}>{meanResult} %</div>
                                <div className="text-sm text-[#6b7280] mt-1">Mean Abrasion Value</div>
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

                    {/* Category Quick Nav */}
                    <CategoryQuickNav
                        items={CONCRETE_TECHNOLOGY_NAV}
                        title="Concrete Technology Calculators"
                        themeName="gray"
                    />
                </div>
            </div>
        </main>
    );
}
