import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Speech API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  pending: false,
  paused: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
};

// Mock SpeechSynthesisUtterance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  text: string;
  lang: string = '';
  voice: SpeechSynthesisVoice | null = null;
  volume: number = 1;
  rate: number = 1;
  pitch: number = 1;
  onstart:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void)
    | null = null;
  onend:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void)
    | null = null;
  onerror:
    | ((
        this: SpeechSynthesisUtterance,
        ev: SpeechSynthesisErrorEvent
      ) => void)
    | null = null;
  onpause:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void)
    | null = null;
  onresume:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void)
    | null = null;
  onmark:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void)
    | null = null;
  onboundary:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void)
    | null = null;
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn(() => true);

  constructor(text?: string) {
    this.text = text || '';
  }
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: (_index: number) => null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
