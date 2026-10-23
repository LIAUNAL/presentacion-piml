import React from 'react';
import PuertasFisicaFlow from './PuertasFisicaFlow.jsx';
import FamiliasPimlFlow from './FamiliasPimlFlow.jsx';
import DataDrivenFlow from './DataDrivenFlow.jsx';
import GprUncertaintyFigure from './GprUncertaintyFigure.jsx';
import { DirectoInversoFigure, InversoIterativoFigure, PinnConjuntaFigure, ResiduoAutodiffFigure } from './PimlFlowFigures.jsx';
import EnsembleBand from './EnsembleBand.jsx';
import NablaCasosFigure from './NablaCasosFigure.jsx';
import InterseccionFlow from './InterseccionFlow.jsx';
import ProblemasFlow from './ProblemasFlow.jsx';
import OpcionesFlow from './OpcionesFlow.jsx';
import MRPuerta1Flow from './MRPuerta1Flow.jsx';
import MRPuerta2Flow from './MRPuerta2Flow.jsx';
import MRPuerta3Flow from './MRPuerta3Flow.jsx';
import { PinnDirectoFlow, PinnInversoFlow } from './PinnDirectoInversoFlow.jsx';

// id de diagrama (deckContent) -> componente ReactFlow del deck.
export const DIAGRAM_COMPONENTS = {
  d1: PuertasFisicaFlow,
  d2: FamiliasPimlFlow,
  d3: DataDrivenFlow,
  gpr: GprUncertaintyFigure,
  directoInverso: DirectoInversoFigure,
  inversoIterativo: InversoIterativoFigure,
  pinnConjunta: PinnConjuntaFigure,
  bandaEnsemble: EnsembleBand,
  nablaCasos: NablaCasosFigure,
  residuoAutodiff: ResiduoAutodiffFigure,
  d4: InterseccionFlow,
  d5: ProblemasFlow,
  d6: OpcionesFlow,
  mr1: MRPuerta1Flow,
  mr2: MRPuerta2Flow,
  mr3: MRPuerta3Flow,
  pinnDirecto: PinnDirectoFlow,
  pinnInverso: PinnInversoFlow,
};
