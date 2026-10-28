# Siguiente detalle de Home: Opciones

## Decisión y alcance vigente

Liber ha visto la tarjeta abierta y ha dicho: «no se ve nada mal, con esa continuamos; ahora ya quedaría tarjeta verde, vamos a Opciones».

Quedan elegidas para el laboratorio **Home sin título, tarjeta verde C y la propuesta del desglose abierto**. No reabrimos esas decisiones. Ahora se trabaja únicamente en **Opciones, cerrada y desplegada**. Todavía no se integra nada en SwiftUI o la app real.

Continúa el prototipo existente en `design/home-sin-titulo-2026-10-27` o una rama de sesión derivada. Base observada `c2932c3ed3b867d009dc58ad1c4cb3e7fe7befb8`; el encargo se añade encima como documentación. Actualiza tu copia por el camino normal sin reset ni descarte de cambios. No partir del main antiguo ni rehacer el laboratorio.

Lee `AGENTS.md`, `CLAUDE.md`, sus referencias obligatorias, `prototype/HANDOFF.md`, `prototype/HOME-TARJETA-ABIERTA.md` y este encargo. Este alcance sustituye cualquier siguiente paso antiguo de familias, Navidad o rediseño completo. No hace falta el Mac ni acceder a archivos privados.

## Estado real y dirección de diseño

En V0, `optionsBlock()` tiene un botón «Opciones» con icono y flecha. Al abrir aparecen dos filas en tarjetas separadas:

1. **¿Vale la pena?**, que navega a la calculadora de la maqueta.
2. **Impuesto de autoempleo (estimación)**, con sus notas de estado y cobertura, que abre la hoja existente.

Revisa el render antes de diseñar. Queremos que se perciba como un pequeño conjunto de herramientas secundarias de Home: cómodo de encontrar, discreto mientras está cerrado, y ordenado al abrir. La acción principal de Home sigue siendo Iniciar turno.

**Dirección de Codex para explorar:** una sola pieza plegable con cabecera y las dos filas dentro, separadores finos y menos contornos repetidos. Conserva la paleta y los tokens existentes. No es una obligación de copiar una receta: si otra composición funciona mejor, usa tu criterio y muestra por qué, dentro de este alcance.

Construye una propuesta deliberada frente a la versión actual. Como máximo una alternativa adicional si aporta una ventaja real; no una galería de cambios mínimos. Cambia composición, alineaciones, espacios, pesos y uso local de bordes. No basta cambiar un color, y tampoco buscamos un componente más alto o adornado para aparentar trabajo.

## Qué se mantiene

- Inicio sin título, C cerrada elegida y su desglose propuesto, conservados en ambas variantes de Opciones. No modificar sus dimensiones, textos ni diseño.
- «Opciones» conserva su nombre, icono reconocible, acción de abrir/cerrar y estado expandido. Si recomendarías otro nombre, déjalo como sugerencia sin aplicarlo.
- Los dos accesos, su orden, sus etiquetas y las notas de autoempleo que correspondan al escenario. No eliminar advertencias o esconderlas detrás de otro toque para que quepa menos texto.
- Misma navegación: ¿Vale la pena? abre la calculadora existente; autoempleo abre su hoja; al volver se conserva el contexto y el estado del desplegable. No anidar botones ni activar una herramienta al pulsar solo el encabezado.
- Calculadora, hoja fiscal y sus fórmulas/textos de destino quedan como están. Su mejora funcional será otro encargo. No añadir impuestos, tasas, recomendaciones, resultados ni nuevas funciones.
- Colores actuales claro/oscuro y V0; decoración apagada. No tocar tokens globales ni reglas compartidas que cambien Historial, Personal, avisos u otras familias. Si usas un borde más discreto existente, aplícalo solo a la variante local de Opciones.
- Personal, aviso condicional, círculo Iniciar turno, Recientes y barra inferior siguen donde corresponden. Pueden desplazarse naturalmente por la altura del desplegable, sin rediseñarlos.
- Las referencias y capturas antiguas se conservan.

No convertir Opciones en una fila de botones grandes siempre visibles, carrusel, promoción, nueva pantalla o menú que oculte las notas actuales. No añadir insignias, gráficos, iconos decorativos, movimiento innecesario ni otro acordeón dentro del acordeón.

## Comparación y revisión

1. Mantén accesibles «Opciones actual» y «Propuesta» en el laboratorio, con un control fuera del marco de la app. Mismos datos, C elegida, desglose propuesto, idioma, tema y estado en ambas.
2. Muéstralas en Home completo, cerradas y abiertas. Revisa especialmente la transición entre tarjeta verde, Opciones y Personal/aviso: que se lea como una jerarquía tranquila y no como una acumulación de cajas.
3. 390 y 320 px, ES/EN, claro/oscuro y texto al 200 %. La fila de autoempleo puede crecer sin truncar sus explicaciones. No letra más pequeña para forzar altura.
4. Usa fixtures y estados existentes para notas cortas y largas: sin datos, cobertura parcial y estimación no disponible. No interpretar ausencia como cero ni implementar un motor fiscal. Si algún estado no puede ejecutarse, identifícalo; no inventes una prueba.
5. Prueba abrir/cerrar con ratón y teclado, foco visible, `aria-expanded` correcto, nombres accesibles y áreas táctiles cómodas de al menos 44 px. Las filas ocultas no quedan en el recorrido de foco. Al cerrar con un descendiente enfocado, lleva el foco a un lugar lógico.
6. Abre ambos destinos y vuelve: comprueba que sigue funcionando la navegación de la maqueta. Revisa también Opciones abierta con el desglose verde abierto y cerrado, sin restilizar la tarjeta verde.
7. Si hablas de ahorro, mide la altura antes/después en condiciones iguales. Se acepta crecer con texto grande. No declares mejora de retención de clientes a partir de una maqueta.
8. Usa herramientas ligeras existentes y los checks obligatorios del repo. No crear otro arnés ni repetir cientos de renders ajenos por rutina. Navegador no equivale a Dynamic Type o VoiceOver nativos; identifica lo no ejecutado.

## Entrega visual

- Prototipo navegable y enlaces/parámetros exactos de actual y propuesta.
- Capturas reales en `prototype/captures/home-opciones/`: Home completo actual/propuesta con Opciones cerrada, lo mismo abierta, una comparación oscura y otra estrecha con texto grande y nota larga. Si alargas una captura para mostrar todo, indícalo; no aparentar que cabe entero en un teléfono.
- `prototype/HOME-OPCIONES.md`: propuesta, coste/beneficio, medidas si corresponden, archivos afectados, comprobaciones ejecutadas y límites. Explica tu recomendación en pocas frases.
- Actualiza `prototype/HANDOFF.md`: tarjeta verde elegida, Opciones pendiente de elección tras ver las imágenes. Conserva el historial y no adelantes el siguiente bloque.
- Se autoriza guardar y subir solo estos cambios del laboratorio a la rama de diseño con un commit enfocado. Sin merge a main, despliegue, reescritura de historia ni cambios a producción, teléfono, Apple, backend o motores de millas/impuestos.

Avanza hasta dejar una comparación visible y revisada. Resuelve detalles reversibles sin pedir confirmación. Al final muéstranos los PNG y tu criterio; Liber elige antes de pasar a otro bloque. Si el contexto se agota, conserva un punto navegable y relevo.
