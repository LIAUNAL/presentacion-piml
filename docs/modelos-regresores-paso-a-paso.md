# Modelos de regresión, paso a paso

**De dónde sale cada fórmula: de mínimos cuadrados a XGBoost**

Este documento acompaña al bloque **E2 — ML clásico** de la presentación *Revisión de modelos informados
por física (PIML) para series de tiempo y sistemas energéticos*. Explica, en orden de complejidad
creciente, la matemática de los modelos de regresión que aparecen en el deck, con las derivaciones
completas y un **mismo ejemplo numérico** recorriendo todos los modelos.

---

## 0. Cómo leer este documento

### 0.1 Para quién es

Para alguien que ya sabe qué es una derivada y una suma, pero que nunca ha derivado las ecuaciones
normales de mínimos cuadrados. No se supone conocimiento previo de estadística ni de aprendizaje
automático: cada concepto se introduce cuando se necesita.

### 0.2 Mapa por niveles

| Nivel | Modelos | Idea que introduce | De qué depende el siguiente |
| --- | --- | --- | --- |
| 0 | Naive, seasonal-naive | Predicción sin aprendizaje, cota inferior | Da el *skill score* contra el que se mide todo |
| 1 | OLS, MLE | Ajuste por error cuadrático y su justificación probabilística | Da el esqueleto «ajuste + castigo» |
| 2 | Ridge, Lasso, ElasticNet, DLinear | Regularización: qué pasa cuando el problema está mal planteado | Da la familia lineal completa del benchmark |
| 3 | SVR | Pérdida insensible y kernels: lineal en los parámetros, no en los datos | Muestra que el truco del kernel no exige redes |
| 4 | CART, Random Forest, XGBoost | Particiones, bagging y boosting: sin supuesto de linealidad | Cierra el abanico con los modelos de árboles del protocolo |

Cada sección sigue el mismo orden interno: **idea → estructura → función de costo → qué minimiza →
problema de optimización → derivación → cómo se resuelve en la práctica → ejemplo → errores comunes**.

### 0.3 Convenciones de notación

Son las mismas del deck y del documento de tesis; si vienes de otro texto, esta tabla es la traducción.

| Símbolo | Significado | Nota |
| --- | --- | --- |
| $t$ | índice temporal | $y[t]$ discreto, $x(t)$ continuo |
| $y[t]$ | valor observado de la serie en $t$ | corchetes: tiempo discreto |
| $\mathbf{x}_i$ | vector de entrada de la muestra $i$ | $i$ numera **muestras**, no tiempo |
| $\mathbf{D} \in \mathbb{R}^{N \times d}$ | matriz de diseño | **no** es la ventana $\mathbf{X}$ |
| $\mathbf{X} \in \mathbb{R}^{\tau \times d}$ | ventana histórica de entrada | $\tau$ = longitud de ventana |
| $\theta \in \mathbb{R}^{d}$ | parámetros del modelo | símbolo único; $\Theta$ es el conjunto |
| $N$ | número de muestras de entrenamiento | $i = 1, \dots, N$ |
| $d$ | número de variables de entrada | $j = 1, \dots, d$ |
| $h$ | horizonte de predicción | $\hat{\mathbf{y}} \in \mathbb{R}^{h}$ |
| $\lambda_{reg}$ | fuerza de regularización | $\lambda_{phys}$, $\lambda_{svr}$, $\lambda_{rk}$ son otras |
| $\varepsilon_i$ | ruido de la muestra $i$ | distinto de $\varepsilon[t]$ (innovación) y $\varepsilon_{svr}$ (tubo) |

### 0.4 Nota sobre las cuentas del ejemplo

El ejemplo transversal es diminuto a propósito: **$N = 5$ muestras y $d = 2$ variables**, de modo que
todo se puede verificar a mano con una calculadora. Las cifras que aparecen se repiten entre secciones
para que se vea **cómo cambia la solución al cambiar el criterio**, no para mostrar desempeño: con
cinco datos ningún modelo es mejor que otro en un sentido práctico.

---

## 1. Fundamentos: la tarea y el vocabulario

### 1.1 De la serie de tiempo a un problema supervisado

Una serie de tiempo no es, por sí sola, un problema de regresión: hay que construir pares
entrada–salida. La construcción estándar es la **ventana deslizante**.

Sea la serie observada $y[1], y[2], \dots, y[T]$. Con una ventana de longitud $\tau$ y un horizonte $h$:

$$
\mathbf{x}_t = \bigl(y[t-\tau+1], \dots, y[t]\bigr) \in \mathbb{R}^{\tau},
\qquad
\mathbf{y}_t = \bigl(y[t+1], \dots, y[t+h]\bigr) \in \mathbb{R}^{h}
$$

- $\mathbf{x}_t$ es la **entrada** (lo que se sabe en el instante $t$).
- $\mathbf{y}_t$ es la **salida** (lo que se quiere predecir).
- Al recorrer $t$ se obtienen $N$ pares $(\mathbf{x}_i, \mathbf{y}_i)$, $i = 1, \dots, N$.

**Predicción directa frente a recursiva.** Hay dos maneras de cubrir el horizonte:

1. **Directa:** un solo modelo produce las $h$ componentes de una vez,
   $f_\theta: \mathbb{R}^{\tau} \to \mathbb{R}^{h}$.
2. **Recursiva:** un modelo de un paso se aplica $h$ veces alimentándose de sus propias predicciones.

El protocolo del benchmark usa la vía **directa** (§0 del protocolo): evita que el error de un paso se
propague, a costa de ignorar la dependencia entre componentes del horizonte.

**Forma matricial.** Apilando las $N$ entradas y salidas:

$$
\mathbf{D} \in \mathbb{R}^{N \times d}, \qquad \mathbf{Y} \in \mathbb{R}^{N \times h},
\qquad f_\theta: \mathbf{D} \to \hat{\mathbf{Y}}
$$

con $d$ el número de variables de entrada (en el caso univariado con rezagos, $d = \tau$).

### 1.2 El problema de aprendizaje, en una línea

Todo modelo de esta familia resuelve:

$$
\hat{\theta} = \arg\min_{\theta \in \Theta} \; \mathcal{L}(\theta)
$$

y las diferencias entre modelos son exactamente dos cosas: **qué es $\mathcal{L}$** y **cómo se
resuelve** ese mínimo (forma cerrada, programación convexa o búsqueda greedy). Ese es el hilo conductor
del documento.

### 1.3 ¿Por qué el error cuadrático? La pérdida y su predictor óptimo

Antes de elegir un modelo conviene entender la pérdida. Sea $f(\mathbf{x})$ una predicción cualquiera y
$Y$ la variable a predecir. Se busca la función que minimiza el riesgo esperado
$\mathbb{E}\bigl[\ell(Y, f(\mathbf{x}))\bigr]$.

**Caso $\ell_2$ (error cuadrático).** Derivando respecto a $f$:

$$
\frac{\partial}{\partial f}\,\mathbb{E}\bigl[(Y - f)^2\bigr] = -2\,\mathbb{E}[Y - f] = 0
\;\Longrightarrow\;
f^{*}(\mathbf{x}) = \mathbb{E}[Y \mid \mathbf{X} = \mathbf{x}]
$$

**Caso $\ell_1$ (error absoluto).** Su derivada es el signo del error, y el punto donde se anula es la
mediana:

$$
f^{*}(\mathbf{x}) = \mathrm{mediana}\bigl[Y \mid \mathbf{X} = \mathbf{x}\bigr]
$$

| Pérdida | Predice | Interpretación práctica |
| --- | --- | --- |
| $\ell_2$ (MSE) | la media condicional | castiga fuerte los errores grandes: útil cuando el pico importa |
| $\ell_1$ (MAE) | la mediana condicional | robusta a valores atípicos: se reporta como complemento |

De ahí la convención del benchmark: **MSE como pérdida de entrenamiento y MAE como métrica
complementaria de robustez**. No es una preferencia estética: son dos preguntas distintas.

### 1.4 El ejemplo transversal

Todo el documento usa esta serie de consumo horario (kWh), de solo seis instantes:

$$
y = \bigl(10,\; 12,\; 14,\; 13,\; 15,\; 16\bigr)
$$

Se construyen ventanas de **un paso** con **rezago 1** (cada valor predice al siguiente) y se absorbe el
intercepto dentro del vector de entrada, como hace el deck. Resultado: $N = 5$ muestras con
$\mathbf{x}_i = (1, z_i)$, donde $z_i$ es el valor previo.

| $i$ | $\mathbf{x}_i = (1, z_i)$ | $y_i$ | $z_i - \bar{z}$ | $y_i - \bar{y}$ |
| --- | --- | --- | --- | --- |
| 1 | $(1, 10)$ | 12 | $-2.8$ | $-2$ |
| 2 | $(1, 12)$ | 14 | $-0.8$ | $0$ |
| 3 | $(1, 14)$ | 13 | $1.2$ | $-1$ |
| 4 | $(1, 13)$ | 15 | $0.2$ | $1$ |
| 5 | $(1, 15)$ | 16 | $2.2$ | $2$ |

**Cantidades que se usarán una y otra vez** (verificadas a mano):

$$
\sum_{i=1}^{5} z_i = 64, \qquad
\sum_{i=1}^{5} z_i^2 = 834, \qquad
\sum_{i=1}^{5} y_i = 70, \qquad
\sum_{i=1}^{5} z_i y_i = 905
$$

$$
\bar{z} = 12.8, \qquad \bar{y} = 14, \qquad
\mathbf{D}^{\top}\mathbf{D} = \begin{bmatrix} 5 & 64 \\ 64 & 834 \end{bmatrix}, \qquad
\det\!\left(\mathbf{D}^{\top}\mathbf{D}\right) = 5 \cdot 834 - 64^2 = 74
$$

$$
c_{zz} = \sum_i (z_i - \bar{z})^2 = 14.8, \qquad
c_{zy} = \sum_i (z_i - \bar{z})(y_i - \bar{y}) = 9.0, \qquad
c_{yy} = \sum_i (y_i - \bar{y})^2 = 10
$$

Las dos formas son equivalentes: $c_{zz} = \sum z_i^2 - N\bar{z}^2 = 834 - 5(163.84) = 14.8$ y
$c_{zy} = \sum z_i y_i - N \bar{z}\bar{y} = 905 - 5(179.2) = 9.0$. La forma **centrada** es más cómoda
para razonar y la forma **bruta** es la que aparece en las ecuaciones normales.

### 1.5 Sesgo, varianza y por qué hace falta validar

Todo lo anterior elige $\hat{\theta}$ **sobre los datos de entrenamiento**. Ese es el problema: se puede
hacer arbitrariamente bien en entrenamiento y mal en datos nuevos.

El error esperado de un modelo en un punto se descompone en tres términos:

$$
\mathbb{E}\bigl[(y - \hat{f}(\mathbf{x}))^2\bigr]
= \underbrace{\bigl(\mathbb{E}[\hat{f}(\mathbf{x})] - f(\mathbf{x})\bigr)^2}_{\text{sesgo}^2}
+ \underbrace{\mathrm{Var}\bigl(\hat{f}(\mathbf{x})\bigr)}_{\text{varianza}}
+ \underbrace{\sigma^2}_{\text{ruido irreducible}}
$$

| | Sesgo | Varianza | Síntoma |
| --- | --- | --- | --- |
| Modelo demasiado simple | alto | baja | no captura el patrón (*underfitting*) |
| Modelo demasiado flexible | bajo | alta | memoriza el ruido (*overfitting*) |

**La regularización es un intercambio deliberado**: aceptar un poco más de sesgo para bajar la
varianza. Esa frase resume Ridge, Lasso, ElasticNet, SVR y los árboles.

**Consecuencia operativa.** Como el error de entrenamiento no es el error real, se parte la muestra:

| Conjunto | Uso | Regla del protocolo |
| --- | --- | --- |
| train | ajustar $\theta$ | solo con él se estandariza (media y desviación) |
| val | elegir hiperparámetros ($\lambda_{reg}$, profundidad, $\nu$) | **solo** val, nunca test |
| test | reportar una vez | el test se toca una sola vez, al final |

Estandarizar con estadísticas del train (y no del total) es lo que evita **fuga de información**: si el
modelo ve la media del futuro, el resultado deja de ser honesto.

---

## 2. Nivel 0 — Baselines sin aprendizaje

Los baselines no tienen parámetros que entrenar. Su función es ser la **cota inferior**: si un modelo
aprendido no los supera, no aporta nada.

### 2.1 Naive (último valor)

**Idea.** El mejor pronóstico del próximo valor es el último valor observado.

$$
\hat{y}[t+h \mid t] = y[t], \qquad h = 1, \dots, H
$$

**Qué minimiza.** Nada: no hay $\theta$. Pero se puede derivar su error esperado, y ese resultado explica
por qué es un baseline tan duro en carga eléctrica.

**Derivación del error esperado.** El error a horizonte $h$ es $e_{t+h} = y[t+h] - y[t]$. Si la serie es
estacionaria (media constante, autocovarianza $\gamma$ que solo depende del desfase), entonces

$$
\mathbb{E}\bigl[y[t+h] - y[t]\bigr] = 0
\quad\Longrightarrow\quad
\mathrm{MSE}_{\text{naive}}(h) = \mathrm{Var}\bigl(y[t+h] - y[t]\bigr)
$$

