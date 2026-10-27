# Earnly Design Lab: seguimos en la tarjeta verde de Home

## Lo que acaba de decidir Liber

El Inicio sin el rótulo visible «Earnly Driver» le gusta y se conserva en el laboratorio. Ahora estamos estudiando **solo la composición de la tarjeta verde**. Vio tres conceptos y dijo de C: «es más simplificada, ahorra espacio, solo cambia composición».

**C es la propuesta preferida para construir y comparar, no una obligación de copiar el PNG al píxel.** Liber quiere también tu criterio: si encuentras una composición mejor, muéstrala como alternativa concreta y explica qué gana y qué pierde. No hace falta contradecir C ni inventar variantes si no mejoran nada. El supuesto ahorro de altura todavía debe medirse en el prototipo.

Este es el alcance vigente: Home, colores actuales, un detalle cada vez. Las instrucciones antiguas sobre cuatro familias, Navidad y otras pantallas quedan como historial, no como trabajos nuevos.

## Retoma lo que existe

- Repositorio: `LiberVaronaG/earnly-design-lab`.
- Rama vigente: `design/home-sin-titulo-2026-10-27`. El cambio sin título está en `801779393b7e9f32f9ad639dbb41b95e4abe7a07`; este encargo se añade encima como documentación. Comprueba el estado actual sin descartar cambios de tu sesión. Si estás en una copia anterior, incorpora el encargo por el camino normal sin reset ni sobrescritura de trabajo ajeno.
- Puedes continuar en esa rama o en una rama de sesión derivada de ella, dejando registrado cuál. No partir del `main` antiguo ni rehacer el laboratorio.
- Lee `AGENTS.md`, `CLAUDE.md`, las referencias que indican, `prototype/HANDOFF.md`, `prototype/HOME-SIN-TITULO.md` y este encargo. Todo está en el repo; no necesitas el Mac ni el repositorio privado.
- Referencia actual: `prototype/captures/home-sin-titulo/07-sin-titulo-claro-es.png`; oscuro: `09-sin-titulo-oscuro-es.png` en la misma carpeta.
- Referencia de ideas: `briefs/home-tarjeta-verde/ideas-tarjeta-verde.png`. La C está abajo. Es una imagen generada con IA: su textura, iluminación, proporciones y colores no son especificaciones de implementación.

## Construye C dentro de Home

1. Mantén la versión «Sin título» y la tarjeta actual como referencia accesible. Añade una variante de tarjeta C con un control de comparación del laboratorio, fuera del marco de la app. Las variantes comparten datos y estado.
2. En C, la zona izquierda contiene la etiqueta monetaria, el importe, acceso al desglose y la cobertura de pagos. A la derecha: Hoy y sus millas, debajo Este mes y sus millas. Una sola superficie verde; separadores discretos, sin cajas anidadas. Ajusta proporciones por legibilidad, no por fidelidad ciega al dibujo.
3. En el escenario de referencia muestra exactamente lo mismo en ambas: **Cobrado $70.00; Hoy 0 mi; Este mes 45 mi; 2 de 3 turnos; 1 sin pago principal**. No alteres cantidades o textos para hacerla caber.
4. En los demás escenarios conserva las etiquetas y significados de los datos existentes. «Cobrado» y «Tras gasolina» son conceptos distintos: no intercambiarlos, inventar fórmulas ni convertir ausencia de pago en cero. Este trabajo no corrige ni unifica diferencias históricas entre el prototipo y C36.
5. Conserva los tokens y colores actuales de V0, claro/oscuro; no muestrees colores del PNG. No añadir degradados, texturas, brillos, adornos, gráficos, nuevas métricas ni un encabezado sustituto del nombre.
6. Conserva el resto de Home: círculo Iniciar turno con su tamaño y acción, Opciones, Personal, avisos condicionales, Recientes, barra inferior y navegación. Solo se desplazan naturalmente si cambia la altura de la tarjeta; no rediseñarlos ahora.
7. Resuelve importes largos y pantallas estrechas sin partir una cifra, ocultar decimales, tapar notas ni empequeñecer todo para forzar dos columnas. Permite crecer o apilar la tarjeta cuando haga falta. La prioridad es una lectura cómoda; compacta no significa altura fija.

