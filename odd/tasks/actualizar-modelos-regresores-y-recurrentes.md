# Feature: Actualizar modelos regresores y recurrentes en la presentación

**Estado:** implementado y verificado  
**Rama:** `feat/regresores-svr-arboles`  
**Solicitud:** depurar la referencia estadística E1, revisar las explicaciones de OLS/Ridge/Lasso/Elastic Net, y ampliar la presentación de LSTM y GRU con una diapositiva por arquitectura, eliminando la mención de BiLSTM-attention.

## Alcance

- `src/data/deckContent.js`: retirar ETS como alternativa nombrada; mantener SARIMA como método estadístico clásico.
- `src/deck/diagrams/DataDrivenFlow.jsx`: actualizar las etiquetas del Diagrama 3 para que coincidan: E1 solo SARIMA y E3 solo LSTM/GRU.
- Auditar las diapositivas existentes de OLS, Ridge, Lasso y Elastic Net respecto de estructura, función objetivo, qué minimizan y explicación conceptual; corregir solo vacíos o imprecisiones materiales.
- Separar la explicación de LSTM y GRU en una página dedicada a cada una, preservando las ecuaciones y mejorando la legibilidad/estructura.
- Eliminar la referencia a BiLSTM + atención donde se presenta como variante recurrente; no eliminar la familia de atención independiente del mapa general.
- Mantener los cambios locales preexistentes sin relación con esta tarea, especialmente los cambios ya presentes en `src/data/deckContent.js`.

## Criterios de aceptación

1. En el deck no queda ETS listado como baseline/clásico; SARIMA permanece.
2. OLS, Ridge, Lasso y Elastic Net están explicados con notación consistente, función objetivo y propiedades/interpretación suficientes; los hallazgos y cualquier corrección quedan documentados.
3. LSTM y GRU ocupan una diapositiva explicativa separada cada una, con estructura y ecuaciones legibles.
4. No queda la mención BiLSTM-attention como modelo recurrente.
5. El total de slides y navegación reflejan la nueva separación; build y revisión visual no reportan errores atribuibles al cambio.

## Plan y estado

- [x] Revisar el contenido actual y fijar un esquema didáctico conciso para las cuatro regresiones lineales y las dos recurrentes.
- [x] Actualizar el contenido del deck y retirar ETS/BiLSTM-attention.
- [x] Verificar conteo, renderizado matemático, desbordes y build.

## Resultado

- Se dejó SARIMA como modelo estadístico clásico; se retiró la referencia ETS de la diapositiva y del diagrama data-driven.
- Se retiró BiLSTM+att tanto de la diapositiva recurrente como de la etiqueta E3 del diagrama; permanece la familia general de atención.
- La auditoría confirmó que OLS cubre modelo, supuestos, objetivo de mínimos cuadrados e interpretación geométrica; Ridge, penalización cuadrática, solución y contracción; Lasso, penalización absoluta, selección y ceros exactos; Elastic Net, mezcla, extremos Ridge/Lasso y agrupamiento. No se encontró necesidad de cambios materiales a esas cuatro explicaciones.
- Se separó E3 en `d3-mat-2-lstm` y `d3-mat-2-gru`, con una diapositiva dedicada para cada arquitectura; se quitó BiLSTM + atención sin quitar la familia general de atención.
- El deck queda en 47 diapositivas con IDs únicos.

## Verificación

- Test-first: no aplicable; fue una actualización de contenido, sin cambio de comportamiento.
- `npm run build`: pasó en escritor e independiente; Vite reportó una advertencia no bloqueante por chunk >500 kB.
- Check estructural de `SLIDES`: pasó; 47 entradas, IDs únicos, títulos separados LSTM/GRU, SARIMA presente, ETS y BiLSTM ausentes, referencias generales a atención presentes.
- Browser/Playwright independiente en 1920×1080: ambas slides cargan; 28/30 contenedores MathJax respectivamente, cero errores MathJax/console y sin desbordes de contenido.
- Tras solicitudes posteriores del usuario, se regeneró `presentacion_piml.pdf` con 47 páginas. Las capturas se escribieron en `/tmp/presentacion-piml-pdf-export`; no se sobrescribieron las capturas rastreadas del repositorio. Verificación independiente final: PDF no vacío, 13 464 289 bytes, 47 páginas; 47 PNG temporales.
- Inspección visual del PNG `slide-20.png`: el nodo E1 muestra `SARIMA`; E3 muestra `LSTM · GRU`; no aparece ETS ni BiLSTM+att.
- No se editó `GUION.md`; no se hizo commit ni push.
- Native review assess/inspect no estuvo disponible: falta el binario local (`package-local-binary-missing`). No se inició ninguna lineage ni hubo mutación de autoridad.

## Restricciones y evidencia

- No editar `GUION.md` en este alcance; la documentación del guion había quedado diferida por una decisión previa.
- La exportación del PDF principal fue autorizada explícitamente en un turno posterior; conservar su nombre `presentacion_piml.pdf`. No hacer push.
- No crear commit sin petición expresa del usuario.
- El árbol de trabajo contiene cambios preexistentes en `src/data/deckContent.js`, `docs/`, `odd/tasks/` y `presentacion_piml.pdf`; separar esos cambios y no atribuirlos a esta tarea. Esta solicitud añadió el cambio acotado en `src/deck/diagrams/DataDrivenFlow.jsx`.
- Las modificaciones son contenido de presentación, no cambios de comportamiento de la aplicación; el test-first no es aplicable. Usar build y verificación visual/estructural del deck como checks.

## Próximo paso

Esperar la siguiente instrucción del usuario. `presentacion_piml.pdf` ya contiene los cambios de la presentación.