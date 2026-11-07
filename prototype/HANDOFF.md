# HANDOFF

Último punto recuperable: rama `design/home-sin-titulo-2026-10-27`, derivada de `claude/prototype-design-lab` (`0a5ba0e`), que no se ha modificado. Para abrirlo, `prototype/index.html`. Inicio elegido hasta ahora: sin título, tarjeta C, su desglose propuesto, Opciones propuesta, Personal A, durante un viaje personal El viaje primero el círculo «Iniciar turno» con el trébol de Woodbridge de fondo, que en oscuro se corta alrededor del texto, los avisos B · Cada uno en su sitio, Recientes D · El último en grande y, durante el turno, B · Como tu viaje personal sin la ficha «Trackeando» (`#view=single&family=v0&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&personal=a&vivo=tablero&circulo=fondo-corte&avisos=b&recientes=d&turno=b&lang=es&scenario=partial&screen=home`; con viaje, `screen=homeLive`; con dos avisos, `screen=homeTwoNotices`; sin avisos, para ver Recientes, `screen=homeNoNotice`; con un turno en curso, `screen=active`). Comparación del círculo: `#view=iniciar&family=v0&lang=es&scenario=partial&screen=home`; su contraste en oscuro: `#view=contraste&family=v0&theme=dark&lang=es&scenario=partial&screen=home`. Avisos: `#view=avisos&family=v0&lang=es&scenario=partial&screen=homeTwoNotices`. Recientes (elegida D): `#view=recientes&family=v0&lang=es&scenario=partial&screen=homeNoNotice`. Turno en curso (elegida B): `#view=turno&family=v0&lang=es&scenario=partial&screen=active`. Cierre del turno (elegida A, con la lista filtrada): `#view=cierre&family=v0&lang=es&scenario=complete&screen=closeStacked`. Comparación de Personal: `#view=personal&family=v0&lang=es&scenario=partial&screen=home`. Comparación de Opciones: `#view=opciones&family=v0&lang=es&scenario=partial&screen=homeOptions`. Comparación de la tarjeta C abierta: `#view=abierta&family=v0&lang=es&scenario=complete&screen=homeBreakdown`. La de la tarjeta verde: `prototype/index.html#view=tarjeta&cards=actual,c&family=v0&lang=es&scenario=partial&screen=home`. La de Original / Sin título sigue en `#view=sintitulo&family=v0&lang=es&scenario=partial&screen=home`.

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

### Personal en marcha (27 oct): **elegida El viaje primero (`vivo=tablero`)**

Liber pidió ideas para la misma caja mientras conduce en personal y eligió la 1: la caja A con una línea en vivo. Esa línea sustituye al banner que hoy pone la app arriba del todo.

- Hecho: `liveLine()` dentro de la caja A, con los cuatro estados de la app (trackeando, buscando ubicación, sin señal GPS, en pausa), sus textos y Detener. El único texto nuevo es «este viaje». Hay cuatro pantallas de laboratorio (`screen=homeLive`, `homeLiveAcquiring`, `homeLiveNoSignal`, `homeLivePaused`). Detalle, medidas y límites en [HOME-PERSONAL-EN-MARCHA.md](HOME-PERSONAL-EN-MARCHA.md). Capturas a 390 × 844 en `captures/home-personal-en-marcha/`.
- Medidas a 390 px: la caja pasa de 56 a 118 px trackeando y a 157 px en pausa.
- Liber pidió dos más «con cambios en la interfaz y otra perspectiva». Se construyeron:
  - **2 · El viaje primero:** etiqueta de estado, millas en grande y Detener con fondo, encima de la fila A.
  - **3 · Barra fija abajo:** la barra va sobre las pestañas y la caja A no cambia.
  Vista «Personal en marcha» (`#view=enmarcha&family=v0&lang=es&scenario=partial&screen=homeLive`), control «En marcha» y parámetro `vivo`. Capturas lado a lado en `captures/home-personal-en-marcha-tres/`.
