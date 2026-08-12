"use client";

import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "var(--color-page)",
            color: "var(--color-ink-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--spacing-12)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <p
              style={{
                fontFamily: "var(--font-family-mono)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-ink-tertiary)",
                margin: "0 0 var(--spacing-3)",
              }}
            >
              Something went wrong
            </p>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontSize: "var(--font-size-2xl)",
                fontWeight: 700,
                margin: "0 0 var(--spacing-4)",
                lineHeight: 1.2,
              }}
            >
              Page failed to load
            </h2>
            <p
              style={{
                color: "var(--color-ink-secondary)",
                fontSize: "var(--font-size-sm)",
                lineHeight: 1.6,
                margin: "0 0 var(--spacing-6)",
              }}
            >
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--spacing-2)",
                padding: "var(--spacing-3) var(--spacing-6)",
                minHeight: 44,
                background: "var(--color-ink-primary)",
                color: "var(--color-ink-on-accent)",
                border: "1px solid var(--color-ink-primary)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-family-base)",
                fontWeight: 600,
                fontSize: "var(--font-size-base)",
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
