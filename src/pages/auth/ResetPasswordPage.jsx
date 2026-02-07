import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();

    const token = searchParams.get('token');
    const { user } = useAuth();
    const hasSession = !!user;

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (!token && !hasSession) {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [token, hasSession]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
        setError(null);
    };

    const validate = () => {
        const errors = {};

        if (!formData.password) {
            errors.password = 'Password is required';
        } else {
            if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
            else if (!/[a-z]/.test(formData.password)) errors.password = 'Add lowercase letter';
            else if (!/[A-Z]/.test(formData.password)) errors.password = 'Add uppercase letter';
            else if (!/[0-9]/.test(formData.password)) errors.password = 'Add a number';
            else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) errors.password = 'Add special character';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || (!token && !hasSession)) return;

        setLoading(true);
        setError(null);

        const result = await resetPassword(token, formData.password, formData.confirmPassword);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EEF2FF] to-[#F7F9FF] flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-200 rounded-full blur-[120px] opacity-30"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <i className="fas fa-hard-hat text-3xl text-[#3B68FC]"></i>
                    <span className="text-2xl font-bold text-[#0A0A0A]">Civil Engineering Calculators</span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#e5e7eb] rounded-2xl shadow-lg p-8">
                    {success ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-check text-2xl text-green-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Password Reset!</h1>
                            <p className="text-[#6b7280] mb-6">
                                Your password has been successfully reset. Redirecting to login...
                            </p>
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#3B68FC] border-t-transparent mx-auto"></div>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-key text-2xl text-purple-600"></i>
                                </div>
                                <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Reset Password</h1>
                                <p className="text-[#6b7280]">Create a new strong password for your account</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                    <i className="fas fa-exclamation-circle"></i>
                                    <span>{error}</span>
                                </div>
                            )}

                            {(token || hasSession) ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">
                                            New Password
                                        </label>
                                        <PasswordInput
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            error={formErrors.password}
                                        />
                                        <div className="mt-2">
                                            <PasswordStrengthMeter password={formData.password} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">
                                            Confirm New Password
                                        </label>
                                        <PasswordInput
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            error={formErrors.confirmPassword}
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
                                                Resetting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-lock"></i>
                                                Reset Password
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center">
                                    <Link
                                        to="/forgot-password"
                                        className="inline-flex items-center gap-2 bg-[#3B68FC] hover:bg-[#2851CC] text-white font-semibold py-3 px-6 rounded-lg transition-all"
                                    >
                                        <i className="fas fa-redo"></i>
                                        Request New Reset Link
                                    </Link>
                                </div>
                            )}

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
