import React from 'react';
import { MathJax } from 'better-react-mathjax';

/**
 * Línea de nodo con math tipografado: envuelve un string marcado con
 * `$…$` (los delimitadores pasan tal cual — la config de MathProvider
 * los consume con inlineMath [['$','$']]). Único componente del panel
 * que importa better-react-mathjax fuera de SlideBody.
 *
 * Sin `dynamic`: better-react-mathjax 3.0.2 tipografía una vez al montar
 * (verificado en producción); `dynamic` re-tipografiaba en cada render y
 * anidaba `mjx-container` duplicados. El contenido de los nodos es fijo.
 */
export default function NodeEquation({ code, onTypeset }) {
  return (
    <MathJax inline onTypeset={onTypeset} className="deck-eqline">
      {code}
    </MathJax>
  );
}
