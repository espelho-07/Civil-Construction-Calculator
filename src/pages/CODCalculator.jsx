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

export default function CODCalculator() {
    // Sample data - 6 samples
    const [samples, setSamples] = useState([
        { fasBlank: '', fasUsed: '', normality: '', volume: '' },
        { fasBlank: '', fasUsed: '', normality: '', volume: '' },
        { fasBlank: '', fasUsed: '', normality: '', volume: '' },
        { fasBlank: '', fasUsed: '', normality: '', volume: '' },
        { fasBlank: '', fasUsed: '', normality: '', volume: '' },
        { fasBlank: '', fasUsed: '', normality: '', volume: '' },
    ]);

    const [results, setResults] = useState([]);
    const sidebarRef = useRef(null);

    const updateSample = (index, field, value) => {
        const newSamples = [...samples];
        newSamples[index][field] = value;
        setSamples(newSamples);
    };

    useEffect(() => {
        // Calculate COD for each sample
        // COD (mg/L) = (A - B) × N × 8 × 1000 / mL of sample
        // A = mL of FAS used for blank
        // B = mL of FAS used for sample
        // N = Normality of FAS
        const newResults = samples.map((sample) => {
            const A = parseFloat(sample.fasBlank) || 0;
            const B = parseFloat(sample.fasUsed) || 0;
            const N = parseFloat(sample.normality) || 0;
            const V = parseFloat(sample.volume) || 0;

            if (A > 0 && B >= 0 && N > 0 && V > 0) {
                const cod = ((A - B) * N * 8 * 1000) / V;
                return cod.toFixed(2);
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
            { fasBlank: '', fasUsed: '', normality: '', volume: '' },
            { fasBlank: '', fasUsed: '', normality: '', volume: '' },
            { fasBlank: '', fasUsed: '', normality: '', volume: '' },
            { fasBlank: '', fasUsed: '', normality: '', volume: '' },
            { fasBlank: '', fasUsed: '', normality: '', volume: '' },
            { fasBlank: '', fasUsed: '', normality: '', volume: '' },
        ]);
        setResults([]);
    };

    const relatedCalculators = [
        { name: 'Chemical Oxygen Demand', icon: 'fa-flask', slug: '/cod-calculator', active: true },
        { name: 'Biochemical Oxygen Demand', icon: 'fa-vial', slug: '/bod-calculator' },
        { name: 'Ammonical Nitrogen Test', icon: 'fa-atom', slug: '/ammonical-nitrogen' },
    ];

    // Get average COD
    const validResults = results.filter(r => r !== null);
    const avgCOD = validResults.length > 0
        ? (validResults.reduce((sum, r) => sum + parseFloat(r), 0) / validResults.length).toFixed(2)
        : null;

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="environmental-engineering" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Chemical Oxygen Demand (COD) Calculator</h1>
                            <p className="text-[#6b7280]">IS:3025 - Calculate COD of water and wastewater samples</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="cod-calculator"
                            calculatorName="COD Calculator"
                            calculatorIcon="fa-flask"
                            category="Environmental Engineering"
                            inputs={{ samples }}
                            outputs={{ results, avgCOD }}
                        />
                    </div>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-flask text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">CHEMICAL OXYGEN DEMAND</h3>
                                        <p className="text-teal-100 text-xs">Enter values for up to 6 samples</p>
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
                                                    FAS used for blank(A) <InfoTooltip text="mL of Ferrous Ammonium Sulphate used for blank titration" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.fasBlank}
                                                        onChange={(e) => updateSample(i, 'fasBlank', e.target.value)}
                                                        placeholder="ml"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    FAS used for sample(B) <InfoTooltip text="mL of FAS used for sample titration" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.fasUsed}
                                                        onChange={(e) => updateSample(i, 'fasUsed', e.target.value)}
                                                        placeholder="ml"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-3 py-2">
                                                <div className="flex items-center">
                                                    Normality of FAS <InfoTooltip text="Normality of Ferrous Ammonium Sulphate solution (typically 0.25N)" />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={sample.normality}
                                                        onChange={(e) => updateSample(i, 'normality', e.target.value)}
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
                                            {samples.map((sample, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.volume}
                                                        onChange={(e) => updateSample(i, 'volume', e.target.value)}
                                                        placeholder="ml"
                                                        className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm focus:border-[#3B68FC] outline-none"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-teal-50">
                                            <td className="border border-[#e5e7eb] px-3 py-2 font-semibold">COD (mg/L)</td>
                                            {results.map((result, i) => (
                                                <td key={i} className="border border-[#e5e7eb] px-2 py-2 text-center font-bold text-teal-600">
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

                    {/* What is COD? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Chemical Oxygen Demand?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                In environmental chemistry, the chemical oxygen demand (COD) is an indicative measure of the amount of oxygen that can be consumed by reactions in a measured solution. It is commonly expressed in mass of oxygen consumed over volume of solution which in SI units is milligrams per litre (mg/L).
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                COD test is used to determine the amount of organic pollutants in water bodies like lakes, rivers, and wastewater. It makes for an important water quality parameter because it provides an index of the effect of the discharged wastewater on the receiving environment.
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
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Most types of organic matter are oxidized by a boiling mixture of chromic and sulfuric acids. A sample is refluxed in strongly acid solution with a known excess of potassium dichromate (K₂Cr₂O₇). After digestion, the remaining unreduced dichromate is titrated with ferrous ammonium sulphate to determine the amount of dichromate consumed and the oxidizable matter is calculated in terms of oxygen equivalent.
                            </p>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm">
                                <p>2K₂Cr₂O₇ + 8H₂SO₄ → 2K₂SO₄ + 2Cr₂(SO₄)₃ + 8H₂O + 3O₂</p>
                                <p className="mt-2">Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O</p>
                            </div>
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
                                        <span className="text-teal-600">COD (mg/L)</span> = (A - B) × N × 8 × 1000 / mL of sample
                                    </code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p><strong>Where:</strong></p>
                                <p>A = mL of FAS used for blank</p>
                                <p>B = mL of FAS used for sample</p>
                                <p>N = Normality of FAS</p>
                            </div>
                        </div>
                    </section>

                    {/* Apparatus & Reagents */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-vials text-[#3B68FC]"></i>
                            Apparatus & Reagents
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-[#0A0A0A] mb-3">Apparatus</h3>
                                    <ul className="space-y-2 text-sm text-[#6b7280]">
                                        <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> COD reflux apparatus with condenser</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Volumetric Flask</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Pipettes</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-1"></i> Burette</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#0A0A0A] mb-3">Reagents</h3>
                                    <ul className="space-y-2 text-sm text-[#6b7280]">
                                        <li className="flex items-start gap-2"><i className="fas fa-flask text-teal-500 mt-1"></i> Standard potassium dichromate, 0.25 N</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-flask text-teal-500 mt-1"></i> Sulfuric acid - silver sulphate reagent</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-flask text-teal-500 mt-1"></i> Standard Ferrous Ammonium Sulphate (FAS), 0.25 N</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-flask text-teal-500 mt-1"></i> Ferroin indicator</li>
                                        <li className="flex items-start gap-2"><i className="fas fa-flask text-teal-500 mt-1"></i> Mercuric sulphate</li>
                                    </ul>
                                </div>
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
                    {avgCOD && (
                        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden mb-4">
                            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-4">
                                <h3 className="font-bold text-white text-sm">Average COD Result</h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className="text-4xl font-bold text-teal-600">{avgCOD}</div>
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
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
