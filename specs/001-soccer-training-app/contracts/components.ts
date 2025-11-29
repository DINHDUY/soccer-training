/**
 * Component Props Interfaces
 * 
 * TypeScript interfaces for all React component props.
 * These contracts define the API between components and their consumers.
 */

import type { ReactNode, KeyboardEvent, MouseEvent, TouchEvent } from 'react';
import type { 
  ColorDirection, 
  UserConfiguration, 
  AudioDirection,
  TrainingSession 
} from './types';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

/**
 * Root App component props
 */
export interface AppProps {
  // No props - root component manages global state
}

// ============================================================================
// DISPLAY COMPONENTS
// ============================================================================

/**
 * ColorDisplay component - Full-screen background color with ARIA announcements
 */
export interface ColorDisplayProps {
  /** Current color to display (blue = left, red = right) */
  currentColor: ColorDirection;
  
  /** Whether session is paused (shows pause indicator) */
  isPaused: boolean;
  
  /** Direction text for ARIA live region ("LEFT" or "RIGHT") */
  directionText: AudioDirection;
  
  /** Click handler for pause/resume toggle */
  onClick: () => void;
  
  /** Optional CSS class name */
  className?: string;
}

/**
 * PauseIndicator component - Overlay shown when session is paused
 */
export interface PauseIndicatorProps {
  /** Whether to show the indicator */
  isVisible: boolean;
  
  /** Optional CSS class name */
  className?: string;
}

// ============================================================================
// DIALOG COMPONENTS
// ============================================================================

/**
 * ConfigDialog component - Initial configuration for frequency and audio
 */
export interface ConfigDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  
  /** Default frequency value (from saved config or 2s) */
  defaultFrequency: number;
  
  /** Default audio enabled state */
  defaultAudioEnabled: boolean;
  
  /** Callback when user submits configuration */
  onSubmit: (config: { frequency: number; audioEnabled: boolean }) => void;
  
  /** Callback when user dismisses dialog without submitting */
  onDismiss?: () => void;
}

/**
 * SettingsDialog component - Mid-session configuration changes
 */
export interface SettingsDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  
  /** Current session configuration */
  currentConfig: UserConfiguration;
  
  /** Callback when user saves new settings */
  onSave: (config: Partial<UserConfiguration>) => void;
  
  /** Callback when user cancels settings changes */
  onCancel: () => void;
}

/**
 * HelpOverlay component - Usage instructions and keyboard shortcuts
 */
export interface HelpOverlayProps {
  /** Whether overlay is visible */
  isVisible: boolean;
  
  /** Callback to close the overlay */
  onClose: () => void;
}

// ============================================================================
// CONTROL COMPONENTS
// ============================================================================

/**
 * SettingsButton component - Floating button to access settings
 */
export interface SettingsButtonProps {
  /** Whether session is active (button only shows when active) */
  isSessionActive: boolean;
  
  /** Click handler to open settings dialog */
  onClick: () => void;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Optional ARIA label */
  ariaLabel?: string;
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

/**
 * FrequencyInput component - Number input with validation
 */
export interface FrequencyInputProps {
  /** Current frequency value */
  value: number;
  
  /** Change handler */
  onChange: (value: number) => void;
  
  /** Minimum allowed value (default: 0.5) */
  min?: number;
  
  /** Maximum allowed value (default: 60) */
  max?: number;
  
  /** Step increment (default: 0.5) */
  step?: number;
  
  /** Whether input is disabled */
  disabled?: boolean;
  
  /** Input ID for label association */
  id?: string;
  
  /** Whether to auto-focus on mount */
  autoFocus?: boolean;
}

/**
 * AudioToggle component - Checkbox for audio cues
 */
export interface AudioToggleProps {
  /** Whether audio is enabled */
  enabled: boolean;
  
  /** Change handler */
  onChange: (enabled: boolean) => void;
  
  /** Whether audio is supported by browser */
  isSupported: boolean;
  
  /** Whether toggle is disabled */
  disabled?: boolean;
  
  /** Input ID for label association */
  id?: string;
}

// ============================================================================
// CONTEXT PROVIDER PROPS
// ============================================================================

/**
 * AppProvider component - Global state context provider
 */
export interface AppProviderProps {
  /** Child components */
  children: ReactNode;
}

/**
 * ConfigProvider component - User configuration context provider
 */
export interface ConfigProviderProps {
  /** Child components */
  children: ReactNode;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Return type for useTrainingSession hook
 */
export interface UseTrainingSessionReturn {
  /** Current session state */
  session: TrainingSession;
  
  /** Start a new session with specified frequency */
  start: (frequency: number) => void;
  
  /** Pause the current session */
  pause: () => void;
  
  /** Resume the paused session */
  resume: () => void;
  
  /** Reset session to initial state */
  reset: () => void;
  
  /** Update frequency during active session */
  updateFrequency: (frequency: number) => void;
}

/**
 * Return type for useConfiguration hook
 */
export interface UseConfigurationReturn {
  /** Current configuration */
  config: UserConfiguration;
  
  /** Update frequency preference */
  updateFrequency: (frequency: number) => void;
  
  /** Toggle audio enabled state */
  toggleAudio: () => void;
  
  /** Save all configuration changes */
  saveConfig: (updates: Partial<UserConfiguration>) => void;
  
  /** Mark first run as completed */
  completeFirstRun: () => void;
}

/**
 * Return type for useAudioCues hook
 */
export interface UseAudioCuesReturn {
  /** Speak a direction word ("LEFT" or "RIGHT") */
  speak: (word: AudioDirection) => void;
  
  /** Cancel any pending speech */
  cancel: () => void;
  
  /** Whether Web Speech API is supported */
  isSupported: boolean;
  
  /** Whether audio is currently playing */
  isSpeaking: boolean;
}

/**
 * Return type for useKeyboardMouse hook
 */
export interface UseKeyboardMouseReturn {
  /** Handle keyboard key down events */
  handleKeyDown: (event: KeyboardEvent) => void;
  
  /** Handle mouse click events */
  handleClick: (event: MouseEvent) => void;
  
  /** Handle touch events */
  handleTouch: (event: TouchEvent) => void;
}

/**
 * Return type for usePauseIndicator hook
 */
export interface UsePauseIndicatorReturn {
  /** Whether pause indicator should be shown */
  shouldShow: boolean;
  
  /** Animation state for fade in/out */
  animationState: 'entering' | 'entered' | 'exiting' | 'exited';
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

/**
 * Generic event handler type
 */
export type EventHandler<T = void> = (event?: T) => void;

/**
 * Form submit handler with config data
 */
export type ConfigSubmitHandler = (config: { 
  frequency: number; 
  audioEnabled: boolean;
}) => void;

/**
 * Settings save handler with partial config updates
 */
export type SettingsSaveHandler = (updates: Partial<UserConfiguration>) => void;
