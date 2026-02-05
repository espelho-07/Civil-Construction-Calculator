import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import { categories, getThemeClasses } from '../constants/categories';

// Reusing the static calculator data for now, but ideally this should also be centralized or fetched
// Mapping key from slug
const getCategoryKey = (slug) => {
    // This is a temporary mapping to match existing data structure with new slugs
    if (slug === 'sieve-analysis-aggregates') return 'sieve-analysis-aggregates';
    return slug;
};

// ... (Keeping the large categoryData object for now to avoid breaking data, but will access it dynamically)
// In a real app, this data should be in a separate file or database. 
// For this refactor, I will assume the existing categoryData object is available or I will declare it here.

const categoryData = {
    structural: {
        name: 'Structural', icon: 'fa-building', color: 'text-blue-600',
        calculators: []
    },
    'concrete-technology': {
        name: 'Concrete Technology', icon: 'fa-cubes', color: 'text-gray-600',
        calculators: [
            { name: 'Sieve Analysis of Aggregates', slug: '/sieve-analysis', icon: 'fa-filter', desc: 'Particle size distribution analysis' },
            { name: 'Blending of Aggregates', slug: '/blending-aggregates', icon: 'fa-blender', desc: 'Blend aggregates for desired gradation' },
            { name: 'Aggregate Impact Value', slug: '/aggregate-impact-value', icon: 'fa-hammer', desc: 'Test aggregate resistance to impact' },
            { name: 'Aggregate Crushing Value', slug: '/aggregate-crushing-value', icon: 'fa-compress-alt', desc: 'Measure aggregate crushing strength' },
            { name: 'Aggregate Abrasion Value', slug: '/aggregate-abrasion-value', icon: 'fa-cogs', desc: 'Los Angeles abrasion test' },
            { name: 'Aggregate Water Absorption', slug: '/aggregate-water-absorption', icon: 'fa-tint', desc: 'Calculate water absorption of aggregates' },
        ]
    },
    'quantity-estimator': {
        name: 'Quantity Estimator', icon: 'fa-calculator', color: 'text-green-600',
        calculators: [
            { name: 'Construction Cost Calculator', slug: '/construction-cost', icon: 'fa-rupee-sign', desc: 'Estimate construction costs' },
            { name: 'Carpet Area / Built up / Super Built up Calculator', slug: '/carpet-area', icon: 'fa-vector-square', desc: 'Calculate different area types' },
            { name: 'Cement Concrete Calculator', slug: '/cement-concrete', icon: 'fa-cubes', desc: 'Calculate cement concrete quantity' },
            { name: 'Plastering Calculator', slug: '/plastering', icon: 'fa-brush', desc: 'Calculate plaster volume' },
            { name: 'Brick Calculator', slug: '/brick-masonry', icon: 'fa-th-large', desc: 'Calculate clay bricks needed' },
            { name: 'Concrete Block Calculator', slug: '/concrete-block', icon: 'fa-th', desc: 'Calculate concrete blocks needed' },
            { name: 'Precast Compound Wall Calculator', slug: '/precast-boundary-wall', icon: 'fa-border-all', desc: 'Boundary wall calculations' },
            { name: 'Flooring Calculator', slug: '/flooring', icon: 'fa-border-all', desc: 'Calculate flooring materials' },
            { name: 'Countertop (Platform) Calculator', slug: '/countertop', icon: 'fa-ruler-combined', desc: 'Kitchen countertop calculations' },
            { name: 'Tank Volume Calculator', slug: '/tank-volume', icon: 'fa-tint', desc: 'Calculate tank capacity' },
            { name: 'Air Conditioner Size Calculator', slug: '/ac-calculator', icon: 'fa-snowflake', desc: 'Calculate AC tonnage' },
            { name: 'Solar Rooftop Calculator', slug: '/solar-rooftop', icon: 'fa-solar-panel', desc: 'Solar panel installation' },
            { name: 'Solar Water Heater Calculator', slug: '/solar-water-heater', icon: 'fa-sun', desc: 'Solar water heater sizing' },
            { name: 'Paint Work Calculator', slug: '/paint-work', icon: 'fa-paint-roller', desc: 'Calculate paint quantity' },
            { name: 'Excavation Calculator', slug: '/excavation', icon: 'fa-truck-loading', desc: 'Earthwork excavation volume' },
            { name: 'Wood Framing Calculator', slug: '/wood-frame', icon: 'fa-tree', desc: 'Wood framing material estimate' },
            { name: 'Plywood Sheets Calculator', slug: '/plywood', icon: 'fa-layer-group', desc: 'Calculate plywood sheets' },
            { name: 'Anti Termite Calculator', slug: '/anti-termite', icon: 'fa-bug', desc: 'Anti termite treatment' },
            { name: 'Round Column Calculator', slug: '/round-column', icon: 'fa-circle', desc: 'Circular column calculations' },
            { name: 'Stair Case Calculator', slug: '/stair-case', icon: 'fa-stairs', desc: 'Staircase design calculations' },
            { name: 'Top Soil Calculator', slug: '/top-soil', icon: 'fa-seedling', desc: 'Top soil quantity' },
            { name: 'Steel Weight Calculator', slug: '/steel-weight', icon: 'fa-weight-hanging', desc: 'Calculate steel weight' },
            { name: 'Concrete Tube Calculator', slug: '/concrete-tube', icon: 'fa-circle-notch', desc: 'Concrete tube calculations' },
            { name: 'Roof Pitch Calculator', slug: '/roof-pitch', icon: 'fa-home', desc: 'Calculate roof pitch angle' },
            { name: 'Asphalt Calculator', slug: '/asphalt', icon: 'fa-road', desc: 'Asphalt quantity estimate' },
            { name: 'Steel Quantity Calculator', slug: '/steel-quantity', icon: 'fa-bars', desc: 'Reinforcement steel quantity' },
            { name: 'Civil Unit Converter', slug: '/unit-converter', icon: 'fa-exchange-alt', desc: 'Convert civil units' },
        ]
    },
    construction: {
        name: 'Construction', icon: 'fa-hard-hat', color: 'text-yellow-500',
        calculators: []
    },
    'road-construction': {
        name: 'Road Construction', icon: 'fa-road', color: 'text-gray-700',
        calculators: [
            { name: 'Bitumen Prime Coat', slug: '/bitumen-prime-coat', icon: 'fa-fill-drip', desc: 'Calculate prime coat quantity' },
            { name: 'Bitumen Tack Coat', slug: '/bitumen-tack-coat', icon: 'fa-brush', desc: 'Calculate tack coat quantity' },
        ]
    },
    'steel-design': {
        name: 'Steel Design', icon: 'fa-drafting-compass', color: 'text-indigo-600',
        calculators: [
            { name: 'Steel Beam Design', slug: '#', icon: 'fa-drafting-compass', desc: 'Design steel beams per IS code' },
            { name: 'Connection Design', slug: '#', icon: 'fa-link', desc: 'Bolted and welded connections' },
        ]
    },
    foundation: {
        name: 'Foundation', icon: 'fa-layer-group', color: 'text-stone-600',
        calculators: [
            { name: 'Footing Design', slug: '#', icon: 'fa-layer-group', desc: 'Isolated and combined footings' },
            { name: 'Pile Capacity', slug: '#', icon: 'fa-compress-alt', desc: 'Calculate pile load capacity' },
        ]
    },
    'soil-test': {
        name: 'Soil Test', icon: 'fa-vial', color: 'text-amber-600',
        calculators: [
            { name: 'Water Content Determination', slug: '/water-content', icon: 'fa-tint', desc: 'Soil moisture content test' },
            { name: 'Specific Gravity Determination', slug: '/specific-gravity', icon: 'fa-balance-scale-right', desc: 'Soil specific gravity test' },
            { name: 'Sieve Analysis of Soil', slug: '/soil-sieve-analysis', icon: 'fa-filter', desc: 'Particle size distribution' },
            { name: 'Free Swell Index of Soil', slug: '/free-swell-index', icon: 'fa-expand-arrows-alt', desc: 'Soil swelling potential' },
            { name: 'Liquid Limit of Soil', slug: '/liquid-limit', icon: 'fa-water', desc: 'Atterberg limits test' },
            { name: 'Permeability by Falling Head', slug: '/permeability-falling-head', icon: 'fa-arrow-down', desc: 'Falling head permeability test' },
            { name: 'Permeability by Constant Head', slug: '/permeability-constant-head', icon: 'fa-arrows-alt-h', desc: 'Constant head permeability test' },
            { name: 'Vane Shear Calculator', slug: '/vane-shear', icon: 'fa-fan', desc: 'Vane shear strength test' },
            { name: 'Direct Shear Test', slug: '/direct-shear', icon: 'fa-compress-arrows-alt', desc: 'Direct shear strength test' },
            { name: 'UCS Test Calculator', slug: '/ucs-test', icon: 'fa-compress', desc: 'Unconfined compressive strength' },
            { name: 'IN-SITU Density by Core Cutter', slug: '/in-situ-density', icon: 'fa-circle', desc: 'Field density test' },
            { name: 'California Bearing Ratio (CBR)', slug: '/cbr-test', icon: 'fa-road', desc: 'CBR test calculator' },
        ]
    },
    'sieve-analysis-aggregates': {
        name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', color: 'text-blue-600',
        calculators: [
            { name: 'GSB Grading - I', slug: '/sieve-analysis/gsb-grading-1', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade I' },
            { name: 'GSB Grading - II', slug: '/sieve-analysis/gsb-grading-2', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade II' },
            { name: 'GSB Grading - III', slug: '/sieve-analysis/gsb-grading-3', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade III' },
            { name: 'GSB Grading - IV', slug: '/sieve-analysis/gsb-grading-4', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade IV' },
            { name: 'GSB Grading - V', slug: '/sieve-analysis/gsb-grading-5', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade V' },
            { name: 'GSB Grading - VI', slug: '/sieve-analysis/gsb-grading-6', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade VI' },
            { name: 'WBM Coarse (63mm-42mm)', slug: '/sieve-analysis/wbm-coarse-1', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Coarse (53mm-22.4mm)', slug: '/sieve-analysis/wbm-coarse-2', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Screenings Grade A (13.2mm)', slug: '/sieve-analysis/wbm-screening-a', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'WBM Screenings Grade B (11.2mm)', slug: '/sieve-analysis/wbm-screening-b', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'Wet Mix Macadam (WMM)', slug: '/sieve-analysis/wmm', icon: 'fa-road', desc: 'WMM grading' },
            { name: 'Bituminous Macadam Grading-I (40mm)', slug: '/sieve-analysis/bm-grading-1', icon: 'fa-fill-drip', desc: 'BM nominal max 40mm' },
            { name: 'Bituminous Macadam Grading-II (19mm)', slug: '/sieve-analysis/bm-grading-2', icon: 'fa-fill-drip', desc: 'BM nominal max 19mm' },
            { name: 'DBM Grading-I (37.5mm)', slug: '/sieve-analysis/dbm-grading-1', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'DBM Grading-II (26.5mm)', slug: '/sieve-analysis/dbm-grading-2', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'Sand Asphalt Base Course', slug: '/sieve-analysis/sand-asphalt', icon: 'fa-road', desc: 'Sand asphalt grading' },
            { name: 'Bituminous Concrete Grading-I (19mm)', slug: '/sieve-analysis/bc-grading-1', icon: 'fa-fill-drip', desc: 'BC nominal max 19mm' },
            { name: 'Bituminous Concrete Grading-II (13.2mm)', slug: '/sieve-analysis/bc-grading-2', icon: 'fa-fill-drip', desc: 'BC nominal max 13.2mm' },
            { name: 'MSS Type A', slug: '/sieve-analysis/mss-type-a', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type A' },
            { name: 'MSS Type B', slug: '/sieve-analysis/mss-type-b', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type B' },
            { name: 'Surface Dressing (19mm)', slug: '/sieve-analysis/sd-19mm', icon: 'fa-brush', desc: 'Surfacing nominal 19mm' },
            { name: 'Surface Dressing (13mm)', slug: '/sieve-analysis/sd-13mm', icon: 'fa-brush', desc: 'Surfacing nominal 13mm' },
            { name: 'Surface Dressing (10mm)', slug: '/sieve-analysis/sd-10mm', icon: 'fa-brush', desc: 'Surfacing nominal 10mm' },
            { name: 'Surface Dressing (6mm)', slug: '/sieve-analysis/sd-6mm', icon: 'fa-brush', desc: 'Surfacing nominal 6mm' },
            { name: 'Slurry Seal Type-I (2-3mm)', slug: '/sieve-analysis/slurry-type-1', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-II (4-6mm)', slug: '/sieve-analysis/slurry-type-2', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-III (6-8mm)', slug: '/sieve-analysis/slurry-type-3', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'SMA 13mm (Wearing Course)', slug: '/sieve-analysis/sma-13mm', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'SMA 19mm (Binder Course)', slug: '/sieve-analysis/sma-19mm', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'Mastic Asphalt (Coarse)', slug: '/sieve-analysis/mastic-coarse', icon: 'fa-fill-drip', desc: 'Coarse aggregate grading' },
            { name: 'Mastic Asphalt (Fine)', slug: '/sieve-analysis/mastic-fine', icon: 'fa-fill-drip', desc: 'Fine aggregate grading' },
        ]
    },
    'blending-aggregates': {
        name: 'Blending of Aggregates', icon: 'fa-blender', color: 'text-purple-600',
        calculators: [
            { name: 'GSB Grading - I', slug: '/blending-aggregates/gsb-grading-1', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade I' },
            { name: 'GSB Grading - II', slug: '/blending-aggregates/gsb-grading-2', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade II' },
            { name: 'GSB Grading - III', slug: '/blending-aggregates/gsb-grading-3', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade III' },
            { name: 'GSB Grading - IV', slug: '/blending-aggregates/gsb-grading-4', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade IV' },
            { name: 'GSB Grading - V', slug: '/blending-aggregates/gsb-grading-5', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade V' },
            { name: 'GSB Grading - VI', slug: '/blending-aggregates/gsb-grading-6', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade VI' },
            { name: 'WBM Coarse (63mm-42mm)', slug: '/blending-aggregates/wbm-coarse-1', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Coarse (53mm-22.4mm)', slug: '/blending-aggregates/wbm-coarse-2', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Screenings Grade A (13.2mm)', slug: '/blending-aggregates/wbm-screening-a', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'WBM Screenings Grade B (11.2mm)', slug: '/blending-aggregates/wbm-screening-b', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'Wet Mix Macadam (WMM)', slug: '/blending-aggregates/wmm', icon: 'fa-road', desc: 'WMM grading' },
            { name: 'Bituminous Macadam Grading-I (40mm)', slug: '/blending-aggregates/bm-grading-1', icon: 'fa-fill-drip', desc: 'BM nominal max 40mm' },
            { name: 'Bituminous Macadam Grading-II (19mm)', slug: '/blending-aggregates/bm-grading-2', icon: 'fa-fill-drip', desc: 'BM nominal max 19mm' },
            { name: 'DBM Grading-I (37.5mm)', slug: '/blending-aggregates/dbm-grading-1', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'DBM Grading-II (26.5mm)', slug: '/blending-aggregates/dbm-grading-2', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'Sand Asphalt Base Course', slug: '/blending-aggregates/sand-asphalt', icon: 'fa-road', desc: 'Sand asphalt grading' },
            { name: 'Bituminous Concrete Grading-I (19mm)', slug: '/blending-aggregates/bc-grading-1', icon: 'fa-fill-drip', desc: 'BC nominal max 19mm' },
            { name: 'Bituminous Concrete Grading-II (13.2mm)', slug: '/blending-aggregates/bc-grading-2', icon: 'fa-fill-drip', desc: 'BC nominal max 13.2mm' },
            { name: 'MSS Type A', slug: '/blending-aggregates/mss-type-a', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type A' },
            { name: 'MSS Type B', slug: '/blending-aggregates/mss-type-b', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type B' },
            { name: 'Surface Dressing (19mm)', slug: '/blending-aggregates/sd-19mm', icon: 'fa-brush', desc: 'Surfacing nominal 19mm' },
            { name: 'Surface Dressing (13mm)', slug: '/blending-aggregates/sd-13mm', icon: 'fa-brush', desc: 'Surfacing nominal 13mm' },
            { name: 'Surface Dressing (10mm)', slug: '/blending-aggregates/sd-10mm', icon: 'fa-brush', desc: 'Surfacing nominal 10mm' },
            { name: 'Surface Dressing (6mm)', slug: '/blending-aggregates/sd-6mm', icon: 'fa-brush', desc: 'Surfacing nominal 6mm' },
            { name: 'Slurry Seal Type-I (2-3mm)', slug: '/blending-aggregates/slurry-type-1', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-II (4-6mm)', slug: '/blending-aggregates/slurry-type-2', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-III (6-8mm)', slug: '/blending-aggregates/slurry-type-3', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'SMA 13mm (Wearing Course)', slug: '/blending-aggregates/sma-13mm', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'SMA 19mm (Binder Course)', slug: '/blending-aggregates/sma-19mm', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'Mastic Asphalt (Coarse)', slug: '/blending-aggregates/mastic-coarse', icon: 'fa-fill-drip', desc: 'Coarse aggregate grading' },
            { name: 'Mastic Asphalt (Fine)', slug: '/blending-aggregates/mastic-fine', icon: 'fa-fill-drip', desc: 'Fine aggregate grading' },
        ]
    },
    materials: {
        name: 'Materials', icon: 'fa-th-large', color: 'text-purple-500',
        calculators: []
    },
    'environmental-engineering': {
        name: 'Environmental Engineering', icon: 'fa-leaf', color: 'text-green-600',
        calculators: [
            { name: 'Chemical Oxygen Demand (COD)', slug: '/cod-calculator', icon: 'fa-flask', desc: 'COD test calculator' },
            { name: 'Biochemical Oxygen Demand (BOD)', slug: '/bod-calculator', icon: 'fa-vial', desc: 'BOD test calculator' },
            { name: 'Ammonical Nitrogen Test', slug: '/ammonical-nitrogen', icon: 'fa-atom', desc: 'Nitrogen content test' },
        ]
    },
    others: {
        name: 'Other Categories', icon: 'fa-th-list', color: 'text-gray-500',
        isSubCategories: true,
        subCategories: [
            { name: 'Blending of Aggregates', slug: 'blending-aggregates', icon: 'fa-blender', color: 'text-purple-600', count: 31 },
        ],
        calculators: []
    },
};

const defaultCategory = { name: 'Calculators', icon: 'fa-calculator', color: 'text-gray-500', calculators: [] };

export default function CategoryPage() {
    const { categorySlug } = useParams();
    const [searchQuery, setSearchQuery] = useState('');

    const category = categoryData[categorySlug] || defaultCategory;

    // Get central theme Config
    const categoryConfig = categories.find(c => c.slug === categorySlug);
    const theme = getThemeClasses(categoryConfig ? categoryConfig.theme : 'blue');

    // Filter calculators
    const filteredCalculators = category.calculators.filter(calc =>
        calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Special handling for "Others" page - show sub-categories
    if (categorySlug === 'others' && category.isSubCategories) {
        return (
            <main className="min-h-screen bg-[#F7F9FF]">
                <CategoryNav activeCategory={categorySlug} />
                <section className="bg-white border-b border-[#e5e7eb] py-12 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-4">
                            <i className={`fas ${category.icon} text-4xl ${category.color}`}></i>
                            <div>
                                <h1 className="text-4xl font-bold text-[#0A0A0A]">{category.name}</h1>
                                <p className="text-[#6b7280] mt-1">Browse more calculator categories</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-8 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.subCategories.map((subCat) => (
                                <Link key={subCat.slug} to={`/category/${subCat.slug}`} className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all group">
                                    <div className="flex items-start gap-4">
                                        <i className={`fas ${subCat.icon} text-3xl ${subCat.color} shrink-0 group-hover:scale-110 transition-transform`}></i>
                                        <div>
                                            <h3 className="font-semibold text-[#0A0A0A] group-hover:text-[#3B68FC]">{subCat.name}</h3>
                                            <p className="text-sm text-[#6b7280] mt-1">{subCat.count} calculators</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory={categorySlug} />

            {/* Header Section with Dynamic Theme */}
            <section className={`bg-white border-b border-[#e5e7eb] py-10 px-6 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bsSoft} rounded-full blur-[80px] opacity-40 -mr-20 -mt-20`}></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-2xl ${theme.bgLight} flex items-center justify-center shrink-0 border ${theme.border}`}>
                                <i className={`fas ${category.icon} text-3xl ${theme.text}`}></i>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A]">{category.name}</h1>
                                <div className="flex items-center gap-2 mt-2 text-[#6b7280]">
                                    <span>{category.calculators.length} Calculators</span>
                                    {categoryConfig && (
                                        <>
                                            <span>•</span>
                                            <span>{categoryConfig.description}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Search Bar within Category */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder={`Search in ${category.name}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-offset-1 ${theme.focus} transition-all`}
                            />
                            <i className={`fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400`}></i>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {filteredCalculators.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCalculators.map((calc) => (
                                <Link
                                    key={calc.name}
                                    to={calc.slug}
                                    className={`bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-lg transition-all group hover:-translate-y-1 ${theme.hover.replace('bg-', 'border-').replace('700', '200')}`} // Hacky hover border
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${theme.bgLight} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                            <i className={`fas ${calc.icon} text-lg ${theme.text}`}></i>
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-[#0A0A0A] group-hover:${theme.text} transition-colors`}>{calc.name}</h3>
                                            <p className="text-sm text-[#6b7280] mt-1 text-justify">{calc.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className={`inline-flex w-16 h-16 rounded-full ${theme.bgLight} items-center justify-center mb-4`}>
                                <i className={`fas fa-search text-2xl ${theme.text} opacity-50`}></i>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No calculators found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your search terms for {category.name}</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`mt-4 px-4 py-2 text-sm font-medium ${theme.text} hover:underline`}
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {category.calculators.length === 0 && (
                        <div className="text-center py-16 text-[#6b7280]">
                            <i className="fas fa-calculator text-5xl mb-4 opacity-30"></i>
                            <p>No calculators found in this category.</p>
                            <Link to="/" className={`mt-2 inline-block ${theme.text} hover:underline`}>← Back to home</Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
