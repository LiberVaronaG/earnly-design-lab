# Earnly Design Lab: primer cambio de Home, quitar el nombre

Trabajamos en `LiberVaronaG/earnly-design-lab`, el repositorio público de diseño. Este encargo es autocontenido para Claude Code en la nube o local. No necesita el Mac, Xcode, el repositorio privado ni la app instalada.

## Dirección de Liber y alcance vigente

Liber quiere mejorar la elegancia de Home detalle a detalle. **Mantener los colores actuales. Trabajar solo en Home. Primer cambio elegido: quitar el texto visible «Earnly Driver» de la parte superior.** La identidad se trabajará más adelante con un icono reconocible de la app; este paso no pide sustituir el título por otro logo, saludo o adorno.

Este encargo acota el alcance antiguo de `DESIGN-BRIEF.md` y `PROMPT-CLOUD.md`: no rediseñar ahora las cuatro pestañas ni producir otras paletas o familias. Esos documentos siguen sirviendo de referencia para los límites, datos y componentes.

## Base y rama

- Hay un prototipo existente en `claude/prototype-design-lab`, último checkpoint observado `0a5ba0e711d5323da3bbca4669be5dde292155d7`.
- Codex preparó `design/home-sin-titulo-2026-10-27` desde ese checkpoint, con este brief y una captura real de C36. Continúa en esta rama de diseño o, si Claude Code necesita su propia rama de sesión, crea una derivada de ella y registra el nombre. No partir del `main` antiguo, donde solo había referencias.
- Lee `AGENTS.md`, `CLAUDE.md`, este brief, `prototype/HANDOFF.md`, `prototype/README.md` y las decisiones relevantes. Comprueba el estado una sola vez y no sobrescribas cambios ajenos. No fusionar a `main`, reescribir historia ni tocar la rama anterior.

## Referencia visual

- `briefs/home-sin-titulo/home-c36-es.png`: captura auténtica de Home de C36, español, texto normal. **Datos sintéticos.** El aviso de ubicación corresponde a un escenario de prueba; no está siempre presente.
- `screens/05-coherencia-corregida/`: otras referencias monetarias y modo oscuro, anteriores a C36. Los defectos de truncado históricos no son un requisito que haya que copiar.
- `TOKENS-BASE.json` y el maestro de tokens del prototipo describen la paleta. No modificar colores en este encargo. Si la V0 ya difiere de la app, anótalo sin disimularlo ni convertirlo en una nueva campaña de color.
- Las apariencias alternativas y la Navidad del prototipo se conservan como historial. **Para la comparación nueva: V0 y decoración apagada.** No borrar el trabajo anterior ni iniciar más animaciones.

## Implementa este primer paso completo

1. Abre el prototipo y localiza la composición de Home de V0. Aprovecha los componentes existentes; no crear otro laboratorio desde cero.
2. Deja accesibles dos vistas comparables: **«Original» y «Sin título»**, con la misma familia V0, colores, tamaño, idioma, escenario, cifras y estado de avisos. El control de comparación pertenece al laboratorio, fuera del marco de la app.
3. En «Sin título», elimina únicamente el rótulo visible «Earnly Driver». Retira también el espacio que pertenecía al bloque eliminado, conservando la zona segura superior y márgenes coherentes. Evita un hueco reservado para el nombre que ya no está.
4. No lo sustituyas por fecha, logo, inicial, mensaje de bienvenida, publicidad ni un encabezado nuevo. Puede existir un título de pantalla no visual para accesibilidad si hace falta.
5. Mantén el círculo actual de Iniciar turno, su tamaño, texto, función simulada y estado. Conserva tarjeta financiera, cobertura de pagos, Opciones, avisos condicionales, personales y Recientes donde correspondan. No cambiar cifras, periodos, semántica de combustible/deducción/impuestos ni navegación.
6. Mantén el resto del prototipo funcional sin rediseñarlo. El cambio no debe quitar el nombre de cabeceras de Historial, Exportar o Ajustes por compartir un componente.

