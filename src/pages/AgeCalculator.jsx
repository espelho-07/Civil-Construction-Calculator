import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CreatorCard from '../components/CreatorCard';

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('');
    const [calcDate, setCalcDate] = useState(new Date().toISOString().split('T')[0]);
    const [age, setAge] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (birthDate && calcDate) {
            const birth = new Date(birthDate), calc = new Date(calcDate);
            if (birth <= calc) {
                let years = calc.getFullYear() - birth.getFullYear();
                let months = calc.getMonth() - birth.getMonth();
                let days = calc.getDate() - birth.getDate();
                if (days < 0) { months--; days += new Date(calc.getFullYear(), calc.getMonth(), 0).getDate(); }
                if (months < 0) { years--; months += 12; }
                const diffMs = calc - birth;
                const totalDays = Math.floor(diffMs / 86400000);
                const nextBirthday = new Date(calc.getFullYear(), birth.getMonth(), birth.getDate());
                if (nextBirthday <= calc) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
                setAge({ years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7), daysToNext: Math.ceil((nextBirthday - calc) / 86400000) });
            } else setAge(null);
        } else setAge(null);
    }, [birthDate, calcDate]);

    useEffect(() => {
        const update = () => {
            if (sidebarRef.current) {
                const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight;
                sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '96px';
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="everyday-life" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
                <div className="min-h-[150vh]">
                    <p className="text-sm text-[#6b7280] mb-4">Last updated: November 19, 2024</p>
                    <h1 className="text-4xl font-bold text-[#0A0A0A] mb-6">Age Calculator</h1>

                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-bold shrink-0">AK</div>
                        <div className="text-sm">
                            <div className="text-[#6b7280]">Creators</div>
                            <CreatorCard name="Amit Kumar" initials="AK" title="Software Developer" bio="Amit is a full-stack developer with expertise in building practical utility tools." links={{ linkedin: "#", twitter: "#" }} />
                            <div className="text-[#6b7280] mt-2">Reviewers</div>
                            <CreatorCard name="Neha Singh" initials="NS" title="QA Specialist" bio="Neha specializes in testing and quality assurance." links={{ linkedin: "#" }} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[#6b7280] mb-6">
                        <div><i className="fas fa-book text-xs mr-2"></i>Based on <strong className="text-[#0A0A0A]">2 sources</strong></div>
                        <div><i className="fas fa-thumbs-up text-xs mr-2"></i><strong className="text-[#0A0A0A]">2,156</strong> people find this helpful</div>
                    </div>

                    <div className="flex items-center gap-2 mb-8">
                        {['thumbs-up', 'image', 'share-alt', 'code', 'cog'].map((icon) => (
                            <button key={icon} className="px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#6b7280] hover:border-[#3B68FC] hover:text-[#3B68FC]"><i className={`fas fa-${icon}`}></i></button>
                        ))}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Table of contents</h2>
                        <ul className="space-y-2 text-sm">
                            {['How does the age calculator work?', 'Age calculation formulas', 'Fun facts about age'].map((item) => (
                                <li key={item}><a href="#" className="text-[#3B68FC] hover:underline flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#3B68FC] rounded-full"></span>{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <article>
                        <h2 className="text-xl font-bold text-[#0A0A0A] pt-6">How does the age calculator work?</h2>
                        <p className="text-[#0A0A0A] leading-relaxed my-4">Our age calculator computes the exact difference between your birth date and any selected date.</p>
                    </article>
                </div>

                <aside ref={sidebarRef} className="sticky top-36 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
                            <i className="fas fa-birthday-cake text-xl text-[#F59E0B]"></i>
                            <h2 className="text-lg font-semibold text-[#0A0A0A]">Age Calculator</h2>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Date of Birth</label>
                                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#F59E0B]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Calculate age on</label>
                                <input type="date" value={calcDate} onChange={(e) => setCalcDate(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#F59E0B]" />
                            </div>

                            {age ? (
                                <div className="p-4 bg-[#f8f9fa] rounded-lg">
                                    <div className="text-sm font-medium text-[#0A0A0A] mb-1">Your Age</div>
                                    <div className="text-2xl font-bold text-[#D97706]">{age.years} years, {age.months} months, {age.days} days</div>
                                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                                        <div className="bg-white rounded p-2 border border-[#e5e7eb]"><div className="text-[#6b7280]">Total weeks</div><div className="font-bold text-[#D97706]">{age.totalWeeks.toLocaleString()}</div></div>
                                        <div className="bg-white rounded p-2 border border-[#e5e7eb]"><div className="text-[#6b7280]">Total days</div><div className="font-bold text-[#D97706]">{age.totalDays.toLocaleString()}</div></div>
                                    </div>
                                    <div className="mt-4 p-3 bg-white rounded border border-[#e5e7eb] text-center">
                                        <div className="text-sm text-[#6b7280]">🎂 Next birthday in</div>
                                        <div className="text-xl font-bold text-[#D97706]">{age.daysToNext} days</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-[#f8f9fa] rounded-lg text-center text-[#6b7280]">Enter your birth date</div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-[#e5e7eb] text-sm text-[#6b7280]">
                            <span>Did we solve your problem?</span>
                            <button className="px-3 py-1 border border-[#e5e7eb] rounded hover:border-[#F59E0B] hover:text-[#F59E0B]"><i className="fas fa-thumbs-up text-xs"></i> Yes</button>
                            <button className="px-3 py-1 border border-[#e5e7eb] rounded hover:border-[#F59E0B] hover:text-[#F59E0B]"><i className="fas fa-thumbs-down text-xs"></i> No</button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
