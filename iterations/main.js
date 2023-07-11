import './style.css';

let size, w, h

window.setup = function setup() {
  size = getSize()
  w = size * 0.2
  h = size * 0.7
  const canvas = createCanvas(size, size);
  pixelDensity(4);
  canvas.parent("canvasWrapper");
}

window.draw = function draw() {
  background(color("#FFE983"));
  fill("white")
  const topXPoints = randNums([0, w], 4, "asc")
  const rightYPoints = randNums([0, h], 8, "asc")
  const bottomXPoints = randNums([0, w], 4, "desc")
  const leftYPoints = randNums([0, h], 8, "desc")

  let iterations = floor(random(7, 91))
  if (iterations % 2 === 0) {
    // make sure iterations is odd
    iterations++
  }

  for (let i = 0; i < iterations; i++) {
    push()
      translate(
        size * 0.1 + size * 0.61 / iterations * i,
        size * 0.15
      )

      fill(
        i % 2 === 0 ? "#2e1e19" : "#FFE983"
        // "pink"
      )
      
      beginShape()
      const cords = []
      
      // top
      topXPoints.forEach((x, index) => {
        const y =
          cos(index / 10 + x / 33) * 7 +
          (noise(i / 8 + x / size) - 0.5) * 40
        cords.push([x, y])
      })
      // right
      rightYPoints.forEach((y, index) => {
        const x =
          w +
          sin(index / 10 + y / 33) * 7 +
          (noise(i / 20, y) - 0.5) * 30
        cords.push([x, y])
      })
      // bottom
      bottomXPoints.forEach((x, index) => {
        const y =
          h +
          cos(index / 10 + x / 33) * 7 +
          (noise(i / 12 + x / size) - 0.5) * 20

        cords.push([x, y])
      })
      // left
      leftYPoints.forEach((y, index) => {
        const x =
          sin(index / 10 + y / 33) * 7 +
          (noise(i / 11, y) - 0.5) * 100
        cords.push([x, y])
      })

      noStroke()
      cords.forEach(([x, y], index) => {
        curveVertex(x, y)
        if (index === 0) {
          curveVertex(x, y)
        }
      })
        
      endShape(CLOSE)

      push()
        fill("tomato");
        noStroke();
        cords.forEach(([x, y]) => {
          // ellipse(x, y, 7)
        })
      pop()

    pop()
  }
  noLoop();
}

const randNums = (range, amount, sortBy) => {
  const nums = []
  for (let i = 0; i < amount; i++) {
    const num = random(...range)
    nums.push(num)
  }
  return nums.sort(
    sortBy === "desc"
      ? (a, b) => b - a
      : (a, b) => a - b
  )
}

window.windowResized = function windowResized() {
  const size = getSize()
  resizeCanvas(size, size);
}

window.mousePressed = () => {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  save(`iteration-${dateTime}`)
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 0.9
}
