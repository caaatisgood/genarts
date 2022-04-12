let streams = []
let pg = 0

export function setup() {
  pixelDensity(2)
  createCanvas(windowWidth, windowHeight);
	background("darksalmon");
  let streamsAmt = 20
  for (let i = 0; i<streamsAmt; i++) {
    streams.push(
      new Stream({
        idx: i,
        cv: createVector(
          // random(-50, -20),
          random(0, width),
          map(i, 0, streamsAmt, height/10, height/10*9),
        ),
      })
    )
  }
}

class Stream {
	constructor({ cv, idx, x, y } = {}) {
    let initX = x || 0
    let initY = y || height/2
    let _cv = cv || createVector(initX, initY)
		let def = {
      idx,
			cv: _cv,
      startv: _cv.copy(),
      rot: 0,
      speed: random(0.2, 0.5),
		}
    // construct streaming cords
		Object.assign(this, def)
	}
	
	update() {
    let { idx, cv, startv, speed } = this
    /*
      1. update next pos using noise
         a. calc next pos/vector (using current pos?)
         b. apply force/vector
      2. update rotating angle - applied vector's heading()
     */
  
    /* flowing based on progress */
    let y_force_scale = 3
    let _pg = round(pg, 10)
    // let _pg = pg
    let nextNoise = noise(idx+pg) - 0.5
    // let nextNoise = _nextNoise*sin(idx/10+pg)
    let yDelta = nextNoise * y_force_scale
    let xDelta = speed * pg * width/(10+noise(frameCount/200+idx)*2)
    let deltaVector = createVector(xDelta, yDelta)
    let dvHeading = deltaVector.heading()
    this.rot = dvHeading
    cv.set([
      startv.x + xDelta,
      yDelta + cv.y
    ])

    /* flowing on it's own */
    // let y_force_scale = 3
    // let speed_scale = 2
    // // interesting butterfly/dragonfly noise `cv.y`
    // // let _nextNoise = noise(idx*20+frameCount/300, cv.y*100) - 0.5
    // let _nextNoise = noise(idx/30+frameCount/100) - 0.5
    // let nextNoise = _nextNoise*sin(idx/10+frameCount/100)
    // let yDelta = nextNoise * y_force_scale
    // let xDelta = speed + noise(idx+frameCount/100) * speed_scale
    // let deltaVector = createVector(xDelta, yDelta)
    // let dvHeading = deltaVector.heading()
    // this.rot = dvHeading
    // cv.add(deltaVector)

    // boundary check
    // if (cv.x > width) {
    //   cv.set([0, cv.y])
    // } else if (cv.x < 0) {
    //   cv.set([width, cv.y])
    // } else if (cv.y > height) {
    //   cv.set([cv.x, 0])
    // } else if (cv.y < 0) {
    //   cv.set([cv.x, height])
    // }
	}
	
	draw() {
    let { cv, rot } = this
    push()
      translate(cv.x, cv.y)
      rotate(frameCount/20+this.idx)
      rotate(rot)
      noStroke()
      rectMode(CENTER)
      let clr = color("white")
      clr.setAlpha(100)
      fill(clr)
      rect(0, 0, 5, 2, 10)
    pop()
	}
}

export function draw() {
  pg = map(sin(frameCount/30), -1, 1, 0, 1)
	// background(10, 1);
	streams.forEach(p => {
    p.update()
    p.draw()
  })
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  save(`defnotlikewater22-${dateTime}`)
}
