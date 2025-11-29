# Contract Documentation

**Feature**: Soccer Training Agility Application  
**Phase**: 1 (Design)  
**Date**: 2025-11-28

## Overview

This directory contains TypeScript interface definitions that serve as contracts between different parts of the application. These contracts ensure type safety and clear API boundaries.

## Files

### `types.ts`

Core type definitions for all data entities:

- **Entities**: `TrainingSession`, `UserConfiguration`, `UIState`, `AudioCue`
- **State Machine Types**: `SessionState`, `SessionAction`, `UIAction`
- **Utility Types**: `ColorDirection`, `AudioDirection`, `InputType`
- **Validation**: `FrequencyValidation`, `VALIDATION_CONSTRAINTS`
- **Type Guards**: `isColorDirection()`, `isSessionState()`

**Purpose**: Single source of truth for data model types, ensuring consistency across state management, components, and services.

### `components.ts`

React component prop interfaces:

- **Display Components**: `ColorDisplayProps`, `PauseIndicatorProps`
- **Dialog Components**: `ConfigDialogProps`, `SettingsDialogProps`, `HelpOverlayProps`
- **Control Components**: `SettingsButtonProps`
- **Form Components**: `FrequencyInputProps`, `AudioToggleProps`
- **Hook Return Types**: `UseTrainingSessionReturn`, `UseConfigurationReturn`, `UseAudioCuesReturn`, `UseKeyboardMouseReturn`

**Purpose**: Define clear contracts for component props, ensuring TypeScript enforces correct usage and enabling better IDE autocomplete.

## Usage Guidelines

### Importing Types

```typescript
// Import entity types
import type { TrainingSession, UserConfiguration } from '@/contracts/types';

// Import component props
import type { ColorDisplayProps } from '@/contracts/components';

// Import multiple types
import type { 
  SessionAction, 
  ColorDirection, 
  AudioDirection 
} from '@/contracts/types';
```

### Type Safety Best Practices

1. **Always use `type` imports** for type-only imports (prevents runtime imports)
2. **Never use `any`** - use `unknown` if type is truly unknown, then narrow with type guards
3. **Use discriminated unions** for action types (enables exhaustive pattern matching)
4. **Leverage type guards** (`isColorDirection`, `isSessionState`) when parsing external data

### Contract Evolution

When modifying contracts:

1. **Breaking Changes**: Require version bump and migration plan
2. **Additive Changes**: Add optional properties with defaults
3. **Deprecations**: Mark with JSDoc `@deprecated` before removal

## Entity Contracts Summary

### TrainingSession

**Key Properties**:
- `currentColor: ColorDirection` - 'blue' or 'red' only
- `frequency: number` - Must be 0.5-60 seconds
- `isActive: boolean` - Whether session started
- `isPaused: boolean` - Whether session paused

**State Transitions**: Managed via `SessionAction` discriminated union

### UserConfiguration

**Key Properties**:
- `frequency: number` - Persisted preference (0.5-60 range)
- `audioEnabled: boolean` - User preference for audio cues
- `hasCompletedFirstRun: boolean` - Controls config dialog visibility

**Storage**: Persisted in `localStorage` as JSON

### UIState

**Key Properties**:
- `showConfigDialog: boolean` - Computed from `hasCompletedFirstRun`
- `showHelpOverlay: boolean` - Toggled by 'h' or '?' key
- `showPauseIndicator: boolean` - Derived from `session.isPaused`

**Constraint**: Only one dialog can be visible at a time

### AudioCue

**Key Properties**:
- `isSupported: boolean` - Whether Web Speech API available
- `isEnabled: boolean` - User preference (from config)
- `isSpeaking: boolean` - Whether audio currently playing

**Audio Mapping**: 'blue' → "LEFT", 'red' → "RIGHT"

## Component Contracts Summary

### Required Props vs Optional Props

Components follow these conventions:

- **Required Props**: Core data and event handlers (no `?` suffix)
- **Optional Props**: Styling, CSS classes, ARIA labels (with `?` suffix)
- **Default Values**: Documented in component implementation, not in prop types

### Event Handler Patterns

All event handlers follow naming convention:

- `onClick`, `onChange`, `onSubmit` - User actions
- `onSave`, `onCancel`, `onDismiss` - Dialog actions
- `onClose` - Overlay/modal close actions

### Children Prop

Components accepting children use `children: ReactNode` for maximum flexibility.

## Validation Constraints

Defined in `types.ts`:

```typescript
export const VALIDATION_CONSTRAINTS = {
  MIN_FREQUENCY: 0.5,    // Minimum practical training interval
  MAX_FREQUENCY: 60,     // Maximum practical training interval
  DEFAULT_FREQUENCY: 2,  // Default if user dismisses config
} as const;
```

These constants are used across the application for consistent validation.

## Testing with Contracts

### Type Testing

Use contracts to ensure type safety in tests:

```typescript
import type { TrainingSession, SessionAction } from '@/contracts/types';

// Valid session action
const action: SessionAction = { type: 'START', frequency: 2 };

// TypeScript will error on invalid actions
// const invalid: SessionAction = { type: 'INVALID' }; // ❌ Error
```

### Mock Data Factories

Create factory functions matching entity types:

```typescript
import type { TrainingSession } from '@/contracts/types';

export const createMockSession = (
  overrides?: Partial<TrainingSession>
): TrainingSession => ({
  id: 'test-session-1',
  isActive: false,
  isPaused: false,
  currentColor: 'blue',
  frequency: 2,
  startTime: null,
  pauseTime: null,
  elapsedTime: 0,
  colorChangeCount: 0,
  nextColorChangeAt: null,
  ...overrides,
});
```

## Separation of Concerns

Contracts enforce separation between:

1. **Data Model** (`types.ts`) - What data exists
2. **Component API** (`components.ts`) - How components consume data
3. **Business Logic** (hooks) - How data is transformed
4. **Presentation** (components) - How data is displayed

This separation enables:
- Independent testing of each layer
- Easy refactoring without breaking interfaces
- Clear responsibility boundaries

## Next Steps

1. Implement custom hooks using these contracts (`src/hooks/`)
2. Create React components using these prop interfaces (`src/components/`)
3. Write tests that verify contract compliance
4. Generate `quickstart.md` with examples of using these contracts
