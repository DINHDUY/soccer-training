# Quickstart Guide

**Feature**: Soccer Training Agility Application  
**Last Updated**: 2025-11-28

## Overview

This guide helps developers quickly set up, build, and contribute to the Soccer Training Agility Application - a React-based SPA for soccer training with color-based directional cues.

## Prerequisites

- **Node.js**: 18.x or higher ([Download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with ESLint and Prettier extensions)

## Quick Start (5 minutes)

### 1. Create Project

```bash
# Create Vite project with React + TypeScript
npm create vite@latest soccer-training-app -- --template react-ts

# Navigate to project directory
cd soccer-training-app

# Install dependencies
npm install
```

### 2. Install Development Tools

```bash
# Testing framework
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui jsdom

# Code quality tools
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-jsx-a11y

# Pre-commit hooks
npm install -D husky lint-staged

# GitHub Pages deployment
npm install -D gh-pages

# Initialize Husky
npx husky install
```

### 3. Configure Project

Create/update configuration files:

**`vite.config.ts`**:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/soccer-training-app/', // Change to your GitHub repo name
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

**`tsconfig.json`** (update paths):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`.eslintrc.cjs`**:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'jsx-a11y'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

**`.prettierrc`**:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**`package.json`** (add scripts):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "prepare": "husky install"
  }
}
```

### 4. Set Up Git Hooks

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Create `.lintstagedrc`:

```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,md,json}": [
    "prettier --write"
  ]
}
```

### 5. Create Project Structure

```bash
# Create directories
mkdir -p src/{components,hooks,services,test}
mkdir -p tests/{unit,integration}
mkdir -p .github/workflows

# Create test setup file
touch src/test/setup.ts
```

**`src/test/setup.ts`**:

```typescript
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Speech API
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  pending: false,
  paused: false,
} as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
soccer-training-app/
├── src/
│   ├── components/          # React UI components
│   │   ├── ColorDisplay.tsx
│   │   ├── ConfigDialog.tsx
│   │   ├── PauseIndicator.tsx
│   │   ├── SettingsButton.tsx
│   │   └── HelpOverlay.tsx
│   ├── hooks/              # Custom React hooks (business logic)
│   │   ├── useTrainingSession.ts
│   │   ├── useAudioCues.ts
│   │   ├── useKeyboardMouse.ts
│   │   └── useConfiguration.ts
│   ├── services/           # Utility services
│   │   ├── audioService.ts
│   │   └── storageService.ts
│   ├── types/              # TypeScript types (copy from specs/contracts/)
│   │   └── index.ts
│   ├── test/               # Test utilities
│   │   └── setup.ts
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── tests/
│   ├── unit/               # Component & hook unit tests
│   └── integration/        # User flow integration tests
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── public/                 # Static assets
├── specs/                  # Feature specifications
│   └── 001-soccer-training-app/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       └── contracts/
└── package.json
```

## Development Workflow

### 1. Test-First Development (TDD)

Following Constitution Principle IV:

```bash
# Create a test file
touch tests/unit/hooks/useTrainingSession.test.ts

# Write failing test
# Implement feature to make test pass
# Refactor while keeping tests green

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Check coverage
npm run test:coverage
```

### 2. Component Development Pattern

```typescript
// 1. Define types (already in contracts/)
import type { ColorDisplayProps } from '@/types';

// 2. Write test FIRST
describe('ColorDisplay', () => {
  it('should render blue background when currentColor is blue', () => {
    // Test code here
  });
});

// 3. Implement component
export function ColorDisplay({ currentColor, isPaused, onClick }: ColorDisplayProps) {
  return (
    <main
      role="main"
      aria-live="polite"
      aria-label={`Move ${currentColor === 'blue' ? 'LEFT' : 'RIGHT'}`}
      onClick={onClick}
      style={{ 
        backgroundColor: currentColor, 
        width: '100vw', 
        height: '100vh' 
      }}
    >
      {isPaused && <PauseIndicator />}
    </main>
  );
}

// 4. Run test to verify
```

### 3. Code Quality Checks

```bash
# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Run all quality checks (pre-commit hook does this automatically)
npm run lint && npm test
```

### 4. Git Workflow

```bash
# Create feature branch
git checkout -b feature/color-display-component

# Make changes, commit frequently
git add src/components/ColorDisplay.tsx tests/unit/components/ColorDisplay.test.tsx
git commit -m "Add ColorDisplay component with tests"

# Pre-commit hook runs automatically (lint + format)

# Push to GitHub
git push origin feature/color-display-component

# Create pull request on GitHub
```

## Key Implementation Patterns

### 1. Custom Hooks for Business Logic

**Separation of Concerns**: Keep components presentational, hooks handle logic.

```typescript
// src/hooks/useTrainingSession.ts
import { useReducer, useEffect, useRef } from 'react';
import type { TrainingSession, SessionAction } from '@/types';

function sessionReducer(state: TrainingSession, action: SessionAction): TrainingSession {
  switch (action.type) {
    case 'START':
      return { 
        ...state, 
        isActive: true, 
        startTime: Date.now(),
        frequency: action.frequency,
      };
    case 'PAUSE':
      return { ...state, isPaused: true, pauseTime: Date.now() };
    case 'RESUME':
      return { ...state, isPaused: false, pauseTime: null };
    case 'COLOR_CHANGE':
      return { 
        ...state, 
        currentColor: state.currentColor === 'blue' ? 'red' : 'blue',
        colorChangeCount: state.colorChangeCount + 1,
      };
    default:
      return state;
  }
}

