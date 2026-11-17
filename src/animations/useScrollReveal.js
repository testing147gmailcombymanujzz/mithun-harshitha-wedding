import { useEffect, useRef, useState } from 'react';

export function useScrollReveal() {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.16, rootMargin: '0px 0px -3% 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [elementRef, isVisible];
}
