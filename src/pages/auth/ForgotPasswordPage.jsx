import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError(null);

        const result = await forgotPassword(email);
        setLoading(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EEF2FF] to-[#F7F9FF] flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200 rounded-full blur-[120px] opacity-30"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <i className="fas fa-hard-hat text-3xl text-[#3B68FC]"></i>
                    <span className="text-2xl font-bold text-[#0A0A0A]">Civil Engineering Calculators</span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl shadow-lg p-8">
                    {submitted ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-envelope-open-text text-2xl text-green-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Check Your Email</h1>
                            <p className="text-[#6b7280] mb-6">
                                If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                            </p>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left text-sm text-blue-700 mb-6">
                                <p className="font-medium mb-2">Didn't receive the email?</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-600">
                                    <li>Check your spam folder</li>
                                    <li>Make sure you entered the correct email</li>
                                    <li>Wait a few minutes and try again</li>
                                </ul>
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[#3B68FC] hover:underline font-medium"
                            >
                                <i className="fas fa-arrow-left"></i>
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-lock text-2xl text-orange-600"></i>
                                </div>
                                <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Forgot Password?</h1>
                                <p className="text-[#6b7280]">
                                    No worries! Enter your email and we'll send you reset instructions.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                    <i className="fas fa-exclamation-circle"></i>
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-white/80 border border-[#e5e7eb] rounded-lg px-4 py-3 text-[#0A0A0A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3B68FC]/20 focus:border-[#3B68FC] transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#3B68FC] hover:bg-[#2851CC] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-6">
                                <Link
                                    to="/login"
                                    className="text-sm text-[#6b7280] hover:text-[#3B68FC] transition-colors"
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
