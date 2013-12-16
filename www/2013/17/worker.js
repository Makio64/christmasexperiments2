var App, Module, app, window,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

App = (function() {
  function App() {
    this.postRun = __bind(this.postRun, this);
    this.setStatus = __bind(this.setStatus, this);
    this.printErr = __bind(this.printErr, this);
    this.print = __bind(this.print, this);
    this.handleMessage = __bind(this.handleMessage, this);
    this.prev = 0;
  }

  App.prototype.handleMessage = function(message) {
    var imagePoints, objectPoints, p, points, result, success;
    Module.HEAPU8.set(new Uint8Array(message.data), this.data);
    success = !!_update(this.tracker, this.data, 320, 240);
    result = null;
    if (success) {
      points = _getImagePoints(this.tracker);
      imagePoints = new Float64Array(66 * 2);
      points = points >> 3;
      imagePoints.set(Module.HEAPF64.subarray(points, points + imagePoints.length));
      p = _getCalibratedObjectPoints(this.tracker);
      p = p >> 2;
      objectPoints = new Float32Array(66 * 3);
      objectPoints.set(Module.HEAPF32.subarray(p, p + objectPoints.length));
      result = {
        imagePoints: imagePoints,
        objectPoints: objectPoints
      };
    }
    return self.postMessage({
      command: "result",
      success: success,
      data: result
    });
  };

  App.prototype.print = function(text) {
    return self.postMessage({
      command: "print",
      data: text
    });
  };

  App.prototype.printErr = function(text) {
    return self.postMessage({
      command: "printErr",
      data: text
    });
  };

  App.prototype.setStatus = function(text) {
    return self.postMessage({
      command: "setStatus",
      data: text
    });
  };

  App.prototype.postRun = function() {
    var start;
    start = Date.now();
    this.tracker = _createTracker();
    this.print("_createTracker: " + (Date.now() - start));
    this.data = _malloc(640 * 480 * 4);
    return self.postMessage({
      command: "ready"
    });
  };

  return App;

})();

app = new App();

self.onmessage = app.handleMessage;

window = {
  location: {
    pathname: "hoge"
  },
  encodeURIComponent: function() {
    return "hoge";
  }
};

Module = {
  print: app.print,
  printErr: app.printErr,
  setStatus: app.setStatus,
  postRun: app.postRun
};

importScripts("libft.js");

/*
//@ sourceMappingURL=worker.js.map
*/