import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CreatorCard from '../components/CreatorCard';

export default function BMICalculator() {
    const [unit, setUnit] = useState('metric');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');
    const [bmi, setBmi] = useState(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        let h = 0, w = parseFloat(weight);
        if (unit === 'metric') {
            h = parseFloat(height) / 100;
        } else {
            const ft = parseFloat(heightFt) || 0;
            const inch = parseFloat(heightIn) || 0;
            h = ((ft * 12) + inch) * 0.0254;
            w = w * 0.453592;
        }
        if (h > 0 && w > 0) setBmi(w / (h * h));
        else setBmi(null);
    }, [unit, height, weight, heightFt, heightIn]);

    useEffect(() => {
        const updateStickyPosition = () => {
            if (sidebarRef.current) {
                const viewportHeight = window.innerHeight;
                const sidebarHeight = sidebarRef.current.offsetHeight;
                sidebarRef.current.style.top = sidebarHeight > viewportHeight - 80 ? `${viewportHeight - sidebarHeight - 16}px` : '96px';
            }
        };
        updateStickyPosition();
        window.addEventListener('resize', updateStickyPosition);
        return () => window.removeEventListener('resize', updateStickyPosition);
    }, []);

    const getCategory = (bmi) => {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
        if (bmi < 25) return { label: 'Normal', color: 'text-[#1ABC9C]' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
        return { label: 'Obese', color: 'text-red-500' };
    };

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="biology" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
                {/* Left Column */}
                <div className="min-h-[150vh]">
                    <p className="text-sm text-[#6b7280] mb-4">Last updated: November 19, 2024</p>
                    <h1 className="text-4xl font-bold text-[#0A0A0A] mb-6">BMI Calculator</h1>

                    {/* Creators Section with Hover Cards */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1ABC9C] to-[#16A085] flex items-center justify-center text-white font-bold shrink-0">AV</div>
                        <div className="text-sm">
                            <div className="text-[#6b7280]">Creators</div>
                            <CreatorCard
                                name="Dr. Anita Verma"
                                initials="AV"
                                title="Health & Nutrition Expert"
                                bio="Dr. Anita Verma is a certified nutritionist with over 15 years of experience in clinical health assessment and body composition analysis."
                                links={{ linkedin: "#", twitter: "#" }}
                            />
                            <div className="text-[#6b7280] mt-2">Reviewers</div>
                            <CreatorCard
                                name="Rahul S., PhD"
                                initials="RS"
                                title="Medical Researcher"
                                bio="Rahul holds a PhD in Medical Sciences from AIIMS. His research focuses on preventive healthcare."
                                links={{ linkedin: "#" }}
                            />
                            <span className="text-[#6b7280]"> and </span>
                            <CreatorCard
                                name="Priya M."
                                initials="PM"
                                title="Content Specialist"
                                bio="Priya is a health content specialist ensuring all calculator information is accurate and easy to understand."
                                links={{ twitter: "#" }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[#6b7280] mb-6">
                        <div className="flex items-center gap-2"><i className="fas fa-book text-xs"></i> Based on <strong className="text-[#0A0A0A]">3 sources</strong></div>
                        <div className="flex items-center gap-2"><i className="fas fa-thumbs-up text-xs"></i> <strong className="text-[#0A0A0A]">84</strong> people find this calculator helpful</div>
                    </div>

                    <div className="flex items-center gap-2 mb-8">
                        {['thumbs-up', 'image', 'share-alt', 'code', 'cog'].map((icon) => (
                            <button key={icon} className="px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#6b7280] hover:border-[#3B68FC] hover:text-[#3B68FC]">
                                <i className={`fas fa-${icon}`}></i>
                            </button>
                        ))}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Table of contents</h2>
                        <ul className="space-y-2 text-sm">
                            {['What is BMI?', 'How to calculate BMI', 'BMI categories explained'].map((item) => (
                                <li key={item}><a href="#" className="text-[#3B68FC] hover:underline flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#3B68FC] rounded-full"></span> {item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <article>
                        <h2 className="text-xl font-bold text-[#0A0A0A] pt-6">What is BMI?</h2>
                        <p className="text-[#0A0A0A] leading-relaxed my-4">Body Mass Index (BMI) is a simple calculation using height and weight to estimate body fat.</p>
                    </article>
                </div>

                {/* Calculator Widget - Clean White Design */}
                <aside ref={sidebarRef} className="sticky top-36 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        {/* Header - Simple with icon */}
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
                            <i className="fas fa-weight text-xl text-[#1ABC9C]"></i>
                            <h2 className="text-lg font-semibold text-[#0A0A0A]">BMI Calculator</h2>
                        </div>

                        <div className="p-5">
                            <div className="flex mb-6 border border-[#e5e7eb] rounded-lg">
                                {['metric', 'imperial'].map((u) => (
                                    <button key={u} onClick={() => setUnit(u)} className={`flex-1 py-3 text-sm font-medium transition-colors ${unit === u ? 'bg-white text-[#3B68FC] border-2 border-[#3B68FC] -m-px z-10 rounded-lg' : 'text-[#6b7280]'}`}>
                                        {u.charAt(0).toUpperCase() + u.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-5">
                                {unit === 'metric' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Height</label>
                                        <input type="text" placeholder="e.g., 175" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Height</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="ft" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" />
                                            <input type="text" placeholder="in" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Weight</label>
                                    <input type="text" placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'} value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" />
                                </div>
                            </div>

                            {/* Result - Light background */}
                            <div className="mt-6 p-4 bg-[#f8f9fa] rounded-lg">
                                <div className="text-sm font-medium text-[#0A0A0A] mb-1">Your BMI</div>
                                <div className={`text-2xl font-bold ${bmi ? getCategory(bmi).color : 'text-[#0A0A0A]'}`}>{bmi ? bmi.toFixed(1) : '—'}</div>
                                {bmi && <div className={`text-sm font-medium mt-1 ${getCategory(bmi).color}`}>{getCategory(bmi).label}</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 p-4 border-t border-[#e5e7eb]">
                            <button onClick={() => { setHeight(''); setWeight(''); setHeightFt(''); setHeightIn(''); setBmi(null); }} className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#3B68FC]"><i className="fas fa-redo"></i> Reset</button>
                        </div>

                        <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-[#e5e7eb] text-sm text-[#6b7280]">
                            <span>Did we solve your problem?</span>
                            <button className="px-3 py-1 border border-[#e5e7eb] rounded hover:border-[#3B68FC] hover:text-[#3B68FC]"><i className="fas fa-thumbs-up text-xs"></i> Yes</button>
                            <button className="px-3 py-1 border border-[#e5e7eb] rounded hover:border-[#3B68FC] hover:text-[#3B68FC]"><i className="fas fa-thumbs-down text-xs"></i> No</button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
