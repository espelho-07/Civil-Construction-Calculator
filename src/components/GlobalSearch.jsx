import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_CALCULATORS } from '../constants/calculatorRoutes';

export default function GlobalSearch() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    // Filter logic
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

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className="relative">
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4">
                <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Search all calculators..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchResults(e.target.value.length > 0);
                        }}
                        onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((calc, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSearchSelect(calc.slug)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <i className={`fas ${calc.icon} w-5 text-center text-blue-500`}></i>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{calc.name}</p>
                                <p className="text-xs text-gray-400">{calc.category}</p>
                            </div>
                            <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {showSearchResults && searchQuery.length > 0 && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4 text-center">
                    <i className="fas fa-search text-gray-300 text-2xl mb-2"></i>
                    <p className="text-sm text-gray-500">No calculators found</p>
                </div>
            )}
        </div>
    );
}
