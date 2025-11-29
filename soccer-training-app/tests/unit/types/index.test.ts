/**
 * Type Guards Tests
 */

import { describe, it, expect } from 'vitest';
import { isColorDirection, isSessionState } from '../../../src/types';

describe('Type Guards', () => {
  describe('isColorDirection', () => {
    it('should return true for "blue"', () => {
      expect(isColorDirection('blue')).toBe(true);
    });

    it('should return true for "red"', () => {
      expect(isColorDirection('red')).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isColorDirection('green')).toBe(false);
      expect(isColorDirection('yellow')).toBe(false);
      expect(isColorDirection('')).toBe(false);
      expect(isColorDirection(null)).toBe(false);
      expect(isColorDirection(undefined)).toBe(false);
      expect(isColorDirection(123)).toBe(false);
      expect(isColorDirection({})).toBe(false);
      expect(isColorDirection([])).toBe(false);
    });
  });

  describe('isSessionState', () => {
    it('should return true for "initial"', () => {
      expect(isSessionState('initial')).toBe(true);
    });

    it('should return true for "active"', () => {
      expect(isSessionState('active')).toBe(true);
    });

    it('should return true for "paused"', () => {
      expect(isSessionState('paused')).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(isSessionState('running')).toBe(false);
      expect(isSessionState('stopped')).toBe(false);
      expect(isSessionState('')).toBe(false);
      expect(isSessionState(null)).toBe(false);
      expect(isSessionState(undefined)).toBe(false);
      expect(isSessionState(123)).toBe(false);
      expect(isSessionState({})).toBe(false);
      expect(isSessionState([])).toBe(false);
    });
  });
});
