import { Link } from 'react-router-dom';

const categories = ['Biology', 'Chemistry', 'Construction', 'Conversion', 'Everyday life', 'Finance', 'Food', 'Health', 'Math', 'Physics', 'Sports', 'Statistics'];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#e5e7eb] py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">Making your<br />calculations easier</h2>
                        <Link to="/" className="flex items-center gap-2 text-lg mb-4">
                            <i className="fas fa-hard-hat text-2xl text-[#3B68FC]"></i>
                            <span className="text-[#0A0A0A] font-bold">Civil Engineering Calculators</span>
                        </Link>
                        <div className="flex gap-2">
                            {['facebook-f', 'twitter', 'youtube', 'instagram', 'linkedin-in'].map((icon) => (
                                <a key={icon} href="#" className="w-9 h-9 flex items-center justify-center text-[#6b7280] bg-[#f8f9fa] border border-[#e5e7eb] rounded-full hover:bg-[#3B68FC] hover:text-white hover:border-[#3B68FC] transition-all">
                                    <i className={`fab fa-${icon} text-sm`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">Categories</h3>
                        <ul className="space-y-2">
                            {categories.slice(0, 6).map((cat) => (
                                <li key={cat}><Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#6b7280] hover:text-[#3B68FC]">{cat}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">More</h3>
                        <ul className="space-y-2">
                            {categories.slice(6).map((cat) => (
                                <li key={cat}><Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#6b7280] hover:text-[#3B68FC]">{cat}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">Company</h3>
                        <ul className="space-y-2">
                            {['About us', 'Careers', 'Press', 'Blog'].map((item) => (
                                <li key={item}><a href="#" className="text-sm text-[#6b7280] hover:text-[#3B68FC]">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[#0A0A0A] mb-3">Support</h3>
                        <ul className="space-y-2">
                            {['Help center', 'Contact us', 'Privacy policy', 'Terms of use'].map((item) => (
                                <li key={item}><a href="#" className="text-sm text-[#6b7280] hover:text-[#3B68FC]">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#e5e7eb] text-center text-sm text-[#6b7280]">
                    © 2024 Civil Engineering Calculators. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
