import { useEffect, useRef } from 'react';

export function useKeyboardMouse(handler: () => void) {
  const handlerRef = useRef(handler);

  // Keep handler ref updated
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }
      handlerRef.current();
    };

    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on buttons, links, or form controls
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        (target.closest && target.closest('button')) ||
        (target.closest && target.closest('a'))
      ) {
        return;
      }
      handlerRef.current();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Ignore touches on buttons or form controls
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        (target.closest && target.closest('button')) ||
        (target.closest && target.closest('a'))
      ) {
        return;
      }
      handlerRef.current();
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClick);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
}
