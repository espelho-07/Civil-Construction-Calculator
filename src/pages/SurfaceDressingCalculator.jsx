import { useState, useEffect, useRef } from 'react';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function SurfaceDressingCalculator() {
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Surface Dressing Calculator</h1>
                            <p className="text-[#6b7280]">Binder and Chip Application Rates (MORTH)</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="surface-dressing"
                            calculatorName="Surface Dressing Calculator"
                            calculatorIcon="fa-spray-can"
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
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Application Rate Calculator Coming Soon</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto">
                                The calculator for determining binder and aggregate application rates based on nominal size (19mm, 13mm, 10mm, 6mm) is under maintenance. Please refer to the detailed procedure and specifications below.
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
                                Surface Dressing involves the application of a bituminous binder followed immediately by spreading uniform, single-sized cover aggregates, which are then rolled. It serves to seal the road surface, check oxidation, and improve skid resistance. It is not a structural layer but a surface treatment.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Success depends on achieving the correct rate of spread for both binder and chippings. The rate is determined based on the Average Least Dimension (ALD) of the chippings. MORTH defines recommended nominal sizes for aggregates (e.g., 19mm, 13mm, 10mm, 6mm) depending on the traffic and surface hardness.
                            </p>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Apparatus Required</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Bitumen Sprayer:</strong> Calibrated pressure distributor.</li>
                                <li><strong>Chip Spreader:</strong> Mechanical spreader for uniform application.</li>
                                <li><strong>Roller:</strong> Pneumatic tired roller is preferred.</li>
                                <li><strong>Sieves and Flakiness Gauge:</strong> To determine gradation and shape factors (ALD) of chips.</li>
                                <li><strong>Tray Test:</strong> To check transverse distribution of binder.</li>
                            </ul>
                        </div>

                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">Construction Procedure</h2>
                            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>Preparation:</strong> Clean the existing surface thoroughly with brooms and compressed air.</li>
                                <li><strong>Binder Application:</strong> Spray the bituminous binder (bitumen or emulsion) at the specified temperature and rate.</li>
                                <li><strong>Chipping:</strong> Spread the cover aggregates immediately after spraying using a mechanical spreader. The chips must be clean and dry (for hot bitumen).</li>
                                <li><strong>Rolling:</strong> Roll the surface immediately to embed the chips into the binder.</li>
                                <li><strong>Sweeping:</strong> Remove loose aggregates after the binder has set.</li>
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
                                    <i className="fas fa-spray-can text-white"></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">Surface Dressing</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-xs text-[#6b7280] mt-2">
                                Surface treatment analysis and application rates.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