export function useTrainingSession() {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  
  // Timer logic here
  
  return {
    session,
    start: (frequency: number) => dispatch({ type: 'START', frequency }),
    pause: () => dispatch({ type: 'PAUSE' }),
    resume: () => dispatch({ type: 'RESUME' }),
  };
}
```

### 2. Web Speech API Integration

```typescript
// src/services/audioService.ts
export const audioService = {
  isSupported: () => 'speechSynthesis' in window,
  
  speak: (text: 'LEFT' | 'RIGHT') => {
    if (!audioService.isSupported()) {
      console.warn('Speech synthesis not supported');
      return;
    }
    
    window.speechSynthesis.cancel(); // Cancel pending speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2; // Faster for training urgency
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  },
  
  cancel: () => {
    if (audioService.isSupported()) {
      window.speechSynthesis.cancel();
    }
  },
};
```

### 3. localStorage Persistence

```typescript
// src/services/storageService.ts
import type { UserConfiguration } from '@/types';

const STORAGE_KEY = 'soccer-training-config';

export const storageService = {
  loadConfig: (): UserConfiguration | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load config:', error);
      return null;
    }
  },
  
  saveConfig: (config: UserConfiguration): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },
  
  clearConfig: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
```

## Deployment

### GitHub Pages Setup

1. **Create GitHub Repository**:

```bash
git remote add origin https://github.com/YOUR_USERNAME/soccer-training-app.git
git push -u origin main
```

2. **Create GitHub Actions Workflow** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

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
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Save

4. **Deploy**:

```bash
git add .
git commit -m "Add deployment workflow"
git push origin main
```

Application will be available at: `https://YOUR_USERNAME.github.io/soccer-training-app/`

## Testing Guide

### Unit Test Example

```typescript
// tests/unit/hooks/useTrainingSession.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTrainingSession } from '@/hooks/useTrainingSession';

describe('useTrainingSession', () => {
  it('should start with initial state', () => {
    const { result } = renderHook(() => useTrainingSession());
    
    expect(result.current.session.isActive).toBe(false);
    expect(result.current.session.currentColor).toBe('blue');
  });
  
  it('should start session with specified frequency', () => {
    const { result } = renderHook(() => useTrainingSession());
    
    act(() => {
      result.current.start(2.5);
    });
    
    expect(result.current.session.isActive).toBe(true);
    expect(result.current.session.frequency).toBe(2.5);
  });
  
  it('should toggle pause state', () => {
    const { result } = renderHook(() => useTrainingSession());
    
    act(() => {
      result.current.start(2);
      result.current.pause();
    });
    
    expect(result.current.session.isPaused).toBe(true);
    
    act(() => {
      result.current.resume();
    });
    
    expect(result.current.session.isPaused).toBe(false);
  });
});
```

### Integration Test Example

```typescript
// tests/integration/trainingSession.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '@/App';

describe('Training Session Flow', () => {
  it('should complete full training session flow', async () => {
    render(<App />);
    
    // Config dialog should appear on first load
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Submit configuration
    const frequencyInput = screen.getByLabelText(/frequency/i);
    fireEvent.change(frequencyInput, { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    
    // Session should start with blue background
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveStyle({ backgroundColor: 'blue' });
    
    // Wait for color change (1 second)
    await waitFor(
      () => {
        expect(mainElement).toHaveStyle({ backgroundColor: 'red' });
      },
      { timeout: 1500 }
    );
    
    // Pause session
    fireEvent.click(mainElement);
    expect(screen.getByText(/paused/i)).toBeInTheDocument();
    
    // Resume session
    fireEvent.click(mainElement);
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

**Issue**: Vite dev server not starting  
**Solution**: Check Node.js version (`node --version` should be 18+)

**Issue**: Tests failing with "ReferenceError: localStorage is not defined"  
**Solution**: Ensure `src/test/setup.ts` is configured in `vite.config.ts`

**Issue**: GitHub Pages shows 404 error  
**Solution**: Check `base` path in `vite.config.ts` matches your repo name

**Issue**: Audio not playing on iOS  
**Solution**: Audio requires user interaction first (wait for first pause/resume)

**Issue**: ESLint errors on import paths  
**Solution**: Ensure path aliases are configured in both `tsconfig.json` and `vite.config.ts`

## Next Steps

1. Review `/specs/001-soccer-training-app/data-model.md` for entity definitions
2. Review `/specs/001-soccer-training-app/contracts/` for TypeScript types
3. Implement core hooks (`useTrainingSession`, `useAudioCues`)
4. Build UI components (`ColorDisplay`, `ConfigDialog`)
5. Write tests for each component/hook (TDD approach)
6. Deploy to GitHub Pages

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [GitHub Actions](https://docs.github.com/en/actions)

## Support

For questions or issues, refer to:
- `/specs/001-soccer-training-app/spec.md` - Full feature specification
- `/specs/001-soccer-training-app/research.md` - Technology decisions and rationale
- `.specify/memory/constitution.md` - Code quality principles
