import { useRef } from 'react';

export function useMemoizedFn<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const memoizedFn = useRef<T>();
  if (!memoizedFn.current) {
    memoizedFn.current = ((...args) => fnRef.current(...args)) as T;
  }

  return memoizedFn.current;
}
