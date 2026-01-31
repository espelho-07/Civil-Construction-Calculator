import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// Standards Data for BOD
const STANDARDS_DATA = {
    'IS': {
        code: 'IS 3025 (Part 44)',
        title: 'IS 3025 (Part 44) : 1993',
        desc: 'Biochemical Oxygen Demand (BOD) is the amount of dissolved oxygen required by aerobic biological organisms to break down organic material present in a given water sample.',
        details: 'The test is carried out at 27°C for 3 days or 20°C for 5 days. This calculator uses the standard 5-day incubation at 20°C method.',
        formula: 'BOD₅ = (D₁ - D₂) / P  or  [(D₁ - D₂) - (B₁ - B₂) × f] / P',
        importance: [
            { title: 'Water Quality', text: 'Principal test for biodegradable organic matter.' },
            { title: 'Waste Treatment', text: 'Determines strength of sewage/effluents.' },
            { title: 'Compliance', text: 'Mandatory parameter for pollution control norms.' }
        ]
    },
    'ASTM': {
        code: 'ASTM D5210',
        title: 'ASTM D5210 / D888',
        desc: 'Standard Test Method for Determining the Biochemical Oxygen Demand (BOD) of Unfiltered and Filtered Water and Wastewater.',
        details: 'Measures the dissolved oxygen consumed by microbial life while assimilating and oxidizing the organic matter present. Incubation is for 5 days at 20°C.',
        formula: 'BOD = (D1 - D2 - SC) / P',
        importance: [
            { title: 'Regulatory', text: 'Used for EPA NPDES compliance reporting.' },
            { title: 'Process Control', text: 'Evaluates efficiency of treatment plants.' }
        ]
    },
    'BS': {
        code: 'BS EN 1899',
        title: 'BS EN 1899-1',
        desc: 'Water quality - Determination of biochemical oxygen demand after n days (BODn). Part 1: Dilution and seeding method.',
        details: 'Applicable to all waters having BOD greater than 3 mg/L. Uses a 5-day incubation period at 20°C.',
        formula: 'BOD₅ = [(C₁ - C₂) - (Vₜ - Vₑ)/Vₜ × (C₃ - C₄)] × Vₜ/Vₑ',
        importance: [
            { title: 'Environmental Assessment', text: 'Assess impact of discharges on receiving waters.' },
            { title: 'Design', text: 'Basis for sizing biological treatment units.' }
        ]
    },
    'EN': {
        code: 'EN 1899-1',
        title: 'EN 1899-1 : 1998',
        desc: 'European Standard for determination of BOD by dilution and seeding.',
        details: 'Specifies determination of BOD5 or BOD7. This calculator assumes standard 5-day test (BOD5).',
        formula: 'BOD₅ = fgt × (C₁ - C₂)',
        importance: [
            { title: 'Monitoring', text: 'Routine monitoring of water bodies.' },
            { title: 'Industrial', text: 'Characterization of industrial effluents.' }
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

export default function BODCalculator() {
    const theme = getThemeClasses('emerald');
    const [standard, setStandard] = useState('IS');

    // Sample data - 6 samples
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
    const currentStd = STANDARDS_DATA[standard];

    const updateSample = (index, field, value) => {
        const newSamples = [...samples];
        newSamples[index][field] = value;
        setSamples(newSamples);
    };

    useEffect(() => {
        // Calculate BOD using general dilution method formula
        // BOD = [(D1 - D2) - (B1 - B2)] * DF
        // Matches logic across standards (with variable notations)
        const newResults = samples.map((sample) => {
            const D1 = parseFloat(sample.d1Sample) || 0;  // Initial DO Sample
            const D5 = parseFloat(sample.d5Sample) || 0;  // Final DO Sample
            const B1 = parseFloat(sample.d1Blank) || 0;   // Initial DO Blank
            const B5 = parseFloat(sample.d5Blank) || 0;   // Final DO Blank
            const DF = parseFloat(sample.dilution) || 0;  // Dilution Factor

            if (D1 > 0 && DF > 0) {
                // Seed correction: (B1 - B2) * f
                // Simplified here: (D1-D2) - (B1-B2) is standard seed correction if dilution water is seeded
                const depletionSample = D1 - D5;
                const depletionBlank = B1 - B5;

                // If blank depletion is negligible (<0.2) it is often ignored, but we calculate strictly
                // BOD = (DepletionSample - DepletionBlank) * DF
                let bod = (depletionSample - depletionBlank) * DF;

                // Basic validation
                if (bod < 0) bod = 0;

                return bod > 0 ? bod.toFixed(2) : '0.00';
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
        setSamples(samples.map(s => ({ d1Blank: '', d1Sample: '', d5Blank: '', d5Sample: '', dilution: '', blankCorrn: '' })));
        setResults([]);
    };

    const relatedCalculators = [
        { name: 'Chemical Oxygen Demand', icon: 'fa-flask', slug: '/cod-calculator' },
        { name: 'Biochemical Oxygen Demand', icon: 'fa-vial', slug: '/bod-calculator', active: true },
        { name: 'Ammonical Nitrogen Test', icon: 'fa-atom', slug: '/ammonical-nitrogen' },
    ];

    // Get average BOD
    const validResults = results.filter(r => r !== null && r !== '0.00');
    const avgBOD = validResults.length > 0
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

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">BOD Calculator - {currentStd.title}</h1>
                            <p className="text-[#6b7280]">Calculate Biochemical Oxygen Demand of wastewater samples</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="bod-calculator"
                            calculatorName="BOD Calculator"
                            calculatorIcon="fa-vial"
                            category="Environmental Engineering"
                            inputs={{ samples, standard }}
                            outputs={{ results, avgBOD }}
                        />
                    </div>

                    {/* Calculator Table */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 ${theme.bg}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-vial text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">BIOCHEMICAL OXYGEN DEMAND</h3>
                                        <p className="text-white/80 text-xs">Test Period: 5 Days @ 20°C ({currentStd.code})</p>
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
                                                    Initial Sample D.O. (D₁) <InfoTooltip text="Dissolved Oxygen of diluted sample on Day 1 (mg/L)" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d1Sample}
                                                        onChange={(e) => updateSample(i, 'd1Sample', e.target.value)}
                                                        placeholder="mg/L"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Final Sample D.O. (D₂) <InfoTooltip text="Dissolved Oxygen of sample after 5 days (mg/L)" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d5Sample}
                                                        onChange={(e) => updateSample(i, 'd5Sample', e.target.value)}
                                                        placeholder="mg/L"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Initial Blank D.O. (B₁) <InfoTooltip text="Dissolved Oxygen of blank on Day 1 (mg/L)" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d1Blank}
                                                        onChange={(e) => updateSample(i, 'd1Blank', e.target.value)}
                                                        placeholder="mg/L"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Final Blank D.O. (B₂) <InfoTooltip text="Dissolved Oxygen of blank after 5 days (mg/L)" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.d5Blank}
                                                        onChange={(e) => updateSample(i, 'd5Blank', e.target.value)}
                                                        placeholder="mg/L"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2`}>
                                                <div className="flex items-center">
                                                    Dilution Factor <InfoTooltip text="Vol. of Bottle / Vol. of Sample" theme={theme} />
                                                </div>
                                            </td>
                                            {samples.map((sample, i) => (
                                                <td key={i} className={`border ${theme.border} px-2 py-1`}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={sample.dilution}
                                                        onChange={(e) => updateSample(i, 'dilution', e.target.value)}
                                                        placeholder="DF"
                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center text-sm ${theme.focus} focus:ring-2 focus:ring-emerald-100/50 outline-none`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className={`${theme.bgLight}`}>
                                            <td className={`border ${theme.border} px-3 py-2 font-semibold`}>BOD₅ (mg/L)</td>
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
                            About BOD ({currentStd.code})
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
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p>Standard Dilution Method (5 Day, 20°C)</p>
                            </div>
                        </div>
                    </section>

                    {/* Importance Section */}
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

                    {/* Ad Slot - Inline */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 ${theme.bg} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-vial text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">BOD Calculator</h3>
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
                            {avgBOD && (
                                <div className={`bg-gradient-to-br ${theme.bgSoft} to-white rounded-xl p-4 border ${theme.border} text-center`}>
                                    <h3 className="font-bold text-[#6b7280] text-xs uppercase mb-2">Average BOD₅</h3>
                                    <div className={`text-4xl font-bold ${theme.text} mb-1`}>{avgBOD}</div>
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
