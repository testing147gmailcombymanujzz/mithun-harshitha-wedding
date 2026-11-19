import { weddingDetails } from '../data/weddingDetails.js';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollReveal } from '../animations/useScrollReveal.js';
import { motionEase } from '../animations/motion.js';
import { kannadaCopy } from '../data/kannadaCopy.js';

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const [footerRef, isVisible] = useScrollReveal();
  return (
    <motion.footer ref={footerRef} initial={prefersReducedMotion || isVisible ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: isVisible || prefersReducedMotion ? 1 : 0, y: isVisible || prefersReducedMotion ? 0 : 16 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: motionEase }}>
      <p>Made with love for the wedding of<span className="kannada-line" lang="kn">{kannadaCopy.footer.madeWithLove}</span></p>
      <p className="footer-names">{weddingDetails.couple.firstName} <span>&amp;</span> {weddingDetails.partner.firstName}</p>
      <p className="footer-names-kannada" lang="kn">{kannadaCopy.closing.couple}</p>
      <p>{weddingDetails.footerDate}</p>
      <div className="footer__designer">
        <div className="footer__divider" aria-hidden="true"><span />✧<span /></div>
        <p className="footer__quote">“Every beautiful beginning deserves an invitation as special as the moment.”</p>
        <p className="footer__invitation">Want a beautiful digital invitation for your special occasion?<span className="kannada-line" lang="kn">{kannadaCopy.footer.invitation}</span></p>
        <p className="footer__credit">Designed with love by <span>Manoj Kumar N</span></p>
        <address className="footer__contact">
          <a href="tel:8095828114">Phone: 8095828114</a>
          <a href="mailto:manojkumarn858@gmail.com">Email: manojkumarn858@gmail.com</a>
        </address>
        <p className="footer__signoff">“Let&apos;s make your special moments unforgettable.”<span className="kannada-line" lang="kn">{kannadaCopy.footer.signoff}</span></p>
      </div>
    </motion.footer>
  );
}
