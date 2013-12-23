Acko.Effect.Audio = function () {
  this.order = -Infinity;

  var n = this.n = 2048;
  this.blocks = [
    [ new Float32Array(n), new Float32Array(n), ],
    [ new Float32Array(n), new Float32Array(n), ],
  ];

  this.laps = [
    new Float32Array(n),
    new Float32Array(n),
  ];

  this.scratch1 = new Float32Array(n);
  this.scratch2 = new Float32Array(n);

  this.pending = false;
  this.playing = false;
  this.trackClock = false;
  this.override = false;
  this.lastTime = 0;
}

Acko.Effect.Audio.prototype = _.extend(new Acko.Effect(), {

  build: function (exports) {
    this.samples = 0;

    this.audio = exports.assets.music;
    this.source = new ThreeAudio.Source({
      fftSize: 2048,
      element: this.audio,
      process: this.process.bind(this),
      processSize: 2048,
      detectors: [ThreeAudio.LevelDetect],
    });

    this.fft = new FFT(2048, 44100);

    var w = this.w = 1500;
    var h = this.h = 50;

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(exports.assets.scroller.image, 0, 0);

    var img = ctx.getImageData(0, 0, w, h);
    this.scroller = img.data;

    this.exports = exports.audio = {
      data: this.source.data,
      now: 0,
    };

    document.addEventListener('keydown', function (e) {
      var x = 0;
      switch (e.keyCode) {
        case 188: // < ,
          x = -5;
          break;
        case 190: // > .
          x = 5;
          break;
      }
      if (x) {
        this.audio.currentTime += x;
        this.start -= x;
      }
    }.bind(this));
  },

  // Lapped FFT filter for spectrogram message painter
  process: function (event, input, output) {

    input = input || event.inputBuffer;
    output = output || event.outputBuffer;

    var n = this.n;

    var passthrough = function () {
      for (var i = 0; i < input.numberOfChannels; ++i) {
        var indata = input.getChannelData(i);
        var outdata = output.getChannelData(i);
        for (var j = 0; j < n; ++j) {
          outdata[j] = indata[j];
        }
      }
    }.bind(this);

    if (!this.override) {
      this.samples = 0;
      return passthrough();
    }

    var w = this.w;
    var h = this.h;
    var n2 = n / 2;
    var fft = this.fft;
    var s1 = this.scratch1;
    var s2 = this.scratch2;

    var beats = Math.floor(this.samples / 44100 * Acko.Demo.Beat.measure / 2 * 32);
    var samples = this.samples += n;
    var scroller = this.scroller;
    var offset = clamp(beats, 0, w - 2);

    function win(i) {
      return Math.sin(i / n * π);
    }

    function apply(fft) {
      for (var k = 0; k < 2048; ++k) {
        var j = Math.min(440, k >= 1024 ? 2047 - k : k);
        var c = Math.min(h - 1, Math.max(0, (j/2 - 19) / 120 * 3 / 5 * h));

        var i = Math.floor(c);
        var d = c - i;

        var f1 = scroller[(i*w + offset) * 4 + 3] / 255;
        var f2 = scroller[(i*w + offset + 1) * 4 + 3] / 255;
        var f = lerp(f1, f2, d) * 130;

        var wd = n/j;
        var ph = ((samples % wd) / wd) * π;

        if (k >= 1024) ph = -ph;

        if (j < 440) {
          fft.real[k] += (Math.cos(ph) * f + f) / 5;
          fft.imag[k] += (Math.sin(ph) * f + f) / 5;
        }
        else {
          fft.real[k] += 0.001;
          fft.imag[k] += 0.001;
        }

//        fft.real[k] += f * 2;
//        fft.imag[k] += f * 2;
      }
    }

    function eat(i, buffer) {
      var a = this.channels[i][0];

      for (var j = 0; j < n; ++j) {
        a[j] = indata[j];
      }
    }

    for (var i = 0; i < input.numberOfChannels; ++i) {
      var indata = input.getChannelData(i);
      var outdata = output.getChannelData(i);

      var a = this.blocks[i][0];
      var b = this.blocks[i][1];
      var l = this.laps[i];

      // Save input block
      for (var j = 0; j < n; ++j) {
        b[j] = indata[j];
        outdata[j] = 0;
      }

      // Second half of last half lap
      for (var j = 0; j < n2; ++j) {
        outdata[j] += l[j + n2];
      }

      // Center lap
      for (var j = 0; j < n; ++j) {
        s1[j] = a[j] * win(j);
      }

      fft.forward(s1);
      apply(fft);
      fft.inverse(null, null, s1);

      for (var j = 0; j < n; ++j) {
        outdata[j] += s1[j] * win(j);
      }

      // Half lap
      for (var j = 0; j < n2; ++j) {
        s2[j] = a[j + n2] * win(j);
      }
      for (var j = 0; j < n2; ++j) {
        s2[j + n2] = b[j] * win(j + n2);
      }

      fft.forward(s2);
      apply(fft);
      fft.inverse(null, null, s2);

      for (var j = 0; j < n2; ++j) {
        outdata[j + n2] += s2[j] * win(j);
      }
      for (var j = n2; j < n; ++j) {
        l[j] = s2[j] * win(j);
      }

      // Swap channel blocks
      this.blocks[i].reverse();
    }
  },

  reset: function () {
    this.pending = this.playing = false;
    this.lastTime = 0;
    this.audio.currentTime = 0;
    exports.audio.now = 0;
  },

  update: function (exports) {

    // Start audio after warm-up
    if (!this.pending && !this.playing) {
      this.audio.pause();
      this.audio.currentTime = 0;
      setTimeout(function () {
        this.audio.play();
        this.pending = false;
        this.playing = true;
      }.bind(this), 1000);
      this.pending = true;
    }

    // Update time/freq buffers
    this.source.update();

    // Set audio override at end
    this.override = exports.audio.now > 252;

    // Catch audio clock advancing
    if (this.lastTime == 0 && this.audio.currentTime > 0) {
      this.start = Time.clock();
      this.lastTime = this.audio.currentTime;
    }

    var now = (this.playing ? Time.clock() - this.start : 0) || 0;

    exports.audio.now = Math.max(0, now);

  },

});

Acko.EffectList.push(new Acko.Effect.Audio());
