let bg = 33
let cwidth, cheight

export function setup() {
  pixelDensity(2)
  let cwidth = 900
  cheight = cwidth*0.5
  createCanvas(cwidth, cheight);
  background(bg);
}

export function draw() {
  push()
    translate(mouseX, mouseY)
    rotate(frameCount/5)
    rectMode(CENTER)
    noStroke()
    rect(0, 0, 20, 3)
  pop()
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  // save(`some-flow-${dateTime}`)
}
