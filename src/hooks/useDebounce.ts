'use client';

import { useRef, useCallback } from 'react';

/**
 * Returns a debounced version of the callback.
 * Prevents rapid-fire calls — only executes after `delay` ms of inactivity.
 *
 * Usage:
 *   const debouncedLike = useDebounce(handleLike, 500);
 *   <button onClick={() => debouncedLike(id)} />
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}

/**
 * Returns a throttled version of the callback.
 * Executes immediately, then ignores calls for `delay` ms.
 * Better for like buttons (instant feedback, prevents spam).
 *
 * Usage:
 *   const throttledLike = useThrottle(handleLike, 1000);
 *   <button onClick={() => throttledLike(id)} />
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000,
): (...args: Parameters<T>) => void {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  );
}
