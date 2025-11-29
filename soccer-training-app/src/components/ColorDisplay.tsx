/**
 * ColorDisplay Component
 * 
 * Full-screen color background that indicates directional movement.
 * Blue = Move LEFT, Red = Move RIGHT
 */

import { useEffect, useRef } from 'react';
import type { ColorDirection } from '@/types';
import { PauseIndicator } from './PauseIndicator';
import { useKeyboardMouse } from '@/hooks/useKeyboardMouse';

export interface ColorDisplayProps {
  currentColor: ColorDirection;
  isPaused: boolean;
  onPauseResume: () => void;
  onHelp?: () => void;
}

export function ColorDisplay({ currentColor, isPaused, onPauseResume, onHelp }: ColorDisplayProps) {
  const direction = currentColor === 'blue' ? 'LEFT' : 'RIGHT';
  const isPausedRef = useRef(isPaused);

  // Track pause state changes for logging
  useEffect(() => {
    if (isPaused !== isPausedRef.current) {
      const timestamp = new Date().toISOString();
      if (isPaused) {
        console.log(`[${timestamp}] Session paused`);
      } else if (isPausedRef.current) {
        console.log(`[${timestamp}] Session resumed`);
      }
      isPausedRef.current = isPaused;
    }
  }, [isPaused]);

  // Set up keyboard/mouse/touch handlers for pause/resume and help
  useKeyboardMouse(onPauseResume, { onHelp });

  return (
    <main
      className={`color-display ${currentColor}`}
      role="main"
      aria-live="polite"
      aria-label={isPaused ? `Training paused. Move ${direction} when resumed.` : `Move ${direction}`}
      data-testid="color-display"
      tabIndex={0}
    >
      {/* Screen reader announcement for color changes */}
      <div 
        className="sr-only" 
        aria-live="assertive" 
        aria-atomic="true"
        role="status"
      >
        {!isPaused && `Moving ${direction}`}
      </div>
      <PauseIndicator isPaused={isPaused} />
    </main>
  );
}
