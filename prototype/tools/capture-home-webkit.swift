// Before/after PNGs of Home lab variants, rendered by macOS WebKit (the Safari engine).
// Playwright is not needed; it runs wherever Xcode or the Command Line Tools are installed.
// Usage: swift prototype/tools/capture-home-webkit.swift sin-titulo | tarjeta-verde
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
}

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
    try snapshot(NSRect(x: 0, y: 0, width: 390, height: 844), scale: 3, to: out.appendingPathComponent(shot.file))
  } else {
    resize(NSSize(width: 960, height: 1200))
    _ = js("document.documentElement.style.overflow = ''; location.hash = '\(shot.hash)'")
    spin(0.5)
    // Lab bar and info line stay out of the image; the frame titles say which side is which.
    let box = js("""
      (() => { document.getElementById('lab-bar').style.display = 'none'; document.getElementById('lab-info').style.display = 'none';
        const cols = [...document.querySelectorAll('.frame-col')];
        const w = cols.reduce((a, c) => a + c.getBoundingClientRect().width, 0) + 28 * (cols.length - 1) + 64;
        return [Math.ceil(w), Math.ceil(document.getElementById('stage').getBoundingClientRect().height)]; })()
      """) as? [Double] ?? [960, 1200]
    let size = NSSize(width: box[0], height: box[1])
    resize(size)
    try snapshot(NSRect(origin: .zero, size: size), scale: 2, to: out.appendingPathComponent(shot.file))
  }
}
