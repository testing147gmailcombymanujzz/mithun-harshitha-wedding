/**
 * GSAP setup and the small motion helpers every section shares.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
// Shared timelines target optional parts (a lamp card has no kalasha), so empty selections are expected.
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger, SplitText };

/** True when the guest asked for less motion: endless loops are left out. */
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A paused timeline, for `replay()`. */
export const paused = (vars) => gsap.timeline({ paused: true, ...vars });

/**
 * Plays `tl` every time `trigger` comes into view, in either direction, and rewinds it
 * only once the element is fully off screen so it never visibly resets.
 */
export function replay(trigger, tl, start = 'top 85%') {
  const seen = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };
  const go = (self) => tl.progress() === 0 && seen(self.trigger) && tl.play();
  ScrollTrigger.create({ trigger, start, end: 'bottom 10%', onEnter: go, onEnterBack: go });
  const rewind = () => tl.pause(0);
  ScrollTrigger.create({ trigger, start: 'top bottom', end: 'bottom top', onLeave: rewind, onLeaveBack: rewind });
  return tl;
}

/** Fade-and-rise for every `.reveal` inside `root`. */
export function reveals(root) {
  gsap.utils.toArray('.reveal', root).forEach((el) => replay(el,
    paused().fromTo(el, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }), 'top 90%'));
}

/** Lotus dividers draw out from the centre. */
export function dividers(root) {
  gsap.utils.toArray('.divider', root).forEach((d) => replay(d, paused()
    .from(d.querySelectorAll('path'), { drawSVG: '50% 50%', duration: 1.6, ease: 'power2.inOut', stagger: 0.06 })
    .from(d.querySelectorAll('circle'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)', stagger: 0.05 }, 0.7)));
}

/** Headings split into words that rise out of a mask. */
export function splitHeadings(root) {
  gsap.utils.toArray('.split', root).forEach((el) => SplitText.create(el, {
    type: 'words', mask: 'words',
    onSplit: (self) => replay(el, paused().from(self.words, { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.07 })),
  }));
}

/** Oil-lamp flames flicker and their glow breathes. */
export function flicker(root) {
  if (reducedMotion()) return;
  gsap.utils.toArray('.flame', root).forEach((el) => gsap.to(el, {
    scaleY: () => gsap.utils.random(0.82, 1.12), scaleX: () => gsap.utils.random(0.9, 1.06), skewX: () => gsap.utils.random(-5, 5),
    transformOrigin: '50% 100%', duration: () => gsap.utils.random(0.12, 0.26), ease: 'sine.inOut', repeat: -1, repeatRefresh: true,
  }));
  gsap.utils.toArray('.flame-glow', root).forEach((el) => gsap.to(el, {
    scale: () => gsap.utils.random(0.85, 1.15), opacity: () => gsap.utils.random(0.55, 1), transformOrigin: '50% 50%',
    duration: () => gsap.utils.random(0.3, 0.7), ease: 'sine.inOut', repeat: -1, repeatRefresh: true,
  }));
}

/** Bells swing on their strings; thoranam strings and leaves sway gently. */
export function sway(root) {
  if (reducedMotion()) return;
  const r = gsap.utils.random;
  gsap.utils.toArray('.bell', root).forEach((b, i) => gsap.fromTo(b, { rotation: i % 2 ? -7 : 7 }, {
    rotation: i % 2 ? 7 : -7, transformOrigin: '50% 0%', duration: r(1.4, 2), ease: 'sine.inOut', yoyo: true, repeat: -1,
  }));
  gsap.utils.toArray('.toran-string, .mango-leaf:not(.kalasha-leaf):not(.arch-flower)', root).forEach((el, i) => gsap.fromTo(el, { rotation: i % 2 ? -3 : 3 }, {
    rotation: i % 2 ? 3 : -3, transformOrigin: '50% 0%', duration: r(2, 3.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: r(0, 1.5),
  }));
}

/**
 * Petals that drift down `box` forever. `make` returns the markup for one petal.
 */
export function drift(box, count, make, { size = [10, 20], opacity = [0.55, 0.95] } = {}) {
  if (!box || reducedMotion()) return;
  // React's StrictMode runs effects twice: clear petals left by a reverted earlier run.
  box.querySelectorAll('.petal').forEach((n) => n.remove());
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.innerHTML = make(i);
    box.appendChild(el);
    const s = gsap.utils.random(size[0], size[1]);
    const h = () => box.clientHeight || window.innerHeight;
    gsap.set(el, { width: s, height: s * 1.2, left: `${gsap.utils.random(0, 100)}%`, y: -40, rotation: gsap.utils.random(0, 360), opacity: gsap.utils.random(opacity[0], opacity[1]) });
    const go = () => gsap.fromTo(el, { y: -40, x: 0 }, {
      y: h() + 40, x: gsap.utils.random(-80, 80), rotation: `+=${gsap.utils.random(180, 540)}`,
      duration: gsap.utils.random(9, 16), ease: 'none', onComplete: go,
    });
    gsap.delayedCall(gsap.utils.random(0, 9), go);
  }
}

/** Markup for one falling petal, as a string (drift() builds plain DOM nodes). */
export const petalMarkup = (i) => `<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 24 C2 18 0 8 4 2 C7 4 9 5 10 3 C11 5 13 4 16 2 C20 8 18 18 10 24 Z" fill="url(#${i % 3 === 0 ? 'g-rose-petal' : 'g-petal'})"/><path d="M10 6 V20" stroke="#fff" stroke-width="0.6" opacity="0.4"/></svg>`;

/** The thoranam grows in from the left: rope draws, leaves unfurl, flowers pop, bells drop. */
export function growThoranam(svg) {
  const along = (spread) => (i, el) => {
    const m = el.transform?.baseVal?.consolidate?.()?.matrix;
    const x = m ? m.e : 0;
    return (x / 1200) * spread;
  };
  return paused()
    .from(svg.querySelector('.toran-rope'), { drawSVG: 0, duration: 1.4, ease: 'power1.inOut' })
    .from(svg.querySelectorAll('.mango-leaf'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.5, ease: 'back.out(2)', stagger: along(1.2) }, 0.1)
    .from(svg.querySelectorAll('.toran-string'), { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 0%', duration: 0.6, ease: 'back.out(1.6)', stagger: along(1.2) }, 0.2)
    .from(svg.querySelectorAll('.toran-knot'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)', stagger: along(1.2) }, 0.3)
    .from(svg.querySelectorAll('.bell'), { y: -30, autoAlpha: 0, duration: 0.8, ease: 'bounce.out', stagger: 0.12 }, 0.8);
}
