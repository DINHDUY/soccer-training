/**
 * ColorDisplay Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorDisplay } from '@/components/ColorDisplay';

// Mock useKeyboardMouse hook
vi.mock('@/hooks/useKeyboardMouse', () => ({
  useKeyboardMouse: vi.fn(),
}));

describe('ColorDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with blue background', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('color-display', 'blue');
    expect(main).toHaveAttribute('aria-label', 'Move LEFT');
  });

  it('should render with red background', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="red" isPaused={false} onPauseResume={handlePauseResume} />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('color-display', 'red');
    expect(main).toHaveAttribute('aria-label', 'Move RIGHT');
  });

  it('should show PauseIndicator when paused', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={true} onPauseResume={handlePauseResume} />);

    expect(screen.getByText('PAUSED')).toBeInTheDocument();
    expect(screen.getByText('Press any key or tap to resume')).toBeInTheDocument();
  });

  it('should not show PauseIndicator when not paused', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />);

    expect(screen.queryByText('PAUSED')).not.toBeInTheDocument();
  });

  it('should have data-testid for integration tests', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />);

    expect(screen.getByTestId('color-display')).toBeInTheDocument();
  });

  it('should be keyboard accessible with tabIndex', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabIndex', '0');
  });

  it('should have aria-live for screen reader announcements', () => {
    const handlePauseResume = vi.fn();
    render(<ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-live', 'polite');
  });

  it('should call useKeyboardMouse with onPauseResume handler', async () => {
    const { useKeyboardMouse } = await import('@/hooks/useKeyboardMouse');
    const handlePauseResume = vi.fn();
    
    render(<ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />);

    expect(useKeyboardMouse).toHaveBeenCalledWith(handlePauseResume, { onHelp: undefined });
  });

  it('should log pause state changes', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const handlePauseResume = vi.fn();
    
    const { rerender } = render(
      <ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />
    );

    // Pause
    rerender(
      <ColorDisplay currentColor="blue" isPaused={true} onPauseResume={handlePauseResume} />
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] Session paused/)
    );

    // Resume
    rerender(
      <ColorDisplay currentColor="blue" isPaused={false} onPauseResume={handlePauseResume} />
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] Session resumed/)
    );

    consoleSpy.mockRestore();
  });
});
