import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import { getThemeClasses } from '../constants/categories';

export default function BlendingAggregatesPage() {
    const theme = getThemeClasses('purple'); // Theme matched to Category Page (Screenshot)
    const sidebarRef = useRef(null);

    const aggregateTypes = [
        { name: 'Grading for Granular Sub-base Materials (GSB)', grading: 'Grading - I', slug: '/blending-aggregates/gsb-grading-1' },
        { name: 'Grading for Granular Sub-base Materials (GSB)', grading: 'Grading - II', slug: '/blending-aggregates/gsb-grading-2' },
        { name: 'Grading for Granular Sub-base Materials (GSB)', grading: 'Grading - III', slug: '/blending-aggregates/gsb-grading-3' },
        { name: 'Grading for Granular Sub-base Materials (GSB)', grading: 'Grading - IV', slug: '/blending-aggregates/gsb-grading-4' },
        { name: 'Grading for Granular Sub-base Materials (GSB)', grading: 'Grading - V', slug: '/blending-aggregates/gsb-grading-5' },
        { name: 'Grading for Granular Sub-base Materials (GSB)', grading: 'Grading - VI', slug: '/blending-aggregates/gsb-grading-6' },
        { name: 'Water Bound Macadam Sub-Base / Base (WBM)', grading: 'Coarse Aggregates (63 mm to 42 mm)', slug: '/blending-aggregates/wbm-coarse-1' },
        { name: 'Water Bound Macadam Sub-Base / Base (WBM)', grading: 'Coarse Aggregates (53 mm to 22.4 mm)', slug: '/blending-aggregates/wbm-coarse-2' },
        { name: 'Water Bound Macadam Sub-Base / Base (WBM)', grading: 'Grading For Screenings - Grade A (13.2 mm)', slug: '/blending-aggregates/wbm-screening-a' },
        { name: 'Water Bound Macadam Sub-Base / Base (WBM)', grading: 'Grading For Screenings - Grade B (11.2 mm)', slug: '/blending-aggregates/wbm-screening-b' },
        { name: 'Wet Mix Macadam (WMM)', grading: '', slug: '/blending-aggregates/wmm' },
        { name: 'Bituminous Macadam', grading: 'Grading – I (Nominal maximum aggregate size (40 mm))', slug: '/blending-aggregates/bm-grading-1' },
        { name: 'Bituminous Macadam', grading: 'Grading-II (Nominal maximum aggregate size (19 mm))', slug: '/blending-aggregates/bm-grading-2' },
        { name: 'Dense Bituminous Macadam (DBM)', grading: 'Grading – I (Nominal maximum aggregate size (37.5 mm))', slug: '/blending-aggregates/dbm-grading-1' },
        { name: 'Dense Bituminous Macadam (DBM)', grading: 'Grading – II (Nominal maximum aggregate size (26.5 mm))', slug: '/blending-aggregates/dbm-grading-2' },
        { name: 'Sand Asphalt Base Course', grading: '', slug: '/blending-aggregates/sand-asphalt' },
        { name: 'Bituminous Concrete', grading: 'Grading – I (Nominal maximum aggregate size (19 mm))', slug: '/blending-aggregates/bc-grading-1' },
        { name: 'Bituminous Concrete', grading: 'Grading – II (Nominal maximum aggregate size (13.2 mm))', slug: '/blending-aggregates/bc-grading-2' },
        { name: 'Close-Graded Premix Surfacing / Mixed Seal Surfacing (MSS)', grading: 'Type A', slug: '/blending-aggregates/mss-type-a' },
        { name: 'Close-Graded Premix Surfacing / Mixed Seal Surfacing (MSS)', grading: 'Type B', slug: '/blending-aggregates/mss-type-b' },
        { name: 'Surfacing Dressing', grading: 'Nominal size - 19 mm', slug: '/blending-aggregates/sd-19mm' },
        { name: 'Surfacing Dressing', grading: 'Nominal size - 13 mm', slug: '/blending-aggregates/sd-13mm' },
        { name: 'Surfacing Dressing', grading: 'Nominal size - 10 mm', slug: '/blending-aggregates/sd-10mm' },
        { name: 'Surfacing Dressing', grading: 'Nominal size - 6 mm', slug: '/blending-aggregates/sd-6mm' },
        { name: 'Slurry Seal', grading: 'Type - I (Minimum Layer Thickness - 2-3 mm)', slug: '/blending-aggregates/slurry-type-1' },
        { name: 'Slurry Seal', grading: 'Type II (Minimum Layer Thickness - 4-6 mm)', slug: '/blending-aggregates/slurry-type-2' },
        { name: 'Slurry Seal', grading: 'Type III (Minimum Layer Thickness - 6-8 mm)', slug: '/blending-aggregates/slurry-type-3' },
        { name: 'Stone Matrix Asphalt (SMA)', grading: '13-mm SMA (Wearing course)', slug: '/blending-aggregates/sma-13mm' },
        { name: 'Stone Matrix Asphalt (SMA)', grading: '19-mm SMA (Binder (Intermediate) course)', slug: '/blending-aggregates/sma-19mm' },
        { name: 'Mastic Asphalt', grading: 'Coarse Aggregate', slug: '/blending-aggregates/mastic-coarse' },
        { name: 'Mastic Asphalt', grading: 'Fine Aggregate', slug: '/blending-aggregates/mastic-fine' },
    ];

    const [selectedTypes, setSelectedTypes] = useState(aggregateTypes.map(() => true));

    const toggleType = (index) => {
        const newSelected = [...selectedTypes];
        newSelected[index] = !newSelected[index];
        setSelectedTypes(newSelected);
    };

    const selectAll = () => setSelectedTypes(aggregateTypes.map(() => true));
    const deselectAll = () => setSelectedTypes(aggregateTypes.map(() => false));

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
        { name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', slug: '/sieve-analysis' },
        { name: 'Blending of Aggregates', icon: 'fa-blender', slug: '/blending-aggregates', active: true },
        { name: 'Aggregate Impact Value', icon: 'fa-hammer', slug: '/aggregate-impact-value' },
        { name: 'Aggregate Crushing Value', icon: 'fa-compress-alt', slug: '/aggregate-crushing-value' },
        { name: 'Aggregate Abrasion Value', icon: 'fa-cogs', slug: '/aggregate-abrasion-value' },
        { name: 'Aggregate Water Absorption', icon: 'fa-tint', slug: '/aggregate-water-absorption' },
    ];

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="concrete-technology" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                {/* Main Content */}
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Blending of Aggregates</h1>
                    <p className="text-[#6b7280] mb-6">Prepared from MORTH (Fifth Edition)</p>

                    {/* What is Blending */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <h2 className="text-lg font-bold text-[#0A0A0A] mb-3 flex items-center gap-2">
                                <i className={`fas fa-info-circle ${theme.text}`}></i>
                                What is Blending of Aggregates?
                            </h2>
                            <p className="text-sm text-[#0A0A0A] leading-relaxed">
                                Aggregate blending is the process of intermixing two or more fine or coarse aggregates to produce a combination with improved grading or other properties.
                            </p>
                        </div>
                    </section>

                    {/* Selection List */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-5 py-4 flex items-center justify-between bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-blender text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Select Type of Aggregates for Blending Analysis</h3>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={selectAll} className="px-3 py-1 bg-white/20 text-white text-xs rounded hover:bg-white/30 transition-colors">
                                        Select All
                                    </button>
                                    <button onClick={deselectAll} className="px-3 py-1 bg-white/20 text-white text-xs rounded hover:bg-white/30 transition-colors">
                                        Deselect All
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto">
                                {aggregateTypes.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between px-5 py-3 border-b ${theme.border} hover:bg-[#f8f9fa] transition-colors ${selectedTypes[index] ? 'bg-gray-50/50' : ''}`}
                                    >
                                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes[index]}
                                                onChange={() => toggleType(index)}
                                                className={`w-4 h-4 ${theme.text} rounded border-gray-300 focus:ring-gray-500`}
                                            />
                                            <span className="text-sm text-[#0A0A0A]">
                                                <Link to={type.slug} className={`${theme.text} hover:underline`}>{type.name}</Link>
                                                {type.grading && (
                                                    <span className="text-[#6b7280]"> ({type.grading})</span>
                                                )}
                                            </span>
                                        </label>
                                        <Link
                                            to={type.slug}
                                            className={`text-xs ${theme.text} hover:underline ${theme.bgSoft} px-2 py-1 rounded`}
                                        >
                                            Blending of Aggregates →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Ad Slot - Inline */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    {/* Related Calculators */}
                    {/* Related Calculators */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-calculator text-white text-sm"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">Concrete Technology</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
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
