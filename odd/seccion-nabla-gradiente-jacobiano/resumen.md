# §3 Operador nabla, gradiente y jacobiano — resumen de la sección añadida

Se añadieron **8 diapositivas** consecutivas inmediatamente después del marco común (§2) y antes de la puerta ① del Diagrama 1. El deck pasa de 61 a **69 diapositivas**; ninguna diapositiva existente se eliminó ni se reescribió: sólo se renumeraron sus kickers y sus referencias cruzadas.

## Diapositivas nuevas

| # | Kicker | Título | Qué desarrolla |
|---:|---|---|---|
| 04 | 3 · Operador nabla · Cuatro casos | Qué entra y qué sale al derivar: cuatro casos de función | Uno a uno, muchos a uno, uno a muchos y muchos a muchos; figura con la **forma** del objeto derivado (escalar, columna, matriz) y ecuación que los unifica en $\mathbf J_f$ |
| 05 | 3 · Operador nabla · Gradiente | Muchos a uno: el gradiente $\nabla_{\mathbf x}f$ es un vector columna | Definición con $f:\mathbb{R}^{P}\to\mathbb{R}$, ejemplo cuadrático $\tfrac12\mathbf x^\top\mathbf A\mathbf x+\mathbf b^\top\mathbf x$ y derivada direccional |
| 06 | 3 · Operador nabla · Jacobiano | Muchos a muchos: el jacobiano $\mathbf J_f\in\mathbb{R}^{M\times P}$ | Matriz explícita fila/columna, regla de la cadena con dimensiones y linealización de primer orden |
| 07 | 3 · Operador nabla · Ejemplo paso a paso | Ejemplo: tres entradas y dos salidas | $f:\mathbb{R}^3\to\mathbb{R}^2$ resuelta en cuatro pasos: función, parciales por salida, matriz ensamblada y evaluación numérica |
| 08 | 3 · Operador nabla · Sensibilidad en energía | Modelo energético: cuatro sensores y dos salidas | $T_{out}, RH_{out}, P_{HVAC}, I_{sol}\to(T_{in}^{+1}, E_{HVAC})$; jacobiano $\mathbb{R}^{2\times 4}$ y caso lineal de jacobiano constante |
| 09 | 3 · Operador nabla · Lectura del jacobiano | Cómo leer cada elemento como sensibilidad local | Tabla elemento/unidad/lectura, regla de unidades $\partial y_i/\partial x_j$ y validez local |
| 10 | 3 · Operador nabla · Reglas y dimensiones | Gradiente, jacobiano y Hessiano: qué es cada objeto | Tabla comparativa $\nabla$, $\mathbf J$, $\mathbf H$, $\Delta$; laplaciano como traza; el tiempo sin nabla |
| 11 | 3 · Operador nabla · Conexión con PIML | Dónde aparecen: regresión, redes, HNN y LNN | Tres espacios de derivación, tabla por modelo y encadenamiento $\nabla\to\mathbf J\to\mathbf H=\mathbf J_{\nabla f}$ |

## Renumeración aplicada

`3→4`, `3b→4b`, `4→5`, `5a→6a`, `5b→6b`, `6→7`, `7→8`, `8→9`; `10 · Cierre` no cambia y el hueco previo del `9` queda ocupado por «Lectura conjunta». Se actualizaron las referencias cruzadas: `§5b→§6b` (tabla de notación), `§3→§4`, `§4→§5`, `§5a→§6a`, `§5b→§6b`, `§6→§7`, `§7→§8` (tabla de lectura conjunta, anclajes A–D y Tabla 5).

## Convenciones de notación usadas

