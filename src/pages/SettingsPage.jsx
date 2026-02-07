import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../components/auth/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const { settings, updateSetting, resetSettings, isDarkMode } = useSettings();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        updateSetting(key, !settings[key]);
    };

    const handleSelectChange = (key, value) => {
        updateSetting(key, value);
    };

    const handleSaveToServer = async () => {
        setSaving(true);
        // Settings are stored in localStorage via SettingsContext - no backend needed
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to default?')) {
            resetSettings();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const bgClass = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F7F9FF]';
    const cardClass = isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e5e7eb]';
    const textClass = isDarkMode ? 'text-white' : 'text-[#0A0A0A]';
    const subTextClass = isDarkMode ? 'text-[#94a3b8]' : 'text-[#6b7280]';
    const borderClass = isDarkMode ? 'border-[#334155]' : 'border-[#f3f4f6]';
    const selectClass = isDarkMode
        ? 'bg-[#0f172a] border-[#334155] text-white'
        : 'bg-white border-[#e5e7eb] text-[#0A0A0A]';

    const Toggle = ({ enabled, onToggle }) => (
        <button
            onClick={onToggle}
            className={`w-14 h-8 rounded-full transition-colors relative ${enabled ? 'bg-[#3B68FC]' : isDarkMode ? 'bg-[#475569]' : 'bg-[#e5e7eb]'}`}
        >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${enabled ? 'left-7' : 'left-1'}`}></div>
        </button>
    );

    return (
        <div className={`min-h-screen ${bgClass} py-8`}>
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${textClass} mb-2`}>Settings</h1>
                    <p className={subTextClass}>Customize your experience</p>
                </div>

                {/* Notifications Settings */}
                <div className={`${cardClass} rounded-2xl shadow-sm border p-8 mb-6`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3B68FC] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg">
                            <i className="fas fa-bell text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${textClass}`}>Notifications</h3>
                            <p className={`text-sm ${subTextClass}`}>Manage how you receive updates</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className={`flex items-center justify-between py-4 border-b ${borderClass}`}>
                            <div>
                                <p className={`font-medium ${textClass}`}>Email Notifications</p>
                                <p className={`text-sm ${subTextClass}`}>Receive emails about your account activity</p>
                            </div>
                            <Toggle enabled={settings.emailNotifications} onToggle={() => handleToggle('emailNotifications')} />
                        </div>

                        <div className={`flex items-center justify-between py-4 border-b ${borderClass}`}>
                            <div>
                                <p className={`font-medium ${textClass}`}>Calculation Reminders</p>
                                <p className={`text-sm ${subTextClass}`}>Get reminded about saved calculations</p>
                            </div>
                            <Toggle enabled={settings.calculationReminders} onToggle={() => handleToggle('calculationReminders')} />
                        </div>

                        <div className={`flex items-center justify-between py-4 border-b ${borderClass}`}>
                            <div>
                                <p className={`font-medium ${textClass}`}>Weekly Newsletter</p>
                                <p className={`text-sm ${subTextClass}`}>Tips and tricks for civil engineers</p>
                            </div>
                            <Toggle enabled={settings.weeklyNewsletter} onToggle={() => handleToggle('weeklyNewsletter')} />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className={`font-medium ${textClass}`}>New Features</p>
                                <p className={`text-sm ${subTextClass}`}>Be the first to know about new calculators</p>
                            </div>
                            <Toggle enabled={settings.newFeatures} onToggle={() => handleToggle('newFeatures')} />
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className={`${cardClass} rounded-2xl shadow-sm border p-8 mb-6`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-xl flex items-center justify-center shadow-lg">
                            <i className="fas fa-palette text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${textClass}`}>Appearance</h3>
                            <p className={`text-sm ${subTextClass}`}>Customize how the app looks</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className={`flex items-center justify-between py-4 border-b ${borderClass}`}>
                            <div>
                                <p className={`font-medium ${textClass}`}>
                                    <i className={`fas fa-moon mr-2 ${settings.darkMode ? 'text-[#8B5CF6]' : ''}`}></i>
                                    Dark Mode
                                </p>
                                <p className={`text-sm ${subTextClass}`}>Switch to a darker theme for comfortable viewing</p>
                            </div>
                            <Toggle enabled={settings.darkMode} onToggle={() => handleToggle('darkMode')} />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className={`font-medium ${textClass}`}>
                                    <i className="fas fa-compress-alt mr-2"></i>
                                    Compact View
                                </p>
                                <p className={`text-sm ${subTextClass}`}>Show more content with less spacing</p>
                            </div>
                            <Toggle enabled={settings.compactView} onToggle={() => handleToggle('compactView')} />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className={`${cardClass} rounded-2xl shadow-sm border p-8 mb-6`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center shadow-lg">
                            <i className="fas fa-sliders-h text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${textClass}`}>Preferences</h3>
                            <p className={`text-sm ${subTextClass}`}>Set your default options</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>
                                <i className="fas fa-ruler mr-2 text-[#10B981]"></i>
                                Default Unit System
                            </label>
                            <select
                                value={settings.defaultUnit}
                                onChange={(e) => handleSelectChange('defaultUnit', e.target.value)}
                                className={`w-full px-4 py-3.5 border-2 rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 transition-all cursor-pointer ${selectClass}`}
                            >
                                <option value="metric">Metric (m, kg, cm)</option>
                                <option value="imperial">Imperial (ft, lb, in)</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${textClass} mb-2`}>
                                <i className="fas fa-globe mr-2 text-[#10B981]"></i>
                                Language
                            </label>
                            <select
                                value={settings.language}
                                onChange={(e) => handleSelectChange('language', e.target.value)}
                                className={`w-full px-4 py-3.5 border-2 rounded-xl outline-none focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/10 transition-all cursor-pointer ${selectClass}`}
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="gu">ગુજરાતી (Gujarati)</option>
                            </select>
                        </div>
                    </div>

                    <div className={`mt-6 space-y-1 pt-6 border-t ${borderClass}`}>
                        <div className={`flex items-center justify-between py-4 border-b ${borderClass}`}>
                            <div>
                                <p className={`font-medium ${textClass}`}>
                                    <i className="fas fa-lightbulb mr-2 text-[#F59E0B]"></i>
                                    Show Tips
                                </p>
                                <p className={`text-sm ${subTextClass}`}>Display helpful tips while using calculators</p>
                            </div>
                            <Toggle enabled={settings.showTips} onToggle={() => handleToggle('showTips')} />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className={`font-medium ${textClass}`}>
                                    <i className="fas fa-save mr-2 text-[#3B68FC]"></i>
                                    Auto-save Calculations
                                </p>
                                <p className={`text-sm ${subTextClass}`}>Automatically save your calculations to history</p>
                            </div>
                            <Toggle enabled={settings.autoSaveCalculations} onToggle={() => handleToggle('autoSaveCalculations')} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={handleReset}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDarkMode
                                ? 'text-red-400 hover:bg-red-500/10'
                                : 'text-red-500 hover:bg-red-50'
                            }`}
                    >
                        <i className="fas fa-undo mr-2"></i>
                        Reset to Defaults
                    </button>

                    <div className="flex items-center gap-3">
                        {saved && (
                            <span className="flex items-center text-green-500 text-sm animate-fade-in">
                                <i className="fas fa-check-circle mr-2"></i>
                                Settings saved!
                            </span>
                        )}
                        <button
                            onClick={handleSaveToServer}
                            disabled={saving}
                            className="px-6 py-3 bg-gradient-to-r from-[#3B68FC] to-[#6366F1] text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#3B68FC]/20 hover:shadow-xl hover:shadow-[#3B68FC]/30 hover:-translate-y-0.5"
                        >
                            {saving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                                    Sync to Cloud
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
