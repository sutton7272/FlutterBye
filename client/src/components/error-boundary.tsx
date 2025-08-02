import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
          <Card className="max-w-lg w-full bg-gray-800 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="h-6 w-6" />
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-300">
                <p className="mb-3">
                  We encountered an unexpected error. Don't worry - your data is safe and we're working to fix this.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-400 mb-2">
                      <Bug className="inline h-4 w-4 mr-2" />
                      Error Details (Development Only)
                    </summary>
                    <div className="text-xs text-red-400 font-mono">
                      <p className="font-semibold mb-2">{this.state.error.name}: {this.state.error.message}</p>
                      <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="text-center">
                <Link href="/">
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>If this problem persists, please contact support.</p>
                <p className="mt-1">Error ID: {Date.now().toString(36)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Specialized error boundaries for specific use cases
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Page Error:", error, errorInfo);
        // Track page-level errors specifically
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function FormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border border-red-500/30 rounded-lg bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-semibold">Form Error</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            There was a problem with this form. Please refresh the page and try again.
          </p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error("Form Error:", error, errorInfo);
        // Track form-specific errors
      }}
    >
      {children}
    </ErrorBoundary>
  );
}