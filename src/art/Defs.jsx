/**
 * Shared SVG gradients and patterns, rendered once at the top of the page so every
 * other illustration can reference them by id.
 */
export const GOLD = '#C6A36A';
export const GOLD_LIGHT = '#EBD29C';
export const MAROON = '#65152F';
export const LEAF = '#537A58';
export const SKIN = '#C98C6A';
export const SKIN_SHADE = '#A86F52';
export const HAIR = '#2E201B';

export function Defs() {
  return (
    <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-env-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a1d39" /><stop offset="1" stopColor="#5a1229" />
        </linearGradient>
        <linearGradient id="g-env-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c2444" /><stop offset="1" stopColor="#7a1d39" />
        </linearGradient>
        <linearGradient id="g-env-side-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#8c2444" /><stop offset="1" stopColor="#7a1d39" />
        </linearGradient>
        <linearGradient id="g-env-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#962a4b" /><stop offset="1" stopColor="#7d1f3c" />
        </linearGradient>
        <linearGradient id="g-env-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#82213f" /><stop offset="1" stopColor="#9a2d4e" />
        </linearGradient>
        <pattern id="p-liner" width="34" height="34" patternUnits="userSpaceOnUse">
          <rect width="34" height="34" fill="#f6e3c4" />
          <g transform="translate(17 17)" fill="none" stroke={GOLD} strokeWidth="1.1" opacity="0.85">
            <path d="M0 -9 C4 -4 4 4 0 9 C-4 4 -4 -4 0 -9Z" />
            <path d="M-9 0 C-4 4 4 4 9 0 C4 -4 -4 -4 -9 0Z" />
          </g>
          <circle cx="17" cy="17" r="1.6" fill={MAROON} opacity="0.7" />
          <circle cx="0" cy="0" r="1.4" fill={GOLD} /><circle cx="34" cy="0" r="1.4" fill={GOLD} />
          <circle cx="0" cy="34" r="1.4" fill={GOLD} /><circle cx="34" cy="34" r="1.4" fill={GOLD} />
        </pattern>
        <radialGradient id="g-wax" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#f4d590" /><stop offset="0.55" stopColor="#c99a4c" /><stop offset="1" stopColor="#8d6427" />
        </radialGradient>
        <radialGradient id="g-marigold" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffd56b" /><stop offset="0.6" stopColor="#f6a531" /><stop offset="1" stopColor="#e2741b" />
        </radialGradient>
        <radialGradient id="g-marigold-deep" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffb347" /><stop offset="0.6" stopColor="#ec7a1f" /><stop offset="1" stopColor="#c4510f" />
        </radialGradient>
        <linearGradient id="g-mango" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fa86b" /><stop offset="1" stopColor="#3f6b45" />
        </linearGradient>
        <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dca4" /><stop offset="0.5" stopColor="#d1ad6c" /><stop offset="1" stopColor="#a98143" />
        </linearGradient>
        <linearGradient id="g-gold-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a98143" /><stop offset="0.5" stopColor="#f3dca4" /><stop offset="1" stopColor="#a98143" />
        </linearGradient>
        <radialGradient id="g-flame" cx="0.5" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#fff6c9" /><stop offset="0.45" stopColor="#ffc845" /><stop offset="1" stopColor="#f0791d" />
        </radialGradient>
        <radialGradient id="g-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd77a" stopOpacity="0.75" /><stop offset="1" stopColor="#ffd77a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g-saree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c22f45" /><stop offset="1" stopColor="#8f1730" />
        </linearGradient>
        <linearGradient id="g-kurta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8ea" /><stop offset="1" stopColor="#f1e1c2" />
        </linearGradient>
        <radialGradient id="g-arch-bg" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#f6e2d2" />
        </radialGradient>
        <linearGradient id="g-lotus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbd3dc" /><stop offset="1" stopColor="#e07d97" />
        </linearGradient>
        <linearGradient id="g-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf62" /><stop offset="1" stopColor="#ef8a22" />
        </linearGradient>
        <linearGradient id="g-rose-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2a2b0" /><stop offset="1" stopColor="#c43c5c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
