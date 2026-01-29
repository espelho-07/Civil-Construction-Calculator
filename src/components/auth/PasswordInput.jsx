import { useState } from 'react';

export default function PasswordInput({
    value,
    onChange,
    placeholder = 'Password',
    name = 'password',
    error = null,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white/80 border ${error ? 'border-red-400' : 'border-[#e5e7eb]'
                    } rounded-lg px-4 py-3 pr-12 text-[#0A0A0A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3B68FC]/20 focus:border-[#3B68FC] transition-all`}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0A0A0A] transition-colors p-1"
                tabIndex={-1}
            >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}
