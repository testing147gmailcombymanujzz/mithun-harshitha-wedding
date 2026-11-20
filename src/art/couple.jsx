/**
 * The bride and groom as vector avatars. Each is drawn in its own 200 × 210 space
 * (head centred on 100 90) so they can stand together under the temple arch on the
 * save-the-date, or sit alone in a medallion on the couple cards.
 *
 * Their heads, eyes and garlands are separate groups for the GSAP loops: the heads
 * lean toward each other, the eyes blink, the garland flowers bloom in.
 */
import { GOLD, HAIR, MAROON, SKIN, SKIN_SHADE } from './Defs.jsx';
import { Bell, Marigold, MangoLeaf } from './ornaments.jsx';

const f = (n) => Number(n.toFixed(2));

/** Flowers strung along a quadratic curve: a varamala garland. */
function Garland({ from, ctrl, to, count = 13 }) {
  const pts = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const u = 1 - t;
    return [u * u * from[0] + 2 * u * t * ctrl[0] + t * t * to[0], u * u * from[1] + 2 * u * t * ctrl[1] + t * t * to[1]];
  });
  return (
    <g className="av-garland">
      {pts.map(([x, y], i) => (i % 3 === 1
        ? <Marigold key={i} cx={x} cy={y} r={5.6} deep={i % 2 === 0} className="marigold garland-flower" />
        : <g key={i} className="garland-flower" transform={`translate(${f(x)} ${f(y)})`}>
            <circle r="4.6" fill="#fffdf6" stroke="#e6d6b8" strokeWidth="0.6" />
            <circle r="1.4" fill="#f2d27a" />
          </g>))}
    </g>
  );
}

function Eyes({ y = 96, gap = 16, lashes = false }) {
  return (
    <g className="av-eyes">
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={100 + s * gap} cy={y} rx="3.8" ry="4.4" fill={HAIR} />
          <circle cx={100 + s * gap + 1.2} cy={y - 1.4} r="1.2" fill="#fff" />
          {lashes && <path d={`M${100 + s * gap + 3.4 * s} ${y - 2.6} l${2.6 * s} -2.2`} stroke={HAIR} strokeWidth="1.3" strokeLinecap="round" />}
        </g>
      ))}
    </g>
  );
}

