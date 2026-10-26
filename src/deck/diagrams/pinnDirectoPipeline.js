import { makeEdge } from './DeckFlowPanel.jsx';

/**
 * Topología del diagrama de la PINN directa (§4b, diapositiva 31).
 *
 * Mismo dibujo que la PINN inversa (pinnInversoPipeline.js): única entrada de
 * tiempo, misma red 3×3, mismas tres ramas (datos, condiciones iniciales y
 * física), mismas pérdidas rotuladas por su símbolo, mismo optimizador. La
 * única diferencia es φ: aquí (m, c, k) son conocidos y fijos, alimentan el
 * residuo pero no reciben gradiente.
 */

const RED = '#C0392B'; // θ: parámetros neuronales y su actualización
const NAVY = '#1E3A5F'; // φ: parámetros físicos del sistema
const GRIS = '#34495E'; // red neuronal
const GRIS_CLARO = '#95A5A6'; // salida de la red
const TEAL = '#16A085'; // datos: tiempo de colocación, mediciones, condiciones iniciales
const MORADO = '#7D3C98'; // autodiferenciación
const NARANJA = '#E67E22'; // residuo y pérdida física
const AZUL = '#2E86AB'; // pérdida de datos
const TINTA = '#1b2029'; // pérdida total
const TRAMO = '#8fa8c8'; // conexiones de la red (líneas finas sin flecha)

// Geometría de la red: idéntica a la puerta ① para que las dos diapositivas
// se lean como el mismo modelo.
const SIZE = 46;
const GAP = 40;
const PITCH = SIZE + GAP;
const Y0 = 132;
const X0 = 400;
const STEP = 80;
const N_ROWS = 3;
const N_HIDDEN = 3;

// Columnas del bloque de cálculo (a la derecha de la red).
const COL_A = 730; // mediciones y pérdida de datos
const COL_B = 930; // autodiferenciación y condiciones iniciales
const COL_C = 1180; // φ, residuo y pérdida física

const ROWS = Array.from({ length: N_ROWS }, (_, r) => r);
const LAYERS = Array.from({ length: N_HIDDEN }, (_, l) => l);

const ROW_Y = (row) => Y0 + row * PITCH;

/** Neurona circular: entrada por la izquierda, salida por la derecha. */
function neuron(id, label, color, position, opts = {}) {
  return {
    id,
    type: 'neuron',
    position,
    zIndex: 10,
    data: { label, color, fill: opts.fill, heavy: opts.heavy },
  };
}

/** Etiqueta de capa sobre cada columna (como en el esquema de la puerta ①). */
function layerLabel(id, text, x, y) {
  return {
    id,
    type: 'label',
    position: { x, y },
    data: { label: text, variant: 'layer', color: 'var(--subtext1)' },
  };
}

/** Tarjeta de rol con anclajes declarativos (ver pinnInversoParts.jsx). */
function card(id, position, data) {
  return { id, type: 'pinnCard', position, data };
}

/** Malla de conexiones entre dos columnas de neuronas (líneas finas). */
function neuronMesh(fromIds, toIds) {
  const edges = [];
  fromIds.forEach((source) => {
    toIds.forEach((target) => {
      edges.push({
        id: `mesh-${source}-${target}`,
        source,
        target,
        type: 'default',
        style: { stroke: TRAMO, strokeWidth: 1 },
      });
    });
  });
  return edges;
}

/** Arista de flujo con punta de flecha del color del tramo. */
function arrowEdge(source, target, opts = {}) {
  const { color, ...rest } = opts;
  return {
    ...makeEdge(source, target, { color, ...rest }),
    markerEnd: { type: 'arrowclosed', color, width: 14, height: 14 },
  };
}

/**
 * Arista ruteada a mano: tramos ortogonales con esquinas redondeadas que pasan
 * por `via`, más una etiqueta anclada en `labelAt`. Se usa para los dos ciclos
 * de actualización y para la flecha φ → residuo, que deben esquivar las cajas
 * sin cruzarlas.
 */
