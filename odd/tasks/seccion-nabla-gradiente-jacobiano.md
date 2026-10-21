# Sección didáctica del operador nabla, gradiente y jacobiano

Feature: insertar una sección didáctica nueva (§3) en el deck PIML sin tocar el contenido existente, con las reglas de notación ya unificadas y el índice renumerado.

## Specs

- **S1.** «Agrega a la presentación PIML una nueva sección didáctica sobre el operador nabla (∇), el gradiente, la matriz Jacobiana y su aplicación a funciones de múltiples entradas y múltiples salidas.» Base: apartados «1. Los cuatro casos que necesitas distinguir» a «6. Conexión directa con tu presentación PIML».
- **S2.** Orden fijo de las diapositivas: «Los cuatro casos de funciones: uno a uno, muchos a uno, uno a muchos y muchos a muchos»; «Muchos a uno — Gradiente» ($f:\mathbb{R}^P\to\mathbb{R}$); «Muchos a muchos — Jacobiano» ($f:\mathbb{R}^P\to\mathbb{R}^M$, $\mathbf J_f\in\mathbb{R}^{M\times P}$, «las filas corresponden a salidas y las columnas a entradas»); «Ejemplo matemático completo: utiliza una función vectorial con tres entradas y dos salidas»; «Ejemplo aplicado a sistemas energéticos»; «Conexión con PIML».
- **S3.** «Conserva estrictamente la notación unificada que ya utilizamos en la presentación: x ∈ ℝᴾ, y ∈ ℝᴹ, fθ(x), θ, ∇ₓ, ∇θ, ∇_z y J_f.» «Utiliza vectores columna y define el Jacobiano con dimensión M × P: J_f = [∂fᵢ/∂xⱼ].»
- **S4.** «Distingue entre derivar respecto a las entradas, los parámetros entrenables y las variables de estado.» «Explica que el gradiente de una función escalar es un vector, mientras que el Jacobiano de una función vectorial es una matriz.»
- **S5.** «No confundas la matriz Jacobiana con la matriz simpléctica J_s utilizada en HNN.» «Distingue correctamente Hessiano y laplaciano; no utilices ∇² de forma ambigua.» «Verifica rigurosamente las dimensiones de todas las ecuaciones.»
- **S6.** «Conserva todas las diapositivas existentes y evita repetir explicaciones que ya estén desarrolladas. Actualiza la numeración, el índice y la navegación.» «Mantén el diseño visual actual, las fuentes, los colores y la estructura de bloques.» «sin saturar las diapositivas».
- **S7.** «no crees una nueva presentación trabaja con la más actualizada que esté en el proyecto» · «Antes de finalizar, revisa la consistencia matemática y entrega un resumen de las diapositivas añadidas y de las convenciones de notación utilizadas.»
- **S8.** «Conserva la convención temporal ∇ₜ previamente definida para el sistema masa-resorte-amortiguador.» **Resolución aplicada:** el deck vigente no usa `∇ₜ`; su convención temporal declarada es `d/dt` y puntos (fila «Convención temporal» y fila «Operadores diferenciales» de la tabla §2), y S5 prohíbe `∇²` ambiguo. Se conserva la **convención** (`d/dt`, $\dot x$, $\ddot x$) y la sección nueva la declara explícitamente; no se reintroduce `∇ₜ`. Pendiente de confirmación de la autora.

## Tasks

- **T1** · Registrar módulo y navegación · ruta inline · commit 1
  - [x] Nuevo módulo `nabla` en `src/data/deckModules.js`, entre `notacion` y `d1`.
- **T2** · Figura de los cuatro casos · ruta inline · commit 1
  - [x] `src/deck/diagrams/NablaCasosFigure.jsx` (SVG estático) registrado en `diagrams/index.js`.
- **T3** · Redactar las 7 diapositivas nuevas · ruta inline · commit 1
  - [x] Insertadas tras `marco-aprendizaje` en `src/data/deckContent.js`, con `id` estables `nabla-*`.
- **T4** · Renumerar secciones y referencias · ruta inline · commit 2
  - [x] Kickers `3→4`, `3b→4b`, `4→5`, `5a→6a`, `5b→6b`, `6→7`, `7→8`, `8→9`; `10 · Cierre` sin cambio (el hueco de 9 queda ocupado).
  - [x] Referencias cruzadas `§3, §4, §5a, §5b, §6, §7` desplazadas; fila de operadores diferenciales apunta a §3.
- **T5** · Ajustar composición sin recortes · ruta inline · commit 2
  - [x] Reglas CSS acotadas por `data-id` de las diapositivas nuevas.
- **T6** · Verificar y exportar · ruta inline · commit 3
  - [x] `npm run build`, `npm run lint`, capturas de las 68 diapositivas y revisión visual de las nuevas y sus vecinas.
  - [x] PDF nuevo con nombre propio; PDF previos intactos.
- **T7** · Documentar y entregar · ruta inline · commit 3
  - [x] Resumen de diapositivas añadidas y convenciones en `odd/seccion-nabla-gradiente-jacobiano/resumen.md`; memoria Engram.

## Log

