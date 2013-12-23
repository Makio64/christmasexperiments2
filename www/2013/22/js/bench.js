Acko.Bench = function (done) {

  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.top = 0;
  div.style.left = 0;
  div.style.width = "1280px";
  div.style.height = "720px";
  document.body.appendChild(div);

  var gl = new Acko.Renderer({
    effects: [new Acko.Bench.Effect()],
    camera: Acko.Camera,
    container: div,
    klass: THREE.WebGLRenderer,
    type: 'webgl',
    parameters: {
      devicePixelRatio: 1,
      stencil: false,
      alpha: false,
      antialias: false,
    },
    autoSize: false,
    autoRender: true,
    dead: true,
    capAspect: 16/9,
    capWidth: 1280,
    capHeight: 720,
  });
  gl.init();

  var frames = 10;
  var skip = 5;
  var start;
  requestAnimationFrame(function loop() {
    if (skip > 0) {
      if (--skip == 0) {
        start = Time.clock();
      }
    }
    else {
      frames--;
    }
    if (frames > 0) requestAnimationFrame(loop);
    else end();

    gl.tick();
    gl.update();
  });

  function end() {
    var end = Time.clock();
    var delta = end - start;

    var ref = .8/delta * 720;
    var out = 540;

    [ 540, 720, 900, 1080 ].forEach(function (res) {
      if (res < window.innerWidth && res < ref) {
        out = res;
      }
    });

    console.log('[Bench]', delta, 'ms');

    document.body.removeChild(div);

    done(out);
  }
};

Acko.Bench.Effect = function () {
}

Acko.Bench.Effect.prototype = _.extend(new Acko.Effect(), {
  build: function (exports) {
    var scene = exports.render.scene;
    var camera = exports.render.camera;

    camera.position.set(0, 0, 1);

    var geometry = new THREE.PlaneGeometry(5, 5);
    var material = new THREE.MeshNormalMaterial();
    material.depthTest = false;
    for (var i = 0; i < 150; ++i) {
      var plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
    }
  },
});

Done = true;