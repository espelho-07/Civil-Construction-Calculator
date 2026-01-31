import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import { getThemeClasses } from '../constants/categories';

export default function PlywoodCalculator() {
    const theme = getThemeClasses('quantity-estimator');
    const [unit, setUnit] = useState('Meter');
    const [length, setLength] = useState(10);
    const [lengthCm, setLengthCm] = useState(0);
    const [width, setWidth] = useState(10);
    const [widthCm, setWidthCm] = useState(0);
    const [plywoodLength, setPlywoodLength] = useState(8); // Feet
    const [plywoodWidth, setPlywoodWidth] = useState(4); // Feet
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const calculate = () => {
        let roomL, roomW;
        if (unit === 'Meter') {
            roomL = (length + lengthCm / 100) * 3.28084; // Convert to feet
            roomW = (width + widthCm / 100) * 3.28084; // Convert to feet
        } else {
            roomL = length + lengthCm / 12; // Feet
            roomW = width + widthCm / 12; // Feet
        }

        const roomArea = roomL * roomW;
        
        // Plywood Area
        const plywoodArea = plywoodLength * plywoodWidth;

        const sheets = Math.ceil(roomArea / plywoodArea);
        const totalAreaSqFt = roomArea;
        const totalAreaSqM = roomArea / 10.7639;

        setResults({
            sheets,
            totalAreaSqFt: totalAreaSqFt.toFixed(2),
            totalAreaSqM: totalAreaSqM.toFixed(2),
            roomL: roomL.toFixed(2),
            roomW: roomW.toFixed(2)
        });
    };

    const reset = () => {
        setUnit('Meter');
        setLength(10); setLengthCm(0);
        setWidth(10); setWidthCm(0);
        setPlywoodLength(8);
        setPlywoodWidth(4);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, length, lengthCm, width, widthCm, plywoodLength, plywoodWidth]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Plywood Calculator</h1>
                            <p className="text-[#6b7280]">Calculate the number of plywood sheets required for a room</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="plywood-calculator"
                            calculatorName="Plywood Calculator"
                            calculatorIcon="fa-layer-group"
                            category="Quantity Estimator"
                            inputs={{ unit, length, width, plywoodLength, plywoodWidth }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500">Number of Sheets Required</div>
                                <div className={`text-4xl font-bold ${theme.text}`}>{results?.sheets} Sheets</div>
                            </div>
                            <div className={`${theme.bgLight} p-4 rounded-lg text-center`}>
                                <div className="text-sm text-gray-600 mb-2">Plywood calculation</div>
                                <div className="font-mono text-sm">
                                    <p>Room Area = Length × Width = {results?.roomL} × {results?.roomW} = {results?.totalAreaSqFt} sq.ft</p>
                                    <p className="mt-2">Plywood Sheet Area = {plywoodLength} × {plywoodWidth} = {plywoodLength * plywoodWidth} sq.ft</p>
                                    <p className="mt-2">Sheets Required = Room Area / Sheet Area</p>
                                    <p className={`font-bold ${theme.text}`}>Sheets = {results?.sheets}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section className="mb-8">
                         <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is Plywood?
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} text-justify`}>
                            <p className="text-gray-600 mb-4">Plywood is a material manufactured from thin layers or "plies" of wood veneer that are glued together with adjacent layers having their wood grain rotated up to 90 degrees to one another. It is an engineered wood from the family of manufactured boards which includes medium-density fibreboard (MDF) and particle board (chipboard).</p>
                             <p className="text-gray-600">All plywoods bind resin and wood fibre sheets (cellulose cells are long, strong and thin) to form a composite material. This alternation of the grain is called cross-graining and has several important benefits: it reduces the tendency of wood to split when nailed at the edges; it reduces expansion and shrinkage, providing improved dimensional stability; and it makes the strength of the panel consistent across all directions.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                             <i className={`fas fa-table ${theme.text}`}></i>
                             Standard Plywood Sizes
                        </h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} overflow-x-auto`}>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8f9fa] border-b">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold">Uses</th>
                                        <th className="px-4 py-2 font-semibold">Thickness (in)</th>
                                        <th className="px-4 py-2 font-semibold">Thickness (mm)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr className="hover:bg-gray-50"><td className="px-4 py-2">Cabinet Fronts</td><td className="px-4 py-2">1/4</td><td className="px-4 py-2">6mm</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-4 py-2">Drawers</td><td className="px-4 py-2">1/2</td><td className="px-4 py-2">12mm</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-4 py-2">Furniture</td><td className="px-4 py-2">3/4</td><td className="px-4 py-2">19mm</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-4 py-2">Cabinet Making</td><td className="px-4 py-2">3/8</td><td className="px-4 py-2">9mm</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-4 py-2">Roof Sheathing</td><td className="px-4 py-2">5/8</td><td className="px-4 py-2">16mm</td></tr>
                                </tbody>
                            </table>
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
                         <div className={`px-5 py-4 border-b ${theme.gradient} flex items-center gap-3`}>
                            <i className="fas fa-layer-group text-xl text-white"></i>
                            <h2 className="font-semibold text-white">PLYWOOD CALCULATION</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                <select 
                                    value={unit} 
                                    onChange={(e) => setUnit(e.target.value)} 
                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}
                                >
                                    <option value="Meter">Meter/CM</option>
                                    <option value="Feet">Feet/Inch</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Room Length</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={length} 
                                            onChange={(e) => setLength(Number(e.target.value))} 
                                            className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`} 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={lengthCm} 
                                            onChange={(e) => setLengthCm(Number(e.target.value))} 
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`} 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 mb-1 block">Room Width</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={width} 
                                            onChange={(e) => setWidth(Number(e.target.value))} 
                                            className={`w-full px-3 py-2 pr-14 border rounded-lg text-sm ${theme.focus} outline-none`} 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'meter' : 'feet'}</span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={widthCm} 
                                            onChange={(e) => setWidthCm(Number(e.target.value))} 
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${theme.focus} outline-none`} 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit === 'Meter' ? 'cm' : 'inch'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-gray-500 mb-1 block">Plywood Size (Feet)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-400">Length (ft)</label>
                                        <input type="number" value={plywoodLength} onChange={(e) => setPlywoodLength(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400">Width (ft)</label>
                                        <input type="number" value={plywoodWidth} onChange={(e) => setPlywoodWidth(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button>
                                <button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button>
                            </div>
                            <div className={`${theme.bgLight} rounded-xl p-4 text-center`}>
                                <div className="text-xs text-gray-500">Plywood Sheets</div>
                                <div className={`text-3xl font-bold ${theme.text}`}>{results?.sheets}</div>
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
