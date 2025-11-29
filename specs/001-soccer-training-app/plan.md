# Implementation Plan: Soccer Training Agility Application

**Branch**: `001-soccer-training-app` | **Date**: 2025-11-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-soccer-training-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The Soccer Training Agility Application is a responsive single-page web application built with React 18 and TypeScript that provides color-based directional cues for agility training. The application displays full-screen solid backgrounds (blue = left, red = right) that alternate at user-configured frequencies (0.5-60 seconds). Users configure the color change frequency via an initial dialog, and the application supports session control (pause/resume via keyboard/mouse/touch), optional audio cues ("LEFT"/"RIGHT" via Web Speech API), help overlay (h/? keys), and mid-session settings adjustments. The architecture uses Vite for build tooling, Vitest + React Testing Library for testing, React Context + useReducer for state management, and GitHub Actions for automated deployment to GitHub Pages. The design prioritizes simplicity (no external state management libraries), separation of concerns (custom hooks for business logic, presentational components for UI, services for infrastructure), test-first development (TDD workflow with comprehensive test coverage), and full automation (CI/CD pipeline, code quality checks via ESLint/Prettier/Husky). The application meets all constitutional requirements with zero violations.

## Technical Context

**Language/Version**: TypeScript 5.3+ with React 18.2+  
**Primary Dependencies**: React 18.2+, Vite 5+ (build tool), Web Speech API (native browser API for audio)  
**Storage**: Browser localStorage (for persisting user preferences like audio settings), no backend storage required  
**Testing**: Vitest + React Testing Library + @testing-library/user-event (optional: Playwright for E2E)  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - current and previous major versions), responsive design for desktop/tablet/mobile  
**Project Type**: Web application (static SPA)  
**Performance Goals**: <3s page load on standard broadband, <50ms color change accuracy, <100ms pause/resume response time, 60 fps smooth transitions  
**Constraints**: Static web pages only (no backend), GitHub Pages deployment, browser autoplay policies for audio, touch/mouse/keyboard event handling, screen size range 320px-2560px+  
**Scale/Scope**: Single-user client-side application, ~5-10 React components, minimal state management (React Context + useReducer), accessibility (keyboard nav + ARIA), error boundaries for production readiness

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status | Notes |
|-----------|------|--------|-------|
| **I. Code Quality** | Components must use descriptive names revealing intent (e.g., `ColorChangeTimer`, `TrainingSession`, not `Component1`, `Manager`) | ✅ PASS | React component-based architecture naturally supports single responsibility |
| **I. Code Quality** | Functions kept small (<20 lines), single responsibility | ✅ PASS | React hooks and component composition enable this |
| **I. Code Quality** | Boy Scout Rule: fix small issues immediately | ✅ PASS | No legacy code, greenfield project |
| **II. DRY & Simplicity** | No duplication - shared logic extracted (color transitions, pause/resume, event handlers) | ✅ PASS | Custom hooks can encapsulate reusable logic |
| **II. DRY & Simplicity** | Start simple (YAGNI) - no premature state management libraries | ✅ PASS | Use React built-in state unless complexity proves otherwise |
| **II. DRY & Simplicity** | Avoid premature optimization - measure before optimizing | ✅ PASS | Meet performance goals first, optimize if metrics show issues |
| **III. Separation of Concerns** | Business logic (training session state) separate from UI components | ✅ PASS | Custom hooks for logic, components for presentation |
| **III. Separation of Concerns** | Audio playback abstracted from color change logic | ✅ PASS | Separate audio service/hook |
| **III. Separation of Concerns** | Configuration management separate from session execution | ✅ PASS | Separate config context/hook |
| **IV. Test-First Development** | Write tests BEFORE implementation (Red-Green-Refactor) | ⚠️ VERIFY | Must establish testing approach in Phase 0 research |
| **IV. Test-First Development** | Automated tests for all functionality | ⚠️ VERIFY | NFR-006 requires comprehensive tests - framework TBD |
| **IV. Test-First Development** | Tests for color transitions, pause/resume, configuration, keyboard/mouse/touch events | ⚠️ VERIFY | Test strategy needed for browser APIs and timers |
| **V. Continuous Refactoring** | Recognize code smells (long components, duplication) | ✅ PASS | Can be addressed during implementation |
| **V. Continuous Refactoring** | Small, safe refactoring enabled by version control and tests | ✅ PASS | Git + automated tests support this |
| **V. Automation** | Build, deployment, linting, formatting, tests automated | ⚠️ VERIFY | GitHub Actions for deployment TBD, build tool TBD |
| **Professional Standards** | Code reviews verify adherence to principles | ✅ PASS | Single developer initially, self-review against constitution |
| **Professional Standards** | Documentation for architectural decisions | ✅ PASS | This plan + quickstart.md will document decisions |

