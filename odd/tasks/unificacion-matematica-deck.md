# Feature: Unificación matemática del deck PIML

Estado: completado; ronda de correcciones del tutor sobre E2 en curso · Rama: `main` (sin commit; no se solicitó commit)
Propósito: producir un PDF nuevo de la presentación «Revisión de Modelos Informados por Física (PIML) para Series de Tiempo y Sistemas Energéticos», conservando estilo, orden, alcance y rigor matemático.

## Specs

### S1 — Solicitud del usuario (verbatim)

> Tarea: Unificación de notación matemática en presentación PIML
>
> Actúa como investigador experto en aprendizaje automático, modelos de regresión, series temporales, redes neuronales y Physics-Informed Machine Learning (PIML), con experiencia en formulación matemática y elaboración de presentaciones académicas.
>
> 1. Objetivo principal
>
> Revisar y modificar la presentación «Revisión de Modelos Informados por Física (PIML) para Series de Tiempo y Sistemas Energéticos», unificando la notación matemática de todos los modelos.
>
> Utiliza como referencia la imagen adjunta con las anotaciones del tutor.
>
> El propósito es que todos los modelos puedan explicarse y compararse mediante una estructura común:
>
> Entrada: qué información recibe el modelo y cuáles son sus dimensiones.
>
> Salida: qué variable predice y cuál es su dimensión.
>
> Modelo: ecuación matemática que relaciona entradas y salidas.
>
> Función de pérdida: criterio que mide el error o define el ajuste.
>
> Problema de optimización: formulación matemática utilizada para estimar los parámetros.
>
> Cuando sea necesario, añade una sección de desarrollo matemático que incluya ecuaciones de actualización, restricciones, operadores diferenciales, supuestos o soluciones analíticas.
>
> No fuerces una formulación artificial: si un modelo es probabilístico, dinámico o recurrente, conserva sus características matemáticas y explica cómo se relaciona con la estructura general.
>
> 2. Notación matemática unificada
>
> Adoptar preferentemente las siguientes convenciones:
>
> Entradas:
>
> [
> \mathbf{x}_n\in\mathbb{R}^{P},
> \qquad X\in\mathbb{R}^{N\times P}
> ]
>
> Salidas:
>
> [
> \mathbf{y}_n\in\mathbb{R}^{\tau},
> \qquad Y\in\mathbb{R}^{N\times\tau}
> ]
>
> Donde:
>
> (N): número de muestras.
>
> (P): número de características de entrada.
>
> (\tau): horizonte de predicción, cuando se trate de forecasting con una salida por cada paso futuro.
>
> (n): índice de muestra.
>
> (t): índice temporal.
>
> (\theta): conjunto de parámetros entrenables.
>
> (\hat{\theta}): parámetros estimados.
>
> (f_\theta): función de predicción.
>
> (\hat{Y}=f_\theta(X)): predicciones del modelo.
>
> Distinguir explícitamente el horizonte (\tau), la longitud de ventana temporal, el número de capas y los órdenes de cada modelo. No utilizar un mismo símbolo con significados incompatibles dentro de una sección.
>
> Para regresión lineal multisalida, utilizar:
>
> [
> W\in\mathbb{R}^{P\times\tau},
> \qquad \hat Y=XW
> ]
>
> Si se incluye intercepto, incorporarlo mediante una columna de unos o un término de sesgo explícito.
>
> 3. Formulación general del aprendizaje
>
> Utilizar como referencia conceptual:
>
> \\arg\\min_{\\theta}
> \\left[
> \\mathbb{E}{(\\mathbf{x},\\mathbf{y})\\sim p{\\mathrm{datos}}}
> \\left{
> \\mathcal{L}(\\mathbf{y},f_\\theta(\\mathbf{x}))
> \\right}
> +
> \\lambda\\mathcal{R}(\\theta,f_\\theta)
> \\right]
>
> Donde:
>
> (\\mathcal L): función de pérdida asociada a los datos.
>
> (\\mathbb E): esperanza matemática.
>
> (\\mathcal R): término de regularización o penalización adicional.
>
> (\\lambda): peso de la regularización.
>
> Priorizar la esperanza matemática como notación general, tal como recomendó el tutor.
>
> Distinguir entre el riesgo esperado y su aproximación empírica:
>
> [
> \\mathbb E[\\mathcal L]
> \\quad\\text{y}\\quad
> \\frac1N\\sum_{n=1}^{N}\\mathcal L_n
> ]
>
> No afirmar que ambos son siempre exactamente iguales. Si es necesario, explicar que el promedio corresponde a una esperanza bajo la distribución empírica de las muestras.
>
> Para modelos estimados mediante máxima verosimilitud, MAP u otros criterios probabilísticos, presentar la función objetivo probabilística apropiada y su relación con la formulación general. No sustituir sus criterios originales por MSE sin justificación matemática.
>
> 4. Aplicación a los modelos existentes
>
> Revisar todas las familias incluidas en la presentación original, respetando su orden y alcance.
>
> Regresión lineal y mínimos cuadrados
>
> Presentar entradas, salidas y predicción:
>
> [
> \hat Y=XW
> ]
>
> Y el problema de optimización:
>
> [
> \hat W=\arg\min_W|Y-XW|_F^2
> ]
>
> Conservar la derivación de las ecuaciones normales y las condiciones de existencia de la solución mediante inversa.
>
> Modelos regularizados
>
> Expresar las penalizaciones L1 y L2 sobre los parámetros:
>
> [
> \hat W=
> \arg\min_W
> \left[
> |Y-XW|F^2+
> \lambda_1|W|{1,\\mathrm{elem}}+
> \lambda_2|W|_F^2
> \right]
> ]
>
> Aclarar que la penalización L1 indicada corresponde a la suma de valores absolutos de los elementos de (W).
>
> Explicar cómo se obtienen las formulaciones particulares según los términos de penalización utilizados.
>
> Modelos estadísticos de series temporales
>
> Para ARIMA y SARIMA, incluir:
>
> Entrada: información histórica disponible.
>
> Salida: predicción futura en horizonte (\\tau).
>
> Ecuación del modelo.
>
> Supuestos sobre las innovaciones.
>
> Criterio de estimación de parámetros.
>
> Formulación de forecasting.
>
> Conservar sus operadores de rezago y diferenciación. No transformar artificialmente estos modelos en regresiones lineales independientes si eso elimina su estructura temporal.
>
> Modelos probabilísticos
>
> Para máxima verosimilitud, MAP y Gaussian Processes, preservar:
>
> Verosimilitud.
>
> Distribuciones de probabilidad.
>
> Priors cuando correspondan.
>
> Distribuciones predictivas.
>
> Funciones objetivo utilizadas para estimar parámetros o hiperparámetros.
>
> Distinguir entre predicción puntual y distribución predictiva.
>
> Redes neuronales
>
> Representar los parámetros mediante:
>
> [
> \\theta=
> {W^{(1)},b^{(1)},W^{(2)},b^{(2)},\\ldots}
> ]
>
> Presentar las entradas, salidas, función de predicción y función de pérdida.
>
> Para RNN, LSTM y GRU, conservar las ecuaciones recurrentes y las actualizaciones de estados y compuertas. Explicar cómo se transforma una ventana temporal en una predicción de horizonte (\\tau).
>
> Modelos informados por física (PIML / PINN)
>
> Expresar la función objetivo mediante una pérdida asociada a observaciones y una penalización física:
>
> [
> \\boxed{
> \\hat\\theta=
> \\arg\\min_\\theta
> \\left[
> \\mathbb E_{\\mathrm{datos}}
> {\\mathcal L(\\mathbf y,f_\\theta(\\mathbf x))}
> +
> \\lambda_{\\mathrm{phys}}
> \\mathbb E_{\\mathrm{phys}}
> {|r_\\theta(\\mathbf z)|_2^2}
> \\right]
> }
> ]
>
> Donde (r_\\theta) es el residuo de la ecuación física evaluado en puntos (\\mathbf z).
>
> Destacar explícitamente esta comparación:
>
> Regularización convencional: penaliza parámetros del modelo.
>
> Regularización informada por física: penaliza el incumplimiento de las ecuaciones físicas mediante un residuo.
>
> Señalar que ambas comparten una estructura de optimización semejante, aunque penalizan objetos matemáticos distintos.
>
> 5. Uso del operador nabla y de derivadas
>
> Incorporar el operador diferencial (\\nabla) cuando sea matemáticamente apropiado.
>
> Distinguir:
>
> [
> \\nabla_\\theta\\mathcal L
> ]
>
> Gradiente de la pérdida respecto a los parámetros, utilizado en optimización.
>
> [
> \\nabla_{\\mathbf x}f_\\theta
> ]
>
> Gradiente de la función respecto a las entradas.
>
> Y las derivadas temporales:
>
> [
> \\frac{\\partial f_\\theta}{\\partial t},
> \\qquad
> \\frac{\\partial^2 f_\\theta}{\\partial t^2}
> ]
>
> No sustituir indiscriminadamente derivadas temporales por (\\nabla), ya que representan operaciones distintas.
>
> Aplicación al sistema masa–resorte–amortiguador
>
> Utilizar el ejemplo físico existente en la presentación:
>
> [
> m\\ddot q(t)+c\\dot q(t)+kq(t)=0
> ]
>
> Representar la posición estimada mediante:
>
> [
> \\hat q(t)=f_\\theta(t)
> ]
>
> Definir el residuo físico:
>
> [
> m\\frac{d^2f_\\theta(t)}{dt^2}
> +
> c\\frac{df_\\theta(t)}{dt}
> +
> kf_\\theta(t)
> ]
>
> Y la penalización correspondiente:
>
> [
> \\mathbb E_{t\\sim p_{\\mathrm{phys}}}
> [r_\\theta(t)^2]
> ]
>
> Explicar claramente que las derivadas corresponden a la salida de la red neuronal respecto al tiempo y que el objetivo es reducir el residuo de la ecuación diferencial.
>
> Cuando corresponda, conservar las condiciones iniciales y de frontera mediante pérdidas o restricciones apropiadas.
>
> 6. Requisitos de rigor matemático
>
> Revisar y corregir:
>
> Dimensiones de vectores y matrices.
>
> Uso correcto de transpuestas.
>
> Diferencia entre parámetros (\\theta) y estimadores (\\hat{\\theta}).
>
> Diferencia entre errores aleatorios y residuos.
>
> Uso correcto de las normas L1, L2 y Frobenius.
>
> Diferencia entre (\\min) y (\\arg\\min).
>
> Diferencia entre esperanza poblacional y promedio muestral.
>
> Distinción entre gradientes respecto a parámetros, entradas y tiempo.
>
> Condiciones bajo las cuales existen soluciones analíticas.
>
> Consistencia entre formulaciones probabilísticas, funciones de pérdida y problemas de optimización.
>
> Si alguna ecuación de la presentación original es incorrecta o requiere supuestos adicionales, corregirla y documentar brevemente la razón.
>
> 7. Diseño y estructura de la presentación
>
> Mantener el estilo visual original de la presentación: tipografía, colores, estructura académica, diagramas y organización temática.
>
> Para cada modelo, organizar preferentemente el contenido en cinco bloques claramente identificados:
>
> Entrada
>
> Salida
>
> Modelo
>
> Función de pérdida
>
> Problema de optimización
>
> Añadir un sexto bloque solamente cuando sea necesario para explicar desarrollos matemáticos relevantes, como ecuaciones normales, derivadas, compuertas recurrentes, kernels o residuos físicos.
>
> Evitar diapositivas saturadas. Si una formulación necesita más espacio, dividirla en diapositivas consecutivas.
>
> No eliminar desarrollos matemáticos esenciales ni reducirlos a definiciones generales.
>
> Mantener las referencias bibliográficas originales y agregar referencias solo cuando se introduzca información nueva verificable.
>
> `/home/jropero/Downloads/WhatsApp Image 2026-10-15 at 12.16.06 PM.jpeg`
>
> esta imagen fue un ejemplo de notacion que me sugirio el tutor del cual se formulo el prompt.

