import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Copia el subconjunto de MathJax 3 (paquete `mathjax`) que usa el deck a
 * public/mathjax: el componente tex-chtml, sus extensiones TeX (autoload),
 * las fuentes CHTML woff-v2 y los módulos a11y/ui que carga bajo demanda.
 * Así el deck no depende de un CDN en tiempo de ejecución (sirve offline).
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const from = path.join(root, 'node_modules/mathjax/es5');
const to = path.join(root, 'public/mathjax');

const parts = ['tex-chtml.js', 'input/tex/extensions', 'output/chtml/fonts/woff-v2', 'a11y', 'ui'];

await rm(to, { recursive: true, force: true });
for (const part of parts) {
  await cp(path.join(from, part), path.join(to, part), { recursive: true });
}
console.log(`MathJax copiado a ${path.relative(root, to)}`);