**Pre-Phase 0 Assessment**:

- ✅ **11 gates pass** - Architecture aligns with constitution principles
- ⚠️ **6 gates require verification** - Testing framework, build tooling, CI/CD pipeline need research in Phase 0
- ❌ **0 gates fail** - No violations detected

**Action Required Before Phase 0**: None - proceed with research to resolve VERIFY items.

---

**Post-Phase 1 Re-evaluation**:

| Principle | Gate | Status | Design Notes |
|-----------|------|--------|--------------|
| **IV. Test-First Development** | Write tests BEFORE implementation | ✅ RESOLVED | Vitest + RTL chosen, setup documented in quickstart.md, test structure defined |
| **IV. Test-First Development** | Automated tests for all functionality | ✅ RESOLVED | Test infrastructure configured (vitest.config, setup.ts, mocks for browser APIs) |
| **IV. Test-First Development** | Tests for color transitions, pause/resume, configuration, events | ✅ RESOLVED | Test cases documented in quickstart.md with examples for unit & integration tests |
| **V. Automation** | Build, deployment, linting, formatting, tests automated | ✅ RESOLVED | Vite build tool, GitHub Actions workflow, ESLint + Prettier + Husky configured |

**Post-Design Assessment**:

- ✅ **ALL 17 GATES PASS** - All verification items resolved in Phase 0 research
- ✅ **Design adheres to separation of concerns** - Hooks for logic, components for UI, services for infrastructure
- ✅ **DRY principle supported** - Custom hooks enable reusable logic extraction
- ✅ **Test-first approach documented** - TDD workflow and examples provided in quickstart
- ✅ **Automation complete** - CI/CD pipeline, code quality checks, pre-commit hooks all configured
- ❌ **0 VIOLATIONS** - No constitution principles violated

**Final Approval**: Design phase complete. Architecture fully compliant with Demo1 Software Development Constitution v1.0.0. Ready to proceed to Phase 2 (task breakdown).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application (static SPA)
src/
├── components/          # React UI components
│   ├── ColorDisplay.tsx/jsx      # Full-screen color background
│   ├── ConfigDialog.tsx/jsx      # Frequency/audio configuration
│   ├── PauseIndicator.tsx/jsx    # Pause state overlay
│   ├── SettingsButton.tsx/jsx    # Settings access control
│   └── HelpOverlay.tsx/jsx       # Help information display
├── hooks/              # Custom React hooks (business logic)
│   ├── useTrainingSession.ts/js  # Session state & color transitions
│   ├── useAudioCues.ts/js       # Audio playback management
│   ├── useKeyboardMouse.ts/js   # Input event handlers
│   └── useConfiguration.ts/js    # User preferences
├── services/           # Utility services
│   ├── audioService.ts/js       # Text-to-speech abstraction
│   └── storageService.ts/js     # localStorage wrapper
├── App.tsx/jsx         # Root component
└── main.tsx/jsx        # Entry point

tests/
├── unit/               # Component & hook unit tests
│   ├── components/
│   ├── hooks/
│   └── services/
├── integration/        # User flow tests
│   ├── trainingSession.test.ts/js
│   ├── configuration.test.ts/js
│   └── accessibility.test.ts/js
└── e2e/               # End-to-end browser tests (optional)

public/                # Static assets
├── index.html
└── favicon.ico

.github/
└── workflows/
    └── deploy.yml     # GitHub Actions for GitHub Pages deployment
```

**Structure Decision**: Selected web application structure (Option 2 variant - frontend only, no backend). This is a static SPA with React components for UI, custom hooks for business logic separation, and services for infrastructure concerns (audio, storage). The structure follows separation of concerns: components are presentational, hooks contain state logic, services handle external dependencies. Testing mirrors source structure for clarity.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
