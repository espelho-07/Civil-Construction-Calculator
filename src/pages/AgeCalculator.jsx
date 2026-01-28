import { useState, useRef, useEffect } from 'react';
import CategoryNav from '../components/CategoryNav';

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('');
    const [age, setAge] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        if (birthDate) {
            const birth = new Date(birthDate);
            const now = new Date();
            let years = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                years--;
            }
            setAge(years);
        } else {
            setAge(null);
        }
    };

    useEffect(() => {
        calculate();
    }, [birthDate]);

    useEffect(() => {
        const update = () => {
            if (sidebarRef.current) {
                const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight;
                sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px';
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="other" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Age Calculator</h1>
                    <p className="text-[#6b7280] mb-6">Calculate your age.</p>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full p-2 border border-[#e5e7eb] rounded mb-4"
                            />
                            <div className="text-sm text-gray-500">Your Age</div>
                            <div className="text-3xl font-bold text-[#3B68FC]">
                                {age !== null ? `${age} years` : '-'}
                            </div>
                        </div>
                    </section>
                </div>

                <div ref={sidebarRef} className="sticky top-20">
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
