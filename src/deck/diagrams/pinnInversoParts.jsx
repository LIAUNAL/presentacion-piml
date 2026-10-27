import React, { useContext } from 'react';
import { Handle, Position, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import { RefitContext } from './DeckFlowPanel.jsx';
import { hasMathLine } from './mathLine.js';
import NodeEquation from './NodeEquation.jsx';

/**
 * Piezas visuales del diagrama de la PINN inversa (§4b, diapositiva 32).
 *
 * El diagrama reutiliza el lenguaje del esquema de la puerta ① (neuronas
 * circulares, malla completa y llave θ bajo las ocultas) y añade lo propio del
 * problema inverso: el bloque de parámetros físicos φ —independiente de la
 * red—, las dos pérdidas separadas por origen y los dos flujos de
 * retropropagación ∇θL / ∇φL.
 *
 * Para eso hacen falta anclajes en bordes que el nodo 'deck' compartido no
 * ofrece (arriba/abajo y varios por borde), así que este módulo define
 * tarjetas, llave y línea de pérdida con anclajes declarativos:
 *
 *   data.handles = [{ id, type: 'source' | 'target',
 *                     side: 'left' | 'right' | 'top' | 'bottom', pct }]
 *
 * Las tarjetas reutilizan las clases del nodo 'deck' (.deck-node, .node-bar,
 * .node-title, .node-line) para heredar tamaño y tipografía del deck sin
 * duplicar estilos. La arista 'pinn-loop' dibuja los dos ciclos de
 * actualización como polilíneas ortogonales con esquinas redondeadas.
 *
 * IMPORTANTE: todo nodo custom con aristas debe renderizar al menos un Handle
 * (aunque sea isConnectable={false}); sin él ReactFlow no calcula
 * handleBounds y la arista no se dibuja.
 */

const POSITION = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

/**
 * Desplazamiento del anclaje a lo largo de su borde (vertical en laterales).
 * Con `offsetPx` el anclaje se mide en píxeles desde el borde de origen: así
 * dos tarjetas de anchos distintos pueden compartir la misma coordenada y el
 * conector entre ellas sale perfectamente recto.
 */
function anchorStyle(side, pct, offsetPx) {
  const vertical = side === 'left' || side === 'right';
  const value = offsetPx != null ? `${offsetPx}px` : `${pct}%`;
  return vertical ? { top: value } : { left: value };
}

/** Anclajes declarados por el nodo (ids explícitos: las aristas los citan). */
function Anchors({ handles }) {
  return (handles || []).map((handle) => (
    <Handle
      key={handle.id}
      id={handle.id}
      type={handle.type}
      position={POSITION[handle.side]}
      style={anchorStyle(handle.side, handle.pct ?? 50, handle.offsetPx)}
      isConnectable={false}
    />
  ));
}

/** Línea de contenido: math tipografado si lleva un par `$…$`, texto si no. */
function ContentLine({ line, className }) {
  const refit = useContext(RefitContext);
  return (
    <div className={className}>
      {hasMathLine(line) ? <NodeEquation code={line} onTypeset={refit} /> : line}
    </div>
  );
}

/**
 * Tarjeta de rol del diagrama: misma piel que el nodo 'deck' del panel
 * (barra de color, título y líneas) pero con anclajes configurables.
 */
export function PinnCard({ data }) {
  const refit = useContext(RefitContext);
  return (
    <div
      className={`deck-node${data.heavy ? ' is-heavy' : ''}${data.dashed ? ' is-dashed' : ''}`}
    >
      <div className="node-bar" style={{ background: data.color }} aria-hidden="true" />
      <Anchors handles={data.handles} />
      {data.title ? (
        <div className="node-title">
          {hasMathLine(data.title) ? (
            <NodeEquation code={data.title} onTypeset={refit} />
          ) : (
            data.title
          )}
        </div>
      ) : null}
      {(data.lines || []).map((line, i) => (
        <ContentLine key={i} line={line} className="node-line" />
      ))}
    </div>
  );
}

/**
 * Llave de parámetros bajo las capas ocultas (θ). Conserva la piel de la
 * puerta ① (borde superior como corchete) y añade un anclaje de entrada para
 * que el gradiente ∇θL llegue hasta ella.
 */
export function PinnBrace({ data }) {
  const refit = useContext(RefitContext);
  return (
    <div
      className="deck-label is-theta"
      style={{ borderTopColor: data.color, color: data.textColor || 'var(--fg)' }}
    >
      <Anchors handles={data.handles} />
      {hasMathLine(data.label) ? (
        <NodeEquation code={data.label} onTypeset={refit} />
      ) : (
        data.label
      )}
    </div>
  );
}

/**
 * Línea de composición de la pérdida (sin caja, como en la puerta ①) con
 * varios anclajes de entrada arriba (las dos pérdidas) y una salida abajo
 * hacia el optimizador.
 */
export function PinnLossLine({ data }) {
  const refit = useContext(RefitContext);
  return (
    <div className="deck-lossline" style={{ color: data.color, ...(data.style || {}) }}>
      <Anchors handles={data.handles} />
      {data.lines.map((line, i) =>
        hasMathLine(line) ? (
          <NodeEquation key={i} code={line} onTypeset={refit} />
        ) : (
          <span key={i} className="deck-lossline-part">
            {line}
          </span>
        ),
      )}
    </div>
  );
}

/**
 * Path ortogonal con esquinas redondeadas a partir de una lista de puntos
 * (coordenadas del lienzo). Evita depender del ruteo automático para los dos
 * ciclos de retropropagación, que deben rodear las cajas sin cruzarlas.
 */
function roundedPolyline(points, radius) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const inLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const outLen = Math.hypot(next.x - curr.x, next.y - curr.y);
    if (inLen === 0 || outLen === 0) continue;
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const start = {
      x: curr.x - ((curr.x - prev.x) / inLen) * r,
      y: curr.y - ((curr.y - prev.y) / inLen) * r,
    };
    const end = {
      x: curr.x + ((next.x - curr.x) / outLen) * r,
      y: curr.y + ((next.y - curr.y) / outLen) * r,
    };
    path += ` L ${start.x} ${start.y} Q ${curr.x} ${curr.y} ${end.x} ${end.y}`;
  }
  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

