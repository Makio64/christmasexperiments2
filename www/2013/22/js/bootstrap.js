Acko.Bootstrap = function (keys, assets) {
  var that = this;

  that.requirements(function () {
    that.waitFor(keys, function () {
      that.load(assets, function (assets) {

        that.unspin();
        that.hide('#loading');
        that.show('#crunch');

        window.bench = new Acko.Bench(function (resolution) {
          document.getElementById('resolution').value = resolution;

          window.demo = that.demo = new Acko.Demo(assets, function () {
            that.show('#ready');
            that.hide('#crunch');

            window.exports = that.demo.gl.exports;
            window.effects = that.demo.gl.effects;

            //that.go();
          });

        });
      });
    });

    that.spin();
  });

  that.listen();
};

Acko.Bootstrap.prototype = {

  fullscreen: function (callback) {
    function fullscreenChange(e) {
      var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
      var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

        if (fullscreenElement) {
          setTimeout(function () {
            callback();
          }, 300);
        }

      }

    document.addEventListener('fullscreenchange', fullscreenChange, false);
    document.addEventListener('mozfullscreenchange', fullscreenChange, false);
    document.addEventListener('webkitfullscreenchange', fullscreenChange, false);

    var elem = document.body;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  },

  go: function () {
    var that = this;
    that.hide('#front');

    var fullscreen = document.getElementById('fullscreen').checked;
    if (fullscreen) {
      this.fullscreen(callback);
    }
    else {
      callback();
    }

    function callback() {
      var resolution = +document.getElementById('resolution').value;
      that.demo.go(resolution, fullscreen);
    }
  },

  listen: function () {
    var that = this;
    document.querySelector('button').addEventListener('click', function () { that.go(); });
  },

  show: function (sel) {
    var el = document.querySelector(sel);
    el.style.display = 'block';
  },

  hide: function (sel) {
    var el = document.querySelector(sel);
    el.style.display = 'none';
  },

  requirements: function (callback) {
    var el;

    var webgl = !! window.WebGLRenderingContext &&
                !! document.createElement('canvas').getContext('experimental-webgl');
    var webaudio = window.webkitAudioContext || window.AudioContext;
    if (webgl && webaudio) {
      callback();
    }
    else {
      this.show('#browser');
      this.hide('#loading');
    }

    if (navigator.userAgent.match(/Firefox/)) {
      this.show('#firefox');
    }
  },

  spin: function () {
    var el = document.querySelector('.spin');
    var t = 0;
    function spin() {
      t = t + 18;
      var tr = 'rotate('+ t +'deg)';
      el.style.WebkitTransform = tr;
      el.style.MozTransform = tr;
      el.style.OTransform = tr;
      el.style.transform = tr;
    }

    this.spinning = true;
    var that = this;

    var raf = window.requestAnimationFrame
           || window.webkitRequestAnimationFrame
           || window.mozRequestAnimationFrame;
    raf && raf(function loop() {
      if (that.spinning) {
        raf(loop);
      }
      spin();
    });
  },

  unspin: function () {
    this.spinning = false;
  },

  waitFor: function (keys, callback) {
    var that = this;
    var interval = setInterval(function () {
      var found = true;

      for (i in keys) (function (key) {
        if (!window[key]) found = false;
      })(keys[i]);

      if (found) {
        clearInterval(interval);
        callback();
      }
    }, 100);
  },

  load: function (assets, callback) {
    var that = this;
    setTimeout(function () {
      Acko.preload(assets, function (assets) {
        callback(assets);
      });
    }, 0);
  },
};
