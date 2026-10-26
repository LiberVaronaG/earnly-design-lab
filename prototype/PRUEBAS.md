# Pruebas

Todas se ejecutaron en este entorno el 25 oct 2026 con Chromium (Playwright) sobre Linux. **Un navegador no prueba el comportamiento nativo de iOS.**

## Automatizadas (reproducibles)

| Comando | Qué comprueba | Resultado |
|---|---|---|
| `node tools/build-tokens.mjs --check` | Lo generado está al día. Los roles de V0 con `$from` coinciden con `TOKENS-BASE.json`. Cada override de color define claro y oscuro y existe en `base` | ok |
| `node tools/check-contrast.mjs` | Contraste WCAG de 17 pares texto/fondo usados por los componentes, en las 4 familias × claro/oscuro. Los degradados se comprueban en cada parada | ok, salvo 1 caso heredado y documentado en V0: botón verde en oscuro, 3.80:1 (ver DECISIONES §4) |
| `node tools/check-ui.cjs` | **1000 renders**: 25 pantallas × 4 familias × claro/oscuro × EN/ES × 320 y 390 px, más 200 % de texto a 320 px en EN/ES. En cada uno: sin errores de consola ni cadenas faltantes, sin desbordamiento horizontal (contenedores y controles), todo control con nombre accesible, ningún objetivo menor de 24 px | ok |
| (mismo script) flujos en V0 y V1, EN y ES | Ver la lista de abajo | ok |
| (mismo script) laboratorio | Comparar conserva pantalla y datos al cambiar de familia. Con zoom de página al 200 % los controles siguen visibles y la página no se desplaza en horizontal; los marcos de tamaño fijo se desplazan dentro del escenario | ok |

Flujos comprobados en V0 y V1, en EN y ES:

- **Cerrar un turno simulado.** Se elige plataforma; «Terminar turno» está desactivado hasta elegirla. Con un pago de 90 aparecen $82.00 y $27.33/h, y el foco se mantiene al escribir. «90..» muestra un error y desactiva «Listo». «Listo» vuelve a Inicio con confirmación.
- **Completar importes.** Con el campo vacío, «Guardar» está desactivado. «abc» da error. Una propina mayor que el pago se rechaza. Al guardar, «Ahora no» y luego Terminado muestra «Guardados: 1 · Ahora no: 1», y Historial pasa a «1 turno sin pago anotado».
- **Cerrar sin guardar.** Cerrar el editor con un importe escrito no cambia nada.
- **Papelera.** El foco entra en el diálogo y Escape lo cancela.
- **Hojas.** Escape cierra la hoja de autoempleo y Tab no se escapa de ella.
- **Teclado.** Con Tab se llega a la pestaña Ajustes, el foco es visible y Enter navega.
- **Idioma.** Cambiarlo desde Ajustes vuelve a pintar la app.

### Objetivos táctiles

Ningún control mide menos de 24 px (WCAG 2.2 AA). Hay controles entre 24 y 44 px:

- segmentos de periodo (36–40 px);
- botones «Entendido» (36 px);
- interruptores (31 px, como el estándar de iOS).

Se aceptan como en iOS, pero no cumplen la recomendación de 44 pt. Si se adopta V1, conviene subir los segmentos a 44 px.

## Revisión visual

Se revisaron capturas reales (también en `captures/`) de las cuatro familias en Inicio (con y sin desglose y en los cinco escenarios), Historial Trabajo/Personal, día y detalle con hueco, cierre (resultado, otra plataforma, oscuro ES), editor (propina rechazada, terminado), recuperar turno, Exportar (oscuro ES), PDF, Ajustes, la hoja de autoempleo, la decoración navideña, y 320 px con texto al 200 %.

## Fallos encontrados y corregidos en esta sesión

1. **Reset con demasiada especificidad.** El reset `.app button` anulaba paddings y tipografía de los componentes: las filas quedaban pegadas al borde y «Iniciar turno» perdía el tamaño. Se pasó a `:where()`.
2. **Tarjetas aplastadas.** Los hijos del área con scroll se encogían, y la tarjeta de V3 quedaba aplastada. Se añadió `flex-shrink: 0`.
3. **Importe partido en V2.** En el libro de V2 el importe saltaba de línea por la subetiqueta. Se ajustó el reparto flex de etiqueta/valor.
4. **Hojas más anchas que el teléfono a 320 px.** Faltaba `min-width: 0` en la hoja.
5. **Desbordes al 200 % de texto.** Ocurrían en la cifra principal de V1, las etiquetas de interruptores, la rejilla de plataformas y los segmentos. Se resolvieron con `cqi`, ajuste de líneas, una sola columna y segmentos que envuelven.
6. **Etiqueta «Parcial» poco legible.** Usaba texto ámbar pequeño. Ahora el texto es normal y el borde discontinuo ámbar.
7. **Contraste del verde en oscuro.** El verde de acción oscuro de V1–V3 daba ≈3.8:1. Se oscureció hasta ≥4.96:1.
8. **Cadenas faltantes.** Faltaban `diagLogFull/Short`; las detectó la prueba de consola.
9. **El laboratorio arrastraba parámetros.** Al cambiar el hash, los parámetros que faltaban conservaban el valor anterior. Ahora vuelven al valor por defecto.
10. **Margen lateral en modo `solo=1`.** A ≤520 px heredaba el margen del laboratorio.
11. **Escenarios mal marcados.** «Cifras demasiado grandes» se marcaba como «Parcial», y en «Sin datos» se mostraba un gráfico vacío.

## No probado / fuera de alcance

- **Plataforma:** iOS, Safari/WebKit, Firefox, dispositivos táctiles reales y la tipografía SF real.
- **Accesibilidad nativa:** VoiceOver real (solo se comprobaron nombres accesibles, roles y foco en el DOM) y Dynamic Type nativo (el 200 % es una escala CSS aproximada).
- **Teclado iOS:** el teclado decimal y su barra no se simulan; se usa `inputmode="decimal"`.
- **Movimiento reducido:** la regla `prefers-reduced-motion` existe, pero no se verificó con el ajuste del sistema activado.
- **Usuarios:** no hubo pruebas de usabilidad con conductores.
- **Funcionalidad real:** precisión de millas, fiscalidad y rendimiento en dispositivo; están fuera de alcance por diseño.
