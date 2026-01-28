import { Link, useLocation } from 'react-router-dom';

const categories = [
    { name: 'Concrete Technology', slug: 'concrete-technology' },
    { name: 'Quantity Estimator', slug: 'quantity-estimator' },
    { name: 'Road Construction', slug: 'road-construction' },
    { name: 'Soil Test', slug: 'soil-test' },
    { name: 'Sieve Analysis', slug: 'sieve-analysis-aggregates' },
    { name: 'Environmental Eng.', slug: 'environmental-engineering' },
    { name: 'Blending', slug: 'blending-aggregates' },
    { name: 'Others', slug: 'others' },
];

export default function CategoryNav({ activeCategory }) {
    const location = useLocation();

    const getActiveCategory = () => {
        if (activeCategory) return activeCategory;
        const path = location.pathname;
        if (path.includes('/concrete-technology')) return 'concrete-technology';
        if (path.includes('/quantity-estimator') || path.includes('/countertop')) return 'quantity-estimator';
        if (path.includes('/road-construction')) return 'road-construction';
        if (path.includes('/soil-test')) return 'soil-test';
        if (path.includes('/sieve-analysis')) return 'sieve-analysis-aggregates';
        if (path.includes('/environmental')) return 'environmental-engineering';
        if (path.includes('/construction')) return 'construction';
        if (path.includes('/blending')) return 'blending-aggregates';
        // Others sub-categories
        if (path.includes('/structural') || path.includes('/steel-design') || path.includes('/foundation') || path.includes('/materials')) return 'others';
        return null;
    };

    const active = getActiveCategory();

    return (
        <nav className="bg-white border-b border-[#e5e7eb] sticky top-16 z-40">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-x-6 py-3 text-sm">
                    {categories.map((cat) => {
                        const isActive = active === cat.slug;
                        return (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                className={`whitespace-nowrap transition-colors pb-2 -mb-[13px] ${isActive ? 'text-[#3B68FC] font-semibold border-b-2 border-[#3B68FC]' : 'text-[#6b7280] hover:text-[#0A0A0A]'}`}
                            >
                                {cat.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
