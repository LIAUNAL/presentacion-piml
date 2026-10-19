import React from 'react';

/**
 * Figura del deck para GPR: observaciones ruidosas, media predictiva y banda
 * de incertidumbre ±2σ*. SVG estático (sin ReactFlow) con la paleta del deck:
 * azul #2E86AB (media predictiva), naranja #E67E22 (banda), puntos en gris.
 * Los valores se calculan con las mismas fórmulas de la diapositiva:
 *   μ* = k*ᵀ C⁻¹ y,   σ*² = k(x*,x*) − k*ᵀ C⁻¹ k*,   C = K + σ_n² I.
 */
const W = 640;
const H = 360;
const M = { top: 26, right: 18, bottom: 34, left: 46 };
const ELL = 11; // longitud de escala del kernel RBF
const SIGMA_N2 = 0.02; // varianza del ruido
const T_MAX = 110;

const NOISE = [0.09, -0.07, 0.05, -0.11, 0.08, -0.04, 0.1, -0.06, 0.03, -0.09, 0.07, -0.05];
const XS = [10, 18, 26, 36, 47, 58, 66, 74, 82, 88, 93, 97];

const trueMean = (t) => 0.55 * Math.sin((t / 100) * Math.PI * 1.35) + 0.12;
const k = (a, b) => Math.exp(-((a - b) ** 2) / (2 * ELL * ELL));
const ys = XS.map((x, i) => trueMean(x) + NOISE[i]);

/** Resuelve A x = b por eliminación gaussiana con pivoteo parcial. */
function solve(A, b) {
  const n = b.length;
  const M_ = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c += 1) {
    let p = c;
    for (let r = c + 1; r < n; r += 1) if (Math.abs(M_[r][c]) > Math.abs(M_[p][c])) p = r;
    [M_[c], M_[p]] = [M_[p], M_[c]];
    for (let r = c + 1; r < n; r += 1) {
      const f = M_[r][c] / M_[c][c];
      for (let cc = c; cc <= n; cc += 1) M_[r][cc] -= f * M_[c][cc];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r -= 1) {
    let s = M_[r][n];
    for (let cc = r + 1; cc < n; cc += 1) s -= M_[r][cc] * x[cc];
    x[r] = s / M_[r][r];
  }
  return x;
}

const C = XS.map((a, i) => XS.map((b, j) => k(a, b) + (i === j ? SIGMA_N2 : 0)));
const alpha = solve(C, ys);

function posterior(t) {
  const ks = XS.map((x) => k(t, x));
  const mean = ks.reduce((acc, kv, i) => acc + kv * alpha[i], 0);
  const v = solve(C, ks);
  const variance = Math.max(0, 1 - ks.reduce((acc, kv, i) => acc + kv * v[i], 0));
  return { mean, sd: Math.sqrt(variance) };
}

export default function GprUncertaintyFigure({ title }) {
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const xToPx = (t) => M.left + (t / T_MAX) * plotW;
  const yToPx = (v) => M.top + (1 - (v + 0.85) / 1.7) * plotH;

  const samples = [];
  for (let t = 0; t <= T_MAX; t += 1.5) samples.push({ t, ...posterior(t) });
  const fmt = (t, v) => `${xToPx(t).toFixed(1)},${yToPx(v).toFixed(1)}`;
  const upper = samples.map((s) => fmt(s.t, s.mean + 2 * s.sd)).join(' ');
  const lower = samples
    .slice()
    .reverse()
    .map((s) => fmt(s.t, s.mean - 2 * s.sd))
    .join(' ');
  const meanPath = samples
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${fmt(s.t, s.mean)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={title || 'Media predictiva y banda de incertidumbre de un proceso gaussiano'}
      style={{ display: 'block' }}
    >
      <defs>
        <clipPath id="gpr-plot">
          <rect x={M.left} y={M.top} width={plotW} height={plotH} />
        </clipPath>
      </defs>
      <g clipPath="url(#gpr-plot)">
        <polygon points={`${upper} ${lower}`} fill="#E67E22" opacity="0.16" />
        <path d={meanPath} fill="none" stroke="#2E86AB" strokeWidth="2.6" />
        {XS.map((x, i) => (
          <circle key={x} cx={xToPx(x).toFixed(1)} cy={yToPx(ys[i]).toFixed(1)} r="4" fill="#334155" />
        ))}
      </g>
      <line
        x1={M.left}
        y1={M.top + plotH}
        x2={W - M.right}
        y2={M.top + plotH}
        stroke="#94A3B8"
        strokeWidth="1"
      />
      <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + plotH} stroke="#94A3B8" strokeWidth="1" />
      <text x={W / 2} y={H - 8} fontSize="11" fill="#64748B" textAnchor="middle">
        tiempo (t)
      </text>
    </svg>
  );
}
