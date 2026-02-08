import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { getProfile } from '../../services/supabaseService';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'darpantrader1727@gmail.com';
const AUTH_TIMEOUT = 15000; // 15 second timeout for auth operations

// Utility function to add timeout to promises
const withTimeout = (promise, timeoutMs = AUTH_TIMEOUT) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

function mapSupabaseUser(supabaseUser, profile = null) {
    if (!supabaseUser) return null;
    const meta = supabaseUser.user_metadata || {};
    const role = profile?.role === 'admin' || supabaseUser.email === ADMIN_EMAIL ? 'admin' : (profile?.role || 'user');
    return {
        id: supabaseUser.id,
        fullName: profile?.full_name || meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User',
        name: profile?.full_name || meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email,
        phone: profile?.phone || null,
        role,
        isEmailVerified: !!supabaseUser.email_confirmed_at,
        createdAt: supabaseUser.created_at,
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserWithProfile = useCallback(async (supabaseUser) => {
        if (!supabaseUser) return null;
        try {
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();
            
            const { data: profile } = await withTimeout(profilePromise, 10000);
            return mapSupabaseUser(supabaseUser, profile);
        } catch (err) {
            console.warn('Could not fetch profile, using basic user data:', err);
            return mapSupabaseUser(supabaseUser);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                if (!supabase) {
                    console.warn('Supabase not initialized. Auth features unavailable.');
                    setUser(null);
                    setLoading(false);
                    return;
                }
                const sessionPromise = supabase.auth.getSession();
                const { data: { session } } = await withTimeout(sessionPromise);
                
                if (session?.user) {
                    const mapped = await fetchUserWithProfile(session.user);
                    setUser(mapped);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth init error:', err);
                setError(err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        init();

        if (!supabase) {
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const mapped = await fetchUserWithProfile(session.user);
                setUser(mapped);
            } else {
                setUser(null);
            }
        });

        return () => subscription?.unsubscribe();
    }, [fetchUserWithProfile]);

    const signup = async (userData) => {
        setError(null);
        try {
            if (!supabase) {
                throw new Error('Supabase not configured. Please add credentials to .env');
            }
            const { fullName, email, password, phone } = userData;
            const signUpPromise = supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone || null,
                    },
                },
            });
            const { data, error: signUpError } = await withTimeout(signUpPromise);

            if (signUpError) {
                setError(signUpError.message);
                return { success: false, message: signUpError.message };
            }

            if (data.user) {
                setUser(await fetchUserWithProfile(data.user));
                return {
                    success: true,
                    message: data.user.identities?.length === 0
                        ? 'Email already registered'
                        : 'Account created. Please verify your email.',
                };
            }
            return { success: false, message: 'Signup failed' };
        } catch (err) {
            const message = err.message || 'Signup failed';
            setError(message);
            return { success: false, message };
        }
    };

    const login = async (email, password, rememberMe = false) => {
        setError(null);
        try {
            if (!supabase) {
                throw new Error('Supabase not configured. Please add credentials to .env');
            }
            const signInPromise = supabase.auth.signInWithPassword({ email, password });
            const { data, error: signInError } = await withTimeout(signInPromise);

            if (signInError) {
                const message = signInError.message === 'Invalid login credentials'
                    ? 'Invalid email or password'
                    : signInError.message;
                setError(message);
                return {
                    success: false,
                    message,
                };
            }

            if (data.user) {
                setUser(await fetchUserWithProfile(data.user));
                return { success: true, user: mapSupabaseUser(data.user) };
            }
            return { success: false, message: 'Login failed' };
        } catch (err) {
            const message = err.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    const forgotPassword = async (email) => {
        setError(null);
        try {
            if (!supabase) {
                throw new Error('Supabase not configured. Please add credentials to .env');
            }
            const resetPromise = supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            const { error: resetError } = await withTimeout(resetPromise);
            
            if (resetError) {
                return { success: false, message: resetError.message };
            }
            return {
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            };
        } catch (err) {
            const message = err.message || 'Password reset request failed';
            return { success: false, message };
        }
    };

    const resetPassword = async (token, password, confirmPassword) => {
        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }
        try {
            if (!supabase) {
                throw new Error('Supabase not configured. Please add credentials to .env');
            }
            const updatePromise = supabase.auth.updateUser({ password });
            const { error: updateError } = await withTimeout(updatePromise);
            
            if (updateError) {
                return { success: false, message: updateError.message };
            }
            return { success: true, message: 'Password reset successfully' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const verifyEmail = async (token) => {
        try {
            if (!supabase) {
                throw new Error('Supabase not configured. Please add credentials to .env');
            }
            const verifyPromise = supabase.auth.verifyOtp({
                token_hash: token,
                type: 'email',
            });
            const { data: { user: u }, error: verifyError } = await withTimeout(verifyPromise);
            
            if (verifyError) {
                return { success: false, message: verifyError.message };
            }
            if (u) setUser(await fetchUserWithProfile(u));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const resendVerification = async () => {
        try {
            if (!supabase) {
                throw new Error('Supabase not configured. Please add credentials to .env');
            }
            const resendPromise = supabase.auth.resend({
                type: 'signup',
            });
            const { error: resendError } = await withTimeout(resendPromise);
            
            if (resendError) {
                return { success: false, message: resendError.message };
            }
            return { success: true, message: 'Verification email sent' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const updateProfile = useCallback((updatedUser) => {
        setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
    }, []);

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isEmailVerified: user?.isEmailVerified || false,
        isAdmin: user?.role === 'admin' || user?.email === ADMIN_EMAIL,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        updateProfile,
        clearError: () => setError(null),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