- **L1 (solicitud original, literal):** «en el lugar que veas mas conveniente vamos agregar unas aclaraciones sobre notacion del operador nabla con algunos ejemplos, no crees una nueva presetnacion trabaja con la mas actulizada que este en el proyecto, y conserva la notacion para que sea consistente: Agrega a la presentación PIML una nueva sección didáctica sobre el operador nabla (∇), el gradiente, la matriz Jacobiana y su aplicación a funciones de múltiples entradas y múltiples salidas. Utiliza como base la explicación que te comparto, desde el apartado «1. Los cuatro casos que necesitas distinguir» hasta «6. Conexión directa con tu presentación PIML». Organiza el contenido en diapositivas consecutivas siguiendo este orden: Los cuatro casos de funciones: uno a uno, muchos a uno, uno a muchos y muchos a muchos. Explica sus dimensiones y qué resultado produce la derivación en cada caso. Muchos a uno — Gradiente: desarrolla el caso f: ℝᴾ → ℝ, explicando cómo aplicar ∇ₓ a una función escalar y obtener un vector de derivadas parciales. Muchos a muchos — Jacobiano: desarrolla f: ℝᴾ → ℝᴹ, mostrando cómo construir la matriz Jacobiana J_f ∈ ℝᴹˣᴾ, donde las filas corresponden a salidas y las columnas a entradas. Ejemplo matemático completo: utiliza una función vectorial con tres entradas y dos salidas. Calcula las derivadas parciales y construye el Jacobiano paso a paso. Ejemplo aplicado a sistemas energéticos: utiliza múltiples sensores (temperatura, humedad, potencia, etc.) y múltiples salidas. Explica cómo interpretar cada elemento del Jacobiano como una sensibilidad local. Conexión con PIML: relaciona el gradiente y el Jacobiano con regresión lineal, redes neuronales, HNN y LNN. Explica la diferencia entre gradiente, Jacobiano y Hessiano, incluyendo sus dimensiones. Requisitos matemáticos fundamentales: Conserva estrictamente la notación unificada que ya utilizamos en la presentación: x ∈ ℝᴾ, y ∈ ℝᴹ, fθ(x), θ, ∇ₓ, ∇θ, ∇_z y J_f. Utiliza vectores columna y define el Jacobiano con dimensión M × P: J_f = [∂fᵢ/∂xⱼ]. Distingue entre derivar respecto a las entradas, los parámetros entrenables y las variables de estado. Conserva la convención temporal ∇ₜ previamente definida para el sistema masa-resorte-amortiguador. Explica que el gradiente de una función escalar es un vector, mientras que el Jacobiano de una función vectorial es una matriz. No confundas la matriz Jacobiana con la matriz simpléctica J_s utilizada en HNN. Distingue correctamente Hessiano y laplaciano; no utilices ∇² de forma ambigua. Verifica rigurosamente las dimensiones de todas las ecuaciones. Conserva todas las diapositivas existentes y evita repetir explicaciones que ya estén desarrolladas. Actualiza la numeración, el índice y la navegación. Mantén el diseño visual actual, las fuentes, los colores y la estructura de bloques. Incluye ejemplos paso a paso, matrices bien alineadas y diagramas claros, sin saturar las diapositivas. Objetivo: que la presentación permita comprender progresivamente cómo aplicar el operador nabla a funciones escalares y vectoriales, cómo se obtiene el Jacobiano y cómo estos conceptos se utilizan en los modelos de aprendizaje y PIML que estamos estudiando. Antes de finalizar, revisa la consistencia matemática y entrega un resumen de las diapositivas añadidas y de las convenciones de notación utilizadas.»
- **L2:** decisión de ubicación: la sección entra como **§3** inmediatamente después del marco común, porque el gradiente y el jacobiano se usan por primera vez en §4 (puerta ②, HNN/LNN) y §4b (PINN inversa). Se desplaza la numeración en vez de usar una subsección `2b`, para que la sección didáctica tenga rango propio y el hueco de `9` quede ocupado por «Lectura conjunta».
- **L3:** conflicto S8 resuelto a favor de la notación vigente (`d/dt`), con declaración explícita en la diapositiva de reglas; divulgado en la entrega.

## Slice boundary

- Commit `8faac6f` cierra la feature previa de notación (839 líneas netas en 2 commits sobre `main`); esta feature arranca después de esa frontera y se entrega en dos cortes: (1) módulo, figura y contenido nuevo; (2) renumeración, CSS y exportación.

## Slices entregados

- `56ba794` feat(deck): §3 completa — módulo, figura SVG y 8 diapositivas + renumeración (§3–§8 → §4–§9) con sus referencias cruzadas.
- `956ab82` docs(deck): CSS acotado por `data-id`, documento de feature, espejo de seguimiento y resumen con comprobación dimensional.
- La feature previa de notación quedó aislada en `e3ab0e8` antes de empezar (§3 no arrastra cambios ajenos).
- PDF y capturas no se commitean: son artefactos de build (ver `.gitignore` de la carpeta).

## Incidencias corregidas durante la verificación

- La ecuación de la primera diapositiva se recortaba a la derecha (`overflow-x`): se dividió en matriz + comentario.
- El renderizador pinta tablas antes que ecuaciones: la tabla de interpretación energética se movió a una diapositiva propia (09) para no invertir el orden de lectura.
- `\qquad` se escribió con una sola barra en el fuente JS y KaTeX lo mostró como texto (`qqquad`); se corrigió a `\\qquad` y se verificó que no quedan secuencias LaTeX con barra simple.
