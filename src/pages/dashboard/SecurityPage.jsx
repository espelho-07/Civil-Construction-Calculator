import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import api from '../../services/api';

export default function SecurityPage() {
    const { isAuthenticated, loading: authLoading, logout } = useAuth();
    const { isDarkMode } = useSettings();
    const navigate = useNavigate();

    const [loginHistory, setLoginHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Theme classes
    const bgColor = isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-blue-50 via-white to-pink-50';
    const cardBg = isDarkMode ? 'bg-[#1e293b]' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = isDarkMode ? 'border-[#334155]' : 'border-gray-200';
    const inputBg = isDarkMode ? 'bg-[#0f172a]' : 'bg-white';

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        fetchLoginHistory();
    }, [isAuthenticated]);

    const fetchLoginHistory = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get('/dashboard/login-history');
            setLoginHistory(response.data.history || []);
        } catch (err) {
            console.error('Failed to load login history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }

        setChangingPassword(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogoutAll = async () => {
        if (!window.confirm('Are you sure you want to logout from all devices?')) return;
        try {
            await api.post('/auth/logout-all');
            logout();
            navigate('/login');
        } catch (err) {
            console.error('Failed to logout:', err);
            alert('Failed to logout from all devices');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDeviceIcon = (device) => {
        if (device?.toLowerCase().includes('mobile')) return 'fa-mobile-alt';
        if (device?.toLowerCase().includes('tablet')) return 'fa-tablet-alt';
        return 'fa-desktop';
    };

    if (authLoading || loading) {
        return (
            <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin"></div>
                    <p className={subTextColor}>Loading security settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgColor} py-8 px-4`}>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/dashboard" className={`${subTextColor} hover:text-[#3B68FC]`}>
                            <i className="fas fa-arrow-left"></i> Dashboard
                        </Link>
                    </div>
                    <h1 className={`text-2xl font-bold ${textColor}`}>Security Settings</h1>
                    <p className={subTextColor}>Manage your account security and login sessions</p>
                </div>

                <div className="space-y-6">

                    {/* Change Password */}
                    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>
                            <i className="fas fa-key mr-2 text-[#3B68FC]"></i>
                            Change Password
                        </h2>

                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                            {passwordError && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div>
                                <label className={`block text-sm font-medium ${subTextColor} mb-1`}>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${subTextColor} mb-1`}>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${subTextColor} mb-1`}>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="px-6 py-2 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add] disabled:opacity-50"
                            >
                                {changingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>

                    {/* Session Management */}
                    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>
                            <i className="fas fa-shield-alt mr-2 text-green-500"></i>
                            Session Management
                        </h2>

                        <p className={`${subTextColor} mb-4`}>
                            If you suspect unauthorized access to your account, you can logout from all devices.
                        </p>

                        <button
                            onClick={handleLogoutAll}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Logout from All Devices
                        </button>
                    </div>

                    {/* Login History */}
                    <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>
                            <i className="fas fa-history mr-2 text-orange-500"></i>
                            Login History
                        </h2>

                        {loginHistory.length === 0 ? (
                            <p className={subTextColor}>No login history available</p>
                        ) : (
                            <div className="space-y-3">
                                {loginHistory.map((log) => (
                                    <div
                                        key={log.id}
                                        className={`flex items-center gap-4 p-4 rounded-lg border ${borderColor}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${log.status === 'SUCCESS'
                                            ? (isDarkMode ? 'bg-green-900/30' : 'bg-green-100')
                                            : (isDarkMode ? 'bg-red-900/30' : 'bg-red-100')
                                            }`}>
                                            <i className={`fas ${getDeviceIcon(log.device)} ${log.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'
                                                }`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className={`font-medium ${textColor}`}>
                                                    {log.browser || 'Unknown Browser'} on {log.os || 'Unknown OS'}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${log.status === 'SUCCESS'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${subTextColor}`}>
                                                {formatDate(log.createdAt)}
                                                {log.ipAddress && ` • ${log.ipAddress}`}
                                                {log.location && ` • ${log.location}`}
                                            </p>
                                            {log.failReason && (
                                                <p className="text-xs text-red-500">{log.failReason}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Danger Zone */}
                    <div className={`${cardBg} p-6 rounded-xl border-2 border-red-200`}>
                        <h2 className={`text-lg font-semibold text-red-500 mb-4`}>
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            Danger Zone
                        </h2>

                        <p className={`${subTextColor} mb-4`}>
                            Once you deactivate your account, all your data will be permanently deleted. This action cannot be undone.
                        </p>

                        <button
                            onClick={() => alert('Account deactivation coming soon. Please contact support.')}
                            className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                        >
                            Deactivate Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
