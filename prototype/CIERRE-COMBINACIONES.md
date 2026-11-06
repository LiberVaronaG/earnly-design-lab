# Briefing: qué apps se combinan en un mismo turno

6 nov 2026. Lo pidió Liber al elegir **A · Marca las apps** para el cierre ([CIERRE-TURNO.md](CIERRE-TURNO.md)): que la lista no ofrezca apps que no se combinan con la del turno, por ejemplo Instacart en un turno de Amazon Flex.

Este documento solo registra la investigación y unas reglas propuestas. No hay nada construido todavía.

## Punto de partida

- **La app ya solo ofrece las plataformas activadas en Ajustes.** Si no tienes Instacart activada, no aparece. El filtro por combinaciones sirve para quien tiene varias activadas.
- **En Earnly, «Uber» es una sola plataforma:** cubre los viajes y Uber Eats. Las siete de la app son Amazon Flex, Uber, Lyft, DoorDash, Grubhub, Instacart y Spark Driver.
- **Amazon Flex y Spark Driver trabajan desde una estación o tienda** (`isStationBased` en la app).

## Lo que dice la investigación

Las fuentes son irregulares. Hay datos de uso de Gridwise, encuestas viejas y blogs de otras apps de seguimiento. No apareció ninguna encuesta reciente que cuente combinaciones concretas, así que lo que sigue son tendencias, no reglas exactas.

- **Viajes: Uber y Lyft son la pareja más fuerte.**
  - Gridwise, 1.º trimestre de 2024: cerca del 55 % de los conductores de Lyft también usan Uber, y algo más del 25 % de los de Uber también usan Lyft.
  - Gridwise, 2025: el 49 % de los conductores de Lyft también trabajan para Uber, el mayor solapamiento que encontró.
  - Una encuesta de 2017 de RSG daba una mayoría que hacía las dos.
- **Comida: DoorDash, Uber Eats y Grubhub.**
  - Los blogs citan DoorDash con Uber Eats como la combinación más común, y DoorDash, Uber Eats y Grubhub como el trío clásico. No muestran sus datos.
  - Gridwise matiza que los de DoorDash combinan menos: solo el 18 % de sus repartidores también hace Uber Eats.
  - **Grubhub es la que más se combina:** más del 70 % de sus repartidores usa otra app el mismo mes (Gridwise, 2025).
  - Los repartidores de Uber Eats combinan con los viajes de Uber en un 36 %.
- **Entre viajes y comida,** el 21 % de los conductores combina las dos cosas (Gridwise).
- **Compras:**
  - Un blog dice que Spark con DoorDash es habitual: Spark como principal y DoorDash para los ratos flojos.
  - Sobre Instacart con Spark o Shipt no se encontró nada fiable.
- **Amazon Flex:**
  - Los términos de Amazon dicen que, si aceptas un bloque, te comprometes a entregar sus paquetes. El bloque dura desde que recibes los paquetes hasta el último entregado o devuelto.
  - No se encontró una regla clara sobre usar otras apps durante el bloque. Un blog dice que está prohibido y otro que no hay exclusividad; ninguno cita el contrato.
  - **Lo prudente:** un turno de Flex no se combina.
  - Lo que se hace entre bloques, en otra app, es otro turno en Earnly.
- **En general,** el 53 % de los trabajadores de apps usa más de una al menos una vez al mes (Flex Association).

## Combinaciones propuestas para la lista de A

Para cada app del turno, las que la lista ofrecería, de más probable a menos.

| App del turno | Se ofrece en la lista | Por qué |
|---|---|---|
| **Amazon Flex** | ninguna | El bloque es un compromiso de entrega; no hay datos sólidos de combinación. |
| **Uber** (viajes y Eats) | Lyft, DoorDash, Grubhub | Lyft para los viajes; DoorDash y Grubhub para Uber Eats. |
| **Lyft** | Uber, DoorDash | Uber es el mayor solapamiento medido. |
| **DoorDash** | Uber, Grubhub, Spark Driver | Uber por Uber Eats; Grubhub por el trío de comida; Spark según un blog. |
| **Grubhub** | DoorDash, Uber | La que más se combina, sobre todo con las otras de comida. |
| **Instacart** | DoorDash, Uber | Sin datos sólidos: las dos más extendidas. |
| **Spark Driver** | DoorDash, Instacart | DoorDash según un blog; Instacart sin datos, por ser compras. |

