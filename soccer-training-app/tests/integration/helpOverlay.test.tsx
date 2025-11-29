import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Help Overlay Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show help overlay when h key is pressed', async () => {
    const user = userEvent.setup({ delay: null });
    
    localStorage.setItem(
      'soccer-training-config',
      JSON.stringify({ frequency: 2 })
    );

    render(<App />);

    // Start session
    const startButton = screen.getByRole('button', { name: /start training/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('color-display')).toBeInTheDocument();
    });

    // Press 'h' to show help
    await act(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'h',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(keydownEvent);
    });

    // Help overlay should appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /help/i })).toBeInTheDocument();
    });
  });

  it('should show help overlay when ? key is pressed', async () => {
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

    // Press '?' to show help
    await act(async () => {
      const keydownEvent = new KeyboardEvent('keydown', {
        key: '?',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(keydownEvent);
    });

    // Help overlay should appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should close help overlay when Escape is pressed', async () => {
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

    // Open help
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close help with Escape
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should preserve running session state when help is opened and closed', async () => {
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

    // Session is running, not paused
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();

    // Open help
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close help
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Session should still be running (not paused)
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('color-display')).toBeInTheDocument();
  });

  it('should preserve paused session state when help is opened and closed', async () => {
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

    // Pause the session
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
    });

    // Open help
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close help
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Session should still be paused
    expect(screen.getByText(/paused/i)).toBeInTheDocument();
  });

  it('should display help content explaining controls', async () => {
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

    // Open help
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check for key content
    expect(screen.getAllByText(/blue/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/left/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/red/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/right/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/pause/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/resume/i).length).toBeGreaterThan(0);
  });
});
