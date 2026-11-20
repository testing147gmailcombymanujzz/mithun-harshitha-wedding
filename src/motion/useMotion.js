import { useLayoutEffect } from 'react';
import { gsap } from './gsap.js';

/**
 * Runs `setup` inside a gsap.context scoped to `ref`, once `enabled` is true, and
 * reverts every tween and ScrollTrigger it made when the component unmounts.
 */
export function useMotion(ref, setup, enabled = true) {
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return undefined;
    const ctx = gsap.context(() => setup(ref.current), ref);
    return () => ctx.revert();
    // setup is defined inline by callers; re-running it on every render is not wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
