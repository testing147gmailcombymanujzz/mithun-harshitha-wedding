import couplePortrait from '../assets/save-date-couple.svg';
import { Countdown } from '../components/Countdown.jsx';
import { SectionDivider } from '../components/SectionDivider.jsx';
import { weddingDetails } from '../data/weddingDetails.js';
import { motion, useReducedMotion } from 'framer-motion';
import { motionEase, sectionVariants } from '../animations/motion.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { kannadaCopy } from '../data/kannadaCopy.js';

export function SaveTheDateSection() {
  const [sectionRef, isInView] = useScrollReveal();
  const prefersReducedMotion = useReducedMotion();
  const [weekday, date] = weddingDetails.ceremonyDate.split(', ');
  const ceremonyTime = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(weddingDetails.ceremonyDateTime)).toUpperCase();

  return (
    <motion.section ref={sectionRef} id="save-the-date" className={`save-date-section${isInView ? ' is-in-view' : ''}`} aria-labelledby="save-date-title"
      variants={sectionVariants} initial={prefersReducedMotion || isInView ? false : 'hidden'}
      animate={isInView || prefersReducedMotion ? 'visible' : 'hidden'}
      transition={{ duration: prefersReducedMotion ? 0 : 0.78, ease: motionEase }}>
      <div className="save-date__sparkles" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="save-date__frame">
        <span className="save-date__corner save-date__corner--tl" aria-hidden="true" />
        <span className="save-date__corner save-date__corner--tr" aria-hidden="true" />
        <span className="save-date__corner save-date__corner--bl" aria-hidden="true" />
        <span className="save-date__corner save-date__corner--br" aria-hidden="true" />
      <motion.div className="save-date__content" initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={isInView || prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.72, delay: prefersReducedMotion ? 0 : 0.12, ease: motionEase }}>
          <p className="save-date__eyebrow">A day to remember<span className="kannada-line" lang="kn">{kannadaCopy.saveDate.eyebrow}</span></p>
          <h2 className="save-date__title" id="save-date-title">Save the Date<span className="kannada-line" lang="kn">{kannadaCopy.saveDate.title}</span></h2>
          <SectionDivider tone="ivory" />
          <p className="save-date__names">
            <span>{weddingDetails.couple.firstName}</span>
            <span className="save-date__ampersand">&amp;</span>
            <span>{weddingDetails.partner.firstName}</span>
          </p>
          <p className="save-date__kannada-names" lang="kn">{kannadaCopy.saveDate.couple}</p>
          <figure className="save-date__portrait">
            <img src={couplePortrait} alt="Illustrated South Indian bride and groom in traditional wedding attire, framed by jasmine and flowers" />
          </figure>
          <div className="save-date__date-block">
            <p className="save-date__date">{date}</p>
            <p className="save-date__weekday">{weekday}<span className="kannada-line" lang="kn">{kannadaCopy.saveDate.weekday}</span></p>
            <p className="save-date__kannada-date" lang="kn">{kannadaCopy.saveDate.date}</p>
            <p className="save-date__time">Muhurtham · {ceremonyTime} IST<span className="kannada-line" lang="kn">{kannadaCopy.saveDate.muhurtham} · {kannadaCopy.saveDate.time}</span></p>
          </div>
          <SectionDivider tone="ivory" />
          <Countdown />
        </motion.div>
      </div>
    </motion.section>
  );
}
