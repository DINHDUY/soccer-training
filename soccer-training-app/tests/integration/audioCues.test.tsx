import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Audio Cues Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should play "LEFT" audio when blue appears with audio enabled', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Configure with audio enabled
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '1');

    const audioCheckbox = screen.getByLabelText(/audio/i);
    if (!(audioCheckbox as HTMLInputElement).checked) {
      await user.click(audioCheckbox); // Enable audio
    }

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    // Wait for color display to appear
    const colorDisplay = await screen.findByRole('main');
    expect(colorDisplay).toHaveClass('blue');

    // Verify "LEFT" was spoken
    await waitFor(() => {
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
      const calls = vi.mocked(window.speechSynthesis.speak).mock.calls;
      const hasLeft = calls.some(call => call[0].text === 'LEFT');
      expect(hasLeft).toBe(true);
    });
  });

  it('should play "RIGHT" audio when red appears with audio enabled', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Configure with short frequency and audio enabled
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '0.5');

    const audioCheckbox = screen.getByLabelText(/audio/i);
    if (!(audioCheckbox as HTMLInputElement).checked) {
      await user.click(audioCheckbox); // Enable audio
    }

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    // Wait for color display to appear with blue
    const colorDisplay = await screen.findByRole('main');
    expect(colorDisplay).toHaveClass('blue');

    // Wait for color change to red
    await waitFor(
      () => {
        expect(colorDisplay).toHaveClass('red');
      },
      { timeout: 1500 }
    );

    // Verify "RIGHT" was spoken
    await waitFor(() => {
      const calls = vi.mocked(window.speechSynthesis.speak).mock.calls;
      const hasRight = calls.some(call => call[0].text === 'RIGHT');
      expect(hasRight).toBe(true);
    });
  });

  it('should not play audio when audio is disabled', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Configure with audio disabled (default is unchecked)
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '0.5');

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    // Wait for color display to appear
    const colorDisplay = await screen.findByRole('main');
    expect(colorDisplay).toHaveClass('blue');

    // Wait for color change to red
    await waitFor(
      () => {
        expect(colorDisplay).toHaveClass('red');
      },
      { timeout: 1500 }
    );

    // Verify no audio was played
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('should cancel audio when session is paused', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Configure with audio enabled
    const audioCheckbox = screen.getByLabelText(/audio/i);
    if (!(audioCheckbox as HTMLInputElement).checked) {
      await user.click(audioCheckbox); // Enable audio
    }

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    // Wait for session to start
    const colorDisplay = await screen.findByRole('main');
    expect(colorDisplay).toHaveClass('blue');

    // Pause session
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));

    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });

    // Verify audio was canceled
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it('should respect audio permission denial', async () => {
    const user = userEvent.setup();

    // Simulate permission denied
    const originalSpeak = window.speechSynthesis.speak;
    window.speechSynthesis.speak = vi.fn(() => {
      throw new Error('Permission denied');
    });

    render(<App />);

    // Configure with audio enabled
    const audioCheckbox = screen.getByLabelText(/audio/i);
    if (!(audioCheckbox as HTMLInputElement).checked) {
      await user.click(audioCheckbox); // Enable audio
    }

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    // Wait for session to start
    const colorDisplay = await screen.findByRole('main');
    expect(colorDisplay).toHaveClass('blue');

    // Session should continue despite audio error
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();

    // Restore mock
    window.speechSynthesis.speak = originalSpeak;
  });

  it('should display fallback message when speechSynthesis is not supported', () => {
    // Simulate no browser support
    const originalSpeechSynthesis = window.speechSynthesis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).speechSynthesis;

    render(<App />);

    // Restore before assertions to avoid affecting other tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).speechSynthesis = originalSpeechSynthesis;
  });
});
