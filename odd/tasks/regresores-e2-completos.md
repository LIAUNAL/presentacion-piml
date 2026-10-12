# Feature: Regresores E2 completos — SVR, árboles y ensambles, ElasticNet y DLinear

**Estado:** implementado y verificado; pendiente de commit
**Rama:** `feat/regresores-svr-arboles` (creada desde `main` en `9267f9e`)
**Solicitud:** completar el bloque de regresores de la presentación. Cada modelo debe mostrar estructura,
función de costo, qué minimiza y su problema de optimización. Hoy SVR está comprimido en `d3-mat-1`
junto a SARIMA, y CART, Random Forest, XGBoost, ElasticNet y DLinear no existen en el deck.

**Alcance:** `src/data/deckContent.js` (6 slides nuevas y la fila de notación).
**Fuera de alcance:** `GUION.md` (diferido por decisión previa del usuario), diagramas ReactFlow,
y cualquier modelo que no esté en la lista acordada.

---

## 1. Decisiones tomadas con el usuario

- **Conjunto de modelos (elegido):** núcleo + puentes del benchmark → **SVR, CART, árbol de regresión,
  Random Forest, Gradient Boosting/XGBoost, ElasticNet y DLinear**. Deck: 40 → **46 slides**.
- **Orden de inserción:** después de `d3-reg-lasso`, en este orden: `d3-reg-elastic` (cierra la familia
  penalizada), `d3-reg-dlinear` (lineal moderno del benchmark), `d3-reg-svr` (kernel), `d3-reg-tree`,
  `d3-reg-forest`, `d3-reg-boost`.
- **`d3-mat-1`:** deja de llevar SVR; se retitula a `E1 — Estadísticos clásicos (SARIMA)` y su conector
  apunta a las slides de E2 que siguen.
- **Fuente matemática:** `EstadoDelArte/matematica_modelos_benchmark.md` §3–§4 (CART, RF, boosting,
  ElasticNet, DLinear) y `revision_piml_series_tiempo_energia_matematica.md` §5a E2 (SVR).
  Las ecuaciones se traducen a la notación unificada del deck (S1–S9 + N1–N11); no se copia la
  notación del documento de benchmark.
- **Commits:** el Diagrama 1 quedó commiteado en su rama (`4379129`). Las unidades de trabajo de esta
  feature quedan **sin commit** hasta que el usuario lo autorice.

## 2. Traducción de notación (documento → deck)

| Documento de benchmark | Deck | Motivo |
| --- | --- | --- |
| `X` (matriz de diseño) | `\mathbf{D}` | R2: `\mathbf{X}` es la ventana de entrada |
| `\mathbf{w}` | `\theta` | S1: `\theta` es el único símbolo de parámetros |
| `\alpha` (fuerza de regularización) | `\lambda_{reg}` | S5: toda penalización es `\lambda_{\cdot}` |
| `n` ventanas | `N` muestras, índice `i` | N4: `i` numera muestras, subíndice |
| `L` (rezagos) | `\tau` ventana, `d` variables | 1.1 del documento base |
| `H` (horizonte) | `h` | ya fijado en el deck |
| `\rho` (mezcla / correlación) | `\rho_{en}` / `\rho_{arb}` | colisión con el ancho espectral `\rho_k` |
| `h_i` (hessiano) | `\eta_i` | colisión con el horizonte `h` |
| `\lambda`, `\gamma` (XGBoost) | `\lambda_{arb}`, `\gamma_{arb}` | colisión con `\lambda_{reg}` y con el amortiguamiento `\gamma` |
| `B` (nº de árboles) | `M_{arb}` | colisión con el pre-set multibanda `B` y el SSM `\mathbf{B}` |
| `J`, `p` | `J_{arb}`, `p_{ma}` | colisión con los modos VMD y con el momento `p(t)` |
| `\hat{x}_\tau` (remainder DLinear) | `x^{rem}_\tau` | `\hat{\cdot}` es predicción en el deck |

## 3. Unidades de trabajo

