'use client';
import { useEffect, useRef, useCallback } from 'react';

export function useScrollReveal(dependencies: any[] = []) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, dependencies);
}

export function useCounterAnimation(target: number, duration = 2000, prefix = '', suffix = '') {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  const animate = useCallback(() => {
    if (!ref.current || startedRef.current) return;
    startedRef.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      if (ref.current) {
        ref.current.textContent = prefix + current.toLocaleString() + suffix;
      }
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, prefix, suffix]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animate(); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return ref;
}
