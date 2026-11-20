import { useRef } from 'react';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { Mandap } from '../art/scenes.jsx';
import { Divider, Thoranam } from '../art/ornaments.jsx';
import { drift, flicker, gsap, growThoranam, petalMarkup, reducedMotion, sway } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

/** Full-screen opening of the site: every line in Kannada and English, beside the mandap. */
export function HeroSection({ active }) {
  const root = useRef(null);

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    growThoranam(q('.thoranam')[0]).play();
    sway(el);
    flicker(el);
    drift(q('.hero-petals')[0], window.innerWidth < 640 ? 8 : 14, petalMarkup);

    gsap.timeline({ delay: 0.15 })
      .from(q('.hero-copy > *'), { y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 })
      .from(q('.mandap .draw'), { drawSVG: 0, duration: 1.8, ease: 'power1.inOut', stagger: 0.015 }, 0.2)
      .from(q('.mandap .pillar rect, .mandap-roof > path:first-child, .mandap-roof rect, .mandap-steps rect, .kolam > ellipse:first-child'), { autoAlpha: 0, duration: 1, ease: 'power1.out', stagger: 0.04 }, 0.9)
      .from(q('.banana'), { scaleY: 0, transformOrigin: '50% 100%', duration: 1.2, ease: 'back.out(1.4)', stagger: 0.15 }, 0.7)
      .from(q('.mandap .marigold, .mandap .mango-leaf'), { scale: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(3)', stagger: 0.012 }, 1.6)
      .from(q('.mandap-finial'), { y: -30, autoAlpha: 0, duration: 0.8, ease: 'bounce.out' }, 1.8)
      .from(q('.mandap .diya, .homa-flames'), { scale: 0, transformOrigin: '50% 100%', duration: 0.6, ease: 'back.out(2.5)', stagger: 0.1 }, 2)
      .from(q('.hero-names-en'), { backgroundPosition: '200% 0', duration: 2, ease: 'power2.out' }, 0.8);

    if (!reducedMotion()) {
      gsap.utils.toArray(q('.banana-leaves')).forEach((l, i) => gsap.to(l, { rotation: i ? -2.5 : 2.5, transformOrigin: '0% 100%', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
      gsap.to(q('.mandap-halo'), { scale: 1.06, opacity: 0.7, transformOrigin: '50% 50%', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(q('.scroll-cue svg'), { y: 6, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
    // The mandap drifts a little slower than the page.
    gsap.to(q('.hero-art'), { yPercent: 10, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
  }, active);

  return (
    <header ref={root} className="hero" id="top">
      <div className="hero-thoranam"><Thoranam width={1600} sag={26} /></div>
      <div className="hero-petals" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-invocations">
            {D.invocations.map((line, i) => (
              <p key={line}><span lang="kn">{K.invocations[i]}</span><span>{line}</span></p>
            ))}
          </div>
          <p className="hero-kicker"><span lang="kn">{K.shubhaVivaha}</span><b aria-hidden="true">✦</b><span>Shubha Vivaha</span></p>
          <p className="hero-blessing">
            <span lang="kn">{K.hero.blessing} {K.hero.invitation}</span>
            <span>With the blessings of our elders, we joyfully invite you to celebrate our wedding.</span>
          </p>
          <h2 className="hero-names" tabIndex={-1}>
            <span className="hero-names-kn" lang="kn">{K.hero.couple}</span>
            <span className="hero-names-en">{D.couple.firstName} <i>&amp;</i> {D.partner.firstName}</span>
          </h2>
          <Divider />
          <dl className="hero-facts">
            <div>
              <dt><span lang="kn">{K.events.muhurtham.title}</span><span>Wedding Muhurtham</span></dt>
              <dd><span lang="kn">{K.hero.date}</span><span>{D.ceremonyDate}</span></dd>
              <dd className="hero-time"><span lang="kn">{K.events.muhurtham.time}</span><span>7:58 AM – 8:50 AM IST · Dhanu Lagna</span></dd>
            </div>
            <div>
              <dt><span lang="kn">{K.venue.title}</span><span>Venue</span></dt>
              <dd><span lang="kn">{K.hero.venue}</span><span>{D.venue.shortName}, {D.venue.city}</span></dd>
            </div>
          </dl>
          <div className="hero-actions">
            <a className="btn" href="#events"><span>View Wedding Details</span><small lang="kn">{K.hero.details}</small></a>
            <a className="btn btn-ghost" href="#venue"><span>Get Directions</span><small lang="kn">{K.venue.directions}</small></a>
          </div>
        </div>
        <figure className="hero-art">
          <Mandap />
          <figcaption><span lang="kn">{K.hero.caption}</span><span>May your lives bloom together</span></figcaption>
        </figure>
      </div>
      <a className="scroll-cue" href="#save-the-date">
        <span lang="kn">{K.hero.scroll}</span>
        <span>Scroll to celebrate with us</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L12 12 L18 6" /><path d="M6 12 L12 18 L18 12" /></svg>
      </a>
    </header>
  );
}