### S2 — Entregable y no regresión
Crear un PDF nuevo con nombre distinto a los PDF existentes, sin sobrescribirlos. La fuente de verdad es la presentación vigente (`src/data/deckContent.js`) y se conserva el estilo visual y el orden temático original. Corregir afirmaciones/ecuaciones sólo con sustento matemático y conservar referencias existentes.

## Tasks
- T1 [S1,S2] Auditoría read-only — done; mapa delegado con evidencia de rutas/líneas.
- T2 [S1,S2] Implementar unificación y objetivos — done; discrepancias visuales corregidas y revisadas independientemente en `src/data/deckContent.js`; sin commit.
- T3 [S1,S2] Verificación de render, exportación del PDF nuevo y comprobación final — done; PDF de 52 páginas comprobado, capturas temporales retiradas.
- T4 [S3] Reestructurar `d3-reg-ols` con costo poblacional/empírico y ambos óptimos — done; cinco bloques, compactación CSS con alcance a la diapositiva, render medido sin recortes.
- T5 [S3] Reestructurar `d3-reg-mle` en cuatro bloques con riesgo logarítmico esperado/empírico — done; render medido, PDF re-exportado.
- T6 [S4] Reestructurar `d3-reg-map` en cinco bloques con riesgo esperado/empírico, escalamiento 1/N del prior y conexión Ridge/Lasso — done; render medido, PDF re-exportado.
- T7 [S5] Reestructurar `d3-reg-ridge` y `d3-reg-lasso` en cinco bloques con riesgo esperado, aproximación empírica, optimización y solución (analítica para Ridge, numérica para Lasso) — done; render medido, PDF re-exportado.
- T8 [S6] Simplificar los bloques de solución de Ridge y Lasso y corregir la afirmación sobre lambda_1 — done; sin SVD, sin KKT ni umbral suave; render medido, PDF re-exportado.
- T9 [S7] Reestructurar `d3-reg-elastic` en cinco bloques con riesgo esperado L1+L2, aproximación empírica, optimización y solución numérica — done; sin KKT ni umbral suave; render medido, PDF re-exportado.
- T10 [S8] Añadir la página base de la RNN y llevar el riesgo esperado, el promedio empírico y la optimización a LSTM y GRU, actualizando la página de comparación — done; render medido, PDF re-exportado.
- T11 [S9] Añadir la página de ARIMA y reorganizar SARIMA en cinco bloques con riesgo esperado, promedio sobre N_eff y optimización — done; orden ARIMA → SARIMA, render medido, PDF re-exportado.
- T12 [S10] Añadir las dos páginas de GPR (modelo y optimización; predicción e incertidumbre con figura) y registrar GP/GPR en el diagrama 3 — done; render medido, PDF re-exportado.
- T13 [S11] Fijar la convención nabla temporal en la página del sistema ejemplar y reorganizar la puerta ① en cuatro bloques con costo esperado, empírico y ambos óptimos — done; render medido.
- T14 [S12] Invertir el orden de la puerta ② (derivación antes de arquitectura) y reescribir ambas páginas con la convención nabla, J_s y los cinco bloques de la HNN — done; render medido.

