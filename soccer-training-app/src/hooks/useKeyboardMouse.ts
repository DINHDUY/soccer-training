import { useEffect, useRef } from 'react';

interface UseKeyboardMouseOptions {
  onHelp?: () => void;
}

export function useKeyboardMouse(handler: () => void, options?: UseKeyboardMouseOptions) {
  const handlerRef = useRef(handler);
  const onHelpRef = useRef(options?.onHelp);

  // Keep handler refs updated
  useEffect(() => {
    handlerRef.current = handler;
    onHelpRef.current = options?.onHelp;
  }, [handler, options?.onHelp]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Check for help keys first
      if ((e.key === 'h' || e.key === '?') && onHelpRef.current) {
        onHelpRef.current();
        return;
      }

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

      // Ignore help and escape keys for pause/resume
      if (e.key === 'h' || e.key === '?' || e.key === 'Escape') {
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
