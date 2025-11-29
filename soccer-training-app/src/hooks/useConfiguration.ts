/**
 * useConfiguration Hook
 * 
 * Manages user configuration with localStorage persistence.
 */

import { useState, useCallback } from 'react';
import { storageService } from '@/services/storageService';
import type { UserConfiguration, UserConfigurationUpdate } from '@/types';
import { VALIDATION_CONSTRAINTS } from '@/types';

const DEFAULT_CONFIG: UserConfiguration = {
  frequency: VALIDATION_CONSTRAINTS.DEFAULT_FREQUENCY,
  audioEnabled: false,
  hasCompletedFirstRun: false,
  audioPermissionGranted: false,
};

export function useConfiguration() {
  // Initialize with saved config or defaults (lazy initialization)
  const [config, setConfig] = useState<UserConfiguration>(() => {
    const savedConfig = storageService.loadConfig();
    return savedConfig || DEFAULT_CONFIG;
  });
  
  const [isLoaded, setIsLoaded] = useState(true);

  // Update configuration and persist to localStorage
  const updateConfig = useCallback(
    (updates: UserConfigurationUpdate) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      storageService.saveConfig(newConfig);
    },
    [config]
  );

  // Reset configuration to defaults
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    storageService.clearConfig();
  }, []);

  return {
    config,
    isLoaded,
    updateConfig,
    resetConfig,
  };
}
