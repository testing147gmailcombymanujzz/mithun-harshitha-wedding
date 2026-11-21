/**
 * Small vector ornaments shared by the sections: marigolds, mango leaves, temple
 * bells, the thoranam garland, lotus dividers, corners, lamps and the kalasha.
 * Class names on the parts are what the GSAP timelines in src/motion animate.
 */
import { GOLD, MAROON } from './Defs.jsx';

const f = (n) => Number(n.toFixed(2));

/** A marigold seen from the front: a ring of round petals around a bright heart. */
export function Marigold({ cx = 0, cy = 0, r = 10, deep = false, className = 'marigold' }) {
  const ring = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return <circle key={i} cx={f(Math.cos(a) * r * 0.72)} cy={f(Math.sin(a) * r * 0.72)} r={f(r * 0.38)} />;
  });
  return (
    <g className={className} transform={`translate(${f(cx)} ${f(cy)})`}>
      <g fill={deep ? '#d4600f' : '#ea8a1e'}>{ring}</g>
      <circle r={f(r * 0.78)} fill={`url(#${deep ? 'g-marigold-deep' : 'g-marigold'})`} />
      <circle r={f(r * 0.3)} fill="#fbe08a" opacity="0.85" />
    </g>
  );
}

/** A mango leaf hanging from its stalk at 0 0. */
export function MangoLeaf({ x = 0, y = 0, len = 46, angle = 0, className = 'mango-leaf' }) {
  const w = len * 0.2;
  return (
    <g className={className} transform={`translate(${f(x)} ${f(y)}) rotate(${angle})`}>
      <path d={`M0 0 C${f(w)} ${f(len * 0.22)} ${f(w * 1.05)} ${f(len * 0.68)} 0 ${len} C${f(-w * 1.05)} ${f(len * 0.68)} ${f(-w)} ${f(len * 0.22)} 0 0Z`} fill="url(#g-mango)" />
      <path d={`M0 2 V${f(len * 0.9)}`} stroke="#d9e8c8" strokeWidth="0.9" opacity="0.6" />
    </g>
  );
}

/** A small brass temple bell hanging from 0 0. */
export function Bell({ x = 0, y = 0, len = 26, scale = 1, className = 'bell' }) {
  return (
    <g className={className} transform={`translate(${f(x)} ${f(y)})`}>
      <path d={`M0 0 V${len}`} stroke={GOLD} strokeWidth="1.2" />
      <g transform={`translate(0 ${len}) scale(${scale})`}>
        <circle cy="1" r="2.4" fill="url(#g-gold)" />
        <path d="M-8 17 C-8 7 -5 3 0 3 C5 3 8 7 8 17 L10.5 20 H-10.5Z" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="0.6" />
        <path d="M-6 12 H6" stroke="#9a7438" strokeWidth="0.7" opacity="0.7" />
        <circle className="bell-clapper" cy="22.5" r="2.4" fill="#9a7438" />
      </g>
    </g>
  );
}

/**
 * The thoranam: a rope swagged across the top of a section, hung with mango leaves,
 * strings of marigolds and temple bells. Grows in from the left in motion/sections.js.
 */
export function Thoranam({ width = 1200, sag = 34, bells = true, className = '' }) {
  const y = (x) => 6 + Math.sin((x / width) * Math.PI) * sag;
  const items = [];
  const step = 38;
  let n = 0;
  for (let x = 14; x < width; x += step, n += 1) {
    const top = y(x);
    if (n % 2 === 0) {
      items.push(<MangoLeaf key={`l${x}`} x={x} y={top} len={44 + (n % 4) * 4} angle={n % 4 ? 4 : -4} />);
    } else {
      const count = n % 4 === 1 ? 3 : 2;
      items.push(
        <g className="toran-string" key={`s${x}`} transform={`translate(${f(x)} ${f(top)})`}>
          <path d={`M0 0 V${count * 15}`} stroke="#c1913e" strokeWidth="1" />
          {Array.from({ length: count }, (_, i) => <Marigold key={i} cy={9 + i * 15} r={8} deep={(i + n) % 3 === 0} />)}
        </g>,
      );
    }
  }
  const bellXs = bells ? [0.12, 0.31, 0.5, 0.69, 0.88].map((t) => t * width) : [];
  return (
    <svg className={`thoranam ${className}`} viewBox={`0 0 ${width} 130`} preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path className="toran-rope" d={`M0 6 Q${width / 2} ${6 + sag * 2} ${width} 6`} fill="none" stroke="#b3843a" strokeWidth="2.4" />
      {bellXs.map((x, i) => <Bell key={i} x={x + step / 2} y={y(x + step / 2)} len={48 + (i % 2) * 14} />)}
      {items}
      {Array.from({ length: Math.floor(width / 76) }, (_, i) => {
        const x = 33 + i * 76;
        return <Marigold key={`r${i}`} cx={x} cy={y(x)} r={7} deep={i % 2 === 0} className="marigold toran-knot" />;
      })}
    </svg>
  );
}

