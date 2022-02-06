class Random {
  random() {
    return fxrand()
  }

  randomChoice(arr) {
    return arr[Math.floor(this.random() * arr.length)];
  }

  randomRange(a, b) {
    return a + this.random() * (b - a)
  }
}

const R = new Random()

export const random = (arg1, arg2) => {
  if (!arg1) {
    return R.random()
  } else if (Array.isArray(arg1)) {
    return R.randomChoice(arg1)
  } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
    return R.randomRange(arg1, arg2)
  } else if (typeof arg1 === 'number' && !arg2) {
    return R.randomRange(0, arg1)
  }
  console.error(`[Random]: Incorrect parameters`)
}
