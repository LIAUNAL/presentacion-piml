// Sin dependencias de ReactFlow: SlideBody lo usa desde el chunk inicial.
export function hasMathLine(line) {
  return typeof line === 'string' && /\$[^$\n]+\$/.test(line);
}
