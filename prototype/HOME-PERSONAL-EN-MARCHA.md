# Personal en marcha: tres formas de mostrar el viaje

Rama `design/home-sin-titulo-2026-10-27`, 27 oct 2026. Petición de Liber: la misma caja Personal, pero mientras conduce en personal. Eligió primero la idea 1, la misma caja con una línea en vivo. Después pidió dos más «con cambios en la interfaz y otra perspectiva»: la 2, «El viaje primero», y la 3, «Barra fija abajo». **Las tres están pendientes de elección.** Nada de esto está en la app.

![Las tres, trackeando, claro, ES](captures/home-personal-en-marcha-tres/01-comparar-trackeando-claro-es.png)

## Qué hace hoy la app real

Lo saco del código de iOS, no del laboratorio (el laboratorio no tenía este estado):

- Mientras hay un viaje personal abierto, `HomeView` muestra `PersonalTrackingBanner` **arriba del todo**, aparte de la caja Personal.
- El banner tiene un estado, las millas del viaje con un decimal y un botón **Detener**. Hay cuatro estados, cada uno con su motivo:

  | Estado | Motivo |
  |---|---|
  | Trackeando personal | — |
  | Buscando tu ubicación | esperando GPS |
  | Sin señal GPS | en pausa, sin señal |
  | Viaje en pausa | se reanuda si vuelves a conducir |

- **Hoy** y **Este mes** de la caja Personal solo suman viajes terminados (`endTime != nil`). El viaje en curso no cuenta hasta que se cierra.

## 1 · Línea en vivo

El banner de arriba desaparece y su contenido pasa dentro de la caja A elegida:

- **Arriba**, la fila A sin cambios: coche, Personal, Hoy, Este mes y la flecha. Sigue siendo el botón que abre Historial → Personal.
- **Debajo**, tras una línea fina que empieza en la columna del título (como las filas de Opciones), va la **línea en vivo**:
  - **En la columna del coche**, una marca de estado:
    - trackeando: un punto verde fijo;
    - buscando ubicación: la flecha de ubicación;
    - sin señal: una antena tachada en el color de aviso;
    - en pausa: el símbolo de pausa.
  - **En la columna del título:**
    - el estado, con el texto de la app;
    - debajo, «**3.2** mi este viaje»;
    - el motivo en su propia línea cuando lo hay. La app lo une con « · »; aquí va aparte para que el punto no quede colgando al final de una línea.
  - **Detener** a la derecha, en verde y semibold como en la app. Su texto termina en el mismo borde que la flecha de arriba.
- Con texto grande, Detener baja debajo del texto, alineado con él.
- Al pulsar Detener, la línea desaparece y el foco vuelve a la fila Personal. En el laboratorio, el viaje se suma a Hoy (0 → 3 mi) y a Este mes (9 → 12 mi).

Texto nuevo, solo uno: «este viaje» / «this drive». Así no parece que esas millas ya estén en Hoy, porque no lo están. Sin animaciones: el punto no parpadea.

## 2 · El viaje primero

El punto de vista cambia: mientras conduces, el protagonista es el viaje, no los totales.

- **Arriba de la caja**, el estado va en una etiqueta (el fondo de chip existente) con su marca: «● Trackeando personal».
- **Debajo**, las millas del viaje en grande (title2): «**3.2** mi», con «este viaje» y el motivo debajo.
- **Detener** pasa a ser un botón con fondo, más fácil de acertar parado.
- **Bajo una línea fina**, la fila A completa (Personal, Hoy, Este mes y la flecha), sin cambios. Pasa a segundo nivel.
- Con texto grande, Detener baja debajo de las millas.

Es la que mejor se lee de un vistazo en un semáforo: el estado y el número saltan a la vista. A cambio, es la más alta: 166 px trackeando a 390 px.

## 3 · Barra fija abajo

La perspectiva es la del sistema, como el minirreproductor de Música o la navegación de Mapas.

- **El viaje sale de la caja** y va en una barra pegada sobre las pestañas: marca, estado, «3.2 mi este viaje», el motivo y Detener como botón con fondo.
- **Siempre a la vista**, por mucho que bajes por Inicio, y Detener queda a la altura del pulgar.
- **La caja A no cambia** (56 px), así que el contenido de Inicio no se mueve al empezar o terminar un viaje.
- Las columnas de la barra coinciden con las del icono y el texto de las cajas.

