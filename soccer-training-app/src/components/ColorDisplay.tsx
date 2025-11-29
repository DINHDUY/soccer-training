/**
 * ColorDisplay Component
 * 
 * Full-screen color background that indicates directional movement.
 * Blue = Move LEFT, Red = Move RIGHT
 */

import type { ColorDirection } from '@/types';

export interface ColorDisplayProps {
  currentColor: ColorDirection;
  isPaused: boolean;
  onClick: () => void;
}

export function ColorDisplay({ currentColor, isPaused, onClick }: ColorDisplayProps) {
  const direction = currentColor === 'blue' ? 'LEFT' : 'RIGHT';

  return (
    <main
      className={`color-display ${currentColor}`}
      role="main"
      aria-live="polite"
      aria-label={`Move ${direction}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
    >
      {isPaused && (
        <div className="pause-indicator" role="status" aria-label="Session paused">
          PAUSED
        </div>
      )}
    </main>
  );
}
