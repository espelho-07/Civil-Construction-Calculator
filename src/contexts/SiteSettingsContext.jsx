import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSiteSettings } from '../services/supabaseService';

const SiteSettingsContext = createContext(null);

const defaults = {
    hero_title: 'Civil Engineering Calculators',
    hero_tagline: 'Estimate Cement, Concrete, Bricks, Steel, and more with accuracy.',
    announcement: '',
    footer_tagline: 'Built for engineers and contractors.',
    featured_calculators: ['cement-concrete', 'brick-masonry', 'steel-weight', 'construction-cost'],
};

export function SiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState(defaults);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const data = await getSiteSettings();
            setSettings((prev) => ({
                ...defaults,
                ...prev,
                ...data,
                hero_title: data.hero_title ?? prev.hero_title ?? defaults.hero_title,
                hero_tagline: data.hero_tagline ?? prev.hero_tagline ?? defaults.hero_tagline,
                announcement: data.announcement ?? prev.announcement ?? defaults.announcement,
                footer_tagline: data.footer_tagline ?? prev.footer_tagline ?? defaults.footer_tagline,
                featured_calculators: Array.isArray(data.featured_calculators)
                    ? data.featured_calculators
                    : (prev.featured_calculators ?? defaults.featured_calculators),
            }));
        } catch {
            setSettings((prev) => prev);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const ctx = useContext(SiteSettingsContext);
    return ctx || { settings: defaults, loading: false, refresh: () => {} };
}
