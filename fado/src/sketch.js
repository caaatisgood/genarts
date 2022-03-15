import { random } from "./utils"

let clr1, clr2

let cwidth
let cheight
let bg = 200
let prtclStreams = []
let pillarCords
let globalCords = {}

export function setup() {
  pixelDensity(2)
  cwidth = 900
  cheight = cwidth*0.5
  createCanvas(cwidth, cheight);
  background(bg);
  // frameRate(1)
  pillarCords = _getPillarCords()
  for (let i=0; i<1; i++) {
    prtclStreams.push(
      new ParticleStream({ idx: i })
    )
  }
  // clr1 = color("#f18f01")
  // ef6f6c
  clr1 = color("#db504a")
  clr2 = color("#006e90")
  // clr1 = color("#ef6f6c")
  // clr2 = color("#465775")
  // clr1 = color("#e76f51")
  // clr2 = color("#2a9d8f")
  // clr1 = color("#1dbde6")
  // clr2 = color("#f1515e")
  clr1 = color("#2a9d8f")
  clr2 = color("#0d3b66")
}

export function draw() {
  background(bg)
  push()
    translate(width/2, height/2-80)
    // drawPillar3()
  pop()
  push()
    translate(width/2, height/2)
    let layers = 13
    for (let layer=0; layer<layers; layer++) {
      let margin = 1
      let baseY = lerp(-height/2*margin, height/2*margin, (layer+1)/(layers+1))
      let threads = 3 + layer * 3
      let layerPg = layer/layers
      for (let i = 0; i < threads; i++) {
        let pg = 0
        let ticks = 500
        while (pg < 1) {
          let tick = pg * ticks
          let x = lerp(-width/2*1.05, width/2*1.05, pg)
          let noiseVol = lerp(133, 466, layerPg)
          let startNoise = noise(
            (layer*30+tick+lerp(200, 0, pg))/150,
            i/20,
            frameCount/20,
          )
          let yStart = (startNoise - 0.5) * noiseVol
          let endNoise = noise((layer*30+tick)/150, i/40, frameCount/40)
          // let endNoise = sin((layer*20+tick)/150+i/40, frameCount/40)
          let yEnd = (endNoise - 0.5) * noiseVol
          let xOffset = lerp(-10, 20, layerPg)
          let clr = lerpColor(clr1, clr2, layerPg)
          clr.setAlpha(40)
          stroke(clr)
          strokeWeight(0.3)
          line(
            x, baseY + yStart,
            x+xOffset, baseY + yEnd,
          )
          pg+=1/ticks
        }
      }
    }
  pop()
  // push()
  //   translate(width/2, height/2-80)
  //   drawPillar3()
  //   prtclStreams.forEach((p) => {
  //     p.update()
  //     p.draw()
  //   })
  // pop()
  // noLoop()
}

const _getPillarCords = () => {
  let leftX = -40
  let midX = 10
  let rightX = 30
  return {
    leftX,
    midX,
    rightX,
    vTopLeft: createVector(leftX, -20),
    vBottomLeft: createVector(leftX, 230),
    vTopMid: createVector(midX, -35),
    vBottomMid: createVector(midX, 250),
    vTopRight: createVector(rightX, -12),
    vBottomRight: createVector(rightX, 220),
  }
}