## Log
- L1 — Solicitud original: «quiero generar un nuevo pdf, con la presentacion pero haciendo unos cambios, mira el siguiente prompt:»; la solicitud completa está transcrita en S1, seguida de «esta imagen fue un ejemplo de notacion que me sugirio el tutor del cual se formulo el prompt.»
- L2 — Auditoría read-only de `src/data/deckContent.js` completada: discrepancias centrales son `h` como horizonte y `τ` como ventana, formulaciones tabulares escalares en regresión, falta de estructura común en varios modelos y pérdida física RC no expresada como esperanza residual. Se mapearon modelos lineales, regularizados, SARIMA, MLE, árboles/ensambles, RNN/LSTM/GRU, TCN/atención/SSM, GP y PIML energético. Evidencia: informe del explorador delegado, con líneas citadas.
- L3 — Implementación T2: convención X/Y/τ y ventana L; marco riesgo esperado/empírico, gradientes y PIML; OLS multisalida, MLE/MAP, regularización, SARIMA, GP, secuencias, objetivos F1–F6 y física. Se añadieron diapositivas de desarrollo donde hacía falta. Build/lint/diff-check pasan; build advierte chunk >500 kB.
- L4 — La revisión independiente halló el factor de umbral ElasticNet y una dimensión recurrente Q sin declarar. T2 se reabrió; ambas correcciones fueron aplicadas.
- L5 — Re-verificación independiente confirmó ElasticNet consistente con RSS sin 1/2, salida recurrente τ×Q, pesos (τQ)×H y pérdida Frobenius; build/lint/diff-check pasan. No se creó commit.
- L6 — La primera exportación terminó con código 1: PNG en `dist/captures-unificacion-2026-10` desaparecieron cuando Vite limpió `dist` durante un build concurrente; ENOENT al ensamblar. No se produjo PDF verificable.
- L7 — Exportación final completada correctamente: 52 PNGs y `presentacion_piml_unificada_2026-10.pdf` (52 páginas, 1280×720 pt, 14,933,150 bytes).
- L8 — Inspección visual de las diapositivas 2, 3, 21, 25, 27, 30, 38 y 44 detectó dos correcciones necesarias: fila «Símbolos locales» aún describía E2 con d y confundía X de diseño/ventana pese al nuevo X/Y/P; KKT de ElasticNet mostraba texto literal `extsi` por escape de LaTeX incorrecto.
- L9 — T2 cerrada tras corregir la fila a W∈R^{P×τ}, X∈R^{N×P}, X_n^{win}∈R^{L×P}, reemplazar la KKT de ElasticNet con `\\text` correctamente escapado y alinear explicación/umbral. Verificador independiente confirmó ambos puntos; `npm run build`, `npm run lint`, `git diff --check` pasan, con advertencia no bloqueante de chunk >500 kB.
- L10 — T3 en progreso: recompilar y reexportar el PDF corregido, inspeccionar capturas actualizadas y verificar `pdfinfo`; el PDF previo no es final.
- L11 — Reexportación job-3 completada con código 0 y 52 capturas; destino `presentacion_piml_unificada_2026-10.pdf`.
- L12 — Verificación final: `pdfinfo` confirma 52 páginas de 1280×720 pt, 14,937,425 bytes; se contaron 52 capturas. Revisadas visualmente las diapositivas 2 (notación E2 X/W/ventana) y 30 (KKT ElasticNet, sin texto literal); ambas renderizan completas. Se inspeccionaron además slides 3, 21, 25, 27, 38 y 44 de la captura anterior cuyas fuentes no cambiaron. PNG temporales retirados. Build/lint/diff-check pasan; Vite advierte chunk >500 kB. ASSESS nativo falla por binario local ausente (unassessable); verificador independiente pasó los hallazgos, no hubo revisión nativa. PDF final entregado, sin commit.
### S3 — Correcciones del tutor sobre E2 (mínimos cuadrados y MLE)

Verbatim de la ronda de mínimos cuadrados:

