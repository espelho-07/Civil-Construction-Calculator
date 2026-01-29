import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
    // Notifications
    emailNotifications: true,
    calculationReminders: false,
    weeklyNewsletter: true,
    newFeatures: true,
    // Appearance
    darkMode: false,
    compactView: false,
    // Preferences
    defaultUnit: 'metric', // 'metric' or 'imperial'
    language: 'en',
    // Display
    showTips: true,
    autoSaveCalculations: true,
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        // Load from localStorage
        const saved = localStorage.getItem('appSettings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    });

    // Apply dark mode class to document
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0f172a';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '';
        }
    }, [settings.darkMode]);

    // Apply compact view
    useEffect(() => {
        if (settings.compactView) {
            document.documentElement.classList.add('compact');
        } else {
            document.documentElement.classList.remove('compact');
        }
    }, [settings.compactView]);

    // Save to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem('appSettings');
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSetting,
            updateSettings,
            resetSettings,
            isDarkMode: settings.darkMode,
            isCompactView: settings.compactView,
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

export default SettingsContext;
