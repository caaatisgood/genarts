import { random, round } from "./utils"

function preload() {}

function setup(p5) {
  p5.createCanvas(300, 300);
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
    // p5.save(`fado-${dateTime}`)
  }
}

export default sketch
