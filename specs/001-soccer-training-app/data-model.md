# Data Model

**Feature**: Soccer Training Agility Application  
**Phase**: 1 (Design)  
**Date**: 2025-11-28

## Overview

This document defines the entities, their properties, relationships, validation rules, and state transitions for the soccer training agility application. The application is client-side only (static SPA), so all entities exist in browser memory and localStorage.

---

## Entities

### 1. TrainingSession

Represents an active agility training session with color-based directional cues.

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | `string` | Yes | `uuid()` | Unique session identifier |
| `isActive` | `boolean` | Yes | `false` | Whether session is running (has been started) |
| `isPaused` | `boolean` | Yes | `false` | Whether session is currently paused |
| `currentColor` | `'blue' \| 'red'` | Yes | `'blue'` | Current background color (blue = left, red = right) |
| `frequency` | `number` | Yes | `2` | Color change interval in seconds (0.5-60 range) |
| `startTime` | `number \| null` | No | `null` | Unix timestamp when session started (ms) |
| `pauseTime` | `number \| null` | No | `null` | Unix timestamp when session paused (ms) |
| `elapsedTime` | `number` | Yes | `0` | Total active time in seconds (excludes paused time) |
| `colorChangeCount` | `number` | Yes | `0` | Number of color transitions completed |
| `nextColorChangeAt` | `number \| null` | No | `null` | Unix timestamp for next scheduled color change (ms) |

**Validation Rules**:
- `frequency`: Must be between 0.5 and 60 seconds (FR-006, assumptions)
- `currentColor`: Must be exactly 'blue' or 'red' (FR-001)
- `isActive` and `isPaused` cannot both be false after session start
- `startTime` must be set when `isActive` becomes true
- `colorChangeCount` is read-only, incremented only on color transitions

**Relationships**:
- One-to-one with `UserConfiguration` (each session uses one config)
- No persistence (session resets on page refresh per assumptions)

**State Transitions**:

```
[Initial] → START → [Active] 
[Active] → PAUSE → [Paused]
[Paused] → RESUME → [Active]
[Active] → COLOR_CHANGE → [Active] (color alternates, count increments)
[Active/Paused] → RESET → [Initial]
```

**State Machine**:
```typescript
type SessionState = 'initial' | 'active' | 'paused';
type SessionAction = 
  | { type: 'START'; frequency: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COLOR_CHANGE' }
  | { type: 'RESET' };
```

---

### 2. UserConfiguration

User preferences for training session behavior.

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `frequency` | `number` | Yes | `2` | Preferred color change frequency in seconds |
| `audioEnabled` | `boolean` | Yes | `true` | Whether audio cues are enabled |
| `hasCompletedFirstRun` | `boolean` | Yes | `false` | Whether user has seen config dialog (FR-008) |
| `audioPermissionGranted` | `boolean` | Yes | `false` | Browser audio permission status (for autoplay) |

**Validation Rules**:
- `frequency`: Must be between 0.5 and 60 seconds
- `audioEnabled`: Can be toggled anytime during session
- `hasCompletedFirstRun`: Set to true after first config dialog submission
- `audioPermissionGranted`: Updated based on browser API response

**Relationships**:
- One-to-many with `TrainingSession` (config reused across sessions)
- Persisted in `localStorage` (survives page refresh)

**Storage Key**: `soccer-training-config`

**localStorage Schema**:
```json
{
  "frequency": 2,
  "audioEnabled": true,
  "hasCompletedFirstRun": false,
  "audioPermissionGranted": false
}
```

---

### 3. UIState

Global UI state managing dialogs, overlays, and visual elements.

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `showConfigDialog` | `boolean` | Yes | Computed | Whether config dialog is visible (see rules) |
| `showHelpOverlay` | `boolean` | Yes | `false` | Whether help overlay is visible (FR-014) |
| `showSettingsDialog` | `boolean` | Yes | `false` | Whether settings dialog is visible (FR-021) |
| `showPauseIndicator` | `boolean` | Yes | Computed | Whether pause indicator is visible (based on session.isPaused) |

