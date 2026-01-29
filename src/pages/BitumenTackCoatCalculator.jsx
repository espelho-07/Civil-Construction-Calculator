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

export default function BitumenTackCoatCalculator() {
    const [unit, setUnit] = useState('m');
    const [surfaceType, setSurfaceType] = useState('Bituminous');

    // Length
    const [lengthMain, setLengthMain] = useState('');
    const [lengthSub, setLengthSub] = useState('');

    // Breadth
    const [breadthMain, setBreadthMain] = useState('');
    const [breadthSub, setBreadthSub] = useState('');

    // Rate of Spray (default for bituminous surface)
    const [rateOfSpray, setRateOfSpray] = useState('0.20');

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
        setRateOfSpray('0.20');
        setResult(null);
    };

    const relatedCalculators = [
        { name: 'Bitumen Prime Coat', icon: 'fa-fill-drip', slug: '/bitumen-prime-coat' },
        { name: 'Bitumen Tack Coat', icon: 'fa-brush', slug: '/bitumen-tack-coat', active: true },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="road-construction" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Bitumen Calculator (Tack Coat) - IS : 8887</h1>
                        <CalculatorActions
                            calculatorSlug="bitumen-tack-coat"
                            calculatorName="Bitumen Tack Coat Calculator"
                            calculatorIcon="fa-brush"
                            category="Road Construction"
                            inputs={{ unit, surfaceType, lengthMain, lengthSub, breadthMain, breadthSub, rateOfSpray }}
                            outputs={result || {}}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate bitumen quantity for tack coat application between pavement layers</p>

                    {/* What is Bitumen Tack Coat? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Bitumen Tack Coat?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                The work shall consist of the application of a single coat of low viscosity liquid bituminous material to existing bitumen rises, cement concrete or primed granular surface preparatory to the superimposition of a bituminous mix, when specified in the Contract or as instructed by the Engineer.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The binder used for tack coat shall be either Cationic bitumen emulsion (RS-1) complying with IS 8887 or suitable low viscosity paving bitumen of VG-10 grade conforming to IS 73. The rate of application of tack coat shall be as specified in Clause 503 of MORT&H.
                            </p>
                        </div>
                    </section>

                    {/* Rate Tables */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-table text-[#3B68FC]"></i>
                            Spray Rate Reference (Clause 503)
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
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Bituminous surface</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2 font-semibold text-[#3B68FC]">0.20 - 0.30</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Granular surfaces treated with primer</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.25 - 0.30</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-[#e5e7eb] px-4 py-2">Cement concrete pavement</td>
                                            <td className="border border-[#e5e7eb] px-4 py-2">0.30 - 0.35</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Construction Requirements */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-hard-hat text-[#3B68FC]"></i>
                            Construction Equipment
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The primer shall be applied by a self-propelled or towed Bitumen pressure sprayer equipped for spraying the material uniformly at a specified rate. Hand spraying shall not be permitted except in small areas, inaccessible to the distributor, or narrow strips, shall be sprayed with a pressure hand-sprayer or as directed by Engineer.
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
                            <div className="text-center mb-4">
                                <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-sm">
                                    <code className="text-lg font-mono text-[#0A0A0A]"><span className="text-[#3B68FC]">Area for Bitumen</span> = Length × Breadth</code>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm text-sm">
                                    <code className="font-mono text-[#0A0A0A]"><span className="text-green-600">Total Quantity</span> = Total Area × Rate of Spray</code>
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
                            <i className="fas fa-check-circle text-[#3B68FC]"></i>
                            Importance of Tack Coat
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Smooth Ride Surface:</strong> It provides a smooth surface to this because it does not make any of any data and as compared with concrete pavements.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Gradual Failure:</strong> The concrete payment shows brittle failures and the deformations and the failure is a gradual process in bitumen road.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Quick Repair:</strong> The repairing of bitumen road is a quick process and they will not dry out and consuming time in resuming the path for traffic.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Staged Construction:</strong> In a situation when priorities of fund constraint or traffic estimation problems are faced, this helps in carrying out staged construction.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Low Life Cycle Cost:</strong> As compare to concrete pavement, the life cost and overall maintenance cost of bituminous pavement are less.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check text-green-500 mt-1"></i>
                                    <span><strong>Temperature Resistant:</strong> They are not affected by de-icing materials and acid resistant against high temperatures from the tires.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Curing of Tack Coat */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-clock text-[#3B68FC]"></i>
                            Curing of Tack Coat
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed">
                                The tack coat shall be left to cure until the weather have vaporized before any subsequent construction is started. No plant or vehicles shall be allowed on the tack coat other than those essential for the construction.
                            </p>
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
                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-brush text-white"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Tack Coat Calculator</h3>
                                    <p className="text-amber-100 text-xs">IS : 8887</p>
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
                                    <InfoTooltip text="Select the surface type. Each has different spray rate requirements as per Clause 503." />
                                </div>
                                <select
                                    value={surfaceType}
                                    onChange={(e) => {
                                        setSurfaceType(e.target.value);
                                        // Set default rate based on surface type
                                        if (e.target.value === 'Bituminous') setRateOfSpray('0.20');
                                        else if (e.target.value === 'Granular') setRateOfSpray('0.25');
                                        else setRateOfSpray('0.30');
                                    }}
                                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC] text-sm"
                                >
                                    <option value="Bituminous">Bituminous surfaces</option>
                                    <option value="Granular">Granular surfaces treated with primer</option>
                                    <option value="Cement">Cement concrete pavement</option>
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
                                infoText="Enter the length of the road surface"
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
                                    <InfoTooltip text="Spray rate in kg/sq.m. Bituminous: 0.20-0.30, Granular: 0.25-0.30, Cement: 0.30-0.35" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={rateOfSpray}
                                        onChange={(e) => setRateOfSpray(e.target.value)}
                                        placeholder="0.20"
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
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                                    <div className="text-center mb-3">
                                        <div className="text-xs text-[#6b7280] mb-1">Quantity of Bitumen</div>
                                        <div className="text-3xl font-bold text-amber-600">{result.quantity} Kgs</div>
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
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${calc.active ? 'bg-amber-50 text-amber-600 font-medium' : 'hover:bg-[#f8f9fa] text-[#6b7280]'}`}
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
