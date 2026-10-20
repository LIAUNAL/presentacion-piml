import React from 'react';

/**
 * Figura del deck: trayectoria media de un ensemble con banda de dispersión.
 * Se rotula explícitamente como dispersión del ensemble, no como intervalo de
 * confianza ni predictivo con cobertura garantizada.
 */
const W = 960;
const H = 420;
const M = { top: 40, right: 22, bottom: 44, left: 52 };

const mean = (t) => 1.0 * Math.exp(-0.035 * t) * Math.cos(0.22 * t);
const spread = (t) => 0.06 + 0.0016 * t; // crece con el horizonte

export default function EnsembleBand({ title }) {
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const T = 60;
  const xToPx = (t) => M.left + (t / T) * plotW;
  const yToPx = (v) => M.top + (1 - (v + 1.5) / 3) * plotH;

  const points = [];
  for (let t = 0; t <= T; t += 0.5) points.push({ t, m: mean(t), s: spread(t) });
  const upper = points.map((p) => `${xToPx(p.t).toFixed(1)},${yToPx(p.m + 2 * p.s).toFixed(1)}`).join(' ');
  const lower = points
    .slice()
    .reverse()
    .map((p) => `${xToPx(p.t).toFixed(1)},${yToPx(p.m - 2 * p.s).toFixed(1)}`)
    .join(' ');
  const meanPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xToPx(p.t).toFixed(1)},${yToPx(p.m).toFixed(1)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={title || 'Trayectoria media del ensemble con banda de dispersión'}
      style={{ display: 'block' }}
    >
      <defs>
        <clipPath id="ens-plot">
          <rect x={M.left} y={M.top} width={plotW} height={plotH} />
        </clipPath>
      </defs>
      <g clipPath="url(#ens-plot)">
        <polygon points={`${upper} ${lower}`} fill="#E67E22" opacity="0.16" />
        <path d={meanPath} fill="none" stroke="#2E86AB" strokeWidth="2.4" />
      </g>
      <line x1={M.left} y1={M.top + plotH} x2={W - M.right} y2={M.top + plotH} stroke="#94A3B8" strokeWidth="1" />
      <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + plotH} stroke="#94A3B8" strokeWidth="1" />
      <text x={W / 2} y={H - 10} fontSize="13" fill="#64748B" textAnchor="middle">
        tiempo (t)
      </text>
      <text x={M.left + 6} y={M.top + 14} fontSize="12.5" fill="#64748B">
        banda: x̄ ± 2sₓ — dispersión del ensemble (no intervalo de confianza)
      </text>
    </svg>
  );
}
