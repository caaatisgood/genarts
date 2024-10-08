import './style.css';

let size;
let vf;
let easycam;
let isDragging = false;

const buildFrames = (_scale = 1) => {
  // values 0-1 for scaling
  // build a 3 pieces victorian house window frame in 3D
  const scale = (n) => n * _scale;
  let mainf = { top: [], left: [], bottom: [], right: [] };
  let leftf = { top: [], left: [], bottom: [], right: [] };
  let rightf = { top: [], left: [], bottom: [], right: [] };
  let depth = 0.1

  // Main frame
  let mtl = createVector(scale(0.25), scale(0.33), 0); // main top-left
  let mtr = createVector(scale(0.75), scale(0.33), 0); // main top-right
  let mbl = createVector(scale(0.25), scale(0.66), 0); // main bottom-left
  let mbr = createVector(scale(0.75), scale(0.66), 0); // main bottom-right
  mainf.top = [mtl, mtr];
  mainf.right = [mtr, mbr];
  mainf.bottom = [mbl, mbr];
  mainf.left = [mtl, mbl];

  // Left frame
  let ltl = createVector(scale(0.1), scale(0.38), scale(depth)); // left frame top-left
  let ltr = createVector(scale(0.25), scale(0.43), scale(depth)); // left frame top-right
  let lbl = createVector(scale(0.1), scale(0.61), scale(depth)); // left frame bottom-left
  let lbr = createVector(scale(0.25), scale(0.66), scale(depth)); // left frame bottom-right
  leftf.top = [ltl, mtl];
  leftf.left = [ltl, lbl];
  leftf.bottom = [lbl, lbr];
  leftf.right = [ltr, lbr];

  // Right frame
  let rtl = createVector(scale(0.75), scale(0.33), scale(depth)); // right frame top-left
  let rtr = createVector(scale(0.9), scale(0.38), scale(depth)); // right frame top-right
  let rbl = createVector(scale(0.75), scale(0.56), scale(depth)); // right frame bottom-left
  let rbr = createVector(scale(0.9), scale(0.61), scale(depth)); // right frame bottom-right
  rightf.bottom = [mbr, rbr];
  rightf.right = [rbr, rtr];
  rightf.top = [rtr, rtl];
  rightf.left = [rtl, rbl];

  return { mainf, leftf, rightf };
}

let frameOffset

window.setup = function setup() {
  let [w, h] = getSize();
  const canvas = createCanvas(w, h, WEBGL);
  canvas.parent("canvasWrapper");
  frameRate(20);
  
  // Create EasyCam instance
  easycam = new Dw.EasyCam(this._renderer, {distance: 500, center: [0, 0, 0]});
  // Disable right-click context menu on the canvas
  document.oncontextmenu = function() { return false; }
  
  const frameScale = 500;
  frameOffset = frameScale / 2;
  vf = buildFrames(frameScale);

  // Add mouse event listeners
  canvas.mousePressed(startDrag);
  canvas.mouseReleased(endDrag);
}

window.draw = function draw() {
  background(250, 225);
  
  // Draw XYZ axis debugger
  push()
    // drawAxisDebugger();
  pop()
  
  // Set up lighting
  ambientLight(60, 60, 60);
  pointLight(255, 255, 255, 0, 0, 100);
  
  // Update camera if dragging
  // if (isDragging) {
  //   let dx = mouseX - pmouseX;
  //   let dy = mouseY - pmouseY;
  //   easycam.rotateY(-dx * 0.01);
  //   easycam.rotateX(-dy * 0.01);
  // }
  
  // Auto rotate slowly
  easycam.rotateY(0.02);
  easycam.rotateX(0.015);
  
  // Draw frames from vf using custom 3D drawing function
  push();
  translate(-frameOffset, -frameOffset, 0); // Center the frame
  Object.values(vf).forEach(frame => {
    Object.values(frame).forEach(side => {
      drawFrame3D(side[0], side[1]);
    });
  });
  
  // Draw random strokes within the main frame to represent slight reflection
  drawReflectionStrokes(vf.mainf);
  
  pop();
}

