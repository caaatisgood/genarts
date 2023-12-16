import './style.css';

let w, h
let wrange, hrange
let xrepeat
let xbaseshift = 0, ybaseshift = 0
let max_w = 700, max_h
let margin = 24

window.setup = function setup() {
  w = min(window.innerWidth, max_w)
  max_h = w * 1.66
  h = min(window.innerHeight, max_h)
  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("canvasWrapper");
  pixelDensity(3)
  background(255);

  // configs
  if (w < max_w) {
    wrange = w - margin * 2
    xbaseshift = margin
  } else {
    wrange = w
    xbaseshift = (window.innerWidth - w) / 2
  }
  hrange = h * 0.9
  ybaseshift = h * 0.05
  xrepeat = floor(random([15, 30, 50, 60, 70, 80]))
  // xrepeat = 100
  // noLoop()
  r = random()
}

let ticks = 0
let r

window.draw = function draw() {
  let randomY = ticks * 7
  // let randomY = (noise(ticks/20)) * hrange
  push()
    // translate(w/4, h/4+randomY)
    translate(xbaseshift, ybaseshift+randomY)
    let xLen = wrange / xrepeat
    let strokeClr = random(["red", "yellow", "blue", "green"])
    for (let i = 0; i < xrepeat; i++) {
      let x = i * xLen
      let ydelta = (noise(ticks/5, i/5) - 0.5) * sin(i/1) * 75
      push()
        noStroke()
        fill("tomato")
        // ellipse(x, ydelta, 3)
      pop()
      let xLenDelta = (noise(ticks/5, i/3) - 0.5) * (xLen * 1.66) * 0
      push()
        translate(x, ydelta)
        rotate(PI * (noise(ticks/5, i/10) - 0.5) * 0.3)
        if (random() < 0.05) {
        } else {
          if (random() > 0.8) {
            stroke(strokeClr)
          }
          line(0, 0, xLen + xLenDelta, 0)
          for (let j = 1; j < 5; j++) {
            if (random() > 0.95) {
              line(0, j, xLen + xLenDelta, j)
            }
          }
        }
      pop()
    }
  pop()
  if (ticks > 100) {
    noLoop()
  }
  ticks++
}

window.mousePressed = () => {
  loop()
  ticks++
}

window.mouseReleased = () => {
  noLoop()
}

window.windowResized = function windowResized() {
  const size = getSize()
  resizeCanvas(size, size);
}

window.keyPressed = function keyPressed() {
  if (keyCode === 32) {
    save(`punches1-${Date.now()}`)
  }
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 1
}
