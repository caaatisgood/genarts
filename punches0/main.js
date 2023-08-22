import './style.css';

let w, h
let center, centerSize

window.setup = function setup() {
  w = window.innerWidth
  h = window.innerHeight
  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("canvasWrapper");
  pixelDensity(4)
  background(250, 80);

  // configs
  let centerSizeBase = min(w, h)
  centerSize = centerSizeBase * random(0.01, 0.025)
  center = getCenterPoint()
}

let ticks = 0

window.draw = function draw() {
  // center
  translate(w/2, h/2)
  if (ticks === 0) {
    push()
      noFill()
      ellipse(center.x, center.y, centerSize)
    pop()
  }
  push()
    translate(center.x, center.y)
    rotate(random(PI * 2))
    // line(centerSize * 1.01, 0, 2, 200)
    line(0, 0, 2, 200)
  push()
  noLoop()
}

const getCenterPoint = () => {
  return createVector(random(-w/4, w/4), random(-h/4, h/4))
}

window.windowResized = function windowResized() {
  const size = getSize()
  resizeCanvas(size, size);
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 1
}
