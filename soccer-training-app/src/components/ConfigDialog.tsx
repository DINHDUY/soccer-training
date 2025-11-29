/**
 * ConfigDialog Component
 * 
 * Initial configuration dialog for frequency and audio settings.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { VALIDATION_CONSTRAINTS } from '@/types';

export interface ConfigDialogProps {
  onSubmit: (frequency: number, audioEnabled: boolean) => void;
  defaultFrequency?: number;
  defaultAudioEnabled?: boolean;
}

export function ConfigDialog({
  onSubmit,
  defaultFrequency = VALIDATION_CONSTRAINTS.DEFAULT_FREQUENCY,
  defaultAudioEnabled = false,
}: ConfigDialogProps) {
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [audioEnabled, setAudioEnabled] = useState(defaultAudioEnabled);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate frequency (handle NaN from clearing input)
    const { MIN_FREQUENCY, MAX_FREQUENCY } = VALIDATION_CONSTRAINTS;
    const freq = Number(frequency);
    
    if (isNaN(freq) || freq < MIN_FREQUENCY || freq > MAX_FREQUENCY) {
      setError(`Frequency must be between ${MIN_FREQUENCY} and ${MAX_FREQUENCY} seconds`);
      return;
    }

    setError('');
    onSubmit(freq, audioEnabled);
  };

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="config-title">
      <div className="dialog">
        <h2 id="config-title">Training Configuration</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="frequency">
              Color Change Frequency (seconds)
            </label>
            <input
              id="frequency"
              type="number"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              required
              aria-describedby={error ? 'frequency-error' : undefined}
            />
            {error && (
              <p id="frequency-error" className="error-message">
                {error}
              </p>
            )}
          </div>

          <div className="checkbox-group">
            <input
              id="audio"
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
            />
            <label htmlFor="audio">Enable audio cues (LEFT/RIGHT)</label>
          </div>

          <button type="submit">Start Training</button>
        </form>
      </div>
    </div>
  );
}