const drawPillar3 = () => {
  // x-axis: -35, 10, 35
  const {
    leftX,
    midX,
    rightX,
    vTopLeft,
    vBottomLeft,
    vTopMid,
    vBottomMid,
    vTopRight,
    vBottomRight,
  } = pillarCords
  // left side: 10 -> -35
  drawWall({
    key: 'wallLeft',
    xStart: midX, xEnd: leftX,
    yStartMin: vTopMid.y, yStartMax: vBottomMid.y,
    yEndMin: vTopLeft.y, yEndMax: vBottomLeft.y,
  })
  // right side: 10 -> 35
  drawWall({
    key: 'wallRight',
    xStart: midX, xEnd: rightX,
    yStartMin: vTopMid.y, yStartMax: vBottomMid.y,
    yEndMin: vTopRight.y, yEndMax: vBottomRight.y,
  })
  // borders
  strokeWeight(0.6)
  drawWallBorder({
    key: 'wallBorderLeft',
    vStart: vTopLeft,
    vEnd: vBottomLeft.copy().sub(0, 4),
    threads: 10
  })
  strokeWeight(1)
  drawWallBorder({
    key: 'wallBorderMid',
    vStart: vTopMid,
    vEnd: vBottomMid.copy().sub(0, 4),
    threads: 10
  })
  strokeWeight(0.3)
  drawWallBorder({
    key: 'wallBorderRight',
    vStart: vTopRight,
    vEnd: vBottomRight.copy().sub(0, 4),
    threads: 10
  })
  
  function drawWallBorder({ key, vStart, vEnd, threads }) {
    // {
    //    key: [] /* cords */
    // }
    if (!globalCords[key]) {
      globalCords[key] = []
      globalCords[key] = generateSketchyLineCords(vStart, vEnd, threads)
    }
    globalCords[key].forEach(cord => {
      line(...cord)
    })
  }

  function drawWall({
    key,
    xStart, xEnd,
    yStartMin, yStartMax,
    yEndMin, yEndMax
  }) {
    // {
    //   key: [
    //     { clr, cords: [] /* generated cords */ },
    //     { clr, cords: [] },
    //   ],
    // }
    if (!globalCords[key]) {
      globalCords[key] = []
      let ypg = 0.01 // y progress, 0 -> 1
      let yStep = 0.008
      while (ypg < 1) {
        let yStart = lerp(yStartMin, yStartMax, ypg)
        let yEnd = lerp(yEndMin, yEndMax, ypg)
        // push()
        let clr = color("black")
        clr.setAlpha(lerp(255, 190, ypg))
        stroke(clr)
        globalCords[key].push({
          clr,
          cords: generateSketchyLineCords(
            createVector(xStart, yStart),
            createVector(xEnd, yEnd),
            7
          )
        })
        // pop()
        ypg += yStep
        yStep *= (1.03 * 1.03)
      }
    }
    globalCords[key].forEach(({ clr, cords }) => {
      cords.forEach(cord => {
        push()
          line(...cord)
        pop()
      })
    })
  }
}

const randomVec = (va, vb) => {
  // kinda edge case
  if (va.x === vb.x) {
    let x = va.x
    return createVector(x, random(va.y, vb.y))
  } else if (va.y === vb.y) {
    let y = va.y
    return createVector(random(va.x, vb.x), y)
  }
  // general case
  const x = random(va.x, vb.x)
  const y = map(x, va.x, vb.x, va.y, vb.y)
  return createVector(x, y)
}

const generateSketchyLineCords = (va, vb, threads = 10) => {
  let cords = []
  for (let i=0; i<threads; i++) {
    let startv = randomVec(va, vb)
    let endv = randomVec(va, vb)
    cords.push([
      startv.x+random(-3, 3),
      startv.y+random(-3, 3),
      endv.x+random(-3, 3),
      endv.y+random(-3, 3),
    ])
  }
  return cords
}

class ParticleStream {
  constructor({ idx }) {
    let def = {
      idx,
      initx: 35,
      inity: idx*10,
      prtcls: [],
      direction: 'to-left',
      clockwise: true,
    }
    Object.assign(this, def)
  }
  
  update() {
    let particleMax = 50
    if (this.prtcls.length === particleMax) {
      this.prtcls.pop()
    }
    this.prtcls.forEach((prtcl, index) => {
      // let deltax = 1 + (noise(frameCount/50, this.idx, index + 10) - 0.5) * 10
      // let deltay = 1 + (noise(frameCount/50, this.idx, index + 100) - 0.5) * 10
      let x = sin((frameCount+index)/150)
      let y = -cos((frameCount+index)/150)
      let yNoise = (noise(frameCount/100 + index/10) - 0.5)*2
      prtcl.v.set(x, y + yNoise)
      // prtcl.v.add([deltax, deltay])
    })
    if (this.prtcls.length < particleMax) {
      this.prtcls.unshift({
        randSeed: random(0, 50),
        v: createVector(this.initx, this.inity)
      })
    }
  }
  
  draw() {
    push()
      noStroke()
      ellipseMode(CENTER)
      let clr = color("darkblue")
      clr.setAlpha(100)
      fill(clr)
      this.prtcls.forEach((p) => {
        let x = p.v.x*100
        let y = p.v.y*20
        if (this.direction === 'to-left' && this.clockwise) {
          if (p.v.y < 0 && x > pillarCords.leftX && x < pillarCords.rightX) {
            return
          }
        }
        ellipse(x, y, 3)
      })
    pop()
    push()
    // this.prtcls.forEach((prtcl) => {
    // 	fill("black")
    // 	fill("white")
    // 	noStroke()
    // 	rect(295, 285, 55, 40)
    // 	fill("black")
    // 	text(
    // 		`x: ${prtcl.v.x.toFixed(1)}`,
    // 		300,
    // 		300
    // 	)
    // 	text(
    // 		`y: ${prtcl.v.y.toFixed(1)}`,
    // 		300,
    // 		320
    // 	)
    // })
    pop()
  }
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  save(`some-flow-${dateTime}`)
}
