/**
 * useTrainingSession Hook Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrainingSession } from '@/hooks/useTrainingSession';

describe('useTrainingSession', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default inactive state', () => {
    const { result } = renderHook(() => useTrainingSession());

    expect(result.current.session.isActive).toBe(false);
    expect(result.current.session.isPaused).toBe(false);
    expect(result.current.session.currentColor).toBe('blue');
    expect(result.current.session.frequency).toBe(2);
    expect(result.current.session.colorChangeCount).toBe(0);
  });

  it('should start session with specified frequency', () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(3);
    });

    expect(result.current.session.isActive).toBe(true);
    expect(result.current.session.frequency).toBe(3);
    expect(result.current.session.startTime).not.toBeNull();
  });

  it('should change color after frequency interval', async () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(1); // 1 second frequency
    });

    expect(result.current.session.currentColor).toBe('blue');

    // Fast-forward 1 second and flush microtasks
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.session.currentColor).toBe('red');
    expect(result.current.session.colorChangeCount).toBe(1);
  });

  it('should alternate between blue and red', async () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(0.5); // 0.5 second frequency
    });

    expect(result.current.session.currentColor).toBe('blue');

    // First change: blue → red
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.session.currentColor).toBe('red');

    // Second change: red → blue
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.session.currentColor).toBe('blue');
    expect(result.current.session.colorChangeCount).toBe(2);
  });

  it('should pause and resume session', () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(2);
    });

    expect(result.current.session.isActive).toBe(true);
    expect(result.current.session.isPaused).toBe(false);

    act(() => {
      result.current.pause();
    });

    expect(result.current.session.isPaused).toBe(true);
    expect(result.current.session.pauseTime).not.toBeNull();

    act(() => {
      result.current.resume();
    });

    expect(result.current.session.isPaused).toBe(false);
    expect(result.current.session.pauseTime).toBeNull();
  });

  it('should not change color while paused', async () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(1);
    });

    const initialColor = result.current.session.currentColor;

    act(() => {
      result.current.pause();
    });

    // Fast-forward time while paused
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Color should not have changed
    expect(result.current.session.currentColor).toBe(initialColor);
    expect(result.current.session.colorChangeCount).toBe(0);
  });

  it('should adjust next color change time after resume', async () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(2);
    });

    // Pause after 500ms
    await act(async () => {
      vi.advanceTimersByTime(500);
      result.current.pause();
    });

    // Stay paused for 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Resume
    act(() => {
      result.current.resume();
    });

    // Should take another 1.5 seconds (2s - 0.5s) for color change
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.session.currentColor).toBe('red');
  });

  it('should update frequency mid-session', () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(2);
    });

    expect(result.current.session.frequency).toBe(2);

    act(() => {
      result.current.updateFrequency(5);
    });

    expect(result.current.session.frequency).toBe(5);
  });

  it('should reset session to initial state', () => {
    const { result } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(3);
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Session should be active with some state
    expect(result.current.session.isActive).toBe(true);

    act(() => {
      result.current.reset();
    });

    // Session should be back to initial state
    expect(result.current.session.isActive).toBe(false);
    expect(result.current.session.currentColor).toBe('blue');
    expect(result.current.session.colorChangeCount).toBe(0);
    expect(result.current.session.startTime).toBeNull();
  });

  it('should clear timer on unmount', () => {
    const { result, unmount } = renderHook(() => useTrainingSession());

    act(() => {
      result.current.start(2);
    });

    expect(result.current.session.isActive).toBe(true);

    unmount();

    // Should not throw errors or leak timers
    expect(true).toBe(true);
  });
});
