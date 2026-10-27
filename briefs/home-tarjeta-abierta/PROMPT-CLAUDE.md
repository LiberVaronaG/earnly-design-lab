# Siguiente paso de Home: mejorar la tarjeta C abierta

## Decisiones y alcance actual

Liber ya eligió **Home sin título y tarjeta verde C**. La decisión consta en `prototype/HANDOFF.md` y `prototype/HOME-TARJETA-VERDE.md`, commit `ce5073045ad4b6072aba44d8e8c3c07d352ae486` de `design/home-sin-titulo-2026-10-27`.

Ahora dice: **«seguimos con tarjeta abierta»**. Trabaja solo en la presentación del desglose que aparece al pulsar el importe o su flecha. La tarjeta C cerrada queda conservada; no reabrimos su elección ni su distribución de dinero y millas. No rediseñar el resto de Home.

Lee las instrucciones del repo (`AGENTS.md`, `CLAUDE.md` y referencias requeridas), el relevo, `prototype/HOME-TARJETA-VERDE.md` y este encargo. Esta instrucción acota los antiguos encargos de familias y cuatro pantallas. Reutiliza el laboratorio; no necesitas el Mac, el repositorio privado, Xcode o la app real.

## Base para comparar

- Continúa en `design/home-sin-titulo-2026-10-27`, o en la rama de sesión derivada de ella si tu entorno lo exige. Incorpora el último encargo sin descartar cambios locales; no reset ni reescritura de historia.
- Vista elegida: `prototype/index.html#view=single&family=v0&home=sintitulo&card=c&lang=es&scenario=partial&screen=home`.
- Abre el desglose con su control real. Referencia visual disponible: `prototype/captures/home-tarjeta-verde/09-comparar-cero-negativo-desglose-es.png` (C es el marco derecho).
- Usa V0, colores actuales y decoración apagada. Las imágenes son datos sintéticos y renders de navegador, no capturas nativas.
- Conserva una vista accesible de **«Desglose actual»** y otra de **«Propuesta»**, ambas debajo de la misma cabecera C, sin título y con los mismos datos y estado. Los controles de comparación van fuera del marco de la app.

## Qué queremos mejorar

La información existe y es útil, pero al desplegarse necesita una lectura más deliberada: reconocer rápido lo registrado, el coste de gasolina y lo que queda; distinguir la deducción fiscal de ese resultado; y consultar el detalle por plataforma con menos esfuerzo.

Parte de esta dirección y aplícala con criterio:

1. **Ingresos y gasolina como primer grupo.** Etiquetas e importes bien alineados, y el resultado «Queda tras la gasolina» con una jerarquía perceptible sin convertirse en otra cifra gigante que compita con la cabecera.
2. **Deducción fiscal como grupo claramente distinto.** Mantén su cifra, la palabra estimación y la explicación vigente de que no se resta arriba. Que la composición no parezca una continuación de la resta de gasolina ni un ahorro fiscal garantizado.
3. **Plataformas como detalle final.** Nombres, número de bloques e importes legibles, sin cajas para cada fila ni logotipos o colores nuevos que hagan ruido.
4. Ajusta espaciado, sangrías, pesos y separadores con moderación. Conserva una única tarjeta verde que crece naturalmente. Los espacios deben ayudar a leer; no buscamos una altura mínima a costa del texto.
5. Mantén el comportamiento de abrir/cerrar dentro de Home. No convertirlo en modal, nueva pantalla, carrusel ni submenús que escondan información que antes aparecía al desplegar. No añadir animaciones decorativas.

Puedes plantear otra composición si ves una mejora real. Entrega primero una propuesta sólida frente al desglose actual; como máximo una segunda alternativa si tiene una ventaja concreta. No producir una galería de variaciones menores. No es obligatorio añadir títulos de grupo si los espacios y pesos resuelven mejor la jerarquía.

## Datos y funciones que se conservan

Inspecciona `breakdownLines()` y `breakdownHtml()` y los fixtures antes de tocar la presentación. En la versión actual el desglose muestra, según el escenario:

