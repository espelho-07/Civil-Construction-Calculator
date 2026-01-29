import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API request helper
    const apiRequest = useCallback(async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                credentials: 'include', // Include cookies
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            // Handle token expiry
            if (response.status === 401 && data.code === 'TOKEN_EXPIRED') {
                // Try to refresh token
                const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    // Retry original request
                    return apiRequest(endpoint, options);
                } else {
                    // Refresh failed, logout
                    setUser(null);
                    return { success: false, message: 'Session expired' };
                }
            }

            return data;
        } catch (err) {
            console.error('API Error:', err);
            return { success: false, message: 'Network error' };
        }
    }, []);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await apiRequest('/auth/me');
                if (data.success) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [apiRequest]);

    // Signup
    const signup = async (userData) => {
        setError(null);
        const data = await apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (data.success) {
            setUser(data.user);
        } else {
            setError(data.message);
        }

        return data;
    };

    // Login
    const login = async (email, password, rememberMe = false) => {
        setError(null);
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe }),
        });

        if (data.success) {
            setUser(data.user);
        } else {
            setError(data.message);
        }

        return data;
    };

    // Logout
    const logout = async () => {
        await apiRequest('/auth/logout', { method: 'POST' });
        setUser(null);
    };

    // Forgot password
    const forgotPassword = async (email) => {
        return apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    };

    // Reset password
    const resetPassword = async (token, password, confirmPassword) => {
        return apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password, confirmPassword }),
        });
    };

    // Verify email
    const verifyEmail = async (token) => {
        const data = await apiRequest('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });

        if (data.success && user) {
            setUser({ ...user, isEmailVerified: true });
        }

        return data;
    };

    // Resend verification email
    const resendVerification = async () => {
        return apiRequest('/auth/resend-verification', { method: 'POST' });
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isEmailVerified: user?.isEmailVerified || false,
        isAdmin: user?.role === 'admin',
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        clearError: () => setError(null),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
