/**
 * Reusable dropdown/select used by calculator pages.
 * Props: options [{ value, label }], value, onChange, theme (optional)
 */
export default function CustomDropdown({ options = [], value, onChange, theme = {} }) {
    const border = theme.border || 'border-gray-200';
    const focus = theme.focus || 'focus:border-green-600';

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 bg-white ${border} border rounded-lg text-sm ${focus} outline-none focus:ring-1`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
