import React from 'react';

/**
 * Figura del deck: los cuatro casos de función y la forma del objeto que
 * produce la derivación (escalar, columna o matriz). Los rótulos de dimensión
 * siguen la convención de la tabla §2: x ∈ R^P, f: R^P → R^M, J_f ∈ R^{M×P}.
 */
const W = 960;
const H = 540;

const NAVY = '#1E3A5F';
const PHYS = '#2E86AB';
const FRONTERA = '#E67E22';
const LINE = '#C9D2DF';
const INK = '#1B2029';
const SUB = '#5B6472';

const LANES = [
  {
    y: 34,
    tag: 'uno a uno',
    shape: '1 → 1',
    domain: 'ℝ',
    codomain: 'ℝ',
    object: 'f′(t) ∈ ℝ',
    reading: 'un solo número',
    glyph: 'scalar',
  },
  {
    y: 160,
    tag: 'muchos a uno',
    shape: 'P → 1',
    domain: 'ℝᴾ',
    codomain: 'ℝ',
    object: '∇ₓ f ∈ ℝᴾ',
    reading: 'columna de P derivadas parciales',
    glyph: 'column',
  },
  {
    y: 286,
    tag: 'uno a muchos',
    shape: '1 → M',
    domain: 'ℝ',
    codomain: 'ℝᴹ',
    object: 'f′(t) ∈ ℝᴹ',
    reading: 'columna: es el jacobiano con P = 1',
    glyph: 'column',
  },
  {
    y: 412,
    tag: 'muchos a muchos',
    shape: 'P → M',
    domain: 'ℝᴾ',
    codomain: 'ℝᴹ',
    object: 'J_f ∈ ℝᴹˣᴾ',
    reading: 'matriz: M filas (salidas) × P columnas (entradas)',
    glyph: 'matrix',
  },
];

function Sup({ children }) {
  return (
    <tspan dy="-7" fontSize="11">
      {children}
    </tspan>
  );
}

function Chip({ x, y, label, sup, color }) {
  return (
    <g>
      <rect x={x} y={y} width="68" height="52" rx="10" fill="#FFFFFF" stroke={color} strokeWidth="1.6" />
      <text x={x + 34} y={y + 33} textAnchor="middle" fontSize="19" fill={color} fontFamily="Space Grotesk, sans-serif">
        {label}
        {sup ? <Sup>{sup}</Sup> : null}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 8} y2={y2} stroke={LINE} strokeWidth="2" />
      <path d={`M${x2 - 9},${y2 - 5} L${x2},${y2} L${x2 - 9},${y2 + 5}`} fill="none" stroke={LINE} strokeWidth="2" />
    </g>
  );
}

function DerivedGlyph({ kind, x, y }) {
  const cell = 20;
  if (kind === 'scalar') {
    return (
      <rect x={x} y={y + 6} width="40" height="40" rx="6" fill={FRONTERA} opacity="0.22" stroke={FRONTERA} strokeWidth="1.6" />
    );
  }
  if (kind === 'column') {
    return (
      <g>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={x + 4}
            y={y + i * cell}
            width="34"
            height={cell - 3}
            rx="3"
            fill={FRONTERA}
            opacity={i === 1 ? 0.1 : 0.22}
            stroke={FRONTERA}
            strokeWidth="1.4"
          />
        ))}
        <text x={x + 21} y={y + cell + 7} textAnchor="middle" fontSize="12" fill={FRONTERA}>
          ⋮
        </text>
      </g>
    );
  }
  return (
    <g>
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * (cell + 2)}
            y={y + r * (cell + 3)}
            width={cell}
            height={cell}
            rx="3"
            fill={FRONTERA}
            opacity="0.22"
            stroke={FRONTERA}
            strokeWidth="1.4"
          />
        )),
      )}
    </g>
  );
}

export default function NablaCasosFigure({ title }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={title || 'Los cuatro casos de función y la forma del objeto derivado'}
      style={{ display: 'block' }}
    >
      {LANES.map((lane) => {
        const mid = lane.y + 26;
        return (
          <g key={lane.tag}>
            <text x="18" y={lane.y + 18} fontSize="13" fontWeight="700" fill={INK} fontFamily="Space Grotesk, sans-serif">
              {lane.tag}
            </text>
            <text x="18" y={lane.y + 36} fontSize="12" fill={SUB} fontFamily="Space Grotesk, sans-serif">
              {lane.shape}
            </text>

            <Chip x={140} y={lane.y} label={lane.domain.slice(0, 1)} sup={lane.domain.slice(1)} color={NAVY} />
            <Arrow x1={216} y1={mid} x2={262} y2={mid} />

            <rect x="270" y={lane.y + 6} width="64" height="40" rx="9" fill="#FFFFFF" stroke={PHYS} strokeWidth="1.6" />
            <text x="302" y={lane.y + 33} textAnchor="middle" fontSize="17" fill={PHYS} fontFamily="Space Grotesk, sans-serif">
              f
            </text>
            <Arrow x1={342} y1={mid} x2={388} y2={mid} />

            <Chip x={396} y={lane.y} label={lane.codomain.slice(0, 1)} sup={lane.codomain.slice(1)} color={NAVY} />
            <Arrow x1={472} y1={mid} x2={518} y2={mid} />

            <DerivedGlyph kind={lane.glyph} x={530} y={lane.y + 2} />

            <text x="618" y={lane.y + 20} fontSize="15" fontWeight="700" fill={INK} fontFamily="Space Grotesk, sans-serif">
              {lane.object}
            </text>
            <text x="618" y={lane.y + 40} fontSize="12.5" fill={SUB} fontFamily="Space Grotesk, sans-serif">
              {lane.reading}
            </text>

            {lane.tag === 'muchos a muchos' ? null : (
              <line x1="18" y1={lane.y + 66} x2={W - 18} y2={lane.y + 66} stroke={LINE} strokeWidth="1" strokeDasharray="4 6" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
