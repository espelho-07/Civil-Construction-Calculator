import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (in production, send to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo,
        });

        // In production, send to error tracking service (e.g., Sentry)
        if (import.meta.env.PROD) {
            // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#F7F9FF] p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Something went wrong</h1>
                        <p className="text-[#6b7280] mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full bg-[#3B68FC] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#2952E6] transition-colors"
                            >
                                <i className="fas fa-home mr-2"></i>
                                Go to Home
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Refresh Page
                            </button>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-48">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