- Medidas a 390 px, trackeando: 1 = 118 px, 2 = 166 px, 3 = caja de 56 px más una barra fija de 61 px. Con texto al 200 % a 320 px, la barra de la 3 deja solo 163 px visibles de Inicio.
- Recomendación: la 2.
- **Decisión de Liber (27 oct): El viaje primero**, vista en el PNG de Codex `briefs/home-viaje-primero/tres-ideas-home.png`. Encargo: `briefs/home-viaje-primero/PROMPT-CLAUDE.md`.
  - **Numeración:** en ese PNG es la «1»; en el laboratorio es la **2 · El viaje primero**, `liveBoard()`, `vivo=tablero`. No se renumeró nada.
  - La 1 · Línea en vivo y la 3 · Barra fija abajo se quedan como referencias, con sus capturas.
  - Al registrarla no cambió el producto: solo se añadieron dos capturas individuales, en `captures/home-personal-viaje-primero/`.
  - Las comprobaciones de las tres variantes siguen valiendo; no se repitieron.
- Siguiente paso de entonces: que Liber eligiera el próximo detalle de Inicio. Fue el círculo «Iniciar turno».

### Iniciar turno (28 oct): **elegido Fondo · Woodbridge, con Corte en oscuro (`circulo=fondo-corte`)**

Detalle completo en [HOME-INICIAR-TURNO.md](HOME-INICIAR-TURNO.md).

- Liber pidió un icono para el círculo a partir de un cruce de carreteras famoso y eligió el trébol de Woodbridge (Nueva Jersey).
- Rechazó un trébol genérico porque no era idéntico a la calle. Se trazó con OpenStreetMap: `tools/build-start-map.cjs` genera `js/start-map.js`.
- De «Sello» y «Fondo», eligió **Fondo**: el cruce real en líneas blancas al 30 % detrás del texto.
- Vista «Iniciar turno», control «Círculo» y parámetro `circulo`.
- Se corrigió que el foco de teclado volviera cuadrado el círculo.
- Comprobación: 1600 renders sin fallos.
- En oscuro, el texto quedaba a 2,43 : 1 donde lo cruzaba una línea. Se probaron dos correcciones en la vista «Contraste en oscuro»; auditoría de 2400 renders sin fallos.
  - **Decisión de Liber (28 oct): Corte** (`circulo=fondo-corte`). Un halo del verde del círculo para las líneas antes de cada letra, y el mapa sigue al 30 %. Era la recomendada.
  - Tenue (`circulo=fondo-tenue`, el mapa al 12 % en oscuro) queda como referencia, con sus capturas.
  - Al registrarla no cambió el producto; las comprobaciones siguen valiendo.
- **Pendiente:**
  - En SwiftUI, Corte necesita otra técnica (una máscara hecha con el propio texto). No se ha probado.
  - Las decoraciones de Navidad tapan el mapa.
  - Si pasa a la app: crédito de OpenStreetMap en Acerca de, SPEC §4.3 y PARITY.md.
- Siguiente paso de entonces: que Liber eligiera el próximo detalle de Inicio. Fueron los avisos.

### Avisos (6 nov): **elegida B · Cada uno en su sitio (`avisos=b`)**

Detalle completo en [HOME-AVISOS.md](HOME-AVISOS.md).

- Liber descartó el rediseño del icono de la app (no está en este repositorio) y volvió a lo que faltaba por revisar en Inicio. Pidió tres propuestas de avisos.
- El laboratorio ahora tiene los cuatro avisos de la app: ubicación «Siempre», ubicación apagada, ahorro de batería (con «Iniciar turno» desactivado) y Personal sin Movimiento. Hay pantallas nuevas para cada estado y para dos avisos a la vez.
- Las propuestas:
  - **A · Un solo aviso** (`avisos=a`): una caja ordenada por gravedad, con los textos de la app y un botón por aviso.
  - **B · Cada uno en su sitio** (`avisos=b`): lo del turno bajo el círculo, y Personal bloqueado dentro de Personal.
  - **C · Franja arriba** (`avisos=c`): filas cortas sobre la tarjeta; la explicación va en una hoja.
