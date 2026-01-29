import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';

export default function VerifyEmailRequiredPage() {
    const { user, resendVerification, logout } = useAuth();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const handleResend = async () => {
        setSending(true);
        setError(null);

        const result = await resendVerification();
        setSending(false);

        if (result.success) {
            setSent(true);
            setTimeout(() => setSent(false), 60000); // Hide success after 1 min
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EEF2FF] to-[#F7F9FF] flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <i className="fas fa-hard-hat text-3xl text-[#3B68FC]"></i>
                    <span className="text-2xl font-bold text-[#0A0A0A]">Civil Engineering Calculators</span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl shadow-lg p-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-envelope text-4xl text-amber-600"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Verify Your Email</h1>
                        <p className="text-[#6b7280] mb-6">
                            We've sent a verification link to{' '}
                            <strong className="text-[#0A0A0A]">{user?.email || 'your email'}</strong>.
                            Please check your inbox and click the link to verify your account.
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        {sent && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                                <i className="fas fa-check-circle"></i>
                                <span>Verification email sent! Check your inbox.</span>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left text-sm text-blue-700 mb-6">
                            <p className="font-medium mb-2">Didn't receive the email?</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-600">
                                <li>Check your spam/junk folder</li>
                                <li>Make sure your email is correct</li>
                                <li>Wait a few minutes for delivery</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleResend}
                                disabled={sending || sent}
                                className="w-full bg-[#3B68FC] hover:bg-[#2851CC] text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : sent ? (
                                    <>
                                        <i className="fas fa-check"></i>
                                        Email Sent
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-redo"></i>
                                        Resend Verification Email
                                    </>
                                )}
                            </button>

                            <Link
                                to="/"
                                className="block w-full bg-white hover:bg-gray-50 border border-[#e5e7eb] text-[#0A0A0A] font-semibold py-3 px-4 rounded-lg transition-all text-center"
                            >
                                <i className="fas fa-home mr-2"></i>
                                Continue to Home
                            </Link>

                            <button
                                onClick={logout}
                                className="w-full text-[#6b7280] hover:text-red-600 font-medium py-2 transition-colors"
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i>
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