## Aporta tu criterio sin ampliar el alcance

Una vez vista C en Home, evalúa alineación, jerarquía, claridad de periodos, densidad y espacio. Si una alternativa propia mejora esos puntos, puedes construir **una sola alternativa adicional** en el prototipo, con los mismos colores, información y funciones. Compárala con C en igualdad de condiciones. Si C ya funciona mejor, dilo y no fabriques otra por obligación.

Si propones cambiar un texto, una métrica o una función, descríbelo como sugerencia futura; no lo apliques en esta iteración de composición. No avanzar a Opciones, Personal, bordes del resto, icono ni otras pantallas hasta que elijamos esta tarjeta.

## Comprueba lo que realmente cambió

- Usa el navegador y las herramientas ligeras ya disponibles. Sigue los checks obligatorios del repo; no instales Xcode ni dependencias grandes. No crees otro arnés ni repitas auditorías masivas ajenas por rutina.
- Compara tarjeta actual y C en **Home sin título completo**, mismo ancho, texto, idioma, cifras, tema y avisos. V0 y decoración apagada.
- Revisa 390 y 320 px, EN/ES, claro/oscuro y texto al 200 %. Incluye importe largo con decimales, negativo, cero y ausencia de importes con fixtures sintéticos existentes o una extensión mínima de presentación. Comprueba que no se confunden cero y ausencia.
- Revisa el desglose abierto y cerrado, foco de teclado y áreas cómodas para activar el control. No dupliques un importe en el orden de lectura para resolver su colocación visual.
- Mide la altura de la tarjeta y el punto donde empieza el siguiente bloque antes/después, en condiciones iguales. Di cuánto gana o pierde C, incluso si no ahorra altura. Con texto grande puede necesitar más espacio: no es un fallo por sí mismo.
- Si aparece un defecto previo, sepáralo del nuevo. El importe partido a 320 px ya era un defecto conocido: la nueva composición debe resolverlo sin copiarlo como requisito.
- El navegador no prueba Dynamic Type ni VoiceOver nativos. No presentar conceptos generados como capturas de implementación ni declarar revisiones que no pudiste ejecutar.

## Entrega visual para elegir, no solo un informe

1. Prototipo navegable con enlace o parámetros claros para «Tarjeta actual» y «C». Ambas mantienen Home sin título.
2. PNG reales del render, en `prototype/captures/home-tarjeta-verde/`: Home completo actual/C a pantalla completa con el escenario de referencia, comparación clara y oscura, más una comparación estrecha con texto ampliado e importe largo. Si produces alternativa propia, añade su comparación. Las capturas anteriores se conservan.
3. `prototype/HOME-TARJETA-VERDE.md`: cambio, medidas antes/después, comprobaciones ejecutadas, límites y recomendación breve. Explica si mantendrías C o elegirías tu alternativa y por qué; no inventes preferencias de clientes.
4. Actualiza `prototype/HANDOFF.md` con el punto navegable, la dirección de Liber y que **seguimos decidiendo la tarjeta verde**. Conserva las decisiones históricas.
5. Se autoriza guardar y subir únicamente este trabajo del laboratorio a su rama de diseño para revisarlo desde GitHub. Commit enfocado, sin merge a `main`, despliegue, cambio de visibilidad ni reescritura de historia. No tocar la app real, teléfono, App Store, backend, seguimiento ni motores de dinero o millas.

Avanza hasta dejar la comparación visible y revisada. No pares para preguntarnos por márgenes o detalles reversibles; sí deja la elección de la tarjeta final a Liber después de las imágenes. Si se agota el contexto, guarda un punto que abra y su relevo.
