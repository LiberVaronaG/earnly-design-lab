# Base 1: la pasada final de Inicio

6 nov 2026; el 7 nov Liber aprobó el verde en oscuro y la línea suave. Rama `design/home-sin-titulo-2026-10-27`.

- **Base 0:** la app publicada (2.0.3).
- **Base 1:** todo lo que Liber eligió encima de la base 0. Es una base fija y no lleva ninguna decoración de fiestas.
- **Base 2:** la Navidad, que irá encima de la base 1.

En el laboratorio, «tokens» también son los colores y radios de `design-tokens.json` y `TOKENS-BASE.json`. Aquí se dice «base» para no confundirlos.

## Abrirla

- **Con un solo enlace:** `index.html#base=1&lang=es&scenario=partial&screen=home`.
  - Cambia `screen` para recorrerla. Por ejemplo: `homeLive` (viaje personal), `homeTwoNotices`, `active` (turno en curso), `activeEnd`, `closeStacked` (cierre).
  - Admite `theme`, `width` y `text` como el resto del laboratorio.
- **Desde los controles:** «Base → Base 1 (elegida)».
  - Si cambias cualquier pieza, el control pasa a «A medida».
  - El enlace vuelve a escribirse completo.

| Pieza | Elegida | Detalle |
|---|---|---|
| Rótulo | Sin título | [HOME-SIN-TITULO.md](HOME-SIN-TITULO.md) |
| Tarjeta verde | C · Dos zonas, con el desglose propuesto | [HOME-TARJETA-VERDE.md](HOME-TARJETA-VERDE.md), [HOME-TARJETA-ABIERTA.md](HOME-TARJETA-ABIERTA.md) |
| Opciones | Propuesta | [HOME-OPCIONES.md](HOME-OPCIONES.md) |
| Personal | A, y durante un viaje «El viaje primero» | [HOME-PERSONAL.md](HOME-PERSONAL.md), [HOME-PERSONAL-EN-MARCHA.md](HOME-PERSONAL-EN-MARCHA.md) |
| Iniciar turno | Fondo · Woodbridge, con Corte en oscuro | [HOME-INICIAR-TURNO.md](HOME-INICIAR-TURNO.md) |
| Avisos | B · Cada uno en su sitio | [HOME-AVISOS.md](HOME-AVISOS.md) |
| Recientes | D · El último en grande | [HOME-RECIENTES.md](HOME-RECIENTES.md) |
| Turno en curso | B sin «Trackeando», sin cambio de espacio | [HOME-TURNO-ACTIVO.md](HOME-TURNO-ACTIVO.md) |
| Cierre | A · Marca las apps, con la lista filtrada | [CIERRE-TURNO.md](CIERRE-TURNO.md), [CIERRE-COMBINACIONES.md](CIERRE-COMBINACIONES.md) |
| Letra | La de la app: tres tamaños | ver abajo |
| Verde oscuro | Legible · #36853A | ver abajo |
| Bordes | Una línea suave; los campos, la fuerte | ver abajo |
| Decoración | Ninguna | |

## Lo que cambia al verla junta: la letra de la app

**El laboratorio dibujaba los textos secundarios más pequeños que la app.**

- La app publicada solo usa tres tamaños, como pide el SPEC:
  - cuerpo, 17 px (434 usos en las vistas);
  - título 2, 22 px;
  - título grande, 34 px.
- Los textos secundarios («Cobrado», «Hoy», «este viaje», «Duración»…) son cuerpo con un color más suave, no un tamaño menor.
- El laboratorio los pintaba:
  - a 15 px;
  - las fichas, a 13 px;
  - los títulos de sección, a 20 px;
  - la cifra del resultado del cierre, a 26 px.

**La base 1 usa la letra de la app** (control «Letra → App · tres tamaños», `tipo=app`). Así el laboratorio enseña lo que dibujaría SwiftUI, y las medidas de abajo valen para el teléfono.

