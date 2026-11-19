import { weddingDetails } from '../data/weddingDetails.js';
import { kannadaCopy } from '../data/kannadaCopy.js';

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a className="site-nav__brand" href="#top" aria-label={`${weddingDetails.couple.firstName} and ${weddingDetails.partner.firstName} wedding invitation`}>
        <span>{weddingDetails.couple.firstName[0]}</span><i>&amp;</i><span>{weddingDetails.partner.firstName[0]}</span>
      </a>
      <div className="site-nav__links">
        <a href="#couple"><span>The Couple</span><small lang="kn">{kannadaCopy.nav.couple}</small></a>
        <a href="#events"><span>Celebrations</span><small lang="kn">{kannadaCopy.nav.events}</small></a>
        <a href="#venue"><span>Venue</span><small lang="kn">{kannadaCopy.nav.venue}</small></a>
      </div>
      <a className="site-nav__date" href="#events">{weddingDetails.ceremonyDate}<small lang="kn">{kannadaCopy.saveDate.date}</small></a>
    </nav>
  );
}