> Ajusta la diapositiva E2 – Regresión lineal por mínimos cuadrados, conservando su estructura y notación actual. En el bloque 3, cambia el título a "Función de costo: riesgo esperado y empírico" y agrega primero la formulación general mediante esperanza matemática: J(W) = E[||y − Wᵀx||²₂]. Después conserva la aproximación empírica con muestras i.i.d. En el bloque 4, agrega el problema de optimización poblacional W* ∈ arg min J(W) y conserva el empírico Ŵ ∈ arg min Ĵₙ(W). Mantén sin cambios los bloques de entrada, salida, modelo y solución analítica. Corrige la afirmación de que mínimos cuadrados "se rompe" con colinealidad o P > N, aclarando que pueden existir soluciones no únicas.

Verbatim de la ronda de MLE:

> Ajusta la diapositiva E2 – Máxima verosimilitud (MLE) siguiendo las indicaciones del punto 3. Conserva la notación unificada utilizada en mínimos cuadrados y organiza la diapositiva en cuatro bloques: modelo probabilístico, función de verosimilitud, problema de optimización y relación con mínimos cuadrados. Incluye también la formulación general mediante esperanza matemática del riesgo logarítmico negativo y su aproximación empírica bajo muestras i.i.d. No repitas innecesariamente las entradas, salidas ni el modelo lineal ya definidos en la diapositiva anterior. Enfatiza que MLE es un criterio de estimación, no un nuevo modelo, y demuestra su equivalencia con mínimos cuadrados bajo errores gaussianos independientes y homocedásticos. Mantén las ecuaciones matemáticamente rigurosas, la diapositiva compacta, legible y visualmente consistente con la anterior. No modifiques las demás diapositivas.

- L13 — Ronda de correcciones del tutor sobre E2: la diapositiva de mínimos cuadrados se reestructuró en cinco bloques con costo poblacional J(W) y empírico Ĵ_N(W), ambos óptimos (W* y Ŵ) y la viñeta de límites reformulada como soluciones no únicas bajo colinealidad o P > N.
- L14 — El primer render de la página 25 recortaba la quinta caja y las notas; se añadió a src/deck/deck.css una compactación con alcance por id de diapositiva (patrón ya usado por d1-puerta2) y se verificó midiendo las cajas contra el rectángulo de la diapositiva en 1920x1080.
- L15 — La diapositiva de MLE se reescribió como cuatro bloques: modelo probabilístico, verosimilitud, optimización con riesgo logarítmico negativo esperado y empírico, y relación con mínimos cuadrados; el título pasó a «E2 — Máxima verosimilitud (MLE)» y se actualizó la tabla de conexión en docs/modelos-regresores-paso-a-paso.md.
- L16 — Verificación de renders: página 25 con notas en 914 px y página 26 con notas en 990 px, ambas dentro del área de 1028 px; sin recortes. Build, lint y git diff --check pasan.

### S4 — Correcciones del tutor sobre E2 · MAP

Verbatim:

> Ajusta la diapositiva E2 – Máximo a posteriori (MAP) siguiendo la formulación matemática que te comparto. Mantén la notación unificada utilizada en mínimos cuadrados y máxima verosimilitud. Organiza la diapositiva en cinco bloques: modelo probabilístico y prior, teorema de Bayes, función de costo mediante esperanza y aproximación empírica, problema de optimización MAP y conexión con Ridge y Lasso. No repitas innecesariamente el modelo lineal ni las entradas y salidas ya definidas. Destaca que MAP es un criterio de estimación que incorpora información previa sobre los parámetros. Asegúrate de conservar el escalamiento correcto del término prior al dividir la función de costo entre N. Incluye la relación entre prior gaussiano y regularización L2, y entre prior Laplace y regularización L1, sin desarrollar todavía Ridge y Lasso. Mantén la diapositiva compacta, rigurosa, legible y visualmente consistente con las anteriores. Modifica únicamente la diapositiva MAP.
- L17 — Ronda MAP: la diapositiva se reescribió en cinco bloques (modelo y prior, Bayes, costo esperado y empírico, optimización y conexión Ridge/Lasso) conservando la notación E2; el escalamiento del prior al promediar por N se declara como lambda R(W) = (1/N)[-log p(W)] y sigma_0^2 queda distinguida de sigma^2.
- L18 — El primer render de la página 27 excedía el área de la diapositiva: se fusionó el modelo con el prior en una sola línea, se movió la relación de escala a la conexión del bloque 3, se unificaron las dos referencias en una entrada y se añadió d3-reg-map al alcance de la compactación por id.
- L19 — Defecto detectado y corregido: la inserción automática del id d3-reg-map rompió los selectores intermedios de la regla compartida (quedaron sin sufijo .eq-box/.math-stack) y un reemplazo de texto aplicó gap 3px a .rail-dots; se restauraron los selectores completos y el valor original del rail. Verificado: contenido de las páginas 25, 26 y 27 termina en 904, 982 y 988 px, dentro del área de 1028 px.

### S5 — Correcciones del tutor sobre E2 · Ridge (L2) y Lasso (L1)

Verbatim:

> Ajusta las diapositivas E2 – Ridge (L2) y Lasso (L1) siguiendo la formulación matemática que te comparto. Mantén la notación unificada utilizada en OLS, MLE y MAP, conservando la formulación mediante esperanza matemática y su aproximación empírica bajo muestras i.i.d. Organiza cada diapositiva en cinco bloques: 1. Modelo lineal (sin cambios respecto a OLS). 2. Función de costo: riesgo esperado con regularización L2 para Ridge y L1 para Lasso. 3. Aproximación empírica mediante media muestral y notación matricial. 4. Problema de optimización. 5. Solución: fórmula analítica exacta para Ridge y métodos numéricos para Lasso. Destaca que Ridge penaliza la magnitud de los coeficientes, mientras que Lasso puede llevar algunos exactamente a cero, favoreciendo la selección de variables. Incluye brevemente la conexión con MAP: prior gaussiano para Ridge y prior Laplace para Lasso. No repitas innecesariamente las entradas, salidas ni los desarrollos de OLS. Mantén las ecuaciones rigurosas, utiliza λ de manera consistente y aclara que habitualmente no se penaliza el intercepto. Conserva el diseño visual de las diapositivas anteriores, evitando saturarlas de texto. Modifica únicamente las diapositivas de Ridge y Lasso.

