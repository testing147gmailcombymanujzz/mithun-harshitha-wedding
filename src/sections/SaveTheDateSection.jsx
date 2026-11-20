import { useRef } from 'react';
import { Countdown } from '../components/Countdown.jsx';
import { CoupleUnderArch } from '../art/couple.jsx';
import { Corner, Divider } from '../art/ornaments.jsx';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { dividers, drift, gsap, paused, petalMarkup, reducedMotion, replay, reveals, splitHeadings, sway } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

export function SaveTheDateSection({ active }) {
  const root = useRef(null);
  const [weekday, date] = D.ceremonyDate.split(', ');

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    reveals(el);
    dividers(el);
    splitHeadings(el);
    sway(el);
    drift(q('.sd-petals')[0], window.innerWidth < 640 ? 7 : 12, petalMarkup, { opacity: [0.4, 0.8] });

    // The arch is traced with the scroll; then the couple rise into it and their garlands bloom.
    gsap.from(q('.arch-line path'), { drawSVG: 0, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: q('.couple-arch')[0], start: 'top 85%', end: 'center 55%', scrub: 0.8 } });
    replay(q('.couple-arch')[0], paused()
      .from(q('.arch-fill, .arch-sun, .arch-rays'), { autoAlpha: 0, duration: 0.8, ease: 'power1.out' })
      .from(q('.arch-rays'), { rotation: -20, transformOrigin: '50% 100%', duration: 1.6, ease: 'power2.out' }, 0)
      .from(q('.av-groom'), { y: 60, x: -20, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0.2)
      .from(q('.av-bride'), { y: 60, x: 20, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0.35)
      .from(q('.garland-flower'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)', stagger: 0.025 }, 1)
      .from(q('.arch-flower'), { scale: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2.5)', stagger: 0.05 }, 0.9)
      .from(q('.arch-kalasha'), { y: -24, autoAlpha: 0, duration: 0.8, ease: 'bounce.out' }, 1.3)
      .from(q('.arch-bells .bell'), { y: -20, autoAlpha: 0, duration: 0.8, ease: 'bounce.out', stagger: 0.12 }, 1.4), 'top 70%');

    replay(q('.sd-countdown')[0], paused().from(q('.count-box'), {
      rotationX: -90, autoAlpha: 0, transformOrigin: '50% 0%', transformPerspective: 600, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.1,
    }), 'top 90%');

    if (!reducedMotion()) {
      // The couple lean in toward each other, blink now and then, and the jhumkas swing.
      gsap.to(q('.av-groom .av-head'), { rotation: 4, transformOrigin: '50% 96%', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(q('.av-bride .av-head'), { rotation: -4, transformOrigin: '50% 96%', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.3 });
      q('.av-eyes').forEach((eyes, i) => gsap.timeline({ repeat: -1, repeatDelay: 2.8 + i * 0.9, delay: i * 1.3 })
        .to(eyes, { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08, ease: 'power1.in' })
        .to(eyes, { scaleY: 1, duration: 0.12, ease: 'power1.out' }));
      gsap.to(q('.jhumka'), { rotation: 8, transformOrigin: '50% 0%', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(q('.arch-sun'), { scale: 1.08, transformOrigin: '50% 50%', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }, active);

  return (
    <section ref={root} id="save-the-date" className="section save-date" aria-labelledby="save-date-title">
      <div className="sd-petals" aria-hidden="true" />
      <div className="frame" aria-hidden="true">
        <Corner className="tl" /><Corner className="tr" /><Corner className="bl" /><Corner className="br" />
      </div>
      <div className="section-inner sd-grid">
        <figure className="sd-art"><CoupleUnderArch /></figure>
        <div className="sd-copy">
          <p className="eyebrow reveal"><span lang="kn">{K.saveDate.eyebrow}</span><span>A day to remember</span></p>
          <h2 className="section-title" id="save-date-title">
            <span className="split">Save the Date</span>
            <span className="title-kn reveal" lang="kn">{K.saveDate.title}</span>
          </h2>
          <Divider tone="light" />
          <p className="sd-names reveal">
            <span className="sd-names-kn" lang="kn">{K.saveDate.couple}</span>
            <span className="sd-names-en">{D.couple.firstName} <i>&amp;</i> {D.partner.firstName}</span>
          </p>
          <div className="sd-date reveal">
            <div className="sd-date-row">
              <span className="sd-side"><span lang="kn">{K.saveDate.weekday}</span><span>{weekday}</span></span>
              <span className="sd-day">11</span>
              <span className="sd-side"><span lang="kn">ಡಿಸೆಂಬರ್ 2026</span><span>{date.replace(/^11 /, '')}</span></span>
            </div>
            <p className="sd-time"><span lang="kn">{K.saveDate.muhurtham} · {K.saveDate.time}</span><span>Muhurtham · 7:58 AM IST</span></p>
          </div>
          <Countdown />
        </div>
      </div>
    </section>
  );
}
