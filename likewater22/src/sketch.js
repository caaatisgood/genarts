let clrs = [
  // [clr1, clr2, bg, clrAlpha]
  // morning
  ["#31572c", "#00a8e8", "#edf6f9", 30],
  // sunset
  ["#e76f51", "#6d597a", "#ccb7ae", 50],
  // night
  ["#d9ed92", "#db3a34", "#02040f", 30],
]
let cwidth, cheight
let particles = []
let DRAWING_SCALE
let MOUSE_TOUCHED = false
let CLR_ALPHA

export function setup() {
  randomSeed(4222022)
  noiseSeed(4222022)
  pixelDensity(4)
  let ASPECT_RATIO = 0.77 // 0.77 : 1 (w:h)
  if (windowWidth / windowHeight > ASPECT_RATIO) {
    cheight = windowHeight
    cwidth = cheight * ASPECT_RATIO
  } else {
    cwidth = windowWidth
    cheight = windowHeight / ASPECT_RATIO
  }
  DRAWING_SCALE = cheight / 1000
  createCanvas(cwidth, cheight);
  let particlesAmt = 150
  let [clr1, clr2, bg, clrAlpha] = random(clrs)
  CLR_ALPHA = clrAlpha
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
      overallNoise: 12,
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
        frameCount > 20 && MOUSE_TOUCHED
          ? map(mouseX, 0, width, -0.5, 0.6)
          : 0.2
      let accX =
        xBaseSpeed + sin((frameCount+idx)/40)/2 +
        noise(currv.x, sin((frameCount+idx*10)/50)) * 2
      let overallNoise = this.overallNoise

      let yWaviness =
        MOUSE_TOUCHED
          ? map((mouseY - height / 2)/height, -0.5, 0.5, -40, 40)
          : noise(frameCount/80) * 10
      let accY =
        sin((frameCount+idx)/1)*0.5 +
        (noise(currv.y/overallNoise+currv.x/(50+idx*200), cos((frameCount+idx*100)/50)*10) - 0.5) *
        noise(frameCount/300)*yWaviness
      let accXScale = 1.2
      accv.set([
        accX * accXScale * DRAWING_SCALE,
        accY * DRAWING_SCALE
      ])
      currv.add(accv)
      this.w = (0.3 + noise(frameCount/30, idx/100) * 3) * DRAWING_SCALE
      this.h = noise((frameCount+idx*10)/30) * 12 * DRAWING_SCALE
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
      clr.setAlpha(CLR_ALPHA)
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
  if (!MOUSE_TOUCHED && (mouseX !== 0 || mouseY !== 0)) {
    MOUSE_TOUCHED = true
  }
  if (DEVICE_MOTION_SUPPORTED && !DEVICE_MOTION_TOUCHED) {
    return
  }
  let isDone = true
	particles.forEach(p => {
    p.update()
    p.draw()
    isDone = isDone && p._isDone()
  })
  if (isDone) {
    noLoop()
  }
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  // save(`defnotlikewater22-${dateTime}`)
}
