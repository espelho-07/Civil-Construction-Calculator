import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

// Standards Data for Tack Coat
const STANDARDS_DATA = {
    'IS': {
        code: 'IS : 8887',
        title: 'IS : 8887',
        clause: 'Clause 503 of MORT&H',
        desc: 'Tack coat is an application of a low viscosity liquid bituminous material to an existing bituminous surface or cement concrete surface or primed granular surface prepared to specified grade and camber.',
        material: 'The binder used for tack coat shall be a bituminous emulsion complying with IS 8887 of a type and grade as specified in the contract or as directed by the engineer.',
        equipment: 'The equipment shall consist of a self-propelled or towed bitumen pressure sprayer, capable of spraying the material uniformly at the specified rate and temperature.',
        rates: [
            { surface: 'Bituminous surfaces', rate: '0.20 - 0.30' },
            { surface: 'Granular surfaces treated with primer', rate: '0.25 - 0.30' },
            { surface: 'Cement concrete pavement', rate: '0.30 - 0.35' }
        ],
        importance: [
            { title: 'Adhesion', text: 'Provides necessary bond between two bituminous layers' },
            { title: 'Slippage', text: 'Prevents slippage of the upper layer' },
            { title: 'Structural', text: 'Ensures the pavement acts as a monolithic structure' }
        ]
    },
    'ASTM': {
        code: 'ASTM D977',
        title: 'ASTM D977 / D2397',
        clause: 'ASTM D2995',
        desc: 'A tack coat is a thin layer of asphalt emulsion applied to an existing surface to ensure a strong bond between the old and new asphalt layers.',
        material: 'Emulsified asphalt (SS-1, SS-1h, CSS-1, CSS-1h) conforming to ASTM D977 or D2397.',
        equipment: 'Pressure distributor capable of applying emulsion at uniform rate and temperature.',
        rates: [
            { surface: 'New Asphalt Surface', rate: '0.05 - 0.15 gal/yd²' },
            { surface: 'Existing Asphalt Surface', rate: '0.05 - 0.15 gal/yd²' },
            { surface: 'Milled Surface', rate: '0.05 - 0.15 gal/yd²' },
            { surface: 'Portland Cement Concrete', rate: '0.05 - 0.15 gal/yd²' }
        ],
        importance: [
            { title: 'Bonding', text: 'Critical for structural integrity of pavement' },
            { title: 'Delamination', text: 'Prevents delamination of layers' }
        ]
    },
    'BS': {
        code: 'BS 434',
        title: 'BS 434 / BS 594987',
        clause: 'BS 594987',
        desc: 'Bond coat (Tack coat) is an application of bituminous emulsion to promote adhesion between layers.',
        material: 'Bitumen emulsion K1-40 or K1-60 complying with BS 434.',
        equipment: 'Mechanical binder distributor ensuring uniform coverage.',
        rates: [
            { surface: 'Newly laid asphalt', rate: '0.15 - 0.35' },
            { surface: 'Old asphalt / Concrete', rate: '0.35 - 0.55' }
        ],
        importance: [
            { title: 'Layer Adhesion', text: 'Prevents horizontal shear failure' },
            { title: 'Waterproofing', text: 'Seals minor cracks in existing surface' }
        ]
    },
    'EN': {
        code: 'EN 13808',
        title: 'EN 13808',
        clause: 'EN 12697',
        desc: 'Bituminous emulsion application for interface bonding.',
        material: 'Cationic bituminous emulsions (C40B4, C60B4) per EN 13808.',
        equipment: ' calibrated sprayer.',
        rates: [
            { surface: 'Smooth / Non-porous', rate: '0.20 - 0.30' },
            { surface: 'Rough / Porous', rate: '0.30 - 0.50' }
        ],
        importance: [
            { title: 'Shear Strength', text: 'Maximizes interface shear strength' },
            { title: 'Durability', text: 'Increases pavement life' }
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
                className={`w-4 h-4 ${theme ? theme.bg : 'bg-gray-600'} text-white rounded-full text-xs flex items-center justify-center cursor-help ml-1`}
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

export default function BitumenTackCoatCalculator() {
    const theme = getThemeClasses('zinc');
    const [standard, setStandard] = useState('IS');
    const [unit, setUnit] = useState('m');
    const [surfaceType, setSurfaceType] = useState('Bituminous surfaces');

    // Length (m/ft)
    const [lengthMain, setLengthMain] = useState('');
    const [lengthSub, setLengthSub] = useState('');

    // Breadth (m/ft)
    const [breadthMain, setBreadthMain] = useState('');
    const [breadthSub, setBreadthSub] = useState('');

    // Rate of Spray (default 0.20)
    const [rateOfSpray, setRateOfSpray] = useState('0.20');

    const [result, setResult] = useState(null);
    const sidebarRef = useRef(null);

    // Get current standard data
    const currentStd = STANDARDS_DATA[standard];

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

            // ft2 display
            const areaFt = area * 10.7639;

            setResult({
                area: area.toFixed(2),
                areaFt: areaFt.toFixed(2),
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

    // Set default rate on standard change
    useEffect(() => {
        if (currentStd && currentStd.rates && currentStd.rates.length > 0) {
            const firstRate = currentStd.rates[0];
            setSurfaceType(firstRate.surface);
            const match = firstRate.rate.match(/[\d\.]+/);
            if (match) setRateOfSpray(match[0]);
        }
    }, [standard]);

    const reset = () => {
        setLengthMain(''); setLengthSub('');
        setBreadthMain(''); setBreadthSub('');
        setRateOfSpray('0.20');
        setResult(null);
    };

    const relatedCalculators = [
        { name: 'Bitumen Prime Coat', icon: 'fa-fill-drip', slug: '/bitumen-prime-coat' },
        { name: 'Bitumen Tack Coat', icon: 'fa-brush', slug: '/bitumen-tack-coat', active: true },
    ];

    // Options for CustomDropdown
    const standardOptions = [
        { value: 'IS', label: '🇮🇳 IS - Indian Standard' },
        { value: 'ASTM', label: '🇺🇸 ASTM - American' },
        { value: 'BS', label: '🇬🇧 BS - British Standard' },
        { value: 'EN', label: '🇪🇺 EN - European Standard' }
    ];

    const surfaceOptions = currentStd.rates.map(item => ({
        value: item.surface,
        label: item.surface
    }));

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="road-construction" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Bitumen Calculator (Tack Coat) - {currentStd.title}</h1>
                        <CalculatorActions
                            calculatorSlug="bitumen-tack-coat"
                            calculatorName="Bitumen Tack Coat Calculator"
                            calculatorIcon="fa-brush"
                            category="Road Construction"
                            inputs={{ unit, surfaceType, lengthMain, lengthSub, breadthMain, breadthSub, rateOfSpray, standard }}
                            outputs={result || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate bitumen quantity for tack coat application between pavement layers</p>

                    {/* What is Bitumen Tack Coat? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Bitumen Tack Coat?
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

                    {/* Rate Tables */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Spray Rate Reference ({currentStd.clause})
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <h3 className="font-semibold text-[#0A0A0A] mb-3">Rate of Spray of Binder (kg per sq.m)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Type of Surface</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Rate (kg/sq.m)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStd.rates.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="border border-[#e5e7eb] px-4 py-2">{item.surface}</td>
                                                <td className={`border border-[#e5e7eb] px-4 py-2 ${idx === 0 ? `font-semibold ${theme.text}` : ''}`}>{item.rate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Construction Requirements */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-hard-hat ${theme.text}`}></i>
                            Construction Equipment
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                {currentStd.equipment}
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
                            <div className="text-center mb-4">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]"><span className={`${theme.text}`}>Area for Bitumen</span> = Length × Breadth</code>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm text-sm">
                                    <code className="font-mono text-[#0A0A0A]"><span className={theme.text}>Total Quantity</span> = Total Area × Rate of Spray</code>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#6b7280]">
                                <p>Where: L = Length in meter, B = Breadth in meter</p>
                                <p className="mt-1">Note: 1 m² = 10.7639 ft²</p>
                            </div>
                        </div>
                    </section>

                    {/* Importance Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-check-circle ${theme.text}`}></i>
                            Importance of Tack Coat
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
                                    <i className="fas fa-brush text-white"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Tack Coat Calculator</h3>
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
                                        // Auto-select rate
                                        const selectedRate = currentStd.rates.find(r => r.surface === newVal);
                                        if (selectedRate) {
                                            const match = selectedRate.rate.match(/[\d\.]+/);
                                            if (match) setRateOfSpray(match[0]);
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
                                infoText="Enter the length of the road surface to be treated"
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
                                        step="0.01"
                                        value={rateOfSpray}
                                        onChange={(e) => setRateOfSpray(e.target.value)}
                                        placeholder="0.20"
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
                                        <div className="text-xs text-[#6b7280] mb-1">Total Quantity</div>
                                        <div className={`text-3xl font-bold ${theme.text}`}>{result.quantity} Kgs</div>
                                    </div>
                                    <div className="text-center text-sm text-[#6b7280]">
                                        Area = <span className="font-semibold text-[#0A0A0A]">{result.area} m²</span> ({result.areaFt} ft²)
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
