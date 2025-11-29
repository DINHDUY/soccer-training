/**
 * App Component
 * 
 * Root component with error boundary and application structure.
 * This is a placeholder for Phase 2; full implementation comes in Phase 3+.
 */

import { Component, ReactNode } from 'react';
import { useConfiguration } from '@/hooks/useConfiguration';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: '1rem' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Placeholder App Content (will be replaced in Phase 3)
function AppContent() {
  const { config, isLoaded } = useConfiguration();

  if (!isLoaded) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '1.5rem',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Soccer Training App
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
        Foundational Phase Complete ✓
      </p>
      <p style={{ fontSize: '1rem', opacity: 0.8 }}>
        Configuration loaded: Frequency {config.frequency}s, Audio:{' '}
        {config.audioEnabled ? 'ON' : 'OFF'}
      </p>
      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.875rem',
          opacity: 0.6,
        }}
      >
        Phase 3 (MVP) implementation starts next...
      </p>
    </div>
  );
}

// Main App with Error Boundary
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
