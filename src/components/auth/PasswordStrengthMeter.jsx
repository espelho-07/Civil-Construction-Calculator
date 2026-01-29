import { useMemo } from 'react';

export default function PasswordStrengthMeter({ password }) {
    const strength = useMemo(() => {
        let score = 0;
        let feedback = [];

        if (!password) {
            return { score: 0, label: 'Enter password', color: '#9ca3af', feedback: [] };
        }

        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('At least 8 characters');

        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Add lowercase letter');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Add uppercase letter');

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Add number');

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        else feedback.push('Add special character');

        // Bonus for mixed case and numbers together
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) score += 1;

        // Penalty for common patterns
        const commonPatterns = ['123', 'abc', 'password', 'qwerty'];
        if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
            score -= 2;
            feedback.push('Avoid common patterns');
        }

        // Normalize score
        score = Math.max(0, Math.min(4, Math.floor(score / 2)));

        const levels = [
            { label: 'Very Weak', color: '#ef4444' },
            { label: 'Weak', color: '#f97316' },
            { label: 'Fair', color: '#eab308' },
            { label: 'Strong', color: '#22c55e' },
            { label: 'Very Strong', color: '#10b981' },
        ];

        return { score, ...levels[score], feedback };
    }, [password]);

    return (
        <div className="space-y-2">
            {/* Strength Bar */}
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i <= strength.score ? strength.color : '#e5e7eb',
                        }}
                    />
                ))}
            </div>

            {/* Label and Feedback */}
            <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                </span>
            </div>

            {/* Requirements */}
            {strength.feedback.length > 0 && (
                <div className="text-xs text-[#6b7280] space-y-0.5">
                    {strength.feedback.map((item, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <i className="fas fa-circle text-[4px]"></i>
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
