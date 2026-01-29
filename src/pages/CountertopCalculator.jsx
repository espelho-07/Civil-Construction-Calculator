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

export default function CountertopCalculator() {
    const [unit, setUnit] = useState('ft');
    const [shape, setShape] = useState('L');

    // Section 1
    const [length1Ft, setLength1Ft] = useState('');
    const [length1In, setLength1In] = useState('');
    const [width1Ft, setWidth1Ft] = useState('');
    const [width1In, setWidth1In] = useState('');

    // Section 2
    const [length2Ft, setLength2Ft] = useState('');
    const [length2In, setLength2In] = useState('');
    const [width2Ft, setWidth2Ft] = useState('');
    const [width2In, setWidth2In] = useState('');

    // Section 3
    const [length3Ft, setLength3Ft] = useState('');
    const [length3In, setLength3In] = useState('');
    const [width3Ft, setWidth3Ft] = useState('');
    const [width3In, setWidth3In] = useState('');

    // Depth
    const [depthFt, setDepthFt] = useState('');
    const [depthIn, setDepthIn] = useState('');

    const [result, setResult] = useState(null);
    const sidebarRef = useRef(null);

    // Convert to feet (handles both feet+inches and meter+cm)
    const toFeet = (primary, secondary) => {
        const p = parseFloat(primary) || 0;
        const s = parseFloat(secondary) || 0;
        if (unit === 'ft') {
            return p + (s / 12); // feet + inches to feet
        } else {
            return (p + (s / 100)) * 3.28084; // meter + cm to feet
        }
    };

    useEffect(() => {
        const l1 = toFeet(length1Ft, length1In);
        const w1 = toFeet(width1Ft, width1In);
        const l2 = toFeet(length2Ft, length2In);
        const w2 = toFeet(width2Ft, width2In);
        const l3 = toFeet(length3Ft, length3In);
        const w3 = toFeet(width3Ft, width3In);
        const d = toFeet(depthFt, depthIn);

        let totalArea = 0;

        if (shape === 'I' && l1 > 0 && w1 > 0) {
            totalArea = l1 * w1;
        } else if (shape === 'L' && l1 > 0 && w1 > 0) {
            totalArea = (l1 * w1) + (l2 * w2);
        } else if (shape === 'U' && l1 > 0 && w1 > 0) {
            totalArea = (l1 * w1) + (l2 * w2) + (l3 * w3);
        }

        if (totalArea > 0) {
            const volume = d > 0 ? (totalArea * d).toFixed(3) : null;

            setResult({
                areaSqFt: totalArea.toFixed(2),
                areaSqM: (totalArea / 10.764).toFixed(2),
                volumeCuFt: volume,
                volumeCuM: volume ? (parseFloat(volume) / 35.315).toFixed(4) : null,
            });
        } else {
            setResult(null);
        }
    }, [length1Ft, length1In, width1Ft, width1In, length2Ft, length2In, width2Ft, width2In, length3Ft, length3In, width3Ft, width3In, depthFt, depthIn, unit, shape]);

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
        setLength1Ft(''); setLength1In(''); setWidth1Ft(''); setWidth1In('');
        setLength2Ft(''); setLength2In(''); setWidth2Ft(''); setWidth2In('');
        setLength3Ft(''); setLength3In(''); setWidth3Ft(''); setWidth3In('');
        setDepthFt(''); setDepthIn('');
        setResult(null);
    };

    const handleShapeChange = (newShape) => {
        setShape(newShape);
        reset();
    };

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '#' },
        { name: 'Tile Calculator', icon: 'fa-th', slug: '#' },
        { name: 'Paint Calculator', icon: 'fa-paint-roller', slug: '#' },
        { name: 'Concrete Volume', icon: 'fa-cube', slug: '#' },
        { name: 'Flooring Calculator', icon: 'fa-border-all', slug: '#' },
        { name: 'Plastering Calculator', icon: 'fa-brush', slug: '#' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="construction" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Kitchen Platform Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the area of your kitchen countertop easily</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="countertop-calculator"
                            calculatorName="Kitchen Platform Calculator"
                            calculatorIcon="fa-ruler-combined"
                            category="Quantity Estimator"
                            inputs={{ unit, shape, length1Ft, length1In, width1Ft, width1In, length2Ft, length2In, width2Ft, width2In, depthFt, depthIn }}
                            outputs={result || {}}
                        />
                    </div>


                    {/* What is Kitchen Platform? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Kitchen Platform?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                A kitchen platform, also known as a countertop or worktop, is the flat surface in a kitchen where food preparation takes place. It is typically installed on top of base cabinets and can be made from various materials such as granite, marble, quartz, laminate, or solid surface materials.
                            </p>
                            <p className="text-[#0A0A0A] leading-relaxed">
                                Kitchen platform calculation is calculating how many numbers of granites required for platform. We use height, width and depth to calculate the granites sizes. Three shapes are available: <strong>L-shape</strong>, <strong>U-shape</strong>, and <strong>I-shape (straight)</strong>.
                            </p>
                        </div>
                    </section>

                    {/* Shape Diagrams */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-shapes text-[#3B68FC]"></i>
                            Kitchen Shapes
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${shape === 'I' ? 'border-[#3B68FC] shadow-lg' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`} onClick={() => handleShapeChange('I')}>
                                <div className="w-full h-20 bg-[#f8f9fa] rounded-lg flex items-center justify-center mb-3">
                                    <div className="w-3/4 h-4 bg-[#0A0A0A] rounded"></div>
                                </div>
                                <div className="text-center font-medium text-[#0A0A0A]">I-Shape</div>
                                <div className="text-center text-xs text-[#6b7280]">Straight</div>
                            </div>

                            <div className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${shape === 'L' ? 'border-[#3B68FC] shadow-lg' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`} onClick={() => handleShapeChange('L')}>
                                <div className="w-full h-20 bg-[#f8f9fa] rounded-lg relative mb-3">
                                    <div className="absolute top-3 left-3 w-3/4 h-3 bg-[#0A0A0A] rounded"></div>
                                    <div className="absolute top-3 left-3 w-3 h-14 bg-[#0A0A0A] rounded"></div>
                                </div>
                                <div className="text-center font-medium text-[#0A0A0A]">L-Shape</div>
                                <div className="text-center text-xs text-[#6b7280]">Corner</div>
                            </div>

                            <div className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${shape === 'U' ? 'border-[#3B68FC] shadow-lg' : 'border-[#e5e7eb] hover:border-[#3B68FC]'}`} onClick={() => handleShapeChange('U')}>
                                <div className="w-full h-20 bg-[#f8f9fa] rounded-lg relative mb-3">
                                    <div className="absolute top-3 left-3 w-3/4 h-3 bg-[#0A0A0A] rounded"></div>
                                    <div className="absolute top-3 left-3 w-3 h-14 bg-[#0A0A0A] rounded"></div>
                                    <div className="absolute bottom-3 left-3 w-3/4 h-3 bg-[#0A0A0A] rounded"></div>
                                </div>
                                <div className="text-center font-medium text-[#0A0A0A]">U-Shape</div>
                                <div className="text-center text-xs text-[#6b7280]">3-sided</div>
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
                                    {shape === 'I' && <code className="text-lg font-mono text-[#0A0A0A]"><span className="text-[#3B68FC]">Area</span> = Length × Width</code>}
                                    {shape === 'L' && <code className="text-lg font-mono text-[#0A0A0A]"><span className="text-[#3B68FC]">Area</span> = (L₁ × W₁) + (L₂ × W₂)</code>}
                                    {shape === 'U' && <code className="text-lg font-mono text-[#0A0A0A]"><span className="text-[#3B68FC]">Area</span> = (L₁ × W₁) + (L₂ × W₂) + (L₃ × W₃)</code>}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm text-sm">
                                    <code className="font-mono text-[#0A0A0A]"><span className="text-green-600">Volume</span> = Area × Depth</code>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Important Factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            Important Factors to Consider
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                The first thing to do is to create a kitchen design. That is because kitchen design is a bit tricky. While you want your kitchen to look visually enticing to boost the appetite, you also want to make sure that it's conducive for cooking and food preparation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Material Selection', desc: 'Granite, marble, quartz or laminate', icon: 'fa-gem' },
                                    { title: 'Size of Granite', desc: 'Standard sizes vary by supplier', icon: 'fa-expand' },
                                    { title: 'Edge Profile', desc: 'Beveled, bullnose, or ogee edges', icon: 'fa-shapes' },
                                    { title: 'Depth/Thickness', desc: 'Standard 20mm or 30mm granite', icon: 'fa-ruler-vertical' },
                                    { title: 'Sink Cutout', desc: 'Account for sink area', icon: 'fa-sink' },
                                    { title: 'Wastage', desc: 'Add 10-15% extra for cuts', icon: 'fa-cut' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                                        <i className={`fas ${item.icon} text-[#3B68FC] mt-1`}></i>
                                        <div>
                                            <div className="font-medium text-[#0A0A0A]">{item.title}</div>
                                            <div className="text-sm text-[#6b7280]">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-th-large text-[#3B68FC]"></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className="bg-white border border-[#e5e7eb] rounded-lg p-4 hover:shadow-lg hover:border-[#3B68FC] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} text-[#3B68FC] group-hover:scale-110 transition-transform`}></i>
                                        <span className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#3B68FC]">{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Inline Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Calculator Widget */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
                            <i className="fas fa-ruler-combined text-xl text-yellow-500"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">Kitchen Platform Calculator</h2>
                        </div>

                        <div className="p-5">
                            {/* Result Display */}
                            <div className="bg-[#f8f9fa] rounded-xl p-5 mb-5 text-center">
                                <div className="text-sm text-[#6b7280] mb-2">Area of countertop</div>
                                <div className="text-3xl font-bold text-[#0A0A0A]">
                                    {result ? result.areaSqFt : '0.00'} <span className="text-lg font-normal text-[#6b7280]">Sq.Ft</span>
                                </div>
                                {result && <div className="text-sm text-[#6b7280] mt-1">= {result.areaSqM} Sq.M</div>}
                                {result && result.volumeCuFt && (
                                    <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
                                        <div className="text-xs text-[#6b7280]">Volume</div>
                                        <div className="text-lg font-semibold text-green-600">{result.volumeCuFt} Cu.Ft</div>
                                        <div className="text-xs text-[#6b7280]">= {result.volumeCuM} Cu.M</div>
                                    </div>
                                )}
                            </div>

                            {/* Shape Selection */}
                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <label className="text-sm font-medium text-[#0A0A0A]">Select Shape</label>
                                    <InfoTooltip text="Choose the shape of your kitchen platform. I-shape is straight, L-shape has a corner, U-shape has three sides." />
                                </div>
                                <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden">
                                    {['I', 'L', 'U'].map((s) => (
                                        <button key={s} onClick={() => handleShapeChange(s)} className={`flex-1 py-2 text-sm font-medium transition-colors ${shape === s ? 'bg-[#3B68FC] text-white' : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>
                                            {s}-Shape
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <label className="text-sm font-medium text-[#0A0A0A]">Unit</label>
                                    <InfoTooltip text="Feet/Inch: Common in India & USA. Meter/cm: SI unit used worldwide." />
                                </div>
                                <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden">
                                    <button onClick={() => setUnit('ft')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'ft' ? 'bg-[#3B68FC] text-white' : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>
                                        Feet / Inch
                                    </button>
                                    <button onClick={() => setUnit('m')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'm' ? 'bg-[#3B68FC] text-white' : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>
                                        Meter / cm
                                    </button>
                                </div>
                            </div>

                            {/* Depth Input */}
                            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <DualInput
                                    label="Depth (Optional - for volume)"
                                    unit={unit}
                                    valuePrimary={depthFt}
                                    valueSecondary={depthIn}
                                    onChangePrimary={setDepthFt}
                                    onChangeSecondary={setDepthIn}
                                    placeholder1="0"
                                    placeholder2={unit === 'ft' ? "1" : "2"}
                                    infoText="Depth is the thickness of your countertop slab. Typical values: 0.8-1.2 inches (20-30mm)."
                                />
                            </div>

                            {/* Section 1 */}
                            <div className="mb-4 p-3 bg-[#f8f9fa] rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-5 h-5 bg-[#3B68FC] text-white rounded text-xs flex items-center justify-center">1</span>
                                    <span className="text-sm font-medium text-[#0A0A0A]">{shape === 'I' ? 'Countertop' : 'First Section'}</span>
                                    <InfoTooltip text="Length is the longer horizontal side. Width is the depth from front to back (typically 2 feet)." />
                                </div>
                                <DualInput label="Length" unit={unit} valuePrimary={length1Ft} valueSecondary={length1In} onChangePrimary={setLength1Ft} onChangeSecondary={setLength1In} placeholder1="8" placeholder2="6" />
                                <DualInput label="Width" unit={unit} valuePrimary={width1Ft} valueSecondary={width1In} onChangePrimary={setWidth1Ft} onChangeSecondary={setWidth1In} placeholder1="2" placeholder2="0" />
                            </div>

                            {/* Section 2 */}
                            {(shape === 'L' || shape === 'U') && (
                                <div className="mb-4 p-3 bg-[#f8f9fa] rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-5 h-5 bg-[#3B68FC] text-white rounded text-xs flex items-center justify-center">2</span>
                                        <span className="text-sm font-medium text-[#0A0A0A]">Second Section</span>
                                        <InfoTooltip text="The perpendicular section of your L or U shaped countertop." />
                                    </div>
                                    <DualInput label="Length" unit={unit} valuePrimary={length2Ft} valueSecondary={length2In} onChangePrimary={setLength2Ft} onChangeSecondary={setLength2In} placeholder1="5" placeholder2="0" />
                                    <DualInput label="Width" unit={unit} valuePrimary={width2Ft} valueSecondary={width2In} onChangePrimary={setWidth2Ft} onChangeSecondary={setWidth2In} placeholder1="2" placeholder2="0" />
                                </div>
                            )}

                            {/* Section 3 */}
                            {shape === 'U' && (
                                <div className="mb-4 p-3 bg-[#f8f9fa] rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-5 h-5 bg-[#3B68FC] text-white rounded text-xs flex items-center justify-center">3</span>
                                        <span className="text-sm font-medium text-[#0A0A0A]">Third Section</span>
                                        <InfoTooltip text="The third section parallel to the first, completing the U-shape." />
                                    </div>
                                    <DualInput label="Length" unit={unit} valuePrimary={length3Ft} valueSecondary={length3In} onChangePrimary={setLength3Ft} onChangeSecondary={setLength3In} placeholder1="4" placeholder2="0" />
                                    <DualInput label="Width" unit={unit} valuePrimary={width3Ft} valueSecondary={width3In} onChangePrimary={setWidth3Ft} onChangeSecondary={setWidth3In} placeholder1="2" placeholder2="0" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-6 p-4 border-t border-[#e5e7eb]">
                            <button onClick={reset} className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#3B68FC]"><i className="fas fa-redo"></i> Reset</button>
                            <button className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#3B68FC]"><i className="fas fa-share-alt"></i> Share</button>
                        </div>
                    </div>

                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
