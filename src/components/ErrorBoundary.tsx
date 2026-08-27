import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white font-sans">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg max-w-3xl w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong.</h2>
            <p className="text-red-300 mb-4">The application crashed while rendering this component.</p>
            <div className="bg-black/40 p-4 rounded overflow-auto mb-4 font-mono text-sm">
              <p className="font-bold text-red-400 mb-2">{this.state.error?.toString()}</p>
              <p className="text-gray-400 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
