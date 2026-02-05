import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import MiniNavbar from '../components/MiniNavbar';
import { getThemeClasses } from '../constants/categories';

// Standards Data for COD
const STANDARDS_DATA = {
    'IS': {
        code: 'IS 3025 (Part 58)',
        title: 'IS 3025 (Part 58) : 2006',
        desc: 'Chemical Oxygen Demand (COD) determines the amount of oxygen required to oxidize organic matter in water using a strong chemical oxidant.',
        details: 'Uses the Open Reflux method where sample is refluxed with potassium dichromate and sulfuric acid. Excess dichromate is titrated against FAS.',
        formula: 'COD (mg/L) = (A - B) × N × 8000 / V',
        importance: [
            { title: 'Pollution Strength', text: 'Rapidly determines the organic pollution load.' },
            { title: 'Treatment Design', text: 'Crucial for sizing aeration tanks in ETP/STP.' }
        ]
    },
    'ASTM': {
        code: 'ASTM D1252',
        title: 'ASTM D1252',
        desc: 'Standard Test Methods for Chemical Oxygen Demand (COD) (Dichromate Oxygen Demand) of Water.',
        details: 'Covers the determination of COD in water. Two methods are provided: Macro (Reflux) and Micro (Sealed Tube). This calculator uses the Titrimetric Reflux method.',
        formula: 'COD = (V_blank - V_sample) × N × 8000 / V_sample',
        importance: [
            { title: 'Industrial Waste', text: 'Widely used for monitoring industrial wastewater.' },
            { title: 'Reaction Efficiency', text: 'Measures oxidizability of organic compounds.' }
        ]
    },
    'BS': {
        code: 'BS 6068-2.34',
        title: 'BS 6068 / ISO 6060',
        desc: 'Water quality. Determination of the chemical oxygen demand.',
        details: 'Applicable to water with a COD value between 30 mg/l and 700 mg/l. The chloride content should not exceed 1000 mg/l.',
        formula: 'COD = 8000 × c × (V₁ - V₂) / V₀',
        importance: [
            { title: 'Compliance', text: 'Standard reference for UK environmental compliance.' },
            { title: 'Data Comparison', text: 'Ensures comparability of results across labs.' }
        ]
    },
    'EN': {
        code: 'EN ISO 6060',
        title: 'EN ISO 6060 : 1989',
        desc: 'European Standard for determination of COD using the dichromate method.',
        details: 'Specifies a method for the determination of the chemical oxygen demand of water using potassium dichromate.',
        formula: 'COD = 8000 × C × (V₁ - V₂) / V₀',
        importance: [
            { title: 'EU Directives', text: 'Used for Urban Wastewater Treatment Directive reporting.' },
            { title: 'Process Control', text: 'Key parameter for biological treatment control.' }
        ]
    }
};

