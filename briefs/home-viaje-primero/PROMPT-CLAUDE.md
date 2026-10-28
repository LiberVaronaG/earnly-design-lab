# Registrar y concretar la elegida: El viaje primero

## Decisión exacta

Liber ha visto las tres composiciones de Codex y dice: **«hacemos el 1 viaje primario. déjale saber a Claude»**.

**Se elige El viaje primero: las millas del recorrido como dato principal dentro de Personal, con estado y Detener, y los acumulados Hoy/Este mes debajo.**

Atención a la numeración: el PNG de Codex (`briefs/home-viaje-primero/tres-ideas-home.png`) llama **1 · El viaje primero** a su primera columna. Tu laboratorio ya la tiene como **2 · El viaje primero**, implementada por `liveBoard()` y seleccionada con **`vivo=tablero`**. Esta es la variante a conservar como elegida. La antigua «1 · Línea en vivo» y la barra inferior quedan como referencias, no como la elección de Liber. No hace falta renumerarlas ni reconstruir nada.

## Base y alcance

Continúa en `design/home-sin-titulo-2026-10-27` o la rama de sesión derivada, incorporando el último encargo sin descartar trabajo. Base observada: `2f1bc1e676795fc2f1a68fa1903b615885d4af55`, donde ya existen las tres variantes.

Lee `AGENTS.md`, `CLAUDE.md`, las referencias que exigen, el relevo y `prototype/HOME-PERSONAL-EN-MARCHA.md`. Este encargo es el estado vigente posterior a «pendiente de elección».

## Haz solo lo necesario para cerrar esta elección

1. Abre **El viaje primero** con `vivo=tablero`. Reutiliza tu variante existente y sus componentes. El PNG generado sirve para señalar la composición, no para copiar sus pequeñas variaciones de color o tamaños.
2. Mantén la jerarquía elegida: estado visible, millas del viaje en grande con «este viaje», su motivo cuando corresponde y Detener; bajo una línea fina, Personal con Hoy/Este mes y acceso a Historial. Los acumulados de viajes terminados no incluyen las millas en curso antes del cierre.
3. Sin viaje, conserva Personal A, con caja y una fila normal y su adaptación a texto grande. Conserva Home sin título, verde C con su desglose propuesto, Opciones agrupadas, aviso condicional y el círculo Iniciar turno con su tamaño y función laboral actuales. No copiar del PNG sus diferencias de tamaño.
4. Conserva los cuatro estados, motivos y comportamiento simulado ya construido. No cambiar reglas de detección, cierre, totales, permisos o navegación. Detener sigue siendo un control separado y accesible, y el pie sigue abriendo Historial → Personal.
5. Registra **El viaje primero / `vivo=tablero` como elegida** en `prototype/HANDOFF.md` y `prototype/HOME-PERSONAL-EN-MARCHA.md`, incluida la aclaración de numeración. Conserva las otras variantes y capturas como historial. No afirmes que pasó a producción.
6. Muéstranos la variante sola, no otro tablero de alternativas: un PNG real de Home trackeando, ES/claro, 390 × 844; y uno en pausa si ayuda a ver el acabado. Sin alargar el teléfono para fingir que todo cabe. Puedes reutilizar una captura individual existente si coincide exactamente; si falta, genera solo esas vistas.

Si no hay cambios en producto del laboratorio, reutiliza las comprobaciones que ya ejecutaste: **registrar la elección no requiere repetir los 480 renders**. Si al abrir detectas un defecto visual puntual, corrígelo dentro de esta variante y verifica únicamente lo afectado, sin ampliar el encargo. Las comprobaciones obligatorias del repo siguen aplicando; no inventes resultados.

Entrega el enlace/parámetros de la elegida, imágenes y un cierre breve con lo realmente cambiado. Se autoriza guardar y subir solo este cierre del laboratorio a su rama, con commit enfocado. Sin merge a main, despliegue, nuevas variantes, integración en SwiftUI, compilación nativa, teléfono ni cambios en Apple o el motor de millas.

Después de esto, el siguiente detalle de Home lo elige Liber. No adelantar otro bloque por iniciativa propia.
