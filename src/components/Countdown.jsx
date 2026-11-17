import { useEffect, useState } from 'react';
import { weddingDetails } from '../data/weddingDetails.js';

// The ISO timestamp includes +05:30, so this instant is exact regardless of the visitor's timezone.
const ceremonyInstant = new Date(weddingDetails.ceremonyDateTime).getTime();

function getCountdown(now) {
  const totalSeconds = Math.max(0, Math.floor((ceremonyInstant - now) / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="save-date__countdown" role="timer" aria-label="Countdown to the wedding ceremony at 7:58 AM India Standard Time" aria-live="off">
      {getCountdown(now).map(({ label, value }) => {
        const displayValue = String(value).padStart(2, '0');

        return (
          <div className="save-date__unit" key={label}>
            <strong className="save-date__value" key={displayValue}>{displayValue}</strong>
            <span className="save-date__label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
