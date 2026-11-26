import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let friendly = error.message || "Something went wrong.";
    try {
      const parsed = JSON.parse(error.message) as { error?: string };
      if (parsed?.error) {
        if (parsed.error.includes("Quota exceeded")) {
          friendly =
            "Daily free Firestore database quota was reached. Quota resets tomorrow.";
        } else if (parsed.error.includes("permission")) {
          friendly =
            "You do not have permission to perform that database action. Please sign in with an authorized account.";
        } else {
          friendly = parsed.error;
        }
      }
    } catch {
      // Plain error message
    }
    return { hasError: true, message: friendly };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f2efe6] text-[#171716] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full bg-[#fffdf6] border-2 border-[#171716] rounded-2xl p-8 shadow-[6px_6px_0_#171716]">
            <p className="text-xs font-medium tracking-wide text-[#d9442e] mb-2">
              Something interrupted the page
            </p>
            <h1 className="font-display text-2xl font-semibold text-[#171716] mb-3">
              We hit an unexpected snag
            </h1>
            <p className="text-sm leading-relaxed text-[#171716]/75 mb-6">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="px-5 py-2.5 rounded-xl border-2 border-[#171716] bg-[#171716] text-[#f2efe6] text-sm font-medium hover:bg-[#ff5b44] hover:text-[#171716] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