function drawFrame3D(start, end) {
  let delta = 3; // Reduced delta for 3D space
  
  beginShape();
  randomCords3D(start, end, 3).forEach(point => {
    let x = point.x + random(-delta, delta);
    let y = point.y + random(-delta, delta);
    let z = point.z + random(-delta, delta);
    curveVertex(x, y, z);
  });
  endShape();
}

function randomCords3D(start, end, amt) {
  let cords = [];
  for (let i = 0; i < amt; i++) {
    let t = i / (amt - 1);
    let x = lerp(start.x, end.x, t);
    let y = lerp(start.y, end.y, t);
    let z = lerp(start.z, end.z, t);
    cords.push(createVector(x, y, z));
  }
  return [start, start, ...cords, end, end];
}

function drawReflectionStrokes(mainFrame) {
  push();
  stroke(0, 0, 0);
  strokeWeight(0.7);
  
  const [topLeft, topRight] = mainFrame.top;
  const [bottomLeft, bottomRight] = mainFrame.bottom;
  
  for (let i = 0; i < 2; i++) {
    // Calculate start and end points for the reflection stroke
    let endDelta = random(0.03, 0.07); // Add randomness to stroke length
    let startDelta = random(0.03, 0.07);
    let startX = lerp(bottomLeft.x, bottomRight.x, 0.1 + i * 0.1 + startDelta);
    let startY = lerp(bottomLeft.y, topLeft.y, 0.1 + startDelta);
    let endX = lerp(topLeft.x, topRight.x, 0.3 + i * 0.1 + endDelta);
    let endY = lerp(topLeft.y, bottomLeft.y, 0.1 + endDelta);
    
    // Use randomCords3D to create the reflection stroke with wiggle effect
    let reflectionPoints = randomCords3D(
      createVector(startX, startY, 0),
      createVector(endX, endY, 0),
      floor(random(3, 12))
    );
    let delta = 1; // Adjust this value to control the amount of wiggle
    reflectionPoints = reflectionPoints.map(point => {
      return createVector(
        point.x + random(-delta, delta),
        point.y + random(-delta, delta),
        point.z + random(-delta, delta)
      );
    });
    
    beginShape();
    reflectionPoints.forEach(point => {
      curveVertex(point.x, point.y, point.z);
    });
    endShape();
  }
  
  pop();
}

window.windowResized = function windowResized() {
  const [w, h] = getSize();
  resizeCanvas(w, h, WEBGL);
  easycam.setViewport([w, h]);
}

const getSize = () => {
  return [window.innerWidth, window.innerHeight]
  // return Math.min(window.innerHeight, window.innerWidth) * 0.9;
}

function startDrag() {
  isDragging = true;
}

function endDrag() {
  isDragging = false;
}

function drawAxisDebugger() {
  const axisLength = 50;
  const axisThickness = 1; // Reduced thickness
  // Additional settings for labels
  textSize(12);
  textAlign(CENTER, CENTER);

  // X-axis (Red)
  push();
  stroke(255, 0, 0);
  strokeWeight(axisThickness);
  line(0, 0, 0, axisLength, 0, 0);
  fill(255, 0, 0);
  push();
  translate(axisLength + 10, 0, 0);
  rotateY(-HALF_PI);
  rotateZ(-HALF_PI);
  text("x", 0, 0);
  pop();
  pop();

  // Y-axis (Green)
  push();
  stroke(0, 255, 0);
  strokeWeight(axisThickness);
  line(0, 0, 0, 0, axisLength, 0);
  fill(0, 255, 0);
  push();
  translate(0, axisLength + 10, 0);
  rotateX(HALF_PI);
  text("y", 0, 0);
  pop();
  pop();

  // Z-axis (Blue)
  push();
  stroke(0, 0, 255);
  strokeWeight(axisThickness);
  line(0, 0, 0, 0, 0, axisLength);
  fill(0, 0, 255);
  push();
  translate(0, 0, axisLength + 10);
  rotateY(HALF_PI);
  text("z", 0, 0);
  pop();
  pop();

  // Ensure text is visible
  noLights();
  ambientLight(255);
}
