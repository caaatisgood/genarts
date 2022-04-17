let clrStrs = [
  "https://coolors.co/palette/355070-6d597a-b56576-e56b6f-eaac8b",
]
let clrs
let cwidth = 700
let cheight = cwidth
let streams = []
let pg = 0
let bg = "#edf6f9"
bg = "#000"
	
/*
------------------------------------------------------------
0                  [-------------]
1                [-------------]
2              [-------------]
3            [-------------]
4          [-------------]
5        [-------------]
6      [-------------]
7    [-------------]
8  [-------------]
9...
*/

export function setup() {
  cheight = cwidth = min(windowWidth, windowHeight)
  createCanvas(windowWidth, windowHeight);
	background(bg);
  drawingContext.shadowBlur = 5;
  clrs = random(clrStrs).split("/").pop().split("-").map(s => "#"+s)
  let streamsAmt = 30
  for (let i = 0; i<streamsAmt; i++) {
    streams.push(
      new Stream({
        idx: i,
        // x: width/2 + noise(i*10, i) * map(noise(i/10, i), 0, 1, 0, 10),
        // y: height/2 + noise(i*20, i) * map(noise(i/10, i), 0, 1, 0, 10),
        particleConfig: {
          initX: width/2 + sin(i/3)*10-30,
          initY: height/2 + cos(i/2)*10-50,
        },
      })
    )
  }
}

const STREAM_LENGTH = 15 // particle amount
class Stream {
  constructor({ idx, particleConfig } = {}) {
    let particles = []
    for (let i = 0; i < STREAM_LENGTH; i++) {
      let pgOffset = i/(STREAM_LENGTH-1) // 0~1
      particles.push(
        new Particle({
          streamIdx: idx,
          pgOffset,
          idx: i,
          ...particleConfig
        })
      )
    }
    let def = {
      idx,
      particles,
    }
    Object.assign(this, def)
  }

  draw() {
    this.particles.forEach((p) => {
      p.draw()
    })
  }
}

let PARTICLE_RANGE_LENGTH = 0.3 // 0~n
let PARTICLE_PG_OFFSET_SCALE = 0.3
class Particle {
	constructor({ streamIdx, idx, pgOffset, initX = width/2, initY = height/2 } = {}) {
    // pgRange: pgOffset + [fixed range]
    let pgRangeOffset = pgOffset * PARTICLE_PG_OFFSET_SCALE
    // [start, end]
    let pgRange = [
      pgRangeOffset,
      pgRangeOffset + PARTICLE_RANGE_LENGTH
    ]
    let offsetBase = 0 + streamIdx/10*0
		let def = {
      streamIdx,
      idx,
      pgRange,
			initX,
      initY,
      yOffsetRange: [offsetBase, offsetBase],
      xOffsetRange: [offsetBase, offsetBase],
      piRange: [0, 4*PI],
      xScaleRange: [200, 300],
      yScaleRange: [200, 300],
      clr: random(clrs),
		}
		Object.assign(this, def)
	}

	draw() {
    let {
      streamIdx,
      idx,
      pgRange,
      initX,
      initY,
      piRange,
      xScaleRange,
      yScaleRange,
      xOffsetRange,
      yOffsetRange,
      clr,
    } = this
    let selfPg = lerp(...pgRange, pg)
    let [piStart, piEnd] = piRange
    let [xScaleStart, xScaleEnd] = xScaleRange
    let [yScaleStart, yScaleEnd] = yScaleRange
    push()
      let noiseScale = 130
      noiseScale = map(pg, 0, 1, 200, 800)
      let xDeg = map(selfPg, 0, 1, piStart, piEnd, true)
      let xScale = map(selfPg, 0, 1, xScaleStart, xScaleEnd, true)
      let _x =
        cos(xDeg) * xScale +
        (noise((1-selfPg)*5/5, streamIdx * 0.1) - 0.5) * noiseScale
      let yDeg = map(selfPg, 0, 1, piStart, piEnd, true)
      let yScale = map(selfPg, 0, 1, yScaleStart, yScaleEnd, true)
      let _y =
        sin(yDeg) * yScale +
        (noise((1-selfPg)*10/5, streamIdx * 0.1) - 0.5) * noiseScale
      let xOffset = lerp(...xOffsetRange, selfPg)
      let yOffset = lerp(...yOffsetRange, selfPg)
      if (streamIdx === 0) {
        // console.log(yOffset)
      }
      let x = initX + xOffset + _x
      let y = initY + yOffset + _y
      // strokeWeight(0.3)
      let strkClr = color(clr)
      // stroke(strkClr)
      noStroke()
      push()
        translate(x, y)
        let clr1 = color("#f94144")
        let clr2 = color("#011627")
        let _clr = lerpColor(clr1, clr2, selfPg)
        _clr.setAlpha(150)
        fill(_clr)
        rotate(xDeg + PI/2 * 0.9 + noise(yDeg/3+streamIdx/10)/3)
        let w = 30 + noise(selfPg + streamIdx * 2) * 50
        let h = lerp(4, 2, selfPg) + noise(xDeg, idx*3)*8
        rectMode(CENTER)
        rect(0, 0, w, h, 5)
        // ellipse(0, 0, h*2)
      pop()
    pop()
	}
}

export function draw() {
  // noLoop()
	background(bg);
  pg = PG
  if (DEVICE_MOTION_SUPPORTED && !DEVICE_MOTION_TOUCHED) {
    return
  } else {
    // pg = map(mouseX, 0, width, 0, 1)
    pg = map(cos(frameCount/100), -1, 1, 0, 1)
  }
	streams.forEach(p => {
    p.draw()
  })
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  // save(`defnotlikewater22-${dateTime}`)
}

// const subscribeDeviceMotion = (handler) => {
//   if (typeof DeviceMotionEvent.requestPermission === "function") {
//     DeviceMotionEvent.requestPermission()
//       .then((permissionState) => {
//         alert(`> permissionState: ${permissionState}`);
//         if (permissionState === "granted") {
//           window.addEventListener("devicemotion", handler, true);
//         }
//       })
//       .catch(err => {
//         alert(err)
//       });
//   } else {
//     alert(`DeviceMotion is not supported on this device 😢`);
//   }
// }

// const unsubscribeDeviceMotion = (handler) => {
//   window.removeEventListener("devicemotion", handler);
// }
