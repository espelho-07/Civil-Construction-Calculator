import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import CalculatorActions from '../components/CalculatorActions';
import CustomDropdown from '../components/CustomDropdown';
import { getThemeClasses } from '../constants/categories';
import { SIEVE_ANALYSIS_NAV, BLENDING_NAV } from '../constants/calculatorRoutes';
import GlobalSearch from '../components/GlobalSearch';

// GSB Grading Data (MORTH Table 400-1) - All 6 Grades with Pan
const GRADING_DATA = {
    'Grade I': {
        title: 'Grade I',
        desc: 'For coarse graded granular sub-base materials (Grading I).',
        sieves: [
            { size: '75 mm', min: 100, max: 100 },
            { size: '53 mm', min: 80, max: 100 },
            { size: '26.5 mm', min: 55, max: 90 },
            { size: '9.5 mm', min: 35, max: 65 },
            { size: '4.75 mm', min: 25, max: 55 },
            { size: '2.36 mm', min: 20, max: 40 },
            { size: '0.425 mm', min: 10, max: 25 },
            { size: '0.075 mm', min: 3, max: 10 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grade II': {
        title: 'Grade II',
        desc: 'For coarse graded granular sub-base materials (Grading II).',
        sieves: [
            { size: '53 mm', min: 100, max: 100 },
            { size: '26.5 mm', min: 50, max: 80 },
            { size: '9.5 mm', min: 25, max: 50 },
            { size: '4.75 mm', min: 15, max: 40 },
            { size: '2.36 mm', min: 10, max: 30 },
            { size: '0.425 mm', min: 8, max: 25 },
            { size: '0.075 mm', min: 3, max: 10 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grade III': {
        title: 'Grade III',
        desc: 'For coarse graded granular sub-base materials (Grading III).',
        sieves: [
            { size: '26.5 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 65, max: 95 },
            { size: '4.75 mm', min: 50, max: 80 },
            { size: '0.425 mm', min: 20, max: 45 },
            { size: '0.075 mm', min: 3, max: 10 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grade IV': {
        title: 'Grade IV',
        desc: 'For close graded granular sub-base materials (Grading IV).',
        sieves: [
            { size: '53 mm', min: 100, max: 100 },
            { size: '26.5 mm', min: 75, max: 100 },
            { size: '9.5 mm', min: 40, max: 75 },
            { size: '4.75 mm', min: 25, max: 55 },
            { size: '2.36 mm', min: 15, max: 40 },
            { size: '0.425 mm', min: 8, max: 22 },
            { size: '0.075 mm', min: 3, max: 8 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grade V': {
        title: 'Grade V',
        desc: 'For close graded granular sub-base materials (Grading V).',
        sieves: [
            { size: '26.5 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 50, max: 80 },
            { size: '4.75 mm', min: 35, max: 65 },
            { size: '2.36 mm', min: 25, max: 50 },
            { size: '0.425 mm', min: 12, max: 28 },
            { size: '0.075 mm', min: 3, max: 8 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    },
    'Grade VI': {
        title: 'Grade VI',
        desc: 'For close graded granular sub-base materials (Grading VI).',
        sieves: [
            { size: '13.2 mm', min: 100, max: 100 },
            { size: '9.5 mm', min: 80, max: 100 },
            { size: '4.75 mm', min: 55, max: 85 },
            { size: '2.36 mm', min: 35, max: 65 },
            { size: '0.425 mm', min: 15, max: 30 },
            { size: '0.075 mm', min: 3, max: 8 },
            { size: 'Pan', min: 0, max: 0 }
        ]
    }
};

// Map URL grade number to Grade name
const GRADE_URL_MAP = {
    '1': 'Grade I',
    '2': 'Grade II',
    '3': 'Grade III',
    '4': 'Grade IV',
    '5': 'Grade V',
    '6': 'Grade VI'
};

export default function GSBGradingCalculator() {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlending = location.pathname.includes('blending-aggregates');
    const theme = getThemeClasses(isBlending ? 'purple' : 'blue');

    // Extract grade number from URL
    const getGradeFromURL = () => {
        const match = location.pathname.match(/gsb-grading-(\d)/);
        if (match && GRADE_URL_MAP[match[1]]) {
            return GRADE_URL_MAP[match[1]];
        }
        return 'Grade I';
    };

    // Standard State
    const [grade, setGrade] = useState(getGradeFromURL());
    const [inputs, setInputs] = useState({});
    const [sampleWeight, setSampleWeight] = useState('');
    const [results, setResults] = useState({});

    // Blending State
    const [numMaterials, setNumMaterials] = useState(2);
    const [blendingInputs, setBlendingInputs] = useState({
        materials: [
            { id: 'A', weight: '', readings: {} },
            { id: 'B', weight: '', readings: {} }
        ]
    });

    const currentData = GRADING_DATA[grade];
    const sidebarRef = useRef(null);

    // Update grade when URL changes
    useEffect(() => {
        const newGrade = getGradeFromURL();
        if (newGrade !== grade) {
            setGrade(newGrade);
            setInputs({});
            setResults({});
        }
    }, [location.pathname]);

    // Sidebar Scroll Logic
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

    // Standard Input Handler
    const handleInputChange = (sieveSize, value) => {
        setInputs(prev => ({ ...prev, [sieveSize]: value }));
    };

    // Standard Effect - Calculation Logic
    useEffect(() => {
        if (isBlending) return;

        const totalWeight = parseFloat(sampleWeight);
        if (!totalWeight || totalWeight <= 0) {
            setResults({});
            return;
        }

        const newResults = {};
        let cumRetainedWeight = 0;

        currentData.sieves.forEach(sieve => {
            const retained = parseFloat(inputs[sieve.size] || 0);
            cumRetainedWeight += retained;

            const percentRetained = (retained / totalWeight) * 100;
            const cumPercentRetained = (cumRetainedWeight / totalWeight) * 100;
            const percentPassing = 100 - cumPercentRetained;

            let status = 'Fail';
            if (sieve.size === 'Pan') {
                status = '-';
            } else if (percentPassing >= sieve.min && percentPassing <= sieve.max) {
                status = 'Pass';
            }

            newResults[sieve.size] = {
                retained,
                percentRetained: percentRetained.toFixed(2),
                cumPercentRetained: cumPercentRetained.toFixed(2),
                percentPassing: percentPassing.toFixed(2),
                status
            };
        });

        setResults(newResults);
    }, [inputs, grade, isBlending, sampleWeight]);

    const handleBlendingWeightChange = (index, value) => {
        setBlendingInputs(prev => {
            const newMaterials = [...prev.materials];
            newMaterials[index] = { ...newMaterials[index], weight: value };
            return { ...prev, materials: newMaterials };
        });
    };

    const handleBlendingReadingChange = (index, sieveSize, value) => {
        setBlendingInputs(prev => {
            const newMaterials = [...prev.materials];
            const newReadings = { ...newMaterials[index].readings, [sieveSize]: value };
            newMaterials[index] = { ...newMaterials[index], readings: newReadings };
            return { ...prev, materials: newMaterials };
        });
    };

    const handleMaterialCountChange = (count) => {
        const n = parseInt(count);
        setNumMaterials(n);
        setBlendingInputs({
            materials: Array(n).fill(0).map((_, i) => ({
                id: String.fromCharCode(65 + i),
                weight: '',
                readings: {}
            }))
        });
    };

    const reset = () => {
        setInputs({});
        setSampleWeight('');
        setResults({});
        setBlendingInputs({
            materials: Array(numMaterials).fill(0).map((_, i) => ({
                id: String.fromCharCode(65 + i),
                weight: '',
                readings: {}
            }))
        });
    };

    // Handle grade change - navigate to correct URL
    const handleGradeChange = (newGrade) => {
        const gradeNum = newGrade.replace('Grade ', '');
        const romanToNum = { 'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5', 'VI': '6' };
        const num = romanToNum[gradeNum];
        const basePath = isBlending ? '/blending-aggregates' : '/sieve-analysis';
        navigate(`${basePath}/gsb-grading-${num}`);
    };

    const gradeOptions = Object.keys(GRADING_DATA).map(g => ({ value: g, label: g }));

    // Global Search Filter
    const searchResults = searchQuery.length > 0
        ? ALL_CALCULATORS.filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8)
        : [];

    const handleSearchSelect = (slug) => {
        setSearchQuery('');
        setShowSearchResults(false);
        navigate(slug);
    };

    // Back to category
    const handleBack = () => {
        navigate(isBlending ? '/category/blending-aggregates' : '/category/sieve-analysis-aggregates');
    };

    return (
        <main className="min-h-screen bg-[#F7F9FF]">
            <CategoryNav activeCategory={isBlending ? 'blending-aggregates' : 'sieve-analysis-aggregates'} />

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                {/* Main Content */}
                <div>
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm"
                            >
                                <i className="fas fa-arrow-left"></i>
                                <span>Back</span>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">GSB Grading Calculator</h1>
                                <p className="text-[#6b7280]">Granular Sub-Base Grading Analysis (MORT&H Table 400-1)</p>
                            </div>
                        </div>
                        <CalculatorActions
                            calculatorSlug="gsb-grading"
                            calculatorName="GSB Grading Calculator"
                            calculatorIcon="fa-filter"
                            category={isBlending ? "Blending of Aggregates" : "Sieve Analysis"}
                            inputs={isBlending ? { grade, blendingInputs } : { grade, inputs }}
                            outputs={results}
                        />
                    </div>

                    {/* Top Ad Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center text-blue-600 mb-6">
                        <div className="flex items-center justify-center gap-2">
                            <i className="fas fa-ad"></i>
                            <span className="text-sm font-medium">Advertisement</span>
                        </div>
                        <p className="text-xs text-blue-400 mt-1">Your Ad Here - Support our free calculators</p>
                    </div>

                    {/* Calculator Section */}
                    <section className="mb-8">
                        <div className={`bg-white rounded-xl border ${theme.border} overflow-hidden shadow-sm`}>
                            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <i className={`fas ${isBlending ? 'fa-blender' : 'fa-filter'} text-white`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">
                                            {isBlending ? 'Blending of Aggregates' : 'Sieve Analysis - Retained Weight Method'}
                                        </h3>
                                        <p className="text-white/80 text-xs">{grade} - MORTH Table 400-1</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {isBlending ? (
                                    // Blending UI
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-medium text-gray-700">No. of Material</label>
                                            <select
                                                value={numMaterials}
                                                onChange={(e) => handleMaterialCountChange(e.target.value)}
                                                className={`border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${theme.focus}`}
                                            >
                                                {[2, 3, 4, 5].map(n => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="bg-[#f8f9fa]">
                                                        <th className="border border-[#e5e7eb] px-4 py-3 text-left w-40">Sieve size (mm)</th>
                                                        {blendingInputs.materials.map((mat) => (
                                                            <th key={mat.id} className="border border-[#e5e7eb] px-4 py-3 text-center">
                                                                Material {mat.id}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-[#e5e7eb] px-4 py-2 font-medium flex items-center gap-2">
                                                            <i className="fas fa-balance-scale text-gray-400"></i>
                                                            Sample Weight
                                                        </td>
                                                        {blendingInputs.materials.map((mat, idx) => (
                                                            <td key={mat.id} className="border border-[#e5e7eb] px-2 py-2">
                                                                <input
                                                                    type="number"
                                                                    value={mat.weight}
                                                                    onChange={(e) => handleBlendingWeightChange(idx, e.target.value)}
                                                                    className={`w-full px-3 py-1.5 border border-[#e5e7eb] rounded text-center outline-none ${theme.focus} focus:ring-2 bg-gray-50`}
                                                                    placeholder="g"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    {currentData.sieves.map((sieve, sieveIdx) => (
                                                        <tr key={sieveIdx}>
                                                            <td className="border border-[#e5e7eb] px-4 py-2 flex items-center gap-2">
                                                                <i className={`fas ${sieve.size === 'Pan' ? 'fa-box' : 'fa-bacon'} text-gray-300 transform -rotate-45 text-xs`}></i>
                                                                {sieve.size}
                                                            </td>
                                                            {blendingInputs.materials.map((mat, matIdx) => (
                                                                <td key={mat.id} className="border border-[#e5e7eb] px-2 py-1">
                                                                    <input
                                                                        type="number"
                                                                        value={mat.readings[sieve.size] || ''}
                                                                        onChange={(e) => handleBlendingReadingChange(matIdx, sieve.size, e.target.value)}
                                                                        className={`w-full px-2 py-1.5 border border-[#e5e7eb] rounded text-center outline-none ${theme.focus} focus:ring-2`}
                                                                        placeholder="-"
                                                                    />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    // Standard UI (Retained Weight Calculation)
                                    <div className="space-y-6">
                                        {/* Sample Weight Input */}
                                        <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <i className="fas fa-balance-scale text-blue-500"></i>
                                                Total Sample Weight (g):
                                            </label>
                                            <input
                                                type="number"
                                                value={sampleWeight}
                                                onChange={(e) => setSampleWeight(e.target.value)}
                                                className={`w-32 px-3 py-1.5 border border-blue-300 rounded text-center outline-none ${theme.focus} focus:ring-2 bg-white`}
                                                placeholder="e.g. 5000"
                                            />
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                                        <th className="border border-blue-200 px-4 py-3 text-left font-semibold text-blue-800">IS Sieve</th>
                                                        <th className="border border-blue-200 px-4 py-3 text-center w-32 font-semibold text-blue-800">Weight Retained (g)</th>
                                                        <th className="border border-blue-200 px-4 py-3 text-center bg-gray-50 font-semibold">% Retained</th>
                                                        <th className="border border-blue-200 px-4 py-3 text-center bg-gray-50 font-semibold">Cum. % Retained</th>
                                                        <th className="border border-blue-200 px-4 py-3 text-center font-bold bg-blue-100 text-blue-800">% Passing</th>
                                                        <th className="border border-blue-200 px-4 py-3 text-center text-gray-600 font-semibold">Limits</th>
                                                        <th className="border border-blue-200 px-4 py-3 text-center font-semibold">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentData.sieves.map((sieve, idx) => {
                                                        const res = results[sieve.size];
                                                        const isPan = sieve.size === 'Pan';

                                                        return (
                                                            <tr key={idx} className={isPan ? 'bg-gray-50' : ''}>
                                                                <td className="border border-[#e5e7eb] px-4 py-2 font-medium">
                                                                    <div className="flex items-center gap-2">
                                                                        <i className={`fas ${isPan ? 'fa-box' : 'fa-circle'} text-blue-400 text-xs`}></i>
                                                                        {sieve.size}
                                                                    </div>
                                                                </td>
                                                                <td className="border border-[#e5e7eb] px-2 py-1">
                                                                    <input
                                                                        type="number"
                                                                        value={inputs[sieve.size] || ''}
                                                                        onChange={(e) => handleInputChange(sieve.size, e.target.value)}
                                                                        className={`w-full px-2 py-1 border border-[#e5e7eb] rounded text-center outline-none ${theme.focus} focus:ring-2`}
                                                                        placeholder="0"
                                                                    />
                                                                </td>
                                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center text-gray-600 bg-gray-50">
                                                                    {res ? res.percentRetained : '-'}
                                                                </td>
                                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center text-gray-600 bg-gray-50">
                                                                    {res ? res.cumPercentRetained : '-'}
                                                                </td>
                                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center font-bold text-blue-700 bg-blue-50">
                                                                    {res ? res.percentPassing : '-'}
                                                                </td>
                                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center text-xs text-gray-500">
                                                                    {isPan ? '-' : `${sieve.min} - ${sieve.max}`}
                                                                </td>
                                                                <td className="border border-[#e5e7eb] px-4 py-2 text-center">
                                                                    {res && !isPan && (
                                                                        <>
                                                                            {res.status === 'Pass' && <span className="text-green-600 font-bold"><i className="fas fa-check mr-1"></i>Pass</span>}
                                                                            {res.status === 'Fail' && <span className="text-red-500 font-bold"><i className="fas fa-times mr-1"></i>Fail</span>}
                                                                        </>
                                                                    )}
                                                                    {isPan && <span className="text-gray-400">-</span>}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={reset}
                                        className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                                    >
                                        <i className="fas fa-redo mr-1"></i> Reset
                                    </button>
                                    {isBlending && (
                                        <button className={`px-6 py-2 ${theme.button} rounded-lg text-sm font-medium transition-colors shadow-sm`}>
                                            <i className="fas fa-calculator mr-1"></i> Calculate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mid-Content Ad */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <i className="fas fa-ad text-2xl"></i>
                        </div>
                        <p className="text-sm font-medium">Advertisement</p>
                        <p className="text-xs text-gray-400">Premium Ad Space Available</p>
                    </div>

                    {/* Technical Content */}
                    <div className="space-y-6">
                        {/* What is GSB Section */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-question-circle text-blue-500"></i>
                                What is Granular Sub-Base (GSB)?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Granular Sub-Base (GSB) is a layer of natural or processed aggregate material placed directly on the prepared subgrade in flexible pavement construction. GSB acts as the foundation layer that supports the base course and wearing course above it. It consists of granular materials like natural sand, moorum, gravel, crushed stone, or a combination of these materials conforming to specified gradation requirements.
                            </p>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                The primary functions of GSB include providing structural support to distribute traffic loads, serving as a drainage layer to prevent capillary rise of water, and acting as a working platform during construction. The Ministry of Road Transport and Highways (MORTH) specifies six different grades (I to VI) for GSB materials, with Grades I to III being coarse-graded and Grades IV to VI being close-graded mixtures.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The gradation of GSB material is crucial for achieving a dense, stable mix when compacted. Proper gradation ensures minimum voids, maximum strength, and adequate permeability. The percentage of material passing through each standard IS sieve must fall within the specified limits for the selected grade.
                            </p>
                        </div>

                        {/* MORTH Grading Table */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-table text-blue-500"></i>
                                MORTH Table 400-1: GSB Grading Requirements
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <th className="border border-blue-200 px-3 py-2 text-left">IS Sieve (mm)</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grade I</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grade II</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grade III</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grade IV</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grade V</th>
                                            <th className="border border-blue-200 px-3 py-2 text-center">Grade VI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs">
                                        <tr><td className="border px-3 py-1.5 font-medium">75 mm</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">53 mm</td><td className="border px-3 py-1.5 text-center">80-100</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">26.5 mm</td><td className="border px-3 py-1.5 text-center">55-90</td><td className="border px-3 py-1.5 text-center">50-80</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">75-100</td><td className="border px-3 py-1.5 text-center">100</td><td className="border px-3 py-1.5 text-center">-</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">13.2 mm</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">100</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">9.5 mm</td><td className="border px-3 py-1.5 text-center">35-65</td><td className="border px-3 py-1.5 text-center">25-50</td><td className="border px-3 py-1.5 text-center">65-95</td><td className="border px-3 py-1.5 text-center">40-75</td><td className="border px-3 py-1.5 text-center">50-80</td><td className="border px-3 py-1.5 text-center">80-100</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">4.75 mm</td><td className="border px-3 py-1.5 text-center">25-55</td><td className="border px-3 py-1.5 text-center">15-40</td><td className="border px-3 py-1.5 text-center">50-80</td><td className="border px-3 py-1.5 text-center">25-55</td><td className="border px-3 py-1.5 text-center">35-65</td><td className="border px-3 py-1.5 text-center">55-85</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">2.36 mm</td><td className="border px-3 py-1.5 text-center">20-40</td><td className="border px-3 py-1.5 text-center">10-30</td><td className="border px-3 py-1.5 text-center">-</td><td className="border px-3 py-1.5 text-center">15-40</td><td className="border px-3 py-1.5 text-center">25-50</td><td className="border px-3 py-1.5 text-center">35-65</td></tr>
                                        <tr className="bg-gray-50"><td className="border px-3 py-1.5 font-medium">0.425 mm</td><td className="border px-3 py-1.5 text-center">10-25</td><td className="border px-3 py-1.5 text-center">8-25</td><td className="border px-3 py-1.5 text-center">20-45</td><td className="border px-3 py-1.5 text-center">8-22</td><td className="border px-3 py-1.5 text-center">12-28</td><td className="border px-3 py-1.5 text-center">15-30</td></tr>
                                        <tr><td className="border px-3 py-1.5 font-medium">0.075 mm</td><td className="border px-3 py-1.5 text-center">3-10</td><td className="border px-3 py-1.5 text-center">3-10</td><td className="border px-3 py-1.5 text-center">3-10</td><td className="border px-3 py-1.5 text-center">3-8</td><td className="border px-3 py-1.5 text-center">3-8</td><td className="border px-3 py-1.5 text-center">3-8</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                Reference: MORTH Specifications for Road and Bridge Works, 5th Revision, Table 400-1
                            </p>
                        </div>

                        {/* Theory Section */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-book text-blue-500"></i>
                                Theory
                            </h2>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
                                Sieve analysis is a method used to determine the particle size distribution of granular materials. It involves passing the material through a series of sieves with progressively smaller openings and measuring the weight retained on each sieve. The results are expressed as cumulative percentage passing or retained at each sieve size.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                The grading of GSB material directly affects its engineering properties. A well-graded material with particles of various sizes fills voids efficiently, resulting in higher density and better load-bearing capacity. The fines content (material passing 0.075 mm sieve) must be controlled to ensure adequate drainage while maintaining stability.
                            </p>
                        </div>

                        {/* Apparatus Section */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-tools text-blue-500"></i>
                                Apparatus Required
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li><strong>IS Sieves:</strong> A set of IS sieves of sizes 75mm, 53mm, 26.5mm, 13.2mm, 9.5mm, 4.75mm, 2.36mm, 0.425mm, and 0.075mm, along with a bottom pan and lid.</li>
                                <li><strong>Balance:</strong> A balance readable and accurate to 0.1% of the weight of the test sample (capacity 10-20 kg for GSB).</li>
                                <li><strong>Oven:</strong> Thermostatically controlled oven capable of maintaining a temperature of 110 ± 5°C.</li>
                                <li><strong>Sieve Shaker:</strong> Mechanical sieve shaker (optional but recommended) or manual shaking arrangement.</li>
                                <li><strong>Sample Splitter:</strong> Riffle box or quartering apparatus for obtaining representative samples.</li>
                                <li><strong>Trays and Brushes:</strong> For handling, quartering, and cleaning aggregates from sieves.</li>
                            </ul>
                        </div>

                        {/* Important Notes */}
                        <div className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6`}>
                            <h2 className="text-xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
                                <i className="fas fa-exclamation-triangle text-amber-500"></i>
                                Important Notes
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 text-justify">
                                <li>The combined aggregate gradation must fall within the specified limits for the selected grade at all sieve sizes.</li>
                                <li>Material should have Liquid Limit not exceeding 25% and Plasticity Index not more than 6%.</li>
                                <li>CBR of GSB material shall not be less than 30% when tested at 98% of Maximum Dry Density (Modified Proctor).</li>
                                <li>The GSB layer should be compacted to achieve not less than 98% of laboratory MDD.</li>
                                <li>Minimum thickness of GSB layer is typically 150 mm for light traffic and 200-300 mm for heavy traffic roads.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Ad */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center text-blue-600 mt-8">
                        <i className="fas fa-ad text-3xl mb-2"></i>
                        <p className="text-sm font-medium">Advertisement</p>
                        <p className="text-xs text-blue-400">Premium Banner Space</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div ref={sidebarRef} className="sticky top-20 space-y-6">
                    {/* Global Search with Dropdown Results */}
                    {/* Global Search */}
                    <GlobalSearch />

                    {/* Grade Selector */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i className={`fas ${isBlending ? 'fa-blender' : 'fa-filter'} text-white`}></i>
                                </div>
                                <h3 className="font-bold text-white text-sm">GSB Grading</h3>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="text-xs text-[#6b7280] mb-2 block font-medium">Select Grade</label>
                                <CustomDropdown
                                    options={gradeOptions}
                                    value={grade}
                                    onChange={handleGradeChange}
                                    theme={theme}
                                />
                            </div>
                            <div className="text-xs text-[#6b7280] mt-2 p-3 bg-blue-50 rounded-lg">
                                <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                                {currentData.desc}
                            </div>
                        </div>
                    </div>

                    {/* Quick Nav */}
                    <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
                        <div className={`px-5 py-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                            <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                <i className="fas fa-compass"></i>
                                Sieve Analysis Calculators
                            </h3>
                        </div>
                        <div className="p-3 max-h-64 overflow-y-auto">
                            {(isBlending ? BLENDING_NAV : SIEVE_ANALYSIS_NAV).map((calc, idx) => (
                                <Link
                                    key={idx}
                                    to={calc.slug}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname.includes(calc.slug.split('/').pop())
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <i className={`fas ${calc.icon} w-4 text-center ${location.pathname.includes(calc.slug.split('/').pop()) ? 'text-blue-600' : 'text-gray-400'}`}></i>
                                    {calc.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Ad */}
                    <div className="bg-gradient-to-br from-gray-50 to-slate-100 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500">
                        <i className="fas fa-ad text-2xl mb-1 text-gray-400"></i>
                        <p className="text-xs font-medium">Ad Space</p>
                        <p className="text-[10px] text-gray-400 mt-1">300×250</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
