import sketch from './sketch'
new p5(sketch)

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
        alert(`> permissionState: ${permissionState}`);
        if (permissionState === "granted") {
          window.addEventListener("devicemotion", deviceMotionHandler, true);
        }
      })
      .catch(err => {
        alert(err)
      });
  } else {
    alert(`DeviceMotion is not supported on this device 😢`);
  }
}

if (typeof DeviceMotionEvent.requestPermission === "function") {
  // window.DEVICE_MOTION_SUPPORTED = true
  // document.getElementById("dm-block").style.display = 'flex'
  // document.querySelector("#dm-block button").onclick = subscribeDeviceMotion
}

// 8 + 8 + 8
// morning: 08 ~ 16
// evening: 16 ~ 00
//   night: 00 ~ 08
