import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';
import { NeuronNode, LabelNode } from './mrNodeTypes.jsx';
import { buildPinnInversoDiagram } from './pinnInversoPipeline.js';
import { buildPinnDirectoDiagram } from './pinnDirectoPipeline.js';
import { PINN_NODE_TYPES, PINN_EDGE_TYPES } from './pinnInversoParts.jsx';

/**
 * Figuras §4b: la misma arquitectura PINN para el sistema masa-resorte en los
 * dos problemas, dibujada con el lenguaje del esquema de la puerta ① (red de
 * neuronas con entrada t y salida x̂_θ(t), llave θ, autodiferenciación, línea
 * de pérdida). Las dos figuras comparten topología para que la comparación sea
 * directa: lo único que cambia es el papel de los parámetros físicos.
 *
 *   · Directa (31): φ = (m, c, k) conocidos y fijos → alimentan el residuo
 *     pero no reciben gradiente; se optimiza sólo θ.
 *   · Inversa (32): φ desconocidos y entrenables → el residuo depende de ellos
 *     y la optimización conjunta devuelve (θ̂, φ̂).
 */
const inverso = buildPinnInversoDiagram();
const directo = buildPinnDirectoDiagram();

const pinnNodeTypes = {
  neuron: NeuronNode,
  label: LabelNode,
  ...PINN_NODE_TYPES,
};

export function PinnDirectoFlow({ active, title }) {
  return (
    <DeckFlowPanel
      flow="lr"
      nodes={directo.nodes}
      edges={directo.edges}
      title={title}
      active={active}
      className="flow-pinn flow-pinn-dir"
      fitViewPadding={0.02}
      extraNodeTypes={pinnNodeTypes}
      extraEdgeTypes={PINN_EDGE_TYPES}
    />
  );
}

export function PinnInversoFlow({ active, title }) {
  return (
    <DeckFlowPanel
      flow="lr"
      nodes={inverso.nodes}
      edges={inverso.edges}
      title={title}
      active={active}
      className="flow-pinn flow-pinn-inv"
      fitViewPadding={0.02}
      extraNodeTypes={pinnNodeTypes}
      extraEdgeTypes={PINN_EDGE_TYPES}
    />
  );
}
