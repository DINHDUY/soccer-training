/**
 * Accessibility Integration Tests
 * 
 * Comprehensive tests for keyboard navigation, ARIA attributes, 
 * screen reader announcements, and focus management.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Accessibility Integration', () => {
  beforeEach(() => {
    // Mock speechSynthesis for audio tests
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
      pause: vi.fn(),
      resume: vi.fn(),
      pending: false,
      paused: false,
      speaking: false,
    } as SpeechSynthesis;
  });

  describe('Keyboard Navigation', () => {
    it('should allow Tab navigation through config form', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Tab should reach frequency input
      await user.tab();
      const frequencyInput = screen.getByLabelText(/color change frequency/i);
      expect(frequencyInput).toHaveFocus();

      // Tab should reach audio checkbox
      await user.tab();
      const audioCheckbox = screen.getByLabelText(/enable audio cues/i);
      expect(audioCheckbox).toHaveFocus();

      // Tab should reach submit button
      await user.tab();
      const submitButton = screen.getByRole('button', { name: /start training/i });
      expect(submitButton).toHaveFocus();
    });

    it('should activate buttons with Enter key', async () => {
      const user = userEvent.setup();
      render(<App />);

      const submitButton = screen.getByRole('button', { name: /start training/i });
      await user.tab();
      await user.tab();
      await user.tab();

      expect(submitButton).toHaveFocus();
      await user.keyboard('{Enter}');

      // Should start session and show color display
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });

    it('should close help overlay with Escape key', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Open help with 'h' key
      await user.keyboard('h');
      
      await waitFor(() => {
        const helpDialog = screen.getByRole('dialog', { name: /help/i });
        expect(helpDialog).toBeInTheDocument();
      });

      // Close help with Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /help/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA labels on config dialog', () => {
      render(<App />);

      // Config dialog
      const configDialog = screen.getByRole('dialog');
      expect(configDialog).toHaveAttribute('aria-modal', 'true');
      expect(configDialog).toHaveAttribute('aria-labelledby', 'config-title');
    });

    it('should have ARIA live region for color announcements', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Check for live region with status role
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('should have proper ARIA labels on interactive buttons', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Config submit button
      const startButton = screen.getByRole('button', { name: /start training session with configured settings/i });
      expect(startButton).toBeInTheDocument();

      // Start session
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Settings button
      const settingsButton = screen.getByRole('button', { name: /open settings/i });
      expect(settingsButton).toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should have live region with initial direction', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Get live region
      const liveRegion = screen.getByRole('status');
      
      // Initial announcement (should be LEFT for blue)
      expect(liveRegion).toHaveTextContent('Moving LEFT');
    });

    it('should not announce when session is paused', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Pause session
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByText(/paused/i)).toBeInTheDocument();
      });

      // Live region should be empty when paused
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveTextContent('');
    });

    it('should update main aria-label with current direction', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveAttribute('aria-label', 'Move LEFT');
      });
    });

    it('should indicate paused state in aria-label', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Pause
      await user.keyboard(' ');

      await waitFor(() => {
        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveAttribute('aria-label', expect.stringContaining('paused'));
      });
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus visibility during keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Tab through form elements and verify focus
      await user.tab();
      expect(document.activeElement).toBe(screen.getByLabelText(/color change frequency/i));

      await user.tab();
      expect(document.activeElement).toBe(screen.getByLabelText(/enable audio cues/i));

      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /start training/i }));
    });

    it('should allow settings dialog interaction', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Open settings
      await user.click(screen.getByRole('button', { name: /open settings/i }));

      await waitFor(() => {
        const settingsDialog = screen.getByRole('dialog', { name: /settings/i });
        expect(settingsDialog).toBeInTheDocument();
      });

      // Tab should work within dialog
      await user.tab();
      const settingsFrequency = screen.getByLabelText(/color change frequency/i);
      expect(settingsFrequency).toHaveFocus();
    });

    it('should allow help overlay interaction', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Start session
      await user.click(screen.getByRole('button', { name: /start training/i }));

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Open help
      await user.keyboard('h');

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /help/i })).toBeInTheDocument();
      });

      // Close help
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /help/i })).not.toBeInTheDocument();
      });

      // Main content should still be accessible
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});