- Todo se ve un poco más grande que en las capturas con las que se eligió cada pieza.
- **No cambian ni el orden ni los textos.**
- Las demás vistas del laboratorio siguen con su letra (`tipo=lab`, por defecto), para que sus comparaciones no cambien.

## Qué se midió

**1680 estados en WebKit.** Son 35 pantallas, cada una:

- en cuatro anchos:
  - 320 px, solo como prueba de estrés;
  - 375 × 667, el iPhone SE, el más pequeño que admite iOS 18;
  - 390 × 844;
  - 430 × 932;
- con tres tamaños de texto: 100 %, 135 % y 200 %;
- en claro y oscuro;
- en español e inglés.

Las 35 pantallas son 18 de Inicio, 5 del turno en curso y 12 del cierre.

En cada estado se comprueba:

- **Que nada se salga por los lados:**
  - la página no se desplaza de lado;
  - ningún elemento queda fuera de la pantalla;
  - ningún texto ni botón se sale de su caja;
  - no hay zonas que se arrastren de lado.
- **El texto:**
  - contraste WCAG: 4,5 : 1, o 3 : 1 en texto grande;
  - nada cortado sin aviso;
  - solo los tres tamaños de la app. Las cifras que se encogen para caber, como `minimumScaleFactor`, se anotan aparte.
- **Los dedos:**
  - cada control mide al menos 44 × 44, contando su zona táctil ampliada;
  - ningún control se monta sobre otro;
  - cada control tiene nombre para VoiceOver;
  - todo lo que lleva flecha «›» se puede tocar.
- **Las barras fijas:** el contenido nunca queda debajo de la barra de pestañas, de la de «Terminar turno» ni de la de «Listo». Así siempre se llega a lo último.
- **Medidas que se anotan:**
  - qué cabe sin desplazar;
  - los márgenes laterales y el interior de cada caja;
  - los huecos entre bloques;
  - las esquinas;
  - dónde cae la acción principal.

## Resultados

### Márgenes y adaptación al ancho

- **Margen lateral:** 16 px a cada lado en los cuatro anchos, en todas las pantallas.
- **Dentro de las cajas:** el contenido empieza a 32 px del borde en la tarjeta verde, que no tiene borde, y a 33 px en las demás (16 px más 1 px de borde). Iconos, textos y cifras quedan en la misma línea vertical de arriba abajo.
- **Las filas de «Anteriores» y los títulos de sección** van a 16 px a propósito: son lista y rótulos, no cajas.
- **Huecos:** 12 px entre bloques. Entre el círculo y su aviso, 4 px, que es lo elegido en avisos B: el aviso va pegado al círculo.
- **Esquinas:** 12 px en todas las cajas y 10 px en los campos.
- **Sin desbordes** en ningún ancho ni tamaño de texto, ya con las correcciones de abajo.

### Dedos

- Todos los controles miden al menos 44 × 44.
  - El importe de la tarjeta verde mide 37 px de alto a la vista, pero su zona táctil es de 49 px, como en la app.
- Ningún control se monta sobre otro.
- Ninguna zona se arrastra de lado: el único gesto es desplazar hacia abajo.
- Todo lo que lleva «›» se abre al tocarlo.
- **Dónde cae la acción principal:**
  - «Terminar turno» y «Listo» van en la barra fija de abajo, entre el 81 % y el 88 % de la altura de la pantalla, en la zona del pulgar, y siempre se ven.
  - El círculo «Iniciar turno» cae a media pantalla: con texto normal y cuando entra entero, entre el 48 % y el 68 % de la altura.
  - En el diálogo de terminar, «Cancelar» va a la izquierda y «Guardar turno» a la derecha, como en iOS.

### Qué se ve sin desplazar (texto al 100 %)

