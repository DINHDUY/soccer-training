import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioCues } from '../../../src/hooks/useAudioCues';

describe('useAudioCues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should speak "LEFT" when enabled', () => {
    const { result } = renderHook(() => useAudioCues(true));

    act(() => {
      result.current.speak('LEFT');
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    const call = vi.mocked(window.speechSynthesis.speak).mock.calls[0];
    expect(call[0].text).toBe('LEFT');
  });

  it('should speak "RIGHT" when enabled', () => {
    const { result } = renderHook(() => useAudioCues(true));

    act(() => {
      result.current.speak('RIGHT');
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    const call = vi.mocked(window.speechSynthesis.speak).mock.calls[0];
    expect(call[0].text).toBe('RIGHT');
  });

  it('should not speak when disabled', () => {
    const { result } = renderHook(() => useAudioCues(false));

    act(() => {
      result.current.speak('LEFT');
    });

    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('should cancel pending speech', () => {
    const { result } = renderHook(() => useAudioCues(true));

    act(() => {
      result.current.cancel();
    });

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it('should detect browser support', () => {
    const { result } = renderHook(() => useAudioCues(true));

    expect(result.current.isSupported).toBe(true);
  });

  it('should not speak when browser is not supported', () => {
    // Temporarily remove speechSynthesis
    const originalSpeechSynthesis = window.speechSynthesis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).speechSynthesis;

    const { result } = renderHook(() => useAudioCues(true));

    act(() => {
      result.current.speak('LEFT');
    });

    // Restore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).speechSynthesis = originalSpeechSynthesis;
  });

  it('should update when enabled state changes', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useAudioCues(enabled),
      { initialProps: { enabled: false } }
    );

    // Initially disabled
    act(() => {
      result.current.speak('LEFT');
    });
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();

    // Enable audio
    rerender({ enabled: true });

    act(() => {
      result.current.speak('LEFT');
    });
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    const call = vi.mocked(window.speechSynthesis.speak).mock.calls[0];
    expect(call[0].text).toBe('LEFT');
  });

  it('should handle errors gracefully', () => {
    const { result } = renderHook(() => useAudioCues(true));

    // Mock error
    const originalSpeak = window.speechSynthesis.speak;
    window.speechSynthesis.speak = vi.fn(() => {
      throw new Error('Audio error');
    });

    expect(() => {
      act(() => {
        result.current.speak('LEFT');
      });
    }).not.toThrow();

    // Restore
    window.speechSynthesis.speak = originalSpeak;
  });

  it('should handle cancel errors gracefully', () => {
    const { result } = renderHook(() => useAudioCues(true));
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock cancel to throw error
    const originalCancel = window.speechSynthesis.cancel;
    window.speechSynthesis.cancel = vi.fn(() => {
      throw new Error('Cancel error');
    });

    expect(() => {
      act(() => {
        result.current.cancel();
      });
    }).not.toThrow();

    // Verify warning was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[Audio] Failed to cancel:',
      expect.any(Error)
    );

    // Restore
    window.speechSynthesis.cancel = originalCancel;
    consoleWarnSpy.mockRestore();
  });
});
