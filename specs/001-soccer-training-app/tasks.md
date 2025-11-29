# Tasks: Soccer Training Agility Application

**Input**: Design documents from `/specs/001-soccer-training-app/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included per NFR-006 (comprehensive tests for all functionality)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project using Vite with React-TypeScript template: `npm create vite@latest soccer-training-app -- --template react-ts`
- [ ] T002 Install core dependencies: React 18.2+, TypeScript 5.3+, and configure package.json scripts per quickstart.md
- [ ] T003 [P] Install testing dependencies: Vitest, React Testing Library, @testing-library/jest-dom, @testing-library/user-event, jsdom
- [ ] T004 [P] Install code quality tools: ESLint, Prettier, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y, eslint-config-prettier
- [ ] T005 [P] Install deployment tools: gh-pages, Husky, lint-staged
- [ ] T006 Configure vite.config.ts with path aliases (@/), test environment (jsdom), and GitHub Pages base path
- [ ] T007 Configure tsconfig.json with strict mode and path mappings per quickstart.md
- [ ] T008 [P] Configure ESLint (.eslintrc.cjs) with React hooks and accessibility plugins
- [ ] T009 [P] Configure Prettier (.prettierrc) with project code style preferences
- [ ] T010 [P] Configure Husky pre-commit hooks and lint-staged for automated quality checks
- [ ] T011 Create project directory structure: src/{components,hooks,services,types,test}, tests/{unit,integration}
- [ ] T012 Create test setup file src/test/setup.ts with localStorage and speechSynthesis mocks
- [ ] T013 [P] Create GitHub Actions workflow .github/workflows/deploy.yml for automated deployment to GitHub Pages
- [ ] T014 [P] Copy TypeScript type definitions from contracts/ to src/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T015 Create storageService in src/services/storageService.ts for localStorage persistence with error handling
- [ ] T016 Create audioService in src/services/audioService.ts wrapping Web Speech API with browser support detection
- [ ] T017 Write unit test for storageService in tests/unit/services/storageService.test.ts (load/save/clear config)
- [ ] T018 Write unit test for audioService in tests/unit/services/audioService.test.ts (speak/cancel/isSupported)
- [ ] T019 Implement useConfiguration hook in src/hooks/useConfiguration.ts with localStorage integration
- [ ] T020 Write unit test for useConfiguration hook in tests/unit/hooks/useConfiguration.test.ts
- [ ] T021 Create React Context providers structure in src/App.tsx with error boundary
- [ ] T022 Create global CSS in src/index.css for full-screen layout, responsive design, and color transitions
- [ ] T023 Configure App.tsx root component with context providers and keyboard/mouse/touch event listeners

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Agility Training Session (Priority: P1) 🎯 MVP

**Goal**: Users can configure frequency, start session, and see colors alternate (blue = left, red = right) at specified intervals

**Independent Test**: Open app, configure 2-second frequency, submit, observe blue background change to red after 2 seconds, then alternate continuously

### Tests for User Story 1 (Write FIRST - ensure they FAIL before implementation)

- [ ] T024 [P] [US1] Write integration test for config-to-session flow in tests/integration/trainingSession.test.tsx (dialog → submit → session starts)
- [ ] T025 [P] [US1] Write unit test for useTrainingSession hook in tests/unit/hooks/useTrainingSession.test.ts (start/pause/resume/color change state machine)

### Implementation for User Story 1

- [ ] T026 [P] [US1] Create ColorDisplay component in src/components/ColorDisplay.tsx with full-screen color background and ARIA live region
- [ ] T027 [P] [US1] Create ConfigDialog component in src/components/ConfigDialog.tsx with frequency input validation (0.5-60 range)
- [ ] T028 [US1] Implement useTrainingSession hook in src/hooks/useTrainingSession.ts with session reducer and timer logic for color changes
- [ ] T029 [US1] Write unit test for ColorDisplay component in tests/unit/components/ColorDisplay.test.tsx (renders correct color, ARIA labels)
- [ ] T030 [US1] Write unit test for ConfigDialog component in tests/unit/components/ConfigDialog.test.tsx (validation, submit, default values)
- [ ] T031 [US1] Integrate ColorDisplay and ConfigDialog in App.tsx with session state management
- [ ] T032 [US1] Add session start/stop logging to console per NFR-009

**Checkpoint**: User Story 1 complete - app loads with config dialog, starts session, colors alternate at configured frequency

---

## Phase 4: User Story 2 - Session Control (Priority: P2)

**Goal**: Users can pause/resume session via keyboard, mouse, or touch with visible pause indicator

**Independent Test**: Start session (US1), press any key → session pauses with indicator, press again → resumes

### Tests for User Story 2 (Write FIRST - ensure they FAIL before implementation)

- [ ] T033 [P] [US2] Write integration test for pause/resume flow in tests/integration/sessionControl.test.tsx (keyboard/mouse/touch all trigger pause/resume)
- [ ] T034 [P] [US2] Write unit test for useKeyboardMouse hook in tests/unit/hooks/useKeyboardMouse.test.ts (event handlers)

### Implementation for User Story 2

- [ ] T035 [P] [US2] Create PauseIndicator component in src/components/PauseIndicator.tsx with pause icon and animation
- [ ] T036 [US2] Implement useKeyboardMouse hook in src/hooks/useKeyboardMouse.ts for keyboard/mouse/touch event handling
- [ ] T037 [US2] Write unit test for PauseIndicator component in tests/unit/components/PauseIndicator.test.tsx (visibility, styling)
- [ ] T038 [US2] Extend useTrainingSession hook to handle PAUSE and RESUME actions with timer cancellation
- [ ] T039 [US2] Integrate PauseIndicator into ColorDisplay component (conditional rendering based on isPaused)
- [ ] T040 [US2] Connect useKeyboardMouse to session pause/resume dispatch in App.tsx
- [ ] T041 [US2] Add pause/resume logging to console per NFR-009

**Checkpoint**: User Stories 1 AND 2 complete - session can be paused/resumed via any input method with visual feedback

---

## Phase 5: User Story 3 - Help & Guidance (Priority: P3)

**Goal**: Users can press 'h' or '?' to view help overlay explaining controls and color meanings

**Independent Test**: During session (running or paused), press 'h' → help appears, press Escape → help closes, session returns to previous state

### Tests for User Story 3 (Write FIRST - ensure they FAIL before implementation)

- [ ] T042 [P] [US3] Write integration test for help overlay in tests/integration/helpOverlay.test.tsx (h/? opens, Escape closes, maintains session state)
- [ ] T043 [P] [US3] Write unit test for HelpOverlay component in tests/unit/components/HelpOverlay.test.tsx (content, keyboard close)

### Implementation for User Story 3

- [ ] T044 [US3] Create HelpOverlay component in src/components/HelpOverlay.tsx with instructions and keyboard shortcuts
- [ ] T045 [US3] Extend useKeyboardMouse hook to detect 'h' and '?' keys and dispatch SHOW_HELP action
- [ ] T046 [US3] Add UIState management to App.tsx for showHelpOverlay state
- [ ] T047 [US3] Integrate HelpOverlay into App.tsx with conditional rendering based on UIState
- [ ] T048 [US3] Add Escape key handler to close help overlay without affecting session state

**Checkpoint**: User Stories 1, 2, AND 3 complete - users can access contextual help without disrupting training

---

## Phase 6: User Story 4 - Audio Cues (Priority: P4) 🔊 Enhancement

**Goal**: Audio says "LEFT" when blue appears, "RIGHT" when red appears (optional, can be disabled)

**Independent Test**: Enable audio in config, start session, verify "LEFT" spoken on blue→red transition and "RIGHT" on red→blue

### Tests for User Story 4 (Write FIRST - ensure they FAIL before implementation)

- [ ] T049 [P] [US4] Write integration test for audio cues in tests/integration/audioCues.test.tsx (audio plays on color change when enabled)
- [ ] T050 [P] [US4] Write unit test for useAudioCues hook in tests/unit/hooks/useAudioCues.test.ts (speak/cancel behavior)

### Implementation for User Story 4

- [ ] T051 [US4] Implement useAudioCues hook in src/hooks/useAudioCues.ts wrapping audioService with enabled state check
- [ ] T052 [US4] Add audio toggle checkbox to ConfigDialog component for initial preference
- [ ] T053 [US4] Integrate useAudioCues with useTrainingSession to trigger speech on COLOR_CHANGE action
- [ ] T054 [US4] Add audio permission request on first user interaction per browser autoplay policies
- [ ] T055 [US4] Cancel pending speech when session is paused to avoid delayed audio
- [ ] T056 [US4] Add fallback UI message when speechSynthesis is not supported by browser

**Checkpoint**: All 4 user stories complete - full feature set implemented with audio enhancement

---

## Phase 7: Settings Reconfiguration (Cross-Story Enhancement)

**Goal**: Users can change frequency and audio settings mid-session via settings button (FR-021, FR-022, FR-023)

**Independent Test**: Start session, click settings button → session pauses, change frequency, save → session resumes with new frequency

### Tests for Settings (Write FIRST)

- [ ] T057 [P] Write integration test for settings dialog in tests/integration/settingsDialog.test.tsx (open pauses session, save applies changes, cancel preserves old config)
- [ ] T058 [P] Write unit test for SettingsButton component in tests/unit/components/SettingsButton.test.tsx
- [ ] T059 [P] Write unit test for SettingsDialog component in tests/unit/components/SettingsDialog.test.tsx

### Implementation for Settings

- [ ] T060 [P] Create SettingsButton component in src/components/SettingsButton.tsx (floating button visible during active session)
- [ ] T061 [P] Create SettingsDialog component in src/components/SettingsDialog.tsx (frequency input + audio toggle)
- [ ] T062 Add SHOW_SETTINGS_DIALOG and HIDE_SETTINGS_DIALOG actions to UIState management
- [ ] T063 Add UPDATE_FREQUENCY action to useTrainingSession hook to change frequency mid-session
- [ ] T064 Integrate SettingsButton and SettingsDialog into App.tsx with pause-on-open behavior
- [ ] T065 Add settings change logging to console per NFR-009

**Checkpoint**: Settings reconfiguration complete - users can adjust preferences without restarting

---

## Phase 8: Accessibility & Polish

**Purpose**: Accessibility compliance (NFR-010, NFR-011) and cross-cutting improvements

- [ ] T066 [P] Add ARIA labels to all interactive elements (buttons, inputs, dialogs) per NFR-010
- [ ] T067 [P] Implement ARIA live regions for color change announcements ("Moving LEFT"/"Moving RIGHT")
- [ ] T068 [P] Test keyboard-only navigation: Tab to all controls, Enter/Space to activate, Escape to close dialogs
- [ ] T069 [P] Add focus trap to dialogs (ConfigDialog, SettingsDialog, HelpOverlay) for keyboard accessibility
- [ ] T070 [P] Verify responsive layout on devices 320px-2560px width per SC-004
- [ ] T071 [P] Add CSS transitions for smooth color changes (60fps target per performance goals)
- [ ] T072 [P] Optimize bundle size and verify <3s page load per NFR-007 and SC-006
- [ ] T073 [P] Test across Chrome, Firefox, Safari, Edge (current and previous versions) per NFR-008
- [ ] T074 Add React error boundary in App.tsx with user-friendly error display per NFR-009
- [ ] T075 [P] Write accessibility integration test in tests/integration/accessibility.test.tsx (keyboard navigation, screen reader announcements)

---

## Phase 9: Documentation & Deployment

**Purpose**: Production readiness and deployment automation

- [ ] T076 [P] Update README.md with project description, setup instructions, and deployment link
- [ ] T077 [P] Add inline code comments for complex logic (timer management, state machine transitions)
- [ ] T078 Verify GitHub Actions workflow deploys successfully to GitHub Pages
- [ ] T079 Test deployed application on GitHub Pages URL with all user stories
- [ ] T080 [P] Run full test suite and verify 80%+ coverage per SC-011: `npm run test:coverage`
- [ ] T081 [P] Validate quickstart.md instructions work for new developer setup
- [ ] T082 Create production build and verify bundle optimization: `npm run build`
- [ ] T083 [P] Add build status badge to README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3) - extends session with pause/resume
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) only - can run parallel to US2
- **User Story 4 (Phase 6)**: Depends on User Story 1 (Phase 3) - adds audio to color changes
- **Settings (Phase 7)**: Depends on User Stories 1, 2, 4 (config + session + pause + audio)
- **Accessibility (Phase 8)**: Depends on all UI components being implemented
- **Documentation (Phase 9)**: Depends on all features being complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Independent - can start after Foundational phase
- **User Story 2 (P2)**: Extends US1 - needs ColorDisplay, useTrainingSession from US1
- **User Story 3 (P3)**: Independent - only depends on Foundational phase (keyboard hooks, UI state)
- **User Story 4 (P4)**: Extends US1 - needs useTrainingSession COLOR_CHANGE events from US1

### Within Each User Story

1. **Write tests FIRST** (all [P] tests can run in parallel)
2. **Run tests to verify they FAIL** (Red phase of TDD)
3. **Create components in parallel** (all [P] components can run in parallel)
4. **Implement hooks** (business logic)
5. **Write component unit tests** (verify rendering, props)
6. **Integrate into App.tsx**
7. **Run tests to verify they PASS** (Green phase of TDD)
8. **Refactor if needed** (while keeping tests green)

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T005, T008, T009, T010, T013, T014 can all run in parallel

**Phase 2 (Foundational)**: T015-T016 (services), T017-T018 (service tests) can run in parallel

**User Story 1**: T024-T025 (tests), T026-T027 (components), T029-T030 (component tests) can run in parallel

**User Story 2**: T033-T034 (tests), T035-T036 (components), T037 (component test) can run in parallel

**User Story 3**: T042-T043 (tests) can run in parallel

**User Story 4**: T049-T050 (tests) can run in parallel

**Phase 7 (Settings)**: T057-T059 (tests), T060-T061 (components) can run in parallel

**Phase 8 (Accessibility)**: T066-T073, T075 can all run in parallel (different aspects)

**Phase 9 (Documentation)**: T076-T077, T080-T083 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Step 1: Launch all tests together (WRITE FIRST, ensure FAIL):
T024: "Write integration test for config-to-session flow in tests/integration/trainingSession.test.tsx"
T025: "Write unit test for useTrainingSession hook in tests/unit/hooks/useTrainingSession.test.ts"

# Step 2: Launch all components together:
T026: "Create ColorDisplay component in src/components/ColorDisplay.tsx"
T027: "Create ConfigDialog component in src/components/ConfigDialog.tsx"

# Step 3: Implement hook (depends on components):
T028: "Implement useTrainingSession hook in src/hooks/useTrainingSession.ts"

# Step 4: Launch component tests together:
T029: "Write unit test for ColorDisplay component in tests/unit/components/ColorDisplay.test.tsx"
T030: "Write unit test for ConfigDialog component in tests/unit/components/ConfigDialog.test.tsx"

# Step 5: Integration:
T031: "Integrate ColorDisplay and ConfigDialog in App.tsx"
T032: "Add logging"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (T001-T014) → Project scaffolding ready
2. Complete **Phase 2: Foundational** (T015-T023) → CRITICAL infrastructure ready
3. Complete **Phase 3: User Story 1** (T024-T032) → Core training functionality
4. **STOP and VALIDATE**: Test US1 independently - config dialog, session starts, colors alternate
5. Deploy MVP to GitHub Pages for demo

**At this point, you have a working MVP that delivers core value: color-based agility training**

### Incremental Delivery (Recommended)

1. **Foundation** (Phase 1 + 2) → Infrastructure ready
2. **MVP** (Phase 3) → User Story 1 → Deploy & Demo (basic training works!)
3. **Enhanced UX** (Phase 4) → User Story 2 → Deploy & Demo (pause/resume added)
4. **Onboarding** (Phase 5) → User Story 3 → Deploy & Demo (help for new users)
5. **Accessibility** (Phase 6) → User Story 4 → Deploy & Demo (audio enhancement)
6. **Flexibility** (Phase 7) → Settings → Deploy & Demo (mid-session config changes)
7. **Polish** (Phase 8 + 9) → Accessibility & Documentation → Final release

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy (If Multi-Developer)

After Foundational phase completes:

- **Developer A**: User Story 1 (T024-T032) - Critical path, MVP
- **Developer B**: User Story 3 (T042-T048) - Independent, can work in parallel
- **Developer C**: Phase 8 partial (T066-T073) - Accessibility prep

Once US1 complete:
- **Developer A**: User Story 2 (T033-T041) - Extends US1
- **Developer B**: User Story 4 (T049-T056) - Extends US1
- **Developer C**: Continue Phase 8

---

## Task Checklist Summary

**Total Tasks**: 83

**By Phase**:
- Phase 1 (Setup): 14 tasks
- Phase 2 (Foundational): 9 tasks → **BLOCKS all user stories**
- Phase 3 (US1 - MVP): 9 tasks → **Deliverable: Basic training session**
- Phase 4 (US2): 9 tasks → **Deliverable: Session control**
- Phase 5 (US3): 7 tasks → **Deliverable: Help system**
- Phase 6 (US4): 8 tasks → **Deliverable: Audio enhancement**
- Phase 7 (Settings): 9 tasks → **Deliverable: Mid-session config**
- Phase 8 (Accessibility): 10 tasks → **Deliverable: A11y compliance**
- Phase 9 (Documentation): 8 tasks → **Deliverable: Production ready**

**Parallelizable Tasks**: 35 tasks marked [P] can run concurrently

**Test Tasks**: 21 tasks (tests written FIRST per TDD)

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (MVP) = 32 tasks minimum for basic functionality

---

## Notes

- **[P] marker**: Tasks can run in parallel (different files, no blocking dependencies)
- **[Story] label**: Maps task to specific user story for traceability and independent testing
- **Test-First**: All test tasks MUST be completed and FAIL before implementation begins (TDD Red-Green-Refactor)
- **Checkpoints**: Each phase ends with validation that the increment is independently functional
- **File paths**: All paths follow structure from plan.md (src/, tests/, .github/)
- **Constitution compliance**: Tasks follow DRY, separation of concerns, test-first development, automation principles
- **MVP delivery**: After completing phases 1-3, you have a deployable minimum viable product
- **Independent stories**: US1, US3 are fully independent; US2, US4 extend US1 but maintain independent testability
