/**
 * SettingsDialog Component
 * 
 * Dialog for changing frequency and audio settings mid-session.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { VALIDATION_CONSTRAINTS } from '@/types';

export interface SettingsDialogProps {
  isOpen: boolean;
  currentFrequency: number;
  currentAudioEnabled: boolean;
  onSave: (frequency: number, audioEnabled: boolean) => void;
  onCancel: () => void;
}

export function SettingsDialog({
  isOpen,
  currentFrequency,
  currentAudioEnabled,
  onSave,
  onCancel,
}: SettingsDialogProps) {
  const [frequency, setFrequency] = useState(currentFrequency);
  const [audioEnabled, setAudioEnabled] = useState(currentAudioEnabled);
  const [error, setError] = useState<string>('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate frequency
    const { MIN_FREQUENCY, MAX_FREQUENCY } = VALIDATION_CONSTRAINTS;
    const freq = Number(frequency);
    
    if (isNaN(freq) || freq < MIN_FREQUENCY || freq > MAX_FREQUENCY) {
      setError(`Frequency must be between ${MIN_FREQUENCY} and ${MAX_FREQUENCY} seconds`);
      return;
    }

    setError('');
    onSave(freq, audioEnabled);
  };

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="dialog">
        <h2 id="settings-title">Settings</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="settings-frequency">
              Color Change Frequency (seconds)
            </label>
            <input
              id="settings-frequency"
              type="number"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              required
              aria-describedby={error ? 'settings-frequency-error' : undefined}
            />
            {error && (
              <p id="settings-frequency-error" className="error-message">
                {error}
              </p>
            )}
          </div>

          <div className="checkbox-group">
            <input
              id="settings-audio"
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
            />
            <label htmlFor="settings-audio">Enable audio cues (LEFT/RIGHT)</label>
          </div>

          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
