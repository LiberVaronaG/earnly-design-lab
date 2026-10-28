# Siguiente detalle de Home: Personal

## Dirección de Liber

«Seguimos a Personal, qué propones, creatividad y elegancia».

Ya eligió **Home sin título, tarjeta verde C, su desglose propuesto y Opciones agrupadas**. Conserva todo eso. El trabajo de ahora es solo la fila Personal de Home: darle una composición más clara, cuidada y fácil de reconocer como acceso al historial personal. No iniciar el diseño de su pantalla de destino.

Lee `AGENTS.md`, `CLAUDE.md`, sus referencias obligatorias y `prototype/HANDOFF.md`. Continúa el laboratorio en `design/home-sin-titulo-2026-10-27` o una rama de sesión derivada. Base observada `35f6753882112cc42d31249398a6ad6f8c764467`; incorpora el encargo por el camino normal sin reset ni descarte de trabajo ajeno. No empezar desde main ni rehacer el prototipo.

## Qué ocurre hoy

Revisa el render y `personalRow()` antes de editar:

- Se muestra cuando `autoPersonal` está activo.
- Tiene icono de coche, título Personal, millas de hoy y del mes, en una fila con borde fuerte.
- En el escenario de referencia: **Personal · 0 mi hoy · 9 mi mes**.
- El botón completo ejecuta `openPersonal()`: navega a **Historial → Personal**. No despliega un acordeón. Mantén esa navegación y la separación laboral/personal.

El problema visual que queremos estudiar: los periodos y cifras corren casi como una frase, falta una señal clara de que se puede abrir y la fila tiene un peso de borde parecido al aviso. Queremos claridad sin otra tarjeta protagonista ni más explicaciones permanentes.

## Construye dos propuestas concretas

Usa V0, la paleta y tipografía existentes, decoración apagada. Trabaja con tokens/componentes actuales; no añadir colores ni tocar tokens globales.

**A — Una fila compacta (preferencia inicial de Codex).**

- Izquierda: el icono de coche existente y Personal.
- Derecha: dos pequeños grupos bien alineados. En cada uno, periodo encima y valor con unidad debajo: **Hoy / 0 mi**, **Este mes / 9 mi**.
- Al extremo, una flecha discreta de navegación. Toda la fila es un único botón; flecha e icono no son botones adicionales.
- Una sola superficie con borde sutil existente y márgenes cuidados. Diferencia el valor del periodo con peso y alineación; sin cajas dentro de la fila ni un divisor por cada dato.
- Debe leerse primero Personal y después las dos medidas. Si el ancho no alcanza, adapta la composición sin encoger todo ni cortar los periodos.

**B — Dos niveles, con más aire.**

- Primera línea: coche, Personal y flecha.
- Debajo, los mismos dos grupos de Hoy y Este mes, con alineación deliberada y una relación clara con el título. Una sola superficie.
- Esta alternativa puede crecer algo: queremos ver si la lectura más tranquila compensa su altura. No añadir texto de relleno, una ilustración o un subtítulo para ocupar espacio.

Son direcciones para explorar con criterio, no una plantilla rígida. Ajusta proporciones y alineaciones hasta que se vean como parte de Earnly. Si una propuesta no funciona, muéstralo con una comparación y explica el límite; no la fuerces con letra pequeña. No crear más familias ni variantes solo de color.

## Lo que se conserva

