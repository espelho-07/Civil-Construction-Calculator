import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import api from '../services/api';

/**
 * CalculatorActions Component
 * 
 * Provides Save and Favorite buttons for calculator pages.
 * 
 * @param {Object} props
 * @param {string} props.calculatorSlug - URL slug of the calculator (e.g., "plaster-calculator")
 * @param {string} props.calculatorName - Display name (e.g., "Plaster Calculator")
 * @param {string} props.calculatorIcon - FontAwesome icon class (e.g., "fa-paint-roller")
 * @param {string} props.category - Category name (e.g., "Quantity Estimator")
 * @param {Object} props.inputs - Current calculator inputs (to be saved)
 * @param {Object} props.outputs - Current calculator results (to be saved)
 */
export default function CalculatorActions({
    calculatorSlug,
    calculatorName,
    calculatorIcon = 'fa-calculator',
    category = 'General',
    inputs = {},
    outputs = {}
}) {
    const { isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Check if calculator is favorited on mount
    useEffect(() => {
        if (isAuthenticated && calculatorSlug) {
            checkFavoriteStatus();
        }
    }, [isAuthenticated, calculatorSlug]);

    const checkFavoriteStatus = async () => {
        try {
            const response = await api.get(`/favorites/check/${calculatorSlug}`);
            setIsFavorite(response.data.isFavorite);
        } catch (err) {
            console.error('Failed to check favorite status:', err);
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
            return;
        }

        setIsSaving(true);
        setSaveMessage('');

        try {
            await api.post('/calculations', {
                calculatorSlug,
                calculatorName,
                calculatorIcon,
                inputs,
                outputs,
                isSaved: true
            });
            setSaveMessage('✓ Saved!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            console.error('Failed to save calculation:', err);
            setSaveMessage('Failed to save');
            setTimeout(() => setSaveMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
            return;
        }

        try {
            const response = await api.post('/favorites/toggle', {
                calculatorSlug,
                calculatorName,
                calculatorIcon,
                category
            });
            setIsFavorite(response.data.isFavorite);
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    return (
        <div className="flex items-center gap-2 relative">
            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${saveMessage
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    } disabled:opacity-50`}
                title="Save calculation"
            >
                <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                <span className="text-sm font-medium">{saveMessage || 'Save'}</span>
            </button>

            {/* Favorite Button */}
            <button
                onClick={handleToggleFavorite}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${isFavorite
                        ? 'bg-yellow-50 border-yellow-300 text-yellow-500'
                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-yellow-500'
                    }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <i className={`fas fa-star ${isFavorite ? '' : 'opacity-60'}`}></i>
            </button>

            {/* Login Prompt */}
            {showLoginPrompt && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-lock"></i>
                        <span>Please <a href="/login" className="text-blue-400 underline">login</a> to save</span>
                    </div>
                </div>
            )}
        </div>
    );
}
