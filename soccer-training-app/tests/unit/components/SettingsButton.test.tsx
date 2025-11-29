import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsButton } from '../../../src/components/SettingsButton';

describe('SettingsButton', () => {
  it('should render button with settings label', () => {
    const handleClick = vi.fn();
    render(<SettingsButton onClick={handleClick} />);

    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<SettingsButton onClick={handleClick} />);

    await user.click(screen.getByRole('button', { name: /settings/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    const handleClick = vi.fn();
    render(<SettingsButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /settings/i });
    expect(button).toHaveAttribute('aria-label', 'Open settings');
  });

  it('should be a floating button', () => {
    const handleClick = vi.fn();
    const { container } = render(<SettingsButton onClick={handleClick} />);

    const button = container.querySelector('.settings-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('settings-button');
  });
});