y por definición de autocovarianza:

$$
\mathrm{Var}\bigl(y[t+h] - y[t]\bigr)
= \gamma(0) + \gamma(0) - 2\gamma(h)
= 2\gamma(0)\bigl(1 - \rho(h)\bigr)
$$

donde $\rho(h) = \gamma(h)/\gamma(0)$ es la autocorrelación. **Lectura:** el naive es bueno cuando la
serie está muy autocorrelacionada a ese desfase ($\rho(h) \to 1$) y malo cuando no.

**Caso particular: paseo aleatorio.** Si $y$ es un paseo aleatorio con incrementos iid de varianza
$\sigma^2_{\Delta}$, entonces $y[t+h] - y[t] = \sum_{j=1}^{h} \Delta_{t+j}$, una suma de $h$ incrementos
independientes:

$$
\mathrm{MSE}_{\text{naive}}(h) = h\,\sigma^2_{\Delta}
$$

El error **crece linealmente con el horizonte**. Cualquier modelo que no crezca más despacio que esto no
aporta *skill*, y esa es la vara con la que se juzga todo lo demás en horizontes largos ($H$ hasta 720).

### 2.2 Seasonal-naive (mismo momento del ciclo anterior)

**Idea.** La demanda tiene ciclo diario y semanal: el mejor pronóstico es el valor del **mismo momento
del ciclo** anterior.

$$
\hat{y}[t+h \mid t] = y\bigl[t + h - s\lceil h/s \rceil\bigr], \qquad s \in \{24, 168\}
$$

- $s = 24$: mismo instante del día anterior.
- $s = 168$: mismo instante de la semana anterior.
- $\lceil \cdot \rceil$ es el techo: se avanza el número entero de ciclos necesario para caer antes de
  $t+h$.

**Qué asume.** $\mathbb{E}\bigl[y[t+h] \mid \cdot\bigr] \approx y[t+h-s]$: la serie es (casi)
estacionaria **en su período**. Es un «paseo aleatorio estacional».

**Nota de implementación del benchmark.** Con ventana estricta de 96 h no cabe una temporada de 168 h,
así que seasonal-naive-168 referencia historial **previo al origen de la ventana** (conocido, sin fuga de
futuro). Los modelos aprendidos mantienen la ventana estricta de 96.

### 2.3 Cómo se mide que un modelo «gana»

**Skill score.** Comparación directa contra el baseline:

$$
SS = 1 - \frac{\mathrm{MSE}_{\text{modelo}}}{\mathrm{MSE}_{\text{baseline}}}
$$

$SS > 0$: el modelo mejora al baseline. $SS \le 0$: no aporta.

**Pero una diferencia puede ser casualidad.** Para decidir si dos modelos difieren de forma
estadísticamente significativa se usa el **test de Diebold–Mariano**. Con los errores al cuadrado de los
dos modelos, $d_t = e_{1,t}^2 - e_{2,t}^2$:

$$
DM = \frac{\bar{d}}{\sqrt{\widehat{\mathrm{Var}}(d)/n}} \;\xrightarrow{\;d\;}\; \mathcal{N}(0,1)
\qquad \bigl(H_0:\ \text{los dos modelos tienen el mismo error esperado}\bigr)
$$

La varianza se estima con corrección **HAC** porque los errores de horizontes de $H$ pasos se solapan
$H-1$ posiciones y por tanto están correlacionados. Regla del protocolo: el test se aplica **una sola
vez**, contra DLinear y contra el mejor baseline.

**Ejemplo con la serie diminuta.** No hay ciclo que explotar con seis datos, pero se puede ver el
mecanismo: con $h=1$, el naive predice $\hat{y}_i = z_i$ (el valor previo). Su error cuadrático medio es

$$
\frac{1}{5}\sum_i (y_i - z_i)^2
= \frac{(12-10)^2 + (14-12)^2 + (13-14)^2 + (15-13)^2 + (16-15)^2}{5}
= \frac{4+4+1+4+1}{5} = 2.8
$$

Guarda ese número: **2.8** es la cota que todo modelo del documento debe bajar. El OLS de la sección
siguiente obtiene $0.905$, es decir $SS = 1 - 0.905/2.8 = 0.677$: mejora al naive en el 68 % del error.

## 3. Nivel 1 — Lineales: mínimos cuadrados y máxima verosimilitud

### 3.1 Mínimos cuadrados ordinarios (OLS)

#### Idea

Si el modelo es una combinación lineal de las entradas, el criterio más natural es hacer pequeño el
error de ajuste. OLS no elige el modelo: **elige los coeficientes** que mejor ajustan ese modelo a los
datos.

#### Estructura del modelo

$$
f_{\theta}(\mathbf{x}) = \mathbf{x}^{\top}\theta, \qquad
\mathbf{y} = \mathbf{D}\theta + \boldsymbol{\varepsilon}, \qquad
\mathbb{E}[\boldsymbol{\varepsilon}] = \mathbf{0}, \quad \mathrm{Var}(\boldsymbol{\varepsilon}) = \sigma^2\mathbf{I}
$$

Tres cosas que conviene fijar aquí:

- El **sesgo** $\theta_0$ va absorbido en $\mathbf{x}_i$ (la primera columna de $\mathbf{D}$ es de unos),
  así que $\theta \in \mathbb{R}^{d}$ y no hace falta un término aparte.
- $\boldsymbol{\varepsilon}$ es el **error**: no se observa. Lo que se observa es el **residuo**
  $\mathbf{e} = \mathbf{y} - \mathbf{D}\hat{\theta}$. Confundirlos es el error conceptual más común de
  esta sección.
- Los dos supuestos escritos —media cero y varianza constante— son los que usará Gauss–Markov en §3.1.

#### Función de costo: qué minimiza

$$
\mathcal{L}_{OLS}(\theta) = \lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2
= \sum_{i=1}^{N} \bigl(y_i - \mathbf{x}_i^{\top}\theta\bigr)^2
$$

**Problema de optimización:**

$$
\hat{\theta} = \arg\min_{\theta \in \mathbb{R}^{d}} \; \mathcal{L}_{OLS}(\theta)
$$

Es un problema **cuadrático y convexo** en $\theta$ (una parábola en cada coordenada): tiene un mínimo
global y no hay mínimos locales. Eso permite resolverlo con una derivada.

#### Derivación paso a paso de la solución

**Paso 1 — escribir la norma como producto matricial.**

$$
\lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2
= (\mathbf{y} - \mathbf{D}\theta)^{\top}(\mathbf{y} - \mathbf{D}\theta)
= \underbrace{\mathbf{y}^{\top}\mathbf{y}}_{\text{no depende de } \theta}
- 2\,\theta^{\top}\mathbf{D}^{\top}\mathbf{y}
+ \theta^{\top}\mathbf{D}^{\top}\mathbf{D}\,\theta
$$

**Paso 2 — derivar respecto a $\theta$** usando $\partial(a^{\top}\theta)/\partial\theta = a$ y
$\partial(\theta^{\top}\mathbf{A}\theta)/\partial\theta = 2\mathbf{A}\theta$ para $\mathbf{A}$ simétrica:

$$
\frac{\partial \mathcal{L}_{OLS}}{\partial \theta}
= -2\,\mathbf{D}^{\top}\mathbf{y} + 2\,\mathbf{D}^{\top}\mathbf{D}\,\theta
$$

**Paso 3 — igualar a cero.** El gradiente se anula cuando

$$
\mathbf{D}^{\top}\mathbf{D}\,\hat{\theta} = \mathbf{D}^{\top}\mathbf{y}
\qquad\text{(ecuaciones normales)}
$$

**Paso 4 — despejar.** Si $\mathbf{D}^{\top}\mathbf{D}$ es invertible (equivalentemente,
$\mathrm{rango}(\mathbf{D}) = d$):

$$
\boxed{\;\hat{\theta} = \left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}\mathbf{D}^{\top}\mathbf{y}\;}
$$

**Paso 5 — comprobar que es un mínimo.** La segunda derivada es $2\mathbf{D}^{\top}\mathbf{D}$, que es
semidefinida positiva; con rango completo, definida positiva. Es un mínimo, no un punto de silla.

#### El ejemplo transversal, resuelto

Con los datos de §1.4:

$$
\mathbf{D}^{\top}\mathbf{D} = \begin{bmatrix} 5 & 64 \\ 64 & 834 \end{bmatrix},
\qquad
\mathbf{D}^{\top}\mathbf{y} = \begin{bmatrix} 70 \\ 905 \end{bmatrix},
\qquad
\det = 74
$$

La inversa de una matriz $2 \times 2$ es $\frac{1}{\det}\begin{bmatrix} a_{22} & -a_{12} \\ -a_{21} & a_{11}\end{bmatrix}$:

$$
\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1} = \frac{1}{74}\begin{bmatrix} 834 & -64 \\ -64 & 5 \end{bmatrix}
$$

Multiplicando por $\mathbf{D}^{\top}\mathbf{y}$:

$$
\hat{\theta}_0 = \frac{834 \cdot 70 - 64 \cdot 905}{74} = \frac{460}{74} = 6.2162,
\qquad
\hat{\theta}_1 = \frac{-64 \cdot 70 + 5 \cdot 905}{74} = \frac{45}{74} = 0.6081
$$

**Lectura:** el modelo es $\hat{y} = 6.2162 + 0.6081\,z$. Cada kWh adicional en el valor previo sube la
predicción en $0.61$ kWh: ese coeficiente es el **efecto marginal** con el resto fijo, y es lo que hace
interpretable al modelo lineal.

Predicciones, residuos y error:

| $i$ | $y_i$ | $\hat{y}_i$ | $e_i = y_i - \hat{y}_i$ | $e_i^2$ |
| --- | --- | --- | --- | --- |
| 1 | 12 | 12.2973 | $-0.2973$ | 0.0884 |
| 2 | 14 | 13.5135 | $0.4865$ | 0.2367 |
| 3 | 13 | 14.7297 | $-1.7297$ | 2.9919 |
| 4 | 15 | 14.1216 | $0.8784$ | 0.7716 |
| 5 | 16 | 15.3378 | $0.6622$ | 0.4385 |

$$
\mathrm{RSS} = \sum_i e_i^2 = 4.527, \qquad
\mathrm{MSE} = \frac{4.527}{5} = 0.905
$$

Dos comprobaciones que siempre conviene hacer:

- $\sum_i e_i = 0$ (exactamente, por la primera ecuación normal: la columna de unos es ortogonal al residuo).
- $\sum_i z_i e_i = 0$ (por la segunda ecuación normal).

**Bondad de ajuste:**

$$
R^2 = 1 - \frac{\mathrm{RSS}}{\sum_i (y_i - \bar{y})^2} = 1 - \frac{4.527}{10} = 0.547
$$

#### Geometría: por qué se llama proyección

Definiendo la **matriz sombrero** $\mathbf{H} = \mathbf{D}\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}\mathbf{D}^{\top}$:

$$
\hat{\mathbf{y}} = \mathbf{D}\hat{\theta} = \mathbf{H}\mathbf{y}
$$

$\mathbf{H}$ proyecta $\mathbf{y}$ sobre el **espacio columna de $\mathbf{D}$**, es decir, sobre todo lo
que el modelo puede representar. Consecuencias inmediatas:

- El residuo es ortogonal a ese espacio: $\mathbf{D}^{\top}\mathbf{e} = \mathbf{0}$.
- Se cumple Pitágoras: $\lVert\mathbf{y}\rVert^2 = \lVert\hat{\mathbf{y}}\rVert^2 + \lVert\mathbf{e}\rVert^2$.
- Si $\mathbf{y}$ ya está en el espacio columna, el residuo es cero.

#### Propiedades estadísticas (Gauss–Markov)

Bajo los supuestos de §3.1, y suponiendo además que $\mathbf{D}$ es **fijo** (no aleatorio):

**Insesgamiento.**

$$
\mathbb{E}[\hat{\theta}] = \mathbb{E}\left[\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}\mathbf{D}^{\top}\mathbf{y}\right]
= \left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}\mathbf{D}^{\top}\mathbf{D}\,\theta = \theta
$$

**Varianza.**

$$
\mathrm{Var}(\hat{\theta}) = \sigma^2\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}
$$

**Teorema de Gauss–Markov:** dentro de la clase de estimadores **lineales** e **insesgados**, OLS tiene
varianza mínima (es el *BLUE*). Dos palabras clave: *lineales* e *insesgados*; fuera de esa clase el
teorema no dice nada, y por eso existe la regularización (§4).

#### Cuándo falla

| Situación | Qué ocurre | Por qué |
| --- | --- | --- |
| Colinealidad perfecta | $\mathbf{D}^{\top}\mathbf{D}$ no es invertible | una columna es combinación de otras |
| $d > N$ | infinitas soluciones | menos ecuaciones que incógnitas |
| Colinealidad alta | solución única pero **inestable** | $\mathrm{Var}(\hat{\theta})$ se dispara |

Los dos primeros casos son exactamente el nacimiento de Ridge y Lasso en §4: **la penalización vuelve
invertible lo que no lo era**.

#### Cómo se resuelve en la práctica

