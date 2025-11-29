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
}

export function ColorDisplay({ currentColor, isPaused, onPauseResume }: ColorDisplayProps) {
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

  // Set up keyboard/mouse/touch handlers for pause/resume
  useKeyboardMouse(onPauseResume);

  return (
    <main
      className={`color-display ${currentColor}`}
      role="main"
      aria-live="polite"
      aria-label={`Move ${direction}`}
      data-testid="color-display"
      tabIndex={0}
    >
      <PauseIndicator isPaused={isPaused} />
    </main>
  );
}