**Validation Rules**:
- `showConfigDialog`: True only on first page load if `!hasCompletedFirstRun` (FR-008)
- Only one dialog can be visible at a time (config, settings, or help)
- `showPauseIndicator`: Automatically derived from `session.isPaused`
- Help overlay can be shown over pause indicator (help doesn't dismiss pause state)

**Computed Values**:
```typescript
showConfigDialog = !userConfiguration.hasCompletedFirstRun && !session.isActive
showPauseIndicator = session.isPaused
```

**Relationships**:
- Depends on `TrainingSession.isPaused` for pause indicator
- Depends on `UserConfiguration.hasCompletedFirstRun` for config dialog
- No persistence (resets on page refresh)

---

### 4. KeyboardMouseInput

Captures user input events for session control.

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `lastKeyPressed` | `string \| null` | No | `null` | Last keyboard key pressed |
| `lastInputTime` | `number \| null` | No | `null` | Unix timestamp of last input (ms) |
| `inputType` | `'keyboard' \| 'mouse' \| 'touch' \| null` | No | `null` | Type of last input |

**Validation Rules**:
- `lastKeyPressed`: 'h' or '?' triggers help overlay (FR-014)
- `lastKeyPressed`: 'Escape' closes dialogs/overlays
- Any key/click/touch during active session triggers pause (FR-009/010/011)
- Any key/click/touch during paused session triggers resume (FR-013)

**Relationships**:
- Triggers state changes in `TrainingSession` (pause/resume)
- Triggers state changes in `UIState` (show help)
- No persistence (transient event data)

**Event Mapping**:
```typescript
// Pause/Resume trigger
ANY_KEY | MOUSE_CLICK | TOUCH → TOGGLE_PAUSE (if session active or paused)

// Help trigger
'h' | '?' → SHOW_HELP

// Close trigger
'Escape' → CLOSE_DIALOG/OVERLAY
```

---

### 5. AudioCue

Manages audio playback state for directional cues.

**Properties**:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `isSupported` | `boolean` | Yes | Computed | Whether Web Speech API is available |
| `isEnabled` | `boolean` | Yes | Computed | Derived from `userConfiguration.audioEnabled` |
| `isSpeaking` | `boolean` | Yes | `false` | Whether audio is currently playing |
| `lastSpokenWord` | `'LEFT' \| 'RIGHT' \| null` | No | `null` | Last word spoken (for debugging) |

**Validation Rules**:
- `isSupported`: True if `window.speechSynthesis` exists
- Audio only plays if `isEnabled && isSupported` (FR-019/020)
- Cancel pending speech on session pause (avoid delayed audio)
- `lastSpokenWord`: 'LEFT' when color changes to blue, 'RIGHT' when color changes to red

**Relationships**:
- Triggered by `TrainingSession` COLOR_CHANGE action
- Depends on `UserConfiguration.audioEnabled` for permission
- No persistence (transient state)

**Audio Mapping**:
```typescript
currentColor: 'blue' → speak("LEFT")
currentColor: 'red' → speak("RIGHT")
```

---

## Entity Relationships Diagram

```
┌─────────────────────┐
│  UserConfiguration  │ (persisted in localStorage)
│  - frequency        │
│  - audioEnabled     │
└──────────┬──────────┘
           │ 1:1
           ▼
┌─────────────────────┐
│  TrainingSession    │ (in-memory, ephemeral)
│  - isActive         │
│  - isPaused         │
│  - currentColor     │◄─────┐
│  - frequency        │      │
│  - colorChangeCount │      │
└──────────┬──────────┘      │
           │                  │
           │ influences       │ triggers
           ▼                  │
┌─────────────────────┐      │
│     UIState         │      │
│  - showPauseInd...  │      │
│  - showHelpOverlay  │      │
└─────────────────────┘      │
           ▲                  │
           │ controls         │
           │                  │
┌─────────────────────┐      │
│ KeyboardMouseInput  │      │
│  - lastKeyPressed   │──────┘
│  - inputType        │ COLOR_CHANGE action
└─────────────────────┘
           │
           │ triggers
           ▼
┌─────────────────────┐
│     AudioCue        │
│  - isEnabled        │
│  - lastSpokenWord   │
└─────────────────────┘
```

---

## Validation Summary

### Global Constraints

1. **Frequency Range**: All frequency values MUST be 0.5 ≤ frequency ≤ 60 seconds
2. **Color Values**: Only 'blue' and 'red' are valid (no other strings/colors)
3. **Mutual Exclusivity**: Config, Settings, and Help dialogs cannot be shown simultaneously (but help can overlay pause indicator)
4. **Session Lifecycle**: Session cannot be paused without being active first
5. **Audio Requirements**: Audio requires both browser support AND user permission AND user preference enabled

### Derived State Rules

1. `showConfigDialog = !hasCompletedFirstRun && !isActive`
2. `showPauseIndicator = isPaused`
3. `audioCanPlay = isSupported && audioEnabled && audioPermissionGranted`
4. `nextColorChangeAt = startTime + (frequency * 1000)` (only when active, not paused)

---

## State Management Implementation

### Recommended Structure

```typescript
// Root application state
type AppState = {
  session: TrainingSession;
  config: UserConfiguration;
  ui: UIState;
  input: KeyboardMouseInput;
  audio: AudioCue;
};

// Context provider
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>();

// Reducer for session state transitions
const sessionReducer = (state: TrainingSession, action: SessionAction): TrainingSession => {
  // Implement state machine logic
};

// Separate context for config (persisted)
const ConfigContext = createContext<{
  config: UserConfiguration;
  updateConfig: (updates: Partial<UserConfiguration>) => void;
}>();
```

### Custom Hooks (Separation of Concerns)

```typescript
// Business logic hooks
useTrainingSession() → { session, start, pause, resume, reset }
useConfiguration() → { config, updateFrequency, toggleAudio, saveConfig }
useAudioCues() → { speak, cancel, isSupported }
useKeyboardMouse() → { handleKeyDown, handleClick, handleTouch }

// UI hooks
usePauseIndicator() → { shouldShow, animationState }
useHelpOverlay() → { isOpen, open, close }
useConfigDialog() → { isOpen, submit, dismiss }
```

---

## Testing Considerations

### Unit Tests for Each Entity

1. **TrainingSession**: Test state transitions (start→pause→resume, color changes)
2. **UserConfiguration**: Test validation (frequency range), localStorage persistence
3. **UIState**: Test mutual exclusivity of dialogs, computed values
4. **KeyboardMouseInput**: Test event mapping (h/? → help, any key → pause/resume)
5. **AudioCue**: Test audio playback conditions, browser support detection

### Integration Tests

1. **Config → Session Flow**: Submit config dialog → session starts with correct frequency
2. **Pause → Audio Cancellation**: Pause session → pending audio cancels
3. **Settings → Session Update**: Change frequency during session → new frequency applied
4. **Keyboard Accessibility**: Tab navigation → all controls accessible

### Edge Cases (from Spec)

1. Extremely short frequency (0.1s) → Enforce 0.5s minimum
2. Extremely long frequency (100s) → Enforce 60s maximum
3. Dismiss config without input → Use default 2s frequency
4. Browser tab loses focus → Pause session automatically (or maintain state)
5. Screen resize during session → Maintain responsive layout
6. Audio permission denied → Fallback to visual-only training

---

## Next Steps

1. Generate TypeScript interfaces in `/contracts/types.ts`
2. Define component prop interfaces in `/contracts/components.ts`
3. Create `quickstart.md` with setup instructions
4. Update agent context with finalized data model
