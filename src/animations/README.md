# Motion system

Shared Framer Motion variants and easing live in `motion.js`; `MotionSection` applies the same reveal to page sections. `useScrollReveal.js` uses `IntersectionObserver` and reveals content once it enters view. `useReducedMotion()` disables entrance movement when visitors request reduced motion.

Decorative petals, sparkles, dividers, garlands, countdown digits, and small gold accents use CSS or SVG animation so they do not need extra scroll listeners or recurring React state updates.
