/**
 * Larger vector scenes: the wedding mandap in the hero, the venue pavilion and the
 * invitation envelope. Outlines carry the class "draw" so GSAP's DrawSVG can trace them.
 */
import { GOLD, MAROON } from './Defs.jsx';
import { Bell, Diya, Flame, Marigold, MangoLeaf } from './ornaments.jsx';

const f = (n) => Number(n.toFixed(2));

function BananaTree({ x, flip = false }) {
  return (
    <g className="banana" transform={`translate(${x} 470) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-6 0 C-8 -60 -4 -120 -2 -170 H6 C8 -120 10 -60 8 0Z" fill="#7c9a5b" />
      <g className="banana-leaves">
        <path d="M2 -168 C30 -200 70 -206 96 -196 C70 -186 34 -180 2 -168Z" fill="#5f8a4a" />
        <path d="M2 -168 C-24 -206 -60 -220 -86 -214 C-60 -198 -28 -186 2 -168Z" fill="#6f9b54" />
        <path d="M2 -170 C14 -214 40 -244 62 -254 C48 -230 26 -200 2 -170Z" fill="#4f7a40" />
        <path d="M2 -170 C-4 -214 -24 -246 -44 -258 C-34 -232 -18 -200 2 -170Z" fill="#5f8a4a" />
        <path d="M2 -168 C34 -150 66 -126 80 -100 C56 -118 30 -138 2 -168Z" fill="#6f9b54" />
      </g>
    </g>
  );
}

function Pillar({ x, back = false }) {
  const fill = back ? '#f3e2c4' : '#fff4e0';
  return (
    <g className={`pillar${back ? ' pillar--back' : ''}`}>
      <rect x={x - 13} y="186" width="26" height="276" fill={fill} />
      <path className="draw" d={`M${x - 13} 186 V462 M${x + 13} 186 V462`} stroke={GOLD} strokeWidth="1.6" fill="none" />
      <path className="draw" d={`M${x - 20} 186 H${x + 20} M${x - 17} 196 H${x + 17} M${x - 20} 462 H${x + 20} M${x - 17} 452 H${x + 17}`} stroke={GOLD} strokeWidth="1.6" fill="none" />
      {[250, 320, 390].map((y) => <path key={y} className="draw" d={`M${x - 13} ${y} H${x + 13} M${x - 8} ${y + 8} L${x} ${y + 2} L${x + 8} ${y + 8}`} stroke={GOLD} strokeWidth="1.2" fill="none" />)}
      {!back && <g className="pillar-garland">
        {Array.from({ length: 7 }, (_, i) => <Marigold key={i} cx={x + (i % 2 ? 4 : -4)} cy={208 + i * 34} r={6} deep={i % 2 === 0} className="marigold pillar-flower" />)}
      </g>}
    </g>
  );
}

/** The wedding mandap with a sacred fire, banana trees, lamps and a thoranam. */
export function Mandap() {
  const toran = [];
  for (let x = 140, n = 0; x <= 380; x += 20, n += 1) {
    toran.push(n % 2
      ? <MangoLeaf key={x} x={x} y={206} len={24} className="mango-leaf mandap-leaf" />
      : <g key={x} className="toran-string" transform={`translate(${x} 205)`}><path d="M0 0 V20" stroke="#c1913e" strokeWidth="0.8" /><Marigold cy={8} r={5.5} /><Marigold cy={19} r={5.5} deep /></g>);
  }
  return (
    <svg className="mandap" viewBox="0 0 520 560" role="img" aria-label="Illustration of a South Indian wedding mandap with a sacred fire, banana plants, marigold garlands and oil lamps">
      <ellipse className="mandap-halo" cx="260" cy="250" rx="240" ry="230" fill="url(#g-glow)" opacity="0.5" />
      <BananaTree x={46} />
      <BananaTree x={474} flip />

      {/* Kolam on the floor */}
      <g className="kolam">
        <ellipse cx="260" cy="520" rx="210" ry="24" fill="#f6e3cf" />
        <ellipse className="draw" cx="260" cy="520" rx="180" ry="17" fill="none" stroke={MAROON} strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
        <ellipse className="draw" cx="260" cy="520" rx="140" ry="12" fill="none" stroke={GOLD} strokeWidth="1.2" />
      </g>

      <Pillar x={186} back />
      <Pillar x={334} back />

      {/* Roof */}
      <g className="mandap-roof">
        <path d="M118 168 C128 98 192 58 260 46 C328 58 392 98 402 168Z" fill="#7a1d39" />
        <path className="draw" d="M118 168 C128 98 192 58 260 46 C328 58 392 98 402 168" stroke={GOLD} strokeWidth="2" fill="none" />
        <path className="draw" d="M146 168 C156 112 204 80 260 70 C316 80 364 112 374 168" stroke="#e9cf95" strokeWidth="1.2" fill="none" />
        <path className="draw" d="M178 168 C186 128 222 104 260 96 C298 104 334 128 342 168" stroke="#e9cf95" strokeWidth="1" fill="none" opacity="0.7" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={150 + i * 27.5} cy={160} r="2.4" fill="#e9cf95" />)}
        <rect x="98" y="166" width="324" height="22" fill={MAROON} />
        <path className="draw" d="M98 166 H422 V188 H98Z" stroke={GOLD} strokeWidth="1.6" fill="none" />
        <path d="M104 177 H416" stroke="#e9cf95" strokeWidth="1" strokeDasharray="5 5" />
        <path d="M88 168 C88 138 138 132 140 168Z M380 168 C382 132 432 138 432 168Z" fill="#7a1d39" stroke={GOLD} strokeWidth="1.4" />
        <g className="mandap-finial" transform="translate(260 46)">
          <path d="M-10 0 C-16 -10 -12 -22 0 -22 C12 -22 16 -10 10 0Z" fill="url(#g-gold)" />
          <path d="M-7 -22 H7 V-26 H-7Z" fill="url(#g-gold-h)" />
          <path d="M0 -26 C-6 -34 -6 -40 0 -46 C6 -40 6 -34 0 -26Z" fill="url(#g-gold)" />
        </g>
        <g transform="translate(114 138)"><path d="M-5 0 C-8 -6 -6 -12 0 -12 C6 -12 8 -6 5 0Z" fill="url(#g-gold)" /></g>
        <g transform="translate(406 138)"><path d="M-5 0 C-8 -6 -6 -12 0 -12 C6 -12 8 -6 5 0Z" fill="url(#g-gold)" /></g>
      </g>

      <g className="mandap-toran">
        <path className="draw" d="M130 202 Q260 214 390 202" stroke="#b3843a" strokeWidth="1.6" fill="none" />
        {toran}
      </g>
      <Bell x={150} y={188} len={44} />
      <Bell x={370} y={188} len={44} />

      {/* Sacred fire (homa kunda) */}
      <g className="homa">
        <path d="M222 448 L298 448 L288 468 L232 468Z" fill="#b5532a" />
        <path className="draw" d="M222 448 H298 L288 468 H232Z" stroke="#f0b35a" strokeWidth="1.2" fill="none" />
        <path d="M228 440 H292 V448 H228Z" fill="#8f3c1c" />
        <g className="homa-flames">
          <Flame x={260} y={442} s={1.5} />
          <Flame x={244} y={444} s={0.9} />
          <Flame x={276} y={444} s={0.95} />
        </g>
      </g>

      <Pillar x={128} />
      <Pillar x={392} />

      {/* Steps */}
      <g className="mandap-steps">
        <rect x="92" y="462" width="336" height="18" fill="#f1dcb8" />
        <rect x="74" y="480" width="372" height="20" fill="#e8cc9c" />
        <path className="draw" d="M92 462 H428 V480 H92Z M74 480 H446 V500 H74Z" stroke={GOLD} strokeWidth="1.4" fill="none" />
      </g>
      <Diya x={110} y={478} s={0.7} />
      <Diya x={180} y={478} s={0.7} />
      <Diya x={340} y={478} s={0.7} />
      <Diya x={410} y={478} s={0.7} />
    </svg>
  );
}

/** Line drawing of the convention pavilion, with coconut palms and a string of lights. */
export function Pavilion() {
  const bulbs = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    return <circle key={i} className="bulb" cx={f(120 + t * 560)} cy={f(62 + 70 * t * (1 - t) + 6)} r="3.4" />;
  });
  const palm = (x, flip) => (
    <g className="palm" transform={`translate(${x} 262) scale(${flip ? -1 : 1} 1)`}>
      <path className="draw" d="M0 0 C4 -50 -6 -100 10 -150" />
      <path className="draw" d="M10 -150 C30 -160 54 -150 66 -130 M10 -150 C26 -176 50 -180 70 -172 M10 -150 C-8 -170 -34 -170 -50 -156 M10 -150 C0 -178 -20 -190 -38 -190 M10 -150 C-14 -150 -34 -136 -42 -118" />
      <circle cx="12" cy="-142" r="5" /><circle cx="4" cy="-140" r="5" />
    </g>
  );
  return (
    <svg className="pavilion" viewBox="0 0 800 280" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw" d="M20 262 H780" />
        <path className="draw" d="M190 262 V150 H610 V262" />
        <path className="draw" d="M176 150 H624 M184 140 H616 V150" />
        {/* Gopuram entrance */}
        <path className="draw" d="M330 262 V120 H470 V262" />
        <path className="draw" d="M320 120 L340 96 H460 L480 120 M340 96 L354 74 H446 L460 96 M354 74 L366 56 H434 L446 74 M366 56 L380 40 H420 L434 56" />
        <path className="draw" d="M390 40 C392 30 396 26 400 20 C404 26 408 30 410 40" />
        <path className="draw" d="M366 262 V196 A34 34 0 0 1 434 196 V262" />
        <path className="draw" d="M400 162 V262" />
        {[214, 262, 538, 586].map((x) => <path key={x} className="draw" d={`M${x - 16} 178 H${x + 16} V226 H${x - 16}Z M${x} 178 V226 M${x - 16} 202 H${x + 16}`} />)}
        {[200, 310, 490, 600].map((x) => <path key={x} className="draw" d={`M${x} 262 V156`} />)}
        <path className="draw" d="M120 62 Q400 132 680 62" />
        {palm(90, false)}
        {palm(710, true)}
        <path className="draw" d="M380 140 h40 M372 130 h56" />
      </g>
      <g fill="currentColor">{bulbs}</g>
    </svg>
  );
}

/* ------------------------------------------------------------------ envelope (600 × 400) */

export function EnvelopeBack() {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
      <rect width="600" height="400" rx="10" fill="url(#g-env-back)" />
      <path d="M0 0 H600 L300 250Z" fill="url(#p-liner)" opacity="0.96" />
    </svg>
  );
}

export function EnvelopeFront() {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 10 Q0 0 9 4 L300 232 L9 396 Q0 400 0 390Z" fill="url(#g-env-side)" />
      <path d="M600 10 Q600 0 591 4 L300 232 L591 396 Q600 400 600 390Z" fill="url(#g-env-side-r)" />
      <path d="M0 390 Q0 400 10 400 H590 Q600 400 600 390 L300 200Z" fill="url(#g-env-bottom)" />
      <path d="M30 384 L300 214 L570 384" fill="none" stroke={GOLD} strokeWidth="1.8" opacity="0.9" />
      <path d="M46 384 L300 224 L554 384" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.55" />
      <g fill={GOLD} opacity="0.75">
        {[90, 160, 440, 510].map((x) => <circle key={x} cx={x} cy={378} r="2" />)}
      </g>
    </svg>
  );
}

export function FlapFront() {
  return (
    <svg viewBox="0 0 600 250" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0 H600 L318 238 Q300 252 282 238Z" fill="url(#g-env-flap)" />
      <path d="M14 6 L292 232 Q300 239 308 232 L586 6" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.95" />
      <path d="M36 6 L296 219 Q300 222 304 219 L564 6" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

/** Drawn tip-up: the face is turned with rotateX(180deg), so it reads tip-down until opened. */
export function FlapBack() {
  return (
    <svg viewBox="0 0 600 250" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 250 H600 L318 12 Q300 -2 282 12Z" fill="url(#p-liner)" />
      <path d="M0 250 H600 L318 12 Q300 -2 282 12Z" fill="none" stroke={GOLD} strokeWidth="1.6" opacity="0.7" />
    </svg>
  );
}

/** Gold wax seal: a lotus-petal rosette carrying the couple's initials. */
export function Seal({ initials = ['M', 'H'] }) {
  const petals = Array.from({ length: 12 }, (_, i) => (
    <path key={i} d="M0 -46 C7 -40 7 -32 0 -27 C-7 -32 -7 -40 0 -46Z" transform={`rotate(${i * 30})`} />
  ));
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <g className="seal-wax">
        <g fill="url(#g-wax)">{petals}</g>
        <circle r="34" fill="url(#g-wax)" />
        <circle r="29" fill="none" stroke="#fff3d0" strokeWidth="0.8" opacity="0.8" />
        <circle r="25.5" fill="none" stroke="#8d6427" strokeWidth="0.6" strokeDasharray="1 2.4" />
        <g className="seal-monogram" fill="#6b1530" fontFamily="'Great Vibes', cursive" textAnchor="middle">
          <text className="seal-l1" x="-8" y="6" fontSize="26">{initials[0]}</text>
          <text className="seal-amp" x="0" y="2" fontSize="11" fill="#8d6427">&amp;</text>
          <text className="seal-l2" x="9" y="14" fontSize="26">{initials[1]}</text>
        </g>
      </g>
    </svg>
  );
}
