/**
 * App Component
 * 
 * Root application component with error boundary and state management.
 */

import { Component, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ColorDisplay } from '@/components/ColorDisplay';
import { ConfigDialog } from '@/components/ConfigDialog';
import { HelpOverlay } from '@/components/HelpOverlay';
import { useConfiguration } from '@/hooks/useConfiguration';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { useAudioCues } from '@/hooks/useAudioCues';

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
    console.error('[App] Error boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[App] Error boundary componentDidCatch:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">
              Something went wrong
            </h1>
            <p className="error-boundary-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              className="error-boundary-button"
              onClick={() => window.location.reload()}
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

// Main App Content
function AppContent() {
  const { config, updateConfig } = useConfiguration();
  const { session, start, pause, resume } = useTrainingSession();
  const { speak, cancel, isSupported } = useAudioCues(config.audioEnabled);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);

  // Play audio cue when color changes or session starts
  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      const direction = session.currentColor === 'blue' ? 'LEFT' : 'RIGHT';
      speak(direction);
    }
  }, [session.currentColor, session.isActive, session.isPaused, speak]);

  // Cancel audio when session pauses
  useEffect(() => {
    if (session.isPaused) {
      cancel();
    }
  }, [session.isPaused, cancel]);

  // Handle configuration submission
  const handleConfigSubmit = (frequency: number, audioEnabled: boolean) => {
    console.log('[Training] Session started', { 
      frequency, 
      audioEnabled,
      timestamp: new Date().toISOString()
    });
    
    // Update configuration and mark first run complete
    updateConfig({
      frequency,
      audioEnabled,
      hasCompletedFirstRun: true,
    });

    // Start training session (audio will be triggered by useEffect)
    start(frequency);
  };

  // Handle pause/resume toggle
  const handlePauseResume = () => {
    if (session.isPaused) {
      resume();
    } else if (session.isActive) {
      pause();
    }
  };

  // Log session end on unmount
  if (session.isActive) {
    window.addEventListener('beforeunload', () => {
      console.log('[Training] Session ended', {
        sessionId: session.id,
        elapsedTime: session.elapsedTime,
        colorChangeCount: session.colorChangeCount,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Show configuration dialog if first run not completed
  if (!config.hasCompletedFirstRun) {
    return (
      <ConfigDialog
        onSubmit={handleConfigSubmit}
        defaultFrequency={config.frequency}
        defaultAudioEnabled={config.audioEnabled}
      />
    );
  }

  // Show color display once configured
  return (
    <>
      {config.audioEnabled && !isSupported && (
        <div className="audio-unsupported-banner" role="alert">
          Audio cues are not supported in this browser
        </div>
      )}
      <ColorDisplay
        currentColor={session.currentColor}
        isPaused={session.isPaused}
        onPauseResume={handlePauseResume}
        onHelp={() => setShowHelpOverlay(true)}
      />
      <HelpOverlay 
        isVisible={showHelpOverlay}
        onClose={() => setShowHelpOverlay(false)}
      />
    </>
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
