// src/components/ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }
      
      return (
        <div className="error-boundary">
          <h2>出了点问题</h2>
          <p>很抱歉，页面出现了错误。</p>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error.stack}
            </details>
          )}
          <button onClick={() => window.location.reload()}>
            重新加载页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;