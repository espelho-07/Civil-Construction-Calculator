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
            <div className="p-8">
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    Loading site settings...
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl">
            <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
            <p className="text-slate-400 mb-6">
                Edit content that all users see on the main site. Changes apply immediately.
            </p>

            {message.text && (
                <div
                    className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                >
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
                    <span>{message.text}</span>
                </div>
            )}

            <div className="space-y-6">
                {EDITABLE_KEYS.map(({ key, label, type, placeholder }) => (
                    <div key={key} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                        {type === 'textarea' ? (
                            <textarea
                                value={typeof getValue(key) === 'string' ? getValue(key) : ''}
                                onChange={(e) => setValue(key, e.target.value)}
                                placeholder={placeholder}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                            />
                        ) : (
                            <input
                                type="text"
                                value={typeof getValue(key) === 'string' ? getValue(key) : ''}
                                onChange={(e) => setValue(key, e.target.value)}
                                placeholder={placeholder}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                            />
                        )}
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => handleSave(key)}
                                disabled={saving === key}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                            >
                                {saving === key ? (
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-spinner fa-spin" /> Saving...
                                    </span>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
