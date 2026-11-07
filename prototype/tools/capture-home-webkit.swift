// Before/after PNGs of Home lab variants, rendered by macOS WebKit (the Safari engine).
// Playwright is not needed; it runs wherever Xcode or the Command Line Tools are installed.
// Usage: swift prototype/tools/capture-home-webkit.swift base-1 | sin-titulo | tarjeta-verde | tarjeta-abierta | opciones | personal | personal-en-marcha | personal-en-marcha-tres | personal-viaje-primero | iniciar-turno | contraste-oscuro | avisos | recientes | turno-activo | cierre
// Results describe WebKit on macOS; they are not iOS, Dynamic Type or VoiceOver captures.
import AppKit
import WebKit

let proto = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let index = proto.appendingPathComponent("index.html")

struct Shot {
  let file: String
  let hash: String
  let dark: Bool
  let solo: Bool
  // Grow the phone so the whole Home scroll is visible (e.g. an open breakdown), instead of cutting it.
  var full = false
  // JavaScript run after the hash loads, for lab states that have no scenario of their own.
  var setup = ""
  // Crop a comparison to the top of Home (frame titles down to the notice), at 3x, to judge alignments.
  var detail = false
  // Phone size for solo shots: 390 × 844 by default; 375 × 667 is the iPhone SE.
  var w = 390.0
  var h = 844.0
}

// «Sin datos» with personal tracking switched on: both personal figures are zero.
let personalOn = "E.state.data.autoPersonal = true; E.render();"
let personalView = "view=personal&family=v0&deco=none&motion=normal"
let chosen = "solo=1&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&family=v0&deco=none&motion=normal"
// Everything chosen in Home so far, the dark-mode Corte circle included.
let chosenAll = "\(chosen)&personal=a&vivo=tablero&circulo=fondo-corte"
let avisosView = "view=avisos&family=v0&deco=none&motion=normal"
let recientesView = "view=recientes&family=v0&deco=none&motion=normal"
let chosenNotices = "\(chosenAll)&avisos=b"
let turnoView = "view=turno&family=v0&deco=none&motion=normal"
let chosenRecent = "\(chosenNotices)&recientes=d"
let cierreView = "view=cierre&family=v0&deco=none&motion=normal"
let chosenShift = "\(chosenRecent)&turno=b"


