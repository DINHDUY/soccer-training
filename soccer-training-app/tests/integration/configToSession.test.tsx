/**
 * Integration Test: Configuration to Session Flow
 * 
 * Tests the complete user journey from configuration to training session
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

describe('Configuration to Session Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
    
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
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as SpeechSynthesis;
    
    global.SpeechSynthesisUtterance = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show configuration dialog on first run', () => {
    render(<App />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Training Configuration')).toBeInTheDocument();
  });

  it('should start session after configuration submission', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill in configuration
    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(submitButton);

    // Dialog should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Color display should be visible
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('color-display');
  });

  it('should display initial blue color after starting session', async () => {
    const user = userEvent.setup();
    render(<App />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(submitButton);

    const colorDisplay = screen.getByRole('main');
    expect(colorDisplay).toHaveClass('blue');
    expect(colorDisplay).toHaveAttribute('aria-label', 'Move LEFT');
  });

  it('should persist configuration to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const audioCheckbox = screen.getByLabelText(/enable audio cues/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '3.5');
    await user.click(audioCheckbox);
    await user.click(submitButton);

    // Wait for color display to appear (indicating state updated)
    await screen.findByRole('main');

    // Check localStorage - use correct key
    const storedConfig = localStorage.getItem('soccer-training-config');
    expect(storedConfig).not.toBeNull();
    
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      expect(config.frequency).toBe(3.5);
      expect(config.audioEnabled).toBe(true);
      expect(config.hasCompletedFirstRun).toBe(true);
    }
  });

  it('should not show configuration dialog on subsequent runs', async () => {
    // Set up localStorage as if first run completed - use correct key
    localStorage.setItem('soccer-training-config', JSON.stringify({
      frequency: 2,
      audioEnabled: false,
      hasCompletedFirstRun: true,
      audioPermissionGranted: false,
    }));

    render(<App />);

    // Dialog should not be present
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Color display should be visible immediately
    await screen.findByRole('main');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