| Objeto | Notación | Dimensión | Regla |
|---|---|---|---|
| Entradas | $\mathbf x$ | $\mathbb{R}^{P}$ | $P$ cuenta entradas o características |
| Salidas | $\mathbf y=f(\mathbf x)$ | $\mathbb{R}^{M}$ | $M$ cuenta salidas (no se usa $K$, reservado a otra capa) |
| Gradiente | $\nabla_{\mathbf x}f$ | $\mathbb{R}^{P}$, **columna** | Sólo para salida escalar; su traspuesta es la fila del jacobiano |
| Jacobiano | $\mathbf J_f=[\partial f_i/\partial x_j]$ | $\mathbb{R}^{M\times P}$ | Filas = salidas, columnas = entradas; $\mathbf J_f=(\nabla_{\mathbf x}f)^\top$ si $M=1$ y $\mathbf J_f=f'(t)$ si $P=1$ |
| Hessiana | $\mathbf H_f=[\partial^2f/\partial x_i\partial x_j]$ | $\mathbb{R}^{P\times P}$ | Simétrica si $f\in C^2$; además $\mathbf H_f=\mathbf J_{\nabla f}$ |
| Laplaciano | $\Delta f=\operatorname{tr}(\mathbf H_f)$ | $\mathbb{R}$ | Se nombra $\Delta f$; **no** se escribe $\nabla^2f$ |
| Simpléctica | $\mathbf J_s$ | $\mathbb{R}^{2d\times 2d}$ | Constante y antisimétrica; no es un jacobiano |
| Costos | $J_{\mathrm{HNN}}, J_{\mathrm{LNN}}$ | $\mathbb{R}$ | Escalares con subíndice en mayúsculas |
| Tiempo | $d/dt$, $\dot{x}$, $\ddot{x}$ | — | Operador $\mathcal F=m\,d^2/dt^2+c\,d/dt+k\,\mathcal I$; para campos $f_\theta(t,\mathbf x)$ se usa $\partial_t$ |
| Parámetros / estado | $\boldsymbol\theta$, $\mathbf z$ | $\mathbb{R}^{|\boldsymbol\theta|}$, $\mathbb{R}^{2d}$ | Mismo operador, espacios distintos |

### Comprobación dimensional de las ecuaciones nuevas

- $\mathbf J_f\in\mathbb{R}^{M\times P}$; con $M=1$ da $1\times P$ y con $P=1$ da $M\times 1$.
- Cadena: $\mathbf J_g(f(\mathbf x))\in\mathbb{R}^{K\times M}$ por $\mathbf J_f\in\mathbb{R}^{M\times P}$ → $\mathbb{R}^{K\times P}$.
- Linealización: $(M\times P)(P\times 1)=M\times 1$.
- Ejemplo: $f:\mathbb{R}^3\to\mathbb{R}^2$ → $\mathbf J_f\in\mathbb{R}^{2\times 3}$; $\mathbf J_f(1,2,0)=\begin{bmatrix}2&1&1\\2&0&0\end{bmatrix}$.
- Energía: $\mathbf x\in\mathbb{R}^4$, $f\in\mathbb{R}^2$ → $\mathbf J_f\in\mathbb{R}^{2\times 4}$.
- HNN: $(2d\times 2d)(2d\times 1)=2d\times 1$.
- LNN: $\mathbf H_{\dot{\mathbf q}\dot{\mathbf q}}^{-1}[\nabla_{\mathbf q}\hat L-\mathbf H_{\dot{\mathbf q}\mathbf q}\dot{\mathbf q}]$ con matrices $d\times d$ y vectores $d$ → $d$.
- Hessiano como jacobiano del gradiente: $\mathbf J_{\nabla f}\in\mathbb{R}^{P\times P}$.

## Desviación declarada: la convención temporal

El encargo pedía «conservar la convención temporal $\nabla_t$» del sistema masa-resorte-amortiguador. El deck vigente **no usa** $\nabla_t$: la fila «Convención temporal» y la fila «Operadores diferenciales» de §2 declaran $d/dt$ y puntos, y el propio encargo prohíbe usar $\nabla^2$ de forma ambigua (con $\nabla_t$ definido, $\nabla_t^2$ se lee como laplaciano). Por eso la sección **conserva la convención** ($d/dt$, $\dot x$, $\ddot x$, operador $\mathcal F$) y la hace explícita en la Regla 2 de la diapositiva 10, en lugar de reintroducir $\nabla_t$. Reintroducirlo es un cambio de dos líneas si se prefiere lo contrario.

## Verificación

- `npm run build`: correcto (Vite mantiene la advertencia de chunk > 500 kB, preexistente).
- `x` oxlint: sin hallazgos.
- 69 capturas 1920×1080 @2x generadas; las diapositivas nuevas y sus vecinas se revisaron a tamaño completo con `scrollHeight − clientHeight = 0` (sin recorte).
- Revisión visual: 04–12 (sección nueva y Diagrama 1 renumerado), 67–68 (referencias cruzadas actualizadas).
- Sin recortes horizontales: la ecuación que se cortaba en la primera versión de la diapositiva 04 se dividió en matriz + comentario.
- La tabla de interpretación de energía se separó en dos diapositivas (08 y 09) porque el renderizador muestra tablas antes que ecuaciones y el orden de lectura quedaba invertido.

## Historial

Rama `feat/seccion-nabla-gradiente-jacobiano`: `8faac6f` (notación previa) · `56ba794` (§3 nueva) · `956ab82` (composición y documento) · `00a050b` (seguimiento). Los artefactos de build (PDF y capturas) quedan fuera de git mediante `.gitignore` por carpeta.
