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
import { SettingsButton } from '@/components/SettingsButton';
import { SettingsDialog } from '@/components/SettingsDialog';
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
  const { session, start, pause, resume, updateFrequency } = useTrainingSession();
  const { speak, cancel, isSupported } = useAudioCues(config.audioEnabled);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

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

  // Handle settings button click
  const handleSettingsOpen = () => {
    setShowSettingsDialog(true);
    if (session.isActive && !session.isPaused) {
      pause();
    }
  };

  // Handle settings save
  const handleSettingsSave = (frequency: number, audioEnabled: boolean) => {
    console.log('[Training] Settings changed', {
      oldFrequency: config.frequency,
      newFrequency: frequency,
      oldAudioEnabled: config.audioEnabled,
      newAudioEnabled: audioEnabled,
      timestamp: new Date().toISOString()
    });

    // Update configuration
    updateConfig({ frequency, audioEnabled });

    // Update session frequency
    updateFrequency(frequency);

    // Close dialog and resume session
    setShowSettingsDialog(false);
    if (session.isActive) {
      resume();
    }
  };

  // Handle settings cancel
  const handleSettingsCancel = () => {
    setShowSettingsDialog(false);
    if (session.isActive && session.isPaused) {
      resume();
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
      {session.isActive && (
        <SettingsButton onClick={handleSettingsOpen} />
      )}
      <HelpOverlay 
        isVisible={showHelpOverlay}
        onClose={() => setShowHelpOverlay(false)}
      />
      <SettingsDialog
        isOpen={showSettingsDialog}
        currentFrequency={config.frequency}
        currentAudioEnabled={config.audioEnabled}
        onSave={handleSettingsSave}
        onCancel={handleSettingsCancel}
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
