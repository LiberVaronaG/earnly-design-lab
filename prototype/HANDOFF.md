# HANDOFF

Último punto recuperable: rama `claude/prototype-design-lab`. Para abrirlo, `prototype/index.html`.

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
