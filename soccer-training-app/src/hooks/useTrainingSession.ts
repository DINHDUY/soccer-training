/**
 * useTrainingSession Hook
 * 
 * Manages training session state machine with color transitions and timer logic.
 */

import { useReducer, useEffect, useRef, useCallback } from 'react';
import type { TrainingSession, SessionAction, ColorDirection } from '@/types';

// Initial session state
const initialSession: TrainingSession = {
  id: crypto.randomUUID(),
  isActive: false,
  isPaused: false,
  currentColor: 'blue',
  frequency: 2,
  startTime: null,
  pauseTime: null,
  elapsedTime: 0,
  colorChangeCount: 0,
  nextColorChangeAt: null,
};

/**
 * Session state reducer implementing the training session state machine.
 * 
 * State transitions:
 * - INITIAL → START → ACTIVE
 * - ACTIVE → PAUSE → PAUSED
 * - PAUSED → RESUME → ACTIVE
 * - ACTIVE → COLOR_CHANGE → ACTIVE (with alternating color)
 * - ANY → RESET → INITIAL
 * 
 * Timer management: nextColorChangeAt is adjusted when pausing/resuming
 * to maintain accurate intervals even after pause durations.
 */
function sessionReducer(
  state: TrainingSession,
  action: SessionAction
): TrainingSession {
  switch (action.type) {
    case 'START':
      // Initialize session with frequency and set first color change timestamp
      return {
        ...state,
        isActive: true,
        isPaused: false,
        frequency: action.frequency,
        startTime: Date.now(),
        // Schedule first color change at: now + frequency (in milliseconds)
        nextColorChangeAt: Date.now() + action.frequency * 1000,
      };

    case 'PAUSE':
      // Record pause time to calculate pause duration on resume
      return {
        ...state,
        isPaused: true,
        pauseTime: Date.now(),
      };

    case 'RESUME': {
      // Guard: Ensure we have required timestamps
      if (!state.pauseTime || !state.nextColorChangeAt) return state;
      
      // Calculate how long we were paused and adjust next color change time
      // This ensures the timer picks up where it left off, not from scratch
      const pauseDuration = Date.now() - state.pauseTime;
      return {
        ...state,
        isPaused: false,
        pauseTime: null,
        // Add pause duration to next color change time to maintain interval
        nextColorChangeAt: state.nextColorChangeAt + pauseDuration,
      };
    }

    case 'COLOR_CHANGE': {
      // Alternate between blue (LEFT) and red (RIGHT)
      const newColor: ColorDirection = state.currentColor === 'blue' ? 'red' : 'blue';
      return {
        ...state,
        currentColor: newColor,
        colorChangeCount: state.colorChangeCount + 1,
        // Schedule next color change based on current frequency
        nextColorChangeAt: Date.now() + state.frequency * 1000,
      };
    }

    case 'UPDATE_FREQUENCY':
      // Allow mid-session frequency changes from settings dialog
      return {
        ...state,
        frequency: action.frequency,
        // Only reschedule timer if not paused (paused timer will use new frequency on resume)
        nextColorChangeAt: state.isPaused 
          ? state.nextColorChangeAt 
          : Date.now() + action.frequency * 1000,
      };

    case 'RESET':
      // Return to initial state with new session ID
      return { ...initialSession, id: crypto.randomUUID() };

    default:
      return state;
  }
}

export function useTrainingSession() {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const timerRef = useRef<number | null>(null);

  /**
   * Color change timer effect
   * 
   * This effect manages the setTimeout-based timer for color changes:
   * 1. Clears any existing timer when session is paused or inactive
   * 2. Calculates delay based on nextColorChangeAt timestamp
   * 3. Dispatches COLOR_CHANGE action when delay elapses
   * 4. Cleanup function ensures timer is cleared on component unmount or re-render
   * 
   * The delay calculation uses Math.max(0, ...) to handle cases where
   * nextColorChangeAt is in the past (e.g., after long pause).
   */
  useEffect(() => {
    // Don't set timer if session isn't active, is paused, or no next change scheduled
    if (!session.isActive || session.isPaused || !session.nextColorChangeAt) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Calculate milliseconds until next color change
    const now = Date.now();
    const delay = Math.max(0, session.nextColorChangeAt - now);

    // Schedule color change dispatch
    timerRef.current = window.setTimeout(() => {
      dispatch({ type: 'COLOR_CHANGE' });
    }, delay);

    // Cleanup: Clear timer on effect cleanup (unmount or dependency change)
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [session.isActive, session.isPaused, session.nextColorChangeAt]);

  const start = useCallback((frequency: number) => {
    dispatch({ type: 'START', frequency });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const updateFrequency = useCallback((frequency: number) => {
    dispatch({ type: 'UPDATE_FREQUENCY', frequency });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    session,
    start,
    pause,
    resume,
    updateFrequency,
    reset,
  };
}
