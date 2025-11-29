# Research & Technology Decisions

**Feature**: Soccer Training Agility Application  
**Phase**: 0 (Research)  
**Date**: 2025-11-28

## Overview

This document resolves all NEEDS CLARIFICATION items from the Technical Context and documents technology choices with rationale.

## Research Tasks

### 1. React Version Selection

**Decision**: React 18.2+ (latest stable)

**Rationale**:
- React 18 introduced concurrent features and automatic batching, improving performance for frequent state updates (critical for timer-based color changes)
- Stable release with wide ecosystem support
- Backward compatible with most libraries
- Built-in error boundaries align with NFR-009 (production-ready error handling)
- Suspense and transitions can enhance future features without refactoring

**Alternatives Considered**:
- React 17: Lacks concurrent features, no significant advantage for this use case
- React 19 (beta): Too unstable for production-ready requirement (NFR-002)

**Best Practices**:
- Use functional components with hooks exclusively (no class components)
- Leverage React.StrictMode in development to catch potential issues
- Use React.memo() only when performance profiling proves necessary (avoid premature optimization)

---

### 2. Build Tool & Project Setup

**Decision**: Vite 5+ with React-TypeScript template

**Rationale**:
- Fastest development server with HMR (<100ms hot reload)
- Native ESM support reduces build complexity
- Optimized production builds with Rollup
- TypeScript support out-of-the-box improves code quality (aligns with Constitution I: Code Quality)
- Simpler configuration than Webpack (follows Constitution II: Simplicity First)
- Better developer experience for small-to-medium SPAs
- Built-in GitHub Pages deployment support via plugins

**Alternatives Considered**:
- Create React App (CRA): Slower dev server, webpack-based, less actively maintained, more complex eject process
- Webpack directly: Over-engineering for this project size, violates YAGNI principle
- Next.js: Overkill for static SPA with no SSR requirements, adds unnecessary complexity

**Best Practices**:
- Use `npm create vite@latest` for project initialization
- Enable TypeScript strict mode for type safety
- Configure path aliases for cleaner imports (`@/components`, `@/hooks`)
- Use Vite's environment variables for configuration management

**Setup Command**:
```bash
npm create vite@latest soccer-training-app -- --template react-ts
```

---

### 3. Text-to-Speech Audio Library

**Decision**: Web Speech API (native browser API) with fallback message

**Rationale**:
- Zero dependencies - no external library needed (aligns with Constitution II: Simplicity First)
- Native browser support in Chrome, Safari, Edge, Firefox
- Built-in voice synthesis with language support
- No bundle size increase
- Sufficient for "LEFT"/"RIGHT" simple audio cues
- Handles browser autoplay policies naturally

**Implementation Pattern**:
```typescript
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2; // Slightly faster for training urgency
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported');
  }
};
```

**Alternatives Considered**:
- react-speech-kit: Wrapper around Web Speech API, adds unnecessary abstraction
- Amazon Polly / Google TTS: Requires backend integration, violates static-only constraint
- Pre-recorded audio files: Increases bundle size, less flexible for future enhancements (e.g., different languages)
- Howler.js with audio files: Over-engineering for two-word vocabulary

**Browser Compatibility**:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS requires user interaction first)
- Fallback: Visual-only training (already fully functional per NFR-004)

**Best Practices**:
- Wrap in error boundary to prevent crashes if API fails
- Cancel pending speech on pause to avoid delayed audio
- Test on iOS Safari specifically (requires user gesture before first speech)

---

### 4. Testing Framework

**Decision**: Vitest + React Testing Library + Playwright (optional E2E)

**Rationale**:

**Vitest for Unit/Integration Tests**:
- Native Vite integration (same config, instant setup)
- Jest-compatible API (familiar syntax, easy migration)
- Fast execution with native ESM support
- Built-in coverage reporting with c8
- Better TypeScript support than Jest
- Component and hook testing with @testing-library/react

**React Testing Library**:
- Tests user behavior, not implementation details (aligns with Constitution IV: Test-First)
- Accessibility-focused queries encourage better a11y (supports NFR-010)
- Works seamlessly with Vitest
- Industry standard for React testing

**Playwright (E2E - Optional Phase)**:
- Real browser testing for touch/keyboard/mouse events (critical for FR-009/010/011)
- Cross-browser support (Chrome, Firefox, Safari)
- Can defer to later phase if time-constrained
- Not required for MVP (unit tests cover core logic)

