import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { ENVIRONMENTAL_NAV } from '../constants/calculatorRoutes';

// Standards Data for Ammonical Nitrogen
const STANDARDS_DATA = {
    'IS': {
        code: 'IS 3025 (Part 34)',
        title: 'IS 3025 (Part 34) : 1988',
        desc: 'Determination of Ammonical Nitrogen in water and wastewater. The method involves distillation followed by titration.',
        details: 'The sample is buffered at pH 9.5 and distilled. The ammonia distillate is absorbed in boric acid and titrated with standard sulfuric acid.',
        formula: 'NH₃-N (mg/L) = (A - B) × N × 14000 / V',
        importance: [
            { title: 'Toxicity', text: 'Ammonia is toxic to aquatic life even at low concentrations.' },
            { title: 'Indicator', text: 'Indicates fresh sewage pollution.' }
        ]
    },
    'ASTM': {
        code: 'ASTM D1426',
        title: 'ASTM D1426',
        desc: 'Standard Test Methods for Ammonia Nitrogen in Water.',
        details: 'Test Method A covers the distillation of the sample followed by titration. Test Method B covers the direct Nesslerization.',
        formula: 'Ammonia Nitrogen = (A - B) × N × 14000 / V',
        importance: [
            { title: 'Water Quality', text: 'Critical for assessing surface water health.' },
            { title: 'Process Control', text: 'Used for chlorination control in treatment.' }
        ]
    },
    'BS': {
        code: 'BS 6068-2.11',
        title: 'BS 6068 / ISO 5664',
        desc: 'Water quality. Determination of ammonium. Distillation and titration method.',
        details: 'Specifies a method for the determination of ammonium in raw, potable and waste water.',
        formula: 'ρN = (V₁ - V₀) × c × 14000 / V₂',
        importance: [
            { title: 'Regulatory', text: 'Compliance with discharge consents.' },
            { title: 'Environmental', text: 'Prevents eutrophication in receiving waters.' }
        ]
    },
    'EN': {
        code: 'EN ISO 11732',
        title: 'EN ISO 11732',
        desc: 'Water quality - Determination of ammonium nitrogen - Method by flow analysis (CFA and FIA).',
        details: 'While modern labs use flow analysis, this calculator simulates the classic distillation and titration method used for reference.',
        formula: 'NH₄-N = (V_sample - V_blank) × c(H⁺) × M(N) / V_test',
        importance: [
            { title: 'Standards', text: 'Reference method for water analysis directives.' },
            { title: 'Monitoring', text: 'Routine surveillance of wastewater plants.' }
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

export default function AmmonicalNitrogenCalculator() {
    const theme = getThemeClasses('emerald');
    const [standard, setStandard] = useState('IS');

    // 3 Tests
    const [tests, setTests] = useState([
        { sampleReading: '', blankReading: '', normality: '', volume: '' },
        { sampleReading: '', blankReading: '', normality: '', volume: '' },
        { sampleReading: '', blankReading: '', normality: '', volume: '' },
    ]);

    const [results, setResults] = useState([]);
    const sidebarRef = useRef(null);
    const currentStd = STANDARDS_DATA[standard];

    const updateTest = (index, field, value) => {
        const newTests = [...tests];
        newTests[index][field] = value;
        setTests(newTests);
    };

    useEffect(() => {
        // Calculate Ammonical Nitrogen
        // Formula: (A - B) * N * 14 * 1000 / V
        // 14 is atomic weight of Nitrogen. 1000 converts to Liters (if V is mL, which it is)
        // So factor is 14000.
        // If N=0.02, 0.02*14000 = 280.
        const newResults = tests.map((test) => {
            const A = parseFloat(test.sampleReading) || 0; // Sample Titrant
            const B = parseFloat(test.blankReading) || 0;  // Blank Titrant
            const N = parseFloat(test.normality) || 0;     // Normality
            const V = parseFloat(test.volume) || 0;        // Volume

            if (A >= 0 && B >= 0 && N > 0 && V > 0) {
                // If A < B, result is 0 (no ammonia) or error
                const diff = A - B > 0 ? A - B : 0;

                const ammonia = (diff * N * 14000) / V;
                return ammonia.toFixed(2);
            }
            return null;
        });
        setResults(newResults);
    }, [tests, standard]);

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
        setTests(tests.map(t => ({ sampleReading: '', blankReading: '', normality: '', volume: '' })));
        setResults([]);
    };

    const relatedCalculators = [
        { name: 'Chemical Oxygen Demand', icon: 'fa-flask', slug: '/cod-calculator' },
        { name: 'Biochemical Oxygen Demand', icon: 'fa-vial', slug: '/bod-calculator' },
        { name: 'Ammonical Nitrogen Test', icon: 'fa-atom', slug: '/ammonical-nitrogen', active: true },
    ];

    // Get average result
    const validResults = results.filter(r => r !== null && r !== '0.00');
    const avgResult = validResults.length > 0
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Ammonical Nitrogen - {currentStd.title}</h1>
                            <p className="text-[#6b7280]">Calculate ammonical nitrogen content in water samples</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="ammonical-nitrogen"
                            calculatorName="Ammonical Nitrogen Calculator"
                            calculatorIcon="fa-atom"
                            category="Environmental Engineering"
                            inputs={{ tests, standard }}
                            outputs={{ results: results || [] }}
                        />
                    </div>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 ${theme.bg}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-atom text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">AMMONICAL NITROGEN</h3>
                                        <p className="text-white/80 text-xs">Method: Distillation & Titration ({currentStd.code})</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f9fa]">
                                            <th className={`border ${theme.border} px-3 py-2 text-left`}>Parameter</th>
                                            <th className={`border ${theme.border} px-3 py-2 text-center`}>Test-I</th>
                                            <th className={`border ${theme.border} px-3 py-2 text-center`}>Test-II</th>
                                            <th className={`border ${theme.border} px-3 py-2 text-center`}>Test-III</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Sample Reading (A) <InfoTooltip text="Titration reading for sample in mL of H₂SO₄ used" theme={theme} />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={test.sampleReading}
                                                        onChange={(e) => updateTest(i, 'sampleReading', e.target.value)}
                                                        placeholder="ml"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Blank Reading (B) <InfoTooltip text="Titration reading for blank in mL of H₂SO₄ used" theme={theme} />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={test.blankReading}
                                                        onChange={(e) => updateTest(i, 'blankReading', e.target.value)}
                                                        placeholder="ml"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Normality of H₂SO₄ (N) <InfoTooltip text="Normality of Standard Sulphuric Acid (e.g., 0.02 N)" theme={theme} />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={test.normality}
                                                        onChange={(e) => updateTest(i, 'normality', e.target.value)}
                                                        placeholder="N"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Sample Volume <InfoTooltip text="Volume of water sample taken for distillation (mL)" theme={theme} />
                                                </div>
                                            </td>
                                            {tests.map((test, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={test.volume}
                                                        onChange={(e) => updateTest(i, 'volume', e.target.value)}
                                                        placeholder="ml"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className={`${theme.bgLight}`}>
                                            <td className={`border ${theme.border} px-3 py-2 font-semibold`}>NH₃-N (mg/L)</td>
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
                            About Ammonical Nitrogen ({currentStd.code})
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

                    {/* Importance */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-check-circle ${theme.text}`}></i>
                            Importance
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ul className="space-y-3">
                                {currentStd.importance && currentStd.importance.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <i className={`fas fa-check ${theme.text} mt-1`}></i>
                                        <span><strong>{item.title}:</strong> {item.text}</span>
                                    </li>
                                ))}
                            </ul>
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

                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 ${theme.bg} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-atom text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">NH₃-N Calculator</h3>
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
                            {avgResult && (
                                <div className={`bg-gradient-to-br ${theme.bgSoft} to-white rounded-xl p-4 border ${theme.border} text-center`}>
                                    <h3 className="font-bold text-[#6b7280] text-xs uppercase mb-2">Average NH₃-N</h3>
                                    <div className={`text-4xl font-bold ${theme.text} mb-1`}>{avgResult}</div>
                                    <div className="text-sm text-[#6b7280]">mg/L</div>
                                    <div className="text-xs text-[#6b7280] mt-2 border-t border-dashed border-gray-200 pt-2">
                                        Based on {validResults.length} test(s)
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
