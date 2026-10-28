# HANDOFF

Último punto recuperable: rama `design/home-sin-titulo-2026-10-27`, derivada de `claude/prototype-design-lab` (`0a5ba0e`), que no se ha modificado. Para abrirlo, `prototype/index.html`. Inicio elegido hasta ahora: sin título, tarjeta C, su desglose propuesto, Opciones propuesta y Personal A (`#view=single&family=v0&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&personal=a&lang=es&scenario=partial&screen=home`). Comparación de Personal: `#view=personal&family=v0&lang=es&scenario=partial&screen=home`. Comparación de Opciones: `#view=opciones&family=v0&lang=es&scenario=partial&screen=homeOptions`. Comparación de la tarjeta C abierta: `#view=abierta&family=v0&lang=es&scenario=complete&screen=homeBreakdown`. La de la tarjeta verde: `prototype/index.html#view=tarjeta&cards=actual,c&family=v0&lang=es&scenario=partial&screen=home`. La de Original / Sin título sigue en `#view=sintitulo&family=v0&lang=es&scenario=partial&screen=home`.

## Fase 1: versión navegable (hecha)

- Maestro de tokens `design-tokens.json` y generador con comprobación contra `TOKENS-BASE.json`.
- V0 reconocible con las cuatro áreas (Inicio, Historial Trabajo/Personal, Exportar, Ajustes) y navegación real (pilas por pestaña, hojas, diálogo, toasts).
- Cinco escenarios sintéticos y EN/ES con formato de números y fechas en `en-US` / `es-US`.

## Fase 2: familias y flujos (hecha)

- V1 Esencial, V2 Claridad y V3 Estudio como diferencias de tokens y de composición.
- Vistas «Una», «Comparar dos» y «Las cuatro», que comparten la misma pantalla y los mismos datos.
- Flujos de demostración:
  - turno simulado → cierre (pago, otra plataforma, estación, papelera);
  - recuperar turno;
  - completar importes;
  - detalle de turno → editar pago;
  - autoempleo;
  - PDF sintético;
  - Ajustes y subpantallas;
  - papelera con restaurar.
- Decoración estacional opcional.

## Fase 3: acabado y pruebas (hecha)

- Contraste computado, 1000 renders auditados en Chromium, flujos por teclado y texto al 200 %.
- 20 capturas reales en `captures/`.
- Documentación: `PANTALLAS.md`, `DECISIONES.md` (incluye la recomendación) y `PRUEBAS.md`.

## Dirección actual (25 oct, del propietario)

**El trabajo se centra solo en Inicio**, que es la base de la app. No se diseñan más pantallas por ahora. Cuando haya una propuesta de Inicio convincente, se adaptará al resto. Las demás pantallas del prototipo quedan como contexto y no son prioridad. Las imágenes de Inicio para revisar en el teléfono están en `captures/home/` y se regeneran con `node tools/capture-home.cjs`.

### Navidad (25 oct)

El propietario prefiere la línea de V3 (círculo) y quiere encontrar un buen **Inicio navideño** para una actualización que durará un mes. Pidió un gorrito de duende pequeño, como un adorno. Hay tres propuestas en «Decoración»: **Duende**, **Nevada** y **Luces** (`js/xmas.js`, estilos al final de `css/app.css`), y todavía no se ha elegido ninguna.

- Imágenes: `captures/home/06-10`; se regeneran con `node tools/capture-home.cjs`.
- Vídeos: `captures/home/11-14*.mp4`; se regeneran con `node tools/capture-xmas-video.cjs` (necesita ffmpeg).

**Decisión del propietario:** Inicio actual (V0) + solo el gorrito de duende pequeño, sin aro, nieve, luces ni cambios de color (`deco=xmas-gorrito`). Imágenes: `captures/home/15-16`. Vídeos: `captures/home/17-18*.mp4`. Para la versión real, el gorrito interactivo se diseñaría con herramientas de animación o 3D. El propietario aclara que este gorrito es una **prueba de hasta dónde se puede animar con Claude**: en la app se usaría un gorro con gráficos más detallados y la animación incluida. Por ahora queda como «un gorro navideño».

## Dirección vigente (27 oct): Inicio detalle a detalle

Liber quiere mejorar la elegancia de Inicio con un cambio cada vez, **manteniendo los colores actuales y la V0**. El primer cambio elegido es quitar el rótulo «Earnly Driver» de arriba y su espacio, sin sustituirlo por nada. La identidad se trabajará más adelante con el icono de la app.

