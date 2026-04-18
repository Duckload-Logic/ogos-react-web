/**
 * ErrorBoundary Component
 * Error handling wrapper for components
 */

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught by boundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-lg",
              "border border-red-200 bg-red-50 p-8",
            )}
          >
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-900">
                Something went wrong
              </h2>
              <p className="mt-1 text-sm text-red-700">
                {
                  // this.state.error?.message ||
                  "An unexpected error occurred"
                }
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
