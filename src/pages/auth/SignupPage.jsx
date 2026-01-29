import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
        clearError();
    };

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        else if (formData.name.length < 2) errors.name = 'Name must be at least 2 characters';

        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';

        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the terms';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await signup({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        });
        setLoading(false);

        if (result.success) {
            navigate('/verify-email-required', { state: { email: formData.email } });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #e6f0ff 0%, #fff9e6 50%, #ffe6f0 100%)' }}>
            {/* Animated gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-20 top-1/4 w-[500px] h-[500px] rounded-full opacity-40"
                    style={{ background: 'radial-gradient(circle, rgba(59,104,252,0.3) 0%, transparent 70%)' }}></div>
                <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full opacity-50"
                    style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)' }}></div>
                <div className="absolute right-1/4 bottom-0 w-[400px] h-[400px] rounded-full opacity-30"
                    style={{ background: 'radial-gradient(circle, rgba(255,182,193,0.4) 0%, transparent 70%)' }}></div>
            </div>

            <div className="relative w-full max-w-md z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <i className="fas fa-hard-hat text-2xl text-[#3B68FC]"></i>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-[#0A0A0A]">Civil Engineering</span>
                        <span className="text-2xl font-bold text-[#3B68FC] block -mt-1">Calculators</span>
                    </div>
                </Link>

                {/* Signup Card */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i className="fas fa-user-plus text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Create Account</h1>
                        <p className="text-[#6b7280]">Join thousands of civil engineers</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                                <i className="fas fa-user mr-2 text-[#3B68FC]"></i>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`w-full bg-white border-2 ${formErrors.name ? 'border-red-400' : 'border-[#e5e7eb]'
                                    } rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#3B68FC]/10 focus:border-[#3B68FC] transition-all`}
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                                <i className="fas fa-envelope mr-2 text-[#3B68FC]"></i>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className={`w-full bg-white border-2 ${formErrors.email ? 'border-red-400' : 'border-[#e5e7eb]'
                                    } rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#3B68FC]/10 focus:border-[#3B68FC] transition-all`}
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                            )}
                        </div>

                        {/* Phone (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                                <i className="fas fa-phone mr-2 text-[#3B68FC]"></i>
                                Phone Number <span className="text-[#9ca3af]">(optional)</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-3.5 text-[#0A0A0A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#3B68FC]/10 focus:border-[#3B68FC] transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                                <i className="fas fa-lock mr-2 text-[#3B68FC]"></i>
                                Password
                            </label>
                            <PasswordInput
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                error={formErrors.password}
                            />
                            {formData.password && (
                                <PasswordStrengthMeter password={formData.password} />
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-2">
                                <i className="fas fa-lock mr-2 text-[#3B68FC]"></i>
                                Confirm Password
                            </label>
                            <PasswordInput
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                error={formErrors.confirmPassword}
                            />
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                id="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="w-5 h-5 mt-0.5 text-[#3B68FC] bg-white border-2 border-[#e5e7eb] rounded-md focus:ring-[#3B68FC] focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-[#6b7280] cursor-pointer">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#3B68FC] hover:underline">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy-policy" className="text-[#3B68FC] hover:underline">Privacy Policy</Link>
                            </label>
                        </div>
                        {formErrors.agreeTerms && (
                            <p className="text-red-500 text-xs">{formErrors.agreeTerms}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/30 hover:shadow-xl hover:shadow-[#10B981]/40 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-rocket"></i>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-[#6b7280] mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#3B68FC] font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#3B68FC] transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                        <i className="fas fa-arrow-left"></i>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
