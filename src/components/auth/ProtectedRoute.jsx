import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Protected Route - requires authentication
export function ProtectedRoute({ children, requireVerified = false, requireAdmin = false }) {
    const { isAuthenticated, isEmailVerified, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3B68FC] border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireVerified && !isEmailVerified) {
        return <Navigate to="/verify-email-required" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

// Guest Route - only accessible when not logged in
export function GuestRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3B68FC] border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to the page they came from, or home
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    return children;
}

export default ProtectedRoute;