Nunca se invierte $\mathbf{D}^{\top}\mathbf{D}$ de forma explícita. Se usa **descomposición en valores
singulares (SVD)** o una rutina de mínimos cuadrados (`numpy.linalg.lstsq`), que es numéricamente estable
incluso cuando $\mathbf{D}^{\top}\mathbf{D}$ está mal condicionada. **El DLinear del benchmark se resuelve
así**, y de ahí que sea determinista: no hay semillas ni épocas (§4.4).

#### Errores comunes

1. **Confundir residuo con error.** $\mathbf{e}$ se calcula, $\boldsymbol{\varepsilon}$ no se conoce.
2. **Usar $R^2$ para comparar modelos con distinto número de variables.** $R^2$ crece *siempre* al añadir
   variables, incluso ruido puro; para eso está el ajustado:
   $R^2_{adj} = 1 - (1-R^2)\frac{N-1}{N-d} = 1 - 0.453\cdot\frac{4}{3} = 0.396$ en el ejemplo.
3. **Extrapolar sin mirar.** OLS extiende la recta fuera del rango observado; el modelo puede dar valores
   absurdos y el ajuste interno no lo advierte.
4. **Creer que un $R^2$ alto implica causalidad.** Mide ajuste, no explicación.

---

### 3.2 Máxima verosimilitud (MLE)

#### Idea

OLS elige el criterio «suma de cuadrados» sin justificarlo. MLE hace lo contrario: **parte de un supuesto
sobre el ruido** y de ahí *deduce* el criterio. El resultado es que el criterio de OLS no era una
preferencia estética: es lo que produce suponer ruido gaussiano independiente.

#### Estructura del modelo generativo

$$
y_i = \mathbf{x}_i^{\top}\theta + \varepsilon_i, \qquad
\varepsilon_i \sim \mathcal{N}(0, \sigma^2) \ \text{ iid}
$$

**iid** = independientes e idénticamente distribuidos. Es el supuesto fuerte: las $\varepsilon_i$ no
están correlacionadas entre muestras ni tienen varianza distinta.

#### La verosimilitud, paso a paso

**Paso 1 — densidad de una muestra.** Cada $\varepsilon_i = y_i - \mathbf{x}_i^{\top}\theta$ es gaussiano,
así que su densidad es

$$
p(y_i \mid \mathbf{x}_i, \theta, \sigma^2)
= \frac{1}{\sqrt{2\pi\sigma^2}}\exp\left(-\frac{(y_i - \mathbf{x}_i^{\top}\theta)^2}{2\sigma^2}\right)
$$

**Paso 2 — de una muestra a todas.** Por **independencia**, la densidad conjunta es el **producto**:

$$
p(\mathbf{y} \mid \mathbf{D}, \theta, \sigma^2)
= \prod_{i=1}^{N} p(y_i \mid \mathbf{x}_i, \theta, \sigma^2)
= \left(2\pi\sigma^2\right)^{-N/2}
\exp\left(-\frac{1}{2\sigma^2}\sum_{i=1}^{N}\bigl(y_i - \mathbf{x}_i^{\top}\theta\bigr)^2\right)
$$

Ese paso es **todo** lo que hace la verosimilitud: multiplicar densidades porque las muestras son
independientes. Si no lo fueran, la forma sería otra.

**Paso 3 — tomar logaritmo.** El logaritmo convierte el producto en suma y no cambia el $\arg\max$
(es una función creciente):

$$
\log p(\mathbf{y} \mid \mathbf{D}, \theta, \sigma^2)
= -\frac{N}{2}\log\left(2\pi\sigma^2\right)
- \frac{1}{2\sigma^2}\lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2
$$

**Paso 4 — maximizar sobre $\theta$.** Los dos términos que dependen de $\theta$ son el último; el
primero es una constante. Maximizar $-\frac{1}{2\sigma^2}\lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2$
es lo mismo que **minimizar** $\lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2$:

$$
\hat{\theta}_{MLE} = \arg\min_{\theta} \lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2 = \hat{\theta}_{OLS}
$$

**Conclusión clave:** con ruido gaussiano iid, MLE y OLS dan **el mismo** estimador. MLE no mejora el
punto, le añade la varianza. Con otra distribución la equivalencia se rompe (por ejemplo, ruido Laplace
lleva a minimizar el error absoluto).

**Paso 5 — maximizar sobre $\sigma^2$.** Derivando la log-verosimilitud respecto a $\sigma^2$ e igualando
a cero se obtiene

$$
\hat{\sigma}^2_{MLE} = \frac{1}{N}\lVert \mathbf{y} - \mathbf{D}\hat{\theta} \rVert_2^2 = \frac{\mathrm{RSS}}{N}
$$

#### Lo que MLE añade: incertidumbre e inferencia

Con la matriz de covarianza

$$
\mathrm{Var}(\hat{\theta}) = \sigma^2\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}
$$

se pueden construir errores estándar, contrastes $t$ e intervalos de confianza.

**El ejemplo transversal, con inferencia.** Usando $\hat{\sigma}^2 = \mathrm{RSS}/(N-d) = 4.527/3 = 1.509$
(insesgado, ver abajo):

$$
\mathrm{Var}(\hat{\theta}_1) = 1.509 \cdot \frac{5}{74} = 0.1020
\;\Longrightarrow\;
\mathrm{SE}(\hat{\theta}_1) = 0.319
$$

$$
t = \frac{\hat{\theta}_1}{\mathrm{SE}(\hat{\theta}_1)} = \frac{0.6081}{0.319} = 1.906,
\qquad t_{0.975,\,3} = 3.182
$$

Como $|t| < 3.182$, el coeficiente **no es significativamente distinto de cero** al 5 %: el intervalo de
confianza $0.608 \pm 3.182 \cdot 0.319 = (-0.41,\ 1.62)$ contiene el cero. No es un defecto del método: es
que **con cinco datos no hay información suficiente**. Con 321 series y horizontes hasta 720, el protocolo
tiene potencia de sobra; aquí no.

#### Un detalle que importa: el divisor

| Estimador | Fórmula | En el ejemplo | Propiedad |
| --- | --- | --- | --- |
| MLE | $\mathrm{RSS}/N$ | $4.527/5 = 0.905$ | **sesgado** hacia abajo |
| Insesgado | $\mathrm{RSS}/(N-d)$ | $4.527/3 = 1.509$ | $\mathbb{E}[\hat{\sigma}^2] = \sigma^2$ |

El sesgo del MLE vale exactamente $\mathbb{E}[\hat\sigma^2_{MLE}] = \sigma^2\frac{N-d}{N}$: con $N=5$ y
$d=2$ subestima la varianza un 40 %. Por eso para inferencia se usa $\mathrm{RSS}/(N-d)$.

#### El puente bayesiano (que reaparece en Ridge y Lasso)

Si en lugar de maximizar la verosimilitud se combina con un **prior** $p(\theta)$ y se maximiza la
posterior (regla de Bayes):

$$
p(\theta \mid \mathbf{y}, \mathbf{D}) \propto p(\mathbf{y} \mid \mathbf{D}, \theta)\,p(\theta)
\;\Longrightarrow\;
\hat{\theta}_{MAP} = \arg\max_{\theta}\Bigl[\log p(\mathbf{y}\mid\mathbf{D},\theta) + \log p(\theta)\Bigr]
$$

| Prior sobre $\theta$ | Término que añade | Estimador resultante |
| --- | --- | --- |
| Gaussiano $\mathcal{N}(\mathbf{0}, \tau^2\mathbf{I})$ | $-\frac{1}{2\tau^2}\lVert\theta\rVert_2^2$ | **Ridge** (§4.1) |
| Laplace | $-\frac{1}{b}\lVert\theta\rVert_1$ | **Lasso** (§4.2) |

**Moraleja:** regularizar es declarar una creencia previa sobre los parámetros. Ese es el sentido de la
frase «regularizar es imponer un prior» que aparece en el deck.

#### Errores comunes

1. **Creer que MLE es otro estimador de $\theta$.** Es el mismo que OLS bajo ruido gaussiano.
2. **Usar $\hat{\sigma}^2_{MLE}$ para inferencia.** Es sesgado; el divisor es $N-d$.
3. **Olvidar el supuesto iid.** Si hay autocorrelación en los residuos, la varianza estimada está mal y
   los contrastes $t$ dejan de ser válidos: por eso el protocolo usa corrección HAC en Diebold–Mariano.
4. **Confundir verosimilitud con probabilidad del modelo.** MLE no compara modelos, estima parámetros.

## 4. Nivel 2 — Regularización: controlar la varianza

### 4.0 El problema que resuelven

En la sección **Cuándo falla** de §3.1 quedaron dos fallas de OLS: con **colinealidad** la matriz $\mathbf{D}^{\top}\mathbf{D}$ es
casi singular y $\mathrm{Var}(\hat{\theta}) = \sigma^2(\mathbf{D}^{\top}\mathbf{D})^{-1}$ se dispara; con
$d > N$ ni siquiera hay solución única. La regularización ataca ambas **añadiendo un término a la
función de costo**.

**Convención de este documento.** Para que las tres familias (Ridge, Lasso, ElasticNet) salgan de la
misma fórmula, se usa la forma estándar:

$$
\mathcal{L}(\theta) = \tfrac{1}{2}\lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2
+ \lambda_{reg}\left[\rho_{en}\lVert \theta \rVert_1 + \tfrac{1-\rho_{en}}{2}\lVert \theta \rVert_2^2\right]
$$

con $\rho_{en} \in [0,1]$ la mezcla. Los dos extremos son Ridge ($\rho_{en} = 0$) y Lasso ($\rho_{en} = 1$).
Más adelante (nota de convención de §4.2) se explica el factor $\tfrac{1}{2}$ y cómo se traduce a las
formas que aparecen en el deck.

---

### 4.1 Ridge: penalización cuadrática

#### Idea

Añadir un castigo proporcional al **tamaño** de los coeficientes. Un coeficiente grande cuesta caro, así
que el modelo prefiere soluciones «modestas» y estables.

#### Función de costo y problema de optimización

$$
\mathcal{L}_{ridge}(\theta) = \lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2 + \lambda_{reg}\lVert \theta \rVert_2^2
= \sum_{i=1}^{N}\bigl(y_i - \mathbf{x}_i^{\top}\theta\bigr)^2 + \lambda_{reg}\sum_{j=1}^{d}\theta_j^2
$$

$$
\hat{\theta}_{ridge} = \arg\min_{\theta \in \mathbb{R}^{d}} \; \mathcal{L}_{ridge}(\theta),
\qquad \lambda_{reg} \ge 0
$$

- $\lambda_{reg} = 0$ devuelve **OLS exactamente**.
- $\lambda_{reg} \to \infty$ lleva $\hat{\theta} \to \mathbf{0}$.

#### Derivación de la solución cerrada

**Paso 1 — derivar.** La parte cuadrática ya se derivó en §3.1; el término nuevo es fácil:

$$
\frac{\partial}{\partial\theta}\left(\lambda_{reg}\theta^{\top}\theta\right) = 2\lambda_{reg}\theta
$$

Entonces

$$
\frac{\partial \mathcal{L}_{ridge}}{\partial \theta}
= -2\mathbf{D}^{\top}\mathbf{y} + 2\mathbf{D}^{\top}\mathbf{D}\theta + 2\lambda_{reg}\theta
= -2\mathbf{D}^{\top}\left(\mathbf{y} - \mathbf{D}\theta\right) + 2\lambda_{reg}\theta
$$

**Paso 2 — igualar a cero.**

$$
-\mathbf{D}^{\top}\left(\mathbf{y} - \mathbf{D}\theta\right) + \lambda_{reg}\theta = 0
\;\Longrightarrow\;
\left(\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I}\right)\theta = \mathbf{D}^{\top}\mathbf{y}
$$

**Paso 3 — despejar.**

$$
\boxed{\;\hat{\theta}_{ridge} = \left(\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I}\right)^{-1}\mathbf{D}^{\top}\mathbf{y}\;}
$$

#### Por qué esto vuelve el problema invertible

Sea $\mathbf{D}^{\top}\mathbf{D} = \sum_k \mu_k \mathbf{v}_k\mathbf{v}_k^{\top}$ su descomposición
espectral, con autovalores $\mu_k \ge 0$. Entonces

$$
\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I} = \sum_k (\mu_k + \lambda_{reg})\,\mathbf{v}_k\mathbf{v}_k^{\top}
$$

Todos los autovalores son ahora $\mu_k + \lambda_{reg} > 0$ para cualquier $\lambda_{reg} > 0$: la matriz es
**definida positiva**, luego invertible **siempre**, incluso con colinealidad perfecta o con $d > N$.
Ese es el sentido de la frase del deck: *la penalización vuelve el problema invertible*.

#### Qué hace la penalización, dirección por dirección (SVD)

Con $\mathbf{D} = \mathbf{U}\mathbf{S}\mathbf{V}^{\top}$ (SVD) y $\mathbf{S}$ diagonal con valores
singulares $s_k$:

$$
\mathbf{D}^{\top}\mathbf{D} = \mathbf{V}\mathbf{S}^2\mathbf{V}^{\top}
\;\Longrightarrow\;
\left(\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I}\right)^{-1}\mathbf{D}^{\top}
= \mathbf{V}\left(\mathbf{S}^2 + \lambda_{reg}\mathbf{I}\right)^{-1}\mathbf{S}\,\mathbf{U}^{\top}
$$

