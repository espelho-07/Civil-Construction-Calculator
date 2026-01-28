import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

export default function PrecastBoundaryWallCalculator() {
    const [unit, setUnit] = useState('Feet');
    const [areaLength, setAreaLength] = useState(60);
    const [areaLengthInch, setAreaLengthInch] = useState(0);
    const [areaHeight, setAreaHeight] = useState(5);
    const [areaHeightInch, setAreaHeightInch] = useState(0);
    const [barLength, setBarLength] = useState(4);
    const [barLengthInch, setBarLengthInch] = useState(0);
    const [barHeight, setBarHeight] = useState(10);
    const [barHeightInch, setBarHeightInch] = useState(0);
    const [spacing, setSpacing] = useState(0.5); // feet between horizontal bars

    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        // Convert to feet
        const areaL = areaLength + (areaLengthInch / 12);
        const areaH = areaHeight + (areaHeightInch / 12);
        const barL = barLength + (barLengthInch / 12);
        const barH = (barHeight + (barHeightInch / 12)) / 12; // Convert height of bar from inches to feet

        // Horizontal bars calculation
        const horizontalBarsWithGivenArea = Math.ceil((areaL / barL) + (areaH / barH));

        // For actual area covered by horizontal bars
        const actualAreaCoveredByHBar = areaL * barH;
        const horizontalBarActual = Math.ceil(actualAreaCoveredByHBar / (barL * barH));
        const totalHorizontalBars = Math.ceil(areaH / barH);

        // Vertical Posts
        const verticalPostsRequired = Math.ceil((areaL / barL) + 1);

        setResults({
            totalHorizontalBars,
            horizontalBarsWithGivenArea,
            horizontalBarActual,
            verticalPosts: verticalPostsRequired,
            areaToCovers: (areaL * areaH).toFixed(2),
            actualAreaCovered: actualAreaCoveredByHBar.toFixed(2),
        });
    };

    useEffect(() => {
        calculate();
    }, [areaLength, areaLengthInch, areaHeight, areaHeightInch, barLength, barLengthInch, barHeight, barHeightInch, spacing, unit]);

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

    const relatedCalculators = [
        { name: 'Brick Calculator', icon: 'fa-th-large', slug: '/brick-masonry' },
        { name: 'Concrete Block', icon: 'fa-cube', slug: '/concrete-block' },
        { name: 'Construction Cost', icon: 'fa-rupee-sign', slug: '/construction-cost' },
        { name: 'Plaster Calculator', icon: 'fa-brush', slug: '/plastering' },
        { name: 'Flooring Calculator', icon: 'fa-border-all', slug: '/flooring' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Precast Boundary Wall Calculator</h1>
                    <p className="text-[#6b7280] mb-6">Calculate horizontal bars and vertical posts for precast compound wall</p>

                    {/* Precast Boundary wall calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-calculator text-[#3B68FC]"></i>
                            Precast Boundary wall calculation
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Horizontal Bar With Given Area */}
                                <div className="bg-[#f8f9fa] p-5 rounded-xl">
                                    <h3 className="font-bold text-gray-800 mb-4">Horizontal Bar Require With Given Area</h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="bg-white p-3 rounded border">
                                            <div className="font-medium text-gray-700">Total Require Horizontal Bar</div>
                                            <div className="font-mono text-xs mt-1">
                                                = (<span className="text-[#3B68FC]">Length of Area</span> / <span className="text-green-600">Height of Area</span>) / (<span className="text-amber-600">Horizontal Bar Length</span> × <span className="text-purple-600">Horizontal Bar Height</span>)
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded border">
                                            <div className="font-mono text-xs">
                                                Total Require Horizontal Bar = ({areaLength} × {areaHeight}) / ({barLength} × {barHeight / 12})
                                            </div>
                                        </div>

                                        <div className="bg-blue-100 p-3 rounded text-center">
                                            <div className="text-xs text-gray-600">Total Require Horizontal Bar</div>
                                            <div className="text-2xl font-bold text-[#3B68FC]">{results?.totalHorizontalBars}</div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs">
                                            <strong>Note:</strong> No Space is Kept Between horizontal bar
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="font-medium text-gray-700 mb-2">No of Vertical Post Require</div>
                                        <div className="bg-white p-3 rounded border font-mono text-xs">
                                            Total Require Vertical Post = (<span className="text-[#3B68FC]">Length of Area</span> / <span className="text-green-600">Horizontal Bar Length</span>) + 1
                                        </div>
                                        <div className="bg-white p-3 rounded border font-mono text-xs mt-2">
                                            Total Require Vertical Post = ({areaLength} / {barLength}) + 1
                                        </div>
                                        <div className="bg-green-100 p-3 rounded text-center mt-2">
                                            <div className="text-xs text-gray-600">Total Require Vertical Post</div>
                                            <div className="text-2xl font-bold text-green-600">{results?.verticalPosts}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Horizontal Bar With Actual Area */}
                                <div className="bg-[#f8f9fa] p-5 rounded-xl">
                                    <h3 className="font-bold text-gray-800 mb-4">Horizontal Bar Require With Actual Area</h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="bg-white p-3 rounded border">
                                            <div className="font-medium text-gray-700">Actual Area To be Covered By Horizontal Bar</div>
                                            <div className="font-mono text-xs mt-1">
                                                = Length of Area × (<span className="text-[#3B68FC]">Length of Area</span> × <span className="text-green-600">Height of Area</span> / <span className="text-amber-600">Bar Length</span> × <span className="text-purple-600">Bar Height</span>)
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded border">
                                            <div className="font-mono text-xs">
                                                = {areaLength} × ({areaLength} × {areaHeight} / {barLength} × {(barHeight / 12).toFixed(2)})
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded border">
                                            <div className="font-mono text-xs">
                                                Actual Area To be Covered By Horizontal Bar = <strong>{results?.actualAreaCovered}</strong>
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded border">
                                            <div className="font-mono text-xs">
                                                Horizontal Bar = (Actual Area of Horizontal Bar × Height of Area) / (Horizontal Bar Length × Horizontal Bar Height)
                                            </div>
                                        </div>

                                        <div className="bg-blue-100 p-3 rounded text-center">
                                            <div className="text-xs text-gray-600">Total Require Horizontal Bar</div>
                                            <div className="text-2xl font-bold text-[#3B68FC]">{results?.horizontalBarActual}</div>
                                        </div>

                                        <div className="bg-green-50 border border-green-200 p-2 rounded text-xs">
                                            <strong>Note:</strong> Assuming 0.5 ft spaces kept between horizontal bar
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="font-medium text-gray-700 mb-2">No of Vertical Post Require</div>
                                        <div className="bg-white p-3 rounded border font-mono text-xs">
                                            = (<span className="text-[#3B68FC]">Length of Area</span> / <span className="text-green-600">Horizontal Bar Length</span>) + 1
                                        </div>
                                        <div className="bg-white p-3 rounded border font-mono text-xs mt-2">
                                            Total Require Vertical Post = ({areaLength} / {barLength}) + 1
                                        </div>
                                        <div className="bg-green-100 p-3 rounded text-center mt-2">
                                            <div className="text-xs text-gray-600">Total Require Vertical Post</div>
                                            <div className="text-2xl font-bold text-green-600">{results?.verticalPosts}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What is Precast Boundary Wall */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle text-[#3B68FC]"></i>
                            What is Precast Boundary Wall calculation?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Precast concrete is a construction product produced by casting concrete in a reusable mold or "form" which is then cured in a controlled environment, transported to the construction site and lifted into place.
                                </p>
                                <p className="text-[#0A0A0A] leading-relaxed mb-4">
                                    Precast concrete using a fine aggregate in the mixture, so the final product approaches the appearance of naturally occurring rock or stone. More recently expanded polystyrene is being used as the core to precast wall panels. This is lightweight and has better thermal insulation.
                                </p>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="font-semibold mb-2">Precast boundary wall calculation</div>
                                    <div className="font-mono text-sm space-y-1 text-[#3B68FC]">
                                        <p>Total Require Horizontal Bar</p>
                                        <p>= (<span className="text-gray-600">Length of Area</span> × <span className="text-gray-600">Height of Area</span>) / (<span className="text-gray-600">Horizontal Bar Length</span> × <span className="text-gray-600">Horizontal Bar Height</span>)</p>
                                    </div>
                                    <div className="font-mono text-sm space-y-1 text-green-600 mt-3">
                                        <p>Total Require Vertical Post</p>
                                        <p>= (<span className="text-gray-600">Length of Area</span> / <span className="text-gray-600">Horizontal Bar Length</span>) + 1</p>
                                    </div>
                                </div>
                            </div>
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Precast wall" className="w-full md:w-56 h-48 object-cover rounded-lg" />
                        </div>
                    </section>

                    {/* Important factors */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                            What are the important precast boundary wall?
                        </h2>
                        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb]">
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Precast is used within exterior and interior walls. By producing precast concrete in a controlled environment (typically referred to as a precast plant), the precast concrete is afforded the opportunity to properly cure and be closely monitored by plant employees. Using a precast concrete system offers many potential advantages over on-site casting.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                There is greater control over material quality and workmanship in a precast plant compared to a construction site. There are many different types of precast concrete forming for architectural applications, differing in size, function, and cost.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {[
                                    { title: 'Space Between Bars', desc: 'Calculate with given or 0.5 feet of space', icon: 'fa-arrows-alt-h' },
                                    { title: 'Standard Bar Size', desc: '4ft length × 10inch height common', icon: 'fa-ruler' },
                                    { title: 'Vertical Post Spacing', desc: 'One post per bar length + 1', icon: 'fa-arrows-alt-v' },
                                    { title: 'Quality Control', desc: 'Factory-made ensures consistency', icon: 'fa-check-circle' },
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

                {/* Calculator Widget (Sidebar) */}
                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3 bg-gradient-to-r from-gray-100 to-slate-100">
                            <i className="fas fa-border-style text-xl text-gray-600"></i>
                            <h2 className="font-semibold text-[#0A0A0A]">PRECAST BOUNDARY WALL CALCULATION</h2>
                        </div>

                        <div className="p-5">
                            {/* Unit */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm">
                                    <option value="Feet">Feet/Inch</option>
                                </select>
                            </div>

                            <div className="text-xs font-medium text-gray-700 mb-2">Area to be Covered By Precast Wall</div>

                            {/* Length of Area */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length of Area</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={areaLength} onChange={(e) => setAreaLength(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={areaLengthInch} onChange={(e) => setAreaLengthInch(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Height of Area */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Height of Area</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={areaHeight} onChange={(e) => setAreaHeight(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={areaHeightInch} onChange={(e) => setAreaHeightInch(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs font-medium text-gray-700 mt-4 mb-2">Dimension of Horizontal Bar</div>

                            {/* Length of Bar */}
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Length of Bar</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={barLength} onChange={(e) => setBarLength(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={barLengthInch} onChange={(e) => setBarLengthInch(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Height of Bar */}
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Height of Bar</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input type="number" value={barHeight} onChange={(e) => setBarHeight(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">feet</span>
                                    </div>
                                    <div className="relative">
                                        <input type="number" value={barHeightInch} onChange={(e) => setBarHeightInch(Number(e.target.value))} className="w-full px-3 py-2 pr-10 border border-[#e5e7eb] rounded-lg text-sm" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">inch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className="flex-1 bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Calculate</button>
                                <button className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button>
                            </div>

                            {/* Results */}
                            <div className="bg-[#f8f9fa] rounded-xl p-4 space-y-3">
                                <div className="text-xs text-gray-500 mb-2">Quantity of horizontal bar & vertical post</div>

                                <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs">
                                    <strong>Note:</strong> Space is kept between horizontal bars
                                </div>

                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-2 py-1 text-left">Sr.</th>
                                            <th className="border px-2 py-1 text-left">Material</th>
                                            <th className="border px-2 py-1 text-left">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border px-2 py-1">1</td>
                                            <td className="border px-2 py-1">Horizontal Bar</td>
                                            <td className="border px-2 py-1 font-bold text-[#3B68FC]">{results?.totalHorizontalBars} Nos</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-2 py-1">2</td>
                                            <td className="border px-2 py-1">Vertical Post</td>
                                            <td className="border px-2 py-1 font-bold text-green-600">{results?.verticalPosts} Nos</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="bg-green-50 border border-green-200 p-2 rounded text-xs mt-2">
                                    <strong>Note:</strong> No Space is kept between horizontal bars
                                </div>

                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-2 py-1 text-left">Sr.</th>
                                            <th className="border px-2 py-1 text-left">Material</th>
                                            <th className="border px-2 py-1 text-left">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border px-2 py-1">1</td>
                                            <td className="border px-2 py-1">Horizontal Bar</td>
                                            <td className="border px-2 py-1 font-bold text-[#3B68FC]">{results?.horizontalBarActual} Nos</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-2 py-1">2</td>
                                            <td className="border px-2 py-1">Vertical Post</td>
                                            <td className="border px-2 py-1 font-bold text-green-600">{results?.verticalPosts} Nos</td>
                                        </tr>
                                    </tbody>
                                </table>
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
