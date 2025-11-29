import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PauseIndicator } from '../../../src/components/PauseIndicator';

describe('PauseIndicator', () => {
  it('should render pause indicator when isPaused is true', () => {
    render(<PauseIndicator isPaused={true} />);
    
    expect(screen.getByText('PAUSED')).toBeInTheDocument();
  });

  it('should not render when isPaused is false', () => {
    render(<PauseIndicator isPaused={false} />);
    
    expect(screen.queryByText('PAUSED')).not.toBeInTheDocument();
  });

  it('should display resume hint text', () => {
    render(<PauseIndicator isPaused={true} />);
    
    expect(
      screen.getByText('Press any key or tap to resume')
    ).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(<PauseIndicator isPaused={true} />);
    
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(indicator).toHaveAttribute('aria-label', 'Training paused');
  });

  it('should have pause-indicator class for styling', () => {
    render(<PauseIndicator isPaused={true} />);
    
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveClass('pause-indicator');
  });

  it('should render with correct structure', () => {
    const { container } = render(<PauseIndicator isPaused={true} />);
    
    expect(container.querySelector('.pause-indicator')).toBeInTheDocument();
    expect(
      container.querySelector('.pause-indicator__content')
    ).toBeInTheDocument();
    expect(container.querySelector('.pause-indicator__text')).toBeInTheDocument();
    expect(container.querySelector('.pause-indicator__hint')).toBeInTheDocument();
  });

  it('should return null and not render anything when not paused', () => {
    const { container } = render(<PauseIndicator isPaused={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should toggle visibility when isPaused changes', () => {
    const { rerender } = render(<PauseIndicator isPaused={false} />);
    
    expect(screen.queryByText('PAUSED')).not.toBeInTheDocument();
    
    rerender(<PauseIndicator isPaused={true} />);
    expect(screen.getByText('PAUSED')).toBeInTheDocument();
    
    rerender(<PauseIndicator isPaused={false} />);
    expect(screen.queryByText('PAUSED')).not.toBeInTheDocument();
  });
});