- Mismos valores, formato, unidades, precisión/redondeo y significado de los dos periodos. No cambiar cálculos, filtrado de fechas, fixtures generales ni motores. Puedes separar visualmente las etiquetas ya existentes **Hoy** y **Este mes** de su valor; no cambiar su significado.
- Ausencia y cero conservan el comportamiento del prototipo. No inventar actividad, tendencias, ahorros, rachas, objetivos, porcentajes o mensajes motivacionales.
- La condición de aparición cuando el seguimiento está activo; no mostrar una tarjeta nueva para promocionarlo cuando está apagado.
- Acceso directo a Historial → Personal y su regreso. No un acordeón, hoja nueva, permiso real ni reclasificación de viajes.
- Todo lo demás de Home se conserva: C cerrada y abierta, Opciones elegida, aviso, círculo Iniciar turno, Recientes, barra inferior y orden. El movimiento vertical natural por la altura de Personal no es un rediseño del resto.
- Colores claro/oscuro existentes. El aviso debe conservar su tratamiento propio; no restilizarlo ahora para que encaje con Personal. Las otras familias y pantallas quedan intactas.

## Comparación y comprobaciones acotadas

1. Deja accesibles **Personal actual / A / B** en el laboratorio con selector fuera del marco de la app. Misma Home elegida, datos y estado, sin adornos estacionales.
2. Revisa realmente en navegador: 390 y 320 px, ES/EN, claro/oscuro y texto al 200 %. Valores y unidad no se parten; no se oculta información ni se reduce la letra para ganar altura. Las etiquetas se pueden envolver cuando sea necesario.
3. Referencia 0 mi hoy y 9 mi mes, y estados existentes con ambos valores en cero y con más dígitos. Si falta un caso largo, añade el mínimo fixture sintético de presentación, sin alterar datos ni cálculos de otros escenarios. Comprueba que con seguimiento apagado la fila sigue ausente.
4. Fila entera táctil de al menos 44 px, foco visible y teclado. Flecha como indicación decorativa de navegación. La lectura accesible debe comunicar **Personal, el periodo y el valor de ambas cifras**, sin duplicados ni un `aria-label` genérico que los oculte. No prometer pruebas de VoiceOver nativo.
5. Abre Personal y verifica que llegas a Historial con Personal seleccionado, sin mezclar Trabajo. Volver conserva el comportamiento actual; cualquier defecto previo de navegación global se anota, no se convierte en otra tarea.
6. Revisa el conjunto con Opciones abierta y cerrada, manteniendo su propuesta elegida. No modificarla para acomodar la nueva fila.
7. Mide la altura actual/A/B y el punto donde empieza el siguiente bloque en condiciones iguales. No prometer ahorro de espacio si no lo hay; evalúa claridad, peso visual y coste vertical juntos.
8. Usa herramientas ligeras y checks obligatorios del repo. No crear otro arnés, instalar herramientas grandes ni repetir auditorías masivas ajenas por rutina. Declara qué no pudiste ejecutar; el navegador aproxima iOS.

## Entrega para elegir viendo imágenes

- Prototipo navegable, con parámetros o instrucciones exactos para cada variante.
- PNG reales en `prototype/captures/home-personal/`: actual frente a A y A frente a B en Home completo, misma referencia; una comparación oscura y otra estrecha con texto grande y cifras largas. Incluye una vista de detalle del componente renderizado si ayuda a juzgar sus alineaciones. No tapar o recortar datos para aparentar menos altura.
- `prototype/HOME-PERSONAL.md`: propuesta, medidas, comprobaciones ejecutadas, límites y tu recomendación entre A y B con su coste. No declarar mejora de retención de clientes a partir de la maqueta.
- Actualiza `prototype/HANDOFF.md`: decisiones anteriores conservadas, Personal pendiente de elección tras ver los PNG. Conserva el historial.
- Se autoriza guardar y subir solo este trabajo del laboratorio a su rama de diseño, con un commit enfocado. Sin merge a main, despliegue, reescritura de historia ni cambios a app real, teléfono, Apple, backend o motores de millas/impuestos.

Avanza hasta dejar comparaciones visuales revisadas. Resuelve márgenes y detalles reversibles sin pedir permisos. Al terminar muéstranos los PNG, tu criterio y las diferencias reales; Liber elige antes de pasar al siguiente detalle. Si se agota el contexto, guarda un punto navegable y su relevo.
