import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

export default function PlasterCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [thickness, setThickness] = useState('12');
    const [ratio, setRatio] = useState('1:4');
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let area;
        if (unit === 'Meter') {
            area = length * width; // sq.m
        } else {
            area = (length * width) / 10.7639; // sq.ft to sq.m
        }

        const thicknessM = Number(thickness) / 1000;
        const wetVolume = area * thicknessM;
        // Reference: Add 30% to fill up joints & Cover surface
        const totalWetVolume = wetVolume + wetVolume * 0.3;
        // Reference: Increases by 25% of the total dry volume
        const dryVolume = totalWetVolume + totalWetVolume * 0.25;

        const [c, s] = ratio.split(':').map(Number);
        const totalParts = c + s;

        const cementVol = (dryVolume * c) / totalParts;
        const sandVol = (dryVolume * s) / totalParts;

        // Reference: 1 Bag of cement = 0.035 m³
        const cementBags = cementVol / 0.035;
        const cementKg = cementBags * 50;
        // Reference: Sand density = 1550 kg/m³
        const sandKg = sandVol * 1550;
        const sandTon = sandKg / 1000;

        setResults({
            areaSqM: area.toFixed(2),
            areaSqFt: (area * 10.7639).toFixed(2),
            wetVol: totalWetVolume.toFixed(2),
            dryVol: dryVolume.toFixed(2),
            cementBags: cementBags.toFixed(2),
            cementKg: cementKg.toFixed(2),
            sandTon: sandTon.toFixed(2),
            sandKg: sandKg.toFixed(2),
            sandVolM3: sandVol.toFixed(4),
            sandVolCft: (sandVol * 35.3147).toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10);
        setWidth(10);
        setThickness('12');
        setRatio('1:4');
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, width, thickness, ratio]);

    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Flooring Calculator', icon: 'fa-border-all', slug: '/flooring' },
        { name: 'Concrete Calculator', icon: 'fa-cubes', slug: '/cement-concrete' },
        { name: 'Paint Calculator', icon: 'fa-paint-roller', slug: '/paint-work' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Plaster Calculator</h1>
                            <p className="text-[#6b7280]">Calculate cement and sand required for plastering</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="plaster-calculator"
                            calculatorName="Plaster Calculator"
                            calculatorIcon="fa-brush"
                            category="Quantity Estimator"
                            inputs={{ unit, length, width, thickness, ratio }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-[#f8f9fa] p-5 rounded-xl text-center">
                                    <div className="text-sm text-gray-600 mb-2">Total Area</div>
                                    <div className={`text-2xl font-bold ${theme.text}`}>{results?.areaSqFt} ft²</div>
                                    <div className="text-sm text-gray-500">{results?.areaSqM} m²</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-5 rounded-xl text-center">
                                    <div className="text-sm text-gray-600 mb-2">Volume (Dry)</div>
                                    <div className={`text-2xl font-bold ${theme.text}`}>{results?.dryVol} m³</div>
                                    <div className="text-sm text-gray-500">Wet: {results?.wetVol} m³</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">Cement Required</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-blue-600">{results?.cementBags} Bags</div>
                                        <div className="text-sm text-gray-600">{results?.cementKg} Kg</div>
                                    </div>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">Sand Required</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-amber-600">{results?.sandTon} Ton</div>
                                        <div className="text-sm text-gray-600">{results?.sandVolCft} CFT ({results?.sandVolM3} m³)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Plaster Calculation?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4">Plastering is the process of covering rough walls and uneven surfaces in the construction of houses and other structures with a plastic material, called plaster, which is a mixture of lime or cement concrete and sand along with the required quantity of water.</p>
                            <p className="text-gray-600">The quantity of mortar required for plastering depends on the thickness of the plaster and the mix ratio. Common thicknesses are 12mm (internal walls), 15mm, and 20mm (external walls). 20% extra quantity is calculated for filling joints and wastage.</p>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-th-large ${theme.text}`}></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className={`bg-white border rounded-lg p-4 hover:shadow-lg ${theme.border} ${theme.hover.replace('bg-', 'border-')} transition-all group`}>
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} ${theme.text} group-hover:scale-110 transition-transform`}></i>
                                        <span className={`text-sm font-medium text-[#0A0A0A] group-hover:${theme.text}`}>{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    {/* THEME BORDER APPLIED HERE */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} flex items-center gap-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <i className="fas fa-brush text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Plaster Calculator</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <CustomDropdown
                                    options={[
                                        { value: 'Meter', label: 'Meter' },
                                        { value: 'Feet', label: 'Feet' }
                                    ]}
                                    value={unit}
                                    onChange={setUnit}
                                    theme={theme}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Thickness</label>
                                <CustomDropdown
                                    options={[
                                        { value: '6', label: '6 mm (Ceiling)' },
                                        { value: '12', label: '12 mm (Internal)' },
                                        { value: '15', label: '15 mm (Internal/External)' },
                                        { value: '20', label: '20 mm (External)' }
                                    ]}
                                    value={thickness}
                                    onChange={setThickness}
                                    theme={theme}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Ratio</label>
                                <CustomDropdown
                                    options={[
                                        { value: '1:3', label: '1:3 (Repair)' },
                                        { value: '1:4', label: '1:4 (Ceiling/Wall)' },
                                        { value: '1:5', label: '1:5 (Internal Wall)' },
                                        { value: '1:6', label: '1:6 (Internal Wall)' }
                                    ]}
                                    value={ratio}
                                    onChange={setRatio}
                                    theme={theme}
                                />
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Cement Bags</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.cementBags}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
