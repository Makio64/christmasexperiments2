window.Acko = window.Acko || {};

var π = Math.PI,
    τ = π * 2;

// Seedable random generator
var rand = (function () {
  var seed = 0;
  return function (sd) {
    seed = sd || seed;

    // Robert Jenkins' 32 bit integer hash function.
    seed = ((seed + 0x7ed55d16) + (seed << 12))  & 0xffffffff;
    seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
    seed = ((seed + 0x165667b1) + (seed << 5))   & 0xffffffff;
    seed = ((seed + 0xd3a2646c) ^ (seed << 9))   & 0xffffffff;
    seed = ((seed + 0xfd7046c5) + (seed << 3))   & 0xffffffff;
    seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;

    return (seed & 0xfffffff) / 0x10000000;
  };
})();

// Sign-preserving power
function pow(x, a) {
  var s = (x < 0) ? -1 : 1;
  return s * Math.pow(Math.abs(x), a);
}

// Debug timer
function tick() {
  var now = +new Date();
  return function (label) {
    var delta = (+new Date() - now);
    console.log(label, delta + " ms");
    return delta;
  };
}

// Get shader
function getShader(id) {
  var elem = document.getElementById(id);
  return elem && (elem.innerText || elem.textContent) || id;
};

/**
 * Slow start easing w slope 1 and ramp .5
 */
function slowStart(t) {
  t = Math.max(0, t);
  return t < .5 ? t*t : t - .25;
}

/**
 * Cosine easing
 */
function cosineEase(t) {
  return .5 - .5 * Math.cos(clamp(t, 0, 1) * π);
}

/**
 * Clamp
 */
function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

/**
 * Lerp
 */
function lerp(a, b, f) {
  return a + (b - a) * f;
}

/**
 * Catmull-rom x=0..4
 */
function catmullRom(x) {
  var xx;
  if (x < 0) {
    return 0;
  }
  if (x < 1) {
    xx = 1 - x;
    return .5*xx*(-1+xx*(2-xx));
  }
  else if (x < 2) {
    xx = 2 - x;
    return (2+(-5+3*xx)*xx*xx)*.5;
  }
  else if (x < 3) {
    xx = x - 2;
    return (2+(-5+3*xx)*xx*xx)*.5;
  }
  else if (x < 4) {
    xx = x - 3;
    return .5*xx*(-1+xx*(2-xx));
  }
  return 0;
}

