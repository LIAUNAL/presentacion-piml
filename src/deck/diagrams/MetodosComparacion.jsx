import React from 'react';

/**
 * Figura del deck: comparación de Euler y RK4 contra la solución exacta de una
 * misma EDO. El ejemplo es deliberadamente pequeño y con paso grueso, para que
 * la separación entre la poligonal de Euler y la curva exacta se vea a simple
 * vista; RK4 queda prácticamente encima de la curva.
 *
 * EDO de prueba: z'(t) = -z(t), z(t0) = 1, solución exacta z(t) = exp(-(t - t0)).
 * Se integra aquí mismo para que la figura no dependa de datos pegados a mano.
 * El lienzo es pequeño a propósito: se muestra a ~260 px de ancho, así que los
 * rótulos van sin números y la leyenda se compone en HTML para que se lea.
 */
const W = 300;
const H = 150;
const M = { top: 16, right: 10, bottom: 20, left: 24 };

const DT = 0.75;
const T = 3.75;
const Z0 = 1;

const exact = (t) => Z0 * Math.exp(-t);
const field = (z) => -z;

const eulerStep = (z) => z + DT * field(z);

const rk4Step = (z) => {
  const k1 = field(z);
  const k2 = field(z + (DT / 2) * k1);
  const k3 = field(z + (DT / 2) * k2);
  const k4 = field(z + DT * k3);
  return z + (DT / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
};

function integrate(step) {
  const nodes = [{ t: 0, z: Z0 }];
  let z = Z0;
  for (let t = 0; t + 1e-9 < T; t += DT) {
    z = step(z);
    nodes.push({ t: Math.min(t + DT, T), z });
  }
  return nodes;
}

const path = (nodes, x, y) =>
  nodes.map((n, i) => `${i === 0 ? 'M' : 'L'}${x(n.t).toFixed(1)},${y(n.z).toFixed(1)}`).join(' ');

export default function MetodosComparacion({ method = 'euler', title }) {
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const x = (t) => M.left + (t / T) * plotW;
  const y = (z) => M.top + (1 - Math.min(Math.max(z, 0), 1)) * plotH;

  const euler = integrate(eulerStep);
  const rk4 = integrate(rk4Step);

  const exactNodes = [];
  for (let i = 0; i <= 120; i += 1) {
    const t = (i / 120) * T;
    exactNodes.push({ t, z: exact(t) });
  }

  return (
    <div className="band-plot">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        role="img"
        aria-label={
          title ||
          'Comparación de Euler y Runge–Kutta 4 frente a la solución exacta de la EDO de prueba'
        }
        style={{ display: 'block' }}
      >
        <line
          x1={M.left}
          y1={M.top + plotH}
          x2={W - M.right}
          y2={M.top + plotH}
          stroke="#94A3B8"
          strokeWidth="1"
        />
        <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + plotH} stroke="#94A3B8" strokeWidth="1" />

        <path d={path(exactNodes, x, y)} fill="none" stroke="#1E3A5F" strokeWidth="2.4" />

        <path
          d={path(euler, x, y)}
          fill="none"
          stroke="#E67E22"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
        {euler.map((n) => (
          <circle key={`e-${n.t}`} cx={x(n.t)} cy={y(n.z)} r="2.6" fill="#E67E22" />
        ))}

        <path d={path(rk4, x, y)} fill="none" stroke="#2E86AB" strokeWidth="2" />
        {rk4.map((n) => (
          <rect key={`r-${n.t}`} x={x(n.t) - 2.6} y={y(n.z) - 2.6} width="5.2" height="5.2" fill="#2E86AB" />
        ))}

        <text x={W - M.right} y={H - 6} fontSize="9.5" fill="#64748B" textAnchor="end">
          t
        </text>
        <text x="2" y={M.top - 4} fontSize="9.5" fill="#64748B">
          z(t)
        </text>
      </svg>

      <ul className="band-key">
        <li>
          <span className="key-line is-exact" aria-hidden="true" />
          exacta
        </li>
        <li>
          <span className="key-line is-euler" aria-hidden="true" />
          Euler
        </li>
        <li>
          <span className="key-line is-rk4" aria-hidden="true" />
          RK4
        </li>
        <li className="key-note">{method === 'rk4' ? 'mismo Δt' : 'Δt grueso'}</li>
      </ul>
    </div>
  );
}
