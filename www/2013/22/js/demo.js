Acko.Demo = function (assets, callback) {

  setTimeout(function () {
    this.build(assets, callback);
  }.bind(this), 0);

}

Acko.Demo.prototype = {

  build: function (assets, callback) {
    var element = document.getElementById('holder');

    var gl = this.gl = new Acko.Renderer({
      effects: Acko.EffectList,
      container: element,
      camera: Acko.Camera,
      klass: THREE.WebGLRenderer,
      type: 'webgl',
      exports: {
        assets: assets,
      },
      parameters: {
        devicePixelRatio: 1,
        stencil: false,
        alpha: false,
        antialias: false,
      },
      autoSize: false,
      autoRender: false,
      dead: true,
      capAspect: 16/9,
    });
    gl.init();

    // FPS stats
//    var stats  = this.stats = new Stats();
//    stats.domElement.style.position  = 'fixed';
//    stats.domElement.style.zIndex  = 100;
//    stats.domElement.style.display  = 'none';
//    document.body.appendChild(stats.domElement);

    this.built = true;
    this.ended = false;
    this.canvas = document.querySelector('canvas');

    callback(0);
  },

  go: function (resolution, fullscreen) {
    this.fullscreen = fullscreen;

    if (fullscreen) this.hideCursor();

    console.log("[Demo] Go");
    if (resolution) {
      this.gl.capHeight = resolution;
    }
    this.gl.resize();

    if (!this.built) return;
    if (this.playing) return;

    this.canvas.focus();

    document.addEventListener('keydown', function (e) {
      if (e.keyCode == 27) this.playing = false;
    }.bind(this));

    var loop = (function () {
      this.playing && requestAnimationFrame(loop);

      this.gl.tick();
      this.gl.update();
      this.stats && this.stats.update();

      if (this.gl.exports.audio.now > 252 && !this.ended) {
        this.end();
      }
    }).bind(this);

    this.playing = true;
    requestAnimationFrame(loop);
  },

  hideCursor: function () {
    this.canvas.style.cursor = 'none';
  },

  showCursor: function () {
    this.canvas.style.cursor = 'default';
  },

  replay: function () {
    if (fullscreen) this.hideCursor();

    effects[0].reset();
    effects[4].warmup();

    var el = document.getElementById('back');
    el.classList.remove('active');
    el.classList.remove('visible');

    this.ended = false;
  },

  end: function () {
    this.showCursor();
    console.log("[Demo] End");

    this.ended = true;

    var el = document.getElementById('back');
    if (el) {
      el.classList.add('active');
      setTimeout(function () {
        el.classList.add('visible');
      }, 100);
    }
  },

};
