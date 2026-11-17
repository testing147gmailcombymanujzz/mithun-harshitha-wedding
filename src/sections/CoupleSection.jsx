import { PersonCard } from '../components/PersonCard.jsx';
import { weddingDetails } from '../data/weddingDetails.js';
import { SectionDivider } from '../components/SectionDivider.jsx';
import { MotionSection } from '../components/MotionSection.jsx';

export function CoupleSection() {
  return (
    <MotionSection id="couple" className="couple-section section section--ivory">
      <p className="eyebrow">A new beginning</p>
      <h2>Meet the Couple</h2>
      <SectionDivider />
      <div className="couple-grid">
        <PersonCard person={weddingDetails.couple} />
        <div className="couple-divider" aria-hidden="true">&amp;</div>
        <PersonCard person={weddingDetails.partner} />
      </div>
    </MotionSection>
  );
}
