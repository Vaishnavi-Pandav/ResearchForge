import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Here we could also log to an external service like Sentry
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-black mb-3">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page. If the problem persists, please contact support.
            </p>
            
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              <RefreshCw className="w-4 h-4" /> Reload Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left">
                <p className="text-xs font-mono text-red-400 break-all bg-black/50 p-3 rounded-lg border border-red-500/20 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
