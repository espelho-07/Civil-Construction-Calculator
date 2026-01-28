import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 h-16 bg-white border-b border-[#e5e7eb]">
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 text-lg hover:opacity-80 transition-opacity shrink-0">
                    <span className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-400 to-[#3B68FC] bg-clip-text text-transparent">
                        ∞
                    </span>
                    <span className="text-[#3B68FC] hidden sm:inline">
                        <span className="font-bold">omni</span> calculator
                    </span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"></i>
                        <input
                            type="text"
                            placeholder="Search calculator..."
                            className="w-full h-10 pl-10 pr-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-full text-sm outline-none focus:border-[#3B68FC] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Nav Actions */}
                <nav className="flex items-center gap-3 shrink-0">
                    <span className="hidden md:flex items-center gap-2 text-sm text-[#6b7280]">
                        <span>Last used:</span>
                        <a href="#" className="text-[#3B68FC] hover:underline">BMI Calculator</a>
                        <span>→</span>
                    </span>
                    <a href="#" className="text-sm font-medium text-[#0A0A0A] px-3 py-2 rounded-lg hover:bg-[#f8f9fa] transition-colors">
                        Log in
                    </a>
                    <a href="#" className="btn-primary text-sm px-4 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add] transition-colors">
                        Sign up
                    </a>
                </nav>
            </div>
        </header>
    );
}
