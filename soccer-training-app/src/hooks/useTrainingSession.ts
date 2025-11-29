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

// Session state reducer
function sessionReducer(
  state: TrainingSession,
  action: SessionAction
): TrainingSession {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isActive: true,
        isPaused: false,
        frequency: action.frequency,
        startTime: Date.now(),
        nextColorChangeAt: Date.now() + action.frequency * 1000,
      };

    case 'PAUSE':
      return {
        ...state,
        isPaused: true,
        pauseTime: Date.now(),
      };

    case 'RESUME': {
      if (!state.pauseTime || !state.nextColorChangeAt) return state;
      
      const pauseDuration = Date.now() - state.pauseTime;
      return {
        ...state,
        isPaused: false,
        pauseTime: null,
        nextColorChangeAt: state.nextColorChangeAt + pauseDuration,
      };
    }

    case 'COLOR_CHANGE': {
      const newColor: ColorDirection = state.currentColor === 'blue' ? 'red' : 'blue';
      return {
        ...state,
        currentColor: newColor,
        colorChangeCount: state.colorChangeCount + 1,
        nextColorChangeAt: Date.now() + state.frequency * 1000,
      };
    }

    case 'UPDATE_FREQUENCY':
      return {
        ...state,
        frequency: action.frequency,
        nextColorChangeAt: state.isPaused 
          ? state.nextColorChangeAt 
          : Date.now() + action.frequency * 1000,
      };

    case 'RESET':
      return { ...initialSession, id: crypto.randomUUID() };

    default:
      return state;
  }
}

export function useTrainingSession() {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const timerRef = useRef<number | null>(null);

  // Color change timer
  useEffect(() => {
    if (!session.isActive || session.isPaused || !session.nextColorChangeAt) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const now = Date.now();
    const delay = Math.max(0, session.nextColorChangeAt - now);

    timerRef.current = window.setTimeout(() => {
      dispatch({ type: 'COLOR_CHANGE' });
    }, delay);

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
