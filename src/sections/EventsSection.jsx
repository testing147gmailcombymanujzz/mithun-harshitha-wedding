import { useRef } from 'react';
import { Corner, Divider, Kalasha, KuthuVilakku } from '../art/ornaments.jsx';
import { weddingDetails as D } from '../data/weddingDetails.js';
import { kannadaCopy as K } from '../data/kannadaCopy.js';
import { dividers, flicker, gsap, paused, replay, reveals, splitHeadings } from '../motion/gsap.js';
import { useMotion } from '../motion/useMotion.js';

const art = { reception: KuthuVilakku, muhurtham: Kalasha };

function EventCard({ event }) {
  const kn = K.events[event.id];
  const Art = art[event.id];
  return (
    <article className={`event event--${event.id}${event.featured ? ' event--featured' : ''}`}>
      <Corner className="tl" /><Corner className="tr" /><Corner className="bl" /><Corner className="br" />
      <div className="event-art"><Art /></div>
      <p className="event-label"><span lang="kn">{kn.label}</span><span>{event.label}</span></p>
      <h3 className="event-title"><span lang="kn">{kn.title}</span><span>{event.name}</span></h3>
      <p className="event-date"><span lang="kn">{kn.date}</span><span>{event.date}</span></p>
      <p className="event-time"><span lang="kn">{kn.time}</span><span>{event.time} {event.timeZone}</span></p>
      {event.lagna && <p className="event-lagna"><span lang="kn">{kn.lagna}</span><span>Lagna: {event.lagna}</span></p>}
      <a className="btn btn-ghost" href={event.calendarFile} download>
        <span>Add to Calendar</span><small lang="kn">{K.events.addCalendar}</small>
      </a>
    </article>
  );
}

export function EventsSection({ active }) {
  const root = useRef(null);

  useMotion(root, (el) => {
    const q = gsap.utils.selector(el);
    reveals(el);
    dividers(el);
    splitHeadings(el);
    flicker(el);
    q('.event').forEach((card, i) => replay(card, paused()
      .from(card, { y: 70, autoAlpha: 0, duration: 1.1, delay: i * 0.12, ease: 'power3.out' })
      .from(card.querySelectorAll('.corner path'), { drawSVG: 0, duration: 1.2, ease: 'power2.inOut' }, 0.4)
      .from(card.querySelectorAll('.lamp-body > *, .kalasha-pot'), { autoAlpha: 0, y: 14, duration: 0.6, ease: 'power2.out', stagger: 0.05 }, 0.4)
      .from(card.querySelectorAll('.lamp-flames'), { autoAlpha: 0, duration: 0.6, ease: 'power1.out' }, 1)
      .from(card.querySelectorAll('.kalasha-leaf'), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.5, ease: 'back.out(2)', stagger: 0.07 }, 0.9)
      .from(card.querySelectorAll('.kalasha-coconut'), { y: -30, autoAlpha: 0, duration: 0.7, ease: 'bounce.out' }, 1.3), 'top 82%'));
  }, active);

  return (
    <section ref={root} id="events" className="section events">
      <div className="section-inner">
        <header className="section-head">
          <p className="eyebrow reveal"><span lang="kn">{K.events.eyebrow}</span><span>Please join us</span></p>
          <h2 className="section-title"><span className="split">Wedding Celebrations</span><span className="title-kn reveal" lang="kn">{K.events.title}</span></h2>
          <Divider />
        </header>
        <div className="event-grid">{D.events.map((e) => <EventCard event={e} key={e.id} />)}</div>
      </div>
    </section>
  );
}
