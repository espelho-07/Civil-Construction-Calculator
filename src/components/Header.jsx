import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 h-16 bg-white border-b border-[#e5e7eb]">
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 text-lg hover:opacity-80 transition-opacity shrink-0">
                    <i className="fas fa-hard-hat text-2xl text-[#3B68FC]"></i>
                    <span className="text-[#0A0A0A] hidden sm:inline font-bold">Civil Engineering Calculators</span>
                </Link>
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"></i>
                        <input type="text" placeholder="Search calculator..." className="w-full h-10 pl-10 pr-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-full text-sm outline-none focus:border-[#3B68FC] focus:bg-white transition-all" />
                    </div>
                </div>
                <nav className="flex items-center gap-3 shrink-0">
                    <a href="#" className="text-sm font-medium text-[#0A0A0A] px-3 py-2 rounded-lg hover:bg-[#f8f9fa]">Log in</a>
                    <a href="#" className="text-sm px-4 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add]">Sign up</a>
                </nav>
            </div>
        </header>
    );
}
