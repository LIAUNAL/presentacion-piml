# Resumen de cambios — notación matemática PIML

La presentación final conserva sus 61 diapositivas y el estilo visual original. La revisión separa derivadas temporales, gradientes de estado/parámetros, jacobianos y Hessianas; no convierte toda derivada en un operador nabla.

**Archivo final:** esta revisión quedó como **entregable opcional de 61 páginas** en [`../../presentacion_piml_nabla_revisada_2026-11-final.pdf`](../../presentacion_piml_nabla_revisada_2026-11-final.pdf); el entregable vigente es [`../../presentacion_piml_2026-11.pdf`](../../presentacion_piml_2026-11.pdf) (69 páginas, añade §3).  
**Capturas:** [`captures-final/`](captures-final/) · 61 PNG. El PDF preexistente `presentacion_piml_unificada_2026-10-16.pdf` se conserva en `archivo/`.

## Cambios por diapositiva

| Diap. | Antes → después | Justificación y notación conservada |
|---:|---|---|
| 2 | Tabla general: parámetros `\theta` y pesos; sin definiciones dimensionales globales → `\boldsymbol{\theta}`, `\boldsymbol{\phi}`, `\boldsymbol{\psi}=[\boldsymbol{\theta};\boldsymbol{\phi}]`, gradiente columna, jacobiano `m×n`, Hessiana `\mathbf H_f` y laplaciano `\Delta f`. | Declara las dimensiones/roles y distingue `\boldsymbol{\psi}` (parámetros conjuntos) de la feature local `\psi_{fis}`. Conserva la notación temporal continua/discreta por separado. CSS local compacta la tabla para mostrar todas sus filas. |
| 3 | `\nabla_{\theta}\mathcal L`, `\nabla_{\mathbf x}f` y derivadas parciales respecto a `t` en una línea → `\nabla_{\boldsymbol\theta}\mathcal L`, gradiente para salida escalar, jacobiano para salida vectorial y `df/dt`, `d²f/dt²` para tiempo. | Separa objetos matemáticos y aclara que el riesgo empírico aproxima —no es idéntico por definición— al poblacional. Se conserva la distinción entre regularización paramétrica y penalización del residuo físico. CSS local deja visibles las cuatro tarjetas. |
| 5 | Operador temporal definido como `\nabla_t=d/dt`, `\nabla_t²` → operador `\mathcal F=m\,d²/dt²+c\,d/dt+k\mathcal I`; `p=m\,dq/dt`. | `\nabla` queda para derivadas respecto a vectores; el tiempo sigue usando notación ordinaria. Se conserva el caso conservativo `c=0` al construir el Hamiltoniano. |
| 6 | Residuo PINN con `\nabla_t f_\theta` y `\nabla_t²f_\theta` → `r_\theta=m(d²/dt²)f_\theta+c(d/dt)f_\theta+kf_\theta`. | La autodiferenciación calcula derivadas temporales, no gradientes espaciales. Se conserva la pérdida de datos más penalización física del residuo. |
| 7 | Diagrama PINN: rótulos temporales del bloque “Diff. automática” con nabla → `\dot{\hat x}_\theta`, `\ddot{\hat x}_\theta` y residuo `r_\theta(t)`. | Alinea el diagrama con la ecuación del sistema y elimina la colisión visual entre tiempo y gradiente. Se conserva el flujo tiempo → red → residuo → optimización. |
| 8 | Hamilton: `\nabla_t\mathbf z=\mathbb J_s\nabla_{\mathbf z}H` sin dimensiones desarrolladas → `\dot{\mathbf z}=\mathbf J_s\nabla_{\mathbf z}H`; definición antisimétrica `\mathbf J_s=\begin{bmatrix}0&I_d\\-I_d&0\end{bmatrix}`. | Hace explícitos estado, signo, dimensión `2d×2d` y conservación de energía. Se conservan las ecuaciones canónicas escalares `\dot q=\partial_pH`, `\dot p=-\partial_qH`. |
| 9 | HNN: parámetros escalares `\theta`, `\mathbb J_s` y etiquetas temporales `\nabla_t` → parámetros vectoriales `\boldsymbol\theta`, `\mathbf J_s\nabla_{\mathbf z}\hat H_{\boldsymbol\theta}` y velocidades con puntos. | Distingue `\nabla_{\mathbf z}` (estado) del gradiente de la pérdida respecto a parámetros. Se conserva el aprendizaje de un Hamiltoniano escalar y la estructura física por construcción. |
| 10 | Lagrange escalar con `\nabla_t q`, derivadas parciales abreviadas y aceleración sin estructura matricial → `\dot{\mathbf q}`, `\nabla_{\mathbf q}L`, `\nabla_{\dot{\mathbf q}}L`, Hessianas `\mathbf H_{\dot q\dot q}`, `\mathbf H_{\dot q q}` y despeje vectorial de aceleración. | Expone la ecuación de Euler–Lagrange y justifica el orden de factores por dimensión; requiere invertibilidad de `\mathbf H_{\dot q\dot q}` para la aceleración explícita. Se conserva `d/dt` para la derivación temporal. |
| 11 | LNN: coste escalar en aceleración `a` y salida `\hat a_\theta` → error vectorial `\lVert\mathbf a-\hat{\mathbf a}_{\boldsymbol\theta}\rVert_2²`, con la misma fórmula de aceleración por Hessianas. | Generaliza a `\mathbf q\in\mathbb R^d` y aclara dimensiones de las Hessianas. Se conserva el ajuste empírico y la estimación por diferencias finitas cuando sólo se miden posiciones. |
| 12 | Comparativa HNN/LNN: forma matricial abreviada `\mathbb J\nabla H` → forma vectorial `\dot{\mathbf z}=\mathbf J_s\nabla_{\mathbf z}H(\mathbf z)`. | Identifica respecto a qué estado se deriva y evita confundir la matriz simpléctica con un jacobiano. Se conserva la ecuación de Euler–Lagrange y la transformada de Legendre. |
| 13 | Diagrama HNN: gradiente/flujo Hamiltoniano abreviados y parámetro `\theta` → `\nabla_{\mathbf z}H_{\boldsymbol\theta}`, `\mathbf J_s\nabla_{\mathbf z}H_{\boldsymbol\theta}` y parámetros vectoriales. | Mantiene el diagrama consistente con las ecuaciones de las diapositivas 8–9. Se conserva la cadena de predicción mediante un integrador simpléctico. |
| 17 | Problema directo/inverso: parámetros físicos sin vector común explícito → `\boldsymbol\phi=(m,c,k)^\top` y su estimador `\widehat{\boldsymbol\phi}`. | Diferencia parámetros físicos de los parámetros neuronales. Se conserva la formulación del problema directo como evaluación y del inverso como estimación. |
| 19 | PINN para identificación: parámetros sin vectorización sistemática y residuo con `\nabla_t` → parámetros `\boldsymbol{\theta}`, `\boldsymbol{\phi}` y derivadas temporales `d/dt`, `d²/dt²`. | Distingue incógnitas neuronales y físicas; la autodiferenciación entrega derivadas temporales de la salida. Se conserva el residuo masa–resorte–amortiguador. |
| 20 | PINN inversa: `\mathcal L(\boldsymbol{\theta},\boldsymbol{\phi})` y optimización por dos bloques → `\boldsymbol{\psi}=[\boldsymbol{\theta};\boldsymbol{\phi}]`, `\widehat{\boldsymbol{\psi}}\in\arg\min_{\boldsymbol{\psi}}\mathcal L(\boldsymbol{\psi})`, con gradiente por bloques. | Añade dimensiones `n_\theta`, `n_\phi` y del vector conjunto; la pérdida de datos, física, condiciones iniciales y prior se conserva. Precisa que el gradiente nulo es condición necesaria de estacionariedad, no garantía de mínimo global no convexo. |
| 21 | Identificabilidad en vibración libre con `\nabla_t²x` y `\nabla_t x` → `d²x/dt²+(c/m)dx/dt+(k/m)x=0`. | Usa derivadas temporales convencionales y conserva la conclusión: con desplazamientos solamente se identifican los cocientes `c/m` y `k/m`, no la escala absoluta de masa. |
| 35 | Lasso: formulación convexa y métodos numéricos, sin condición explícita de optimalidad → `-(2/N)X^\top(Y-XW)+\lambda_1S=0`, `S\in\partial\lVert W\rVert_1`; para coeficiente cero, `S_{pk}\in[-1,1]`. | El término `L1` no es diferenciable en cero; la condición de subgradiente sustituye al gradiente ordinario y es necesaria/suficiente para el objetivo convexo mostrado. Se conserva que no hay forma cerrada general y se enumeran los métodos numéricos. |
| 60 | Índice de resumen: `\mathbb J\nabla H_\theta` → `\mathbf J_s\nabla_{\mathbf z}H_{\boldsymbol\theta}`. | Evita propagar la forma abreviada y mantiene el índice consistente con el desarrollo HNN. Se conserva `\psi_{fis}` como feature física, distinta del vector conjunto `\boldsymbol\psi` definido en la tabla. |

## Convenciones mantenidas

- Las derivadas temporales se escriben con puntos o `d/dt`; no se representan como `\nabla_t`.
- `\nabla_x f` se reserva para gradiente columna de una salida escalar; una salida vectorial usa jacobiano.
- La Hessiana `\mathbf H_f` no se confunde con el laplaciano `\Delta f`; `\mathbf J_s` nombra sólo la matriz simpléctica.
- Se preservan formulaciones físicas, probabilísticas y empíricas cuando son conceptos distintos; no se afirma que el gradiente nulo garantice un mínimo global.

## Verificación

- `npm run build` — correcto; Vite advierte que el chunk JavaScript minificado supera 500 kB.
- `npm run lint` — correcto.
- Capturas finales de las diapositivas modificadas revisadas a tamaño completo; ecuaciones renderizadas y contenido visible, incluidos los ajustes de composición de slides 2 y 3.
- PDF final validado con 61 páginas; 61 PNG disponibles en `captures-final/`.
- No hay script de pruebas en `package.json`; la validación funcional pertinente fue build, lint, revisión matemática y capturas renderizadas.
- `gentle_review assess` no pudo ejecutar la evaluación nativa: falta el binario local del paquete; no se inició un lineage nativo.
