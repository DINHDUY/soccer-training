import { useEffect } from 'react';

interface HelpOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export function HelpOverlay({ isVisible, onClose }: HelpOverlayProps) {
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="help-overlay" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="help-content">
        <h2 id="help-title">Soccer Training - Help</h2>
        
        <section>
          <h3>Color Meanings</h3>
          <p><strong>Blue</strong> = Move <strong>LEFT</strong></p>
          <p><strong>Red</strong> = Move <strong>RIGHT</strong></p>
        </section>

        <section>
          <h3>Controls</h3>
          <ul>
            <li><kbd>Any key</kbd>, <kbd>Click</kbd>, or <kbd>Touch</kbd> - Pause / Resume training</li>
            <li><kbd>h</kbd> or <kbd>?</kbd> - Show this help</li>
            <li><kbd>Escape</kbd> - Close this help</li>
          </ul>
        </section>

        <section>
          <h3>How to Use</h3>
          <p>When a color appears on screen, quickly move in the indicated direction. Colors will change at your configured frequency. Practice quick reactions and directional changes to improve your agility!</p>
        </section>

        <div className="help-close-hint">
          Press <kbd>Escape</kbd> to close this help
        </div>
      </div>
    </div>
  );
}
