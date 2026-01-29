import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const { verifyEmail } = useAuth();

    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification link is invalid or missing.');
                return;
            }

            const result = await verifyEmail(token);

            if (result.success) {
                setStatus('success');
                setMessage('Your email has been verified successfully!');
            } else {
                setStatus('error');
                setMessage(result.message || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [token, verifyEmail]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EEF2FF] to-[#F7F9FF] flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full blur-[120px] opacity-30"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <i className="fas fa-hard-hat text-3xl text-[#3B68FC]"></i>
                    <span className="text-2xl font-bold text-[#0A0A0A]">Civil Engineering Calculators</span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl shadow-lg p-8">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3B68FC] border-t-transparent mx-auto mb-4"></div>
                            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Verifying Email...</h1>
                            <p className="text-[#6b7280]">Please wait while we verify your email address.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-check-circle text-4xl text-green-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Email Verified!</h1>
                            <p className="text-[#6b7280] mb-6">{message}</p>
                            <div className="space-y-3">
                                <Link
                                    to="/"
                                    className="block w-full bg-[#3B68FC] hover:bg-[#2851CC] text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
                                >
                                    <i className="fas fa-home mr-2"></i>
                                    Go to Home
                                </Link>
                                <Link
                                    to="/login"
                                    className="block w-full bg-white hover:bg-gray-50 border border-[#e5e7eb] text-[#0A0A0A] font-semibold py-3 px-4 rounded-lg transition-all text-center"
                                >
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Login to Account
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-times-circle text-4xl text-red-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Verification Failed</h1>
                            <p className="text-[#6b7280] mb-6">{message}</p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left text-sm text-yellow-700 mb-6">
                                <p className="font-medium mb-2">What you can do:</p>
                                <ul className="list-disc list-inside space-y-1 text-yellow-600">
                                    <li>Request a new verification email from your account</li>
                                    <li>Make sure you're using the latest link</li>
                                    <li>Links expire after 24 hours</li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full bg-[#3B68FC] hover:bg-[#2851CC] text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
                                >
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Go to Login
                                </Link>
                                <Link
                                    to="/"
                                    className="block w-full bg-white hover:bg-gray-50 border border-[#e5e7eb] text-[#0A0A0A] font-semibold py-3 px-4 rounded-lg transition-all text-center"
                                >
                                    <i className="fas fa-home mr-2"></i>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
