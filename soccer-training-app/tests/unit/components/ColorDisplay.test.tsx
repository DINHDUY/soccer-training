/**
 * ColorDisplay Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorDisplay } from '@/components/ColorDisplay';

describe('ColorDisplay', () => {
  it('should render with blue background', () => {
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('color-display', 'blue');
    expect(main).toHaveAttribute('aria-label', 'Move LEFT');
  });

  it('should render with red background', () => {
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="red" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('color-display', 'red');
    expect(main).toHaveAttribute('aria-label', 'Move RIGHT');
  });

  it('should show pause indicator when paused', () => {
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={true} onClick={handleClick} />);

    const pauseIndicator = screen.getByRole('status');
    expect(pauseIndicator).toBeInTheDocument();
    expect(pauseIndicator).toHaveTextContent('PAUSED');
  });

  it('should not show pause indicator when not paused', () => {
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const pauseIndicator = screen.queryByRole('status');
    expect(pauseIndicator).not.toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    await user.click(main);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Space key is pressed', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    main.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    main.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be keyboard accessible with tabIndex', () => {
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabIndex', '0');
  });

  it('should have aria-live for screen reader announcements', () => {
    const handleClick = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onClick={handleClick} />);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-live', 'polite');
  });
});
