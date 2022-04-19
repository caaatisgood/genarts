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

function setup(p5) {

  // define particle
  class Particle {
    constructor({ idx, initX, initY, clr } = {}) {
      let currv = p5.createVector(initX, initY)
      let accv = p5.createVector(1, 0)
      let def = {
        idx,
        currv,
        accv,
        w: 0,
        h: 0,
        rot: 0,
        clr,
        flashy: p5.random() < 0.66,
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
      if (flashy && (p5.frameCount % 3) === 0) {
        if (on && p5.random() > 0.6) {
          this.on = false
        } else if (!on && p5.random() > 0.3) {
          this.on = true
        }
      }

      if (currv.x > p5.width) {
        currv.set([0, currv.y])
      } else if (currv.x < 0) {
        currv.set([p5.width, currv.y])
      } else if (currv.y > p5.height) {
        currv.set([currv.x, 0])
      } else if (currv.y < 0) {
        currv.set([currv.x, p5.height])
      } else {
        let xBaseSpeed =
          p5.frameCount > 20 && MOUSE_TOUCHED
            ? p5.map(p5.mouseX, 0, p5.width, -0.5, 0.6)
            : 0.2
        let accX =
          xBaseSpeed + p5.sin((p5.frameCount+idx)/40)/2 +
          p5.noise(currv.x, p5.sin((p5.frameCount+idx*10)/50)) * 2
        let overallNoise = this.overallNoise

        let yWaviness =
          MOUSE_TOUCHED
            ? p5.map((p5.mouseY - p5.height / 2)/p5.height, -0.5, 0.5, -40, 40)
            : p5.noise(p5.frameCount/80) * 10
        let accY =
          p5.sin((p5.frameCount+idx)/1)*0.5 +
          (p5.noise(currv.y/overallNoise+currv.x/(50+idx*200), p5.cos((p5.frameCount+idx*100)/50)*10) - 0.5) *
          p5.noise(p5.frameCount/300)*yWaviness
        let accXScale = 1.2
        accv.set([
          accX * accXScale * DRAWING_SCALE,
          accY * DRAWING_SCALE
        ])
        currv.add(accv)
        this.w = (0.3 + p5.noise(p5.frameCount/30, idx/100) * 3) * DRAWING_SCALE
        this.h = p5.noise((p5.frameCount+idx*10)/30) * 12 * DRAWING_SCALE
        this.rot = p5.sin((idx+currv.y)/30)*p5.PI*2 + p5.noise((idx+currv.y)/20)*p5.PI*3
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
      p5.push()
        let [x, y] = this._applyPadding(currv.x, currv.y)
        p5.translate(x, y)
        p5.noStroke()
        clr.setAlpha(CLR_ALPHA)
        p5.fill(clr)
        p5.rectMode(p5.CENTER)
        p5.rotate(rot)
        p5.rect(0, 0, w, h)
        p5.pop()
    }

    _isDone() {
      return this.currv.x > p5.width
    }

    _applyPadding(x, y) {
      let wPadding = 0.07
      let hPadding = 0.05
      return [
        p5.width * wPadding + x * (1-wPadding*2),
        p5.height * hPadding + y * (1-hPadding*2),
      ]
    }
  }

  // main setup
  p5.randomSeed(4222022)
  p5.noiseSeed(4222022)
  p5.pixelDensity(4)
  let ASPECT_RATIO = 0.77 // 0.77 : 1 (w:h)
  if (p5.windowWidth / p5.windowHeight > ASPECT_RATIO) {
    cheight = p5.windowHeight
    cwidth = cheight * ASPECT_RATIO
  } else {
    cwidth = p5.windowWidth
    cheight = p5.windowHeight / ASPECT_RATIO
  }
  DRAWING_SCALE = cheight / 1000
  p5.createCanvas(cwidth, cheight);
  let particlesAmt = 150
  let [clr1, clr2, bg, clrAlpha] = p5.random(clrs)
  CLR_ALPHA = clrAlpha
	p5.background(bg);
  let _clr1 = p5.color(clr1)
  let _clr2 = p5.color(clr2)
  for (let i = 0; i<particlesAmt; i++) {
    let ypg = p5.random(0, 1)
    let clr = p5.lerpColor(_clr1, _clr2, ypg)
    particles.push(
      new Particle({
        idx: i,
        initX: 0,
        initY: ypg * p5.height,
        clr,
      })
    )
  }
}

function draw(p5) {
  if (!MOUSE_TOUCHED && (p5.mouseX !== 0 || p5.mouseY !== 0)) {
    MOUSE_TOUCHED = true
  }
  if (window.DEVICE_MOTION_SUPPORTED && !window.DEVICE_MOTION_TOUCHED) {
    return
  }
  let isDone = true
	particles.forEach(p => {
    p.update()
    p.draw()
    isDone = isDone && p._isDone()
  })
  if (isDone) {
    p5.noLoop()
  }
}

const sketch = (p5) => {
  p5.setup = () => setup(p5)
  p5.draw = () => draw(p5)
  p5.mousePressed = () => {
    const dateTime = (
      new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
    ).split(" ").join("-")
    // save(`defnotlikewater22-${dateTime}`)
  }
}

export default sketch
