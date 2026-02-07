import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import PasswordInput from '../../components/auth/PasswordInput';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const from = location.state?.from?.pathname || '/';

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
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
        if (!formData.password) errors.password = 'Password is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await login(formData.email, formData.password, formData.rememberMe);
        setLoading(false);

        if (result.success) {
            const isAdmin = formData.email.toLowerCase() === 'darpantrader1727@gmail.com';
            navigate(isAdmin ? '/admin' : from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
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

                {/* Login Card */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#3B68FC] to-[#6366F1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i className="fas fa-user text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Welcome Back!</h1>
                        <p className="text-[#6b7280]">Sign in to continue to your account</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-[#374151]">
                                    <i className="fas fa-lock mr-2 text-[#3B68FC]"></i>
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-sm text-[#3B68FC] hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <PasswordInput
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={formErrors.password}
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#3B68FC] bg-white border-2 border-[#e5e7eb] rounded-md focus:ring-[#3B68FC] focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="ml-3 text-sm text-[#6b7280] cursor-pointer">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#3B68FC] to-[#6366F1] hover:from-[#2a4add] hover:to-[#4F46E5] text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3B68FC]/30 hover:shadow-xl hover:shadow-[#3B68FC]/40 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-[#e5e7eb]"></div>
                        <span className="px-4 text-sm text-[#6b7280]">or continue with</span>
                        <div className="flex-1 border-t border-[#e5e7eb]"></div>
                    </div>

                    {/* Social Login (placeholder) */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button className="flex items-center justify-center gap-2 py-3 border-2 border-[#e5e7eb] rounded-xl hover:bg-[#f8f9fa] transition-colors font-medium text-[#374151]">
                            <i className="fab fa-google text-[#DB4437]"></i>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border-2 border-[#e5e7eb] rounded-xl hover:bg-[#f8f9fa] transition-colors font-medium text-[#374151]">
                            <i className="fab fa-github text-[#333]"></i>
                            GitHub
                        </button>
                    </div>

                    {/* Signup Link */}
                    <p className="text-center text-[#6b7280]">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#3B68FC] font-semibold hover:underline">
                            Create account
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
