import { useRef, useCallback } from 'react';

export function useGameLoop(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  callbackRef.current = callback;

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = Math.min(time - previousTimeRef.current, 100); // Cap delta to prevent large jumps
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    if (isRunningRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []); // No dependencies - stable reference

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      previousTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    previousTimeRef.current = null;
  }, []);

  return { start, stop };
}
