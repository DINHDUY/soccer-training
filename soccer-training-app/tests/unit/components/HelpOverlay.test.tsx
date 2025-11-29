import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelpOverlay } from '../../../src/components/HelpOverlay';

describe('HelpOverlay', () => {
  it('should render help overlay when visible', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={false} onClose={onClose} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should display help title', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    expect(screen.getByRole('heading', { name: /help/i, level: 2 })).toBeInTheDocument();
  });

  it('should explain blue means left', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    expect(screen.getByText(/blue/i)).toBeInTheDocument();
    expect(screen.getByText(/left/i)).toBeInTheDocument();
  });

  it('should explain red means right', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    const text = container.textContent || '';
    expect(text).toMatch(/red/i);
    expect(text).toMatch(/right/i);
  });

  it('should explain pause/resume controls', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    const pauseText = screen.getByText(/pause.*resume/i);
    expect(pauseText).toBeInTheDocument();
  });

  it('should explain help keyboard shortcuts', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    // Check for 'h' and '?' keys in the controls section
    const text = container.textContent || '';
    expect(text).toMatch(/h/i);
    expect(text).toMatch(/\?/);
  });

  it('should have proper ARIA attributes', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label');
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    const dialog = screen.getByRole('dialog');
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    dialog.dispatchEvent(event);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have close hint text', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpOverlay isVisible={true} onClose={onClose} />);
    
    const closeHint = container.querySelector('.help-close-hint');
    expect(closeHint).toBeInTheDocument();
    expect(closeHint).toHaveTextContent(/close/i);
  });
});
