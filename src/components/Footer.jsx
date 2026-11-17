import { weddingDetails } from '../data/weddingDetails.js';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { motionEase } from '../animations/motion.js';

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const [footerRef, isVisible] = useScrollReveal();
  return (
    <motion.footer ref={footerRef} initial={prefersReducedMotion || isVisible ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: isVisible || prefersReducedMotion ? 1 : 0, y: isVisible || prefersReducedMotion ? 0 : 16 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: motionEase }}>
      <p>Made with love for the wedding of</p>
      <p className="footer-names">{weddingDetails.couple.firstName} <span>&amp;</span> {weddingDetails.partner.firstName}</p>
      <p>{weddingDetails.footerDate}</p>
    </motion.footer>
  );
}
