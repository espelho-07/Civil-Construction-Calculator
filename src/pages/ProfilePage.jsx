import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { updateProfile } from '../services/supabaseService';

export default function ProfilePage() {
    const { user, updateProfile: updateAuthProfile } = useAuth();
    const { isDarkMode } = useSettings();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const displayName = user?.fullName || user?.name || '';

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.fullName || user.name || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!displayName) return 'U';
        const names = displayName.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    // Get avatar color based on name
    const getAvatarColor = () => {
        if (!displayName) return '#3B68FC';
        const colors = ['#3B68FC', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
        const index = displayName.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile(user.id, { name: formData.name, phone: formData.phone });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            updateAuthProfile({ fullName: formData.name, name: formData.name, phone: formData.phone });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        }

        setSaving(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const bgClass = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F7F9FF]';
    const cardClass = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const textClass = isDarkMode ? 'text-white' : 'text-[#0A0A0A]';
    const subTextClass = isDarkMode ? 'text-[#94a3b8]' : 'text-[#6b7280]';
    const inputClass = isDarkMode
        ? 'bg-[#0f172a] border-[#334155] text-white'
        : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#0A0A0A]';

    return (
        <div className={`min-h-screen ${bgClass} py-8`}>
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>My Profile</h1>
                    <p className={subTextClass}>Manage your account information</p>
                </div>

                {/* Success/Error Message */}
                {message.text && (
                    <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-600'
                            : 'bg-red-50 border border-red-200 text-red-600'
                        }`}>
                        <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Profile Card */}
                <div className={`${cardClass} rounded-2xl shadow-sm border overflow-hidden`}>
                    {/* Cover Image */}
                    <div className="h-32 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #3B68FC 0%, #8B5CF6 50%, #EC4899 100%)' }}>
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
                            <div className="absolute bottom-4 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                        </div>
                    </div>

                    {/* Avatar and Name */}
                    <div className="px-8 pb-8 -mt-16">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div
                                className="w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-xl"
                                style={{ backgroundColor: getAvatarColor() }}
                            >
                                {getUserInitials()}
                            </div>
                            <div className="flex-1">
                                <h2 className={`text-2xl font-bold ${textClass}`}>{displayName}</h2>
                                <p className={subTextClass}>{user?.email}</p>
                                {user?.isEmailVerified && (
                                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        <i className="fas fa-check-circle"></i>
                                        Email Verified
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-5 py-2.5 ${isDarkMode ? 'bg-[#334155] hover:bg-[#475569]' : 'bg-[#f8f9fa] hover:bg-[#f0f1f3]'} border ${isDarkMode ? 'border-[#475569]' : 'border-[#e5e7eb]'} rounded-xl text-sm font-medium transition-colors ${textClass}`}
                            >
                                <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className={`mt-6 ${cardClass} rounded-2xl shadow-sm border p-8`}>
                    <h3 className={`text-lg font-semibold ${textClass} mb-6 flex items-center gap-2`}>
                        <i className="fas fa-user-circle text-[#3B68FC]"></i>
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                />
                            ) : (
                                <p className={`px-4 py-3 rounded-xl ${inputClass}`}>{displayName}</p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>Email Address</label>
                            <p className={`px-4 py-3 rounded-xl ${inputClass}`}>
                                {user?.email}
                                <span className="text-xs ml-2 text-[#9ca3af]">(Cannot be changed)</span>
                            </p>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Enter phone number"
                                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                />
                            ) : (
                                <p className={`px-4 py-3 rounded-xl ${inputClass}`}>
                                    {user?.phone || 'Not provided'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>Member Since</label>
                            <p className={`px-4 py-3 rounded-xl ${inputClass}`}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className={`px-6 py-2.5 border rounded-xl text-sm font-medium hover:bg-opacity-80 transition-colors ${isDarkMode ? 'border-[#475569] text-white' : 'border-[#e5e7eb]'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#3B68FC] to-[#6366F1] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#3B68FC]/20"
                            >
                                {saving ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/saved" className={`${cardClass} rounded-xl p-6 border hover:shadow-md transition-all hover:-translate-y-1`}>
                        <div className="w-12 h-12 bg-[#fef3c7] rounded-xl flex items-center justify-center mb-4">
                            <i className="fas fa-bookmark text-[#F59E0B] text-xl"></i>
                        </div>
                        <h3 className={`font-semibold ${textClass} mb-1`}>Saved Calculators</h3>
                        <p className={`text-sm ${subTextClass}`}>View your bookmarked calculators</p>
                    </Link>

                    <Link to="/history" className={`${cardClass} rounded-xl p-6 border hover:shadow-md transition-all hover:-translate-y-1`}>
                        <div className="w-12 h-12 bg-[#d1fae5] rounded-xl flex items-center justify-center mb-4">
                            <i className="fas fa-history text-[#10B981] text-xl"></i>
                        </div>
                        <h3 className={`font-semibold ${textClass} mb-1`}>Calculation History</h3>
                        <p className={`text-sm ${subTextClass}`}>View past calculations</p>
                    </Link>

                    <Link to="/settings" className={`${cardClass} rounded-xl p-6 border hover:shadow-md transition-all hover:-translate-y-1`}>
                        <div className="w-12 h-12 bg-[#ede9fe] rounded-xl flex items-center justify-center mb-4">
                            <i className="fas fa-cog text-[#8B5CF6] text-xl"></i>
                        </div>
                        <h3 className={`font-semibold ${textClass} mb-1`}>Settings</h3>
                        <p className={`text-sm ${subTextClass}`}>Manage your preferences</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