// Info Tooltip Component
function InfoTooltip({ text, theme }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block">
            <button
                type="button"
                className={`w-4 h-4 ${theme.bg} text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1`}
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
    const theme = getThemeClasses('emerald');
    const [standard, setStandard] = useState('IS');

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
    const currentStd = STANDARDS_DATA[standard];

    const updateSample = (index, field, value) => {
        const newSamples = [...samples];
        newSamples[index][field] = value;
        setSamples(newSamples);
    };

    useEffect(() => {
        // Calculate COD for each sample
        // COD (mg/L) = (A - B) × N × 8 * 1000 / V
        // 8 is eq wt of Oxygen, 1000 converts to L
        const newResults = samples.map((sample) => {
            const A = parseFloat(sample.fasBlank) || 0; // FAS Blank
            const B = parseFloat(sample.fasUsed) || 0;  // FAS Sample
            const N = parseFloat(sample.normality) || 0;// Normality
            const V = parseFloat(sample.volume) || 0;   // Volume of Sample

            if (A > 0 && B >= 0 && N > 0 && V > 0) {
                const diff = A - B;
                // If B > A, theoretical COD is negative/zero (or interference/error)
                // We'll calculate strictly but clamp negative to 0 or show it? Usually A > B.
                const cod = (diff * N * 8000) / V;

                return cod > 0 ? cod.toFixed(2) : '0.00';
            }
            return null;
        });
        setResults(newResults);
    }, [samples, standard]);

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
        setSamples(samples.map(s => ({ fasBlank: '', fasUsed: '', normality: '', volume: '' })));
        setResults([]);
    };

    const relatedCalculators = [
        { name: 'Chemical Oxygen Demand', icon: 'fa-flask', slug: '/cod-calculator', active: true },
        { name: 'Biochemical Oxygen Demand', icon: 'fa-vial', slug: '/bod-calculator' },
        { name: 'Ammonical Nitrogen Test', icon: 'fa-atom', slug: '/ammonical-nitrogen' },
    ];

    // Get average COD
    const validResults = results.filter(r => r !== null && r !== '0.00');
    const avgCOD = validResults.length > 0
        ? (validResults.reduce((sum, r) => sum + parseFloat(r), 0) / validResults.length).toFixed(2)
        : null;

    const standardOptions = [
        { value: 'IS', label: '🇮🇳 IS - Indian Standard' },
        { value: 'ASTM', label: '🇺🇸 ASTM - American' },
        { value: 'BS', label: '🇬🇧 BS - British Standard' },
        { value: 'EN', label: '🇪🇺 EN - European Standard' }
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="environmental-engineering" />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">COD Calculator - {currentStd.title}</h1>
                            <p className="text-[#6b7280]">Calculate Chemical Oxygen Demand of water samples</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="cod-calculator"
                            calculatorName="COD Calculator"
                            calculatorIcon="fa-flask"
                            category="Environmental Engineering"
                            inputs={{ samples, standard }}
                            outputs={{ results, avgCOD }}
                        />
                    </div>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 ${theme.bg}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-flask text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">CHEMICAL OXYGEN DEMAND</h3>
                                        <p className="text-white/80 text-xs">Method: Open Reflux Titrimetric ({currentStd.code})</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f9fa]">
                                            <th className={`border ${theme.border} px-3 py-2 text-left`}>Parameter</th>
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <th key={i} className={`border ${theme.border} px-3 py-2 text-center`}>Sample-{i}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    FAS for Blank (A) <InfoTooltip text="mL of Ferrous Ammonium Sulphate used for blank titration" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.fasBlank}
                                                        onChange={(e) => updateSample(i, 'fasBlank', e.target.value)}
                                                        placeholder="ml"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    FAS for Sample (B) <InfoTooltip text="mL of FAS used for sample titration" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.fasUsed}
                                                        onChange={(e) => updateSample(i, 'fasUsed', e.target.value)}
                                                        placeholder="ml"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Normality of FAS <InfoTooltip text="Normality of Ferrous Ammonium Sulphate (usually 0.25N)" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={sample.normality}
                                                        onChange={(e) => updateSample(i, 'normality', e.target.value)}
                                                        placeholder="N"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Sample Volume <InfoTooltip text="Volume of sample taken for analysis (mL)" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.volume}
                                                        onChange={(e) => updateSample(i, 'volume', e.target.value)}
                                                        placeholder="ml"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className={`${theme.bgLight}`}>
                                            <td className={`border ${theme.border} px-3 py-2 font-semibold`}>COD (mg/L)</td>
                                            {results.map((result, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-2 text-center font-bold ${theme.text}`}>
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

                    {/* Description */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            About COD ({currentStd.code})
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                {currentStd.desc}
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                {currentStd.details}
                            </p>
                        </div>
                    </section>

                    {/* Reagents & Principle */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-book ${theme.text}`}></i>
                            Principle & Reagents
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                Organic matter is oxidized by boiling with potassium dichromate and sulfuric acid. Excess dichromate is titrated with FAS using ferroin indicator.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <h4 className="font-semibold text-[#0A0A0A] mb-2">Key Reagents</h4>
                                    <ul className="space-y-1 text-sm text-[#6b7280]">
                                        <li>• Potassium Dichromate (0.25N)</li>
                                        <li>• FAS (0.25N)</li>
                                        <li>• Ferroin Indicator</li>
                                        <li>• Silver Sulphate (Catalyst)</li>
                                        <li>• Mercuric Sulphate (Chloride removal)</li>
                                    </ul>
                                </div>
                                <div className={`bg-white rounded-lg p-3 border ${theme.border} text-sm font-mono flex items-center justify-center`}>
                                    Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O
                                </div>
                            </div>
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
                                        {currentStd.formula}
                                    </code>
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
                <div ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="emerald" />

                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 ${theme.bg} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-flask text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">COD Calculator</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            {/* Standard Selector */}
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-1 block font-medium">Standard</label>
                                <CustomDropdown
                                    options={standardOptions}
                                    value={standard}
                                    onChange={setStandard}
                                    theme={theme}
                                />
                            </div>

                            {/* Result Card */}
                            {avgCOD && (
                                <div className={`bg-gradient-to-br ${theme.bgSoft} to-white rounded-xl p-4 border ${theme.border} text-center`}>
                                    <h3 className="font-bold text-[#6b7280] text-xs uppercase mb-2">Average COD</h3>
                                    <div className={`text-4xl font-bold ${theme.text} mb-1`}>{avgCOD}</div>
                                    <div className="text-sm text-[#6b7280]">mg/L</div>
                                    <div className="text-xs text-[#6b7280] mt-2 border-t border-dashed border-gray-200 pt-2">
                                        Based on {validResults.length} sample(s)
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Calculators */}
                    <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
                        <h4 className="font-semibold text-[#0A0A0A] text-sm mb-3 flex items-center gap-2">
                            <i className={`fas fa-leaf ${theme.text}`}></i>
                            Environmental Eng.
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
