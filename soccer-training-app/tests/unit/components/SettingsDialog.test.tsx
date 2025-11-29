import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsDialog } from '../../../src/components/SettingsDialog';

describe('SettingsDialog', () => {
  const defaultProps = {
    isOpen: true,
    currentFrequency: 2,
    currentAudioEnabled: false,
    onSave: vi.fn(),
    onCancel: vi.fn(),
  };

  it('should render dialog when open', () => {
    render(<SettingsDialog {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<SettingsDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should show current frequency value', () => {
    render(<SettingsDialog {...defaultProps} currentFrequency={3.5} />);

    const input = screen.getByLabelText(/frequency/i) as HTMLInputElement;
    expect(input.value).toBe('3.5');
  });

  it('should show current audio setting', () => {
    render(<SettingsDialog {...defaultProps} currentAudioEnabled={true} />);

    const checkbox = screen.getByLabelText(/audio/i) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should call onSave with new values', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsDialog {...defaultProps} onSave={onSave} />);

    // Change frequency
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '5');

    // Toggle audio
    const audioCheckbox = screen.getByLabelText(/audio/i);
    await user.click(audioCheckbox);

    // Save
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(5, true);
  });

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<SettingsDialog {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should validate frequency range', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsDialog {...defaultProps} onSave={onSave} />);

    // Enter invalid frequency (too high)
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '100');

    // Try to save
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Should show error
    expect(screen.getByText(/must be between/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(<SettingsDialog {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('should show both save and cancel buttons', () => {
    render(<SettingsDialog {...defaultProps} />);

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should not call onSave with invalid frequency', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsDialog {...defaultProps} onSave={onSave} />);

    // Enter invalid frequency (too low)
    const frequencyInput = screen.getByLabelText(/frequency/i);
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '0.1');

    // Try to save
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).not.toHaveBeenCalled();
  });
});
