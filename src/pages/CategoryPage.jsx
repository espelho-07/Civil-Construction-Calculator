import { Link, useParams } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';

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
            { name: 'Flooring Calculator', slug: '/flooring', icon: 'fa-border-bottom', desc: 'Calculate flooring materials' },
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
            { name: 'Water Content Determination', slug: '#', icon: 'fa-tint', desc: 'Soil moisture content test' },
            { name: 'Specific Gravity Determination', slug: '#', icon: 'fa-balance-scale-right', desc: 'Soil specific gravity test' },
            { name: 'Sieve Analysis of Soil', slug: '#', icon: 'fa-filter', desc: 'Particle size distribution' },
            { name: 'Free Swell Index of Soil', slug: '#', icon: 'fa-expand-arrows-alt', desc: 'Soil swelling potential' },
            { name: 'Liquid Limit of Soil', slug: '#', icon: 'fa-water', desc: 'Atterberg limits test' },
            { name: 'Permeability by Falling Head', slug: '#', icon: 'fa-arrow-down', desc: 'Falling head permeability test' },
            { name: 'Permeability by Constant Head', slug: '#', icon: 'fa-arrows-alt-h', desc: 'Constant head permeability test' },
            { name: 'Vane Shear Calculator', slug: '#', icon: 'fa-fan', desc: 'Vane shear strength test' },
            { name: 'Direct Shear Test', slug: '#', icon: 'fa-compress-arrows-alt', desc: 'Direct shear strength test' },
            { name: 'UCS Test Calculator', slug: '#', icon: 'fa-compress', desc: 'Unconfined compressive strength' },
            { name: 'IN-SITU Density by Core Cutter', slug: '#', icon: 'fa-circle', desc: 'Field density test' },
            { name: 'California Bearing Ratio (CBR)', slug: '#', icon: 'fa-road', desc: 'CBR test calculator' },
        ]
    },
    'sieve-analysis-aggregates': {
        name: 'Sieve Analysis of Aggregates', icon: 'fa-filter', color: 'text-blue-600',
        calculators: [
            { name: 'GSB Grading - I', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade I' },
            { name: 'GSB Grading - II', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade II' },
            { name: 'GSB Grading - III', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade III' },
            { name: 'GSB Grading - IV', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade IV' },
            { name: 'GSB Grading - V', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade V' },
            { name: 'GSB Grading - VI', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade VI' },
            { name: 'WBM Coarse (63mm-42mm)', slug: '#', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Coarse (53mm-22.4mm)', slug: '#', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Screenings Grade A (13.2mm)', slug: '#', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'WBM Screenings Grade B (11.2mm)', slug: '#', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'Wet Mix Macadam (WMM)', slug: '#', icon: 'fa-road', desc: 'WMM grading' },
            { name: 'Bituminous Macadam Grading-I (40mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BM nominal max 40mm' },
            { name: 'Bituminous Macadam Grading-II (19mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BM nominal max 19mm' },
            { name: 'DBM Grading-I (37.5mm)', slug: '#', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'DBM Grading-II (26.5mm)', slug: '#', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'Sand Asphalt Base Course', slug: '#', icon: 'fa-road', desc: 'Sand asphalt grading' },
            { name: 'Bituminous Concrete Grading-I (19mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BC nominal max 19mm' },
            { name: 'Bituminous Concrete Grading-II (13.2mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BC nominal max 13.2mm' },
            { name: 'MSS Type A', slug: '#', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type A' },
            { name: 'MSS Type B', slug: '#', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type B' },
            { name: 'Surface Dressing (19mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 19mm' },
            { name: 'Surface Dressing (13mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 13mm' },
            { name: 'Surface Dressing (10mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 10mm' },
            { name: 'Surface Dressing (6mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 6mm' },
            { name: 'Slurry Seal Type-I (2-3mm)', slug: '#', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-II (4-6mm)', slug: '#', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-III (6-8mm)', slug: '#', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'SMA 13mm (Wearing Course)', slug: '#', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'SMA 19mm (Binder Course)', slug: '#', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'Mastic Asphalt (Coarse)', slug: '#', icon: 'fa-fill-drip', desc: 'Coarse aggregate grading' },
            { name: 'Mastic Asphalt (Fine)', slug: '#', icon: 'fa-fill-drip', desc: 'Fine aggregate grading' },
        ]
    },
    'blending-aggregates': {
        name: 'Blending of Aggregates', icon: 'fa-blender', color: 'text-purple-600',
        calculators: [
            { name: 'GSB Grading - I', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade I' },
            { name: 'GSB Grading - II', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade II' },
            { name: 'GSB Grading - III', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade III' },
            { name: 'GSB Grading - IV', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade IV' },
            { name: 'GSB Grading - V', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade V' },
            { name: 'GSB Grading - VI', slug: '#', icon: 'fa-layer-group', desc: 'Granular Sub-base Grade VI' },
            { name: 'WBM Coarse (63mm-42mm)', slug: '#', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Coarse (53mm-22.4mm)', slug: '#', icon: 'fa-road', desc: 'Water Bound Macadam' },
            { name: 'WBM Screenings Grade A (13.2mm)', slug: '#', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'WBM Screenings Grade B (11.2mm)', slug: '#', icon: 'fa-road', desc: 'WBM Screenings' },
            { name: 'Wet Mix Macadam (WMM)', slug: '#', icon: 'fa-road', desc: 'WMM grading' },
            { name: 'Bituminous Macadam Grading-I (40mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BM nominal max 40mm' },
            { name: 'Bituminous Macadam Grading-II (19mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BM nominal max 19mm' },
            { name: 'DBM Grading-I (37.5mm)', slug: '#', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'DBM Grading-II (26.5mm)', slug: '#', icon: 'fa-fill-drip', desc: 'Dense Bituminous Macadam' },
            { name: 'Sand Asphalt Base Course', slug: '#', icon: 'fa-road', desc: 'Sand asphalt grading' },
            { name: 'Bituminous Concrete Grading-I (19mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BC nominal max 19mm' },
            { name: 'Bituminous Concrete Grading-II (13.2mm)', slug: '#', icon: 'fa-fill-drip', desc: 'BC nominal max 13.2mm' },
            { name: 'MSS Type A', slug: '#', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type A' },
            { name: 'MSS Type B', slug: '#', icon: 'fa-brush', desc: 'Mixed Seal Surfacing Type B' },
            { name: 'Surface Dressing (19mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 19mm' },
            { name: 'Surface Dressing (13mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 13mm' },
            { name: 'Surface Dressing (10mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 10mm' },
            { name: 'Surface Dressing (6mm)', slug: '#', icon: 'fa-brush', desc: 'Surfacing nominal 6mm' },
            { name: 'Slurry Seal Type-I (2-3mm)', slug: '#', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-II (4-6mm)', slug: '#', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'Slurry Seal Type-III (6-8mm)', slug: '#', icon: 'fa-water', desc: 'Slurry seal layer' },
            { name: 'SMA 13mm (Wearing Course)', slug: '#', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'SMA 19mm (Binder Course)', slug: '#', icon: 'fa-layer-group', desc: 'Stone Matrix Asphalt' },
            { name: 'Mastic Asphalt (Coarse)', slug: '#', icon: 'fa-fill-drip', desc: 'Coarse aggregate grading' },
            { name: 'Mastic Asphalt (Fine)', slug: '#', icon: 'fa-fill-drip', desc: 'Fine aggregate grading' },
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
    const category = categoryData[categorySlug] || defaultCategory;

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
            <section className="bg-white border-b border-[#e5e7eb] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <i className={`fas ${category.icon} text-4xl ${category.color}`}></i>
                        <div>
                            <h1 className="text-4xl font-bold text-[#0A0A0A]">{category.name} Calculators</h1>
                            <p className="text-[#6b7280] mt-1">{category.calculators.length} calculators available</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.calculators.map((calc) => (
                            <Link key={calc.name} to={calc.slug} className="bg-white border border-[#e5e7eb] rounded-xl p-5 hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all group">
                                <div className="flex items-start gap-4">
                                    <i className={`fas ${calc.icon} text-2xl ${category.color} shrink-0 group-hover:scale-110 transition-transform`}></i>
                                    <div>
                                        <h3 className="font-semibold text-[#0A0A0A] group-hover:text-[#3B68FC]">{calc.name}</h3>
                                        <p className="text-sm text-[#6b7280] mt-1">{calc.desc}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {category.calculators.length === 0 && (
                        <div className="text-center py-16 text-[#6b7280]">
                            <i className="fas fa-calculator text-5xl mb-4 opacity-30"></i>
                            <p>No calculators found in this category.</p>
                            <Link to="/" className="text-[#3B68FC] hover:underline mt-2 inline-block">← Back to home</Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
