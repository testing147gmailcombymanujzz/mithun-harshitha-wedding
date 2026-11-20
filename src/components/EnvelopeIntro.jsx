/**
 * The opening: a maroon-and-gold envelope sealed with the couple's initials. Tapping
 * the seal plays one GSAP timeline: the seal is pressed and lifts away, the flap folds
 * back in 3D, the invitation card slides out while the envelope sinks, the envelope
 * falls away and the card comes forward in a shower of marigold petals. Then the
 * guest enters the site (or it continues on its own after a moment).
 */
import { useEffect, useRef, useState } from 'react';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { EnvelopeBack, EnvelopeFront, FlapBack, FlapFront, Seal } from '../art/scenes.jsx';
import { Corner, Thoranam } from '../art/ornaments.jsx';
import { drift, flicker, gsap, growThoranam, petalMarkup, reducedMotion, sway } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

export function EnvelopeIntro({ onLeaving, onEnter }) {
  const root = useRef(null);
  const openTl = useRef(null);
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root.current?.querySelector('.seal')?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = previous; };
  }, []);

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    growThoranam(q('.thoranam')[0]).play();
    sway(el);
    flicker(el);
    drift(q('.intro-petals')[0], window.innerWidth < 640 ? 10 : 18, petalMarkup);

    gsap.timeline({ delay: 0.2 })
      .from(q('.intro-heading > *'), { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
      .from(q('.envelope'), { y: 80, autoAlpha: 0, rotation: -3, duration: 1.1, ease: 'power3.out' }, 0.3)
      .from(q('.seal-wax'), { scale: 0, rotation: -40, transformOrigin: '50% 50%', duration: 0.9, ease: 'back.out(2)' }, 1)
      .from(q('.seal-l1'), { x: -14, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.5)
      .from(q('.seal-l2'), { x: 14, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.5)
      .from(q('.seal-amp'), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)' }, 1.9)
      .from(q('.intro-hint'), { y: 16, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, 1.8);

    if (!reducedMotion()) {
      // The seal breathes with a soft golden glow until it is tapped.
      gsap.timeline({ repeat: -1, repeatDelay: 1, delay: 2.4 })
        .to(q('.seal svg'), { scale: 1.07, duration: 0.5, ease: 'sine.inOut' })
        .to(q('.seal svg'), { scale: 1, duration: 0.6, ease: 'sine.inOut' });
      gsap.to(q('.intro-hint-hand'), { y: 5, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    const cardScale = () => {
      const env = q('.envelope')[0];
      const w = env.offsetWidth * 0.9;
      const h = env.offsetHeight * 0.9;
      return Math.min((window.innerWidth * 0.94) / w, (window.innerHeight * 0.66) / h, 1.55);
    };
    const cardShift = () => {
      const stage = q('.stage')[0];
      const r = stage.getBoundingClientRect();
      return window.innerHeight * 0.45 - (r.top + r.height / 2);
    };
    const parts = q('.env-back, .env-front, .env-flap');

    openTl.current = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } })
      .to(q('.intro-hint'), { autoAlpha: 0, y: 16, duration: 0.3 }, 0)
      .to(q('.seal'), { scale: 0.88, duration: 0.14, ease: 'power2.in' }, 0)
      .to(q('.seal'), { scale: 1.12, duration: 0.2, ease: 'power2.out' }, 0.14)
      .to(q('.seal'), { y: -70, rotation: -28, scale: 0.55, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0.38)
      .to(q('.env-flap'), { rotationX: 180, duration: 1, ease: 'power2.inOut' }, 0.55)
      .set(q('.env-flap'), { zIndex: 2 }, 1.05)
      .to(q('.intro-heading'), { autoAlpha: 0, y: -24, duration: 0.6 }, 1)
      .to(q('.letter'), { yPercent: -72, duration: 1.1 }, 1.45)
      .to(q('.envelope'), { yPercent: 30, duration: 1.1 }, 1.45)
      .set(q('.letter'), { zIndex: 7 }, 2.55)
      .to(parts, { y: () => window.innerHeight, rotation: 5, autoAlpha: 0, duration: 1, ease: 'power2.in' }, 2.55)
      .to(q('.envelope'), { yPercent: 0, duration: 1.05 }, 2.55)
      .to(q('.letter'), { yPercent: 0, y: cardShift, scale: cardScale, duration: 1.05, ease: 'power3.inOut' }, 2.55)
      .add(() => burst(q('.burst')[0]), 3.2)
      .to(q('.card-reveal'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 3.2)
      .fromTo(q('.intro-enter'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.5)
      .call(() => setReady(true));
  });

  // Once open, the site follows on its own after a pause, unless the guest taps first.
  useEffect(() => {
    if (!ready) return undefined;
    root.current?.querySelector('.intro-enter button')?.focus({ preventScroll: true });
    const id = window.setTimeout(enter, 3200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function open() {
    if (opened) return;
    setOpened(true);
    window.dispatchEvent(new Event('wedding:open'));
    const tl = openTl.current;
    if (reducedMotion()) tl.timeScale(2.5);
    tl.play();
  }

  function enter() {
    if (leaving.current) return;
    leaving.current = true;
    onLeaving?.();
    gsap.timeline({ onComplete: onEnter })
      .to(root.current.querySelector('.letter'), { scale: '+=0.12', autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 0)
      .to(root.current, { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 0.2);
  }

  return (
    <section ref={root} className={`intro${opened ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="intro-thoranam"><Thoranam /></div>
      <div className="intro-petals" aria-hidden="true" />
      <div className="burst" aria-hidden="true" />

      <header className="intro-heading">
        <p className="intro-kicker"><span lang="kn">{K.shubhaVivaha}</span><span>Shubha Vivaha</span></p>
        <h1 id="intro-title" className="sr-only">{D.couple.firstName} &amp; {D.partner.firstName} wedding invitation</h1>
      </header>

      <div className="stage">
        <div className="envelope">
          <div className="env-part env-back"><EnvelopeBack /></div>
          <div className="letter" aria-hidden={!opened}>
            <article className="card">
              <Corner className="tl" /><Corner className="tr" /><Corner className="bl" /><Corner className="br" />
              <p className="card-invocation" lang="kn">{K.invocations[0]}</p>
              <p className="card-title"><span lang="kn">{K.shubhaVivaha}</span><span className="card-dot">✦</span><span>Wedding Invitation</span></p>
              <p className="card-names-kn" lang="kn">{K.hero.couple}</p>
              <p className="card-names">{D.couple.firstName} <i>&amp;</i> {D.partner.firstName}</p>
              <div className="card-rule" aria-hidden="true"><span />❁<span /></div>
              <p className="card-date"><span lang="kn">{K.saveDate.date}</span><span>{D.ceremonyDate}</span></p>
              <p className="card-city"><span lang="kn">ಬೆಂಗಳೂರು</span> · {D.venue.city}</p>
            </article>
          </div>
          <div className="env-part env-front"><EnvelopeFront /></div>
          <div className="env-part env-flap">
            <div className="flap-face flap-front"><FlapFront /></div>
            <div className="flap-face flap-back"><FlapBack /></div>
          </div>
          <button className="env-part seal" type="button" onClick={open} disabled={opened}
            aria-label="Tap the seal to open the wedding invitation">
            <Seal initials={[D.couple.firstInitial, D.partner.firstInitial]} />
          </button>
        </div>
      </div>

      <p className="intro-hint">
        <span className="intro-hint-hand" aria-hidden="true">☝</span>
        <span lang="kn">{K.intro.instruction}</span>
        <span>Tap the seal to open</span>
      </p>

      <div className="intro-enter" aria-live="polite">
        <p className="card-reveal" lang="kn">{K.intro.waiting}</p>
        <button type="button" onClick={enter} disabled={!ready}>
          <span>Enter the invitation</span><small lang="kn">{K.intro.enter}</small>
        </button>
      </div>
    </section>
  );
}

/** Marigold and rose petals burst out from behind the card and flutter down. */
function burst(box) {
  if (!box) return;
  const n = window.innerWidth < 640 ? 26 : 40;
  for (let i = 0; i < n; i += 1) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.innerHTML = petalMarkup(i);
    box.appendChild(el);
    const s = gsap.utils.random(10, 20);
    const a = gsap.utils.random(-Math.PI, 0);
    const d = gsap.utils.random(140, Math.min(window.innerWidth, 900) * 0.55);
    gsap.set(el, { width: s, height: s * 1.2, x: 0, y: 0, rotation: gsap.utils.random(0, 360) });
    gsap.timeline({ onComplete: () => el.remove() })
      .to(el, { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8, duration: 0.9, ease: 'power3.out' })
      .to(el, { y: `+=${window.innerHeight * 0.7}`, x: `+=${gsap.utils.random(-60, 60)}`, rotation: `+=${gsap.utils.random(180, 520)}`, duration: gsap.utils.random(2.4, 3.6), ease: 'power1.in' }, 0.7)
      .to(el, { autoAlpha: 0, duration: 0.6 }, '-=0.6');
  }
}
