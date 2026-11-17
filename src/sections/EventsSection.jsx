import { EventCard } from '../components/EventCard.jsx';
import { weddingDetails } from '../data/weddingDetails.js';
import { SectionDivider } from '../components/SectionDivider.jsx';
import { MotionSection } from '../components/MotionSection.jsx';

export function EventsSection() {
  return (
    <MotionSection id="events" className="section events-section section--blush">
      <p className="eyebrow">Please join us</p>
      <h2>Wedding Celebrations</h2>
      <SectionDivider />
      <div className="event-grid">{weddingDetails.events.map((event) => <EventCard event={event} key={event.name} />)}</div>
    </MotionSection>
  );
}
