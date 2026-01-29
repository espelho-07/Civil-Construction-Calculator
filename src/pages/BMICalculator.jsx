import { useState, useRef, useEffect } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function BMICalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const h = parseFloat(height) / 100; // cm to m
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            setBmi((w / (h * h)).toFixed(1));
        } else {
            setBmi(null);
        }
    };

    useEffect(() => {
        calculate();
    }, [height, weight]);

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
            <CategoryNav activeCategory="health" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">BMI Calculator</h1>
                            <p className="text-[#6b7280]">Calculate Body Mass Index.</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="bmi-calculator"
                            calculatorName="BMI Calculator"
                            calculatorIcon="fa-weight"
                            category="Health"
                            inputs={{ height, weight }}
                            outputs={{ bmi }}
                        />
                    </div>

                    <section className="mb-8">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full p-2 border border-[#e5e7eb] rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full p-2 border border-[#e5e7eb] rounded"
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">Your BMI</div>
                                <div className="text-3xl font-bold text-[#3B68FC]">
                                    {bmi || '-'}
                                </div>
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
