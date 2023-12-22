import './style.css';

let dpr = window.devicePixelRatio || 1;

function setupCanvas(/** @type {HTMLCanvasElement} */ canvas) {
  // Get the size of the canvas in CSS pixels.
  let rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  let ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return {
    ctx,
    canvas,
  };
}

const { ctx, canvas } = setupCanvas(document.getElementById("canvas1"));

ctx.fillStyle = "#DFD6CC"
ctx.fillRect(0, 0, canvas.width, canvas.height)
let w = canvas.width / dpr
let h = canvas.height / dpr

let infLoopProtectorIndex = 0
const checkInfLoop = () => infLoopProtectorIndex++ < 100000000

class Cell {
  constructor({ x, y, w, choppiness }) {
    this.baseX = x
    this.x = x
    this.y = y
    this.w = w
    this.h = 2
    this.choppiness = choppiness
    this.speed = 1
  }

  update() {
    this.x =
      this.baseX +
      Math.sin(this.baseX / 15 + this.y / 10) / 2
    if (checkInfLoop() && this.y < canvas.height) {
      if (this.choppiness < Math.random()) {
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.w, this.h)
        ctx.fillStyle = "#000"
        ctx.fill()
        ctx.stroke()
      }
      this.y += this.speed
      requestAnimationFrame(this.update.bind(this))
    }
  }
}

for (let i = 0; i < 5; i++) {
  const wider = rand() > 0.9
  const cell = new Cell({
    x: rand(w*0.01, w*0.99),
    y: 0,
    ...(wider ? {
      w: rand(12, 55),
      choppiness: rand(0.1, 0.3),
    } : {
      w: rand(0.05, 4),
      choppiness: rand(0.3, 0.4),
    }),
  })
  cell.update()
}

function rand(a, b) {
  if (arguments.length === 0) {
    // No arguments provided, generate a random number between 0 and 1
    return Math.random();
  } else if (arguments.length === 1) {
    if (Array.isArray(a)) {
      // One argument provided and it's an array, pick a random element from the array
      return a[Math.floor(Math.random() * a.length)];
    } else {
      // One argument provided, assume it's the upper bound and generate a number between 0 and a
      return Math.random() * a;
    }
  } else {
    // Two arguments provided, generate a number between a and b
    return Math.random() * (b - a) + a;
  }
}

