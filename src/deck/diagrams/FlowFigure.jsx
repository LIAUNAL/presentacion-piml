import React from 'react';

/**
 * Figura de flujo horizontal para el deck (SVG estático, sin ReactFlow).
 * Cada fila es una cadena de nodos con flechas; admite una flecha de retorno
 * para representar bucles iterativos. Paleta del deck:
 * azul #2E86AB (modelo), naranja #E67E22 (datos/optimizador), morado #7D3C98 (parámetros).
 */
const W = 640;
const ROW_H = 104;

const NODE_COLORS = {
  blue: '#2E86AB',
  orange: '#E67E22',
  purple: '#7D3C98',
  gray: '#64748B',
};

function Node({ x, y, w, h, text, sub, color }) {
  const lines = String(text).split('\n');
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#FFFFFF" stroke={color} strokeWidth="1.6" />
      <rect x={x} y={y} width={w} height="4" rx="2" fill={color} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + h / 2 + (i - (lines.length - 1) / 2) * 13 + 4}
          fontSize="11.5"
          fill="#1E293B"
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
      {sub ? (
        <text x={x + w / 2} y={y + h - 6} fontSize="9.5" fill="#64748B" textAnchor="middle">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, dashed }) {
  const midY = y1 - 8;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - 6}
        y2={y2}
        stroke="#94A3B8"
        strokeWidth="1.4"
        strokeDasharray={dashed ? '4 3' : undefined}
        markerEnd="url(#flow-arrow)"
      />
      {label ? (
        <text x={(x1 + x2) / 2} y={midY - 2} fontSize="9.5" fill="#64748B" textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
}

export default function FlowFigure({ spec, title }) {
  const rows = spec.rows;
  const H = 26 + rows.length * ROW_H;
  const padX = 14;
  const usable = W - 2 * padX;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={title || 'Diagrama de flujo'}
      style={{ display: 'block' }}
    >
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
        </marker>
      </defs>
      {rows.map((row, rIdx) => {
        const n = row.nodes.length;
        const gap = 16;
        const boxW = Math.min(150, (usable - gap * (n - 1)) / n);
        const totalW = boxW * n + gap * (n - 1);
        const startX = padX + (usable - totalW) / 2;
        const y = 34 + rIdx * ROW_H;
        const boxH = 58;
        return (
          <g key={rIdx}>
            <text x={padX} y={y - 8} fontSize="10.5" fill="#64748B" fontWeight="700" letterSpacing="0.04em">
              {row.label.toUpperCase()}
            </text>
            {row.nodes.map((node, i) => (
              <Node
                key={i}
                x={startX + i * (boxW + gap)}
                y={y}
                w={boxW}
                h={boxH}
                text={node.text}
                sub={node.sub}
                color={NODE_COLORS[node.color || 'blue']}
              />
            ))}
            {row.nodes.slice(0, -1).map((_, i) => (
              <Arrow
                key={`a${i}`}
                x1={startX + i * (boxW + gap) + boxW}
                y1={y + boxH / 2}
                x2={startX + (i + 1) * (boxW + gap)}
                y2={y + boxH / 2}
                label={(row.edges || [])[i]}
              />
            ))}
            {row.loop ? (
              <g>
                <path
                  d={`M ${startX + (n - 1) * (boxW + gap) + boxW / 2} ${y + boxH + 4}
                      C ${startX + (n - 1) * (boxW + gap) + boxW / 2} ${y + boxH + 26},
                        ${startX + boxW / 2} ${y + boxH + 26},
                        ${startX + boxW / 2} ${y + boxH + 6}`}
                  fill="none"
                  stroke="#E67E22"
                  strokeWidth="1.4"
                  strokeDasharray="5 4"
                  markerEnd="url(#flow-arrow)"
                />
                <text x={startX + totalW / 2} y={y + boxH + 42} fontSize="10" fill="#E67E22" textAnchor="middle">
                  {row.loop}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
