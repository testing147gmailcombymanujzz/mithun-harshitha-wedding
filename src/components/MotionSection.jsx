import { motion, useReducedMotion } from 'framer-motion';
import { motionEase, sectionVariants } from '../animations/motion.js';
import { useScrollReveal } from '../animations/useScrollReveal.js';

export function MotionSection({ className, children, ...props }) {
  const [sectionRef, isInView] = useScrollReveal();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      {...props}
      ref={sectionRef}
      className={`${className} motion-section${isInView ? ' is-in-view' : ''}`}
      variants={sectionVariants}
      initial={prefersReducedMotion || isInView ? false : 'hidden'}
      animate={isInView || prefersReducedMotion ? 'visible' : 'hidden'}
      transition={{ duration: prefersReducedMotion ? 0 : 0.78, ease: motionEase }}
    >
      {children}
    </motion.section>
  );
}