Es la que menos mueve Inicio, pero vuelve a separar el viaje de la caja Personal. Además, la barra ocupa pantalla de forma permanente: con texto al 200 % a 320 px y en pausa se come 355 px, y a Inicio solo le quedan 163 px.

Archivos:
- `js/screens.js`: `liveInfo()` (lo común), `liveLine()` (1), `liveBoard()` (2) y `liveDock()` (3, en el pie de Inicio). La caja A va envuelta en `.pv-box` cuando hay viaje.
- `css/app.css`: estilos `.pv-box`, `.pv-live*`, `.pv-board*`, `.pv-chip`, `.pv-dock` y `.pv-stop-tinted`.
- `js/i18n.js`: textos de estado y motivo, copiados de `Localizable.xcstrings`, más «este viaje».
- `js/icons.js`: iconos `pause` y `signalOff`.
- `js/app.js`: acción `stopPersonalTrip` y cuatro pantallas de laboratorio.
- `js/lab.js` e `index.html`: las cuatro pantallas en el selector, la vista «Personal en marcha», el control «En marcha» y el parámetro `vivo` (`linea`, `tablero`, `barra`).
- `tools/capture-home-webkit.swift`: juegos `personal-en-marcha` (la 1, por estado) y `personal-en-marcha-tres` (las tres lado a lado).

## Abrir

`prototype/index.html#solo=1&family=v0&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&personal=a&lang=es&scenario=partial&screen=homeLive`

Cambia `screen` a `homeLiveAcquiring`, `homeLiveNoSignal` o `homeLivePaused`, y añade `vivo=tablero` o `vivo=barra` para la 2 o la 3. Las tres lado a lado: `#view=enmarcha&family=v0&lang=es&scenario=partial&screen=homeLive`. En la barra del laboratorio: **Vista → «Personal en marcha»** y **Pantalla → «Inicio · viaje personal: …»**. Solo existen con Personal A.

## Medidas

Altura de la caja Personal en px, en español, medida en Chromium. Sin viaje, la caja mide 56 a 390 y 430 px, y 94 a 320 px.

**Las tres, comparadas:**

| | Trackeando 390 px | En pausa 390 px | Trackeando 320 px | En pausa 320 px, 200 % |
|---|---|---|---|---|
| 1 · Línea en vivo | 118 | 157 | 179 | 594 |
| 2 · El viaje primero | 166 | 205 | 203 | 586 |
| 3 · Barra fija abajo | caja 56 + barra 61 | caja 56 + barra 100 | caja 94 + barra 86 | caja 240 + barra 355 |

La barra de la 3 no empuja el contenido, pero le quita esa altura a la zona visible de Inicio. A 390 px quedan 656 px de 717 trackeando y 617 en pausa; a 320 px con texto al 200 % quedan solo 163 px.

**Solo la 1, en detalle:**

| Estado | 390 px | 320 px | 430 px | 390 px, 135 % | 320 px, 200 % |
|---|---|---|---|---|---|
| Trackeando | 118 | 179 | 118 | 225 | 477 |
| Buscando ubicación | 138 | 199 | 138 | 251 | 555 |
| Sin señal GPS | 138 | 194 | 138 | 218 | 555 |
| En pausa | 157 | 213 | 138 | 244 | 594 |

A 390 px, la línea en vivo añade 62 px trackeando y hasta 101 px en pausa. Es más de los ~40 px que estimé al proponerla. A cambio desaparece el banner de arriba, que hoy ocupa su propio espacio más su margen.

## Comprobado

En Chromium, sobre los cuatro estados:

- **Combinaciones:** claro/oscuro × ES/EN × pago parcial y millas personales largas × 390, 320, 320 al 200 %, 430 y 390 al 135 %. Para la 1, **160 renders y 0 fallos**. Las tres juntas en la vista «Personal en marcha», **480 renders y 0 fallos**: nada se sale, las cifras no se parten, un solo Detener de al menos 44 px por marco, una sola fila A y ningún botón anidado ni sin nombre.
- La línea de la barra de desplazamiento de Chromium (11 px) descuadra la barra de la 3 frente a las cajas solo en el navegador del laboratorio; en WebKit y en iOS la barra no ocupa sitio y las columnas coinciden.
- **Qué se revisó:**
  - nada se sale de la caja ni del scroll;
  - las cifras no se parten;
  - Detener mide al menos 44 × 44 px y no pisa la fila;
  - el texto en vivo empieza en la columna del título;
  - Detener termina en el borde de la flecha (con texto normal);
  - hay exactamente dos botones, sin anidar;
  - no queda ningún « · » colgando;
  - no hay botones sin nombre ni menores de 24 px en Inicio.
