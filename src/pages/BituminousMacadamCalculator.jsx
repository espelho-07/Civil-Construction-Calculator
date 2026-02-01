import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function BituminousMacadamCalculator() {
    const theme = getThemeClasses('blue');
    const sidebarRef = useRef(null);

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
            <CategoryNav activeCategory="sieve-analysis-aggregates" />

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

                {/* Main Content */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Bituminous Macadam Calculator</h1>
                            <p className="text-[#6b7280]">Bituminous Macadam (BM) Grading Analysis</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="bituminous-macadam"
                            calculatorName="Bituminous Macadam Calculator"
                            calculatorIcon="fa-road"
                            category="Sieve Analysis"
                            inputs={{}}
                            outputs={{}}
                        />
                    </div>

                    {/* Placeholder Calculator / Info Block */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} p-8 text-center`}>
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-tools text-blue-500 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Grading Calculator Coming Soon</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">
                                The interactive grading table for Bituminous Macadam (Open Graded) is currently being updated with the latest MORTH specifications. Please refer to the detailed procedure and theory below for the tests.
                            </p>
                        </div>
                    </section>

                    {/* Advertisement */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>

                    {/* Technical Content */}
                    <div className="space-y-6">
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Theory</h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Bituminous Macadam (BM) is an open-graded bituminous mix used as a base course or binder course in highway construction. Unlike DBM or BC, the BM mix is designed with a higher void content (permeable structure) and relies on the mechanical interlocking of aggregates for stability. It consists of coarse aggregates and a small percentage of fine aggregates with a bituminous binder.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                MORTH specifications typically define BM Grading 1 (40mm Nominal) and Grading 2 (19mm Nominal). BM is often used as a profile corrective course or as a strengthening layer for existing pavements. Careful control of aggregate grading is required to ensure the mix provides adequate stability without becoming too dense (losing drainage) or too open (losing strength).
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> Standard sieves including 45mm, 37.5mm, 26.5mm, 13.2mm, 4.75mm, 2.36mm, and 0.075mm.</li>
                                <li><strong>Balance:</strong> Heavy duty balance for weighing total sample and sensitive balance for fine fractions.</li>
                                <li><strong>Oven:</strong> Capable of maintaining 110°C ± 5°C.</li>
                                <li><strong>Sample Splitter:</strong> Riffle box for dividing samples.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Test Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Sampling:</strong> Collect representative samples of the constituent aggregates (Coarse & Fine).</li>
                                <li><strong>Drying:</strong> Ensure aggregates are surface dry.</li>
                                <li><strong>Sieving:</strong> Perform sieve analysis on the individual aggregates to determine their gradation.</li>
                                <li><strong>Blending:</strong> Combine the aggregates in theoretical proportions to meet the specified BM grading envelope (e.g., Grid 1 or Grid 2).</li>
                                <li><strong>Binder Content:</strong> Determine the optimum binder content, typically around 3% to 4% depending on the specific grading and aggregate type, though BM is often a recipe mix.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20">
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border} mb-6`}>
                        <div className={`px-5 py-4 ${theme.bg} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-road text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">Bituminous Macadam</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-xs text-[#6b7280] mt-2">
                                Open-graded base/binder course analysis.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
