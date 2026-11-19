import floralCorner from '../assets/floral-corner.svg';
import { motion, useReducedMotion } from 'framer-motion';
import { motionEase, cardVariants } from '../animations/motion.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { kannadaCopy } from '../data/kannadaCopy.js';

export function PersonCard({ person }) {
  const prefersReducedMotion = useReducedMotion();
  const [revealRef, isVisible] = useScrollReveal();
  const localizedPerson = kannadaCopy.people[person.firstInitial.toLowerCase()];
  return (
    <motion.article ref={revealRef} className={`person-card card person-card--${person.firstInitial.toLowerCase()}`}
      variants={cardVariants} initial={prefersReducedMotion || isVisible ? false : 'hidden'} animate={isVisible || prefersReducedMotion ? 'visible' : 'hidden'}
      transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : (person.firstInitial === 'H' ? 0.12 : 0), ease: motionEase }}
      whileHover={prefersReducedMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}>
      <div className="person-card__florals" aria-hidden="true">
        <img className="person-card__floral person-card__floral--left" src={floralCorner} alt="" />
        <img className="person-card__floral person-card__floral--right" src={floralCorner} alt="" />
      </div>
      <div className="person-card__portrait" aria-label={`Decorative portrait frame for ${person.firstName}; no photograph supplied`}>
        <span className="person-card__portrait-flower" aria-hidden="true">✿</span>
        <span className="person-card__monogram">{person.firstInitial}</span>
        <span className="person-card__portrait-caption">Portrait</span>
      </div>
      <p className="person-card__honorific">{person.formalPrefix}</p>
      <h3>{person.firstName} {person.surnameStyle}</h3>
      <p className="person-card__kannada-name" lang="kn">{localizedPerson.name}</p>
      {person.qualification && <p className="qualification">{person.qualification}</p>}
      {person.familyIntro && <p className="person-card__family-intro">{person.familyIntro}<span className="kannada-line" lang="kn">{localizedPerson.relation}</span></p>}
      <p className="family">{person.family.map((line) => <span key={line}>{line}<br /></span>)}<span className="person-card__family-kannada" lang="kn">{localizedPerson.family}</span></p>
      <p className="person-card__address-label">Address <span lang="kn">/ {kannadaCopy.people.address}</span></p>
      <address className="person-card__address">{person.address.map((line) => <span key={line}>{line}<br /></span>)}</address>
    </motion.article>
  );
}