## Reglas propuestas

1. **Nunca esconder del todo.** La tabla ordena y sugiere, pero debajo queda un enlace discreto «Otra app» con el resto de las plataformas activadas. Hay conductores con combinaciones raras, y Earnly no debe impedir anotar un ingreso real.
2. **Lo que hace cada conductor manda sobre la tabla.** Si alguien ya anotó Amazon Flex con Instacart, Instacart pasa a sugerida en sus turnos de Flex. Se calcula con sus propios turnos, en el teléfono, sin red. La tabla solo sirve para quien empieza.
3. **Amazon Flex por defecto:** solo el campo del turno y el enlace «Otra app», sin lista. Es lo que ya hace hoy la app, con la puerta abierta.
4. **Si no se sugiere ninguna app activada,** A se queda en el campo del turno y el enlace.

## Lo que quedaría abierto

- **Las cifras vienen sobre todo de Gridwise y de blogs de apps de seguimiento.** Conviene contrastarlas con conductores reales; Liber es el primero.
- **Antes de dar a entender en la app que algo «no se combina», hay que leer los términos actuales de Amazon Flex** (en la app de Flex: Ajustes → Información legal → Términos de contratista independiente). Este briefing no afirma nada sobre lo que Amazon permite.
- **Uber agrupa viajes y Eats.** Si algún día se separan en dos plataformas, la tabla cambia.
- **Si pasa a la app, lo de siempre:** el SPEC §4.5, PARITY.md y Android.

## Fuentes

- [Gridwise: Multi-Apping's Role in Pay and Platform Power](https://gridwise.io/blog/multi-appings-role-in-pay-and-platform-power)
- [Gridwise: Revealing Rideshare Trends: Multi-Apping and Airport Insights](https://gridwise.io/blog/analytics/revealing-rideshare-trends-multi-apping-and-airport-insights)
- [Gridwise: Grubhub's Crossroads](https://gridwise.io/blog/grubhubs-crossroads-a-look-at-delivery-performance-and-platform-resilience)
- [Gridwise: Multi-Apping: Max Your Earnings With the Right App Stack](https://gridwise.io/blog/multi-apping/multi-apping-max-your-earnings-with-the-right-app-stack)
- [Gridwise: Mobility Data: What Gig Driver Loyalty Reveals to Investors](https://gridwise.io/blog/analytics/mobility-data-what-gig-driver-loyalty-reveals-to-investors)
- [The Rideshare Guy: Are Men from Uber and Women from Lyft?](https://therideshareguy.com/are-men-from-uber-and-women-from-lyft-not-necessarily/) (encuesta RSG de 2017)
- [Chamber of Progress: Amid More Competition, Gig Drivers Are In The Driver's Seat](https://medium.com/chamber-of-progress/amid-more-competition-gig-drivers-are-in-the-drivers-seat-44fcc50b65e9) (encuesta de Flex Association)
- [ShiftTracker: Multi-App Strategy](https://shifttrackerapp.com/resources/multi-app-strategy) (blog de otra app; sin datos propios)
- [ShiftTracker: Walmart Spark vs. DoorDash & Uber Eats](https://shifttrackerapp.com/blog/walmart-spark-vs-doordash-uber-eats) (blog de otra app)
- [Amazon Flex: Deactivation Policy](https://flex.amazon.com/policy/deactivation-policy/)
- [The Budget Diet: Amazon Flex Deactivation](https://www.thebudgetdiet.com/amazon-flex-deactivation) y [FlexDriverGuide: Multi-App Strategy](https://flexdriverguide.pages.dev/multi-app-strategy) (blogs que se contradicen sobre Flex)
