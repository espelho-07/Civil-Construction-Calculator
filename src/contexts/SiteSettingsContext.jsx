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
    const [error, setError] = useState(null);

    // Fetch settings with timeout
    useEffect(() => {
        let isMounted = true;
        let timeoutId;

        const fetchSettings = async () => {
            try {
                setError(null);
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        setError('Settings took too long to load');
                        setLoading(false);
                    }
                }, 10000); // 10 second timeout

                const data = await getSiteSettings();
                
                if (!isMounted) return;
                
                clearTimeout(timeoutId);
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
            } catch (err) {
                if (isMounted) {
                    console.error('SiteSettings fetch error:', err);
                    setError(err.message || 'Failed to load settings');
                }
            } finally {
                if (isMounted) {
                    clearTimeout(timeoutId);
                    setLoading(false);
                }
            }
        };

        fetchSettings();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    const refresh = useCallback(async () => {
        try {
            setError(null);
            const data = await getSiteSettings();
            setSettings((prev) => ({
                ...defaults,
                ...prev,
                ...data,
            }));
        } catch (err) {
            console.error('Settings refresh error:', err);
            setError(err.message || 'Failed to refresh settings');
        }
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, error, refresh }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const ctx = useContext(SiteSettingsContext);
    return ctx || { settings: defaults, loading: false, error: null, refresh: () => {} };
}
