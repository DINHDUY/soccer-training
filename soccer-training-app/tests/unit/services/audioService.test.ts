/**
 * Audio Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioService } from '@/services/audioService';

describe('audioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isSupported', () => {
    it('should return true when speechSynthesis is available', () => {
      expect(audioService.isSupported()).toBe(true);
    });

    it('should return false when speechSynthesis is not available', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).speechSynthesis;

      expect(audioService.isSupported()).toBe(false);

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('speak', () => {
    it('should cancel previous speech and speak new direction', () => {
      audioService.speak('LEFT');

      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
      expect(window.speechSynthesis.speak).toHaveBeenCalled();

      const speakCall = vi.mocked(window.speechSynthesis.speak).mock.calls[0];
      const utterance = speakCall[0] as SpeechSynthesisUtterance;

      expect(utterance.text).toBe('LEFT');
      expect(utterance.rate).toBe(1.2);
      expect(utterance.volume).toBe(1.0);
      expect(utterance.lang).toBe('en-US');
    });

    it('should speak RIGHT direction', () => {
      audioService.speak('RIGHT');

      const speakCall = vi.mocked(window.speechSynthesis.speak).mock.calls[0];
      const utterance = speakCall[0] as SpeechSynthesisUtterance;

      expect(utterance.text).toBe('RIGHT');
    });

    it('should log warning when speech synthesis is not supported', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).speechSynthesis;

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      audioService.speak('LEFT');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[audioService] Speech synthesis not supported'
      );

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).speechSynthesis = originalSpeechSynthesis;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('cancel', () => {
    it('should cancel all pending speech', () => {
      audioService.cancel();

      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    });

    it('should handle cancel when speech synthesis is not supported', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).speechSynthesis;

      // Should not throw
      expect(() => audioService.cancel()).not.toThrow();

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('isSpeaking', () => {
    it('should return false when not speaking', () => {
      expect(audioService.isSpeaking()).toBe(false);
    });

    it('should return true when speaking', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.speechSynthesis.speaking as any) = true;

      expect(audioService.isSpeaking()).toBe(true);

      // Reset
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.speechSynthesis.speaking as any) = false;
    });

    it('should return false when speech synthesis is not supported', () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).speechSynthesis;

      expect(audioService.isSpeaking()).toBe(false);

      // Restore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });
});
