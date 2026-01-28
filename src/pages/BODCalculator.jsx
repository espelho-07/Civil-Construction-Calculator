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

export default function BODCalculator() {
    // Sample data - 6 samples (Day 1 Initial and Day 5 Final readings)
    const [samples, setSamples] = useState([
        { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
        { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
        { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
        { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
        { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
        { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
    ]);

    const [results, setResults] = useState([]);
    const sidebarRef = useRef(null);

    const updateSample = (index, field, value) => {
        const newSamples = [...samples];
        newSamples[index][field] = value;
        setSamples(newSamples);
    };

    useEffect(() => {
        // Calculate BOD for each sample
        // BOD (mg/L) = [(D1 - D2) - (B1 - B2)] × Dilution Factor
        // Or simplified: BOD = (Initial DO - Final DO) × Dilution Factor - Blank Correction
        const newResults = samples.map((sample) => {
            const D1 = parseFloat(sample.d1Sample) || 0;  // Day 1 Sample DO
            const D5 = parseFloat(sample.d5Sample) || 0;  // Day 5 Sample DO
            const B1 = parseFloat(sample.d1Blank) || 0;   // Day 1 Blank DO
            const B5 = parseFloat(sample.d5Blank) || 0;   // Day 5 Blank DO
            const DF = parseFloat(sample.dilution) || 0;  // Dilution Factor

            if (D1 > 0 && DF > 0) {
                const bodSample = D1 - D5;
                const bodBlank = B1 - B5;
                const bod = (bodSample - bodBlank) * DF;
                return bod > 0 ? bod.toFixed(2) : '0.00';
            }
            return null;
        });
        setResults(newResults);
    }, [samples]);

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
        setSamples([
            { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
            { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
            { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
            { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
            { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
            { d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' },
        ]);
        setResults([]);
    };

    const relatedCalculators = [
        { name: 'Chemical Oxygen Demand', icon: 'fa-flask', slug: '/cod-calculator' },
        { name: 'Biochemical Oxygen Demand', icon: 'fa-vial', slug: '/bod-calculator', active: true },
        { name: 'Ammonical Nitrogen Test', icon: 'fa-atom', slug: '/ammonical-nitrogen' },
    ];

    // Get average BOD
    const validResults = results.filter(r => r !== null);
    const avgBOD = validResults.length > 0
        ? (validResults.reduce((sum, r) => sum + parseFloat(r), 0) / validResults.length).toFixed(2)
        : null;

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="environmental-engineering" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Biochemical Oxygen Demand (BOD) Calculator</h1>
                    <p className="text-[#6b7280] mb-6">IS:3025 - Calculate BOD of water and wastewater samples</p>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-vial text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">BIOCHEMICAL OXYGEN DEMAND</h3>
                                        <p className="text-green-100 text-xs">5-Day BOD Test (BOD₅) - Enter values for up to 6 samples</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f9fa]">
                                            <th className="border border-[#e5e7eb] px-3 py-2 text-left">Parameter</th>
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <th key={i} className="border border-[#e5e7eb] px-3 py-2 text-center">Sample-{i}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Initial D.O. of Blank(D₁) <InfoTooltip text="Dissolved Oxygen of dilution water (blank) on Day 1 in mg/L" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d1Blank}
                                                        onChange={(e) => updateSample(i, 'd1Blank', e.target.value)}
                                                        placeholder="mg/L"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Initial D.O. of Sample(D₂) <InfoTooltip text="Dissolved Oxygen of diluted sample on Day 1 in mg/L" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d1Sample}
                                                        onChange={(e) => updateSample(i, 'd1Sample', e.target.value)}
                                                        placeholder="mg/L"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Final D.O. of Blank(B₁) <InfoTooltip text="Dissolved Oxygen of blank after 5 days incubation in mg/L" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d5Blank}
                                                        onChange={(e) => updateSample(i, 'd5Blank', e.target.value)}
                                                        placeholder="mg/L"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Final D.O. of Sample(B₂) <InfoTooltip text="Dissolved Oxygen of sample after 5 days incubation in mg/L" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d5Sample}
                                                        onChange={(e) => updateSample(i, 'd5Sample', e.target.value)}
                                                        placeholder="mg/L"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Dilution Factor <InfoTooltip text="Ratio of final volume to sample volume. E.g., if 5ml sample diluted to 300ml, DF = 60" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.dilution}
                                                        onChange={(e) => updateSample(i, 'dilution', e.target.value)}
                                                        placeholder="DF"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-green-50">
                                            <td className="border border-[#e5e7eb] px-3 py-2 font-semibold">BOD₅ (mg/L)</td>
                                            {results.map((result, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-2 text-center font-bold text-green-600">
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

                    {/* What is BOD? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Biochemical Oxygen Demand?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                The BOD is an empirical test in which standardized laboratory procedures are used to determine the relative oxygen requirements of wastewaters, effluents, and polluted waters. The test measures the oxygen utilized during a specific incubation period for the biochemical degradation of organic material and the oxygen used to oxidize inorganic material such as sulfides and ferrous iron.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The standard BOD test (BOD₅) measures oxygen consumption after 5 days at 20°C. For this reason, it is usually referred as 5-Day BOD or BOD₅.
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
                                The sample of wastewater is diluted with specially prepared dilution water and incubated at 20°C for 5 days. Dissolved oxygen (DO) is measured initially and after incubation. BOD is calculated from the difference between initial and final DO, taking into account the dilution factor and blank correction.
                            </p>
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Formula
                        </h2>
                        <div className="bg-gradient-to-r from-[#EEF2FF] to-blue-50 rounded-xl p-6 border border-[#3B68FC]/20">
                            <div className="text-center">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]">
                                        <span className="text-green-600">BOD₅ (mg/L)</span> = [(D₂ - B₂) - (D₁ - B₁)] × DF
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>D₁ = Initial D.O. of Blank (Day 1)</p>
                                <p>D₂ = Initial D.O. of Sample (Day 1)</p>
                                <p>B₁ = Final D.O. of Blank (Day 5)</p>
                                <p>B₂ = Final D.O. of Sample (Day 5)</p>
                                <p>DF = Dilution Factor</p>
                            </div>
                        </div>
                    </section>

                    {/* Dilution Factor Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-table text-[#3B68FC]"></i>
                            Dilution Factor Reference
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Sample in BOD Bottle (mL)</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Dilution Factor (300/Sample)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">0.1</td><td className="border border-[#e5e7eb] px-4 py-2">3000</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">0.5</td><td className="border border-[#e5e7eb] px-4 py-2">600</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">1.0</td><td className="border border-[#e5e7eb] px-4 py-2">300</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">2.0</td><td className="border border-[#e5e7eb] px-4 py-2">150</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">5.0</td><td className="border border-[#e5e7eb] px-4 py-2">60</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">10.0</td><td className="border border-[#e5e7eb] px-4 py-2">30</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">25.0</td><td className="border border-[#e5e7eb] px-4 py-2">12</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">50.0</td><td className="border border-[#e5e7eb] px-4 py-2">6</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">100.0</td><td className="border border-[#e5e7eb] px-4 py-2">3</td></tr>
                                        <tr><td className="border border-[#e5e7eb] px-4 py-2">300.0</td><td className="border border-[#e5e7eb] px-4 py-2">1</td></tr>
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
                    {avgBOD && (
                        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden mb-4">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4">
                                <h3 className="font-bold text-white text-sm">Average BOD₅ Result</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-4xl font-bold text-green-600">{avgBOD}</div>
                                <div className="text-sm text-[#6b7280] mt-1">mg/L</div>
                                <div className="text-xs text-[#6b7280] mt-2">Based on {validResults.length} sample(s)</div>
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
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-green-50 text-green-600 font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
