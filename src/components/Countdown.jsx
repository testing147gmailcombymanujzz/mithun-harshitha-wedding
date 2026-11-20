import { useEffect, useState } from 'react';
import { weddingDetails } from '../data/weddingDetails.js';
import { kannadaCopy } from '../data/kannadaCopy.js';

// The ISO timestamp includes +05:30, so this instant is exact regardless of the visitor's timezone.
const ceremonyInstant = new Date(weddingDetails.ceremonyDateTime).getTime();
const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];

function getCountdown(now) {
  const s = Math.max(0, Math.floor((ceremonyInstant - now) / 1000));
  return [Math.floor(s / 86_400), Math.floor((s % 86_400) / 3_600), Math.floor((s % 3_600) / 60), s % 60];
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="sd-countdown" role="timer" aria-label="Countdown to the wedding muhurtham at 7:58 AM India Standard Time" aria-live="off">
      {getCountdown(now).map((value, i) => {
        const v = String(value).padStart(2, '0');
        return (
          <div className="count-box" key={labels[i]}>
            <strong className="count-num" key={v}>{v}</strong>
            <span className="count-label">{labels[i]}</span>
            <span className="count-label-kn" lang="kn">{kannadaCopy.saveDate.countdown[i]}</span>
          </div>
        );
      })}
    </div>
  );
}