$$
\hat{\theta}_{ridge} = \sum_k \underbrace{\frac{s_k^2}{s_k^2 + \lambda_{reg}}}_{\kappa_k}\,\mathbf{v}_k\mathbf{u}_k^{\top}\mathbf{y},
\qquad \kappa_k \in (0,1)
$$

**Lectura, y es la clave de todo Ridge:**

- Cada dirección singular $k$ de los datos se **contrae** por $\kappa_k$, que nunca llega a cero: ninguna
  dirección se elimina por completo.
- La contracción es más fuerte donde $s_k$ es pequeño, es decir, **en las direcciones peor
  condicionadas**: justo donde OLS se vuelve inestable.
- La suma $\sum_k \kappa_k$ es el **número efectivo de parámetros**, que decrece con $\lambda_{reg}$.

#### Sesgo–varianza, con las cuentas

$$
\mathbb{E}[\hat{\theta}_{ridge}] = \left(\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I}\right)^{-1}\mathbf{D}^{\top}\mathbf{D}\,\theta \ne \theta
$$

El estimador es **sesgado** (por eso Gauss–Markov ya no aplica: sale de la clase de los insesgados), pero

$$
\mathrm{Var}(\hat{\theta}_{ridge}) = \sigma^2\left(\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I}\right)^{-1}\mathbf{D}^{\top}\mathbf{D}\left(\mathbf{D}^{\top}\mathbf{D} + \lambda_{reg}\mathbf{I}\right)^{-1}
\preceq \sigma^2\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}
$$

Menos varianza a cambio de algo de sesgo. Que el intercambio salga a cuenta depende de $\lambda_{reg}$,
y $\lambda_{reg}$ **se elige con validación**, nunca con el test.

#### Lectura bayesiana (MAP con prior gaussiano)

Combinando la log-verosimilitud gaussiana (§3.2) con un prior $\theta \sim \mathcal{N}(\mathbf{0}, \tau^2\mathbf{I})$:

$$
\log p(\theta \mid \mathbf{y}, \mathbf{D})
= -\frac{1}{2\sigma^2}\lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2 - \frac{1}{2\tau^2}\lVert \theta \rVert_2^2 + \text{cte}
$$

Multiplicando por $-2\sigma^2$ y minimizando, el segundo término se convierte en
$\frac{\sigma^2}{\tau^2}\lVert\theta\rVert_2^2$, que es exactamente la penalización de Ridge con

$$
\lambda_{reg} = \frac{\sigma^2}{\tau^2}
$$

**Conclusión:** $\hat{\theta}_{ridge}$ es la **media a posteriori** y el MAP con prior gaussiano. Un prior
ancho (varianza grande $\tau^2$) equivale a poca penalización.

#### El ejemplo transversal, resuelto

**Versión correcta (intercepto centrado, sin penalizar).** Centrando los datos, la fórmula por
coordenada es $\hat{\theta}_1 = c_{zy}/(c_{zz} + \lambda_{reg})$:

$$
\hat{\theta}_1 = \frac{9.0}{14.8 + 1} = 0.5696,
\qquad
\hat{\theta}_0 = \bar{y} - \hat{\theta}_1\bar{z} = 14 - 0.5696 \cdot 12.8 = 6.7090
$$

Comparado con OLS ($0.6081$), Ridge contrae el coeficiente un 6 %. Poco, porque $\lambda_{reg} = 1$ es
pequeño frente a $c_{zz} = 14.8$: la contracción depende de la **escala** de las variables.

**⚠️ Qué pasa si se penaliza el intercepto.** Si se aplica la fórmula matricial completa con
$\lambda_{reg} = 1$ al ejemplo tal como está (con la columna de unos incluida):

$$
\mathbf{D}^{\top}\mathbf{D} + \mathbf{I} = \begin{bmatrix} 6 & 64 \\ 64 & 835 \end{bmatrix},
\qquad \det = 914
$$

$$
\hat{\theta}_0 = \frac{835 \cdot 70 - 64 \cdot 905}{914} = 0.5799,
\qquad
\hat{\theta}_1 = \frac{-64 \cdot 70 + 6 \cdot 905}{914} = 1.0394
$$

El intercepto se desploma de $6.22$ a $0.58$ y el coeficiente **sube** a $1.04$: la penalización está
empujando hacia cero una cantidad que no era un efecto, sino el **nivel** de la serie. Por eso, en la
práctica:

> **Regla:** se estandarizan las entradas y **no se penaliza el intercepto**. Si el sesgo va absorbido en
> $\theta$ (como en este documento), se centra el objetivo antes de penalizar.

#### Cómo se elige $\lambda_{reg}$

Validación cruzada sobre el conjunto de **validación**: se recorre una rejilla de $\lambda_{reg}$, se
entrena con train y se mide en val. El protocolo del benchmark usa **log-uniforme en
$[10^{-4}, 10^{4}]$** con búsqueda TPE (30 *trials*), evaluando **solo sobre val**.

#### Errores comunes

1. **No estandarizar.** Si los rezagos y la temperatura tienen escalas distintas, un mismo $\lambda_{reg}$
   penaliza de forma incomparable entre variables.
2. **Penalizar el intercepto** (ver arriba).
3. **Comparar $\lambda_{reg}$ entre modelos con escalas distintas**: no es comparable.
4. **Elegir $\lambda_{reg}$ con el test.** Es la forma más común de inflar resultados sin darse cuenta.

---

### 4.2 Lasso: penalización en valor absoluto

#### Idea

Cambiar la norma $\ell_2$ por $\ell_1$ no es un detalle: cambia el **comportamiento geométrico** y con él
el resultado. Lasso no solo contrae: **anula coeficientes exactamente**, y eso es selección de variables.

#### Función de costo y problema de optimización

$$
\mathcal{L}_{lasso}(\theta) = \lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2 + \lambda_{reg}\lVert \theta \rVert_1
= \sum_{i=1}^{N}\bigl(y_i - \mathbf{x}_i^{\top}\theta\bigr)^2 + \lambda_{reg}\sum_{j=1}^{d}|\theta_j|
$$

$$
\hat{\theta}_{lasso} = \arg\min_{\theta} \; \mathcal{L}_{lasso}(\theta)
$$

> **Nota de convención.** La forma de arriba (sin $\tfrac{1}{2}$) es la que aparece en la slide. Para
> derivar se usa la forma del §4.0, que lleva $\tfrac{1}{2}$ delante del término de datos; la diferencia
> es solo de escala del umbral: **con la forma sin $\tfrac{1}{2}$, todos los umbrales de esta sección se
> dividen por 2**. Aquí se deriva con la forma del §4.0, que es la que hace que la fórmula de umbral suave
> coincida con la de la slide.

**Problema nuevo:** $|\theta_j|$ **no es diferenciable en cero**. No se puede igualar el gradiente a cero
en todo el dominio; hay que usar **subgradientes**.

#### Condiciones de optimalidad (KKT), paso a paso

En un mínimo de una función convexa no diferenciable, cero debe pertenecer al **subdiferencial**:

$$
\partial |\theta_j| =
\begin{cases}
\{\mathrm{sign}(\theta_j)\}, & \theta_j \ne 0 \\
[-1, 1], & \theta_j = 0
\end{cases}
$$

Aplicando a la coordenada $j$ (con $\mathbf{d}_j$ la columna $j$ de $\mathbf{D}$ y
$\mathbf{r} = \mathbf{y} - \mathbf{D}\theta$):

$$
-\,\mathbf{d}_j^{\top}\mathbf{r} + \lambda_{reg}\,\partial|\theta_j| \ni 0
$$

**Caso $\theta_j \ne 0$:** el subdiferencial es un solo punto y queda una igualdad

$$
\mathbf{d}_j^{\top}\mathbf{r} = \lambda_{reg}\,\mathrm{sign}(\theta_j)
$$

**Caso $\theta_j = 0$:** el subdiferencial es el intervalo $[-1,1]$, así que hay que pedir que
$\mathbf{d}_j^{\top}\mathbf{r}/\lambda_{reg}$ caiga dentro:

$$
\left| \mathbf{d}_j^{\top}\mathbf{r} \right| \le \lambda_{reg}
$$

**Interpretación (la más útil de todo Lasso):** mientras la **correlación de la variable $j$ con el
residuo** no supere el umbral, su coeficiente queda **exactamente** en cero. Si la supera, entra con un
valor distinto de cero.

#### La forma cerrada: umbral suave, derivado

Con diseño **ortonormal** ($\mathbf{D}^{\top}\mathbf{D} = \mathbf{I}$) el problema se desacopla por
coordenada y se resuelve a mano. Por coordenada, con $z = \hat{\theta}^{OLS}_j$ (el estimador OLS de esa
coordenada) y usando la convención del §4.0:

$$
\min_{\theta}\; \tfrac{1}{2}(z - \theta)^2 + \lambda_{reg}|\theta|
$$

- Si $\theta > 0$: derivada $\theta - z + \lambda_{reg} = 0 \Rightarrow \theta = z - \lambda_{reg}$,
  válido solo si $z > \lambda_{reg}$.
- Si $\theta < 0$: derivada $\theta - z - \lambda_{reg} = 0 \Rightarrow \theta = z + \lambda_{reg}$,
  válido solo si $z < -\lambda_{reg}$.
- Si $|z| \le \lambda_{reg}$: el óptimo es $\theta = 0$ (el subdiferencial contiene al cero).

Juntando los tres casos:

$$
\boxed{\;\hat{\theta}^{lasso}_j = \mathrm{sign}\bigl(\hat{\theta}^{OLS}_j\bigr)\,\max\left(\bigl|\hat{\theta}^{OLS}_j\bigr| - \lambda_{reg},\ 0\right)\;}
$$

y se escribe con la notación compacta $(\cdot)_{+} = \max(\cdot, 0)$.

#### Por qué anula y Ridge no: la geometría

Las dos formulaciones equivalentes de Lasso son

$$
\min_{\theta} \lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2
\quad \text{s.a.} \quad \lVert \theta \rVert_1 \le c
\qquad\text{con } c \text{ decreciente en } \lambda_{reg}
$$

| Restricción | Forma | Dónde cae el óptimo | Consecuencia |
| --- | --- | --- | --- |
| $\lVert\theta\rVert_2 \le c$ (Ridge) | esfera lisa | en la superficie lisa | solo contrae |
| $\lVert\theta\rVert_1 \le c$ (Lasso) | politopo con **vértices sobre los ejes** | tiende a un vértice | coordenadas **exactamente** cero |

En dos dimensiones el politopo es un rombo con las puntas sobre los ejes: el punto de contacto de las
curvas de nivel del error con el rombo cae en una punta con mucha frecuencia, y en una punta una
coordenada vale cero. Esa es **toda** la diferencia entre seleccionar y repartir.

#### El ejemplo transversal, resuelto

Con datos centrados, la fórmula por coordenada es
$\hat{\theta}_1 = S(c_{zy},\lambda_{reg})/c_{zz}$, con
$S(c,t) = \mathrm{sign}(c)\max(|c| - t, 0)$:

| $\lambda_{reg}$ | $\hat{\theta}_1$ | Comentario |
| --- | --- | --- |
| 0 | $9.0/14.8 = 0.6081$ | es OLS |
| 1 | $(9.0-1)/14.8 = 0.5405$ | contrae |
| 9 | $(9.0-9)/14.8 = 0$ | **anulación exacta** |
| 20 | 0 | sigue en cero |

El umbral de anulación es $\lambda_{reg} \ge c_{zy} = 9$. Con $\lambda_{reg} = 1$ Lasso contrae **más** que
Ridge ($0.5405$ frente a $0.5696$): la $\ell_1$ no solo cambia la geometría, también aprieta más por
unidad de $\lambda_{reg}$.

#### Cómo se resuelve en la práctica

No hay forma cerrada general (solo con diseño ortonormal). Se usa programación convexa:

- **descenso por coordenadas** (lo que hace `scikit-learn`): se actualiza una coordenada cada vez con la
  fórmula de umbral suave;
- **LARS**: sigue el camino de soluciones al crecer $\lambda_{reg}$;
- **métodos proximales**.

#### Límites de Lasso

1. Con $d > N$ selecciona **a lo sumo $N$** variables (es una consecuencia del politopo).
2. Con variables **correlacionadas** elige una y descarta las demás de forma **inestable**: un cambio
   pequeño en los datos cambia cuál queda. Ese es el problema que corrige ElasticNet.

---

### 4.3 ElasticNet: las dos penalizaciones juntas

#### Idea

Sumar $\ell_1$ y $\ell_2$: conservar la selección de Lasso pero **repartir** el peso entre variables
correlacionadas, como hace Ridge.

#### Función de costo y problema de optimización

$$
\mathcal{L}_{EN}(\theta) = \lVert \mathbf{y} - \mathbf{D}\theta \rVert_2^2
+ \lambda_{reg}\Bigl[(1 - \rho_{en})\lVert \theta \rVert_2^2 + \rho_{en}\lVert \theta \rVert_1\Bigr]
$$

