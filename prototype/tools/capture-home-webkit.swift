// Before/after PNGs of Home lab variants, rendered by macOS WebKit (the Safari engine).
// Playwright is not needed; it runs wherever Xcode or the Command Line Tools are installed.
// Usage: swift prototype/tools/capture-home-webkit.swift sin-titulo | tarjeta-verde | tarjeta-abierta | opciones | personal | personal-en-marcha | personal-en-marcha-tres | personal-viaje-primero
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
}

// «Sin datos» with personal tracking switched on: both personal figures are zero.
let personalOn = "E.state.data.autoPersonal = true; E.render();"
let personalView = "view=personal&family=v0&deco=none&motion=normal"
let chosen = "solo=1&home=sintitulo&card=c&desglose=propuesta&opciones=propuesta&family=v0&deco=none&motion=normal"


// Same scenario, screen and size on every side of a comparison; only the lab variant differs.
let common = "family=v0&deco=none&motion=normal"
let sets: [String: [Shot]] = [
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

for shot in shots {
  web.appearance = NSAppearance(named: shot.dark ? .darkAqua : .aqua)
  if shot.solo {
    // A scrollbar left over from the lab layout would eat into the phone viewport.
    resize(NSSize(width: 390, height: 844))
    _ = js("document.documentElement.style.overflow = 'hidden'; location.hash = '\(shot.hash)'")
    spin(0.5)
    if !shot.setup.isEmpty { _ = js(shot.setup); spin(0.2) }
    var height = 844.0
    if shot.full {
      height += js("(() => { const s = document.querySelector('.scroll'); return s.scrollHeight - s.clientHeight; })()") as? Double ?? 0
      resize(NSSize(width: 390, height: height))
    }
    try snapshot(NSRect(x: 0, y: 0, width: 390, height: height), scale: 3, to: out.appendingPathComponent(shot.file))
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