Observación de alcance: la captura de Ridge (`Screenshot_20261018_183156.png`) no quedó disponible en el directorio temporal; sólo se recibió la de Lasso. La estructura de Ridge se derivó del enunciado textual y de la convención de la captura de Lasso.
- L20 — Ronda Ridge/Lasso: ambas páginas se reorganizaron en cinco bloques con riesgo esperado regularizado y media muestral; Ridge conserva el factor N del costo promediado en su forma cerrada y su contracción espectral, Lasso conserva las condiciones KKT y el umbral suave con umbral N·lambda_1/2.
- L21 — Verificación de renders: contenido de las páginas 28 y 29 termina en 962 y 991 px, dentro del área de 1028 px. Se acortaron las referencias y notas de Lasso para lograrlo. Build, lint y git diff --check pasan.
- L22 — Segundo defecto del mismo tipo en deck.css: insertar ids nuevos por reemplazo de texto volvió a dejar selectores intermedios sin sufijo; se reparó con un script que propaga el sufijo del último selector de cada regla y se comprobó que no queda ningún selector intermedio sin sufijo.

### S6 — Simplificación de Ridge y Lasso

Verbatim:

> Ajusta únicamente las diapositivas de Ridge (L2) y Lasso (L1), simplificando los desarrollos matemáticos sin perder rigor ni modificar la notación unificada. **Ridge:** En el bloque de solución analítica, conserva las ecuaciones normales regularizadas y la solución cerrada matricial. Elimina la descomposición SVD (X = USVᵀ), la sumatoria sobre k y los factores de contracción. Mantén una explicación breve sobre cómo la regularización mejora la estabilidad de los coeficientes. **Lasso:** En el bloque de solución, elimina las condiciones KKT desarrolladas y la expresión de umbral suave (soft-thresholding). Conserva el problema de optimización con penalización L1 y explica brevemente que no existe una solución matricial cerrada general y que se utilizan métodos numéricos, como descenso por coordenadas o métodos proximales. Corrige también la afirmación de que λ₁ fija cuántos coeficientes sobreviven: λ₁ controla la intensidad de la regularización y favorece soluciones dispersas, pero no determina directamente el número de coeficientes no nulos. En ambas diapositivas conserva los cinco bloques: modelo, función de costo con esperanza matemática, aproximación empírica, problema de optimización y solución. Mantén el diseño visual actual, las ecuaciones matemáticamente consistentes y el contenido compacto. El objetivo es cumplir las recomendaciones del tutor sin introducir conceptos avanzados que todavía no hemos estudiado.
- L23 — Simplificación T8: se retiraron de Ridge la SVD, la sumatoria sobre k y los factores kappa_k, conservando ecuaciones normales regularizadas, solución cerrada matricial y una explicación breve de estabilidad por desplazamiento de autovalores; de Lasso se retiraron las condiciones KKT y el umbral suave, dejando el problema con penalización L1 y la mención de métodos numéricos.
- L24 — Se corrigió la viñeta de Lasso: lambda_1 controla la intensidad de la regularización y favorece soluciones dispersas, sin afirmar que fije el número de coeficientes no nulos. La página mantiene sus cinco bloques y la referencia a SVD en la tabla de símbolos sigue siendo válida porque esa descomposición se usa en la página de DLinear.
- L25 — Verificación: contenido de las páginas 28 y 29 termina en 918 y 894 px, dentro del área de 1028 px; build, lint y git diff --check pasan.

### S7 — Corrección del tutor sobre E2 · Elastic Net

Verbatim:

> Ajusta únicamente la diapositiva E2 – Elastic Net (regularización L1 + L2), siguiendo la formulación matemática que te comparto. Mantén la notación unificada utilizada en OLS, MLE, MAP, Ridge y Lasso. Organiza la diapositiva en cinco bloques: 1. Modelo lineal, igual que OLS. 2. Función de costo: riesgo esperado mediante esperanza matemática, incorporando las penalizaciones L1 y L2. 3. Aproximación empírica mediante media muestral bajo muestras i.i.d., utilizando notación matricial. 4. Problema de optimización expresado mediante arg min. 5. Solución y propiedades: indicar que no existe una solución matricial cerrada general y que se utilizan métodos numéricos, como descenso por coordenadas. Utiliza λ₁ para la penalización L1 y λ₂ para L2, manteniendo la consistencia con las diapositivas anteriores. Destaca que Elastic Net combina la selección de variables de Lasso con la contracción de coeficientes de Ridge, especialmente cuando existen variables correlacionadas. No repitas innecesariamente las entradas, salidas ni desarrollos anteriores. No incluyas SVD, condiciones KKT ni demostraciones extensas. Conserva el estilo visual actual, las ecuaciones rigurosas y el contenido compacto. Modifica únicamente la diapositiva de Elastic Net.
- L26 — Ronda Elastic Net: la diapositiva se reorganizó en cinco bloques con el riesgo esperado y su media muestral, usando lambda_1 y lambda_2 como pesos independientes; se eliminaron las condiciones KKT y el umbral suave con rho_en, y el bloque de solución declara la convexidad estricta para lambda_2 > 0 y los métodos numéricos.
- L27 — Se destacó en viñetas y en el bloque 5 que Elastic Net combina la selección de variables de Lasso con la contracción de Ridge y reparte el peso entre variables correlacionadas; la nota de protocolo conserva la mezcla rho_en sin reutilizar lambda_reg.
- L28 — Verificación: contenido de la página 30 termina en 955 px, dentro del área de 1028 px. Se corrigió un espacio perdido en el texto matemático ("es estrictamente convexa") detectado al inspeccionar el render. Build, lint y git diff --check pasan; ninguna regla CSS quedó con selectores intermedios sin sufijo.

### S8 — Correcciones del tutor sobre E3 · RNN, LSTM y GRU

Verbatim:

