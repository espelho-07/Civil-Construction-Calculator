import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CreatorCard from '../components/CreatorCard';

export default function PercentageCalculator() {
    const [mode, setMode] = useState('whatIs');
    const [values, setValues] = useState({ percent: '', of: '', part: '', whole: '', from: '', to: '' });
    const [result, setResult] = useState({ value: '—', formula: '' });
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (mode === 'whatIs') {
            const p = parseFloat(values.percent), o = parseFloat(values.of);
            if (!isNaN(p) && !isNaN(o)) {
                const r = (p / 100) * o;
                setResult({ value: r.toLocaleString(undefined, { maximumFractionDigits: 2 }), formula: `${p}% × ${o} = ${r.toFixed(2)}` });
            } else setResult({ value: '—', formula: '' });
        } else if (mode === 'whatPercent') {
            const p = parseFloat(values.part), w = parseFloat(values.whole);
            if (!isNaN(p) && !isNaN(w) && w !== 0) {
                const r = (p / w) * 100;
                setResult({ value: `${r.toFixed(2)}%`, formula: `(${p} ÷ ${w}) × 100` });
            } else setResult({ value: '—', formula: '' });
        } else if (mode === 'change') {
            const f = parseFloat(values.from), t = parseFloat(values.to);
            if (!isNaN(f) && !isNaN(t) && f !== 0) {
                const r = ((t - f) / f) * 100;
                setResult({ value: `${r >= 0 ? '+' : ''}${r.toFixed(2)}%`, formula: `((${t} - ${f}) ÷ ${f}) × 100` });
            } else setResult({ value: '—', formula: '' });
        }
    }, [mode, values]);

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

    const reset = () => { setValues({ percent: '', of: '', part: '', whole: '', from: '', to: '' }); setResult({ value: '—', formula: '' }); };

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="math" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
                <div className="min-h-[150vh]">
                    <p className="text-sm text-[#6b7280] mb-4">Last updated: November 19, 2024</p>
                    <h1 className="text-4xl font-bold text-[#0A0A0A] mb-6">Percentage Calculator</h1>

                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B68FC] to-[#2a4add] flex items-center justify-center text-white font-bold shrink-0">RS</div>
                        <div className="text-sm">
                            <div className="text-[#6b7280]">Creators</div>
                            <CreatorCard name="Rahul Sharma" initials="RS" title="Mathematics Expert" bio="Rahul is a mathematics educator with 10+ years of experience teaching algebra and statistics." links={{ linkedin: "#", twitter: "#" }} />
                            <div className="text-[#6b7280] mt-2">Reviewers</div>
                            <CreatorCard name="Priya Patel" initials="PP" title="Data Analyst" bio="Priya works as a senior data analyst at a leading fintech company." links={{ linkedin: "#" }} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[#6b7280] mb-6">
                        <div><i className="fas fa-book text-xs mr-2"></i>Based on <strong className="text-[#0A0A0A]">5 sources</strong></div>
                        <div><i className="fas fa-thumbs-up text-xs mr-2"></i><strong className="text-[#0A0A0A]">3,412</strong> people find this helpful</div>
                    </div>

                    <div className="flex items-center gap-2 mb-8">
                        {['thumbs-up', 'image', 'share-alt', 'code', 'cog'].map((icon) => (
                            <button key={icon} className="px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#6b7280] hover:border-[#3B68FC] hover:text-[#3B68FC]"><i className={`fas fa-${icon}`}></i></button>
                        ))}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Table of contents</h2>
                        <ul className="space-y-2 text-sm">
                            {['What is a percentage?', 'Percentage formula', 'Practical examples'].map((item) => (
                                <li key={item}><a href="#" className="text-[#3B68FC] hover:underline flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#3B68FC] rounded-full"></span>{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <article>
                        <h2 className="text-xl font-bold text-[#0A0A0A] pt-6">What is a percentage?</h2>
                        <p className="text-[#0A0A0A] leading-relaxed my-4">A percentage is a way to express a number as a fraction of 100.</p>
                    </article>
                </div>

                <aside ref={sidebarRef} className="sticky top-36 h-fit">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#e5e7eb]">
                        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
                            <i className="fas fa-percent text-xl text-[#3B68FC]"></i>
                            <h2 className="text-lg font-semibold text-[#0A0A0A]">Percentage Calculator</h2>
                        </div>

                        <div className="p-5">
                            <div className="space-y-2 mb-5 pb-5 border-b border-[#e5e7eb]">
                                {[{ key: 'whatIs', label: 'What is X% of Y?' }, { key: 'whatPercent', label: 'X is what % of Y?' }, { key: 'change', label: '% change from X to Y' }].map((m) => (
                                    <label key={m.key} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border ${mode === m.key ? 'bg-[#EEF2FF] border-[#3B68FC]' : 'bg-[#f8f9fa] border-transparent'}`}>
                                        <input type="radio" name="mode" checked={mode === m.key} onChange={() => setMode(m.key)} className="accent-[#3B68FC] w-4 h-4" />
                                        <span className="text-sm text-[#0A0A0A]">{m.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {mode === 'whatIs' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">What is</label>
                                            <div className="flex border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#3B68FC]">
                                                <input type="text" placeholder="e.g., 20" value={values.percent} onChange={(e) => setValues({ ...values, percent: e.target.value })} className="flex-1 px-4 py-3 outline-none" />
                                                <span className="px-4 py-3 bg-[#f8f9fa] border-l border-[#e5e7eb] text-[#6b7280]">%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">of</label>
                                            <input type="text" placeholder="e.g., 500" value={values.of} onChange={(e) => setValues({ ...values, of: e.target.value })} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" />
                                        </div>
                                    </>
                                )}
                                {mode === 'whatPercent' && (
                                    <>
                                        <div><label className="block text-sm font-medium text-[#0A0A0A] mb-2">Value</label><input type="text" placeholder="e.g., 25" value={values.part} onChange={(e) => setValues({ ...values, part: e.target.value })} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" /></div>
                                        <div><label className="block text-sm font-medium text-[#0A0A0A] mb-2">is what % of</label><input type="text" placeholder="e.g., 100" value={values.whole} onChange={(e) => setValues({ ...values, whole: e.target.value })} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" /></div>
                                    </>
                                )}
                                {mode === 'change' && (
                                    <>
                                        <div><label className="block text-sm font-medium text-[#0A0A0A] mb-2">From</label><input type="text" placeholder="e.g., 500" value={values.from} onChange={(e) => setValues({ ...values, from: e.target.value })} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" /></div>
                                        <div><label className="block text-sm font-medium text-[#0A0A0A] mb-2">To</label><input type="text" placeholder="e.g., 600" value={values.to} onChange={(e) => setValues({ ...values, to: e.target.value })} className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#3B68FC]" /></div>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 p-4 bg-[#f8f9fa] rounded-lg">
                                <div className="text-sm font-medium text-[#0A0A0A] mb-1">Result</div>
                                <div className="text-2xl font-bold text-[#3B68FC]">{result.value}</div>
                                {result.formula && <div className="text-sm text-[#6b7280] font-mono mt-1">{result.formula}</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 p-4 border-t border-[#e5e7eb]">
                            <button onClick={reset} className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#3B68FC]"><i className="fas fa-redo"></i> Reset</button>
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
