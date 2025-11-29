/**
 * useConfiguration Hook Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfiguration } from '@/hooks/useConfiguration';
import { storageService } from '@/services/storageService';
import type { UserConfiguration } from '@/types';

vi.mock('@/services/storageService');

describe('useConfiguration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with default configuration when no saved config exists', async () => {
    vi.mocked(storageService.loadConfig).mockReturnValue(null);

    const { result } = renderHook(() => useConfiguration());


    expect(result.current.config).toEqual({
      frequency: 2,
      audioEnabled: false,
      hasCompletedFirstRun: false,
      audioPermissionGranted: false,
    });
  });

  it('should load saved configuration on mount', async () => {
    const savedConfig: UserConfiguration = {
      frequency: 3.5,
      audioEnabled: true,
      hasCompletedFirstRun: true,
      audioPermissionGranted: true,
    };

    vi.mocked(storageService.loadConfig).mockReturnValue(savedConfig);

    const { result } = renderHook(() => useConfiguration());


    expect(result.current.config).toEqual(savedConfig);
  });

  it('should update configuration and persist to storage', async () => {
    vi.mocked(storageService.loadConfig).mockReturnValue(null);

    const { result } = renderHook(() => useConfiguration());


    act(() => {
      result.current.updateConfig({ frequency: 5.0 });
    });

    expect(result.current.config.frequency).toBe(5.0);
    expect(storageService.saveConfig).toHaveBeenCalledWith(
      expect.objectContaining({ frequency: 5.0 })
    );
  });

  it('should update multiple config properties', async () => {
    vi.mocked(storageService.loadConfig).mockReturnValue(null);

    const { result } = renderHook(() => useConfiguration());


    act(() => {
      result.current.updateConfig({
        frequency: 1.5,
        audioEnabled: true,
        audioPermissionGranted: true,
      });
    });

    expect(result.current.config).toMatchObject({
      frequency: 1.5,
      audioEnabled: true,
      audioPermissionGranted: true,
    });
  });

  it('should reset configuration to defaults and clear storage', async () => {
    const savedConfig: UserConfiguration = {
      frequency: 5.0,
      audioEnabled: true,
      hasCompletedFirstRun: true,
      audioPermissionGranted: true,
    };

    vi.mocked(storageService.loadConfig).mockReturnValue(savedConfig);

    const { result } = renderHook(() => useConfiguration());


    act(() => {
      result.current.resetConfig();
    });

    expect(result.current.config).toEqual({
      frequency: 2,
      audioEnabled: false,
      hasCompletedFirstRun: false,
      audioPermissionGranted: false,
    });
    expect(storageService.clearConfig).toHaveBeenCalled();
  });

  it('should preserve hasCompletedFirstRun when updating other fields', async () => {
    const initialConfig: UserConfiguration = {
      frequency: 2,
      audioEnabled: false,
      hasCompletedFirstRun: true,
      audioPermissionGranted: false,
    };

    vi.mocked(storageService.loadConfig).mockReturnValue(initialConfig);

    const { result } = renderHook(() => useConfiguration());


    act(() => {
      result.current.updateConfig({ frequency: 3.0 });
    });

    expect(result.current.config.hasCompletedFirstRun).toBe(true);
  });
});
