import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Banner, Button } from "@ni3stack/ui";

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}


class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  }

  static getDerivedStateFromError():State {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if(this.state.hasError) {
      <Banner variant="error">
        <AlertTriangle size={18} />
        <div>
          <strong>Something went wrong</strong>
          <p>We couldn't load this page. Please try again.</p>
        </div>

        <Button onClick={this.handleReload}>
          <RefreshCw size={16} />
          Try again
        </Button>
      </Banner>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

