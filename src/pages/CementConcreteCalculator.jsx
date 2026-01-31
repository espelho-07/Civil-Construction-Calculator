import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';
import DualInput from '../components/DualInput';
import InfoTooltip from '../components/InfoTooltip';
import { STANDARDS_DATA } from '../constants/STANDARDS_DATA';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CementConcreteCalculator() {
    const theme = getThemeClasses('gray');
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
        const dryVolume = wetVolume * 1.54;

        const ratioStr = grades[grade].ratio;
        const parts = ratioStr.split(':').map(Number);
        const totalParts = parts[0] + parts[1] + parts[2];

        const cementVol = (dryVolume * parts[0]) / totalParts;
        const sandVol = (dryVolume * parts[1]) / totalParts;
        const aggVol = (dryVolume * parts[2]) / totalParts;

        const cementBags = Math.ceil(cementVol * 28.8);
        const cementKg = cementBags * 50;
        const sandCft = (sandVol * 35.315).toFixed(2);
        const sandTon = (sandVol * 1.55).toFixed(2);
        const aggCft = (aggVol * 35.315).toFixed(2);
        const aggTon = (aggVol * 1.55).toFixed(2);

        setResults({
            wetVol: wetVolume.toFixed(2),
            dryVol: dryVolume.toFixed(2),
            cement: cementBags,
            cementVol: cementVol.toFixed(4),
            cementKg,
            sand: sandTon,
            sandVol: sandVol.toFixed(4),
            sandCft,
            aggregate: aggTon,
            aggVol: aggVol.toFixed(4),
            aggCft,
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
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <CategoryNav activeCategory="concrete-technology" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Sticky Sidebar Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
                    {/* Main Content - Left Panel */}
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
                        <div className="bg-white rounded-t-2xl rounded-b-xl border border-gray-200 shadow-sm p-6 space-y-5">
                            {/* Input Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-5 border-b border-gray-200">
                                <div>
                                    <label className={`block text-sm font-semibold ${theme.text} mb-2`}>Concrete Grade</label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm font-medium ${theme.border} ${theme.bgLight} hover:bg-white transition-all outline-none ${theme.focus}`}
                                    >
                                        {Object.keys(grades).map(g => (
                                            <option key={g} value={g}>{grades[g].label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-semibold ${theme.text} mb-2`}>Unit</label>
                                    <select
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm font-medium ${theme.border} ${theme.bgLight} hover:bg-white transition-all outline-none ${theme.focus}`}
                                    >
                                        <option value="Meter">Meter</option>
                                        <option value="Feet">Feet</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dimensions Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DualInput
                                    label="Length"
                                    value={length}
                                    onChange={setLength}
                                    unit={unit}
                                    onUnitChange={setUnit}
                                    units={[]}
                                    placeholder="10"
                                    theme={theme}
                                    min={0}
                                    step={0.1}
                                />
                                <DualInput
                                    label="Width"
                                    value={width}
                                    onChange={setWidth}
                                    unit={unit}
                                    onUnitChange={setUnit}
                                    units={[]}
                                    placeholder="10"
                                    theme={theme}
                                    min={0}
                                    step={0.1}
                                />
                                <DualInput
                                    label="Depth"
                                    value={depth}
                                    onChange={setDepth}
                                    unit={unit}
                                    onUnitChange={setUnit}
                                    units={[]}
                                    placeholder="0.15"
                                    theme={theme}
                                    min={0}
                                    step={0.01}
                                />
                            </div>

                            {/* Volume Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-gray-200">
                                <div className={`${theme.bgLight} p-4 rounded-lg border ${theme.border}`}>
                                    <p className={`text-xs font-semibold ${theme.text} mb-2`}>Wet Volume</p>
                                    <p className="text-2xl font-bold text-gray-800">{results?.wetVol} m³</p>
                                    <p className="text-xs text-gray-600 mt-1">{length} × {width} × {depth}</p>
                                </div>
                                <div className={`${theme.bgLight} p-4 rounded-lg border ${theme.border}`}>
                                    <p className={`text-xs font-semibold ${theme.text} mb-2`}>Dry Volume (1.54×)</p>
                                    <p className="text-2xl font-bold text-gray-800">{results?.dryVol} m³</p>
                                    <p className="text-xs text-gray-600 mt-1">Accounts for 54% voids</p>
                                </div>
                            </div>

                            {/* Material Results Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-gray-200">
                                {/* Cement Card */}
                                <div className={`${theme.bgLight} border ${theme.border} rounded-lg p-4`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className={`fas fa-cubes ${theme.text}`}></i>
                                        <span className="text-sm font-bold text-gray-800">Cement</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{results?.cement}</p>
                                    <p className="text-xs text-gray-600 mt-1">Bags (50 kg)</p>
                                    <p className="text-xs font-mono text-gray-500 mt-2">{results?.cementKg} kg</p>
                                </div>

                                {/* Sand Card */}
                                <div className={`${theme.bgLight} border ${theme.border} rounded-lg p-4`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className={`fas fa-mountain ${theme.text}`}></i>
                                        <span className="text-sm font-bold text-gray-800">Sand</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{results?.sand}</p>
                                    <p className="text-xs text-gray-600 mt-1">Metric Tons</p>
                                    <p className="text-xs font-mono text-gray-500 mt-2">{results?.sandCft} CFT</p>
                                </div>

                                {/* Aggregate Card */}
                                <div className={`${theme.bgLight} border ${theme.border} rounded-lg p-4`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <i className={`fas fa-gem ${theme.text}`}></i>
                                        <span className="text-sm font-bold text-gray-800">Aggregate</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{results?.aggregate}</p>
                                    <p className="text-xs text-gray-600 mt-1">Metric Tons</p>
                                    <p className="text-xs font-mono text-gray-500 mt-2">{results?.aggCft} CFT</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Related Calculators */}
                    <section className="mb-12">
                        <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-3`}>
                            <i className="fas fa-th-large"></i>
                            Related Calculators
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {relatedCalculators.map((calc) => (
                                <Link key={calc.name} to={calc.slug} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${calc.icon} ${theme.text} group-hover:scale-110 transition-transform`}></i>
                                        <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{calc.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar - Educational Content & Standards */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit space-y-6">
                    {/* What is Cement Concrete? Card */}
                    <div className="bg-white rounded-t-2xl border border-gray-200 shadow-sm">
                        <div className={`px-5 py-4 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r ${theme.gradient}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                    <i className="fas fa-info-circle"></i>
                                    What is This?
                                </h3>
                                <InfoTooltip
                                    title="Cement Concrete Mix"
                                    description="Cement concrete is a composite building material made from Portland cement, sand, coarse aggregates, and water."
                                    formula={STANDARDS_DATA.concrete.cement.formula}
                                    standards={STANDARDS_DATA.concrete.cement.standards}
                                    theme={theme}
                                    icon="fa-graduation-cap"
                                />
                            </div>
                        </div>
                        <div className="p-5 text-sm text-gray-700 leading-relaxed">
                            <p>A mix design that calculates the precise quantities of cement, sand, and aggregate needed for concrete work based on the grade (M5-M80) and volume required.</p>
                            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs font-semibold text-blue-900 mb-1">Key Formula:</p>
                                <p className="font-mono text-xs text-blue-800">Dry Vol = Wet Vol × 1.54</p>
                            </div>
                        </div>
                    </div>

                    {/* Standards Card */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                        <h3 className={`font-bold text-sm ${theme.text} mb-3 flex items-center gap-2`}>
                            <i className="fas fa-certificate"></i>
                            Applicable Standards
                        </h3>
                        <ul className="text-xs space-y-2">
                            <li className="flex gap-2">
                                <span className={`${theme.bg} text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs`}>1</span>
                                <span className="text-gray-700">IS 456:2000 - RCC Code</span>
                            </li>
                            <li className="flex gap-2">
                                <span className={`${theme.bg} text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs`}>2</span>
                                <span className="text-gray-700">ASTM C 192 - Test Method</span>
                            </li>
                            <li className="flex gap-2">
                                <span className={`${theme.bg} text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs`}>3</span>
                                <span className="text-gray-700">BS 1881 - Testing Methods</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Reference Card */}
                    <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm p-5">
                        <h3 className={`font-bold text-sm ${theme.text} mb-3 flex items-center gap-2`}>
                            <i className="fas fa-chart-pie"></i>
                            Grade Quick Reference
                        </h3>
                        <div className="space-y-2">
                            <div className="text-xs p-2 rounded bg-gray-50 border border-gray-200">
                                <p className="font-semibold text-gray-800">M20 (1:1.5:3)</p>
                                <p className="text-gray-600">Most common, 20 MPa</p>
                            </div>
                            <div className="text-xs p-2 rounded bg-gray-50 border border-gray-200">
                                <p className="font-semibold text-gray-800">M25 (1:1:2)</p>
                                <p className="text-gray-600">RCC structures, 25 MPa</p>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {results && (
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-5 text-white shadow-sm">
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                                <i className="fas fa-box-open"></i>
                                Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Wet Volume:</span>
                                    <span className="font-bold">{results.wetVol} m³</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Dry Volume:</span>
                                    <span className="font-bold">{results.dryVol} m³</span>
                                </div>
                                <div className="border-t border-gray-700 pt-3 mt-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Cement Bags:</span>
                                        <span className="font-bold text-blue-300">{results.cement}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Sand (Tons):</span>
                                        <span className="font-bold text-amber-300">{results.sand}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Aggregate (Tons):</span>
                                        <span className="font-bold text-green-300">{results.aggregate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>

        {/* Information Sections */}
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Formula & Details */}
            <section className="mb-12">
                <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-3`}>
                    <i className="fas fa-flask-vial"></i>
                    Calculation Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-3">Dry Volume Calculation</h3>
                        <div className="bg-gray-50 p-4 rounded font-mono text-sm space-y-2 text-gray-700">
                            <p>Wet Volume = L × W × D</p>
                            <p>Dry Volume = Wet Volume × 1.54</p>
                            <p className="text-xs text-gray-600 mt-2">Factor 1.54 accounts for 54% air voids in concrete</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-3">Material Distribution</h3>
                        <div className="bg-gray-50 p-4 rounded font-mono text-sm space-y-2 text-gray-700">
                            <p>Cement = Dry Vol × (1/Parts)</p>
                            <p>Sand = Dry Vol × (Sand Part/Total Parts)</p>
                            <p>Aggregate = Dry Vol × (Agg Part/Total Parts)</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Concrete Grades Reference */}
            <section className="mb-12">
                <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-3`}>
                    <i className="fas fa-layer-group"></i>
                    Concrete Grades & Standards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Grades Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className={`bg-gradient-to-r ${theme.gradient} text-white`}>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Grade</th>
                                    <th className="px-4 py-3 text-left font-semibold">Ratio</th>
                                    <th className="px-4 py-3 text-left font-semibold">Strength</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.entries(STANDARDS_DATA.concrete.cement.grades).map(([grade, data], idx) => (
                                    <tr key={grade} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-4 py-3 font-semibold text-gray-800">{grade}</td>
                                        <td className="px-4 py-3 text-gray-700">{data.ratio}</td>
                                        <td className="px-4 py-3 text-gray-700">{data.strength}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cement Types */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 mb-3">Cement Types</h3>
                        {Object.entries(STANDARDS_DATA.concrete.cement.cementTypes).map(([type, description]) => (
                            <div key={type} className="bg-white rounded-lg border border-gray-200 p-4">
                                <p className="font-semibold text-gray-800">{type}</p>
                                <p className="text-sm text-gray-600 mt-1">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
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
