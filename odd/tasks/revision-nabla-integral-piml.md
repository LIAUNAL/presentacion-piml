# Feature: Revisión integral de notación diferencial del deck PIML
Estado: completo · Referencia indicada por la usuaria: `presentacion_piml_unificada_2026-10-16.pdf` (preservado sin sobrescritura).
Propósito: auditar el contenido editable de todas las diapositivas, corregir notación diferencial sólo donde sea matemáticamente apropiado y producir una versión nueva validada.

## Tasks
- T1 (S1) — Inventariar 61 diapositivas y ecuaciones relevantes — terminado.
- T2 (S1) — Ajustar notación y corregir los desbordamientos detectados al revisar el render — terminado; estilos compactos locales para la tabla de slide 2 y tarjetas de slide 3; `npm run build` y `npm run lint` pasan.
- T3 (S1) — Generar un PDF final nuevo sin sobrescribir los locales — terminado; `presentacion_piml_nabla_revisada_2026-11-final.pdf`, 61 páginas y 61 capturas finales.
- T4 (S1) — Validar matemáticas, render y aspecto visual — terminado; se revisaron visualmente todas las diapositivas modificadas y la tabla/tarjetas de slides 2–3 ya aparecen completas.
- T5 (S1) — Documentar cambios y entregar — terminado; resumen por diapositiva en `odd/revision-nabla-integral-piml/resumen-cambios.md`; memoria Engram guardada (observación 137).

## Specs

### S1 — Solicitud de la usuaria (verbatim)

> # Revisión integral y unificación de la notación matemática mediante el operador nabla (∇)
>
> Revisa exhaustivamente **todas las diapositivas de la presentación PIML**, desde la primera hasta la última, con el objetivo de unificar la notación matemática e incorporar el operador diferencial nabla (\(\nabla\)) donde sea matemáticamente correcto, consistente y contribuya a la claridad de la exposición.
>
> La revisión debe responder a la recomendación del tutor: **representar diferentes modelos mediante una notación matemática general y rigurosa**, especialmente cuando las funciones dependen de variables vectoriales o se formulan como problemas de optimización.
>
> No se trata de sustituir todas las derivadas por nabla, sino de determinar cuándo corresponde utilizar gradientes, jacobianos, Hessianas, derivadas parciales, derivadas temporales o subgradientes.
>
> ## Convenciones y alcance matemático
> Adoptar gradiente columna para funciones escalares de entrada vectorial; jacobiano \(m\times n\) para funciones vectoriales; Hessiana distinta del laplaciano; \(\boldsymbol\theta\) parámetros neuronales, \(\boldsymbol\phi\) físicos, \(\mathcal L\) pérdida; gradientes de optimización según la variable. En optimización conjunta definir \(\boldsymbol\psi=[\boldsymbol\theta;\boldsymbol\phi]\) y comprobar dimensiones.
>
> ## HNN y LNN
> HNN: \(\mathbf z=[\mathbf q;\mathbf p]\), Hamiltoniano escalar, \(\dot{\mathbf z}=\mathbf J_s\nabla_{\mathbf z}H_{\boldsymbol\theta}(\mathbf z)\); comprobar signos y dimensiones de matriz simpléctica. Diferenciar gradientes respecto al estado y parámetros.
>
> LNN: \(L_{\boldsymbol\theta}(\mathbf q,\dot{\mathbf q})\), gradientes \(\nabla_{\mathbf q}L\), \(\nabla_{\dot{\mathbf q}}L\), Euler–Lagrange \(\frac{d}{dt}(\nabla_{\dot{\mathbf q}}L)-\nabla_{\mathbf q}L=\mathbf0\). Verificar aceleración, derivadas mixtas/Hessianas, dimensiones y orden de factores.
>
> ## PINNs, física y modelos predictivos
> Conservar derivación temporal convencional \(d/dt\) cuando sea más clara; distinguirla de gradientes espaciales, neuronales y físicos. Revisar masa–resorte–amortiguador y formulaciones inversas conjuntas. Auditar OLS, Ridge, Lasso, Elastic Net, feedforward, RNN, LSTM, GRU, PINNs, HNN, LNN y demás modelos: añadir gradientes sólo cuando aporten; usar subgradientes/condiciones de optimalidad para L1; no afirmar que gradiente nulo garantiza mínimo global no convexo.
>
> Mantener la diferencia entre riesgo esperado, riesgo empírico, física y regularización; conservar formulaciones originales cuando sustituirlas altere el problema. No confundir gradiente, divergencia, jacobiano, Hessiana ni laplaciano; verificar dimensiones, subíndices y significados.
>
> ## Entrega y validación
> Ajustar directamente las diapositivas necesarias; actualizar la tabla general de notación con gradiente, jacobiano, Hessiana, laplaciano y parámetros neuronales/físicos. Preservar el diseño, evitar sobrecarga. Validar matemáticamente cada cambio, consistencia global, gradientes y signos/dimensiones HNN/LNN, render LaTeX y revisión visual de diapositivas modificadas. Entregar presentación actualizada y resumen con número de diapositiva, ecuación anterior/nueva, justificación y notación conservada con motivo.

## Log
- L1: Revisar y unificar la notación matemática de todas las diapositivas PIML, usando gradientes, jacobianos, Hessianas, subgradientes y derivadas temporales donde corresponda. Generar una presentación actualizada en un archivo nuevo y entregar un resumen de los cambios por diapositiva, preservando los PDF existentes.
- L2: La auditoría cubrió 61 diapositivas. `npm run build` y `npm run lint` pasan; Vite mantiene su advertencia de chunk JavaScript minificado superior a 500 kB.
- L3: La primera captura reveló recortes inferiores en slides 2 y 3. Se aplicó CSS acotado a `notacion` y `marco-aprendizaje`; la recaptura muestra la tabla completa y las cuatro tarjetas visibles.
- L4: El PDF final tiene 61 páginas y se apoya en 61 PNG. Se recapturaron los slides modificados 2, 3, 7, 12, 13 y 60 después del borrador; las demás capturas provienen del mismo build de contenido sin cambios posteriores para esas páginas. El PDF local `presentacion_piml_unificada_2026-10-16.pdf` se preservó.
- L5: Resumen por diapositiva creado en `odd/revision-nabla-integral-piml/resumen-cambios.md`, con ecuaciones previas/nuevas, motivos y notación conservada. `gentle_review assess` informó que no puede ejecutar la evaluación nativa por ausencia del binario local; no se abrió lineage.
- L6: Memoria Engram del patrón guardada con observación 137; build, lint, capturas y PDF final verificados.
- L7: Entrega unificada: `presentacion_piml_nabla_revisada_2026-11-final.pdf` pasa a ser el **PDF opcional de 61 páginas**; el vigente es `presentacion_piml_2026-11.pdf` (69 páginas con §3). Las seis versiones anteriores se movieron a `archivo/`.
