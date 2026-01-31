import React, { useState, useRef, useEffect } from 'react';

export default function InfoTooltip({
    title,
    formula,
    standards,
    description,
    theme,
    icon = 'fa-circle-info'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef(null);

    // Defensive theme handling
    const bgLight = theme?.bgLight || 'bg-gray-50';
    const border = theme?.border || 'border-gray-200';
    const text = theme?.text || 'text-gray-600';
    const bg = theme?.bg || 'bg-gray-600';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={tooltipRef}>
            {/* Info Icon */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bgLight} ${text} hover:opacity-75 transition-opacity cursor-help`}
                title="Formula and standards information"
            >
                <i className={`fas ${icon} text-sm`}></i>
            </button>

            {/* Tooltip Popup */}
            {isOpen && (
                <div className={`absolute z-50 right-0 mt-2 w-80 p-4 rounded-xl border ${border} ${bgLight} shadow-2xl`}>
                    {/* Close Button */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className={`text-sm font-bold ${text}`}>{title || 'Information'}</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Description */}
                    {description && (
                        <div className="mb-3 pb-3 border-b border-gray-200">
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    )}

                    {/* Formula Section */}
                    {formula && (
                        <div className="mb-3 pb-3 border-b border-gray-200">
                            <p className={`text-xs font-semibold ${text} mb-1`}>Formula:</p>
                            <div className={`bg-white p-2 rounded border ${border} text-xs font-mono text-gray-700 overflow-x-auto`}>
                                {formula}
                            </div>
                        </div>
                    )}

                    {/* Standards Section */}
                    {standards && standards.length > 0 && (
                        <div>
                            <p className={`text-xs font-semibold ${text} mb-2`}>Applicable Standards:</p>
                            <ul className="text-xs space-y-1">
                                {standards.map((standard, idx) => (
                                    <li key={idx} className="text-gray-600 flex items-start gap-2">
                                        <span className={`${bg} text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 text-xs mt-0.5`}>
                                            {idx + 1}
                                        </span>
                                        <span className="pt-0.5">{standard}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
