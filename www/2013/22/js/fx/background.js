Acko.Effect.Background = function () {
  this.order = 5;

  this.params = {
  };

}

Acko.Effect.Background.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    var scene = exports.render.scene;
    var gl = exports.render.gl;
    var data = exports.audio.data.time;
    var levels = exports.audio.data.levels;

    var n = 16;
    var m = 192;
    var transpose = false;

    var geometry = new THREE.BufferGeometry();

    var triangles = (n - 1) * 2;
    var points = n * 2;

    var geometry = this.geometry = new THREE.BufferGeometry();
    geometry.addAttribute('index', Uint16Array, triangles * 3 * m, 1);
    geometry.addAttribute('position', Float32Array, points * m, 3);
    geometry.addAttribute('line', Float32Array, points * m, 2);
    geometry.addAttribute('arc', Float32Array, points * m, 3);

    var indices   = geometry.attributes.index.array;
    var positions = geometry.attributes.position.array;
    var lines     = geometry.attributes.line.array;
    var arcs      = geometry.attributes.arc.array;

    var base;
    for (var l = 0; l < m; ++l) {
      base = l * triangles / 2;

      for (var i = 0, j = base * 6; i < triangles; i += 2) {
        var k = i + base * 2 + 2 * l;

        indices[j++] = k;
        indices[j++] = k + 1;
        indices[j++] = k + 2;

        indices[j++] = k + 2;
        indices[j++] = k + 1;
        indices[j++] = k + 3;
      }

      base = l * n;

      var arcSpeed = (Math.sin((l * 3.11) * 314.15)*100.0) % 1;
      var arcSpan = (Math.abs(Math.sin((l * 8.71) * 314.15)*100.0) % 1) + 1.0;
      var arcDepth = (Math.abs(Math.sin((l * 5.66) * 314.15)*100.0) % 1) + 1.0;

      for (var i = 0, j = base * 6, k = base * 4; i < n; i++) {
        var x = transpose ? l : i;
        var y = transpose ? i : l

        var edge = (x == 0) ? -1 : ((x == n - 1) ? 1 : 0);

        arcs[j] = arcSpan;
        arcs[j + 1] = arcSpeed;
        arcs[j + 2] = arcDepth;
        arcs[j + 3] = arcSpan;
        arcs[j + 4] = arcSpeed;
        arcs[j + 5] = arcDepth;

        positions[j++] = x;
        positions[j++] = y;
        positions[j++] = 0;

        positions[j++] = x;
        positions[j++] = y;
        positions[j++] = 0;

        lines[k++] = edge;
        lines[k++] = 1;

        lines[k++] = edge;
        lines[k++] = -1;

      }
    }

    geometry.offsets = [
      {
        index: 0,
        start: 0,
        count: triangles * 3 * m,
      },
    ];

    var uniforms = this.uniforms = {
      color: {
        type: 'v4',
        value: new THREE.Vector4(),
      },
      dataResolution: {
        type: 'v2',
        value: new THREE.Vector2(1 / (n - 1), 1 / (m - 1)),
      },
      time: {
        type: 'f',
        value: 0,
      },
    };

    var attributes = {
      line: {
        type: 'v2',
        value: null,
      },
      arc: {
        type: 'v2',
        value: null,
      },
    };

    var material = this.material = new THREE.ShaderMaterial({
      attributes: attributes,
      uniforms: uniforms,
      vertexShader: getShader('background-vertex'),
      fragmentShader: getShader('background-fragment'),
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    var mesh = this.mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
  },

  update: function (exports) {
    this.uniforms.time.value = exports.audio.now;

    var t = exports.audio.now;
    var beats = t * Acko.Demo.Beat.measure / 2;

    var c = this.uniforms.color.value;
    var advecd = cosineEase((beats - 108) / 4) * cosineEase((160 - beats) / 4);
    c.set(0,0,0,1).lerp(Acko.Palette.slate, (1.0 - advecd) * .25);

  },

});

Acko.EffectList.push(new Acko.Effect.Background());


