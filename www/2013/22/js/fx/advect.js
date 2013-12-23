Acko.Effect.Advect = function () {
  this.order = 2;

  this.params = {
    active: true,
    physicsVis: 0,
  };

}

Acko.Effect.Advect.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    var scene = exports.render.scene;
    var gl = exports.render.gl;
    var data = exports.audio.data.time;
    var levels = exports.audio.data.levels;
    var renderer = exports.render.renderer;

    exports.advect = this.params;

    // RTT stage

    var advectStage = this.advectStage = new ThreeRTT.Stage(renderer, {
      history: 1,
      width: 1,
      height: 1,
      clear: { color: true, depth: true, stencil: false },
      clearColor: new THREE.Color(0x000000),
      texture: {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
      },
    });
    advectStage.camera.position.set(0, 0, 1);
    advectStage.camera.lookAt(new THREE.Vector3());

    var paintRoot = this.paintRoot = new THREE.Object3D();
    advectStage.paint(paintRoot, true);

    // Advection feedback
    (function () {
      var uniforms = this.advectUniforms = {
        time: {
          type: 'f',
          value: 0,
        },
        fadeOut: {
          type: 'f',
          value: 2/255,
        },
        field: {
          type: 'f',
          value: 0,
        },
      };

      var feedback = this.feedback = new ThreeRTT.Compose(advectStage, 'advect-fragment', {}, uniforms);
      feedback.mesh.material.depthTest = false;
      feedback.mesh.material.depthWrite = false;
      feedback.mesh.material.transparent = false;
      feedback.mesh.renderDepth = -Infinity;

      paintRoot.add(feedback);
    }.bind(this))();

    // Beat flasher
    (function () {

      var color = Acko.Palette.white;
      var beatBuffer = this.beatBuffer = new Acko.LineBuffer({
        n: 9,
        gl: gl,
        callback: function (i, output) {
          var q = exports.scope.onsetBeat;
          var l = q > 0 ? Math.ceil(2 + q * 4 + (q * 100) % 3) : 0;
          if (l == 0) return output(100, 100, 10);
          var ph = ((q * 1000) % 1) * τ;
          var th = i / l * τ;
          var a = th + ph;
          var c = Math.cos(a)*.5;
          var s = Math.sin(a)*.5;
          return th < τ ? output(c, s, 0) : output(100, 100, 10);
        },
      })

      var beat = this.beat = new Acko.Particles({
        buffer: beatBuffer,
        color: color,
        pointSize: .1,
        fragmentShader: 'particles-fragment-beat',
      });
      paintRoot.add(beat);
      beat.mesh.material.transparent = true;

    }.bind(this))();

    // Particles
    (function () {

      var dt = 1/40;
      var dt2 = dt * dt;
      var v0 = new THREE.Vector3();
      var v1 = new THREE.Vector3();
      var v2 = new THREE.Vector3();
      var t = 0;
      var params = this.params;

      var n = 64;
      var points = [];
      for (var i = 0; i < n; ++i) {
        points.push({
          next: new THREE.Vector3(),
          current: new THREE.Vector3(),
          last: new THREE.Vector3(),
          f: new THREE.Vector3(),
        })
      }

      function f(v, i) {
        v0.set(0, 0, 0);

        // Radial containment
        var l = v.length();
        if (l > .2) {
          l = (l - .2) / l;
          v1.copy(v);
          v1.multiplyScalar(-l * 2);
          v0.add(v1);
        }

        // Radial containment
        var l = v.length();
        if (l > .7) {
          l = (l - .7) / l;
          v1.copy(v);
          v1.multiplyScalar(-l * 3.5);
          v0.add(v1);
        }

        // Audio push
        var rd = (1.0 + Math.sin((i * i + i) * 391.139) * .5);
        var rd2 = (1.0 + Math.sin((i * i + i) * 351.139) * .05);
        var rd3 = Math.sin((i * i + i) * 151.139) * .5 + .5;
        if ((rd * 200.0) % 1 > .5) rd = -rd;
        var th = t * rd + .1 * Math.sin(.5 * (1 + rd3) * t + Math.sin(t * rd2)) + rd * τ * 4;
        var l = 2.5 * rd * (level + (levels.smooth[i % 4] + levels.smooth[(i * i) % 4]) * .5);
        var c = Math.cos(th) * l;
        var s = Math.sin(th) * l;
        v0.x += c;
        v0.y += s;

        // Time step
        v0.multiplyScalar(dt2);

        return v0;
      }

      var level = 0, length = 0, scale1 = 0, scale2 = 0;
      function integrate() {
        length = params.physicsVis;
        reset = params.particleReset;

        level = lerp(level, (1.0 + exports.scope.onsetHat * 2) * levels.direct[0], .2);
        scale1 = lerp(scale1, exports.scope.onsetHat * 50.0, .3);
        scale2 = lerp(scale2, scale1, .3);
        params.scale = scale2;

        t = exports.time.now;

        points.forEach(function (p, i) {
          var v = p.next;

          if (reset) {
            p.current.set(0, 0, 0);
            p.last.set(0, 0, 0);
            return;
          }

          v.copy(p.current);
          v.multiplyScalar(1.99);
          p.last.multiplyScalar(.99);
          v.sub(p.last);
          p.f.copy(f(p.current, i));
          v.add(p.f);

          p.next = p.last;
          p.last = p.current;
          p.current = v;
        });
      }

      var lw = Acko.Params.geissTrailWidth;
      var color = Acko.Palette.white;
      var particleBuffer = this.particleBuffer = new Acko.LineBuffer({
        n: n * 2,
        gl: gl,
        callback: function (i, output) {
          if (i == 0) integrate();

          var p = points[i];

          return output(p.last.x, p.last.y, p.last.z) &&
                 output(p.current.x, p.current.y, p.current.z);
        },
      })

      var color2 = Acko.Palette.green;
      var velocityBuffer = this.velocityBuffer = new Acko.LineBuffer({
        n: n * 2,
        gl: gl,
        callback: function (i, output) {
          var p = points[i];

          return output(p.current.x, p.current.y, p.current.z) &&
                 output(p.current.x + (p.current.x - p.last.x) * 5.0 * length,
                        p.current.y + (p.current.y - p.last.y) * 5.0 * length,
                        p.current.z + (p.current.z - p.last.z) * 5.0 * length);
        },
      })

      var color3 = Acko.Palette.blue;
      var forceBuffer = this.forceBuffer = new Acko.LineBuffer({
        n: n * 2,
        gl: gl,
        callback: function (i, output) {
          var p = points[i];

          return output(p.current.x, p.current.y, p.current.z) &&
                 output(p.current.x + (p.f.x - .01 * (p.current.x - p.last.x)) * 100.0 * length,
                        p.current.y + (p.f.y - .01 * (p.current.y - p.last.y)) * 100.0 * length,
                        p.current.z + (p.f.z - .01 * (p.current.z - p.last.z)) * 100.0 * length);
        },
      })

      var particles = this.particles = new Acko.Line({
        buffer: particleBuffer,
        color: color,
        lineWidth: lw,
        mode: 'lines',
      });
      paintRoot.add(particles);

      var velocities = this.velocities = new Acko.Line({
        buffer: velocityBuffer,
        color: color2,
        lineWidth: lw,
        mode: 'lines',
      });
      paintRoot.add(velocities);

      var forces = this.forces = new Acko.Line({
        buffer: forceBuffer,
        color: color3,
        lineWidth: lw * 2,
        mode: 'lines',
      });
      paintRoot.add(forces);

    }.bind(this))();

    // Scopes
    (function () {

      var n = 512;
      var buffer = this.scopeBuffer = new Acko.LineBuffer({
        n: n,
        gl: gl,
        callback: function (i, output) {
          var j = 0;

          var x = ((i / 512) * 2 - 1.0) * 1.77;
          var y = data[Math.floor(i/512 * 1023)]/255 - .5;

          return output(x, y, 0);
        },
      });

      var lw = Acko.Params.geissLineWidth;
      var color = Acko.Palette.white;

      var scope = this.scope = new Acko.Line({
        buffer: buffer,
        color: color,
        lineWidth: lw,
        zBias: 0,
        vertexShader: 'multiline-vertex-grid',
        fragmentShader: 'multiline-fragment-grid',
      });
      paintRoot.add(scope);

    }.bind(this))();

    (function () {
      // Advection display
      var uniforms = this.displayUniforms = {
        palette: {
          type: 'f',
          value: 0,
        },
      };
      var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      var material = new ThreeRTT.ShaderMaterial(advectStage, 'generic-vertex', 'advect-fragment-compose', {}, uniforms);
      material.transparent = true;
      material.blending = THREE.AdditiveBlending;
      material.depthWrite = false;

      var display = this.advectDisplay = new THREE.Mesh(geometry, material);
      scene.add(display);

      // Field vectors
      var params = this.params;
      var gx = 15;
      var gy = 8;
      var igx = 1 / (gx - 1);
      var igy = 1 / (gy - 1);
      var aspect = 1.7777777;
      var n = gx * gy;
      var lw = Acko.Params.geissVectorWidth;
      var color = Acko.Palette.white;
      var color2 = Acko.Palette.green;
      var fieldBuffer = this.fieldBuffer = new Acko.LineBuffer({
        n: n * 2,
        gl: gl,
        callback: function (i, output) {
          var field = params.advectField;
          var clip = params.advectFieldClip;

          var x = (((i % gx) * igx) * 2 - 1) * (14/16);
          var y = (Math.floor(i / gx) * igy * 2 - 1) * (7/9);

          var xx = (x * 2) * aspect;
          var yy = (y * 2);

          x *= aspect;

          var r = Math.sqrt(x * x + y * y);
          var th = Math.atan2(y, x);

          var x1 = x;
          var y1 = y;
          var x2 = x1;
          var y2 = y1;

          if (field > 0) {

            var c = .9999875;
            var s = .005;

            var c2 = .9998;
            var s2 = .02;

            if (field < 2) {
              var f = (7.0 * r + Math.sin(r)) * .125 / r;

              var x3 = (x1 * c + y1 * s) * f;
              var y3 = (-x1 * s + y1 * c) * f;

              var g = clamp(field, 0, 1);
              x2 = lerp(x2, x3, g);
              y2 = lerp(y2, y3, g);
            }

            if (field > 1) {
              var f = .0625 * (15.0 + 1.0 / (-y1 + 1.25));

              var x3 = (x1 * c - y1 * s) * f;
              var y3 = (x1 * s + y1 * c) * f;

              var g = clamp(field - 1, 0, 1);
              x2 = lerp(x2, x3, g);
              y2 = lerp(y2, y3, g);
            }

            if (field > 2) {

              var f = (3.0 + 1.75 * Math.tan(r * .5) / r) * .25;

              var x3 = (x1 * c2 - y1 * s2) * f;
              var y3 = (x1 * s2 + y1 * c2) * f;

              var g = clamp(field - 2, 0, 1);
              x2 = lerp(x2, x3, g);
              y2 = lerp(y2, y3, g);

              var x4 = x1 * 9.0 * 6.28;
              var y4 = y1 * 9.0 * 6.28;

              var q = clamp(field - 4, 0, 1);

              x2 += Math.sin(y4) * .01 * q;
              y2 += Math.sin(x4) * .01 * q;
            }
          }

          var dx = x2 - x1;
          var dy = y2 - y1;

          var l = Math.sqrt(dx * dx + dy * dy);
          if (l > 0) {
            l = (1 + Math.sqrt(l) / l) / 4;
            dx *= l;
            dy *= l;
          }

          if (field > 3) {
            var t = params.advectTime;
            var c = Math.cos(t);
            var s = Math.sin(t);
            var dx2 = dx;
            var dy2 = dy;
            dx = dx2 * c - dy2 * s;
            dy = dx2 * s + dy2 * c;
          }

          var l = 6 * clip;

          return output(xx, yy, 0) &&
                 output(xx - dx * l, yy - dy * l, 0);
        },
      })

      var fieldVectors = this.fieldVectors = new Acko.Line({
        buffer: fieldBuffer,
        color: color,
        lineWidth: lw,
        mode: 'lines',
        zBias: 1,
      });
      scene.add(fieldVectors);

      var fieldVectors2 = this.fieldVectors2 = new Acko.Line({
        buffer: fieldBuffer,
        color: color2,
        lineWidth: lw * 2,
        mode: 'lines',
      });
      scene.add(fieldVectors2);

      display.position.set(10.5, -1, 0);
      fieldVectors.position.set(10.5, -1, 0);
      fieldVectors2.position.set(10.5, -1, 0);

      display.quaternion.set(-.5, .5, .5, .5);
      fieldVectors.quaternion.set(-.5, .5, .5, .5);
      fieldVectors2.quaternion.set(-.5, .5, .5, .5);

//      var compose = new ThreeRTT.Compose(advectStage, 'generic-fragment-texture');
//      scene.add(compose);

    }.bind(this))();


  },

  resize: function (exports) {
    var width = exports.render.width;
    var height = exports.render.height;

    this.advectStage.size(width, height);

    this.advectDisplay.scale.set(4 * width / height, 4, 1);
    this.beat.set({ pointScale: height });
  },

  update: function () {
    // Timing
    var p = this.params;

    var t = exports.audio.now;
    var beats = t * Acko.Demo.Beat.measure / 2 - 80;

    var beatVis = beats >= 17.8;

    var scopeGrid = cosineEase((beats - 15) / 2);
    var scopeVis = scopeGrid > 0;

    var particleVis = beats >= 0;
    var particleReset = beats < .5;
    var physicsVis = cosineEase(beats - 3.6) * cosineEase(16 - beats) * 2;
    var advectTime = slowStart((beats - 47.6) * 2) * 1.57 / 2;

    var fadeout = 12/255;
    var field = 0;
    var palette = 0;

    if (beats > 17.65) {
      fadeout = 2/255;
      field = cosineEase((beats - 17.6) * 8)
            + cosineEase((beats - 31.6) * 4)
            + cosineEase((beats - 39.55) * 4)
            + cosineEase((beats - 47.65) * 4)
            + cosineEase((beats - 55.55) * 4)
            + cosineEase((beats - 63.5) * 2)
            + cosineEase((beats - 71.5) * 4)
            + cosineEase((beats - 79.4) * 2);
      palette = field + cosineEase((beats - 31.7) / 8);
    }

    p.particleReset = particleReset;
    p.physicsVis = physicsVis;
    p.advectField = Math.max(field, cosineEase((beats - 17.7 + 2) / 2));
    p.advectFieldClip = cosineEase((55 - beats));
    p.advectTime = advectTime;

    // Update visibility
    this.beat.mesh.visible = beatVis;
    this.scope.mesh.visible = scopeVis;
    this.particles.mesh.visible = particleVis;
    //this.advectDisplay.visible = particleVis;

    if (!(beatVis || scopeVis || particleVis)) return;

    // Update audio buffers
    this.beatBuffer.update();
    this.scopeBuffer.update();
    if (particleVis) {
      this.particleBuffer.update();
      this.velocityBuffer.update();
      this.forceBuffer.update();
      this.fieldBuffer.update();
    }

    // Update uniforms
    this.advectUniforms.fadeOut.value = fadeout;
    this.advectUniforms.field.value = field;
    this.advectUniforms.time.value = advectTime;
    this.displayUniforms.palette.value = palette;

    this.scope.set({ lineClip: scopeGrid });
    this.particles.set({ lineWidth: Acko.Params.geissTrailWidth * (1.0 + p.scale) });

    // Render stage
    this.advectStage.render();

  },

  warmup: function (exports) {
    this.beat.mesh.visible = true;
    this.scope.mesh.visible = true;
    this.particles.mesh.visible = true;
    this.advectDisplay.visible = true;

    this.advectStage.camera.position.set(0, 0, -100);
    this.feedback.mesh.visible = false;
    this.advectStage.render();
    this.feedback.mesh.visible = true;
    this.advectStage.render();
    this.advectStage.camera.position.set(0, 0, 1);
  },


});

Acko.EffectList.push(new Acko.Effect.Advect());


