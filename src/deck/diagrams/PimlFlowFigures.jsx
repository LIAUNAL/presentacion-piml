import React from 'react';
import FlowFigure from './FlowFigure.jsx';

// Flujos de la sección de problemas directos e inversos (E1b). Tres variantes
// sobre el mismo componente para no duplicar el dibujo de nodos y flechas.

const DIRECTO_INVERSO = {
  rows: [
    {
      label: 'Problema directo',
      nodes: [
        { text: 'Parámetros\nφ = (m, c, k)', color: 'purple' },
        { text: 'Modelo físico\nsolver', color: 'blue' },
        { text: 'Salida\nx(t; φ)', color: 'blue' },
      ],
      edges: ['', ''],
    },
    {
      label: 'Problema inverso',
      nodes: [
        { text: 'Mediciones\n(tᵢ, xᵢ)', color: 'orange' },
        { text: 'Estimación\najuste', color: 'blue' },
        { text: 'Parámetros\nφ̂', color: 'purple' },
      ],
      edges: ['', ''],
    },
  ],
};

const INVERSO_ITERATIVO = {
  rows: [
    {
      label: 'Estimación clásica',
      nodes: [
        { text: 'φ inicial', color: 'purple' },
        { text: 'Solver\nnumérico', color: 'blue' },
        { text: 'Comparación\ncon datos', color: 'orange' },
        { text: 'Optimizador', color: 'orange' },
        { text: 'φ̂ estimado', color: 'purple' },
      ],
      edges: ['', '', '', ''],
      loop: 'itera: nuevo φ',
    },
  ],
};

const PINN_CONJUNTA = {
  rows: [
    {
      label: 'Entrenamiento conjunto',
      nodes: [
        { text: 'Tiempo t', color: 'gray' },
        { text: 'Red fθ(t)', sub: 'pesos θ', color: 'blue' },
        { text: 'Salida x̂(t)', color: 'blue' },
        { text: 'Pérdidas', sub: 'ℒd + ℒf + ℒ₀', color: 'orange' },
        { text: 'Optimizador', color: 'orange' },
        { text: 'Parámetros', sub: 'θ y φ físicos', color: 'purple' },
      ],
      edges: ['', '', '', '', ''],
      loop: 'itera: actualiza θ y φ',
    },
  ],
};


const RESIDUO_AUTODIFF = {
  rows: [
    {
      label: 'Evaluación del residuo',
      nodes: [
        { text: 'Tiempo t', color: 'gray' },
        { text: 'Red fθ(t)', color: 'blue' },
        { text: 'Salida x̂(t)', color: 'blue' },
        { text: 'Autodiff', sub: 'd x̂/dt y d²x̂/dt²', color: 'purple' },
        { text: 'Residuo R(t) = 0', color: 'orange' },
      ],
      edges: ['', '', '', ''],
    },
  ],
};

export function DirectoInversoFigure(props) {
  return <FlowFigure spec={DIRECTO_INVERSO} {...props} />;
}

export function InversoIterativoFigure(props) {
  return <FlowFigure spec={INVERSO_ITERATIVO} {...props} />;
}

export function ResiduoAutodiffFigure(props) {
  return <FlowFigure spec={RESIDUO_AUTODIFF} {...props} />;
}

export function PinnConjuntaFigure(props) {
  return <FlowFigure spec={PINN_CONJUNTA} {...props} />;
}
