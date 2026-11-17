import { weddingDetails } from '../data/weddingDetails.js';
import { Ornament } from '../components/Ornament.jsx';
import { SectionDivider } from '../components/SectionDivider.jsx';
import weddingMandap from '../assets/wedding-mandap.svg';
import { motion, useReducedMotion } from 'framer-motion';
import { motionEase } from '../animations/motion.js';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <header className="hero" id="top">
      <div className="hero__petals" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
      <motion.div className="hero__copy" initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.82, ease: motionEase }}>
        <Ornament>❧ ✧ ❧</Ornament>
        {weddingDetails.invocations.map((line) => <p className="invitation-line" key={line}>{line}</p>)}
        <p className="eyebrow">Together with their families</p>
        <h1>A celebration<br />of two hearts</h1>
        <p className="intro">With the blessings of our elders,</p>
        <p className="intro">we joyfully invite you to celebrate</p>
        <div className="names" aria-label={`${weddingDetails.couple.firstName} and ${weddingDetails.partner.firstName}`}>
          <span className="hero__name hero__name--first">{weddingDetails.couple.firstName}</span>
          <span className="ampersand">&amp;</span>
          <span className="hero__name hero__name--last">{weddingDetails.partner.firstName}</span>
        </div>
        <p className="degrees">{weddingDetails.couple.firstName} {weddingDetails.couple.surnameStyle} · {weddingDetails.couple.qualification} <span className="dot">✦</span> {weddingDetails.partner.firstName} {weddingDetails.partner.surnameStyle} · {weddingDetails.partner.qualification}</p>
        <SectionDivider />
        <p className="date-line">{weddingDetails.ceremonyDate}</p>
        <p className="venue-short">{weddingDetails.venue.shortName} · {weddingDetails.venue.city}</p>
        <a className="button button--primary" href="#events">View Wedding Details <span aria-hidden="true">↗</span></a>
        <div className="scroll-note">Scroll to celebrate with us <span aria-hidden="true">↓</span></div>
      </motion.div>
      <motion.figure className="hero__artwork" initial={prefersReducedMotion ? false : { opacity: 0, x: 14, scale: 0.99 }}
        animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: prefersReducedMotion ? 0 : 0.95, delay: prefersReducedMotion ? 0 : 0.08, ease: motionEase }}>
        <div className="hero__parallax">
          <img src={weddingMandap} alt="Illustration of a South Indian wedding mandap adorned with mango leaves, banana plants, and traditional lamps" />
        </div>
        <figcaption>May your lives bloom together</figcaption>
      </motion.figure>
    </header>
  );
}
