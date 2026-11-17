import venuePavilion from '../assets/venue-pavilion.svg';
import { SectionDivider } from '../components/SectionDivider.jsx';
import { weddingDetails } from '../data/weddingDetails.js';
import { MotionSection } from '../components/MotionSection.jsx';

export function VenueSection() {
  return (
    <MotionSection id="venue" className="venue-section section section--blush">
      <p className="eyebrow">Celebrate with us</p>
      <h2>Venue</h2>
      <SectionDivider tone="green" />
      <div className="venue-layout">
        <figure className="venue-art">
          <img src={venuePavilion} alt="Decorative hand-drawn architectural line illustration of a South Indian pavilion with floral details" />
          <span className="venue-art__seal" aria-hidden="true">✦</span>
        </figure>
        <div className="venue-card card">
          <div className="venue-card__ornament" aria-hidden="true">❧ ✧ ❧</div>
          <h3>{weddingDetails.venue.name.map((line) => <span key={line}>{line}<br /></span>)}</h3>
          <SectionDivider tone="green" />
          <p className="venue-card__address" aria-label="Venue address">
            {weddingDetails.venue.address.map((line) => <span key={line}>{line}<br /></span>)}
          </p>
          <a className="button button--primary venue-card__directions" target="_blank" rel="noopener noreferrer" href={weddingDetails.venue.mapUrl}>
            Get Directions <span aria-hidden="true">↗</span>
          </a>
          <div className="venue-card__calendar">
            <p>Save an event</p>
            <div className="venue-card__calendar-links">
              {weddingDetails.events.map((event) => (
                <a className="button button--outline" href={event.calendarFile} download key={event.id}>
                  Add {event.name} to Calendar
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
