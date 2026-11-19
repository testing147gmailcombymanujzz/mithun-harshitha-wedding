import { useEffect, useRef, useState } from 'react';
import { weddingDetails } from '../data/weddingDetails.js';
import './WeddingEnvelopeIntro.css';

const kannada = {
  heading: 'ಶುಭ ವಿವಾಹ',
  couple: 'ಮಿಥುನ್ & ಹರ್ಷಿತಾ',
  invitation: 'ಹಿರಿಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ, ನಮ್ಮ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ನಿಮ್ಮನ್ನು ಪ್ರೀತಿಯಿಂದ ಆಹ್ವಾನಿಸುತ್ತೇವೆ.',
  date: '11 ಡಿಸೆಂಬರ್ 2026',
  venue: 'ಸಂಸ್ಕೃತಿ ಪೆವಿಲಿಯನ್ ಕನ್ವೆನ್ಷನ್ ಸೆಂಟರ್, ಬೆಂಗಳೂರು',
  instruction: 'ಆಮಂತ್ರಣ ಪತ್ರಿಕೆಯನ್ನು ತೆರೆಯಲು ಹೃದಯದ ಮುದ್ರೆಯನ್ನು ಸ್ಪರ್ಶಿಸಿ',
};

const petals = Array.from({ length: 9 }, (_, index) => ({
  left: `${(index * 11 + 2) % 96}%`,
  delay: `${index * -1.3}s`,
}));
const sparkles = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 17) % 96}%`,
  top: `${(index * 13 + 5) % 88}%`,
  delay: `${index * -270}ms`,
}));

export function WeddingEnvelopeIntro({ onEnter }) {
  const [opened, setOpened] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timers = useRef([]);
  const exitStarted = useRef(false);
  const envelopeButtonRef = useRef(null);
  const enterButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    envelopeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!readyToEnter) return undefined;
    enterButtonRef.current?.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timerId = window.setTimeout(beginWebsiteTransition, reducedMotion ? 1100 : 1600);
    timers.current.push(timerId);
    return () => window.clearTimeout(timerId);
  }, [readyToEnter]);

  function openEnvelope() {
    if (opened) return;
    setOpened(true);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current.push(window.setTimeout(() => setReadyToEnter(true), reducedMotion ? 40 : 1900));
  }

  function beginWebsiteTransition() {
    if (exitStarted.current) return;
    exitStarted.current = true;
    setExiting(true);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current.push(window.setTimeout(onEnter, reducedMotion ? 40 : 620));
  }

  function enterWebsite() {
    if (!readyToEnter) return;
    beginWebsiteTransition();
  }

  return (
    <section className={`wedding-envelope${opened ? ' is-open' : ''}${exiting ? ' is-exiting' : ''}`}
      role="dialog" aria-modal="true" aria-labelledby="wedding-envelope-title">
      <div className="wedding-envelope__grain" aria-hidden="true" />
      <div className="wedding-envelope__sparkles" aria-hidden="true">
        {sparkles.map((sparkle, index) => <i key={index} style={{ '--sparkle-left': sparkle.left, '--sparkle-top': sparkle.top, '--sparkle-delay': sparkle.delay }} />)}
      </div>
      <div className="wedding-envelope__petals" aria-hidden="true">
        {petals.map((petal, index) => <i key={index} style={{ '--petal-left': petal.left, '--petal-delay': petal.delay }} />)}
      </div>

      <svg className="wedding-envelope__botanical" viewBox="0 0 1440 250" preserveAspectRatio="none" aria-hidden="true">
        <path className="wedding-envelope__vine" d="M0 54 Q160 18 290 76 T570 58 T850 78 T1140 52 T1440 66" />
        <path className="wedding-envelope__vine wedding-envelope__vine--fine" d="M0 86 Q170 45 350 102 T700 87 T1030 95 T1440 76" />
        {Array.from({ length: 21 }, (_, index) => {
          const x = 20 + index * 69;
          const y = 66 + Math.sin(index * 1.65) * 22;
          return <g className="wedding-envelope__leaf-pair" key={index} transform={`translate(${x} ${y}) rotate(${index % 2 ? 28 : -28})`}>
            <ellipse cx="-7" cy="-14" rx="7" ry="17" />
            <ellipse cx="9" cy="-4" rx="6" ry="15" transform="rotate(58 9 -4)" />
            {index % 4 === 0 && <g className="wedding-envelope__blossom" transform="translate(0 14)">
              {Array.from({ length: 6 }, (_, petal) => <ellipse key={petal} cx="0" cy="-7" rx="4" ry="7" transform={`rotate(${petal * 60})`} />)}
              <circle r="2.7" />
            </g>}
          </g>;
        })}
        {[190, 530, 930, 1260].map((x, index) => <g className="wedding-envelope__hanging-heart" key={x} transform={`translate(${x} 0)`}>
          <path d={`M0 0v${75 + index % 2 * 22}`} />
          <path className="wedding-envelope__heart" d="M0 116c-18-18-32 2-16 17 7 7 16 15 16 15s9-8 16-15c16-15 2-35-16-17Z" />
        </g>)}
      </svg>

      <div className="wedding-envelope__content">
        <h2 className="wedding-envelope__sr-title" id="wedding-envelope-title">
          {weddingDetails.couple.firstName} &amp; {weddingDetails.partner.firstName} Wedding Invitation
        </h2>
        <p className="wedding-envelope__kannada-title" lang="kn">{kannada.heading}</p>
        <p className="wedding-envelope__eyebrow">WEDDING INVITATION</p>
        <p className="wedding-envelope__couple-kannada" lang="kn">{kannada.couple}</p>
        <p className="wedding-envelope__couple-english">
          {weddingDetails.couple.firstName} <span>&amp;</span> {weddingDetails.partner.firstName}
        </p>
        <p className="wedding-envelope__tagline">A Beautiful Beginning of Forever</p>

        <div className="wedding-envelope__stage">
          <article className="wedding-envelope__card" aria-hidden={!opened}>
            <span className="wedding-envelope__card-star" aria-hidden="true">✦</span>
            <p className="wedding-envelope__card-eyebrow">WEDDING INVITATION</p>
            <p className="wedding-envelope__card-title" lang="kn">{kannada.heading}</p>
            <p className="wedding-envelope__card-copy" lang="kn">{kannada.invitation}</p>
            <p className="wedding-envelope__card-copy">With the blessings of our elders, we joyfully invite you to celebrate our wedding.</p>
            <p className="wedding-envelope__card-names" lang="kn">{kannada.couple}</p>
            <p className="wedding-envelope__card-names">{weddingDetails.couple.firstName} <span>&amp;</span> {weddingDetails.partner.firstName}</p>
            <p className="wedding-envelope__card-date" lang="kn">{kannada.date}</p>
            <p className="wedding-envelope__card-date">{weddingDetails.ceremonyDate}</p>
            <p className="wedding-envelope__card-venue" lang="kn">{kannada.venue}</p>
            <p className="wedding-envelope__card-venue">{weddingDetails.venue.shortName}, {weddingDetails.venue.city}</p>
          </article>

          <button ref={envelopeButtonRef} className="wedding-envelope__trigger" type="button" onClick={openEnvelope}
            aria-label="Tap the heart seal to open the wedding invitation"
            aria-expanded={opened} disabled={opened}>
            <span className="wedding-envelope__back" />
            <span className="wedding-envelope__flap" />
            <span className="wedding-envelope__front">
              <span className="wedding-envelope__diagonal wedding-envelope__diagonal--left" />
              <span className="wedding-envelope__diagonal wedding-envelope__diagonal--right" />
              <span className="wedding-envelope__seal"><span aria-hidden="true">♥</span><b>M <i>&amp;</i> H</b></span>
            </span>
          </button>
        </div>

        {!opened && <div className="wedding-envelope__prompt">
          <p lang="kn">{kannada.instruction}</p>
          <span>TAP THE HEART SEAL TO OPEN</span>
        </div>}
        {opened && <div className={`wedding-envelope__continue${readyToEnter ? ' is-ready' : ''}`} aria-live="polite">
          <p lang="kn">ನಿಮ್ಮ ಆಗಮನಕ್ಕಾಗಿ ನಾವು ಕಾತರದಿಂದ ಕಾಯುತ್ತಿದ್ದೇವೆ</p>
          <button ref={enterButtonRef} type="button" onClick={enterWebsite} disabled={!readyToEnter || exiting}>
            Enter the wedding invitation <span aria-hidden="true">↗</span>
          </button>
        </div>}
      </div>
    </section>
  );
}