| Pantalla | iPhone SE (375 × 667) | 390 × 844 | 430 × 932 |
|---|---|---|---|
| Inicio con aviso | Hasta el círculo entero; el aviso, cortado | Hasta el aviso entero; Recientes empieza | Igual que 390 |
| Inicio sin aviso | Hasta el círculo entero | Hasta el círculo; Recientes empieza | Hasta la tarjeta de Recientes entera |
| Inicio con viaje personal | **Hasta la caja del viaje; el círculo, cortado** | Hasta el círculo entero | Hasta el aviso entero |
| Turno en curso | Todo: millas, cifras, mapa y «Terminar turno» | Todo | Todo |
| Cierre | El resumen; la caja del cobro empieza; «Listo» siempre visible | Igual | Igual |

- **Con texto al 135 %:**
  - en el SE el círculo queda cortado;
  - en 390 entra entero, salvo durante un viaje personal.
- **Con texto al 200 %** todo se desplaza. El círculo queda debajo en casi todos los anchos. «Terminar turno» y «Listo» se siguen viendo porque van fijos.

## Corregido en esta pasada

1. **La letra de la app en la base 1**, como se explica arriba.
2. **«principal» ya no queda sola en una línea.**
   - Con la letra de la app, «2 de 3 turnos · 1 sin pago principal» ya no cabe en una línea a 390 px, y «principal» quedaba sola debajo.
   - Ahora se parte por el punto: «2 de 3 turnos ·» / «1 sin pago principal». En una línea, cuando cabe, queda igual que antes.
   - En SwiftUI sería un `ViewThatFits` con las dos partes en fila y, si no caben, una debajo de otra.
3. **Un texto que se salía de su caja.**
   - En inglés, con 320 px y texto al 200 %, la palabra «undercounted.» del aviso de ahorro de batería durante el turno no cabía en la línea y empujaba el texto fuera de la caja.
   - Ahora la palabra se parte, como hace `Text` en SwiftUI.

## Aprobado el 7 nov: el verde y los bordes

Liber aprobó las dos propuestas de la pasada. Cada una tiene su control en el laboratorio, como la letra, para comparar con la app publicada. La base 1 las trae puestas y la base 0 sigue igual.

