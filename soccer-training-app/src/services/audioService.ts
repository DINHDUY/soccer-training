/**
 * Audio Service
 * 
 * Wraps Web Speech API for text-to-speech functionality with browser support detection.
 */

import type { AudioDirection } from '@/types';

/**
 * Check if Web Speech API is supported
 */
export function isSupported(): boolean {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Speak the specified direction word
 */
export function speak(direction: AudioDirection): void {
  if (!isSupported()) {
    console.warn('[audioService] Speech synthesis not supported');
    return;
  }

  // Cancel any pending speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(direction);
  utterance.rate = 1.2; // Faster for training urgency
  utterance.volume = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  window.speechSynthesis.speak(utterance);
}

/**
 * Cancel all pending speech
 */
export function cancel(): void {
  if (isSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if speech is currently being spoken
 */
export function isSpeaking(): boolean {
  return isSupported() && window.speechSynthesis.speaking;
}

export const audioService = {
  isSupported,
  speak,
  cancel,
  isSpeaking,
};