$$
\hat{\theta}_{EN} = \arg\min_{\theta} \; \mathcal{L}_{EN}(\theta),
\qquad \rho_{en} \in [0,1], \quad \lambda_{reg} \ge 0
$$

- $\rho_{en} = 0$: **Ridge** exacto.
- $\rho_{en} = 1$: **Lasso** exacto.

#### Derivación de la solución por coordenada

**Paso 1 — aislar una coordenada.** Centrando los datos y trabajando con la coordenada $j$ (el resto
fijo), el problema se reduce a

$$
\min_{\theta_j}\; \tfrac{1}{2}c_{jj}\left(\theta_j - \hat{\theta}^{OLS}_j\right)^2
+ \tfrac{\lambda_{reg}(1-\rho_{en})}{2}\theta_j^2 + \lambda_{reg}\rho_{en}|\theta_j|
$$

**Paso 2 — derivar para $\theta_j > 0$** (donde $|\theta_j|$ es diferenciable):

$$
c_{jj}\left(\theta_j - \hat{\theta}^{OLS}_j\right) + \lambda_{reg}(1-\rho_{en})\theta_j + \lambda_{reg}\rho_{en} = 0
$$

**Paso 3 — despejar:**

$$
\theta_j = \frac{c_{jj}\hat{\theta}^{OLS}_j - \lambda_{reg}\rho_{en}}{c_{jj} + \lambda_{reg}(1-\rho_{en})}
$$

**Paso 4 — incluir los tres casos** (positivo, negativo, cero) para obtener la forma compacta:

$$
\boxed{\;\hat{\theta}^{EN}_j =
\frac{\mathrm{sign}\bigl(\hat{\theta}^{OLS}_j\bigr)\max\left(\bigl|\hat{\theta}^{OLS}_j\bigr| - \lambda_{reg}\rho_{en},\ 0\right)}{1 + \lambda_{reg}(1-\rho_{en})/c_{jj}}\;}
$$

En el caso ortonormal ($c_{jj} = 1$) queda la forma que aparece en el deck:

$$
\hat{\theta}^{EN}_j = \frac{\mathrm{sign}(\hat{\theta}^{OLS}_j)\max\left(|\hat{\theta}^{OLS}_j| - \lambda_{reg}\rho_{en},\ 0\right)}{1 + \lambda_{reg}(1-\rho_{en})}
$$

**Lectura en dos pasos, que es la mejor manera de recordarla:**

1. **Umbral** con $\lambda_{reg}\rho_{en}$ — herencia de Lasso, de ahí la esparsidad.
2. **Encogimiento** por el factor $1/(1 + \lambda_{reg}(1-\rho_{en}))$ — herencia de Ridge.

#### Por qué «agrupa» variables correlacionadas

Si dos variables son casi idénticas, el término cuadrático hace que la función de costo sea **estrictamente
convexa** en la dirección que las combina: existe una única combinación óptima y el óptimo reparte el peso
entre las dos en vez de escoger una y anular la otra. Lasso no tiene ese término y el problema queda
plano en esa dirección: de ahí su inestabilidad.

#### El ejemplo transversal, resuelto

Con $\lambda_{reg} = 1$ y $\rho_{en} = 0.5$, en el ejemplo (centrado, $c_{zz} = 14.8$):

$$
\hat{\theta}_1 = \frac{S(9.0,\ 0.5)}{14.8 + 0.5} = \frac{8.5}{15.3} = 0.5556
$$

Resumen del ejemplo con $\lambda_{reg} = 1$ — **el mismo dato, cuatro criterios**:

| Modelo | $\hat{\theta}_1$ | Qué hizo la penalización |
| --- | --- | --- |
| OLS | 0.6081 | nada |
| Ridge ($\rho_{en}=0$) | 0.5696 | contrajo |
| ElasticNet ($\rho_{en}=0.5$) | 0.5556 | contrajo y quedó listo para anular |
| Lasso ($\rho_{en}=1$) | 0.5405 | contrajo más y anularía en $\lambda_{reg} \ge 9$ |

Ese orden (OLS $>$ Ridge $>$ EN $>$ Lasso) es el esperado y es una buena señal de que las fórmulas están
bien implementadas.

#### En el protocolo del benchmark

Ridge y ElasticNet comparten el mismo espacio de búsqueda para $\lambda_{reg}$ (log-uniforme
$[10^{-4}, 10^{4}]$), con $\rho_{en}$ como dimensión adicional. Los **rezagos** de carga están
correlacionados de forma cíclica (24 h, 168 h), que es exactamente el caso donde ElasticNet tiene ventaja.

---

### 4.4 DLinear: el baseline lineal obligatorio

#### Idea

No es un regularizador: es un **modelo lineal con estructura**. Su tesis (Zeng et al., 2023) es que los
Transformers para series de tiempo fallan por *atención excesiva*, y que un modelo lineal bien
descompuesto los iguala o supera. Por eso el protocolo lo exige como baseline: **ningún modelo nuevo se
reporta sin superarlo**.

#### Paso 1 — descomposición de la ventana

Dada la ventana $x_1, \dots, x_\tau$, se separa en tendencia y resto con un **promedio móvil** de período
$p_{ma}$:

$$
x^{tend}_\tau = \frac{1}{p_{ma}}\sum_{s = -\lfloor (p_{ma}-1)/2\rfloor}^{\lfloor p_{ma}/2\rfloor} x_{\tau+s},
\qquad
x^{rem}_\tau = x_\tau - x^{tend}_\tau
$$

Es la descomposición clásica $\mathbf{x} = \text{tendencia} + \text{resto}$, la misma idea que STL. La
suma se calcula con relleno en los bordes.

#### Paso 2 — dos proyecciones lineales

$$
\hat{\mathbf{y}} = \underbrace{\mathbf{W}_{tend}\,x^{tend} + \mathbf{b}_{tend}}_{\text{proyecta la tendencia}}
+ \underbrace{\mathbf{W}_{rem}\,x^{rem} + \mathbf{b}_{rem}}_{\text{proyecta el resto}},
\qquad
\mathbf{W}_{tend}, \mathbf{W}_{rem} \in \mathbb{R}^{h \times \tau}
$$

Cada componente tiene **su propia** capa lineal $\mathbb{R}^{\tau} \to \mathbb{R}^{h}$. Los parámetros son
bloques de $\theta$: $\theta = \{\mathbf{W}_{tend}, \mathbf{b}_{tend}, \mathbf{W}_{rem}, \mathbf{b}_{rem}\}$.

**Cuántos parámetros:** $2h\tau + 2h$; con $\tau = h = 96$, unos 18.7 k. La ventaja **no** es la capacidad
(es un modelo lineal), sino el **sesgo inductivo** de tratar la tendencia y la alta frecuencia por
separado.

#### Paso 3 — el ajuste

$$
\hat{\theta} = \arg\min_{\theta}\; \lVert \mathbf{Y} - \hat{\mathbf{Y}}(\theta) \rVert_F^2
$$

Es un problema de **mínimos cuadrados** con las entradas aumentadas
$[x^{tend}, x^{rem}]$. En el paper original se entrena con descenso de gradiente; el protocolo del
benchmark lo resuelve con **mínimos cuadrados cerrados** (SVD y pseudo-inversa), que es la solución exacta
del problema cuadrático. Consecuencia importante: es **determinista**, no tiene semillas, y por eso el
protocolo reporta `n/a` en desviación entre semillas para este modelo.

Variante **NLinear**: $\hat{\mathbf{Y}} = \mathbf{W}(\mathbf{x} - x_\tau) + x_\tau$, con un atajo del último
valor.

#### El ejemplo transversal, resuelto

Con $p_{ma} = 3$ sobre la serie $10, 12, 14, 13, 15, 16$ (rellenando los bordes):

| $\tau$ | $x_\tau$ | $x^{tend}_\tau$ | $x^{rem}_\tau = x_\tau - x^{tend}_\tau$ |
| --- | --- | --- | --- |
| 1 | 10 | 10.00 | 0.00 |
| 2 | 12 | 12.00 | 0.00 |
| 3 | 14 | 13.00 | 1.00 |
| 4 | 13 | 14.00 | $-1.00$ |
| 5 | 15 | 14.67 | 0.33 |
| 6 | 16 | 16.00 | 0.00 |

Por ejemplo, en $\tau = 3$: $x^{tend}_3 = (12+14+13)/3 = 13$ y $x^{rem}_3 = 14 - 13 = 1$. La tendencia es
suave y el resto concentra los saltos. Con esas dos series se construye la matriz de diseño aumentada y
se resuelve por mínimos cuadrados, igual que en §3.1.

#### Errores comunes

1. **Creer que es «solo una capa lineal» y por eso trivial.** El punto es la descomposición: la misma
   capacidad con mejor sesgo inductivo.
2. **Olvidar que es determinista.** Si se reportan semillas para DLinear, algo se implementó mal.
3. **Compararlo sin la misma ventana.** Con $\tau$ distinto, la comparación con los demás modelos no vale.

## 5. Nivel 3 — SVR: pérdida insensible y kernels

### 5.1 Idea

Dos cambios conceptuales frente a todo lo anterior:

1. **No todo error cuesta.** Existe un **tubo de tolerancia**: mientras la predicción caiga dentro de una
   banda de ancho $\varepsilon_{svr}$ alrededor del valor real, el error se considera cero.
2. **El modelo puede ser no lineal en $\mathbf{x}$ pero sigue siendo lineal en los parámetros**, gracias a
   un mapa $\varphi$ a un espacio de características. Eso permite usar kernels sin calcular $\varphi$.

### 5.2 Estructura del modelo

$$
f_\theta(\mathbf{x}) = \langle \theta, \varphi(\mathbf{x}) \rangle
$$

El sesgo $b$ se absorbe en $\theta$ como en §3.1 (una componente constante en $\varphi$), igual que en el
resto del documento.

### 5.3 La pérdida $\varepsilon_{svr}$-insensible

$$
\ell_{\varepsilon_{svr}}\bigl(y_i, f_\theta(\mathbf{x}_i)\bigr)
= \max\left(0,\ \bigl|y_i - f_\theta(\mathbf{x}_i)\bigr| - \varepsilon_{svr}\right)
$$

Comparación con la pérdida cuadrática, que es el punto de esta sección:

| Error $\lvert y_i - f \rvert$ | Costo cuadrático $(\cdot)^2$ | Costo $\varepsilon_{svr}$-insensible |
| --- | --- | --- |
| 0.3 | 0.09 | 0 (dentro del tubo) |
| 0.5 | 0.25 | 0 (en el borde) |
| 1.5 | 2.25 | $1.5 - \varepsilon_{svr}$ |
| 3.0 | 9.00 | $3.0 - \varepsilon_{svr}$ |

**Consecuencias:**

- El costo cuadrático **crece sin techo**: un dato atípico domina la suma y arrastra la solución.
- El costo insensible **crece linealmente** fuera del tubo y es plano dentro: los errores pequeños no
  influyen y los grandes influyen de forma acotada. De ahí la **robustez**.

### 5.4 Función de costo y problema de optimización (primal)

$$
\min_{\theta,\ \boldsymbol{\xi},\ \boldsymbol{\xi}^{\ast}}\;
\frac{1}{2}\lVert \theta \rVert_2^2 + \lambda_{svr}\sum_{i=1}^{N}\left(\xi_i + \xi_i^{\ast}\right)
$$

$$
\text{s.a. }\quad
y_i - f_\theta(\mathbf{x}_i) \le \varepsilon_{svr} + \xi_i,
\qquad
f_\theta(\mathbf{x}_i) - y_i \le \varepsilon_{svr} + \xi_i^{\ast},
\qquad
\xi_i, \xi_i^{\ast} \ge 0
$$

**Lectura de las restricciones.** Las dos primeras dicen «el error no puede pasar de
$\varepsilon_{svr} + \xi$», una por arriba y otra por abajo; las holguras $\xi_i$ y $\xi_i^{\ast}$ miden
**cuánto se sale del tubo** por cada lado. Son no negativas: si el punto cae dentro, valen cero. El
objetivo pide dos cosas a la vez:

- **margen pequeño** ($\lVert\theta\rVert_2^2$ pequeño), que controla la capacidad del modelo;
- **pocas violaciones** ($\sum(\xi_i + \xi_i^{\ast})$ pequeña).

$\lambda_{svr}$ decide el intercambio entre ambas, con el mismo papel que $\lambda_{reg}$ en Ridge y
Lasso (por eso lleva nombre propio: es otra escala y otra unidad).

**Es un problema cuadrático convexo con restricciones lineales** (QP): tiene óptimo **único** y no hay
mínimos locales. Eso es lo que permite resolverlo de forma fiable.

### 5.5 El dual, paso a paso

El dual no es un adorno: es donde aparece el **kernel** y donde se entiende qué puntos definen la
solución.

**Paso 1 — el lagrangiano.** Con multiplicadores $\alpha_i, \alpha_i^{\ast} \ge 0$ para las restricciones
de error y $\eta_i, \eta_i^{\ast} \ge 0$ para las de no negatividad:

$$
\mathcal{L} = \frac{1}{2}\lVert\theta\rVert_2^2 + \lambda_{svr}\sum_i(\xi_i + \xi_i^{\ast})
- \sum_i \alpha_i\left(\varepsilon_{svr} + \xi_i - y_i + f_\theta(\mathbf{x}_i)\right)
- \sum_i \alpha_i^{\ast}\left(\varepsilon_{svr} + \xi_i^{\ast} + y_i - f_\theta(\mathbf{x}_i)\right)
- \sum_i \left(\eta_i\xi_i + \eta_i^{\ast}\xi_i^{\ast}\right)
$$

**Paso 2 — derivar respecto a las variables primales e igualar a cero:**

$$
\frac{\partial \mathcal{L}}{\partial \theta} = \theta - \sum_i (\alpha_i - \alpha_i^{\ast})\varphi(\mathbf{x}_i) = 0
\;\Longrightarrow\;
\boxed{\;\theta = \sum_{i=1}^{N} (\alpha_i - \alpha_i^{\ast})\,\varphi(\mathbf{x}_i)\;}
$$

$$
\frac{\partial \mathcal{L}}{\partial \xi_i} = \lambda_{svr} - \alpha_i - \eta_i = 0
\;\Longrightarrow\;
0 \le \alpha_i \le \lambda_{svr}
$$

(y lo mismo para $\alpha_i^{\ast}$, de donde $0 \le \alpha_i^{\ast} \le \lambda_{svr}$).

**Paso 3 — sustituir de vuelta.** Reemplazando $\theta$ por su expresión en términos de los
multiplicadores, el término cuadrático se convierte en un producto interno entre vectores de
características y aparece el **kernel**:

$$
\langle \varphi(\mathbf{x}_i), \varphi(\mathbf{x}_j) \rangle = \kappa(\mathbf{x}_i, \mathbf{x}_j)
$$

El dual queda (en forma de maximización, que es como se implementa):

$$
\max_{\boldsymbol{\alpha}, \boldsymbol{\alpha}^{\ast}}\;
-\frac{1}{2}\sum_{i,j} (\alpha_i - \alpha_i^{\ast})(\alpha_j - \alpha_j^{\ast})\,\kappa(\mathbf{x}_i, \mathbf{x}_j)
- \varepsilon_{svr}\sum_i (\alpha_i + \alpha_i^{\ast})
+ \sum_i y_i (\alpha_i - \alpha_i^{\ast})
$$

$$
\text{s.a. }\quad \sum_{i=1}^{N}(\alpha_i - \alpha_i^{\ast}) = 0,
\qquad 0 \le \alpha_i, \alpha_i^{\ast} \le \lambda_{svr}
$$

> **Nota.** La restricción $\sum_i(\alpha_i - \alpha_i^{\ast}) = 0$ es la que impone el sesgo $b$; al
> absorber el sesgo en $\theta$ desaparece, como en el resto del documento. Si se mantiene $b$ explícito,
> hay que conservarla.

**Paso 4 — volver al primal.** La predicción se escribe **solo con los datos de entrenamiento**:

$$
\boxed{\;\hat{f}_\theta(\mathbf{x}) = \sum_{i=1}^{N} \left(\alpha_i - \alpha_i^{\ast}\right)\kappa(\mathbf{x}, \mathbf{x}_i)\;}
$$

### 5.6 Qué es un vector de soporte (y por qué la solución es esparsa)

Las condiciones de **holgura complementaria** del KKT dicen que cada multiplicador por su restricción
asociada es cero:

$$
\alpha_i\left(\varepsilon_{svr} + \xi_i - y_i + f_\theta(\mathbf{x}_i)\right) = 0,
\qquad
\eta_i\xi_i = 0
$$

De ahí, y esto es lo importante:

| Posición del punto | $\xi_i$ | $\alpha_i$ | Contribuye a la predicción |
| --- | --- | --- | --- |
| **Dentro** del tubo ($\lvert e_i\rvert < \varepsilon_{svr}$) | 0 | **0** | No |
| **Sobre** el borde ($\lvert e_i\rvert = \varepsilon_{svr}$) | 0 | entre 0 y $\lambda_{svr}$ | Sí |
| **Fuera** del tubo ($\lvert e_i\rvert > \varepsilon_{svr}$) | $>0$ | $= \lambda_{svr}$ | Sí |

Los puntos con $\alpha_i \ne 0$ son los **vectores de soporte**: solo ellos definen la solución. Si el tubo
es ancho, hay pocos y el modelo es esparso; si es estrecho, casi todos los puntos son vectores de soporte
y el modelo se parece a un ajuste clásico.

### 5.7 El truco del kernel

Todo el dual usa únicamente **productos internos** $\kappa(\mathbf{x}_i, \mathbf{x}_j)$, nunca $\varphi$
explícito. Eso permite trabajar en espacios de dimensión enorme (o infinita) con el costo de evaluar
$\kappa$:

| Kernel | $\kappa(\mathbf{x}, \mathbf{x}')$ | Modelo resultante |
| --- | --- | --- |
| Lineal | $\mathbf{x}^{\top}\mathbf{x}'$ | una recta (equivale a un modelo lineal) |
| Polinomial | $(\mathbf{x}^{\top}\mathbf{x}' + c)^{q}$ | polinomio de grado $q$ |
| Gaussiano (RBF) | $\exp\left(-\lVert\mathbf{x}-\mathbf{x}'\rVert_2^2/(2\sigma^2)\right)$ | función suave y local |

El modelo es **no lineal en $\mathbf{x}$** pero **lineal en $\alpha$**: por eso el problema sigue siendo
convexo y se resuelve igual.

### 5.8 Cómo se resuelve en la práctica

- **SMO** (*Sequential Minimal Optimization*): optimiza dos multiplicadores a la vez respetando la
  restricción de suma; es lo que usan las implementaciones estándar.
- Costo computacional $O(N^2)$ a $O(N^3)$: con $N$ grande, SVR es caro. Por eso en el benchmark la familia
  E2 compite con árboles, que escalan mejor.
- **Estandarizar es obligatorio**: el kernel gaussiano mide distancias y $\lambda_{svr}$ no es invariante
  a escala.

### 5.9 El ejemplo transversal

Se ilustra el mecanismo del tubo usando los residuos de OLS de §3.1, con $\varepsilon_{svr} = 0.5$.
(Aviso honesto: la solución de SVR **no** es la de OLS; el tubo que se muestra sirve para ver **qué puntos
serían vectores de soporte** en el sentido de §5.6.)

| $i$ | $y_i$ | $\hat{y}_i^{OLS}$ | $\lvert e_i \rvert$ | ¿Dentro del tubo? | $\alpha_i$ |
| --- | --- | --- | --- | --- | --- |
| 1 | 12 | 12.2973 | 0.2973 | Sí | 0 |
| 2 | 14 | 13.5135 | 0.4865 | Sí | 0 |
| 3 | 13 | 14.7297 | **1.7297** | No | $\lambda_{svr}$ |
| 4 | 15 | 14.1216 | **0.8784** | No | entre 0 y $\lambda_{svr}$ |
| 5 | 16 | 15.3378 | **0.6622** | No | entre 0 y $\lambda_{svr}$ |

**Lecturas del ejemplo:**

- Con solo cinco datos, **tres** son vectores de soporte: el tubo es estrecho comparado con la dispersión.
- Los puntos 1 y 2 no influyen en absoluto: si se movieran dentro del tubo, la solución no cambiaría.
- Ese es el sentido de «robusto»: los errores pequeños no participan de la solución.

### 5.10 Errores comunes

1. **Creer que $\varepsilon_{svr}$ es la tolerancia al ruido.** Es el ancho del tubo, y controla cuántos
   vectores de soporte hay: no es un parámetro de ruido.
2. **No estandarizar.** El kernel gaussiano es especialmente sensible.
3. **Comparar $\lambda_{svr}$ con $\lambda_{reg}$.** Son escalas distintas: en SVR el término de error
   aparece sumado dentro de las restricciones, no como un cuadrado de la misma unidad.
4. **Esperar forma cerrada.** No la hay: es un QP que se resuelve iterativamente.

## 6. Nivel 4 — Árboles y ensambles

### 6.1 Árbol de regresión (CART)

#### Idea

Abandonar por completo el supuesto de linealidad. En lugar de ajustar una función suave, se **parte el
espacio de entrada en cajas** y dentro de cada caja se predice un valor constante.

#### Estructura del modelo

$$
\hat{y}(\mathbf{x}) = \sum_{j=1}^{J_{arb}} c_j \,\mathbb{1}\left[\mathbf{x} \in R_j\right],
\qquad
c_j = \frac{1}{|R_j|}\sum_{\mathbf{x}_i \in R_j} y_i
$$

- $R_j$: la caja (región) de la hoja $j$; $J_{arb}$: número de hojas.
- $c_j$: la **media** de las muestras que caen en esa caja.
- La predicción es una **función escalón**: constante por caja y discontinua en los cortes.

**De dónde sale $c_j$ = media.** Dentro de una hoja, el problema es
$\min_c \sum_{i \in R_j}(y_i - c)^2$. Derivando:

$$
\frac{d}{dc}\sum_{i \in R_j}(y_i - c)^2 = -2\sum_{i \in R_j}(y_i - c) = 0
\;\Longrightarrow\;
c = \frac{1}{|R_j|}\sum_{i \in R_j} y_i
$$

La media es el valor que minimiza el error cuadrático: la misma lógica de §1.3, ahora dentro de una caja.

#### Qué minimiza y el criterio del split

El objetivo global es la **suma de cuadrados intra-hoja** (RSS):

$$
\min_{\{R_j\},\,\{c_j\}} \sum_{j=1}^{J_{arb}} \sum_{\mathbf{x}_i \in R_j} \left(y_i - c_j\right)^2
$$

Como optimizarlo sobre todas las particiones es **NP-duro**, CART crece el árbol **greedy**: en cada nodo
busca el corte $(k, s)$ (variable $k$, umbral $s$) que más reduce el error de sus dos hijos:

$$
\min_{k,\,s}\left[
\min_{c_1}\sum_{\mathbf{x}_i \in R_1(k,s)}(y_i - c_1)^2 +
\min_{c_2}\sum_{\mathbf{x}_i \in R_2(k,s)}(y_i - c_2)^2
\right]
$$

**Equivalencia útil (y por qué se dice «maximizar la ganancia»).** Para un nodo con suma total de
cuadrados $SS_{total} = \sum_{i}(y_i - \bar{y})^2$, se cumple

$$
SS_{total} = \underbrace{SS_{entre}}_{|R_1|(c_1-\bar y)^2 + |R_2|(c_2-\bar y)^2} + \underbrace{SS_{intra}}_{\text{lo que se minimiza}}
$$

Como $SS_{total}$ no depende del corte, **minimizar $SS_{intra}$ es exactamente maximizar $SS_{entre}$**.
Las dos frases que aparecen en la literatura son la misma cuenta.

#### El ejemplo transversal, resuelto

Con la única variable $z$, hay cuatro cortes posibles entre valores consecutivos. Se evalúan todos:

| Corte | Hoja izquierda | $c_1$ | Hoja derecha | $c_2$ | $SS_{intra}$ |
| --- | --- | --- | --- | --- | --- |
| $z \le 10$ | $\{12\}$ | 12 | $\{14,13,15,16\}$ | 14.5 | $0 + 5.00 = 5.00$ |
| $z \le 12$ | $\{12,14\}$ | 13 | $\{13,15,16\}$ | 14.67 | $2.00 + 4.67 = 6.67$ |
| $z \le 13$ | $\{12,14,13\}$ | 13 | $\{15,16\}$ | 15.5 | $2.00 + 0.50 = \mathbf{2.50}$ |
| $z \le 14$ | $\{12,14,13,15\}$ | 13.5 | $\{16\}$ | 16 | $5.00 + 0 = 5.00$ |

El mejor corte es $z \le 13$ contra $z \ge 14$, con $SS_{intra} = 2.5$: el árbol predice 13 para la
izquierda y 15.5 para la derecha. (Los otros cortes se calculan igual: por ejemplo, en el corte
$z \le 12$ la hoja izquierda $\{12,14\}$ tiene media 13 y suma de cuadrados $(12-13)^2+(14-13)^2 = 2$.)

#### Propiedades que definen su comportamiento

| Propiedad | Consecuencia práctica |
| --- | --- |
| No asume linealidad | captura interacciones y umbrales (por ejemplo, «si hace frío, sube el consumo») |
| **No extrapola** | la predicción siempre queda dentro del rango de $y$ de sus hojas |
| Sensible a la profundidad | árbol profundo: varianza alta; poco profundo: sesgo alto |
| Determinista (salvo empates) | no usa semillas por sí solo |

#### Poda y control del tamaño

El crecimiento greedy sobreajusta: cada split se elige por su mejora local, no por su efecto global. Se
controla con `max_depth`, mínimo de muestras por hoja y mínimo de mejora por split (que reaparece como
$\gamma_{arb}$ en XGBoost).

---

### 6.2 Random Forest: bagging sobre árboles

#### Idea

Un árbol profundo tiene **varianza alta**. Si se entrenan muchos árboles y se promedian, la varianza del
promedio es menor que la de uno solo. Para que el promedio sirva, los árboles deben ser **distintos** entre
sí: de ahí el bootstrap y la aleatoriedad en los cortes.

#### Estructura del modelo

$$
\hat{y}(\mathbf{x}) = \frac{1}{M_{arb}}\sum_{m=1}^{M_{arb}} T_m(\mathbf{x})
$$

Cada $T_m$ se entrena sobre una **remuestra con reemplazo** (bootstrap) de las $N$ filas de $\mathbf{D}$ y,
además, en cada split considera solo $m_{try}$ variables candidatas al azar (en regresión, típicamente
$d/3$).

**¿Cuántos datos distintos ve cada árbol?** La probabilidad de que una muestra quede fuera de un bootstrap
de tamaño $N$ es $(1 - 1/N)^N \to e^{-1} \approx 0.368$, así que cada árbol ve alrededor del **63.2 %** de
las muestras. Eso es lo que los hace distintos entre sí.

#### Por qué promediar reduce la varianza: la derivación

Supóngase que cada árbol tiene la misma varianza $\sigma_{arb}^2$ y que la correlación media entre dos
árboles cualesquiera es $\rho_{arb}$. Entonces

$$
\mathrm{Var}\left(\frac{1}{M_{arb}}\sum_{m=1}^{M_{arb}} T_m\right)
= \frac{1}{M_{arb}^2}\left[
\sum_{m=1}^{M_{arb}}\mathrm{Var}(T_m) + \sum_{m \ne l}\mathrm{Cov}(T_m, T_l)
\right]
$$

con $\mathrm{Var}(T_m) = \sigma_{arb}^2$ y $\mathrm{Cov}(T_m, T_l) = \rho_{arb}\sigma_{arb}^2$. Hay
$M_{arb}$ términos de varianza y $M_{arb}(M_{arb}-1)$ de covarianza:

$$
\mathrm{Var}(\hat{y}) = \frac{1}{M_{arb}^2}\left[M_{arb}\sigma_{arb}^2 + M_{arb}(M_{arb}-1)\rho_{arb}\sigma_{arb}^2\right]
= \rho_{arb}\sigma_{arb}^2 + \frac{1 - \rho_{arb}}{M_{arb}}\sigma_{arb}^2
$$

**Esta fórmula es todo el bosque:**

- El segundo término desaparece con $M_{arb} \to \infty$: promediar elimina la parte **independiente**.
- El primer término **no** desaparece: hay un **piso** $\rho_{arb}\sigma_{arb}^2$.
- Por eso existe $m_{try}$: bajar $\rho_{arb}$ es lo único que baja el piso, a costa de que cada árbol sea
  algo peor (más sesgo).

**El sesgo no mejora.** Como $\mathbb{E}[\hat{y}] = \mathbb{E}[T_m]$, promediar **no** cambia el sesgo: el
bosque ataca la varianza, no el sesgo. Ese es el trabajo del boosting.

#### Salida multi-paso

Con $l = 1, \dots, h$ componentes del horizonte, el criterio del split es la **suma** del RSS sobre las $h$
salidas, y la hoja guarda el vector de medias $c_{jl}$: **un solo bosque predice todo el horizonte**. Es la
vía multi-salida que aprovecha el protocolo.

#### El ejemplo transversal

Con $\sigma_{arb}^2 = 1$ y $\rho_{arb} = 0.5$, la fórmula da:

| $M_{arb}$ | $\mathrm{Var}(\hat{y})$ | Reducción frente a un árbol |
| --- | --- | --- |
| 1 | 1.000 | — |
| 4 | $0.5 + 0.125 = 0.625$ | 37.5 % |
| 100 | $0.5 + 0.005 = 0.505$ | 49.5 % |

De 100 árboles a infinitos solo se gana un 0.5 % adicional: el piso manda. Esa es la razón práctica de que
`n_estimators` en 200/500/1000 tenga rendimientos decrecientes.

#### Hiperparámetros y semillas

`n_estimators` (200/500/1000) y `max_depth` (None/8/16/32) en el protocolo. Al ser estocástico, se reporta
**media y desviación sobre semillas**, a diferencia de OLS, Ridge y DLinear, que son deterministas.

---

### 6.3 Gradient Boosting y XGBoost: ajustar el residuo

#### Idea

El bosque entrena árboles **independientes en paralelo** y los promedia. El boosting hace lo contrario:
entrena árboles **en serie**, cada uno corrigiendo el error del anterior. Ataca el **sesgo**.

#### Estructura del modelo (aditivo)

$$
F_0(\mathbf{x}) = \bar{y}, \qquad F_m(\mathbf{x}) = F_{m-1}(\mathbf{x}) + \nu\, T_m(\mathbf{x}),
\qquad \nu \in (0,1]
$$

$\nu$ es el **shrinkage**: cada árbol aporta solo una fracción de su corrección.

#### De dónde sale «ajustar el residuo»: descenso de gradiente en el espacio de funciones

Se quiere minimizar la pérdida total sobre las predicciones:

$$
\mathcal{L}(F) = \sum_{i=1}^{N}\ell\bigl(y_i, F(\mathbf{x}_i)\bigr)
$$

Si a la función actual $F_{m-1}$ se le suma una función pequeña $f$, el cambio de la pérdida es, a primer
orden,

$$
\mathcal{L}(F_{m-1} + f) \approx \mathcal{L}(F_{m-1}) + \sum_{i=1}^{N} \frac{\partial \ell(y_i, F(\mathbf{x}_i))}{\partial F(\mathbf{x}_i)}\bigg|_{F = F_{m-1}} f(\mathbf{x}_i)
$$

Para **bajar** la pérdida hay que moverse en dirección **contraria al gradiente**. Por lo tanto, el
objetivo natural del árbol $T_m$ es ajustar

$$
r_{im} = -\left.\frac{\partial \ell\bigl(y_i, F(\mathbf{x}_i)\bigr)}{\partial F(\mathbf{x}_i)}\right|_{F = F_{m-1}}
$$

que se llaman **pseudo-residuos**. Con pérdida cuadrática $\ell = \frac{1}{2}(y - F)^2$:

$$
-\frac{\partial \ell}{\partial F} = y_i - F_{m-1}(\mathbf{x}_i)
$$

es decir, el residuo común. **Con otra pérdida, la fórmula general sigue valiendo**: ahí está la
generalidad del método.

#### El paso de Newton: la expansión de segundo orden de XGBoost

Minimizar $\mathcal{L}$ de forma directa es intratable. XGBoost expande la pérdida a **segundo orden**
alrededor de $F_{m-1}$, con $g_i = \partial \ell/\partial F$ y $\eta_i = \partial^2 \ell/\partial F^2$:

$$
\mathcal{L} \approx \sum_{i=1}^{N}\left[\ell\bigl(y_i, F_{m-1}(\mathbf{x}_i)\bigr) + g_i\,T_m(\mathbf{x}_i) + \frac{1}{2}\eta_i\,T_m(\mathbf{x}_i)^2\right] + \Omega(T_m)
$$

Descartando el término constante y añadiendo el castigo por complejidad, el objetivo de la iteración es

$$
\mathrm{Obj}^{(m)} = \sum_{i=1}^{N}\left[g_i\,T_m(\mathbf{x}_i) + \frac{1}{2}\eta_i\,T_m(\mathbf{x}_i)^2\right] + \Omega(T_m),
\qquad
\Omega(T) = \gamma_{arb}\,J_{arb} + \frac{1}{2}\lambda_{arb}\sum_{j=1}^{J_{arb}} w_j^2
$$

con $w_j$ el valor de la hoja $j$. El castigo tiene dos piezas con significados distintos:

- $\lambda_{arb}\sum w_j^2$: encoge los valores de las hojas (regularización $\ell_2$).
- $\gamma_{arb}\,J_{arb}$: cobra por cada hoja creada; es una **poda automática**.

#### Derivación del valor óptimo de hoja

Dentro de una hoja $j$, todos los puntos comparten el mismo valor $w_j$. Con
$G_j = \sum_{i \in R_j} g_i$ y $E_j = \sum_{i \in R_j} \eta_i$, la parte del objetivo que depende de
$w_j$ es

$$
G_j\,w_j + \frac{1}{2}\left(E_j + \lambda_{arb}\right)w_j^2
$$

Derivando respecto a $w_j$ e igualando a cero:

$$
G_j + \left(E_j + \lambda_{arb}\right)w_j = 0
\;\Longrightarrow\;
\boxed{\;w_j^{\ast} = -\frac{G_j}{E_j + \lambda_{arb}}\;}
$$

Es un **paso de Newton regularizado**: el gradiente dividido por la curvatura, con $\lambda_{arb}$ sumado a
la curvatura para encogerlo.

#### Derivación de la ganancia del split

Sustituyendo $w_j^{\ast}$ en la expresión anterior, la contribución de la hoja $j$ al objetivo vale
$-\frac{1}{2}\frac{G_j^2}{E_j + \lambda_{arb}} + \gamma_{arb}$. La **ganancia** de partir un nodo $I$ en
$I_L$ e $I_R$ es cuánto baja el objetivo:

$$
\mathrm{Gain} = \frac{1}{2}\left[
\frac{G_L^2}{E_L + \lambda_{arb}} + \frac{G_R^2}{E_R + \lambda_{arb}} - \frac{(G_L + G_R)^2}{E_L + E_R + \lambda_{arb}}
\right] - \gamma_{arb}
$$

El split se acepta **solo si** $\mathrm{Gain} > 0$: de ahí que $\gamma_{arb}$ sea un umbral de mejora mínima.

#### El ejemplo transversal: una iteración completa, a mano

**Punto de partida:** $F_0(\mathbf{x}) = \bar{y} = 14$.

**Gradiente por muestra** ($g_i = \partial\ell/\partial F = F_0 - y_i$, con $\eta_i = 1$ por ser pérdida
cuadrática):

| $i$ | $y_i$ | $g_i = 14 - y_i$ |
| --- | --- | --- |
| 1 | 12 | $2$ |
| 2 | 14 | $0$ |
| 3 | 13 | $1$ |
| 4 | 15 | $-1$ |
| 5 | 16 | $-2$ |

**Árbol:** se usa el mejor corte de §6.1, $z \le 13$ contra $z \ge 14$.

| Hoja | $i$ | $G_j$ | $E_j$ | $w_j^{\ast} = -G_j/(E_j + \lambda_{arb})$ con $\lambda_{arb}=1$ |
| --- | --- | --- | --- | --- |
| Izquierda ($z\le13$) | 1, 2, 3 | $3$ | $3$ | $-3/4 = -0.75$ |
| Derecha ($z\ge14$) | 4, 5 | $-3$ | $2$ | $3/3 = 1.00$ |

**Ganancia:**

$$
\mathrm{Gain} = \frac{1}{2}\left[\frac{3^2}{4} + \frac{(-3)^2}{3} - \frac{0^2}{6}\right] - 0
= \frac{1}{2}\left[2.25 + 3\right] = 2.625 > 0
$$

El split se acepta. Con $\nu = 1$ (para que la cuenta sea transparente), las predicciones son 13.25 y 15.0,
y el MSE baja de $2.0$ a $0.6375$.

**Comprobación que vale oro.** Si se pone $\lambda_{arb} = 0$:

$$
w_L^{\ast} = -\frac{3}{3} = -1, \qquad w_R^{\ast} = -\frac{-3}{2} = 1.5
$$

que son exactamente las **medias de los residuos** de cada hoja: el boosting clásico. Y con $\lambda_{arb} = 1$
los valores son $-0.75$ y $1.00$, es decir **encogidos hacia cero**. Eso es la regularización en acción: la
versión regularizada ajusta un poco peor en entrenamiento ($0.6375$ frente a $0.5$ del boosting sin
regularizar) y a cambio reduce la varianza.

#### Shrinkage, parada temprana y LightGBM

- **$\nu$ pequeño** (por ejemplo 0.05) exige más árboles pero generaliza mejor: es el parámetro más
  importante en la práctica.
- **Parada temprana:** se detiene el entrenamiento cuando la métrica de validación deja de mejorar. Es la
  forma estándar de fijar $M_{arb}$.
- **LightGBM** cambia la **implementación**, no la matemática: splits por histograma, crecimiento
  *leaf-wise* y muestreo GOSS/EFB. Las fórmulas de $w_j^{\ast}$ y Gain son las mismas.
- **Sin extrapolación:** como todo árbol, sus hojas son constantes; fuera del rango observado la predicción
  se aplana.

#### Errores comunes

1. **Confundir bagging con boosting.** Random Forest promedia en paralelo (varianza); boosting suma en
   serie (sesgo).
2. **Dejar crecer $M_{arb}$ sin parada temprana.** El boosting **sí** sobreajusta.
3. **Comparar $\lambda_{arb}$ con $\lambda_{reg}$.** Son penalizaciones de cosas distintas y en escalas
   distintas.
4. **Esperar extrapolación.** Ni CART ni el bosque ni XGBoost extrapolan: es una limitación estructural
   de la predicción por hojas constantes.

## 7. Comparación de familias

| | Lineales (§3–§4) | SVR (§5) | Árboles (§6) |
| --- | --- | --- | --- |
| Forma de la función | recta (o plano) | combinación de kernels | escalones por cajas |
| Supuesto | $f$ afín en las entradas | $f$ en un espacio de características | ninguna forma funcional |
| **Extrapola** | Sí (puede hacerlo mal) | Sí, según el kernel | **No** |
| Interpretación | coeficientes directos | vectores de soporte | importancias por reducción de error |
| Solución | cerrada (SVD) | QP iterativo (SMO) | greedy + ensambles |
| Hiperparámetros | $\lambda_{reg}$, $\rho_{en}$ | $\lambda_{svr}$, $\varepsilon_{svr}$, $\kappa$ | profundidad, $M_{arb}$, $\nu$, $m_{try}$ |
| Robusto a atípicos | No (MSE) | Sí (pérdida lineal fuera del tubo) | Parcialmente (medias de hoja) |
| Determinista | Sí (OLS, Ridge, Lasso, EN, DLinear) | Sí | No (RF y boosting usan semillas) |
| Costo de entrenamiento | Bajo | Alto ($O(N^2)$–$O(N^3)$) | Medio–alto |

**Las tres ideas que resumen todo el documento:**

1. **Todo es «ajuste + castigo».** OLS castiga con cero; Ridge con $\ell_2$; Lasso y ElasticNet con $\ell_1$;
   SVR con el margen; XGBoost con $\Omega$. La misma pérdida compuesta reaparece en PIML como
   $\mathcal{L}_{MSE} + \lambda_{phys}\mathcal{L}_{phys}$: **cambia qué se castiga, no la estructura**.
2. **Todo se resuelve bajando un gradiente**, con dos excepciones que conviene reconocer: los árboles
   (greedy sobre particiones, no diferenciable) y SVR (QP con restricciones).
3. **La diferencia entre modelos es qué suponen y qué no pueden hacer.** Lineales: extrapolan y son
   interpretables. Árboles: capturan no linealidad y **no** extrapolan. SVR: no linealidad vía kernel, con
   costo cuadrático en $N$.

---

## 8. El protocolo del benchmark, aplicado a estos modelos

Estas reglas vienen del protocolo del proyecto y conviene tenerlas presentes al estudiar los modelos,
porque condicionan qué se puede comparar:

| Regla | Por qué |
| --- | --- |
| Ventana estricta $\tau = 96$ y salida directa | comparabilidad con la literatura LTSF |
| Estandarización con media/desviación **solo del train** | evita fuga de información |
| $\lambda_{reg}$ en log-uniforme $[10^{-4}, 10^{4}]$, TPE con 30 *trials* | mismo presupuesto para todos |
| Todo *trial* y semilla en un JSON por corrida | reproducibilidad |
| Reporte de MSE y MAE (+ RMSE, MAPE), media $\pm$ desviación sobre $\ge 3$ semillas | robustez |
| `n/a` en semillas para modelos deterministas | no inventar variabilidad |
| Diebold–Mariano con corrección HAC, **una sola vez** | comparaciones con solapamiento de horizontes |
| DLinear como baseline obligatorio | si no se supera, no hay aporte |

**Regla de oro al leer resultados:** un modelo que gana a otro en MSE no necesariamente lo gana de forma
significativa. Para eso está Diebold–Mariano.

---

## 9. Chuleta final

| Modelo | Qué minimiza | Solución | Hiperparámetros | Ventaja principal | Límite principal |
| --- | --- | --- | --- | --- | --- |
| Naive | nada (no entrena) | $\hat{y} = y[t]$ | — | cota inferior trivial | error crece con $h$ |
| Seasonal-naive | nada | valor del ciclo anterior | $s \in \{24, 168\}$ | captura el ciclo sin entrenar | no usa covariables |
| OLS | $\lVert \mathbf{y}-\mathbf{D}\theta\rVert_2^2$ | $\left(\mathbf{D}^{\top}\mathbf{D}\right)^{-1}\mathbf{D}^{\top}\mathbf{y}$ | — | interpretable, insesgado (BLUE) | inestable con colinealidad |
| MLE | $-\log p(\mathbf{y}\mid\mathbf{D},\theta,\sigma^2)$ | igual a OLS + $\hat\sigma^2$ | — | da varianza e inferencia | exige supuesto de ruido |
| Ridge | OLS $+ \lambda_{reg}\lVert\theta\rVert_2^2$ | $\left(\mathbf{D}^{\top}\mathbf{D}+\lambda_{reg}\mathbf{I}\right)^{-1}\mathbf{D}^{\top}\mathbf{y}$ | $\lambda_{reg}$ | siempre invertible; contrae | no selecciona variables |
| Lasso | OLS $+ \lambda_{reg}\lVert\theta\rVert_1$ | umbral suave (ortonormal) | $\lambda_{reg}$ | selecciona variables | inestable con variables correlacionadas |
| ElasticNet | OLS $+ \lambda_{reg}[(1-\rho_{en})\ell_2 + \rho_{en}\ell_1]$ | umbral suave encogido | $\lambda_{reg}, \rho_{en}$ | selecciona y agrupa | dos hiperparámetros que ajustar |
| DLinear | $\lVert\mathbf{Y}-\hat{\mathbf{Y}}\rVert_F^2$ | mínimos cuadrados cerrados | $p_{ma}$ | baseline fuerte y determinista | no captura no linealidad |
| SVR | $\frac{1}{2}\lVert\theta\rVert_2^2 + \lambda_{svr}\sum(\xi_i+\xi_i^{\ast})$ | QP dual (SMO) | $\lambda_{svr}, \varepsilon_{svr}, \kappa$ | robusta; kernel no lineal | costo $O(N^2)$ |
| CART | $SS_{intra}$ de la partición | greedy + poda | profundidad, hojas mínimas | captura no linealidad | no extrapola |
| Random Forest | $SS_{intra}$ (por árbol, promediado) | promedio de árboles bootstrap | $M_{arb}, m_{try}$, profundidad | baja varianza; multi-salida | piso $\rho_{arb}\sigma_{arb}^2$ |
| XGBoost | $\sum\ell(y_i,F_i) + \sum\Omega(T_m)$ | suma aditiva con paso de Newton | $M_{arb}, \nu, \lambda_{arb}, \gamma_{arb}$ | baja sesgo; estado del arte tabular | sobreajusta sin parada temprana |

---

## 10. Checklist de estudio

Un recorrido sugerido, en orden. Cada punto se puede considerar aprendido cuando se puede **explicar sin
mirar** y **repetir la cuenta del ejemplo**:

- [ ] **1.** Construir una ventana y una salida directa; distinguir $\mathbf{D}$ de $\mathbf{X}$ (§1.1).
- [ ] **2.** Justificar por qué MSE predice la media y MAE la mediana (§1.3).
- [ ] **3.** Reproducir las cantidades base del ejemplo: $\mathbf{D}^{\top}\mathbf{D}$, $\det = 74$,
      $c_{zz} = 14.8$, $c_{zy} = 9.0$ (§1.4).
- [ ] **4.** Derivar la ecuación normal desde el gradiente (§3.1).
- [ ] **5.** Explicar por qué el residuo es ortogonal al espacio columna (§3.1).
- [ ] **6.** Enunciar Gauss–Markov y decir por qué su restricción importa (§3.1).
- [ ] **7.** Derivar la equivalencia MLE–OLS con ruido gaussiano iid (§3.2).
- [ ] **8.** Explicar la diferencia entre $\mathrm{RSS}/N$ y $\mathrm{RSS}/(N-d)$ (§3.2).
- [ ] **9.** Escribir la posterior del MAP con prior gaussiano y Laplace (§3.2).
- [ ] **10.** Derivar la solución de Ridge y explicar la contracción $\kappa_k$ (§4.1).
- [ ] **11.** Explicar por qué la penalización vuelve invertible el problema (§4.1).
- [ ] **12.** Derivar el umbral suave de Lasso con diseño ortonormal (§4.2).
- [ ] **13.** Explicar la geometría del politopo y por qué anula (§4.2).
- [ ] **14.** Obtener la solución de ElasticNet y reconocer Ridge y Lasso como extremos (§4.3).
- [ ] **15.** Explicar la descomposición de DLinear y por qué es determinista (§4.4).
- [ ] **16.** Escribir la pérdida $\varepsilon_{svr}$-insensible y explicar la robustez (§5.3).
- [ ] **17.** Derivar $\theta = \sum(\alpha_i - \alpha_i^{\ast})\varphi(\mathbf{x}_i)$ desde el lagrangiano (§5.5).
- [ ] **18.** Explicar qué es un vector de soporte usando holgura complementaria (§5.6).
- [ ] **19.** Repetir la evaluación de los cuatro cortes de CART y hallar $z \le 13$ (§6.1).
- [ ] **20.** Derivar $\mathrm{Var}(\hat{y}) = \rho_{arb}\sigma_{arb}^2 + \frac{1-\rho_{arb}}{M_{arb}}\sigma_{arb}^2$ (§6.2).
- [ ] **21.** Explicar por qué el bosque no reduce el sesgo (§6.2).
- [ ] **22.** Derivar $w_j^{\ast} = -G_j/(E_j + \lambda_{arb})$ (§6.3).
- [ ] **23.** Repetir la iteración de XGBoost del ejemplo y verificar que con $\lambda_{arb}=0$ recupera las
      medias de los residuos (§6.3).
- [ ] **24.** Explicar en una frase la diferencia entre bagging y boosting (§7).

---

## 11. Conexión con las slides del deck

| Slide del deck | Sección de este documento |
| --- | --- |
| `d3-reg-ols` — regresión lineal por mínimos cuadrados | §1.1, §1.3, §3.1 |
| `d3-reg-mle` — máxima verosimilitud (MLE) | §3.2 |
| `d3-reg-ridge` — Ridge (L2): penalización cuadrática | §4.0, §4.1 |
| `d3-reg-lasso` — Lasso (L1): penalización en valor absoluto | §4.2 |
| `d3-reg-elastic` — Elastic Net: regularización $\ell_1 + \ell_2$ | §4.3 |
| `d3-reg-dlinear` — descomposición lineal y baseline | §4.4 |
| `d3-gpr-model` — GPR: modelo y optimización | §5.7 (truco del kernel) |
| `d3-gpr-prediction` — GPR: predicción e incertidumbre | §5.7 (truco del kernel) |
| `d3-reg-svr` — pérdida insensible y margen máximo | §5 |
| `d3-reg-tree` — partición recursiva (CART) | §6.1 |
| `d3-reg-forest` — bagging sobre árboles | §6.2 |
| `d3-reg-boost` — gradient boosting (XGBoost) | §6.3 |
| `d3-mat-1-arima` — ARIMA (E1) | fuera del alcance de este documento (familia E1) |
| `d3-mat-1` — SARIMA: extensión estacional (E1) | fuera del alcance de este documento (familia E1) |

---

## 12. Referencias

**Mínimos cuadrados, verosimilitud y regularización**

- Gauss, C. F. *Theoria motus corporum coelestium*, 1809 (origen de los mínimos cuadrados).
- Hoerl, A. E. & Kennard, R. W. *Ridge Regression: Biased Estimation for Nonorthogonal Problems*.
  Technometrics 12(1), 55–67, 1970.
- Tibshirani, R. *Regression Shrinkage and Selection via the Lasso*. JRSS-B 58(1), 267–288, 1996.
- Zou, H. & Hastie, T. *Regularization and Variable Selection via the Elastic Net*. JRSS-B 67(2), 301–320, 2005.
- Hastie, T., Tibshirani, R. & Friedman, J. *The Elements of Statistical Learning*, 2.ª ed., Springer,
  2009 (capítulos 3, 7, 9, 10, 12, 15).

**Máquinas de vectores de soporte**

- Vapnik, V. *The Nature of Statistical Learning Theory*, 2.ª ed., Springer, 2000.
- Smola, A. & Schölkopf, B. *A Tutorial on Support Vector Regression*. Statistics and Computing 14,
  199–222, 2004.

**Árboles y ensambles**

- Breiman, L., Friedman, J., Olshen, R. & Stone, C. *Classification and Regression Trees*, 1984.
- Breiman, L. *Random Forests*. Machine Learning 45(1), 5–32, 2001.
- Friedman, J. *Greedy Function Approximation: A Gradient Boosting Machine*. Annals of Statistics 29(5),
  1189–1232, 2001.
- Chen, T. & Guestrin, C. *XGBoost: A Scalable Tree Boosting System*. KDD 2016.
- Ke, G. et al. *LightGBM: A Highly Efficient Gradient Boosting Decision Tree*. NeurIPS 2017.

**Series de tiempo y el baseline lineal moderno**

- Zeng, A., Chen, M., Zhang, L. & Xu, Q. *Are Transformers Effective for Time Series Forecasting?*
  (DLinear), AAAI 2023.
- Diebold, F. & Mariano, R. *Comparing Predictive Accuracy*. Journal of Business & Economic Statistics
  13(3), 1995.

**Documentos internos del proyecto**

- `matematica_modelos_benchmark.md` — matemática de los modelos base del benchmark (§3–§5).
- `protocolo_benchmark_regresion.md` — protocolo experimental y espacios de búsqueda.
- `revision_piml_series_tiempo_energia_matematica.md` §5a — familias data-driven E1–E8.

---

*Documento de estudio del bloque E2 (ML clásico) de la presentación PIML. Todas las cifras del ejemplo
transversal están calculadas a mano y son reproducibles con los datos de §1.4.*