- Vista «Avisos», control «Avisos» y parámetro `avisos`. Sin `avisos`, el prototipo se comporta como antes, salvo que el aviso de ubicación apagada del Inicio V0 ahora usa el texto de la app.
- Recomendación: **B**. El círculo no se mueve nunca y el motivo de cada aviso va junto a lo que afecta.
- Comprobación: auditoría WebKit de 864 renders y las 8 hojas de C, sin fallos; un control negativo detectó 5 de 5 fallos provocados.
  - Se corrigió el halo verde del Corte sobre el círculo desactivado en oscuro.
- La herramienta de capturas ya no deja que la barra de desplazamiento del Mac robe 11 px. Las capturas anteriores no se regeneraron.
- **Decisión de Liber (6 nov): B · Cada uno en su sitio**, la recomendada.
  - A y C se quedan en el laboratorio como referencia, con sus capturas.
  - Al registrarla no cambió el producto; las comprobaciones siguen valiendo.
- **Pendiente si pasa a la app:**
  - revisar las cinco frases cortas nuevas en español e inglés;
  - comprobar en el iPhone que se lee el texto blanco del círculo desactivado;
  - cambiar SPEC §4.3, PARITY.md y Android.
- Siguiente paso de entonces: el próximo detalle de Inicio. Fue Recientes, el siguiente del orden propuesto.

### Recientes (6 nov): **elegida D · El último en grande (`recientes=d`)**

Detalle completo en [HOME-RECIENTES.md](HOME-RECIENTES.md).

- **Corrección:** el laboratorio dibujaba Recientes como tres tarjetas de texto, y la app no es así.
  - Desde el 18 may, la app muestra una sola tarjeta del último turno: mapa de 140 pt y una fila de datos que no se puede tocar.
  - La versión antigua se queda como `recientes=lab` y sigue siendo el valor por defecto. La vista nueva usa como «Hoy» la tarjeta de la app, con un mapa ficticio.
  - El SPEC §4.3 todavía describe la lista de tres.
- **Qué falla hoy en la app:**
  - la fila corta algún dato en 184 de 288 estados auditados;
  - no se puede tocar;
  - no muestra el pago;
  - sin ruta deja una caja vacía de 140 pt.
- **Las propuestas:**
  - **A · Mapa con datos** (`recientes=a`): el mapa a 120 pt, dos líneas con el pago y la tarjeta se puede tocar.
  - **B · Los tres últimos** (`recientes=b`): tres filas sin mapa. Deshace la decisión del 18 may.
  - **C · El último, compacto** (`recientes=c`): el recorrido dibujado y los datos en una fila de 90 px.
- Vista «Recientes», control «Recientes» y parámetro `recientes`.
- **Recomendación: A.** Conserva el mapa real y arregla lo que falla.
- **Comprobación:** 1152 renders sin fallos en las propuestas; control negativo de 6 de 6.
  - Se corrigió un recorte en B con un importe largo.
  - Se corrigió también la propia comprobación de «Ver todo», que contaba cajas en vez de líneas.
- **Después, Liber pidió D · El último en grande** (`recientes=d`), a partir de un boceto de ChatGPT.
  - Sin mapa: lo eligió él, aunque deshace la decisión del 18 may.
  - Tres cifras en grande: millas, cobrado y deducción estimada. Debajo, el horario y la duración.
  - Los dos anteriores van como filas, bajo «Anteriores».
  - A 390 px sin avisos, la tarjeta grande cabe entera en la primera pantalla. El bloque mide 331 px.
