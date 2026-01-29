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

// Dual input component for Feet+Inches or Meter+Centimeter
function DualInput({ label, unit, valuePrimary, valueSecondary, onChangePrimary, onChangeSecondary, placeholder1, placeholder2, infoText }) {
    const primaryUnit = unit === 'ft' ? 'Feet' : 'Meter';
    const secondaryUnit = unit === 'ft' ? 'Inch' : 'cm';

    return (
        <div className="mb-3">
            <div className="flex items-center mb-1">
                <label className="text-xs text-[#6b7280]">{label}</label>
                {infoText && <InfoTooltip text={infoText} />}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                    <input
                        type="number"
                        placeholder={placeholder1}
                        value={valuePrimary}
                        onChange={(e) => onChangePrimary(e.target.value)}
                        className="w-full px-3 py-2 pr-12 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC] text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">{primaryUnit}</span>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        placeholder={placeholder2}
                        value={valueSecondary}
                        onChange={(e) => onChangeSecondary(e.target.value)}
                        className="w-full px-3 py-2 pr-12 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC] text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280]">{secondaryUnit}</span>
                </div>
            </div>
        </div>
    );
}

export default function BitumenPrimeCoatCalculator() {
    const [unit, setUnit] = useState('m');
    const [surfaceType, setSurfaceType] = useState('WMM/WBM');

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

    const reset = () => {
        setLengthMain(''); setLengthSub('');
        setBreadthMain(''); setBreadthSub('');
        setRateOfSpray('0.7');
        setResult(null);
    };

    const relatedCalculators = [
        { name: 'Bitumen Prime Coat', icon: 'fa-fill-drip', slug: '/bitumen-prime-coat', active: true },
        { name: 'Bitumen Tack Coat', icon: 'fa-brush', slug: '#' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="road-construction" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Bitumen Calculator (Prime Coat) - IS : 8887</h1>
                        <CalculatorActions
                            calculatorSlug="bitumen-prime-coat"
                            calculatorName="Bitumen Prime Coat Calculator"
                            calculatorIcon="fa-fill-drip"
                            category="Road Construction"
                            inputs={{ unit, surfaceType, lengthMain, lengthSub, breadthMain, breadthSub, rateOfSpray }}
                            outputs={result || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate bitumen quantity for prime coat application on road surfaces</p>

                    {/* What is Bitumen Prime Coat? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Bitumen Prime Coat?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                A prime coat is an application of a low viscosity liquid bituminous material to a granular base/sub-base prepared to the specified grade and camber. It helps in binding the granular particles of the base course and provides adhesion between the base and the bituminous layer.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The primer used is cutback bitumen conforming to IS:8887 or emulsion grade bitumen. The rate of spray varies from <strong>0.5 to 1.2 kg/sq.m</strong> depending on the type of surface.
                            </p>
                        </div>
                    </section>

                    {/* Rate Tables */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-table text-[#3B68FC]"></i>
                            Spray Rate Reference (IS:8887)
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <h3 className="font-semibold text-[#0A0A0A] mb-3">Emulsion Bitumen</h3>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Type of Surface</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Rate of Spray (kg/sqm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">WMM / WBM</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2 font-semibold text-[#3B68FC]">0.7 - 1.0</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Bituminous Surface (Other than Macadam)</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.0 - 1.2</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Stabilized Soil bases (Crusher Run Macadam)</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.0 - 0.9</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="font-semibold text-[#0A0A0A] mb-3">Cutback Bitumen</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-[#e5e7eb]">
                                    <thead className="bg-[#f8f9fa]">
                                        <tr>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Type of Surface</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Cutback Type</th>
                                            <th className="border border-[#e5e7eb] px-4 py-2 text-left">Rate of Spray (kg/sqm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">WMM / WBM</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">MC 30</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.5 - 0.9</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Bituminous Surface</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">MC 70</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.9 - 1.2</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                            <div className="text-center mb-4">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]"><span className="text-[#3B68FC]">Area</span> = Length × Breadth</code>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm text-sm">
                                    <code className="font-mono text-[#0A0A0A]"><span className="text-green-600">Quantity of Bitumen</span> = Area × Rate of Spray</code>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Importance Section */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-check-circle text-[#3B68FC]"></i>
                            Importance of Prime Coat
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Binding:</strong> Binds loose particles of the granular base</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Waterproofing:</strong> Provides waterproofing to the base course</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Adhesion:</strong> Creates bond between granular base and bituminous layer</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Penetration:</strong> Penetrates into the base to strengthen it</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Protection:</strong> Protects the base from weather during construction</span>
                                </li>
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
                    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden">
                        {/* Calculator Header */}
                        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-fill-drip text-white"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Prime Coat Calculator</h3>
                                    <p className="text-gray-300 text-xs">IS : 8887</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <div className="flex items-center mb-1">
                                    <label className="text-xs text-[#6b7280]">Unit</label>
                                    <InfoTooltip text="Switch between Meter/cm and Feet/Inch input modes" />
                                </div>
                                <div className="flex bg-[#f0f0f0] rounded-lg p-1">
                                    <button onClick={() => setUnit('m')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${unit === 'm' ? 'bg-[#3B68FC] text-white shadow' : 'text-[#6b7280]'}`}>
                                        Meter
                                    </button>
                                    <button onClick={() => setUnit('ft')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${unit === 'ft' ? 'bg-[#3B68FC] text-white shadow' : 'text-[#6b7280]'}`}>
                                        Feet
                                    </button>
                                </div>
                            </div>

                            {/* Surface Type */}
                            <div className="mb-3">
                                <div className="flex items-center mb-1">
                                    <label className="text-xs text-[#6b7280]">Type of Surface</label>
                                    <InfoTooltip text="Select the base surface type. Each type has different spray rate requirements." />
                                </div>
                                <select
                                    value={surfaceType}
                                    onChange={(e) => setSurfaceType(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC] text-sm"
                                >
                                    <option value="WMM/WBM">WMM / WBM</option>
                                    <option value="Bituminous">Bituminous Surface</option>
                                    <option value="Stabilized">Stabilized Soil bases</option>
                                </select>
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
                            />

                            {/* Rate of Spray */}
                            <div className="mb-4">
                                <div className="flex items-center mb-1">
                                    <label className="text-xs text-[#6b7280]">Rate of Spray</label>
                                    <InfoTooltip text="Spray rate in kg/sq.m as per IS:8887. For WMM/WBM use 0.7-1.0 kg/sqm" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={rateOfSpray}
                                        onChange={(e) => setRateOfSpray(e.target.value)}
                                        placeholder="0.7"
                                        className="w-full px-3 py-2 pr-16 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC] text-sm"
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
                                <div className="bg-gradient-to-br from-[#EEF2FF] to-blue-50 rounded-xl p-4 border border-[#3B68FC]/20">
                                    <div className="text-center mb-3">
                                        <div className="text-xs text-[#6b7280] mb-1">Quantity of Bitumen</div>
                                        <div className="text-3xl font-bold text-[#3B68FC]">{result.quantity} Kgs</div>
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
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-[#EEF2FF] text-[#3B68FC] font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
