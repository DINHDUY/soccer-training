# Soccer Training Agility App ⚽

A responsive React web application for soccer agility training with color-based directional cues.

## 🎯 Features

- **Color-Based Directional Cues**: Blue = Move LEFT, Red = Move RIGHT
- **Configurable Frequency**: Set color change intervals from 0.5 to 60 seconds
- **Audio Cues** (Optional): Voice announcements for "LEFT" and "RIGHT"
- **Session Control**: Pause/resume with keyboard, mouse, or touch
- **Help Overlay**: Press `h` or `?` for instructions
- **Settings**: Adjust frequency and audio during active sessions
- **Fully Accessible**: Keyboard navigation, ARIA labels, and screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile devices (320px+)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/DINHDUY/soccer-training.git
cd soccer-training-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

1. **Configure**: On first load, set your preferred color change frequency and audio preference
2. **Start Training**: Click "Start Training" to begin
3. **Practice**: Move in the direction indicated by the screen color
4. **Pause/Resume**: Press any key, click, or tap to pause/resume
5. **Help**: Press \`h\` or \`?\` anytime to view instructions
6. **Settings**: Click the settings button to adjust frequency or audio during the session

### Keyboard Shortcuts

- \`Any key\`, \`Click\`, or \`Touch\` - Pause/Resume training
- \`h\` or \`?\` - Show help overlay
- \`Escape\` - Close dialogs/overlays
- \`Tab\` - Navigate between interactive elements
- \`Enter\`/\`Space\` - Activate buttons

## 🏗️ Tech Stack

- **Framework**: React 19.2+ with TypeScript 5.9+
- **Build Tool**: Vite 7.2+
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky
- **Audio**: Web Speech API (native browser)
- **State Management**: React Context + useReducer
- **Deployment**: GitHub Actions → GitHub Pages

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **139 total tests** (128 passing)
- Unit tests for all components and hooks
- Integration tests for user flows
- Accessibility tests for keyboard navigation and ARIA

## 🔨 Development

```bash
# Start dev server with hot reload
npm run dev

# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
soccer-training-app/
├── src/
│   ├── components/       # React UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Utility services
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Root component with error boundary
├── tests/
│   ├── unit/             # Component & hook unit tests
│   └── integration/      # User flow integration tests
└── specs/                # Feature specifications
```

## 📦 Deployment

The app automatically deploys to GitHub Pages on push to \`main\` branch via GitHub Actions.

### Manual Deployment

```bash
npm run deploy
```

## ♿ Accessibility

This application follows WCAG 2.1 guidelines and includes:

- **Keyboard Navigation**: All functionality accessible via keyboard
- **ARIA Labels**: Descriptive labels for screen readers
- **Live Regions**: Dynamic announcements for color changes
- **Focus Management**: Proper focus indicators and dialog focus traps
- **Responsive Design**: Adapts to screen sizes from 320px to 2560px+
- **Reduced Motion**: Respects \`prefers-reduced-motion\` preference

## 🐛 Troubleshooting

**Audio not working on iOS**:  
Audio requires user interaction first. Pause and resume the session after starting.

**Colors not changing**:  
Check that the frequency is set correctly (0.5-60 seconds). Try refreshing the page.

**Settings button not visible**:  
The settings button only appears during an active session.

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📚 Documentation

For detailed technical documentation, see the \`specs/001-soccer-training-app/\` directory.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
- Tested with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react)
- Uses native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
