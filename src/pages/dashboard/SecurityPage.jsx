import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { supabase } from '../../lib/supabase';

export default function SecurityPage() {
    const { isAuthenticated, loading: authLoading, logout } = useAuth();
    const { isDarkMode } = useSettings();
    const navigate = useNavigate();

    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

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
            const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
            if (error) throw error;
            setPasswordSuccess('Password changed successfully');
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogoutAll = async () => {
        if (!window.confirm('Are you sure you want to logout from this device?')) return;
        await logout();
        navigate('/login');
    };

    return (
        <div className={`min-h-screen ${bgColor} py-8 px-4`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/dashboard"
                        className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-[#334155]' : ''} transition-colors`}
                    >
                        <i className={`fas fa-arrow-left ${textColor}`}></i>
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${textColor}`}>Security</h1>
                        <p className={subTextColor}>Manage your account security</p>
                    </div>
                </div>

                {/* Change Password */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} mb-6`}>
                    <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium ${textColor} mb-2`}>New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                                className={`w-full px-4 py-3 border rounded-lg outline-none focus:border-[#3B68FC] ${inputBg} ${borderColor}`}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${textColor} mb-2`}>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                                className={`w-full px-4 py-3 border rounded-lg outline-none focus:border-[#3B68FC] ${inputBg} ${borderColor}`}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
                        <button
                            type="submit"
                            disabled={changingPassword}
                            className="px-6 py-2.5 bg-[#3B68FC] text-white rounded-lg hover:bg-[#2a4add] disabled:opacity-50"
                        >
                            {changingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Logout All */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} mb-6`}>
                    <h2 className={`text-lg font-semibold ${textColor} mb-2`}>Logout</h2>
                    <p className={`text-sm ${subTextColor} mb-4`}>Sign out from this device.</p>
                    <button
                        onClick={handleLogoutAll}
                        className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Logout from this device
                    </button>
                </div>

                {/* Login History (placeholder - Supabase doesn't track by default) */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor}`}>
                    <h2 className={`text-lg font-semibold ${textColor} mb-2`}>Session Info</h2>
                    <p className={`text-sm ${subTextColor}`}>
                        You are currently signed in. Use the logout button above to sign out from this device.
                    </p>
                </div>
            </div>
        </div>
    );
}
