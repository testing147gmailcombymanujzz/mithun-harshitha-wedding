import { useRef } from 'react';
import { Corner, Elephant, Thoranam } from '../art/ornaments.jsx';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { gsap, growThoranam, paused, reducedMotion, replay, sway } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

/** One line in both languages, side by side on wide screens and stacked on phones. */
function Pair({ en, kn, className = '' }) {
  return (
    <div className={`pair ${className}`}>
      <p className="pair-en">{en}</p>
      <span className="pair-rule" aria-hidden="true" />
      <p className="pair-kn" lang="kn">{kn}</p>
    </div>
  );
}

/** The green blessing section: compliments from the families, fully in English and Kannada. */
export function FamilySection({ active }) {
  const root = useRef(null);

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    replay(q('.closing-thoranam')[0], growThoranam(q('.thoranam')[0]), 'top 95%');
    sway(el);
    replay(q('.closing-body')[0], paused()
      .from(q('.closing-frame .corner path'), { drawSVG: 0, duration: 1.4, ease: 'power2.inOut' })
      .from(q('.pair'), { y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.2)
      .from(q('.pair-rule'), { scaleY: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'power2.out', stagger: 0.12 }, 0.5), 'top 80%');
    replay(q('.closing-couple')[0], paused()
      .from(q('.elephant--left'), { x: -80, autoAlpha: 0, duration: 1.3, ease: 'power3.out' })
      .from(q('.elephant--right'), { x: 80, autoAlpha: 0, duration: 1.3, ease: 'power3.out' }, 0)
      .from(q('.closing-names > *'), { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15 }, 0.4), 'top 85%');
    if (!reducedMotion()) {
      gsap.to(q('.elephant-trunk'), { rotation: -8, transformOrigin: '10% 10%', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(q('.elephant'), { y: -4, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }, active);

  return (
    <section ref={root} className="section closing" aria-labelledby="closing-title">
      <div className="closing-thoranam"><Thoranam width={1400} sag={30} /></div>
      <div className="closing-frame" aria-hidden="true">
        <Corner className="tl" /><Corner className="tr" /><Corner className="bl" /><Corner className="br" />
      </div>
      <div className="section-inner closing-body">
        <div className="closing-langs" aria-hidden="true"><span>English</span><span lang="kn">ಕನ್ನಡ</span></div>
        <Pair className="pair--eyebrow" en="With best compliments from" kn={K.closing.eyebrow} />
        {D.compliments.map((line, i) => <Pair key={line} className="pair--family" en={line} kn={K.closing.families[i]} />)}
        <div className="closing-ornament" aria-hidden="true"><span />❁<span /></div>
        <Pair className="pair--message"
          en="We would be honoured by your gracious presence and blessings on our special day."
          kn={K.closing.message} />
        <div className="closing-couple">
          <Elephant className="elephant--left" />
          <div className="closing-names">
            <h2 id="closing-title" className="closing-names-en">{D.couple.firstName} <i>&amp;</i> {D.partner.firstName}</h2>
            <p className="closing-names-kn" lang="kn">{K.closing.couple}</p>
            <p className="closing-date"><span>{D.closingDateText}</span><span lang="kn">{K.closing.date}</span></p>
          </div>
          <Elephant className="elephant--right" />
        </div>
      </div>
    </section>
  );
}
