import React from 'react';
import NodeEquation from './NodeEquation.jsx';

/**
 * Figura del deck: los cuatro casos de función y la forma del objeto que
 * produce la derivación (escalar, columna o matriz). Las fórmulas se
 * tipografían con MathJax (`$…$`) igual que el resto del deck, para que la
 * notación coincida con las ecuaciones de la sección.
 */
const LANES = [
  {
    tag: 'uno a uno',
    shape: '1 → 1',
    domain: '$\\mathbb{R}$',
    codomain: '$\\mathbb{R}$',
    object: '$f^{\\prime}(t)\\in\\mathbb{R}$',
    reading: 'un solo número',
    glyph: 'scalar',
  },
  {
    tag: 'muchos a uno',
    shape: 'P → 1',
    domain: '$\\mathbb{R}^{P}$',
    codomain: '$\\mathbb{R}$',
    object: '$\\nabla_{\\mathbf{x}}f\\in\\mathbb{R}^{P}$',
    reading: 'columna de $P$ derivadas parciales',
    glyph: 'column',
  },
  {
    tag: 'uno a muchos',
    shape: '1 → M',
    domain: '$\\mathbb{R}$',
    codomain: '$\\mathbb{R}^{M}$',
    object: '$f^{\\prime}(t)\\in\\mathbb{R}^{M}$',
    reading: 'columna: es el jacobiano con $P=1$',
    glyph: 'column',
  },
  {
    tag: 'muchos a muchos',
    shape: 'P → M',
    domain: '$\\mathbb{R}^{P}$',
    codomain: '$\\mathbb{R}^{M}$',
    object: '$\\mathbf{J}_{f}\\in\\mathbb{R}^{M\\times P}$',
    reading: 'matriz: $M$ filas (salidas) × $P$ columnas (entradas)',
    glyph: 'matrix',
  },
];

function Glyph({ kind }) {
  if (kind === 'scalar') {
    return (
      <span className="nabla-glyph is-scalar" aria-hidden="true">
        <span className="nabla-cell" />
      </span>
    );
  }
  if (kind === 'column') {
    return (
      <span className="nabla-glyph is-column" aria-hidden="true">
        <span className="nabla-cell" />
        <span className="nabla-cell is-faded" />
        <span className="nabla-cell" />
      </span>
    );
  }
  return (
    <span className="nabla-glyph is-matrix" aria-hidden="true">
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => <span className="nabla-cell" key={`${r}-${c}`} />),
      )}
    </span>
  );
}

export default function NablaCasosFigure({ title }) {
  return (
    <div
      className="nabla-casos"
      role="img"
      aria-label={title || 'Los cuatro casos de función y la forma del objeto derivado'}
    >
      {LANES.map((lane) => (
        <div className="nabla-caso" key={lane.tag}>
          <div className="nabla-caso-tag">
            <strong>{lane.tag}</strong>
            <span>{lane.shape}</span>
          </div>

          <div className="nabla-caso-flow">
            <span className="nabla-chip">
              <NodeEquation code={lane.domain} />
            </span>
            <span className="nabla-arrow" aria-hidden="true">
              →
            </span>
            <span className="nabla-f">f</span>
            <span className="nabla-arrow" aria-hidden="true">
              →
            </span>
            <span className="nabla-chip">
              <NodeEquation code={lane.codomain} />
            </span>
            <span className="nabla-arrow" aria-hidden="true">
              →
            </span>
            <Glyph kind={lane.glyph} />
          </div>

          <div className="nabla-caso-out">
            <span className="nabla-object">
              <NodeEquation code={lane.object} />
            </span>
            <span className="nabla-reading">
              <NodeEquation code={lane.reading} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
