Acko.Effect.Scope = function () {
  this.order = 1;

  this.params = {
    active: true,
    visible: true,
    onsetBeat: 0,
    onsetHat: 0,
  };

}

Acko.Effect.Scope.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    var scene = exports.render.scene;
    var gl = exports.render.gl;
    var data = exports.audio.data.time;
    var levels = exports.audio.data.levels;

    var dataF = new Float32Array(512);
    var fft = new FFT(512, 44100);

    // Scope
    (function () {

      var vertexShader = 'multiline-vertex-scope';
      var fragmentShader = 'multiline-fragment-color';
      this.scopeUniforms = {
        scopeFold: {
          type: 'f',
          value: 0,
        },
      };

      var lw = Acko.Params.scopeLineWidth;

      var n = 256;
      var buffer = this.scopeBuffer = new Acko.LineBuffer({
        n: n,
        history: 14,
        gl: gl,
        callback: function (i, output) {
          var x = (i / 256) * 2 - 1.0;
          return output(x, data[Math.floor(i/256 * 1023)]/255 - .5, 0);
        },
      });

      var color = new THREE.Vector4(1, 1, 1, 1);
      var color2 = new THREE.Vector4(0, .5, 1, 1);
      var color3 = new THREE.Vector4(.5, .5, .5, 1);

      var scope = this.scope = new Acko.Line({
        buffer: buffer,
        color: color,
        lineWidth: lw,
        zBias: 0,
        uniforms: this.scopeUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(scope);

      var scope2 = this.scope2 = new Acko.Line({
        buffer: buffer,
        color: color2,
        lineWidth: lw * 2,
        zBias: -1,
        uniforms: this.scopeUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(scope2);

      var scope3 = this.scope3 = new Acko.Line({
        buffer: buffer,
        color: color3,
        lineWidth: lw * 3,
        zBias: -2,
        uniforms: this.scopeUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(scope3);

      scope3.mesh.material.blending = THREE.MultiplyBlending;
      scope3.mesh.material.transparent = true;
      scope3.mesh.material.depthWrite = false;

    }.bind(this))();

    // Grid
    (function () {

      var color = Acko.Palette.slate;
      var color2 = Acko.Palette.darkSlate;
      var color3 = Acko.Palette.lightSlate;
      var lw = Acko.Params.gridLineWidth;
      var fragmentShader = 'multiline-fragment-grid';

      this.gridUniforms = {
        scopeFold: {
          type: 'f',
          value: 0,
        },
      };

      var vertexShader = 'multiline-vertex-grid-scope';

      var buffer1 = this.gridBuffer1 = new Acko.SurfaceBuffer({
        n: 192,
        m: 5,
        gl: gl,
        callback: function (i, j, output) {
          var x = i/191 * 2 - 1;
          var y = j/4 - .5;
          return output(x, y, -.005);
        },
      });
      buffer1.update();

      var buffer2 = this.gridBuffer2 = new Acko.SurfaceBuffer({
        n: 2,
        m: 9,
        gl: gl,
        callback: function (i, j, output) {
          var y = i - .5;
          var x = j/8 * 2 - 1;
          return output(x, y, -.005);
        },
      });
      buffer2.update();

      var grid1 = this.grid1 = new Acko.Line({
        buffer: buffer1,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: this.gridUniforms,
      });
      scene.add(grid1);

      var grid2 = this.grid2 = new Acko.Line({
        buffer: buffer2,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: this.gridUniforms,
      });
      scene.add(grid2);

      /////

      vertexShader = 'multiline-vertex-grid';

      var buffer3 = this.gridBuffer3 = new Acko.SurfaceBuffer({
        n: 64,
        m: 2,
        gl: gl,
        callback: function (i, j, output) {
          var th = (i/63 * 2 - 1) * π;
          var r = j * .25 + .25;
          var x = Math.cos(th)*r;
          var y = Math.sin(th)*r;
          return output(1.5, x, y);
        },
      });
      buffer3.update();

      var buffer4 = this.gridBuffer4 = new Acko.SurfaceBuffer({
        n: 64,
        m: 5,
        gl: gl,
        callback: function (i, j, output) {
          var th = (i/63 * 2 - 1) * π;
          var r = j * .25 + .25;
          var x = Math.cos(th)*r;
          var y = Math.sin(th)*r;
          return output(3.5, x, y);
        },
      });
      buffer4.update();

      var grid3 = this.grid3 = new Acko.Line({
        buffer: buffer3,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid3);

      var grid4 = this.grid4 = new Acko.Line({
        buffer: buffer4,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid4);

      //

      var buffer5 = this.gridBuffer5 = new Acko.SurfaceBuffer({
        n: 2,
        m: 5,
        gl: gl,
        callback: function (i, j, output) {
          var x = i * 1.65 * 2 - 1;
          var y = j/4 * 2 - 1;
          return output(x, y, -.01);
        },
      });
      buffer5.update();

      var buffer6 = this.gridBuffer6 = new Acko.SurfaceBuffer({
        n: 2,
        m: 9,
        gl: gl,
        callback: function (i, j, output) {
          var x = j/8 * 1.65 * 2 - 1;
          var y = i * 2 - 1;
          return output(x, y, -.01);
        },
      });
      buffer6.update();

      var grid5 = this.grid5 = new Acko.Line({
        buffer: buffer5,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid5);

      var grid6 = this.grid6 = new Acko.Line({
        buffer: buffer6,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid6);

      grid5.position.x = 5;
      grid6.position.x = 5;

      //

      var buffer7 = this.gridBuffer7 = new Acko.SurfaceBuffer({
        n: 2,
        m: 5,
        gl: gl,
        callback: function (i, j, output) {
          var x = i * 4 - 2;
          var y = j/4 - 1;
          return output(7.8, y, x);
        },
      });
      buffer7.update();

      var buffer8 = this.gridBuffer8 = new Acko.SurfaceBuffer({
        n: 2,
        m: 9,
        gl: gl,
        callback: function (i, j, output) {
          var x = j/8 * 4 - 2;
          var y = i - 1;
          return output(7.8, y, x);
        },
      });
      buffer8.update();

      var grid7 = this.grid7 = new Acko.Line({
        buffer: buffer7,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid7);

      var grid8 = this.grid8 = new Acko.Line({
        buffer: buffer8,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid8);

      //

      var buffer9 = this.gridBuffer9 = new Acko.SurfaceBuffer({
        n: 2,
        m: 10,
        gl: gl,
        callback: function (i, j, output) {
          var x = (i * 4 - 2) * 1.7777777;
          var y = (j/9 * 4);
          return output(8.5 + y, -1, x);
        },
      });
      buffer9.update();

      var buffer10 = this.gridBuffer10 = new Acko.SurfaceBuffer({
        n: 2,
        m: 17,
        gl: gl,
        callback: function (i, j, output) {
          var x = (j/16 * 4 - 2) * 1.7777777;
          var y = (i * 4);
          return output(8.5 + y, -1, x);
        },
      });
      buffer10.update();

      var grid9 = this.grid9 = new Acko.Line({
        buffer: buffer9,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid9);

      var grid10 = this.grid10 = new Acko.Line({
        buffer: buffer10,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(grid10);


      //

      [ grid1, grid2, grid3, grid4, grid5, grid6, grid7, grid8, grid9, grid10 ].forEach(function (g) {
        g.mesh.material.blending = THREE.AdditiveBlending;
        g.mesh.material.transparent = true;
        g.mesh.material.depthWrite = false;
      });


    }.bind(this))();

    // integrate fourier
    (function () {
      //
      var color = new THREE.Vector4(1, 1, 1, 1);
      var color2 = new THREE.Vector4(0, .5, 1, 1);
      var color3 = new THREE.Vector4(.65, .75, 1, 1);
      var lw = Acko.Params.scopeLineWidth;

      var vertexShader = 'multiline-vertex-integrate';
      var fragmentShader = 'multiline-fragment-grid';

      var params = this.params;
      var accumX = 0;
      var accumY = 0;
      var n = 256;
      var buffer = this.integrateBuffer = new Acko.LineBuffer({
        n: n,
        history: 16,
        gl: gl,
        callback: function (i, output) {
          if (i == 0) {
            accumX = accumY = 0;
          }

          var f = params.fold;

          var x = (i / 255) * 2 - 1.0;
          var y = data[Math.floor(i/255 * 1023)]/255 - .5;

          var th = x * .5 * f * 24;
          var c = Math.cos(th);
          var s = Math.sin(th);

          var xx = y * c / 32;
          var yy = y * s / 32;

          accumX += xx;
          accumY += yy;

          return output(2.5 + x, accumX, accumY);
        },
      });

      var buffer3 = this.integrate3Buffer = new Acko.LineBuffer({
        n: n,
        history: 16,
        gl: gl,
        callback: function (i, output) {
          if (i == 0) {
            accumX = accumY = 0;
          }

          var f = params.fold;

          var x = (i / 255) * 2 - 1.0;
          var y = data[Math.floor(i/255 * 1023)]/255 - .5;

          var th = x * .5 * f * 24;
          var c = Math.cos(th);
          var s = Math.sin(th);

          var xx = y * c / 32;
          var yy = y * s / 32;

          accumX += xx;
          accumY += yy;

          return output(3.5, accumX, accumY);
        },
      });

      var buffer2 = this.integrate2Buffer = new Acko.LineBuffer({
        n: n,
        history: 16,
        gl: gl,
        callback: function (i, output) {
          var r = Math.sqrt(accumX * accumX + accumY * accumY);

          var th = ((i / 255) * 2 - 1.0) * π;
          var c = Math.cos(th) * r;
          var s = Math.sin(th) * r;

          return output(3.5, c, s);
        },
      });

      var integrate = this.integrate = new Acko.Line({
        buffer: buffer,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(integrate);

      var integrateB = this.integrateB = new Acko.Line({
        buffer: buffer,
        color: color2,
        lineWidth: lw * 2,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        zBias: -1,
      });
      scene.add(integrateB);

      var integrate2 = this.integrate2 = new Acko.Line({
        buffer: buffer2,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(integrate2);

      var integrate2B = this.integrate2B = new Acko.Line({
        buffer: buffer2,
        color: color2,
        lineWidth: lw * 2,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        zBias: -1,
      });
      scene.add(integrate2);

      var integrate3 = this.integrate3 = new Acko.Line({
        buffer: buffer3,
        color: color2,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(integrate3);

      integrate3.mesh.material.blending = THREE.AdditiveBlending;
      integrate3.mesh.material.transparent = true;
      integrate3.mesh.material.depthWrite = false;


    }.bind(this))();

    // show FT
    (function () {
      //

      var color = new THREE.Vector4(1, 1, 1, 1);
      var color2 = new THREE.Vector4(0, .5, 1, 1);
      var lw = Acko.Params.scopeLineWidth;

      var vertexShader = 'multiline-vertex-fourier';
      var fragmentShader = 'multiline-fragment-grid';

      var params = this.params;
      var n = 233;

      var buffer = this.fourierBuffer = new Acko.LineBuffer({
        n: n,
        history: 233,
        gl: gl,
        callback: function (i, output) {
          if (i == 0) {
            for (var j = 0; j < 512; ++j) {
              dataF[j] = (data[j*2]/128 - 1) * (.5-.5*Math.cos(j/512*τ)) * 1.3;
            }
            fft.forward(dataF);
          }

          var x = (Math.sqrt((i / 233) + 1) - 1) * 2 - 1.0;
          var y = fft.real[i] / 255 * 2;
          var z = fft.imag[i] / 255 * 2;

          var r = Math.sqrt(Math.sqrt(y*y + z*z));
          return output(8 + x*4, r, 0);
        },
      });

      var fourierUniforms1 = {
        zMove: {
          type: 'f',
          value: -.1,
        },
      };

      var fourierUniforms2 = {
        zMove: {
          type: 'f',
          value: .1,
        },
      };

      var fourier = this.fourier = new Acko.Line({
        buffer: buffer,
        m: 14,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: fourierUniforms1,
      });
      scene.add(fourier);

      var fourierB = this.fourierB = new Acko.Line({
        buffer: buffer,
        m: 14,
        color: color2,
        lineWidth: lw * 2,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: fourierUniforms1,
        zBias: -1,
      });
      scene.add(fourierB);

      var fourier2 = this.fourier2 = new Acko.Line({
        buffer: buffer,
        m: 14,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: fourierUniforms2,
      });
      fourier2.rotateX(τ/2);
      scene.add(fourier2);

      var fourier2B = this.fourier2B = new Acko.Line({
        buffer: buffer,
        m: 14,
        color: color2,
        lineWidth: lw * 2,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        zBias: -1,
        uniforms: fourierUniforms2,
      });
      fourier2B.rotateX(τ/2);
      scene.add(fourier2B);

      //

      var vertexShader = 'surface-vertex-fourier';
      var fragmentShader = 'surface-fragment-fourier';

      var fourierSurface = this.fourierSurface = new Acko.Surface({
        buffer: buffer,
        color: color,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      scene.add(fourierSurface);

      fourierSurface.mesh.material.blending = THREE.AdditiveBlending;
      fourierSurface.mesh.material.transparent = true;
      fourierSurface.mesh.material.depthWrite = false;

    }.bind(this))();


    // onset detection
    (function () {
      var color = new THREE.Vector4(1, 1, 1, 1);
      var color2 = new THREE.Vector4(0, .5, 1, 1);
      var color3 = new THREE.Vector4(0, 1, .7, 1);
      var lw = Acko.Params.scopeLineWidth;

      var params = this.params;
      var vertexShader = 'multiline-vertex-onset';
      var fragmentShader = 'multiline-fragment-grid';

      function mag(i) {
        var a = fft.real[i] / 255;
        var b = fft.imag[i] / 255;
        return Math.sqrt(a*a + b*b);
      }

      var cutoff = 8;

      var l1 = 0, f1 = 0;
      var buffer = this.onsetBuffer = new Acko.LineBuffer({
        n: 1,
        history: 256,
        gl: gl,
        callback: function (i, output) {
          var c = (mag(4) * .15 + mag(6) * .1 + mag(5)) * 7;
          c = Math.max(0.0, c - .27) * 1.9;

          var d = c - l1;
          l1 = c;

          var o = Math.min(1, Math.max(0, (c + d) / 2));
          if (f1-- > 0) {
            o = 0;
          }
          else if (o > 0) {
            f1 = cutoff;
          }
          params.onsetBeat = o;

          return output(7.8 + i, -1 + o, 0);
        },
      });

      var l2 = 0, f2 = 0;
      var buffer2 = this.onset2Buffer = new Acko.LineBuffer({
        n: 1,
        history: 256,
        gl: gl,
        callback: function (i, output) {
          var c = 0;
          for (var j = 120; j < 180; j += 4) {
            c += mag(j);
          }
          var d = c - l2;
          l2 = c;

          var o = Math.min(1, Math.max(0.0, (c + d * 3 - .27) * 3));
          if (f2-- > 0) {
            o = 0;
          }
          else if (o > 0) {
            f2 = cutoff;
          }
          params.onsetHat = o;

          return output(7.8 + i, -1 + o, 0);
        },
      });

      var onset = this.onset = new Acko.Line({
        n: 1,
        buffer: buffer,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transpose: true,
        zBias: 1,
      });
      scene.add(onset);

      var onsetB = this.onsetB = new Acko.Line({
        n: 1,
        buffer: buffer,
        color: color2,
        lineWidth: lw * 2,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        zBias: 0,
        transpose: true,
      });
      scene.add(onsetB);

      var onset2 = this.onset2 = new Acko.Line({
        n: 1,
        buffer: buffer2,
        color: color,
        lineWidth: lw,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transpose: true,
        zBias: 1,
      });
      scene.add(onset2);

      var onset2B = this.onset2B = new Acko.Line({
        n: 1,
        buffer: buffer2,
        color: color3,
        lineWidth: lw * 2,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        zBias: 0,
        transpose: true,
      });
      scene.add(onset2B);

      //
    }.bind(this))();

    exports.scope = this.params;
  },

  update: function (exports) {
    var delta = exports.time.delta;
    var t = exports.audio.now;
    var beats = t * Acko.Demo.Beat.measure / 2;

    var p = this.params;

    if (p.active) {
      while (delta > 1/120) {
        this.scopeBuffer.update();
        this.integrateBuffer.update();
        this.integrate2Buffer.update();
        this.integrate3Buffer.update();
        this.fourierBuffer.update();
        this.onsetBuffer.update();
        this.onset2Buffer.update();

        delta -= 1/60;
      }
    }

    var drawOverride = !exports.camera.freeze;
    var visible = drawOverride || ((beats < 112) || (beats > 155)) && p.visible;

    [
      this.scope,
      this.scope2,
      this.scope3,
      this.grid1,
      this.grid2,
      this.grid3,
      this.grid4,
      this.grid5,
      this.grid6,
      this.grid7,
      this.grid8,
      this.grid9,
      this.grid10,

      this.integrate,
      this.integrateB,
      this.integrate2,
      this.integrate2B,

      this.integrate3,

      this.fourier,
      this.fourierB,
      this.fourier2,
      this.fourier2B,
      this.fourierSurface,

      this.onset,
      this.onsetB,
      this.onset2,
      this.onset2B,

    ].forEach(function (o) {
      o.mesh.visible = visible;
    });

    if (!visible) {
      return;
    }

    // timings 

    var foldb = beats / 16;
    p.fold = foldb > 1 ? .5-.5*Math.cos(τ * foldb) : 0;

    var scopeb = cosineEase((beats - 8) / 8);
    p.scopeGrid = scopeb;

    var integb = cosineEase((beats - 32) / 2);
    p.integrateGrid = integb;

    var integf = cosineEase((beats - 32) / 8);
    p.integrateFade = integf;

    var fourb = cosineEase((beats - 48) / 4) * (1.0 - cosineEase((beats - 56) / 8));
    p.fourierGrid = fourb;

    var fourf1 = cosineEase((beats - 48) / 8);
    var fourf2 = (1.0 - cosineEase((beats - 56) / 8))
    p.fourierFade1 = fourf1;
    p.fourierFade2 = fourf1 * fourf2;

    var fours = cosineEase((beats - 56 + .25) / 8);
    p.fourierShift = fours;

    var onsetb = cosineEase((beats - 64 + 2) / 4);
    p.onsetGrid = onsetb;

    var onsetf = clamp((beats - 64 - 1) / 4 * 1.3, 0, 1);
    p.onsetFade = onsetf;

    var advecb1 = cosineEase((beats - 78.3) / 8);
    var advecb2 = cosineEase((beats - 80.15) / 8);
    p.advectGrid1 = advecb1;
    p.advectGrid2 = advecb2;

    var advecd = cosineEase((beats - 108) / 4) * cosineEase((160 - beats) / 4);
    p.advectGridFade = advecd;

    var clipScope = drawOverride || !((beats > 52) && (beats < 75));
    this.scope.mesh.visible = clipScope;
    this.scope2.mesh.visible = clipScope;
    this.scope3.mesh.visible = clipScope;
    this.grid1.mesh.visible = clipScope;
    this.grid2.mesh.visible = clipScope;

    // animate uniforms

    this.scopeUniforms.scopeFold.value = p.fold;
    this.gridUniforms.scopeFold.value = p.fold;

    this.grid1.set({ lineClip: p.scopeGrid });
    this.grid2.set({ lineClip: p.scopeGrid });

    this.grid3.set({ lineClip: p.integrateGrid });
    this.grid4.set({ lineClip: p.integrateGrid });
    this.grid3.mesh.visible = p.integrateGrid > 0;
    this.grid4.mesh.visible = p.integrateGrid > 0;

    this.grid5.set({ lineClip: p.fourierGrid });
    this.grid6.set({ lineClip: p.fourierGrid });
    this.grid5.mesh.visible = p.fourierGrid > 0;
    this.grid6.mesh.visible = p.fourierGrid > 0;

    this.integrate.set({ lineClip: p.integrateFade });
    this.integrateB.set({ lineClip: p.integrateFade });
    this.integrate2.set({ lineClip: p.integrateFade * 8 - 7 });
    this.integrate2B.set({ lineClip: p.integrateFade * 8 - 7 });

    this.integrate3.set({ lineClip: p.integrateFade });

    this.fourier.set({ lineClip: p.fourierFade1 });
    this.fourierB.set({ lineClip: p.fourierFade2 });
    this.fourier2.set({ lineClip: p.fourierFade2 });
    this.fourier2B.set({ lineClip: p.fourierFade2 });

    this.fourierSurface.set({ yClip: p.fourierShift });
    this.fourierSurface.mesh.visible = !(p.fourierShift < 0.001);

    this.grid7.set({ lineClip: p.onsetGrid });
    this.grid8.set({ lineClip: p.onsetGrid });
    this.grid7.mesh.visible = p.onsetGrid > 0;
    this.grid8.mesh.visible = p.onsetGrid > 0;

    this.onset.set({ lineClip: p.onsetFade });
    this.onsetB.set({ lineClip: p.onsetFade });
    this.onset2.set({ lineClip: p.onsetFade });
    this.onset2B.set({ lineClip: p.onsetFade });
    this.onset.mesh.visible = p.onsetFade > 0;
    this.onsetB.mesh.visible = p.onsetFade > 0;
    this.onset2.mesh.visible = p.onsetFade > 0;
    this.onsetB.mesh.visible = p.onsetFade > 0;

    var color = (new THREE.Vector4(0,0,0,1)).lerp(Acko.Palette.slate, 1.0 - p.advectGridFade);
    this.grid9.set({ lineClip: p.advectGrid1, color: color });
    this.grid10.set({ lineClip: p.advectGrid2, color: color });
    this.grid9.mesh.visible = p.advectGrid1 > 0;
    this.grid10.mesh.visible = p.advectGrid2 > 0;

    //

    this.scope.scale.set(2, 2, 2);
    this.scope2.scale.set(2, 2, 2);
    this.scope3.scale.set(2, 2, 2);
    this.grid1.scale.set(2, 2, 2);
    this.grid2.scale.set(2, 2, 2);

    this.scope.position.set(-1, 0, 0);
    this.scope2.position.set(-1, 0, 0);
    this.scope3.position.set(-1, 0, 0);
    this.grid1.position.set(-1, 0, 0);
    this.grid2.position.set(-1, 0, 0);

    //

    var z = -2 * p.fourierShift;
    this.grid5.position.z = z;
    this.grid6.position.z = z;
    this.fourier.position.z = z;
    this.fourierB.position.z = z;
    this.fourier2.position.z = z;
    this.fourier2B.position.z = z;
    this.fourierSurface.position.z = z;

    var y = -1 * p.fourierShift;
    this.grid5.position.y = y;
    this.grid6.position.y = y;
    this.fourier.position.y = y;
    this.fourierB.position.y = y;
    this.fourier2.position.y = y;
    this.fourier2B.position.y = y;
    this.fourierSurface.position.y = y;
  },

  warmup: function (exports) {
    this.update(exports);

    [
      this.scope,
      this.scope2,
      this.scope3,
      this.grid1,
      this.grid2,
      this.grid3,
      this.grid4,
      this.grid5,
      this.grid6,
      this.grid7,
      this.grid8,
      this.grid9,
      this.grid10,

      this.integrate,
      this.integrateB,
      this.integrate2,
      this.integrate2B,

      this.integrate3,

      this.fourier,
      this.fourierB,
      this.fourier2,
      this.fourier2B,
      this.fourierSurface,

      this.onset,
      this.onsetB,
      this.onset2,
      this.onset2B,

    ].forEach(function (o) {
      o.mesh.visible = true;
    });
  },

});

Acko.EffectList.push(new Acko.Effect.Scope());


