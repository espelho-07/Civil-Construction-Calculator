import { Link } from 'react-router-dom';

export default function ComingSoonPage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f0f4ff] via-white to-[#fff7ed] flex items-center justify-center px-6">
            <div className="text-center max-w-lg">
                {/* Animated Icon */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-[#3B68FC] to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_20px_60px_rgba(59,104,252,0.4)] animate-bounce">
                        <i className="fas fa-hard-hat text-5xl text-white"></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                        🚧
                    </div>
                </div>

                {/* Main Message */}
                <h1 className="text-4xl font-bold text-[#0A0A0A] mb-4">
                    We're Building Something
                    <span className="text-[#3B68FC]"> Amazing!</span>
                </h1>

                <p className="text-lg text-[#6b7280] mb-6 leading-relaxed">
                    Our team is working hard to bring you the best experience.
                    Login & Sign up features are coming soon!
                </p>

                {/* Emojis */}
                <div className="text-4xl mb-8 space-x-2">
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>💪</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>🔨</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>🚀</span>
                </div>

                {/* Message Card */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e5e7eb] mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-2xl">🤗</span>
                        <h3 className="font-semibold text-[#0A0A0A]">We're Eager to See You!</h3>
                        <span className="text-2xl">💖</span>
                    </div>
                    <p className="text-sm text-[#6b7280]">
                        Stay tuned! We'll notify you as soon as these features are ready.
                        Thank you for your patience and support!
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-sm text-[#6b7280]">Development Progress</span>
                        <span className="text-sm font-bold text-[#3B68FC]">75%</span>
                    </div>
                    <div className="h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#3B68FC] to-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                </div>

                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B68FC] text-white rounded-xl font-medium hover:bg-[#2a4add] transition-all hover:shadow-lg hover:-translate-y-1"
                >
                    <i className="fas fa-arrow-left"></i>
                    Back to Calculators
                </Link>

                {/* Footer Note */}
                <p className="mt-8 text-xs text-[#9ca3af]">
                    Meanwhile, explore our 100+ free civil engineering calculators! 🧮
                </p>
            </div>
        </main>
    );
}
