import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import api from '../services/api';

export default function EditProfilePage() {
    const { user, updateProfile } = useAuth();
    const { isDarkMode } = useSettings();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        profession: '',
        company: '',
        location: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load profile data
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get('/dashboard/profile');
                const profile = response.data.profile || {};
                setFormData({
                    fullName: user?.fullName || user?.name || '',
                    phone: user?.phone || '',
                    profession: profile.profession || '',
                    company: profile.company || '',
                    location: profile.location || '',
                    bio: profile.bio || ''
                });
            } catch (err) {
                // If no profile exists, just use user data
                setFormData({
                    fullName: user?.fullName || user?.name || '',
                    phone: user?.phone || '',
                    profession: '',
                    company: '',
                    location: '',
                    bio: ''
                });
            }
            setLoading(false);
        };
        loadProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/dashboard/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Update local auth state so header/profile show new name/phone
            const updatedUser = response.data?.user || {};
            updateProfile({
                fullName: formData.fullName ?? updatedUser.fullName ?? user?.fullName,
                phone: formData.phone ?? updatedUser.phone ?? user?.phone,
            });

            // Redirect after 2 seconds
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to update profile';
            setMessage({ type: 'error', text: msg });
        } finally {
            setSaving(false);
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        const name = formData.fullName || 'U';
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    // Get avatar color based on name
    const getAvatarColor = () => {
        if (!formData.fullName) return '#3B68FC';
        const colors = ['#3B68FC', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
        const index = formData.fullName.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const bgClass = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F7F9FF]';
    const cardClass = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const textClass = isDarkMode ? 'text-white' : 'text-[#0A0A0A]';
    const subTextClass = isDarkMode ? 'text-[#94a3b8]' : 'text-[#6b7280]';
    const inputClass = isDarkMode
        ? 'bg-[#0f172a] border-[#334155] text-white placeholder-[#64748b]'
        : 'bg-white border-[#e5e7eb] text-[#0A0A0A] placeholder-[#9ca3af]';

    if (loading) {
        return (
            <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className={`mt-4 ${subTextClass}`}>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgClass} py-8`}>
            <div className="max-w-2xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/dashboard"
                        className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-[#334155]' : ''} transition-colors`}
                    >
                        <i className={`fas fa-arrow-left ${textClass}`}></i>
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${textClass}`}>Edit Profile</h1>
                        <p className={subTextClass}>Update your personal information</p>
                    </div>
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

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className={`${cardClass} rounded-2xl p-6 border text-center`}>
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
                            style={{ backgroundColor: getAvatarColor() }}
                        >
                            {getUserInitials()}
                        </div>
                        <p className={`text-sm ${subTextClass}`}>Profile avatar is generated from your name</p>
                    </div>

                    {/* Personal Info */}
                    <div className={`${cardClass} rounded-2xl p-6 border`}>
                        <h3 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
                            <i className="fas fa-user text-[#3B68FC]"></i>
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${textClass} mb-2`}>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${textClass} mb-2`}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className={`${cardClass} rounded-2xl p-6 border`}>
                        <h3 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
                            <i className="fas fa-briefcase text-[#10B981]"></i>
                            Professional Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={`block text-sm font-medium ${textClass} mb-2`}>Profession</label>
                                <input
                                    type="text"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                    placeholder="Civil Engineer, Architect, etc."
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${textClass} mb-2`}>Company/Organization</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                    placeholder="Your company name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 ${inputClass}`}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className={`${cardClass} rounded-2xl p-6 border`}>
                        <h3 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
                            <i className="fas fa-info-circle text-[#F59E0B]"></i>
                            About You
                        </h3>

                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 resize-none ${inputClass}`}
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Link
                            to="/dashboard"
                            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors ${isDarkMode ? 'border-[#475569] text-white hover:bg-[#334155]' : 'border-[#e5e7eb] hover:bg-gray-50'}`}
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-gradient-to-r from-[#3B68FC] to-[#6366F1] text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#3B68FC]/20"
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
                </form>
            </div>
        </div>
    );
}
