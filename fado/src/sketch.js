import { random, round } from "./utils"

let cwidth = 900
let cheight = cwidth*0.6
let bg = 200
let prtclStreams = []
let pillarCords
let globalCords = {}

let generateSketchyLineCords, randomVec

function preload() {}

function setup(p5) {
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
        let x = p5.sin((p5.frameCount+index)/150)
        let y = -p5.cos((p5.frameCount+index)/150)
        let yNoise = (p5.noise(p5.frameCount/100 + index/10) - 0.5)*2
        prtcl.v.set(x, y + yNoise)
        // prtcl.v.add([deltax, deltay])
      })
      if (this.prtcls.length < particleMax) {
        this.prtcls.unshift({
          randSeed: p5.random(0, 50),
          v: p5.createVector(this.initx, this.inity)
        })
      }
    }
    
    draw() {
      p5.push()
        p5.noStroke()
        p5.ellipseMode(p5.CENTER)
        let clr = p5.color("darkblue")
        clr.setAlpha(100)
        p5.fill(clr)
        this.prtcls.forEach((p) => {
          let x = p.v.x*100
          let y = p.v.y*20
          if (this.direction === 'to-left' && this.clockwise) {
            if (p.v.y < 0 && x > pillarCords.leftX && x < pillarCords.rightX) {
              return
            }
          }
          p5.ellipse(x, y, 3)
        })
      p5.pop()
      p5.push()
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
      p5.pop()
    }
  }

  p5.createCanvas(cwidth, cheight);
  p5.background(bg);
  pillarCords = _getPillarCords(p5)
  for (let i=0; i<1; i++) {
    prtclStreams.push(
      new ParticleStream({ idx: i })
    )
  }

  randomVec = (va, vb) => {
    // kinda edge case
    if (va.x === vb.x) {
      let x = va.x
      return p5.createVector(x, p5.random(va.y, vb.y))
    } else if (va.y === vb.y) {
      let y = va.y
      return p5.createVector(p5.random(va.x, vb.x), y)
    }
    // general case
    const x = p5.random(va.x, vb.x)
    const y = p5.map(x, va.x, vb.x, va.y, vb.y)
    return p5.createVector(x, y)
  }

  generateSketchyLineCords = (va, vb, threads = 10) => {
    let cords = []
    for (let i=0; i<threads; i++) {
      let startv = randomVec(va, vb)
      let endv = randomVec(va, vb)
      cords.push([
        startv.x+p5.random(-3, 3),
        startv.y+p5.random(-3, 3),
        endv.x+p5.random(-3, 3),
        endv.y+p5.random(-3, 3),
      ])
    }
    return cords
  }
}

function draw(p5) {
  p5.background(bg)
  // noLoop()
  // drawBg()
  p5.push()
    p5.translate(p5.width/2, p5.height/2-80)
    // drawPillar1()
    // drawPillar2()
    drawPillar3(p5)
    prtclStreams.forEach((p) => {
      p.update()
      p.draw()
    })
  p5.pop()
}

const _getPillarCords = (p5) => {
	let leftX = -40
	let midX = 10
	let rightX = 30
	return {
		leftX,
		midX,
		rightX,
		vTopLeft: p5.createVector(leftX, -20),
		vBottomLeft: p5.createVector(leftX, 230),
		vTopMid: p5.createVector(midX, -35),
		vBottomMid: p5.createVector(midX, 250),
		vTopRight: p5.createVector(rightX, -12),
		vBottomRight: p5.createVector(rightX, 220),
	}
}

const drawPillar3 = (p5) => {
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
    p5,
    key: 'wallLeft',
    xStart: midX, xEnd: leftX,
    yStartMin: vTopMid.y, yStartMax: vBottomMid.y,
    yEndMin: vTopLeft.y, yEndMax: vBottomLeft.y,
  })
  // right side: 10 -> 35
  drawWall({
    p5,
    key: 'wallRight',
    xStart: midX, xEnd: rightX,
    yStartMin: vTopMid.y, yStartMax: vBottomMid.y,
    yEndMin: vTopRight.y, yEndMax: vBottomRight.y,
  })
  // borders
  p5.strokeWeight(0.6)
  drawWallBorder({
    key: 'wallBorderLeft',
    vStart: vTopLeft,
    vEnd: vBottomLeft.copy().sub(0, 4),
    threads: 10
  })
  p5.strokeWeight(1)
  drawWallBorder({
    key: 'wallBorderMid',
    vStart: vTopMid,
    vEnd: vBottomMid.copy().sub(0, 4),
    threads: 10
  })
  p5.strokeWeight(0.3)
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
      p5.line(...cord)
    })
  }

  function drawWall({
    p5,
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
        let yStart = p5.lerp(yStartMin, yStartMax, ypg)
        let yEnd = p5.lerp(yEndMin, yEndMax, ypg)
        // push()
        let clr = p5.color("black")
        clr.setAlpha(p5.lerp(255, 190, ypg))
        p5.stroke(clr)
        globalCords[key].push({
          clr,
          cords: generateSketchyLineCords(
            p5.createVector(xStart, yStart),
            p5.createVector(xEnd, yEnd),
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
        p5.push()
          p5.line(...cord)
        p5.pop()
      })
    })
  }
}

const sketch = (p5) => {
  p5.preload = () => preload(p5)
  p5.setup = () => setup(p5)
  p5.draw = () => draw(p5)
  p5.mousePressed = () => {
    const dateTime = (
      new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
    ).split(" ").join("-")
    // p5.save(`fado-${dateTime}`)
  }
}

export default sketch