/** Lotus with vines either side, drawn as strokes so it can be traced on scroll. */
export function Divider({ tone = 'gold', className = '' }) {
  return (
    <svg className={`divider divider--${tone} ${className}`} viewBox="0 0 420 60" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M210 10 C217 18 217 30 210 40 C203 30 203 18 210 10Z" />
        <path d="M210 40 C204 30 192 24 182 26 C186 36 196 41 210 40Z M210 40 C216 30 228 24 238 26 C234 36 224 41 210 40Z" />
        <path d="M210 40 C200 36 190 38 180 44 M210 40 C220 36 230 38 240 44" />
        <path d="M176 40 C158 40 150 28 130 32 C110 36 102 48 82 46 C62 44 54 34 34 36 C22 37 18 44 8 41" />
        <path d="M244 40 C262 40 270 28 290 32 C310 36 318 48 338 46 C358 44 366 34 386 36 C398 37 402 44 412 41" />
        <path d="M130 32 C126 22 134 16 142 18 C140 26 136 30 130 32Z M290 32 C294 22 286 16 278 18 C280 26 284 30 290 32Z" />
        <path d="M82 46 C80 56 88 60 96 56 C92 50 88 48 82 46Z M338 46 C340 56 332 60 324 56 C328 50 332 48 338 46Z" />
      </g>
      <g fill="currentColor">
        <circle cx="110" cy="40" r="2" /><circle cx="310" cy="40" r="2" />
        <circle cx="56" cy="34" r="1.5" /><circle cx="364" cy="34" r="1.5" />
        <circle cx="210" cy="5" r="1.8" />
      </g>
    </svg>
  );
}