- Hecho en este bloque: vista «Original y Sin título», control «Inicio» y parámetro `home=sintitulo`. Detalle, comprobaciones, límites y tres sugerencias **no implementadas** en [HOME-SIN-TITULO.md](HOME-SIN-TITULO.md). Capturas en `captures/home-sin-titulo/`.
- En este bloque no se desarrollaron Navidad ni las familias V1–V3. Las decisiones anteriores (incluido el gorrito elegido) siguen siendo historial válido y no se borraron.
- **Siguiente paso exacto:** Liber compara `captures/home-sin-titulo/06-original-claro-es.png` y `07-sin-titulo-claro-es.png` en el teléfono y decide si aprueba «Sin título». Si lo aprueba, elige el segundo detalle entre las sugerencias de `HOME-SIN-TITULO.md`. Nada pasa a SwiftUI hasta que se elija el diseño.

### Tarjeta verde (27 oct): **elegida C**

Liber aprobó Inicio sin título en el laboratorio y ahora estudia solo la composición de la tarjeta verde. Prefiere C: importe y cobertura a la izquierda, millas de hoy y del mes a la derecha. Colores actuales, nada más de Inicio.

- Hecho: C dentro de Inicio sin título, vista «Tarjeta verde» con la tarjeta actual al lado, controles «Tarjeta» y «Tarjetas», y dos escenarios de prueba de diseño (importe largo; cobrado $0 con negativo tras gasolina). Medidas, comprobaciones, alternativa probada y descartada, y recomendación en [HOME-TARJETA-VERDE.md](HOME-TARJETA-VERDE.md). Capturas en `captures/home-tarjeta-verde/`.
- Medida clave: a 390 px C iguala la altura actual en la referencia y suma 19 px cuando la cobertura es corta. Gana mucho a 320 px, con texto grande y con importes largos, y nunca parte la cifra.
- **Decisión de Liber (27 oct): C** para la tarjeta verde, aceptando sus 19 px extra cuando la cobertura cabe en una línea. En el laboratorio sigue accesible con `card=c`; la tarjeta actual queda como referencia.
- **Siguiente paso:** que Liber elija el próximo detalle de Inicio. Hasta entonces no se toca Opciones, Personal, bordes, icono ni otras pantallas, y nada pasa a SwiftUI.

### Tarjeta C abierta (27 oct): **elegida la propuesta**

Con Inicio sin título y la C cerrada ya elegidos, Liber pidió estudiar solo el desglose que aparece al abrir C: jerarquía, alineaciones, separadores y espacio, sin tocar cifras, textos ni condiciones.

- Hecho: vista «Tarjeta abierta» (desglose actual y propuesta bajo la misma C), control «Desglose» y parámetro `desglose`. La propuesta agrupa cobro y gasolina con raya de subtotal, saca la deducción de la columna de la resta y deja las plataformas como detalle. Texto idéntico y en el mismo orden. Medidas, comprobaciones y recomendación en [HOME-TARJETA-ABIERTA.md](HOME-TARJETA-ABIERTA.md); capturas en `captures/home-tarjeta-abierta/`.
- Medida clave: con texto normal, la propuesta añade 8–36 px (ES) y hasta 58 px (EN). Con texto al 200 % queda igual o más corta.
- **Decisión de Liber (27 oct): la propuesta** para el desglose de C abierta, aceptando su altura extra con texto normal. En el laboratorio sigue accesible con `card=c&desglose=propuesta`; el desglose actual queda como referencia.
- **Siguiente paso:** que Liber elija el próximo detalle de Inicio. Hasta entonces no se toca el resto de Inicio, y nada pasa a SwiftUI.

### Opciones (27 oct): **elegida la propuesta**

Liber dio por cerrada la tarjeta verde (sin título, C y desglose propuesto) y pidió trabajar solo Opciones, cerrada y abierta, conservando sus dos accesos, sus notas y su navegación.