export function Groom({ garland = true }) {
  return (
    <g className="av av-groom">
      <path d="M28 212 C28 152 54 128 100 121 C146 128 172 152 172 212Z" fill="url(#g-kurta)" stroke="#d8c29a" strokeWidth="1.2" />
      <path d="M100 124 V208" stroke={GOLD} strokeWidth="1.4" />
      {[146, 164, 182].map((y) => <circle key={y} cx="100" cy={y} r="2" fill={GOLD} />)}
      <path d="M52 138 C80 148 124 184 146 212 L120 212 C102 188 76 162 46 150Z" fill={MAROON} />
      <path d="M52 138 C80 148 124 184 146 212 M46 150 C76 162 102 188 120 212" stroke="#e9cf95" strokeWidth="2" fill="none" />
      <g className="av-head">
        <path d="M87 100 H113 V126 C105 132 95 132 87 126Z" fill={SKIN_SHADE} />
        <ellipse cx="62" cy="94" rx="6" ry="9" fill={SKIN} /><ellipse cx="138" cy="94" rx="6" ry="9" fill={SKIN} />
        <ellipse cx="100" cy="90" rx="37" ry="42" fill={SKIN} />
        <path d="M64 82 C64 72 67 66 72 63 V94 C67 92 64 88 64 82Z M136 82 C136 72 133 66 128 63 V94 C133 92 136 88 136 82Z" fill={HAIR} />
        {/* Mysore peta */}
        <path d="M58 68 C60 40 80 26 100 26 C120 26 140 40 142 68 C126 60 74 60 58 68Z" fill={MAROON} />
        <path d="M62 58 C80 50 120 50 138 58 M68 45 C84 38 116 38 132 45" stroke="#e9cf95" strokeWidth="2.4" fill="none" />
        <path d="M58 68 C74 60 126 60 142 68" stroke="url(#g-gold-h)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M104 50 C102 36 110 26 120 22 C114 32 112 42 104 50Z" fill="url(#g-gold)" />
        <circle cx="100" cy="53" r="5" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="0.6" />
        <circle cx="100" cy="53" r="2" fill="#c0272d" />
        <rect x="98.4" y="68" width="3.2" height="10" rx="1.6" fill="#c0272d" />
        <path d="M76 82 q8 -5 16 0 M108 82 q8 -5 16 0" stroke={HAIR} strokeWidth="3" strokeLinecap="round" fill="none" />
        <Eyes />
        <path d="M100 98 C99 104 97 108 95 110 C98 112 102 112 105 110" stroke={SKIN_SHADE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M86 117 C92 112 98 113 100 116 C102 113 108 112 114 117 C108 119 103 119 100 117.5 C97 119 92 119 86 117Z" fill={HAIR} />
        <path d="M90 123 q10 7 20 0" stroke="#7a3b32" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="78" cy="108" r="6" fill="#e48a83" opacity="0.28" /><circle cx="122" cy="108" r="6" fill="#e48a83" opacity="0.28" />
      </g>
      {garland && <Garland from={[66, 134]} ctrl={[100, 222]} to={[134, 134]} />}
    </g>
  );
}

export function Bride({ garland = true }) {
  const jasmine = Array.from({ length: 8 }, (_, i) => [140 + Math.sin(i / 2.4) * 8, 72 + i * 10]);
  return (
    <g className="av av-bride">
      <path d="M58 92 C54 140 60 176 72 194 H128 C140 176 146 140 142 92Z" fill={HAIR} />
      <path d="M28 212 C28 154 56 131 100 124 C144 131 172 154 172 212Z" fill="url(#g-saree)" />
      <path d="M126 128 C150 138 168 168 172 212 H142 C138 180 120 152 96 138Z" fill="#e7a83a" />
      <path d="M126 128 C150 138 168 168 172 212 M96 138 C120 152 138 180 142 212" stroke={MAROON} strokeWidth="2" fill="none" />
      <path d="M110 142 C124 154 134 174 138 196" stroke={MAROON} strokeWidth="1.2" fill="none" strokeDasharray="3 4" />
      <path d="M58 150 C70 140 84 134 98 132" stroke="url(#g-gold-h)" strokeWidth="3" fill="none" />
      <g className="av-head">
        <path d="M88 102 H112 V127 C104 133 96 133 88 127Z" fill={SKIN_SHADE} />
        <ellipse cx="65" cy="96" rx="5.5" ry="8.5" fill={SKIN} /><ellipse cx="135" cy="96" rx="5.5" ry="8.5" fill={SKIN} />
        <ellipse cx="100" cy="92" rx="34" ry="40" fill={SKIN} />
        <path d="M63 96 C58 58 80 44 100 44 C120 44 142 58 137 96 C133 74 118 63 100 63 C82 63 67 74 63 96Z" fill={HAIR} />
        <path d="M100 45 V63" stroke="#c0272d" strokeWidth="2" />
        <path d="M100 47 V64" stroke="url(#g-gold)" strokeWidth="1.2" />
        <path d="M100 63 C104 66 104 70 100 73 C96 70 96 66 100 63Z" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="0.5" />
        <circle cx="100" cy="79" r="2.6" fill="#c0272d" />
        <path d="M80 85 q7 -4 14 0 M106 85 q7 -4 14 0" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <Eyes y={97} gap={14} lashes />
        <path d="M100 99 C99 104 98 107 96 109 C99 111 102 111 104 109" stroke={SKIN_SHADE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="106" cy="109" r="3.6" fill="none" stroke="url(#g-gold)" strokeWidth="1.3" />
        <path d="M93 118 q7 5 14 0 q-7 2 -14 0Z" fill="#b5364a" stroke="#b5364a" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="80" cy="108" r="6" fill="#ec8c8c" opacity="0.32" /><circle cx="120" cy="108" r="6" fill="#ec8c8c" opacity="0.32" />
        {[65, 135].map((x) => (
          <g key={x} className="jhumka">
            <path d={`M${x} 104 v3`} stroke="url(#g-gold)" strokeWidth="1.4" />
            <path d={`M${x - 5} 113 C${x - 5} 108 ${x + 5} 108 ${x + 5} 113Z`} fill="url(#g-gold)" />
            <circle cx={x - 3.5} cy="115" r="1.1" fill="url(#g-gold)" /><circle cx={x} cy="116" r="1.1" fill="url(#g-gold)" /><circle cx={x + 3.5} cy="115" r="1.1" fill="url(#g-gold)" />
          </g>
        ))}
        <g className="jasmine">
          {jasmine.map(([x, y], i) => <circle key={i} cx={f(x)} cy={y} r="3.6" fill="#fffdf6" stroke="#e6d6b8" strokeWidth="0.6" />)}
        </g>
      </g>
      <path d="M82 127 C90 140 110 140 118 127" stroke="url(#g-gold)" strokeWidth="3.5" fill="none" />
      <path d="M100 139 C104 143 104 148 100 151 C96 148 96 143 100 139Z" fill="url(#g-gold)" />
      {garland && <Garland from={[68, 136]} ctrl={[100, 222]} to={[132, 136]} />}
    </g>
  );
}

/**
 * The couple standing together under a temple arch hung with a thoranam and bells.
 * Used on the save-the-date. Parts: .arch-line (drawn), .arch-fill, .couple-figures,
 * .arch-toran, .bell.
 */
export function CoupleUnderArch() {
  const arch = 'M50 452 V206 C50 116 128 54 220 42 C312 54 390 116 390 206 V452';
  const inner = 'M64 452 V208 C64 126 136 70 220 58 C304 70 376 126 376 208 V452Z';
  const leaves = [];
  for (let i = 0; i < 11; i += 1) {
    const t = i / 10;
    const a = Math.PI + t * Math.PI;
    const x = 220 + Math.cos(a) * 140;
    const y = 208 + Math.sin(a) * 136;
    leaves.push(i % 2
      ? <Marigold key={i} cx={x} cy={y} r={9} deep={i % 4 === 1} className="marigold arch-flower" />
      : <MangoLeaf key={i} x={x} y={y} len={30} angle={(a * 180) / Math.PI - 90} className="mango-leaf arch-flower" />);
  }
  return (
    <svg className="couple-arch" viewBox="20 20 400 440" role="img" aria-label="Illustrated bride and groom in traditional South Indian wedding attire, wearing flower garlands under a temple arch">
      <defs>
        <clipPath id="arch-clip"><path d={inner} /></clipPath>
      </defs>
      <path className="arch-fill" d={inner} fill="url(#g-arch-bg)" />
      <g clipPath="url(#arch-clip)">
        <g className="arch-rays" opacity="0.5">
          {Array.from({ length: 12 }, (_, i) => {
            const a = Math.PI + (i / 11) * Math.PI;
            return <path key={i} d={`M220 300 L${f(220 + Math.cos(a) * 260)} ${f(300 + Math.sin(a) * 260)}`} stroke="#ead6b0" strokeWidth="10" />;
          })}
        </g>
        <circle className="arch-sun" cx="220" cy="300" r="70" fill="#fbe7c0" opacity="0.7" />
        <g className="couple-figures" transform="translate(220 452) scale(1.2) translate(-220 -452)">
          <g transform="translate(66 242)"><Groom /></g>
          <g transform="translate(174 244)"><Bride /></g>
        </g>
      </g>
      <g className="arch-line" fill="none" stroke={GOLD} strokeLinecap="round">
        <path d={arch} strokeWidth="3" />
        <path d={inner} strokeWidth="1.2" opacity="0.8" />
        <path d="M30 452 H410" strokeWidth="2.4" />
        <path d="M200 34 C206 22 214 18 220 12 C226 18 234 22 240 34" strokeWidth="1.6" />
      </g>
      <g className="arch-garland">{leaves}</g>
      <g className="arch-bells">
        <Bell x={108} y={118} len={30} />
        <Bell x={332} y={118} len={30} />
      </g>
      <g className="arch-kalasha" transform="translate(220 22)">
        <path d="M-9 4 C-14 12 -10 22 0 22 C10 22 14 12 9 4Z" fill="url(#g-gold)" />
        <path d="M-6 4 H6 V0 H-6Z" fill="url(#g-gold-h)" />
        <path d="M0 0 C-4 -6 -4 -10 0 -14 C4 -10 4 -6 0 0Z" fill="#c0272d" />
      </g>
    </svg>
  );
}

/** One avatar in a round medallion, for the couple cards. */
export function AvatarMedallion({ who }) {
  const id = `med-${who}`;
  return (
    <svg className={`medallion medallion--${who}`} viewBox="0 0 200 200" role="img" aria-label={who === 'groom' ? 'Illustrated portrait of the groom in a Mysore peta' : 'Illustrated portrait of the bride with jasmine and jewellery'}>
      <defs><clipPath id={id}><circle cx="100" cy="100" r="86" /></clipPath></defs>
      <circle className="medallion-ring" cx="100" cy="100" r="95" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <circle className="medallion-ring" cx="100" cy="100" r="90" fill="none" stroke={GOLD} strokeWidth="0.8" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="86" fill={who === 'groom' ? '#f3e9d4' : '#f8e3e3'} />
      <g clipPath={`url(#${id})`}>
        <g transform="translate(0 36)">{who === 'groom' ? <Groom garland={false} /> : <Bride garland={false} />}</g>
      </g>
    </svg>
  );
}
