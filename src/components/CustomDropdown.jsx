import { forwardRef } from 'react';

/**
 * Reusable dropdown/select used by calculator pages.
 * Props: options [{ value, label }], value, onChange, theme (optional), id (optional)
 */
const CustomDropdown = forwardRef(function CustomDropdown({ options = [], value, onChange, theme = {}, id }, ref) {
    const border = theme.border || 'border-gray-200';
    const focus = theme.focus || 'focus:border-green-600';

    return (
        <select
            ref={ref}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 bg-white ${border} border rounded-lg text-sm ${focus} outline-none focus-visible:ring-2 focus-visible:ring-[#3B68FC] focus-visible:ring-offset-1`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
});

export default CustomDropdown;