> Ajusta las diapositivas E3 – RNN, LSTM y GRU de la presentación PIML, siguiendo la formulación matemática unificada que hemos utilizado en OLS, MLE, MAP, Ridge, Lasso y Elastic Net. **1. RNN simple:** Agrega una diapositiva base organizada en cinco bloques: entrada y salida de secuencias temporales, modelo recurrente con actualización del estado oculto, función de costo mediante esperanza matemática, aproximación empírica y problema de optimización. **2. LSTM:** Conserva y organiza las ecuaciones de sus tres compuertas (olvido, entrada y salida), el estado de celda y la actualización del estado oculto. Agrega la función de costo con esperanza, su aproximación empírica y el problema de optimización mediante arg min. **3. GRU:** Conserva las ecuaciones de sus dos compuertas (actualización y reinicio), el estado candidato y la actualización del estado oculto. Agrega igualmente el riesgo esperado, la aproximación empírica y el problema de optimización. **Notación unificada:** Entrada Xₙ ∈ ℝ^(T×P); salida yₙ ∈ ℝ^τ; modelo general ŷₙ = fθ(Xₙ); riesgo esperado J(θ) = E[||y − fθ(X)||²₂]; riesgo empírico Ĵₙ(θ) = (1/N) Σ ||yₙ − fθ(Xₙ)||²₂; optimización θ̂ ∈ arg min Ĵₙ(θ). Utiliza θ para representar todos los pesos y sesgos entrenables. Distingue el índice temporal t del índice de muestra n, y mantén las dimensiones matemáticamente consistentes. Destaca que RNN, LSTM y GRU comparten la formulación general del aprendizaje y se diferencian principalmente en la arquitectura interna de fθ. Indica brevemente que se entrenan mediante BPTT y optimizadores basados en gradientes, sin solución analítica cerrada general. Conserva el desarrollo matemático necesario de cada arquitectura, evitando repeticiones y demostraciones extensas. No asumas automáticamente que las ventanas temporales solapadas son i.i.d. Mantén el estilo visual de las diapositivas anteriores. Modifica únicamente las secciones correspondientes a RNN, LSTM y GRU, y actualiza su comparación si existe.

Observación de alcance: de las cuatro capturas enviadas, sólo `Screenshot_20261018_201205.png` (GRU) quedó disponible en el directorio temporal; las tres restantes no estaban presentes. La estructura se derivó del enunciado textual y de esa captura.
- L29 — Ronda E3: se añadió la página "E3 — RNN simple: estado oculto recurrente" con cinco bloques (entrada y salida de secuencias, modelo recurrente, riesgo esperado, promedio empírico y optimización) y se llevaron esos tres últimos bloques a las páginas de LSTM y GRU, que conservan compuertas, candidato y estados.
- L30 — La página de comparación se reescribió para mostrar la formulación compartida y la diferencia de celda interna, con la advertencia de que las ventanas solapadas no son i.i.d. El guion de la charla (GUION.md, Slide 12) se actualizó en su línea de pantalla y con un cierre de familia.
- L31 — Defectos detectados y corregidos durante el trabajo: una sustitución de texto en GUION.md cayó en la primera coincidencia (Slide 7) y se revirtió aplicándola dentro de la sección Slide 12; el script de inserción se ejecutó dos veces y duplicó la página de la RNN, eliminando la copia; en la nota de la página de comparación las barras invertidas quedaron simples, de modo que LaTeX habría perdido todos los símbolos, y se corrigió verificando que ninguna cadena del deck contiene caracteres de control.
- L32 — Verificación: contenido de las páginas 36 a 39 (RNN, LSTM, GRU y comparación) termina en 881, 904, 881 y 805 px, dentro del área de 1028 px; el deck pasa a 53 páginas. Build, lint y git diff --check pasan, sin avisos de escapes y sin ids duplicados.

### S9 — Correcciones del tutor sobre E1 · ARIMA y SARIMA

Verbatim:

> Ajusta la sección E1 – Modelos estadísticos del diagrama 3, agregando una diapositiva para ARIMA y actualizando la diapositiva existente de SARIMA. Mantén la notación matemática unificada utilizada en OLS, MLE, MAP, Ridge, Lasso, Elastic Net y redes neuronales, siguiendo las recomendaciones del tutor. Organiza ambas diapositivas en cinco bloques: 1. Entrada y salida: definir la serie temporal, sus observaciones pasadas y la predicción. 2. Modelo matemático: ARIMA(p,d,q) con operadores de rezago, autorregresión, diferenciación y media móvil. Para SARIMA(p,d,q)(P,D,Q)ₛ, incorporar los operadores estacionales. 3. Función de costo: formular el riesgo esperado mediante esperanza matemática del error cuadrático de predicción. 4. Aproximación empírica: expresar el costo como promedio de los errores cuadráticos sobre las observaciones disponibles. 5. Problema de optimización: utilizar arg min para definir la estimación de los parámetros. Incluye brevemente la conexión con máxima verosimilitud mediante la esperanza de la log-verosimilitud negativa y su aproximación empírica. Aclara que ARIMA y SARIMA se estiman habitualmente mediante MLE y que las observaciones temporales no deben asumirse i.i.d. automáticamente. Utiliza una notación consistente: B para rezago, s para período estacional, η para los parámetros y N_eff para el número de observaciones efectivas. Destaca que SARIMA extiende ARIMA incorporando componentes estacionales, sin repetir innecesariamente todas las explicaciones. Conserva el diseño visual de la presentación, las ecuaciones rigurosas y el contenido compacto. Modifica únicamente la sección E1 y mantén el orden ARIMA → SARIMA.

Precisión enviada junto a la ronda:

> Precisión: esta formulación utiliza mínimos cuadrados sobre errores de predicción. ARIMA también se estima habitualmente por máxima verosimilitud; con innovaciones gaussianas y varianza fija, ambos criterios están relacionados, pero no son idénticos en todas las formulaciones de verosimilitud.

Observación de alcance: sólo llegó al directorio temporal la tercera captura (`Screenshot_20261018_224455.png`); las dos primeras no estaban presentes. La estructura se derivó del enunciado textual.
- L33 — Ronda E1: se añadió la página "E1 — ARIMA: autorregresivo integrado de medias móviles" antes de SARIMA y se reorganizó SARIMA en los mismos cinco bloques, con el riesgo esperado del error cuadrático de predicción, la relación con la log-verosimilitud negativa esperada y el promedio sobre N_eff observaciones efectivas.
- L34 — Se conservó la notación del deck para el rezago ($\mathcal{B}$, registrada en la tabla de símbolos), el período estacional s, eta para los parámetros y N_eff para las observaciones efectivas; ambas páginas advierten que las observaciones temporales no son i.i.d. y que la estimación habitual es por máxima verosimilitud.
- L35 — Verificación: contenido de las páginas 23 (ARIMA) y 24 (SARIMA) termina en 993 y 992 px, dentro del área de 1001 px; el deck pasa a 54 páginas. Se añadieron referencias a la página de ARIMA y se restauraron las de SARIMA. Build, lint y git diff --check pasan, sin ids duplicados ni selectores CSS intermedios sin sufijo.

