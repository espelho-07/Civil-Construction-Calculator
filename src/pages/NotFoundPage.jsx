import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="text-center">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[150px] md:text-[200px] font-bold text-[#3B68FC]/10 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl p-6 shadow-lg">
                            <i className="fas fa-hard-hat text-5xl text-[#3B68FC] mb-2"></i>
                            <div className="text-lg font-semibold text-[#0A0A0A]">Page Not Found</div>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-4">
                    Oops! This page doesn't exist
                </h1>
                <p className="text-[#6b7280] mb-8 max-w-md mx-auto">
                    The page you're looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-[#3B68FC] hover:bg-[#2851CC] text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                        <i className="fas fa-home"></i>
                        Go to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-[#e5e7eb] text-[#0A0A0A] font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                        <i className="fas fa-arrow-left"></i>
                        Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-[#e5e7eb]">
                    <p className="text-sm text-[#6b7280] mb-4">Popular Calculators:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/cement-concrete" className="text-sm text-[#3B68FC] hover:underline">
                            Cement Concrete
                        </Link>
                        <span className="text-[#e5e7eb]">•</span>
                        <Link to="/brick-masonry" className="text-sm text-[#3B68FC] hover:underline">
                            Brick Masonry
                        </Link>
                        <span className="text-[#e5e7eb]">•</span>
                        <Link to="/steel-weight" className="text-sm text-[#3B68FC] hover:underline">
                            Steel Weight
                        </Link>
                        <span className="text-[#e5e7eb]">•</span>
                        <Link to="/unit-converter" className="text-sm text-[#3B68FC] hover:underline">
                            Unit Converter
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
