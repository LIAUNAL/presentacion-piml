import { lazy } from 'react';

// Carga diferida: cada diagrama (y @xyflow/react) sale del chunk inicial y
// se descarga cuando su slide entra en la ventana de montaje del deck.
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const pimlFigures = () => import('./PimlFlowFigures.jsx');
const pinnFlows = () => import('./PinnDirectoInversoFlow.jsx');

// id de diagrama (deckContent) -> componente ReactFlow del deck.
export const DIAGRAM_COMPONENTS = {
  d1: lazy(() => import('./PuertasFisicaFlow.jsx')),
  d2: lazy(() => import('./FamiliasPimlFlow.jsx')),
  d3: lazy(() => import('./DataDrivenFlow.jsx')),
  gpr: lazy(() => import('./GprUncertaintyFigure.jsx')),
  directoInverso: named(pimlFigures, 'DirectoInversoFigure'),
  inversoIterativo: named(pimlFigures, 'InversoIterativoFigure'),
  pinnConjunta: named(pimlFigures, 'PinnConjuntaFigure'),
  bandaEnsemble: lazy(() => import('./EnsembleBand.jsx')),
  nablaCasos: lazy(() => import('./NablaCasosFigure.jsx')),
  residuoAutodiff: named(pimlFigures, 'ResiduoAutodiffFigure'),
  d4: lazy(() => import('./InterseccionFlow.jsx')),
  d5: lazy(() => import('./ProblemasFlow.jsx')),
  d6: lazy(() => import('./OpcionesFlow.jsx')),
  mr1: lazy(() => import('./MRPuerta1Flow.jsx')),
  mr2: lazy(() => import('./MRPuerta2Flow.jsx')),
  mr3: lazy(() => import('./MRPuerta3Flow.jsx')),
  pinnDirecto: named(pinnFlows, 'PinnDirectoFlow'),
  pinnInverso: named(pinnFlows, 'PinnInversoFlow'),
};
