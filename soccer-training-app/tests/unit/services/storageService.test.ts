/**
 * Storage Service Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '@/services/storageService';
import type { UserConfiguration } from '@/types';

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('loadConfig', () => {
    it('should return null when no config exists', () => {
      const config = storageService.loadConfig();
      expect(config).toBeNull();
    });

    it('should return parsed config when valid data exists', () => {
      const mockConfig: UserConfiguration = {
        frequency: 2.5,
        audioEnabled: true,
        hasCompletedFirstRun: true,
        audioPermissionGranted: false,
      };

      localStorage.setItem(
        'soccer-training-config',
        JSON.stringify(mockConfig)
      );

      const config = storageService.loadConfig();
      expect(config).toEqual(mockConfig);
    });

    it('should return null and log error when invalid JSON exists', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      localStorage.setItem('soccer-training-config', 'invalid-json');

      const config = storageService.loadConfig();

      expect(config).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[storageService] Failed to load config'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveConfig', () => {
    it('should save config to localStorage', () => {
      const mockConfig: UserConfiguration = {
        frequency: 3.0,
        audioEnabled: false,
        hasCompletedFirstRun: true,
        audioPermissionGranted: true,
      };

      storageService.saveConfig(mockConfig);

      const saved = localStorage.getItem('soccer-training-config');
      expect(saved).toBe(JSON.stringify(mockConfig));
    });
  });

  describe('clearConfig', () => {
    it('should remove config from localStorage', () => {
      const mockConfig: UserConfiguration = {
        frequency: 2.0,
        audioEnabled: true,
        hasCompletedFirstRun: true,
        audioPermissionGranted: false,
      };

      localStorage.setItem(
        'soccer-training-config',
        JSON.stringify(mockConfig)
      );

      storageService.clearConfig();

      const saved = localStorage.getItem('soccer-training-config');
      expect(saved).toBeNull();
    });
  });
});
