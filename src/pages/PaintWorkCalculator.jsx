import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function PaintWorkCalculator() {
    const theme = getThemeClasses('green');
    const [carpetArea, setCarpetArea] = useState(1000);
    const [doorWidth, setDoorWidth] = useState(3);
    const [doorHeight, setDoorHeight] = useState(7);
    const [noOfDoors, setNoOfDoors] = useState(4);
    const [windowWidth, setWindowWidth] = useState(4);
    const [windowHeight, setWindowHeight] = useState(3.5);
    const [noOfWindows, setNoOfWindows] = useState(10);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        const paintArea = carpetArea * 3.5;
        const doorArea = doorWidth * doorHeight * noOfDoors;
        const windowArea = windowWidth * windowHeight * noOfWindows;
        const actualPaintArea = paintArea - doorArea - windowArea;
        const actualPaintAreaM2 = actualPaintArea / 10.764;
        const paintLiters = Math.ceil(actualPaintArea / 100);
        const primerLiters = Math.ceil(actualPaintArea / 100);
        const puttyKg = Math.ceil(actualPaintArea / 13);

        setResults({
            paintArea: paintArea.toFixed(2),
            doorArea: doorArea.toFixed(2),
            windowArea: windowArea.toFixed(2),
            actualPaintArea: actualPaintArea.toFixed(2),
            actualPaintAreaM2: actualPaintAreaM2.toFixed(2),
            paint: paintLiters,
            primer: primerLiters,
            putty: puttyKg,
        });
    };

    useEffect(() => { calculate(); }, [carpetArea, doorWidth, doorHeight, noOfDoors, windowWidth, windowHeight, noOfWindows]);
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
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Paint Work Calculator</h1>
                            <p className="text-[#6b7280]">Calculate paint, primer and putty quantity for wall painting</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="paint-work-calculator"
                            calculatorName="Paint Work Calculator"
                            calculatorIcon="fa-paint-roller"
                            category="Quantity Estimator"
                            inputs={{ carpetArea, doorWidth, doorHeight, noOfDoors, windowWidth, windowHeight, noOfWindows }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-6">
                                <div className="text-sm text-gray-500">Total Paint Area</div>
                                <div className={`text-3xl font-bold ${theme.text}`}>{results?.actualPaintAreaM2} m² | {results?.actualPaintArea} ft²</div>
                            </div>
                            <table className="w-full text-sm border-collapse">
                                <thead><tr className="bg-gray-100"><th className={`border ${theme.border} px-3 py-2`}>Sr.</th><th className={`border ${theme.border} px-3 py-2`}>Material</th><th className={`border ${theme.border} px-3 py-2`}>Quantity</th></tr></thead>
                                <tbody>
                                    <tr><td className={`border ${theme.border} px-3 py-2`}>1</td><td className={`border ${theme.border} px-3 py-2`}>Paint</td><td className={`border ${theme.border} px-3 py-2 font-bold`}>{results?.paint} liters</td></tr>
                                    <tr><td className={`border ${theme.border} px-3 py-2`}>2</td><td className={`border ${theme.border} px-3 py-2`}>Primer</td><td className={`border ${theme.border} px-3 py-2 font-bold`}>{results?.primer} liters</td></tr>
                                    <tr><td className={`border ${theme.border} px-3 py-2`}>3</td><td className={`border ${theme.border} px-3 py-2`}>Putty</td><td className={`border ${theme.border} px-3 py-2 font-bold`}>{results?.putty} kgs</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-calculator ${theme.text} mr-2`}></i>Paint-Work Calculation</h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#f8f9fa] p-4 rounded-lg"><div className="text-sm text-gray-600 mb-2">Paint Area</div><div className={`font-bold ${theme.text}`}>= {results?.paintArea} ft²</div></div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg"><div className="text-sm text-gray-600 mb-2">Door & Window Area</div><div className="text-xs">Door = {results?.doorArea} ft²</div><div className="text-xs">Window = {results?.windowArea} ft²</div></div>
                                <div className="bg-[#f8f9fa] p-4 rounded-lg"><div className="text-sm text-gray-600 mb-2">Actual Paint Area</div><div className="font-bold text-red-500">= {results?.actualPaintArea} ft²</div></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`bg-white border rounded-xl p-4 text-center ${theme.border}`}><div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-paint-roller text-red-500"></i></div><div className="font-bold">Paint</div><div className="text-xl font-bold text-red-500">{results?.paint} liter</div></div>
                                <div className={`bg-white border rounded-xl p-4 text-center ${theme.border}`}><div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-fill-drip text-blue-500"></i></div><div className="font-bold">Primer</div><div className="text-xl font-bold text-blue-500">{results?.primer} liter</div></div>
                                <div className={`bg-white border rounded-xl p-4 text-center ${theme.border}`}><div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 flex items-center justify-center"><i className="fas fa-layer-group text-amber-500"></i></div><div className="font-bold">Putty</div><div className="text-xl font-bold text-amber-500">{results?.putty} kgs</div></div>
                            </div>
                        </div>
                    </section>

                    {/* What is paint calculation */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is paint calculation?</h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4 text-justify">Paint Calculator helps you calculate the area to be painted and gives you an estimate of the required amount of paint, primer, and putty.</p>
                            <div className={`bg-[#f8f9fa] p-4 rounded-lg font-mono text-sm ${theme.text}`}>
                                <p>Paint Area = Carpet Area × 3.5</p>
                                <p>Actual Paint Area = Paint Area - Door Area - Window Area</p>
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
                    {/* THEME BORDER APPLIED HERE */}
                    <div className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} flex items-center gap-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <i className="fas fa-paint-roller text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Paint Work Calculator</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Carpet Area (Sq. ft)</label><input type="number" value={carpetArea} onChange={(e) => setCarpetArea(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Door Size (W × H)</label><div className="grid grid-cols-2 gap-2"><input type="number" value={doorWidth} onChange={(e) => setDoorWidth(Number(e.target.value))} className={`px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><input type="number" value={doorHeight} onChange={(e) => setDoorHeight(Number(e.target.value))} className={`px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">No. of Doors</label><input type="number" value={noOfDoors} onChange={(e) => setNoOfDoors(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Window Size (W × H)</label><div className="grid grid-cols-2 gap-2"><input type="number" value={windowWidth} onChange={(e) => setWindowWidth(Number(e.target.value))} className={`px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><input type="number" value={windowHeight} onChange={(e) => setWindowHeight(Number(e.target.value))} className={`px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">No. of Windows</label><input type="number" value={noOfWindows} onChange={(e) => setNoOfWindows(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg">Reset</button></div>
                            <div className="bg-[#f8f9fa] rounded-xl p-4 text-center"><div className="text-xs text-gray-500">Paint Area</div><div className={`text-xl font-bold ${theme.text}`}>{results?.actualPaintArea} ft²</div><div className="grid grid-cols-3 gap-2 mt-3 text-xs"><div className="bg-white p-2 rounded border"><div className="font-bold text-red-500">{results?.paint} L</div><div>Paint</div></div><div className="bg-white p-2 rounded border"><div className="font-bold text-blue-500">{results?.primer} L</div><div>Primer</div></div><div className="bg-white p-2 rounded border"><div className="font-bold text-amber-500">{results?.putty} kg</div><div>Putty</div></div></div></div>
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
