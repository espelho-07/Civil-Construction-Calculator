import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ options, value, onChange, placeholder, icon, theme }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    // Derived theme classes (defensive fallback)
    // Note: theme object is expected to be passed from parent (e.g., getThemeClasses('zinc'))
    // If not, we default to zinc-like grays.
    const activeBg = theme ? theme.bg : 'bg-zinc-600';
    const activeText = 'text-white';
    const hoverBg = 'hover:bg-zinc-50';
    const borderColor = 'border-[#e5e7eb]';
    const focusRing = theme ? `focus:ring-zinc-100/50` : 'focus:ring-zinc-100/50';

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 border ${borderColor} rounded-xl bg-[#F9FAFB] hover:bg-white transition-all text-sm font-medium text-gray-700 outline-none focus:ring-2 ${focusRing} ${theme ? theme.focus : ''}`}
            >
                <div className="flex items-center gap-2">
                    {icon && <i className={`fas ${icon} text-gray-400`}></i>}
                    <span>{selectedOption ? selectedOption.label : placeholder || 'Select...'}</span>
                </div>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-hidden">
                    <ul className="py-1">
                        {options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                                        ${isSelected ? `${activeBg} ${activeText}` : `text-gray-700 ${hoverBg}`}
                                    `}
                                >
                                    <span className="flex items-center gap-2">
                                        {option.icon && <span className="mr-1">{option.icon}</span>}
                                        {option.label}
                                    </span>
                                    {isSelected && <i className="fas fa-check text-xs"></i>}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
