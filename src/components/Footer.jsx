import { Link } from 'react-router-dom';

export default function Footer() {
    const categories = [
        'Biology', 'Construction', 'Conversion', 'Everyday life',
        'Finance', 'Food', 'Health', 'Math', 'Physics', 'Sports', 'Statistics', 'Other'
    ];

    return (
        <footer className="bg-white border-t border-[#e5e7eb]">
            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">
                            Making your<br />life easier
                        </h2>
                        <Link to="/" className="flex items-center gap-1 text-lg mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 via-orange-400 to-[#3B68FC] bg-clip-text text-transparent">∞</span>
                            <span className="text-[#3B68FC]"><span className="font-bold">omni</span> calculator</span>
                        </Link>
                        <div className="flex gap-2">
                            {['facebook-f', 'twitter', 'youtube', 'instagram', 'linkedin-in'].map((icon) => (
                                <a key={icon} href="#" className="w-9 h-9 flex items-center justify-center text-[#6b7280] bg-[#f8f9fa] border border-[#e5e7eb] rounded-full hover:bg-[#3B68FC] hover:text-white hover:border-[#3B68FC] transition-all">
                                    <i className={`fab fa-${icon} text-sm`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories 1 */}
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">Categories</h3>
                        <ul className="space-y-2">
                            {categories.slice(0, 6).map((cat) => (
                                <li key={cat}>
                                    <Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#6b7280] hover:text-[#3B68FC] transition-colors">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories 2 */}
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3 invisible">Categories</h3>
                        <ul className="space-y-2">
                            {categories.slice(6).map((cat) => (
                                <li key={cat}>
                                    <Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#6b7280] hover:text-[#3B68FC] transition-colors">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">Company</h3>
                        <ul className="space-y-2">
                            {['About us', 'Blog', 'Careers', 'Press'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-[#6b7280] hover:text-[#3B68FC] transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">Support</h3>
                        <ul className="space-y-2">
                            {['Help center', 'Contact', 'FAQ', 'Send feedback'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-[#6b7280] hover:text-[#3B68FC] transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#e5e7eb] py-4">
                <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-[#6b7280] cursor-pointer hover:bg-black/5 px-2 py-1 rounded">
                        <i className="fas fa-globe"></i>
                        <span>English</span>
                        <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                    <div className="flex items-center gap-6 flex-wrap text-sm text-[#6b7280]">
                        <a href="#" className="hover:text-[#3B68FC]">Privacy, Cookies & Terms of Service</a>
                        <span>Copyright by Omni Calculator sp. z o.o.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