- Hecho: vista «Opciones» (actual y propuesta con todo lo elegido), control «Opciones», parámetro `opciones` y pantalla de laboratorio `homeBoth`. La propuesta es una sola pieza con el borde tenue existente, cabecera y las dos herramientas dentro, separadas por líneas finas, y columnas alineadas. Detalle, medidas, comprobaciones y recomendación en [HOME-OPCIONES.md](HOME-OPCIONES.md). Capturas en `captures/home-opciones/`.
- Medidas: cerrada, misma altura (56 px); abierta, 27 px menos en todos los tamaños.
- **Decisión de Liber (27 oct): la propuesta** para Opciones, cerrada y abierta. En el laboratorio sigue accesible con `opciones=propuesta`; la versión actual queda como referencia. Las sugerencias del foco al volver y del nombre «Herramientas» siguen sin aplicar.
- **Siguiente paso:** que Liber elija el próximo detalle de Inicio. Hasta entonces no se toca el resto de Inicio, y nada pasa a SwiftUI.

### Personal (27 oct): **elegida A**

Con Inicio sin título, la tarjeta C, su desglose y Opciones ya elegidos, Liber pidió trabajar solo la fila Personal, con «creatividad y elegancia», manteniendo sus cifras y el acceso a Historial → Personal.

- Hecho: vista «Personal» (actual, A y B con todo lo elegido), controles «Personal» y «Marcos», parámetros `personal` y `personales`, y escenario de prueba `personalLong` (1,248 / 12,486 mi). A es una fila de 56 px con Hoy y Este mes, periodo sobre valor, y flecha; pasa a dos niveles cuando no cabe. B tiene siempre dos niveles, con dos columnas iguales y una línea fina. Detalle, medidas, comprobaciones y recomendación (A) en [HOME-PERSONAL.md](HOME-PERSONAL.md). Capturas en `captures/home-personal/`.
- Medidas a 390 px: actual 48, A 56 (+8), B 94 (+46). A 320 px o con texto grande, A y B miden lo mismo.
- Prueba descartada: Liber pidió ver A «Sin caja» (sin rectángulo, solo una línea inferior) en un PNG de 390 × 844 y la descartó sin guardarla.
- **Decisión de Liber (27 oct): A**, con caja y en una fila. En el laboratorio sigue accesible con `personal=a`; la fila actual y B quedan como referencia.

### Personal en marcha (27 oct): **línea en vivo, pendiente de revisión**

Liber pidió ideas para la misma caja mientras conduce en personal y eligió la 1: la caja A con una línea en vivo. Esa línea sustituye al banner que hoy pone la app arriba del todo.

- Hecho: `liveLine()` dentro de la caja A, con los cuatro estados de la app (trackeando, buscando ubicación, sin señal GPS, en pausa), sus textos y Detener. El único texto nuevo es «este viaje». Hay cuatro pantallas de laboratorio (`screen=homeLive`, `homeLiveAcquiring`, `homeLiveNoSignal`, `homeLivePaused`). Detalle, medidas y límites en [HOME-PERSONAL-EN-MARCHA.md](HOME-PERSONAL-EN-MARCHA.md). Capturas a 390 × 844 en `captures/home-personal-en-marcha/`.
- Medidas a 390 px: la caja pasa de 56 a 118 px trackeando y a 157 px en pausa.
- **Siguiente paso exacto:** Liber revisa las cuatro capturas. No se toca el resto de Inicio, y nada pasa a SwiftUI.

## Cómo continuar

1. Abre `index.html`, elige la vista «Las cuatro» y recorre la lista «Pantalla».
2. Antes de entregar cambios, ejecuta los cuatro comandos de `README.md`. Las pruebas de UI tardan unos 2 minutos.
3. Para cambiar un color o un radio, edita `design-tokens.json` y regenera. Para cambiar estructura en una familia, usa su `composition` y la rama correspondiente en `js/screens.js`.
4. Siguientes pasos razonables:
   - si se acepta la recomendación, fusionar V1 + préstamos de V2 en una «V4» con su propio `override`;
   - subir los segmentos a 44 px;
   - proponer el onboarding como aproximación;
   - validar en Safari/iOS real antes de llevar cualquier decisión a la app.

## Límites que se mantienen

No hay backend, GPS, motores de millas/impuestos, APIs, cuentas ni datos reales. Este trabajo no se integró en la app de producción ni se desplegó. Las referencias de `screens/`, `screens.json`, `TOKENS-BASE.json` y `SHA256SUMS` no se modificaron, y `sha256sum -c SHA256SUMS` sigue pasando. Por eso el README raíz y `COBERTURA.md`, que también están en el manifiesto, no enlazan todavía al prototipo. Si se quiere ese enlace, hay que editarlos y regenerar el manifiesto con aprobación del propietario.
