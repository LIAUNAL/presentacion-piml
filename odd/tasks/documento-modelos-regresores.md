# Feature: Documento de estudio — modelos de regresión paso a paso

**Estado:** cerrado y verificado
**Rama:** `feat/regresores-svr-arboles`
**Entregable:** `docs/modelos-regresores-paso-a-paso.md` — 1884 líneas, 112 ecuaciones display.
**Solicitud:** un documento `.md` que explique todos los modelos del bloque de regresores del deck, con su
matemática paso a paso, ordenado por complejidad, entendible y partiendo de lo más básico.

## Decisiones tomadas con el usuario

- **Ubicación:** `docs/modelos-regresores-paso-a-paso.md` (versionado con el deck).
- **Alcance:** baselines naive (naive, seasonal-naive) + OLS, MLE, Ridge, Lasso, ElasticNet, DLinear,
  SVR, CART, Random Forest y XGBoost/Gradient Boosting. Total: 12 modelos.
- **Ejemplos:** un **ejemplo numérico transversal**, el mismo conjunto de datos diminuto en todos los
  modelos, resuelto a mano cuando el cálculo es cerrado.
- **Idioma:** español, por convención del proyecto.

## Ejemplo transversal (fijo para todo el documento)

Serie horaria de consumo (kWh): $10, 12, 14, 13, 15, 16$.

Ventanas de un paso con rezago 1, $N = 5$ muestras, $d = 2$ (intercepto absorbido):

| $i$ | $\mathbf{x}_i = (1, z_i)$ | $y_i$ |
| --- | --- | --- |
| 1 | $(1, 10)$ | 12 |
| 2 | $(1, 12)$ | 14 |
| 3 | $(1, 14)$ | 13 |
| 4 | $(1, 13)$ | 15 |
| 5 | $(1, 15)$ | 16 |

Cantidades base (calculadas y verificadas a mano):

- $\sum z_i = 64$, $\sum z_i^2 = 834$, $\sum y_i = 70$, $\sum z_i y_i = 905$, $N = 5$
- $\bar{z} = 12.8$, $\bar{y} = 14$
- $\mathbf{D}^{\top}\mathbf{D} = \begin{bmatrix} 5 & 64 \\ 64 & 834 \end{bmatrix}$,
  $\det = 74$, $\mathbf{D}^{\top}\mathbf{y} = (70, 905)^{\top}$
- $c_{zz} = \sum (z_i-\bar z)^2 = 14.8$, $c_{zy} = \sum (z_i-\bar z)(y_i-\bar y) = 9.0$,
  $c_{yy} = \sum (y_i-\bar y)^2 = 10$
- OLS: $\hat\theta_1 = 9/14.8 = 0.6081$, $\hat\theta_0 = 6.2162$, RSS $= 4.527$, $R^2 = 0.5473$
- $\hat\sigma^2_{MLE} = 4.527/5 = 0.9054$, insesgado $= 4.527/3 = 1.5090$
- Ridge sin penalizar el intercepto ($\lambda_{reg}=1$): $\hat\theta_1 = 9/15.8 = 0.5696$
- Lasso ($\lambda_{reg}=1$): $\hat\theta_1 = (9-0.5)/14.8 = 0.5743$; con $\lambda_{reg}=20$: $0$ exacto
- ElasticNet ($\lambda_{reg}=1$, $\rho_{en}=0.5$): $\hat\theta_1 = 8.5/15.3 = 0.5556$
- CART: mejor split $z \le 13$ contra $z \ge 14$, SSE intra $= 2.5$ (de cuatro splits evaluados)
- XGBoost, una iteración con $\lambda_{arb}=1$, $\gamma_{arb}=0$: $w_L = -0.75$, $w_R = 1.0$,
  $\mathrm{Gain} = 2.625$

## Criterios de aceptación

1. Orden por complejidad creciente: baselines → lineales → regularizados → kernel → árboles y ensambles.
2. Cada modelo con: idea, estructura, función de costo, qué minimiza, problema de optimización,
   derivación paso a paso de su solución y cómo se resuelve en la práctica.
3. Un solo ejemplo numérico transversal, coherente en todas las secciones y verificado a mano.
4. Notación alineada con el deck (S1–S9 y N1–N11): $\theta$, $\mathbf{D}$, $\lambda_{reg}$, $\mathbf{x}$,
   paréntesis para continuo y corchetes para discreto.
5. Cierre con tabla comparativa, errores comunes y conexión explícita con las slides del deck.
6. Sin errores de notación ni fórmulas mal tipadas; revisión de consistencia de los números del ejemplo.

## Progreso

- Documento escrito y verificado. Estructura final: 0 (cómo leer) · 1 fundamentos · 2 baselines ·
  3 lineales (OLS, MLE) · 4 regularización (Ridge, Lasso, ElasticNet, DLinear) · 5 SVR · 6 árboles
  (CART, Random Forest, XGBoost) · 7 comparación · 8 protocolo · 9 chuleta · 10 checklist · 11 conexión
  con el deck · 12 referencias.
- Verificación de consistencia: 1630 delimitadores `$` (par, matemática balanceada), 0 líneas con número
  impar de `$` fuera de bloques de código, 112 bloques de ecuación display, 0 referencias a subsecciones
  inexistentes, y las cifras clave del ejemplo repetidas de forma coherente en todas las secciones.
- Ajuste de convención durante la escritura: se adoptó la forma con $\tfrac{1}{2}$ en el término de datos
  (§4.0) para que Ridge, Lasso y ElasticNet salgan de la misma fórmula por coordenada; la nota de §4.2
  explica la equivalencia con la forma sin $\tfrac{1}{2}$ que aparece en las slides. Con esa convención,
  el ejemplo da OLS 0.6081 > Ridge 0.5696 > ElasticNet 0.5556 > Lasso 0.5405.
