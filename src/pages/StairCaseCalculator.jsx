import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';

export default function StairCaseCalculator() {
    const theme = getThemeClasses('green');
    const [unit, setUnit] = useState('Meter');
    const [gradeOfConcrete, setGradeOfConcrete] = useState('M20 (1:1.5:3)');
    const [numberOfRiser, setNumberOfRiser] = useState(11);
    const [heightOfRiser, setHeightOfRiser] = useState(0);
    const [heightOfRiserCm, setHeightOfRiserCm] = useState(18);
    const [widthOfTread, setWidthOfTread] = useState(0);
    const [widthOfTreadCm, setWidthOfTreadCm] = useState(25);
    const [lengthOfStair, setLengthOfStair] = useState(1);
    const [lengthOfStairCm, setLengthOfStairCm] = useState(67);
    const [thicknessOfWaistSlab, setThicknessOfWaistSlab] = useState(0);
    const [thicknessOfWaistSlabCm, setThicknessOfWaistSlabCm] = useState(15);
    const [results, setResults] = useState(null);
    const sidebarRef = useRef(null);

    const gradeRatios = {
        'M20 (1:1.5:3)': { cement: 1, sand: 1.5, aggregate: 3 },
        'M25 (1:1:2)': { cement: 1, sand: 1, aggregate: 2 },
        'M15 (1:2:4)': { cement: 1, sand: 2, aggregate: 4 },
        'M10 (1:3:6)': { cement: 1, sand: 3, aggregate: 6 },
    };

    const calculate = () => {
        let riserH, treadW, stairL, waistT;
        if (unit === 'Meter') {
            riserH = heightOfRiser + heightOfRiserCm / 100;
            treadW = widthOfTread + widthOfTreadCm / 100;
            stairL = lengthOfStair + lengthOfStairCm / 100;
            waistT = thicknessOfWaistSlab + thicknessOfWaistSlabCm / 100;
        } else {
            riserH = (heightOfRiser + heightOfRiserCm / 12) * 0.3048;
            treadW = (widthOfTread + widthOfTreadCm / 12) * 0.3048;
            stairL = (lengthOfStair + lengthOfStairCm / 12) * 0.3048;
            waistT = (thicknessOfWaistSlab + thicknessOfWaistSlabCm / 12) * 0.3048;
        }

        // Tread Step Calculations
        const numberOfTread = numberOfRiser - 1;
        const volumeOfStep = 0.5 * riserH * treadW * stairL;
        const volumeOfTreadStep = volumeOfStep * numberOfTread;
        const lengthOfTreadStep = treadW * numberOfTread;

        // Waist Slab Calculations
        const lengthOfWaistSlab = Math.sqrt(Math.pow(riserH * numberOfRiser, 2) + Math.pow(lengthOfTreadStep, 2));
        const slantHeight = Math.sqrt(Math.pow(riserH, 2) + Math.pow(treadW, 2));
        const waistSlabThicknessPerp = waistT * (slantHeight / treadW);
        const volumeOfWaistSlab = lengthOfWaistSlab * stairL * waistSlabThicknessPerp;

        // Total Volume
        const totalVolume = volumeOfTreadStep + volumeOfWaistSlab;
        const totalVolumeFt3 = totalVolume * 35.3147;
        const dryVolume = totalVolume * 1.524;

        // Material Calculations
        const ratio = gradeRatios[gradeOfConcrete];
        const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
        const cementVolume = (dryVolume * ratio.cement) / totalParts;
        const sandVolume = (dryVolume * ratio.sand) / totalParts;
        const aggregateVolume = (dryVolume * ratio.aggregate) / totalParts;
        const cementBags = cementVolume / 0.035;
        const sandTons = sandVolume * 1.6;
        const aggregateTons = aggregateVolume * 1.5;

        setResults({
            numberOfTread,
            volumeOfStep: volumeOfStep.toFixed(4),
            volumeOfTreadStep: volumeOfTreadStep.toFixed(2),
            lengthOfTreadStep: lengthOfTreadStep.toFixed(2),
            lengthOfWaistSlab: lengthOfWaistSlab.toFixed(2),
            slantHeight: slantHeight.toFixed(4),
            waistSlabThicknessPerp: waistSlabThicknessPerp.toFixed(4),
            volumeOfWaistSlab: volumeOfWaistSlab.toFixed(2),
            totalVolume: totalVolume.toFixed(2),
            totalVolumeFt3: totalVolumeFt3.toFixed(2),
            dryVolume: dryVolume.toFixed(2),
            cementVolume: cementVolume.toFixed(4),
            sandVolume: sandVolume.toFixed(2),
            aggregateVolume: aggregateVolume.toFixed(2),
            cementBags: Math.ceil(cementBags),
            sandTons: sandTons.toFixed(2),
            aggregateTons: aggregateTons.toFixed(2),
        });
    };

    const reset = () => {
        setUnit('Meter');
        setGradeOfConcrete('M20 (1:1.5:3)');
        setNumberOfRiser(11);
        setHeightOfRiser(0); setHeightOfRiserCm(18);
        setWidthOfTread(0); setWidthOfTreadCm(25);
        setLengthOfStair(1); setLengthOfStairCm(67);
        setThicknessOfWaistSlab(0); setThicknessOfWaistSlabCm(15);
        setResults(null);
    };

    useEffect(() => { calculate(); }, [unit, gradeOfConcrete, numberOfRiser, heightOfRiser, heightOfRiserCm, widthOfTread, widthOfTreadCm, lengthOfStair, lengthOfStairCm, thicknessOfWaistSlab, thicknessOfWaistSlabCm]);
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
                            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Stair Case Calculator</h1>
                            <p className="text-[#6b7280]">Calculate concrete quantity for staircase construction</p>
                        </div>
                        <CalculatorActions
                            calculatorSlug="stair-case-calculator"
                            calculatorName="Stair Case Calculator"
                            calculatorIcon="fa-stairs"
                            category="Quantity Estimator"
                            inputs={{ unit, gradeOfConcrete, numberOfRiser, heightOfRiser, widthOfTread, lengthOfStair }}
                            outputs={results || {}}
                        />
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-calculator ${theme.text}`}></i>
                            Stair case calculation
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-3">Volume of Tread Step:</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>Total width = ½ × Riser × Tread</p>
                                        <p>Total width = ½ × {(heightOfRiser + heightOfRiserCm / 100).toFixed(2)} × {(widthOfTread + widthOfTreadCm / 100).toFixed(2)}</p>
                                        <p>Total width = <span className="text-red-500">{((heightOfRiser + heightOfRiserCm / 100) * (widthOfTread + widthOfTreadCm / 100) / 2).toFixed(4)}</span></p>
                                        <p className="mt-2">Number of Rise = Height of Rise</p>
                                        <p>Number of Rise = <span className="text-red-500">{numberOfRiser}</span></p>
                                        <p className="mt-2">Number of Tread = No. of rise - 1</p>
                                        <p>Number of Tread = <span className="text-red-500">{results?.numberOfTread} Nos</span></p>
                                        <p className="mt-2">Volume of Step = L × Width × Tread</p>
                                        <p>Volume of Step = <span className="text-red-500">{results?.volumeOfStep}</span></p>
                                        <p className="mt-2">Vol of Tread Step = Volume of Step × Tread Nos</p>
                                        <p className={`font-bold ${theme.text}`}>Vol of Tread Step = {results?.volumeOfTreadStep}</p>
                                        <p className="mt-2">Length of Tread Step = Tread × {results?.numberOfTread}</p>
                                        <p className={`font-bold ${theme.text}`}>Length of Tread Step = {results?.lengthOfTreadStep}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-3">Volume of Waist Slab:</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>Length of Waist Slab = √(Rise² + Tread²)</p>
                                        <p>Length of Waist Slab = <span className="text-red-500">{results?.lengthOfWaistSlab}</span></p>
                                        <p className="mt-2">Slant Height = √(Riser² + Tread²)</p>
                                        <p>Slant Height = <span className="text-red-500">{results?.slantHeight}</span></p>
                                        <p className="mt-2">∟ supplied Waist Slab = Slant × Waist Thick</p>
                                        <p>Slab Supplied Waist = <span className="text-red-500">{results?.waistSlabThicknessPerp}</span></p>
                                        <p className="mt-2">Waist Thick of Waist Slab = {results?.waistSlabThicknessPerp}</p>
                                        <p className="mt-2">Vol of Waist = L × Thick waist × Stair Per Jo</p>
                                        <p className={`font-bold ${theme.text}`}>Volume of Waist Slab = {results?.volumeOfWaistSlab}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-cubes ${theme.text}`}></i>
                            Total Volume of Stair:
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-sm text-gray-600">
                                    <p>Total Volume = Vol of Tread + Volume of Waist Slab</p>
                                    <p>Total Volume = {results?.volumeOfTreadStep} + {results?.volumeOfWaistSlab}</p>
                                    <p className={`text-xl font-bold ${theme.text} mt-2`}>Total Volume of Stair = {results?.totalVolume} m³</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <h4 className="font-bold mb-2">Dry Volume of Stair:</h4>
                                    <p>Dry Volume of Stair = Volume of Stair × 1.54</p>
                                    <p>Dry Volume of Stair = {results?.totalVolume} × 1.524</p>
                                    <p className={`font-bold ${theme.text}`}>Dry Volume of Stair = {results?.dryVolume}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                <div className="text-sm font-bold text-amber-700 mb-2"><i className="fas fa-box mr-1"></i> Amount of Cement Required</div>
                                <div className="text-xs text-gray-600">Cement Volume = {results?.cementVolume}</div>
                                <div className="text-xl font-bold text-amber-600 my-2">= {results?.cementBags} Bags</div>
                                <div className="text-xs text-gray-500 bg-amber-100 p-2 rounded">Note: 1 Bag of cement = 0.035 volume of cement in m³ is = {results?.cementVolume}</div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                                <div className="text-sm font-bold text-yellow-700 mb-2"><i className="fas fa-mountain mr-1"></i> Amount of Sand Required</div>
                                <div className="text-xs text-gray-600">Sand Volume = {results?.sandVolume}</div>
                                <div className="text-xl font-bold text-yellow-600 my-2">= {results?.sandTons} Tons</div>
                                <div className="text-xs text-gray-500 bg-yellow-100 p-2 rounded">Note: 1m³ sand dry volume = 1 Ton sand in kg = 1.6 Ton Note: Wastage 7 Ton</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                <div className="text-sm font-bold text-gray-700 mb-2"><i className="fas fa-rock mr-1"></i> Amount of Aggregate Required</div>
                                <div className="text-xs text-gray-600">Aggregate Volume = {results?.aggregateVolume}</div>
                                <div className="text-xl font-bold text-gray-600 my-2">= {results?.aggregateTons} Tons</div>
                                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">Note: 1m³ density of loose aggregate = 1500 kg ≈ 1.5 Ton</div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-info-circle ${theme.text}`}></i>
                            What is stair case calculation?
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <p className="text-gray-600 mb-4">A stair case or stairway, is a way of building a stair that splits the whole height into smaller heights with an equal amount of distance from one height to the other. The best height of a riser is in between 31/2 inches to 8 1/4 inches and the best width of a stair tread in a straight flight is 11 inches to 14 inches. These two are the main requirements of a stair that must be fulfilled first. Usually, we have to fix the rise and tread sizes to satisfy the range of the width and headroom.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                            <i className={`fas fa-list ${theme.text}`}></i>
                            Terminology of stair case calculation
                        </h2>
                        {/* THEME BORDER APPLIED HERE */}
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <ul className="space-y-3 text-gray-600">
                                <li><strong>Rise/Riser –</strong> The one step from the other. The length between the first floor to the second floor is known as full length/height. The best height of one rise is in between 5 inches to 8 1/4 inches.</li>
                                <li><strong>Run/Tread –</strong> It is a horizontal surface on which people can walk while going from the place to another. It is a horizontal part of the stair on which we place our foot while going up or down from the ground floor to the first floor or from the first floor to the ground.</li>
                                <li><strong>Waist slab –</strong> The concrete waist slab of a stair is also called the waist slab of a stair. The stair slab is a structural component of a stair that gives support to the riser an tread and any necessary live load. This stair slab is normally made of RCC so as to support the riser, tread and live load safely.</li>
                                <li><strong>Slant height –</strong> Slant height is the shortest distance from the base to the highest point along the outer surface of the stair.</li>
                            </ul>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    {/* THEME BORDER APPLIED HERE */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 border-b ${theme.border} ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-stairs text-xl text-white"></i>
                            <h2 className="font-semibold text-white">Stair Case Calculator</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                                    <CustomDropdown
                                        options={[
                                            { value: 'Meter', label: 'Meter/CM' },
                                            { value: 'Feet', label: 'Feet/Inch' }
                                        ]}
                                        value={unit}
                                        onChange={setUnit}
                                        theme={theme}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Grade</label>
                                    <CustomDropdown
                                        options={Object.keys(gradeRatios).map(g => ({ value: g, label: g.split(' ')[0] }))}
                                        value={gradeOfConcrete}
                                        onChange={setGradeOfConcrete}
                                        theme={theme}
                                    />
                                </div>
                            </div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Number of Riser</label><input type="number" value={numberOfRiser} onChange={(e) => setNumberOfRiser(Number(e.target.value))} className={`w-full px-3 py-2 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Height of Riser</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={heightOfRiser} onChange={(e) => setHeightOfRiser(Number(e.target.value))} className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">m</span></div><div className="relative"><input type="number" value={heightOfRiserCm} onChange={(e) => setHeightOfRiserCm(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Width of Tread</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={widthOfTread} onChange={(e) => setWidthOfTread(Number(e.target.value))} className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">m</span></div><div className="relative"><input type="number" value={widthOfTreadCm} onChange={(e) => setWidthOfTreadCm(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Length of Stair</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={lengthOfStair} onChange={(e) => setLengthOfStair(Number(e.target.value))} className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">m</span></div><div className="relative"><input type="number" value={lengthOfStairCm} onChange={(e) => setLengthOfStairCm(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Thickness of Waist Slab</label><div className="grid grid-cols-2 gap-2"><div className="relative"><input type="number" value={thicknessOfWaistSlab} onChange={(e) => setThicknessOfWaistSlab(Number(e.target.value))} className={`w-full px-3 py-2 pr-14 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">m</span></div><div className="relative"><input type="number" value={thicknessOfWaistSlabCm} onChange={(e) => setThicknessOfWaistSlabCm(Number(e.target.value))} className={`w-full px-3 py-2 pr-10 ${theme.border} rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span></div></div></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button><button onClick={reset} className="bg-red-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Reset</button></div>
                            <div className={`${theme.bgLight} rounded-xl p-4`}>
                                <div className="text-center mb-3">
                                    <div className="text-xs text-gray-500">Total Volume of Stair Case</div>
                                    <div className={`text-xl font-bold ${theme.text}`}>{results?.totalVolume} m³ <span className="text-gray-400">|</span> {results?.totalVolumeFt3} ft³</div>
                                </div>
                                <table className="w-full text-xs">
                                    <thead><tr className="bg-white"><th className="px-2 py-1 text-left">Sr.</th><th className="px-2 py-1 text-left">Material</th><th className="px-2 py-1 text-left">Quantity</th></tr></thead>
                                    <tbody>
                                        <tr><td className="px-2 py-1">1</td><td className="px-2 py-1">Cement</td><td className="px-2 py-1 font-bold">{results?.cementBags} Bags</td></tr>
                                        <tr><td className="px-2 py-1">2</td><td className="px-2 py-1">Sand</td><td className="px-2 py-1 font-bold">{results?.sandTons} Ton</td></tr>
                                        <tr><td className="px-2 py-1">3</td><td className="px-2 py-1">Aggregate</td><td className="px-2 py-1 font-bold">{results?.aggregateTons} Ton</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