/**
 * Ciclo de actualización (∇θL / ∇φL): arista discontinua que sale del
 * optimizador, rutea por los puntos `data.via` y entra en el bloque de
 * parámetros que actualiza. La etiqueta se ancla en `data.labelAt`.
 */
export function PinnLoopEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}) {
  const refit = useContext(RefitContext);
  const points = [
    { x: sourceX, y: sourceY },
    ...(data?.via || []),
    { x: targetX, y: targetY },
  ];
  const path = roundedPolyline(points, data?.radius ?? 12);
  const label = data?.label;
  const labelAt = data?.labelAt;

  return (
    <>
      <BaseEdge path={path} style={style} markerEnd={markerEnd} />
      {label && labelAt ? (
        <EdgeLabelRenderer>
          <div
            className="deck-edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelAt.x}px, ${labelAt.y}px)`,
              fontSize: 11,
              fontWeight: 700,
              color: data.labelColor || '#1b2029',
              pointerEvents: 'none',
            }}
          >
            {hasMathLine(label) ? (
              <NodeEquation code={label} onTypeset={refit} />
            ) : (
              label
            )}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

/** Registro para DeckFlowPanel (extraNodeTypes / extraEdgeTypes). */
// eslint-disable-next-line react/only-export-components -- mapa de tipos compartido por diseño (patrón DeckFlowPanel)
export const PINN_NODE_TYPES = {
  pinnCard: PinnCard,
  pinnBrace: PinnBrace,
  pinnLoss: PinnLossLine,
};

// eslint-disable-next-line react/only-export-components -- mapa de tipos compartido por diseño (patrón DeckFlowPanel)
export const PINN_EDGE_TYPES = {
  'pinn-loop': PinnLoopEdge,
};
