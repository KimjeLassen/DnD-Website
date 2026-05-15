import { useEffect } from 'react';

/**
 * Runs an async effect with cleanup to avoid setState after unmount or stale runs.
 */
export function useAsyncEffect(
  effect: (isActive: () => boolean) => Promise<void>,
  deps: React.DependencyList,
) {
  useEffect(() => {
    let active = true;
    const isActive = () => active;

    effect(isActive).catch((err) => {
      if (active) {
        console.error('useAsyncEffect error:', err);
      }
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
