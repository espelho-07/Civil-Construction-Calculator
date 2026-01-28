import { Link } from 'react-router-dom';

const categories = [
    { name: 'Concrete Technology', count: 6, icon: 'fa-cubes', color: 'text-gray-600', slug: 'concrete-technology' },
    { name: 'Quantity Estimator', count: 26, icon: 'fa-calculator', color: 'text-green-600', slug: 'quantity-estimator' },
    { name: 'Road Construction', count: 2, icon: 'fa-road', color: 'text-gray-700', slug: 'road-construction' },
    { name: 'Soil Test', count: 12, icon: 'fa-vial', color: 'text-amber-600', slug: 'soil-test' },
    { name: 'Sieve Analysis', count: 31, icon: 'fa-filter', color: 'text-blue-600', slug: 'sieve-analysis-aggregates' },
    { name: 'Environmental Eng.', count: 3, icon: 'fa-leaf', color: 'text-green-600', slug: 'environmental-engineering' },
    { name: 'Construction', count: 5, icon: 'fa-hard-hat', color: 'text-yellow-500', slug: 'construction' },
    { name: 'Structural', count: 3, icon: 'fa-building', color: 'text-blue-600', slug: 'structural' },
    { name: 'Steel Design', count: 2, icon: 'fa-drafting-compass', color: 'text-indigo-600', slug: 'steel-design' },
    { name: 'Foundation', count: 2, icon: 'fa-layer-group', color: 'text-stone-600', slug: 'foundation' },
    { name: 'Materials', count: 2, icon: 'fa-th-large', color: 'text-purple-500', slug: 'materials' },
];

const mostSearched = [
    { name: 'Countertop Calculator', slug: '/countertop', icon: 'fa-ruler-combined', searches: '45.2K', category: 'Quantity Estimator' },
    { name: 'Flooring Calculator', slug: '/flooring', icon: 'fa-border-bottom', searches: '42.1K', category: 'Quantity Estimator' },
    { name: 'Brick Calculator', slug: '/brick-masonry', icon: 'fa-th-large', searches: '32.1K', category: 'Quantity Estimator' },
    { name: 'Tank Volume Calculator', slug: '/tank-volume', icon: 'fa-tint', searches: '28.5K', category: 'Quantity Estimator' },
    { name: 'Concrete Block Calculator', slug: '/concrete-block', icon: 'fa-th', searches: '25.3K', category: 'Quantity Estimator' },
    { name: 'Precast Wall Calculator', slug: '/precast-boundary-wall', icon: 'fa-border-all', searches: '22.8K', category: 'Quantity Estimator' },
    { name: 'Plastering Calculator', slug: '/plastering', icon: 'fa-brush', searches: '20.1K', category: 'Quantity Estimator' },
    { name: 'Cement Concrete', slug: '/cement-concrete', icon: 'fa-cubes', searches: '18.9K', category: 'Quantity Estimator' },
];


export default function HomePage() {
    return (
        <main>
            <section className="relative py-16 px-6 overflow-hidden min-h-[320px]">
                <div className="absolute inset-0 -top-24 overflow-hidden pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] bg-blue-200/70 rounded-full blur-[100px] -top-20 -left-32"></div>
                    <div className="absolute w-[400px] h-[400px] bg-yellow-200/70 rounded-full blur-[100px] top-0 right-[20%]"></div>
                    <div className="absolute w-[350px] h-[350px] bg-orange-200/70 rounded-full blur-[100px] top-16 -right-20"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-[48px] leading-[1.1] mb-8 text-[#0A0A0A]">
                                <span className="font-bold">Civil Engineering</span><br />
                                <span className="text-[#3B68FC]">Calculators</span>
                            </h1>
                            <p className="text-lg text-[#6b7280] mb-6 max-w-md">Free online tools for structural analysis, concrete design, geotechnical calculations and more.</p>
                            <div className="relative max-w-[500px]">
                                <input type="text" placeholder="Search calculators..." className="w-full h-14 px-6 pr-14 rounded-full border border-[#e5e7eb] bg-white text-base outline-none focus:border-[#3B68FC] focus:shadow-[0_4px_20px_rgba(59,104,252,0.2)] transition-all" />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B68FC] text-lg hover:scale-110 transition-transform"><i className="fas fa-search"></i></button>
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col gap-3 bg-gradient-to-br from-blue-600 via-[#3B68FC] to-indigo-600 p-6 rounded-2xl shadow-[0_8px_32px_rgba(59,104,252,0.3)]">
                            <i className="fas fa-building text-white text-2xl"></i>
                            <i className="fas fa-drafting-compass text-white text-2xl"></i>
                            <i className="fas fa-hard-hat text-white text-2xl"></i>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-10 rounded-t-[40px] -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-6xl mx-auto">
                    {/* Most Searched Calculators */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#0A0A0A]">🔥 Most Searched Calculators</h2>
                            <a href="#" className="text-[#3B68FC] text-sm hover:underline">View all →</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mostSearched.map((calc, index) => (
                                <Link
                                    key={calc.name}
                                    to={calc.slug}
                                    className="flex items-start gap-4 p-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-[#e5e7eb] shrink-0 group-hover:border-[#3B68FC]">
                                        <i className={`fas ${calc.icon} text-[#3B68FC]`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-[#0A0A0A] text-sm group-hover:text-[#3B68FC] truncate">{calc.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-[#6b7280]">{calc.category}</span>
                                            <span className="text-xs text-[#9ca3af]">•</span>
                                            <span className="text-xs text-[#3B68FC] font-medium">{calc.searches}</span>
                                        </div>
                                    </div>
                                    {index < 3 && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'}`}>
                                            #{index + 1}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <Link key={cat.name} to={`/category/${cat.slug}`} className="flex flex-col items-center p-6 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl text-center hover:shadow-lg hover:border-[#3B68FC] hover:-translate-y-1 transition-all">
                                <i className={`fas ${cat.icon} text-2xl ${cat.color} mb-3`}></i>
                                <span className="font-medium text-[#0A0A0A] text-sm">{cat.name}</span>
                                <span className="text-xs text-[#6b7280] mt-1">{cat.count} calculators</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
