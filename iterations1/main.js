import './style.css';

let size, endFrame, endSizeBase, totalCords, initRotation, noisePattern

window.setup = function setup() {
  size = getSize()
  const canvas = createCanvas(size, size);
  pixelDensity(4);
  canvas.parent("canvasWrapper");
  background(color("#FFE983"));
  endFrame = floor(
    random([
      random(10, 40),
      random(70, 111),
    ])
  )
  noisePattern = [random(120, 530), random(10, 30)]
  endSizeBase = random(3, 22)
  totalCords = floor(random(13, 700))
  initRotation = random(PI)
  console.table({
    frameCount: endFrame,
    endSizeBase,
    totalCords,
    noisePattern,
  })
}

let fc = 0

window.draw = function draw() {
  fc = frameCount
  const circleSize = map(
    fc,
    0, endFrame + endSizeBase,
    size * 1.5, 20,
    true
  )
  const cords = []

  for (let i = 0; i < totalCords; i++) {
    const angle = map(i, 0, totalCords, 0, PI * 2);
    const r = circleSize / 2
    cords.push([
      sin(angle) * r,
      cos(angle) * r,
    ])
  }

  // while (fc < endFrame) {
  //   console.log('draw')

  push()
    translate(size / 2, size / 2)
    rotate(initRotation)
    // translate(mouseX, mouseY)
    beginShape()
    cords.forEach(([x, y], index) => {
      // rotate(fc / 300)
      fill(
        fc % 2 === 0 ? "#2e1e19" : "#FFE983"
      )
      noStroke()
      const [noiseStart, noiseEnd] = noisePattern
      const noisiness = map(fc, 0, endFrame, noiseStart, noiseEnd)
      const xDelta = (noise(
        index / 100,
        fc / 30,
        x / 100
      ) - 0.5) * noisiness
      const yDelta = (noise(
        index / 100,
        fc / 30,
        y / 100
      ) - 0.5) * noisiness
      const _x = x + xDelta
      const _y = y + yDelta
      curveVertex(_x, _y)
      
      push()
        fill("tomato")
        noStroke();
        // let dotSize = noise(fc / 50) * 7
        // ellipse(x, y, dotSize)
      pop()
    })
    endShape(CLOSE)
  pop()

  //   fc++
  //   console.log(fc)
  // }

  // noLoop()
  if (fc > endFrame) {
    noLoop()
  }
}

window.windowResized = function windowResized() {
  size = getSize()
  resizeCanvas(size, size);
}

window.mousePressed = () => {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  save(`iterations1-${dateTime}`)
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 0.9
}
