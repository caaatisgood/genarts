let clrStrs = [
  "https://coolors.co/palette/355070-6d597a-b56576-e56b6f-eaac8b",
]
let clrs
let cwidth, cheight
let particles = []
let bg = "#edf6f9"

export function setup() {
  cwidth = min(windowWidth, windowHeight)
  cheight = cwidth*0.7
  createCanvas(cwidth, cheight);
	background(bg);
  clrs = random(clrStrs).split("/").pop().split("-").map(s => "#"+s)
  let particlesAmt = 100
  for (let i = 0; i<particlesAmt; i++) {
    let pg = i/(particlesAmt-1)
    let clr1 = color("#f94144")
    let clr2 = color("#011627")
    let clr = lerpColor(clr1, clr2, pg)
    // clr = color(random(clrs))
    particles.push(
      new Particle({
        idx: i,
        initX: 0 - i * 1 - noise(i/100) * 2,
        initY: lerp(0, height, pg) + noise(i) * 20,
        clr,
      })
    )
  }
}

class Particle {
  constructor({ idx, initX, initY, clr } = {}) {
    let currv = createVector(initX, initY)
    let accv = createVector(1, 0)
    let def = {
      idx,
      currv,
      accv,
      sz: 0,
      clr,
    }
    Object.assign(this, def)
  }
  
  update() {
    const {
      idx,
      currv,
      accv,
    } = this
    if (currv.x > width) {
      currv.set([0, currv.y])
    } else if (currv.x < 0) {
      currv.set([width, currv.y])
    } else if (currv.y > height) {
      currv.set([currv.x, 0])
    } else if (currv.y < 0) {
      currv.set([currv.x, height])
    } else {
      let accX =
        1 + sin((frameCount+idx)/40) +
        noise(currv.x/10, sin((frameCount+idx*10)/50)) * 2
      let accY =
        sin((frameCount+idx)/30)*0.5 +
        (noise(currv.y/2.5+currv.x/(50+idx*500), cos((frameCount+idx*100)/50)) - 0.5) * noise(frameCount/20)*50
      let accXScale = 0.7
      accv.set([accX*accXScale, accY])
      currv.add(accv)
      let sz = 0.5 + noise(frameCount/30) * 2
      this.sz = sz
    }
  }

  draw() {
    push()
      const { idx, currv, clr } = this
      translate(currv.x, currv.y)
      noStroke()
      clr.setAlpha(150)
      fill(clr)
      rectMode(CENTER)
      rotate((idx+currv.y)/100)
      rect(0, 0, this.sz)
    pop()
  }
}

export function draw() {
  // noLoop()
	// background(bg);
  // pg = PG
  if (DEVICE_MOTION_SUPPORTED && !DEVICE_MOTION_TOUCHED) {
    return
  } else {
    // pg = map(mouseX, 0, width, 0, 1)
    // pg = map(cos(frameCount/100), -1, 1, 0, 1)
  }
	particles.forEach(p => {
    p.update()
    p.draw()
  })
}

export function mousePressed() {
  const dateTime = (
    new Date().toDateString() + " " + new Date().toLocaleTimeString().replace(/\:/g, "")
  ).split(" ").join("-")
  // save(`defnotlikewater22-${dateTime}`)
}
