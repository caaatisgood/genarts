let clrStrs = [
  "https://coolors.co/palette/355070-6d597a-b56576-e56b6f-eaac8b",
]
let clrs
let cwidth = 700
let cheight = cwidth
let streams = []
// let pg = 0
// let deviceMotionHandler = (evt) => {
//   if (!evt?.accelerationIncludingGravity) {
//     return
//   }
//   let acc = evt.accelerationIncludingGravity
//   pg = map(acc.x, -5, 5, 0, 1, true)
// }

export function setup() {
  cheight = cwidth = min(windowWidth, windowHeight)
  // createCanvas(cwidth, cheight);

  createCanvas(windowWidth, windowHeight);
	background("#edf6f9");
  drawingContext.shadowBlur = 5;
  // drawingContext.shadowColor = 'white';
	// background(0);
  clrs = random(clrStrs).split("/").pop().split("-").map(s => "#"+s)
  let streamsAmt = 80
  for (let i = 0; i<streamsAmt; i++) {
    streams.push(
      new Stream({
        idx: i,
        // x: width/2 + noise(i*10, i) * map(noise(i/10, i), 0, 1, 0, 10),
        // y: height/2 + noise(i*20, i) * map(noise(i/10, i), 0, 1, 0, 10),
        initX: width/2 + sin(i/3)*20-30,
        initY: height/2 + cos(i/2)*20-50,
      })
    )
  }
}

class Stream {
	constructor({ idx, initX = width/2, initY = height/2 } = {}) {
		let def = {
      idx,
      pgOffset: 0,
			initX,
      initY,
      xOffsetRange: [random(0, 100), 20],
      yOffsetRange: [random(0, 100), 20],
      piRange: [0, 3.5*PI],
      xScaleRange: [70, random(130, 170)],
      yScaleRange: [70, random(130, 170)],
      clr: random(clrs),
		}
    // construct streaming cords
		Object.assign(this, def)
	}
	
	update() {}
	
	draw() {
    let {
      idx,
      pgOffset,
      initX,
      initY,
      piRange,
      xScaleRange,
      yScaleRange,
      xOffsetRange,
      yOffsetRange,
      clr,
    } = this
    let [piStart, piEnd] = piRange
    let [xScaleStart, xScaleEnd] = xScaleRange
    let [yScaleStart, yScaleEnd] = yScaleRange
    let _pg = pgOffset + pg
    push()
      let xDeg = map(_pg, 0, 1, piStart, piEnd, true)
      let xScale = map(_pg, 0, 1, xScaleStart, xScaleEnd, true)
      let _x =
        cos(xDeg) * xScale +
        (noise((1-pg)*5, idx) - 0.5) * 30
      let xOffset = lerp(...xOffsetRange, pg)
      let yOffset = lerp(...yOffsetRange, pg)
      let yDeg = map(_pg, 0, 1, piStart, piEnd, true)
      let yScale = map(_pg, 0, 1, yScaleStart, yScaleEnd, true)
      let _y = sin(yDeg) * yScale
      let x = initX + xOffset + _x
      let y = initY + yOffset + _y
      strokeWeight(0.3)
      let strkClr = color(clr)
      noStroke()
      // stroke(strkClr)
      let clr1 = color("#f94144")
      let clr2 = color("#011627")
      let _clr = lerpColor(clr1, clr2, pg)
      // let _clr = color(clr)
      _clr.setAlpha(200)
      fill(_clr)
      let sz = lerp(8, 5, pg)
      ellipse(x, y, sz)
    pop()
	}
}

export function draw() {
  if (!DEVICE_MOTION_TOUCHED) {
    return
  }
  // pg = map(cos(frameCount/100), -1, 1, 0, 1)
  let clr = color("#E9967A")
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
