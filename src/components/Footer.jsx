import { Link } from 'react-router-dom';

const calculatorCategories = [
    { name: 'Concrete Technology', slug: 'concrete-technology' },
    { name: 'Quantity Estimator', slug: 'quantity-estimator' },
    { name: 'Soil Test', slug: 'soil-test' },
    { name: 'Road Construction', slug: 'road-construction' },
    { name: 'Sieve Analysis', slug: 'sieve-analysis-aggregates' },
    { name: 'Blending Aggregates', slug: 'blending-aggregates' },
];

const popularCalculators = [
    { name: 'Cement Concrete', slug: '/cement-concrete' },
    { name: 'Brick Calculator', slug: '/brick-masonry' },
    { name: 'Flooring Calculator', slug: '/flooring' },
    { name: 'Plastering Calculator', slug: '/plastering' },
    { name: 'Tank Volume', slug: '/tank-volume' },
    { name: 'Steel Weight', slug: '/steel-weight' },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-yellow-50/50 to-orange-50 border-t border-[#e5e7eb]">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute top-0 right-[30%] w-48 h-48 bg-yellow-200 rounded-full blur-[80px] opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-200 rounded-full blur-[80px] opacity-40"></div>

            {/* Main Footer */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#3B68FC] to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <i className="fas fa-hard-hat text-white text-xl"></i>
                            </div>
                            <div>
                                <span className="block font-bold text-lg text-[#0A0A0A]">Civil Engineering</span>
                                <span className="block text-sm text-[#6b7280]">Calculators</span>
                            </div>
                        </Link>
                        <p className="text-[#6b7280] text-sm mb-6 max-w-sm">
                            Free online tools for civil engineers, architects, and construction professionals. Calculate concrete, bricks, steel, soil tests and more.
                        </p>

                        {/* App Download Badge */}
                        <a
                            href="http://diet.vc/a_acqe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-[#e5e7eb] rounded-xl hover:shadow-md transition-all"
                        >
                            <i className="fab fa-google-play text-xl text-green-500"></i>
                            <div className="text-left">
                                <span className="block text-[10px] text-[#9ca3af] leading-tight">GET IT ON</span>
                                <span className="block text-sm font-medium text-[#0A0A0A] leading-tight">Google Play</span>
                            </div>
                        </a>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            {[
                                { icon: 'facebook-f', color: 'hover:bg-blue-600 hover:text-white' },
                                { icon: 'twitter', color: 'hover:bg-sky-500 hover:text-white' },
                                { icon: 'youtube', color: 'hover:bg-red-600 hover:text-white' },
                                { icon: 'instagram', color: 'hover:bg-pink-600 hover:text-white' },
                                { icon: 'linkedin-in', color: 'hover:bg-blue-700 hover:text-white' },
                            ].map((social) => (
                                <a
                                    key={social.icon}
                                    href="#"
                                    className={`w-10 h-10 flex items-center justify-center bg-white border border-[#e5e7eb] rounded-lg text-[#6b7280] ${social.color} transition-all`}
                                >
                                    <i className={`fab fa-${social.icon} text-sm`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-folder text-[#3B68FC] text-sm"></i>
                            Categories
                        </h3>
                        <ul className="space-y-2">
                            {calculatorCategories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        to={`/category/${cat.slug}`}
                                        className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Calculators */}
                    <div>
                        <h3 className="font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-fire text-orange-400 text-sm"></i>
                            Popular
                        </h3>
                        <ul className="space-y-2">
                            {popularCalculators.map((calc) => (
                                <li key={calc.slug}>
                                    <Link
                                        to={calc.slug}
                                        className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all"
                                    >
                                        {calc.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Links */}
                    <div>
                        <h3 className="font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className="fas fa-link text-[#3B68FC] text-sm"></i>
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all">Home</Link></li>
                            <li><Link to="/about" className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all">About Us</Link></li>
                            <li><Link to="/contact" className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all">Contact</Link></li>
                            <li><Link to="/privacy-policy" className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-use" className="text-sm text-[#6b7280] hover:text-[#3B68FC] hover:pl-2 transition-all">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-[#e5e7eb] bg-white/50">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[#6b7280]">
                            © 2024 Construction Calculators. Made with ❤️ for Engineers.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                                <i className="fas fa-shield-alt text-green-500"></i>
                                Secure & Free
                            </span>
                            <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                                <i className="fas fa-calculator text-[#3B68FC]"></i>
                                100+ Calculators
                            </span>
                            <span className="text-xs text-[#9ca3af] flex items-center gap-1">
                                <i className="fas fa-globe text-blue-400"></i>
                                Used Worldwide
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
