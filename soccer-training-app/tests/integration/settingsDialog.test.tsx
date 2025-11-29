import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Settings Dialog Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show settings button during active session', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start session
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Settings button should be visible
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });
  });

  it('should open settings dialog and pause session', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start session
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Click settings button
    const settingsButton = await screen.findByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    // Settings dialog should open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    });

    // Session should be paused
    expect(screen.getByText(/paused/i)).toBeInTheDocument();
  });

  it('should apply new settings when saved', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start session with 2s frequency
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Open settings
    const settingsButton = await screen.findByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    // Change frequency to 1s
    const settingsFrequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(settingsFrequencyInput);
    await user.type(settingsFrequencyInput, '1');

    // Save settings
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Session should resume
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
  });

  it('should preserve old settings when canceled', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start session with 2s frequency
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Open settings
    const settingsButton = await screen.findByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    // Change frequency (but don't save)
    const settingsFrequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(settingsFrequencyInput);
    await user.type(settingsFrequencyInput, '5');

    // Cancel settings
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Session should resume with old settings
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
  });

  it('should toggle audio in settings', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start session
    await user.clear(screen.getByLabelText(/frequency/i));
    await user.type(screen.getByLabelText(/frequency/i), '2');
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Open settings
    const settingsButton = await screen.findByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    // Toggle audio
    const audioCheckbox = screen.getByLabelText(/audio/i);
    await user.click(audioCheckbox);

    // Save settings
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Settings should be saved
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should validate frequency in settings dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start session
    await user.clear(screen.getByLabelText(/frequency/i));
    await user.type(screen.getByLabelText(/frequency/i), '2');
    await user.click(screen.getByRole('button', { name: /start/i }));

    // Open settings
    const settingsButton = await screen.findByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    // Enter invalid frequency
    const settingsFrequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(settingsFrequencyInput);
    await user.type(settingsFrequencyInput, '100');

    // Try to save
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Should show error and keep dialog open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/must be between/i)).toBeInTheDocument();
  });
});
