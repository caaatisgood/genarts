import { random, round } from "./utils"

const MAX_CSIZE = 1200
const MAX_PARTICLE_AMOUNT = 10000
const MAX_ROTATION = 450
const MAX_MIND_OFFSET = 45
const MAX_START_NOISE = 50
const COLOR_SETS = {
  LIGHT: { bg: "#eee", mind: "#1B1C1D" },
  DARK: { bg: "#1B1C1D", mind: "#f8f9fa" },
}
let dark
let clrs
let pAmount
let initialRotationOffset
let rotationBase
let rotationDirection
let mindOffsetBase
let lineAlphaRange
let maxStartNoise
let yoffset

let $feat

function genFeatures() {
  let dark = random() < 0.5
  let features = {
    dark,
    thready: random() < 0.5,
    // 0~1 -> 100~133, 350~450
    rotation: round(random(0.778, 1)),
    // 0~1 -> 2800~3200, 8000~10000
    mindStability: round(random(0.8, 1)),
    // 0~1 -> 15~20, 29~45,
    mindOffset: round(random(0.64, 1)),
  }
  let isSpecialType = random() < 0.1
  if (isSpecialType) {
    features = {
      ...features,
      rotation: round(random(0.15, 0.2)),
      mindStability: round(random(0.15, 0.2)),
      mindOffset: round(random(0.4, 0.5)),
    }
  }
  return features
}

function preload() {
  window.$fxhashFeatures = $feat = genFeatures()
}

function setup(p5) {
  let csize = p5.min(p5.windowWidth, p5.windowHeight, MAX_CSIZE)
  p5.createCanvas(csize, csize);
  p5.pixelDensity(2)
  p5.noiseSeed(random())

  let thready = $feat.thready
  dark = $feat.dark
  clrs = $feat.dark ? COLOR_SETS.DARK : COLOR_SETS.LIGHT
  pAmount = $feat.mindStability * MAX_PARTICLE_AMOUNT
  rotationBase = $feat.rotation * MAX_ROTATION
  
  mindOffsetBase = $feat.mindOffset * MAX_MIND_OFFSET
  lineAlphaRange = dark
    ? thready
      ? [30, 100]
      : [15, 50]
    : thready
      ? random([[60, 70], [100, 40]])
      : [50, 20]
  rotationDirection = random([-1, 1])
  initialRotationOffset = random(p5.PI*2)
  yoffset = csize * random(0.34, 0.42)
  let [yOffStart, yOffEnd] = [
    yoffset,
    yoffset*round(random(0.13, 0.18)),
  ]
  maxStartNoise = random(0, MAX_START_NOISE)

  p5.background(clrs.bg);
  p5.translate(p5.width/2, p5.height/2)

  for (let i = 0; i < 10; i++) {
    for (let p = 1; p < pAmount; p++) {
      let pg = p/pAmount
      p5.push()
        p5.rotate((initialRotationOffset + i/mindOffsetBase + p/rotationBase)*rotationDirection)
        let yoffset = -p5.lerp(yOffStart, yOffEnd ,pg)
        let noiseVol = csize * p5.map(p, 1, pAmount, 0.45, 0.02)
        let startNoise = p5.noise(
          (p+p5.lerp(maxStartNoise, 0, pg))/150,
          i/40
        )
        let yStart = (startNoise - 0.5) * noiseVol
        let endNoise = p5.noise(p/150, i/60)
        let yEnd = (endNoise - 0.5) * noiseVol
        drawLine({ yStart, yEnd, yoffset, pg, alphaRange: lineAlphaRange })
        drawSand({ yStart, yEnd, yoffset, pg })
      p5.pop()
    }
  }

  function drawLine({ yStart, yEnd, yoffset, pg, alphaRange }) {
    p5.push()
      let minStrokeWeight = 0.1 * csize/MAX_CSIZE
      let maxStrokeWeight = 0.5 * csize/MAX_CSIZE
      let strokew = p5.lerp(minStrokeWeight, maxStrokeWeight, pg)

      let clr = p5.color(clrs.mind)
      let [alphaStart, alphaEnd] = alphaRange
      clr.setAlpha(p5.lerp(alphaStart, alphaEnd, pg))
      p5.strokeWeight(strokew)
      p5.stroke(clr)
      p5.line(
        0, yoffset + yStart,
        0, yoffset + yEnd
      )
    p5.pop()
  }

  function drawSand({ yStart, yEnd, yoffset, pg }) {
    p5.push()
      let minStrokeWeight = 0.5 * csize/MAX_CSIZE
      let maxStrokeWeight = 4.5 * csize/MAX_CSIZE
      let strokew = p5.lerp(maxStrokeWeight, minStrokeWeight, pg)
      p5.noStroke()
      let sandClr
      if (random() < 0.002) {
        sandClr = p5.color(clrs.mind)
        sandClr.setAlpha(
          thready
            ? p5.lerp(90, 120, pg)
            : p5.lerp(45, 90, pg)
        )
        p5.fill(sandClr)
        p5.ellipse(
          0,
          yoffset + random(yStart*0.9, yEnd*1.1),
          strokew*0.8,
        )
      } else {
        sandClr = p5.color(clrs.mind)
        sandClr.setAlpha(
          thready
            ? p5.lerp(7, 70, pg)
            : p5.lerp(4, 45, pg)
        )
        p5.fill(sandClr)
        p5.ellipse(
          random(yoffset * -0.3, yoffset * 0.3),
          yoffset + random(yStart*0.66, yEnd*1.2),
          strokew,
        )
        p5.push()
          p5.noStroke()
          // let clr = p5.color("red")
          // clr.setAlpha(255)
          p5.fill("red")
          p5.ellipse(yoffset, yoffset + yStart, 0.4)
          p5.fill("blue")
          p5.ellipse(yoffset, yoffset + yEnd, 0.4)
        p5.pop()
      }
    p5.pop()
  }
  p5.noLoop()
  fxpreview()
}

function draw() {}

const sketch = (p5) => {
  p5.preload = () => preload(p5)
  p5.setup = () => setup(p5)
  p5.draw = () => draw(p5)
  p5.mousePressed = () => {
    const dateTime = (
      new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
    ).split(" ").join("-")
    // p5.save(`mind-spa-${dateTime}`)
  }
}

export default sketch
