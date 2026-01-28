import { Link, useLocation } from 'react-router-dom';

const categories = [
    { name: 'Biology', slug: 'biology' },
    { name: 'Chemistry', slug: 'chemistry' },
    { name: 'Construction', slug: 'construction' },
    { name: 'Conversion', slug: 'conversion' },
    { name: 'Ecology', slug: 'ecology' },
    { name: 'Everyday life', slug: 'everyday-life' },
    { name: 'Finance', slug: 'finance' },
    { name: 'Food', slug: 'food' },
    { name: 'Health', slug: 'health' },
    { name: 'Math', slug: 'math' },
    { name: 'Physics', slug: 'physics' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Statistics', slug: 'statistics' },
    { name: 'Other', slug: 'other' },
];

export default function CategoryNav({ activeCategory }) {
    const location = useLocation();

    // Determine active category from prop or URL
    const getActiveCategory = () => {
        if (activeCategory) return activeCategory;
        const path = location.pathname;
        if (path.includes('/bmi') || path.includes('/biology')) return 'biology';
        if (path.includes('/percentage') || path.includes('/math')) return 'math';
        if (path.includes('/age') || path.includes('/everyday')) return 'everyday-life';
        if (path.includes('/finance') || path.includes('/loan')) return 'finance';
        return null;
    };

    const active = getActiveCategory();

    return (
        <nav className="bg-white border-b border-[#e5e7eb] sticky top-16 z-40">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center flex-wrap gap-x-6 gap-y-2 py-3 text-sm">
                    {categories.map((cat) => {
                        const isActive = active === cat.slug;
                        return (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                className={`whitespace-nowrap transition-colors pb-2 -mb-[13px] ${isActive
                                    ? 'text-[#3B68FC] font-semibold border-b-2 border-[#3B68FC]'
                                    : 'text-[#6b7280] hover:text-[#0A0A0A]'
                                    }`}
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
