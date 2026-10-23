import React from 'react';
import DeckFlowPanel, { makeEdge } from './DeckFlowPanel.jsx';

/**
 * Figuras §4b: la misma arquitectura PINN para el sistema masa-resorte en los
 * dos problemas. Lo que cambia no es la red sino el papel de los parámetros
 * físicos: en el problema directo son datos fijos y no entran al gradiente; en
 * el inverso se entrenan dentro de $\\boldsymbol\\psi=[\\boldsymbol\\theta;\\boldsymbol\\phi]$
 * y la optimización los devuelve. El resto del flujo (datos → red →
 * autodiferenciación → residuo → pérdida y optimización) se dibuja igual en las
 * dos, para que la comparación sea directa.
 */
const COLORS = {
  fisica: '#1E3A5F',
  datos: '#16A085',
  red: '#34495E',
  ad: '#7D3C98',
  residuo: '#E67E22',
  perdida: '#2E86AB',
  opt: '#C0392B',
};

const directoNodes = [
  {
    id: 'datos',
    type: 'deck',
    data: {
      color: COLORS.datos,
      title: 'Datos y condición inicial',
      lines: ['$(t_i,x_i^{obs})$ medidos', '$x(t_0)$, $\\dot x(t_0)$'],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'red',
    type: 'deck',
    data: {
      color: COLORS.red,
      title: 'Red $f_{\\boldsymbol\\theta}$',
      lines: ['$\\boldsymbol\\theta=\\{\\mathbf W_\\ell,\\mathbf b_\\ell\\}$', 'entrada: $t$'],
    },
    position: { x: 280, y: 0 },
  },
  {
    id: 'ad',
    type: 'deck',
    data: {
      color: COLORS.ad,
      title: 'Autodiferenciación',
      lines: ['$\\hat x_{\\boldsymbol\\theta}(t)$', '$\\dot{\\hat x}_{\\boldsymbol\\theta}$, $\\ddot{\\hat x}_{\\boldsymbol\\theta}$'],
    },
    position: { x: 560, y: 0 },
  },
  {
    id: 'res',
    type: 'deck',
    data: {
      color: COLORS.residuo,
      title: 'Residuo físico',
      lines: ['$\\mathcal{F}[\\hat x_{\\boldsymbol\\theta}]=0$', '$r_{\\boldsymbol\\theta}(t)$ en colocación'],
    },
    position: { x: 840, y: 0 },
  },
  {
    id: 'phi',
    type: 'deck',
    data: {
      color: COLORS.fisica,
      title: 'Parámetros físicos',
      lines: ['$\\boldsymbol\\phi=(m,c,k)$ conocidos', 'fijos: no entran al gradiente'],
    },
    position: { x: 840, y: -200 },
  },
  {
    id: 'loss',
    type: 'deck',
    data: {
      color: COLORS.perdida,
      title: 'Pérdida y optimización',
      lines: ['$\\mathcal L=\\mathcal L_{datos}+\\lambda_{phys}\\mathcal L_{phys}$', 'se minimiza sólo $\\boldsymbol\\theta$'],
    },
    position: { x: 1120, y: 0 },
  },
];

const directoEdges = [
  makeEdge('datos', 'red', { color: COLORS.datos }),
  makeEdge('red', 'ad', { color: COLORS.red }),
  makeEdge('ad', 'res', { color: COLORS.ad }),
  makeEdge('phi', 'res', { color: COLORS.fisica, dashed: true }),
  makeEdge('res', 'loss', { color: COLORS.residuo }),
];

const inversoNodes = [
  {
    id: 'datos',
    type: 'deck',
    data: {
      color: COLORS.datos,
      title: 'Mediciones',
      lines: ['$(t_i,x_i^{obs})$, $i=1..N_d$', 'condición inicial'],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'red',
    type: 'deck',
    data: {
      color: COLORS.red,
      title: 'Red $f_{\\boldsymbol\\theta}$',
      lines: ['$\\boldsymbol\\theta=\\{\\mathbf W_\\ell,\\mathbf b_\\ell\\}$', 'entrada: $t$'],
    },
    position: { x: 280, y: 0 },
  },
  {
    id: 'ad',
    type: 'deck',
    data: {
      color: COLORS.ad,
      title: 'Autodiferenciación',
      lines: ['$\\hat x_{\\boldsymbol\\theta}(t)$', '$\\dot{\\hat x}_{\\boldsymbol\\theta}$, $\\ddot{\\hat x}_{\\boldsymbol\\theta}$'],
    },
    position: { x: 560, y: 0 },
  },
  {
    id: 'res',
    type: 'deck',
    data: {
      color: COLORS.residuo,
      title: 'Residuo con $\\boldsymbol\\phi$ desconocido',
      lines: ['$\\mathcal{F}[\\hat x_{\\boldsymbol\\theta};\\boldsymbol\\phi]=0$', '$m\\ddot{\\hat x}+c\\dot{\\hat x}+k\\hat x-F(t)$'],
    },
    position: { x: 840, y: 0 },
  },
  {
    id: 'loss',
    type: 'deck',
    data: {
      color: COLORS.perdida,
      title: 'Pérdida y optimización',
      lines: ['$\\mathcal L=\\mathcal L_{datos}+\\lambda_{phys}\\mathcal L_{phys}$', '$\\boldsymbol\\psi=[\\boldsymbol\\theta;\\boldsymbol\\phi]$'],
    },
    position: { x: 1120, y: 0 },
  },
  {
    id: 'phi',
    type: 'deck',
    data: {
      color: COLORS.fisica,
      title: 'Parámetros físicos',
      lines: ['$\\boldsymbol\\phi=(m,c,k)$ entrenables', 'sale $\\widehat{\\boldsymbol\\phi}$'],
    },
    position: { x: 840, y: -200 },
  },
];

const inversoEdges = [
  makeEdge('datos', 'red', { color: COLORS.datos }),
  makeEdge('red', 'ad', { color: COLORS.red }),
  makeEdge('ad', 'res', { color: COLORS.ad }),
  makeEdge('res', 'loss', { color: COLORS.residuo }),
  makeEdge('loss', 'phi', { color: COLORS.opt, dashed: true, offset: 40 }),
];

export function PinnDirectoFlow({ active, title }) {
  return (
    <DeckFlowPanel
      flow="lr"
      nodes={directoNodes}
      edges={directoEdges}
      title={title}
      active={active}
      className="flow-pinn"
      fitViewPadding={0.03}
    />
  );
}

export function PinnInversoFlow({ active, title }) {
  return (
    <DeckFlowPanel
      flow="lr"
      nodes={inversoNodes}
      edges={inversoEdges}
      title={title}
      active={active}
      className="flow-pinn"
      fitViewPadding={0.03}
    />
  );
}
