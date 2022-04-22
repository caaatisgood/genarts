let clrs = [
  // [clr1, clr2, bg, bgOfPageBody, clrAlpha]
  // morning
  ["#31572c", "#00a8e8", "#dfe7ea", "#edf6f9", 70],
  // sunset
  ["#e76f51", "#6d597a", "#ccb7ae", "#d3c0b9", 50],
  // night
  ["#d9ed92", "#db3a34", "#02040f", "#0A0C17", 40],
]
let particles = []
let DRAWING_SCALE
let MOUSE_TOUCHED = false
let CLR_ALPHA
let IS_DONE = false

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
        let [xBaseSpeedStart, xBaseSpeedEnd] = [-0.5, 0.5]
        let xBaseSpeed =
        p5.frameCount > 15 && window.__devicemotion.enabled
          ? p5.map(p5.rotationY, -50, 50, xBaseSpeedStart, xBaseSpeedEnd, true) // deg: -50~50
          : MOUSE_TOUCHED
          ? p5.map(p5.mouseX, 0, p5.width, xBaseSpeedStart, xBaseSpeedEnd, true)
          : 0.2
        let accX =
          xBaseSpeed + p5.sin((p5.frameCount+idx)/40)/2 +
          p5.noise(currv.x, p5.sin((p5.frameCount+idx*10)/50)) * 1.7
        let overallNoise = this.overallNoise

        let [yWavinessStart, yWavinessEnd] = [-55, 55]
        let yWaviness =
          window.__devicemotion.enabled
            ? p5.map(p5.rotationX, -45, 45, yWavinessStart, yWavinessEnd, true) // deg: -45~45
            : MOUSE_TOUCHED
            ? p5.map((p5.mouseY - p5.height / 2)/p5.height, -0.5, 0.5, yWavinessStart, yWavinessEnd, true)
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
  p5.noiseSeed(4222022)
  p5.pixelDensity(5)
  let ASPECT_RATIO = 0.77 // 0.77 : 1 (w:h)
  let cwidth, cheight
  if (p5.windowWidth / p5.windowHeight > ASPECT_RATIO) {
    cheight = p5.windowHeight
    cwidth = cheight * ASPECT_RATIO
  } else {
    cwidth = p5.windowWidth
    cheight = p5.windowHeight / ASPECT_RATIO
  }
  DRAWING_SCALE = cheight / 1000
  let particlesAmt = 120
  // let [clr1, clr2, bg, bodyBg, clrAlpha] = p5.random(clrs)
  let hour = new Date().getHours()
  // 06 ~ 14 morning
  // 14 ~ 22 evening
  // 22 ~ 06 night
  let [clr1, clr2, bg, bodyBg, clrAlpha] = 6 <= hour && hour < 14
    ? clrs[0]
    : 14 <= hour && hour < 22
    ? clrs[1]
    : clrs[2]
  document.body.style.backgroundColor = bodyBg
  p5.createCanvas(cwidth, cheight);
  p5.pixelDensity(4);
  p5.background(bg);
  CLR_ALPHA = clrAlpha
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
  let isDone = true
	particles.forEach(p => {
    p.update()
    p.draw()
    isDone = isDone && p._isDone()
  })
  if (isDone) {
    IS_DONE = true
    p5.noLoop()
  }
}

const sketch = (p5) => {
  p5.setup = () => setup(p5)
  p5.draw = () => draw(p5)
  p5.mousePressed = () => {
    if (!IS_DONE) {
      return
    }
    const dateTime = (
      new Date().toISOString().substring(0, 10).replace(/\-/g, "") + "-" + new Date().toLocaleTimeString().replace(/\:/g, "-")
    )
    p5.save(`world-in-our-hands-${dateTime}`)
  }
}

export default sketch
