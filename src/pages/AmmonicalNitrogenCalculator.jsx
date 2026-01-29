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

export default function AmmonicalNitrogenCalculator() {
    // 3 Tests
    const [tests, setTests] = useState([
        { sampleReading: '', blankReading: '', normality: '', volume: '' },
        { sampleReading: '', blankReading: '', normality: '', volume: '' },
        { sampleReading: '', blankReading: '', normality: '', volume: '' },
    ]);

    const [results, setResults] = useState([]);
    const sidebarRef = useRef(null);

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = value;
        setTests(newTests);
    };

    useEffect(() => {
        // Calculate Ammonical Nitrogen for each test
        // If N of H2SO4 is 0.02 N: Ammonical Nitrogen (mg/L) = (A - B) × 280 / mL of sample
        // If N is other than 0.02 N: Ammonical Nitrogen (mg/L) = (A - B) × N × 14 × 1000 / mL of sample
        const newResults = tests.map((test) => {
            const A = parseFloat(test.sampleReading) || 0;
            const B = parseFloat(test.blankReading) || 0;
            const N = parseFloat(test.normality) || 0;
            const V = parseFloat(test.volume) || 0;

            if (A >= 0 && B >= 0 && N > 0 && V > 0) {
                let ammonia;
                if (N === 0.02) {
                    ammonia = ((A - B) * 280) / V;
                } else {
                    ammonia = ((A - B) * N * 14 * 1000) / V;
                }
                return ammonia.toFixed(2);
            }
            return null;
        });
        setResults(newResults);
    }, [tests]);

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
        setTests([
            { sampleReading: '', blankReading: '', normality: '', volume: '' },
            { sampleReading: '', blankReading: '', normality: '', volume: '' },
            { sampleReading: '', blankReading: '', normality: '', volume: '' },
        ]);
        setResults([]);
    };

    const relatedCalculators = [
        { name: 'Chemical Oxygen Demand', icon: 'fa-flask', slug: '/cod-calculator' },
        { name: 'Biochemical Oxygen Demand', icon: 'fa-vial', slug: '/bod-calculator' },
        { name: 'Ammonical Nitrogen Test', icon: 'fa-atom', slug: '/ammonical-nitrogen', active: true },
    ];

    // Get average result
    const validResults = results.filter(r => r !== null);
    const avgResult = validResults.length > 0
        ? (validResults.reduce((sum, r) => sum + parseFloat(r), 0) / validResults.length).toFixed(2)
        : null;

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="environmental-engineering" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Ammonical Nitrogen Measurement Calculator</h1>
                        <CalculatorActions
                            calculatorSlug="ammonical-nitrogen"
                            calculatorName="Ammonical Nitrogen Calculator"
                            calculatorIcon="fa-atom"
                            category="Environmental Engineering"
                            inputs={{ tests }}
                            outputs={{ results: results || [] }}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">IS:3025 - Calculate ammonical nitrogen content in water samples</p>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-atom text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">AMMONICAL NITROGEN CALCULATION</h3>
                                        <p className="text-purple-100 text-xs">Enter values for up to 3 tests</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f9fa]">
                                            <th className="border border-[#e5e7eb] px-3 py-2 text-left">Parameter</th>
                                            <th className="border border-[#e5e7eb] px-3 py-2 text-center">Test-I</th>
                                            <th className="border border-[#e5e7eb] px-3 py-2 text-center">Test-II</th>
                                            <th className="border border-[#e5e7eb] px-3 py-2 text-center">Test-III</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Sample Reading (A) <InfoTooltip text="Titration reading for sample in mL of H₂SO₄ used" />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={test.sampleReading}
                                                        onChange={(e) => updateTest(i, 'sampleReading', e.target.value)}
                                                        placeholder="ml"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Blank Reading (B) <InfoTooltip text="Titration reading for blank in mL of H₂SO₄ used" />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={test.blankReading}
                                                        onChange={(e) => updateTest(i, 'blankReading', e.target.value)}
                                                        placeholder="ml"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Normality of H₂SO₄ (N) <InfoTooltip text="Normality of Sulphuric Acid solution (typically 0.02 N)" />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={test.normality}
                                                        onChange={(e) => updateTest(i, 'normality', e.target.value)}
                                                        placeholder="N"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Volume of Sample (VOS) <InfoTooltip text="Volume of sample taken in mL" />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={test.volume}
                                                        onChange={(e) => updateTest(i, 'volume', e.target.value)}
                                                        placeholder="ml"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-purple-50">
                                            <td className="border border-[#e5e7eb] px-3 py-2 font-semibold">NH₃-N (mg/L)</td>
                                            {results.map((result, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-2 text-center font-bold text-purple-600">
                                                    {result || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="flex justify-center gap-3 mt-4">
                                    <button onClick={reset} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                        <i className="fas fa-redo mr-1"></i> Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Ammonical Nitrogen? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Ammonical Nitrogen Test?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Ammonical nitrogen (NH₃-N) is a measure for the amount of ammonia, a toxic pollutant often found in landfill leachate and in waste products, such as sewage, liquid manure and other liquid organic waste products.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                It is a common parameter used in the characterization of wastewater and to monitor the efficiency of biological treatment processes. Ammonia nitrogen is composed of both ammonia (NH₃) and ammonium (NH₄⁺) species.
                            </p>
                        </div>
                    </section>

                    {/* Principle */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-book text-[#3B68FC]"></i>
                            Principle
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed">
                                Ammonia after distillation is dissolved in boric acid and mixed indicator and can be titrated with H₂SO₄. Boric acid is so weak acid that it does not interfere with acidimetric titration.
                            </p>
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Calculation of Ammonical Nitrogen
                        </h2>
                        <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 rounded-xl p-6 border border-[#3B68FC]/20">
                            <div className="text-center mb-4">
                                <p className="text-sm text-[#6b7280] mb-2">If Normality of H₂SO₄ is 0.02 N:</p>
                                <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className="text-purple-600">NH₃-N (mg/L)</span> = (A - B) × 280 / mL of sample
                                    </code>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-[#6b7280] mb-2">If Normality is other than 0.02 N:</p>
                                <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className="text-purple-600">NH₃-N (mg/L)</span> = (A - B) × N × 14 × 1000 / mL of sample
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>A = Sample reading</p>
                                <p>B = Blank reading</p>
                            </div>
                        </div>
                    </section>

                    {/* Apparatus */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-vials text-[#3B68FC]"></i>
                            Apparatus
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ul className="space-y-2 text-sm text-[#6b7280]">
                                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Distillation apparatus (All borosilicate glass apparatus)</li>
                                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Pipettes</li>
                                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Heating Mantle</li>
                                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Volumetric Flask</li>
                                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Burette borosilicate glass</li>
                            </ul>
                        </div>
                    </section>

                    {/* Reagent Preparation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-flask text-[#3B68FC]"></i>
                            Preparation of Reagent
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-[#0A0A0A] mb-2">Reagents Required:</h4>
                                    <ul className="space-y-1 text-sm text-[#6b7280] ml-4">
                                        <li>• Ammonia Free Water</li>
                                        <li>• Borate Buffer Solution</li>
                                        <li>• Sodium Hydroxide, 6N</li>
                                        <li>• Dechlorinating reagent</li>
                                        <li>• Neutralization Agent: NaOH 1N, H₂SO₄ 1N</li>
                                        <li>• Mix Indicator Solution</li>
                                        <li>• Boric Acid</li>
                                        <li>• Sulphuric Acid</li>
                                        <li>• Methyl red and methyl blue indicator</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#0A0A0A] mb-2">Reagent Preparation:</h4>
                                    <ul className="space-y-2 text-sm text-[#6b7280]">
                                        <li><strong>Ammonia Free Water:</strong> Distillation - Eliminate traces of Ammonia in distilled water by adding 0.1 ml of conc. H₂SO₄ to 1L distilled water and redistillation.</li>
                                        <li><strong>Borate Buffer Solution:</strong> Add 88 mL of 0.1 N NaOH solution to 500 mL approximately 0.025 M Sodium tetra borate solution of 0.5 g sodium tetra borate and dilute to 1000 mL.</li>
                                        <li><strong>Mix Indicator Solution:</strong> (A) Dissolved 0.200 g Methyl red indicator in 100 mL 95% Ethyl or isopropyl alcohol. (B) Dissolve 0.100 g Methyl Blue in 50 mL 95% ethyl or isopropyl alcohol. Combine two solutions.</li>
                                        <li><strong>Boric Acid:</strong> Dissolve 20 g Boric acid (H₃BO₃) in distilled water, add 10 mL mixed indicator solution and dilute to 1000 mL.</li>
                                        <li><strong>Standard Sulphuric Acid:</strong> Dissolve 10 mL 1N H₂SO₄ dilute to 500 mL with distilled water.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Detection Limit */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-chart-line text-[#3B68FC]"></i>
                            Range
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A]">
                                Minimum Detection limit of Ammonical Nitrogen is <strong>0.05 mg/L</strong>
                            </p>
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
                    {avgResult && (
                        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden mb-4">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-4">
                                <h3 className="font-bold text-white text-sm">Average NH₃-N Result</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-4xl font-bold text-purple-600">{avgResult}</div>
                                <div className="text-sm text-[#6b7280] mt-1">mg/L</div>
                                <div className="text-xs text-[#6b7280] mt-2">Based on {validResults.length} test(s)</div>
                            </div>
                        </div>
                    )}

                    {/* Related Calculators */}
                    <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
                        <h4 className="font-semibold text-[#0A0A0A] text-sm mb-3 flex items-center gap-2">
                            <i className="fas fa-leaf text-green-600"></i>
                            Environmental Engineering Tests
                        </h4>
                        <div className="space-y-2">
                            {relatedCalculators.map((calc) => (
                                <Link
                                    key={calc.name}
                                    to={calc.slug}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-purple-50 text-purple-600 font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
