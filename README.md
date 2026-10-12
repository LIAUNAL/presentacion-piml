# Presentación PIML — Series de Tiempo y Sistemas Energéticos

Deck de diapositivas a pantalla completa con la revisión de **Modelos Informados por Física (PIML)** para series de tiempo y sistemas energéticos (versión matemática).

## 🌐 Ver en línea

**<https://ropero99.github.io/presentacion-piml/>**

## Contenido

- 47 diapositivas en español con foco matemático: portada, notación, los 6 diagramas de decisión (con su matemática asociada) y cierre, basados en el documento `revision_piml_series_tiempo_energia_matematica.md`
- **Guion de presentación** (`GUION.md`): recorrido slide por slide (~40 min, público técnico) con tiempos, puentes, qué señalar en pantalla y Q&A anticipado
- 6 diagramas de decisión interactivos construidos con [ReactFlow](https://reactflow.dev) desde los bloques Mermaid del documento — aristas rastreables por color de origen, anclajes múltiples y etiquetas junto al destino
- Ecuaciones renderizadas con [MathJax](https://www.mathjax.org) (LaTeX literal del documento)
- Navegación: teclado (flechas / Home / End), clic en el rail de módulos, botones, swipe táctil y modo enfoque (`f`)
- Reanudación automática de la última diapositiva (localStorage)

## 📄 Copias PDF (solo locales)

Se mantienen **fuera del repositorio** (git-ignoradas vía `presentacion_piml_v*.pdf`) y se regeneran con `node src/scripts/export-pdf.mjs [ruta.pdf]`:

- `presentacion_piml_v2_2026-09.pdf` — versión completa de 29 diapositivas congelada **antes** del recorte matemático, para repaso de conceptos.
- `presentacion_piml_v3_matematica_2026-09.pdf` — versión matemática ajustada (26 diapositivas).

## Export y QA visual

```bash
npm run build
node src/scripts/export-pdf.mjs [ruta.pdf]        # PDF 16:9 del deck vigente
node src/scripts/capture-slides.mjs --clean        # PNG por diapositiva en src/scripts/captures/
```

Requieren Playwright/Chromium instalados (`npx playwright install chromium`).

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · ReactFlow 12 · better-react-mathjax · Oxlint

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173/presentacion-piml/
npm run build      # genera dist/
npm run lint       # oxlint
```
## Publicar cambios en GitHub Pages (flujo directo en `main`)

Para mantenerlo sencillo, trabaja directamente en `main`: verifica la presentación, crea un commit y súbelo. No hace falta crear una rama para cada cambio. El sitio se actualiza automáticamente después del push; el enlace público no cambia.

```bash
# Ejecuta esto antes de empezar a editar, con el árbol de trabajo limpio
git switch main
git pull --ff-only origin main

# Después de editar, verifica que el deck compila
npm run build

# Añade solo los archivos que modificaste; evita git add -A si hay PDFs u otros archivos locales
git add README.md src/data/deckContent.js src/deck/diagrams/DataDrivenFlow.jsx
git commit -m "feat(deck): update presentation slides"
git push origin main
```

Adapta `git add` a los archivos que realmente cambiaste. Espera a que la acción **Deploy a GitHub Pages** termine correctamente en GitHub Actions y abre el enlace de arriba para comprobar la publicación. El workflow está definido en `.github/workflows/deploy.yml` y publica cada push a `main`. Si GitHub rechaza el push por protección de rama o permisos, la configuración del repositorio debe permitir pushes directos a `main`.

Basado en: `revision_piml_series_tiempo_energia_matematica.md` — Maestría en Ingeniería, Universidad Nacional de Colombia.