### S10 — GPR (Gaussian Process Regression) en la familia E2

Verbatim:

> Agrega el modelo Gaussian Process Regression (GPR) a la presentación PIML, dentro de la familia E2 – Aprendizaje automático clásico del diagrama 3, ubicándolo después de los modelos de regresión regularizada (Ridge, Lasso y Elastic Net) y antes de SVR. Actualiza también el diagrama 3 para incluir GP/GPR. Mantén la notación matemática unificada utilizada en los modelos anteriores y desarrolla el contenido en dos diapositivas: **Diapositiva 1 – Gaussian Process Regression: modelo y optimización**: 1. Entrada y salida: xₙ ∈ ℝᴾ, X ∈ ℝᴺˣᴾ, yₙ ∈ ℝ. 2. Modelo probabilístico: f ~ GP(mθ, kθ), observaciones con ruido gaussiano y matriz de covarianza Kθ. 3. Función de costo: incluir el riesgo predictivo esperado mediante esperanza matemática, diferenciándolo del criterio habitual de entrenamiento. 4. Verosimilitud marginal negativa: desarrollar su expresión matricial, incluyendo el ajuste a los datos, el determinante de la covarianza y el término constante. 5. Problema de optimización: estimación de los hiperparámetros θ mediante arg min de la log-verosimilitud marginal negativa. **Diapositiva 2 – Predicción e incertidumbre**: incluye las ecuaciones de la media predictiva μ* y la varianza predictiva σ*², explicando brevemente qué representa cada una. Incorpora una gráfica ilustrativa con observaciones, media predictiva y banda de incertidumbre. **Consideraciones importantes:** Destaca que GPR define una distribución sobre funciones, no solamente coeficientes como OLS. Utiliza una notación consistente para θ, kernel, covarianza y var[ianza].

Observación de alcance: el mensaje llegó truncado en la última consideración (se completó como «y varianza») y sólo la tercera captura quedó disponible en el directorio temporal; las dos primeras no estaban presentes.
- L36 — Ronda GPR: se añadieron dos páginas en E2 —modelo y optimización (entrada y salida, GP(m_theta,k_theta) con C = K + sigma_n^2 I, riesgo predictivo esperado, verosimilitud marginal negativa con ajuste, determinante y constante, y arg min sobre los hiperparámetros) y predicción e incertidumbre (media y varianza predictivas más una figura SVG con observaciones, media y banda ±2 sigma)—, ubicadas después de Elastic Net y antes de DLinear y SVR.
- L37 — La figura nueva (src/deck/diagrams/GprUncertaintyFigure.jsx) calcula la posterior con las mismas fórmulas de la diapositiva: kernel RBF, C = K + sigma_n^2 I y eliminación gaussiana para k_*^T C^-1 y, y sigma_*^2 = k - k_*^T C^-1 k_*. Se registró como diagrama "gpr" y el nodo E2 del diagrama 3 pasó a listar GP/GPR.
- L38 — Defectos detectados y corregidos: al escribir el contenido en el archivo temporal se mezclaron barras simples con el marcador usado por el empalmador, lo que dejó comandos como mathbb sin barra ("mathbbE") y subíndices con asterisco que el texto enriquecido interpretó como énfasis; se normalizaron todos los comandos y se adoptó ast para los subíndices. El script de empalme acotaba mal el bloque previo y abortó sin escribir, así que se reancló antes de DLinear y se verificó el orden resultante.
- L39 — Verificación: contenido de las páginas 32 (GPR modelo) y 33 (GPR predicción) termina en 923 y 862 px, dentro del área de 1001 px; el diagrama 3 muestra "GP/GPR · SVR · RF · XGBoost · ANFIS" en su nodo E2 sin desbordar. Build, lint y git diff --check pasan; el deck pasa a 56 páginas.
- L40 — Revisión del PDF: la etiqueta vertical del eje y en la figura de GPR se recortaba en el render; se retiró y el eje queda descrito por la leyenda y la etiqueta horizontal «tiempo (t)». Se retiraron también las etiquetas +σ/−σ porque marcaban el borde del área y no una escala real, y la banda y la media se recortan ahora al área de ejes. Reexportado el PDF.

### S11 — Correcciones del tutor sobre Diagrama 1 (sistema ejemplar y Puerta ①)

Verbatim:

> Ajusta únicamente dos diapositivas de la presentación PIML: «El sistema ejemplar: masa-resorte-amortiguador (MR)» y «Puerta 1 — Función de pérdida (PINN)», manteniendo la notación matemática unificada que hemos venido implementando y siguiendo las recomendaciones del tutor. **1. Diapositiva: Sistema masa-resorte-amortiguador**: Conserva los tres bloques actuales y modifica el primero para definir explícitamente el operador nabla temporal: ∇ₜ := d/dt, ∇ₜ² := d²/dt². Define el operador físico F = m∇ₜ² + c∇ₜ + kI. Expresa la ecuación de movimiento como F[q](t) = m∇ₜ²q(t) + c∇ₜq(t) + kq(t) = 0. Aclara que ∇ₜ es una convención para la derivada temporal unidimensional y que I representa el operador identidad. Conserva el bloque Hamiltoniano y el bloque de datos disponibles. Distingue las variables físicas q(t), p(t) de la notación general de aprendizaje y aclara que la entrada de la PINN será únicamente el tiempo t. **2. Diapositiva: Puerta 1 — Función de pérdida (PINN)**: Organiza la diapositiva en cuatro bloques: 1. Entrada, salida y modelo: t ∈ ℝ, y(t) = q(t) ∈ ℝ, ŷ(t) = fθ(t). 2. Residuo físico: rθ(t) = F[fθ](t) = m∇ₜ²fθ(t) + c∇ₜfθ(t) + kfθ(t). 3. Función de costo: incluir el riesgo esperado mediante esperanza matemática y su aproximación empírica, diferenciando el error de datos y la penalización física. Utilizar N_d para las observaciones, N_c para los puntos de colocación y λ_phys como peso de la penalización. 4. Problema de optimización: diferenciar la formulación poblacional θ* ∈ arg min J(θ) y la empírica θ̂ ∈ arg min Ĵ(θ). No repitas las definiciones de nabla ni del operador F en la diapositiva PINN, pues ya estarán establecidas en la página anterior. Incluye una nota breve indicando que el residuo físico se penaliza, pero su cumplimiento exacto no está garantizado, y que las condiciones iniciales deben imponerse cuando correspondan. **Importante:** conserva el diseño visual, los colores, la tipografía y la distribución de bloques de la presentación. Utiliza notación LaTeX correcta, ecuaciones legibles y explicaciones breves. No agregues desarrollos innecesarios ni modifiques otras diapositivas.
- L41 — Ronda Diagrama 1: la página del sistema ejemplar define ahora nabla_t, nabla_t^2 y el operador F = m nabla_t^2 + c nabla_t + k I, escribe la ley como F[q](t)=0, usa p(t)=m nabla_t q(t) en el bloque hamiltoniano y aclara que q(t), p(t) son variables físicas y que la entrada de la PINN es sólo t.
- L42 — La puerta ① quedó en cuatro bloques: entrada/salida/modelo, residuo r_theta = F[f_theta] con diferenciación automática, costo con riesgo esperado y aproximación empírica (N_d observaciones, N_c puntos de colocación, lambda_phys) y los dos problemas de optimización, theta* poblacional y theta sombrero empírico. Se añadió el lema con la advertencia de que el residuo se penaliza sin garantía de cumplimiento exacto y la mención a las condiciones iniciales. Las definiciones de nabla y F no se repiten.
- L43 — Verificación: contenido de las páginas 5 y 6 termina en 857 y 906 px, dentro del área de 1001 px; se añadió la compactación con alcance a la puerta ① para que las tres referencias no quedaran cortadas. Build, lint y git diff --check pasan. Cambios commiteados sin push.

