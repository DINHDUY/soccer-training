/**
 * Storage Service
 * 
 * Provides localStorage persistence for user configuration with error handling.
 */

import type { UserConfiguration } from '@/types';

const STORAGE_KEY = 'soccer-training-config';

/**
 * Load user configuration from localStorage
 */
export function loadConfig(): UserConfiguration | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as UserConfiguration;
  } catch (error) {
    console.error('[storageService] Failed to load config:', error);
    return null;
  }
}

/**
 * Save user configuration to localStorage
 */
export function saveConfig(config: UserConfiguration): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('[storageService] Failed to save config:', error);
  }
}

/**
 * Clear user configuration from localStorage
 */
export function clearConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[storageService] Failed to clear config:', error);
  }
}

export const storageService = {
  loadConfig,
  saveConfig,
  clearConfig,
};
