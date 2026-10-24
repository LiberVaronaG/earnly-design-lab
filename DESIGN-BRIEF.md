# Earnly Driver: laboratorio visual

## Objetivo aprobado

Explorar la apariencia de Earnly en un prototipo de interfaz independiente. Primero una referencia reconocible de la UI existente con componentes y tokens compartidos; despues tres familias visuales completas que se puedan comparar. No modificar ni reconstruir la app funcional.

Este repositorio publico contiene capturas de simulador con datos sinteticos, tokens visuales y estas instrucciones. No contiene el repositorio privado de Earnly, servicios, datos del telefono, registros de diagnostico o una app lista para App Store. Las capturas muestran distintas fechas y fases: no son todas una unica version instalada.

## Referencia y precedencia

1. `screens/05-coherencia-corregida/`: referencia mas reciente para pagos parciales, cifras no representables, Home y tarjeta fiscal.
2. `screens/03-cierre-laboral/`: cierre, teclado, pago y resultado, EN/ES y tamanos de accesibilidad.
3. `screens/01-personales-c34/` y `screens/02-ajustes-c34/`: separacion laboral/personal, dias, detalles, mapas, estados de cobertura y Ajustes.
4. `screens/04-completar-importes/`: navegacion del editor y sus estados. Son capturas del 23 de octubre: algunas preceden correcciones posteriores. Los estados finales de botones desactivados estan en las imagenes 23-25. El texto antiguo de PDF de una pagina y cualquier cifra/etiqueta anterior no son especificaciones nuevas.
5. `screens/06-documentos-ejemplo/`: paginas de documentos sinteticos como referencia de jerarquia/legibilidad; no declaraciones fiscales ni reglas vigentes.

AX5/AXL significa texto de accesibilidad muy grande. Varias capturas de detalle estan desplazadas: son continuaciones de una pantalla, no pantallas independientes. Las trazas en mapas son ficticias y pueden tener geometria deliberadamente artificial; no prueban precision de seguimiento.

## Arquitectura del prototipo

HTML/CSS/JavaScript ligeros con recursos locales. Un archivo maestro `design-tokens.json` gobierna colores semanticos, tipografia, espacios, radios, bordes, elevacion y movimiento. `TOKENS-BASE.json` contiene valores extraidos de la referencia; no reemplazarlo ni confundirlo con el maestro editable del prototipo. El asset AccentColor estaba sin asignar: no atribuirle un valor inventado.

Separar tokens, componentes, pantallas, fixtures y controles de comparacion. Las familias heredan la base y guardan solo diferencias. Las composiciones pueden variar sin duplicar toda la aplicacion. Todo cambio de un rol compartido debe propagarse a las pantallas que lo utilizan.

El navegador aproxima fuentes y medidas nativas: no afirmar fidelidad pixel a pixel ni pruebas reales de teclado/VoiceOver de iPhone.

## Propuestas

- **V0 Actual:** reconstruccion reconocible, clara/oscura, conservando identidad y semantica. Las pantallas que no tienen captura se marcan como aproximacion.
- **V1 Esencial:** menos peso visual, aire y accion principal evidente. No saturar Inicio de tarjetas.
- **V2 Claridad:** herramienta financiera sobria; cifras, periodos y cobertura faciles de comprender.
- **V3 Estudio:** apariencia mas personal y cuidada, con composicion y superficies propias, sin parecer un juego.

Cada familia funciona en claro/oscuro; cambiar solo la paleta no constituye otra familia. Ademas, dos muestras pequenas y opcionales de decoracion navidena/Halloween, apagadas por defecto y sin cubrir controles. No activacion por calendario, suscripcion o tienda.

## Experiencia que debe conservarse

- Cuatro areas: Inicio, Historial, Exportar, Ajustes. Historial separa Trabajo y Personal.
- Una accion principal clara por pantalla. Funciones secundarias bajo demanda, sin modales de promocion al abrir, insignias rojas o presion para completar datos.
- Completar importes vive en Historial Trabajo cuando faltan pagos del periodo. Ausente no es $0; solo extras sigue siendo parcial. Salir o Ahora no no modifica nada real.
- Cobrado registrado, resultado tras combustible, deduccion por millas y estimacion SE son conceptos distintos. No inventar tasas, formulas o ahorros. Los escenarios usan cifras de ejemplo ya fijadas, no un motor fiscal.
- No prometer deteccion con el proceso terminado. La referencia explica abierta/segundo plano y que hace falta volver a abrir si termino el proceso.
- Textos y botones comprensibles en EN/ES, contraste, foco, zoom y objetivos tactiles comodos. Acciones destructivas mantienen su significado en todos los temas.

## Cobertura

El objetivo final incluye Inicio/estado, recorrido laboral simulado, cierre, Historial Trabajo/Personal, detalle, completar pago, Exportar y Ajustes con secundarios. Consultar `COBERTURA.md`: **76 capturas no equivalen a 76 pantallas diferentes ni a toda la app documentada visualmente**. Las pantallas ausentes se pueden proponer en el prototipo como aproximaciones expresas; no afirmar que se copiaron de una captura inexistente.

No agregar funciones futuras como Workday, metas, paywall o tarjetas sociales. No backend, SwiftData, GPS, Motion, mapas remotos, permisos, APIs, claves, cuentas, servicios o codigo del motor de millas. Mapas ficticios en SVG local. No datos de usuario, respaldos ni rutas reales en este repositorio publico.

## Entrega esperada de una sesion de construccion

1. Prototipo local en `prototype/`, con galeria y navegacion real entre vistas de ejemplo.
2. Selector de familia, claro/oscuro, EN/ES, escenario, pantalla y ancho, fuera del marco de la app.
3. Comparacion lado a lado con misma pantalla y datos, conservados al cambiar familia.
4. `PANTALLAS.md`, decisiones y pruebas: lo implementado, aproximado, no comprobado y fallos corregidos.
5. Revision del navegador a 320/390 px y zoom 200 %, teclado/foco, textos largos, claros/oscuros y captura real de las vistas principales. No fingir ejecuciones.
6. `HANDOFF.md` por fases: primero una version navegable, despues variantes y acabado. Si se corta el contexto, conservar un punto que abra.

No es necesario instalar un SDK de iOS ni conectarse a un Mac. Un servidor estatico local para el prototipo es suficiente; no implica crear un backend ni autoriza desplegar a produccion.
