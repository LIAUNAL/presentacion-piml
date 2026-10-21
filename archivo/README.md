# PDF archivados

Estas versiones quedaron fuera de circulación al unificar la entrega. Se conservan en disco porque son evidencia del recorrido del documento, no porque deban usarse; **no se versionan** (`.gitignore`: `/archivo/*.pdf`), igual que los dos entregables de la raíz.

## Entregables vigentes (en la raíz del proyecto)

| Archivo | Páginas | Rol |
|---|---|---|
| `presentacion_piml_2026-11.pdf` | 69 | **Versión completa y vigente**: notación unificada + §3 Operador nabla, gradiente y jacobiano + secciones renumeradas |
| `presentacion_piml_nabla_revisada_2026-11-final.pdf` | 61 | **Opcional**: misma notación unificada, sin la sección §3; útil para una exposición más corta |

## Archivados

| Archivo | Páginas | Fecha | Por qué se archiva |
|---|---:|---|---|
| `presentacion_piml.pdf` | 47 | 2026-10-15 | Versión anterior a la revisión de notación |
| `presentacion_piml_unificada_2026-10-16.pdf` | 61 | 2026-10-20 | Referencia de la revisión anterior; su contenido ya está incorporado en el PDF de 61 páginas vigente |
| `presentacion_piml_unificada_2026-10.pdf` | 52 | 2026-10-16 | Paso intermedio de la unificación matemática |
| `presentacion_piml_nabla_revisada_2026-11.pdf` | 61 | 2026-10-21 | Borrador previo del anterior; mismo contenido, sin los ajustes finales de composición |
| `presentacion_piml_v2_2026-09.pdf` | 29 | 2026-09-20 | Versión temprana |
| `presentacion_piml_v3_matematica_2026-09.pdf` | 26 | 2026-09-21 | Versión temprana matemática |

## Cómo se regenera el entregable

```bash
npm run build
node src/scripts/capture-slides.mjs --clean --pdf presentacion_piml_2026-11.pdf
```

El script produce una página por diapositiva en 16:9 y deja las capturas en `src/scripts/captures/`. Los PDF no se versionan: son artefactos de build.
