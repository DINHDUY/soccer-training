/**
 * ConfigDialog Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigDialog } from '@/components/ConfigDialog';
import { VALIDATION_CONSTRAINTS } from '@/types';

describe('ConfigDialog', () => {
  it('should render with default values', () => {
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/color change frequency/i)).toHaveValue(
      VALIDATION_CONSTRAINTS.DEFAULT_FREQUENCY
    );
    expect(screen.getByLabelText(/enable audio cues/i)).not.toBeChecked();
  });

  it('should render with custom default values', () => {
    const handleSubmit = vi.fn();
    render(
      <ConfigDialog
        onSubmit={handleSubmit}
        defaultFrequency={5}
        defaultAudioEnabled={true}
      />
    );

    expect(screen.getByLabelText(/color change frequency/i)).toHaveValue(5);
    expect(screen.getByLabelText(/enable audio cues/i)).toBeChecked();
  });

  it('should call onSubmit with form values when submitted', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const audioCheckbox = screen.getByLabelText(/enable audio cues/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '3.5');
    await user.click(audioCheckbox);
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(3.5, true);
  });

  it('should validate minimum frequency', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '0.2'); // Below minimum
    await user.click(submitButton);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/frequency must be between/i)).toBeInTheDocument();
  });

  it('should validate maximum frequency', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '100'); // Above maximum
    await user.click(submitButton);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/frequency must be between/i)).toBeInTheDocument();
  });

  it('should accept valid frequency within range', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2.5');
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(2.5, false);
    expect(screen.queryByText(/frequency must be between/i)).not.toBeInTheDocument();
  });

  it('should clear error when valid value is entered after invalid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const frequencyInput = screen.getByLabelText(/color change frequency/i);
    const submitButton = screen.getByRole('button', { name: /start training/i });

    // Enter invalid value
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '0.2');
    await user.click(submitButton);

    expect(screen.getByText(/frequency must be between/i)).toBeInTheDocument();

    // Enter valid value
    await user.clear(frequencyInput);
    await user.type(frequencyInput, '2');
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith(2, false);
    expect(screen.queryByText(/frequency must be between/i)).not.toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'config-title');
  });

  it('should toggle audio checkbox', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ConfigDialog onSubmit={handleSubmit} />);

    const audioCheckbox = screen.getByLabelText(/enable audio cues/i);

    expect(audioCheckbox).not.toBeChecked();

    await user.click(audioCheckbox);
    expect(audioCheckbox).toBeChecked();

    await user.click(audioCheckbox);
    expect(audioCheckbox).not.toBeChecked();
  });
});
