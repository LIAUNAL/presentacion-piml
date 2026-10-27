import React from 'react';
import { MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    processEscapes: true,
  },
  options: {
    enableMenu: false,
    renderActions: {
      addMenu: [],
    },
  },
};

// MathJax 3.2.2 self-hosted (src/scripts/copy-mathjax.mjs): sin CDN en
// tiempo de ejecución y solo el componente TeX → CHTML que usa el deck.
const MATHJAX_SRC = `${import.meta.env.BASE_URL}mathjax/tex-chtml.js`;

export default function MathProvider({ children }) {
  return (
    <MathJaxContext config={mathJaxConfig} version={3} src={MATHJAX_SRC}>
      {children}
    </MathJaxContext>
  );
}
