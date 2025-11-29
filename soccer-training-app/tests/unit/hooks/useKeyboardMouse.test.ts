import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardMouse } from '../../../src/hooks/useKeyboardMouse';

describe('useKeyboardMouse', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call handler when any key is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    // Simulate keydown event
    const event = new KeyboardEvent('keydown', { key: 'Space' });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should call handler on mouse click', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    // Simulate click event
    const event = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should call handler on touch end', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    // Simulate touchend event
    const event = new TouchEvent('touchend', {
      bubbles: true,
      cancelable: true,
      touches: [],
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should set up all three event listeners on mount', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function)
    );
  });

  it('should remove all event listeners on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useKeyboardMouse(handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function)
    );
  });

  it('should handle multiple sequential events', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    // Trigger multiple events
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
      })
    );

    expect(handler).toHaveBeenCalledTimes(3);
  });

  it('should use updated handler on re-render', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => useKeyboardMouse(handler),
      { initialProps: { handler: handler1 } }
    );

    // Trigger with first handler
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    // Update to second handler
    rerender({ handler: handler2 });

    // Trigger with second handler
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(handler1).toHaveBeenCalledTimes(1); // Should not increase
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should not call handler after unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useKeyboardMouse(handler));

    unmount();

    // Try to trigger events after unmount
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should ignore clicks on elements with closest() returning interactive elements', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    // Create a mock element with closest method
    const mockElement = {
      tagName: 'SPAN',
      closest: vi.fn((selector: string) => {
        if (selector === 'button') {
          return { tagName: 'BUTTON' }; // Return a button element
        }
        return null;
      }),
    };

    // Simulate click event with mock element as target
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: mockElement, writable: false });
    document.dispatchEvent(event);

    // Handler should not be called because target is inside a button
    expect(handler).not.toHaveBeenCalled();
    expect(mockElement.closest).toHaveBeenCalledWith('button');
  });

  it('should ignore clicks on elements with closest() returning links', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardMouse(handler));

    // Create a mock element with closest method returning link
    const mockElement = {
      tagName: 'SPAN',
      closest: vi.fn((selector: string) => {
        if (selector === 'a') {
          return { tagName: 'A' }; // Return an anchor element
        }
        return null;
      }),
    };

    // Simulate click event with mock element as target
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: mockElement, writable: false });
    document.dispatchEvent(event);

    // Handler should not be called because target is inside a link
    expect(handler).not.toHaveBeenCalled();
    expect(mockElement.closest).toHaveBeenCalledWith('a');
  });
});