- **Comprobación con D:** 1440 renders sin fallos; control negativo de 12 de 12. Se corrigieron dos desbordes de D con un importe largo a 320 px y texto al 200 %.
- **Decisión de Liber (6 nov): D · El último en grande.** La confirmó al verla.
  - Hoy, A, B y C se quedan en el laboratorio como referencia, con sus capturas.
  - Al registrarla no cambió el diseño; las comprobaciones siguen valiendo.
  - El enlace del Inicio elegido ahora lleva `recientes=d`.
- **Pendiente si pasa a la app:**
  - quitar el mapa de Inicio, que deshace la decisión del 18 may;
  - revisar «Anteriores» / «Earlier», la única frase nueva;
  - comprobar en el iPhone el reparto de las tres cifras con Dynamic Type real;
  - una etiqueta de VoiceOver por tarjeta y por fila;
  - cambiar SPEC §4.3, PARITY.md, `docs/parity/home-screen.md` y Android.
- **Siguiente paso:** que Liber elija el próximo detalle de Inicio. En el orden propuesto toca el turno activo: el círculo que cambia por «Turno activo», que falta en el laboratorio. Nada pasa a SwiftUI.

### Turno en curso (6 nov): **elegida B · Como tu viaje personal (`turno=b`), sin «Trackeando»**

Detalle completo en [HOME-TURNO-ACTIVO.md](HOME-TURNO-ACTIVO.md).

- **Hallazgo:** con un turno en marcha, Inicio salta solo a la pantalla de seguimiento, que no tiene botón para volver, así que el círculo «Turno activo» de Inicio casi nunca se ve. Por eso el paso pasó a ser la pantalla del turno en curso, que Liber eligió.
- **Corrección:** el «Turno en curso» del laboratorio no era la app. Se queda como `turno=lab`, el valor por defecto. La vista nueva usa como «Hoy» la pantalla de la app: título, mapa de 240 pt, millas, duración y «Terminar turno».
- **Qué falla hoy:**
  - no dice si graba, en qué plataforma ni desde qué hora;
  - «Terminar turno» queda fuera de la pantalla en 80 de 180 estados, porque la pantalla no se desplaza: a 390 px, con el aviso de batería; a 320 px, siempre;
  - con texto normal, un tercio de la pantalla queda vacío.
- **Las propuestas:**
  - **A · Con estado** (`turno=a`): la misma pantalla con una línea de estado.
  - **B · Como tu viaje personal** (`turno=b`): el lenguaje de «El viaje primero»: estado, millas grandes, duración y deducción, y luego el mapa.
  - **C · Mapa grande** (`turno=c`): el mapa arriba y un panel con tres cifras.
- **En las tres:**
  - «Terminar turno» siempre a la vista, con el rojo y el resplandor del SPEC §4.4;
  - el aviso de batería corto;
  - un mapa que encoge antes de tapar una cifra.
- **Frente al SPEC §4.4,** que pide el mapa arriba en un tercio de la pantalla: A lo cumple, y B y C lo cambian.
- **Recomendación: B.** Es la única en la que las millas se ven sin desplazar en los 180 estados. Su coste es cambiar esa línea del SPEC.
- **Comprobación:**
  - 720 renders sin fallos y control negativo de 11 de 11;
  - Recientes y avisos siguen sin fallos, y sus capturas no cambiaron.
- **No se propone «Sin señal GPS»:** con el filtro de 10 m, parado no llegan puntos, y daría falsas alarmas. Haría falta un cambio en el motor.
- **Decisión de Liber (6 nov): B, sin la ficha «Trackeando turno» con el punto verde.**
  - Arriba solo quedan la plataforma y la hora de inicio, como en Recientes D.
  - «Buscando tu ubicación» se queda antes del primer punto GPS; si Liber lo quiere fuera, se quita.
  - A y C se quedan como referencia; el enlace del Inicio elegido lleva `turno=b`.
  - Auditoría repetida: 720 renders sin fallos; control negativo de 13 de 13.
