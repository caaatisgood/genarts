import { random } from "./utils"

let cwidth
let cheight
let bg = 200
let prtclStreams = []
let pillarCords
let globalCords = {}

export function setup() {
  // cwidth = windowWidth
  cwidth = 1200
  cheight = cwidth*0.6
  createCanvas(cwidth, cheight);
  background(bg);
  pillarCords = _getPillarCords()
  for (let i=0; i<1; i++) {
    prtclStreams.push(
      new ParticleStream({ idx: i })
    )
  }
  push()
    translate(width/2, height/2-80)
    drawPillar3()
  pop()
}

export function draw() {
  // background(bg)
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
