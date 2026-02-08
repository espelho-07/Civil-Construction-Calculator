import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null,
            showDetails: false,
            errorCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState(prevState => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1
        }));

        // Log error for debugging
        this.logError(error, errorInfo);

        // In production, send to error tracking service
        if (import.meta.env.PROD) {
            try {
                // Example: Could integrate with Sentry, LogRocket, etc.
                // Sentry.captureException(error, { contexts: { react: errorInfo } });
            } catch (err) {
                console.error('Error logging failed:', err);
            }
        }
    }

    logError = (error, errorInfo) => {
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                message: error.toString(),
                stack: error.stack,
                componentStack: errorInfo?.componentStack,
                url: window.location.href,
                userAgent: navigator.userAgent,
            };

            // Store in localStorage for debugging (last 10 errors)
            const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
            const logs = [...existingLogs, errorLog].slice(-10);
            localStorage.setItem('errorLogs', JSON.stringify(logs));
        } catch (err) {
            console.error('Failed to log error:', err);
        }
    };

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null,
            showDetails: false 
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    toggleDetails = () => {
        this.setState(prevState => ({
            showDetails: !prevState.showDetails
        }));
    };

    render() {
        if (this.state.hasError) {
            const { error, errorInfo, showDetails, errorCount } = this.state;
            
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F9FF] to-[#f0f4ff] p-4">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <i className="fas fa-exclamation-triangle text-2xl"></i>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
                                    <p className="text-red-100 mt-1">Error #{errorCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <p className="text-[#6b7280] mb-6 leading-relaxed">
                                We're sorry! An unexpected error occurred while loading this page. 
                                Our team has been notified and we're working to fix it.
                            </p>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 font-semibold mb-2">
                                        <i className="fas fa-bug mr-2"></i>
                                        Error Message:
                                    </p>
                                    <p className="text-red-600 text-sm font-mono break-words">
                                        {error.toString()}
                                    </p>
                                </div>
                            )}

                            {/* Details Section */}
                            {import.meta.env.DEV && (
                                <details className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <summary 
                                        className="cursor-pointer text-sm font-semibold text-gray-700 flex items-center gap-2 hover:text-gray-900"
                                        onClick={this.toggleDetails}
                                    >
                                        <i className={`fas fa-${showDetails ? 'chevron-down' : 'chevron-right'}`}></i>
                                        Developer Details
                                    </summary>
                                    {showDetails && (
                                        <div className="mt-4 space-y-3 text-xs">
                                            {error?.stack && (
                                                <div>
                                                    <p className="font-semibold text-gray-700 mb-2">Stack Trace:</p>
                                                    <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-40 text-gray-600">
                                                        {error.stack}
                                                    </pre>
                                                </div>
                                            )}
                                            {errorInfo?.componentStack && (
                                                <div>
                                                    <p className="font-semibold text-gray-700 mb-2">Component Stack:</p>
                                                    <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-40 text-gray-600">
                                                        {errorInfo.componentStack}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </details>
                            )}

                            {/* Help Section */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-700 font-semibold mb-2">
                                    <i className="fas fa-lightbulb mr-2"></i>
                                    What you can try:
                                </p>
                                <ul className="text-blue-600 text-sm space-y-1 ml-6 list-disc">
                                    <li>Refresh the page</li>
                                    <li>Clear your browser cache</li>
                                    <li>Check your internet connection</li>
                                    <li>Try again in a few moments</li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    onClick={this.handleReset}
                                    className="bg-[#3B68FC] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#2952E6] transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-home"></i>
                                    Home Page
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-redo"></i>
                                    Refresh Page
                                </button>
                            </div>

                            {/* Support */}
                            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                                <p className="text-purple-700 text-sm">
                                    <i className="fas fa-headset mr-2"></i>
                                    If the problem persists, please contact support
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