- **Espacio:** Liber notó que sobraba espacio. Pensaba que la pantalla casi no se ve, pero se ve todo el turno; la que casi no se ve es el círculo de Inicio.
- **Espacio de B, probado** (vista «Turno activo · espacio de B»):
  - **B · Mapa con tope** (`turno=b-tope`): el mapa no pasa de 240 px y deja 153 px vacíos a 390 px.
  - **B · Más junto** (`turno=b-junto`): 20 px menos de caja con texto normal y 80 menos con texto al 200 %, donde cabe sin desplazar. Es la recomendada.
  - Auditoría: 540 renders sin fallos.
  - Parte del espacio viene del mapa ficticio, que se amplía como una foto; en la app, un mapa más alto enseña más calles.
- **Decisión de Liber (6 nov): B tal cual, sin ajustar el espacio**, con la plataforma y la hora arriba y sin «Trackeando». Las dos pruebas se quedan como referencia. Con texto grande, conviene probarlo en el iPhone si pasa a la app.
- **Siguiente paso:** que Liber elija el próximo detalle de Inicio; en el orden propuesto toca Navidad. Nada pasa a SwiftUI.

### Cierre del turno (6 nov): **elegida A · Marca las apps (`cierre=a`)**

Detalle completo en [CIERRE-TURNO.md](CIERRE-TURNO.md).

- **Nombres:** Liber llama «base 1» a lo que se va eligiendo encima de la app actual, la «base 0». En el laboratorio también existe una familia «V1», que es otra cosa. Antes de Navidad quiere terminar la base 1.
- **Corrección:** la app publicada (2.0.3, compilada desde `081c436`) solo pregunta en el cierre el cobro de la app del turno, más la propina si la plataforma tiene.
  - Las otras apps se añaden después, editando el turno en Historial.
  - El laboratorio tenía «Agregar pago de otra plataforma» en el cierre. Se queda como `cierre=lab`, el valor por defecto, y sigue idéntico.
- **Las propuestas** preguntan en el cierre qué apps se usaron y cuánto pagó cada una, y guardan lo que la app ya guarda (`extraEarnings`):
  - **A · Marca las apps** (`cierre=a`): «¿Qué apps usaste en este turno?», con una lista.
  - **B · Añadir otra** (`cierre=b`): «+ Otra app».
  - **C · Pregunta primero** (`cierre=c`): «¿Usaste otra app además de Amazon Flex?», con No y Sí.
- **Recomendación: A.** Pregunta lo que Liber pidió, con un toque por app. B es la más corta, pero no pregunta.
- **Comprobación:**
  - 1296 renders sin fallos y control negativo de 10 de 10;
  - el resto de las auditorías y capturas no cambian.
- **Las millas personales mientras manejas:** Liber confirmó que es Inicio, ya elegido («El viaje primero»). Se revisa en la pasada final.
- **Decisión de Liber (6 nov): A**, con la lista limitada a las apps que de verdad se combinan con la del turno.
  - Investigación y reglas propuestas en [CIERRE-COMBINACIONES.md](CIERRE-COMBINACIONES.md): Flex sin combinaciones, Uber con Lyft, DoorDash y Grubhub, lo que anota cada conductor manda, y «Otra app» como puerta para lo demás.
  - **Construido** cuando Liber aceptó las reglas. Con un turno de Flex, A mide 222 px aunque haya cinco apps activadas.
  - De paso, la propina de la app del turno en plataformas con propinas, como la app, y GrubHub en el laboratorio.
  - Auditoría: 2016 renders sin fallos; control negativo de 15 de 15. El cierre antiguo sigue idéntico.
- **Liber aprobó la lista filtrada el 6 nov** (`afcc68a`). Al registrarlo no cambió el producto.
- **Siguiente paso:** Navidad (el gorrito frente al mapa del círculo) y después la pasada final por Inicio entero. Nada pasa a SwiftUI.

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
