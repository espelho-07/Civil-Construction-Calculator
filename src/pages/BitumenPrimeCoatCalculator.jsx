import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// Standards Data for Prime Coat
const STANDARDS_DATA = {
    'IS': {
        code: 'IS : 8887',
        title: 'IS : 8887',
        clause: 'Clause 502 of MORT&H',
        desc: 'A prime coat is an application of a low viscosity liquid bituminous material to a granular base/sub-base prepared to the specified grade and camber. It helps in binding the granular particles of the base course and provides adhesion between the base and the bituminous layer.',
        material: 'The primer used is cutback bitumen conforming to IS: 8887 or emulsion grade bitumen SS-1. The selection of grade depends on the porosity of the surface.',
        tables: [
            {
                title: 'Emulsion Bitumen',
                headers: ['Type of Surface', 'Rate of Spray (kg/sqm)'],
                rows: [
                    ['WMM / WBM', '0.7 - 1.0'],
                    ['Bituminous Surface (Other than Macadam)', '0.0 - 1.2'],
                    ['Stabilized Soil bases (Crusher Run Macadam)', '0.0 - 0.9']
                ]
            },
            {
                title: 'Cutback Bitumen',
                headers: ['Type of Surface', 'Cutback Type', 'Rate (kg/sqm)'],
                rows: [
                    ['WMM / WBM', 'MC 30', '0.6 - 0.9'],
                    ['Bituminous Surface', 'MC 70', '0.9 - 1.2']
                ]
            }
        ],
        importance: [
            { title: 'Binding', text: 'Binds loose particles of the granular base' },
            { title: 'Waterproofing', text: 'Provides waterproofing to the base course' },
            { title: 'Adhesion', text: 'Creates bond between granular base and bituminous layer' },
            { title: 'Penetration', text: 'Penetrates into the base to strengthen it' },
            { title: 'Protection', text: 'Protects the base from weather during construction' }
        ]
    },
    'ASTM': {
        code: 'ASTM D2028',
        title: 'ASTM D2028 / D2397',
        clause: 'ASTM D2995',
        desc: 'Prime coat is an application of low-viscosity asphalt to a granular base to prepare it for an asphalt surface layer. It is designed to penetrate, plug voids, and harden the surface.',
        material: 'Cutback asphalt (MC-30, MC-70) per ASTM D2028 or Emulsified asphalt (AE-P, SS-1h) per ASTM D2397.',
        tables: [
            {
                title: 'Emulsified Asphalt / Cutback',
                headers: ['Base Type', 'Rate (gal/yd²)', 'Rate approx (kg/m²)'],
                rows: [
                    ['Tight Surface (Stabilized)', '0.10 - 0.30', '0.45 - 1.35'],
                    ['Open Surface (Coarse Aggregate)', '0.30 - 0.50', '1.35 - 2.25']
                ]
            }
        ],
        importance: [
            { title: 'Base Hardening', text: 'Toughens the granular base surface to withstand construction traffic.' },
            { title: 'Dust Control', text: 'Coats and bonds loose dust and fines.' },
            { title: 'Moisture Seal', text: 'Prevents capillary rise of water from the subgrade.' }
        ]
    },
    'BS': {
        code: 'BS 434',
        title: 'BS 434 / BS 3690',
        clause: 'BS 594987',
        desc: 'Treatment of a granular surface with a bituminous binder to promote adhesion between the base and the subsequent asphalt layer.',
        material: 'Low viscosity cutback bitumens or specific prime coat emulsions (e.g., K1-70) complying with BS 434.',
        tables: [
            {
                title: 'Bituminous Spray Rates',
                headers: ['Surface Assessment', 'Target Rate (kg/m²)'],
                rows: [
                    ['Open texture / Porous', '0.9 - 1.4'],
                    ['Close texture / Dense', '0.6 - 0.9'],
                    ['Stabilized Soil', '0.4 - 0.7']
                ]
            }
        ],
        importance: [
            { title: 'Surface Sealing', text: 'Seals the surface voids of the sub-base.' },
            { title: 'Adhesion Promotion', text: 'Ensures structural continuity.' }
        ]
    },
    'EN': {
        code: 'EN 13808',
        title: 'EN 13808',
        clause: 'EN 12697',
        desc: 'Application of cationic bituminous emulsion or fluxed bitumen to prepare unbound mixtures for asphalt overlay.',
        material: 'Cationic bituminous emulsions (C60B4-P) or other penetrating grades defined in EN 13808.',
        tables: [
            {
                title: 'Application Rates',
                headers: ['Surface Texture', 'Rate (kg/m²)'],
                rows: [
                    ['Low Porosity', '0.5 - 0.8'],
                    ['Medium Porosity', '0.8 - 1.2'],
                    ['High Porosity', '1.2 - 1.5']
                ]
            }
        ],
        importance: [
            { title: 'Interface Bonding', text: 'Critical for shear transfer mechanism.' },
            { title: 'Base Protection', text: 'Temporary protection against water ingress.' }
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
                className="w-4 h-4 bg-gray-600 text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
            >
                i
            </button>
            {show && (
                <div className="absolute left-6 top-0 z-50 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-xs text-[#0A0A0A] leading-relaxed text-justify">
                    {text}
                </div>
            )}
        </div>
    );
}

// Dual input component for Feet+Inches or Meter+Centimeter
function DualInput({ label, unit, valuePrimary, valueSecondary, onChangePrimary, onChangeSecondary, placeholder1, placeholder2, infoText, theme }) {
    const primaryUnit = unit === 'ft' ? 'Feet' : 'Meter';
    const secondaryUnit = unit === 'ft' ? 'Inch' : 'cm';

    return (
        <div className="mb-3">
            <div className="flex items-center mb-1">
                <label className="text-xs text-[#6b7280]">{label}</label>
                {infoText && <InfoTooltip text={infoText} theme={theme} />}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                    <input
                        type="number"
                        placeholder={placeholder1}
                        value={valuePrimary}
                        onChange={(e) => onChangePrimary(e.target.value)}
                        className={`w-full px-3 py-2 pr-12 border border-[#e5e7eb] rounded-lg outline-none ${theme ? theme.focus : 'focus:border-blue-600'} focus:ring-2 focus:ring-zinc-100/50 text-sm`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">{primaryUnit}</span>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        placeholder={placeholder2}
                        value={valueSecondary}
                        onChange={(e) => onChangeSecondary(e.target.value)}
                        className={`w-full px-3 py-2 pr-12 border border-[#e5e7eb] rounded-lg outline-none ${theme ? theme.focus : 'focus:border-blue-600'} focus:ring-2 focus:ring-zinc-100/50 text-sm`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">{secondaryUnit}</span>
                </div>
            </div>
        </div>
    );
}

export default function BitumenPrimeCoatCalculator() {
    const theme = getThemeClasses('zinc');
    const [standard, setStandard] = useState('IS');
    const [unit, setUnit] = useState('m');
    const [surfaceType, setSurfaceType] = useState('WMM / WBM');

    // Length
    const [lengthMain, setLengthMain] = useState('');
    const [lengthSub, setLengthSub] = useState('');

    // Breadth
    const [breadthMain, setBreadthMain] = useState('');
    const [breadthSub, setBreadthSub] = useState('');

    // Rate of Spray
    const [rateOfSpray, setRateOfSpray] = useState('0.7');

    const [result, setResult] = useState(null);
    const sidebarRef = useRef(null);

    // Get current standard data
    const currentStd = STANDARDS_DATA[standard] || STANDARDS_DATA['IS'];

    // Convert to meters
    const toMeters = (primary, secondary) => {
        const p = parseFloat(primary) || 0;
        const s = parseFloat(secondary) || 0;
        if (unit === 'm') {
            return p + (s / 100); // meter + cm to meters
        } else {
            return (p + (s / 12)) * 0.3048; // feet + inches to meters
        }
    };

    useEffect(() => {
        const length = toMeters(lengthMain, lengthSub);
        const breadth = toMeters(breadthMain, breadthSub);
        const rate = parseFloat(rateOfSpray) || 0;

        if (length > 0 && breadth > 0 && rate > 0) {
            const area = length * breadth;
            const quantity = area * rate;

            setResult({
                area: area.toFixed(2),
                quantity: quantity.toFixed(2),
            });
        } else {
            setResult(null);
        }
    }, [lengthMain, lengthSub, breadthMain, breadthSub, rateOfSpray, unit]);

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

    // Helper: Get all unique surface types for current standard
    const getSurfaceOptions = () => {
        const options = new Set();
        if (currentStd.tables) {
            currentStd.tables.forEach(table => {
                table.rows.forEach(row => {
                    if (row[0]) options.add(row[0]);
                });
            });
        }
        return Array.from(options).map(s => ({ value: s, label: s }));
    };

    const surfaceOptions = getSurfaceOptions();

    // Set default rate on standard change AND update surface type to first available
    useEffect(() => {
        if (currentStd && currentStd.tables && currentStd.tables[0].rows[0]) {
            const row = currentStd.tables[0].rows[0];
            // Set default surface
            setSurfaceType(row[0]);

            // Set default rate
            const rateStr = row[row.length - 1]; // Last column is usually rate
            const match = rateStr.match(/[\d\.]+/); // Extract first number
            if (match) setRateOfSpray(match[0]);
        }
    }, [standard]);

    const reset = () => {
        setLengthMain(''); setLengthSub('');
        setBreadthMain(''); setBreadthSub('');
        if (surfaceOptions.length > 0) setSurfaceType(surfaceOptions[0].value);
        setRateOfSpray('0.7');
        setResult(null);
    };

    const relatedCalculators = [
        { name: 'Bitumen Prime Coat', icon: 'fa-fill-drip', slug: '/bitumen-prime-coat', active: true },
        { name: 'Bitumen Tack Coat', icon: 'fa-brush', slug: '/bitumen-tack-coat' },
    ];

    const standardOptions = [
        { value: 'IS', label: '🇮🇳 IS - Indian Standard' },
        { value: 'ASTM', label: '🇺🇸 ASTM - American' },
        { value: 'BS', label: '🇬🇧 BS - British Standard' },
        { value: 'EN', label: '🇪🇺 EN - European Standard' }
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="road-construction" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Bitumen Calculator (Prime Coat) - {currentStd.title}</h1>
                        <CalculatorActions
                            calculatorSlug="bitumen-prime-coat"
                            calculatorName="Bitumen Prime Coat Calculator"
                            calculatorIcon="fa-fill-drip"
                            category="Road Construction"
                            inputs={{ unit, surfaceType, lengthMain, lengthSub, breadthMain, breadthSub, rateOfSpray, standard }}
                            outputs={result || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate bitumen quantity for prime coat application on road surfaces</p>

                    {/* What is Bitumen Prime Coat? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Bitumen Prime Coat?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                {currentStd.desc}
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                {currentStd.material}
                            </p>
                        </div>
                    </section>

                    {/* Rate Tables - Dynamic */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Spray Rate Reference ({currentStd.code})
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            {currentStd.tables.map((table, tIdx) => (
                                <div key={tIdx} className={tIdx > 0 ? "mt-6" : ""}>
                                    <h3 className="font-semibold text-[#0A0A0A] mb-3">{table.title}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border border-[#e5e7eb]">
                                            <thead className="bg-[#f8f9fa]">
                                                <tr>
                                                    {table.headers.map((h, hIdx) => (
                                                        <th key={hIdx} className="border border-[#e5e7eb] px-4 py-2 text-left">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {table.rows.map((row, rIdx) => (
                                                    <tr key={rIdx}>
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className={`border border-[#e5e7eb] px-4 py-2 ${(cIdx === row.length - 1 && rIdx === 0) ? `font-semibold ${theme.text}` : ''}`}>{cell}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Formula Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Formula
                        </h2>
                        <div className={`bg-gradient-to-r ${theme.bgSoft} to-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-4">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]"><span className={`${theme.text}`}>Area</span> = Length × Breadth</code>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm text-sm">
                                    <code className="font-mono text-[#0A0A0A]"><span className={theme.text}>Quantity of Bitumen</span> = Area × Rate of Spray</code>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Importance Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-check-circle ${theme.text}`}></i>
                            Importance of Prime Coat
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

                {/* Sidebar - Calculator */}
                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        {/* Calculator Header */}
                        <div className={`px-5 py-4 ${theme.bg} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-fill-drip text-white"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Prime Coat Calculator</h3>
                                    <p className="text-white/80 text-xs">{currentStd.code}</p>
                                </div>
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

                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <div className="flex items-center mb-1">
                                    <label className="text-xs text-[#6b7280]">Unit</label>
                                    <InfoTooltip text="Switch between Meter/cm and Feet/Inch input modes" theme={theme} />
                                </div>
                                <div className="flex bg-[#f0f0f0] rounded-lg p-1">
                                    <button onClick={() => setUnit('m')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${unit === 'm' ? `${theme.bg} text-white shadow` : 'text-[#6b7280]'}`}>
                                        Meter
                                    </button>
                                    <button onClick={() => setUnit('ft')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${unit === 'ft' ? `${theme.bg} text-white shadow` : 'text-[#6b7280]'}`}>
                                        Feet
                                    </button>
                                </div>
                            </div>

                            {/* Surface Type */}
                            <div className="mb-3">
                                <div className="flex items-center mb-1">
                                    <label className="text-xs text-[#6b7280]">Type of Surface</label>
                                    <InfoTooltip text="Select the base surface type." theme={theme} />
                                </div>
                                <CustomDropdown
                                    options={surfaceOptions}
                                    value={surfaceType}
                                    onChange={(newVal) => {
                                        setSurfaceType(newVal);
                                        // Auto-select rate heuristic
                                        if (currentStd.tables) {
                                            for (let table of currentStd.tables) {
                                                const row = table.rows.find(r => r[0] === newVal);
                                                if (row) {
                                                    const rateStr = row[row.length - 1];
                                                    const match = rateStr.match(/[\d\.]+/);
                                                    if (match) {
                                                        setRateOfSpray(match[0]);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    theme={theme}
                                />
                            </div>

                            {/* Length */}
                            <DualInput
                                label="Length"
                                unit={unit}
                                valuePrimary={lengthMain}
                                valueSecondary={lengthSub}
                                onChangePrimary={setLengthMain}
                                onChangeSecondary={setLengthSub}
                                placeholder1="0"
                                placeholder2="0"
                                infoText="Enter the length of the road surface to be primed"
                                theme={theme}
                            />

                            {/* Breadth */}
                            <DualInput
                                label="Breadth"
                                unit={unit}
                                valuePrimary={breadthMain}
                                valueSecondary={breadthSub}
                                onChangePrimary={setBreadthMain}
                                onChangeSecondary={setBreadthSub}
                                placeholder1="0"
                                placeholder2="0"
                                infoText="Enter the breadth/width of the road surface"
                                theme={theme}
                            />

                            {/* Rate of Spray */}
                            <div className="mb-4">
                                <div className="flex items-center mb-1">
                                    <label className="text-xs text-[#6b7280]">Rate of Spray</label>
                                    <InfoTooltip text={`Spray rate (${currentStd.code})`} theme={theme} />
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={rateOfSpray}
                                        onChange={(e) => setRateOfSpray(e.target.value)}
                                        placeholder="0.7"
                                        className={`w-full px-3 py-2 pr-16 border border-[#e5e7eb] rounded-lg outline-none ${theme.focus} focus:ring-2 focus:ring-zinc-100/50 text-sm`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">kg/sq.m</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 mb-4">
                                <button onClick={reset} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                    <i className="fas fa-redo mr-1"></i> Reset
                                </button>
                            </div>

                            {/* Results */}
                            {result && (
                                <div className={`bg-gradient-to-br ${theme.bgSoft} to-white rounded-xl p-4 border ${theme.border}`}>
                                    <div className="text-center mb-3">
                                        <div className="text-xs text-[#6b7280] mb-1">Quantity of Bitumen</div>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{result.quantity} Kgs</div>
                                    </div>
                                    <div className="text-center text-sm text-[#6b7280]">
                                        Area = <span className="font-semibold text-[#0A0A0A]">{result.area} m²</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Calculators */}
                    <div className="bg-white rounded-xl p-4 border border-[#e5e7eb] mt-4">
                        <h4 className="font-semibold text-[#0A0A0A] text-sm mb-3 flex items-center gap-2">
                            <i className="fas fa-road text-gray-600"></i>
                            Road Construction
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
