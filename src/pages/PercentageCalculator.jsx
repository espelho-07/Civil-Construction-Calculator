import { useState, useRef, useEffect } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function PercentageCalculator() {
    const theme = getThemeClasses('math');
    const [val1, setVal1] = useState('');
    const [val2, setVal2] = useState('');
    const [result, setResult] = useState(null);
    const sidebarRef = useRef(null);

    // X is what percent of Y?
    const calculate = () => {
        const x = parseFloat(val1);
        const y = parseFloat(val2);
        if (!isNaN(x) && !isNaN(y) && y !== 0) {
            setResult(((x / y) * 100).toFixed(2));
        } else {
            setResult(null);
        }
    };

    useEffect(() => {
        calculate();
    }, [val1, val2]);

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
            <CategoryNav activeCategory="math" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Percentage Calculator</h1>
                            <p className="text-[#6b7280]">Calculate percentages easily.</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="percentage-calculator"
                            calculatorName="Percentage Calculator"
                            calculatorIcon="fa-percent"
                            category="Math"
                            inputs={{ val1, val2 }}
                            outputs={{ result }}
                        />
                    </div>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#0A0A0A]">What is</span>
                                <input
                                    type="number"
                                    value={val1}
                                    onChange={(e) => setVal1(e.target.value)}
                                    className={`w-24 p-2 border border-[#e5e7eb] rounded ${theme.focus}`}
                                />
                                <span className="text-[#0A0A0A]">% of</span>
                                <input
                                    type="number"
                                    value={val2}
                                    onChange={(e) => setVal2(e.target.value)}
                                    className={`w-24 p-2 border border-[#e5e7eb] rounded ${theme.focus}`}
                                />
                                <span className="text-[#0A0A0A]">?</span>
                            </div>
                            <div className={`text-2xl font-bold ${theme.text}`}>
                                {result ? `${result}%` : '-'}
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
