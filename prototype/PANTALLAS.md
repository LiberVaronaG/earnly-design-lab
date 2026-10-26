# Pantallas del prototipo

**Referencia** quiere decir que la pantalla se reconstruyó mirando esas capturas de `screens/`. Aun así es una aproximación en navegador: no tiene fidelidad pixel a pixel ni la tipografía nativa de iOS. **Aproximación** quiere decir que no existe captura nativa: es una propuesta del laboratorio y se marca así en la barra de información.

Todas las pantallas existen en las cuatro familias, en claro/oscuro y en EN/ES.

## Áreas principales

| Pantalla (id) | Origen | Estados disponibles |
|---|---|---|
| Inicio (`home`) | Referencia: `05-coherencia-corregida/01-04`, `01-personales-c34/01` | Pago parcial, completo, cifras demasiado grandes («—» y «Too large to add up»), sin datos; desglose abierto; Opciones; aviso de Ubicación (Mientras se usa / Denegada); Personal; Recientes |
| Historial · Trabajo (`history`) | Referencia: `01-personales-c34/02`, `04-completar-importes/02, 08`, `05-coherencia-corregida/07` | Acceso a Completar importes; tarjeta por hora: tras gasolina, antes de gasolina, sin datos o cifras demasiado grandes; mejor y peor turno; desglose por plataforma; periodos |
| Historial · Personal (`history`) | Referencia: `01-personales-c34/03, 17-18` | Resumen, explicación y días agrupados |
| Día personal (`day`) | Referencia: `01-personales-c34/04, 07-10, 19` | Trayecto normal, < 0.1 mi, hueco e interrumpido |
| Detalle personal (`trip`) | Referencia: `01-personales-c34/05-06, 11-16` | Mapa SVG ficticio, contó / no contó, hueco e interrumpido, nota de trayecto personal. V1–V3 añaden línea de tiempo y leyenda gráfica |
| Exportar (`export`) | Referencia: `04-completar-importes/12` | Rangos, resumen, CSV (demo sin archivo), año fiscal y PDF |
| Ajustes (`settings`) | Referencia: `02-ajustes-c34/09-11` | Rastreo personal, direcciones, «Qué cambió», Earnly cerrada, permiso, General, registro de diagnóstico, Papelera, Soporte. V1–V3 añaden el diagrama de cobertura y textos progresivos |

## Flujos y hojas

| Pantalla (id) | Origen | Estados |
|---|---|---|
| Cierre de turno (`close`) | Referencia: `03-cierre-laboral/01-17` | Vacío; pago 90 → queda $82.00 y $27.33/h; cantidad inválida; otra plataforma con propina (parcial y total); sin precio de gasolina; pago 0 (negativo); guardar estación; mover a la papelera con confirmación |
| Recuperar turno (hoja `recovery`) | Referencia: `03-cierre-laboral/00` | Terminar en el último GPS, editar hora (demo) y seguir registrando |
| Completar importes (hoja `editor`) | Referencia: `04-completar-importes/03-07, 16-18, 22-25` | Turno n de m, campo inválido, propina mayor que el pago, botón desactivado/activado, «Ahora no», terminado («Guardados · Ahora no»), Cerrar sin cambios |
| Impuesto de autoempleo (hoja `seDetail`) | Referencia: `04-completar-importes/11`, `05-coherencia-corregida/03, 08` | Menos de $400, «basado en a de n», sin estimar por cifras demasiado grandes |
| Vista previa PDF (hoja `pdf`) | Referencia de jerarquía: `06-documentos-ejemplo/*` (la hoja en la app es **aproximación**) | Documento sintético por año |

## Aproximaciones (sin captura nativa)

| Pantalla (id) | Notas |
|---|---|
| Turno en curso (`active`) | Selector de plataforma y cifras simuladas fijas. No hay GPS ni temporizador real |
| Detalle de turno laboral (`shift`) | Mapa, datos, líneas de pago y «Editar pago», que abre el editor para ese turno |
| ¿Vale la pena? (`calc`) | Solo divide la oferta entre minutos y millas. No estima gasolina, impuestos ni costos |
| Ajustes → Mi vehículo, Plataformas, Mis estaciones, Gastos, Idioma, Accesibilidad, Papelera, Ayuda, Acerca de | Contenido mínimo, marcado en pantalla como aproximación. Papelera permite restaurar en el escenario «Pagos completos» |
| Escenario «Sin datos» | No hay capturas de onboarding ni de primer uso |

## No incluido

Onboarding y sus ramas, el selector de hora real, la gestión completa de gastos y estaciones, la reclasificación de trayectos, los permisos reales y cualquier función nueva (Workday, metas, paywall, tarjetas sociales). Ver `COBERTURA.md`.
