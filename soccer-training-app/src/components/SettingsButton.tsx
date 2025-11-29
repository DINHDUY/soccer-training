/**
 * SettingsButton Component
 * 
 * Floating button to open settings dialog during active session.
 */

export interface SettingsButtonProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      className="settings-button"
      onClick={onClick}
      aria-label="Open settings"
      type="button"
    >
      ⚙️ Settings
    </button>
  );
}
