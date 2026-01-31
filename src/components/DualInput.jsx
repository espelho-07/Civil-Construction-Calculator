import React, { useState } from 'react';

export default function DualInput({
    label,
    value,
    onChange,
    unit,
    onUnitChange,
    units = ['Meter', 'Feet'],
    placeholder = '0',
    icon,
    theme,
    min = 0,
    step = 0.1,
    required = false
}) {
    const [isFocused, setIsFocused] = useState(false);

    // Defensive theme handling
    const borderColor = theme?.border || 'border-gray-200';
    const focusRing = theme?.focus || 'focus:border-gray-600';
    const textColor = theme?.text || 'text-gray-600';
    const bgLight = theme?.bgLight || 'bg-gray-50';

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="flex gap-2">
                {/* Numeric Input */}
                <div className="flex-1 relative">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        min={min}
                        step={step}
                        className={`
                            w-full px-4 py-2.5 border rounded-lg text-sm font-medium
                            transition-all outline-none
                            ${borderColor} ${bgLight}
                            ${isFocused ? `ring-2 ${focusRing}` : ''}
                            hover:bg-white focus:bg-white
                        `}
                    />
                    {icon && (
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${textColor} text-xs opacity-60`}>
                            {icon}
                        </span>
                    )}
                </div>

                {/* Unit Selector */}
                {units && units.length > 0 && (
                    <select
                        value={unit}
                        onChange={(e) => onUnitChange(e.target.value)}
                        className={`
                            px-3 py-2.5 border rounded-lg text-sm font-medium
                            transition-all outline-none
                            ${borderColor} ${bgLight}
                            hover:bg-white focus:bg-white
                            ${focusRing}
                        `}
                    >
                        {units.map((u) => (
                            <option key={u} value={u}>
                                {u}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}