No basta borrar letras de un PNG ni pintar encima. La comparación debe renderizarse como interfaz, con controles y componentes reales de la maqueta.

## Calidad esperada

Liber quiere trabajo de diseño cuidado: proporción, tipografía, ritmo vertical, alineación, radio/borde y equilibrio entre contenido y acción. HTML/CSS es el medio del prototipo, no una excusa para entregar un esquema genérico, tarjetas de relleno o copiar otro dashboard.

En este primer paso, el diseño deliberado consiste en ajustar bien la ausencia del título y comprobar su efecto en el conjunto. No añadas cambios para aparentar más trabajo. Separa en el informe **cambio elegido e implementado** de **sugerencias todavía no elegidas**.

Después de terminar la comparación, puedes señalar hasta tres detalles de Home que merezcan estudiar a continuación, por ejemplo espacio, peso de bordes o jerarquía. Explica su beneficio y su coste con una imagen o anotación cuando ayude. **No los implementes todavía.** Tampoco des por aprobado cambiar el círculo por una barra o quitar el aviso de permisos.

## Revisión visual y comprobaciones

- Mira el resultado real en el navegador, antes y después, a 390 px y 320 px; EN/ES y claro/oscuro conservando la paleta existente.
- Revisa texto ampliado (200 % del prototipo): ninguna cifra, unidad o botón debe quedar tapado. No hacer que el importe quepa ocultando decimales o reduciendo la cobertura de pagos.
- Revisa un estado con aviso de ubicación y otro sin él, si existen esos fixtures. No fingir que hiciste una prueba si no puedes ejecutar ese estado.
- Comprueba la zona segura superior, el acceso a Opciones/desglose, inicio de turno simulado, desplazamiento y barra inferior. Mantener áreas táctiles cómodas y foco accesible; respetar movimiento reducido.
- No uses números de un escenario para comparar con otro: la única diferencia visual elegida es el título y el espacio asociado.
- Aprovecha las comprobaciones existentes que afecten a Home. No crear otro arnés ni repetir por rutina cientos de renders o pruebas ajenas a este cambio. Si falta navegador, identifica el límite; no declares revisión visual a partir del código.
- Un navegador aproxima iOS; no afirmar fidelidad nativa exacta, VoiceOver de iPhone ni Dynamic Type nativo probados.

## Entrega que Liber pueda abrir y Codex pueda revisar

1. Prototipo funcionando, enlace o ruta de vista «Sin título» y comparación con «Original». Instrucciones claras de apertura y, si el entorno la ofrece, vista previa accesible de la sesión. No desplegar un sitio público.
2. Capturas reales del antes y después, mismo viewport y estado; al menos una comparación clara y otra oscura. Guardarlas bajo `prototype/captures/home-sin-titulo/`, conservando las anteriores.
3. `prototype/HOME-SIN-TITULO.md`: qué cambió, archivos afectados, lo comprobado, límites y hasta tres siguientes sugerencias no implementadas. Concluir si quitar el nombre mejora el equilibrio según tu revisión, sin inventar preferencia de clientes.
4. Relevo breve en `prototype/HANDOFF.md` con la nueva dirección y el siguiente paso exacto. No borrar decisiones históricas; aclarar que Navidad y otras familias no se desarrollaron en este bloque.
5. Cambios revisables en la rama de diseño, con un commit focalizado si el flujo de Claude Code lo permite. Se autoriza guardar y subir **solo estos cambios del laboratorio** a su rama para revisarlos desde GitHub. No merge a `main` ni PR que se fusione automáticamente.

No tocar la app de producción, su envío a Apple, el teléfono, motor de millas/impuestos, backend, GPS, Motion, APIs, analítica, cuentas, pagos ni datos reales. No cambiar la visibilidad del repositorio, publicar código privado o hacer instalaciones de herramientas grandes. La integración en SwiftUI será un encargo posterior, después de elegir el diseño.

Avanza hasta dejar esta comparación concreta y revisada. No te detengas a pedir permiso para resolver un margen o ajustar el contenedor que queda tras retirar el título. Si el contexto se agota, guarda un punto navegable y el relevo antes de seguir.
