interface PauseIndicatorProps {
  isPaused: boolean;
}

export function PauseIndicator({ isPaused }: PauseIndicatorProps) {
  if (!isPaused) return null;

  return (
    <div
      className="pause-indicator"
      role="status"
      aria-live="polite"
      aria-label="Training paused"
    >
      <div className="pause-indicator__content">
        <span className="pause-indicator__text">PAUSED</span>
        <span className="pause-indicator__hint">
          Press any key or tap to resume
        </span>
      </div>
    </div>
  );
}
