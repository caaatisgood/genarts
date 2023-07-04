import './style.css';

window.setup = function setup() {
  const size = getSize()
  const canvas = createCanvas(size, size);
  canvas.parent("canvasWrapper");
}

window.draw = function draw() {
  background(250, 80);
  fill("#FFE983");
  ellipse(mouseX, mouseY, 15, 15);
}

window.windowResized = function windowResized() {
  const size = getSize()
  resizeCanvas(size, size);
}

const getSize = () => {
  return Math.min(window.innerHeight, window.innerWidth) * 0.9
}
