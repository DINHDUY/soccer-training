/**
 * Core Type Definitions
 * 
 * TypeScript interfaces and types for all entities in the Soccer Training Agility Application.
 * These types define the data model contracts for state management and component props.
 */

// ============================================================================
// ENTITY: TrainingSession
// ============================================================================

/**
 * Color values for directional cues
 * - blue: Move to the left side of the cone
 * - red: Move to the right side of the cone
 */
export type ColorDirection = 'blue' | 'red';

/**
 * Session state for state machine
 */
export type SessionState = 'initial' | 'active' | 'paused';

/**
 * Training session entity representing an active agility training session
 */
export interface TrainingSession {
  /** Unique session identifier */
  id: string;
  
  /** Whether session has been started */
  isActive: boolean;
  
  /** Whether session is currently paused */
  isPaused: boolean;
  
  /** Current background color (blue = left, red = right) */
  currentColor: ColorDirection;
  
  /** Color change interval in seconds (0.5-60 range) */
  frequency: number;
  
  /** Unix timestamp when session started (ms), null if not started */
  startTime: number | null;
  
  /** Unix timestamp when session paused (ms), null if not paused */
  pauseTime: number | null;
  
  /** Total active time in seconds (excludes paused time) */
  elapsedTime: number;
  
  /** Number of color transitions completed */
  colorChangeCount: number;
  
  /** Unix timestamp for next scheduled color change (ms), null if not active */
  nextColorChangeAt: number | null;
}

/**
 * Actions for training session state machine
 */
export type SessionAction =
  | { type: 'START'; frequency: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COLOR_CHANGE' }
  | { type: 'RESET' }
  | { type: 'UPDATE_FREQUENCY'; frequency: number };

// ============================================================================
// ENTITY: UserConfiguration
// ============================================================================

/**
 * User preferences for training session behavior
 */
export interface UserConfiguration {
  /** Preferred color change frequency in seconds (0.5-60 range) */
  frequency: number;
  
  /** Whether audio cues are enabled */
  audioEnabled: boolean;
  
  /** Whether user has completed first-run configuration */
  hasCompletedFirstRun: boolean;
  
  /** Browser audio permission status */
  audioPermissionGranted: boolean;
}

/**
 * Partial updates for user configuration
 */
export type UserConfigurationUpdate = Partial<UserConfiguration>;

// ============================================================================
// ENTITY: UIState
// ============================================================================

/**
 * Global UI state managing dialogs, overlays, and visual elements
 */
export interface UIState {
  /** Whether configuration dialog is visible */
  showConfigDialog: boolean;
  
  /** Whether help overlay is visible */
  showHelpOverlay: boolean;
  
  /** Whether settings dialog is visible */
  showSettingsDialog: boolean;
  
  /** Whether pause indicator is visible (derived from session.isPaused) */
  showPauseIndicator: boolean;
}

/**
 * Actions for UI state management
 */
export type UIAction =
  | { type: 'SHOW_CONFIG_DIALOG' }
  | { type: 'HIDE_CONFIG_DIALOG' }
  | { type: 'SHOW_HELP_OVERLAY' }
  | { type: 'HIDE_HELP_OVERLAY' }
  | { type: 'SHOW_SETTINGS_DIALOG' }
  | { type: 'HIDE_SETTINGS_DIALOG' }
  | { type: 'UPDATE_PAUSE_INDICATOR'; isPaused: boolean };

// ============================================================================
// ENTITY: KeyboardMouseInput
// ============================================================================

/**
 * Input event types
 */
export type InputType = 'keyboard' | 'mouse' | 'touch';

/**
 * Keyboard and mouse input state
 */
export interface KeyboardMouseInput {
  /** Last keyboard key pressed */
  lastKeyPressed: string | null;
  
  /** Unix timestamp of last input (ms) */
  lastInputTime: number | null;
  
  /** Type of last input */
  inputType: InputType | null;
}

// ============================================================================
// ENTITY: AudioCue
// ============================================================================

/**
 * Audio direction words
 */
export type AudioDirection = 'LEFT' | 'RIGHT';

/**
 * Audio playback state
 */
export interface AudioCue {
  /** Whether Web Speech API is available */
  isSupported: boolean;
  
  /** Whether audio is enabled (from user config) */
  isEnabled: boolean;
  
  /** Whether audio is currently playing */
  isSpeaking: boolean;
  
  /** Last word spoken (for debugging) */
  lastSpokenWord: AudioDirection | null;
}

// ============================================================================
// APPLICATION STATE
// ============================================================================

/**
 * Root application state combining all entities
 */
export interface AppState {
  session: TrainingSession;
  config: UserConfiguration;
  ui: UIState;
  audio: AudioCue;
}

/**
 * Combined actions for application state reducer
 */
export type AppAction = SessionAction | UIAction;

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Frequency validation result
 */
export interface FrequencyValidation {
  isValid: boolean;
  value: number;
  error?: string;
}

/**
 * Validation constraints
 */
export const VALIDATION_CONSTRAINTS = {
  MIN_FREQUENCY: 0.5,
  MAX_FREQUENCY: 60,
  DEFAULT_FREQUENCY: 2,
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Factory function result for creating initial entities
 */
export type EntityFactory<T> = () => T;

/**
 * Type guard for color direction
 */
export function isColorDirection(value: unknown): value is ColorDirection {
  return value === 'blue' || value === 'red';
}

/**
 * Type guard for session state
 */
export function isSessionState(value: unknown): value is SessionState {
  return value === 'initial' || value === 'active' || value === 'paused';
}
