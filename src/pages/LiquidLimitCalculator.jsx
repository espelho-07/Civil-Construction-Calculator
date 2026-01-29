import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';

export default function LiquidLimitCalculator() {
    const [trials, setTrials] = useState([
        { blows: 35, wetSoil: 57, drySoil: 47, container: 20, waterContent: 0 },
        { blows: 28, wetSoil: 49, drySoil: 41, container: 17, waterContent: 0 },
        { blows: 21, wetSoil: 52, drySoil: 40, container: 14, waterContent: 0 },
        { blows: 17, wetSoil: 45, drySoil: 32, container: 12, waterContent: 0 },
    ]);
    const [liquidLimit, setLiquidLimit] = useState(0);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const updatedTrials = trials.map(trial => {
            const wetWeight = trial.wetSoil - trial.container;
            const dryWeight = trial.drySoil - trial.container;
            const waterContent = dryWeight > 0 ? ((wetWeight - dryWeight) / dryWeight) * 100 : 0;
            return { ...trial, waterContent: waterContent.toFixed(2) };
        });
        setTrials(updatedTrials);

        // Find water content at 25 blows using interpolation
        const sortedTrials = [...updatedTrials].sort((a, b) => a.blows - b.blows);
        let ll = 0;
        for (let i = 0; i < sortedTrials.length - 1; i++) {
            if (sortedTrials[i].blows <= 25 && sortedTrials[i + 1].blows >= 25) {
                const x1 = sortedTrials[i].blows;
                const x2 = sortedTrials[i + 1].blows;
                const y1 = parseFloat(sortedTrials[i].waterContent);
                const y2 = parseFloat(sortedTrials[i + 1].waterContent);
                ll = y1 + ((25 - x1) * (y2 - y1)) / (x2 - x1);
                break;
            }
        }
        if (ll === 0 && sortedTrials.length > 0) {
            ll = parseFloat(sortedTrials[Math.floor(sortedTrials.length / 2)].waterContent);
        }
        setLiquidLimit(ll.toFixed(2));
    };

    const updateTrial = (index, field, value) => {
        const newTrials = [...trials];
        newTrials[index][field] = Number(value);
        setTrials(newTrials);
    };

    useEffect(() => { calculate(); }, []);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="soil-test" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-[#0A0A0A]">Liquid Limit of Soil <span className="text-sm font-normal text-gray-500">Casagrande Apparatus (IS: 9259)</span></h1>
                        <CalculatorActions
                            calculatorSlug="liquid-limit"
                            calculatorName="Liquid Limit Calculator"
                            calculatorIcon="fa-water"
                            category="Soil Test"
                            inputs={{ trials }}
                            outputs={{ liquidLimit: liquidLimit || 0 }}
                        />
                    </div>
                    <p className="text-[#6b7280] mb-6">Calculate liquid limit of soil using Casagrande method</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-info-circle text-[#3B68FC] mr-2"></i>What is Liquid Limit of Soil?</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <p className="text-gray-600 mb-4 italic">A knowledge of the Atterberg limits is common in the construction of levees, earthen dams & the prediction of the level of subsidence that naturally occur when fine-grained deposits are drained. Liquid limit is used to calculate the activity of a clay and is also used in the classification of soils.</p>
                            <h3 className="font-bold text-gray-800 mb-2">Why we need to determine Liquid Limit?</h3>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                <li>The liquid limit of soil is used as a parameter for calculating the compression index used for settlement calculations of buildings and structures.</li>
                                <li>This is used in calculating the activity of clay, which is used for description of soils.</li>
                                <li>The liquid limit together with plastic limit is used for the engineering classification of fine soil as per IS soil classification.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-clipboard-list text-[#3B68FC] mr-2"></i>Procedure to conduct Liquid Limit of Soil</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <h3 className="font-bold text-gray-800 mb-2">Apparatus</h3>
                            <ol className="list-decimal pl-5 text-gray-600 space-y-1 mb-4">
                                <li><strong>Mechanical liquid limit device</strong> - (Casagrande Apparatus IS: 9259-1979)</li>
                                <li><strong>Grooving Tool</strong> – (As per IS: 9259-1979)</li>
                                <li>Porcelain dish with flat bottom</li>
                                <li>Spatula. Flexible with blade about 80 mm long by 20 mm wide.</li>
                                <li>Balance. Readable and accurate to 0.01 g.</li>
                                <li>Oven. Thermostatically controlled oven, capable of maintaining a temperature of 110 ± 5°C.</li>
                                <li>Wash bottle. Made of plastics with a jet of 1 mm diameter.</li>
                                <li>Container - for determining moisture content having atleast 25 cm³ capacity.</li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className="fas fa-calculator text-[#3B68FC] mr-2"></i>Liquid Limit Calculation</h2>
                        <div className="bg-white rounded-xl p-6 border">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg text-center">
                                    <div className="text-sm text-gray-600 mb-2">Liquid Level of given Soil is</div>
                                    <div className="text-3xl font-bold text-[#3B68FC]">{liquidLimit} %</div>
                                </div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-2">Liquid Level of given Soil is</div>
                                    <table className="w-full text-xs">
                                        <thead><tr><th className="text-left">Trial</th><th className="text-left">Water %</th></tr></thead>
                                        <tbody>{trials.map((t, i) => <tr key={i}><td>Trial {i + 1}</td><td className="font-bold text-[#3B68FC]">{t.waterContent}</td></tr>)}</tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">
                                The moisture content corresponding to 25 drops (as read from the flow curve-semi log graph) can be considered as the <strong>liquid limit of the soil</strong>.
                            </div>
                        </div>
                    </section>

                    {/* AdSense Placeholder */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mb-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm">Advertisement</p>
                    </div>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                        <div className="px-5 py-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50 flex items-center gap-3">
                            <i className="fas fa-water text-xl text-cyan-600"></i>
                            <h2 className="font-semibold text-sm">DETERMINE LIQUID LIMIT OF SOIL</h2>
                        </div>
                        <div className="p-4">
                            <table className="w-full text-xs mb-4">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-1 py-1">Trial</th>
                                        <th className="px-1 py-1">Blows</th>
                                        <th className="px-1 py-1">Wet(g)</th>
                                        <th className="px-1 py-1">Dry(g)</th>
                                        <th className="px-1 py-1">Cont(g)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trials.map((trial, i) => (
                                        <tr key={i}>
                                            <td className="px-1 py-1 text-center">{i + 1}</td>
                                            <td className="px-1 py-1"><input type="number" value={trial.blows} onChange={(e) => updateTrial(i, 'blows', e.target.value)} className="w-full px-1 py-1 border rounded text-xs" /></td>
                                            <td className="px-1 py-1"><input type="number" value={trial.wetSoil} onChange={(e) => updateTrial(i, 'wetSoil', e.target.value)} className="w-full px-1 py-1 border rounded text-xs" /></td>
                                            <td className="px-1 py-1"><input type="number" value={trial.drySoil} onChange={(e) => updateTrial(i, 'drySoil', e.target.value)} className="w-full px-1 py-1 border rounded text-xs" /></td>
                                            <td className="px-1 py-1"><input type="number" value={trial.container} onChange={(e) => updateTrial(i, 'container', e.target.value)} className="w-full px-1 py-1 border rounded text-xs" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={calculate} className="w-full bg-[#3B68FC] text-white py-2.5 rounded-lg font-medium mb-4">Calculate</button>
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Liquid Limit</div>
                                    <div className="text-3xl font-bold text-[#3B68FC]">{liquidLimit} %</div>
                                </div>
                                <table className="w-full text-xs mt-3">
                                    <thead><tr className="bg-white"><th className="px-2 py-1">Trial</th><th className="px-2 py-1">Blows</th><th className="px-2 py-1">Water %</th></tr></thead>
                                    <tbody>{trials.map((t, i) => <tr key={i}><td className="px-2 py-1 text-center">{i + 1}</td><td className="px-2 py-1 text-center">{t.blows}</td><td className="px-2 py-1 text-center font-bold text-[#3B68FC]">{t.waterContent}</td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