### S12 — Correcciones del tutor sobre la Puerta ② (orden y notación)

Verbatim:

> Ajusta las diapositivas 8 y 9 de la presentación PIML, correspondientes a la Puerta 2 – Hamiltonian Neural Network (HNN), siguiendo la notación matemática unificada y las recomendaciones del tutor. **IMPORTANTE: Invierte el orden actual de las diapositivas.** Primero debe aparecer la fundamentación física del Hamiltoniano y después la arquitectura de aprendizaje HNN. **DIAPOSITIVA 8 – Del Hamiltoniano a la dinámica del masa-resorte**: Conserva los cuatro bloques matemáticos actuales: 1. Construcción del Hamiltoniano a partir de las energías cinética y potencial. 2. Ecuaciones de Hamilton. 3. Recuperación de la ecuación diferencial del sistema masa-resorte. 4. Conservación de energía mediante la estructura Hamiltoniana. Incorpora la notación ∇ₜ para derivadas temporales, previamente definida en la diapositiva del sistema físico. Utiliza ∇_z H para el gradiente respecto al estado canónico z = (q,p)ᵀ y conserva la matriz simpléctica J_s. Expresa la dinámica mediante ∇ₜz = J_s ∇_z H. Y recupera la ecuación física: m∇ₜ²q + kq = 0. Mantén explícito que corresponde al sistema conservativo (c = 0), sin amortiguamiento ni fuerza externa. Esta diapositiva es una derivación física, por lo que no necesita función de costo ni optimización. **DIAPOSITIVA 9 – Arquitectura Hamiltonian Neural Network (HNN)**: Organiza el contenido en cinco bloques: 1. Entrada, salida y modelo: estado canónico z = (q,p)ᵀ, salida escalar Ĥθ(z) = fθ(z). 2. Estructura Hamiltoniana: dinámica predicha mediante v̂θ = J_s ∇_z Ĥθ(z), incluyendo las ecuaciones de Hamilton. 3. Función de costo: riesgo esperado mediante esperanza matemática del error cuadrático entre las derivadas temporales observadas y las predichas. 4. Aproximación empírica: promedio de los errores cuadráticos sobre las N observaciones. 5. Problema de optimización: diferenciar la formulación poblacional θ* ∈ arg min J_HNN(θ) y el entrenamiento empírico θ̂ ∈ arg min Ĵ_HNN,N(θ). Destaca que la HNN no aprende directamente la trayectoria ni requiere necesariamente etiquetas de energía. Aprende una función Hamiltoniana escalar cuyas derivadas determinan la dinámica. Aclara que la estructura Hamiltoniana se cumple por construcción, pero la reproducción exacta de la dinámica real depende del entrenamiento y los datos. **ORGANIZACIÓN GENERAL**: Mantén la notación consistente con la diapositiva del masa-resorte y la PINN. No vuelvas a definir el operador ∇ₜ. Utiliza θ para los parámetros entrenables y distingue claramente H físico de Ĥθ aprendido. Conserva el diseño visual, tipografía, colores y estilo de los bloques. Actualiza la numeración, los títulos, las referencias internas, los enlaces de navegación y las frases de transición para reflejar el nuevo orden. No dupliques contenido ni modifiques las demás diapositivas. El objetivo es que la secuencia sea: sistema físico → PINN → fundamentación Hamiltoniana → arquitectura HNN.

Observación de alcance: de las cuatro capturas enviadas sólo llegó `Screenshot_20261020_095823.png` (pasos 3 y 4); el enunciado textual cubría el resto.
- L44 — Ronda Puerta ②: se invirtió el orden (página 8 derivación física, página 9 arquitectura HNN). La derivación usa nabla_t, nabla_z H y J_s, escribe la dinámica como nabla_t z = J_s nabla_z H, recupera m nabla_t^2 q + k q = 0 y declara explícitamente el caso conservativo (c = 0); no tiene costo ni optimización.
- L45 — La arquitectura quedó en cinco bloques: estado canónico z = (q,p) con salida escalar H sombrero, estructura hamiltoniana con la dinámica predicha, riesgo esperado sobre las derivadas observadas, promedio empírico y los dos problemas de optimización. Se distingue H físico de H sombrero aprendido y se mantiene que la física se cumple por construcción.
- L46 — Defecto detectado y corregido: las matrices bmatrix de la derivación se aplanaban porque el contenido del archivo temporal llevaba un único separador de fila; tras normalizar el marcador a cuatro barras el render apila las matrices. Se restauró el archivo desde el commit y se re-empalmó para descartar un intento previo que había duplicado barras en comandos de espaciado.
- L47 — Verificación: contenido de las páginas 8 y 9 termina en 968 y 995 px, dentro del área de 1001 px; el guion de la charla (Slide 5) recoge el nuevo orden y la nota de convención. Build, lint y git diff --check pasan.
