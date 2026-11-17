import garland from '../assets/hanging-garland.svg';
import elephant from '../assets/traditional-elephant.svg';
import { weddingDetails } from '../data/weddingDetails.js';
import { MotionSection } from '../components/MotionSection.jsx';
import { motion, useReducedMotion } from 'framer-motion';
import { motionEase } from '../animations/motion.js';

export function FamilySection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionSection className="closing-section section section--burgundy" aria-labelledby="closing-title">
      <div className="closing__garlands" aria-hidden="true">
        <img className="closing__garland closing__garland--left" src={garland} alt="" />
        <img className="closing__garland closing__garland--right" src={garland} alt="" />
      </div>
      <div className="closing__frame" aria-hidden="true" />
      <span className="closing__corner closing__corner--tl" aria-hidden="true">❧</span>
      <span className="closing__corner closing__corner--tr" aria-hidden="true">❧</span>
      <span className="closing__corner closing__corner--bl" aria-hidden="true">❧</span>
      <span className="closing__corner closing__corner--br" aria-hidden="true">❧</span>
      <motion.div className="closing__content" initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.82, delay: prefersReducedMotion ? 0 : 0.1, ease: motionEase }}>
        <p className="closing__eyebrow">With best compliments from:</p>
        <div className="closing__families">
          {weddingDetails.compliments.map((line) => <p key={line}>{line}</p>)}
        </div>
        <div className="closing__ornament" aria-hidden="true"><span />✧<span /></div>
        <p className="closing__message">
          <span>We would be honoured by your gracious presence</span>
          <span>and blessings on our special day.</span>
        </p>
        <div className="closing__couple">
          <img className="closing__elephant closing__elephant--left" src={elephant} alt="" aria-hidden="true" />
          <div className="closing__identity">
            <h2 id="closing-title" className="closing__names">
              {weddingDetails.couple.firstName}<i>&amp;</i>{weddingDetails.partner.firstName}
            </h2>
            <p className="closing__date">{weddingDetails.closingDateText}</p>
          </div>
          <img className="closing__elephant closing__elephant--right" src={elephant} alt="" aria-hidden="true" />
        </div>
      </motion.div>
    </MotionSection>
  );
}