1. **El verde de los botones en oscuro** (control «Verde oscuro → Legible · #36853A», `verde=legible`).
   - En oscuro, «Listo» y «Guardar turno» llevaban letra blanca sobre #3F9442: 3,80 : 1, por debajo del 4,5 : 1 que pide su tamaño. Venía de la base 0.
   - El círculo «Iniciar turno» usa el mismo verde. Con su letra grande ya pasaba (3 : 1), y ahora tiene más margen.
   - Ahora el verde es #36853A en oscuro: 4,59 : 1. El claro, #2D6B30, no cambia (6,45 : 1).
   - El punto de salida del mapa usa el mismo verde en la app (`ActionPositive`), así que también cambia.
   - Sobre las tarjetas, el verde como icono o contorno queda en 3,33 : 1; para gráficos el mínimo es 3 : 1.
   - Está en `design-tokens.json`, en `adjustments.verde`. El comprobador de contraste lo revisa aparte («v0+verde»), sin la excepción de lo heredado.
2. **Una sola línea para las cajas** (control «Bordes → Una línea suave», `bordes=suave`).
   - Ahora llevan la línea suave de Inicio (el granate al 30 %):
     - el mapa del turno en curso;
     - las tarjetas del cierre: resumen, cobro, resultado y estación;
     - el aviso de batería baja durante el turno. No estaba en la propuesta, pero va en la misma pantalla, entre la tarjeta y el mapa. Sin él, volvían a verse las dos líneas juntas.
   - **Los campos donde se escribe mantienen la fuerte,** porque un campo necesita al menos 3 : 1 para verse como campo. También los botones secundarios y las casillas de la lista de apps, que llevan su propio color.
   - Revisado en las 35 pantallas: la línea fuerte ya solo queda en los campos.

**Observaciones, sin propuesta de cambio:**

- **En el SE, durante un viaje personal,** el círculo queda cortado por las pestañas: se ve la mitad de arriba y se puede tocar. Para que entrara habría que quitar unos 60 px de arriba, más de lo que se gana achicando el círculo.
- **En el cierre, la pregunta del cobro va debajo del resumen del turno,** igual que en la app. En el SE se ve el resumen y el principio de la pregunta. Si se quisiera la pregunta primero, sería cambiar el orden de la base 0.

## Comprobación

- **Auditoría:** 1680 de 1680 estados aplicados.
  - **6 nov:** el único fallo, en 88 estados, era el verde de los botones en oscuro: oscuro, texto al 100 %, «Listo» y «Guardar turno».
  - **7 nov, con el verde y los bordes aprobados:** ningún fallo en los 1680 estados.
- **Control negativo:** 10 de 10.
  - Ocho errores metidos a propósito se detectaron con el mensaje previsto:
    - una página más ancha que la pantalla;
    - un control de 30 px;
    - la letra del laboratorio;
    - un texto que se sale de su caja;
    - dos controles montados;
    - texto sin contraste;
    - contenido debajo de las pestañas;
    - un texto cortado.
  - Las dos pasadas sin errores salieron limpias.
- **Regresión:** todas las demás capturas se regeneraron con el código de antes y con el de ahora.
  - 68 son idénticas.
  - Las otras 64 solo cambian en la línea «2 de 3 turnos · 1 sin pago principal» de la tarjeta C:
    - a 320 px ahora se parte por el punto;
    - en una línea, el espacio tras el punto se mueve menos de 1 px.
  - Las capturas guardadas de esas vistas no se regeneraron, porque son historial.
  - **7 nov:** las 150 capturas de las otras 14 vistas, generadas otra vez con el verde y los bordes nuevos, salen idénticas píxel a píxel. Los dos ajustes solo actúan en la base 1.
- **Tokens, contraste y SHA256SUMS:**
  - Los tokens solo cambian por el ajuste nuevo; la base 0 sigue igual que `TOKENS-BASE.json`.
  - El contraste solo marca el verde heredado de la base 0. El ajuste da 4,59 : 1 en oscuro.
  - SHA256SUMS: 91 de 91. `screens/`, `screens.json`, `TOKENS-BASE.json` y `SHA256SUMS` no se tocaron.
- **No se ejecutó** `check-ui.cjs` (Chromium), porque Playwright no está instalado. La auditoría de WebKit lo sustituye.
- **No probado:** iOS, Apple Maps real, VoiceOver, Dynamic Type real ni la tipografía SF exacta. El navegador aproxima.

## Capturas

En `captures/home-base-1/`; se regeneran con `swift prototype/tools/capture-home-webkit.swift base-1`.

Se regeneraron el 7 nov, con el verde y los bordes. Las del 6 nov se habían hecho antes de corregir «principal» y lo seguían mostrando solo en su línea; las de ahora ya llevan la corrección.

- **Inicio a 390:** claro y oscuro.
- **Inicio en el SE:** con texto al 100 % y al 135 %.
- **Inicio con un viaje personal:** a 390 y en el SE.
- **Inicio con dos avisos.**
- **Inicio entero, desplazado:** con el desglose abierto y con Opciones abierta.
- **Turno en curso:** a 390, en el SE y con la pregunta de terminar en oscuro.
- **Cierre:** con Uber y con Flex.
- **Inicio a 320 con texto al 200 %.**

## Si pasa a la app

- **Lo que hay que hacer en SwiftUI:**
  - la línea de la tarjeta verde con `ViewThatFits`;
  - los avisos con `Text`, que ya parte las palabras largas;
  - el resto de cada pieza está en su documento.
- **Lo que no cambia:** la letra ya es la de la app (cuerpo, título 2 y título grande), así que no hay tamaños nuevos.
- **Los colores, aprobados por Liber:**
  - `ActionPositive` en oscuro pasa a #36853A, en iOS (`Assets.xcassets`) y en Android (`colors.xml`) a la vez; el claro no cambia;
  - el mapa del turno y las tarjetas del cierre pasan a la línea suave que ya usa Inicio; los campos siguen con la fuerte.
- **Lo de siempre:**
  - SPEC §4.3 (Inicio), §4.4 (turno en curso) y §4.5 (cierre);
  - PARITY.md y su `docs/parity`;
  - Android.