- Cobrado (anotado).
- Notas de pagos ausentes, solo extras, gasolina desconocida o cantidad no representable, cuando correspondan.
- Gasolina estimada y Queda tras la gasolina, solo cuando los datos existentes permiten mostrarlos.
- Deducción por millas (estimación), con su explicación vigente.
- Plataformas, número de bloques e importes.

Conserva exactamente sus valores, textos de contenido, signos, periodos, orden lógico y condiciones de aparición. Puedes introducir un rótulo organizativo breve si ayuda, sin sustituir las etiquetas ni añadir afirmaciones financieras. No cambiar cálculos, coberturas, el significado de Cobrado frente a Tras gasolina, ni juntar personales y laborales. No interpretar ausente como $0 ni inventar un resultado si falta gasolina. El desglose tiene que seguir explicando el importe de la cabecera, aunque repita un dato para mostrar su relación con los costes.

## Revisión concreta

- Renderiza realmente la comparación actual/propuesta en Home completo, misma C, ancho, idioma, tema, escenario y texto. Conserva las capturas anteriores en sus carpetas.
- Revisa 390 y 320 px, ES/EN, claro/oscuro y texto al 200 %. No reducir el tamaño de letra para ganar espacio.
- Incluye los escenarios existentes de pagos completos, parciales, sin datos, cero con resultado negativo e importe largo. Mira también la nota de gasolina desconocida cuando el fixture o la interacción existente permitan ese estado. Si falta un estado, usa un fixture sintético mínimo de presentación o registra que no se ejecutó; no inventes cifras o fórmulas.
- Importes enteros y sin solaparse con las etiquetas: en estrecho o texto grande las filas pueden pasar a etiqueta arriba e importe debajo. No ocultar decimales, avisos ni explicaciones.
- Abrir/cerrar con ratón y teclado, foco visible, estado expandido correcto y orden de lectura coherente. La nueva presentación no debe duplicar datos para lectores de pantalla ni ocultar contenido solo por estilo.
- Al cerrar, la C se debe ver y comportar igual que antes; el resto de Home y las otras familias no cambian. El documento de C ya registra que no siempre ahorra altura: no repetir esa promesa sin medir.
- Usa las herramientas ligeras existentes y los checks obligatorios del repo. No crear otro arnés ni repetir auditorías masivas ajenas por rutina. Si un entorno impide un check, informa el límite; el navegador no prueba Dynamic Type ni VoiceOver de iPhone.

## Entrega para elegir el siguiente acabado

1. Comparación navegable actual/propuesta del desglose abierto. Parámetros o instrucciones exactos para abrirla.
2. PNG reales en `prototype/captures/home-tarjeta-abierta/`: Home completo actual y propuesta en claro, comparación oscura y un caso estrecho con texto grande. Muestra además el parcial y el cero/negativo, para que podamos juzgar jerarquía y notas, no solo el caso ideal. Si el desglose no cabe entero, captura su continuación o una vista completa identificada; no recortar las últimas filas para aparentar que todo cabe.
3. `prototype/HOME-TARJETA-ABIERTA.md`: qué cambia visualmente, qué se conservó, comprobaciones ejecutadas, límites y recomendación. Medidas de altura si hablas de ahorro; no considerar el menor alto como único criterio.
4. Actualiza `prototype/HANDOFF.md`: C cerrada elegida, propuesta abierta pendiente de nuestra elección, y el siguiente punto exacto. Conserva el historial de decisiones.
5. Se autoriza guardar y subir solo este trabajo del laboratorio a la rama de diseño, con un commit enfocado para revisión. Sin merge a main, despliegue ni cambios a la app real, el teléfono, Apple o el motor de millas e impuestos. Mantén las referencias originales del repo intactas.

Avanza hasta dejar la comparación visual revisada. Resuelve sin preguntar márgenes y detalles reversibles dentro del alcance. Al final muéstranos las imágenes y tu criterio; no avances a otro bloque de Home hasta que elijamos. Si se agota el contexto, conserva un punto navegable y el relevo.
