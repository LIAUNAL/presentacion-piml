import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';
import { buildMrDiagram } from './mrPipeline.js';
import { MR_NODE_TYPES } from './mrNodeTypes.jsx';

/**
 * Puerta ③ — Física en los datos / features. Pipeline MR compartido con la
 * física entrando en los datos: features ψ_fis antes del modelo.
 */
const { nodes, edges } = buildMrDiagram({ entry: 'datos' });

export default function MRPuerta3Flow({ active, title }) {
  return <DeckFlowPanel
      flow="lr"
      nodes={nodes}
      edges={edges}
      title={title}
      active={active}
      className="flow-mr3"
      fitViewPadding={0.04}
      extraNodeTypes={MR_NODE_TYPES}
    />;
}
