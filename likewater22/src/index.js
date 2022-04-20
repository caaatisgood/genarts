import sketch from './sketch'
function initSketch() {
  new p5(sketch)
}

window.DEVICE_MOTION_TOUCHED = false
window.DEVICE_MOTION_SUPPORTED = false

function deviceMotionHandler(evt) {
  if (!evt?.accelerationIncludingGravity) {
    return
  }
  let acc = evt.accelerationIncludingGravity
  window.DEVICE_MOTION_TOUCHED = true
}

function subscribeDeviceMotion() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          window.addEventListener("devicemotion", deviceMotionHandler, true);
        }
      })
      .catch(err => {
        alert(err)
      });
  }
}

const onSkipEnableDeviceMotion = () => {
  document.getElementById("dm-block").style.display = 'none'
  initSketch()
}

if (typeof DeviceMotionEvent.requestPermission === "function") {
  window.DEVICE_MOTION_SUPPORTED = true
  document.getElementById("dm-block").style.display = 'flex'
  document.querySelector("#dm-block button.enable").onclick = subscribeDeviceMotion
  document.querySelector("#dm-block button.later").onclick = onSkipEnableDeviceMotion
} else {
  initSketch()
}

// document.getElementById("dm-block").style.display = 'flex'
// document.querySelector("#dm-block button.later").onclick = onSkipEnableDeviceMotion