**Alternatives Considered**:
- Jest: Slower with React + TypeScript, requires additional babel config, less Vite integration
- Cypress: Heavier than Playwright, slower test execution, less TypeScript support
- No E2E testing: Risk missing browser-specific issues (timer accuracy, speech API quirks)

**Best Practices**:
- Test-First Development (TFD): Write tests before implementation (Constitution IV)
- Test color transition logic with fake timers (`vi.useFakeTimers()`)
- Test keyboard/mouse/touch event handlers with `fireEvent` or `userEvent`
- Mock Web Speech API in tests to avoid flakiness
- Aim for 80%+ coverage (SC-011 requirement)
- Integration tests for complete user flows (User Story acceptance scenarios)

**Setup Commands**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui
npm install -D @playwright/test  # Optional for E2E
```

**Test Structure**:
```
tests/
├── unit/
│   ├── components/*.test.tsx    # Component rendering & interactions
│   ├── hooks/*.test.ts          # Custom hook logic
│   └── services/*.test.ts       # Audio/storage services
├── integration/
│   ├── trainingSession.test.tsx  # Full session flow
│   ├── configuration.test.tsx    # Config dialog → session
│   └── accessibility.test.tsx    # Keyboard nav, ARIA
└── e2e/                          # Playwright (optional)
    └── userFlows.spec.ts         # Real browser scenarios
```

---

### 5. State Management

**Decision**: React Context API + useReducer (no external library)

**Rationale**:
- Application state is simple: session state, config, pause status
- React's built-in Context sufficient for component communication (follows Constitution II: YAGNI)
- useReducer provides predictable state transitions for training session lifecycle
- No need for Redux/Zustand/Jotai complexity
- Easier to test (pure reducer functions)
- Zero bundle size overhead

**State Structure**:
```typescript
type AppState = {
  session: {
    isRunning: boolean;
    isPaused: boolean;
    currentColor: 'blue' | 'red';
    frequency: number; // seconds
    colorChangeCount: number;
  };
  config: {
    audioEnabled: boolean;
    showHelp: boolean;
    showSettings: boolean;
  };
};
```

**Alternatives Considered**:
- Redux Toolkit: Over-engineering for this simple state, adds boilerplate
- Zustand: Cleaner than Redux but still unnecessary for this scope
- useState only: Becomes messy with multiple related state variables, harder to test

**Best Practices**:
- Single AppContext for global state
- Separate contexts if state updates cause performance issues (measure first)
- Custom hooks to encapsulate context logic (`useTrainingSession`, `useAppConfig`)
- Reducer for session state transitions (start/pause/resume/colorChange)

---

### 6. CI/CD & Deployment Automation

**Decision**: GitHub Actions → GitHub Pages (gh-pages branch)

**Rationale**:
- Native GitHub integration (no external accounts needed per clarification)
- Free for public repositories
- Automated deployment on push to main branch
- Simple workflow configuration
- Supports custom domains if needed later
- Vite provides `vite build` for optimized production builds

**Workflow**:
1. Push to main branch
2. GitHub Actions triggers
3. Install dependencies (`npm ci`)
4. Run tests (`npm test`)
5. Build production bundle (`npm run build`)
6. Deploy to gh-pages branch
7. GitHub Pages serves from gh-pages

**GitHub Actions Configuration** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Alternatives Considered**:
- Netlify/Vercel: External accounts required, overkill for static site
- GitHub Actions → S3/CloudFront: Unnecessary AWS complexity, costs
- Manual deployment: Violates Constitution V: Automation

**Best Practices**:
- Configure base path in `vite.config.ts` for GitHub Pages subdirectory
- Add build status badge to README
- Run tests before deployment (fail fast on broken builds)
- Cache node_modules in GitHub Actions for faster builds

---

### 7. Code Quality Automation

**Decision**: ESLint + Prettier + Husky (pre-commit hooks)

**Rationale**:
- Automated code quality checks align with Constitution V: Automation
- ESLint catches bugs and enforces best practices
- Prettier eliminates style debates (Constitution I: Code Quality)
- Husky ensures standards before commit (prevent broken code in main)
- TypeScript + ESLint + Prettier = comprehensive quality gate

**ESLint Configuration**:
- `@typescript-eslint/recommended`: TypeScript best practices
- `eslint-plugin-react-hooks`: Catches hook dependency issues
- `eslint-plugin-jsx-a11y`: Accessibility linting (supports NFR-010)

**Prettier Configuration**:
- Single quotes, 2-space indent, semicolons (team preference)
- Integrated with ESLint via `eslint-config-prettier`

**Husky Pre-commit Hooks**:
- Run `lint-staged` to check only changed files
- Format with Prettier
- Lint with ESLint
- Run related tests (optional: can slow down commits)

**Setup Commands**:
```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-jsx-a11y
npm install -D husky lint-staged
npx husky install
```

**Alternatives Considered**:
- Manual linting: Error-prone, violates automation principle
- Skip Prettier: Style inconsistencies slow code reviews
- Skip pre-commit hooks: Risk committing broken code

---

### 8. Accessibility Implementation

**Decision**: Semantic HTML + ARIA + Keyboard Navigation + React Testing Library a11y queries

**Rationale**:
- NFR-010 requires basic keyboard navigation and ARIA labels
- Use semantic HTML elements (`<button>`, `<dialog>`, `<main>`) for free accessibility
- ARIA live regions for screen reader announcements
- Focus management for dialogs and help overlay
- Keyboard shortcuts (h/?, Esc to close dialogs, Space/Enter for pause)

**Implementation Pattern**:
```tsx
// Color display with ARIA live region
<main
  role="main"
  aria-live="polite"
  aria-label={`Training session: Move ${currentColor === 'blue' ? 'LEFT' : 'RIGHT'}`}
  style={{ backgroundColor: currentColor }}
>
  {isPaused && <PauseIndicator />}
</main>

// Config dialog with focus trap
<dialog open={showConfig} aria-labelledby="config-title">
  <h2 id="config-title">Configure Training Session</h2>
  <form onSubmit={handleSubmit}>
    <label htmlFor="frequency">Color change frequency (seconds):</label>
    <input id="frequency" type="number" autoFocus />
  </form>
</dialog>
```

**ARIA Announcements**:
- Session start: "Training session started"
- Color change: "Move LEFT" / "Move RIGHT"
- Pause: "Session paused"
- Resume: "Session resumed"

**Keyboard Navigation**:
- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons, pause/resume
- Escape: Close dialogs/help
- h/?: Open help overlay

**Testing**:
- Use `@testing-library/react` a11y queries (`getByRole`, `getByLabelText`)
- Run `axe-core` or `jest-axe` for automated a11y checks

**Alternatives Considered**:
- Full WCAG 2.1 AAA compliance: Over-engineering for MVP (basic compliance sufficient per NFR-010)
- Skip ARIA: Fails accessibility requirement

---

## Summary of Resolved Clarifications

| Item | Decision | Key Rationale |
|------|----------|---------------|
| React Version | React 18.2+ | Concurrent features, stable, aligns with performance goals |
| Build Tool | Vite 5+ with TypeScript | Fastest dev experience, simple config, GitHub Pages support |
| Audio Library | Web Speech API (native) | Zero dependencies, sufficient for simple cues, native browser support |
| Testing Framework | Vitest + RTL + Playwright | Vite-native, fast, Jest-compatible, accessibility-focused |
| State Management | React Context + useReducer | YAGNI - built-in solution sufficient for simple state |
| CI/CD | GitHub Actions → GitHub Pages | Native integration, free, automated deployment |
| Code Quality | ESLint + Prettier + Husky | Automated quality gates, enforces constitution principles |
| Accessibility | Semantic HTML + ARIA | Meets NFR-010, testable with RTL, low complexity |

## Technology Stack Finalized

**Language**: TypeScript 5.3+  
**Framework**: React 18.2+  
**Build Tool**: Vite 5+  
**Testing**: Vitest + React Testing Library + Playwright (optional E2E)  
**Audio**: Web Speech API (native)  
**State**: React Context API + useReducer  
**Deployment**: GitHub Actions → GitHub Pages  
**Code Quality**: ESLint + Prettier + Husky + TypeScript strict mode  
**Accessibility**: Semantic HTML + ARIA + keyboard navigation

## Next Steps (Phase 1)

All NEEDS CLARIFICATION items resolved. Proceed to:

1. Generate `data-model.md` with entity definitions
2. Generate API contracts (component props interfaces in `/contracts/`)
3. Generate `quickstart.md` for developer onboarding
4. Update agent context with finalized technology stack
