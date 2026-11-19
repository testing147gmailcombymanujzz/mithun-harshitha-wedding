import { useEffect, useState } from 'react';
import { Footer } from './components/Footer.jsx';
import { SiteNav } from './components/SiteNav.jsx';
import { CoupleSection } from './sections/CoupleSection.jsx';
import { EventsSection } from './sections/EventsSection.jsx';
import { FamilySection } from './sections/FamilySection.jsx';
import { HeroSection } from './sections/HeroSection.jsx';
import { SaveTheDateSection } from './sections/SaveTheDateSection.jsx';
import { VenueSection } from './sections/VenueSection.jsx';
import { MusicPlayer } from './components/MusicPlayer.jsx';
import { WeddingEnvelopeIntro } from './components/WeddingEnvelopeIntro.jsx';

export default function App() {
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    if (!introVisible) document.querySelector('.hero h1')?.focus({ preventScroll: true });
  }, [introVisible]);

  return (
    <>
      {introVisible && <WeddingEnvelopeIntro onEnter={() => setIntroVisible(false)} />}
      <div className="page-frame" inert={introVisible} aria-hidden={introVisible}>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteNav />
        <HeroSection />
        <main id="main-content" tabIndex={-1}>
          <SaveTheDateSection />
          <CoupleSection />
          <EventsSection />
          <VenueSection />
          <FamilySection />
        </main>
        <Footer />
        <MusicPlayer />
      </div>
    </>
  );
}
