import { useEffect, useRef, useState } from 'react';

export function useScrollFade<T extends HTMLElement>(hideDelay = 900) {
  const ref = useRef<T>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: number | undefined;

    function show() {
      setIsScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIsScrolling(false), hideDelay);
    }

    function hideNow() {
      window.clearTimeout(timer);
      setIsScrolling(false);
    }

    el.addEventListener('scroll', show, { passive: true });
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hideNow);

    return () => {
      window.clearTimeout(timer);
      el.removeEventListener('scroll', show);
      el.removeEventListener('mouseenter', show);
      el.removeEventListener('mouseleave', hideNow);
    };
  }, [hideDelay]);

  return { ref, isScrolling };
}
