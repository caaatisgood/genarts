import './style.css';

let p
let points = []
let textToRender = "sup, glad you're here."
let amount = 30
let bgText = "punches"
let bgPoints = []

window.setup = function setup() {
  const size = getSize()
  const canvas = createCanvas(size, size);
  canvas.parent("canvasWrapper");
  pixelDensity(4)
  background(250, 80);
  p = createVector(size / 7, size / 2)
  for (let i = 0; i < amount; i++) {
    points.push(p.copy())
    // const xdelta = 7 + noise(p.x, i / 10) * 10
    const xdelta = 15
    const ydelta =
      sin(5 + i / 6) * (amount-i) / 2 +
      (noise(p.y, i / 120) - 0.5) * 10
    p.add(
      xdelta,
      ydelta
    )
  }
}

window.draw = function draw() {
  // bg
  const size = getSize()
  let bgy = 10
  while (bgy < size) {
    let bgx = 0
    while (bgx < size) {
      // let y = bgy + sin(bgx / 50) * 5
      push()
        fill("#FFE983")
        textFont("Nova Mono")
        textSize(15)
        text("p", bgx, bgy)
      pop()
      // bgx += 10 + noise(bgx / 200, bgy / 50) * 20
      bgx += 15
    }
    bgy += 19
  }

  for (let i = 0; i < amount - 1; i++) {
    const currv = points[i]
    const nextv = points[i + 1]
    const angle = atan2(nextv.y - currv.y, nextv.x - currv.x);
    const midPoint = createVector((currv.x + nextv.x) / 2, (currv.y + nextv.y) / 2);

    push();
      fill("pink")
      textFont("Nova Mono")
      textSize(16)
      translate(midPoint.x, midPoint.y);
      rotate(angle);
      // const char = textToRender[i]
      const char = `r`
      // const chars = '-----_____++....'
      // const char = random(chars.split(""))
      // text(char, 0, 0)
    pop()
  }
  noLoop()
}

window.windowResized = function windowResized() {
  const size = getSize()
  resizeCanvas(size, size);
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 0.9
}
