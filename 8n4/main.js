import './style.css';

// let startv
// let endv

let mainf = {
  top: undefined,
  left: undefined,
  bottom: undefined,
  right: undefined,
}
let leftf = {
  top: undefined,
  left: undefined,
  bottom: undefined,
  right: undefined,
}
let rightf = {
  top: undefined,
  left: undefined,
  bottom: undefined,
  right: undefined,
}
let size

const buildFrames = (_scale = 1) => {
  // vales 0-1 for scaling
  // build a 3 pieces victorian house window frame
  // main frame
  const scale = (n) => n * _scale
  let mainf = { top: undefined, left: undefined, bottom: undefined, right: undefined, }
  let mtl = createVector(scale(0.25), scale(0.33)) // main top-left
  let mtr = createVector(scale(0.75), scale(0.33)) // main top-right
  let mbl = createVector(scale(0.25), scale(0.66)) // main bottom-left
  let mbr = createVector(scale(0.75), scale(0.66)) // main bottom-right
  mainf.top = [mtl, mtr]
  mainf.right = [mtr, mbr]
  mainf.bottom = [mbl, mbr]
  mainf.left = [mtl, mbl]
  // left frame
  let leftf = { top: undefined, left: undefined, bottom: undefined, right: undefined, }
  let ltl = createVector(scale(0.1), scale(0.38)) // left frame top-left (moved up by 0.05)
  let ltr = createVector(scale(0.25), scale(0.43)) // left frame top-right
  let lbl = createVector(scale(0.1), scale(0.61)) // left frame bottom-left (moved up by 0.05)
  let lbr = createVector(scale(0.25), scale(0.66)) // left frame bottom-right
  leftf.top = [ltl, mtl]
  leftf.left = [ltl, lbl]
  leftf.bottom = [lbl, lbr]
  leftf.right = [ltr, lbr]
  // right frame
  let rightf = { top: undefined, left: undefined, bottom: undefined, right: undefined, }
  let rtl = createVector(scale(0.75), scale(0.43)) // right frame top-left
  let rtr = createVector(scale(0.9), scale(0.38)) // right frame top-right (moved up by 0.05)
  let rbl = createVector(scale(0.75), scale(0.66)) // right frame bottom-left
  let rbr = createVector(scale(0.9), scale(0.61)) // right frame bottom-right (moved up by 0.05)
  rightf.top = [mtr, rtr]
  rightf.left = [rtl, rbl]
  rightf.bottom = [rbl, rbr]
  rightf.right = [rtr, rbr]

  return { mainf, leftf, rightf }
}

let vf;

window.setup = function setup() {
  size = getSize()
  const canvas = createCanvas(size, size);
  canvas.parent("canvasWrapper");
  frameRate(7);

  vf = buildFrames(size)
}

window.draw = function draw() {
  background(250, 80);
  fill("#FFE983");
  ellipse(mouseX, mouseY, 15, 15);
  noFill()
	strokeWeight(0.6)
  let lines = 10
  for (let i = 1; i <= lines; i++) {
    let y = size * 0.1 + random(size * 0.8)
    let startv = createVector(
      random(i / lines * size * 0.5),
      y
    )
    let endv = createVector(
      size * 0.5 + random(i / lines * size * 0.5),
      y
    )
    beginShape()
      let delta = 10
      randomCords(
        [startv.x, startv.y],
        [endv.x, endv.y],
        2
      ).forEach(([x, y]) => {
        push()
          // curveVertex(x + random(-delta, delta), y + random(-delta, delta))
        pop()
      })
    endShape()
  }
  // Draw frames from vf using randomCords
  let delta = 15
  Object.values(vf).forEach(frame => {
    Object.values(frame).forEach(side => {
      let [start, end] = side;
      beginShape();
      randomCords(
        [start.x, start.y],
        [end.x, end.y],
        3  // Adjust this number for more or fewer intermediate points
      ).forEach(([x, y]) => {
        curveVertex(x + random(-delta, delta), y + random(-delta, delta));
      });
      endShape();
    });
  });

}

window.windowResized = function windowResized() {
  const size = getSize()
  resizeCanvas(size, size);
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 0.9
}

// from "city on the rooftop"
function randomCords(startCord, endCord, amt) {
	let [xStart, yStart] = startCord
	let [xEnd, yEnd] = endCord
	let cords = []
	for (let i=0; i<amt; i++) {
		let randomX, randomY
		if (abs(xStart-xEnd) > abs(yStart-yEnd)) {
			randomX = random(xStart, xEnd)
			randomY = map(randomX, xStart, xEnd, yStart, yEnd)
		} else {
			randomY = random(yStart, yEnd)
			randomX = map(randomY, yStart, yEnd, xStart, xEnd)
		}
		cords.push([randomX, randomY])
	}
	return [startCord, startCord, ...cords, endCord, endCord]
}