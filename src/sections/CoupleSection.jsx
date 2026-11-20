import { useRef } from 'react';
import { AvatarMedallion } from '../art/couple.jsx';
import { Divider, Kalasha } from '../art/ornaments.jsx';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { dividers, gsap, paused, reducedMotion, replay, reveals, splitHeadings } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

function PersonCard({ person, who }) {
  const kn = K.people[person.firstInitial.toLowerCase()];
  return (
    <article className={`person person--${who}`}>
      <AvatarMedallion who={who} />
      <p className="person-prefix"><span lang="kn">{kn.prefix}</span><span>{person.formalPrefix}</span></p>
      <h3 className="person-name">
        <span className="person-name-kn" lang="kn">{kn.name}</span>
        <span className="person-name-en">{person.firstName} {person.surnameStyle}</span>
      </h3>
      {person.qualification && <p className="person-qual">{person.qualification}</p>}
      <p className="person-family-label"><span lang="kn">{kn.relation}</span><span>{person.familyIntro.replace(':', '')}</span></p>
      <p className="person-family"><span lang="kn">{kn.family}</span><span>{person.family.join(', ')}</span></p>
      <p className="person-address-label"><span lang="kn">{K.people.address}</span> · Address</p>
      <address className="person-address">{person.address.map((line) => <span key={line}>{line}</span>)}</address>
    </article>
  );
}

export function CoupleSection({ active }) {
  const root = useRef(null);

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    reveals(el);
    dividers(el);
    splitHeadings(el);
    // The two families come together from either side, with the kalasha between them.
    replay(q('.couple-grid')[0], paused()
      .from(q('.person--groom'), { x: -60, autoAlpha: 0, duration: 1.1, ease: 'power3.out' })
      .from(q('.person--bride'), { x: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0)
      .from(q('.medallion-ring'), { drawSVG: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.1 }, 0.3)
      .from(q('.couple-center'), { scale: 0, autoAlpha: 0, duration: 0.9, ease: 'back.out(2.4)' }, 0.6)
      .from(q('.couple-center .kalasha-leaf'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.5, ease: 'back.out(2)', stagger: 0.06 }, 1), 'top 75%');
    if (!reducedMotion()) {
      gsap.to(q('.couple-center svg'), { y: -6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      q('.av-eyes').forEach((eyes, i) => gsap.timeline({ repeat: -1, repeatDelay: 3.2 + i, delay: i * 1.7 })
        .to(eyes, { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08 }).to(eyes, { scaleY: 1, duration: 0.12 }));
    }
  }, active);

  return (
    <section ref={root} id="couple" className="section couple">
      <div className="section-inner">
        <header className="section-head">
          <p className="eyebrow reveal"><span lang="kn">{K.couple.eyebrow}</span><span>A new beginning</span></p>
          <h2 className="section-title"><span className="split">Meet the Couple</span><span className="title-kn reveal" lang="kn">{K.couple.title}</span></h2>
          <Divider />
        </header>
        <div className="couple-grid">
          <PersonCard person={D.couple} who="groom" />
          <div className="couple-center" aria-hidden="true"><Kalasha /></div>
          <PersonCard person={D.partner} who="bride" />
        </div>
      </div>
    </section>
  );
}