/** Temple-style corner flourish, top-left orientation (mirror with a class). */
export function Corner({ className = '' }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 80 80" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M4 78 V26 C4 13 13 4 26 4 H78" strokeWidth="1.5" />
        <path d="M11 78 V30 C11 19 19 11 30 11 H78" strokeWidth="0.8" opacity="0.7" />
        <path d="M22 22 C30 14 40 16 42 24 C34 26 28 30 22 22Z M22 22 C14 30 16 40 24 42 C26 34 30 28 22 22Z" strokeWidth="1.2" />
      </g>
      <circle cx="22" cy="22" r="3" fill="currentColor" />
      <circle cx="52" cy="11" r="1.6" fill="currentColor" /><circle cx="11" cy="52" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** A flame that flickers: transform origin is its base. */
export function Flame({ x = 0, y = 0, s = 1 }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${s})`}>
      <circle className="flame-glow" cy="-12" r="22" fill="url(#g-glow)" />
      <path className="flame" d="M0 -30 C9 -18 9 -5 0 0 C-9 -5 -9 -18 0 -30Z" fill="url(#g-flame)" />
      <path className="flame-core" d="M0 -14 C3 -9 3 -3 0 -1 C-3 -3 -3 -9 0 -14Z" fill="#fffbe6" />
    </g>
  );
}

/** A clay diya with its flame, base centred on x y. */
export function Diya({ x = 0, y = 0, s = 1 }) {
  return (
    <g className="diya" transform={`translate(${f(x)} ${f(y)}) scale(${s})`}>
      <path d="M-26 -8 C-24 8 24 8 26 -8 C30 -10 34 -14 36 -18 C24 -12 -20 -14 -26 -8Z" fill="#b5532a" />
      <path d="M-26 -8 C-14 -4 14 -4 26 -8" stroke="#f0b35a" strokeWidth="1.4" fill="none" />
      <circle cx="-12" cy="0" r="1.6" fill="#f0b35a" /><circle cx="0" cy="2" r="1.6" fill="#f0b35a" /><circle cx="12" cy="0" r="1.6" fill="#f0b35a" />
      <Flame x={30} y={-16} s={0.6} />
    </g>
  );
}

/** Brass kuthu vilakku (standing oil lamp) with five flames, for the reception. */
export function KuthuVilakku({ className = '' }) {
  return (
    <svg className={`lamp-art ${className}`} viewBox="0 0 160 250" role="img" aria-label="Traditional brass kuthu vilakku lamp with five flames">
      <g className="lamp-body">
        <ellipse cx="80" cy="238" rx="46" ry="8" fill="#a98143" />
        <path d="M34 238 C34 220 126 220 126 238Z" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="0.8" />
        <ellipse cx="80" cy="218" rx="26" ry="6" fill="url(#g-gold-h)" />
        <path d="M74 218 C70 196 77 176 73 140 H87 C83 176 90 196 86 218Z" fill="url(#g-gold-h)" />
        <ellipse cx="80" cy="192" rx="11" ry="5" fill="url(#g-gold)" />
        <ellipse cx="80" cy="164" rx="9" ry="4" fill="url(#g-gold)" />
        <path d="M28 124 C32 148 128 148 132 124Z" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="0.8" />
        <ellipse cx="80" cy="124" rx="52" ry="9" fill="url(#g-gold-h)" stroke="#9a7438" strokeWidth="0.6" />
        <path d="M76 120 V82 H84 V120Z" fill="url(#g-gold-h)" />
        <ellipse cx="80" cy="82" rx="10" ry="4" fill="url(#g-gold)" />
        <path d="M80 34 C94 46 94 64 80 80 C66 64 66 46 80 34Z" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="0.8" />
        <path d="M80 44 C86 52 86 62 80 70 C74 62 74 52 80 44Z" fill={MAROON} opacity="0.55" />
        <circle cx="80" cy="30" r="4" fill="url(#g-gold)" />
      </g>
      <g className="lamp-flames">
        {[30, 55, 80, 105, 130].map((x, i) => <Flame key={x} x={x} y={i === 0 || i === 4 ? 122 : 118} s={0.75} />)}
      </g>
    </svg>
  );
}

/** Purna kalasha: brass pot with mango leaves and a coconut, for the muhurtham. */
export function Kalasha({ className = '' }) {
  const leaves = [-62, -36, -12, 12, 36, 62];
  return (
    <svg className={`kalasha-art ${className}`} viewBox="0 0 160 230" role="img" aria-label="Purna kalasha with mango leaves and coconut">
      <g className="kalasha-leaves">
        {leaves.map((a, i) => <MangoLeaf key={a} x={80} y={98} len={i % 2 ? 54 : 60} angle={180 + a} className="mango-leaf kalasha-leaf" />)}
      </g>
      <g className="kalasha-coconut">
        <ellipse cx="80" cy="70" rx="21" ry="25" fill="#8a5a2c" />
        <path d="M66 58 C72 50 88 50 94 58" stroke="#b07a42" strokeWidth="2" fill="none" />
        <path d="M80 45 C76 36 70 32 64 32 M80 45 C84 36 90 32 96 32 M80 45 V30" stroke="#6d4520" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="80" cy="74" r="4" fill="#c0272d" />
      </g>
      <g className="kalasha-pot">
        <ellipse cx="80" cy="100" rx="32" ry="7" fill="url(#g-gold-h)" stroke="#9a7438" strokeWidth="0.8" />
        <path d="M56 104 H104 V116 H56Z" fill="url(#g-gold-h)" />
        <path d="M44 122 C18 150 28 206 80 212 C132 206 142 150 116 122 C104 114 56 114 44 122Z" fill="url(#g-gold)" stroke="#9a7438" strokeWidth="1" />
        <path d="M36 150 C60 160 100 160 124 150" stroke={MAROON} strokeWidth="2.2" fill="none" />
        <path d="M33 168 C60 178 100 178 127 168" stroke="#c0272d" strokeWidth="1.4" fill="none" strokeDasharray="2 4" />
        <path d="M56 110 C66 114 94 114 104 110" stroke="#c0272d" strokeWidth="2" fill="none" />
        <path d="M58 113 C68 117 92 117 102 113" stroke="#f2c230" strokeWidth="1.6" fill="none" />
        {[62, 80, 98].map((x) => <circle key={x} cx={x} cy={186} r="4" fill="#c0272d" opacity="0.9" />)}
      </g>
    </svg>
  );
}

/** A falling marigold petal. */
export function PetalShape({ rose = false }) {
  return (
    <svg viewBox="0 0 20 24" aria-hidden="true">
      <path d="M10 24 C2 18 0 8 4 2 C7 4 9 5 10 3 C11 5 13 4 16 2 C20 8 18 18 10 24Z" fill={rose ? 'url(#g-rose-petal)' : 'url(#g-petal)'} />
      <path d="M10 6 V20" stroke="#fff" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}
