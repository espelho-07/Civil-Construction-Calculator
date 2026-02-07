import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import { checkFavorite, toggleFavorite } from '../services/supabaseService';
import { saveCalculation } from '../services/supabaseService';

/**
 * CalculatorActions Component
 * Uses Supabase for save/favorite - works with Vercel
 */
export default function CalculatorActions({
    calculatorSlug,
    calculatorName,
    calculatorIcon = 'fa-calculator',
    category = 'General',
    inputs = {},
    outputs = {}
}) {
    const { isAuthenticated, user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?.id && calculatorSlug) {
            checkFavorite(user.id, calculatorSlug)
                .then((res) => setIsFavorite(res.isFavorite))
                .catch(() => {});
        }
    }, [isAuthenticated, user?.id, calculatorSlug]);

    const handleSave = async () => {
        if (!isAuthenticated || !user?.id) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
            return;
        }

        setIsSaving(true);
        setSaveMessage('');

        try {
            await saveCalculation(user.id, {
                calculatorSlug,
                calculatorName,
                calculatorIcon,
                inputs,
                outputs,
                isSaved: true,
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
        if (!isAuthenticated || !user?.id) {
            setShowLoginPrompt(true);
            setTimeout(() => setShowLoginPrompt(false), 3000);
            return;
        }

        try {
            const res = await toggleFavorite(user.id, {
                calculatorSlug,
                calculatorName,
                calculatorIcon,
                category,
            });
            setIsFavorite(res.isFavorite);
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    return (
        <div className="flex items-center gap-2 relative">
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
