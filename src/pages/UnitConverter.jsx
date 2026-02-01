import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import { getThemeClasses } from '../constants/categories';

export default function UnitConverter() {
    const theme = getThemeClasses('green');
    const [conversionType, setConversionType] = useState('Length');
    const [unitFrom, setUnitFrom] = useState('Metre');
    const [value, setValue] = useState(1);
    const [decimalPrecision, setDecimalPrecision] = useState(2);
    const [results, setResults] = useState([]);
    const sidebarRef = useRef(null);

    const conversions = {
        Length: {
            units: ['Metre', 'Feet', 'Kilometre', 'Mile', 'Yard', 'Inch', 'Centimetre'],
            factors: { Metre: 1, Feet: 3.2808, Kilometre: 0.001, Mile: 0.000621, Yard: 1.09, Inch: 39.37, Centimetre: 100 }
        },
        Area: {
            units: ['Square metre', 'Square feet', 'Square yard', 'Hectare', 'Acre', 'Guntha', 'Vigha'],
            factors: { 'Square metre': 1, 'Square feet': 10.7639, 'Square yard': 1.1959, Hectare: 0.0001, Acre: 0.000247, Guntha: 0.00988, Vigha: 0.000618 }
        },
        Volume: {
            units: ['Cubic metre', 'Cubic feet', 'Cubic inch', 'Litre'],
            factors: { 'Cubic metre': 1, 'Cubic feet': 35.3147, 'Cubic inch': 61023.7, Litre: 1000 }
        }
    };

    const lengthTable = [
        { from: '1 metre (m)', to: '3.2808 feet (ft)' },
        { from: '1 kilometre (km)', to: '1000 metre (m)' },
        { from: '1 mile', to: '1.609 kilometre (km)' },
        { from: '1 feet (ft)', to: '12 inch' },
        { from: '1 inch', to: '2.54 centimetre (cm)' },
        { from: '1 yard', to: '3 feet (ft)' },
    ];

    const areaTable = [
        { from: '1 Square metre (m²)', to: '10.7639 Square feet (ft²)' },
        { from: '1 Square metre (m²)', to: '1.1959 Square yard' },
        { from: '1 Square Yard', to: '9 Square feet (ft²)' },
        { from: '1 Hectare', to: '2.4711 Acre' },
        { from: '1 Hectare', to: '10000 Square metre (m²)' },
        { from: '1 Hectare', to: '107639 Square feet (ft²)' },
        { from: '1 Acre', to: '4046.86 Square metre (m²)' },
        { from: '1 Guntha', to: '121 Square Yard' },
        { from: '1 Vigha', to: '16 Guntha' },
        { from: '1 Vigha', to: '1618.73 Square metre (m²)' },
        { from: '1 Vigha', to: '17423.9124 Square feet (ft²)' },
        { from: '1 Acre', to: '40 Guntha' },
        { from: '1 Hectare', to: '10000 Square metre (m²)' },
    ];

    const volumeTable = [
        { from: '1 Cubic metre (m³)', to: '35.3147 Square feet (ft³)' },
        { from: '1 Cubic metre (m³)', to: '61023.7 Cubic Inch' },
        { from: '1 Cubic Feet (ft³)', to: '1728 Cubic Inch' },
    ];

    const calculate = () => {
        const conv = conversions[conversionType];
        const baseFactor = conv.factors[unitFrom];
        const baseValue = value / baseFactor;

        const newResults = conv.units.map((unit, index) => ({
            sr: index + 1,
            unit,
            value: (baseValue * conv.factors[unit]).toFixed(decimalPrecision)
        }));
        setResults(newResults);
    };

    useEffect(() => { calculate(); setUnitFrom(conversions[conversionType].units[0]); }, [conversionType]);
    useEffect(() => { calculate(); }, [unitFrom, value, decimalPrecision]);
    useEffect(() => {
        const update = () => { if (sidebarRef.current) { const vh = window.innerHeight, sh = sidebarRef.current.offsetHeight; sidebarRef.current.style.top = sh > vh - 80 ? `${vh - sh - 16}px` : '80px'; } };
        update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory="quantity-estimator" />
            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Unit Conversion</h1>
                    <p className="text-[#6b7280] mb-6">Convert between different civil engineering units</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center"><i className={`fas fa-info-circle ${theme.text} mr-2`}></i>What is Unit Conversion?</h2>
                        <div className={`bg-white rounded-xl p-6 border ${theme.border} flex flex-col md:flex-row gap-6`}>
                            <div className="flex-1">
                                <p className="text-gray-600 mb-4">Unit conversion is a multi-step process that involves multiplication or division by a numerical factor, selection of the correct number of significant digits, and rounding.</p>
                                <p className="text-gray-600 mb-4"><strong>Length Conversion</strong> describe between the various different sizes by merely moving the decimal point the correct number of places. The basic metric units are meters (for length).</p>
                                <p className="text-gray-600 mb-4"><strong>Area Conversion</strong> describes the total amount of space a 2 dimensional shape covers. The units used to describe an area are based on the length of a side of a square, the standard SI unit for area is the square meter.</p>
                                <p className="text-gray-600"><strong>Volume conversion</strong> a space any substance occupies or contains in a three dimensional space. While the SI unit for volume is the cubic meter, it is too big for common use and has been replaced with the liter (1 cubic decimeter) in everyday life.</p>
                            </div>
                            <div className="w-full md:w-48 space-y-2">
                                <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Ruler" className="w-full h-20 object-cover rounded-lg" />
                                <img src="https://images.unsplash.com/photo-1576156858277-22685764d99a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Measuring tape" className="w-full h-20 object-cover rounded-lg" />
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                                <h3 className="font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-ruler ${theme.text} mr-2`}></i>Length Conversion Table</h3>
                                <table className="w-full text-sm">
                                    <thead><tr className="bg-gray-50"><th className="border-b px-2 py-2 text-left text-gray-500">Unit Name</th><th className="border-b px-2 py-2 text-left text-gray-500">Converted Value</th></tr></thead>
                                    <tbody className="divide-y">{lengthTable.map((row, i) => <tr key={i}><td className="px-2 py-2">{row.from}</td><td className="px-2 py-2">{row.to}</td></tr>)}</tbody>
                                </table>
                            </div>
                            <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                                <h3 className="font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-vector-square ${theme.text} mr-2`}></i>Area Conversion Table</h3>
                                <table className="w-full text-sm">
                                    <thead><tr className="bg-gray-50"><th className="border-b px-2 py-2 text-left text-gray-500">Unit Name</th><th className="border-b px-2 py-2 text-left text-gray-500">Converted Value</th></tr></thead>
                                    <tbody className="divide-y">{areaTable.slice(0, 8).map((row, i) => <tr key={i}><td className="px-2 py-2">{row.from}</td><td className="px-2 py-2">{row.to}</td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className={`bg-white rounded-xl p-6 border ${theme.border}`}>
                            <h3 className="font-bold text-[#0A0A0A] mb-4"><i className={`fas fa-cube ${theme.text} mr-2`}></i>Volume Conversion Table</h3>
                            <table className="w-full text-sm max-w-md">
                                <thead><tr className="bg-gray-50"><th className="border-b px-2 py-2 text-left text-gray-500">Unit Name</th><th className="border-b px-2 py-2 text-left text-gray-500">Converted Value</th></tr></thead>
                                <tbody className="divide-y">{volumeTable.map((row, i) => <tr key={i}><td className="px-2 py-2">{row.from}</td><td className="px-2 py-2">{row.to}</td></tr>)}</tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <aside ref={sidebarRef} className="sticky top-20 h-fit">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb]">
                        <div className={`px-5 py-4 border-b border-[#e5e7eb] ${theme.gradient} flex items-center gap-3 bg-gradient-to-r rounded-t-2xl`}>
                            <i className="fas fa-exchange-alt text-xl text-white"></i>
                            <h2 className="font-semibold text-white">CIVIL UNIT CONVERSION CALCULATOR</h2>
                        </div>
                        <div className="p-5">
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Conversion Type</label><select value={conversionType} onChange={(e) => setConversionType(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}><option value="Length">Length</option><option value="Area">Area</option><option value="Volume">Volume</option></select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Unit</label><select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}>{conversions[conversionType].units.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">Value</label><div className="relative"><input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className={`w-full px-3 py-2 pr-16 border rounded-lg text-sm ${theme.focus} outline-none`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unitFrom.toLowerCase().split(' ')[0]}</span></div></div>
                            <div className="mb-4"><label className="text-xs text-gray-500 mb-1 block">Decimal Precision</label><select value={decimalPrecision} onChange={(e) => setDecimalPrecision(Number(e.target.value))} className={`w-full px-3 py-2 border rounded-lg text-sm ${theme.focus} outline-none`}><option value={0}>0</option><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
                            <div className="flex gap-2 mb-5"><button onClick={calculate} className={`flex-1 ${theme.button} py-2.5 rounded-lg font-medium`}>Calculate</button><button className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600">Reset</button></div>
                            <div className={`${theme.bgLight} rounded-xl p-4`}>
                                <div className="text-center mb-3"><div className={`text-lg font-bold ${theme.text}`}>{value} {unitFrom} is same as</div></div>
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-gray-200"><th className="px-2 py-1 text-left text-gray-500">Sr.</th><th className="px-2 py-1 text-left text-gray-500">Unit</th><th className="px-2 py-1 text-left text-gray-500">Value</th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">{results.map(r => <tr key={r.sr}><td className="px-2 py-2">{r.sr}</td><td className="px-2 py-2">{r.unit}</td><td className={`px-2 py-2 font-bold ${theme.text}`}>{r.value}</td></tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Ad */}
                    <div className="bg-[#f0f0f0] border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 mt-4">
                        <i className="fas fa-ad text-2xl mb-1"></i>
                        <p className="text-xs">Ad Space</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
