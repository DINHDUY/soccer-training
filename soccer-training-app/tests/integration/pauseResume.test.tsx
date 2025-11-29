import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Pause/Resume Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pause session when any key is pressed during active session', async () => {
    const user = userEvent.setup({ delay: null });
    
    // Set up configuration
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 2 })
    );

    const { container } = render(<App />);

    // Start session
    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    // Wait for color display to appear
    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    // Verify session is active (not paused)
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();

    console.log('About to fire keydown event');

    // Press any key to pause (fire real document event)
    await act(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(keydownEvent);
      console.log('Keydown event dispatched');
    });

    console.log('After keydown event - HTML:', container.innerHTML);

    // Verify pause indicator appears
    await waitFor(
      () => {
        console.log('Checking for PAUSED text...');
        expect(screen.getByText(/paused/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  }, 10000);

  it('should resume session when key is pressed while paused', async () => {
    const user = userEvent.setup({ delay: null });
    
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 2 })
    );

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    // Pause (fire real document event)
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });

    // Resume (fire real document event)
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
    });
  });

  it('should pause session when clicking during active session', async () => {
    const user = userEvent.setup({ delay: null });
    
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 2 })
    );

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    // Click to pause (fire real document event)
    await act(async () => {
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });
  });

  it('should resume session when clicking while paused', async () => {
    const user = userEvent.setup({ delay: null });
    
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 2 })
    );

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    // Pause (fire real document event)
    await act(async () => {
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    
    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });

    // Resume (fire real document event)
    await act(async () => {
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
    });
  });

  it('should handle touch events for pause/resume', async () => {
    const user = userEvent.setup({ delay: null });
    
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 2 })
    );

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    const colorDisplay = screen.getByTestId('color-display');

    // Simulate touch to pause
    await act(async () => {
      const touchEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
      });
      colorDisplay.dispatchEvent(touchEvent);
    });

    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });

    // Simulate touch to resume
    await act(async () => {
      const touchEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
      });
      colorDisplay.dispatchEvent(touchEvent);
    });

    await waitFor(() => {
      expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
    });
  });

  it('should not change colors while paused', async () => {
    const user = userEvent.setup({ delay: null });
    
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 1 })
    );

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    const colorDisplay = screen.getByTestId('color-display');
    const initialColor = colorDisplay.className;

    // Pause (fire real document event)
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true }));
    });
    
    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });

    // Wait a moment - color should remain the same
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(colorDisplay.className).toBe(initialColor);

    // Resume (fire real document event)
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true }));
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
    });

    // After resuming, wait for color to change (frequency is 1 second)
    await waitFor(() => {
      expect(colorDisplay.className).not.toBe(initialColor);
    }, { timeout: 2000 });
  });
});