function routedEdge({
  id,
  source,
  sourceHandle,
  target,
  targetHandle,
  color,
  via = [],
  label,
  labelAt,
  dashed = false,
  strokeWidth = 2.2,
}) {
  const style = { stroke: color, strokeWidth };
  if (dashed) style.strokeDasharray = '7 5';
  return {
    id,
    source,
    sourceHandle,
    target,
    targetHandle,
    type: 'pinn-loop',
    style,
    markerEnd: { type: 'arrowclosed', color, width: 15, height: 15 },
    data: { via, label, labelAt, labelColor: color, radius: 12 },
  };
}

export function buildPinnDirectoDiagram() {
  const nodes = [];
  const edges = [];

  // ── Entrada de la red: sólo el tiempo de colocación ──
  nodes.push(
    card('tiempo', { x: 70, y: 176 }, {
      color: TEAL,
      title: 'Tiempo $t$',
      lines: ['única entrada de la red'],
      handles: [{ id: 'out', type: 'source', side: 'right', pct: 45 }],
    }),
  );

  // ── Red neuronal f_θ(t): tres capas ocultas, salida x̂_θ(t) ──
  nodes.push(neuron('in-t', 't', TEAL, { x: 320, y: ROW_Y(1) }));

  const hiddenIds = LAYERS.map((layer) =>
    ROWS.map((row) => {
      const id = `h${layer + 1}-${row + 1}`;
      nodes.push(
        neuron(id, '', GRIS, { x: X0 + layer * STEP, y: ROW_Y(row) }, { fill: '#eef4fb' }),
      );
      return id;
    }),
  );

  nodes.push(
    neuron('out', '$\\hat{x}_{\\boldsymbol{\\theta}}(t)$', RED, { x: X0 + N_HIDDEN * STEP, y: ROW_Y(1) }, {
      fill: '#fdeeec',
      heavy: true,
    }),
  );

  nodes.push(layerLabel('lbl-in', 'capa entrada', 300, Y0 - 34));
  LAYERS.forEach((layer) => {
    nodes.push(layerLabel(`lbl-h${layer + 1}`, `ℓ=${layer + 1}`, X0 + layer * STEP + 6, Y0 - 34));
  });
  nodes.push(layerLabel('lbl-out', 'capa salida', 610, Y0 - 34));

  edges.push(...neuronMesh(['in-t'], hiddenIds[0]));
  for (let layer = 0; layer < N_HIDDEN - 1; layer += 1) {
    edges.push(...neuronMesh(hiddenIds[layer], hiddenIds[layer + 1]));
  }
  edges.push(...neuronMesh(hiddenIds[N_HIDDEN - 1], ['out']));

  // ── Llave θ bajo las ocultas: parámetros neuronales (destino de ∇θL) ──
  nodes.push({
    id: 'theta',
    type: 'pinnBrace',
    position: { x: 450, y: 362 },
    zIndex: 10,
    data: {
      label: '$\\boldsymbol{\\theta} = \\{\\mathbf{W}_\\ell, \\mathbf{b}_\\ell\\}_{\\ell=1}^{L}$',
      color: RED,
      handles: [{ id: 'in', type: 'target', side: 'right', pct: 50 }],
    },
  });

  // ── Mediciones observadas: entran a la pérdida de datos, no a la red ──
  nodes.push(
    card('mediciones', { x: COL_A, y: 0 }, {
      color: TEAL,
      title: 'Mediciones',
      lines: ['$(t_i, x_i^{obs}),\\ i = 1,\\dots,N_d$'],
      handles: [{ id: 'out', type: 'source', side: 'bottom', pct: 18 }],
    }),
  );

  // ── Autodiferenciación: derivadas de la salida, sin malla ──
  nodes.push(
    card('ad', { x: COL_B, y: 120 }, {
      color: MORADO,
      dashed: true,
      heavy: true,
      title: 'Diferenciación automática',
      lines: ['$\\dot{\\hat{x}}_{\\boldsymbol{\\theta}}(t),\\ \\ddot{\\hat{x}}_{\\boldsymbol{\\theta}}(t)$'],
      handles: [
        { id: 'in', type: 'target', side: 'left', pct: 65 },
        { id: 'out-res', type: 'source', side: 'right', pct: 45 },
        { id: 'out-ic', type: 'source', side: 'bottom', pct: 50 },
      ],
    }),
  );

  // ── Residuo físico: recibe las derivadas y, por su propio anclaje, φ ──
  nodes.push(
    card('res', { x: COL_C, y: 130 }, {
      color: NARANJA,
      heavy: true,
      title: 'Residuo físico',
      lines: [
        '$\\mathcal{F}[\\hat{x}_{\\boldsymbol{\\theta}}; \\boldsymbol{\\phi}] = 0$',
        '$r_{\\boldsymbol{\\theta}}(t) = m\\,\\ddot{\\hat{x}} + c\\,\\dot{\\hat{x}} + k\\,\\hat{x} - F(t)$',
      ],
      handles: [
        { id: 'in', type: 'target', side: 'left', pct: 45 },
        { id: 'from-phi', type: 'target', side: 'top', pct: 35 },
        { id: 'out', type: 'source', side: 'bottom', pct: 50 },
      ],
    }),
  );

  // ── Bloque independiente de parámetros físicos (no es una capa) ──
  nodes.push(
    card('phi', { x: COL_C, y: 0 }, {
      color: NAVY,
      title: 'Parámetros físicos',
      lines: ['$\\boldsymbol{\\phi} = (m, c, k)$', 'fijos (conocidos)'],
      handles: [{ id: 'out', type: 'source', side: 'bottom', pct: 35 }],
    }),
  );

  // ── Las tres pérdidas, separadas por origen ──
  nodes.push(
    card('Ldatos', { x: COL_A, y: 255 }, {
      color: AZUL,
      dashed: true,
      title: 'Pérdida de datos',
      lines: ['$\\mathcal{L}_{datos}$'],
      handles: [
        { id: 'in', type: 'target', side: 'left', pct: 30 },
        { id: 'obs', type: 'target', side: 'top', pct: 18 },
        { id: 'out', type: 'source', side: 'bottom', pct: 50 },
      ],
    }),
  );

  nodes.push(
    card('Lic', { x: COL_B, y: 255 }, {
      color: TEAL,
      dashed: true,
      title: 'Condiciones iniciales',
      lines: ['$\\mathcal{L}_{0}$'],
      handles: [
        { id: 'in', type: 'target', side: 'top', pct: 50 },
        { id: 'out', type: 'source', side: 'bottom', pct: 50 },
      ],
    }),
  );

  nodes.push(
    card('Lfis', { x: COL_C, y: 255 }, {
      color: NARANJA,
      dashed: true,
      title: 'Pérdida física',
      lines: ['$\\mathcal{L}_{fis}$'],
      handles: [
        { id: 'in', type: 'target', side: 'top', pct: 50 },
        { id: 'out', type: 'source', side: 'bottom', pct: 50 },
      ],
    }),
  );

  // ── Composición de la pérdida total (línea, como en la puerta ①) ──
  nodes.push({
    id: 'Ltotal',
    type: 'pinnLoss',
    position: { x: 935, y: 340 },
    zIndex: 10,
    data: {
      color: TINTA,
      style: { padding: '0 12px' },
      lines: [
        '$\\mathcal{L} = \\mathcal{L}_{datos} + \\lambda_0\\,\\mathcal{L}_{0} + \\lambda_{phys}\\,\\mathcal{L}_{fis}$',
      ],
      handles: [
        { id: 'from-datos', type: 'target', side: 'top', pct: 5 },
        { id: 'from-ic', type: 'target', side: 'top', pct: 50 },
        { id: 'from-fis', type: 'target', side: 'top', pct: 95 },
        { id: 'out', type: 'source', side: 'bottom', pct: 50 },
      ],
    },
  });

  // ── Optimizador: problema conjunto (θ̂, φ̂) = argmin L ──
  nodes.push(
    card('opt', { x: 950, y: 385 }, {
      color: RED,
      heavy: true,
      title: 'Optimizador',
      lines: [
        '$\\hat{\\boldsymbol{\\theta}} = \\arg\\min_{\\boldsymbol{\\theta}} \\mathcal{L}(\\boldsymbol{\\theta})$',
        'actualiza sólo $\\boldsymbol{\\theta}$ · $\\boldsymbol{\\phi}$ fijo',
      ],
      handles: [
        { id: 'in', type: 'target', side: 'top', pct: 50 },
        { id: 'grad-theta', type: 'source', side: 'left', pct: 52 },
      ],
    }),
  );

  // ── Flujo de ida ──
  edges.push(
    // la red sólo consume tiempo
    arrowEdge('tiempo', 'in-t', { color: TEAL, sourceHandle: 'out' }),
    // la salida va a la autodiferenciación y, por separado, a la pérdida de datos
    arrowEdge('out', 'ad', { color: GRIS_CLARO, targetHandle: 'in' }),
    arrowEdge('out', 'Ldatos', { color: GRIS_CLARO, targetHandle: 'in' }),
    // las mediciones observadas entran directamente a la pérdida de datos
    arrowEdge('mediciones', 'Ldatos', { color: TEAL, sourceHandle: 'out', targetHandle: 'obs' }),
    // derivadas → residuo, y predicción en t₀ → pérdida de condiciones iniciales
    arrowEdge('ad', 'res', { color: MORADO, sourceHandle: 'out-res', targetHandle: 'in' }),
    arrowEdge('ad', 'Lic', { color: MORADO, sourceHandle: 'out-ic', targetHandle: 'in' }),
    // φ alimenta el residuo (flecha sólida y rotulada: no entra a la red)
    routedEdge({
      id: 'phi-res',
      source: 'phi',
      sourceHandle: 'out',
      target: 'res',
      targetHandle: 'from-phi',
      color: NAVY,
      strokeWidth: 2.6,
      label: '$\\boldsymbol{\\phi}$',
      labelAt: { x: 1246, y: 109 },
    }),
    arrowEdge('res', 'Lfis', { color: NARANJA, sourceHandle: 'out', targetHandle: 'in' }),
    // composición de la pérdida total
    arrowEdge('Ldatos', 'Ltotal', { color: AZUL, sourceHandle: 'out', targetHandle: 'from-datos' }),
    arrowEdge('Lic', 'Ltotal', { color: TEAL, sourceHandle: 'out', targetHandle: 'from-ic' }),
    arrowEdge('Lfis', 'Ltotal', { color: NARANJA, sourceHandle: 'out', targetHandle: 'from-fis' }),
    arrowEdge('Ltotal', 'opt', { color: TINTA, sourceHandle: 'out', targetHandle: 'in' }),
  );

  // ── Ciclo de entrenamiento: una sola retropropagación y actualización ──
  // ∇θL sube por el hueco entre la llave θ y la columna de cálculo. φ no
  // recibe gradiente: es dato del problema, no incógnita.
  edges.push(
    routedEdge({
      id: 'grad-theta',
      source: 'opt',
      sourceHandle: 'grad-theta',
      target: 'theta',
      targetHandle: 'in',
      color: RED,
      dashed: true,
      via: [
        { x: 700, y: 429 },
        { x: 700, y: 374 },
      ],
      label: '$\\nabla_{\\boldsymbol{\\theta}}\\mathcal{L}$',
      labelAt: { x: 700, y: 405 },
    }),
  );

  return { nodes, edges };
}
