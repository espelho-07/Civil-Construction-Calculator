import { Link } from 'react-router-dom';

const categories = [
    { name: 'Biology', count: 156, icon: 'fa-dna', color: 'text-green-500', bgColor: 'bg-green-50', slug: 'biology' },
    { name: 'Construction', count: 89, icon: 'fa-hard-hat', color: 'text-orange-500', bgColor: 'bg-orange-50', slug: 'construction' },
    { name: 'Conversion', count: 134, icon: 'fa-exchange-alt', color: 'text-purple-500', bgColor: 'bg-purple-50', slug: 'conversion' },
    { name: 'Everyday life', count: 245, icon: 'fa-sun', color: 'text-yellow-500', bgColor: 'bg-yellow-50', slug: 'everyday-life' },
    { name: 'Finance', count: 312, icon: 'fa-chart-line', color: 'text-emerald-500', bgColor: 'bg-emerald-50', slug: 'finance' },
    { name: 'Food', count: 78, icon: 'fa-utensils', color: 'text-red-400', bgColor: 'bg-red-50', slug: 'food' },
    { name: 'Health', count: 198, icon: 'fa-heartbeat', color: 'text-pink-500', bgColor: 'bg-pink-50', slug: 'health' },
    { name: 'Math', count: 167, icon: 'fa-square-root-alt', color: 'text-[#3B68FC]', bgColor: 'bg-blue-50', slug: 'math' },
    { name: 'Physics', count: 145, icon: 'fa-atom', color: 'text-indigo-500', bgColor: 'bg-indigo-50', slug: 'physics' },
    { name: 'Sports', count: 67, icon: 'fa-running', color: 'text-teal-500', bgColor: 'bg-teal-50', slug: 'sports' },
    { name: 'Statistics', count: 112, icon: 'fa-chart-bar', color: 'text-cyan-500', bgColor: 'bg-cyan-50', slug: 'statistics' },
    { name: 'Other', count: 234, icon: 'fa-ellipsis-h', color: 'text-gray-500', bgColor: 'bg-gray-50', slug: 'other' },
];

export default function HomePage() {
    return (
        <main>
            {/* Hero Section */}
            <section className="relative py-16 px-6 overflow-hidden min-h-[320px]">
                {/* Gradient Background */}
                <div className="absolute inset-0 -top-24 overflow-hidden pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] bg-blue-200/70 rounded-full blur-[100px] -top-20 -left-32"></div>
                    <div className="absolute w-[400px] h-[400px] bg-yellow-200/70 rounded-full blur-[100px] top-0 right-[20%]"></div>
                    <div className="absolute w-[350px] h-[350px] bg-pink-200/70 rounded-full blur-[100px] top-16 -right-20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-[52px] leading-[1.1] mb-8 text-[#0A0A0A]">
                                Your life in <span className="font-bold text-[#3B68FC]">3787</span>
                                <br />
                                <span className="font-bold">free calculators</span>
                            </h1>

                            {/* Search Bar */}
                            <div className="relative max-w-[500px]">
                                <input
                                    type="text"
                                    placeholder="Search through every calculator"
                                    className="w-full h-14 px-6 pr-14 rounded-full border border-[#e5e7eb] bg-white text-base outline-none focus:border-[#3B68FC] focus:shadow-[0_4px_20px_rgba(59,104,252,0.2)] transition-all"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B68FC] text-lg hover:scale-110 transition-transform">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>

                        {/* Floating Math Icon */}
                        <div className="hidden lg:flex flex-col gap-2 bg-gradient-to-br from-red-500 via-orange-400 to-[#3B68FC] p-5 rounded-2xl shadow-[0_8px_32px_rgba(59,104,252,0.3)]">
                            <i className="fas fa-plus text-white text-xl"></i>
                            <i className="fas fa-minus text-white text-xl"></i>
                            <i className="fas fa-equals text-white text-xl"></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-white px-6 py-10 pb-20 rounded-t-[40px] -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/category/${cat.slug}`}
                                className="category-card flex flex-col items-center p-6 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl text-center"
                            >
                                <div className={`w-12 h-12 ${cat.bgColor} rounded-xl flex items-center justify-center text-2xl ${cat.color} mb-3`}>
                                    <i className={`fas ${cat.icon}`}></i>
                                </div>
                                <span className="font-medium text-[#0A0A0A] text-sm">{cat.name}</span>
                                <span className="text-xs text-[#6b7280] mt-1">{cat.count} calculators</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="bg-white px-6 py-16">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-[#6b7280] font-medium mb-8">Featured in</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
                        {['The Guardian', 'NBC News', 'USA Today', 'Forbes', 'Business Insider'].map((name) => (
                            <div key={name} className="font-bold text-lg text-[#0A0A0A]">{name}</div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
