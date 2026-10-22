// Slides del deck — derivados del documento
// EstadoDelArte/revision_piml_series_tiempo_energia_matematica.md.
// Reglas: ecuaciones literales del documento (notación de la Tabla §1),
// máximo 2–4 ecuaciones display por slide, español académico.

export const SLIDES = [
  // ── Portada ──────────────────────────────────────────────────────────────
  {
    id: 'cover',
    module: 'portada',
    tone: 'cyan',
    kind: 'cover',
    kicker: '1 · Portada',
    title: 'Revisión de Modelos Informados por Física (PIML) para Series de Tiempo y Sistemas Energéticos',
    subtitle: 'Versión matemática — esquema general, diagramas de decisión y modelos matemáticos por familia, previos a la formulación del modelo',
    metaLines: [
      'Maestría en Ingeniería · Universidad Nacional de Colombia',
      'Basado en: revision_piml_series_tiempo_energia_matematica.md',
    ],
    year: '2026',
  },

  // ── §1 Notación ─────────────────────────────────────────────────────────
  {
    id: 'notacion',
    module: 'notacion',
    tone: 'purple',
    kind: 'wide',
    kicker: '2 · Notación',
    title: 'Tabla de notación: grupos, símbolos y su uso',
    table: [
      ['Grupo', 'Símbolos', 'Uso'],
      [
        'Convención temporal (continuo y discreto)',
        'continuo, paréntesis $(\\,)$: $x(t)$, $\\dot{x}(t)$, $u(t,\\mathbf{x})$; discreto, corchetes $[\\,]$ con índice entero: $y[t]$, $\\mathbf{z}[t]$, $\\mathbf{h}[t-1]$, $\\hat{y}[j]$.',
        'Regla transversal: toda magnitud dependiente del tiempo lleva argumento explícito —paréntesis en continuo, corchetes con índice entero en discreto—; los paréntesis con argumento no temporal conservan su sentido.',
      ],
      [
        'Series y marco general',
        '$\\mathbf{x}_n \\in \\mathbb{R}^{P}$, $\\mathbf{y}_n \\in \\mathbb{R}^{\\tau}$; $\\mathbf{X} \\in \\mathbb{R}^{N \\times P}$, $\\mathbf{Y} \\in \\mathbb{R}^{N \\times \\tau}$ y $\\hat{\\mathbf{Y}}=f_\\theta(\\mathbf{X})$. $N$: muestras; $P$: características; $\\tau$: horizonte futuro. La ventana histórica tiene longitud $L$ y se denota $\\mathbf{X}_n^{win} \\in \\mathbb{R}^{L \\times P}$.',
        '$\\theta$ son parámetros, $\\hat{\\theta}$ su estimador; $f_\\theta$ predictor. $\\tau$ es horizonte, no ventana, orden ni capas. Para una muestra, $\\mathbf{x}_n$ puede representar la ventana aplanada o sus características derivadas; los modelos dinámicos conservan su secuencia explícita.'
      ],
      [
        'Codificador RFF multibanda (artículo guía)',
        'kernel $\\kappa$, bandas $K$ con ancho $\\mathrm{softplus}(\\rho_k)$, $N_f$ features por banda, mapeo $\\boldsymbol{\\phi}_k$ (Ecuación 24), embedding $\\mathbf{z}[t] \\in \\mathbb{R}^{F}$ con $F = K N_f$, secuencia $\\mathbf{Z} = \\Phi_{MB}(\\mathbf{X})$; pre-set $B = (6, 24, 72)$ h.',
        'Codificador espectral del artículo guía (familia F6): el mapeo RFF canónico es la Ecuación (24) y la densidad espectral, $p(\\mathbf{w}) = \\mathcal{N}(\\mathbf{0}, \\rho^{-2}\\mathbf{I})$.',
      ],
      [
        'TSB y recurrencia',
        'convolución con dilatación $\\breve{d}$ y kernel $\\breve{k}$, GELU $\\breve{\\sigma}$, LayerNorm $\\mathrm{LN}$, estado $\\breve{\\mathbf{h}}[t]$, módulo $f_{RNN}$.',
        'Backbone secuencial del artículo guía (bloque TCN: residual + GELU + LN); en GRU la compuerta de actualización es $\\mathbf{u}[t]$ (**no** $\\mathbf{z}[t]$, para no colisionar con el embedding espectral).',
      ],
      [
        'Física térmica RC (PINN-RC)',
        'temperaturas $T_{in}, T_{out}, T_m$; capacidades $C_{in}, C_m$; resistencias $R_{ea}, R_{in}, R_{out}$.',
        'Variables de estado y parámetros del circuito térmico 2R2C (patrón D, §6b) cuyo residuo penaliza la PINN-RC.',
      ],
      [
        'Exógenas y drivers',
        '$I_{sol}$, $A_w$, $\\dot{Q}_{int}$, $P_{HVAC}$; drivers de calendario y ocupación.',
        'Forzamientos (entradas exógenas) del modelo RC y covariables de calendario/ocupación del forecasting.',
      ],
      [
        'Símbolos locales',
        '$\\mathcal{B}$ (E1), $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}$ (E6), instantes $t_i$, $t_j$ y muestras $i$, convolución E4 $f[i]$, $s[t]$; E2: $\\mathbf{W}\\in\\mathbb{R}^{P\\times\\tau}$, $\\mathbf{X}\\in\\mathbb{R}^{N\\times P}$, ventana $\\mathbf{X}^{win}_n\\in\\mathbb{R}^{L\\times P}$, $\\varepsilon_i$, $\\lambda_1,\\lambda_2$, $c$, $(\\cdot)_{+}$, $\\varepsilon_{svr}$, $\\lambda_{svr}$; SVD: $\\mathbf{U}, \\mathbf{S}, \\mathbf{V}$.',
        'Los símbolos de operadores y estructuras son locales a su familia. $t_i$ son valores de $t$ continuo: paréntesis, $x(t_i)$; $i$ numera muestras, no tiempo: subíndice, nunca corchete. Colisiones: $\\varepsilon_i$ (ruido), $\\varepsilon[t]$ (innovación) y $\\varepsilon_{svr}$ (tolerancia del tubo) son conceptos distintos; $\\mathbf{U}$ es factor del SVD y $\\mathbf{U}_i$ compuerta; $\\mathcal{N}$ es sólo la normal —la ley física es $\\mathcal{F}[u] = 0$—. $\\mathbf{X}$ denota la matriz muestras-características y las secuencias usan $\\mathbf{X}^{win}_n$.',
      ],
      [
        'Parámetros y optimización',
        '$\\boldsymbol{\\theta}$ parámetros entrenables; $\\boldsymbol{\\phi}$ parámetros físicos; $\\boldsymbol{\\psi}=[\\boldsymbol{\\theta};\\boldsymbol{\\phi}]$ en optimización conjunta; $\\widehat{\\boldsymbol{\\theta}}$, $\\widehat{\\boldsymbol{\\phi}}$ estimadores; $\\Theta$ conjunto admisible; $\\mathcal{L}$ pérdida.',
        'Los bloques entrenables de redes y modelos se agrupan en $\\boldsymbol{\\theta}$; los coeficientes físicos en $\\boldsymbol{\\phi}$. En el problema inverso, $\\boldsymbol{\\psi}$ es el vector conjunto y no la feature local $\\psi_{fis}$ de la puerta ③. Los pesos de penalización llevan subíndice ($\\lambda_{phys}$, $\\lambda_{reg}$, $\\lambda_1$, $\\lambda_2$, $\\lambda_{svr}$, $\\lambda_{rk}$).'
      ],
      [
        'Operadores diferenciales',
        '$\\nabla_{\\mathbf{x}}f=[\\partial f/\\partial x_i]_{i=1}^{P}\\in\\mathbb{R}^{P}$ (gradiente columna, $f:\\mathbb{R}^P\\to\\mathbb{R}$); $[\\mathbf{J}_f]_{ij}=\\partial f_i/\\partial x_j\\in\\mathbb{R}^{M\\times P}$ (jacobiano, filas = salidas, columnas = entradas); $[\\mathbf{H}_f]_{ij}=\\partial^2f/\\partial x_i\\partial x_j\\in\\mathbb{R}^{P\\times P}$ (Hessiana); $\\Delta f=\\operatorname{tr}(\\mathbf H_f)=\\sum_i\\partial^2f/\\partial x_i^2$ (laplaciano).',
        'Gradiente, jacobiano, Hessiana y laplaciano son objetos distintos; se desarrollan con ejemplos en §3. $\\mathbf H_f$ evita confundir la Hessiana con $\\Delta f$; $\\mathbf J_s$ se reserva para la matriz simpléctica. Las derivadas temporales se escriben $d/dt$ o con puntos.',
      ],
    ],
  },

  {
    id: 'marco-aprendizaje',
    module: 'notacion',
    tone: 'purple',
    kind: 'wide',
    kicker: '2 · Marco común',
    title: 'Riesgo esperado, aproximación empírica y optimización',
    bullets: [
      'La estructura compartida organiza la comparación, pero no reemplaza los criterios propios de cada modelo probabilístico o dinámico.',
      'El promedio muestral estima el riesgo bajo la distribución empírica; no es idéntico en general al riesgo poblacional.',
    ],
    equations: [
      {
        heading: 'Aprendizaje regularizado (riesgo poblacional)',
        tex: '\\widehat{\\boldsymbol{\\theta}} = \\arg\\min_{\\boldsymbol{\\theta} \\in \\Theta} \\left[ \\mathbb{E}_{(\\mathbf{x},\\mathbf{y}) \\sim p_{\\mathrm{datos}}} \\left\\{ \\mathcal{L}(\\mathbf{y},f_{\\boldsymbol{\\theta}}(\\mathbf{x})) \\right\\} + \\lambda \\mathcal{R}(\\boldsymbol{\\theta},f_{\\boldsymbol{\\theta}}) \\right]',
        conn: 'La esperanza se toma bajo la distribución poblacional de datos. $\\mathcal{R}$ puede penalizar parámetros o comportamiento; en PIML puede ser un residuo físico, que no es una penalización paramétrica.'
      },
      {
        heading: 'Aproximación empírica',
        tex: '\\widehat{\\mathcal{E}}_N(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n=1}^{N}\\mathcal{L}(\\mathbf{y}_n,f_{\\boldsymbol{\\theta}}(\\mathbf{x}_n))',
        conn: 'Este promedio es una esperanza respecto de la distribución empírica que asigna masa $1/N$ a cada muestra; aproxima el riesgo poblacional bajo condiciones de muestreo, no por identidad universal.'
      },
      {
        heading: 'PIML/PINN: la penalización física actúa sobre el residuo',
        tex: '\\widehat{\\boldsymbol{\\theta}}=\\arg\\min_{\\boldsymbol{\\theta}}\\left[\\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\mathcal{L}(\\mathbf{y},f_{\\boldsymbol{\\theta}}(\\mathbf{x}))+\\lambda_{phys}\\mathbb{E}_{\\mathbf{z}\\sim p_{phys}}\\lVert r_{\\boldsymbol{\\theta}}(\\mathbf{z})\\rVert_2^2\\right]',
        conn: 'La regularización convencional penaliza parámetros; la formulación informada por física penaliza el residuo de una ley en puntos $\\mathbf{z}$. La estructura de optimización es semejante, pero los objetos penalizados son distintos.'
      },
      {
        heading: 'Derivadas: objetos distintos',
        tex: '\\begin{aligned} \\nabla_{\\boldsymbol{\\theta}}\\mathcal{L} &\\quad (\\mathcal{L}\\text{ escalar}), \\qquad \\nabla_{\\mathbf{x}}f_{\\boldsymbol{\\theta}} \\quad (f:\\mathbb{R}^n\\to\\mathbb{R}) \\\\[3pt] \\mathbf{J}_{f_{\\boldsymbol{\\theta}}} &= [\\partial f_i/\\partial x_j]_{ij} \\quad (f:\\mathbb{R}^n\\to\\mathbb{R}^m), \\qquad \\frac{df}{dt},\\;\\frac{d^2f}{dt^2} \\quad (\\text{tiempo}) \\end{aligned}',
        conn: 'El gradiente se aplica a una función escalar de entrada vectorial; si la salida es vectorial se usa el jacobiano (filas: componentes de salida; columnas: variables de entrada). La derivación temporal se escribe con $d/dt$, no con nabla.'
      }
    ],
  },

  // ── §3 Operador nabla, gradiente y jacobiano ─────────────────────────────
  {
    id: 'nabla-casos',
    module: 'nabla',
    tone: 'purple',
    kind: 'split',
    kicker: '3 · Operador nabla · Cuatro casos',
    title: 'Qué entra y qué sale al derivar: cuatro casos de función',
    bullets: [
      '**La forma del resultado la fijan el dominio y el codominio**, no el nombre del modelo: $f:\\mathbb{R}^{P}\\to\\mathbb{R}^{M}$ produce una matriz de $M$ filas y $P$ columnas.',
      '**Un escalar es el caso $P=M=1$**: el jacobiano degenera en un número y coincide con $f^{\\prime}(t)$.',
    ],
    equations: [
      {
        heading: 'El jacobiano contiene a los cuatro casos',
        tex: '\\mathbf J_{f}(\\mathbf x)=\\begin{bmatrix}\\partial f_1/\\partial x_1 & \\cdots & \\partial f_1/\\partial x_P\\\\ \\vdots & & \\vdots\\\\ \\partial f_M/\\partial x_1 & \\cdots & \\partial f_M/\\partial x_P\\end{bmatrix}\\in\\mathbb{R}^{M\\times P}, \\qquad [\\mathbf J_{f}]_{ij}=\\frac{\\partial f_i}{\\partial x_j}',
        conn: 'Filas = salidas; columnas = entradas. Con $M=1$ queda la fila $1\\times P$ que es la traspuesta del gradiente, $(\\nabla_{\\mathbf x}f)^{\\top}$; con $P=1$ queda la columna $M\\times 1$ de derivadas, $f^{\\prime}(t)$.'
      },
    ],
    diagram: 'nablaCasos',
    diagramTitle: 'Dimensión del dominio, del codominio y del objeto derivado',
    legend: [
      { color: '#1E3A5F', label: 'Dominio y codominio' },
      { color: '#2E86AB', label: 'Función $f$' },
      { color: '#E67E22', label: 'Objeto derivado' },
    ],
    notes: 'El caso «uno a muchos» no es el gradiente: derivar $f:\\mathbb{R}\\to\\mathbb{R}^{M}$ da una **columna** de $M$ derivadas. El gradiente aparece cuando el **codominio** es escalar.'
  },
  {
    id: 'nabla-definiciones',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Gradiente y jacobiano',
    title: 'Las dos definiciones: gradiente y jacobiano',
    equations: [
      {
        heading: 'Definición: gradiente de una función escalar',
        tex: '\\nabla_{\\mathbf x}f(\\mathbf x)=\\begin{bmatrix}\\partial f/\\partial x_1\\\\ \\vdots\\\\ \\partial f/\\partial x_P\\end{bmatrix}\\in\\mathbb{R}^{P}, \\qquad f:\\mathbb{R}^{P}\\to\\mathbb{R}, \\quad \\mathbf x\\in\\mathbb{R}^{P}',
        conn: 'Es una **columna** por convención: vive en el mismo espacio que $\\mathbf x$, así que $\\boldsymbol\\theta\\leftarrow\\boldsymbol\\theta-\\eta\\nabla_{\\boldsymbol\\theta}\\mathcal L$ resta vectores del mismo espacio. Su traspuesta es la fila $1\\times P$ del jacobiano: $\\mathbf J_{f}=(\\nabla_{\\mathbf x}f)^{\\top}$.'
      },
      {
        heading: 'Definición: una fila por salida, una columna por entrada',
        tex: '\\mathbf J_{f}(\\mathbf x)=\\begin{bmatrix}\\dfrac{\\partial f_1}{\\partial x_1} & \\cdots & \\dfrac{\\partial f_1}{\\partial x_P}\\\\[4pt] \\vdots & \\ddots & \\vdots\\\\[4pt] \\dfrac{\\partial f_M}{\\partial x_1} & \\cdots & \\dfrac{\\partial f_M}{\\partial x_P}\\end{bmatrix}\\in\\mathbb{R}^{M\\times P}, \\qquad [\\mathbf J_{f}]_{ij}=\\dfrac{\\partial f_i}{\\partial x_j}',
        conn: 'La fila $i$ es $\\nabla_{\\mathbf x}f_i^{\\top}$ y la columna $j$ es $\\partial f/\\partial x_j\\in\\mathbb{R}^{M}$. **El gradiente de una función escalar es un vector; el jacobiano de una función vectorial es una matriz.**'
      },
    ],
    notes: 'Un solo operador, dos formas de salida: si el codominio es escalar, el resultado es una columna de $P$ componentes; si es vectorial, una matriz de $M\\times P$. Con $M=1$ el jacobiano es la fila del gradiente traspuesto.'
  },
  {
    id: 'nabla-jacobiano-general',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Construcción general',
    title: 'Muchos a muchos: cómo se construye la matriz, paso a paso',
    equations: [
      {
        heading: 'Paso 1 · Escribir las $M$ componentes escalares',
        tex: 'f(\\mathbf x)=\\begin{bmatrix}f_1(\\mathbf x)\\\\ \\vdots\\\\ f_M(\\mathbf x)\\end{bmatrix}, \\qquad f_i:\\mathbb{R}^{P}\\to\\mathbb{R}, \\qquad \\mathbf x=\\begin{bmatrix}x_1\\\\ \\vdots\\\\ x_P\\end{bmatrix}\\in\\mathbb{R}^{P}',
        conn: 'Cada $f_i$ es un caso «muchos a uno»: se deriva con $\\nabla_{\\mathbf x}f_i$ y devuelve una columna de $P$ componentes.'
      },
      {
        heading: 'Paso 2 · Derivar cada salida respecto a cada entrada',
        tex: '\\left\\{\\frac{\\partial f_i}{\\partial x_j}\\right\\}_{\\substack{i=1,\\dots,M\\\\ j=1,\\dots,P}} \\qquad\\Longrightarrow\\qquad M\\cdot P \\text{ derivadas parciales}',
        conn: 'Una por cada pareja (salida, entrada). Al derivar $f_i$ respecto a $x_j$ se mantienen fijas las demás entradas: es derivada parcial, no total.'
      },
      {
        heading: 'Paso 3 · Ordenar: las $P$ derivadas de una salida forman su fila',
        tex: '\\mathbf J_{f}=\\begin{bmatrix}\\text{fila }1\\\\ \\vdots\\\\ \\text{fila }M\\end{bmatrix}, \\qquad \\text{fila }i=\\left(\\frac{\\partial f_i}{\\partial x_1},\\ \\dots,\\ \\frac{\\partial f_i}{\\partial x_P}\\right)\\in\\mathbb{R}^{1\\times P}',
        conn: 'La columna $j$ reúne el efecto de la entrada $j$ sobre las $M$ salidas: $\\partial f/\\partial x_j\\in\\mathbb{R}^{M}$. Filas y columnas no se intercambian.'
      },
      {
        heading: 'Paso 4 · Verificar dimensiones y usar la matriz',
        tex: '\\underbrace{M}_{\\text{salidas}}\\times\\underbrace{P}_{\\text{entradas}}, \\qquad f(\\mathbf x+\\Delta\\mathbf x)\\approx f(\\mathbf x)+\\mathbf J_{f}(\\mathbf x)\\,\\Delta\\mathbf x \\quad (M\\times P)(P\\times 1)',
        conn: 'Si $M=P$ la matriz es cuadrada; con $M=1$ queda una fila y con $P=1$, una columna. La linealización sólo vale localmente, alrededor de $\\mathbf x$.'
      },
    ],
    notes: 'El orden de construcción es fijo: componentes → derivadas → filas → verificación. Reordenar filas o columnas produce otra matriz, aunque represente la misma función.'
  },
  {
    id: 'nabla-ejemplo',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Ejemplo paso a paso',
    title: 'Ejemplo: tres entradas y dos salidas',
    equations: [
      {
        heading: 'Paso 1 · La función',
        tex: 'f(\\mathbf x)=\\begin{bmatrix}f_1(\\mathbf x)\\\\ f_2(\\mathbf x)\\end{bmatrix}=\\begin{bmatrix}x_1x_2+\\sin x_3\\\\ x_1^{2}+x_3^{2}\\end{bmatrix}, \\qquad \\mathbf x\\in\\mathbb{R}^{3},\\ f(\\mathbf x)\\in\\mathbb{R}^{2}',
        conn: 'El dominio tiene dimensión $P=3$ y el codominio $M=2$: el jacobiano tendrá $2$ filas y $3$ columnas.'
      },
      {
        heading: 'Paso 2 · Derivadas parciales de cada salida',
        tex: '\\nabla_{\\mathbf x}f_1=\\begin{bmatrix}x_2\\\\ x_1\\\\ \\cos x_3\\end{bmatrix}, \\qquad \\nabla_{\\mathbf x}f_2=\\begin{bmatrix}2x_1\\\\ 0\\\\ 2x_3\\end{bmatrix}',
        conn: '$\\partial f_2/\\partial x_2=0$: la segunda salida no depende de $x_2$. Un cero en el jacobiano es información estructural, no un error de cálculo.'
      },
      {
        heading: 'Paso 3 · Ensamblar la matriz',
        tex: '\\mathbf J_{f}(\\mathbf x)=\\begin{bmatrix}x_2 & x_1 & \\cos x_3\\\\ 2x_1 & 0 & 2x_3\\end{bmatrix}\\in\\mathbb{R}^{2\\times 3}',
        conn: 'La fila 1 responde «cuánto cambia $f_1$ por unidad de $x_1$, $x_2$, $x_3$»; la fila 2 hace lo mismo para $f_2$.'
      },
      {
        heading: 'Paso 4 · Evaluar en un punto',
        tex: '\\mathbf J_{f}(1,2,0)=\\begin{bmatrix}2 & 1 & 1\\\\ 2 & 0 & 0\\end{bmatrix}, \\qquad f(1,2,0)=\\begin{bmatrix}2\\\\ 1\\end{bmatrix} \\;\\Rightarrow\\; f(\\mathbf x)\\approx\\begin{bmatrix}2\\\\ 1\\end{bmatrix}+\\mathbf J_{f}(1,2,0)\\,\\Delta\\mathbf x',
        conn: 'En ese punto, mover $x_1$ en $\\Delta$ cambia $f_1$ y $f_2$ en $2\\Delta$; mover $x_2$ sólo afecta a $f_1$; mover $x_3$ afecta a $f_1$ con pendiente $1$ y a $f_2$ con pendiente $0$.'
      },
    ],
    notes: 'El orden importa: primero se derivan las **salidas** por separado y después se apilan como filas. Derivar primero las entradas produce la traspuesta, que no es el mismo objeto.'
  },
  {
    id: 'nabla-energia',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Sensibilidad en energía',
    title: 'Modelo energético: cuatro sensores y dos salidas',
    equations: [
      {
        heading: 'Cuatro sensores de entrada y dos salidas',
        tex: '\\mathbf x=\\begin{bmatrix}T_{out} & RH_{out} & P_{HVAC} & I_{sol}\\end{bmatrix}^{\\top}\\in\\mathbb{R}^{4}, \\qquad f(\\mathbf x)=\\begin{bmatrix}T_{in}^{+1}\\\\ E_{HVAC}\\end{bmatrix}=\\begin{bmatrix}T_{in}+a\\,(T_{out}-T_{in})+b\\,P_{HVAC}+c\\,I_{sol}\\\\ d\\,P_{HVAC}+e\\,(T_{out}-T_{in})\\end{bmatrix}',
        conn: '$T_{in}$ es **estado**, no entrada: por eso no es columna del jacobiano. $a$ (°C/°C), $b$ (°C/kW), $c$ (°C·m²/W), $d$ (kWh/kW) y $e$ (kWh/°C) son parámetros físicos $\\boldsymbol\\phi$.'
      },
      {
        heading: 'Jacobiano del modelo',
        tex: '\\mathbf J_{f}(\\mathbf x)=\\begin{bmatrix}a & 0 & b & c\\\\ e & 0 & d & 0\\end{bmatrix}\\in\\mathbb{R}^{2\\times 4}',
        conn: 'Dos filas —la temperatura siguiente y la energía— y cuatro columnas, una por sensor. La columna de $RH_{out}$ es nula porque el modelo declarado **no tiene canal de humedad**: es un supuesto de modelado, no un hallazgo sobre el edificio.'
      },
      {
        heading: 'En un modelo lineal el jacobiano es constante',
        tex: 'a=0{,}3,\\ b=0{,}5,\\ c=0{,}02,\\ d=1{,}1,\\ e=0{,}4 \\;\\Rightarrow\\; \\mathbf J_{f}=\\begin{bmatrix}0{,}3 & 0 & 0{,}5 & 0{,}02\\\\ 0{,}4 & 0 & 1{,}1 & 0\\end{bmatrix}\\qquad\\text{para todo }\\mathbf x',
        conn: 'Al ser lineal en las entradas, $\\mathbf J_{f}$ no depende del punto de operación. En un modelo no lineal —saturación del equipo, eficiencia variable— cada elemento depende de $\\mathbf x$ y hay que reevaluarlo en cada punto.'
      },
    ],
    notes: 'El jacobiano responde **una pregunta local**: si el punto de operación se mueve un poco, cuánto se mueve cada salida. No dice nada sobre el comportamiento lejos de ese punto ni sobre causalidad.'
  },
  {
    id: 'nabla-sensibilidad',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Lectura del jacobiano',
    title: 'Cómo leer cada elemento como sensibilidad local',
    table: [
      ['Elemento', 'Unidad', 'Lectura como sensibilidad local'],
      ['$\\partial T_{in}^{+1}/\\partial T_{out}=a$', '°C/°C', 'fracción del salto térmico exterior que pasa al interior en un paso'],
      ['$\\partial T_{in}^{+1}/\\partial P_{HVAC}=b$', '°C/kW', 'efecto del equipo sobre la temperatura de la hora siguiente'],
      ['$\\partial E_{HVAC}/\\partial P_{HVAC}=d$', 'kWh/kW', 'consumo marginal por cada kW adicional del equipo'],
      ['$\\partial E_{HVAC}/\\partial T_{out}=e$', 'kWh/°C', 'consumo extra asociado al gradiente térmico'],
      ['$\\partial T_{in}^{+1}/\\partial RH_{out}=0$', '°C/%HR', 'sin efecto: el modelo no usa la humedad como entrada'],
    ],
    equations: [
      {
        heading: 'Cada elemento arrastra sus unidades',
        tex: '[\\mathbf J_{f}]_{ij}=\\frac{\\partial y_i}{\\partial x_j} \\;\\Rightarrow\\; \\text{unidad}\\left([\\mathbf J_{f}]_{ij}\\right)=\\frac{\\text{unidad de } y_i}{\\text{unidad de } x_j}',
        conn: 'Si las unidades no coinciden con la lectura física esperada, el error está en el modelo, no en la derivada: es la comprobación dimensional aplicada elemento por elemento.'
      },
      {
        heading: 'Validez local de la lectura',
        tex: '\\Delta\\mathbf y\\approx\\mathbf J_{f}(\\mathbf x_0)\\,\\Delta\\mathbf x, \\qquad (M\\times P)(P\\times 1)=M\\times 1',
        conn: 'La aproximación vale para cambios pequeños alrededor de $\\mathbf x_0$; un jacobiano no es una relación causal global ni un intervalo de incertidumbre.'
      },
    ],
    notes: 'Las columnas se leen **por sensor** (qué entrada mueve más cada salida) y las filas **por salida** (de qué entradas depende). Una columna nula identifica una entrada que el modelo ignora, no una variable irrelevante en el sistema real.'
  },
  {
    id: 'nabla-reglas',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Reglas y dimensiones',
    title: 'Gradiente, jacobiano y Hessiano: qué es cada objeto',
    table: [
      ['Objeto', 'Definición', 'Dimensión', 'Dónde aparece'],
      ['$\\nabla_{\\mathbf x}f$', '$[\\partial f/\\partial x_j]$', '$\\mathbb{R}^{P}$ (columna)', '$\\nabla_{\\boldsymbol\\theta}\\mathcal L$, $\\nabla_{\\mathbf z}\\hat H_{\\boldsymbol\\theta}$, $\\nabla_{\\boldsymbol\\psi}\\mathcal L$'],
      ['$\\mathbf J_{f}$', '$[\\partial f_i/\\partial x_j]$', '$\\mathbb{R}^{M\\times P}$ (matriz)', 'sensibilidad salida–entrada de $f_{\\boldsymbol\\theta}$; residuo de una PINN'],
      ['$\\mathbf H_{f}$', '$[\\partial^{2}f/\\partial x_i\\partial x_j]$', '$\\mathbb{R}^{P\\times P}$ (simétrica si $f\\in C^{2}$)', 'inercia de la LNN; curvatura; paso de Newton'],
      ['$\\Delta f$', '$\\operatorname{tr}(\\mathbf H_{f})=\\sum_i \\partial^{2}f/\\partial x_i^{2}$', '$\\mathbb{R}$ (escalar)', 'laplaciano: difusión y regularización espacial'],
    ],
    equations: [
      {
        heading: 'Regla 1 · El laplaciano es la traza del Hessiano',
        tex: '\\Delta f=\\sum_{i=1}^{P}\\frac{\\partial^{2}f}{\\partial x_i^{2}}=\\operatorname{tr}(\\mathbf H_{f})\\in\\mathbb{R} \\qquad\\Longrightarrow\\qquad \\text{no se escribe } \\nabla^{2}f',
        conn: '$\\nabla^{2}f$ se lee como laplaciano en unos textos y como Hessiano en otros: aquí se nombra el objeto, $\\Delta f$ o $\\mathbf H_{f}$.'
      },
      {
        heading: 'Regla 2 · El tiempo no lleva nabla',
        tex: '\\mathcal{F}=m\\,\\frac{d^{2}}{dt^{2}}+c\\,\\frac{d}{dt}+k\\,\\mathcal{I}, \\qquad x(t),\\ \\dot{x}(t),\\ \\ddot{x}(t),\\ \\frac{d}{dt}x(t)',
        conn: '$\\nabla$ se reserva a derivadas respecto a variables vectoriales. El masa-resorte-amortiguador usa $d/dt$ y puntos; no se escribe $\\nabla_{t}$ porque $\\nabla^{2}$ se confundiría con el laplaciano.'
      },
    ],
    notes: 'Regla de lectura: el **tipo de variable** decide el símbolo —entradas $\\mathbf x$, parámetros $\\boldsymbol\\theta$, estado $\\mathbf z$— y la **forma del resultado** decide el nombre: escalar, vector columna, matriz o matriz cuadrada.'
  },
  {
    id: 'nabla-piml',
    module: 'nabla',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Operador nabla · Conexión con PIML',
    title: 'Dónde aparecen: regresión, redes, HNN y LNN',
    equations: [
      {
        heading: 'Tres derivadas del mismo tipo, en tres espacios',
        tex: '\\nabla_{\\mathbf x}f_{\\boldsymbol\\theta}\\in\\mathbb{R}^{P}, \\qquad \\nabla_{\\boldsymbol\\theta}\\mathcal L\\in\\mathbb{R}^{|\\boldsymbol\\theta|}, \\qquad \\nabla_{\\mathbf z}\\hat H_{\\boldsymbol\\theta}\\in\\mathbb{R}^{2d}',
        conn: 'Entradas (sensibilidad), parámetros (entrenamiento) y estado (dinámica). Confundirlas es el error más frecuente al leer el residuo de una PINN: allí se derivan **entradas**, no parámetros. La derivada temporal de un campo $f_{\\boldsymbol\\theta}(t,\\mathbf x)$ es parcial, $\\partial_{t}$; si el campo sólo depende de $t$, coincide con $d/dt$.'
      },
      {
        heading: 'Cómo se encadenan los tres objetos',
        tex: '\\nabla_{\\mathbf x}f\\in\\mathbb{R}^{P} \\;\\longrightarrow\\; \\mathbf J_{f}\\in\\mathbb{R}^{M\\times P} \\;\\longrightarrow\\; \\mathbf H_{f}=\\mathbf J_{\\nabla_{\\mathbf x}f}\\in\\mathbb{R}^{P\\times P}',
        conn: 'El Hessiano es el **jacobiano del gradiente**: derivar la columna $\\nabla_{\\mathbf x}f$ respecto a $\\mathbf x$ da una matriz $P\\times P$, simétrica si $f\\in C^{2}$ (Schwarz). Así se pasa de escalar a vector, de vector a matriz y de matriz al objeto que mide curvatura.'
      },
    ],
    table: [
      ['Modelo', 'Objeto derivado', 'Dimensión', 'Papel'],
      ['Regresión $\\mathbf y=\\mathbf X\\boldsymbol\\theta$', '$\\nabla_{\\boldsymbol\\theta}\\mathcal L=\\frac{1}{N}\\mathbf X^{\\top}(\\mathbf X\\boldsymbol\\theta-\\mathbf y)$', '$\\mathbb{R}^{P}$', 'dirección de descenso; $\\mathbf H=\\frac{1}{N}\\mathbf X^{\\top}\\mathbf X$ da la curvatura'],
      ['Red $f_{\\boldsymbol\\theta}$', '$\\nabla_{\\boldsymbol\\theta}\\mathcal L$', '$\\mathbb{R}^{|\\boldsymbol\\theta|}$', 'retropropagación'],
      ['PINN (§4b)', '$\\partial_{t}f_{\\boldsymbol\\theta},\\ \\partial_{\\mathbf x}f_{\\boldsymbol\\theta}$', '$1$ y $P$', 'residuo de la ley física por autodiferenciación'],
      ['HNN (§4)', '$\\nabla_{\\mathbf z}\\hat H_{\\boldsymbol\\theta}$', '$\\mathbb{R}^{2d}$', 'dinámica $\\dot{\\mathbf z}=\\mathbf J_{s}\\nabla_{\\mathbf z}\\hat H_{\\boldsymbol\\theta}$'],
      ['LNN (§4)', '$\\mathbf H_{\\dot{\\mathbf q}\\dot{\\mathbf q}},\\ \\mathbf H_{\\dot{\\mathbf q}\\mathbf q}$', '$\\mathbb{R}^{d\\times d}$', 'aceleración predicha por Euler–Lagrange'],
    ],
    notes: 'El jacobiano de la red, $\\mathbf J_{f_{\\boldsymbol\\theta}}\\in\\mathbb{R}^{M\\times P}$, es la sensibilidad salida–entrada; no se confunde con $\\mathbf J_{s}$ (simpléctica) ni con el gradiente de la pérdida. El desarrollo de la puerta ② está en §4 y la identificación inversa en §4b.'
  },

  // ── §4 Diagrama 1 — Cuatro puertas ──────────────────────────────────────
  {
    id: 'd1-figura',
    module: 'd1',
    tone: 'blue',
    kind: 'diagram',
    kicker: '4 · Diagrama 1',
    title: 'Las cuatro puertas por las que entra la física',
    lead: [
      'Un solo punto de partida: el modelo ML $\\hat{y} = f_\\theta(\\mathbf{x})$ y el conocimiento físico $\\mathcal{F}[u] = 0$.',
      'De ese binomio **modelo + ley física** salen cuatro canales de entrada, ordenados por fuerza de garantía: **① penalización débil → ② arquitectura → ③ datos/features → ④ híbrido**.',
    ],
    diagram: 'd1',
    diagramTitle: 'Diagrama 1 · ¿Cómo entra la física en un modelo ML/DL?',
    legend: [
      { color: '#1E3A5F', label: 'Conocimiento físico (núcleo)' },
      { color: '#2E86AB', label: '① Pérdida (débil)' },
      { color: '#7D3C98', label: '② Arquitectura (fuerte)' },
      { color: '#16A085', label: '③ Datos / features' },
      { color: '#E67E22', label: '④ Híbrido' },
      { color: '#34495E', label: 'Modelo ML/DL' },
    ],
    refs: [
      'Karniadakis et al., Nature Reviews Physics 3(6), 2021 (DOI: 10.1038/s42254-021-00314-5) · Hao et al., arXiv:2211.08064 · Willard et al., ACM Computing Surveys 2022 · Doumèche, tesis doctoral Sorbonne 2025.',
    ],
  },
  {
    id: 'd1-mr',
    module: 'd1',
    tone: 'blue',
    kind: 'wide',
    kicker: '4 · Sistema ejemplar',
    title: 'El sistema ejemplar: masa-resorte-amortiguador (MR)',
    bullets: [
      'Un solo sistema físico para comparar las tres puertas: la ley $\\mathcal{F}[u]=0$ instanciada en el MR.',
    ],
    equations: [
      {
        heading: 'Operador temporal y ecuación de movimiento',
        tex: '\\begin{aligned} \\mathcal{F} &:= m\\,\\frac{d^{2}}{dt^{2}} + c\\,\\frac{d}{dt} + k\\,\\mathcal{I} \\\\[3pt] \\mathcal{F}[q](t) &= m\\,\\frac{d^{2}q(t)}{dt^{2}} + c\\,\\frac{dq(t)}{dt} + k\\,q(t) = 0 \\end{aligned}',
        conn: 'Se usa la notación ordinaria para las derivadas temporales; $\\mathcal{I}$ es el operador identidad y $\\mathcal{F}$ el operador diferencial del MR. La trayectoria $q(t)$ es la variable física que cada puerta predice: no es la matriz de características $\\mathbf{X}$ de los modelos de aprendizaje.'
      },
      {
        heading: 'Estado canónico y energía (Hamiltoniano)',
        tex: 'q(t), \\quad p(t) = m\\,\\frac{d}{dt} q(t), \\qquad H(q(t), p(t)) = \\frac{p(t)^{2}}{2m} + \\frac{k\\,q(t)^{2}}{2} \\quad (c = 0)',
        conn: '**Conexión:** el caso conservativo ($c=0$) es hamiltoniano puro; es la forma que exige la puerta ② en su variante HNN. $q(t)$ y $p(t)$ son posición y momento en cada instante, no entradas del modelo. La variante lagrangiana se define en la diapositiva propia de la puerta ②.'
      },
      {
        heading: 'Datos disponibles',
        tex: '\\mathbf{x}_n = (t_n, q(t_n), \\frac{d}{dt} q(t_n)), \\qquad \\mathbf{y}_n = q(t_n) \\quad (\\tau=1), \\qquad n=1,\\ldots,N',
        conn: 'Las tres puertas consumen la misma trayectoria medida del MR. La puerta ① (PINN) usará **sólo** $t$ como entrada de la red; los rezagos y las derivadas son material de las otras puertas.'
      },
    ],
    notes: 'Las tres páginas siguientes instancian $\\mathcal{F}[u]=0$ sobre este sistema: misma física, distinto punto de entrada.'
  },
  {
    id: 'd1-puerta1',
    module: 'd1',
    tone: 'blue',
    kind: 'door',
    kicker: '4 · Puerta ① · Forma débil',
    title: 'Puerta ① — Función de pérdida (PINN)',
    lema: 'La física entra como **penalización del residuo**: se busca que la red la respete, sin garantizar su cumplimiento exacto.',
    equations: [
      {
        heading: 'Entrada, salida y modelo',
        tex: 't\\in\\mathbb{R}, \\qquad y(t)=q(t)\\in\\mathbb{R}, \\qquad \\hat{y}(t)=f_\\theta(t), \\quad \\theta\\in\\Theta',
        conn: 'La red aproxima el desplazamiento del MR a partir **únicamente del tiempo**: la entrada es $t$, no una matriz de características.'
      },
      {
        heading: 'Residuo físico (diferenciación automática)',
        tex: 'r_\\theta(t) = \\mathcal{F}[f_\\theta](t) = m\\,\\frac{d^{2}}{dt^{2}} f_\\theta(t) + c\\,\\frac{d}{dt} f_\\theta(t) + k\\,f_\\theta(t)',
        conn: 'La caja punteada "Diff. automática" produce $r_\\theta$ en los puntos de colocación: $\\mathcal{F}$ y $\\frac{d}{dt}$ son los definidos en la página del sistema.'
      },
      {
        heading: 'Función de costo: riesgo esperado y aproximación empírica',
        tex: '\\begin{aligned} J(\\theta) &= \\mathbb{E}_{(t,y)\\sim p_{\\mathrm{datos}}}\\!\\left[ \\left( y-f_\\theta(t) \\right)^{2} \\right] + \\lambda_{phys}\\,\\mathbb{E}_{t\\sim p_{c}}\\!\\left[ r_\\theta(t)^{2} \\right] \\\\[3pt] \\widehat{J}(\\theta) &= \\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left( q_i - f_\\theta(t_i) \\right)^{2} + \\frac{\\lambda_{phys}}{N_c}\\sum_{j=1}^{N_c} r_\\theta(\\tilde{t}_j)^{2} \\end{aligned}',
        conn: 'El primer término es el **error de datos** sobre las $N_d$ observaciones; el segundo es la **penalización física** en los $N_c$ puntos de colocación, con peso $\\lambda_{phys}$. El residuo se penaliza, pero su cumplimiento exacto **no está garantizado**, y las condiciones iniciales deben imponerse cuando correspondan.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\begin{aligned} \\theta^{*} &\\in \\arg\\min_{\\theta\\in\\Theta} J(\\theta) \\\\[3pt] \\widehat{\\theta} &\\in \\arg\\min_{\\theta\\in\\Theta} \\widehat{J}(\\theta) \\end{aligned}',
        conn: 'La forma poblacional define el objetivo; el entrenamiento resuelve la empírica. La física entra en la **pérdida**, no en la estructura de la red.'
      },
    ],
    refs: [
      'Raissi, Perdikaris, Karniadakis. Physics-informed neural networks. J. Comput. Phys. 378, 686–707, 2019.',
      'Karniadakis et al. Physics-informed machine learning. Nat. Rev. Phys. 3(6), 422–440, 2021. DOI: 10.1038/s42254-021-00314-5.',
      'Doumèche. Physics-informed ML: time series forecasting. Tesis Sorbonne, arXiv:2507.08906, 2025.'
    ]
  },
  {
    id: 'd1-puerta1-diagram',
    module: 'd1',
    tone: 'blue',
    kind: 'diagram',
    kicker: '4 · Puerta ① · Forma débil · diagrama',
    diagram: 'mr1',
    diagramTitle: 'MR · Puerta ① — la física entra en la función de pérdida',
    legend: [
      { color: '#1E3A5F', label: 'Sistema MR / física' },
      { color: '#2E86AB', label: '① Pérdida (débil)' },
      { color: '#34495E', label: 'Modelo ML $f_\\theta$' },
      { color: '#C0392B', label: 'Minimización → $\\theta^{*}$' },
    ],
  },
  {
    id: 'd1-puerta2-deriv',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '4 · Puerta ② · Fundamentación física',
    title: 'Puerta ② — Del Hamiltoniano a la dinámica del masa-resorte',
    lema: 'De dónde salen las ecuaciones que la puerta ② impone como estructura: cuatro pasos desde la energía hasta la EDO del MR ($c = 0$).',
    equations: [
      {
        heading: 'Paso 1 · Construcción del Hamiltoniano',
        tex: '\\mathbf{z}(t)=\\begin{bmatrix} q(t) \\\\ p(t) \\end{bmatrix}, \\quad p(t)=m\\,\\frac{d}{dt} q(t), \\qquad T=\\frac{p(t)^{2}}{2m}, \\quad V=\\frac{k\\,q(t)^{2}}{2} \\;\\Rightarrow\\; H=T+V',
        conn: 'El Hamiltoniano es la **energía total** del sistema conservativo: cinética más potencial del resorte. $\\mathbf{z}(t)=(q(t),p(t))^{\\top}$ es el estado canónico; $\\frac{d}{dt}$ ya quedó definida en la página del sistema.'
      },
      {
        heading: 'Paso 2 · Ecuaciones de Hamilton',
        tex: '\\dot{q}(t) = \\partial_{p}H = \\frac{p(t)}{m}, \\qquad \\dot{p}(t) = -\\partial_{q}H = -k\\,q(t) \\qquad\\Longleftrightarrow\\qquad \\dot{\\mathbf{z}}(t) = \\mathbf{J}_s\\,\\nabla_{\\mathbf{z}}H(\\mathbf{z}(t))',
        conn: 'Para este ejemplo $q,p\\in\\mathbb{R}$, $\\mathbf{z}\\in\\mathbb{R}^{2}$ y $\\mathbf{J}_s=\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}\\in\\mathbb{R}^{2\\times2}$. Es antisimétrica ($\\mathbf{J}_s^\\top=-\\mathbf{J}_s$); así $\\dot q=\\partial_p H$ y $\\dot p=-\\partial_q H$. En $d$ grados de libertad, $\\mathbf{J}_s=\\begin{bmatrix}0&\\mathbf I_d\\\\-\\mathbf I_d&0\\end{bmatrix}\\in\\mathbb{R}^{2d\\times2d}$. El gradiente de $H$ es respecto al estado, no a los parámetros neuronales.'
      },
      {
        heading: 'Paso 3 · Recuperación de la ecuación física',
        tex: 'p(t)=m\\,\\frac{d}{dt} q(t) \\;\\Rightarrow\\; \\frac{d}{dt} p(t)=m\\,\\frac{d^{2}}{dt^{2}}q(t) \\;\\Rightarrow\\; m\\,\\frac{d^{2}}{dt^{2}}q(t)+k\\,q(t)=0',
        conn: 'Sustituyendo la primera ecuación de Hamilton en la segunda se recupera **exactamente** la EDO del masa-resorte conservativo: la dinámica sale de $H$ por derivación, no se aprende.'
      },
      {
        heading: 'Paso 4 · Conservación de energía',
        tex: '\\frac{dH}{dt} = \\left( \\nabla_{\\mathbf{z}}H \\right)^{\\top}\\mathbf{J}_s\\,\\nabla_{\\mathbf{z}}H = 0 \\;\\Rightarrow\\; H(t)=\\text{constante}',
        conn: 'La conservación aparece **por construcción**, porque $\\mathbf{J}_s$ es antisimétrica. Vale para el caso conservativo $c=0$, sin amortiguamiento ni fuerza externa.'
      },
    ],
    notes: '**Esta página es una derivación física:** no tiene función de costo ni optimización. La página siguiente toma estas mismas ecuaciones y las impone como **estructura** de una red.',
    refs: [
      "Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.",
      "Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.",
      "Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018."
    ]
  },
  {
    id: 'd1-puerta2',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '4 · Puerta ② · Forma fuerte',
    title: 'Puerta ② — Arquitectura (Hamiltonian NN)',
    lema: 'La física entra en la **estructura del modelo**: se cumple **por construcción** para todo $\\theta$.',
    derivation: ['$(q(t), p(t))$', '$f_{\\boldsymbol{\\theta}}$ — red neuronal', '$\\hat{H}_{\\boldsymbol{\\theta}}(q(t),p(t))$', '$\\nabla_{\\mathbf{z}}\\hat{H}_{\\boldsymbol{\\theta}}$ (autodiff)', '$\\mathbf{J}_s\\nabla_{\\mathbf{z}}\\hat{H}_{\\boldsymbol{\\theta}}$ → dinámica'],
    equations: [
      {
        heading: 'Entrada, salida y modelo',
        tex: '\\mathbf{z}(t)=(q(t), p(t))^{\\top}, \\qquad \\hat{H}_{\\boldsymbol{\\theta}}(\\mathbf{z}(t)) = f_{\\boldsymbol{\\theta}}(\\mathbf{z}(t)), \\qquad \\boldsymbol{\\theta}\\in\\Theta',
        conn: 'La red aprende una **función escalar** del estado canónico: no predice la trayectoria y **no requiere etiquetas de energía**. La entrada es $\\mathbf{z}=(q,p)^{\\top}$ y la salida es un escalar.'
      },
      {
        heading: 'Estructura Hamiltoniana (la física por construcción)',
        tex: '\\hat{\\mathbf{v}}_{\\boldsymbol{\\theta}}(\\mathbf{z}) = \\mathbf{J}_s\\,\\nabla_{\\mathbf{z}}\\hat{H}_{\\boldsymbol{\\theta}}(\\mathbf{z}), \\qquad \\dot{q} = \\partial_{p}\\hat{H}_{\\boldsymbol{\\theta}}, \\quad \\dot{p} = -\\partial_{q}\\hat{H}_{\\boldsymbol{\\theta}}',
        conn: 'Son las ecuaciones de Hamilton de la página anterior aplicadas al Hamiltoniano **aprendido**: $\\nabla_{\\mathbf{z}}\\hat H_{\\boldsymbol{\\theta}}$ deriva respecto al estado; la optimización de la red deriva el costo respecto a $\\boldsymbol{\\theta}$. La estructura física se cumple para todo $\\boldsymbol{\\theta}$. '
      },
      {
        heading: 'Función de costo: riesgo esperado',
        tex: 'J_{\\mathrm{HNN}}(\\boldsymbol{\\theta}) = \\mathbb{E}_{(\\mathbf{z},\\mathbf{v})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{v} - \\hat{\\mathbf{v}}_{\\boldsymbol{\\theta}}(\\mathbf{z}) \\rVert_{2}^{2} \\right], \\qquad \\mathbf{v} = (\\dot{q}, \\dot{p})^{\\top}',
        conn: 'El criterio compara las **derivadas temporales observadas** $\\mathbf{v}$ con las que predice el gradiente del Hamiltoniano aprendido.'
      },
      {
        heading: 'Aproximación empírica',
        tex: '\\widehat{J}_{\\mathrm{HNN},N}(\\boldsymbol{\\theta}) = \\frac{1}{N}\\sum_{n=1}^{N}\\left[ \\left( \\dot{q}(t_n) - \\partial_{p}\\hat{H}_{\\boldsymbol{\\theta}}(\\mathbf{z}_n) \\right)^{2} + \\left( \\dot{p}(t_n) + \\partial_{q}\\hat{H}_{\\boldsymbol{\\theta}}(\\mathbf{z}_n) \\right)^{2} \\right]',
        conn: 'Promedio sobre las $N$ observaciones; si las velocidades no se miden, se estiman por diferencias finitas.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\boldsymbol{\\theta}^{*} \\in \\arg\\min_{\\boldsymbol{\\theta}} J_{\\mathrm{HNN}}(\\boldsymbol{\\theta}), \\qquad \\widehat{\\boldsymbol{\\theta}} \\in \\arg\\min_{\\boldsymbol{\\theta}} \\widehat{J}_{\\mathrm{HNN},N}(\\boldsymbol{\\theta})',
        conn: 'La forma poblacional define el objetivo; el entrenamiento resuelve la empírica. La estructura se cumple por construcción, pero reproducir la dinámica real depende del **entrenamiento y los datos**.'
      },
    ],
    notes: '**Mensaje clave:** la HNN no aprende la trayectoria: aprende $\\hat{H}_\\theta$ y sus derivadas determinan la dinámica; un integrador recupera $(q(t), p(t))$.',
    refs: [
      "Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.",
      "Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.",
      "Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018."
    ]
  },
  {
    id: 'd1-puerta2-lagrange-deriv',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '4 · Puerta ② · Fundamentación lagrangiana',
    title: 'Puerta ② — Del Lagrangiano a la dinámica del masa-resorte',
    lema: 'De dónde sale la regla de evolución que la LNN impone como estructura: cuatro pasos desde $L=T-V$ hasta la EDO del MR ($c=0$).',
    equations: [
      {
        heading: 'Paso 1 · Construcción del Lagrangiano',
        tex: 'T = \\frac{m\\,(\\frac{d}{dt} q(t))^{2}}{2}, \\qquad V = \\frac{k\\,q(t)^{2}}{2}, \\qquad L = T - V = \\frac{m\\,(\\frac{d}{dt} q(t))^{2}}{2} - \\frac{k\\,q(t)^{2}}{2}',
        conn: 'El Lagrangiano es energía cinética **menos** potencial, con las mismas $m$, $k$ y la misma trayectoria del sistema. $\\frac{d}{dt} q(t)$ es la velocidad (el $\\dot{q}$ clásico); $\\frac{d}{dt}$ ya quedó definida en la página del sistema.'
      },
      {
        heading: 'Paso 2 · Ecuación de Euler–Lagrange',
        tex: '\\frac{d}{dt}\\!\\left( \\frac{\\partial L}{\\partial \\dot{q}} \\right) - \\frac{\\partial L}{\\partial q} = 0, \\qquad \\frac{\\partial L}{\\partial \\dot{q}} = m\\,\\dot{q}(t), \\quad \\frac{\\partial L}{\\partial q} = -k\\,q(t)',
        conn: 'La regla de evolución es el principio de acción: las derivadas parciales de $L$ respecto a la posición y a la velocidad determinan la dinámica.'
      },
      {
        heading: 'Paso 3 · Recuperación de la ecuación física',
        tex: '\\frac{d}{dt}\\!\\left( m\\,\\frac{d}{dt} q(t) \\right) + k\\,q(t) = 0 \\;\\Rightarrow\\; m\\,\\frac{d^{2}}{dt^{2}}q(t) + k\\,q(t) = 0',
        conn: 'Es exactamente la EDO del masa-resorte **conservativo** ($c=0$, sin amortiguamiento ni fuerza externa): la dinámica sale de $L$ por derivación, no se aprende.'
      },
      {
        heading: 'Paso 4 · Equivalencia hamiltoniana (transformada de Legendre)',
        tex: 'p(t) = \\frac{\\partial L}{\\partial \\dot{q}} = m\\,\\dot{q}(t) \\;\\Rightarrow\\; H = p(t)\\,\\dot{q}(t) - L = \\frac{p(t)^{2}}{2m} + \\frac{k\\,q(t)^{2}}{2}',
        conn: 'La transformada de Legendre pasa de $L$ a $H$ y recupera el Hamiltoniano de la página anterior: para el caso conservativo ambas formulaciones son equivalentes.'
      },
    ],
    notes: '**Esta página es un desarrollo físico:** no tiene función de costo ni optimización. La página siguiente toma esta misma regla y la impone como **estructura** de una red.',
    refs: [
      "Cranmer, Greydanus, Hoyer, Battaglia, Spergel, Ho. Lagrangian Neural Networks. ICLR, 2020.",
      "Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.",
      "Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018."
    ]
  },
  {
    id: 'd1-puerta2-lagrange',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '4 · Puerta ② · Forma fuerte (Lagrangian NN)',
    title: 'Puerta ② — Arquitectura (Lagrangian NN)',
    lema: 'La física entra en la **estructura del modelo**: se cumple **por construcción** para todo $\\theta$, ahora a través del principio de acción.',
    derivation: ['$(\\mathbf{q}(t), \\dot{\\mathbf{q}}(t))$', '$f_{\\boldsymbol{\\theta}}$ — red neuronal', '$\\hat{L}_{\\boldsymbol{\\theta}}(\\mathbf{q},\\dot{\\mathbf{q}})$', '$\\nabla_{(\\mathbf{q},\\dot{\\mathbf{q}})}\\hat{L}_{\\boldsymbol{\\theta}}$ (autodiff)', 'Euler–Lagrange → aceleración vectorial'],
    equations: [
      {
        heading: 'Entrada, salida y modelo',
        tex: '\\mathbf{z}(t) = \\left( \\mathbf{q}(t), \\dot{\\mathbf{q}}(t) \\right)^{\\top}, \\qquad \\hat{L}_{\\boldsymbol{\\theta}}(\\mathbf{z}(t)) = f_{\\boldsymbol{\\theta}}(\\mathbf{z}(t)), \\qquad \\boldsymbol{\\theta}\\in\\Theta',
        conn: 'La red aprende un **Lagrangiano escalar**: no predice la trayectoria y **no requiere etiquetas** del Lagrangiano físico.'
      },
      {
        heading: 'Modelo dinámico: Euler–Lagrange y aceleración predicha',
        tex: '\\hat{\\mathbf{a}}_{\\boldsymbol{\\theta}}(\\mathbf{z}) = \\mathbf{H}_{\\dot{\\mathbf{q}}\\dot{\\mathbf{q}}}^{-1}\\!\\left[ \\nabla_{\\mathbf{q}}\\hat{L}_{\\boldsymbol{\\theta}} - \\mathbf{H}_{\\dot{\\mathbf{q}}\\mathbf{q}}\\,\\dot{\\mathbf{q}} \\right]',
        conn: 'Para $\\mathbf{q}\\in\\mathbb{R}^{d}$, $\\mathbf{H}_{\\dot{\\mathbf{q}}\\dot{\\mathbf{q}}}=\\partial(\\nabla_{\\dot{\\mathbf{q}}}\\hat{L})/\\partial\\dot{\\mathbf{q}}^{\\top}\\in\\mathbb{R}^{d\\times d}$ y $\\mathbf{H}_{\\dot{\\mathbf{q}}\\mathbf{q}}=\\partial(\\nabla_{\\dot{\\mathbf{q}}}\\hat{L})/\\partial\\mathbf{q}^{\\top}\\in\\mathbb{R}^{d\\times d}$. Sigue de $\\frac{d}{dt}(\\nabla_{\\dot{\\mathbf{q}}}\\hat{L})-\\nabla_{\\mathbf{q}}\\hat{L}=\\mathbf{0}$ para un Lagrangiano autónomo. Requiere que $\\mathbf{H}_{\\dot{\\mathbf{q}}\\dot{\\mathbf{q}}}$ sea invertible; los productos tienen dimensión $d$ y el orden de factores se fija por sus dimensiones.'
      },
      {
        heading: 'Función de costo: riesgo esperado',
        tex: 'J_{\\mathrm{LNN}}(\\boldsymbol{\\theta}) = \\mathbb{E}_{\\mathbf{z}\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{a} - \\hat{\\mathbf{a}}_{\\boldsymbol{\\theta}}(\\mathbf{z}) \\rVert_{2}^{2} \\right], \\qquad \\mathbf{a} = \\ddot{\\mathbf{q}}',
        conn: 'El objetivo es la **aceleración**: se compara la observada $\\mathbf{a}$ con la que induce el Lagrangiano aprendido.'
      },
      {
        heading: 'Aproximación empírica',
        tex: '\\widehat{J}_{\\mathrm{LNN},N}(\\boldsymbol{\\theta}) = \\frac{1}{N}\\sum_{n=1}^{N}\\left\\lVert \\mathbf{a}_n - \\hat{\\mathbf{a}}_{\\boldsymbol{\\theta}}(\\mathbf{z}_n) \\right\\rVert_{2}^{2}',
        conn: 'Promedio sobre las $N$ observaciones; si sólo hay posición medida, la aceleración se estima por diferencias finitas.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\boldsymbol{\\theta}^{*} \\in \\arg\\min_{\\boldsymbol{\\theta}} J_{\\mathrm{LNN}}(\\boldsymbol{\\theta}), \\qquad \\widehat{\\boldsymbol{\\theta}} \\in \\arg\\min_{\\boldsymbol{\\theta}} \\widehat{J}_{\\mathrm{LNN},N}(\\boldsymbol{\\theta})',
        conn: 'La estructura Euler–Lagrange se impone **por construcción**; reproducir la dinámica real depende del entrenamiento. No se añade una penalización física separada.'
      },
    ],
    notes: '**Mensaje clave:** la LNN tampoco aprende la trayectoria: aprende $\\hat{L}_{\\boldsymbol{\\theta}}$ y Euler–Lagrange convierte sus derivadas en la aceleración; un integrador recupera $(\\mathbf{q}(t), \\dot{\\mathbf{q}}(t))$.',
    refs: [
      'Cranmer, Greydanus, Hoyer, Battaglia, Spergel, Ho. Lagrangian Neural Networks. ICLR, 2020.',
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018.'
    ]
  },
  {
    id: 'd1-puerta2-vs',
    module: 'd1',
    tone: 'purple',
    kind: 'wide',
    kicker: '4 · Puerta ② · Comparativa',
    title: 'Hamiltoniano vs Lagrangiano: cuándo usar una u otra',
    table: [
      ['Criterio', 'Hamiltoniano $H(q, p)$', 'Lagrangiano $L(q, \\dot{q})$'],
      [
        'Variables de estado',
        'Coordenadas canónicas $(q(t), p(t))$: el momento $p = m\\,\\dot{q}(t)$ hay que construirlo.',
        'Coordenadas generalizadas $(q(t), \\dot{q}(t))$ directas de los datos; el momento se deriva después: $p = \\partial L / \\partial \\dot{q}$.',
      ],
      [
        'Función escalar',
        '$H = T + V$ — energía total (cinética + potencial).',
        '$L = T - V$ — densidad de acción (cinética − potencial).',
      ],
      [
        'Regla de evolución',
        'Dos ecuaciones de primer orden: $\\dot{q}(t) = \\partial H / \\partial p$, $\\dot{p}(t) = -\\partial H / \\partial q$ (forma vectorial $\\dot{\\mathbf{z}}=\\mathbf{J}_s\\nabla_{\\mathbf{z}}H(\\mathbf{z})$).',
        'Una ecuación de Euler–Lagrange de segundo orden: $\\frac{d}{dt}\\,\\frac{\\partial L}{\\partial \\dot{q}} - \\frac{\\partial L}{\\partial q} = 0$.',
      ],
      [
        'Marco y conservación',
        'Espacio de fases simpléctico; $H(t) =$ constante por construcción (integradores simplécticos).',
        'Principio de acción (extremizar la acción); la conservación se hereda de la simetría temporal.',
      ],
      [
        'Red equivalente (puerta ②)',
        'HNN: $f_\\theta(q(t), p(t)) \\mapsto H_\\theta$; pérdida sobre $(\\dot{q}, \\dot{p})$ en $t_n$.',
        'LNN: $f_\\theta(q(t), \\dot{q}(t)) \\mapsto L_\\theta$; pérdida sobre las aceleraciones $\\ddot{q}(t_n)$.',
      ],
      [
        'Paso de una a otra (Legendre)',
        '$H(q, p) = p\\,\\dot{q} - L(q, \\dot{q})$ con $p = \\partial L / \\partial \\dot{q}$ (inversa: $\\dot{q} = \\partial H / \\partial p$).',
        'Para el MR ($c = 0$): $p = m\\,\\dot{q}(t) \\Rightarrow L = T - V \\Leftrightarrow H = T + V$ — misma trayectoria.',
      ],
      [
        'Cuándo recomendarla',
        'Sistema conservativo con $(q, p)$ a mano o construibles; predicción a largo plazo donde importa la energía exacta (órbitas, osciladores, estructura simpléctica).',
        'Datos en $(q, \\dot{q})$ o coordenadas generalizadas con restricciones/vínculos; cuando los momentos deben derivarse y no se miden.',
      ],
    ],
    bullets: [
      '**Regla práctica:** si necesitas momento y espacio de fases explícitos → **hamiltoniano**; si trabajas con posiciones y velocidades (o coordenadas con vínculos) → **lagrangiano**.',
      '**Advertencia:** las dos formas estándar asumen $c = 0$ (sin disipación); con amortiguamiento hay que añadir fuerzas generalizadas o disipación de Rayleigh — fuera del alcance de la puerta ② en este deck.',
    ],
    equations: [
      {
        heading: 'Paso de una a otra: transformada de Legendre',
        tex: 'p = \\frac{\\partial L}{\\partial \\dot{q}} \\;\\Longleftrightarrow\\; \\dot{q} = \\frac{\\partial H}{\\partial p}, \\qquad H(q, p) = p\\,\\dot{q} - L(q, \\dot{q})',
        conn: '**Conexión:** puente exacto entre las dos columnas — para el MR ($c = 0$), $p = m\\,\\dot{q}(t)$ lleva de $L = T - V$ a $H = T + V$ y ambas producen la misma trayectoria $x(t)$.',
      },
    ],
    refs: [
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.',
      'Goldstein, Poole, Safko. Classical Mechanics — coordenadas canónicas y transformada de Legendre.',
    ],
  },
  {
    id: 'd1-puerta2-diagram',
    module: 'd1',
    tone: 'purple',
    kind: 'diagram',
    kicker: '4 · Puerta ② · Forma fuerte · diagrama',
    diagram: 'mr2',
    diagramTitle: 'MR · Puerta ② — flujo de una HNN · la física entra en la estructura',
    legend: [
      { color: '#1E3A5F', label: 'Sistema físico / variables (q, p)' },
      { color: '#16A085', label: 'Datos y medición' },
      { color: '#7D3C98', label: 'Red HNN · $H_\\theta$ · autodiff · estructura' },
      { color: '#E67E22', label: 'Comparación $\\to \\mathcal{L}_{HNN}(\\theta)$' },
      { color: '#C0392B', label: 'Optimización → $\\theta^{*}$' },
    ],
  },
  {
    id: 'd1-puerta3',
    module: 'd1',
    tone: 'cyan',
    kind: 'door',
    kicker: '4 · Puerta ③ · Física en los datos',
    title: 'Puerta ③ — Física en los datos / features',
    lema: 'La física entra **en los datos/features**: indirectamente, antes del modelo.',
    equations: [
      {
        heading: 'Modelo (entrada aumentada)',
        tex: '\\tilde{\\mathbf{x}} = \\left[ \\mathbf{x},\\; \\psi_{fis}(\\mathbf{x}) \\right], \\qquad \\psi_{fis} = \\left[\\, x(t),\\; \\dot{x}(t),\\; E(t) \\,\\right], \\qquad E(t) = \\tfrac{1}{2} m \\dot{x}(t)^2 + \\tfrac{1}{2} k\\,x(t)^2',
        conn: '**Conexión:** para el MR las features son el espacio de fases y la energía; el bloque "Features ψ_fis" transforma la entrada antes de $f_\\theta$.',
      },
      {
        heading: 'Función de pérdida (sobre datos aumentados)',
        tex: '\\mathcal{L}_{MSE}(\\theta) = \\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| f_\\theta(\\tilde{\\mathbf{x}}_i) - y(t_i) \\right|^2',
        conn: '**Conexión:** la física no aparece como término de penalización: vive en la entrada aumentada $\\tilde{\\mathbf{x}}$ y en las features $\\psi_{fis}$.',
      },
      {
        heading: 'Problema de optimización (sobre $\\tilde{\\mathbf{x}}$ aumentado, + bottleneck)',
        tex: '\\theta^* = \\arg\\min_{\\theta \\in \\Theta}\\; \\mathcal{L}_{MSE}(\\theta; \\tilde{\\mathbf{x}}), \\qquad \\mathbf{z}_{bot} = E(t)',
        conn: '**Conexión:** el problema se plantea sobre la entrada aumentada $\\tilde{\\mathbf{x}}$; en la variante con bottleneck la latente $\\mathbf{z}_{bot}$ queda restringida a un significado físico explícito (Hao 2022).',
      },
    ],
    refs: [
      'Hao et al. PIML: A Survey on Problems, Methods and Applications. arXiv:2211.08064, 2022.',
      'Willard et al. ACM Computing Surveys, 2022.',
      'Machine Learning with Physics Knowledge for Prediction: A Survey. arXiv:2408.09840.',
    ],
  },
  {
    id: 'd1-puerta3-diagram',
    module: 'd1',
    tone: 'cyan',
    kind: 'diagram',
    kicker: '4 · Puerta ③ · Física en los datos · diagrama',
    diagram: 'mr3',
    diagramTitle: 'MR · Puerta ③ — la física entra en los datos / features',
    legend: [
      { color: '#1E3A5F', label: 'Sistema MR / física' },
      { color: '#16A085', label: '③ Datos / features' },
      { color: '#34495E', label: 'Modelo ML $f_\\theta$' },
      { color: '#C0392B', label: 'Minimización → $\\theta^{*}$' },
    ],
  },
  {
    id: 'd1-puerta4',
    module: 'd1',
    tone: 'blue',
    kind: 'wide',
    kicker: '4 · Puerta ④ · Híbrido',
    title: 'Puerta ④ — Híbrido simulador + red (grey-box)',
    bullets: [
      '**¿Por qué existen?:** un simulador confiable **subvenciona** a la red: $f_{fis}$ da la predicción base —interpretable y físicamente correcta— y $g_\\theta$ aprende solo el residuo.',
      '**¿Cuándo se eligen sobre la PINN pura?:** cuando existe un simulador/ley confiable y el riesgo de soluciones no físicas del entrenamiento PINN es alto; hereda la tradición grey-box de identificación de parámetros.',
    ],
    equations: [
      {
        heading: '④ Híbrido simulador + red (grey-box)',
        tex: '\\hat{y} = \\underbrace{f_{fis}(\\mathbf{x})}_{\\text{predicción base física}} + \\underbrace{g_\\theta(\\mathbf{x})}_{\\text{residuo aprendido}} \\quad \\text{o} \\quad \\hat{y} = g_\\theta\\bigl(\\mathbf{x},\\, f_{fis}(\\mathbf{x})\\bigr)',
        conn: '**Conexión:** residual learning y feature stacking; tradición grey-box (Bacher & Madsen 2011).',
      },
    ],
    refs: [
      'Bacher & Madsen. Identifying suitable models for the heat dynamics of buildings. Energy and Buildings 43, 2011.',
    ],
  },

  // ── §5 Diagrama 2 — Familias PIML para TS ───────────────────────────────
  {
    id: 'd1b-directo-inverso',
    module: 'd1',
    tone: 'blue',
    kind: 'split',
    kicker: '4b · Problemas directos e inversos',
    title: 'Problema directo y problema inverso',
    bullets: [
      'El **directo** calcula la respuesta del sistema: parámetros conocidos, salida desconocida.',
      'El **inverso** identifica los parámetros físicos a partir de mediciones de la salida.',
    ],
    equations: [
      {
        heading: 'Modelo físico y parámetros',
        tex: '\\begin{aligned} m\\,\\frac{d^{2}}{dt^{2}}x(t) + c\\,\\frac{d}{dt} x(t) + k\\,x(t) &= F(t) \\\\[3pt] \\boldsymbol{\\phi} &= (m, c, k)^{\\top} \\end{aligned}',
        conn: 'Mismo sistema masa-resorte-amortiguador del deck; $F(t)$ es la excitación y $\\boldsymbol{\\phi}$ reúne los parámetros físicos.'
      },
      {
        heading: 'Los dos sentidos',
        tex: '\\boldsymbol{\\phi} \\longrightarrow x(t;\\boldsymbol{\\phi}), \\qquad\\{t_i, x_i^{obs}\\}_{i=1}^{N} \\longrightarrow \\widehat{\\boldsymbol{\\phi}}',
        conn: 'El directo **evalúa** el modelo; el inverso **ajusta** parámetros. Se usan las mismas ecuaciones en sentidos opuestos.'
      },
    ],
    diagram: 'directoInverso',
    diagramTitle: 'Directo: parámetros → salida · Inverso: mediciones → parámetros',
    legend: [
      { color: '#7D3C98', label: 'Parámetros físicos $\\boldsymbol{\\phi}$' },
      { color: '#2E86AB', label: 'Modelo físico / salida' },
      { color: '#E67E22', label: 'Mediciones y estimación' },
    ],
    notes: '**Idea clave:** el directo es una evaluación; el inverso, una estimación. La PINN entra cuando el solucionador clásico es costoso o cuando hay que estimar $\\boldsymbol{\\phi}$ junto con la solución.'
  },
  {
    id: 'd1b-clasicos',
    module: 'd1',
    tone: 'blue',
    kind: 'split',
    kicker: '4b · Problemas directos e inversos',
    title: 'Resolverlos sin redes neuronales',
    bullets: [
      '**Directo:** integración analítica o numérica — Euler, Runge–Kutta, Newmark-$\\beta$.',
      '**Inverso:** simulación repetida más optimización sobre los parámetros.',
    ],
    equations: [
      {
        heading: 'Directo: esquema de Euler',
        tex: '\\begin{aligned} x_{n+1} &= x_n + \\Delta t\\,v_n \\\\[3pt] v_{n+1} &= v_n + \\Delta t\\,\\frac{F_n - c\\,v_n - k\\,x_n}{m} \\end{aligned}',
        conn: 'Un paso de integración por iteración: el estado $(x_n,v_n)$ avanza con el paso $\\Delta t$. Runge–Kutta y Newmark-$\\beta$ mejoran precisión y estabilidad.'
      },
      {
        heading: 'Inverso: mínimos cuadrados sobre la simulación',
        tex: '\\widehat{\\boldsymbol{\\phi}} = \\arg\\min_{\\boldsymbol{\\phi}}\\sum_{i=1}^{N}\\left( x(t_i;\\boldsymbol{\\phi}) - x_i^{obs} \\right)^{2}',
        conn: 'Cada evaluación del objetivo exige resolver el directo: el costo crece con el número de iteraciones del optimizador.'
      },
    ],
    diagram: 'inversoIterativo',
    diagramTitle: 'Estimación clásica: simular, comparar y optimizar en bucle',
    legend: [
      { color: '#7D3C98', label: 'Parámetros $\\boldsymbol{\\phi}$' },
      { color: '#2E86AB', label: 'Solver numérico' },
      { color: '#E67E22', label: 'Comparación y optimización' },
    ],
    notes: 'Los métodos clásicos resuelven el directo y, combinados con un optimizador, el inverso. Su límite es el costo por evaluación del solucionador.'
  },
  {
    id: 'd1b-red-fisica',
    module: 'd1',
    tone: 'blue',
    kind: 'split',
    kicker: '4b · PINN para identificación',
    title: 'Red neuronal: predicción e identificación',
    table: [
      ['Parámetros de red', 'Parámetros físicos'],
      ['$\\boldsymbol{\\theta}$', '$\\boldsymbol{\\phi}$'],
      ['Pesos y sesgos', '$m, c, k$'],
      ['Aproximan la salida', 'Describen el sistema'],
      ['Sin interpretación física directa', 'Interpretables físicamente'],
    ],
    equations: [
      {
        heading: 'Salida neuronal',
        tex: '\\widehat{x}(t) = f_{\\boldsymbol{\\theta}}(t)',
        conn: 'La red recibe **sólo el tiempo**, igual que en la puerta ①; no recibe la física.'
      },
      {
        heading: 'Residuo físico',
        tex: '\\mathcal{R}(t) = m\\,\\frac{d^{2}}{dt^{2}}\\widehat{x}(t) + c\\,\\frac{d}{dt}\\widehat{x}(t) + k\\,\\widehat{x}(t) - F(t)',
        conn: 'La **diferenciación automática** entrega $\\frac{d}{dt}\\widehat{x}$ y $\\frac{d^{2}}{dt^{2}}\\widehat{x}$ sin malla: con ellas se evalúa la ecuación física en cualquier instante.'
      },
    ],
    diagram: 'residuoAutodiff',
    diagramTitle: 'Del tiempo al residuo: derivadas automáticas de la salida',
    legend: [
      { color: '#2E86AB', label: 'Red y salida' },
      { color: '#7D3C98', label: 'Derivadas automáticas' },
      { color: '#E67E22', label: 'Residuo físico' },
    ],
    notes: 'La red aproxima la salida con $\\boldsymbol{\\theta}$ y, en la variante inversa, los parámetros físicos $\\boldsymbol{\\phi}$ se tratan como incógnitas adicionales del mismo problema.'
  },
  {
    id: 'd1b-pinn-inversa',
    module: 'd1',
    tone: 'blue',
    kind: 'split',
    kicker: '4b · PINN para identificación',
    title: 'Optimización conjunta de una PINN inversa',
    equations: [
      {
        heading: 'Pérdida compuesta',
        tex: '\\mathcal{L}(\\boldsymbol{\\theta},\\boldsymbol{\\phi}) = \\lambda_d\\mathcal{L}_d + \\lambda_f\\mathcal{L}_f + \\lambda_0\\mathcal{L}_0 + \\mathcal{L}_{\\mathrm{prior}}',
        conn: '$\\mathcal{L}_d$: ajuste a mediciones · $\\mathcal{L}_f$: cumplimiento de la física · $\\mathcal{L}_0$: condiciones iniciales · $\\mathcal{L}_{\\mathrm{prior}}$: regularización física.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\boldsymbol{\\psi}} = \\arg\\min_{\\boldsymbol{\\psi}} \\mathcal{L}(\\boldsymbol{\\psi}), \\qquad \\boldsymbol{\\psi}=\\begin{bmatrix}\\boldsymbol{\\theta}\\\\\\boldsymbol{\\phi}\\end{bmatrix}',
        conn: 'Los bloques tienen dimensiones $\\boldsymbol{\\theta}\\in\\mathbb{R}^{n_\\theta}$, $\\boldsymbol{\\phi}\\in\\mathbb{R}^{n_\\phi}$ y $\\boldsymbol{\\psi}\\in\\mathbb{R}^{n_\\theta+n_\\phi}$. Se optimizan simultáneamente: $\\boldsymbol{\\theta}$ parametriza la red y $\\boldsymbol{\\phi}$ la física.'
      },
      {
        heading: 'Gradiente por bloques (pérdida diferenciable)',
        tex: '\\nabla_{\\boldsymbol{\\psi}}\\mathcal{L}=\\begin{bmatrix}\\nabla_{\\boldsymbol{\\theta}}\\mathcal{L}\\\\\\nabla_{\\boldsymbol{\\phi}}\\mathcal{L}\\end{bmatrix}',
        conn: 'La primera componente tiene $n_\\theta$ elementos y la segunda $n_\\phi$; el gradiente conjunto tiene dimensión $n_\\theta+n_\\phi$. Para una función diferenciable no restringida, el gradiente nulo es condición necesaria de estacionariedad, no garantía de mínimo global.'
      },
    ],
    diagram: 'pinnConjunta',
    diagramTitle: 'Un solo bucle: tiempo → red → pérdidas → optimizador → actualización',
    legend: [
      { color: '#2E86AB', label: 'Red $f_{\\boldsymbol{\\theta}}$' },
      { color: '#E67E22', label: 'Pérdidas y optimizador' },
      { color: '#7D3C98', label: 'Parámetros físicos $\\boldsymbol{\\phi}$' },
    ],
    notes: 'Diferenciar los dos grupos de parámetros es lo que separa una PINN directa (sólo $\\boldsymbol{\\theta}$) de una PINN inversa ($\\boldsymbol{\\theta}$ y $\\boldsymbol{\\phi}$).',
    refs: [
      'Prayoga & Husni. An inverse problem of determining the parameters in multiphysics problem by using fractional physics-informed neural networks. 2025.',
      'Karkadakattil. Physics-informed digital twin for robust inverse parameter identification under sparse and noisy measurements. 2026.'
    ]
  },
  {
    id: 'd1b-convergencia',
    module: 'd1',
    tone: 'blue',
    kind: 'split',
    kicker: '4b · Convergencia e incertidumbre',
    title: 'Convergencia, identificabilidad e incertidumbre',
    table: [
      ['Dificultad', 'Estrategia'],
      ['Mínimos locales', 'Múltiples inicializaciones'],
      ['Pérdidas desbalanceadas', 'Ajuste de ponderaciones'],
      ['Gradientes inestables', 'Normalización y escalado'],
      ['Sensibilidad al entrenamiento', 'Adam y luego L-BFGS'],
      ['Ruido y pocos datos', 'Regularización y validación'],
    ],
    equations: [
      {
        heading: 'Identificabilidad en vibración libre',
        tex: '\\frac{d^{2}}{dt^{2}}x + \\frac{c}{m}\\,\\frac{d}{dt} x + \\frac{k}{m}\\,x = 0 \\;\\Rightarrow\\; \\text{sólo } c/m \\text{ y } k/m \\text{ son identificables}',
        conn: 'Con sólo desplazamientos, la escala de masa es arbitraria: los parámetros individuales no se identifican aunque sus cocientes sí.'
      },
      {
        heading: 'Ensemble: media y dispersión',
        tex: '\\overline{x}(t) = \\frac{1}{M}\\sum_{j=1}^{M}\\widehat{x}^{(j)}(t), \\qquad s_x(t) = \\sqrt{\\frac{1}{M-1}\\sum_{j=1}^{M}\\left( \\widehat{x}^{(j)}(t) - \\overline{x}(t) \\right)^{2}}',
        conn: 'La banda es **dispersión del ensemble**, no un intervalo de confianza ni predictivo con cobertura garantizada; conviene declararlo y analizar también la incertidumbre de $\\boldsymbol{\\phi}$.'
      },
    ],
    diagram: 'bandaEnsemble',
    diagramTitle: 'Trayectoria media del ensemble con banda de dispersión',
    legend: [
      { color: '#2E86AB', label: 'Media $\\overline{x}(t)$' },
      { color: '#E67E22', label: 'Dispersión $\\pm 2s_x$' },
    ],
    notes: '**Cierre:** la incertidumbre se analiza en los dos niveles —parámetros físicos y salida— y se reporta qué significa la banda que se dibuja.',
    refs: [
      'Prayoga & Husni. An inverse problem of determining the parameters in multiphysics problem by using fractional physics-informed neural networks. 2025.',
      'Karkadakattil. Physics-informed digital twin for robust inverse parameter identification under sparse and noisy measurements. 2026.'
    ]
  },
  {
    id: 'd2-figura',
    module: 'd2',
    tone: 'purple',
    kind: 'split',
    kicker: '5 · Diagrama 2',
    title: 'Familias PIML para series de tiempo (todas las aplicaciones)',
    bullets: [
      'Punto de partida común: la serie $y[t]$ observa un sistema dinámico gobernado por una ley $\\mathcal{F}[u] = 0$ total o parcialmente conocida.',
      '**F1** PINN · **F2** PG-RNN · **F3** Neural ODE/SDE · **F4** física latente (PhyDNet) · **F5** kernel/GPR · **F6** física embebida (PINT/RFF).',
    ],
    diagram: 'd2',
    diagramTitle: 'Diagrama 2 · Seis familias PIML para series de tiempo',
    legend: [
      { color: '#1E3A5F', label: 'Serie de tiempo (cabeza)' },
      { color: '#2E86AB', label: 'F1 · madura' },
      { color: '#5B8DBE', label: 'F3, F4 · media' },
      { color: '#16A085', label: 'F2, F5 · nicho' },
      { color: '#E67E22', label: 'F6 · emergente' },
    ],
    refs: [
      'Raissi et al., J. Comp. Physics 378, 2019 (F1) · Karpatne et al., arXiv:1710.11431 (F2) · Greydanus NeurIPS 2019 / Chen NeurIPS 2018 (F3) · Le Guen & Thome, CVPR 2020 (F4) · Doumèche 2025 / Tartakovsky IJF 2023 (F5) · PINT, arXiv:2502.04018 (F6).',
    ],
  },
  {
    id: 'd2-mat-1',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '5 · Matemática del Diagrama 2',
    title: 'F1 — PINN sobre EDO/EDP · F2 — Physics-guided RNN',
    equations: [
      {
        heading: 'F1 · La red aproxima la solución del sistema dinámico',
        tex: '\\partial_t u + \\mathcal{F}[u] = 0 \\;\\; \\text{en } \\Omega_T, \\qquad r_\\theta(t, \\mathbf{x}) = \\partial_t u_\\theta + \\mathcal{F}[u_\\theta]',
        conn:
          '**Conexión:** "la red aprende LA SOLUCIÓN" ↔ $u_\\theta(t, \\mathbf{x})$; el residuo se evalúa en los $N_c$ puntos de colocación $(t_j, \\mathbf{x}_j)$.',
      },
      {
        heading: 'F1 · Pérdida con puntos de colocación',
        tex: '\\mathcal{L}_{PINN}(\\theta) = \\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| u_\\theta(t_i, \\mathbf{x}_i) - u(t_i, \\mathbf{x}_i) \\right|^2 + \\lambda_{phys}\\,\\frac{1}{N_c}\\sum_{j=1}^{N_c} \\left\\| r_\\theta(t_j, \\mathbf{x}_j) \\right\\|^2, \\qquad \\hat{\\theta}=\\arg\\min_{\\theta}\\mathcal{L}_{PINN}(\\theta)',
      },
      {
        heading: 'F2 · Recurrencia estándar + término físico',
        tex: '\\mathbf{h}[t] = f_{RNN}(\\mathbf{x}[t], \\mathbf{h}[t-1]; \\theta_r), \\qquad \\hat{\\mathbf{y}}_{T+1:T+\\tau}=g_{\\theta}(\\mathbf{h}[T])\\in\\mathbb{R}^{\\tau}',
        conn:
          '**Conexión:** "recurrencia estándar" ↔ $f_{RNN}$; "consistencia temporal" ↔ $\\mathcal{L}_{EC}$ (línea PGML de Karpatne).',
      },
      {
        heading: 'F2 · Pérdida de consistencia temporal',
        tex: '\\mathcal{L}_{PG}(\\theta)=\\frac{1}{N}\\sum_{n=1}^{N}\\lVert\\mathbf{y}_{n+1:n+\\tau}-\\hat{\\mathbf{y}}_{n+1:n+\\tau}\\rVert_2^2+\\lambda_{phys}\\mathcal{L}_{EC}(\\theta), \\quad \\mathcal{L}_{EC}=\\sum_t\\lVert r_{EC}(\\hat{y}[t],\\hat{y}[t-1],\\mathbf{x}[t])\\rVert^2, \\quad \\hat{\\theta}=\\arg\\min_{\\theta}\\mathcal{L}_{PG}(\\theta)',
      },
    ],
  },
  {
    id: 'd2-mat-2',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '5 · Matemática del Diagrama 2',
    title: 'F3 — Neural ODE/SDE informados · F4 — Física en el espacio latente',
    equations: [
      {
        heading: 'F3 · Dinámica continua integrada con solver diferenciable',
        tex: '\\frac{d\\mathbf{h}(t)}{dt} = f_\\theta(\\mathbf{h}(t), t), \\qquad \\mathbf{h}(t_1) = \\mathbf{h}(t_0) + \\int_{t_0}^{t_1} f_\\theta(\\mathbf{h}(t), t)\\, dt',
        conn:
          '**Conexión:** "estructura física parcial" ↔ forma hamiltoniana (puerta ② del D1) o lagrangiana Euler–Lagrange (siguiente ecuación); variante estocástica con $dW_t$.',
      },
      {
        heading: 'F3 · Lagrangian NN (Euler–Lagrange)',
        tex: '\\frac{d}{dt}\\,\\frac{\\partial L_\\theta}{\\partial \\dot{q}} - \\frac{\\partial L_\\theta}{\\partial q} = 0',
        conn:
          '**Conexión:** $q = q(t)$ y $\\dot{q} = \\dot{q}(t)$ dependen del tiempo; las derivadas parciales son respecto a esas variables (puerta ②, formulación lagrangiana).',
      },
      {
        heading: 'F4 · PhyDNet: latente descompuesta física + residual',
        tex: '\\mathbf{z}[t] = \\mathbf{z}[t]^{phys} + \\mathbf{z}[t]^{res}, \\qquad \\hat{y}[t] = \\mathrm{Dec}(\\mathbf{z}[t]), \\qquad \\mathbf{z}[t]^{phys} = \\mathrm{PhyCell}(\\mathbf{z}[t-1]^{phys})',
        conn:
          '**Conexión:** "encoder → latente donde actúa la física → decoder" ↔ $\\mathrm{Enc}$, PhyCell, $\\mathrm{Dec}$; "física + residual" ↔ $\\mathbf{z}[t]^{phys} + \\mathbf{z}[t]^{res}$.',
      },
    ],
  },
  {
    id: 'd2-mat-3',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '5 · Matemática del Diagrama 2',
    title: 'F5 — Forecasting restringido · F6 — TS con física embebida',
    equations: [
      {
        heading: 'F5 · Kernel ridge con restricciones de forma',
        tex: '\\hat{f}_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\sum_{i=1}^{N} \\theta_i\\, \\kappa(\\mathbf{x}, \\mathbf{x}_i), \\qquad \\hat{\\boldsymbol{\\theta}} = (\\mathbf{K} + \\lambda_{rk} \\mathbf{I})^{-1} \\mathbf{y}',
        conn:
          '**Conexión:** "bounds, rampas, parabolicidad, estacionalidad" ↔ las restricciones sobre $f$; GPR con prior físico (formulación de Doumèche 2025 / PhI-GPR).',
      },
      {
        heading: 'F5 · GPR: distribución predictiva y estimación de hiperparámetros',
        tex: 'p(\\mathbf{y}_*\\mid\\mathbf{x}_*,\\mathcal{D})=\\mathcal{N}(\\boldsymbol{\\mu}_*,\\mathbf{\\Sigma}_*), \\quad \\boldsymbol{\\mu}_*=\\mathbf{K}_*^{\\top}(\\mathbf{K}+\\sigma_n^2\\mathbf{I})^{-1}\\mathbf{y}, \\quad \\mathbf{\\Sigma}_*=\\mathbf{K}_{**}-\\mathbf{K}_*^{\\top}(\\mathbf{K}+\\sigma_n^2\\mathbf{I})^{-1}\\mathbf{K}_*',
        conn: 'La media es la predicción puntual; $\\mathbf{\\Sigma}_*$ cuantifica incertidumbre predictiva. Esta forma corresponde a GP gaussiano con ruido gaussiano y kernel fijado. Los hiperparámetros se pueden estimar maximizando la verosimilitud marginal, no minimizando un MSE genérico.'
      },
      {
        heading: 'F5 · Verosimilitud marginal para hiperparámetros',
        tex: '\\hat{\\boldsymbol{\\eta}}=\\arg\\max_{\\boldsymbol{\\eta}}p(\\mathbf{y}\\mid\\mathbf{X},\\boldsymbol{\\eta})',
        conn: '$\\boldsymbol{\\eta}$ reúne parámetros del kernel y del ruido. Si se incorpora un prior sobre estos hiperparámetros, la estimación MAP maximiza $p(\\mathbf{y}\\mid\\mathbf{X},\\boldsymbol{\\eta})p(\\boldsymbol{\\eta})$; no se confunde con la distribución predictiva posterior.'
      },
      {
        heading: 'F6 · Prior físico cableado, sin EDP explícita',
        tex: '\\hat{\\mathbf{y}} = g_\\theta\\bigl(\\mathbf{X};\\, \\mathcal{P}_{fis}\\bigr)',
        conn:
          '**Conexión:** "inductive biases específicas" ↔ $\\mathcal{P}_{fis}$ dentro de $g_\\theta$; el RFF multibanda (Ecuación 24) es una instancia con prior espectral.',
      },
      {
        heading: 'F6 · RFF multibanda del artículo guía (Ecuación 24)',
        tex: '\\boldsymbol{\\phi}_k(\\mathbf{x}[t]) = \\sqrt{\\frac{2}{N_f}}\\,\\cos\\!\\left(\\mathrm{softplus}(\\rho_k)\\,\\mathbf{W}_k^\\top \\mathbf{x}[t] + \\mathbf{b}_k\\right)',
      },
    ],
  },

  {
    id: 'd2-objectives',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '5 · Familias PIML · objetivos por modelo',
    title: 'Neural ODE/SDE, PhyDNet y física embebida: salida y estimación',
    bullets: [
      'La estructura común identifica entradas, salidas y estimación; no borra las diferencias entre una trayectoria determinista, una dinámica estocástica y una arquitectura con prior físico.',
      'La pérdida de datos depende del tipo de salida y del modelo probabilístico; la física puede estar en la dinámica o la arquitectura, sin una penalización residual explícita.',
    ],
    equations: [
      {
        heading: 'F3 · SDE y estimación probabilística',
        tex: 'd\\mathbf{h}(t)=f_{\\theta}(\\mathbf{h}(t),t)dt+\\mathbf{G}_{\\theta}(\\mathbf{h}(t),t)d\\mathbf{W}_t, \\quad \\hat{\\theta}=\\arg\\min_{\\theta}[-\\log p_{\\theta}(\\mathbf{y}_{T+1:T+\\tau}\\mid\\mathbf{X}^{win}_{T-L+1:T})]',
        conn: 'La distribución predictiva se induce por la dinámica estocástica y el modelo de observación; si la verosimilitud no es tractable, se requiere el estimador aproximado correspondiente. Para la variante ODE determinista se usa la pérdida compatible con las observaciones, no se asume automáticamente una predictiva gaussiana.'
      },
      {
        heading: 'F4 · PhyDNet: ventana, latente físico/residual y salida',
        tex: '\\mathbf{z}=\\mathrm{Enc}_{\\theta}(\\mathbf{X}^{win}), \\quad \\hat{\\mathbf{y}}_{T+1:T+\\tau}=\\mathrm{Dec}_{\\theta}(\\mathbf{z}^{phys}_{T+\\tau},\\mathbf{z}^{res}_{T+\\tau}), \\quad \\hat{\\theta}=\\arg\\min_{\\theta}\\frac{1}{N}\\sum_{n=1}^{N}\\lVert\\mathbf{y}_{n+1:n+\\tau}-f_{\\theta}(\\mathbf{X}^{win}_n)\\rVert_2^2',
        conn: 'La evolución de los estados latentes mantiene las recurrencias física y residual descritas en la diapositiva anterior. La función de pérdida mostrada es el ajuste empírico de una predicción puntual; no afirma que sea el único objetivo posible de la familia.'
      },
      {
        heading: 'F6 · Física embebida en la arquitectura',
        tex: '\\hat{\\mathbf{Y}}=g_{\\theta}(\\mathbf{X}^{win};\\mathcal{P}_{fis}), \\qquad \\hat{\\theta}=\\arg\\min_{\\theta}\\frac{1}{N}\\sum_{n=1}^{N}\\mathcal{L}(\\mathbf{y}_{n+1:n+\\tau},g_{\\theta}(\\mathbf{X}^{win}_n;\\mathcal{P}_{fis}))',
        conn: 'El prior físico $\\mathcal{P}_{fis}$ forma parte de la arquitectura (como el embedding espectral RFF); si no hay residuo de ley física, no se inventa una pérdida PINN separada. La penalización convencional, si existe, se declara aparte.'
      }
    ]
  },

  // ── §6a Diagrama 3 — Familias data-driven E1–E8 ─────────────────────────
  {
    id: 'd3-figura',
    module: 'd3',
    tone: 'orange',
    kind: 'split',
    kicker: '6a · Diagrama 3',
    title: 'Familias data-driven en sistemas energéticos (SIN física)',
    bullets: [
      'El contraste necesario: la base contra la que se mide todo PIML energético — las 8 familias de la matriz SOTA 2022–2026.',
      '**E1** Estadísticos · **E2** ML clásico · **E3** Recurrentes · **E4** TCN · **E5** Transformers LTSF · **E6** SSM/Mamba · **E7** Fundacionales · **E8** Descomposición + híbridos (patrón dominante en carga).',
    ],
    diagram: 'd3',
    diagramTitle: 'Diagrama 3 · Familias data-driven (base sin física)',
    legend: [
      { color: '#95A5A6', label: 'Clásicos / tradicionales (E1–E2)' },
      { color: '#2E86AB', label: 'DL secuencial (E3–E4)' },
      { color: '#7D3C98', label: 'Moderno LTSF (E5–E7)' },
      { color: '#E67E22', label: 'Patrón dominante en carga (E8)' },
    ],
    refs: [
      'Matriz interna (32 papers ≥2022; hoja "Matriz Energia" con 25) · Kim et al., arXiv:2411.05793 · Kong et al., IJMLC 16, 2025 · Benchmark KIT-IAI, arXiv:2607.15705, 2026.',
    ],
  },
  {
    id: 'd3-mat-1-arima',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E1 — ARIMA: autorregresivo integrado de medias móviles',
    bullets: [
      '**Definición:** ARIMA$(p,d,q)$ modela la serie diferenciada $d$ veces con una parte autorregresiva (orden $p$) y una de medias móviles (orden $q$).',
      'Cambia el punto de partida: no hay $\\hat{\\mathbf{Y}}=\\mathbf{X}\\mathbf{W}$, sino dependencia de la propia serie y de sus errores pasados.',
    ],
    equations: [
      {
        heading: 'Entrada y salida',
        tex: 'y[1:T]=(y[1],\\ldots,y[T]), \\qquad \\hat{y}_\\eta[t]=\\mathbb{E}_\\eta\\!\\left[ y[t] \\mid y[1:t-1] \\right], \\qquad \\hat{\\mathbf{y}}_{T+1:T+\\tau}\\in\\mathbb{R}^{\\tau}',
        conn: 'La entrada es la serie observada hasta $T$; la salida es la predicción condicional a su propio pasado, no una matriz de características. $\\tau$ es el horizonte, como en el resto del diagrama.'
      },
      {
        heading: 'Modelo ARIMA($p,d,q$)',
        tex: '\\begin{aligned} \\phi_p(\\mathcal{B})\\,(1-\\mathcal{B})^{d}\\,y[t] &= c + \\theta_q(\\mathcal{B})\\,\\varepsilon[t], \\qquad \\varepsilon[t]\\sim\\mathcal{N}(0,\\sigma_\\varepsilon^{2}) \\\\[3pt] \\phi_p(\\mathcal{B}) &= 1-\\phi_1\\mathcal{B}-\\cdots-\\phi_p\\mathcal{B}^{p}, \\qquad \\theta_q(\\mathcal{B}) = 1+\\theta_1\\mathcal{B}+\\cdots+\\theta_q\\mathcal{B}^{q} \\end{aligned}',
        conn: 'El operador de rezago cumple $\\mathcal{B}\\,y[t]=y[t-1]$. La parte AR captura la dependencia con los rezagos, $(1-\\mathcal{B})^{d}$ remueve tendencia y la parte MA modela los errores pasados. Los parámetros se agrupan en $\\eta={\\phi,\\theta,c,\\sigma_\\varepsilon^{2}}$ y $d$ es el orden de diferenciación.'
      },
      {
        heading: 'Función de costo: riesgo esperado',
        tex: '\\begin{aligned} J(\\eta) &= \\mathbb{E}\\!\\left[ \\left( y[t]-\\hat{y}_\\eta[t] \\right)^{2} \\right] \\\\[3pt] \\mathbb{E}\\!\\left[ -\\log L(\\eta,\\sigma_\\varepsilon^{2}) \\right] &= \\frac{1}{2\\sigma_\\varepsilon^{2}}J(\\eta) + \\text{cte} \\end{aligned}',
        conn: 'El criterio es el error cuadrático de predicción esperado. Con innovaciones gaussianas y varianza fija, la log-verosimilitud negativa esperada es proporcional a $J(\\eta)$: los dos criterios están **relacionados**, pero no son idénticos en toda formulación de verosimilitud.'
      },
      {
        heading: 'Aproximación empírica',
        tex: '\\widehat{J}_{N_{\\mathrm{eff}}}(\\eta) = \\frac{1}{N_{\\mathrm{eff}}}\\sum_{t=t_0}^{T} \\left( y[t]-\\hat{y}_\\eta[t] \\right)^{2}',
        conn: '$N_{\\mathrm{eff}}=T-t_0+1$ es el número de observaciones efectivas: la diferenciación y los rezagos consumen observaciones iniciales. La serie temporal **no** es i.i.d., así que el promedio es una aproximación de trabajo.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\eta} \\in \\arg\\min_{\\eta} \\widehat{J}_{N_{\\mathrm{eff}}}(\\eta)',
        conn: 'En la práctica ARIMA se estima habitualmente por **máxima verosimilitud** —a menudo condicional a las primeras observaciones—, que con innovaciones gaussianas y varianza fija conduce al mismo óptimo que el criterio cuadrático, salvo constantes.'
      },
    ],
    notes: '**Familia E1:** ARIMA es el modelo base del bloque estadístico; SARIMA añade la parte estacional sobre esta misma estructura y conserva el criterio de estimación.',
    refs: [
      'Box, Jenkins, Reinsel, Ljung. Time Series Analysis: Forecasting and Control. Wiley, 5ª ed., 2015.',
      'Hyndman & Athanasopoulos. Forecasting: Principles and Practice. OTexts, 3ª ed., 2021.'
    ]
  },
  {
    id: 'd3-mat-1',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E1 — SARIMA: extensión estacional de ARIMA',
    bullets: [
      '**Definición:** SARIMA$(p,d,q)(P,D,Q)_s$ añade a ARIMA un juego de operadores en el rezago estacional $s$; es el único método estadístico clásico nombrado en el diagrama 3.',
      'Es la línea base de comparación de la familia E2, que comienza en la diapositiva siguiente.',
    ],
    equations: [
      {
        heading: 'Entrada y salida',
        tex: 'y[1:T]=(y[1],\\ldots,y[T]), \\qquad \\hat{y}_\\eta[t]=\\mathbb{E}_\\eta\\!\\left[ y[t] \\mid y[1:t-1] \\right], \\qquad \\hat{\\mathbf{y}}_{T+1:T+\\tau}\\in\\mathbb{R}^{\\tau}',
        conn: 'Misma entrada y salida que ARIMA; aquí $s$ es el período estacional (24 h diario, 168 h semanal) y la dependencia se repite cada $s$ pasos.'
      },
      {
        heading: 'Modelo SARIMA($p,d,q$)$(P,D,Q)_s$',
        tex: '\\begin{aligned} \\phi_p(\\mathcal{B})\\,\\Phi_P(\\mathcal{B}^{s})\\,(1-\\mathcal{B})^{d}\\,(1-\\mathcal{B}^{s})^{D}\\,y[t] &= c + \\theta_q(\\mathcal{B})\\,\\Theta_Q(\\mathcal{B}^{s})\\,\\varepsilon[t] \\\\[3pt] \\mathcal{B}^{s}y[t] &= y[t-s], \\qquad \\Phi_P(\\mathcal{B}^{s}) = 1-\\Phi_1\\mathcal{B}^{s}-\\cdots, \\qquad \\Theta_Q(\\mathcal{B}^{s}) = 1+\\Theta_1\\mathcal{B}^{s}+\\cdots \\end{aligned}',
        conn: 'SARIMA **extiende** ARIMA: a la parte simple se suma la estacional —AR $\\Phi_P(\\mathcal{B}^{s})$, MA $\\Theta_Q(\\mathcal{B}^{s})$ y la diferenciación $(1-\\mathcal{B}^{s})^{D}$—. El período $s$ es local de esta ecuación. Todos los coeficientes se agrupan en $\\eta$.'
      },
      {
        heading: 'Función de costo: riesgo esperado',
        tex: '\\begin{aligned} J(\\eta) &= \\mathbb{E}\\!\\left[ \\left( y[t]-\\hat{y}_\\eta[t] \\right)^{2} \\right] \\\\[3pt] \\mathbb{E}\\!\\left[ -\\log L(\\eta,\\sigma_\\varepsilon^{2}) \\right] &= \\frac{1}{2\\sigma_\\varepsilon^{2}}J(\\eta) + \\text{cte} \\end{aligned}',
        conn: 'Idéntico al de ARIMA: la extensión estacional cambia el modelo, no el criterio de error cuadrático de predicción ni su relación con la log-verosimilitud gaussiana de varianza fija.'
      },
      {
        heading: 'Aproximación empírica',
        tex: '\\widehat{J}_{N_{\\mathrm{eff}}}(\\eta) = \\frac{1}{N_{\\mathrm{eff}}}\\sum_{t=t_0}^{T} \\left( y[t]-\\hat{y}_\\eta[t] \\right)^{2}',
        conn: 'Promedio sobre las $N_{\\mathrm{eff}}=T-t_0+1$ observaciones efectivas: la diferenciación, el rezago estacional y los órdenes AR consumen observaciones iniciales. Las observaciones temporales **no** son i.i.d.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\eta} \\in \\arg\\min_{\\eta} \\widehat{J}_{N_{\\mathrm{eff}}}(\\eta)',
        conn: 'También se estima habitualmente por **máxima verosimilitud**; con innovaciones gaussianas y varianza fija el óptimo coincide con el del criterio cuadrático, salvo constantes.'
      },
    ],
    notes: '**Ejemplo reducido:** SARIMA$(1,0,0)(0,0,0)_s$ es un AR(1) con constante, $\\hat{y}[t]=c+\\phi_1 y[t-1]$; con $c=20$, $\\phi_1=0.9$ y $y[t-1]=140$ kWh, $\\hat{y}[t]=146$ kWh.',
    refs: [
      'Box, Jenkins, Reinsel, Ljung. Time Series Analysis: Forecasting and Control. Wiley, 5ª ed., 2015.',
      'Hyndman & Athanasopoulos. Forecasting: Principles and Practice. OTexts, 3ª ed., 2021.'
    ]
  },
  {
    id: 'd3-sarima-forecast',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Modelos estadísticos · desarrollo',
    title: 'SARIMA: historia, estimación y distribución de pronóstico',
    bullets: [
      '**Entrada:** historia observada hasta T, con ventana histórica de longitud L; **salida:** distribución o pronóstico para los siguientes $\\tau$ pasos.',
      'La dinámica de rezagos y diferencias del SARIMA se conserva; el horizonte no cambia sus órdenes $p,d,q,P,D,Q,s$.',
    ],
    equations: [
      {
        heading: 'Pronóstico condicional multi-paso',
        tex: '\\hat{\\mathbf{y}}_{T+1:T+\\tau}=\\mathbb{E}_{\\hat{\\psi}}[\\mathbf{y}_{T+1:T+\\tau}\\mid y_{1:T}], \\qquad \\mathbf{y}_{T+1:T+\\tau}\\in\\mathbb{R}^{\\tau}',
        conn: 'La media condicional da una predicción puntual; bajo innovaciones gaussianas el modelo también induce una distribución predictiva y sus intervalos. La varianza predictiva crece, en general, con el horizonte.'
      },
      {
        heading: 'Estimación por verosimilitud (ejemplo condicional)',
        tex: '\\hat{\\psi}_{ML}=\\arg\\max_{\\psi}p_{\\psi}(y_{L+1:T}\\mid y_{1:L}), \\qquad \\varepsilon[t]\\overset{iid}{\\sim}\\mathcal{N}(0,\\sigma_{\\varepsilon}^{2})',
        conn: 'El conjunto $\\psi$ reúne parámetros AR, MA, estacionales y de varianza. Se maximiza la verosimilitud definida por la estructura temporal y el supuesto de innovaciones; no se reemplaza por MSE salvo que se justifique la equivalencia para el caso gaussiano correspondiente.'
      },
      {
        heading: 'Entrada histórica y objetivo empírico de parámetros',
        tex: '\\mathbf{x}_n^{win}=(y[n-L+1],\\ldots,y[n])\\in\\mathbb{R}^{L}, \\qquad \\hat{\\psi}=\\arg\\min_{\\psi}\\left[-\\log p_{\\psi}(y_{L+1:T}\\mid y_{1:L})\\right]',
        conn: 'L denota longitud de ventana histórica y no el horizonte; $\\tau$ cuenta pasos pronosticados. En la práctica, la verosimilitud puede incluir el tratamiento de condiciones iniciales y efectos estacionales.'
      }
    ],
    refs: [
      'Box, Jenkins, Reinsel, Ljung. Time Series Analysis: Forecasting and Control. Wiley, 5ª ed., 2015.',
      'Hyndman & Athanasopoulos. Forecasting: Principles and Practice. OTexts, 3ª ed., 2021.'
    ]
  },
  {
    id: 'd3-reg-ols',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Regresión lineal por mínimos cuadrados',
    bullets: [
      '**Límites:** con colinealidad o con $P > N$ la solución puede no ser única; de esas dos condiciones nacen ridge y lasso.',
    ],
    equations: [
      {
        heading: 'E2 · Entrada y salida',
        tex: '\\mathbf{x}_n \\in \\mathbb{R}^{P}, \\quad \\mathbf{X} \\in \\mathbb{R}^{N \\times P}; \\qquad \\mathbf{y}_n \\in \\mathbb{R}^{\\tau}, \\quad \\mathbf{Y} \\in \\mathbb{R}^{N \\times \\tau}',
        conn: '$N$ observaciones, $P$ características y $\\tau$ salidas; con una sola respuesta $\\tau=1$ y se conserva $\\tau$ para la extensión multi-salida. El intercepto entra como columna de unos en $\\mathbf{X}$ o como sesgo explícito.'
      },
      {
        heading: 'E2 · Modelo lineal',
        tex: '\\hat{\\mathbf{y}}_n = \\mathbf{W}^{\\top}\\mathbf{x}_n, \\quad \\mathbf{W} \\in \\mathbb{R}^{P \\times \\tau}; \\qquad \\hat{\\mathbf{Y}} = \\mathbf{X}\\mathbf{W}',
        conn: 'La primera expresión predice las $\\tau$ salidas de una observación; la segunda reúne las $N$ predicciones. Con $\\tau=1$ se obtiene la regresión lineal escalar.'
      },
      {
        heading: 'E2 · Función de costo: riesgo esperado y empírico',
        tex: '\\begin{aligned} J(\\mathbf{W}) &= \\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\left[ \\lVert \\mathbf{y} - \\mathbf{W}^{\\top}\\mathbf{x} \\rVert_{2}^{2} \\right] \\\\[3pt] \\widehat{J}_{N}(\\mathbf{W}) &= \\frac{1}{N}\\sum_{n=1}^{N} \\lVert \\mathbf{y}_n - \\mathbf{W}^{\\top}\\mathbf{x}_n \\rVert_{2}^{2} = \\frac{1}{N}\\lVert \\mathbf{Y} - \\mathbf{X}\\mathbf{W} \\rVert_{F}^{2} \\end{aligned}',
        conn: 'El costo poblacional promedia sobre la distribución de datos; la media sobre $N$ muestras i.i.d. lo aproxima empíricamente. Dividir por $N$ cambia la escala del costo, no su minimizador.'
      },
      {
        heading: 'E2 · Problema de optimización',
        tex: '\\begin{aligned} \\mathbf{W}^{*} &\\in \\arg\\min_{\\mathbf{W}} J(\\mathbf{W}) \\\\[3pt] \\widehat{\\mathbf{W}} &\\in \\arg\\min_{\\mathbf{W}} \\widehat{J}_{N}(\\mathbf{W}) \\end{aligned}',
        conn: 'El óptimo poblacional es $\\mathbf{W}^{*}$; el estimador $\\widehat{\\mathbf{W}}$ resuelve su versión empírica. Se usa $\\in\\arg\\min$ porque con colinealidad puede haber más de un minimizador.'
      },
      {
        heading: 'E2 · Solución por ecuaciones normales',
        tex: '\\mathbf{X}^{\\top}\\mathbf{X}\\hat{\\mathbf{W}}=\\mathbf{X}^{\\top}\\mathbf{Y}; \\qquad \\hat{\\mathbf{W}}=\\mathbf{X}^{+}\\mathbf{Y}',
        conn: 'Las ecuaciones normales caracterizan el mínimo. Con rango columna completo, $\\mathbf{X}^{+}=(\\mathbf{X}^{\\top}\\mathbf{X})^{-1}\\mathbf{X}^{\\top}$ y la solución es única; en general $\\mathbf{X}^{+}$ es la pseudoinversa de Moore–Penrose y el residuo es ortogonal a las columnas de $\\mathbf{X}$.'
      },
    ],
    notes: '**Idea central:** mínimos cuadrados no elige el modelo, elige los coeficientes: la solución cerrada sale de igualar a cero el gradiente y deja el residuo ortogonal a las columnas de $\\mathbf{X}$. Todo lo que sigue —verosimilitud, ridge, lasso— cambia el criterio o le añade un término, pero conserva esta lectura. Ojo con el vocabulario: $\\mathbf{e}$ es residuo (observable), $\\boldsymbol{\\varepsilon}$ es error (no observable), y $R^{2} = 1 - \\lVert\\mathbf{e}\\rVert_2^{2}/\\lVert\\mathbf{y}-\\bar{y}\\mathbf{1}\\rVert_2^{2}$ crece siempre al añadir variables, por eso se reporta el ajustado.',
  },
  {
    id: 'd3-reg-mle',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Máxima verosimilitud (MLE)',
    bullets: [
      'La verosimilitud convierte un supuesto sobre el **ruido** en un criterio de estimación: no añade un modelo nuevo.',
      'Aporta $\\hat{\\sigma}^{2}$ —y con ella la inferencia— y la lectura bayesiana de ridge y lasso.',
    ],
    equations: [
      {
        heading: 'E2 · Modelo probabilístico',
        tex: '\\begin{aligned} \\mathbf{y}_n &= \\mathbf{W}^{\\top}\\mathbf{x}_n + \\boldsymbol{\\varepsilon}_n, \\qquad \\boldsymbol{\\varepsilon}_n \\overset{iid}{\\sim} \\mathcal{N}\\!\\left( \\mathbf{0}, \\sigma^{2}\\mathbf{I}_{\\tau} \\right) \\\\[3pt] \\mathbf{y}_n \\mid \\mathbf{x}_n, \\mathbf{W}, \\sigma^{2} &\\sim \\mathcal{N}\\!\\left( \\mathbf{W}^{\\top}\\mathbf{x}_n, \\sigma^{2}\\mathbf{I}_{\\tau} \\right) \\end{aligned}',
        conn: 'Supuesto sobre el ruido, no un modelo nuevo: el predictor sigue siendo $\\hat{\\mathbf{y}}_n=\\mathbf{W}^{\\top}\\mathbf{x}_n$. Con $\\tau=1$ se recupera $\\varepsilon_n\\overset{iid}{\\sim}\\mathcal{N}(0,\\sigma^{2})$; la varianza común y la independencia entre muestras forman parte del supuesto. $\\boldsymbol{\\varepsilon}_n$ es error no observable, distinto del residuo $\\mathbf{e}=\\mathbf{Y}-\\mathbf{X}\\hat{\\mathbf{W}}$.'
      },
      {
        heading: 'E2 · Función de verosimilitud',
        tex: '\\begin{aligned} L(\\mathbf{W},\\sigma^{2}) &= \\prod_{n=1}^{N} p\\!\\left( \\mathbf{y}_n \\mid \\mathbf{x}_n, \\mathbf{W}, \\sigma^{2} \\right) \\\\[3pt] &= \\left( 2\\pi\\sigma^{2} \\right)^{-N\\tau/2} \\exp\\!\\left[ -\\frac{1}{2\\sigma^{2}} \\lVert \\mathbf{Y} - \\mathbf{X}\\mathbf{W} \\rVert_{F}^{2} \\right] \\end{aligned}',
        conn: 'Las $N$ muestras son i.i.d., así que la verosimilitud conjunta es el producto de las densidades. Tomar logaritmo no cambia el maximizador: $\\log L = -\\frac{N\\tau}{2}\\log(2\\pi\\sigma^{2}) - \\frac{1}{2\\sigma^{2}}\\lVert \\mathbf{Y}-\\mathbf{X}\\mathbf{W}\\rVert_{F}^{2}$.'
      },
      {
        heading: 'E2 · Problema de optimización',
        tex: '\\begin{aligned} \\mathcal{R}(\\mathbf{W},\\sigma^{2}) &= -\\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\log p(\\mathbf{y}\\mid\\mathbf{x},\\mathbf{W},\\sigma^{2}) \\right] \\\\[3pt] \\widehat{\\mathcal{R}}_{N}(\\mathbf{W},\\sigma^{2}) &= -\\frac{1}{N}\\sum_{n=1}^{N} \\log p(\\mathbf{y}_n\\mid\\mathbf{x}_n,\\mathbf{W},\\sigma^{2}) \\\\[3pt] (\\widehat{\\mathbf{W}}, \\hat{\\sigma}^{2}) &\\in \\arg\\min_{\\mathbf{W},\\,\\sigma^{2}>0} \\widehat{\\mathcal{R}}_{N}(\\mathbf{W},\\sigma^{2}) \\end{aligned}',
        conn: 'El riesgo logarítmico negativo poblacional se aproxima por su media muestral bajo muestras i.i.d.; minimizarlo equivale a maximizar $\\log L$. La varianza es un parámetro más del criterio: $\\hat{\\sigma}^{2}$ describe la dispersión del ruido.'
      },
      {
        heading: 'E2 · Relación con mínimos cuadrados',
        tex: '\\arg\\max_{\\mathbf{W}} \\log L(\\mathbf{W},\\sigma^{2}) = \\arg\\min_{\\mathbf{W}} \\frac{1}{N}\\lVert \\mathbf{Y} - \\mathbf{X}\\mathbf{W} \\rVert_{F}^{2} \\qquad (\\sigma^{2}\\ \\text{fija})',
        conn: 'Con errores gaussianos independientes y homocedásticos, MLE y mínimos cuadrados comparten el estimador de $\\mathbf{W}$: MLE es un criterio, no un modelo nuevo. Añade $\\hat{\\sigma}^{2}$ —sesgado; el insesgado usa $(N-P)\\tau$ grados de libertad— para la inferencia.'
      },
    ],
    notes: '**Idea central:** MLE no cambia a $\\hat{\\theta}$; justifica el criterio, da varianza e inferencia, y abre el punto de vista bayesiano. **Puente:** un prior sobre $\\theta$ más esta verosimilitud produce un estimador MAP —gaussiano da ridge, Laplace da lasso—; regularizar es declarar una creencia previa.',
  },
  {
    id: 'd3-reg-map',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Modelos probabilísticos · desarrollo',
    title: 'E2 — Máximo a posteriori (MAP)',
    bullets: [
      'MAP es un criterio de estimación: incorpora información previa sobre los parámetros, no un modelo nuevo.',
    ],
    equations: [
      {
        heading: 'E2 · Modelo probabilístico y prior',
        tex: '\\mathbf{y}_n \\mid \\mathbf{x}_n, \\mathbf{W}, \\sigma^{2} \\sim \\mathcal{N}\\!\\left( \\mathbf{W}^{\\top}\\mathbf{x}_n, \\sigma^{2}\\mathbf{I}_{\\tau} \\right), \\qquad \\mathbf{W} \\sim p(\\mathbf{W})',
        conn: 'Se conserva la verosimilitud gaussiana de MLE y se añade un prior sobre los parámetros. $\\sigma^{2}$ es la varianza del ruido y $\\sigma_{0}^{2}$ la escala del prior: son dispersiones distintas.'
      },
      {
        heading: 'E2 · Teorema de Bayes',
        tex: 'p(\\mathbf{W}\\mid\\mathbf{X},\\mathbf{Y}) \\;\\propto\\; p(\\mathbf{Y}\\mid\\mathbf{X},\\mathbf{W})\\,p(\\mathbf{W})',
        conn: 'La posterior combina verosimilitud y prior; la evidencia $p(\\mathbf{Y}\\mid\\mathbf{X})$ no depende de $\\mathbf{W}$ y desaparece al optimizar.'
      },
      {
        heading: 'E2 · Función de costo: esperanza y aproximación empírica',
        tex: '\\begin{aligned} J_{\\mathrm{MAP}}(\\mathbf{W}) &= \\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ -\\log p(\\mathbf{y}\\mid\\mathbf{x},\\mathbf{W}) \\right] + \\lambda\\,\\mathcal{R}(\\mathbf{W}) \\\\[3pt] \\widehat{J}_{\\mathrm{MAP},N}(\\mathbf{W}) &= -\\frac{1}{N}\\sum_{n=1}^{N}\\log p(\\mathbf{y}_n\\mid\\mathbf{x}_n,\\mathbf{W}) + \\lambda\\,\\mathcal{R}(\\mathbf{W}) \\end{aligned}',
        conn: 'El término de datos es el riesgo logarítmico de MLE; el prior entra como penalización, salvo constantes que no dependen de $\\mathbf{W}$. Al promediar el término de datos por $N$, el prior también se divide: $\\lambda\\,\\mathcal{R}(\\mathbf{W}) \\equiv \\frac{1}{N}\\left[-\\log p(\\mathbf{W})\\right]$; con la suma de log-verosimilitudes ese $1/N$ no aparece.'
      },
      {
        heading: 'E2 · Problema de optimización',
        tex: '\\begin{aligned} \\widehat{\\mathbf{W}}_{\\mathrm{MAP}} &\\in \\arg\\max_{\\mathbf{W}} p(\\mathbf{W}\\mid\\mathbf{X},\\mathbf{Y}) \\\\[3pt] &= \\arg\\min_{\\mathbf{W}} \\left[ -\\log p(\\mathbf{Y}\\mid\\mathbf{X},\\mathbf{W}) - \\log p(\\mathbf{W}) \\right] \\end{aligned}',
        conn: 'Maximizar la posterior equivale a minimizar su logaritmo negativo; MAP es la moda de la posterior, no su esperanza.'
      },
      {
        heading: 'E2 · Conexión con Ridge y Lasso',
        tex: '\\begin{aligned} p(\\mathbf{W}) \\propto e^{-\\lVert\\mathbf{W}\\rVert_{F}^{2}/(2\\sigma_{0}^{2})} &\\Rightarrow -\\log p(\\mathbf{W}) = \\frac{\\lVert\\mathbf{W}\\rVert_{F}^{2}}{2\\sigma_{0}^{2}} + C \\\\[3pt] p(\\mathbf{W}) \\propto e^{-\\lVert\\mathbf{W}\\rVert_{1}/b} &\\Rightarrow -\\log p(\\mathbf{W}) = \\frac{\\lVert\\mathbf{W}\\rVert_{1}}{b} + C \\end{aligned}',
        conn: 'El prior gaussiano induce la penalización $\\ell_2$ de Ridge y el Laplace independiente la $\\ell_1$ de Lasso. Con el término de datos promediado, el peso escala como $\\lambda \\propto \\sigma^{2}/(N\\sigma_{0}^{2})$ y $\\lambda \\propto \\sigma^{2}/(Nb)$.'
      },
    ],
    notes: '**Idea central:** MAP no reemplaza la verosimilitud: le añade una creencia previa sobre $\\mathbf{W}$. Regularizar es exactamente eso, y Ridge y Lasso se desarrollan en las páginas siguientes con esta lectura.',
    refs: [
      'Bishop, Pattern Recognition and Machine Learning, Springer, 2006, cap. 3; Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 3.'
    ]
  },
  {
    id: 'd3-reg-ridge',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Ridge (L2): penalización cuadrática',
    bullets: [
      'Penaliza la **magnitud** de los coeficientes: los contrae hacia cero **sin anularlos**.',
      'Es el estimador **MAP** con prior gaussiano; con $\\lambda_{reg}>0$ el problema siempre es invertible.',
    ],
    equations: [
      {
        heading: 'E2 · Modelo lineal (igual que OLS)',
        tex: '\\hat{\\mathbf{Y}} = \\mathbf{X}\\mathbf{W}',
        conn: 'Se conserva el modelo y el predictor de OLS: cambia el criterio de estimación, no el modelo. El intercepto se incorpora con una columna de unos en $\\mathbf{X}$ y habitualmente **no** se penaliza.'
      },
      {
        heading: 'E2 · Función de costo: riesgo esperado regularizado',
        tex: 'J_{\\mathrm{Ridge}}(\\mathbf{W}) = \\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{y} - \\mathbf{W}^{\\top}\\mathbf{x} \\rVert_{2}^{2} \\right] + \\lambda_{reg}\\lVert \\mathbf{W} \\rVert_{F}^{2}',
        conn: 'El primer término es el riesgo de mínimos cuadrados; el segundo penaliza la magnitud global de los coeficientes. Con $\\lambda_{reg}=0$ se recupera OLS.'
      },
      {
        heading: 'E2 · Aproximación empírica (muestras i.i.d.)',
        tex: '\\widehat{J}_{\\mathrm{Ridge},N}(\\mathbf{W}) = \\frac{1}{N}\\lVert \\mathbf{Y} - \\mathbf{X}\\mathbf{W} \\rVert_{F}^{2} + \\lambda_{reg}\\lVert \\mathbf{W} \\rVert_{F}^{2}',
        conn: 'Media muestral en notación matricial: $\\lVert\\mathbf{W}\\rVert_F^2=\\sum_{p,k}W_{pk}^{2}$ suma los cuadrados de **todos** los coeficientes.'
      },
      {
        heading: 'E2 · Problema de optimización',
        tex: '\\widehat{\\mathbf{W}}_{\\mathrm{Ridge}} \\in \\arg\\min_{\\mathbf{W}\\in\\mathbb{R}^{P\\times\\tau}} \\widehat{J}_{\\mathrm{Ridge},N}(\\mathbf{W})',
        conn: 'El costo es estrictamente convexo para $\\lambda_{reg}>0$, así que el minimizador existe y es único.'
      },
      {
        heading: 'E2 · Solución analítica exacta',
        tex: '\\begin{aligned} \\mathbf{X}^{\\top}\\mathbf{X}\\widehat{\\mathbf{W}} + N\\lambda_{reg}\\widehat{\\mathbf{W}} &= \\mathbf{X}^{\\top}\\mathbf{Y} \\\\[3pt] \\widehat{\\mathbf{W}}_{\\mathrm{Ridge}} &= \\left( \\mathbf{X}^{\\top}\\mathbf{X} + N\\lambda_{reg}\\mathbf{I}_{P} \\right)^{-1}\\mathbf{X}^{\\top}\\mathbf{Y} \\end{aligned}',
        conn: 'Con el costo promediado aparece el factor $N$; si el ajuste se escribe como suma de cuadrados, la forma habitual es $(\\mathbf{X}^{\\top}\\mathbf{X}+\\lambda_{reg}\\mathbf{I}_P)^{-1}\\mathbf{X}^{\\top}\\mathbf{Y}$. Sumar $\\lambda_{reg}\\mathbf{I}_P$ desplaza todos los autovalores a $\\mu_k+N\\lambda_{reg}>0$: la matriz es **siempre** invertible y los coeficientes quedan estables incluso con colinealidad, sin que ninguna dirección se anule.'
      },
    ],
    notes: '**Sesgo–varianza:** OLS es insesgado y de varianza mínima dentro de su clase lineal; ridge acepta sesgo a cambio de menos varianza, y gana cuando $\\mathbf{X}^{\\top}\\mathbf{X}$ está mal condicionada. **Frente a lasso:** reparte el peso entre variables correlacionadas y nunca produce un modelo esparso: un coeficiente puede quedar diminuto, pero no exactamente cero.'
  },
  {
    id: 'd3-reg-lasso',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Lasso (L1): penalización en valor absoluto',
    bullets: [
      'Favorece soluciones **dispersas**: puede llevar coeficientes **exactamente a cero**.',
      'Es el estimador **MAP** con prior Laplace; $\\lambda_1$ controla la intensidad de la regularización.',
    ],
    equations: [
      {
        heading: 'E2 · Modelo lineal (igual que OLS)',
        tex: '\\hat{\\mathbf{Y}} = \\mathbf{X}\\mathbf{W}',
        conn: 'Como en OLS y ridge: la diferencia está en el criterio de estimación, no en el modelo. El intercepto se suele dejar fuera de la penalización.'
      },
      {
        heading: 'E2 · Función de costo: riesgo esperado regularizado',
        tex: 'J_{\\mathrm{Lasso}}(\\mathbf{W}) = \\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{y} - \\mathbf{W}^{\\top}\\mathbf{x} \\rVert_{2}^{2} \\right] + \\lambda_{1}\\lVert \\mathbf{W} \\rVert_{1}',
        conn: 'Cambia la norma: $\\lVert\\mathbf{W}\\rVert_{1}=\\sum_{p=1}^{P}\\sum_{k=1}^{\\tau}|W_{pk}|$ en lugar de la suma de cuadrados. No es diferenciable en cero, y de ahí la esparsidad.'
      },
      {
        heading: 'E2 · Aproximación empírica (muestras i.i.d.)',
        tex: '\\widehat{J}_{\\mathrm{Lasso},N}(\\mathbf{W}) = \\frac{1}{N}\\lVert \\mathbf{Y} - \\mathbf{X}\\mathbf{W} \\rVert_{F}^{2} + \\lambda_{1}\\lVert \\mathbf{W} \\rVert_{1}',
        conn: 'Media muestral i.i.d. en notación matricial; la penalización es la suma de valores absolutos de los coeficientes. Con $\\lambda_1=0$ se recupera OLS.'
      },
      {
        heading: 'E2 · Problema de optimización',
        tex: '\\widehat{\\mathbf{W}}_{\\mathrm{Lasso}} \\in \\arg\\min_{\\mathbf{W}\\in\\mathbb{R}^{P\\times\\tau}} \\widehat{J}_{\\mathrm{Lasso},N}(\\mathbf{W})',
        conn: 'Problema convexo pero no diferenciable en cero: no hay fórmula matricial cerrada general equivalente a las ecuaciones normales.'
      },
      {
        heading: 'E2 · Condición de optimalidad: subgradiente',
        tex: '-\\frac{2}{N}\\mathbf{X}^{\\top}(\\mathbf{Y}-\\mathbf{X}\\mathbf{W}) + \\lambda_1\\mathbf{S}=\\mathbf{0}, \\qquad S_{pk}\\in\\begin{cases}\\{\\operatorname{sign}(W_{pk})\\},&W_{pk}\\ne0\\\\[-2pt][-1,1],&W_{pk}=0\\end{cases}',
        conn: 'Condición convexa necesaria y suficiente de optimalidad para la función objetivo mostrada: $\\mathbf{S}\\in\\partial\\lVert\\mathbf{W}\\rVert_1$. En cero se usa el intervalo de subgradientes $[-1,1]$, no un gradiente ordinario. Métodos de solución: descenso por coordenadas, métodos proximales o LARS; no hay forma cerrada general.'
      },
    ],
    refs: [
      'Tibshirani, JRSS-B 58(1), 1996 (lasso) · Hoerl & Kennard, Technometrics 12(1), 1970 (ridge) · Zou & Hastie, JRSS-B 67(2), 2005 (red elástica) · Hastie, Tibshirani & Friedman, ESL, 2.ª ed., 2009, cap. 3.'
    ],
    notes: '**Límites de lasso:** con $P>N$ selecciona a lo sumo $N$ variables y ante variables correlacionadas elige de forma inestable; la red elástica $(\\ell_1+\\ell_2)$ corrige ambos casos.'
  },
  {
    id: 'd3-reg-elastic',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Elastic Net: regularización $\\ell_1 + \\ell_2$',
    bullets: [
      'Combina la **selección de variables** de Lasso con la **contracción** de Ridge.',
      'Con variables correlacionadas reparte el peso entre ellas, en lugar de elegir una al azar.',
    ],
    equations: [
      {
        heading: 'E2 · Modelo lineal (igual que OLS)',
        tex: '\\hat{\\mathbf{y}}_n = \\mathbf{W}^{\\top}\\mathbf{x}_n, \\qquad \\hat{\\mathbf{Y}} = \\mathbf{X}\\mathbf{W}',
        conn: 'Se conserva el modelo y el predictor de OLS: Elastic Net cambia el criterio de estimación, no el modelo. El intercepto se suele dejar fuera de la penalización.'
      },
      {
        heading: 'E2 · Función de costo: riesgo esperado regularizado',
        tex: '\\begin{aligned} J_{\\mathrm{EN}}(\\mathbf{W}) &= \\mathbb{E}_{(\\mathbf{x},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{y} - \\mathbf{W}^{\\top}\\mathbf{x} \\rVert_{2}^{2} \\right] \\\\[3pt] &\\quad + \\lambda_1\\lVert \\mathbf{W} \\rVert_{1} + \\lambda_2\\lVert \\mathbf{W} \\rVert_{F}^{2} \\end{aligned}',
        conn: 'El primer término mide el error esperado; $\\lambda_1\\lVert\\mathbf{W}\\rVert_1$ regulariza en L1 y $\\lambda_2\\lVert\\mathbf{W}\\rVert_F^2$ en L2. Con $\\lambda_1=0$ se recupera Ridge y con $\\lambda_2=0$, Lasso.'
      },
      {
        heading: 'E2 · Aproximación empírica (muestras i.i.d.)',
        tex: '\\begin{aligned} \\widehat{J}_{\\mathrm{EN},N}(\\mathbf{W}) &= \\frac{1}{N}\\lVert \\mathbf{Y} - \\mathbf{X}\\mathbf{W} \\rVert_{F}^{2} \\\\[3pt] &\\quad + \\lambda_1\\lVert \\mathbf{W} \\rVert_{1} + \\lambda_2\\lVert \\mathbf{W} \\rVert_{F}^{2} \\end{aligned}',
        conn: 'Media muestral en notación matricial, con pesos independientes $\\lambda_1\\ge0$ y $\\lambda_2\\ge0$ para cada penalización.'
      },
      {
        heading: 'E2 · Problema de optimización',
        tex: '\\widehat{\\mathbf{W}}_{\\mathrm{EN}} \\in \\arg\\min_{\\mathbf{W}\\in\\mathbb{R}^{P\\times\\tau}} \\widehat{J}_{\\mathrm{EN},N}(\\mathbf{W})',
        conn: 'El objetivo es convexo; el término L1 lo vuelve no diferenciable en cero, y el minimizador puede tener coeficientes exactamente nulos.'
      },
      {
        heading: 'E2 · Solución y propiedades',
        tex: '\\lambda_1,\\lambda_2\\ge0, \\qquad \\lambda_2>0 \\;\\Rightarrow\\; \\widehat{J}_{\\mathrm{EN},N} \\text{ es estrictamente convexa}',
        conn: 'No existe una solución matricial cerrada general análoga a la de Ridge: se resuelve con **descenso por coordenadas** o métodos proximales. Con $\\lambda_2>0$ la solución es única, y el término L2 reparte el peso entre variables correlacionadas en lugar de seleccionar una al azar.'
      },
    ],
    refs: [
      'Zou & Hastie, JRSS-B 67(2), 301–320, 2005 · Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 3.'
    ],
    notes: '**Cierre del bloque penalizado:** OLS, MLE, Ridge, Lasso y Elastic Net comparten el esqueleto —ajuste más castigo— y se distinguen por el término que se suma; ese mismo esqueleto reaparece en $\\mathcal{L}_{MSE}+\\lambda_{phys}\\mathcal{L}_{phys}$. **En el protocolo:** Ridge y Elastic Net comparten el espacio de búsqueda del peso de regularización, con la mezcla $\\rho_{en}$ como dimensión extra.'
  },
  {
    id: 'd3-gpr-model',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Gaussian Process Regression: modelo y optimización',
    bullets: [
      'GPR define una **distribución sobre funciones**, no sólo coeficientes como OLS.',
      'Los **hiperparámetros** $\\theta$ —longitud de escala, amplitud y varianza del ruido— se estiman por verosimilitud marginal negativa.',
    ],
    equations: [
      {
        heading: 'Entrada y salida',
        tex: '\\mathbf{x}_n\\in\\mathbb{R}^{P}, \\quad \\mathbf{X}\\in\\mathbb{R}^{N\\times P}, \\qquad y_n\\in\\mathbb{R}, \\qquad y_{\\ast}\\mid\\mathbf{X},\\mathbf{y}\\sim\\mathcal{N}\\!\\left( \\mu_{\\ast}, \\sigma_{\\ast}^{2} \\right)',
        conn: 'Misma entrada tabular que la familia E2, pero la salida es una **distribución predictiva**: media $\\mu_{\\ast}$ y varianza $\\sigma_{\\ast}^{2}$ en el punto de prueba $\\mathbf{x}_{\\ast}$.'
      },
      {
        heading: 'Modelo probabilístico',
        tex: '\\begin{aligned} f &\\sim \\mathcal{GP}\\!\\left( m_\\theta, k_\\theta \\right), \\qquad y_n = f(\\mathbf{x}_n)+\\varepsilon_n, \\qquad \\varepsilon_n\\sim\\mathcal{N}(0,\\sigma_n^{2}) \\\\[3pt] \\mathbf{K}_\\theta &\\in\\mathbb{R}^{N\\times N}, \\quad (\\mathbf{K}_\\theta)_{ij}=k_\\theta(\\mathbf{x}_i,\\mathbf{x}_j), \\qquad \\mathbf{C}=\\mathbf{K}_\\theta+\\sigma_n^{2}\\mathbf{I}_N \\end{aligned}',
        conn: 'La **media** $m_\\theta$ y el **kernel** $k_\\theta$ definen la familia de funciones; $\\mathbf{C}$ es la covarianza de las observaciones, con el ruido en la diagonal. Con $m_\\theta=0$ el modelo queda descrito por $k_\\theta$ y $\\sigma_n^{2}$.'
      },
      {
        heading: 'Función de costo: riesgo predictivo esperado',
        tex: 'J_{\\mathrm{GPR}}(\\theta)=\\mathbb{E}_{(\\mathbf{x}_{\\ast},y_{\\ast})}\\!\\left[ \\left( y_{\\ast}-\\mu_\\theta(\\mathbf{x}_{\\ast}) \\right)^{2} + \\sigma_\\theta^{2}(\\mathbf{x}_{\\ast}) \\right]',
        conn: 'El criterio predictivo castiga el error cuadrático **y** la incertidumbre declarada; no es el criterio con el que se entrena. El entrenamiento no minimiza este riesgo, sino la verosimilitud marginal negativa del bloque siguiente.'
      },
      {
        heading: 'Verosimilitud marginal negativa',
        tex: '-\\log p_\\theta(\\mathbf{y}\\mid\\mathbf{X}) = \\underbrace{\\tfrac{1}{2}\\mathbf{y}^{\\top}\\mathbf{C}^{-1}\\mathbf{y}}_{\\text{ajuste}} + \\underbrace{\\tfrac{1}{2}\\log\\det\\mathbf{C}}_{\\text{complejidad}} + \\underbrace{\\tfrac{N}{2}\\log 2\\pi}_{\\text{cte}}',
        conn: 'El primer término mide el **ajuste** a los datos, el segundo penaliza la **complejidad** a través del determinante de la covarianza —evita que una longitud de escala diminuta pase por ajustar todo— y el tercero es una **constante** que no depende de $\\theta$.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\theta}\\in\\arg\\min_{\\theta\\in\\Theta}\\left[ -\\log p_\\theta(\\mathbf{y}\\mid\\mathbf{X}) \\right]',
        conn: 'Se estiman los hiperparámetros del kernel y del ruido por optimización derivable (gradiente) del criterio anterior, sin solución analítica cerrada. Los coeficientes no se estiman: se integran analíticamente.'
      },
    ],
    notes: '**Diferencia con OLS:** OLS aprende un vector de coeficientes; GPR aprende una distribución sobre funciones y devuelve incertidumbre. **Relación con la física:** el kernel impone suavidad y estructura; un kernel físico convierte este modelo en la puerta ⑤ (kernel/GPR).',
    refs: [
      'Rasmussen & Williams. Gaussian Processes for Machine Learning. MIT Press, 2006, caps. 2 y 5.',
      'Williams & Rasmussen. Gaussian Processes for Regression. NeurIPS, 1996.'
    ]
  },
  {
    id: 'd3-gpr-prediction',
    module: 'd3',
    tone: 'orange',
    kind: 'split',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — GPR: predicción e incertidumbre',
    bullets: [
      'La media predictiva hereda la estructura del kernel; la varianza predictiva **depende de la distancia a los datos**.',
      'Lejos de las observaciones la banda se ensancha y vuelve a la varianza previa $k_\\theta(\\mathbf{x}_{\\ast},\\mathbf{x}_{\\ast})$.',
    ],
    equations: [
      {
        heading: 'Media predictiva',
        tex: '\\mu_{\\ast} = \\mathbf{k}_{\\ast}^{\\top}\\mathbf{C}^{-1}\\mathbf{y}, \\qquad \\mathbf{k}_{\\ast} = \\bigl[ k_\\theta(\\mathbf{x}_1,\\mathbf{x}_{\\ast}),\\ldots,k_\\theta(\\mathbf{x}_N,\\mathbf{x}_{\\ast}) \\bigr]^{\\top}',
        conn: 'Es el mejor estimador puntual: combina las observaciones $\\mathbf{y}$ ponderadas por la similitud $\\mathbf{k}_{\\ast}$ entre el punto de prueba y cada observación.'
      },
      {
        heading: 'Varianza predictiva',
        tex: '\\sigma_{\\ast}^{2} = k_\\theta(\\mathbf{x}_{\\ast},\\mathbf{x}_{\\ast}) - \\mathbf{k}_{\\ast}^{\\top}\\mathbf{C}^{-1}\\mathbf{k}_{\\ast}, \\qquad \\tilde{\\sigma}_{\\ast}^{2} = \\sigma_{\\ast}^{2}+\\sigma_n^{2}',
        conn: 'Mide la incertidumbre de la media; en un punto observado casi se anula. Para predecir una **observación** ruidosa se añade la varianza del ruido, $\\tilde{\\sigma}_{\\ast}^{2}$.'
      },
    ],
    diagram: 'gpr',
    diagramTitle: 'GPR · observaciones, media predictiva y banda ±2σ*',
    legend: [
      { color: '#2E86AB', label: 'Media predictiva $\\mu_{\\ast}$' },
      { color: '#E67E22', label: 'Banda de incertidumbre $\\mu_{\\ast}\\pm 2\\sigma_{\\ast}$' },
      { color: '#334155', label: 'Observaciones $y_n$' },
    ],
    notes: '**Lectura:** donde hay datos la banda se cierra; en los huecos se abre y la media vuelve a la previa. Esa varianza es la materia prima de la **UQ** y del criterio de adquisición en diseño experimental.'
  },
  {
    id: 'd3-reg-dlinear',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — DLinear: descomposición lineal y baseline obligatorio',
    bullets: [
      'Separa la ventana en **tendencia** y **resto** con un promedio móvil.',
      'Proyecta cada componente con su propia capa lineal: dos proyecciones, no una.',
      'El protocolo del proyecto lo resuelve por mínimos cuadrados: determinista, sin semillas.',
    ],
    equations: [
      {
        heading: 'E2 · Descomposición de la ventana',
        tex: 'x^{tend}[t] = \\frac{1}{p_{ma}} \\sum_{s = -\\lfloor (p_{ma}-1)/2 \\rfloor}^{\\lfloor p_{ma}/2 \\rfloor} x[t+s], \\qquad x^{rem}[t] = x[t] - x^{tend}[t]',
        conn: '**Conexión:** $p_{ma}$ es el período del promedio móvil (24 h en el protocolo) y los bordes se rellenan. La descomposición es la clásica tendencia más resto: $x^{tend}$ captura el nivel lento y $x^{rem}$ la estacionalidad y el ruido de alta frecuencia. Símbolos locales: $p_{ma}$ (local: no es el momento $p(t)$ del MR), $x^{tend}$, $x^{rem}$, $\\mathbf{W}_{tend}$, $\\mathbf{W}_{rem}$.',
      },
      {
        heading: 'E2 · El modelo: dos proyecciones lineales',
        tex: '\\hat{\\mathbf{y}}_{n+1:n+\\tau} = \\mathbf{W}_{tend}\\,\\mathbf{x}^{tend}_n + \\mathbf{b}_{tend} + \\mathbf{W}_{rem}\\,\\mathbf{x}^{rem}_n + \\mathbf{b}_{rem}, \\qquad \\mathbf{W}_{tend}, \\mathbf{W}_{rem} \\in \\mathbb{R}^{\\tau \\times L}',
        conn: '**Conexión:** cada componente de la ventana histórica de longitud L tiene su propia proyección $\\mathbb{R}^{L} \\to \\mathbb{R}^{\\tau}$. Los pesos son bloques de $\\theta$: $\\theta = \\{\\mathbf{W}_{tend}, \\mathbf{b}_{tend}, \\mathbf{W}_{rem}, \\mathbf{b}_{rem}\\}$. La tendencia y el resto se proyectan al mismo horizonte futuro y se suman.',
      },
      {
        heading: 'E2 · El ajuste: mínimos cuadrados directos',
        tex: '\\hat{\\theta} = \\arg\\min_{\\theta}\\ \\lVert \\mathbf{Y} - \\hat{\\mathbf{Y}}(\\theta) \\rVert_F^2',
        conn: '**Conexión:** el artículo original entrena con descenso de gradiente; el protocolo del proyecto resuelve cada proyección con **mínimos cuadrados cerrados** (SVD y pseudo-inversa), que es la solución exacta del problema cuadrático. De ahí dos consecuencias: es **determinista** —sin semillas ni épocas— y es la cota lineal moderna del benchmark. $\\lVert \\cdot \\rVert_F$ es la norma de Frobenius.',
      },
    ],
    refs: [
      'Referencias: Zeng, Chen, Zhang & Xu, Are Transformers Effective for Time Series Forecasting?, AAAI 2023 · protocolo interno del benchmark de regresión (§1, Tabla A).',
    ],
    notes: '**Por qué está en el deck:** es el baseline obligatorio: ningún modelo nuevo se reporta sin superarlo. **Su tesis:** un modelo lineal bien descompuesto iguala o supera a los Transformers en LTSF. **Contraste:** extrapola (es lineal) y es determinista; no modela interacciones no lineales.',
  },
  {
    id: 'd3-reg-svr',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — SVR: pérdida $\\varepsilon_{svr}$-insensible y margen máximo',
    bullets: [
      '**Entrada/salida:** predictor sobre $\\mathbf{x}_n\\in\\mathbb{R}^{P}$; la formulación mostrada es escalar ($\\tau=1$). Para $\\tau>1$ se requiere estrategia multi-salida explícita.',
      'No penaliza todo error: sólo el que excede un tubo de tolerancia $\\varepsilon_{svr}$.',
      'Margen y violaciones conviven en un problema **convexo**; el dual sólo necesita productos internos, de ahí el truco del kernel.',
    ],
    equations: [
      {
        heading: 'E2 · El modelo y la pérdida $\\varepsilon_{svr}$-insensible',
        tex: 'f_\\theta(\\mathbf{x}) = \\langle \\theta, \\varphi(\\mathbf{x}) \\rangle, \\qquad \\ell_{\\varepsilon_{svr}}\\bigl( y_i, f_\\theta(\\mathbf{x}_i) \\bigr) = \\max\\left( 0,\\ \\left| y_i - f_\\theta(\\mathbf{x}_i) \\right| - \\varepsilon_{svr} \\right)',
        conn: '**Conexión:** $\\varphi(\\mathbf{x})$ es el mapa al espacio de características y $\\varepsilon_{svr}$ el radio del tubo: los errores menores que $\\varepsilon_{svr}$ no cuestan nada, así que es robusto al ruido pequeño —a diferencia del residuo cuadrático de $\\mathcal{L}_{MSE}$—. Símbolos locales: $\\varphi$, $\\xi_i^{(\\ast)}$, $\\alpha_i^{(\\ast)}$.',
      },
      {
        heading: 'E2 · El problema de optimización (primal)',
        tex: '\\min_{\\theta,\\ \\boldsymbol{\\xi},\\ \\boldsymbol{\\xi}^*}\\ \\frac{1}{2}\\lVert \\theta \\rVert_2^2 + \\lambda_{svr} \\sum_{i=1}^{N} \\left( \\xi_i + \\xi_i^* \\right) \\quad \\text{s.a. } \\left| y_i - f_\\theta(\\mathbf{x}_i) \\right| \\le \\varepsilon_{svr} + \\xi_i^{(*)}, \\quad \\xi_i^{(*)} \\ge 0',
        conn: '**Conexión:** $\\xi_i^{(\\ast)}$ son las holguras por debajo y por encima del tubo. El objetivo minimiza dos cosas a la vez: la norma $\\lVert \\theta \\rVert_2^2$ —el **margen**, que controla la capacidad— y la suma de violaciones. $\\lambda_{svr}$ pesa el error frente al margen, con el mismo papel que $\\lambda_{reg}$ en ridge y lasso. Es un primal **convexo**: el óptimo es único.',
      },
      {
        heading: 'E2 · El dual y el truco del kernel',
        tex: '\\hat{f}_\\theta(\\mathbf{x}) = \\sum_{i=1}^{N} \\left( \\alpha_i - \\alpha_i^* \\right) \\kappa(\\mathbf{x}, \\mathbf{x}_i), \\qquad \\kappa(\\mathbf{x}, \\mathbf{x}_i) = \\langle \\varphi(\\mathbf{x}), \\varphi(\\mathbf{x}_i) \\rangle, \\qquad 0 \\le \\alpha_i^{(*)} \\le \\lambda_{svr}',
        conn: '**Conexión:** el dual sólo usa productos internos $\\kappa$, así que $\\varphi$ nunca se calcula explícitamente: ése es el **truco del kernel**. Se cumple $\\alpha_i^{(\\ast)} = 0$ para los puntos dentro del tubo; sólo los que lo violan —los **vectores de soporte**— definen la solución.',
      },
    ],
    refs: [
      'Referencias: Vapnik, The Nature of Statistical Learning Theory, 2.ª ed., 2000 · Smola & Schölkopf, Statistics and Computing 14, 199–222, 2004 · Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 12.',
    ],
    notes: '**Idea central:** SVR no minimiza el error cuadrático; minimiza margen más violaciones del tubo. **Puente:** es el mismo esqueleto ajuste más castigo de OLS, ridge y lasso, con la pérdida $\\varepsilon_{svr}$-insensible. **Contraste:** es programación cuadrática, no una ecuación normal: no hay forma cerrada general.',
  },
  {
    id: 'd3-reg-tree',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Árbol de regresión (CART): partición recursiva',
    bullets: [
      '**Entrada:** características tabulares $\\mathbf{x}_n\\in\\mathbb{R}^{P}$; esta ecuación muestra una salida escalar ($\\tau=1$).',
      'No supone linealidad: aproxima $f$ con **cajas** del espacio de entrada; dentro de cada hoja predice la media de sus muestras.',
      'Para $\\tau>1$, la implementación debe especificar salida vectorial o un predictor por horizonte; no se presume equivalencia.',
      'Buscar el árbol óptimo es NP-duro; en la práctica se crece **greedy** y se poda.',
    ],
    equations: [
      {
        heading: 'E2 · El modelo: función escalón sobre una partición',
        tex: '\\hat{y}(\\mathbf{x}) = \\sum_{j=1}^{J_{arb}} c_j \\,\\mathbb{1}\\!\\left[ \\mathbf{x} \\in R_j \\right], \\qquad c_j = \\frac{1}{|R_j|} \\sum_{\\mathbf{x}_i \\in R_j} y_i',
        conn: '**Conexión:** $R_j$ es la caja (región) de la hoja $j$, $J_{arb}$ el número de hojas (local: no son los modos $J$ de la familia E8) y $c_j$ la **media** de las muestras que caen en ella (local: no es el término constante $c$ del SARIMA). La predicción es una función escalón: constante por caja y discontinua en los cortes. Símbolos locales de esta slide: $J_{arb}$, $R_j$, $c_j$, $k$, $s$; $i$ sigue siendo el índice de muestra y nunca tiempo.',
      },
      {
        heading: 'E2 · El criterio del split (búsqueda greedy)',
        tex: '\\min_{k,\\ s} \\left[ \\min_{c_1} \\sum_{\\mathbf{x}_i \\in R_1(k,s)} \\left( y_i - c_1 \\right)^2 + \\min_{c_2} \\sum_{\\mathbf{x}_i \\in R_2(k,s)} \\left( y_i - c_2 \\right)^2 \\right]',
        conn: '**Conexión:** $k$ es la variable (un rezago) y $s$ el umbral del corte que parte el nodo en $R_1(k,s)$ y $R_2(k,s)$. El criterio es la **suma de cuadrados intra-hoja**, equivalente a maximizar la suma de cuadrados entre los dos grupos: en cada paso se busca el par $(k,s)$ que más reduce el error de ajuste, con las medias $c_1, c_2$ recalculadas. Optimizar la partición completa es **NP-duro** y el árbol **no extrapola**: su predicción queda dentro del rango de $y$ de sus hojas.',
      },
    ],
    refs: [
      'Referencias: Breiman, Friedman, Olshen & Stone, Classification and Regression Trees, 1984 · Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 9.',
    ],
    notes: '**Sesgo–varianza:** un árbol profundo tiene varianza alta y sesgo bajo; uno poco profundo, lo contrario. Ése es el compromiso que atacan los dos ensambles siguientes: **bagging** para la varianza y **boosting** para el sesgo. El árbol es determinista; lo estocástico llega con los ensambles.',
  },
  {
    id: 'd3-reg-forest',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Random Forest: bagging sobre árboles',
    bullets: [
      'Promedia $M_{arb}$ árboles entrenados sobre **muestras bootstrap**.',
      'Cada split considera sólo $m_{try}$ variables al azar: así baja la correlación entre árboles.',
      'No reduce el sesgo del árbol base: su objetivo es la **varianza**.',
    ],
    equations: [
      {
        heading: 'E2 · El modelo: promedio de árboles bootstrap',
        tex: '\\hat{y}(\\mathbf{x}) = \\frac{1}{M_{arb}} \\sum_{m=1}^{M_{arb}} T_m(\\mathbf{x}), \\qquad T_m \\sim \\text{bootstrap}\\left( \\mathbf{X}, N \\right) \\quad \\text{con } m_{try} \\text{ variables por split}',
        conn: '**Conexión:** cada $T_m$ es un árbol CART completo, entrenado sobre una **remuestra con reemplazo** de las $N$ filas de $\\mathbf{X}$ (bootstrap) y decidido con sólo $m_{try}$ variables candidatas en cada split (en regresión, típicamente $d/3$). El promedio reduce la varianza sin cambiar la forma del modelo por árbol. Símbolos locales: $M_{arb}$, $T_m$, $m_{try}$, $\\rho_{arb}$ (local: no es el ancho espectral $\\rho_k$), $\\sigma_{arb}^2$.',
      },
      {
        heading: 'E2 · Por qué promediar reduce la varianza',
        tex: '\\mathrm{Var}\\left( \\hat{y}(\\mathbf{x}) \\right) = \\rho_{arb}\\,\\sigma_{arb}^2 + \\frac{1 - \\rho_{arb}}{M_{arb}}\\,\\sigma_{arb}^2',
        conn: '**Conexión:** si cada árbol tiene varianza $\\sigma_{arb}^2$ y la correlación media entre pares es $\\rho_{arb}$, el promedio elimina **sólo** la parte no correlacionada: el segundo término desaparece con $M_{arb} \\to \\infty$, pero el primero se queda. De ahí el **piso** $\\rho_{arb}\\sigma_{arb}^2$ y el papel de $m_{try}$: bajar $\\rho_{arb}$ a cambio de algo de sesgo.',
      },
    ],
    refs: [
      'Referencias: Breiman, Machine Learning 45(1), 5–32, 2001 · Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 15.',
    ],
    notes: '**Bagging frente a boosting:** el bosque promedia en paralelo para bajar varianza; el boosting suma en serie para bajar sesgo. **Multi-salida:** el criterio del split puede sumar el RSS de las $\\tau$ componentes, así que un solo bosque predice todo el horizonte. **Protocolo:** `n_estimators` en 200/500/1000 y `max_depth` en None/8/16/32; al ser estocástico, se reporta media y desviación sobre semillas.',
  },
  {
    id: 'd3-reg-boost',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E2 — Gradient Boosting (XGBoost): ajustar el residuo',
    bullets: [
      '**Salida:** la formulación escalar se interpreta por salida ($\\tau=1$); el caso multi-horizonte requiere una estrategia vectorial o modelos separados.',
      'Construye el modelo **aditivamente**: cada árbol corrige lo que dejó el anterior.',
      'Cada $T_m$ ajusta el **gradiente negativo** de la pérdida, no $y$ directamente.',
    ],
    equations: [
      {
        heading: 'E2 · El modelo aditivo y los pseudo-residuos',
        tex: 'F_0(\\mathbf{x}) = \\bar{y}, \\qquad F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\nu\\, T_m(\\mathbf{x}), \\qquad r_{im} = -\\left.\\frac{\\partial \\ell\\left( y_i, F(\\mathbf{x}_i) \\right)}{\\partial F(\\mathbf{x}_i)} \\right|_{F = F_{m-1}} = y_i - F_{m-1}(\\mathbf{x}_i)',
        conn: '**Conexión:** el ensamble arranca en la media $\\bar{y}$ y cada paso suma un árbol escalado por el **shrinkage** $\\nu \\in (0,1]$. $r_{im}$ es el **pseudo-residuo**: el gradiente negativo de la pérdida por muestra, evaluado en el modelo anterior.',
      },
      {
        heading: 'E2 · El objetivo del ensamble y su aproximación por iteración',
        tex: '\\mathcal{L}\\left( F \\right) = \\sum_{i=1}^{N} \\ell\\left( y_i, F(\\mathbf{x}_i) \\right) + \\sum_{m=1}^{M_{arb}} \\Omega\\left( T_m \\right), \\qquad \\mathrm{Obj}^{(m)} = \\sum_{i=1}^{N} \\left[ g_i\\, T_m(\\mathbf{x}_i) + \\frac{1}{2}\\,\\eta_i\\, T_m(\\mathbf{x}_i)^2 \\right] + \\Omega\\left( T_m \\right)',
        conn: '**Conexión:** el objetivo global es pérdida de datos **más** castigo por complejidad de cada árbol. Como minimizar $\\mathcal{L}$ directamente es intratable, XGBoost expande $\\mathcal{L}$ a **segundo orden** alrededor de $F_{m-1}$ y minimiza $\\mathrm{Obj}^{(m)}$, con $g_i$ el gradiente y $\\eta_i$ la curvatura (segunda derivada) por muestra. Símbolo local: $\\eta_i$ es curvatura por muestra y no representa el horizonte $\\tau$.',
      },
      {
        heading: 'E2 · Peso óptimo de hoja y ganancia del split',
        tex: '\\Omega\\left( T \\right) = \\gamma_{arb}\\, J_{arb} + \\frac{1}{2}\\,\\lambda_{arb} \\sum_{j=1}^{J_{arb}} w_j^2, \\qquad w_j^{*} = -\\frac{G_j}{E_j + \\lambda_{arb}}',
        conn: '**Conexión:** con $G_j = \\sum_{i \\in R_j} g_i$ y $E_j = \\sum_{i \\in R_j} \\eta_i$ (sumas de gradiente y curvatura en la hoja), el peso óptimo sale **cerrado**: $w_j^{\\star}$ es el paso de Newton regularizado y $\\lambda_{arb}$ lo encoge. La **ganancia** del split se mide con esos mismos términos y $\\gamma_{arb}$ exige un mínimo para crear la hoja: es una poda automática. $\\lambda_{arb}$ y $\\gamma_{arb}$ son locales.',
      },
    ],
    refs: [
      'Referencias: Friedman, Annals of Statistics 29(5), 1189–1232, 2001 (gradient boosting) · Chen & Guestrin, KDD 2016 (XGBoost) · Ke et al., NeurIPS 2017 (LightGBM) · Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 10.',
    ],
    notes: '**Contraste:** el bosque reduce **varianza** promediando en paralelo; el boosting reduce **sesgo** sumando en serie, y puede sobreajustar: lo controlan $\\nu$, $M_{arb}$ y la parada temprana. **LightGBM** cambia la implementación, no la matemática. **Sin extrapolación:** sus hojas son constantes.',
  },
  {
    id: 'd3-mat-2-rnn',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E3 — RNN simple: estado oculto recurrente',
    bullets: [
      'Base de la familia recurrente: un solo estado oculto $\\mathbf{h}[t]$ que resume el pasado.',
      'LSTM y GRU cambian la arquitectura interna de $f_\\theta$; la formulación del aprendizaje es la misma.',
    ],
    equations: [
      {
        heading: 'Entrada y salida de secuencias',
        tex: '\\mathbf{X}_n = (\\mathbf{x}[1],\\ldots,\\mathbf{x}[T]) \\in \\mathbb{R}^{T\\times P}, \\qquad \\mathbf{y}_n \\in \\mathbb{R}^{\\tau}, \\qquad \\hat{\\mathbf{y}}_n = f_\\theta(\\mathbf{X}_n)',
        conn: '$T$ es el número de pasos de la secuencia de entrada —la ventana de longitud $L$ de la página de forecasting—, $P$ las características por paso y $\\tau$ el horizonte. $t$ indexa el tiempo dentro de la secuencia y $n$ la muestra: no son el mismo eje.'
      },
      {
        heading: 'Modelo recurrente: actualización del estado oculto',
        tex: '\\begin{aligned} \\mathbf{h}[t] &= \\varphi\\!\\left( \\mathbf{W}_h\\mathbf{x}[t] + \\mathbf{U}_h\\mathbf{h}[t-1] + \\mathbf{b}_h \\right), \\qquad \\mathbf{h}[0]=\\mathbf{0} \\\\[3pt] \\hat{\\mathbf{y}}_n &= \\mathbf{W}_{out}\\mathbf{h}[T] + \\mathbf{b}_{out} = f_\\theta(\\mathbf{X}_n) \\end{aligned}',
        conn: '$\\varphi$ es una no linealidad (por ejemplo $\\tanh$) y $\\mathbf{h}[t]\\in\\mathbb{R}^{H}$. Todos los pesos y sesgos entrenables se agrupan en $\\theta=\\{\\mathbf{W}_h,\\mathbf{U}_h,\\mathbf{b}_h,\\mathbf{W}_{out},\\mathbf{b}_{out}\\}$.'
      },
      {
        heading: 'Función de costo: riesgo esperado',
        tex: 'J(\\theta) = \\mathbb{E}_{(\\mathbf{X},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{y} - f_\\theta(\\mathbf{X}) \\rVert_{2}^{2} \\right]',
        conn: 'Misma forma que en OLS y la familia penalizada: el objeto es el riesgo esperado del error de pronóstico.'
      },
      {
        heading: 'Aproximación empírica',
        tex: '\\widehat{J}_{N}(\\theta) = \\frac{1}{N}\\sum_{n=1}^{N} \\lVert \\mathbf{y}_n - f_\\theta(\\mathbf{X}_n) \\rVert_{2}^{2}',
        conn: 'Promedio sobre las $N$ ventanas de entrenamiento. Si las ventanas se solapan **no son independientes**: el promedio es una aproximación práctica, no una esperanza bajo muestras i.i.d.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\theta} \\in \\arg\\min_{\\theta} \\widehat{J}_{N}(\\theta)',
        conn: 'Se entrena con **BPTT** y optimizadores basados en gradientes (SGD, Adam); no existe solución analítica cerrada general. El gradiente atraviesa la recurrencia paso a paso, de ahí el desvanecimiento.'
      },
    ],
    notes: '**Común a la familia:** RNN, LSTM y GRU comparten $J(\\theta)$, $\\widehat{J}_N(\\theta)$ y $\\hat{\\theta}\\in\\arg\\min$; sólo cambia la arquitectura interna de $f_\\theta$. Las páginas siguientes detallan esa parte interna y conservan esta misma formulación.'
  },
  {
    id: 'd3-mat-2-lstm',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E3 — LSTM: memoria celular y compuertas',
    bullets: [
      'La LSTM mantiene dos estados: memoria celular $\\mathbf{c}[t]$ y estado oculto $\\mathbf{h}[t]$.',
      'Las compuertas de olvido, entrada y salida controlan qué información conserva, incorpora y expone en cada paso.',
    ],
    equations: [
      {
        heading: 'Compuertas de olvido y entrada',
        tex: '\\begin{aligned} \\mathbf{f}[t] &= \\sigma\\!\\left( \\mathbf{W}_f\\mathbf{x}[t] + \\mathbf{U}_f\\mathbf{h}[t-1] + \\mathbf{b}_f \\right) \\\\[3pt] \\mathbf{i}[t] &= \\sigma\\!\\left( \\mathbf{W}_i\\mathbf{x}[t] + \\mathbf{U}_i\\mathbf{h}[t-1] + \\mathbf{b}_i \\right) \\end{aligned}',
        conn: 'Cada compuerta evalúa la entrada actual y el estado oculto anterior; $\\sigma$ es la sigmoide. $\\mathbf{x}[t]\\in\\mathbb{R}^{P}$ es el paso $t$ de la secuencia $\\mathbf{X}_n$.'
      },
      {
        heading: 'Candidato y actualización de la memoria celular',
        tex: '\\begin{aligned} \\tilde{\\mathbf{c}}[t] &= \\tanh\\!\\left( \\mathbf{W}_c\\mathbf{x}[t] + \\mathbf{U}_c\\mathbf{h}[t-1] + \\mathbf{b}_c \\right) \\\\[3pt] \\mathbf{c}[t] &= \\mathbf{f}[t] \\odot \\mathbf{c}[t-1] + \\mathbf{i}[t] \\odot \\tilde{\\mathbf{c}}[t] \\end{aligned}',
        conn: 'La ruta de memoria $\\mathbf{c}[t]$ conserva información a través de muchos pasos: la compuerta de olvido decide qué se descarta y la de entrada qué se incorpora. $\\odot$ es el producto elemento a elemento.'
      },
      {
        heading: 'Compuerta de salida y estado expuesto',
        tex: '\\mathbf{o}[t] = \\sigma\\!\\left( \\mathbf{W}_o\\mathbf{x}[t] + \\mathbf{U}_o\\mathbf{h}[t-1] + \\mathbf{b}_o \\right), \\qquad \\mathbf{h}[t] = \\mathbf{o}[t] \\odot \\tanh\\!\\left( \\mathbf{c}[t] \\right)',
        conn: 'El estado expuesto $\\mathbf{h}[t]$ es lo que lee la capa de salida: $\\hat{\\mathbf{y}}_n=\\mathbf{W}_{out}\\mathbf{h}[T]+\\mathbf{b}_{out}$, igual que en la página de la RNN.'
      },
      {
        heading: 'Función de costo y aproximación empírica',
        tex: '\\begin{aligned} J(\\theta) &= \\mathbb{E}_{(\\mathbf{X},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{y} - f_\\theta(\\mathbf{X}) \\rVert_{2}^{2} \\right] \\\\[3pt] \\widehat{J}_{N}(\\theta) &= \\frac{1}{N}\\sum_{n=1}^{N} \\lVert \\mathbf{y}_n - f_\\theta(\\mathbf{X}_n) \\rVert_{2}^{2} \\end{aligned}',
        conn: 'Mismo riesgo que en la RNN; $\\theta$ reúne ahora $\\mathbf{W}_{(\\cdot)},\\mathbf{U}_{(\\cdot)},\\mathbf{b}_{(\\cdot)}$ de las tres compuertas y el candidato. Con ventanas solapadas el promedio no es una esperanza bajo muestras i.i.d.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\theta} \\in \\arg\\min_{\\theta} \\widehat{J}_{N}(\\theta)',
        conn: 'Entrenamiento por **BPTT** con optimizadores basados en gradientes. La memoria celular atenúa el desvanecimiento del gradiente, pero no hay solución analítica cerrada general.'
      },
    ],
  },
  {
    id: 'd3-mat-2-gru',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E3 — GRU: actualización y reinicio del estado',
    bullets: [
      'La GRU mantiene un solo estado oculto; combina memoria y representación sin una celda separada.',
      'La actualización mezcla el estado anterior con un candidato, mientras el reinicio regula qué pasado entra en ese candidato.',
    ],
    equations: [
      {
        heading: 'Compuertas de actualización y reinicio',
        tex: '\\begin{aligned} \\mathbf{u}[t] &= \\sigma\\!\\left( \\mathbf{W}_u\\mathbf{x}[t] + \\mathbf{U}_u\\mathbf{h}[t-1] + \\mathbf{b}_u \\right) \\\\[3pt] \\mathbf{r}[t] &= \\sigma\\!\\left( \\mathbf{W}_r\\mathbf{x}[t] + \\mathbf{U}_r\\mathbf{h}[t-1] + \\mathbf{b}_r \\right) \\end{aligned}',
        conn: 'La compuerta de actualización $\\mathbf{u}[t]$ decide cuánto estado nuevo entra; la de reinicio $\\mathbf{r}[t]$ decide cuánto pasado se usa para proponerlo. La notación $\\mathbf{u}[t]$ evita la colisión con el embedding espectral.'
      },
      {
        heading: 'Estado candidato',
        tex: '\\tilde{\\mathbf{h}}[t] = \\tanh\\!\\left( \\mathbf{W}_h\\mathbf{x}[t] + \\mathbf{U}_h\\!\\left( \\mathbf{r}[t] \\odot \\mathbf{h}[t-1] \\right) + \\mathbf{b}_h \\right)',
        conn: 'El reinicio modula el estado previo **antes** de combinarlo con la entrada actual: es la diferencia de fondo con la LSTM, que usa una memoria celular aparte.'
      },
      {
        heading: 'Actualización del estado oculto',
        tex: '\\mathbf{h}[t] = (1 - \\mathbf{u}[t]) \\odot \\mathbf{h}[t-1] + \\mathbf{u}[t] \\odot \\tilde{\\mathbf{h}}[t]',
        conn: 'Con la convención de esta diapositiva, $\\mathbf{u}[t]$ pondera el candidato y $1-\\mathbf{u}[t]$ conserva el estado anterior; algunas referencias intercambian los factores. La capa de salida es la misma de la RNN: $\\hat{\\mathbf{y}}_n=\\mathbf{W}_{out}\\mathbf{h}[T]+\\mathbf{b}_{out}$.'
      },
      {
        heading: 'Función de costo y aproximación empírica',
        tex: '\\begin{aligned} J(\\theta) &= \\mathbb{E}_{(\\mathbf{X},\\mathbf{y})\\sim p_{\\mathrm{datos}}}\\!\\left[ \\lVert \\mathbf{y} - f_\\theta(\\mathbf{X}) \\rVert_{2}^{2} \\right] \\\\[3pt] \\widehat{J}_{N}(\\theta) &= \\frac{1}{N}\\sum_{n=1}^{N} \\lVert \\mathbf{y}_n - f_\\theta(\\mathbf{X}_n) \\rVert_{2}^{2} \\end{aligned}',
        conn: 'Idéntico al de la LSTM: $\\theta$ contiene los pesos y sesgos de las dos compuertas, del candidato y de la salida. Con ventanas solapadas el promedio no es una esperanza bajo muestras i.i.d.'
      },
      {
        heading: 'Problema de optimización',
        tex: '\\widehat{\\theta} \\in \\arg\\min_{\\theta} \\widehat{J}_{N}(\\theta)',
        conn: 'También por **BPTT** con optimizadores basados en gradientes: menos parámetros que la LSTM, misma ausencia de solución cerrada.'
      },
    ],
  },
  {
    id: 'd3-sequence-learning',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Aprendizaje secuencial · formulación común',
    title: 'RNN, LSTM y GRU: de la ventana histórica al horizonte',
    bullets: [
      'La ventana $L=T$ fija cuántos pasos pasados recibe la red; el horizonte $\\tau$ fija cuántas salidas futuras produce. No son el mismo eje.',
      'Las tres arquitecturas comparten entrada, salida, costo y optimización: sólo cambia la celda interna de $f_\\theta$.',
    ],
    equations: [
      {
        heading: 'Entrada secuencial y estado recurrente',
        tex: '\\mathbf{X}^{win}_n=(\\mathbf{x}[n-L+1],\\ldots,\\mathbf{x}[n])\\in\\mathbb{R}^{T\\times P}, \\quad T=L, \\qquad \\mathbf{h}[t]=g_\\theta(\\mathbf{x}[t],\\mathbf{h}[t-1])',
        conn: '$L$ es la longitud de ventana, $T$ el número de pasos de la secuencia de entrada y $H$ la dimensión del estado oculto; ninguno representa el horizonte $\\tau$. Las compuertas de LSTM y GRU definen el operador $g_\\theta$.'
      },
      {
        heading: 'Lectura del estado y salida multi-paso',
        tex: '\\hat{\\mathbf{Y}}_{n+1:n+\\tau}=\\operatorname{reshape}_{\\tau\\times Q}(\\mathbf{W}_{out}\\mathbf{h}[n]+\\mathbf{b}_{out})\\in\\mathbb{R}^{\\tau\\times Q}',
        conn: 'La cabeza de salida puede ser una proyección directa o un decodificador autoregresivo; aquí se muestra la proyección directa, con $\\mathbf{W}_{out}\\in\\mathbb{R}^{(\\tau Q)\\times H}$. $Q$ es el número de variables objetivo y $H$ la dimensión del estado oculto; para una variable, $Q=1$.'
      },
      {
        heading: 'Comparación: misma formulación, distinta celda',
        tex: 'J(\\theta)=\\mathbb{E}\\!\\left[\\lVert\\mathbf{y}-f_\\theta(\\mathbf{X})\\rVert_2^2\\right], \\qquad \\hat{\\theta}\\in\\arg\\min_\\theta\\widehat{J}_N(\\theta), \\qquad f_\\theta\\in\\{\\text{RNN},\\text{LSTM},\\text{GRU}\\}',
        conn: 'Las tres comparten riesgo, promedio empírico y optimización; la diferencia está dentro de la celda: un estado recurrente, tres compuertas con celda, o dos compuertas. $\\theta$ reúne los pesos y sesgos de cada celda y de $\\mathbf{W}_{out}$, más los de cada capa cuando hay $L_{cap}$ capas.'
      }
    ],
    notes: '**Común a la familia:** RNN, LSTM y GRU comparten $J(\\theta)$, $\\widehat{J}_N(\\theta)$ y $\\hat{\\theta}\\in\\arg\\min$; se entrenan por **BPTT** con optimizadores de gradiente y no tienen solución analítica cerrada. Con ventanas solapadas, el promedio no es una esperanza bajo muestras i.i.d.'
  },

  {
    id: 'd3-mat-3',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E4 — Convolucionales/TCN · E5 — Transformers LTSF',
    equations: [
      {
        heading: 'E4 · Convolución causal dilatada (campo receptivo exponencial en $\\breve{d}$)',
        tex: '(\\mathbf{s} *_{\\breve{d}} \\mathbf{f})[t] = \\sum_{i=0}^{\\breve{k}-1} f[i]\\, s[t-\\breve{d}\\,i]',
        conn:
          '**Conexión:** "CNN, TCN, híbridos CNN-LSTM" ↔ la convolución dilatada compuesta con una recurrencia E3; el TSB del artículo guía es un bloque TCN (residual + GELU + LN).',
      },
      {
        heading: 'E5 · Atención escalada y multi-cabeza',
        tex: '\\mathrm{Att}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\mathrm{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt{d_k}}\\right)\\mathbf{V}, \\qquad \\mathrm{MHA}(\\mathbf{X}) = \\mathrm{Concat}(\\mathrm{head}_1, \\dots, \\mathrm{head}_{n_{cab}})\\,\\mathbf{W}^O',
        conn:
          '**Conexión:** "TFT, Informer, PatchTST, iTransformer, TimeXer" ↔ variantes de $\\mathrm{Att}$ con distinta tokenización; PatchTST trocea cada canal en parches (channel-independence).',
      },
    ],
  },
  {
    id: 'd3-mat-4',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '6a · Matemática del Diagrama 3',
    title: 'E6 — SSM/Mamba · E7 — Fundacionales · E8 — Descomposición',
    equations: [
      {
        heading: 'E6 · Espacio de estados continuo y discretización (recurrencia lineal)',
        tex: '\\mathbf{h}\'(t) = \\mathbf{A}\\,\\mathbf{h}(t) + \\mathbf{B}\\,x(t), \\qquad y(t) = \\mathbf{C}\\,\\mathbf{h}(t)',
        conn:
          'Discretización → recurrencia $\\mathbf{h}[t] = \\bar{\\mathbf{A}}\\,\\mathbf{h}[t-1] + \\bar{\\mathbf{B}}\\,x[t]$; Mamba (selective scan) vuelve los parámetros dependientes de la entrada: $\\mathcal{O}(\\tau)$ frente al $\\mathcal{O}(\\tau^2)$ de la atención.',
      },
      {
        heading: 'E7 · Distribución predictiva pre-entrenada (zero/few-shot)',
        tex: 'p_\\theta\\bigl(\\mathbf{y}_{T+1:T+\\tau} \\mid \\mathbf{X}^{win}_{T-L+1:T}\\bigr) \\quad \\text{con } \\theta \\text{ fijado en pre-entrenamiento masivo externo}',
        conn:
          '**Conexión:** "zero/few-shot" ↔ evaluar $p_\\theta$ sin re-entrenar $\\theta$ (Chronos tokeniza valores; TimesFM parches; Moirai any-variate).',
      },
      {
        heading: 'E8 · Descomposición (EMD: IMFs + residuo) y VMD variacional',
        tex: 'y(t) = \\sum_{j=1}^{J} c_j(t) + r(t)',
        conn:
          '**Conexión:** "VMD/EMD/CEEMDAN + red profunda" ↔ $\\hat{c}_j = g_{\\theta_j}(\\mathbf{X}_j)$ por componente y $\\hat{y} = \\sum_j \\hat{c}_j + \\hat{r}$; la descomposición se implementa sobre la serie muestreada $y[t]$; preprocesamiento externo.',
      },
      {
        heading: 'E8 · Problema variacional de la VMD',
        tex: '\\min_{\\{u_j\\}, \\{\\omega_j\\}} \\sum_{j=1}^{J} \\left\\| \\partial_t \\left[ \\left( \\delta(t) + \\frac{i}{\\pi t} \\right) * u_j(t) \\right] e^{-i \\omega_j t} \\right\\|_2^2 \\qquad \\text{s.a. } \\sum_{j=1}^{J} u_j(t) = y(t)',
      },
    ],
  },

  // ── §6b Diagrama 4 — La intersección ────────────────────────────────────
  {
    id: 'd4-figura',
    module: 'd4',
    tone: 'magenta',
    kind: 'split',
    kicker: '6b · Diagrama 4',
    title: 'La intersección: TS + física en sistemas energéticos',
    bullets: [
      'Dónde se cruzan las familias E1–E8 con las puertas ①–④: cinco patrones (A–E).',
      '**A** Dinámica de potencia (swing) · **B** Flujo de red · **C** Demanda (física de forma) · **D** Edificios (RC) · **E** Renovables (física + residual).',
      '**El cuadrante "dinámica de edificio + multi-horizonte + rigor + UQ conformal" está VACÍO.**',
    ],
    diagram: 'd4',
    diagramTitle: 'Diagrama 4 · Dónde TS ∩ física ∩ energía se cruzan',
    legend: [
      { color: '#2E86AB', label: 'Maduro · rigor matemático (A, B)' },
      { color: '#E67E22', label: 'C · física de forma' },
      { color: '#16A085', label: 'D · física de sustancia' },
      { color: '#7D3C98', label: 'E · híbrido moderno' },
      { color: '#C0392B', label: '▲ Cuadrante vacío' },
    ],
    refs: [
      'Misyris et al., IEEE PES GM 2020 (A) · Huang & Wang, IEEE TPS 38(1), 2023 (review A) · Tang et al., E&B 2026, DOI: 10.1016/j.enbuild.2026.117299 (C) · Loffa et al., ACM e-Energy 2025 (D) · PhysEmbedFormer, Sci. Reports 2026 (E).',
    ],
  },
  {
    id: 'd4-mat-1',
    module: 'd4',
    tone: 'magenta',
    kind: 'wide',
    kicker: '6b · Matemática del Diagrama 4',
    title: 'Patrón A — Dinámica de potencia · Patrón B — Flujo de red',
    equations: [
      {
        heading: 'A · Ecuación de oscilación del generador síncrono',
        tex: '\\dot{\\delta}(t) = \\omega(t) - \\omega_s, \\qquad M\\,\\dot{\\omega}(t) = P_m - P_e(\\delta) - D\\,\\bigl(\\omega(t) - \\omega_s\\bigr)',
        conn:
          '**Conexión:** puerta ① — la PINN (Misyris 2020) penaliza el residuo $r_\\theta(t)$ (ecuación siguiente); en modo inverso estima $M$ y $D$; DAE-PINN añade $0 = g(\\mathbf{x}_{dif}, \\mathbf{y}_{alg})$.',
      },
      {
        heading: 'A · Residuo físico sobre la trayectoria estimada',
        tex: 'r_\\theta(t) = M\\,\\frac{d\\hat{\\omega}(t)}{dt} - \\left[ P_m - P_e(\\hat{\\delta}) - D\\,(\\hat{\\omega} - \\omega_s) \\right]',
      },
      {
        heading: 'B · Ecuaciones nodales de flujo de potencia',
        tex: 'P_i = \\sum_{j=1}^{N_{bus}} \\lvert V_i \\rvert \\lvert V_j \\rvert \\left( G_{ij}\\cos\\theta_{ij} + B_{ij}\\sin\\theta_{ij} \\right), \\qquad Q_i = \\sum_{j=1}^{N_{bus}} \\lvert V_i \\rvert \\lvert V_j \\rvert \\left( G_{ij}\\sin\\theta_{ij} - B_{ij}\\cos\\theta_{ij} \\right)',
        conn:
          '**Conexión:** "voltajes, ángulos" ↔ $(\\lvert V_i \\rvert, \\theta_i)$; las PINN-GNN usan el residuo de estas ecuaciones sobre el grafo de admitancias (puertas ②+①), con biases que generalizan a redes no vistas.',
      },
    ],
  },
  {
    id: 'd4-mat-2',
    module: 'd4',
    tone: 'magenta',
    kind: 'wide',
    kicker: '6b · Matemática del Diagrama 4',
    title: 'Patrón C — Demanda: física como restricción de forma',
    bullets: [
      'No hay EDO del activo: la física entra como **regularizadores cualitativos** sobre $\\hat{\\mathbf{y}} \\in \\mathbb{R}^{\\tau}$ (puerta ①, o ② si se cablea).',
    ],
    equations: [
      {
        heading: 'Penalización de rampas y de parabolicidad (ERCOT 2026)',
        tex: '\\mathcal{L}_{rampa} = \\sum_{j=1}^{\\tau-1} \\max\\!\\bigl(0,\\; \\left| \\hat{y}[j+1] - \\hat{y}[j] \\right| - r_{max}\\bigr), \\qquad \\mathcal{L}_{par} = \\sum_{j=2}^{\\tau-1} \\left( \\hat{y}[j-1] - 2\\hat{y}[j] + \\hat{y}[j+1] \\right)^2',
        conn:
          '**Conexión:** "loss parabólica/ramp" ↔ $\\mathcal{L}_{par}$, $\\mathcal{L}_{rampa}$; monotonía para chillers (Tang 2026): $\\frac{\\partial \\hat{y}}{\\partial x_m} \\ge 0$ penalizada con $\\mathcal{L}_{mono}$.',
      },
      {
        heading: 'Pérdida total del patrón C',
        tex: '\\mathcal{L}_{total} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,(\\mathcal{L}_{rampa} + \\mathcal{L}_{par} + \\mathcal{L}_{mono})',
        conn:
          'Ninguna contiene una EDO del activo: es el "REGULARIZADOR DE FORMA" del diagrama aplicado al forecast de demanda.',
      },
    ],
  },
  {
    id: 'd4-mat-3',
    module: 'd4',
    tone: 'magenta',
    kind: 'wide',
    kicker: '6b · Matemática del Diagrama 4',
    title: 'Patrón D — Física de sustancia (circuito RC) · Patrón E — rama física + residual',
    equations: [
      {
        heading: 'D · Circuito térmico equivalente 2R2C (formulación PINN-RC del proyecto)',
        tex: 'C_{in} \\frac{d T_{in}(t)}{dt} = \\frac{T_{out}(t) - T_{in}(t)}{R_{ea}} + \\frac{T_{m}(t) - T_{in}(t)}{R_{in}} + A_w I_{sol}(t) + \\dot{Q}_{int}(t) + P_{HVAC}(t)',
        conn:
          'Segundo nodo (masa de la envolvente): $C_{m} \\frac{d T_{m}(t)}{dt} = \\frac{T_{in}(t) - T_{m}(t)}{R_{in}} + \\frac{T_{out}(t) - T_{m}(t)}{R_{out}}$; "Modelos RC" ↔ $(R_{ea}, R_{in}, R_{out}, C_{in}, C_m)$.',
      },
      {
        heading: 'D · Residuo físico y pérdida compuesta',
        tex: 'r_\\theta(t)= C_{in} \\frac{d f_\\theta(t)}{dt} - \\left[ \\frac{T_{out}(t) - f_\\theta(t)}{R_{ea}} + \\frac{T_m(t) - f_\\theta(t)}{R_{in}} + A_w I_{sol}(t) + \\dot{Q}_{int}(t) + P_{HVAC}(t) \\right]',
        conn:
          'La pérdida física es $\\mathbb{E}_{t\\sim p_{phys}}[r_\\theta(t)^2]$; su aproximación empírica promedia los residuos en puntos de colocación y pasos del horizonte $\\tau$. La función objetivo compuesta añade esta penalización al riesgo de datos con peso $\\lambda_{phys}$. Las derivadas son respecto al tiempo de la salida de la red.'
      },
      {
        heading: 'E · Rama física + rama residual + contexto (PhysEmbedFormer)',
        tex: '\\hat{y} = \\underbrace{f_{fis}(\\mathbf{x}_{met})}_{\\text{rama física}} + \\underbrace{g_\\theta(\\mathbf{x}, \\mathbf{c}_{met})}_{\\text{rama residual + contexto}}',
        conn:
          '**Conexión:** puerta ④ con sabor de ② (rama física explícita e interpretable); la variante "PV con corrección de temperatura PINN" penaliza el residuo de $P_{pv}(t)$ (puerta ①).',
      },
    ],
  },

  // ── §7 Diagrama 5 — Problemas que resuelve ──────────────────────────────
  {
    id: 'd5-figura',
    module: 'd5',
    tone: 'cyan',
    kind: 'split',
    kicker: '7 · Diagrama 5',
    title: '¿Qué problema resuelve cada enfoque PIML en energía?',
    bullets: [
      'Cada puerta ataca preferentemente un problema distinto: la decisión informativa del documento.',
      'Laterales abiertos (ninguna puerta los resuelve): **UQ**, eventos extremos, cómputo/escalabilidad.',
    ],
    diagram: 'd5',
    diagramTitle: 'Diagrama 5 · Enfoques ①–④ → problemas resueltos (★ = fortaleza)',
    legend: [
      { color: '#2E86AB', label: '① Loss física' },
      { color: '#7D3C98', label: '② Arquitectura' },
      { color: '#16A085', label: '③ Datos guiados' },
      { color: '#E67E22', label: '④ Híbrido' },
      { color: '#F0F4F8', label: 'Problemas (escasez · interpretabilidad · OOD · plausibilidad)' },
    ],
    refs: [
      'Escasez ↔ Loffa et al. 2025 (DOI: 10.1145/3679240.3734642) y Misyris et al. 2020 · Extrapolación ↔ Tang et al. 2026 · Transferencia ↔ arXiv:2509.25158 · UQ ↔ Yang, Meng & Karniadakis, B-PINN, J. Comp. Physics 425, 2021.',
    ],
  },
  {
    id: 'd5-mat-1',
    module: 'd5',
    tone: 'cyan',
    kind: 'wide',
    kicker: '7 · Matemática del Diagrama 5',
    title: 'Lectura matemática de las filas ①–④',
    bullets: [
      '**① vs escasez:** $\\lambda_{phys}\\,\\mathcal{L}_{phys}$ restringe las funciones admisibles a las que casi satisfacen $\\mathcal{F}[u] = 0$ → aumenta la muestra efectiva; la ganancia aparece "EXACTAMENTE con pocos datos" (Loffa 2025).',
      '**② y ④:** con $\\hat{y} = f_{fis}(\\mathbf{x}_{met}) + g_\\theta(\\mathbf{x}, \\mathbf{c}_{met})$ cada término es inspeccionable, y fuera del dominio $g_\\theta$ puede fallar pero $f_{fis}$ sigue correcta (error acotado por el componente físico).',
    ],
    equations: [
      {
        heading: '③ vs estados no observables: posterior del GP con prior físico',
        tex: '\\bar{f}(\\mathbf{x}) = \\mathbf{k}(\\mathbf{x})^\\top (\\mathbf{K}_{GP} + \\sigma_n^2 \\mathbf{I})^{-1} \\mathbf{y}',
        conn:
          '**Conexión:** puerta ③ — con prior físico $f \\sim \\mathcal{GP}(m_{fis}, \\kappa_{fis})$ (PhI-GPR), la posterior reconstruye estados no medidos si el modelo dinámico está bien especificado.',
      },
    ],
  },
  {
    id: 'd5-mat-2',
    module: 'd5',
    tone: 'cyan',
    kind: 'wide',
    kicker: '7 · Matemática del Diagrama 5',
    title: 'Problemas laterales: UQ, eventos extremos y escalabilidad',
    equations: [
      {
        heading: 'UQ bayesiana (B-PINN): posterior sobre parámetros y predictiva marginal',
        tex: 'p(\\Theta \\mid \\mathcal{D}) = \\frac{p(\\mathcal{D} \\mid \\Theta)\\,p(\\Theta)}{p(\\mathcal{D})}, \\qquad p(y^* \\mid \\mathbf{x}^*, \\mathcal{D}) = \\int p(y^* \\mid \\mathbf{x}^*, \\Theta)\\, p(\\Theta \\mid \\mathcal{D})\\, d\\Theta',
        conn:
          'Muestreada con HMC o variacional: costo prohibitivo para forecasting operativo; alternativa barata: **cuantiles conformales**.',
      },
      {
        heading: 'Cuantiles conformales: cobertura $\\ge 1-\\alpha$ sin supuestos distribucionales',
        tex: '\\hat{q} = \\mathrm{Quantile}\\!\\left(\\{s_i\\}_{i=1}^{n};\\; \\frac{\\lceil (n+1)(1-\\alpha) \\rceil}{n}\\right), \\qquad C(\\hat{y}) = \\left[ \\hat{y} - \\hat{q},\\; \\hat{y} + \\hat{q} \\right]',
        conn:
          'Con puntajes $s_i = |y_i - \\hat{y}_i|$ sobre calibración de tamaño $n$: $\\mathbb{P}\\{y \\in C(\\hat{y})\\} \\ge 1 - \\alpha$ — el hueco más claro del mapa energético.',
      },
    ],
    bullets: [
      '**Eventos extremos:** particionar el test en $\\mathcal{E}$ y su complemento, reportando $\\mathcal{L}_{MSE}\\vert_{\\mathcal{E}}$ por separado — ERCOT 2026: $\\mathcal{L}_{par} + \\mathcal{L}_{rampa}$ mejora la forma durante $\\mathcal{E}$, no la magnitud del pico.',
      '**Cómputo:** evaluar $\\mathcal{L}_{phys}$ crece con $N_c$ y el orden de $\\mathcal{N}$; no hay PINNs energéticas sobre datasets de $\\sim 10^6$–$10^7$ muestras.',
    ],
  },

  // ── §8 Diagrama 6 — Opciones de problema ────────────────────────────────
  {
    id: 'd6-figura',
    module: 'd6',
    tone: 'red',
    kind: 'split',
    kicker: '8 · Diagrama 6',
    title: 'Árbol de opciones de problema (NO vinculado a ningún modelo)',
    bullets: [
      'Opciones de problema que la tesis podría abarcar — **sin votar todavía**; la decisión es posterior.',
      '**A** Escasez de datos · **B** Interpretabilidad etiquetada · **C** UQ (conformal) · **D** Extremos/OOD.',
      'Las opciones **no son excluyentes**: las combinaciones se refuerzan.',
    ],
    diagram: 'd6',
    diagramTitle: 'Diagrama 6 · ¿A qué problema apuntar? — opciones abiertas',
    legend: [
      { color: '#1E3A5F', label: 'Pregunta (cabeza)' },
      { color: '#5B8DBE', label: 'Opción estándar (A)' },
      { color: '#E67E22', label: 'Hueco claro (B, C)' },
      { color: '#C0392B', label: 'Más reciente / abierta (D)' },
      { color: '#F0F4F8', label: 'Nota de combinación' },
    ],
    refs: [
      'Anclajes de evidencia por opción en §8 ("Matemática del Diagrama 6"); decisión informativa: Tabla 5 (§7) y opciones (§8); resolución posterior a este documento.',
    ],
  },
  {
    id: 'd6-mat-1',
    module: 'd6',
    tone: 'red',
    kind: 'wide',
    kicker: '8 · Matemática del Diagrama 6',
    title: 'Anclajes A y B — régimen de escasez y bandas etiquetadas',
    bullets: [
      '**Opción A (escasez de datos):** con $\\tilde{N}$ pequeño domina $\\lambda_{phys}\\,\\mathcal{L}_{phys}$; existe un umbral donde el residuo RC (§6b-D) supera a $\\mathcal{L}_{MSE}$ sola (Loffa 2025).',
    ],
    equations: [
      {
        heading: 'B · Descomposición por bandas espectralmente etiquetadas',
        tex: '\\mathbf{z}[t] = [\\boldsymbol{\\phi}_1(\\mathbf{x}[t]), \\dots, \\boldsymbol{\\phi}_K(\\mathbf{x}[t])] \\in \\mathbb{R}^{F}, \\qquad F = K\\,N_f',
        conn:
          '**Conexión:** cada banda $\\boldsymbol{\\phi}_k$ queda *etiquetada* con su escala temporal ($B = (6, 24, 72)$ h o $(4, 24, 168)$ h): el análogo **aprendible** de la descomposición E8, dentro del modelo.',
      },
    ],
  },
  {
    id: 'd6-mat-2',
    module: 'd6',
    tone: 'red',
    kind: 'wide',
    kicker: '8 · Matemática del Diagrama 6',
    title: 'Anclajes C y D — conformal y evaluación por régimen',
    bullets: [
      '**Opción C (UQ):** conformal — $C(\\hat{y}) = [\\hat{y} - \\hat{q},\\, \\hat{y} + \\hat{q}]$ con cobertura $\\ge 1 - \\alpha$ sobre cualquier predictor; B-PINN es prohibitivo en forecasting.',
      '**Opción D (robustez/extremos):** evaluación por régimen — $\\mathcal{L}_{MSE}\\vert_{\\mathcal{E}}$ por separado, más $\\mathcal{L}_{rampa}$ y $\\mathcal{L}_{par}$ (§6b-C) durante el evento.',
    ],
  },

  // ── §9 Lectura conjunta ─────────────────────────────────────────────────
  {
    id: 'lectura',
    module: 'lectura',
    tone: 'green',
    kind: 'wide',
    kicker: '9 · Lectura conjunta',
    title: 'Los seis diagramas en una tabla',
    table: [
      ['Diagrama', 'Pregunta que responde', 'Matemática asociada'],
      ['1', 'Cómo entra la física (4 puertas)', '$\\mathcal{L}_{total}$, $\\mathbf{J}_s\\nabla_{\\mathbf{z}}H_{\\boldsymbol{\\theta}}$, $\\psi_{fis}$, $f_{fis} + g_\\theta$ (§4)'],
      ['2', 'Qué familias PIML existen para TS (general)', 'F1–F6: PINN, PG-RNN, Neural ODE/SDE, PhyDNet, kernel/GPR, PINT/RFF (§5)'],
      ['3', 'Qué familias data-driven hay en energía (base)', 'E1–E8: SARIMA, SVR/XGBoost, LSTM/GRU, TCN, atención, SSM, fundacionales, VMD (§6a)'],
      ['4', 'Dónde TS ∩ física ∩ energía (patrones A–E)', 'swing, flujo de potencia, pérdidas de forma, RC 2R2C + $\\mathcal{R}_{phys}$, rama física+residual (§6b)'],
      ['5', 'Qué problema resuelve cada enfoque', 'regularizador físico, posterior B-PINN, cuantiles conformales (§7)'],
      ['6', 'Opciones de problema (sin conectar a modelo)', 'anclajes A–D: régimen de escasez, bandas etiquetadas, conformal, evaluación por régimen (§8)'],
    ],
  },

  // ── Cierre ──────────────────────────────────────────────────────────────
  {
    id: 'closing',
    module: 'cierre',
    tone: 'yellow',
    kind: 'cover',
    kicker: '10 · Cierre',
    title: 'Gracias',
    subtitle: 'Preguntas y discusión — el siguiente paso del documento es la formulación del modelo',
    metaLines: [
      'Revisión PIML — Versión matemática · Series de tiempo y sistemas energéticos',
      'Universidad Nacional de Colombia',
    ],
    year: '2026',
  },
];
