let clrs = [
  // [clr1, clr2, bg]
  ["#f94144", "#011627", "#ccb7ae"],
  // ["#31572c", "#00a8e8", "#edf6f9"],
  // ["#d9ed92", "#db3a34", "#00171f"],
]
let cwidth, cheight
let particles = []
let drawingScale
let mouseTouched = false

export function setup() {
  randomSeed(10000)
  noiseSeed(10000)
  pixelDensity(4)
  // cwidth = windowWidth
  // cheight = cwidth*0.61
  cheight = windowHeight
  cwidth = cheight * 0.8
  drawingScale = cheight / 1000
  createCanvas(cwidth, cheight);
  let particlesAmt = 200
  let [clr1, clr2, bg] = random(clrs)
	background(bg);
  let _clr1 = color(clr1)
  let _clr2 = color(clr2)
  for (let i = 0; i<particlesAmt; i++) {
    let ypg = random(0, 1)
    let clr = lerpColor(_clr1, _clr2, ypg)
    particles.push(
      new Particle({
        idx: i,
        initX: 0,
        initY: ypg * height,
        clr,
      })
    )
  }
}

class Particle {
  constructor({ idx, initX, initY, clr } = {}) {
    let currv = createVector(initX, initY)
    let accv = createVector(1, 0)
    let def = {
      idx,
      currv,
      accv,
      w: 0,
      h: 0,
      rot: 0,
      clr,
      flashy: random() < 0.66,
      on: true,
      overallNoise: 5,
    }
    Object.assign(this, def)
  }
  
  update() {
    if (this._isDone()) {
      return
    }

    const { idx, currv, accv, flashy, on } = this
    if (flashy && (frameCount % 3) === 0) {
      if (on && random() > 0.6) {
        this.on = false
      } else if (!on && random() > 0.3) {
        this.on = true
      }
    }

    if (currv.x > width) {
      currv.set([0, currv.y])
    } else if (currv.x < 0) {
      currv.set([width, currv.y])
    } else if (currv.y > height) {
      currv.set([currv.x, 0])
    } else if (currv.y < 0) {
      currv.set([currv.x, height])
    } else {
      let xBaseSpeed =
        frameCount > 20 && mouseTouched
          ? map(mouseX, 0, width, -0.5, 0.8)
          : 0.2
      let accX =
        xBaseSpeed + sin((frameCount+idx)/40)/2 +
        noise(currv.x, sin((frameCount+idx*10)/50)) * 2
      let overallNoise = this.overallNoise

      let yWaviness = map((mouseY - height / 2)/height, -0.5, 0.5, -40, 40)
      idx === 0 && console.log(yWaviness)
      let accY =
        sin((frameCount+idx)/1)*0.5 +
        (noise(currv.y/overallNoise+currv.x/(50+idx*100), cos((frameCount+idx*100)/50)*10) - 0.5) *
        noise(frameCount/300)*yWaviness
      let accXScale = 1.2
      accv.set([
        accX * accXScale * drawingScale,
        accY * drawingScale
      ])
      currv.add(accv)
      this.w = (0.3 + noise(frameCount/30, idx/100) * 3) * drawingScale
      this.h = noise((frameCount+idx*10)/30) * 12 * drawingScale
      this.rot = sin((idx+currv.y)/30)*PI*2 + noise((idx+currv.y)/20)*PI*3
    }
  }

  draw() {
    if (this._isDone()) {
      return
    }
  
    const { currv, clr, w, h, rot, on } = this
    if (!on) {
      return
    }
    push()
      let [x, y] = this._applyPadding(currv.x, currv.y)
      translate(x, y)
      noStroke()
      clr.setAlpha(30)
      fill(clr)
      rectMode(CENTER)
      rotate(rot)
      rect(0, 0, w, h)
    pop()
  }

  _isDone() {
    return this.currv.x > width
  }

  _applyPadding(x, y) {
    let wPadding = 0.08
    let hPadding = 0.05
    return [
      width * wPadding + x * (1-wPadding*2),
      height * hPadding + y * (1-hPadding*2),
    ]
  }
}

export function draw() {
  if (!mouseTouched && (mouseX !== 0 || mouseY !== 0)) {
    mouseTouched = true
  }
  if (DEVICE_MOTION_SUPPORTED && !DEVICE_MOTION_TOUCHED) {
    return
  }
  // scale(-1.0,1.0);
  let isDone = true
	particles.forEach(p => {
    p.update()
    p.draw()
    isDone = isDone && p._isDone()
  })
  if (isDone) {
    noLoop()
  }
  // console.log(frameCount)
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  // save(`defnotlikewater22-${dateTime}`)
}