// Same scenario, screen and size on every side of a comparison; only the lab variant differs.
let common = "family=v0&deco=none&motion=normal"
// Base 1: every chosen piece together, opened with the single `base=1` link.
let base1 = "base=1&view=single&solo=1&motion=normal"
func b1(_ file: String, _ screen: String, dark: Bool = false, lang: String = "es", scenario: String = "partial", width: Int = 390, text: String = "1", full: Bool = false) -> Shot {
  let h = width == 375 ? 667.0 : width == 320 ? 640.0 : width == 430 ? 932.0 : 844.0
  return Shot(file: file, hash: "\(base1)&screen=\(screen)&theme=\(dark ? "dark" : "light")&lang=\(lang)&scenario=\(scenario)&width=\(width)&text=\(text)", dark: dark, solo: true, full: full, w: Double(width), h: h)
}
let sets: [String: [Shot]] = [
  "base-1": [
    b1("01-inicio-390-claro-es.png", "home"),
    b1("02-inicio-390-oscuro-en.png", "home", dark: true, lang: "en"),
    b1("03-inicio-se-claro-es.png", "home", width: 375),
    b1("04-inicio-se-texto-135-es.png", "home", width: 375, text: "1.35"),
    b1("05-inicio-viaje-390-es.png", "homeLive"),
    b1("06-inicio-viaje-se-es.png", "homeLive", width: 375),
    b1("07-inicio-dos-avisos-390-es.png", "homeTwoNotices"),
    b1("08-inicio-entero-390-es.png", "homeNoNotice", full: true),
    b1("09-inicio-desglose-390-es.png", "homeBreakdown", full: true),
    b1("10-inicio-opciones-390-es.png", "homeOptions", full: true),
    b1("11-turno-390-es.png", "active"),
    b1("12-turno-se-es.png", "active", width: 375),
    b1("13-turno-terminar-oscuro-es.png", "activeEnd", dark: true),
    b1("14-cierre-390-es.png", "closeStacked", scenario: "complete", full: true),
    b1("15-cierre-flex-390-es.png", "closeFlexMany", scenario: "complete", full: true),
    b1("16-inicio-320-texto-200-es.png", "home", width: 320, text: "2", full: true)
  ],
  "cierre": [
    Shot(file: "01-comparar-vacio-es.png", hash: "\(cierreView)&screen=close&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "02-comparar-con-uber-es.png", hash: "\(cierreView)&screen=closeStacked&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "03-comparar-con-uber-oscuro-en.png", hash: "\(cierreView)&screen=closeStacked&theme=dark&lang=en&scenario=complete&width=390&text=1", dark: true, solo: false, full: true),
    Shot(file: "04-comparar-solo-uber-es.png", hash: "\(cierreView)&screen=closeOnlyOther&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "05-comparar-dos-apps-es.png", hash: "\(cierreView)&screen=closeTwoApps&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "06-comparar-propina-es.png", hash: "\(cierreView)&screen=closeTipTooBig&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "07-comparar-320-texto-200-es.png", hash: "\(cierreView)&screen=closeStacked&theme=light&lang=es&scenario=complete&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "08-comparar-sin-gasolina-es.png", hash: "\(cierreView)&screen=closeStacked&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "09-actual-es.png", hash: "\(chosenShift)&cierre=actual&screen=closeStacked&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: true),
    Shot(file: "10-a-es.png", hash: "\(chosenShift)&cierre=a&screen=closeStacked&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: true),
    Shot(file: "11-b-es.png", hash: "\(chosenShift)&cierre=b&screen=closeStacked&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: true),
    Shot(file: "12-c-es.png", hash: "\(chosenShift)&cierre=c&screen=closeStacked&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: true),
    Shot(file: "13-a-turno-uber-es.png", hash: "\(cierreView)&screen=closeUber&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "14-a-turno-uber-otra-app-es.png", hash: "\(cierreView)&screen=closeUberMore&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "15-a-flex-cinco-apps-es.png", hash: "\(cierreView)&screen=closeFlexMany&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "16-a-flex-historial-es.png", hash: "\(cierreView)&screen=closeFlexMany&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true)
  ],
  "turno-activo": [
    Shot(file: "01-comparar-claro-es.png", hash: "\(turnoView)&screen=active&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "02-comparar-oscuro-en.png", hash: "\(turnoView)&screen=active&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "03-comparar-buscando-es.png", hash: "\(turnoView)&screen=activeAcquiring&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "04-comparar-ahorro-es.png", hash: "\(turnoView)&screen=activeLowPower&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "05-comparar-largo-en.png", hash: "\(turnoView)&screen=activeLong&theme=light&lang=en&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "06-comparar-320-texto-200-es.png", hash: "\(turnoView)&screen=active&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false),
    Shot(file: "07-comparar-320-texto-200-ahorro-es.png", hash: "\(turnoView)&screen=activeLowPower&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false),
    Shot(file: "08-comparar-terminar-es.png", hash: "\(turnoView)&screen=activeEnd&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "09-actual-es.png", hash: "\(chosenRecent)&turno=actual&screen=active&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "10-a-es.png", hash: "\(chosenRecent)&turno=a&screen=active&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "11-b-es.png", hash: "\(chosenRecent)&turno=b&screen=active&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "12-c-es.png", hash: "\(chosenRecent)&turno=c&screen=active&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "13-espacio-b-390-es.png", hash: "view=turnob&family=v0&deco=none&motion=normal&screen=active&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "14-espacio-b-430-es.png", hash: "view=turnob&family=v0&deco=none&motion=normal&screen=active&theme=light&lang=es&scenario=partial&width=430&text=1", dark: false, solo: false),
    Shot(file: "15-espacio-b-ahorro-es.png", hash: "view=turnob&family=v0&deco=none&motion=normal&screen=activeLowPower&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false)
  ],
  "recientes": [
    Shot(file: "01-comparar-claro-es.png", hash: "\(recientesView)&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "02-comparar-oscuro-en.png", hash: "\(recientesView)&screen=homeNoNotice&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false, full: true),
    Shot(file: "03-comparar-sin-ruta-es.png", hash: "\(recientesView)&screen=homeNoRoute&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "04-comparar-importe-largo-en.png", hash: "\(recientesView)&screen=homeNoNotice&theme=light&lang=en&scenario=longPay&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "05-comparar-320-texto-200-es.png", hash: "\(recientesView)&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "06-comparar-con-aviso-es.png", hash: "\(recientesView)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "07-comparar-sin-datos-es.png", hash: "\(recientesView)&screen=homeNoNotice&theme=light&lang=es&scenario=empty&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "08-actual-es.png", hash: "\(chosenNotices)&recientes=actual&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "09-a-es.png", hash: "\(chosenNotices)&recientes=a&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "10-b-es.png", hash: "\(chosenNotices)&recientes=b&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "11-c-es.png", hash: "\(chosenNotices)&recientes=c&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "12-d-es.png", hash: "\(chosenNotices)&recientes=d&screen=homeNoNotice&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true)
  ],
  "avisos": [
    Shot(file: "01-comparar-siempre-claro-es.png", hash: "\(avisosView)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "02-comparar-dos-avisos-claro-es.png", hash: "\(avisosView)&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "03-comparar-bateria-claro-es.png", hash: "\(avisosView)&screen=homeLowPower&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "04-comparar-ubicacion-apagada-claro-es.png", hash: "\(avisosView)&screen=homeDenied&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "05-comparar-personal-movimiento-claro-es.png", hash: "\(avisosView)&screen=homeMotion&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "06-comparar-dos-avisos-oscuro-en.png", hash: "\(avisosView)&screen=homeTwoNotices&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false, full: true),
    Shot(file: "07-comparar-320-texto-200-dos-avisos-es.png", hash: "\(avisosView)&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "08-actual-dos-avisos-es.png", hash: "\(chosenAll)&avisos=actual&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "09-a-dos-avisos-es.png", hash: "\(chosenAll)&avisos=a&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "10-b-dos-avisos-es.png", hash: "\(chosenAll)&avisos=b&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "11-c-dos-avisos-es.png", hash: "\(chosenAll)&avisos=c&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "12-c-hoja-bateria-es.png", hash: "\(chosenAll)&avisos=c&screen=homeTwoNotices&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true,
         setup: "E.state.ui.sheet = 'notice'; E.state.ui.noticeId = 'low'; E.render(); document.querySelectorAll('.sheet').forEach((el) => { el.style.animation = 'none'; });")
  ],
  "sin-titulo": [
    Shot(file: "01-comparar-claro-es.png", hash: "view=sintitulo&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "02-comparar-oscuro-es.png", hash: "view=sintitulo&\(common)&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "03-comparar-sin-aviso-claro-en.png", hash: "view=sintitulo&\(common)&screen=home&theme=light&lang=en&scenario=complete&width=390&text=1", dark: false, solo: false),
    Shot(file: "04-comparar-320-texto-200-claro-es.png", hash: "view=sintitulo&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false),
    Shot(file: "05-comparar-320-oscuro-en.png", hash: "view=sintitulo&\(common)&screen=home&theme=dark&lang=en&scenario=partial&width=320&text=1", dark: true, solo: false),
    Shot(file: "06-original-claro-es.png", hash: "solo=1&home=original&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "07-sin-titulo-claro-es.png", hash: "solo=1&home=sintitulo&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "08-original-oscuro-es.png", hash: "solo=1&home=original&\(common)&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: true),
    Shot(file: "09-sin-titulo-oscuro-es.png", hash: "solo=1&home=sintitulo&\(common)&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: true)
  ],
  "tarjeta-verde": [
    Shot(file: "01-actual-claro-es.png", hash: "solo=1&home=sintitulo&card=actual&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "02-c-claro-es.png", hash: "solo=1&home=sintitulo&card=c&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "03-comparar-claro-es.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "04-comparar-oscuro-es.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "05-comparar-320-texto-200-importe-largo-es.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=light&lang=es&scenario=longPay&width=320&text=2", dark: false, solo: false),
    Shot(file: "06-comparar-importe-largo-en.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=light&lang=en&scenario=longPay&width=390&text=1", dark: false, solo: false),
    Shot(file: "07-comparar-320-oscuro-en.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=dark&lang=en&scenario=partial&width=320&text=1", dark: true, solo: false),
    Shot(file: "08-comparar-cobertura-corta-en.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=light&lang=en&scenario=complete&width=390&text=1", dark: false, solo: false),
    Shot(file: "09-comparar-cero-negativo-desglose-es.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=zeroPay&width=390&text=1", dark: false, solo: false),
    Shot(file: "10-comparar-sin-datos-es.png", hash: "view=tarjeta&cards=actual,c&\(common)&screen=home&theme=light&lang=es&scenario=empty&width=390&text=1", dark: false, solo: false)
  ],
  "tarjeta-abierta": [
    Shot(file: "01-actual-claro-es.png", hash: "solo=1&home=sintitulo&card=c&desglose=actual&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "02-propuesta-claro-es.png", hash: "solo=1&home=sintitulo&card=c&desglose=propuesta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "03-comparar-pagos-completos-claro-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "04-comparar-pagos-completos-oscuro-en.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=dark&lang=en&scenario=complete&width=390&text=1", dark: true, solo: false, full: true),
    Shot(file: "05-comparar-parcial-claro-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "06-comparar-cero-negativo-claro-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=zeroPay&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "07-comparar-320-texto-200-parcial-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "08-comparar-320-texto-200-negativo-oscuro-en.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=dark&lang=en&scenario=zeroPay&width=320&text=2", dark: true, solo: false, full: true),
    Shot(file: "09-comparar-gasolina-sin-resultado-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=orphan&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "10-comparar-importe-largo-en.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=en&scenario=longPay&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "11-comparar-sin-datos-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=empty&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "12-comparar-demasiado-grande-es.png", hash: "view=abierta&\(common)&screen=homeBreakdown&theme=light&lang=es&scenario=tooLarge&width=390&text=1", dark: false, solo: false, full: true)
  ],
  "opciones": [
    Shot(file: "01-actual-cerrada-claro-es.png", hash: "solo=1&home=sintitulo&card=c&desglose=propuesta&opciones=actual&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "02-propuesta-cerrada-claro-es.png", hash: "solo=1&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "03-actual-abierta-claro-es.png", hash: "solo=1&home=sintitulo&card=c&desglose=propuesta&opciones=actual&\(common)&screen=homeOptions&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "04-propuesta-abierta-claro-es.png", hash: "solo=1&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&\(common)&screen=homeOptions&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "05-comparar-cerrada-claro-es.png", hash: "view=opciones&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "06-comparar-abierta-claro-es.png", hash: "view=opciones&\(common)&screen=homeOptions&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "07-comparar-abierta-oscuro-en.png", hash: "view=opciones&\(common)&screen=homeOptions&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false, full: true),
    Shot(file: "08-comparar-320-texto-200-nota-larga-es.png", hash: "view=opciones&\(common)&screen=homeOptions&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "09-comparar-sin-datos-es.png", hash: "view=opciones&\(common)&screen=homeOptions&theme=light&lang=es&scenario=empty&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "10-comparar-sin-estimar-es.png", hash: "view=opciones&\(common)&screen=homeOptions&theme=light&lang=es&scenario=tooLarge&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "11-comparar-desglose-y-opciones-es.png", hash: "view=opciones&\(common)&screen=homeBoth&theme=light&lang=es&scenario=complete&width=390&text=1", dark: false, solo: false, full: true)
  ],
  "personal": [
    Shot(file: "01-actual-claro-es.png", hash: "\(chosen)&personal=actual&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "02-a-claro-es.png", hash: "\(chosen)&personal=a&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "03-b-claro-es.png", hash: "\(chosen)&personal=b&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true, full: true),
    Shot(file: "04-comparar-actual-a-claro-es.png", hash: "\(personalView)&personales=actual,a&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "05-comparar-a-b-claro-es.png", hash: "\(personalView)&personales=a,b&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "06-detalle-actual-a-b-claro-es.png", hash: "\(personalView)&personales=actual,a,b&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, detail: true),
    Shot(file: "07-comparar-actual-a-b-oscuro-en.png", hash: "\(personalView)&personales=actual,a,b&screen=home&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false, full: true),
    Shot(file: "08-comparar-320-texto-200-cifras-largas-es.png", hash: "\(personalView)&personales=actual,a,b&screen=home&theme=light&lang=es&scenario=personalLong&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "09-comparar-cifras-largas-en.png", hash: "\(personalView)&personales=actual,a,b&screen=home&theme=light&lang=en&scenario=personalLong&width=390&text=1", dark: false, solo: false, full: true),
    Shot(file: "10-comparar-320-es.png", hash: "\(personalView)&personales=actual,a,b&screen=home&theme=light&lang=es&scenario=partial&width=320&text=1", dark: false, solo: false, full: true),
    Shot(file: "11-comparar-ceros-es.png", hash: "\(personalView)&personales=actual,a,b&screen=home&theme=light&lang=es&scenario=empty&width=390&text=1", dark: false, solo: false, full: true, setup: personalOn),
    Shot(file: "12-comparar-opciones-abierta-es.png", hash: "\(personalView)&personales=actual,a,b&screen=homeOptions&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false, full: true)
  ],
  // A personal drive in progress, inside the chosen Personal box A: one normal 390 × 844 viewport per state.
  "personal-en-marcha": [
    Shot(file: "01-trackeando-claro-es.png", hash: "\(chosen)&personal=a&screen=homeLive&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "02-buscando-ubicacion-claro-es.png", hash: "\(chosen)&personal=a&screen=homeLiveAcquiring&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "03-sin-senal-claro-es.png", hash: "\(chosen)&personal=a&screen=homeLiveNoSignal&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "04-en-pausa-claro-es.png", hash: "\(chosen)&personal=a&screen=homeLivePaused&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true)
  ],
  // The three live presentations side by side, phones at their normal height (not grown).
  "personal-en-marcha-tres": [
    Shot(file: "01-comparar-trackeando-claro-es.png", hash: "view=enmarcha&family=v0&deco=none&motion=normal&screen=homeLive&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "02-comparar-en-pausa-claro-es.png", hash: "view=enmarcha&family=v0&deco=none&motion=normal&screen=homeLivePaused&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "03-comparar-sin-senal-oscuro-en.png", hash: "view=enmarcha&family=v0&deco=none&motion=normal&screen=homeLiveNoSignal&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "04-comparar-320-texto-200-en-pausa-es.png", hash: "view=enmarcha&family=v0&deco=none&motion=normal&screen=homeLivePaused&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false)
  ],
  // The chosen live presentation (2 · El viaje primero, vivo=tablero) on its own, 390 × 844.
  "personal-viaje-primero": [
    Shot(file: "01-trackeando-claro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&screen=homeLive&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "02-en-pausa-claro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&screen=homeLivePaused&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true)
  ],
  // «Iniciar turno»: the start circle with the real Woodbridge interchange behind its label, over every Home choice so far.
  "iniciar-turno": [
    Shot(file: "01-actual-claro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&circulo=actual&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "02-fondo-claro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&circulo=fondo&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: true),
    Shot(file: "03-fondo-oscuro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&circulo=fondo&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: true),
    Shot(file: "04-comparar-claro-es.png", hash: "view=iniciar&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false),
    Shot(file: "05-comparar-oscuro-en.png", hash: "view=iniciar&\(common)&screen=home&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "06-comparar-320-texto-200-es.png", hash: "view=iniciar&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=320&text=2", dark: false, solo: false, full: true),
    Shot(file: "07-comparar-viaje-en-curso-es.png", hash: "view=iniciar&\(common)&screen=homeLive&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false)
  ],
  // Fondo in dark mode: as chosen, with the lines cut around the label («corte») and with the map at 14 % («tenue»).
  "contraste-oscuro": [
    Shot(file: "01-corte-oscuro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&circulo=fondo-corte&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: true),
    Shot(file: "02-tenue-oscuro-es.png", hash: "\(chosen)&personal=a&vivo=tablero&circulo=fondo-tenue&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: true),
    Shot(file: "03-comparar-oscuro-es.png", hash: "view=contraste&\(common)&screen=home&theme=dark&lang=es&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "04-comparar-oscuro-en.png", hash: "view=contraste&\(common)&screen=home&theme=dark&lang=en&scenario=partial&width=390&text=1", dark: true, solo: false),
    Shot(file: "05-comparar-320-texto-200-oscuro-es.png", hash: "view=contraste&\(common)&screen=home&theme=dark&lang=es&scenario=partial&width=320&text=2", dark: true, solo: false, full: true),
    Shot(file: "06-comparar-claro-es.png", hash: "view=contraste&\(common)&screen=home&theme=light&lang=es&scenario=partial&width=390&text=1", dark: false, solo: false)
  ]
]

guard CommandLine.arguments.count > 1, let shots = sets[CommandLine.arguments[1]] else {
  print("usage: swift prototype/tools/capture-home-webkit.swift \(sets.keys.sorted().joined(separator: " | "))")
  exit(2)
}
let out = proto.appendingPathComponent("captures/home-\(CommandLine.arguments[1])")
try FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let web = WKWebView(frame: NSRect(x: 0, y: 0, width: 960, height: 1200))
let window = NSWindow(contentRect: web.frame, styleMask: .borderless, backing: .buffered, defer: false)
window.contentView = web
window.setFrameOrigin(NSPoint(x: -20000, y: -20000))
window.orderFrontRegardless()

func spin(_ seconds: Double) { RunLoop.main.run(until: Date().addingTimeInterval(seconds)) }

func js(_ code: String) -> Any? {
  var done = false
  var result: Any?
  web.evaluateJavaScript(code) { value, error in
    if let error { print("js error: \(error)") }
    result = value
    done = true
  }
  while !done { spin(0.02) }
  return result
}

func resize(_ size: NSSize) {
  window.setContentSize(size)
  web.setFrameSize(size)
  spin(0.3)
}

func snapshot(_ rect: NSRect, scale: CGFloat, to url: URL) throws {
  let config = WKSnapshotConfiguration()
  config.rect = rect
  config.snapshotWidth = NSNumber(value: Double(rect.width * scale))
  var done = false
  var image: NSImage?
  web.takeSnapshot(with: config) { img, error in
    if let error { print("snapshot error: \(error)") }
    image = img
    done = true
  }
  while !done { spin(0.02) }
  guard let image, let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else { throw CocoaError(.fileWriteUnknown) }
  let rep = NSBitmapImageRep(cgImage: cg)
  try rep.representation(using: .png, properties: [:])!.write(to: url)
  print("\(url.lastPathComponent) \(cg.width)x\(cg.height)")
}

web.loadFileURL(index, allowingReadAccessTo: proto)
while web.isLoading || (js("document.readyState") as? String) != "complete" { spin(0.05) }
// iPhone scroll indicators float over the content. A Mac scrollbar takes 11 px, so Home rendered at 379 px instead of 390
// in every capture made before 6 Nov; the side-by-side comparisons were fair (both sides had the bar), absolute widths were not.
_ = js("(() => { const s = document.createElement('style'); s.textContent = '.scroll, .sheet-body { scrollbar-width: none; } .scroll::-webkit-scrollbar, .sheet-body::-webkit-scrollbar { display: none; width: 0; }'; document.head.appendChild(s); })()")

for shot in shots {
  web.appearance = NSAppearance(named: shot.dark ? .darkAqua : .aqua)
  if shot.solo {
    // A scrollbar left over from the lab layout would eat into the phone viewport.
    resize(NSSize(width: shot.w, height: shot.h))
    _ = js("document.documentElement.style.overflow = 'hidden'; location.hash = '\(shot.hash)'")
    spin(0.5)
    if !shot.setup.isEmpty { _ = js(shot.setup); spin(0.2) }
    var height = shot.h
    if shot.full {
      height += js("(() => { const s = document.querySelector('.screen .scroll'); return s.scrollHeight - s.clientHeight; })()") as? Double ?? 0
      resize(NSSize(width: shot.w, height: height))
    }
    try snapshot(NSRect(x: 0, y: 0, width: shot.w, height: height), scale: 3, to: out.appendingPathComponent(shot.file))
  } else {
    resize(NSSize(width: 960, height: 1200))
    _ = js("document.documentElement.style.overflow = ''; location.hash = '\(shot.hash)'")
    spin(0.5)
    if !shot.setup.isEmpty { _ = js(shot.setup); spin(0.2) }
    if shot.full {
      // Every phone grows by the same amount, so both tab bars stay level.
      _ = js("""
        (() => { const phones = [...document.querySelectorAll('.phone')];
          const extra = Math.max(0, ...phones.map((p) => { const s = p.querySelector('.scroll'); return s.scrollHeight - s.clientHeight; }));
          phones.forEach((p) => p.style.setProperty('--h', (parseFloat(p.style.getPropertyValue('--h')) + extra) + 'px')); })()
        """)
      spin(0.2)
    }
    // Lab bar and info line stay out of the image; the frame titles say which side is which.
    let box = js("""
      (() => { document.getElementById('lab-bar').style.display = 'none'; document.getElementById('lab-info').style.display = 'none';
        const cols = [...document.querySelectorAll('.frame-col')];
        const w = cols.reduce((a, c) => a + c.getBoundingClientRect().width, 0) + 28 * (cols.length - 1) + 64;
        return [Math.ceil(w), Math.ceil(document.getElementById('stage').getBoundingClientRect().height)]; })()
      """) as? [Double] ?? [960, 1200]
    let size = NSSize(width: box[0], height: box[1])
    resize(size)
    if shot.detail {
      let r = js("""
        (() => { const top = Math.min(...[...document.querySelectorAll('.frame-head')].map((e) => e.getBoundingClientRect().top));
          const bottom = Math.max(...[...document.querySelectorAll('.app .notice')].map((e) => e.getBoundingClientRect().bottom));
          return [Math.floor(top), Math.ceil(bottom + 16)]; })()
        """) as? [Double] ?? [0, size.height]
      try snapshot(NSRect(x: 0, y: r[0], width: size.width, height: r[1] - r[0]), scale: 3, to: out.appendingPathComponent(shot.file))
    } else {
      try snapshot(NSRect(origin: .zero, size: size), scale: 2, to: out.appendingPathComponent(shot.file))
    }
  }
}
