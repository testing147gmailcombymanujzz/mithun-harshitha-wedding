import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Defs } from './art/Defs.jsx';
import { EnvelopeIntro } from './components/EnvelopeIntro.jsx';
import { MusicPlayer } from './components/MusicPlayer.jsx';
import { CoupleSection } from './sections/CoupleSection.jsx';
import { EventsSection } from './sections/EventsSection.jsx';
import { HeroSection } from './sections/HeroSection.jsx';
import { SaveTheDateSection } from './sections/SaveTheDateSection.jsx';
import { VenueSection } from './sections/VenueSection.jsx';
import { gsap, ScrollTrigger } from './motion/gsap.js';

export default function App() {
  // 'sealed' → envelope showing; 'leaving' → envelope fading, site animating in; 'open' → done.
  const [stage, setStage] = useState('sealed');
  const active = stage !== 'sealed';

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in step.
  useEffect(() => {
    if (stage !== 'open') return undefined;
    document.querySelector('.hero-names')?.focus({ preventScroll: true });
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.6, offset: -10 });
    };
    document.addEventListener('click', onClick);
    ScrollTrigger.refresh();
    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [stage]);

  useEffect(() => {
    if (active) document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, [active]);

  return (
    <>
      <Defs />
      {stage !== 'open' && <EnvelopeIntro onLeaving={() => setStage('leaving')} onEnter={() => setStage('open')} />}
      <div className="page" inert={stage !== 'open'} aria-hidden={stage !== 'open'}>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <HeroSection active={active} />
        <main id="main-content" tabIndex={-1}>
          <SaveTheDateSection active={active} />
          <CoupleSection active={active} />
          <EventsSection active={active} />
          <VenueSection active={active} />
        </main>
      </div>
      <MusicPlayer />
    </>
  );
}
