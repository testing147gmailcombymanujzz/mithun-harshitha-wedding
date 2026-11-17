import { weddingDetails } from '../data/weddingDetails.js';

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a className="site-nav__brand" href="#top" aria-label={`${weddingDetails.couple.firstName} and ${weddingDetails.partner.firstName} wedding invitation`}>
        <span>{weddingDetails.couple.firstName[0]}</span><i>&amp;</i><span>{weddingDetails.partner.firstName[0]}</span>
      </a>
      <div className="site-nav__links">
        <a href="#couple">The Couple</a>
        <a href="#events">Celebrations</a>
        <a href="#venue">Venue</a>
      </div>
      <a className="site-nav__date" href="#events">{weddingDetails.ceremonyDate}</a>
    </nav>
  );
}
