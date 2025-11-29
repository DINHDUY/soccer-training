import { useCallback, useRef, useEffect } from 'react';
import { audioService } from '../services/audioService';

export interface UseAudioCuesResult {
  speak: (word: 'LEFT' | 'RIGHT') => void;
  cancel: () => void;
  isSupported: boolean;
}

/**
 * Custom hook for managing audio cues during training sessions.
 * Wraps the audioService with enabled state checking.
 *
 * @param enabled - Whether audio cues are currently enabled
 * @returns Audio control methods and browser support status
 */
export function useAudioCues(enabled: boolean): UseAudioCuesResult {
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const isSupported = audioService.isSupported();

  const speak = useCallback(
    (word: 'LEFT' | 'RIGHT') => {
      // Only speak if enabled and supported
      if (!enabledRef.current || !isSupported) {
        return;
      }

      try {
        audioService.speak(word);
      } catch (error) {
        // Silently handle audio errors to avoid disrupting training
        console.warn('[Audio] Failed to speak:', error);
      }
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    try {
      audioService.cancel();
    } catch (error) {
      console.warn('[Audio] Failed to cancel:', error);
    }
  }, []);

  return {
    speak,
    cancel,
    isSupported,
  };
}