- **Teclado** con pulsaciones reales: desde la fila, el Tab entra en Detener con el contorno de foco de 3 px. Su descripción accesible es la de la app: «Detiene el viaje personal que se está trackeando». Intro detiene, la línea desaparece, Hoy y Este mes suben y el foco vuelve a la fila.
- **Navegación:** con el viaje abierto, la fila sigue abriendo Historial con Personal seleccionado.
- **WebKit:** las capturas se revisaron una a una. Así salió un fallo de la primera tanda: en «Sin señal GPS», el icono era el mismo que el del aviso de ubicación de debajo. Se cambió por la antena tachada que usa la app.
- `build-tokens.mjs --check` correcto; `check-contrast.mjs` correcto; `shasum -a 256 -c SHA256SUMS` con 91 OK; `node --check` en todos los JS.

## Capturas

**Las tres lado a lado**, en `captures/home-personal-en-marcha-tres/` (`swift prototype/tools/capture-home-webkit.swift personal-en-marcha-tres`). Teléfonos a su alto normal, sin alargar:

- `01-comparar-trackeando-claro-es.png`
- `02-comparar-en-pausa-claro-es.png`
- `03-comparar-sin-senal-oscuro-en.png`
- `04-comparar-320-texto-200-en-pausa-es.png`: muestra el coste de la barra fija con texto grande.

**Solo la 1, por estado**, en `captures/home-personal-en-marcha/` (`swift prototype/tools/capture-home-webkit.swift personal-en-marcha`). Inicio a 390 × 844 sin alargar, ES, claro, pago parcial y Opciones cerrada:

- `01-trackeando-claro-es.png`
- `02-buscando-ubicacion-claro-es.png`
- `03-sin-senal-claro-es.png`
- `04-en-pausa-claro-es.png`

## Límites

- **Sin comparación con hoy.** El laboratorio no reproduce el banner de arriba de la app, así que no hay captura del «antes». Lo de hoy está descrito desde el código.
- **Detener en el laboratorio es una aproximación.** Suma el viaje solo si tiene millas. Las reglas reales de cierre de la app no están modeladas, y las millas no se mueven solas.
- **Título repetido.** «Trackeando personal» dentro de la caja «Personal» repite la palabra. Se mantuvo el texto de la app; acortarlo a «Trackeando» sería una decisión de texto aparte.
- **Seguridad.** La línea está pensada para mirarse parado o al llegar, no para tocarse en marcha. Detener funciona como hoy, sin confirmación.
- **Texto grande.** Al 200 % la caja llega a 477–594 px. Todo se lee y nada se corta, pero ocupa media pantalla.
- **Solo en el navegador.** Un navegador no es iOS: no se probaron VoiceOver, Dynamic Type nativo ni el comportamiento en un viaje real.

## Recomendación

**Elegiría la 2, El viaje primero.**

- **Lo que se busca al mirar parado en un semáforo:** si está grabando y cuánto lleva. La etiqueta de estado y el número grande lo dicen en un vistazo, y Detener con fondo es un blanco claro.
- **Los totales no se pierden.** Personal, Hoy y Este mes siguen debajo, en la misma caja.
- **El coste:** 48 px más que la 1 a 390 px mientras dura el viaje, y Iniciar turno baja lo mismo. Con texto grande, la 1 y la 2 miden casi igual.

La 1 es la más discreta, y la elegiría si se prefiere que el viaje no cambie el aspecto de Inicio. La 3 no la recomendaría: con texto grande se come la pantalla y vuelve a separar el viaje de la caja Personal.

Es criterio de diseño con medidas del prototipo; no se probó en un viaje real.

## Siguiente paso

Liber elige entre la 1, la 2 y la 3 con las capturas lado a lado. Nada pasa a la app real sin otra decisión.
