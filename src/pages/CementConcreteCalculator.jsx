import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CementConcreteCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [grade, setGrade] = useState('M20');
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(0.15);

    const grades = {
        'M5': { ratio: '1:5:10', label: 'M5 (1:5:10)' },
        'M7.5': { ratio: '1:4:8', label: 'M7.5 (1:4:8)' },
        'M10': { ratio: '1:3:6', label: 'M10 (1:3:6)' },
        'M15': { ratio: '1:2:4', label: 'M15 (1:2:4)' },
        'M20': { ratio: '1:1.5:3', label: 'M20 (1:1.5:3)' },
        'M25': { ratio: '1:1:2', label: 'M25 (1:1:2)' },
    };

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const l = unit === 'Meter' ? length : length * 0.3048;
        const w = unit === 'Meter' ? width : width * 0.3048;
        const d = unit === 'Meter' ? depth : depth * 0.3048;

        const wetVolume = l * w * d;
        // Reference: Wet volume of mix is 52.4% higher than dry volume
        const dryVolume = wetVolume + wetVolume * (52.4 / 100);

        const ratioStr = grades[grade].ratio;
        const parts = ratioStr.split(':').map(Number);
        const totalParts = parts[0] + parts[1] + parts[2];

        const cementVol = (dryVolume * parts[0]) / totalParts;
        const sandVol = (dryVolume * parts[1]) / totalParts;
        const aggVol = (dryVolume * parts[2]) / totalParts;

        // Reference: 1 Bag of cement = 0.035 m³
        const cementBags = cementVol / 0.035;
        const cementKg = cementBags * 50;
        // Reference: Sand density = 1550 kg/m³
        const sandKg = sandVol * 1550;
        const sandTon = sandKg / 1000;
        // Reference: Aggregate density = 1350 kg/m³
        const aggKg = aggVol * 1350;
        const aggTon = aggKg / 1000;

        setResults({
            wetVol: wetVolume.toFixed(2),
            wetVolFt: (wetVolume * 35.3147).toFixed(2),
            dryVol: dryVolume.toFixed(2),
            cement: cementBags.toFixed(2),
            cementVol: cementVol.toFixed(2),
            cementKg: cementKg.toFixed(2),
            sand: sandTon.toFixed(2),
            sandVol: sandVol.toFixed(2),
            sandKg: sandKg.toFixed(2),
            sandCft: (sandVol * 35.3147).toFixed(2),
            aggregate: aggTon.toFixed(2),
            aggVol: aggVol.toFixed(2),
            aggKg: aggKg.toFixed(2),
            aggCft: (aggVol * 35.3147).toFixed(2),
            ratio: ratioStr,
            parts,
            totalParts,
        });
    };

    useEffect(() => {
        calculate();
    }, [length, width, depth, grade, unit]);

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

    const chartData = {
        labels: ['Cement', 'Sand', 'Aggregate'],
        datasets: [{
            data: results ? [results.parts[0], results.parts[1], results.parts[2]] : [1, 1.5, 3],
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
            borderWidth: 0,
        }],
    };

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Carpet Area', icon: 'fa-vector-square', slug: '/carpet-area' },
        { name: 'Countertop Calculator', icon: 'fa-ruler-combined', slug: '/countertop' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Cement Concrete Calculator</h1>
                            <p className="text-[#6b7280]">Calculate cement, sand and aggregate for concrete work</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="cement-concrete"
                            calculatorName="Cement Concrete Calculator"
                            calculatorIcon="fa-cubes"
                            category="Quantity Estimator"
                            inputs={{ unit, grade, length, width, depth }}
                            outputs={results || {}}
                        />
                    </div>

                    {/* Cement Concrete Calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Cement Concrete Calculation
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} space-y-4`}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="font-semibold text-gray-800 mb-2">Cement Concrete Volume</div>
                                    <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2">
                                        <p><span className="text-[#3B68FC]">Length</span> × <span className="text-green-600">Width</span> × <span className="text-amber-600">Depth</span></p>
                                        <p>= {length} × {width} × {depth}</p>
                                        <p className="text-lg font-bold">= {results?.wetVol} m³</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-800 mb-2">Wet Volume of Mix</div>
                                    <div className="bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm space-y-2">
                                        <p>as Said Volume = {results?.wetVol} m³</p>
                                        <p>Dry Volume = Wet Vol × 1.54</p>
                                        <p className="text-lg font-bold text-green-600">= {results?.dryVol} m³</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                                <strong>Note:</strong> To get the dry volume consider 54% voids i.e. 1.54 factor
                            </div>

                            {/* Material Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                {/* Cement */}
                                <div className={`bg-white border ${theme.border} rounded-xl p-4 shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <span className="font-bold text-gray-800">1. Amount of Cement Required</span>
                                    </div>
                                    <div className="text-sm space-y-1 font-mono bg-blue-50 p-3 rounded">
                                        <p>Cement Volume</p>
                                        <p>= {results?.dryVol} × (1/{results?.totalParts})</p>
                                        <p>= {results?.cementVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center border-t pt-3">
                                        <div className="text-xs text-gray-500">No. of Cement Bags</div>
                                        <div className="text-2xl font-bold text-blue-600">{results?.cement}</div>
                                        <div className="text-xs text-gray-400">{results?.cementKg} Kg</div>
                                    </div>
                                    <div className="mt-2 bg-blue-100 text-blue-800 text-xs p-2 rounded text-center">
                                        Note: One cement bag contains 0.034722 m³ OR 1.226 CFT of Volume OR 50 KG or 110 LBS.
                                    </div>
                                </div>

                                {/* Sand */}
                                <div className={`bg-white border ${theme.border} rounded-xl p-4 shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <span className="font-bold text-gray-800">2. Amount of Sand Required</span>
                                    </div>
                                    <div className="text-sm space-y-1 font-mono bg-amber-50 p-3 rounded">
                                        <p>Sand Volume</p>
                                        <p>= {results?.dryVol} × ({results?.parts?.[1]}/{results?.totalParts})</p>
                                        <p>= {results?.sandVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center border-t pt-3">
                                        <div className="text-xs text-gray-500">Sand in Ton</div>
                                        <div className="text-2xl font-bold text-amber-600">{results?.sand}</div>
                                        <div className="text-xs text-gray-400">{results?.sandCft} CFT</div>
                                    </div>
                                    <div className="mt-2 bg-amber-100 text-amber-800 text-xs p-2 rounded text-center">
                                        Density of Sand: 1550 kg/m³
                                    </div>
                                </div>

                                {/* Aggregate */}
                                <div className={`bg-white border ${theme.border} rounded-xl p-4 shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className="fas fa-gem text-green-500"></i>
                                        <span className="font-bold text-gray-800">3. Amount of Aggregate Required</span>
                                    </div>
                                    <div className="text-sm space-y-1 font-mono bg-green-50 p-3 rounded">
                                        <p>Aggregate Volume</p>
                                        <p>= {results?.dryVol} × ({results?.parts?.[2]}/{results?.totalParts})</p>
                                        <p>= {results?.aggVol} m³</p>
                                    </div>
                                    <div className="mt-3 text-center border-t pt-3">
                                        <div className="text-xs text-gray-500">Aggregate in Ton</div>
                                        <div className="text-2xl font-bold text-green-600">{results?.aggregate}</div>
                                        <div className="text-xs text-gray-400">{results?.aggCft} CFT</div>
                                    </div>
                                    <div className="mt-2 bg-green-100 text-green-800 text-xs p-2 rounded text-center">
                                        Aggregate density: 1500-1650 kg/m³
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is RCC? */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is RCC (Plain Cement Concrete) Calculation?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4 text-justify">
                                    Cement concrete is one of the main building materials used in today's construction industry. It can be moulded to any desired shape, does not corrode, is not combustible, and is resistant to abrasion. Concrete is a mixture of sand or aggregate combined with cement.
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed text-justify">
                                    The standard mix for concrete is Cement: Sand: Aggregate in specified ratios like 1:1.5:3 (M20), 1:2:4 (M15), etc. Higher the grade, more is the strength and cement content.
                                </p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Concrete work" className="w-full md:w-48 h-40 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Standard Grades Table */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-table ${theme.text}`}></i>
                            Concrete grade and proportion/mix ratio:
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className={`border ${theme.border} px-3 py-2 text-left`}>Concrete Grade</th>
                                            <th className={`border ${theme.border} px-3 py-2 text-left`}>Proportion (Cement: Sand: Aggregate)</th>
                                            <th className={`border ${theme.border} px-3 py-2 text-left`}>Expected Compressive Strength (28 days)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2 font-medium`}>M10</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>1 : 3 : 6</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>10 N/mm²</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className={`border ${theme.border} px-3 py-2 font-medium`}>M15</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>1 : 2 : 4</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>15 N/mm²</td>
                                        </tr>
                                        <tr>
                                            <td className={`border ${theme.border} px-3 py-2 font-medium`}>M20</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>1 : 1.5 : 3</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>20 N/mm²</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td className={`border ${theme.border} px-3 py-2 font-medium`}>M25</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>1 : 1 : 2</td>
                                            <td className={`border ${theme.border} px-3 py-2`}>25 N/mm²</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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

                    {/* Inline Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Calculator Widget (Sidebar) */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} flex items-center gap-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <i className="fas fa-cubes text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Cement Concrete Calculator</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit Toggle */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <div className={`flex ${theme.border} rounded-lg overflow-hidden`}>
                                    <button onClick={() => setUnit('Meter')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Meter' ? theme.button : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Meter</button>
                                    <button onClick={() => setUnit('Feet')} className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === 'Feet' ? theme.button : 'text-[#6b7280] hover:bg-[#f8f9fa]'}`}>Feet</button>
                                </div>
                            </div>

                            {/* Grade */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Grade of Concrete</label>
                                <CustomDropdown
                                    options={Object.entries(grades).map(([key, val]) => ({ value: key, label: val.label }))}
                                    value={grade}
                                    onChange={setGrade}
                                    theme={theme}
                                />
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Length</label>
                                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full px-2 py-2 ${theme.border} rounded-lg text-sm text-center ${theme.focus} outline-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Width</label>
                                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={`w-full px-2 py-2 ${theme.border} rounded-lg text-sm text-center ${theme.focus} outline-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Depth</label>
                                    <input type="number" value={depth} step="0.01" onChange={(e) => setDepth(Number(e.target.value))} className={`w-full px-2 py-2 ${theme.border} rounded-lg text-sm text-center ${theme.focus} outline-none`} />
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium transition-colors`}>Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Total Volume of Cement Concrete</div>
                                        <div className="text-xl font-bold text-[#3B68FC]">{results?.wetVol} m³</div>
                                        <div className="text-sm font-bold text-green-600">{results?.dryVol} m³ (Dry)</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20">
                                            <Pie data={chartData} options={{ plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                    <div className={`bg-white p-2 rounded ${theme.border}`}>
                                        <i className="fas fa-cubes text-blue-500"></i>
                                        <div className="text-gray-500">Cement</div>
                                        <div className="font-bold">{results?.cement} Bags</div>
                                    </div>
                                    <div className={`bg-white p-2 rounded ${theme.border}`}>
                                        <i className="fas fa-truck-loading text-amber-500"></i>
                                        <div className="text-gray-500">Sand</div>
                                        <div className="font-bold">{results?.sand} Ton</div>
                                    </div>
                                    <div className={`bg-white p-2 rounded ${theme.border}`}>
                                        <i className="fas fa-gem text-green-500"></i>
                                        <div className="text-gray-500">Aggregate</div>
                                        <div className="font-bold">{results?.aggregate} Ton</div>
                                    </div>
                                </div>
                            </div>
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
