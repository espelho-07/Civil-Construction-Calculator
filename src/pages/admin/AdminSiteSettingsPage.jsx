import { useState, useEffect } from 'react';
import { getAdminSiteSettings, updateSiteSetting } from '../../services/supabaseService';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const EDITABLE_KEYS = [
    { key: 'hero_title', label: 'Hero Title', type: 'text', placeholder: 'Civil Engineering Calculators' },
    { key: 'hero_tagline', label: 'Hero Tagline', type: 'text', placeholder: 'Estimate Cement, Concrete, Bricks...' },
    { key: 'announcement', label: 'Announcement Banner', type: 'textarea', placeholder: 'Optional message for all users' },
    { key: 'footer_tagline', label: 'Footer Tagline', type: 'text', placeholder: 'Built for engineers and contractors.' },
];

export default function AdminSiteSettingsPage() {
    const { refresh } = useSiteSettings();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAdminSiteSettings();
                setRows(data || []);
            } catch (err) {
                setMessage({ type: 'error', text: err?.message || 'Failed to load settings' });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const getValue = (key) => {
        const row = rows.find((r) => r.key === key);
        if (row?.value == null) return '';
        return typeof row.value === 'string' ? row.value : String(row.value);
    };

    const setValue = (key, value) => {
        setRows((prev) => {
            const next = prev.some((r) => r.key === key)
                ? prev.map((r) => (r.key === key ? { ...r, value } : r))
                : [...prev, { key, value }];
            return next;
        });
    };

    const handleSave = async (key) => {
        const raw = getValue(key);
        const value = typeof raw === 'string' ? raw : (raw != null ? String(raw) : '');
        setSaving(key);
        setMessage({ type: '', text: '' });
        try {
            await updateSiteSetting(key, value || '');
            await refresh();
            setMessage({ type: 'success', text: 'Saved. Changes are visible to all users.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err) {
            setMessage({ type: 'error', text: err?.message || 'Failed to save' });
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-[#6b7280]">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#0A0A0A]">Site Settings</h1>
                <p className="text-[#6b7280] mt-2 flex items-center gap-2">
                    <i className="fas fa-sliders-h"></i>
                    Edit content visible to all users on the main site
                </p>
            </div>

            {message.text && (
                <div
                    className={`mb-6 px-6 py-4 rounded-2xl flex items-center gap-3 ${
                        message.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                    <i className={`fas fas-lg ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 max-w-2xl">
                {EDITABLE_KEYS.map(({ key, label, type, placeholder }) => (
                    <div key={key} className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
                        <label className="block text-sm font-semibold text-[#0A0A0A] mb-3">{label}</label>
                        {type === 'textarea' ? (
                            <textarea
                                value={typeof getValue(key) === 'string' ? getValue(key) : ''}
                                onChange={(e) => setValue(key, e.target.value)}
                                placeholder={placeholder}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-[#0A0A0A] placeholder-[#9ca3af] focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/20 outline-none resize-none transition-colors"
                            />
                        ) : (
                            <input
                                type="text"
                                value={typeof getValue(key) === 'string' ? getValue(key) : ''}
                                onChange={(e) => setValue(key, e.target.value)}
                                placeholder={placeholder}
                                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-[#0A0A0A] placeholder-[#9ca3af] focus:border-[#3B68FC] focus:ring-2 focus:ring-[#3B68FC]/20 outline-none transition-colors"
                            />
                        )}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => handleSave(key)}
                                disabled={saving === key}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#3B68FC] to-[#2a4add] hover:from-[#2a4add] hover:to-[#1f36b5] disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                            >
                                {saving === key ? (
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-spinner fa-spin" /> Saving...
                                    </span>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Security Notice */}
            <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-600"></i>
                    Information
                </h3>
                <p className="text-[#6b7280] text-justify">
                    Changes made to site settings will be immediately visible to all users. The announcement banner is displayed prominently on the homepage 
                    and can be dismissed by users. Hero title and tagline appear in the main search section. All changes are logged for audit purposes.
                </p>
            </div>
        </div>
    );
}
