# Decisiones de diseño

## Las cuatro familias

Las cuatro familias comparten datos, textos, navegación y componentes. Cada una cambia **tokens** (`override`) y **composición** (`composition` en `design-tokens.json`). Cambiar solo la paleta no cuenta como familia nueva.

| | V0 Actual | V1 Esencial | V2 Claridad | V3 Estudio |
|---|---|---|---|---|
| Tarjeta principal de Inicio | Tres cifras sobre verde, como la referencia | Una cifra protagonista («Cobrado este mes») sobre verde suave, más dos datos pequeños | Libro de cuentas: periodo, filas y la deducción separada con línea discontinua | Degradado verde→azul de los tonos `hourProgress`, cifra con serif y fecha |
| Iniciar turno | Círculo en el contenido | Píldora fija en la zona del pulgar | Barra fija rectangular | Círculo rodeado de un anillo decorativo con los 6 tonos horarios |
| Aviso de Ubicación | Tarjeta con borde granate | Una línea de estado con acción «Mejorar» | Línea de estado | Tarjeta suave, sin borde, icono ámbar |
| Filas de turno | Tarjetas con borde | Lista agrupada con separadores y chip de estado neutro | Tabla: fecha, mi, h, cobrado | Tarjetas con sombra y franja de color según la hora de inicio |
| Periodo | 6 segmentos | Semana/Mes/Año + «Más» | Granularidad + «‹ Octubre 2026 ›» | Semana/Mes/Año + «Más» |
| Resultado del cierre | Líneas, como la referencia | Ecuación: Cobrado − Gasolina = Queda | Libro con reglas | Ecuación |
| Exportar | Dos botones primarios, como la referencia | PDF primario, CSV secundario | Igual que V1 | Igual que V1 |
| Textos de Ajustes | Completos, como la referencia | Frase corta + «Más información» y diagrama de cobertura | Igual que V1 | Igual que V1 |
| Extra | — | — | Gráfico semanal de millas (una serie) | Serif en títulos y cifras |

## Decisiones transversales

