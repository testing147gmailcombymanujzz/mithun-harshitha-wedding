import receptionIllustration from '../assets/reception-vilakku.svg';
import muhurthamIllustration from '../assets/muhurtham-thali.svg';
import floralCorner from '../assets/floral-corner.svg';
import { motion, useReducedMotion } from 'framer-motion';
import { cardVariants, motionEase } from '../animations/motion.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

const illustrations = {
  reception: receptionIllustration,
  muhurtham: muhurthamIllustration,
};

export function EventCard({ event }) {
  const prefersReducedMotion = useReducedMotion();
  const [revealRef, isVisible] = useScrollReveal();

  return (
    <motion.article ref={revealRef} className={`event-card card event-card--${event.id}${event.featured ? ' featured' : ''}`}
      variants={cardVariants} initial={prefersReducedMotion || isVisible ? false : 'hidden'} animate={isVisible || prefersReducedMotion ? 'visible' : 'hidden'}
      transition={{ duration: prefersReducedMotion ? 0 : 0.68, delay: prefersReducedMotion ? 0 : (event.id === 'muhurtham' ? 0.12 : 0), ease: motionEase }}
      whileHover={prefersReducedMotion ? undefined : { y: -5, transition: { duration: 0.22 } }}>
      <div className="event-card__florals" aria-hidden="true">
        <img className="event-card__floral event-card__floral--tl" src={floralCorner} alt="" />
        <img className="event-card__floral event-card__floral--tr" src={floralCorner} alt="" />
        <img className="event-card__floral event-card__floral--bl" src={floralCorner} alt="" />
        <img className="event-card__floral event-card__floral--br" src={floralCorner} alt="" />
      </div>
      <img className="event-card__illustration" src={illustrations[event.id]} alt={event.illustrationAlt} />
      <p className="event-label">{event.label}</p>
      <h3>{event.name}</h3>
      <p className="event-date">{event.date}</p>
      <p className="event-time">{event.time} <span className="event-timezone">{event.timeZone}</span></p>
      {event.lagna && <p className="lagna"><span>Lagna:</span> {event.lagna}</p>}
      <a className="button button--outline event-card__calendar" href={event.calendarFile} download>
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 2v3m10-3v3M3 7h14M4 4h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm2 6h2m3 0h2m-7 3h2m3 0h2" /></svg>
        Add to Calendar
      </a>
    </motion.article>
  );
}