- **U1 — SVR:** nueva slide `d3-reg-svr` (pérdida $\varepsilon_{svr}$-insensible, primal con holguras,
  dual y kernel) + retitulado de `d3-mat-1`.
- **U2 — Árboles y ensambles:** `d3-reg-tree` (CART), `d3-reg-forest` (Random Forest),
  `d3-reg-boost` (Gradient Boosting / XGBoost).
- **U3 — Lineales del benchmark:** `d3-reg-elastic` (ElasticNet), `d3-reg-dlinear` (DLinear)
  y la ampliación de la fila de símbolos locales de la slide 2.

## 5. Desviaciones y hallazgos durante la implementación

- **La fila de notación no se amplió.** El intento de añadir los símbolos nuevos a la fila
  «Símbolos locales» de la slide 2 produjo dos defectos: la tabla desbordó y varios `$...$` quedaron
  sin tipografiar. Se revirtió a su contenido original y cada símbolo local se declara ahora en el
  `conn` de la slide donde se usa (mismo patrón que ya usaba E1: «símbolos $s, d, D, c$ son locales de
  esta sección»). Las colisiones peligrosas sí quedaron declaradas en su slide: $\rho_{en}$ y
  $\rho_{arb}$ frente a $\rho_k$, $\eta_i$ frente a $h$, $M_{arb}$ frente a $B$, $J_{arb}$ frente a
  los modos $J$, $c_j$ frente a la constante $c$ del SARIMA, $p_{ma}$ frente a $p(t)$.
- **Gotcha del renderizador:** `RichText` interpreta `*` como delimitador de cursiva, así que
  `^*` dentro de matemática en línea parte el nodo de texto y MathJax no tipografía el resto de la
  frase. En campos procesados por `RichText` (`bullets`, `headings`, `conn`, `notes`) la matemática en
  línea debe evitar el `*` literal: se usa `^{\ast}` o `^{\star}`. Los campos `tex` no lo sufren
  porque se renderizan como texto plano dentro del display.
- **Ajuste de densidad:** para que ninguna slide recortara su línea de cierre, el árbol CART y el
  bosque quedaron con 2 ecuaciones (el criterio de split es lo que el árbol minimiza) y el boosting
  con 2 viñetas; la información retirada se conserva en los `conn` y `notes`.

## 6. Evidencia de verificación

- `npm run build`: correcto (Vite 8.3.0; advertencia no bloqueante de chunk >500 kB).
- Auditoría Playwright a 1920×1080 de **las 46 slides** con asentamiento de fuentes y MathJax
  (2600 ms): contador `nn / 46`; **0 errores de MathJax** en todas las slides; ninguna slide con la
  última línea por debajo del borde del panel (máximo medido: `d3-reg-dlinear` 978 px frente a 1001 px
  de borde). Slides nuevas: `d3-reg-elastic` 971, `d3-reg-dlinear` 978, `d3-reg-svr` 962,
  `d3-reg-tree` 822, `d3-reg-forest` 792, `d3-reg-boost` 969.
- Slide 2 (notación): 0 px de desborde y sin LaTeX crudo tras revertir la ampliación.
- PDF regenerado: `presentacion_piml_v4_puertas_2026-09.pdf`, **46 páginas**, 13 296 609 bytes.
- Sin commit y sin push: el usuario decide la publicación.

1. Cada slide nueva declara modelo, función de costo u objetivo, qué minimiza y su problema de
   optimización, con 3 ecuaciones display como máximo.
2. La notación sigue S1–S9 y N1–N11; todo símbolo local nuevo se declara en su propia slide.
3. `d3-mat-1` ya no contiene la ecuación de SVR y su título corresponde a su contenido real.
4. El deck pasa a 46 slides y la navegación (contador `nn / 46`) es coherente.
5. `npm run build` pasa; auditoría de capturas de las 46 slides sin errores de MathJax ni recortes
   de texto atribuibles a este cambio (la slide 2 de notación es el riesgo principal).
6. Se conservan las referencias bibliográficas por bloque cuando el modelo lo exige.
