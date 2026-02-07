import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import MiniNavbar from '../components/MiniNavbar';
import CategoryQuickNav from '../components/CategoryQuickNav';
import { getThemeClasses } from '../constants/categories';
import { QUANTITY_ESTIMATOR_NAV } from '../constants/calculatorRoutes';

export default function BrickMasonryCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [height, setHeight] = useState(10);
    const [thickness, setThickness] = useState(0.23); // 230mm wall
    const [ratio, setRatio] = useState('1:6');
    const [brickSize, setBrickSize] = useState('19 x 9 x 9');

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const ratios = {
        '1:3': { cement: 1, sand: 3 },
        '1:4': { cement: 1, sand: 4 },
        '1:5': { cement: 1, sand: 5 },
        '1:6': { cement: 1, sand: 6 }
    };

    const brickSizes = {
        '19 x 9 x 9': { l: 0.19, w: 0.09, h: 0.09, volWithMortar: 0.2 * 0.1 * 0.1 } // Standard Modular Brick
    };

    const calculate = () => {
        let volWall;
        if (unit === 'Meter') {
            volWall = length * height * thickness;
        } else {
            // Feet to Meter
            volWall = (length * 0.3048) * (height * 0.3048) * (thickness * 0.3048); // Asking input thickness in feet/inch? Usually thickness is standard. 
            // Let's assume input text explicitly says unit.
            // Actually, for consistency, let's keep simple volume logic.
        }

        // Refine Unit conversion logic
        // If Unit is Feet: Length(ft), Height(ft), Thickness(inch -> ft)
        let l_m, h_m, t_m;
        if (unit === 'Meter') {
            l_m = length;
            h_m = height;
            t_m = thickness; // input in meter
        } else {
            l_m = length * 0.3048;
            h_m = height * 0.3048;
            t_m = thickness * 0.0254; // input in inch usually for thickness in feet mode? Or keep meter for thickness?
            // Let's assume user enters thickness in Inch when Feet mode is selected, or use standard wall thickness dropdown.
        }

        // Actually, wall thickness is usually 4" (100mm), 9" (230mm) etc.
        // Let's simplify thickness to select commonly used wall thickness or custom.
        // For now, I'll use text input and rely on user to enter correct unit value (e.g. 0.23m).
        // Wait, better to handle units properly.

        const vol = unit === 'Meter' ? length * height * thickness : (length * 0.3048) * (height * 0.3048) * (thickness * 0.0254); // Assuming Thickness in inch for Feet mode.

        const brickVolWithMortar = 0.002; // 20x10x10 cm = 0.002 m3

        const totalBricks = Math.ceil(vol / brickVolWithMortar);

        const quantityOfMortar = vol * 0.30; // Approx 30% volume is mortar? Or calculate precisely: VolWall - (NoBricks * BrickActualVol).
        // Actual Brick Vol = 19x9x9 = 0.001539 m3
        const actualBrickVol = 0.19 * 0.09 * 0.09;
        const volOfBricksOnly = totalBricks * actualBrickVol;
        const volOfMortarWet = vol - volOfBricksOnly;
        const volOfMortarDry = volOfMortarWet * 1.33; // Dry volume factor 1.33

        const selectedRatio = ratios[ratio];
        const sumRatio = selectedRatio.cement + selectedRatio.sand;

        const cementVol = (volOfMortarDry * selectedRatio.cement) / sumRatio;
        const cementBags = Math.ceil(cementVol / 0.035);

        const sandVol = (volOfMortarDry * selectedRatio.sand) / sumRatio;
        const sandTon = sandVol * 1.6; // density approx 1600kg/m3

        // Brick Cost (approx 8 rs)
        // Cement Cost (approx 350)
        // Sand Cost (approx 50/cft -> 1750/ton) ? 

        setResults({
            vol: vol.toFixed(2),
            bricks: totalBricks,
            cementBags,
            sandTon: sandTon.toFixed(2),
            cementVol: cementVol.toFixed(4),
            sandVol: sandVol.toFixed(4)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10);
        setHeight(10);
        setThickness(0.23);
        setRatio('1:6');
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, height, thickness, ratio]);

    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Brick Masonry Calculator</h1>
                            <p className="text-[#6b7280]">Calculate bricks, cement and sand required for masonry</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="brick-masonry"
                            calculatorName="Brick Masonry Calculator"
                            calculatorIcon="fa-th-large"
                            category="Quantity Estimator"
                            inputs={{ unit, length, height, thickness, ratio }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-sm text-gray-500">Total Bricks</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>{results?.bricks}</div>
                                    <div className="text-xs text-gray-400 mt-1">Nos.</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Cement</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>{results?.cementBags}</div>
                                    <div className="text-xs text-gray-400 mt-1">Bags</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Sand</div>
                                    <div className={`text-4xl font-bold ${theme.text}`}>{results?.sandTon}</div>
                                    <div className="text-xs text-gray-400 mt-1">Ton</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Calculation Details
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="mb-2"><strong>Volume of Wall:</strong> {results?.vol} m³</p>
                            <p className="mb-2"><strong>Standard Brick Size:</strong> 19 x 9 x 9 cm</p>
                            <p className="mb-2"><strong>Mix Ratio:</strong> {ratio}</p>
                            <div className="mt-4 bg-gray-50 p-4 rounded text-sm">
                                <p>Cement Volume: {results?.cementVol} m³</p>
                                <p>Sand Volume: {results?.sandVol} m³</p>
                            </div>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Mini Navbar */}
                    <MiniNavbar themeName="green" />

                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-th-large text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Brick Masonry Calculator</h2>
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
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Ratio</label>
                                <CustomDropdown
                                    options={Object.keys(ratios).map(r => ({ value: r, label: r }))}
                                    value={ratio}
                                    onChange={setRatio}
                                    theme={theme}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length ({unit})</label>
                                <input
                                    type="number"
                                    value={length}
                                    onChange={(e) => setLength(Number(e.target.value))}
                                    className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && calculate()}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Height ({unit})</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Thickness ({unit === 'Meter' ? 'Meter' : 'Inch'})</label>
                                <input
                                    type="number"
                                    value={thickness}
                                    onChange={(e) => setThickness(Number(e.target.value))}
                                    className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`}
                                />
                                <div className="text-[10px] text-gray-400 mt-1">Standard: 9" = 0.23m / 9, 4" = 0.1m / 4</div>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Total Bricks</div>
                                <div className={`text-2xl font-bold ${theme.text}`}>{results?.bricks} Nos</div>
                            </div>
                        </div>
                    </div>

                    {/* Category Quick Nav */}
                    <CategoryQuickNav
                        items={QUANTITY_ESTIMATOR_NAV}
                        title="Quantity Estimator Calculators"
                        themeName="green"
                    />
                </aside>
            </div>
        </main>
    );
}
