import { useRef } from 'react';
import { Pavilion } from '../art/scenes.jsx';
import { Divider } from '../art/ornaments.jsx';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { dividers, gsap, paused, reducedMotion, replay, reveals, splitHeadings } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

export function VenueSection({ active }) {
  const root = useRef(null);

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    reveals(el);
    dividers(el);
    splitHeadings(el);
    // The pavilion is drawn as the section scrolls through, then its lights come on.
    gsap.from(q('.pavilion .draw'), { drawSVG: 0, ease: 'none', stagger: 0.03, scrollTrigger: { trigger: el, start: 'top 80%', end: 'center 60%', scrub: 0.8 } });
    replay(q('.pavilion')[0], paused().from(q('.pavilion .bulb, .pavilion .palm circle'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', stagger: 0.05, duration: 0.4, ease: 'back.out(3)' }), 'top 50%');
    if (!reducedMotion()) {
      q('.pavilion .bulb').forEach((b, i) => gsap.to(b, { opacity: 0.35, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 3) * 0.4 }));
      gsap.to(q('.palm'), { rotation: 1.5, transformOrigin: '50% 100%', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }, active);

  return (
    <section ref={root} id="venue" className="section venue">
      <div className="section-inner">
        <Pavilion />
        <header className="section-head">
          <p className="eyebrow reveal"><span lang="kn">{K.venue.eyebrow}</span><span>Celebrate with us</span></p>
          <h2 className="section-title"><span className="split">{D.venue.shortName}</span><span className="title-kn reveal" lang="kn">{K.hero.venue}</span></h2>
          <Divider />
        </header>
        <div className="venue-address reveal">
          <p lang="kn">{K.venue.address.map((l) => <span key={l}>{l}</span>)}</p>
          <p>{D.venue.address.map((l) => <span key={l}>{l}</span>)}</p>
        </div>
        <div className="venue-actions reveal">
          <a className="btn" target="_blank" rel="noopener noreferrer" href={D.venue.mapUrl}><span>Get Directions</span><small lang="kn">{K.venue.directions}</small></a>
          {D.events.map((e) => (
            <a className="btn btn-ghost" href={e.calendarFile} download key={e.id}>
              <span>Add {e.name}</span><small lang="kn">{e.id === 'reception' ? K.venue.addReception : K.venue.addMuhurtham}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
