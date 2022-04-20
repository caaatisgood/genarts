import sketch from './sketch'

function initSketch() {
  new p5(sketch)
}

window.__devicemotion = {
  enabled: false,
}

function subscribeDeviceMotion() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          window.__devicemotion.enabled = true
        }
      })
      .catch(console.error)
      .finally(enter);
  }
}

const enter = () => {
  document.getElementById("dm-block").style.display = 'none'
  initSketch()
}

if (typeof DeviceMotionEvent.requestPermission === "function") {
  document.getElementById("dm-block").style.display = 'flex'
  document.querySelector("#dm-block button.enable").onclick = subscribeDeviceMotion
  document.querySelector("#dm-block button.later").onclick = enter
} else {
  initSketch()
}