1. **Tokens.** `design-tokens.json` es el maestro editable. `base` reproduce exactamente `TOKENS-BASE.json`, y el generador **falla** si V0 se aparta de la referencia. Los roles nuevos del laboratorio llevan `$lab` con su motivo. `AccentColor` sigue sin asignar: no se le inventó valor.
2. **Granate ≠ destructivo, desde V1.** En la referencia, `brandBorder` y `actionDestructive` son el mismo granate, así que todas las tarjetas parecen avisos y «Mover a la papelera» no destaca. V1 y V3 quitan el borde de las tarjetas y V2 usa un gris cálido. El granate queda para lo destructivo y para los errores.
3. **Contraste de enlaces.** La referencia pinta enlaces y la pestaña activa en `accentPositive` pálido sobre crema (≈1.8:1). En todas las familias, V0 incluida, el enlace usa `actionPositive` en claro y `accentPositive` en oscuro (≥4.5:1). Es la única corrección de color aplicada a V0, porque es un defecto, no identidad.
4. **Hallazgo que se conserva en V0.** El botón verde en oscuro (`actionPositive` dark `#3F9442` con texto blanco) da 3.80:1, por debajo de 4.5:1 para texto de 17 px. V0 lo conserva para seguir siendo fiel a `TOKENS-BASE.json`, y `check-contrast.mjs` lo marca como `V0*`. V1 y V3 usan `#337F38` (4.96:1) y V2 `#2F7A45` (5.26:1). **Recomendación para la app real:** oscurecer ese verde.
5. **Errores en oscuro.** `#A0413B` sobre el fondo oscuro da ≈2.9:1. Los textos de error y destructivos usan `#E8857C` en oscuro.
6. **«Parcial» se ve.** Un pago incompleto lleva un chip con borde discontinuo ámbar y texto normal, además de la frase de la referencia, para no depender solo del texto ni del color. Las cifras demasiado grandes no se marcan como parciales: muestran «—» y su frase.
7. **Una acción principal por pantalla.** V1–V3 eligen el PDF como acción principal de Exportar y dejan el CSV como secundaria. Es una suposición: el resumen fiscal parece el uso más frecuente. Si los datos de uso dicen lo contrario, basta con invertirlos.
8. **Sin presión.** Ningún modal se abre al entrar (salvo «Recuperar turno», que existe en la referencia). No hay insignias rojas. El aviso de permiso se reduce a una línea en V1/V2 y la explicación completa vive en Ajustes.
9. **Dinero.** Los conceptos se mantienen separados: cobrado anotado, gasolina estimada (solo si hay precio), queda tras la gasolina, deducción por millas (estimación, «no se resta») y estimación SE. Ausente se muestra como «—» o «Sin anotar», nunca como $0. «Solo extras» sigue siendo parcial. La deducción y la gasolina de cada turno son **cifras fijadas** en los escenarios. El prototipo solo suma, cuenta y divide (por hora), igual que en las capturas ($90 − $8 = $82; $82 / 3 h = $27.33). Si el demo supera $400 de ganancia neta, no muestra ninguna cifra SE, porque no hay motor fiscal.
10. **Detección.** Los textos mantienen «abierta / segundo plano / cerrada» y que hace falta volver a abrir Earnly. El diagrama de cobertura de V1–V3 resume lo mismo, sin prometer más.
11. **Mapas.** Son SVG local inventado (costa, calles y nombres ficticios) y llevan siempre el rótulo «Mapa ficticio». No usan servicios ni coordenadas reales.
12. **Textos nuevos.** La etiqueta «Cobrado este mes» (V1/V3) aclara el periodo de la cifra que la referencia rotula solo «Paid/Cobrado». Es una propuesta de redacción. Las cadenas ES sin captura en español son traducciones del laboratorio.
13. **Texto grande.** Al 200 % (`data-ax`) los pares etiqueta/valor, las filas, el triple de V0, las columnas de la tabla de V2 y los segmentos se apilan o se envuelven en lugar de recortarse. Las cifras grandes se limitan al ancho del teléfono con unidades de contenedor (`cqi`).
14. **Navidad en el botón de Inicio (pedido del propietario, 25 oct).** Hay tres variantes, todas sobre el círculo de V3 (también funcionan en V0):
    - **gorro de Santa** con ala de pelo, pompón y sombra sobre el botón;
    - **esfera** de árbol con tapa dorada;
    - **corona** de pino con bayas y lazo.

    En V1/V2 el gorro va pequeño en la esquina de la píldora. El resto de Inicio solo lleva una nevada muy suave en la tarjeta. Las piezas son SVG locales, decorativas (`aria-hidden`, sin eventos) y nunca tapan el texto del botón; hay una prueba que lo comprueba. Con texto muy grande se ocultan para no competir con la etiqueta. Se eligen en «Decoración» y están apagadas por defecto.
15. **Decoración estacional.** Son dos SVG pequeños en la cabecera de las pestañas raíz, con `pointer-events: none` y `aria-hidden`. Están apagados por defecto y no se activan por calendario.

## Recomendación

**Dirección recomendada: V1 Esencial como base, con dos préstamos de V2.**

- **Por qué V1:**
  - Es la que más reduce el peso visual sin perder la identidad: misma paleta crema/verde, mismas palabras, mismas áreas.
  - Deja una sola acción clara en la zona del pulgar (Iniciar turno, Listo) y convierte el aviso de permiso, la parte más ruidosa de Inicio, en una línea.
  - Al quitar los bordes granate, el granate vuelve a significar «cuidado».
  - Al 200 % de texto es la que mejor resiste, porque tiene menos cajas anidadas.
  - Es también el cambio de menor riesgo respecto a la app actual.
- **Qué tomar de V2:**
  1. El libro de cuentas para el desglose de Inicio y el resumen de Exportar. La deducción aparece separada con «no se resta del cobro», que es la confusión que corrigieron las capturas del 24 oct.
  2. El selector de periodo con «‹ Octubre 2026 ›». Dice qué periodo se ve, algo que los segmentos no dicen.
- **Por qué no V2 entera:** es la más legible para cifras, pero se siente fría y genérica. Su tabla de Historial pierde columnas al 200 % de texto.
- **Por qué no V3:** es la más personal (franja horaria, serif, degradado), pero el anillo y la tarjeta con degradado gastan altura en Inicio y la serif baja la densidad. Su franja de hora en las filas es un buen detalle opcional para V1.
- **V0** queda como referencia de comparación y documenta dos hallazgos para la app real: el contraste de los enlaces pálidos y el verde del botón en oscuro.

Esta recomendación sale de revisar el navegador, no de pruebas con conductores reales ni en iOS.
