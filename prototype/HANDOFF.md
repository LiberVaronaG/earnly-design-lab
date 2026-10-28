# HANDOFF

Último punto recuperable: rama `design/home-sin-titulo-2026-10-27`, derivada de `claude/prototype-design-lab` (`0a5ba0e`), que no se ha modificado. Para abrirlo, `prototype/index.html`. Inicio elegido hasta ahora: sin título, tarjeta C y su desglose propuesto (`#view=single&family=v0&home=sintitulo&card=c&desglose=propuesta&lang=es&scenario=partial&screen=home`). Comparación de la tarjeta C abierta: `#view=abierta&family=v0&lang=es&scenario=complete&screen=homeBreakdown`. La de la tarjeta verde: `prototype/index.html#view=tarjeta&cards=actual,c&family=v0&lang=es&scenario=partial&screen=home`. La de Original / Sin título sigue en `#view=sintitulo&family=v0&lang=es&scenario=partial&screen=home`.

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
