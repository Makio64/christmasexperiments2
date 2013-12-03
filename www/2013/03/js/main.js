(function() {
  var AbstractScene, Anchor, AppAudio, AppUI, AppView, Boid, ReindeerAnchors, RibbonAnchor, SceneBasic, SceneChewbacca, SceneCircles, SceneFatso, SceneIntro, SceneRays, SceneRopeBall, SceneTest, Scenes, StringUtils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AppAudio = (function() {

    function AppAudio() {
      this.onBufferLoad = __bind(this.onBufferLoad, this);

    }

    AppAudio.prototype.ctx = null;

    AppAudio.prototype.paused = null;

    AppAudio.prototype.startedAt = null;

    AppAudio.prototype.pausedAt = null;

    AppAudio.prototype.sourceNode = null;

    AppAudio.prototype.analyserNode = null;

    AppAudio.prototype.buffer = null;

    AppAudio.prototype.values = null;

    AppAudio.prototype.FFT_SIZE = 2048;

    AppAudio.prototype.BINS = 256;

    AppAudio.prototype.init = function() {
      this.ctx = new webkitAudioContext();
      this.values = [];
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.smoothingTimeConstant = 0.9;
      this.analyserNode.fftSize = this.FFT_SIZE;
      this.analyserNode.connect(this.ctx.destination);
      return this.load('sound/Sugar-and-The-Hi-Lows-Jingle-Bells.mp3');
    };

    AppAudio.prototype.update = function() {
      var average, bin, freqData, i, j, length, sum, _i, _j, _ref, _results;
      freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteFrequencyData(freqData);
      length = freqData.length;
      bin = Math.ceil(length / this.BINS);
      _results = [];
      for (i = _i = 0, _ref = this.BINS; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        sum = 0;
        for (j = _j = 0; 0 <= bin ? _j < bin : _j > bin; j = 0 <= bin ? ++_j : --_j) {
          sum += freqData[(i * bin) + j];
        }
        average = sum / bin;
        _results.push(this.values[i] = average / 256);
      }
      return _results;
    };

    AppAudio.prototype.load = function(url) {
      var request,
        _this = this;
      request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        return _this.ctx.decodeAudioData(request.response, _this.onBufferLoad, _this.onBufferError);
      };
      return request.send();
    };

    AppAudio.prototype.play = function() {
      this.sourceNode = this.ctx.createBufferSource();
      this.sourceNode.connect(this.analyserNode);
      this.sourceNode.buffer = this.buffer;
      this.paused = false;
      if (this.pausedAt) {
        this.startedAt = Date.now() - this.pausedAt;
        return this.sourceNode.start(0, this.pausedAt / 1000);
      } else {
        this.startedAt = Date.now();
        return this.sourceNode.start(0);
      }
    };

    AppAudio.prototype.stop = function() {
      this.sourceNode.stop(0);
      this.pausedAt = Date.now() - this.startedAt;
      return this.paused = true;
    };

    AppAudio.prototype.onBufferLoad = function(buffer) {
      this.buffer = buffer;
      app.view.ui.onAudioLoaded();
      return this.play();
    };

    AppAudio.prototype.onBufferError = function(e) {
      return console.log('AppAudio.onBufferError', e);
    };

    return AppAudio;

  })();

  Anchor = (function() {

    Anchor.prototype.index = null;

    Anchor.prototype.positions = null;

    Anchor.prototype.pos = null;

    Anchor.prototype.left = false;

    Anchor.prototype.right = false;

    function Anchor(index) {
      this.index = index;
      this.positions = [];
    }

    return Anchor;

  })();

  ReindeerAnchors = (function() {

    function ReindeerAnchors() {
      this.initFrames();
      this.interpolateFrames();
      this.initAnchors();
    }

    ReindeerAnchors.prototype.initFrames = function() {
      this.frames = [];
      this.frames[0] = [
        {
          x: -78,
          y: 273
        }, {
          x: -82,
          y: 262
        }, {
          x: -81,
          y: 251
        }, {
          x: -71,
          y: 242
        }, {
          x: -69,
          y: 231
        }, {
          x: -60,
          y: 226
        }, {
          x: -51,
          y: 215
        }, {
          x: -39,
          y: 191
        }, {
          x: -28,
          y: 170
        }, {
          x: -19,
          y: 159
        }, {
          x: -11,
          y: 148
        }, {
          x: -13,
          y: 124
        }, {
          x: -16,
          y: 103
        }, {
          x: -21,
          y: 78
        }, {
          x: -26,
          y: 57
        }, {
          x: -33,
          y: 43
        }, {
          x: -35,
          y: 21
        }, {
          x: -38,
          y: 12
        }, {
          x: -62,
          y: 1
        }, {
          x: -82,
          y: -6
        }, {
          x: -94,
          y: -15
        }, {
          x: -98,
          y: -25
        }, {
          x: -94,
          y: -41
        }, {
          x: -87,
          y: -57
        }, {
          x: -82,
          y: -71
        }, {
          x: -82,
          y: -88
        }, {
          x: -70,
          y: -100
        }, {
          x: -41,
          y: -110
        }, {
          x: -40,
          y: -126
        }, {
          x: -35,
          y: -140
        }, {
          x: -38,
          y: -155
        }, {
          x: -38,
          y: -167
        }, {
          x: -50,
          y: -169
        }, {
          x: -60,
          y: -173
        }, {
          x: -65,
          y: -185
        }, {
          x: -72,
          y: -194
        }, {
          x: -87,
          y: -198
        }, {
          x: -100,
          y: -206
        }, {
          x: -112,
          y: -225
        }, {
          x: -124,
          y: -247
        }, {
          x: -132,
          y: -274
        }, {
          x: -132,
          y: -285
        }, {
          x: -123,
          y: -275
        }, {
          x: -118,
          y: -262
        }, {
          x: -113,
          y: -249
        }, {
          x: -107,
          y: -249
        }, {
          x: -101,
          y: -259
        }, {
          x: -101,
          y: -275
        }, {
          x: -94,
          y: -257
        }, {
          x: -96,
          y: -244
        }, {
          x: -98,
          y: -233
        }, {
          x: -94,
          y: -224
        }, {
          x: -87,
          y: -214
        }, {
          x: -78,
          y: -208
        }, {
          x: -63,
          y: -202
        }, {
          x: -53,
          y: -195
        }, {
          x: -43,
          y: -192
        }, {
          x: -36,
          y: -198
        }, {
          x: -32,
          y: -214
        }, {
          x: -28,
          y: -194
        }, {
          x: -21,
          y: -187
        }, {
          x: -12,
          y: -190
        }, {
          x: -7,
          y: -211
        }, {
          x: -1,
          y: -199
        }, {
          x: 14,
          y: -203
        }, {
          x: 18,
          y: -214
        }, {
          x: 28,
          y: -217
        }, {
          x: 40,
          y: -228
        }, {
          x: 47,
          y: -240
        }, {
          x: 51,
          y: -255
        }, {
          x: 47,
          y: -265
        }, {
          x: 34,
          y: -285
        }, {
          x: 48,
          y: -278
        }, {
          x: 57,
          y: -270
        }, {
          x: 65,
          y: -277
        }, {
          x: 68,
          y: -298
        }, {
          x: 75,
          y: -276
        }, {
          x: 68,
          y: -264
        }, {
          x: 63,
          y: -252
        }, {
          x: 58,
          y: -232
        }, {
          x: 49,
          y: -216
        }, {
          x: 35,
          y: -206
        }, {
          x: 21,
          y: -199
        }, {
          x: 20,
          y: -190
        }, {
          x: 12,
          y: -180
        }, {
          x: 2,
          y: -172
        }, {
          x: 4,
          y: -156
        }, {
          x: 5,
          y: -139
        }, {
          x: 9,
          y: -125
        }, {
          x: 10,
          y: -110
        }, {
          x: 8,
          y: -104
        }, {
          x: 20,
          y: -93
        }, {
          x: 29,
          y: -76
        }, {
          x: 35,
          y: -51
        }, {
          x: 45,
          y: -21
        }, {
          x: 44,
          y: -6
        }, {
          x: 40,
          y: 9
        }, {
          x: 50,
          y: 26
        }, {
          x: 58,
          y: 42
        }, {
          x: 65,
          y: 60
        }, {
          x: 75,
          y: 79
        }, {
          x: 81,
          y: 103
        }, {
          x: 87,
          y: 121
        }, {
          x: 91,
          y: 145
        }, {
          x: 91,
          y: 171
        }, {
          x: 91,
          y: 197
        }, {
          x: 95,
          y: 212
        }, {
          x: 95,
          y: 223
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 72,
          y: 247
        }, {
          x: 73,
          y: 232
        }, {
          x: 64,
          y: 230
        }, {
          x: 63,
          y: 212
        }, {
          x: 63,
          y: 194
        }, {
          x: 62,
          y: 173
        }, {
          x: 59,
          y: 149
        }, {
          x: 59,
          y: 134
        }, {
          x: 51,
          y: 123
        }, {
          x: 42,
          y: 109
        }, {
          x: 37,
          y: 97
        }, {
          x: 29,
          y: 82
        }, {
          x: 24,
          y: 78
        }, {
          x: 24,
          y: 90
        }, {
          x: 24,
          y: 113
        }, {
          x: 24,
          y: 134
        }, {
          x: 25,
          y: 146
        }, {
          x: 21,
          y: 157
        }, {
          x: 11,
          y: 175
        }, {
          x: 1,
          y: 194
        }, {
          x: -9,
          y: 211
        }, {
          x: -19,
          y: 228
        }, {
          x: -25,
          y: 240
        }, {
          x: -36,
          y: 240
        }, {
          x: -42,
          y: 236
        }, {
          x: -50,
          y: 244
        }, {
          x: -54,
          y: 256
        }, {
          x: -56,
          y: 265
        }, {
          x: -62,
          y: 272
        }, {
          x: -70,
          y: 274
        }
      ];
      this.frames[1] = [
        {
          x: -78,
          y: 273
        }, {
          x: -78,
          y: 261
        }, {
          x: -77,
          y: 253
        }, {
          x: -69,
          y: 245
        }, {
          x: -62,
          y: 235
        }, {
          x: -52,
          y: 228
        }, {
          x: -45,
          y: 217
        }, {
          x: -36,
          y: 198
        }, {
          x: -26,
          y: 173
        }, {
          x: -18,
          y: 162
        }, {
          x: -9,
          y: 150
        }, {
          x: -14,
          y: 124
        }, {
          x: -19,
          y: 103
        }, {
          x: -25,
          y: 76
        }, {
          x: -32,
          y: 59
        }, {
          x: -35,
          y: 42
        }, {
          x: -37,
          y: 27
        }, {
          x: -38,
          y: 17
        }, {
          x: -63,
          y: 6
        }, {
          x: -82,
          y: -4
        }, {
          x: -94,
          y: -10
        }, {
          x: -99,
          y: -20
        }, {
          x: -94,
          y: -38
        }, {
          x: -86,
          y: -53
        }, {
          x: -82,
          y: -67
        }, {
          x: -79,
          y: -83
        }, {
          x: -68,
          y: -95
        }, {
          x: -41,
          y: -104
        }, {
          x: -40,
          y: -120
        }, {
          x: -35,
          y: -134
        }, {
          x: -38,
          y: -149
        }, {
          x: -38,
          y: -161
        }, {
          x: -50,
          y: -163
        }, {
          x: -60,
          y: -167
        }, {
          x: -65,
          y: -179
        }, {
          x: -72,
          y: -188
        }, {
          x: -87,
          y: -192
        }, {
          x: -100,
          y: -200
        }, {
          x: -112,
          y: -219
        }, {
          x: -124,
          y: -241
        }, {
          x: -132,
          y: -268
        }, {
          x: -132,
          y: -279
        }, {
          x: -123,
          y: -269
        }, {
          x: -118,
          y: -256
        }, {
          x: -113,
          y: -243
        }, {
          x: -107,
          y: -243
        }, {
          x: -101,
          y: -253
        }, {
          x: -101,
          y: -269
        }, {
          x: -94,
          y: -251
        }, {
          x: -96,
          y: -238
        }, {
          x: -98,
          y: -227
        }, {
          x: -94,
          y: -218
        }, {
          x: -87,
          y: -208
        }, {
          x: -78,
          y: -202
        }, {
          x: -63,
          y: -196
        }, {
          x: -53,
          y: -189
        }, {
          x: -43,
          y: -186
        }, {
          x: -36,
          y: -192
        }, {
          x: -32,
          y: -208
        }, {
          x: -28,
          y: -188
        }, {
          x: -21,
          y: -181
        }, {
          x: -12,
          y: -184
        }, {
          x: -7,
          y: -205
        }, {
          x: -1,
          y: -193
        }, {
          x: 14,
          y: -197
        }, {
          x: 18,
          y: -208
        }, {
          x: 28,
          y: -211
        }, {
          x: 40,
          y: -222
        }, {
          x: 47,
          y: -234
        }, {
          x: 51,
          y: -249
        }, {
          x: 47,
          y: -259
        }, {
          x: 34,
          y: -279
        }, {
          x: 48,
          y: -272
        }, {
          x: 57,
          y: -264
        }, {
          x: 65,
          y: -271
        }, {
          x: 68,
          y: -292
        }, {
          x: 75,
          y: -270
        }, {
          x: 68,
          y: -258
        }, {
          x: 63,
          y: -246
        }, {
          x: 58,
          y: -226
        }, {
          x: 49,
          y: -210
        }, {
          x: 35,
          y: -200
        }, {
          x: 21,
          y: -193
        }, {
          x: 20,
          y: -184
        }, {
          x: 12,
          y: -174
        }, {
          x: 2,
          y: -166
        }, {
          x: 4,
          y: -150
        }, {
          x: 5,
          y: -133
        }, {
          x: 9,
          y: -119
        }, {
          x: 10,
          y: -108
        }, {
          x: 8,
          y: -100
        }, {
          x: 22,
          y: -88
        }, {
          x: 30,
          y: -72
        }, {
          x: 37,
          y: -47
        }, {
          x: 46,
          y: -19
        }, {
          x: 45,
          y: -2
        }, {
          x: 41,
          y: 14
        }, {
          x: 50,
          y: 26
        }, {
          x: 58,
          y: 42
        }, {
          x: 66,
          y: 60
        }, {
          x: 76,
          y: 78
        }, {
          x: 83,
          y: 95
        }, {
          x: 92,
          y: 119
        }, {
          x: 96,
          y: 144
        }, {
          x: 94,
          y: 169
        }, {
          x: 93,
          y: 196
        }, {
          x: 95,
          y: 212
        }, {
          x: 95,
          y: 223
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 72,
          y: 247
        }, {
          x: 74,
          y: 231
        }, {
          x: 66,
          y: 231
        }, {
          x: 64,
          y: 212
        }, {
          x: 66,
          y: 191
        }, {
          x: 63,
          y: 172
        }, {
          x: 62,
          y: 153
        }, {
          x: 62,
          y: 137
        }, {
          x: 52,
          y: 123
        }, {
          x: 45,
          y: 110
        }, {
          x: 37,
          y: 97
        }, {
          x: 31,
          y: 86
        }, {
          x: 22,
          y: 79
        }, {
          x: 22,
          y: 95
        }, {
          x: 24,
          y: 112
        }, {
          x: 27,
          y: 131
        }, {
          x: 27,
          y: 150
        }, {
          x: 24,
          y: 163
        }, {
          x: 13,
          y: 182
        }, {
          x: 2,
          y: 201
        }, {
          x: -5,
          y: 214
        }, {
          x: -15,
          y: 232
        }, {
          x: -23,
          y: 248
        }, {
          x: -32,
          y: 246
        }, {
          x: -39,
          y: 244
        }, {
          x: -47,
          y: 250
        }, {
          x: -50,
          y: 256
        }, {
          x: -54,
          y: 269
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[2] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -77,
          y: 253
        }, {
          x: -68,
          y: 246
        }, {
          x: -59,
          y: 238
        }, {
          x: -48,
          y: 232
        }, {
          x: -43,
          y: 219
        }, {
          x: -32,
          y: 198
        }, {
          x: -24,
          y: 178
        }, {
          x: -16,
          y: 166
        }, {
          x: -8,
          y: 154
        }, {
          x: -14,
          y: 127
        }, {
          x: -21,
          y: 103
        }, {
          x: -28,
          y: 79
        }, {
          x: -37,
          y: 60
        }, {
          x: -39,
          y: 45
        }, {
          x: -37,
          y: 32
        }, {
          x: -37,
          y: 25
        }, {
          x: -64,
          y: 16
        }, {
          x: -82,
          y: 5
        }, {
          x: -94,
          y: -3
        }, {
          x: -98,
          y: -16
        }, {
          x: -93,
          y: -35
        }, {
          x: -86,
          y: -48
        }, {
          x: -81,
          y: -64
        }, {
          x: -78,
          y: -78
        }, {
          x: -66,
          y: -89
        }, {
          x: -42,
          y: -97
        }, {
          x: -40,
          y: -116
        }, {
          x: -35,
          y: -130
        }, {
          x: -38,
          y: -145
        }, {
          x: -38,
          y: -157
        }, {
          x: -50,
          y: -159
        }, {
          x: -60,
          y: -163
        }, {
          x: -65,
          y: -175
        }, {
          x: -72,
          y: -184
        }, {
          x: -87,
          y: -188
        }, {
          x: -100,
          y: -196
        }, {
          x: -112,
          y: -215
        }, {
          x: -124,
          y: -237
        }, {
          x: -132,
          y: -264
        }, {
          x: -132,
          y: -275
        }, {
          x: -123,
          y: -265
        }, {
          x: -118,
          y: -252
        }, {
          x: -113,
          y: -239
        }, {
          x: -107,
          y: -239
        }, {
          x: -101,
          y: -249
        }, {
          x: -101,
          y: -265
        }, {
          x: -94,
          y: -247
        }, {
          x: -96,
          y: -234
        }, {
          x: -98,
          y: -223
        }, {
          x: -94,
          y: -214
        }, {
          x: -87,
          y: -204
        }, {
          x: -78,
          y: -198
        }, {
          x: -63,
          y: -192
        }, {
          x: -53,
          y: -185
        }, {
          x: -43,
          y: -182
        }, {
          x: -36,
          y: -188
        }, {
          x: -32,
          y: -204
        }, {
          x: -28,
          y: -184
        }, {
          x: -21,
          y: -177
        }, {
          x: -12,
          y: -180
        }, {
          x: -7,
          y: -201
        }, {
          x: -1,
          y: -189
        }, {
          x: 14,
          y: -193
        }, {
          x: 18,
          y: -204
        }, {
          x: 28,
          y: -207
        }, {
          x: 40,
          y: -218
        }, {
          x: 47,
          y: -230
        }, {
          x: 51,
          y: -245
        }, {
          x: 47,
          y: -255
        }, {
          x: 34,
          y: -275
        }, {
          x: 48,
          y: -268
        }, {
          x: 57,
          y: -260
        }, {
          x: 65,
          y: -267
        }, {
          x: 68,
          y: -288
        }, {
          x: 75,
          y: -266
        }, {
          x: 68,
          y: -254
        }, {
          x: 63,
          y: -242
        }, {
          x: 58,
          y: -222
        }, {
          x: 49,
          y: -206
        }, {
          x: 35,
          y: -196
        }, {
          x: 21,
          y: -189
        }, {
          x: 20,
          y: -180
        }, {
          x: 12,
          y: -170
        }, {
          x: 2,
          y: -162
        }, {
          x: 4,
          y: -146
        }, {
          x: 5,
          y: -129
        }, {
          x: 10,
          y: -114
        }, {
          x: 12,
          y: -101
        }, {
          x: 10,
          y: -91
        }, {
          x: 23,
          y: -80
        }, {
          x: 28,
          y: -63
        }, {
          x: 36,
          y: -42
        }, {
          x: 43,
          y: -16
        }, {
          x: 44,
          y: 2
        }, {
          x: 42,
          y: 20
        }, {
          x: 51,
          y: 34
        }, {
          x: 59,
          y: 47
        }, {
          x: 67,
          y: 61
        }, {
          x: 77,
          y: 80
        }, {
          x: 87,
          y: 99
        }, {
          x: 95,
          y: 121
        }, {
          x: 98,
          y: 147
        }, {
          x: 96,
          y: 170
        }, {
          x: 95,
          y: 197
        }, {
          x: 97,
          y: 214
        }, {
          x: 98,
          y: 225
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 247
        }, {
          x: 75,
          y: 232
        }, {
          x: 69,
          y: 230
        }, {
          x: 69,
          y: 212
        }, {
          x: 69,
          y: 191
        }, {
          x: 66,
          y: 172
        }, {
          x: 65,
          y: 156
        }, {
          x: 65,
          y: 141
        }, {
          x: 54,
          y: 122
        }, {
          x: 47,
          y: 111
        }, {
          x: 37,
          y: 97
        }, {
          x: 29,
          y: 87
        }, {
          x: 17,
          y: 75
        }, {
          x: 18,
          y: 96
        }, {
          x: 20,
          y: 115
        }, {
          x: 24,
          y: 132
        }, {
          x: 27,
          y: 152
        }, {
          x: 24,
          y: 166
        }, {
          x: 14,
          y: 185
        }, {
          x: 4,
          y: 203
        }, {
          x: -4,
          y: 216
        }, {
          x: -13,
          y: 234
        }, {
          x: -23,
          y: 252
        }, {
          x: -29,
          y: 248
        }, {
          x: -35,
          y: 248
        }, {
          x: -42,
          y: 253
        }, {
          x: -46,
          y: 262
        }, {
          x: -52,
          y: 270
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[3] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -77,
          y: 253
        }, {
          x: -68,
          y: 246
        }, {
          x: -59,
          y: 238
        }, {
          x: -48,
          y: 232
        }, {
          x: -43,
          y: 219
        }, {
          x: -32,
          y: 198
        }, {
          x: -24,
          y: 178
        }, {
          x: -16,
          y: 166
        }, {
          x: -8,
          y: 154
        }, {
          x: -14,
          y: 127
        }, {
          x: -21,
          y: 103
        }, {
          x: -28,
          y: 79
        }, {
          x: -37,
          y: 60
        }, {
          x: -39,
          y: 45
        }, {
          x: -37,
          y: 37
        }, {
          x: -38,
          y: 29
        }, {
          x: -64,
          y: 18
        }, {
          x: -83,
          y: 10
        }, {
          x: -95,
          y: -1
        }, {
          x: -98,
          y: -16
        }, {
          x: -93,
          y: -35
        }, {
          x: -86,
          y: -48
        }, {
          x: -81,
          y: -64
        }, {
          x: -79,
          y: -77
        }, {
          x: -67,
          y: -87
        }, {
          x: -43,
          y: -94
        }, {
          x: -40,
          y: -111
        }, {
          x: -35,
          y: -125
        }, {
          x: -38,
          y: -140
        }, {
          x: -38,
          y: -152
        }, {
          x: -50,
          y: -154
        }, {
          x: -60,
          y: -158
        }, {
          x: -65,
          y: -170
        }, {
          x: -72,
          y: -179
        }, {
          x: -87,
          y: -183
        }, {
          x: -100,
          y: -191
        }, {
          x: -112,
          y: -210
        }, {
          x: -124,
          y: -232
        }, {
          x: -132,
          y: -259
        }, {
          x: -132,
          y: -270
        }, {
          x: -123,
          y: -260
        }, {
          x: -118,
          y: -247
        }, {
          x: -113,
          y: -234
        }, {
          x: -107,
          y: -234
        }, {
          x: -101,
          y: -244
        }, {
          x: -101,
          y: -260
        }, {
          x: -94,
          y: -242
        }, {
          x: -96,
          y: -229
        }, {
          x: -98,
          y: -218
        }, {
          x: -94,
          y: -209
        }, {
          x: -87,
          y: -199
        }, {
          x: -78,
          y: -193
        }, {
          x: -63,
          y: -187
        }, {
          x: -53,
          y: -180
        }, {
          x: -43,
          y: -177
        }, {
          x: -36,
          y: -183
        }, {
          x: -32,
          y: -199
        }, {
          x: -28,
          y: -179
        }, {
          x: -21,
          y: -172
        }, {
          x: -12,
          y: -175
        }, {
          x: -7,
          y: -196
        }, {
          x: -1,
          y: -184
        }, {
          x: 14,
          y: -188
        }, {
          x: 18,
          y: -199
        }, {
          x: 28,
          y: -202
        }, {
          x: 40,
          y: -213
        }, {
          x: 47,
          y: -225
        }, {
          x: 51,
          y: -240
        }, {
          x: 47,
          y: -250
        }, {
          x: 34,
          y: -270
        }, {
          x: 48,
          y: -263
        }, {
          x: 57,
          y: -255
        }, {
          x: 65,
          y: -262
        }, {
          x: 68,
          y: -283
        }, {
          x: 75,
          y: -261
        }, {
          x: 68,
          y: -249
        }, {
          x: 63,
          y: -237
        }, {
          x: 58,
          y: -217
        }, {
          x: 49,
          y: -201
        }, {
          x: 35,
          y: -191
        }, {
          x: 21,
          y: -184
        }, {
          x: 20,
          y: -175
        }, {
          x: 12,
          y: -165
        }, {
          x: 2,
          y: -157
        }, {
          x: 4,
          y: -141
        }, {
          x: 5,
          y: -124
        }, {
          x: 9,
          y: -110
        }, {
          x: 11,
          y: -98
        }, {
          x: 9,
          y: -86
        }, {
          x: 22,
          y: -77
        }, {
          x: 30,
          y: -62
        }, {
          x: 36,
          y: -42
        }, {
          x: 43,
          y: -16
        }, {
          x: 44,
          y: 2
        }, {
          x: 42,
          y: 20
        }, {
          x: 51,
          y: 34
        }, {
          x: 59,
          y: 47
        }, {
          x: 67,
          y: 61
        }, {
          x: 77,
          y: 80
        }, {
          x: 87,
          y: 99
        }, {
          x: 95,
          y: 121
        }, {
          x: 98,
          y: 147
        }, {
          x: 96,
          y: 170
        }, {
          x: 95,
          y: 197
        }, {
          x: 97,
          y: 214
        }, {
          x: 98,
          y: 225
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 247
        }, {
          x: 75,
          y: 232
        }, {
          x: 69,
          y: 230
        }, {
          x: 69,
          y: 212
        }, {
          x: 69,
          y: 191
        }, {
          x: 66,
          y: 172
        }, {
          x: 65,
          y: 156
        }, {
          x: 65,
          y: 141
        }, {
          x: 54,
          y: 122
        }, {
          x: 47,
          y: 111
        }, {
          x: 37,
          y: 97
        }, {
          x: 29,
          y: 87
        }, {
          x: 17,
          y: 75
        }, {
          x: 18,
          y: 96
        }, {
          x: 20,
          y: 115
        }, {
          x: 24,
          y: 132
        }, {
          x: 27,
          y: 152
        }, {
          x: 24,
          y: 166
        }, {
          x: 14,
          y: 185
        }, {
          x: 4,
          y: 203
        }, {
          x: -4,
          y: 216
        }, {
          x: -13,
          y: 234
        }, {
          x: -23,
          y: 252
        }, {
          x: -29,
          y: 248
        }, {
          x: -35,
          y: 248
        }, {
          x: -42,
          y: 253
        }, {
          x: -46,
          y: 262
        }, {
          x: -52,
          y: 270
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[4] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -76,
          y: 254
        }, {
          x: -67,
          y: 247
        }, {
          x: -58,
          y: 241
        }, {
          x: -48,
          y: 234
        }, {
          x: -43,
          y: 219
        }, {
          x: -34,
          y: 205
        }, {
          x: -22,
          y: 180
        }, {
          x: -14,
          y: 167
        }, {
          x: -8,
          y: 159
        }, {
          x: -16,
          y: 131
        }, {
          x: -22,
          y: 107
        }, {
          x: -29,
          y: 85
        }, {
          x: -37,
          y: 68
        }, {
          x: -41,
          y: 53
        }, {
          x: -44,
          y: 45
        }, {
          x: -42,
          y: 35
        }, {
          x: -64,
          y: 28
        }, {
          x: -83,
          y: 17
        }, {
          x: -94,
          y: 4
        }, {
          x: -98,
          y: -13
        }, {
          x: -92,
          y: -31
        }, {
          x: -86,
          y: -45
        }, {
          x: -81,
          y: -59
        }, {
          x: -76,
          y: -73
        }, {
          x: -65,
          y: -81
        }, {
          x: -42,
          y: -87
        }, {
          x: -40,
          y: -101
        }, {
          x: -35,
          y: -115
        }, {
          x: -38,
          y: -130
        }, {
          x: -38,
          y: -142
        }, {
          x: -50,
          y: -144
        }, {
          x: -60,
          y: -148
        }, {
          x: -65,
          y: -160
        }, {
          x: -72,
          y: -169
        }, {
          x: -87,
          y: -173
        }, {
          x: -100,
          y: -181
        }, {
          x: -112,
          y: -200
        }, {
          x: -124,
          y: -222
        }, {
          x: -132,
          y: -249
        }, {
          x: -132,
          y: -260
        }, {
          x: -123,
          y: -250
        }, {
          x: -118,
          y: -237
        }, {
          x: -113,
          y: -224
        }, {
          x: -107,
          y: -224
        }, {
          x: -101,
          y: -234
        }, {
          x: -101,
          y: -250
        }, {
          x: -94,
          y: -232
        }, {
          x: -96,
          y: -219
        }, {
          x: -98,
          y: -208
        }, {
          x: -94,
          y: -199
        }, {
          x: -87,
          y: -189
        }, {
          x: -78,
          y: -183
        }, {
          x: -63,
          y: -177
        }, {
          x: -53,
          y: -170
        }, {
          x: -43,
          y: -167
        }, {
          x: -36,
          y: -173
        }, {
          x: -32,
          y: -189
        }, {
          x: -28,
          y: -169
        }, {
          x: -21,
          y: -162
        }, {
          x: -12,
          y: -165
        }, {
          x: -7,
          y: -186
        }, {
          x: -1,
          y: -174
        }, {
          x: 14,
          y: -178
        }, {
          x: 18,
          y: -189
        }, {
          x: 28,
          y: -192
        }, {
          x: 40,
          y: -203
        }, {
          x: 47,
          y: -215
        }, {
          x: 51,
          y: -230
        }, {
          x: 47,
          y: -240
        }, {
          x: 34,
          y: -260
        }, {
          x: 48,
          y: -253
        }, {
          x: 57,
          y: -245
        }, {
          x: 65,
          y: -252
        }, {
          x: 68,
          y: -273
        }, {
          x: 75,
          y: -251
        }, {
          x: 68,
          y: -239
        }, {
          x: 63,
          y: -227
        }, {
          x: 58,
          y: -207
        }, {
          x: 49,
          y: -191
        }, {
          x: 35,
          y: -181
        }, {
          x: 21,
          y: -174
        }, {
          x: 20,
          y: -165
        }, {
          x: 12,
          y: -155
        }, {
          x: 2,
          y: -147
        }, {
          x: 4,
          y: -131
        }, {
          x: 6,
          y: -114
        }, {
          x: 9,
          y: -101
        }, {
          x: 11,
          y: -88
        }, {
          x: 9,
          y: -77
        }, {
          x: 21,
          y: -68
        }, {
          x: 30,
          y: -52
        }, {
          x: 35,
          y: -30
        }, {
          x: 43,
          y: -8
        }, {
          x: 46,
          y: 11
        }, {
          x: 41,
          y: 23
        }, {
          x: 45,
          y: 33
        }, {
          x: 55,
          y: 47
        }, {
          x: 63,
          y: 60
        }, {
          x: 75,
          y: 77
        }, {
          x: 88,
          y: 99
        }, {
          x: 98,
          y: 121
        }, {
          x: 101,
          y: 143
        }, {
          x: 101,
          y: 169
        }, {
          x: 101,
          y: 197
        }, {
          x: 101,
          y: 213
        }, {
          x: 103,
          y: 225
        }, {
          x: 107,
          y: 230
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 246
        }, {
          x: 129,
          y: 256
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 247
        }, {
          x: 75,
          y: 236
        }, {
          x: 72,
          y: 230
        }, {
          x: 75,
          y: 212
        }, {
          x: 72,
          y: 188
        }, {
          x: 70,
          y: 170
        }, {
          x: 69,
          y: 156
        }, {
          x: 66,
          y: 140
        }, {
          x: 57,
          y: 122
        }, {
          x: 48,
          y: 109
        }, {
          x: 39,
          y: 99
        }, {
          x: 27,
          y: 88
        }, {
          x: 15,
          y: 76
        }, {
          x: 14,
          y: 95
        }, {
          x: 18,
          y: 117
        }, {
          x: 22,
          y: 135
        }, {
          x: 25,
          y: 152
        }, {
          x: 23,
          y: 169
        }, {
          x: 15,
          y: 188
        }, {
          x: 6,
          y: 204
        }, {
          x: -4,
          y: 219
        }, {
          x: -14,
          y: 239
        }, {
          x: -23,
          y: 253
        }, {
          x: -30,
          y: 250
        }, {
          x: -35,
          y: 250
        }, {
          x: -39,
          y: 254
        }, {
          x: -44,
          y: 263
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[5] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -76,
          y: 254
        }, {
          x: -69,
          y: 245
        }, {
          x: -59,
          y: 239
        }, {
          x: -50,
          y: 231
        }, {
          x: -43,
          y: 219
        }, {
          x: -33,
          y: 200
        }, {
          x: -23,
          y: 181
        }, {
          x: -15,
          y: 169
        }, {
          x: -10,
          y: 158
        }, {
          x: -18,
          y: 133
        }, {
          x: -25,
          y: 110
        }, {
          x: -34,
          y: 89
        }, {
          x: -42,
          y: 69
        }, {
          x: -44,
          y: 57
        }, {
          x: -44,
          y: 48
        }, {
          x: -44,
          y: 47
        }, {
          x: -66,
          y: 35
        }, {
          x: -83,
          y: 21
        }, {
          x: -93,
          y: 9
        }, {
          x: -98,
          y: -7
        }, {
          x: -89,
          y: -27
        }, {
          x: -84,
          y: -43
        }, {
          x: -79,
          y: -58
        }, {
          x: -74,
          y: -70
        }, {
          x: -66,
          y: -76
        }, {
          x: -43,
          y: -84
        }, {
          x: -40,
          y: -101
        }, {
          x: -36,
          y: -116
        }, {
          x: -38,
          y: -130
        }, {
          x: -38,
          y: -142
        }, {
          x: -50,
          y: -144
        }, {
          x: -60,
          y: -148
        }, {
          x: -66,
          y: -158
        }, {
          x: -73,
          y: -165
        }, {
          x: -86,
          y: -170
        }, {
          x: -100,
          y: -178
        }, {
          x: -114,
          y: -195
        }, {
          x: -128,
          y: -219
        }, {
          x: -135,
          y: -241
        }, {
          x: -137,
          y: -257
        }, {
          x: -127,
          y: -248
        }, {
          x: -121,
          y: -234
        }, {
          x: -116,
          y: -224
        }, {
          x: -108,
          y: -217
        }, {
          x: -104,
          y: -233
        }, {
          x: -105,
          y: -251
        }, {
          x: -98,
          y: -234
        }, {
          x: -99,
          y: -218
        }, {
          x: -100,
          y: -204
        }, {
          x: -96,
          y: -194
        }, {
          x: -88,
          y: -188
        }, {
          x: -78,
          y: -181
        }, {
          x: -65,
          y: -177
        }, {
          x: -55,
          y: -168
        }, {
          x: -43,
          y: -167
        }, {
          x: -36,
          y: -173
        }, {
          x: -32,
          y: -189
        }, {
          x: -28,
          y: -169
        }, {
          x: -18,
          y: -162
        }, {
          x: -10,
          y: -165
        }, {
          x: -5,
          y: -185
        }, {
          x: 1,
          y: -173
        }, {
          x: 12,
          y: -176
        }, {
          x: 15,
          y: -185
        }, {
          x: 25,
          y: -190
        }, {
          x: 37,
          y: -197
        }, {
          x: 45,
          y: -208
        }, {
          x: 49,
          y: -222
        }, {
          x: 45,
          y: -234
        }, {
          x: 34,
          y: -253
        }, {
          x: 49,
          y: -245
        }, {
          x: 55,
          y: -236
        }, {
          x: 60,
          y: -246
        }, {
          x: 60,
          y: -268
        }, {
          x: 68,
          y: -247
        }, {
          x: 66,
          y: -230
        }, {
          x: 62,
          y: -217
        }, {
          x: 55,
          y: -202
        }, {
          x: 46,
          y: -188
        }, {
          x: 33,
          y: -179
        }, {
          x: 21,
          y: -168
        }, {
          x: 20,
          y: -157
        }, {
          x: 13,
          y: -150
        }, {
          x: 4,
          y: -143
        }, {
          x: 6,
          y: -130
        }, {
          x: 7,
          y: -114
        }, {
          x: 9,
          y: -100
        }, {
          x: 11,
          y: -88
        }, {
          x: 8,
          y: -78
        }, {
          x: 24,
          y: -68
        }, {
          x: 31,
          y: -52
        }, {
          x: 34,
          y: -32
        }, {
          x: 40,
          y: -14
        }, {
          x: 43,
          y: 3
        }, {
          x: 45,
          y: 18
        }, {
          x: 40,
          y: 33
        }, {
          x: 49,
          y: 47
        }, {
          x: 62,
          y: 63
        }, {
          x: 75,
          y: 81
        }, {
          x: 89,
          y: 103
        }, {
          x: 98,
          y: 120
        }, {
          x: 103,
          y: 141
        }, {
          x: 105,
          y: 170
        }, {
          x: 106,
          y: 196
        }, {
          x: 109,
          y: 225
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 246
        }, {
          x: 129,
          y: 256
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 244
        }, {
          x: 77,
          y: 236
        }, {
          x: 73,
          y: 231
        }, {
          x: 76,
          y: 213
        }, {
          x: 73,
          y: 189
        }, {
          x: 72,
          y: 173
        }, {
          x: 69,
          y: 156
        }, {
          x: 67,
          y: 140
        }, {
          x: 60,
          y: 124
        }, {
          x: 49,
          y: 111
        }, {
          x: 38,
          y: 101
        }, {
          x: 28,
          y: 90
        }, {
          x: 12,
          y: 78
        }, {
          x: 12,
          y: 94
        }, {
          x: 15,
          y: 114
        }, {
          x: 20,
          y: 136
        }, {
          x: 25,
          y: 153
        }, {
          x: 22,
          y: 172
        }, {
          x: 15,
          y: 191
        }, {
          x: 6,
          y: 204
        }, {
          x: -4,
          y: 223
        }, {
          x: -13,
          y: 239
        }, {
          x: -23,
          y: 253
        }, {
          x: -32,
          y: 246
        }, {
          x: -37,
          y: 247
        }, {
          x: -42,
          y: 255
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[6] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -76,
          y: 254
        }, {
          x: -69,
          y: 245
        }, {
          x: -59,
          y: 239
        }, {
          x: -50,
          y: 231
        }, {
          x: -43,
          y: 219
        }, {
          x: -35,
          y: 200
        }, {
          x: -25,
          y: 181
        }, {
          x: -17,
          y: 170
        }, {
          x: -13,
          y: 157
        }, {
          x: -20,
          y: 135
        }, {
          x: -28,
          y: 111
        }, {
          x: -38,
          y: 90
        }, {
          x: -46,
          y: 72
        }, {
          x: -49,
          y: 64
        }, {
          x: -49,
          y: 54
        }, {
          x: -46,
          y: 49
        }, {
          x: -66,
          y: 37
        }, {
          x: -83,
          y: 22
        }, {
          x: -93,
          y: 9
        }, {
          x: -98,
          y: -6
        }, {
          x: -89,
          y: -26
        }, {
          x: -84,
          y: -43
        }, {
          x: -79,
          y: -58
        }, {
          x: -74,
          y: -68
        }, {
          x: -66,
          y: -74
        }, {
          x: -44,
          y: -82
        }, {
          x: -40,
          y: -101
        }, {
          x: -36,
          y: -116
        }, {
          x: -38,
          y: -130
        }, {
          x: -42,
          y: -136
        }, {
          x: -50,
          y: -140
        }, {
          x: -59,
          y: -142
        }, {
          x: -69,
          y: -151
        }, {
          x: -75,
          y: -158
        }, {
          x: -87,
          y: -165
        }, {
          x: -102,
          y: -175
        }, {
          x: -114,
          y: -191
        }, {
          x: -128,
          y: -213
        }, {
          x: -136,
          y: -234
        }, {
          x: -140,
          y: -251
        }, {
          x: -129,
          y: -241
        }, {
          x: -124,
          y: -232
        }, {
          x: -118,
          y: -221
        }, {
          x: -112,
          y: -211
        }, {
          x: -107,
          y: -226
        }, {
          x: -109,
          y: -243
        }, {
          x: -101,
          y: -230
        }, {
          x: -102,
          y: -216
        }, {
          x: -106,
          y: -203
        }, {
          x: -97,
          y: -192
        }, {
          x: -94,
          y: -184
        }, {
          x: -84,
          y: -175
        }, {
          x: -71,
          y: -170
        }, {
          x: -56,
          y: -163
        }, {
          x: -43,
          y: -158
        }, {
          x: -36,
          y: -168
        }, {
          x: -32,
          y: -179
        }, {
          x: -26,
          y: -165
        }, {
          x: -18,
          y: -153
        }, {
          x: -9,
          y: -159
        }, {
          x: -5,
          y: -178
        }, {
          x: 3,
          y: -162
        }, {
          x: 13,
          y: -167
        }, {
          x: 15,
          y: -175
        }, {
          x: 28,
          y: -184
        }, {
          x: 37,
          y: -192
        }, {
          x: 43,
          y: -202
        }, {
          x: 46,
          y: -217
        }, {
          x: 43,
          y: -233
        }, {
          x: 34,
          y: -249
        }, {
          x: 46,
          y: -241
        }, {
          x: 52,
          y: -227
        }, {
          x: 56,
          y: -245
        }, {
          x: 50,
          y: -264
        }, {
          x: 62,
          y: -236
        }, {
          x: 63,
          y: -224
        }, {
          x: 56,
          y: -209
        }, {
          x: 52,
          y: -196
        }, {
          x: 46,
          y: -183
        }, {
          x: 38,
          y: -170
        }, {
          x: 27,
          y: -164
        }, {
          x: 22,
          y: -154
        }, {
          x: 14,
          y: -144
        }, {
          x: 4,
          y: -138
        }, {
          x: 9,
          y: -128
        }, {
          x: 12,
          y: -118
        }, {
          x: 9,
          y: -100
        }, {
          x: 11,
          y: -88
        }, {
          x: 8,
          y: -74
        }, {
          x: 23,
          y: -64
        }, {
          x: 31,
          y: -48
        }, {
          x: 35,
          y: -29
        }, {
          x: 40,
          y: -10
        }, {
          x: 38,
          y: 6
        }, {
          x: 41,
          y: 20
        }, {
          x: 36,
          y: 36
        }, {
          x: 46,
          y: 51
        }, {
          x: 59,
          y: 66
        }, {
          x: 74,
          y: 85
        }, {
          x: 87,
          y: 104
        }, {
          x: 96,
          y: 119
        }, {
          x: 102,
          y: 139
        }, {
          x: 104,
          y: 167
        }, {
          x: 106,
          y: 196
        }, {
          x: 110,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 246
        }, {
          x: 129,
          y: 256
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 244
        }, {
          x: 77,
          y: 236
        }, {
          x: 73,
          y: 231
        }, {
          x: 76,
          y: 213
        }, {
          x: 73,
          y: 189
        }, {
          x: 72,
          y: 173
        }, {
          x: 69,
          y: 156
        }, {
          x: 66,
          y: 141
        }, {
          x: 58,
          y: 126
        }, {
          x: 45,
          y: 111
        }, {
          x: 33,
          y: 103
        }, {
          x: 21,
          y: 91
        }, {
          x: 6,
          y: 82
        }, {
          x: 6,
          y: 99
        }, {
          x: 11,
          y: 114
        }, {
          x: 17,
          y: 133
        }, {
          x: 22,
          y: 154
        }, {
          x: 20,
          y: 173
        }, {
          x: 15,
          y: 187
        }, {
          x: 3,
          y: 206
        }, {
          x: -6,
          y: 224
        }, {
          x: -14,
          y: 236
        }, {
          x: -23,
          y: 253
        }, {
          x: -32,
          y: 246
        }, {
          x: -37,
          y: 247
        }, {
          x: -42,
          y: 255
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[7] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -78,
          y: 253
        }, {
          x: -70,
          y: 243
        }, {
          x: -61,
          y: 238
        }, {
          x: -51,
          y: 228
        }, {
          x: -47,
          y: 215
        }, {
          x: -39,
          y: 198
        }, {
          x: -29,
          y: 181
        }, {
          x: -20,
          y: 169
        }, {
          x: -16,
          y: 158
        }, {
          x: -24,
          y: 136
        }, {
          x: -35,
          y: 115
        }, {
          x: -44,
          y: 92
        }, {
          x: -51,
          y: 77
        }, {
          x: -54,
          y: 66
        }, {
          x: -54,
          y: 54
        }, {
          x: -53,
          y: 48
        }, {
          x: -67,
          y: 38
        }, {
          x: -83,
          y: 23
        }, {
          x: -92,
          y: 12
        }, {
          x: -98,
          y: -3
        }, {
          x: -89,
          y: -25
        }, {
          x: -82,
          y: -43
        }, {
          x: -77,
          y: -57
        }, {
          x: -73,
          y: -66
        }, {
          x: -65,
          y: -75
        }, {
          x: -41,
          y: -86
        }, {
          x: -36,
          y: -100
        }, {
          x: -35,
          y: -114
        }, {
          x: -38,
          y: -126
        }, {
          x: -42,
          y: -134
        }, {
          x: -51,
          y: -135
        }, {
          x: -59,
          y: -140
        }, {
          x: -69,
          y: -151
        }, {
          x: -75,
          y: -158
        }, {
          x: -92,
          y: -169
        }, {
          x: -108,
          y: -181
        }, {
          x: -118,
          y: -196
        }, {
          x: -128,
          y: -214
        }, {
          x: -133,
          y: -233
        }, {
          x: -135,
          y: -249
        }, {
          x: -125,
          y: -238
        }, {
          x: -121,
          y: -229
        }, {
          x: -116,
          y: -219
        }, {
          x: -111,
          y: -212
        }, {
          x: -108,
          y: -221
        }, {
          x: -112,
          y: -244
        }, {
          x: -103,
          y: -226
        }, {
          x: -101,
          y: -216
        }, {
          x: -102,
          y: -199
        }, {
          x: -97,
          y: -189
        }, {
          x: -87,
          y: -183
        }, {
          x: -77,
          y: -174
        }, {
          x: -66,
          y: -168
        }, {
          x: -51,
          y: -163
        }, {
          x: -36,
          y: -158
        }, {
          x: -32,
          y: -164
        }, {
          x: -26,
          y: -179
        }, {
          x: -23,
          y: -164
        }, {
          x: -14,
          y: -151
        }, {
          x: -10,
          y: -159
        }, {
          x: -8,
          y: -179
        }, {
          x: -1,
          y: -160
        }, {
          x: 11,
          y: -167
        }, {
          x: 15,
          y: -176
        }, {
          x: 23,
          y: -183
        }, {
          x: 28,
          y: -191
        }, {
          x: 30,
          y: -201
        }, {
          x: 30,
          y: -210
        }, {
          x: 26,
          y: -226
        }, {
          x: 18,
          y: -244
        }, {
          x: 31,
          y: -231
        }, {
          x: 37,
          y: -218
        }, {
          x: 41,
          y: -233
        }, {
          x: 34,
          y: -253
        }, {
          x: 48,
          y: -232
        }, {
          x: 48,
          y: -211
        }, {
          x: 44,
          y: -200
        }, {
          x: 42,
          y: -189
        }, {
          x: 38,
          y: -178
        }, {
          x: 32,
          y: -170
        }, {
          x: 27,
          y: -164
        }, {
          x: 21,
          y: -152
        }, {
          x: 17,
          y: -142
        }, {
          x: 6,
          y: -138
        }, {
          x: 17,
          y: -132
        }, {
          x: 22,
          y: -123
        }, {
          x: 19,
          y: -112
        }, {
          x: 9,
          y: -101
        }, {
          x: 8,
          y: -82
        }, {
          x: 24,
          y: -69
        }, {
          x: 31,
          y: -48
        }, {
          x: 35,
          y: -29
        }, {
          x: 38,
          y: -12
        }, {
          x: 36,
          y: 6
        }, {
          x: 40,
          y: 24
        }, {
          x: 33,
          y: 45
        }, {
          x: 43,
          y: 56
        }, {
          x: 56,
          y: 70
        }, {
          x: 69,
          y: 85
        }, {
          x: 85,
          y: 105
        }, {
          x: 96,
          y: 119
        }, {
          x: 101,
          y: 139
        }, {
          x: 103,
          y: 165
        }, {
          x: 106,
          y: 196
        }, {
          x: 111,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 248
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 73,
          y: 245
        }, {
          x: 73,
          y: 236
        }, {
          x: 71,
          y: 229
        }, {
          x: 75,
          y: 213
        }, {
          x: 71,
          y: 189
        }, {
          x: 68,
          y: 172
        }, {
          x: 68,
          y: 157
        }, {
          x: 63,
          y: 140
        }, {
          x: 55,
          y: 128
        }, {
          x: 43,
          y: 116
        }, {
          x: 32,
          y: 107
        }, {
          x: 17,
          y: 97
        }, {
          x: -1,
          y: 86
        }, {
          x: 1,
          y: 98
        }, {
          x: 5,
          y: 116
        }, {
          x: 11,
          y: 137
        }, {
          x: 18,
          y: 157
        }, {
          x: 17,
          y: 173
        }, {
          x: 11,
          y: 188
        }, {
          x: 1,
          y: 204
        }, {
          x: -10,
          y: 223
        }, {
          x: -16,
          y: 234
        }, {
          x: -25,
          y: 251
        }, {
          x: -32,
          y: 250
        }, {
          x: -37,
          y: 247
        }, {
          x: -42,
          y: 255
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[8] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -78,
          y: 253
        }, {
          x: -70,
          y: 243
        }, {
          x: -61,
          y: 238
        }, {
          x: -51,
          y: 228
        }, {
          x: -47,
          y: 215
        }, {
          x: -39,
          y: 198
        }, {
          x: -29,
          y: 181
        }, {
          x: -20,
          y: 169
        }, {
          x: -16,
          y: 158
        }, {
          x: -24,
          y: 136
        }, {
          x: -35,
          y: 115
        }, {
          x: -44,
          y: 92
        }, {
          x: -51,
          y: 77
        }, {
          x: -54,
          y: 66
        }, {
          x: -54,
          y: 54
        }, {
          x: -53,
          y: 48
        }, {
          x: -67,
          y: 38
        }, {
          x: -83,
          y: 23
        }, {
          x: -91,
          y: 10
        }, {
          x: -95,
          y: -4
        }, {
          x: -89,
          y: -25
        }, {
          x: -82,
          y: -43
        }, {
          x: -77,
          y: -57
        }, {
          x: -73,
          y: -66
        }, {
          x: -65,
          y: -75
        }, {
          x: -41,
          y: -86
        }, {
          x: -36,
          y: -100
        }, {
          x: -35,
          y: -114
        }, {
          x: -38,
          y: -126
        }, {
          x: -42,
          y: -134
        }, {
          x: -51,
          y: -135
        }, {
          x: -59,
          y: -140
        }, {
          x: -67,
          y: -151
        }, {
          x: -80,
          y: -157
        }, {
          x: -96,
          y: -167
        }, {
          x: -110,
          y: -178
        }, {
          x: -122,
          y: -191
        }, {
          x: -132,
          y: -203
        }, {
          x: -138,
          y: -220
        }, {
          x: -142,
          y: -248
        }, {
          x: -130,
          y: -233
        }, {
          x: -125,
          y: -222
        }, {
          x: -118,
          y: -211
        }, {
          x: -110,
          y: -201
        }, {
          x: -111,
          y: -213
        }, {
          x: -117,
          y: -236
        }, {
          x: -108,
          y: -224
        }, {
          x: -103,
          y: -211
        }, {
          x: -102,
          y: -199
        }, {
          x: -99,
          y: -187
        }, {
          x: -89,
          y: -179
        }, {
          x: -79,
          y: -171
        }, {
          x: -68,
          y: -165
        }, {
          x: -51,
          y: -163
        }, {
          x: -36,
          y: -156
        }, {
          x: -33,
          y: -164
        }, {
          x: -29,
          y: -176
        }, {
          x: -24,
          y: -165
        }, {
          x: -18,
          y: -153
        }, {
          x: -13,
          y: -159
        }, {
          x: -9,
          y: -174
        }, {
          x: -3,
          y: -158
        }, {
          x: 7,
          y: -162
        }, {
          x: 13,
          y: -173
        }, {
          x: 17,
          y: -182
        }, {
          x: 21,
          y: -191
        }, {
          x: 19,
          y: -202
        }, {
          x: 17,
          y: -210
        }, {
          x: 12,
          y: -218
        }, {
          x: 0,
          y: -238
        }, {
          x: 15,
          y: -226
        }, {
          x: 26,
          y: -211
        }, {
          x: 28,
          y: -222
        }, {
          x: 22,
          y: -243
        }, {
          x: 34,
          y: -227
        }, {
          x: 34,
          y: -212
        }, {
          x: 34,
          y: -202
        }, {
          x: 32,
          y: -194
        }, {
          x: 31,
          y: -185
        }, {
          x: 26,
          y: -174
        }, {
          x: 22,
          y: -164
        }, {
          x: 18,
          y: -155
        }, {
          x: 15,
          y: -145
        }, {
          x: 6,
          y: -138
        }, {
          x: 27,
          y: -129
        }, {
          x: 33,
          y: -120
        }, {
          x: 28,
          y: -110
        }, {
          x: 9,
          y: -101
        }, {
          x: 8,
          y: -82
        }, {
          x: 24,
          y: -69
        }, {
          x: 31,
          y: -48
        }, {
          x: 35,
          y: -29
        }, {
          x: 38,
          y: -12
        }, {
          x: 36,
          y: 7
        }, {
          x: 39,
          y: 23
        }, {
          x: 33,
          y: 45
        }, {
          x: 43,
          y: 56
        }, {
          x: 56,
          y: 70
        }, {
          x: 69,
          y: 85
        }, {
          x: 85,
          y: 105
        }, {
          x: 96,
          y: 119
        }, {
          x: 101,
          y: 139
        }, {
          x: 103,
          y: 165
        }, {
          x: 106,
          y: 196
        }, {
          x: 111,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 248
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 73,
          y: 245
        }, {
          x: 73,
          y: 236
        }, {
          x: 71,
          y: 229
        }, {
          x: 75,
          y: 213
        }, {
          x: 71,
          y: 189
        }, {
          x: 68,
          y: 172
        }, {
          x: 68,
          y: 157
        }, {
          x: 63,
          y: 140
        }, {
          x: 55,
          y: 128
        }, {
          x: 43,
          y: 116
        }, {
          x: 32,
          y: 107
        }, {
          x: 17,
          y: 97
        }, {
          x: -1,
          y: 86
        }, {
          x: 1,
          y: 98
        }, {
          x: 5,
          y: 116
        }, {
          x: 11,
          y: 137
        }, {
          x: 18,
          y: 157
        }, {
          x: 17,
          y: 173
        }, {
          x: 11,
          y: 188
        }, {
          x: 1,
          y: 204
        }, {
          x: -10,
          y: 223
        }, {
          x: -16,
          y: 234
        }, {
          x: -25,
          y: 251
        }, {
          x: -32,
          y: 250
        }, {
          x: -37,
          y: 247
        }, {
          x: -43,
          y: 253
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[9] = [
        {
          x: -78,
          y: 273
        }, {
          x: -82,
          y: 263
        }, {
          x: -80,
          y: 253
        }, {
          x: -72,
          y: 242
        }, {
          x: -63,
          y: 236
        }, {
          x: -58,
          y: 227
        }, {
          x: -54,
          y: 214
        }, {
          x: -45,
          y: 196
        }, {
          x: -36,
          y: 179
        }, {
          x: -28,
          y: 167
        }, {
          x: -22,
          y: 159
        }, {
          x: -28,
          y: 137
        }, {
          x: -39,
          y: 115
        }, {
          x: -48,
          y: 92
        }, {
          x: -53,
          y: 82
        }, {
          x: -58,
          y: 69
        }, {
          x: -61,
          y: 56
        }, {
          x: -61,
          y: 46
        }, {
          x: -67,
          y: 38
        }, {
          x: -83,
          y: 22
        }, {
          x: -91,
          y: 10
        }, {
          x: -95,
          y: -7
        }, {
          x: -87,
          y: -27
        }, {
          x: -80,
          y: -45
        }, {
          x: -77,
          y: -57
        }, {
          x: -71,
          y: -67
        }, {
          x: -61,
          y: -78
        }, {
          x: -39,
          y: -88
        }, {
          x: -36,
          y: -100
        }, {
          x: -35,
          y: -114
        }, {
          x: -37,
          y: -125
        }, {
          x: -41,
          y: -137
        }, {
          x: -51,
          y: -138
        }, {
          x: -60,
          y: -145
        }, {
          x: -66,
          y: -156
        }, {
          x: -79,
          y: -162
        }, {
          x: -96,
          y: -171
        }, {
          x: -109,
          y: -180
        }, {
          x: -124,
          y: -193
        }, {
          x: -134,
          y: -202
        }, {
          x: -143,
          y: -219
        }, {
          x: -150,
          y: -243
        }, {
          x: -135,
          y: -228
        }, {
          x: -130,
          y: -217
        }, {
          x: -123,
          y: -206
        }, {
          x: -113,
          y: -198
        }, {
          x: -113,
          y: -211
        }, {
          x: -122,
          y: -233
        }, {
          x: -109,
          y: -222
        }, {
          x: -105,
          y: -210
        }, {
          x: -103,
          y: -202
        }, {
          x: -99,
          y: -191
        }, {
          x: -91,
          y: -181
        }, {
          x: -78,
          y: -174
        }, {
          x: -63,
          y: -166
        }, {
          x: -48,
          y: -165
        }, {
          x: -36,
          y: -162
        }, {
          x: -32,
          y: -168
        }, {
          x: -29,
          y: -180
        }, {
          x: -24,
          y: -169
        }, {
          x: -19,
          y: -162
        }, {
          x: -17,
          y: -169
        }, {
          x: -14,
          y: -179
        }, {
          x: -9,
          y: -163
        }, {
          x: -4,
          y: -167
        }, {
          x: 0,
          y: -174
        }, {
          x: 1,
          y: -183
        }, {
          x: -2,
          y: -192
        }, {
          x: -6,
          y: -197
        }, {
          x: -14,
          y: -203
        }, {
          x: -22,
          y: -211
        }, {
          x: -36,
          y: -226
        }, {
          x: -24,
          y: -219
        }, {
          x: -9,
          y: -208
        }, {
          x: -7,
          y: -216
        }, {
          x: -13,
          y: -229
        }, {
          x: 0,
          y: -218
        }, {
          x: 6,
          y: -210
        }, {
          x: 8,
          y: -203
        }, {
          x: 11,
          y: -196
        }, {
          x: 12,
          y: -184
        }, {
          x: 13,
          y: -178
        }, {
          x: 15,
          y: -168
        }, {
          x: 11,
          y: -157
        }, {
          x: 4,
          y: -152
        }, {
          x: 5,
          y: -143
        }, {
          x: 35,
          y: -136
        }, {
          x: 42,
          y: -128
        }, {
          x: 38,
          y: -117
        }, {
          x: 14,
          y: -106
        }, {
          x: 12,
          y: -88
        }, {
          x: 29,
          y: -72
        }, {
          x: 31,
          y: -54
        }, {
          x: 32,
          y: -33
        }, {
          x: 30,
          y: -13
        }, {
          x: 30,
          y: 2
        }, {
          x: 36,
          y: 28
        }, {
          x: 25,
          y: 43
        }, {
          x: 39,
          y: 59
        }, {
          x: 53,
          y: 73
        }, {
          x: 70,
          y: 92
        }, {
          x: 84,
          y: 110
        }, {
          x: 95,
          y: 123
        }, {
          x: 98,
          y: 144
        }, {
          x: 100,
          y: 167
        }, {
          x: 104,
          y: 193
        }, {
          x: 111,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 248
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 72,
          y: 247
        }, {
          x: 72,
          y: 239
        }, {
          x: 69,
          y: 229
        }, {
          x: 72,
          y: 214
        }, {
          x: 68,
          y: 192
        }, {
          x: 66,
          y: 174
        }, {
          x: 64,
          y: 154
        }, {
          x: 63,
          y: 141
        }, {
          x: 51,
          y: 132
        }, {
          x: 41,
          y: 122
        }, {
          x: 28,
          y: 111
        }, {
          x: 12,
          y: 97
        }, {
          x: -7,
          y: 85
        }, {
          x: -4,
          y: 99
        }, {
          x: 1,
          y: 114
        }, {
          x: 9,
          y: 137
        }, {
          x: 13,
          y: 155
        }, {
          x: 11,
          y: 172
        }, {
          x: 4,
          y: 187
        }, {
          x: -5,
          y: 202
        }, {
          x: -14,
          y: 219
        }, {
          x: -21,
          y: 234
        }, {
          x: -31,
          y: 252
        }, {
          x: -38,
          y: 251
        }, {
          x: -45,
          y: 244
        }, {
          x: -49,
          y: 250
        }, {
          x: -50,
          y: 258
        }, {
          x: -53,
          y: 267
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[10] = [
        {
          x: -80,
          y: 273
        }, {
          x: -85,
          y: 267
        }, {
          x: -85,
          y: 256
        }, {
          x: -85,
          y: 241
        }, {
          x: -75,
          y: 229
        }, {
          x: -68,
          y: 213
        }, {
          x: -61,
          y: 200
        }, {
          x: -54,
          y: 188
        }, {
          x: -45,
          y: 174
        }, {
          x: -37,
          y: 163
        }, {
          x: -32,
          y: 154
        }, {
          x: -35,
          y: 136
        }, {
          x: -44,
          y: 118
        }, {
          x: -50,
          y: 98
        }, {
          x: -57,
          y: 85
        }, {
          x: -63,
          y: 74
        }, {
          x: -66,
          y: 56
        }, {
          x: -64,
          y: 41
        }, {
          x: -62,
          y: 31
        }, {
          x: -81,
          y: 20
        }, {
          x: -91,
          y: 8
        }, {
          x: -95,
          y: -10
        }, {
          x: -86,
          y: -32
        }, {
          x: -80,
          y: -48
        }, {
          x: -78,
          y: -61
        }, {
          x: -72,
          y: -71
        }, {
          x: -60,
          y: -81
        }, {
          x: -38,
          y: -91
        }, {
          x: -35,
          y: -103
        }, {
          x: -33,
          y: -117
        }, {
          x: -35,
          y: -130
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -149
        }, {
          x: -56,
          y: -158
        }, {
          x: -61,
          y: -166
        }, {
          x: -79,
          y: -177
        }, {
          x: -92,
          y: -187
        }, {
          x: -104,
          y: -198
        }, {
          x: -112,
          y: -205
        }, {
          x: -124,
          y: -213
        }, {
          x: -136,
          y: -224
        }, {
          x: -148,
          y: -243
        }, {
          x: -135,
          y: -236
        }, {
          x: -128,
          y: -229
        }, {
          x: -122,
          y: -223
        }, {
          x: -111,
          y: -216
        }, {
          x: -113,
          y: -228
        }, {
          x: -120,
          y: -243
        }, {
          x: -105,
          y: -230
        }, {
          x: -102,
          y: -220
        }, {
          x: -98,
          y: -209
        }, {
          x: -92,
          y: -202
        }, {
          x: -82,
          y: -193
        }, {
          x: -70,
          y: -184
        }, {
          x: -59,
          y: -179
        }, {
          x: -49,
          y: -176
        }, {
          x: -40,
          y: -171
        }, {
          x: -35,
          y: -169
        }, {
          x: -32,
          y: -181
        }, {
          x: -25,
          y: -168
        }, {
          x: -25,
          y: -162
        }, {
          x: -23,
          y: -171
        }, {
          x: -21,
          y: -180
        }, {
          x: -18,
          y: -164
        }, {
          x: -17,
          y: -170
        }, {
          x: -17,
          y: -173
        }, {
          x: -18,
          y: -178
        }, {
          x: -19,
          y: -184
        }, {
          x: -24,
          y: -191
        }, {
          x: -35,
          y: -198
        }, {
          x: -40,
          y: -203
        }, {
          x: -60,
          y: -218
        }, {
          x: -42,
          y: -211
        }, {
          x: -26,
          y: -201
        }, {
          x: -24,
          y: -209
        }, {
          x: -27,
          y: -219
        }, {
          x: -17,
          y: -210
        }, {
          x: -13,
          y: -203
        }, {
          x: -12,
          y: -197
        }, {
          x: -11,
          y: -190
        }, {
          x: -7,
          y: -181
        }, {
          x: -6,
          y: -169
        }, {
          x: 6,
          y: -173
        }, {
          x: 7,
          y: -163
        }, {
          x: 4,
          y: -154
        }, {
          x: 8,
          y: -145
        }, {
          x: 39,
          y: -140
        }, {
          x: 50,
          y: -132
        }, {
          x: 48,
          y: -122
        }, {
          x: 19,
          y: -107
        }, {
          x: 12,
          y: -93
        }, {
          x: 26,
          y: -80
        }, {
          x: 31,
          y: -59
        }, {
          x: 32,
          y: -39
        }, {
          x: 30,
          y: -21
        }, {
          x: 30,
          y: -4
        }, {
          x: 30,
          y: 25
        }, {
          x: 20,
          y: 46
        }, {
          x: 35,
          y: 60
        }, {
          x: 52,
          y: 77
        }, {
          x: 68,
          y: 95
        }, {
          x: 82,
          y: 113
        }, {
          x: 90,
          y: 126
        }, {
          x: 92,
          y: 146
        }, {
          x: 96,
          y: 169
        }, {
          x: 100,
          y: 192
        }, {
          x: 106,
          y: 223
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 247
        }, {
          x: 69,
          y: 239
        }, {
          x: 69,
          y: 229
        }, {
          x: 69,
          y: 215
        }, {
          x: 66,
          y: 196
        }, {
          x: 63,
          y: 174
        }, {
          x: 60,
          y: 157
        }, {
          x: 57,
          y: 143
        }, {
          x: 48,
          y: 133
        }, {
          x: 35,
          y: 123
        }, {
          x: 23,
          y: 111
        }, {
          x: 6,
          y: 98
        }, {
          x: -11,
          y: 85
        }, {
          x: -8,
          y: 100
        }, {
          x: -3,
          y: 116
        }, {
          x: 2,
          y: 135
        }, {
          x: 4,
          y: 153
        }, {
          x: 2,
          y: 171
        }, {
          x: -6,
          y: 186
        }, {
          x: -15,
          y: 201
        }, {
          x: -26,
          y: 217
        }, {
          x: -33,
          y: 230
        }, {
          x: -42,
          y: 245
        }, {
          x: -48,
          y: 247
        }, {
          x: -58,
          y: 240
        }, {
          x: -62,
          y: 248
        }, {
          x: -60,
          y: 256
        }, {
          x: -60,
          y: 266
        }, {
          x: -62,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[11] = [
        {
          x: -80,
          y: 273
        }, {
          x: -90,
          y: 265
        }, {
          x: -95,
          y: 253
        }, {
          x: -98,
          y: 245
        }, {
          x: -89,
          y: 233
        }, {
          x: -83,
          y: 215
        }, {
          x: -74,
          y: 198
        }, {
          x: -62,
          y: 181
        }, {
          x: -54,
          y: 170
        }, {
          x: -44,
          y: 156
        }, {
          x: -40,
          y: 145
        }, {
          x: -42,
          y: 133
        }, {
          x: -49,
          y: 117
        }, {
          x: -53,
          y: 99
        }, {
          x: -58,
          y: 83
        }, {
          x: -64,
          y: 72
        }, {
          x: -67,
          y: 55
        }, {
          x: -67,
          y: 41
        }, {
          x: -63,
          y: 29
        }, {
          x: -79,
          y: 15
        }, {
          x: -94,
          y: 1
        }, {
          x: -96,
          y: -16
        }, {
          x: -87,
          y: -34
        }, {
          x: -81,
          y: -50
        }, {
          x: -76,
          y: -63
        }, {
          x: -69,
          y: -76
        }, {
          x: -58,
          y: -87
        }, {
          x: -39,
          y: -97
        }, {
          x: -34,
          y: -108
        }, {
          x: -33,
          y: -121
        }, {
          x: -36,
          y: -133
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -154
        }, {
          x: -53,
          y: -164
        }, {
          x: -47,
          y: -172
        }, {
          x: -64,
          y: -185
        }, {
          x: -77,
          y: -193
        }, {
          x: -89,
          y: -202
        }, {
          x: -104,
          y: -207
        }, {
          x: -116,
          y: -216
        }, {
          x: -127,
          y: -230
        }, {
          x: -136,
          y: -246
        }, {
          x: -121,
          y: -235
        }, {
          x: -114,
          y: -225
        }, {
          x: -103,
          y: -220
        }, {
          x: -91,
          y: -220
        }, {
          x: -97,
          y: -235
        }, {
          x: -102,
          y: -249
        }, {
          x: -90,
          y: -237
        }, {
          x: -85,
          y: -229
        }, {
          x: -81,
          y: -220
        }, {
          x: -74,
          y: -211
        }, {
          x: -67,
          y: -207
        }, {
          x: -60,
          y: -200
        }, {
          x: -49,
          y: -193
        }, {
          x: -38,
          y: -188
        }, {
          x: -32,
          y: -178
        }, {
          x: -39,
          y: -184
        }, {
          x: -30,
          y: -181
        }, {
          x: -24,
          y: -174
        }, {
          x: -28,
          y: -176
        }, {
          x: -23,
          y: -171
        }, {
          x: -25,
          y: -178
        }, {
          x: -15,
          y: -168
        }, {
          x: -17,
          y: -170
        }, {
          x: -21,
          y: -177
        }, {
          x: -18,
          y: -178
        }, {
          x: -33,
          y: -184
        }, {
          x: -40,
          y: -191
        }, {
          x: -51,
          y: -194
        }, {
          x: -60,
          y: -199
        }, {
          x: -73,
          y: -209
        }, {
          x: -59,
          y: -203
        }, {
          x: -49,
          y: -193
        }, {
          x: -53,
          y: -197
        }, {
          x: -71,
          y: -212
        }, {
          x: -49,
          y: -195
        }, {
          x: -41,
          y: -189
        }, {
          x: -31,
          y: -181
        }, {
          x: -9,
          y: -171
        }, {
          x: -2,
          y: -169
        }, {
          x: 9,
          y: -181
        }, {
          x: 10,
          y: -169
        }, {
          x: 5,
          y: -160
        }, {
          x: 12,
          y: -150
        }, {
          x: 22,
          y: -145
        }, {
          x: 45,
          y: -143
        }, {
          x: 54,
          y: -136
        }, {
          x: 52,
          y: -125
        }, {
          x: 25,
          y: -111
        }, {
          x: 17,
          y: -94
        }, {
          x: 26,
          y: -80
        }, {
          x: 31,
          y: -59
        }, {
          x: 32,
          y: -39
        }, {
          x: 30,
          y: -21
        }, {
          x: 30,
          y: -4
        }, {
          x: 30,
          y: 25
        }, {
          x: 17,
          y: 44
        }, {
          x: 33,
          y: 61
        }, {
          x: 49,
          y: 77
        }, {
          x: 64,
          y: 96
        }, {
          x: 77,
          y: 114
        }, {
          x: 85,
          y: 129
        }, {
          x: 88,
          y: 150
        }, {
          x: 87,
          y: 167
        }, {
          x: 90,
          y: 193
        }, {
          x: 95,
          y: 218
        }, {
          x: 98,
          y: 229
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 68,
          y: 241
        }, {
          x: 69,
          y: 229
        }, {
          x: 68,
          y: 216
        }, {
          x: 65,
          y: 199
        }, {
          x: 59,
          y: 175
        }, {
          x: 55,
          y: 158
        }, {
          x: 52,
          y: 144
        }, {
          x: 44,
          y: 133
        }, {
          x: 30,
          y: 121
        }, {
          x: 22,
          y: 112
        }, {
          x: 5,
          y: 98
        }, {
          x: -14,
          y: 85
        }, {
          x: -11,
          y: 100
        }, {
          x: -6,
          y: 118
        }, {
          x: -4,
          y: 137
        }, {
          x: -3,
          y: 154
        }, {
          x: -8,
          y: 169
        }, {
          x: -15,
          y: 183
        }, {
          x: -26,
          y: 198
        }, {
          x: -37,
          y: 212
        }, {
          x: -43,
          y: 227
        }, {
          x: -51,
          y: 240
        }, {
          x: -57,
          y: 244
        }, {
          x: -68,
          y: 240
        }, {
          x: -68,
          y: 248
        }, {
          x: -64,
          y: 255
        }, {
          x: -60,
          y: 263
        }, {
          x: -62,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[12] = [
        {
          x: -80,
          y: 273
        }, {
          x: -90,
          y: 265
        }, {
          x: -99,
          y: 258
        }, {
          x: -101,
          y: 243
        }, {
          x: -93,
          y: 234
        }, {
          x: -90,
          y: 217
        }, {
          x: -77,
          y: 195
        }, {
          x: -70,
          y: 182
        }, {
          x: -61,
          y: 165
        }, {
          x: -51,
          y: 152
        }, {
          x: -45,
          y: 142
        }, {
          x: -45,
          y: 132
        }, {
          x: -51,
          y: 116
        }, {
          x: -56,
          y: 97
        }, {
          x: -61,
          y: 84
        }, {
          x: -64,
          y: 71
        }, {
          x: -67,
          y: 58
        }, {
          x: -67,
          y: 41
        }, {
          x: -60,
          y: 24
        }, {
          x: -79,
          y: 11
        }, {
          x: -95,
          y: -2
        }, {
          x: -96,
          y: -20
        }, {
          x: -89,
          y: -38
        }, {
          x: -82,
          y: -53
        }, {
          x: -78,
          y: -68
        }, {
          x: -72,
          y: -81
        }, {
          x: -60,
          y: -91
        }, {
          x: -39,
          y: -100
        }, {
          x: -33,
          y: -110
        }, {
          x: -33,
          y: -121
        }, {
          x: -36,
          y: -133
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -154
        }, {
          x: -53,
          y: -164
        }, {
          x: -46,
          y: -174
        }, {
          x: -36,
          y: -174
        }, {
          x: -44,
          y: -185
        }, {
          x: -55,
          y: -196
        }, {
          x: -64,
          y: -204
        }, {
          x: -80,
          y: -213
        }, {
          x: -92,
          y: -224
        }, {
          x: -100,
          y: -243
        }, {
          x: -91,
          y: -233
        }, {
          x: -81,
          y: -228
        }, {
          x: -71,
          y: -225
        }, {
          x: -75,
          y: -234
        }, {
          x: -79,
          y: -242
        }, {
          x: -87,
          y: -247
        }, {
          x: -77,
          y: -247
        }, {
          x: -76,
          y: -259
        }, {
          x: -67,
          y: -236
        }, {
          x: -59,
          y: -220
        }, {
          x: -53,
          y: -209
        }, {
          x: -46,
          y: -202
        }, {
          x: -44,
          y: -201
        }, {
          x: -40,
          y: -197
        }, {
          x: -34,
          y: -191
        }, {
          x: -24,
          y: -182
        }, {
          x: -18,
          y: -177
        }, {
          x: -12,
          y: -170
        }, {
          x: -23,
          y: -172
        }, {
          x: -26,
          y: -172
        }, {
          x: -32,
          y: -172
        }, {
          x: -37,
          y: -175
        }, {
          x: -47,
          y: -170
        }, {
          x: -67,
          y: -183
        }, {
          x: -81,
          y: -194
        }, {
          x: -103,
          y: -206
        }, {
          x: -116,
          y: -209
        }, {
          x: -135,
          y: -215
        }, {
          x: -119,
          y: -218
        }, {
          x: -99,
          y: -215
        }, {
          x: -81,
          y: -205
        }, {
          x: -74,
          y: -211
        }, {
          x: -79,
          y: -224
        }, {
          x: -68,
          y: -211
        }, {
          x: -67,
          y: -198
        }, {
          x: -52,
          y: -183
        }, {
          x: -29,
          y: -174
        }, {
          x: -14,
          y: -171
        }, {
          x: -1,
          y: -172
        }, {
          x: 12,
          y: -185
        }, {
          x: 12,
          y: -171
        }, {
          x: 5,
          y: -160
        }, {
          x: 14,
          y: -155
        }, {
          x: 24,
          y: -149
        }, {
          x: 47,
          y: -147
        }, {
          x: 55,
          y: -139
        }, {
          x: 49,
          y: -126
        }, {
          x: 32,
          y: -120
        }, {
          x: 17,
          y: -96
        }, {
          x: 27,
          y: -81
        }, {
          x: 31,
          y: -64
        }, {
          x: 31,
          y: -44
        }, {
          x: 31,
          y: -23
        }, {
          x: 30,
          y: -5
        }, {
          x: 33,
          y: 21
        }, {
          x: 20,
          y: 41
        }, {
          x: 33,
          y: 59
        }, {
          x: 46,
          y: 76
        }, {
          x: 59,
          y: 92
        }, {
          x: 74,
          y: 114
        }, {
          x: 81,
          y: 127
        }, {
          x: 83,
          y: 147
        }, {
          x: 83,
          y: 168
        }, {
          x: 86,
          y: 193
        }, {
          x: 91,
          y: 217
        }, {
          x: 94,
          y: 229
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 67,
          y: 242
        }, {
          x: 68,
          y: 227
        }, {
          x: 66,
          y: 214
        }, {
          x: 64,
          y: 198
        }, {
          x: 59,
          y: 181
        }, {
          x: 54,
          y: 164
        }, {
          x: 50,
          y: 148
        }, {
          x: 42,
          y: 136
        }, {
          x: 32,
          y: 125
        }, {
          x: 20,
          y: 114
        }, {
          x: 2,
          y: 96
        }, {
          x: -15,
          y: 80
        }, {
          x: -14,
          y: 99
        }, {
          x: -11,
          y: 118
        }, {
          x: -10,
          y: 136
        }, {
          x: -10,
          y: 153
        }, {
          x: -15,
          y: 167
        }, {
          x: -23,
          y: 182
        }, {
          x: -34,
          y: 198
        }, {
          x: -42,
          y: 212
        }, {
          x: -50,
          y: 224
        }, {
          x: -57,
          y: 235
        }, {
          x: -61,
          y: 243
        }, {
          x: -70,
          y: 243
        }, {
          x: -71,
          y: 248
        }, {
          x: -69,
          y: 256
        }, {
          x: -63,
          y: 264
        }, {
          x: -63,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[13] = [
        {
          x: -80,
          y: 273
        }, {
          x: -90,
          y: 265
        }, {
          x: -99,
          y: 258
        }, {
          x: -101,
          y: 243
        }, {
          x: -93,
          y: 234
        }, {
          x: -90,
          y: 217
        }, {
          x: -77,
          y: 195
        }, {
          x: -70,
          y: 182
        }, {
          x: -61,
          y: 165
        }, {
          x: -51,
          y: 152
        }, {
          x: -45,
          y: 142
        }, {
          x: -45,
          y: 132
        }, {
          x: -51,
          y: 116
        }, {
          x: -56,
          y: 97
        }, {
          x: -61,
          y: 84
        }, {
          x: -64,
          y: 71
        }, {
          x: -67,
          y: 58
        }, {
          x: -67,
          y: 41
        }, {
          x: -60,
          y: 24
        }, {
          x: -79,
          y: 11
        }, {
          x: -95,
          y: -3
        }, {
          x: -97,
          y: -22
        }, {
          x: -89,
          y: -40
        }, {
          x: -83,
          y: -56
        }, {
          x: -79,
          y: -71
        }, {
          x: -72,
          y: -83
        }, {
          x: -59,
          y: -93
        }, {
          x: -41,
          y: -100
        }, {
          x: -33,
          y: -110
        }, {
          x: -33,
          y: -121
        }, {
          x: -36,
          y: -134
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -154
        }, {
          x: -53,
          y: -164
        }, {
          x: -43,
          y: -173
        }, {
          x: -26,
          y: -175
        }, {
          x: -32,
          y: -190
        }, {
          x: -43,
          y: -204
        }, {
          x: -51,
          y: -212
        }, {
          x: -64,
          y: -220
        }, {
          x: -75,
          y: -230
        }, {
          x: -85,
          y: -247
        }, {
          x: -72,
          y: -237
        }, {
          x: -63,
          y: -231
        }, {
          x: -54,
          y: -230
        }, {
          x: -56,
          y: -239
        }, {
          x: -56,
          y: -246
        }, {
          x: -63,
          y: -257
        }, {
          x: -55,
          y: -255
        }, {
          x: -53,
          y: -265
        }, {
          x: -48,
          y: -249
        }, {
          x: -48,
          y: -236
        }, {
          x: -48,
          y: -230
        }, {
          x: -43,
          y: -215
        }, {
          x: -36,
          y: -209
        }, {
          x: -32,
          y: -204
        }, {
          x: -25,
          y: -196
        }, {
          x: -17,
          y: -189
        }, {
          x: -12,
          y: -183
        }, {
          x: -1,
          y: -171
        }, {
          x: -30,
          y: -172
        }, {
          x: -24,
          y: -176
        }, {
          x: -32,
          y: -176
        }, {
          x: -47,
          y: -170
        }, {
          x: -50,
          y: -161
        }, {
          x: -69,
          y: -174
        }, {
          x: -87,
          y: -190
        }, {
          x: -103,
          y: -196
        }, {
          x: -115,
          y: -201
        }, {
          x: -144,
          y: -206
        }, {
          x: -123,
          y: -209
        }, {
          x: -109,
          y: -208
        }, {
          x: -93,
          y: -202
        }, {
          x: -90,
          y: -208
        }, {
          x: -93,
          y: -221
        }, {
          x: -82,
          y: -210
        }, {
          x: -79,
          y: -196
        }, {
          x: -59,
          y: -177
        }, {
          x: -29,
          y: -174
        }, {
          x: -10,
          y: -172
        }, {
          x: -2,
          y: -172
        }, {
          x: 13,
          y: -186
        }, {
          x: 14,
          y: -173
        }, {
          x: 5,
          y: -160
        }, {
          x: 14,
          y: -155
        }, {
          x: 25,
          y: -151
        }, {
          x: 47,
          y: -149
        }, {
          x: 55,
          y: -140
        }, {
          x: 50,
          y: -128
        }, {
          x: 32,
          y: -121
        }, {
          x: 16,
          y: -98
        }, {
          x: 26,
          y: -86
        }, {
          x: 31,
          y: -66
        }, {
          x: 31,
          y: -48
        }, {
          x: 31,
          y: -28
        }, {
          x: 30,
          y: -7
        }, {
          x: 33,
          y: 19
        }, {
          x: 20,
          y: 41
        }, {
          x: 33,
          y: 59
        }, {
          x: 46,
          y: 76
        }, {
          x: 59,
          y: 92
        }, {
          x: 74,
          y: 114
        }, {
          x: 81,
          y: 127
        }, {
          x: 83,
          y: 147
        }, {
          x: 83,
          y: 168
        }, {
          x: 86,
          y: 193
        }, {
          x: 91,
          y: 217
        }, {
          x: 94,
          y: 229
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 67,
          y: 242
        }, {
          x: 68,
          y: 227
        }, {
          x: 66,
          y: 214
        }, {
          x: 64,
          y: 198
        }, {
          x: 59,
          y: 181
        }, {
          x: 54,
          y: 164
        }, {
          x: 50,
          y: 148
        }, {
          x: 42,
          y: 136
        }, {
          x: 32,
          y: 125
        }, {
          x: 20,
          y: 114
        }, {
          x: 2,
          y: 96
        }, {
          x: -15,
          y: 80
        }, {
          x: -14,
          y: 99
        }, {
          x: -11,
          y: 118
        }, {
          x: -10,
          y: 136
        }, {
          x: -10,
          y: 153
        }, {
          x: -15,
          y: 167
        }, {
          x: -23,
          y: 182
        }, {
          x: -34,
          y: 198
        }, {
          x: -42,
          y: 212
        }, {
          x: -50,
          y: 224
        }, {
          x: -57,
          y: 235
        }, {
          x: -61,
          y: 243
        }, {
          x: -70,
          y: 243
        }, {
          x: -71,
          y: 248
        }, {
          x: -69,
          y: 256
        }, {
          x: -63,
          y: 264
        }, {
          x: -63,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[14] = [
        {
          x: -80,
          y: 273
        }, {
          x: -90,
          y: 265
        }, {
          x: -99,
          y: 258
        }, {
          x: -101,
          y: 243
        }, {
          x: -93,
          y: 234
        }, {
          x: -90,
          y: 217
        }, {
          x: -77,
          y: 195
        }, {
          x: -70,
          y: 182
        }, {
          x: -61,
          y: 165
        }, {
          x: -51,
          y: 152
        }, {
          x: -45,
          y: 142
        }, {
          x: -45,
          y: 132
        }, {
          x: -51,
          y: 116
        }, {
          x: -56,
          y: 97
        }, {
          x: -61,
          y: 84
        }, {
          x: -64,
          y: 71
        }, {
          x: -67,
          y: 58
        }, {
          x: -67,
          y: 41
        }, {
          x: -60,
          y: 24
        }, {
          x: -79,
          y: 11
        }, {
          x: -95,
          y: -3
        }, {
          x: -97,
          y: -22
        }, {
          x: -89,
          y: -40
        }, {
          x: -83,
          y: -56
        }, {
          x: -79,
          y: -71
        }, {
          x: -72,
          y: -83
        }, {
          x: -59,
          y: -93
        }, {
          x: -42,
          y: -102
        }, {
          x: -34,
          y: -112
        }, {
          x: -34,
          y: -124
        }, {
          x: -36,
          y: -136
        }, {
          x: -38,
          y: -148
        }, {
          x: -46,
          y: -158
        }, {
          x: -50,
          y: -161
        }, {
          x: -43,
          y: -173
        }, {
          x: -21,
          y: -174
        }, {
          x: -24,
          y: -186
        }, {
          x: -36,
          y: -203
        }, {
          x: -48,
          y: -217
        }, {
          x: -59,
          y: -225
        }, {
          x: -72,
          y: -235
        }, {
          x: -80,
          y: -251
        }, {
          x: -68,
          y: -237
        }, {
          x: -57,
          y: -233
        }, {
          x: -48,
          y: -228
        }, {
          x: -48,
          y: -240
        }, {
          x: -51,
          y: -249
        }, {
          x: -59,
          y: -260
        }, {
          x: -51,
          y: -256
        }, {
          x: -48,
          y: -266
        }, {
          x: -42,
          y: -249
        }, {
          x: -43,
          y: -238
        }, {
          x: -41,
          y: -229
        }, {
          x: -38,
          y: -224
        }, {
          x: -34,
          y: -216
        }, {
          x: -28,
          y: -208
        }, {
          x: -22,
          y: -201
        }, {
          x: -13,
          y: -194
        }, {
          x: -3,
          y: -184
        }, {
          x: 6,
          y: -172
        }, {
          x: -18,
          y: -173
        }, {
          x: -24,
          y: -176
        }, {
          x: -32,
          y: -176
        }, {
          x: -46,
          y: -166
        }, {
          x: -51,
          y: -162
        }, {
          x: -72,
          y: -174
        }, {
          x: -87,
          y: -188
        }, {
          x: -103,
          y: -194
        }, {
          x: -115,
          y: -199
        }, {
          x: -148,
          y: -208
        }, {
          x: -124,
          y: -208
        }, {
          x: -107,
          y: -207
        }, {
          x: -93,
          y: -201
        }, {
          x: -92,
          y: -210
        }, {
          x: -97,
          y: -219
        }, {
          x: -86,
          y: -209
        }, {
          x: -79,
          y: -194
        }, {
          x: -58,
          y: -177
        }, {
          x: -29,
          y: -174
        }, {
          x: -10,
          y: -172
        }, {
          x: -2,
          y: -172
        }, {
          x: 16,
          y: -187
        }, {
          x: 14,
          y: -173
        }, {
          x: 6,
          y: -163
        }, {
          x: 14,
          y: -158
        }, {
          x: 24,
          y: -154
        }, {
          x: 45,
          y: -151
        }, {
          x: 54,
          y: -143
        }, {
          x: 51,
          y: -131
        }, {
          x: 32,
          y: -125
        }, {
          x: 15,
          y: -99
        }, {
          x: 26,
          y: -86
        }, {
          x: 31,
          y: -66
        }, {
          x: 31,
          y: -48
        }, {
          x: 31,
          y: -28
        }, {
          x: 30,
          y: -7
        }, {
          x: 33,
          y: 19
        }, {
          x: 20,
          y: 41
        }, {
          x: 33,
          y: 59
        }, {
          x: 46,
          y: 76
        }, {
          x: 59,
          y: 92
        }, {
          x: 74,
          y: 114
        }, {
          x: 81,
          y: 127
        }, {
          x: 83,
          y: 147
        }, {
          x: 83,
          y: 168
        }, {
          x: 86,
          y: 193
        }, {
          x: 91,
          y: 217
        }, {
          x: 94,
          y: 229
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 67,
          y: 242
        }, {
          x: 68,
          y: 227
        }, {
          x: 66,
          y: 214
        }, {
          x: 64,
          y: 198
        }, {
          x: 59,
          y: 181
        }, {
          x: 54,
          y: 164
        }, {
          x: 50,
          y: 148
        }, {
          x: 42,
          y: 136
        }, {
          x: 32,
          y: 125
        }, {
          x: 20,
          y: 114
        }, {
          x: 2,
          y: 96
        }, {
          x: -15,
          y: 80
        }, {
          x: -14,
          y: 99
        }, {
          x: -11,
          y: 118
        }, {
          x: -10,
          y: 136
        }, {
          x: -10,
          y: 153
        }, {
          x: -15,
          y: 167
        }, {
          x: -23,
          y: 182
        }, {
          x: -34,
          y: 198
        }, {
          x: -42,
          y: 212
        }, {
          x: -50,
          y: 224
        }, {
          x: -57,
          y: 235
        }, {
          x: -61,
          y: 243
        }, {
          x: -70,
          y: 243
        }, {
          x: -71,
          y: 248
        }, {
          x: -69,
          y: 256
        }, {
          x: -63,
          y: 264
        }, {
          x: -63,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[15] = [
        {
          x: -80,
          y: 273
        }, {
          x: -90,
          y: 265
        }, {
          x: -99,
          y: 258
        }, {
          x: -101,
          y: 243
        }, {
          x: -93,
          y: 234
        }, {
          x: -90,
          y: 217
        }, {
          x: -77,
          y: 195
        }, {
          x: -70,
          y: 182
        }, {
          x: -61,
          y: 165
        }, {
          x: -51,
          y: 152
        }, {
          x: -45,
          y: 142
        }, {
          x: -45,
          y: 132
        }, {
          x: -51,
          y: 116
        }, {
          x: -56,
          y: 97
        }, {
          x: -61,
          y: 84
        }, {
          x: -64,
          y: 71
        }, {
          x: -67,
          y: 58
        }, {
          x: -67,
          y: 41
        }, {
          x: -60,
          y: 24
        }, {
          x: -79,
          y: 11
        }, {
          x: -95,
          y: -3
        }, {
          x: -97,
          y: -22
        }, {
          x: -89,
          y: -40
        }, {
          x: -83,
          y: -56
        }, {
          x: -79,
          y: -71
        }, {
          x: -72,
          y: -83
        }, {
          x: -59,
          y: -93
        }, {
          x: -41,
          y: -100
        }, {
          x: -33,
          y: -110
        }, {
          x: -33,
          y: -121
        }, {
          x: -36,
          y: -134
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -154
        }, {
          x: -57,
          y: -166
        }, {
          x: -43,
          y: -173
        }, {
          x: -23,
          y: -174
        }, {
          x: -32,
          y: -190
        }, {
          x: -43,
          y: -204
        }, {
          x: -51,
          y: -212
        }, {
          x: -64,
          y: -220
        }, {
          x: -75,
          y: -230
        }, {
          x: -85,
          y: -247
        }, {
          x: -72,
          y: -237
        }, {
          x: -63,
          y: -231
        }, {
          x: -54,
          y: -230
        }, {
          x: -56,
          y: -239
        }, {
          x: -56,
          y: -246
        }, {
          x: -63,
          y: -257
        }, {
          x: -55,
          y: -255
        }, {
          x: -53,
          y: -265
        }, {
          x: -48,
          y: -249
        }, {
          x: -48,
          y: -236
        }, {
          x: -48,
          y: -230
        }, {
          x: -43,
          y: -215
        }, {
          x: -36,
          y: -209
        }, {
          x: -32,
          y: -204
        }, {
          x: -25,
          y: -196
        }, {
          x: -17,
          y: -189
        }, {
          x: -12,
          y: -183
        }, {
          x: -1,
          y: -171
        }, {
          x: -18,
          y: -173
        }, {
          x: -24,
          y: -176
        }, {
          x: -32,
          y: -176
        }, {
          x: -47,
          y: -170
        }, {
          x: -52,
          y: -162
        }, {
          x: -69,
          y: -174
        }, {
          x: -87,
          y: -190
        }, {
          x: -103,
          y: -196
        }, {
          x: -115,
          y: -201
        }, {
          x: -144,
          y: -206
        }, {
          x: -123,
          y: -209
        }, {
          x: -109,
          y: -208
        }, {
          x: -93,
          y: -202
        }, {
          x: -90,
          y: -208
        }, {
          x: -93,
          y: -221
        }, {
          x: -82,
          y: -210
        }, {
          x: -79,
          y: -196
        }, {
          x: -59,
          y: -177
        }, {
          x: -29,
          y: -174
        }, {
          x: -10,
          y: -172
        }, {
          x: -2,
          y: -172
        }, {
          x: 13,
          y: -186
        }, {
          x: 14,
          y: -173
        }, {
          x: 5,
          y: -160
        }, {
          x: 14,
          y: -155
        }, {
          x: 25,
          y: -151
        }, {
          x: 47,
          y: -149
        }, {
          x: 55,
          y: -140
        }, {
          x: 50,
          y: -128
        }, {
          x: 32,
          y: -121
        }, {
          x: 16,
          y: -98
        }, {
          x: 26,
          y: -86
        }, {
          x: 31,
          y: -66
        }, {
          x: 31,
          y: -48
        }, {
          x: 31,
          y: -28
        }, {
          x: 30,
          y: -7
        }, {
          x: 33,
          y: 19
        }, {
          x: 20,
          y: 41
        }, {
          x: 33,
          y: 59
        }, {
          x: 46,
          y: 76
        }, {
          x: 59,
          y: 92
        }, {
          x: 74,
          y: 114
        }, {
          x: 81,
          y: 127
        }, {
          x: 83,
          y: 147
        }, {
          x: 83,
          y: 168
        }, {
          x: 86,
          y: 193
        }, {
          x: 91,
          y: 217
        }, {
          x: 94,
          y: 229
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 67,
          y: 242
        }, {
          x: 68,
          y: 227
        }, {
          x: 66,
          y: 214
        }, {
          x: 64,
          y: 198
        }, {
          x: 59,
          y: 181
        }, {
          x: 54,
          y: 164
        }, {
          x: 50,
          y: 148
        }, {
          x: 42,
          y: 136
        }, {
          x: 32,
          y: 125
        }, {
          x: 20,
          y: 114
        }, {
          x: 2,
          y: 96
        }, {
          x: -15,
          y: 80
        }, {
          x: -14,
          y: 99
        }, {
          x: -11,
          y: 118
        }, {
          x: -10,
          y: 136
        }, {
          x: -10,
          y: 153
        }, {
          x: -15,
          y: 167
        }, {
          x: -23,
          y: 182
        }, {
          x: -34,
          y: 198
        }, {
          x: -42,
          y: 212
        }, {
          x: -50,
          y: 224
        }, {
          x: -57,
          y: 235
        }, {
          x: -61,
          y: 243
        }, {
          x: -70,
          y: 243
        }, {
          x: -71,
          y: 248
        }, {
          x: -69,
          y: 256
        }, {
          x: -63,
          y: 264
        }, {
          x: -63,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[16] = [
        {
          x: -80,
          y: 273
        }, {
          x: -90,
          y: 265
        }, {
          x: -97,
          y: 255
        }, {
          x: -96,
          y: 241
        }, {
          x: -88,
          y: 232
        }, {
          x: -86,
          y: 219
        }, {
          x: -75,
          y: 201
        }, {
          x: -66,
          y: 185
        }, {
          x: -55,
          y: 168
        }, {
          x: -45,
          y: 155
        }, {
          x: -42,
          y: 144
        }, {
          x: -45,
          y: 132
        }, {
          x: -51,
          y: 116
        }, {
          x: -56,
          y: 97
        }, {
          x: -61,
          y: 84
        }, {
          x: -64,
          y: 71
        }, {
          x: -67,
          y: 58
        }, {
          x: -67,
          y: 41
        }, {
          x: -61,
          y: 27
        }, {
          x: -80,
          y: 15
        }, {
          x: -94,
          y: 1
        }, {
          x: -94,
          y: -18
        }, {
          x: -88,
          y: -36
        }, {
          x: -82,
          y: -49
        }, {
          x: -79,
          y: -64
        }, {
          x: -71,
          y: -78
        }, {
          x: -61,
          y: -87
        }, {
          x: -41,
          y: -97
        }, {
          x: -33,
          y: -110
        }, {
          x: -33,
          y: -121
        }, {
          x: -36,
          y: -133
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -154
        }, {
          x: -53,
          y: -164
        }, {
          x: -46,
          y: -174
        }, {
          x: -33,
          y: -173
        }, {
          x: -44,
          y: -185
        }, {
          x: -55,
          y: -196
        }, {
          x: -64,
          y: -204
        }, {
          x: -80,
          y: -213
        }, {
          x: -92,
          y: -224
        }, {
          x: -100,
          y: -243
        }, {
          x: -91,
          y: -233
        }, {
          x: -81,
          y: -228
        }, {
          x: -71,
          y: -225
        }, {
          x: -75,
          y: -234
        }, {
          x: -79,
          y: -242
        }, {
          x: -87,
          y: -247
        }, {
          x: -77,
          y: -247
        }, {
          x: -76,
          y: -259
        }, {
          x: -67,
          y: -236
        }, {
          x: -59,
          y: -220
        }, {
          x: -53,
          y: -209
        }, {
          x: -46,
          y: -202
        }, {
          x: -44,
          y: -201
        }, {
          x: -40,
          y: -197
        }, {
          x: -34,
          y: -191
        }, {
          x: -24,
          y: -183
        }, {
          x: -18,
          y: -178
        }, {
          x: -13,
          y: -170
        }, {
          x: -24,
          y: -170
        }, {
          x: -24,
          y: -172
        }, {
          x: -31,
          y: -172
        }, {
          x: -37,
          y: -175
        }, {
          x: -49,
          y: -172
        }, {
          x: -67,
          y: -183
        }, {
          x: -81,
          y: -194
        }, {
          x: -103,
          y: -206
        }, {
          x: -116,
          y: -209
        }, {
          x: -135,
          y: -215
        }, {
          x: -119,
          y: -218
        }, {
          x: -99,
          y: -215
        }, {
          x: -81,
          y: -205
        }, {
          x: -74,
          y: -211
        }, {
          x: -79,
          y: -224
        }, {
          x: -68,
          y: -211
        }, {
          x: -67,
          y: -198
        }, {
          x: -52,
          y: -183
        }, {
          x: -29,
          y: -174
        }, {
          x: -14,
          y: -171
        }, {
          x: -1,
          y: -172
        }, {
          x: 12,
          y: -185
        }, {
          x: 12,
          y: -171
        }, {
          x: 5,
          y: -160
        }, {
          x: 14,
          y: -155
        }, {
          x: 24,
          y: -149
        }, {
          x: 47,
          y: -147
        }, {
          x: 55,
          y: -139
        }, {
          x: 49,
          y: -126
        }, {
          x: 32,
          y: -120
        }, {
          x: 17,
          y: -96
        }, {
          x: 27,
          y: -81
        }, {
          x: 31,
          y: -64
        }, {
          x: 31,
          y: -44
        }, {
          x: 31,
          y: -23
        }, {
          x: 30,
          y: -5
        }, {
          x: 34,
          y: 27
        }, {
          x: 20,
          y: 45
        }, {
          x: 33,
          y: 59
        }, {
          x: 46,
          y: 76
        }, {
          x: 59,
          y: 92
        }, {
          x: 76,
          y: 113
        }, {
          x: 85,
          y: 129
        }, {
          x: 87,
          y: 148
        }, {
          x: 87,
          y: 168
        }, {
          x: 90,
          y: 194
        }, {
          x: 94,
          y: 218
        }, {
          x: 97,
          y: 230
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 67,
          y: 242
        }, {
          x: 68,
          y: 227
        }, {
          x: 66,
          y: 214
        }, {
          x: 64,
          y: 198
        }, {
          x: 59,
          y: 181
        }, {
          x: 54,
          y: 164
        }, {
          x: 52,
          y: 147
        }, {
          x: 40,
          y: 132
        }, {
          x: 28,
          y: 121
        }, {
          x: 16,
          y: 110
        }, {
          x: 4,
          y: 99
        }, {
          x: -12,
          y: 87
        }, {
          x: -10,
          y: 102
        }, {
          x: -6,
          y: 120
        }, {
          x: -5,
          y: 135
        }, {
          x: -6,
          y: 154
        }, {
          x: -10,
          y: 169
        }, {
          x: -20,
          y: 185
        }, {
          x: -29,
          y: 198
        }, {
          x: -38,
          y: 214
        }, {
          x: -47,
          y: 228
        }, {
          x: -52,
          y: 238
        }, {
          x: -56,
          y: 246
        }, {
          x: -70,
          y: 243
        }, {
          x: -71,
          y: 248
        }, {
          x: -69,
          y: 256
        }, {
          x: -63,
          y: 264
        }, {
          x: -63,
          y: 272
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[17] = [
        {
          x: -80,
          y: 274
        }, {
          x: -88,
          y: 267
        }, {
          x: -88,
          y: 254
        }, {
          x: -88,
          y: 240
        }, {
          x: -78,
          y: 231
        }, {
          x: -73,
          y: 217
        }, {
          x: -63,
          y: 204
        }, {
          x: -55,
          y: 189
        }, {
          x: -48,
          y: 174
        }, {
          x: -38,
          y: 160
        }, {
          x: -34,
          y: 150
        }, {
          x: -38,
          y: 132
        }, {
          x: -46,
          y: 113
        }, {
          x: -51,
          y: 96
        }, {
          x: -58,
          y: 83
        }, {
          x: -64,
          y: 72
        }, {
          x: -67,
          y: 55
        }, {
          x: -67,
          y: 41
        }, {
          x: -63,
          y: 29
        }, {
          x: -79,
          y: 15
        }, {
          x: -94,
          y: 1
        }, {
          x: -96,
          y: -16
        }, {
          x: -87,
          y: -34
        }, {
          x: -81,
          y: -50
        }, {
          x: -76,
          y: -63
        }, {
          x: -69,
          y: -76
        }, {
          x: -58,
          y: -87
        }, {
          x: -39,
          y: -97
        }, {
          x: -34,
          y: -108
        }, {
          x: -33,
          y: -121
        }, {
          x: -36,
          y: -133
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -154
        }, {
          x: -53,
          y: -164
        }, {
          x: -47,
          y: -172
        }, {
          x: -64,
          y: -185
        }, {
          x: -77,
          y: -193
        }, {
          x: -89,
          y: -202
        }, {
          x: -104,
          y: -207
        }, {
          x: -116,
          y: -216
        }, {
          x: -127,
          y: -230
        }, {
          x: -136,
          y: -246
        }, {
          x: -121,
          y: -235
        }, {
          x: -114,
          y: -225
        }, {
          x: -103,
          y: -220
        }, {
          x: -91,
          y: -220
        }, {
          x: -97,
          y: -235
        }, {
          x: -102,
          y: -249
        }, {
          x: -90,
          y: -237
        }, {
          x: -85,
          y: -229
        }, {
          x: -81,
          y: -220
        }, {
          x: -74,
          y: -211
        }, {
          x: -67,
          y: -207
        }, {
          x: -60,
          y: -200
        }, {
          x: -49,
          y: -193
        }, {
          x: -38,
          y: -188
        }, {
          x: -29,
          y: -179
        }, {
          x: -32,
          y: -175
        }, {
          x: -30,
          y: -181
        }, {
          x: -25,
          y: -176
        }, {
          x: -28,
          y: -176
        }, {
          x: -25,
          y: -175
        }, {
          x: -25,
          y: -178
        }, {
          x: -15,
          y: -168
        }, {
          x: -17,
          y: -170
        }, {
          x: -21,
          y: -177
        }, {
          x: -18,
          y: -178
        }, {
          x: -33,
          y: -184
        }, {
          x: -40,
          y: -191
        }, {
          x: -51,
          y: -194
        }, {
          x: -60,
          y: -199
        }, {
          x: -73,
          y: -209
        }, {
          x: -59,
          y: -203
        }, {
          x: -49,
          y: -193
        }, {
          x: -53,
          y: -197
        }, {
          x: -71,
          y: -212
        }, {
          x: -49,
          y: -195
        }, {
          x: -41,
          y: -189
        }, {
          x: -31,
          y: -181
        }, {
          x: -9,
          y: -171
        }, {
          x: -2,
          y: -169
        }, {
          x: 9,
          y: -181
        }, {
          x: 10,
          y: -169
        }, {
          x: 5,
          y: -160
        }, {
          x: 12,
          y: -150
        }, {
          x: 22,
          y: -145
        }, {
          x: 45,
          y: -143
        }, {
          x: 54,
          y: -136
        }, {
          x: 52,
          y: -125
        }, {
          x: 25,
          y: -111
        }, {
          x: 17,
          y: -94
        }, {
          x: 26,
          y: -80
        }, {
          x: 31,
          y: -59
        }, {
          x: 32,
          y: -39
        }, {
          x: 30,
          y: -21
        }, {
          x: 30,
          y: -4
        }, {
          x: 30,
          y: 25
        }, {
          x: 17,
          y: 44
        }, {
          x: 33,
          y: 61
        }, {
          x: 49,
          y: 77
        }, {
          x: 64,
          y: 93
        }, {
          x: 74,
          y: 107
        }, {
          x: 86,
          y: 123
        }, {
          x: 90,
          y: 142
        }, {
          x: 94,
          y: 165
        }, {
          x: 97,
          y: 188
        }, {
          x: 104,
          y: 224
        }, {
          x: 98,
          y: 229
        }, {
          x: 104,
          y: 237
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 124,
          y: 255
        }, {
          x: 112,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 249
        }, {
          x: 68,
          y: 241
        }, {
          x: 69,
          y: 229
        }, {
          x: 68,
          y: 216
        }, {
          x: 67,
          y: 201
        }, {
          x: 61,
          y: 178
        }, {
          x: 58,
          y: 161
        }, {
          x: 56,
          y: 143
        }, {
          x: 44,
          y: 133
        }, {
          x: 30,
          y: 121
        }, {
          x: 22,
          y: 112
        }, {
          x: 5,
          y: 98
        }, {
          x: -8,
          y: 90
        }, {
          x: -8,
          y: 101
        }, {
          x: -3,
          y: 119
        }, {
          x: 2,
          y: 136
        }, {
          x: 3,
          y: 150
        }, {
          x: 1,
          y: 169
        }, {
          x: -6,
          y: 182
        }, {
          x: -17,
          y: 201
        }, {
          x: -26,
          y: 219
        }, {
          x: -35,
          y: 231
        }, {
          x: -42,
          y: 241
        }, {
          x: -49,
          y: 248
        }, {
          x: -57,
          y: 237
        }, {
          x: -61,
          y: 245
        }, {
          x: -60,
          y: 255
        }, {
          x: -58,
          y: 263
        }, {
          x: -63,
          y: 273
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[18] = [
        {
          x: -79,
          y: 273
        }, {
          x: -82,
          y: 266
        }, {
          x: -80,
          y: 256
        }, {
          x: -74,
          y: 246
        }, {
          x: -65,
          y: 236
        }, {
          x: -59,
          y: 229
        }, {
          x: -54,
          y: 212
        }, {
          x: -47,
          y: 197
        }, {
          x: -39,
          y: 183
        }, {
          x: -31,
          y: 170
        }, {
          x: -26,
          y: 155
        }, {
          x: -30,
          y: 137
        }, {
          x: -38,
          y: 117
        }, {
          x: -47,
          y: 98
        }, {
          x: -54,
          y: 88
        }, {
          x: -59,
          y: 76
        }, {
          x: -62,
          y: 61
        }, {
          x: -60,
          y: 50
        }, {
          x: -63,
          y: 38
        }, {
          x: -81,
          y: 23
        }, {
          x: -91,
          y: 8
        }, {
          x: -95,
          y: -10
        }, {
          x: -86,
          y: -32
        }, {
          x: -80,
          y: -48
        }, {
          x: -78,
          y: -61
        }, {
          x: -72,
          y: -71
        }, {
          x: -60,
          y: -81
        }, {
          x: -38,
          y: -91
        }, {
          x: -35,
          y: -103
        }, {
          x: -33,
          y: -117
        }, {
          x: -35,
          y: -130
        }, {
          x: -38,
          y: -146
        }, {
          x: -48,
          y: -149
        }, {
          x: -56,
          y: -158
        }, {
          x: -61,
          y: -166
        }, {
          x: -79,
          y: -177
        }, {
          x: -92,
          y: -187
        }, {
          x: -104,
          y: -198
        }, {
          x: -112,
          y: -205
        }, {
          x: -124,
          y: -213
        }, {
          x: -136,
          y: -224
        }, {
          x: -148,
          y: -243
        }, {
          x: -135,
          y: -236
        }, {
          x: -128,
          y: -229
        }, {
          x: -122,
          y: -223
        }, {
          x: -111,
          y: -216
        }, {
          x: -113,
          y: -228
        }, {
          x: -120,
          y: -243
        }, {
          x: -105,
          y: -230
        }, {
          x: -102,
          y: -220
        }, {
          x: -98,
          y: -209
        }, {
          x: -92,
          y: -202
        }, {
          x: -82,
          y: -193
        }, {
          x: -70,
          y: -184
        }, {
          x: -59,
          y: -179
        }, {
          x: -49,
          y: -176
        }, {
          x: -40,
          y: -171
        }, {
          x: -35,
          y: -169
        }, {
          x: -32,
          y: -181
        }, {
          x: -25,
          y: -168
        }, {
          x: -25,
          y: -162
        }, {
          x: -23,
          y: -171
        }, {
          x: -21,
          y: -180
        }, {
          x: -18,
          y: -164
        }, {
          x: -17,
          y: -170
        }, {
          x: -17,
          y: -173
        }, {
          x: -18,
          y: -178
        }, {
          x: -19,
          y: -184
        }, {
          x: -24,
          y: -191
        }, {
          x: -35,
          y: -198
        }, {
          x: -40,
          y: -203
        }, {
          x: -60,
          y: -218
        }, {
          x: -42,
          y: -211
        }, {
          x: -26,
          y: -201
        }, {
          x: -24,
          y: -209
        }, {
          x: -27,
          y: -219
        }, {
          x: -17,
          y: -210
        }, {
          x: -13,
          y: -203
        }, {
          x: -12,
          y: -197
        }, {
          x: -11,
          y: -190
        }, {
          x: -7,
          y: -181
        }, {
          x: -6,
          y: -169
        }, {
          x: 6,
          y: -173
        }, {
          x: 7,
          y: -163
        }, {
          x: 4,
          y: -154
        }, {
          x: 8,
          y: -145
        }, {
          x: 39,
          y: -140
        }, {
          x: 50,
          y: -132
        }, {
          x: 48,
          y: -122
        }, {
          x: 19,
          y: -107
        }, {
          x: 12,
          y: -93
        }, {
          x: 26,
          y: -80
        }, {
          x: 31,
          y: -59
        }, {
          x: 32,
          y: -39
        }, {
          x: 30,
          y: -21
        }, {
          x: 30,
          y: -4
        }, {
          x: 30,
          y: 25
        }, {
          x: 20,
          y: 46
        }, {
          x: 35,
          y: 60
        }, {
          x: 53,
          y: 74
        }, {
          x: 68,
          y: 90
        }, {
          x: 85,
          y: 108
        }, {
          x: 92,
          y: 121
        }, {
          x: 97,
          y: 143
        }, {
          x: 99,
          y: 168
        }, {
          x: 102,
          y: 192
        }, {
          x: 107,
          y: 222
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 126,
          y: 247
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 70,
          y: 247
        }, {
          x: 69,
          y: 239
        }, {
          x: 69,
          y: 229
        }, {
          x: 71,
          y: 216
        }, {
          x: 70,
          y: 197
        }, {
          x: 65,
          y: 172
        }, {
          x: 64,
          y: 159
        }, {
          x: 61,
          y: 145
        }, {
          x: 52,
          y: 135
        }, {
          x: 39,
          y: 124
        }, {
          x: 26,
          y: 112
        }, {
          x: 9,
          y: 97
        }, {
          x: -9,
          y: 88
        }, {
          x: -6,
          y: 100
        }, {
          x: 0,
          y: 114
        }, {
          x: 4,
          y: 130
        }, {
          x: 9,
          y: 150
        }, {
          x: 9,
          y: 172
        }, {
          x: -1,
          y: 190
        }, {
          x: -9,
          y: 206
        }, {
          x: -19,
          y: 223
        }, {
          x: -25,
          y: 233
        }, {
          x: -32,
          y: 249
        }, {
          x: -39,
          y: 248
        }, {
          x: -48,
          y: 245
        }, {
          x: -52,
          y: 250
        }, {
          x: -53,
          y: 259
        }, {
          x: -55,
          y: 266
        }, {
          x: -62,
          y: 274
        }, {
          x: -71,
          y: 276
        }
      ];
      this.frames[19] = [
        {
          x: -78,
          y: 273
        }, {
          x: -82,
          y: 263
        }, {
          x: -76,
          y: 252
        }, {
          x: -69,
          y: 242
        }, {
          x: -58,
          y: 236
        }, {
          x: -52,
          y: 227
        }, {
          x: -46,
          y: 216
        }, {
          x: -40,
          y: 197
        }, {
          x: -31,
          y: 182
        }, {
          x: -21,
          y: 169
        }, {
          x: -21,
          y: 155
        }, {
          x: -27,
          y: 134
        }, {
          x: -36,
          y: 113
        }, {
          x: -45,
          y: 94
        }, {
          x: -50,
          y: 81
        }, {
          x: -55,
          y: 70
        }, {
          x: -59,
          y: 59
        }, {
          x: -61,
          y: 46
        }, {
          x: -67,
          y: 38
        }, {
          x: -83,
          y: 22
        }, {
          x: -91,
          y: 10
        }, {
          x: -95,
          y: -7
        }, {
          x: -87,
          y: -27
        }, {
          x: -80,
          y: -45
        }, {
          x: -77,
          y: -57
        }, {
          x: -71,
          y: -67
        }, {
          x: -61,
          y: -78
        }, {
          x: -39,
          y: -88
        }, {
          x: -36,
          y: -100
        }, {
          x: -35,
          y: -114
        }, {
          x: -37,
          y: -125
        }, {
          x: -41,
          y: -137
        }, {
          x: -51,
          y: -138
        }, {
          x: -60,
          y: -145
        }, {
          x: -66,
          y: -156
        }, {
          x: -79,
          y: -162
        }, {
          x: -96,
          y: -171
        }, {
          x: -109,
          y: -180
        }, {
          x: -124,
          y: -193
        }, {
          x: -134,
          y: -202
        }, {
          x: -143,
          y: -219
        }, {
          x: -150,
          y: -243
        }, {
          x: -135,
          y: -228
        }, {
          x: -130,
          y: -217
        }, {
          x: -123,
          y: -206
        }, {
          x: -113,
          y: -198
        }, {
          x: -113,
          y: -211
        }, {
          x: -122,
          y: -233
        }, {
          x: -109,
          y: -222
        }, {
          x: -105,
          y: -210
        }, {
          x: -103,
          y: -202
        }, {
          x: -99,
          y: -191
        }, {
          x: -91,
          y: -181
        }, {
          x: -78,
          y: -174
        }, {
          x: -63,
          y: -166
        }, {
          x: -48,
          y: -165
        }, {
          x: -36,
          y: -162
        }, {
          x: -32,
          y: -168
        }, {
          x: -29,
          y: -180
        }, {
          x: -24,
          y: -169
        }, {
          x: -19,
          y: -162
        }, {
          x: -17,
          y: -169
        }, {
          x: -14,
          y: -179
        }, {
          x: -9,
          y: -163
        }, {
          x: -4,
          y: -167
        }, {
          x: 0,
          y: -174
        }, {
          x: 1,
          y: -183
        }, {
          x: -2,
          y: -192
        }, {
          x: -6,
          y: -197
        }, {
          x: -14,
          y: -203
        }, {
          x: -22,
          y: -211
        }, {
          x: -36,
          y: -226
        }, {
          x: -24,
          y: -219
        }, {
          x: -9,
          y: -208
        }, {
          x: -7,
          y: -216
        }, {
          x: -13,
          y: -229
        }, {
          x: 0,
          y: -218
        }, {
          x: 6,
          y: -210
        }, {
          x: 8,
          y: -203
        }, {
          x: 11,
          y: -196
        }, {
          x: 12,
          y: -184
        }, {
          x: 13,
          y: -178
        }, {
          x: 15,
          y: -168
        }, {
          x: 11,
          y: -157
        }, {
          x: 4,
          y: -152
        }, {
          x: 5,
          y: -143
        }, {
          x: 35,
          y: -136
        }, {
          x: 42,
          y: -128
        }, {
          x: 38,
          y: -117
        }, {
          x: 14,
          y: -106
        }, {
          x: 12,
          y: -88
        }, {
          x: 29,
          y: -72
        }, {
          x: 31,
          y: -54
        }, {
          x: 32,
          y: -33
        }, {
          x: 30,
          y: -13
        }, {
          x: 30,
          y: 2
        }, {
          x: 36,
          y: 28
        }, {
          x: 25,
          y: 43
        }, {
          x: 39,
          y: 54
        }, {
          x: 55,
          y: 70
        }, {
          x: 71,
          y: 87
        }, {
          x: 84,
          y: 103
        }, {
          x: 96,
          y: 121
        }, {
          x: 100,
          y: 142
        }, {
          x: 102,
          y: 164
        }, {
          x: 106,
          y: 192
        }, {
          x: 111,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 248
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 92,
          y: 250
        }, {
          x: 82,
          y: 249
        }, {
          x: 72,
          y: 247
        }, {
          x: 72,
          y: 239
        }, {
          x: 71,
          y: 229
        }, {
          x: 73,
          y: 215
        }, {
          x: 71,
          y: 192
        }, {
          x: 67,
          y: 175
        }, {
          x: 65,
          y: 158
        }, {
          x: 65,
          y: 145
        }, {
          x: 53,
          y: 130
        }, {
          x: 43,
          y: 120
        }, {
          x: 30,
          y: 109
        }, {
          x: 15,
          y: 95
        }, {
          x: -1,
          y: 87
        }, {
          x: -1,
          y: 100
        }, {
          x: 2,
          y: 112
        }, {
          x: 12,
          y: 132
        }, {
          x: 18,
          y: 154
        }, {
          x: 16,
          y: 176
        }, {
          x: 8,
          y: 191
        }, {
          x: 0,
          y: 207
        }, {
          x: -9,
          y: 224
        }, {
          x: -17,
          y: 237
        }, {
          x: -27,
          y: 254
        }, {
          x: -38,
          y: 251
        }, {
          x: -45,
          y: 244
        }, {
          x: -49,
          y: 250
        }, {
          x: -50,
          y: 258
        }, {
          x: -53,
          y: 267
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[20] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -78,
          y: 253
        }, {
          x: -70,
          y: 243
        }, {
          x: -61,
          y: 238
        }, {
          x: -51,
          y: 228
        }, {
          x: -47,
          y: 215
        }, {
          x: -39,
          y: 198
        }, {
          x: -29,
          y: 181
        }, {
          x: -20,
          y: 169
        }, {
          x: -16,
          y: 158
        }, {
          x: -24,
          y: 136
        }, {
          x: -35,
          y: 115
        }, {
          x: -44,
          y: 92
        }, {
          x: -51,
          y: 77
        }, {
          x: -54,
          y: 66
        }, {
          x: -54,
          y: 54
        }, {
          x: -53,
          y: 48
        }, {
          x: -67,
          y: 38
        }, {
          x: -83,
          y: 23
        }, {
          x: -91,
          y: 10
        }, {
          x: -95,
          y: -4
        }, {
          x: -89,
          y: -25
        }, {
          x: -82,
          y: -43
        }, {
          x: -77,
          y: -57
        }, {
          x: -73,
          y: -66
        }, {
          x: -65,
          y: -75
        }, {
          x: -41,
          y: -86
        }, {
          x: -36,
          y: -100
        }, {
          x: -35,
          y: -114
        }, {
          x: -38,
          y: -126
        }, {
          x: -42,
          y: -134
        }, {
          x: -51,
          y: -135
        }, {
          x: -59,
          y: -140
        }, {
          x: -67,
          y: -151
        }, {
          x: -80,
          y: -157
        }, {
          x: -96,
          y: -167
        }, {
          x: -110,
          y: -178
        }, {
          x: -122,
          y: -191
        }, {
          x: -132,
          y: -203
        }, {
          x: -138,
          y: -220
        }, {
          x: -142,
          y: -248
        }, {
          x: -130,
          y: -233
        }, {
          x: -125,
          y: -222
        }, {
          x: -118,
          y: -211
        }, {
          x: -110,
          y: -201
        }, {
          x: -111,
          y: -213
        }, {
          x: -117,
          y: -236
        }, {
          x: -108,
          y: -224
        }, {
          x: -103,
          y: -211
        }, {
          x: -102,
          y: -199
        }, {
          x: -99,
          y: -187
        }, {
          x: -89,
          y: -179
        }, {
          x: -79,
          y: -171
        }, {
          x: -68,
          y: -165
        }, {
          x: -51,
          y: -163
        }, {
          x: -36,
          y: -156
        }, {
          x: -33,
          y: -164
        }, {
          x: -29,
          y: -176
        }, {
          x: -24,
          y: -165
        }, {
          x: -18,
          y: -153
        }, {
          x: -13,
          y: -159
        }, {
          x: -9,
          y: -174
        }, {
          x: -3,
          y: -158
        }, {
          x: 7,
          y: -162
        }, {
          x: 13,
          y: -173
        }, {
          x: 17,
          y: -182
        }, {
          x: 21,
          y: -191
        }, {
          x: 19,
          y: -202
        }, {
          x: 17,
          y: -210
        }, {
          x: 12,
          y: -218
        }, {
          x: 0,
          y: -238
        }, {
          x: 15,
          y: -226
        }, {
          x: 26,
          y: -211
        }, {
          x: 28,
          y: -222
        }, {
          x: 22,
          y: -243
        }, {
          x: 34,
          y: -227
        }, {
          x: 34,
          y: -212
        }, {
          x: 34,
          y: -202
        }, {
          x: 32,
          y: -194
        }, {
          x: 31,
          y: -185
        }, {
          x: 26,
          y: -174
        }, {
          x: 22,
          y: -164
        }, {
          x: 18,
          y: -155
        }, {
          x: 15,
          y: -145
        }, {
          x: 6,
          y: -138
        }, {
          x: 27,
          y: -129
        }, {
          x: 33,
          y: -120
        }, {
          x: 28,
          y: -110
        }, {
          x: 9,
          y: -101
        }, {
          x: 8,
          y: -82
        }, {
          x: 24,
          y: -69
        }, {
          x: 31,
          y: -48
        }, {
          x: 35,
          y: -29
        }, {
          x: 38,
          y: -12
        }, {
          x: 36,
          y: 7
        }, {
          x: 39,
          y: 23
        }, {
          x: 33,
          y: 45
        }, {
          x: 43,
          y: 56
        }, {
          x: 56,
          y: 70
        }, {
          x: 69,
          y: 85
        }, {
          x: 85,
          y: 105
        }, {
          x: 96,
          y: 119
        }, {
          x: 101,
          y: 139
        }, {
          x: 103,
          y: 165
        }, {
          x: 106,
          y: 196
        }, {
          x: 111,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 248
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 73,
          y: 245
        }, {
          x: 73,
          y: 236
        }, {
          x: 71,
          y: 229
        }, {
          x: 75,
          y: 213
        }, {
          x: 71,
          y: 189
        }, {
          x: 68,
          y: 172
        }, {
          x: 68,
          y: 157
        }, {
          x: 63,
          y: 140
        }, {
          x: 55,
          y: 128
        }, {
          x: 43,
          y: 116
        }, {
          x: 32,
          y: 107
        }, {
          x: 17,
          y: 97
        }, {
          x: -1,
          y: 86
        }, {
          x: 1,
          y: 98
        }, {
          x: 5,
          y: 116
        }, {
          x: 11,
          y: 137
        }, {
          x: 18,
          y: 157
        }, {
          x: 17,
          y: 173
        }, {
          x: 11,
          y: 188
        }, {
          x: 1,
          y: 204
        }, {
          x: -10,
          y: 223
        }, {
          x: -16,
          y: 234
        }, {
          x: -25,
          y: 251
        }, {
          x: -32,
          y: 250
        }, {
          x: -37,
          y: 247
        }, {
          x: -43,
          y: 253
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[21] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -78,
          y: 253
        }, {
          x: -70,
          y: 243
        }, {
          x: -61,
          y: 238
        }, {
          x: -51,
          y: 228
        }, {
          x: -47,
          y: 215
        }, {
          x: -39,
          y: 198
        }, {
          x: -29,
          y: 181
        }, {
          x: -20,
          y: 169
        }, {
          x: -16,
          y: 158
        }, {
          x: -24,
          y: 136
        }, {
          x: -35,
          y: 115
        }, {
          x: -44,
          y: 92
        }, {
          x: -51,
          y: 77
        }, {
          x: -54,
          y: 66
        }, {
          x: -54,
          y: 54
        }, {
          x: -53,
          y: 48
        }, {
          x: -67,
          y: 38
        }, {
          x: -83,
          y: 23
        }, {
          x: -92,
          y: 12
        }, {
          x: -98,
          y: -3
        }, {
          x: -89,
          y: -25
        }, {
          x: -82,
          y: -43
        }, {
          x: -77,
          y: -57
        }, {
          x: -73,
          y: -66
        }, {
          x: -65,
          y: -75
        }, {
          x: -41,
          y: -86
        }, {
          x: -36,
          y: -100
        }, {
          x: -35,
          y: -114
        }, {
          x: -38,
          y: -126
        }, {
          x: -42,
          y: -134
        }, {
          x: -51,
          y: -135
        }, {
          x: -59,
          y: -140
        }, {
          x: -69,
          y: -151
        }, {
          x: -75,
          y: -158
        }, {
          x: -92,
          y: -169
        }, {
          x: -108,
          y: -181
        }, {
          x: -118,
          y: -196
        }, {
          x: -128,
          y: -214
        }, {
          x: -133,
          y: -233
        }, {
          x: -135,
          y: -249
        }, {
          x: -125,
          y: -238
        }, {
          x: -121,
          y: -229
        }, {
          x: -116,
          y: -219
        }, {
          x: -111,
          y: -212
        }, {
          x: -108,
          y: -221
        }, {
          x: -112,
          y: -244
        }, {
          x: -103,
          y: -226
        }, {
          x: -101,
          y: -216
        }, {
          x: -102,
          y: -199
        }, {
          x: -97,
          y: -189
        }, {
          x: -87,
          y: -183
        }, {
          x: -77,
          y: -174
        }, {
          x: -66,
          y: -168
        }, {
          x: -51,
          y: -163
        }, {
          x: -36,
          y: -158
        }, {
          x: -32,
          y: -164
        }, {
          x: -26,
          y: -179
        }, {
          x: -23,
          y: -164
        }, {
          x: -14,
          y: -151
        }, {
          x: -10,
          y: -159
        }, {
          x: -8,
          y: -179
        }, {
          x: -1,
          y: -160
        }, {
          x: 11,
          y: -167
        }, {
          x: 15,
          y: -176
        }, {
          x: 23,
          y: -183
        }, {
          x: 28,
          y: -191
        }, {
          x: 30,
          y: -201
        }, {
          x: 30,
          y: -210
        }, {
          x: 26,
          y: -226
        }, {
          x: 18,
          y: -244
        }, {
          x: 31,
          y: -231
        }, {
          x: 37,
          y: -218
        }, {
          x: 41,
          y: -233
        }, {
          x: 34,
          y: -253
        }, {
          x: 48,
          y: -232
        }, {
          x: 48,
          y: -211
        }, {
          x: 44,
          y: -200
        }, {
          x: 42,
          y: -189
        }, {
          x: 38,
          y: -178
        }, {
          x: 32,
          y: -170
        }, {
          x: 27,
          y: -164
        }, {
          x: 21,
          y: -152
        }, {
          x: 17,
          y: -142
        }, {
          x: 6,
          y: -138
        }, {
          x: 17,
          y: -132
        }, {
          x: 22,
          y: -123
        }, {
          x: 19,
          y: -112
        }, {
          x: 9,
          y: -101
        }, {
          x: 8,
          y: -82
        }, {
          x: 24,
          y: -69
        }, {
          x: 31,
          y: -48
        }, {
          x: 35,
          y: -29
        }, {
          x: 38,
          y: -12
        }, {
          x: 36,
          y: 6
        }, {
          x: 40,
          y: 24
        }, {
          x: 33,
          y: 45
        }, {
          x: 43,
          y: 56
        }, {
          x: 56,
          y: 70
        }, {
          x: 69,
          y: 85
        }, {
          x: 85,
          y: 105
        }, {
          x: 96,
          y: 119
        }, {
          x: 101,
          y: 139
        }, {
          x: 103,
          y: 165
        }, {
          x: 106,
          y: 196
        }, {
          x: 111,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 248
        }, {
          x: 126,
          y: 255
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 73,
          y: 245
        }, {
          x: 73,
          y: 236
        }, {
          x: 71,
          y: 229
        }, {
          x: 75,
          y: 213
        }, {
          x: 71,
          y: 189
        }, {
          x: 68,
          y: 172
        }, {
          x: 68,
          y: 157
        }, {
          x: 63,
          y: 140
        }, {
          x: 55,
          y: 128
        }, {
          x: 43,
          y: 116
        }, {
          x: 32,
          y: 107
        }, {
          x: 17,
          y: 97
        }, {
          x: -1,
          y: 86
        }, {
          x: 1,
          y: 98
        }, {
          x: 5,
          y: 116
        }, {
          x: 11,
          y: 137
        }, {
          x: 18,
          y: 157
        }, {
          x: 17,
          y: 173
        }, {
          x: 11,
          y: 188
        }, {
          x: 1,
          y: 204
        }, {
          x: -10,
          y: 223
        }, {
          x: -16,
          y: 234
        }, {
          x: -25,
          y: 251
        }, {
          x: -32,
          y: 250
        }, {
          x: -37,
          y: 247
        }, {
          x: -42,
          y: 255
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[22] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -76,
          y: 254
        }, {
          x: -69,
          y: 245
        }, {
          x: -59,
          y: 239
        }, {
          x: -50,
          y: 231
        }, {
          x: -43,
          y: 219
        }, {
          x: -35,
          y: 200
        }, {
          x: -25,
          y: 181
        }, {
          x: -17,
          y: 170
        }, {
          x: -13,
          y: 157
        }, {
          x: -20,
          y: 135
        }, {
          x: -28,
          y: 111
        }, {
          x: -38,
          y: 90
        }, {
          x: -46,
          y: 72
        }, {
          x: -49,
          y: 64
        }, {
          x: -49,
          y: 54
        }, {
          x: -46,
          y: 49
        }, {
          x: -66,
          y: 37
        }, {
          x: -83,
          y: 22
        }, {
          x: -93,
          y: 9
        }, {
          x: -98,
          y: -6
        }, {
          x: -89,
          y: -26
        }, {
          x: -84,
          y: -43
        }, {
          x: -79,
          y: -58
        }, {
          x: -74,
          y: -68
        }, {
          x: -66,
          y: -74
        }, {
          x: -44,
          y: -82
        }, {
          x: -40,
          y: -101
        }, {
          x: -36,
          y: -116
        }, {
          x: -38,
          y: -130
        }, {
          x: -42,
          y: -136
        }, {
          x: -50,
          y: -140
        }, {
          x: -59,
          y: -142
        }, {
          x: -69,
          y: -151
        }, {
          x: -75,
          y: -158
        }, {
          x: -87,
          y: -165
        }, {
          x: -102,
          y: -175
        }, {
          x: -114,
          y: -191
        }, {
          x: -128,
          y: -213
        }, {
          x: -136,
          y: -234
        }, {
          x: -140,
          y: -251
        }, {
          x: -129,
          y: -241
        }, {
          x: -124,
          y: -232
        }, {
          x: -118,
          y: -221
        }, {
          x: -112,
          y: -211
        }, {
          x: -107,
          y: -226
        }, {
          x: -109,
          y: -243
        }, {
          x: -101,
          y: -230
        }, {
          x: -102,
          y: -216
        }, {
          x: -106,
          y: -203
        }, {
          x: -97,
          y: -192
        }, {
          x: -94,
          y: -184
        }, {
          x: -84,
          y: -175
        }, {
          x: -71,
          y: -170
        }, {
          x: -56,
          y: -163
        }, {
          x: -43,
          y: -158
        }, {
          x: -36,
          y: -168
        }, {
          x: -32,
          y: -179
        }, {
          x: -26,
          y: -165
        }, {
          x: -18,
          y: -153
        }, {
          x: -9,
          y: -159
        }, {
          x: -5,
          y: -178
        }, {
          x: 3,
          y: -162
        }, {
          x: 13,
          y: -167
        }, {
          x: 15,
          y: -175
        }, {
          x: 28,
          y: -184
        }, {
          x: 37,
          y: -192
        }, {
          x: 43,
          y: -202
        }, {
          x: 46,
          y: -217
        }, {
          x: 43,
          y: -233
        }, {
          x: 34,
          y: -249
        }, {
          x: 46,
          y: -241
        }, {
          x: 52,
          y: -227
        }, {
          x: 56,
          y: -245
        }, {
          x: 50,
          y: -264
        }, {
          x: 62,
          y: -236
        }, {
          x: 63,
          y: -224
        }, {
          x: 56,
          y: -209
        }, {
          x: 52,
          y: -196
        }, {
          x: 46,
          y: -183
        }, {
          x: 38,
          y: -170
        }, {
          x: 27,
          y: -164
        }, {
          x: 22,
          y: -154
        }, {
          x: 14,
          y: -144
        }, {
          x: 4,
          y: -138
        }, {
          x: 9,
          y: -128
        }, {
          x: 12,
          y: -118
        }, {
          x: 9,
          y: -100
        }, {
          x: 11,
          y: -88
        }, {
          x: 8,
          y: -74
        }, {
          x: 23,
          y: -64
        }, {
          x: 31,
          y: -48
        }, {
          x: 35,
          y: -29
        }, {
          x: 40,
          y: -10
        }, {
          x: 38,
          y: 6
        }, {
          x: 41,
          y: 20
        }, {
          x: 36,
          y: 36
        }, {
          x: 46,
          y: 51
        }, {
          x: 59,
          y: 66
        }, {
          x: 74,
          y: 85
        }, {
          x: 87,
          y: 104
        }, {
          x: 96,
          y: 119
        }, {
          x: 102,
          y: 139
        }, {
          x: 104,
          y: 167
        }, {
          x: 106,
          y: 196
        }, {
          x: 110,
          y: 224
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 246
        }, {
          x: 129,
          y: 256
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 244
        }, {
          x: 77,
          y: 236
        }, {
          x: 73,
          y: 231
        }, {
          x: 76,
          y: 213
        }, {
          x: 73,
          y: 189
        }, {
          x: 72,
          y: 173
        }, {
          x: 69,
          y: 156
        }, {
          x: 66,
          y: 141
        }, {
          x: 58,
          y: 126
        }, {
          x: 45,
          y: 111
        }, {
          x: 33,
          y: 103
        }, {
          x: 21,
          y: 91
        }, {
          x: 6,
          y: 82
        }, {
          x: 6,
          y: 99
        }, {
          x: 11,
          y: 114
        }, {
          x: 17,
          y: 133
        }, {
          x: 22,
          y: 154
        }, {
          x: 20,
          y: 173
        }, {
          x: 15,
          y: 187
        }, {
          x: 3,
          y: 206
        }, {
          x: -6,
          y: 224
        }, {
          x: -14,
          y: 236
        }, {
          x: -23,
          y: 253
        }, {
          x: -32,
          y: 246
        }, {
          x: -37,
          y: 247
        }, {
          x: -42,
          y: 255
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[23] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -76,
          y: 254
        }, {
          x: -69,
          y: 245
        }, {
          x: -59,
          y: 239
        }, {
          x: -50,
          y: 231
        }, {
          x: -43,
          y: 219
        }, {
          x: -33,
          y: 200
        }, {
          x: -23,
          y: 181
        }, {
          x: -15,
          y: 169
        }, {
          x: -10,
          y: 158
        }, {
          x: -18,
          y: 133
        }, {
          x: -25,
          y: 110
        }, {
          x: -34,
          y: 89
        }, {
          x: -42,
          y: 69
        }, {
          x: -44,
          y: 57
        }, {
          x: -44,
          y: 48
        }, {
          x: -44,
          y: 47
        }, {
          x: -66,
          y: 35
        }, {
          x: -83,
          y: 21
        }, {
          x: -93,
          y: 9
        }, {
          x: -98,
          y: -7
        }, {
          x: -89,
          y: -27
        }, {
          x: -84,
          y: -43
        }, {
          x: -79,
          y: -58
        }, {
          x: -74,
          y: -70
        }, {
          x: -66,
          y: -76
        }, {
          x: -43,
          y: -84
        }, {
          x: -40,
          y: -101
        }, {
          x: -36,
          y: -116
        }, {
          x: -38,
          y: -130
        }, {
          x: -38,
          y: -142
        }, {
          x: -50,
          y: -144
        }, {
          x: -60,
          y: -148
        }, {
          x: -66,
          y: -158
        }, {
          x: -73,
          y: -165
        }, {
          x: -86,
          y: -170
        }, {
          x: -100,
          y: -178
        }, {
          x: -114,
          y: -195
        }, {
          x: -128,
          y: -219
        }, {
          x: -135,
          y: -241
        }, {
          x: -137,
          y: -257
        }, {
          x: -127,
          y: -248
        }, {
          x: -121,
          y: -234
        }, {
          x: -116,
          y: -224
        }, {
          x: -108,
          y: -217
        }, {
          x: -104,
          y: -233
        }, {
          x: -105,
          y: -251
        }, {
          x: -98,
          y: -234
        }, {
          x: -99,
          y: -218
        }, {
          x: -100,
          y: -204
        }, {
          x: -96,
          y: -194
        }, {
          x: -88,
          y: -188
        }, {
          x: -78,
          y: -181
        }, {
          x: -65,
          y: -177
        }, {
          x: -55,
          y: -168
        }, {
          x: -43,
          y: -167
        }, {
          x: -36,
          y: -173
        }, {
          x: -32,
          y: -189
        }, {
          x: -28,
          y: -169
        }, {
          x: -18,
          y: -162
        }, {
          x: -10,
          y: -165
        }, {
          x: -5,
          y: -185
        }, {
          x: 1,
          y: -173
        }, {
          x: 12,
          y: -176
        }, {
          x: 15,
          y: -185
        }, {
          x: 25,
          y: -190
        }, {
          x: 37,
          y: -197
        }, {
          x: 45,
          y: -208
        }, {
          x: 49,
          y: -222
        }, {
          x: 45,
          y: -234
        }, {
          x: 34,
          y: -253
        }, {
          x: 49,
          y: -245
        }, {
          x: 55,
          y: -236
        }, {
          x: 60,
          y: -246
        }, {
          x: 60,
          y: -268
        }, {
          x: 68,
          y: -247
        }, {
          x: 66,
          y: -230
        }, {
          x: 62,
          y: -217
        }, {
          x: 55,
          y: -202
        }, {
          x: 46,
          y: -188
        }, {
          x: 33,
          y: -179
        }, {
          x: 21,
          y: -168
        }, {
          x: 20,
          y: -157
        }, {
          x: 13,
          y: -150
        }, {
          x: 4,
          y: -143
        }, {
          x: 6,
          y: -130
        }, {
          x: 7,
          y: -114
        }, {
          x: 9,
          y: -100
        }, {
          x: 11,
          y: -88
        }, {
          x: 8,
          y: -78
        }, {
          x: 24,
          y: -68
        }, {
          x: 31,
          y: -52
        }, {
          x: 34,
          y: -32
        }, {
          x: 40,
          y: -14
        }, {
          x: 43,
          y: 3
        }, {
          x: 45,
          y: 18
        }, {
          x: 40,
          y: 33
        }, {
          x: 49,
          y: 47
        }, {
          x: 62,
          y: 63
        }, {
          x: 75,
          y: 81
        }, {
          x: 89,
          y: 103
        }, {
          x: 98,
          y: 120
        }, {
          x: 103,
          y: 141
        }, {
          x: 105,
          y: 170
        }, {
          x: 106,
          y: 196
        }, {
          x: 109,
          y: 225
        }, {
          x: 103,
          y: 229
        }, {
          x: 106,
          y: 235
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 246
        }, {
          x: 129,
          y: 256
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 244
        }, {
          x: 77,
          y: 236
        }, {
          x: 73,
          y: 231
        }, {
          x: 76,
          y: 213
        }, {
          x: 73,
          y: 189
        }, {
          x: 72,
          y: 173
        }, {
          x: 69,
          y: 156
        }, {
          x: 67,
          y: 140
        }, {
          x: 60,
          y: 124
        }, {
          x: 49,
          y: 111
        }, {
          x: 38,
          y: 101
        }, {
          x: 28,
          y: 90
        }, {
          x: 12,
          y: 78
        }, {
          x: 12,
          y: 94
        }, {
          x: 15,
          y: 114
        }, {
          x: 20,
          y: 136
        }, {
          x: 25,
          y: 153
        }, {
          x: 22,
          y: 172
        }, {
          x: 15,
          y: 191
        }, {
          x: 6,
          y: 204
        }, {
          x: -4,
          y: 223
        }, {
          x: -13,
          y: 239
        }, {
          x: -23,
          y: 253
        }, {
          x: -32,
          y: 246
        }, {
          x: -37,
          y: 247
        }, {
          x: -42,
          y: 255
        }, {
          x: -45,
          y: 262
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[24] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -76,
          y: 254
        }, {
          x: -67,
          y: 247
        }, {
          x: -58,
          y: 241
        }, {
          x: -48,
          y: 234
        }, {
          x: -43,
          y: 219
        }, {
          x: -34,
          y: 205
        }, {
          x: -22,
          y: 180
        }, {
          x: -14,
          y: 167
        }, {
          x: -8,
          y: 159
        }, {
          x: -16,
          y: 131
        }, {
          x: -22,
          y: 107
        }, {
          x: -29,
          y: 85
        }, {
          x: -37,
          y: 68
        }, {
          x: -41,
          y: 53
        }, {
          x: -44,
          y: 45
        }, {
          x: -42,
          y: 35
        }, {
          x: -64,
          y: 28
        }, {
          x: -83,
          y: 17
        }, {
          x: -94,
          y: 4
        }, {
          x: -98,
          y: -13
        }, {
          x: -92,
          y: -31
        }, {
          x: -86,
          y: -45
        }, {
          x: -81,
          y: -59
        }, {
          x: -76,
          y: -73
        }, {
          x: -65,
          y: -81
        }, {
          x: -42,
          y: -87
        }, {
          x: -40,
          y: -101
        }, {
          x: -35,
          y: -115
        }, {
          x: -38,
          y: -130
        }, {
          x: -38,
          y: -142
        }, {
          x: -50,
          y: -144
        }, {
          x: -60,
          y: -148
        }, {
          x: -65,
          y: -160
        }, {
          x: -72,
          y: -169
        }, {
          x: -87,
          y: -173
        }, {
          x: -100,
          y: -181
        }, {
          x: -112,
          y: -200
        }, {
          x: -124,
          y: -222
        }, {
          x: -132,
          y: -249
        }, {
          x: -132,
          y: -260
        }, {
          x: -123,
          y: -250
        }, {
          x: -118,
          y: -237
        }, {
          x: -113,
          y: -224
        }, {
          x: -107,
          y: -224
        }, {
          x: -101,
          y: -234
        }, {
          x: -101,
          y: -250
        }, {
          x: -94,
          y: -232
        }, {
          x: -96,
          y: -219
        }, {
          x: -98,
          y: -208
        }, {
          x: -94,
          y: -199
        }, {
          x: -87,
          y: -189
        }, {
          x: -78,
          y: -183
        }, {
          x: -63,
          y: -177
        }, {
          x: -53,
          y: -170
        }, {
          x: -43,
          y: -167
        }, {
          x: -36,
          y: -173
        }, {
          x: -32,
          y: -189
        }, {
          x: -28,
          y: -169
        }, {
          x: -21,
          y: -162
        }, {
          x: -12,
          y: -165
        }, {
          x: -7,
          y: -186
        }, {
          x: -1,
          y: -174
        }, {
          x: 14,
          y: -178
        }, {
          x: 18,
          y: -189
        }, {
          x: 28,
          y: -192
        }, {
          x: 40,
          y: -203
        }, {
          x: 47,
          y: -215
        }, {
          x: 51,
          y: -230
        }, {
          x: 47,
          y: -240
        }, {
          x: 34,
          y: -260
        }, {
          x: 48,
          y: -253
        }, {
          x: 57,
          y: -245
        }, {
          x: 65,
          y: -252
        }, {
          x: 68,
          y: -273
        }, {
          x: 75,
          y: -251
        }, {
          x: 68,
          y: -239
        }, {
          x: 63,
          y: -227
        }, {
          x: 58,
          y: -207
        }, {
          x: 49,
          y: -191
        }, {
          x: 35,
          y: -181
        }, {
          x: 21,
          y: -174
        }, {
          x: 20,
          y: -165
        }, {
          x: 12,
          y: -155
        }, {
          x: 2,
          y: -147
        }, {
          x: 4,
          y: -131
        }, {
          x: 6,
          y: -114
        }, {
          x: 9,
          y: -101
        }, {
          x: 11,
          y: -88
        }, {
          x: 9,
          y: -77
        }, {
          x: 21,
          y: -68
        }, {
          x: 30,
          y: -52
        }, {
          x: 35,
          y: -30
        }, {
          x: 43,
          y: -8
        }, {
          x: 46,
          y: 11
        }, {
          x: 41,
          y: 23
        }, {
          x: 45,
          y: 33
        }, {
          x: 55,
          y: 47
        }, {
          x: 63,
          y: 60
        }, {
          x: 75,
          y: 77
        }, {
          x: 88,
          y: 99
        }, {
          x: 98,
          y: 121
        }, {
          x: 101,
          y: 143
        }, {
          x: 101,
          y: 169
        }, {
          x: 101,
          y: 197
        }, {
          x: 101,
          y: 213
        }, {
          x: 103,
          y: 225
        }, {
          x: 107,
          y: 230
        }, {
          x: 113,
          y: 241
        }, {
          x: 128,
          y: 246
        }, {
          x: 129,
          y: 256
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 247
        }, {
          x: 75,
          y: 236
        }, {
          x: 72,
          y: 230
        }, {
          x: 75,
          y: 212
        }, {
          x: 72,
          y: 188
        }, {
          x: 70,
          y: 170
        }, {
          x: 69,
          y: 156
        }, {
          x: 66,
          y: 140
        }, {
          x: 57,
          y: 122
        }, {
          x: 48,
          y: 109
        }, {
          x: 39,
          y: 99
        }, {
          x: 27,
          y: 88
        }, {
          x: 15,
          y: 76
        }, {
          x: 14,
          y: 95
        }, {
          x: 18,
          y: 117
        }, {
          x: 22,
          y: 135
        }, {
          x: 25,
          y: 152
        }, {
          x: 23,
          y: 169
        }, {
          x: 15,
          y: 188
        }, {
          x: 6,
          y: 204
        }, {
          x: -4,
          y: 219
        }, {
          x: -14,
          y: 239
        }, {
          x: -23,
          y: 253
        }, {
          x: -30,
          y: 250
        }, {
          x: -35,
          y: 250
        }, {
          x: -39,
          y: 254
        }, {
          x: -44,
          y: 263
        }, {
          x: -52,
          y: 271
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[25] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -77,
          y: 253
        }, {
          x: -68,
          y: 246
        }, {
          x: -59,
          y: 238
        }, {
          x: -48,
          y: 232
        }, {
          x: -43,
          y: 219
        }, {
          x: -32,
          y: 198
        }, {
          x: -24,
          y: 178
        }, {
          x: -16,
          y: 166
        }, {
          x: -8,
          y: 154
        }, {
          x: -14,
          y: 127
        }, {
          x: -21,
          y: 103
        }, {
          x: -28,
          y: 79
        }, {
          x: -37,
          y: 60
        }, {
          x: -39,
          y: 45
        }, {
          x: -37,
          y: 37
        }, {
          x: -38,
          y: 29
        }, {
          x: -64,
          y: 18
        }, {
          x: -83,
          y: 10
        }, {
          x: -95,
          y: -1
        }, {
          x: -98,
          y: -16
        }, {
          x: -93,
          y: -35
        }, {
          x: -86,
          y: -48
        }, {
          x: -81,
          y: -64
        }, {
          x: -79,
          y: -77
        }, {
          x: -67,
          y: -87
        }, {
          x: -43,
          y: -94
        }, {
          x: -40,
          y: -111
        }, {
          x: -35,
          y: -125
        }, {
          x: -38,
          y: -140
        }, {
          x: -38,
          y: -152
        }, {
          x: -50,
          y: -154
        }, {
          x: -60,
          y: -158
        }, {
          x: -65,
          y: -170
        }, {
          x: -72,
          y: -179
        }, {
          x: -87,
          y: -183
        }, {
          x: -100,
          y: -191
        }, {
          x: -112,
          y: -210
        }, {
          x: -124,
          y: -232
        }, {
          x: -132,
          y: -259
        }, {
          x: -132,
          y: -270
        }, {
          x: -123,
          y: -260
        }, {
          x: -118,
          y: -247
        }, {
          x: -113,
          y: -234
        }, {
          x: -107,
          y: -234
        }, {
          x: -101,
          y: -244
        }, {
          x: -101,
          y: -260
        }, {
          x: -94,
          y: -242
        }, {
          x: -96,
          y: -229
        }, {
          x: -98,
          y: -218
        }, {
          x: -94,
          y: -209
        }, {
          x: -87,
          y: -199
        }, {
          x: -78,
          y: -193
        }, {
          x: -63,
          y: -187
        }, {
          x: -53,
          y: -180
        }, {
          x: -43,
          y: -177
        }, {
          x: -36,
          y: -183
        }, {
          x: -32,
          y: -199
        }, {
          x: -28,
          y: -179
        }, {
          x: -21,
          y: -172
        }, {
          x: -12,
          y: -175
        }, {
          x: -7,
          y: -196
        }, {
          x: -1,
          y: -184
        }, {
          x: 14,
          y: -188
        }, {
          x: 18,
          y: -199
        }, {
          x: 28,
          y: -202
        }, {
          x: 40,
          y: -213
        }, {
          x: 47,
          y: -225
        }, {
          x: 51,
          y: -240
        }, {
          x: 47,
          y: -250
        }, {
          x: 34,
          y: -270
        }, {
          x: 48,
          y: -263
        }, {
          x: 57,
          y: -255
        }, {
          x: 65,
          y: -262
        }, {
          x: 68,
          y: -283
        }, {
          x: 75,
          y: -261
        }, {
          x: 68,
          y: -249
        }, {
          x: 63,
          y: -237
        }, {
          x: 58,
          y: -217
        }, {
          x: 49,
          y: -201
        }, {
          x: 35,
          y: -191
        }, {
          x: 21,
          y: -184
        }, {
          x: 20,
          y: -175
        }, {
          x: 12,
          y: -165
        }, {
          x: 2,
          y: -157
        }, {
          x: 4,
          y: -141
        }, {
          x: 5,
          y: -124
        }, {
          x: 9,
          y: -110
        }, {
          x: 11,
          y: -98
        }, {
          x: 9,
          y: -86
        }, {
          x: 22,
          y: -77
        }, {
          x: 30,
          y: -62
        }, {
          x: 36,
          y: -42
        }, {
          x: 43,
          y: -16
        }, {
          x: 44,
          y: 2
        }, {
          x: 42,
          y: 20
        }, {
          x: 51,
          y: 34
        }, {
          x: 59,
          y: 47
        }, {
          x: 67,
          y: 61
        }, {
          x: 77,
          y: 80
        }, {
          x: 87,
          y: 99
        }, {
          x: 95,
          y: 121
        }, {
          x: 98,
          y: 147
        }, {
          x: 96,
          y: 170
        }, {
          x: 95,
          y: 197
        }, {
          x: 97,
          y: 214
        }, {
          x: 98,
          y: 225
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 247
        }, {
          x: 75,
          y: 232
        }, {
          x: 69,
          y: 230
        }, {
          x: 69,
          y: 212
        }, {
          x: 69,
          y: 191
        }, {
          x: 66,
          y: 172
        }, {
          x: 65,
          y: 156
        }, {
          x: 65,
          y: 141
        }, {
          x: 54,
          y: 122
        }, {
          x: 47,
          y: 111
        }, {
          x: 37,
          y: 97
        }, {
          x: 29,
          y: 87
        }, {
          x: 17,
          y: 75
        }, {
          x: 18,
          y: 96
        }, {
          x: 20,
          y: 115
        }, {
          x: 24,
          y: 132
        }, {
          x: 27,
          y: 152
        }, {
          x: 24,
          y: 166
        }, {
          x: 14,
          y: 185
        }, {
          x: 4,
          y: 203
        }, {
          x: -4,
          y: 216
        }, {
          x: -13,
          y: 234
        }, {
          x: -23,
          y: 252
        }, {
          x: -29,
          y: 248
        }, {
          x: -35,
          y: 248
        }, {
          x: -42,
          y: 253
        }, {
          x: -46,
          y: 262
        }, {
          x: -52,
          y: 270
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[26] = [
        {
          x: -78,
          y: 273
        }, {
          x: -81,
          y: 263
        }, {
          x: -77,
          y: 253
        }, {
          x: -68,
          y: 246
        }, {
          x: -59,
          y: 238
        }, {
          x: -48,
          y: 232
        }, {
          x: -43,
          y: 219
        }, {
          x: -32,
          y: 198
        }, {
          x: -24,
          y: 178
        }, {
          x: -16,
          y: 166
        }, {
          x: -8,
          y: 154
        }, {
          x: -14,
          y: 127
        }, {
          x: -21,
          y: 103
        }, {
          x: -28,
          y: 79
        }, {
          x: -37,
          y: 60
        }, {
          x: -39,
          y: 45
        }, {
          x: -37,
          y: 32
        }, {
          x: -37,
          y: 25
        }, {
          x: -64,
          y: 16
        }, {
          x: -82,
          y: 5
        }, {
          x: -94,
          y: -3
        }, {
          x: -98,
          y: -16
        }, {
          x: -93,
          y: -35
        }, {
          x: -86,
          y: -48
        }, {
          x: -81,
          y: -64
        }, {
          x: -78,
          y: -78
        }, {
          x: -66,
          y: -89
        }, {
          x: -42,
          y: -97
        }, {
          x: -40,
          y: -116
        }, {
          x: -35,
          y: -130
        }, {
          x: -38,
          y: -145
        }, {
          x: -38,
          y: -157
        }, {
          x: -50,
          y: -159
        }, {
          x: -60,
          y: -163
        }, {
          x: -65,
          y: -175
        }, {
          x: -72,
          y: -184
        }, {
          x: -87,
          y: -188
        }, {
          x: -100,
          y: -196
        }, {
          x: -112,
          y: -215
        }, {
          x: -124,
          y: -237
        }, {
          x: -132,
          y: -264
        }, {
          x: -132,
          y: -275
        }, {
          x: -123,
          y: -265
        }, {
          x: -118,
          y: -252
        }, {
          x: -113,
          y: -239
        }, {
          x: -107,
          y: -239
        }, {
          x: -101,
          y: -249
        }, {
          x: -101,
          y: -265
        }, {
          x: -94,
          y: -247
        }, {
          x: -96,
          y: -234
        }, {
          x: -98,
          y: -223
        }, {
          x: -94,
          y: -214
        }, {
          x: -87,
          y: -204
        }, {
          x: -78,
          y: -198
        }, {
          x: -63,
          y: -192
        }, {
          x: -53,
          y: -185
        }, {
          x: -43,
          y: -182
        }, {
          x: -36,
          y: -188
        }, {
          x: -32,
          y: -204
        }, {
          x: -28,
          y: -184
        }, {
          x: -21,
          y: -177
        }, {
          x: -12,
          y: -180
        }, {
          x: -7,
          y: -201
        }, {
          x: -1,
          y: -189
        }, {
          x: 14,
          y: -193
        }, {
          x: 18,
          y: -204
        }, {
          x: 28,
          y: -207
        }, {
          x: 40,
          y: -218
        }, {
          x: 47,
          y: -230
        }, {
          x: 51,
          y: -245
        }, {
          x: 47,
          y: -255
        }, {
          x: 34,
          y: -275
        }, {
          x: 48,
          y: -268
        }, {
          x: 57,
          y: -260
        }, {
          x: 65,
          y: -267
        }, {
          x: 68,
          y: -288
        }, {
          x: 75,
          y: -266
        }, {
          x: 68,
          y: -254
        }, {
          x: 63,
          y: -242
        }, {
          x: 58,
          y: -222
        }, {
          x: 49,
          y: -206
        }, {
          x: 35,
          y: -196
        }, {
          x: 21,
          y: -189
        }, {
          x: 20,
          y: -180
        }, {
          x: 12,
          y: -170
        }, {
          x: 2,
          y: -162
        }, {
          x: 4,
          y: -146
        }, {
          x: 5,
          y: -129
        }, {
          x: 10,
          y: -114
        }, {
          x: 12,
          y: -101
        }, {
          x: 10,
          y: -91
        }, {
          x: 23,
          y: -80
        }, {
          x: 28,
          y: -63
        }, {
          x: 36,
          y: -42
        }, {
          x: 43,
          y: -16
        }, {
          x: 44,
          y: 2
        }, {
          x: 42,
          y: 20
        }, {
          x: 51,
          y: 34
        }, {
          x: 59,
          y: 47
        }, {
          x: 67,
          y: 61
        }, {
          x: 77,
          y: 80
        }, {
          x: 87,
          y: 99
        }, {
          x: 95,
          y: 121
        }, {
          x: 98,
          y: 147
        }, {
          x: 96,
          y: 170
        }, {
          x: 95,
          y: 197
        }, {
          x: 97,
          y: 214
        }, {
          x: 98,
          y: 225
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 74,
          y: 247
        }, {
          x: 75,
          y: 232
        }, {
          x: 69,
          y: 230
        }, {
          x: 69,
          y: 212
        }, {
          x: 69,
          y: 191
        }, {
          x: 66,
          y: 172
        }, {
          x: 65,
          y: 156
        }, {
          x: 65,
          y: 141
        }, {
          x: 54,
          y: 122
        }, {
          x: 47,
          y: 111
        }, {
          x: 37,
          y: 97
        }, {
          x: 29,
          y: 87
        }, {
          x: 17,
          y: 75
        }, {
          x: 18,
          y: 96
        }, {
          x: 20,
          y: 115
        }, {
          x: 24,
          y: 132
        }, {
          x: 27,
          y: 152
        }, {
          x: 24,
          y: 166
        }, {
          x: 14,
          y: 185
        }, {
          x: 4,
          y: 203
        }, {
          x: -4,
          y: 216
        }, {
          x: -13,
          y: 234
        }, {
          x: -23,
          y: 252
        }, {
          x: -29,
          y: 248
        }, {
          x: -35,
          y: 248
        }, {
          x: -42,
          y: 253
        }, {
          x: -46,
          y: 262
        }, {
          x: -52,
          y: 270
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      this.frames[27] = [
        {
          x: -78,
          y: 273
        }, {
          x: -78,
          y: 261
        }, {
          x: -77,
          y: 253
        }, {
          x: -69,
          y: 245
        }, {
          x: -62,
          y: 235
        }, {
          x: -52,
          y: 228
        }, {
          x: -45,
          y: 217
        }, {
          x: -36,
          y: 198
        }, {
          x: -26,
          y: 173
        }, {
          x: -18,
          y: 162
        }, {
          x: -9,
          y: 150
        }, {
          x: -14,
          y: 124
        }, {
          x: -19,
          y: 103
        }, {
          x: -25,
          y: 76
        }, {
          x: -32,
          y: 59
        }, {
          x: -35,
          y: 42
        }, {
          x: -37,
          y: 27
        }, {
          x: -38,
          y: 17
        }, {
          x: -63,
          y: 6
        }, {
          x: -82,
          y: -4
        }, {
          x: -94,
          y: -10
        }, {
          x: -99,
          y: -20
        }, {
          x: -94,
          y: -38
        }, {
          x: -86,
          y: -53
        }, {
          x: -82,
          y: -67
        }, {
          x: -79,
          y: -83
        }, {
          x: -68,
          y: -95
        }, {
          x: -41,
          y: -104
        }, {
          x: -40,
          y: -120
        }, {
          x: -35,
          y: -134
        }, {
          x: -38,
          y: -149
        }, {
          x: -38,
          y: -161
        }, {
          x: -50,
          y: -163
        }, {
          x: -60,
          y: -167
        }, {
          x: -65,
          y: -179
        }, {
          x: -72,
          y: -188
        }, {
          x: -87,
          y: -192
        }, {
          x: -100,
          y: -200
        }, {
          x: -112,
          y: -219
        }, {
          x: -124,
          y: -241
        }, {
          x: -132,
          y: -268
        }, {
          x: -132,
          y: -279
        }, {
          x: -123,
          y: -269
        }, {
          x: -118,
          y: -256
        }, {
          x: -113,
          y: -243
        }, {
          x: -107,
          y: -243
        }, {
          x: -101,
          y: -253
        }, {
          x: -101,
          y: -269
        }, {
          x: -94,
          y: -251
        }, {
          x: -96,
          y: -238
        }, {
          x: -98,
          y: -227
        }, {
          x: -94,
          y: -218
        }, {
          x: -87,
          y: -208
        }, {
          x: -78,
          y: -202
        }, {
          x: -63,
          y: -196
        }, {
          x: -53,
          y: -189
        }, {
          x: -43,
          y: -186
        }, {
          x: -36,
          y: -192
        }, {
          x: -32,
          y: -208
        }, {
          x: -28,
          y: -188
        }, {
          x: -21,
          y: -181
        }, {
          x: -12,
          y: -184
        }, {
          x: -7,
          y: -205
        }, {
          x: -1,
          y: -193
        }, {
          x: 14,
          y: -197
        }, {
          x: 18,
          y: -208
        }, {
          x: 28,
          y: -211
        }, {
          x: 40,
          y: -222
        }, {
          x: 47,
          y: -234
        }, {
          x: 51,
          y: -249
        }, {
          x: 47,
          y: -259
        }, {
          x: 34,
          y: -279
        }, {
          x: 48,
          y: -272
        }, {
          x: 57,
          y: -264
        }, {
          x: 65,
          y: -271
        }, {
          x: 68,
          y: -292
        }, {
          x: 75,
          y: -270
        }, {
          x: 68,
          y: -258
        }, {
          x: 63,
          y: -246
        }, {
          x: 58,
          y: -226
        }, {
          x: 49,
          y: -210
        }, {
          x: 35,
          y: -200
        }, {
          x: 21,
          y: -193
        }, {
          x: 20,
          y: -184
        }, {
          x: 12,
          y: -174
        }, {
          x: 2,
          y: -166
        }, {
          x: 4,
          y: -150
        }, {
          x: 5,
          y: -133
        }, {
          x: 9,
          y: -119
        }, {
          x: 10,
          y: -108
        }, {
          x: 8,
          y: -100
        }, {
          x: 22,
          y: -88
        }, {
          x: 30,
          y: -72
        }, {
          x: 37,
          y: -47
        }, {
          x: 46,
          y: -19
        }, {
          x: 45,
          y: -2
        }, {
          x: 41,
          y: 14
        }, {
          x: 50,
          y: 26
        }, {
          x: 58,
          y: 42
        }, {
          x: 66,
          y: 60
        }, {
          x: 76,
          y: 78
        }, {
          x: 83,
          y: 95
        }, {
          x: 92,
          y: 119
        }, {
          x: 96,
          y: 144
        }, {
          x: 94,
          y: 169
        }, {
          x: 93,
          y: 196
        }, {
          x: 95,
          y: 212
        }, {
          x: 95,
          y: 223
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 72,
          y: 247
        }, {
          x: 74,
          y: 231
        }, {
          x: 66,
          y: 231
        }, {
          x: 64,
          y: 212
        }, {
          x: 66,
          y: 191
        }, {
          x: 63,
          y: 172
        }, {
          x: 62,
          y: 153
        }, {
          x: 62,
          y: 137
        }, {
          x: 52,
          y: 123
        }, {
          x: 45,
          y: 110
        }, {
          x: 37,
          y: 97
        }, {
          x: 31,
          y: 86
        }, {
          x: 22,
          y: 79
        }, {
          x: 22,
          y: 95
        }, {
          x: 24,
          y: 112
        }, {
          x: 27,
          y: 131
        }, {
          x: 27,
          y: 150
        }, {
          x: 24,
          y: 163
        }, {
          x: 13,
          y: 182
        }, {
          x: 2,
          y: 201
        }, {
          x: -5,
          y: 214
        }, {
          x: -15,
          y: 232
        }, {
          x: -23,
          y: 248
        }, {
          x: -32,
          y: 246
        }, {
          x: -39,
          y: 244
        }, {
          x: -47,
          y: 250
        }, {
          x: -50,
          y: 256
        }, {
          x: -54,
          y: 269
        }, {
          x: -60,
          y: 274
        }, {
          x: -68,
          y: 275
        }
      ];
      return this.frames[28] = [
        {
          x: -78,
          y: 273
        }, {
          x: -82,
          y: 262
        }, {
          x: -81,
          y: 251
        }, {
          x: -71,
          y: 242
        }, {
          x: -69,
          y: 231
        }, {
          x: -60,
          y: 226
        }, {
          x: -51,
          y: 215
        }, {
          x: -39,
          y: 191
        }, {
          x: -28,
          y: 170
        }, {
          x: -19,
          y: 159
        }, {
          x: -11,
          y: 148
        }, {
          x: -13,
          y: 124
        }, {
          x: -16,
          y: 103
        }, {
          x: -21,
          y: 78
        }, {
          x: -26,
          y: 57
        }, {
          x: -33,
          y: 43
        }, {
          x: -35,
          y: 21
        }, {
          x: -38,
          y: 12
        }, {
          x: -62,
          y: 1
        }, {
          x: -82,
          y: -6
        }, {
          x: -94,
          y: -15
        }, {
          x: -98,
          y: -25
        }, {
          x: -94,
          y: -41
        }, {
          x: -87,
          y: -57
        }, {
          x: -82,
          y: -71
        }, {
          x: -82,
          y: -88
        }, {
          x: -70,
          y: -100
        }, {
          x: -41,
          y: -110
        }, {
          x: -40,
          y: -126
        }, {
          x: -35,
          y: -140
        }, {
          x: -38,
          y: -155
        }, {
          x: -38,
          y: -167
        }, {
          x: -50,
          y: -169
        }, {
          x: -60,
          y: -173
        }, {
          x: -65,
          y: -185
        }, {
          x: -72,
          y: -194
        }, {
          x: -87,
          y: -198
        }, {
          x: -100,
          y: -206
        }, {
          x: -112,
          y: -225
        }, {
          x: -124,
          y: -247
        }, {
          x: -132,
          y: -274
        }, {
          x: -132,
          y: -285
        }, {
          x: -123,
          y: -275
        }, {
          x: -118,
          y: -262
        }, {
          x: -113,
          y: -249
        }, {
          x: -107,
          y: -249
        }, {
          x: -101,
          y: -259
        }, {
          x: -101,
          y: -275
        }, {
          x: -94,
          y: -257
        }, {
          x: -96,
          y: -244
        }, {
          x: -98,
          y: -233
        }, {
          x: -94,
          y: -224
        }, {
          x: -87,
          y: -214
        }, {
          x: -78,
          y: -208
        }, {
          x: -63,
          y: -202
        }, {
          x: -53,
          y: -195
        }, {
          x: -43,
          y: -192
        }, {
          x: -36,
          y: -198
        }, {
          x: -32,
          y: -214
        }, {
          x: -28,
          y: -194
        }, {
          x: -21,
          y: -187
        }, {
          x: -12,
          y: -190
        }, {
          x: -7,
          y: -211
        }, {
          x: -1,
          y: -199
        }, {
          x: 14,
          y: -203
        }, {
          x: 18,
          y: -214
        }, {
          x: 28,
          y: -217
        }, {
          x: 40,
          y: -228
        }, {
          x: 47,
          y: -240
        }, {
          x: 51,
          y: -255
        }, {
          x: 47,
          y: -265
        }, {
          x: 34,
          y: -285
        }, {
          x: 48,
          y: -278
        }, {
          x: 57,
          y: -270
        }, {
          x: 65,
          y: -277
        }, {
          x: 68,
          y: -298
        }, {
          x: 75,
          y: -276
        }, {
          x: 68,
          y: -264
        }, {
          x: 63,
          y: -252
        }, {
          x: 58,
          y: -232
        }, {
          x: 49,
          y: -216
        }, {
          x: 35,
          y: -206
        }, {
          x: 21,
          y: -199
        }, {
          x: 20,
          y: -190
        }, {
          x: 12,
          y: -180
        }, {
          x: 2,
          y: -172
        }, {
          x: 4,
          y: -156
        }, {
          x: 5,
          y: -139
        }, {
          x: 9,
          y: -125
        }, {
          x: 10,
          y: -110
        }, {
          x: 8,
          y: -104
        }, {
          x: 20,
          y: -93
        }, {
          x: 29,
          y: -76
        }, {
          x: 35,
          y: -51
        }, {
          x: 45,
          y: -21
        }, {
          x: 44,
          y: -6
        }, {
          x: 40,
          y: 9
        }, {
          x: 50,
          y: 26
        }, {
          x: 58,
          y: 42
        }, {
          x: 65,
          y: 60
        }, {
          x: 75,
          y: 79
        }, {
          x: 81,
          y: 103
        }, {
          x: 87,
          y: 121
        }, {
          x: 91,
          y: 145
        }, {
          x: 91,
          y: 171
        }, {
          x: 91,
          y: 197
        }, {
          x: 95,
          y: 212
        }, {
          x: 95,
          y: 223
        }, {
          x: 105,
          y: 231
        }, {
          x: 113,
          y: 241
        }, {
          x: 127,
          y: 246
        }, {
          x: 128,
          y: 254
        }, {
          x: 116,
          y: 254
        }, {
          x: 95,
          y: 250
        }, {
          x: 84,
          y: 247
        }, {
          x: 72,
          y: 247
        }, {
          x: 73,
          y: 232
        }, {
          x: 64,
          y: 230
        }, {
          x: 63,
          y: 212
        }, {
          x: 63,
          y: 194
        }, {
          x: 62,
          y: 173
        }, {
          x: 59,
          y: 149
        }, {
          x: 59,
          y: 134
        }, {
          x: 51,
          y: 123
        }, {
          x: 42,
          y: 109
        }, {
          x: 37,
          y: 97
        }, {
          x: 29,
          y: 82
        }, {
          x: 24,
          y: 78
        }, {
          x: 24,
          y: 90
        }, {
          x: 24,
          y: 113
        }, {
          x: 24,
          y: 134
        }, {
          x: 25,
          y: 146
        }, {
          x: 21,
          y: 157
        }, {
          x: 11,
          y: 175
        }, {
          x: 1,
          y: 194
        }, {
          x: -9,
          y: 211
        }, {
          x: -19,
          y: 228
        }, {
          x: -25,
          y: 240
        }, {
          x: -36,
          y: 240
        }, {
          x: -42,
          y: 236
        }, {
          x: -50,
          y: 244
        }, {
          x: -54,
          y: 256
        }, {
          x: -56,
          y: 265
        }, {
          x: -62,
          y: 272
        }, {
          x: -70,
          y: 274
        }
      ];
    };

    ReindeerAnchors.prototype.interpolateFrames = function() {
      var a, b, c, frameA, frameB, frameC, i, j, length, newFrames, _i, _j, _k, _ref, _ref1;
      newFrames = [];
      for (i = _i = 0, _ref = this.frames.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        frameA = this.frames[i];
        frameC = this.frames[i + 1];
        frameB = [];
        for (j = _j = 0, _ref1 = frameA.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          a = frameA[j];
          c = frameC[j];
          b = {
            x: ((a.x + c.x) * 0.5) >> 0,
            y: ((a.y + c.y) * 0.5) >> 0
          };
          frameB.push(b);
        }
        newFrames.push(frameB);
      }
      length = this.frames.length - 1;
      for (i = _k = length; _k > 0; i = _k += -1) {
        this.frames.splice(i, 0, newFrames[i - 1]);
      }
      return this.frames.push(this.frames[this.frames.length - 1].concat());
    };

    ReindeerAnchors.prototype.initAnchors = function() {
      var a, frame, i, length, _i, _j, _len, _ref;
      this.anchors = [];
      length = this.frames[0].length;
      _ref = this.frames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        frame = _ref[_i];
        for (i = _j = 0; 0 <= length ? _j < length : _j > length; i = 0 <= length ? ++_j : --_j) {
          if (!this.anchors[i]) {
            this.anchors[i] = new Anchor(i);
          }
          a = this.anchors[i];
          a.positions.push(frame[i]);
        }
      }
      return this.setAnchorProperties();
    };

    ReindeerAnchors.prototype.initRibbonAnchors = function() {
      var a, frame, i, length, _i, _j, _len, _ref;
      this.anchors = [];
      length = this.frames[0].length;
      _ref = this.frames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        frame = _ref[_i];
        for (i = _j = 0; 0 <= length ? _j < length : _j > length; i = 0 <= length ? ++_j : --_j) {
          if (!this.anchors[i]) {
            this.anchors[i] = new RibbonAnchor(i, frame[i]);
          }
          a = this.anchors[i];
          a.positions.push(frame[i]);
        }
      }
      return this.setAnchorProperties();
    };

    ReindeerAnchors.prototype.setAnchorProperties = function() {
      var a, i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.anchors.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = this.anchors[i];
        if (i <= 41) {
          a.left = true;
        } else if (i >= 75 && i <= 111) {
          a.right = true;
        }
        if (i <= 5) {
          _results.push(a.leftFoot = true);
        } else if (i <= 14) {
          _results.push(a.leftLegLeft = true);
        } else if (i <= 17) {
          _results.push(a.leftHip = true);
        } else if (i <= 27) {
          _results.push(a.leftArm = true);
        } else if (i <= 34) {
          _results.push(a.leftHead = true);
        } else if (i <= 41) {
          _results.push(a.leftHornLeft = true);
        } else if (i <= 56) {
          _results.push(a.leftHornRight = true);
        } else if (i <= 63) {
          _results.push(a.topHead = true);
        } else if (i <= 75) {
          _results.push(a.rightHornLeft = true);
        } else if (i <= 84) {
          _results.push(a.rightHornRight = true);
        } else if (i <= 90) {
          _results.push(a.rightHead = true);
        } else if (i <= 96) {
          _results.push(a.rightArm = true);
        } else if (i <= 98) {
          _results.push(a.rightHip = true);
        } else if (i <= 107) {
          _results.push(a.rightLegRight = true);
        } else if (i <= 116) {
          _results.push(a.rightFoot = true);
        } else if (i <= 127) {
          _results.push(a.rightLegLeft = true);
        } else if (i <= 138) {
          _results.push(a.leftLegRight = true);
        } else {
          _results.push(a.leftFoot = true);
        }
        /*
        			a.lineWidth = i % 16
        			if (a.lineWidth > 8) then a.lineWidth = 16 - a.lineWidth
        			a.lineWidth /= 2
        */

        /*
        			a.lineWidth = i % 24
        			if (a.lineWidth > 12) then a.lineWidth = 24 - a.lineWidth
        			# a.lineWidth /= 3
        */

        /*
        			a.radius = Math.floor(random(10))
        			if (i < @anchors.length - 1)
        				b = @anchors[i + 1]
        				dx = a.positions[0].x - b.positions[0].x
        				dy = a.positions[0].y - b.positions[0].y
        				dd = Math.sqrt(dx * dx + dy * dy)
        				a.radius = dd / 4
        				a.color = 'rgb(' + Math.floor(random(255)) + ', 0, 255)'
        
        				# a.lineWidth = dd / 5
        */

      }
      return _results;
    };

    return ReindeerAnchors;

  })();

  RibbonAnchor = (function(_super) {

    __extends(RibbonAnchor, _super);

    RibbonAnchor.prototype.particles = null;

    RibbonAnchor.prototype.NUM_PARTICLES = 10;

    RibbonAnchor.prototype.LENGTH = 8;

    RibbonAnchor.prototype.DISTANCE_SQ = 9;

    RibbonAnchor.prototype.DAMP = 0.99;

    function RibbonAnchor(index, pos) {
      this.index = index;
      this.pos = pos;
      RibbonAnchor.__super__.constructor.apply(this, arguments);
      this.length = this.LENGTH;
      this.initParticles();
    }

    RibbonAnchor.prototype.update = function() {
      var a, damp, dd, dx, dy, end, i, np, ox, oy, p, pp, start, _i, _results;
      p = this.particles[0];
      p.x = this.pos.x;
      p.y = this.pos.y;
      start = this.NUM_PARTICLES - 1;
      end = 0;
      _results = [];
      for (i = _i = start; start <= end ? _i <= end : _i >= end; i = start <= end ? ++_i : --_i) {
        p = this.particles[i];
        np = this.particles[i + 1];
        pp = this.particles[i - 1];
        if (i === 0) {
          pp = p;
        } else if (i === this.NUM_PARTICLES - 1) {
          np = p;
        }
        p.vx *= this.DAMP;
        p.vy *= this.DAMP;
        if (i) {
          p.vy += 0.3;
        }
        p.x += p.vx;
        p.y += p.vy;
        ox = p.x;
        oy = p.y;
        dx = p.x - pp.x;
        dy = p.y - pp.y;
        dd = dx * dx + dy * dy;
        if (dd > this.DISTANCE_SQ) {
          a = atan2(dy, dx);
          p.x = pp.x + this.length * cos(a);
          p.y = pp.y + this.length * sin(a);
          damp = .1;
          p.vx += (p.x - ox) * damp;
          _results.push(p.vy += (p.y - oy) * damp);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RibbonAnchor.prototype.draw = function() {
      /*
      		@ctx.beginPath()
      		# @ctx.rotate(@vel.headingXY())
      		@ctx.arc(@pos.x, @pos.y, @radius * 0.5, 0, TWO_PI)
      
      		# draw particles
      		# for p in @particles
      			# @ctx.arc(p.x, p.y, 2, 0, TWO_PI)
      
      		@ctx.fillStyle = @color
      		@ctx.fill()
      */

      var i, mx, my, np, p, pp, _i, _ref;
      this.ctx.beginPath();
      for (i = _i = 0, _ref = this.NUM_PARTICLES; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = this.particles[i];
        np = this.particles[i + 1];
        pp = this.particles[i - 1];
        if (i === 0) {
          pp = p;
        } else if (i === this.NUM_PARTICLES - 1) {
          np = p;
        }
        mx = p.x + (np.x - p.x) * .5;
        my = p.y + (np.y - p.y) * .5;
        this.ctx.quadraticCurveTo(p.x, p.y, mx, my);
      }
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 1;
      return this.ctx.stroke();
    };

    RibbonAnchor.prototype.initParticles = function() {
      var i, p, _i, _ref, _results;
      this.particles = [];
      _results = [];
      for (i = _i = 0, _ref = this.NUM_PARTICLES; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = {
          x: this.pos.x,
          y: this.pos.y,
          vx: 0,
          vy: 0,
          angle: 0,
          thickness: 0,
          mx: 0,
          my: 0,
          nx: 0,
          ny: 0
        };
        _results.push(this.particles.push(p));
      }
      return _results;
    };

    return RibbonAnchor;

  })(Anchor);

  AppUI = (function() {

    AppUI.prototype.view = null;

    AppUI.prototype.audio = null;

    AppUI.prototype.stats = null;

    AppUI.prototype.info = null;

    AppUI.prototype.more = null;

    AppUI.prototype.infoOpen = false;

    AppUI.prototype.loader = null;

    AppUI.prototype.drawAnchors = true;

    AppUI.prototype.drawLines = true;

    AppUI.prototype.drawSpeed = null;

    AppUI.prototype.mute = true;

    AppUI.prototype.playbackRate = null;

    function AppUI() {
      this.onAudioLoaded = __bind(this.onAudioLoaded, this);

      this.onMoreClick = __bind(this.onMoreClick, this);
      this.view = app.view;
      this.audio = app.audio;
      this.drawSpeed = 186;
      this.playbackRate = 1.0;
      this.initLodaer();
      this.initInfo();
    }

    AppUI.prototype.initLodaer = function() {
      return this.loader = document.getElementById('loader');
    };

    AppUI.prototype.initInfo = function() {
      this.info = document.getElementById('info');
      this.more = document.getElementById('more');
      this.more.addEventListener('click', this.onMoreClick);
      return this.moreIcon = document.getElementById('moreIcon');
    };

    AppUI.prototype.initStats = function() {
      var _this = this;
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      return setInterval(function() {
        _this.stats.begin();
        return _this.stats.end();
      }, 1000 / 60);
    };

    AppUI.prototype.initGUI = function() {
      var f1, f2, gui, that;
      gui = new dat.GUI();
      gui.close();
      that = this;
      f1 = gui.addFolder('Draw');
      f1.open();
      f1.add(this, 'drawAnchors');
      f1.add(this, 'drawLines');
      f1.add(this, 'drawSpeed', 150, 240);
      f2 = gui.addFolder('Audio');
      f2.open();
      f2.add(this, 'mute').onChange(function() {
        return that.onMuteChange();
      }).listen();
      return f2.add(this, 'playbackRate', 0.0, 1.0, 0.1).onChange(function() {
        return that.onPlaybackRateChange();
      });
    };

    AppUI.prototype.onMuteChange = function() {
      if (this.mute) {
        return this.audio.analyserNode.disconnect();
      } else {
        return this.audio.analyserNode.connect(this.audio.ctx.destination);
      }
    };

    AppUI.prototype.onPlaybackRateChange = function() {
      return this.audio.sourceNode.playbackRate.value = this.playbackRate;
    };

    AppUI.prototype.onMoreClick = function() {
      if (!this.infoOpen) {
        TweenMax.to(this.more, 0.5, {
          css: {
            left: 0
          },
          ease: Quart.easeInOut
        });
        TweenMax.to(this.info, 0.5, {
          css: {
            left: 0
          },
          ease: Quart.easeInOut
        });
        this.moreIcon.innerHtml = '-';
      } else {
        TweenMax.to(this.more, 0.5, {
          css: {
            left: -280
          },
          ease: Quart.easeInOut
        });
        TweenMax.to(this.info, 0.5, {
          css: {
            left: -330
          },
          ease: Quart.easeInOut
        });
        this.moreIcon.innerHtml = '+';
      }
      return this.infoOpen = !this.infoOpen;
    };

    AppUI.prototype.onAudioLoaded = function() {
      return this.loader.style.display = 'none';
    };

    return AppUI;

  })();

  AppView = (function() {

    function AppView() {
      this.initScenes = __bind(this.initScenes, this);

      this.initUI = __bind(this.initUI, this);

    }

    AppView.prototype.audio = null;

    AppView.prototype.sketch = null;

    AppView.prototype.ui = null;

    AppView.prototype.scenes = null;

    AppView.prototype.init = function() {
      this.audio = app.audio;
      this.initSketch();
      this.initUI();
      return this.initScenes();
    };

    AppView.prototype.initSketch = function() {
      var _this = this;
      this.sketch = Sketch.create({
        container: document.getElementById('container'),
        type: Sketch.CANVAS
      });
      this.sketch.setup = function() {
        return _this.sketch.canvas.onselectstart = function() {
          return false;
        };
      };
      this.sketch.update = function() {
        _this.audio.update();
        return _this.scenes.update();
      };
      this.sketch.draw = function() {
        return _this.scenes.draw();
      };
      this.sketch.resize = function() {};
      this.sketch.mousedown = function() {
        return _this.sketch.down = true;
      };
      this.sketch.mouseup = function() {
        return _this.sketch.down = false;
      };
      this.sketch.mousemove = function() {
        if (!_this.draw) {

        }
      };
      return this.sketch.keyup = function(e) {
        if (e.keyCode === 37) {
          _this.scenes.auto = false;
          _this.scenes.prev();
        }
        if (e.keyCode === 39) {
          _this.scenes.auto = false;
          _this.scenes.next();
        }
        if (e.keyCode === 32) {
          if (!_this.audio.paused) {
            _this.audio.stop();
          } else {
            _this.audio.play();
          }
        }
        if (e.keyCode === 77) {
          _this.ui.mute = !_this.ui.mute;
          return _this.ui.onMuteChange();
        }
      };
    };

    AppView.prototype.initUI = function() {
      return this.ui = new AppUI();
    };

    AppView.prototype.initScenes = function() {
      return this.scenes = new Scenes(this.sketch);
    };

    return AppView;

  })();

  Boid = (function() {

    Boid.prototype.ctx = null;

    Boid.prototype.pos = null;

    Boid.prototype.vel = null;

    Boid.prototype.acc = null;

    Boid.prototype.radius = null;

    Boid.prototype.color = null;

    Boid.prototype.img = null;

    Boid.prototype.maxSpeed = null;

    Boid.prototype.maxSteer = null;

    Boid.prototype.wanderTheta = null;

    Boid.prototype.drawLine = null;

    Boid.prototype.SEPARATION_RADIUS = 30.0;

    Boid.prototype.ALIGNMENT_RADIUS = 40.0;

    Boid.prototype.COHESION_RADIUS = 40.0;

    Boid.prototype.SEPARATION_RADIUS_SQ = null;

    Boid.prototype.ALIGNMENT_RADIUS_SQ = null;

    Boid.prototype.COHESION_RADIUS_SQ = null;

    function Boid(ctx, pos, color) {
      this.ctx = ctx;
      this.pos = pos;
      this.color = color;
      this.vel = new Vec3D(random(-1, 1), random(-1, 1), 0);
      this.acc = new Vec3D();
      this.radius = random(4.0, 10.0);
      this.maxSpeed = random(2.0, 8.0);
      this.maxSteer = 0.1 * this.maxSpeed;
      this.wanderTheta = 0.0;
      this.drawLine = false;
      this.SEPARATION_RADIUS_SQ = this.SEPARATION_RADIUS * this.SEPARATION_RADIUS;
      this.ALIGNMENT_RADIUS_SQ = this.ALIGNMENT_RADIUS * this.ALIGNMENT_RADIUS;
      this.COHESION_RADIUS_SQ = this.COHESION_RADIUS * this.COHESION_RADIUS;
    }

    Boid.prototype.update = function() {
      this.acc.limit(this.maxSteer);
      this.vel.addSelf(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.addSelf(this.vel);
      return this.acc.clear();
    };

    Boid.prototype.draw = function() {
      this.ctx.translate(this.pos.x, this.pos.y);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.radius * 0.8, 0, TWO_PI);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      return this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    Boid.prototype.wrap = function() {
      if (this.pos.x > this.ctx.width) {
        this.pos.x = 0;
      } else if (this.pos.x < 0) {
        this.pos.x = this.ctx.width;
      }
      if (this.pos.y > this.ctx.height) {
        return this.pos.y = 0;
      } else if (this.pos.y < 0) {
        return this.pos.y = this.ctx.height;
      }
    };

    Boid.prototype.bounce = function() {
      if (this.pos.x > this.ctx.width || this.pos.x < 0) {
        this.vel.x *= -1;
      }
      if (this.pos.y > this.ctx.height || this.pos.y < 0) {
        return this.vel.y *= -1;
      }
    };

    Boid.prototype.seek = function(target) {
      var steering;
      steering = new Vec3D();
      steering = target.sub(this.pos);
      steering.limit(this.maxSteer);
      return steering;
    };

    Boid.prototype.flee = function(target) {
      var steering;
      Vec3D(steering);
      steering = this.pos.sub(target);
      steering.limit(this.maxSteer);
      return steering;
    };

    Boid.prototype.arrive = function(target) {
      var direction, distance, slowRadius, steering, targetSpeed, targetVelocity;
      slowRadius = 40.0;
      direction = target.sub(this.pos);
      distance = direction.magnitude();
      if (distance > slowRadius) {
        targetSpeed = this.maxSpeed;
      } else {
        targetSpeed = this.maxSpeed * distance / slowRadius;
      }
      targetVelocity = direction;
      targetVelocity.normalizeTo(targetSpeed);
      steering = targetVelocity.sub(this.vel);
      steering.scaleSelf(0.5);
      steering.limit(this.maxSteer);
      return steering;
    };

    Boid.prototype.pursue = function(boid) {
      var direction, distance, predicted, prediction, speed, target;
      direction = boid.pos.sub(this.pos);
      distance = direction.magnitude();
      speed = this.vel.magnitude();
      if (speed <= distance) {
        prediction = 1.0;
      } else {
        prediction = distance / speed;
      }
      predicted = boid.vel.scale(prediction);
      target = boid.pos.add(predicted);
      return this.arrive(target);
    };

    Boid.prototype.evade = function(boid) {
      var direction, distance, predicted, prediction, speed, target;
      direction = boid.pos.sub(this.pos);
      distance = direction.magnitude();
      speed = this.vel.magnitude();
      if (speed <= distance) {
        prediction = 1.0;
      } else {
        prediction = distance / speed;
      }
      predicted = boid.vel.scale(prediction);
      target = boid.pos.add(predicted);
      return this.flee(target);
    };

    Boid.prototype.wander = function() {
      var target, wanderOffset, wanderRadius, wanderRate;
      wanderOffset = 60.0;
      wanderRadius = 16.0;
      wanderRate = 0.25;
      this.wanderTheta += random(-wanderRate, wanderRate);
      target = this.vel.copy().normalizeTo(wanderOffset);
      target.addSelf(new Vec3D(cos(this.wanderTheta) * wanderRadius, sin(this.wanderTheta) * wanderRadius, 0));
      target.addSelf(this.pos);
      /*
      		# debug draw
      		@ctx.beginPath();
      		@ctx.arc(target.x, target.y, 2, 0, TWO_PI)
      		@ctx.fillStyle = 'blue';
      		@ctx.fill()
      */

      return this.seek(target);
    };

    Boid.prototype.separate = function(boids) {
      var b, count, d, repulse, steering, _i, _len;
      steering = new Vec3D();
      count = 0;
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        if (this === b) {
          continue;
        }
        d = this.pos.distanceTo(b.pos);
        if (d > 0 && d <= this.SEPARATION_RADIUS) {
          repulse = this.pos.sub(b.pos);
          repulse.normalizeTo(1.0 / d);
          steering.addSelf(repulse);
          count++;
        }
      }
      if (count > 0) {
        steering.scaleSelf(1.0 / count);
      }
      /*
      		if (steering.magSquared() > 0)
      			steering.normalizeTo(maxSpeed);
      			steering.subSelf(vel);
      			steering.limit(maxSteer);
      */

      return steering;
    };

    Boid.prototype.align = function(boids) {
      var b, count, d, steering, _i, _len;
      steering = new Vec3D();
      count = 0;
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        if (this === b) {
          continue;
        }
        d = this.pos.distanceToSquared(b.pos);
        if (d > 0 && d <= this.ALIGNMENT_RADIUS_SQ) {
          steering.addSelf(b.vel);
          count++;
        }
      }
      if (count > 0) {
        steering.scaleSelf(1.0 / count);
      }
      return steering;
    };

    Boid.prototype.cohesion = function(boids) {
      var b, count, d, steering, _i, _len;
      steering = new Vec3D();
      count = 0;
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        if (this === b) {
          continue;
        }
        d = this.pos.distanceToSquared(b.pos);
        if (d > 0 && d <= this.COHESION_RADIUS_SQ) {
          steering.addSelf(b.pos);
          count++;
        }
      }
      if (count > 0) {
        steering.scaleSelf(1.0 / count);
        steering.subSelf(this.pos);
      }
      return steering;
    };

    return Boid;

  })();

  AbstractScene = (function() {

    AbstractScene.prototype.ctx = null;

    AbstractScene.prototype.audio = null;

    AbstractScene.prototype.index = null;

    AbstractScene.prototype.name = '';

    AbstractScene.prototype.speed = null;

    AbstractScene.prototype.reindeer = null;

    function AbstractScene(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      this.audio = app.audio;
      this.speed = 18.62;
      this.initReindeer();
    }

    AbstractScene.prototype.start = function() {
      if (!this.audio.sourceNode) {
        return;
      }
      this.audio.sourceNode.playbackRate.value = 1;
      return this.speed = 18.62;
    };

    AbstractScene.prototype.update = function() {
      var a, dt, frame, _i, _len, _ref, _results;
      if (!this.audio.startedAt) {
        return;
      }
      if (this.audio.paused) {
        return;
      }
      dt = Date.now() - this.audio.startedAt;
      frame = ((dt / this.speed) >> 0) % 58;
      _ref = this.reindeer.anchors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(a.pos = a.positions[frame]);
      }
      return _results;
    };

    AbstractScene.prototype.initReindeer = function() {
      var a, _i, _len, _ref, _results;
      this.reindeer = new ReindeerAnchors();
      _ref = this.reindeer.anchors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(a.pos = a.positions[0]);
      }
      return _results;
    };

    return AbstractScene;

  })();

  SceneBasic = (function(_super) {

    __extends(SceneBasic, _super);

    SceneBasic.prototype.count = 0;

    SceneBasic.prototype.color = null;

    SceneBasic.prototype.colors = null;

    function SceneBasic(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneBasic.__super__.constructor.apply(this, arguments);
      this.initColors();
    }

    SceneBasic.prototype.start = function() {
      this.color = this.colors[this.count % this.colors.length];
      this.count++;
      return SceneBasic.__super__.start.apply(this, arguments);
    };

    SceneBasic.prototype.draw = function() {
      var a, hh, hw, scale, _i, _j, _len, _len1, _ref, _ref1;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      /*
      		@ctx.fillStyle = 'rgba(240, 110, 170, 0.4)'
      		@ctx.beginPath()
      		for a in @reindeer.anchors
      			@ctx.lineTo(a.pos.x + hw + 10, a.pos.y + hh + 4)
      		@ctx.fill()
      		@ctx.closePath()
      */

      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.fillStyle = '#cccccc';
      this.ctx.beginPath();
      _ref = this.reindeer.anchors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        this.ctx.lineTo(a.pos.x + hw, a.pos.y + hh);
      }
      this.ctx.fill();
      this.ctx.closePath();
      if (this.count === 1) {
        return;
      }
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      _ref1 = this.reindeer.anchors;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        a = _ref1[_j];
        this.ctx.lineTo(a.pos.x + hw - 10, a.pos.y + hh);
      }
      this.ctx.fill();
      return this.ctx.closePath();
    };

    SceneBasic.prototype.initColors = function() {
      this.colors = [];
      this.colors.push('rgba(220, 80, 110, 0.4)');
      this.colors.push('rgba(75, 200, 230, 0.4)');
      this.colors.push('rgba(145, 95, 180, 0.4)');
      this.colors.push('rgba(80, 190, 90, 0.4)');
      return this.colors.push('rgba(190, 155, 80, 0.4)');
    };

    return SceneBasic;

  })(AbstractScene);

  SceneChewbacca = (function(_super) {

    __extends(SceneChewbacca, _super);

    SceneChewbacca.prototype.ctx = null;

    SceneChewbacca.prototype.index = null;

    SceneChewbacca.prototype.reindeer = null;

    function SceneChewbacca(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneChewbacca.__super__.constructor.apply(this, arguments);
    }

    SceneChewbacca.prototype.update = function() {
      var a, _i, _len, _ref, _results;
      SceneChewbacca.__super__.update.apply(this, arguments);
      _ref = this.reindeer.anchors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(a.update());
      }
      return _results;
    };

    SceneChewbacca.prototype.draw = function() {
      var a, hh, hw, scale, _i, _len, _ref, _results;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      this.ctx.globalCompositeOperation = 'source-over';
      _ref = this.reindeer.anchors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        this.ctx.translate(hw, hh);
        a.draw();
        _results.push(this.ctx.setTransform(1, 0, 0, 1, 0, 0));
      }
      return _results;
    };

    SceneChewbacca.prototype.initReindeer = function() {
      var a, i, length, _i, _results;
      SceneChewbacca.__super__.initReindeer.apply(this, arguments);
      this.reindeer.initRibbonAnchors();
      length = this.reindeer.anchors.length;
      _results = [];
      for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
        a = this.reindeer.anchors[i];
        /*
        			if (i > 0) then p = @reindeer.anchors[i - 1].positions[0]
        			else p = a.positions[0]
        			if (i < length - 1) then n = @reindeer.anchors[i + 1].positions[0]
        			else n = a.positions[0]
        
        			dx = p.x - n.x
        			dy = p.y - n.y
        			# dd = Math.sqrt(dx * dx + dy * dy)
        			a.angle = Math.atan2(dy, dx) + HALF_PI
        */

        a.color = 'rgb(20, ' + floor(random(50, 255)) + ', ' + floor(random(10, 50)) + ')';
        a.radius = 4;
        a.ctx = this.ctx;
        if (a.leftHead || a.leftHorn || a.rightHorn || a.rightHead) {
          _results.push(a.length = 10);
        } else {
          _results.push(a.length = 5);
        }
      }
      return _results;
    };

    return SceneChewbacca;

  })(AbstractScene);

  SceneCircles = (function(_super) {

    __extends(SceneCircles, _super);

    function SceneCircles(ctx, index) {
      var a, _i, _len, _ref;
      this.ctx = ctx;
      this.index = index;
      this.tweenCircle = __bind(this.tweenCircle, this);

      SceneCircles.__super__.constructor.apply(this, arguments);
      _ref = this.reindeer.anchors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        this.tweenCircle(a);
      }
    }

    SceneCircles.prototype.draw = function() {
      var a, hh, hw, scale, _i, _len, _ref;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.beginPath();
      this.ctx.fillStyle = '#1A1A1A';
      this.ctx.closePath();
      if (app.view.ui.drawAnchors) {
        this.ctx.lineCap = 'butt';
        this.ctx.strokeStyle = '#E6335A';
        this.ctx.fillStyle = '#E6335A';
        this.ctx.beginPath();
        _ref = this.reindeer.anchors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          a = _ref[_i];
          this.ctx.moveTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
          this.ctx.arc(a.pos.x * scale + hw, a.pos.y * scale + hh, a.radius, 0, TWO_PI);
          this.ctx.arc(a.pos.x * scale + hw, a.pos.y * scale + hh, a.radius2, 0, TWO_PI, true);
        }
        this.ctx.fill();
        return this.ctx.closePath();
      }
    };

    SceneCircles.prototype.tweenCircle = function(a) {
      var delay, lineWidth, radius, radius2;
      a.radius = 2;
      a.radius2 = 0;
      a.lineWidth = 5;
      radius = random(10);
      radius2 = radius;
      lineWidth = 0;
      delay = random(0.8);
      /*
      		r = random(5)
      		if (r > 4) then delay = 0.16
      		else if (r > 3) then delay = 0.32
      		else if (r > 2) then delay = 0.48
      		else if (r > 1) then delay = 0.56
      		else delay = 0
      */

      TweenMax.to(a, 0.6, {
        radius: radius,
        lineWidth: lineWidth,
        delay: delay,
        ease: Quart.easeOut
      });
      return TweenMax.to(a, 0.6, {
        radius2: radius2,
        delay: delay,
        ease: Quart.easeInOut,
        onCompleteParams: [a],
        onComplete: this.tweenCircle
      });
    };

    return SceneCircles;

  })(AbstractScene);

  SceneFatso = (function(_super) {

    __extends(SceneFatso, _super);

    function SceneFatso(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneFatso.__super__.constructor.apply(this, arguments);
      this.name = 'Fatso';
    }

    SceneFatso.prototype.start = function() {
      if (!this.audio.sourceNode) {
        return;
      }
      this.audio.sourceNode.playbackRate.value = 0.8;
      return this.speed = 23.3;
    };

    SceneFatso.prototype.draw = function() {
      var a, b, hh, hw, i, radiusX, radiusY, scale, _i, _ref;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      radiusX = 150;
      radiusY = 100;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = '#fff';
      for (i = _i = 0, _ref = this.reindeer.anchors.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = this.reindeer.anchors[i];
        b = this.reindeer.anchors[i + 1];
        this.ctx.beginPath();
        this.ctx.moveTo(a.pos.x + cos(a.angle) * radiusX + hw, a.pos.y + sin(a.angle) * radiusY + hh);
        this.ctx.lineTo(b.pos.x + cos(b.angle) * radiusX + hw, b.pos.y + sin(b.angle) * radiusY + hh);
        this.ctx.lineWidth = a.lineWidth;
        this.ctx.stroke();
        this.ctx.closePath();
      }
      a = this.reindeer.anchors[this.reindeer.anchors.length - 1];
      b = this.reindeer.anchors[0];
      this.ctx.moveTo(a.pos.x + cos(a.angle) * radiusX + hw, a.pos.y + sin(a.angle) * radiusY + hh);
      this.ctx.lineTo(b.pos.x + cos(b.angle) * radiusX + hw, b.pos.y + sin(b.angle) * radiusY + hh);
      return this.ctx.stroke();
    };

    SceneFatso.prototype.initReindeer = function() {
      var a, i, _i, _ref, _results;
      SceneFatso.__super__.initReindeer.apply(this, arguments);
      _results = [];
      for (i = _i = 0, _ref = this.reindeer.anchors.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = this.reindeer.anchors[i];
        a.lineWidth = i % 24;
        if (a.lineWidth > 12) {
          a.lineWidth = 24 - a.lineWidth;
        }
        _results.push(a.angle = Math.atan2(a.positions[0].y, a.positions[0].x));
      }
      return _results;
    };

    return SceneFatso;

  })(AbstractScene);

  SceneIntro = (function(_super) {

    __extends(SceneIntro, _super);

    SceneIntro.prototype.frames = null;

    SceneIntro.prototype.currentFrame = 0;

    SceneIntro.prototype.scale = null;

    SceneIntro.prototype.offsetX = 0;

    SceneIntro.prototype.offsetY = 0;

    SceneIntro.prototype.color = null;

    SceneIntro.prototype.boids = null;

    SceneIntro.prototype.numBoids = 0;

    function SceneIntro(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneIntro.__super__.constructor.apply(this, arguments);
      this.scale = 1;
      this.offsetY = -50 * this.scale;
      this.color = 'rgba(75, 200, 230, 0.4)';
      this.initBoids();
    }

    SceneIntro.prototype.update = function() {
      var dt, frame;
      if (!this.audio.startedAt) {
        return;
      }
      if (this.audio.paused) {
        return;
      }
      dt = Date.now() - this.audio.startedAt;
      frame = 0;
      if (dt > 2660) {
        frame = 1;
      }
      if (dt > 4820) {
        frame = 2;
      }
      if (dt > 6980) {
        frame = 3;
      }
      if (dt > 9140) {
        app.view.scenes.killIntro();
        return;
      }
      if (frame < 2) {
        this.scale = 1;
        this.offsetY = -50 * this.scale;
      } else {
        this.scale = 1;
        this.offsetY = 0;
        this.color = 'rgba(240, 110, 170, 0.4)';
      }
      return this.currentFrame = frame;
    };

    SceneIntro.prototype.draw = function() {
      var a, boid, frame, hh, hw, i, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2, _results;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      this.ctx.strokeStyle = '#cccccc';
      this.ctx.fillStyle = '#cccccc';
      this.ctx.beginPath();
      frame = this.frames[this.currentFrame];
      for (i = _i = 0, _ref = frame.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = frame[i];
        this.ctx.lineTo(a.x * this.scale + hw + this.offsetX, a.y * this.scale + hh + this.offsetY);
      }
      this.ctx.fill();
      this.ctx.closePath();
      i = 0;
      _ref1 = this.boids;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        boid = _ref1[_j];
        a = frame[i];
        boid.acc.addSelf(boid.arrive(new Vec3D(boid.pos.x, this.ctx.height, 0)).scaleSelf(0.2));
        boid.acc.addSelf(boid.wander().scaleSelf(0.2));
        boid.update();
        boid.bounce();
        i++;
      }
      _ref2 = this.boids;
      _results = [];
      for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
        boid = _ref2[_k];
        _results.push(boid.draw());
      }
      return _results;
      /*
      		@ctx.strokeStyle = @color
      		@ctx.fillStyle = @color
      		@ctx.beginPath()
      
      		for b in @boids
      			@ctx.lineTo(b.pos.x, b.pos.y)
      
      		# @ctx.fill()
      		@ctx.stroke()
      		@ctx.closePath()
      */

    };

    SceneIntro.prototype.initReindeer = function() {
      this.frames = [];
      this.frames[0] = [
        {
          x: 20,
          y: 200
        }, {
          x: 6,
          y: 192
        }, {
          x: -9,
          y: 180
        }, {
          x: -17,
          y: 167
        }, {
          x: -24,
          y: 154
        }, {
          x: -26,
          y: 140
        }, {
          x: -23,
          y: 128
        }, {
          x: -17,
          y: 119
        }, {
          x: -17,
          y: 103
        }, {
          x: -17,
          y: 87
        }, {
          x: -20,
          y: 77
        }, {
          x: -27,
          y: 67
        }, {
          x: -43,
          y: 63
        }, {
          x: -59,
          y: 59
        }, {
          x: -69,
          y: 47
        }, {
          x: -75,
          y: 33
        }, {
          x: -81,
          y: 20
        }, {
          x: -93,
          y: 10
        }, {
          x: -111,
          y: 2
        }, {
          x: -128,
          y: -5
        }, {
          x: -142,
          y: -20
        }, {
          x: -159,
          y: -42
        }, {
          x: -165,
          y: -61
        }, {
          x: -171,
          y: -74
        }, {
          x: -184,
          y: -86
        }, {
          x: -192,
          y: -102
        }, {
          x: -197,
          y: -123
        }, {
          x: -200,
          y: -141
        }, {
          x: -202,
          y: -164
        }, {
          x: -193,
          y: -150
        }, {
          x: -190,
          y: -138
        }, {
          x: -184,
          y: -124
        }, {
          x: -176,
          y: -105
        }, {
          x: -174,
          y: -96
        }, {
          x: -164,
          y: -91
        }, {
          x: -155,
          y: -94
        }, {
          x: -150,
          y: -102
        }, {
          x: -146,
          y: -118
        }, {
          x: -144,
          y: -133
        }, {
          x: -141,
          y: -148
        }, {
          x: -136,
          y: -130
        }, {
          x: -136,
          y: -117
        }, {
          x: -138,
          y: -97
        }, {
          x: -142,
          y: -82
        }, {
          x: -142,
          y: -65
        }, {
          x: -136,
          y: -49
        }, {
          x: -125,
          y: -33
        }, {
          x: -113,
          y: -24
        }, {
          x: -96,
          y: -17
        }, {
          x: -85,
          y: -11
        }, {
          x: -69,
          y: -4
        }, {
          x: -60,
          y: 2
        }, {
          x: -44,
          y: 5
        }, {
          x: -35,
          y: 9
        }, {
          x: -20,
          y: 9
        }, {
          x: -14,
          y: -4
        }, {
          x: -9,
          y: -23
        }, {
          x: -5,
          y: -6
        }, {
          x: -3,
          y: 11
        }, {
          x: 3,
          y: 22
        }, {
          x: 15,
          y: 23
        }, {
          x: 27,
          y: 20
        }, {
          x: 35,
          y: 7
        }, {
          x: 44,
          y: -29
        }, {
          x: 48,
          y: -13
        }, {
          x: 53,
          y: 0
        }, {
          x: 62,
          y: 0
        }, {
          x: 73,
          y: -5
        }, {
          x: 80,
          y: -17
        }, {
          x: 86,
          y: -30
        }, {
          x: 94,
          y: -35
        }, {
          x: 107,
          y: -37
        }, {
          x: 122,
          y: -42
        }, {
          x: 133,
          y: -55
        }, {
          x: 144,
          y: -72
        }, {
          x: 151,
          y: -93
        }, {
          x: 153,
          y: -111
        }, {
          x: 150,
          y: -129
        }, {
          x: 139,
          y: -140
        }, {
          x: 126,
          y: -157
        }, {
          x: 121,
          y: -173
        }, {
          x: 119,
          y: -190
        }, {
          x: 130,
          y: -171
        }, {
          x: 138,
          y: -159
        }, {
          x: 144,
          y: -153
        }, {
          x: 150,
          y: -164
        }, {
          x: 152,
          y: -179
        }, {
          x: 158,
          y: -167
        }, {
          x: 160,
          y: -157
        }, {
          x: 165,
          y: -147
        }, {
          x: 175,
          y: -143
        }, {
          x: 186,
          y: -153
        }, {
          x: 190,
          y: -162
        }, {
          x: 191,
          y: -177
        }, {
          x: 186,
          y: -200
        }, {
          x: 196,
          y: -190
        }, {
          x: 200,
          y: -176
        }, {
          x: 202,
          y: -162
        }, {
          x: 197,
          y: -146
        }, {
          x: 189,
          y: -133
        }, {
          x: 180,
          y: -114
        }, {
          x: 175,
          y: -94
        }, {
          x: 168,
          y: -78
        }, {
          x: 163,
          y: -66
        }, {
          x: 157,
          y: -57
        }, {
          x: 144,
          y: -45
        }, {
          x: 153,
          y: -48
        }, {
          x: 163,
          y: -56
        }, {
          x: 172,
          y: -60
        }, {
          x: 172,
          y: -50
        }, {
          x: 161,
          y: -38
        }, {
          x: 148,
          y: -26
        }, {
          x: 126,
          y: -21
        }, {
          x: 113,
          y: -13
        }, {
          x: 100,
          y: -6
        }, {
          x: 93,
          y: 4
        }, {
          x: 89,
          y: 21
        }, {
          x: 84,
          y: 32
        }, {
          x: 74,
          y: 40
        }, {
          x: 65,
          y: 50
        }, {
          x: 60,
          y: 56
        }, {
          x: 56,
          y: 66
        }, {
          x: 59,
          y: 75
        }, {
          x: 62,
          y: 82
        }, {
          x: 66,
          y: 92
        }, {
          x: 69,
          y: 103
        }, {
          x: 68,
          y: 114
        }, {
          x: 66,
          y: 121
        }, {
          x: 68,
          y: 129
        }, {
          x: 70,
          y: 138
        }, {
          x: 73,
          y: 156
        }, {
          x: 74,
          y: 168
        }, {
          x: 74,
          y: 176
        }, {
          x: 73,
          y: 187
        }, {
          x: 65,
          y: 195
        }, {
          x: 54,
          y: 199
        }, {
          x: 40,
          y: 201
        }, {
          x: 31,
          y: 201
        }
      ];
      this.frames[1] = [
        {
          x: 20,
          y: 200
        }, {
          x: 6,
          y: 192
        }, {
          x: -9,
          y: 180
        }, {
          x: -17,
          y: 167
        }, {
          x: -24,
          y: 154
        }, {
          x: -26,
          y: 140
        }, {
          x: -23,
          y: 128
        }, {
          x: -17,
          y: 119
        }, {
          x: -13,
          y: 102
        }, {
          x: -14,
          y: 83
        }, {
          x: -16,
          y: 70
        }, {
          x: -26,
          y: 57
        }, {
          x: -38,
          y: 46
        }, {
          x: -52,
          y: 37
        }, {
          x: -66,
          y: 28
        }, {
          x: -79,
          y: 24
        }, {
          x: -90,
          y: 21
        }, {
          x: -103,
          y: 16
        }, {
          x: -119,
          y: 3
        }, {
          x: -131,
          y: -7
        }, {
          x: -147,
          y: -21
        }, {
          x: -163,
          y: -29
        }, {
          x: -182,
          y: -36
        }, {
          x: -205,
          y: -42
        }, {
          x: -220,
          y: -43
        }, {
          x: -242,
          y: -48
        }, {
          x: -232,
          y: -54
        }, {
          x: -216,
          y: -55
        }, {
          x: -201,
          y: -54
        }, {
          x: -195,
          y: -63
        }, {
          x: -199,
          y: -75
        }, {
          x: -202,
          y: -87
        }, {
          x: -210,
          y: -102
        }, {
          x: -196,
          y: -90
        }, {
          x: -188,
          y: -77
        }, {
          x: -182,
          y: -63
        }, {
          x: -172,
          y: -50
        }, {
          x: -158,
          y: -43
        }, {
          x: -146,
          y: -44
        }, {
          x: -141,
          y: -57
        }, {
          x: -145,
          y: -69
        }, {
          x: -149,
          y: -80
        }, {
          x: -138,
          y: -73
        }, {
          x: -131,
          y: -59
        }, {
          x: -127,
          y: -49
        }, {
          x: -124,
          y: -34
        }, {
          x: -120,
          y: -24
        }, {
          x: -110,
          y: -13
        }, {
          x: -96,
          y: -2
        }, {
          x: -82,
          y: 4
        }, {
          x: -69,
          y: 11
        }, {
          x: -51,
          y: 16
        }, {
          x: -36,
          y: 21
        }, {
          x: -21,
          y: 24
        }, {
          x: -21,
          y: 13
        }, {
          x: -21,
          y: 7
        }, {
          x: -13,
          y: 9
        }, {
          x: -6,
          y: 14
        }, {
          x: -2,
          y: 18
        }, {
          x: 6,
          y: 24
        }, {
          x: 16,
          y: 25
        }, {
          x: 25,
          y: 19
        }, {
          x: 23,
          y: 9
        }, {
          x: 16,
          y: -4
        }, {
          x: 6,
          y: -18
        }, {
          x: -9,
          y: -35
        }, {
          x: -25,
          y: -52
        }, {
          x: -39,
          y: -66
        }, {
          x: -54,
          y: -79
        }, {
          x: -76,
          y: -92
        }, {
          x: -97,
          y: -107
        }, {
          x: -112,
          y: -116
        }, {
          x: -129,
          y: -124
        }, {
          x: -146,
          y: -140
        }, {
          x: -123,
          y: -134
        }, {
          x: -105,
          y: -125
        }, {
          x: -79,
          y: -114
        }, {
          x: -66,
          y: -106
        }, {
          x: -51,
          y: -100
        }, {
          x: -48,
          y: -110
        }, {
          x: -49,
          y: -121
        }, {
          x: -52,
          y: -133
        }, {
          x: -58,
          y: -156
        }, {
          x: -47,
          y: -142
        }, {
          x: -41,
          y: -129
        }, {
          x: -38,
          y: -116
        }, {
          x: -33,
          y: -99
        }, {
          x: -30,
          y: -85
        }, {
          x: -19,
          y: -66
        }, {
          x: -5,
          y: -48
        }, {
          x: 8,
          y: -38
        }, {
          x: 22,
          y: -38
        }, {
          x: 35,
          y: -43
        }, {
          x: 44,
          y: -51
        }, {
          x: 51,
          y: -67
        }, {
          x: 54,
          y: -48
        }, {
          x: 44,
          y: -34
        }, {
          x: 30,
          y: -22
        }, {
          x: 32,
          y: -11
        }, {
          x: 40,
          y: -1
        }, {
          x: 51,
          y: 2
        }, {
          x: 67,
          y: 0
        }, {
          x: 80,
          y: -8
        }, {
          x: 84,
          y: -18
        }, {
          x: 90,
          y: -14
        }, {
          x: 100,
          y: -21
        }, {
          x: 102,
          y: -18
        }, {
          x: 103,
          y: -13
        }, {
          x: 101,
          y: -8
        }, {
          x: 94,
          y: -1
        }, {
          x: 88,
          y: 2
        }, {
          x: 80,
          y: 6
        }, {
          x: 72,
          y: 11
        }, {
          x: 64,
          y: 14
        }, {
          x: 58,
          y: 23
        }, {
          x: 59,
          y: 34
        }, {
          x: 67,
          y: 41
        }, {
          x: 83,
          y: 48
        }, {
          x: 94,
          y: 52
        }, {
          x: 110,
          y: 57
        }, {
          x: 125,
          y: 61
        }, {
          x: 141,
          y: 66
        }, {
          x: 152,
          y: 71
        }, {
          x: 157,
          y: 78
        }, {
          x: 157,
          y: 88
        }, {
          x: 153,
          y: 96
        }, {
          x: 143,
          y: 103
        }, {
          x: 124,
          y: 110
        }, {
          x: 112,
          y: 121
        }, {
          x: 103,
          y: 131
        }, {
          x: 90,
          y: 150
        }, {
          x: 86,
          y: 164
        }, {
          x: 82,
          y: 177
        }, {
          x: 76,
          y: 188
        }, {
          x: 65,
          y: 195
        }, {
          x: 54,
          y: 199
        }, {
          x: 40,
          y: 201
        }, {
          x: 31,
          y: 201
        }
      ];
      this.frames[2] = [
        {
          x: -74,
          y: -156
        }, {
          x: -70,
          y: -137
        }, {
          x: -68,
          y: -121
        }, {
          x: -69,
          y: -109
        }, {
          x: -70,
          y: -96
        }, {
          x: -75,
          y: -84
        }, {
          x: -85,
          y: -73
        }, {
          x: -94,
          y: -63
        }, {
          x: -103,
          y: -52
        }, {
          x: -110,
          y: -39
        }, {
          x: -117,
          y: -25
        }, {
          x: -121,
          y: -13
        }, {
          x: -126,
          y: -2
        }, {
          x: -134,
          y: 11
        }, {
          x: -143,
          y: 26
        }, {
          x: -147,
          y: 37
        }, {
          x: -153,
          y: 46
        }, {
          x: -154,
          y: 54
        }, {
          x: -163,
          y: 63
        }, {
          x: -171,
          y: 67
        }, {
          x: -179,
          y: 72
        }, {
          x: -185,
          y: 80
        }, {
          x: -185,
          y: 87
        }, {
          x: -188,
          y: 96
        }, {
          x: -195,
          y: 104
        }, {
          x: -203,
          y: 111
        }, {
          x: -211,
          y: 124
        }, {
          x: -212,
          y: 135
        }, {
          x: -209,
          y: 146
        }, {
          x: -204,
          y: 154
        }, {
          x: -196,
          y: 157
        }, {
          x: -187,
          y: 156
        }, {
          x: -178,
          y: 152
        }, {
          x: -169,
          y: 144
        }, {
          x: -162,
          y: 132
        }, {
          x: -158,
          y: 119
        }, {
          x: -154,
          y: 109
        }, {
          x: -145,
          y: 101
        }, {
          x: -140,
          y: 90
        }, {
          x: -132,
          y: 84
        }, {
          x: -121,
          y: 86
        }, {
          x: -110,
          y: 89
        }, {
          x: -99,
          y: 91
        }, {
          x: -92,
          y: 89
        }, {
          x: -87,
          y: 74
        }, {
          x: -80,
          y: 60
        }, {
          x: -72,
          y: 43
        }, {
          x: -59,
          y: 25
        }, {
          x: -48,
          y: 6
        }, {
          x: -34,
          y: -17
        }, {
          x: -22,
          y: -40
        }, {
          x: -14,
          y: -59
        }, {
          x: -8,
          y: -75
        }, {
          x: -3,
          y: -92
        }, {
          x: -2,
          y: -118
        }, {
          x: -3,
          y: -140
        }, {
          x: -3,
          y: -156
        }, {
          x: 40,
          y: -156
        }, {
          x: 47,
          y: -147
        }, {
          x: 57,
          y: -135
        }, {
          x: 63,
          y: -122
        }, {
          x: 65,
          y: -106
        }, {
          x: 68,
          y: -82
        }, {
          x: 69,
          y: -61
        }, {
          x: 72,
          y: -42
        }, {
          x: 71,
          y: -22
        }, {
          x: 75,
          y: -11
        }, {
          x: 75,
          y: 2
        }, {
          x: 75,
          y: 18
        }, {
          x: 76,
          y: 36
        }, {
          x: 78,
          y: 52
        }, {
          x: 77,
          y: 64
        }, {
          x: 83,
          y: 68
        }, {
          x: 95,
          y: 69
        }, {
          x: 95,
          y: 82
        }, {
          x: 95,
          y: 98
        }, {
          x: 96,
          y: 109
        }, {
          x: 99,
          y: 115
        }, {
          x: 107,
          y: 115
        }, {
          x: 124,
          y: 116
        }, {
          x: 138,
          y: 116
        }, {
          x: 154,
          y: 119
        }, {
          x: 172,
          y: 122
        }, {
          x: 188,
          y: 121
        }, {
          x: 198,
          y: 118
        }, {
          x: 209,
          y: 113
        }, {
          x: 211,
          y: 104
        }, {
          x: 205,
          y: 98
        }, {
          x: 198,
          y: 99
        }, {
          x: 185,
          y: 99
        }, {
          x: 175,
          y: 98
        }, {
          x: 166,
          y: 91
        }, {
          x: 157,
          y: 77
        }, {
          x: 149,
          y: 65
        }, {
          x: 141,
          y: 55
        }, {
          x: 136,
          y: 34
        }, {
          x: 133,
          y: 17
        }, {
          x: 128,
          y: -3
        }, {
          x: 129,
          y: -38
        }, {
          x: 129,
          y: -67
        }, {
          x: 130,
          y: -93
        }, {
          x: 127,
          y: -118
        }, {
          x: 124,
          y: -144
        }, {
          x: 117,
          y: -156
        }
      ];
      return this.frames[3] = [
        {
          x: -150,
          y: -156
        }, {
          x: -143,
          y: -140
        }, {
          x: -139,
          y: -126
        }, {
          x: -137,
          y: -113
        }, {
          x: -139,
          y: -103
        }, {
          x: -144,
          y: -90
        }, {
          x: -153,
          y: -78
        }, {
          x: -161,
          y: -66
        }, {
          x: -170,
          y: -53
        }, {
          x: -179,
          y: -39
        }, {
          x: -188,
          y: -22
        }, {
          x: -197,
          y: -5
        }, {
          x: -205,
          y: 11
        }, {
          x: -213,
          y: 23
        }, {
          x: -221,
          y: 35
        }, {
          x: -227,
          y: 47
        }, {
          x: -229,
          y: 59
        }, {
          x: -232,
          y: 66
        }, {
          x: -237,
          y: 77
        }, {
          x: -241,
          y: 82
        }, {
          x: -248,
          y: 90
        }, {
          x: -252,
          y: 99
        }, {
          x: -251,
          y: 107
        }, {
          x: -251,
          y: 115
        }, {
          x: -247,
          y: 122
        }, {
          x: -240,
          y: 129
        }, {
          x: -230,
          y: 136
        }, {
          x: -219,
          y: 148
        }, {
          x: -214,
          y: 153
        }, {
          x: -203,
          y: 158
        }, {
          x: -193,
          y: 160
        }, {
          x: -182,
          y: 160
        }, {
          x: -172,
          y: 156
        }, {
          x: -168,
          y: 148
        }, {
          x: -170,
          y: 136
        }, {
          x: -176,
          y: 127
        }, {
          x: -187,
          y: 118
        }, {
          x: -191,
          y: 110
        }, {
          x: -186,
          y: 97
        }, {
          x: -174,
          y: 101
        }, {
          x: -166,
          y: 89
        }, {
          x: -156,
          y: 73
        }, {
          x: -149,
          y: 64
        }, {
          x: -143,
          y: 54
        }, {
          x: -136,
          y: 42
        }, {
          x: -128,
          y: 29
        }, {
          x: -120,
          y: 15
        }, {
          x: -111,
          y: 1
        }, {
          x: -100,
          y: -16
        }, {
          x: -90,
          y: -30
        }, {
          x: -79,
          y: -48
        }, {
          x: -69,
          y: -67
        }, {
          x: -66,
          y: -85
        }, {
          x: -66,
          y: -102
        }, {
          x: -66,
          y: -122
        }, {
          x: -66,
          y: -139
        }, {
          x: -68,
          y: -156
        }, {
          x: -7,
          y: -156
        }, {
          x: 17,
          y: -139
        }, {
          x: 31,
          y: -128
        }, {
          x: 39,
          y: -117
        }, {
          x: 47,
          y: -106
        }, {
          x: 53,
          y: -86
        }, {
          x: 59,
          y: -65
        }, {
          x: 65,
          y: -46
        }, {
          x: 71,
          y: -22
        }, {
          x: 75,
          y: -11
        }, {
          x: 79,
          y: 2
        }, {
          x: 81,
          y: 17
        }, {
          x: 85,
          y: 35
        }, {
          x: 87,
          y: 49
        }, {
          x: 88,
          y: 56
        }, {
          x: 89,
          y: 62
        }, {
          x: 88,
          y: 71
        }, {
          x: 86,
          y: 82
        }, {
          x: 86,
          y: 97
        }, {
          x: 86,
          y: 110
        }, {
          x: 93,
          y: 114
        }, {
          x: 105,
          y: 117
        }, {
          x: 124,
          y: 116
        }, {
          x: 138,
          y: 116
        }, {
          x: 154,
          y: 119
        }, {
          x: 172,
          y: 122
        }, {
          x: 188,
          y: 121
        }, {
          x: 198,
          y: 118
        }, {
          x: 209,
          y: 113
        }, {
          x: 211,
          y: 104
        }, {
          x: 205,
          y: 101
        }, {
          x: 197,
          y: 101
        }, {
          x: 185,
          y: 99
        }, {
          x: 175,
          y: 98
        }, {
          x: 166,
          y: 91
        }, {
          x: 154,
          y: 76
        }, {
          x: 146,
          y: 66
        }, {
          x: 139,
          y: 56
        }, {
          x: 133,
          y: 32
        }, {
          x: 129,
          y: 15
        }, {
          x: 126,
          y: -8
        }, {
          x: 122,
          y: -39
        }, {
          x: 120,
          y: -67
        }, {
          x: 118,
          y: -96
        }, {
          x: 115,
          y: -116
        }, {
          x: 111,
          y: -141
        }, {
          x: 95,
          y: -156
        }
      ];
    };

    SceneIntro.prototype.initBoids = function(frameNum) {
      var a, b, color, frame, hh, hw, i, pos, _i, _ref, _results;
      if (frameNum == null) {
        frameNum = 0;
      }
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      this.boids = [];
      frame = this.frames[frameNum];
      _results = [];
      for (i = _i = 0, _ref = frame.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = frame[i];
        pos = new Vec3D(random(this.ctx.width * .1, this.ctx.width * .9), random(-50, 0), 0);
        color = '#ccc';
        b = new Boid(this.ctx, pos, color);
        b.radius = random(1, 2);
        b.maxSpeed = random(0.2, 1);
        _results.push(this.boids.push(b));
      }
      return _results;
    };

    return SceneIntro;

  })(AbstractScene);

  SceneRays = (function(_super) {

    __extends(SceneRays, _super);

    function SceneRays(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneRays.__super__.constructor.apply(this, arguments);
      this.angle = 0;
      this.osc = 0;
      this.slice = TWO_PI / this.reindeer.anchors.length;
      this.gradient = this.ctx.createLinearGradient(0, 0, 10, this.ctx.height);
      this.gradient.addColorStop('0', 'rgba(0, 0, 255, 0.5)');
      this.gradient.addColorStop('0.80', 'rgba(255, 0, 255, 0.5)');
    }

    SceneRays.prototype.draw = function() {
      var a, b, c, d, hh, hw, i, j, o, scale, sx, sy, t, _i, _j, _k, _l, _ref;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      this.ctx.globalCompositeOperation = 'lighter';
      if (app.view.ui.drawLines) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.gradient;
        b = this.ctx.height + this.ctx.height * .25;
        c = -this.ctx.height * .25 - b;
        d = 41;
        for (i = _i = 0; _i <= 41; i = ++_i) {
          t = i;
          a = this.reindeer.anchors[i];
          sx = this.ctx.width;
          sy = c * t / d + b;
          this.ctx.moveTo(sx, sy);
          this.ctx.lineTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
        }
        this.ctx.strokeStyle = this.gradient;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(' + Math.floor(random(255)) + ', 0, 255, 0.5)';
        b = -hh;
        c = this.ctx.height + this.ctx.height * .3 - b;
        d = 35;
        for (i = _j = 75; _j <= 110; i = ++_j) {
          t = i - 75;
          a = this.reindeer.anchors[i];
          sx = 0;
          sy = c * t / d + b;
          this.ctx.moveTo(sx, sy);
          this.ctx.lineTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
        }
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(' + Math.floor(random(255)) + ', 0, 255, 0.7)';
        b = hh;
        c = this.ctx.height - b;
        d = 12;
        for (i = _k = 0; 0 <= d ? _k <= d : _k >= d; i = 0 <= d ? ++_k : --_k) {
          t = i;
          j = 127 - i;
          a = this.reindeer.anchors[j];
          sx = this.ctx.width;
          sy = c * t / d + b;
          this.ctx.moveTo(sx, sy);
          this.ctx.lineTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
        }
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(' + Math.floor(random(255)) + ', 0, 255, 0.6)';
        for (i = _l = 0, _ref = this.reindeer.opposites.length; 0 <= _ref ? _l < _ref : _l > _ref; i = 0 <= _ref ? ++_l : --_l) {
          o = this.reindeer.opposites[i];
          if (o === -1) {
            o = this.reindeer.opposites[i + 1];
            a = this.reindeer.anchors[o];
            this.ctx.moveTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
            continue;
          }
          a = this.reindeer.anchors[o];
          this.ctx.lineTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
        }
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        return this.ctx.closePath();
      }
      /*
      		# mask
      		# @ctx.globalCompositeOperation = 'xor'
      		@ctx.globalCompositeOperation = 'destination-in'
      
      		@ctx.beginPath()
      		@ctx.fillStyle = '#00ff00'
      		for a in @reindeer.anchors
      			@ctx.lineTo(a.pos.x + hw, a.pos.y + hh)
      		@ctx.fill()
      		@ctx.closePath()
      
      		@ctx.globalCompositeOperation = 'source-over'
      */

    };

    SceneRays.prototype.initReindeer = function() {
      SceneRays.__super__.initReindeer.apply(this, arguments);
      return this.reindeer.opposites = [0, 144, 1, 143, 2, 142, 3, 141, 4, 140, 4, 139, 5, 138, 6, 136, 7, 135, 8, 134, 9, 133, 10, 131, 11, 130, 12, 129, 13, 127, 14, 98, 15, 97, 16, 96, 17, -1, 96, 18, 95, 19, 94, 20, -1, 94, 21, 93, 22, 92, 24, 92, 25, 91, 26, 90, 27, 89, 28, 88, 29, 87, 30, 86, 31, 85, 32, 84, 33, 83, 34, 82, 35, 54, 36, 53, 37, 52, 38, 50, 39, 41, -1, 64, 82, 65, 81, 66, 80, 67, 79, 68, 78, 71, 72, 70, 77, 75, 74, 76, 69];
    };

    return SceneRays;

  })(AbstractScene);

  SceneRopeBall = (function(_super) {

    __extends(SceneRopeBall, _super);

    SceneRopeBall.prototype.ctx = null;

    SceneRopeBall.prototype.index = null;

    SceneRopeBall.prototype.reindeer = null;

    SceneRopeBall.prototype.boids = null;

    SceneRopeBall.prototype.numBoids = 0;

    function SceneRopeBall(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneRopeBall.__super__.constructor.apply(this, arguments);
      this.numBoids = this.reindeer.anchors.length;
      this.initBoids();
    }

    SceneRopeBall.prototype.update = function() {
      var a, boid, hh, hw, i, _i, _len, _ref, _results;
      SceneRopeBall.__super__.update.apply(this, arguments);
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      i = 0;
      _ref = this.boids;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        boid = _ref[_i];
        a = this.reindeer.anchors[i];
        if (this.ctx.down) {
          boid.acc.addSelf(boid.seek(new Vec3D(this.ctx.mouse.x, this.ctx.mouse.y, 0)).scaleSelf(0.3));
        }
        boid.acc.addSelf(boid.arrive(new Vec3D(a.pos.x + hw, a.pos.y + hh, 0)).scaleSelf(0.5));
        boid.acc.addSelf(boid.wander().scaleSelf(0.2));
        boid.update();
        boid.bounce();
        _results.push(i++);
      }
      return _results;
    };

    SceneRopeBall.prototype.draw = function() {
      var a, b, boid, c, hh, hw, i, scale, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2, _results;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = 'rgba(200, ' + floor(random(125, 200)) + ', 35, 0.7)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      for (i = _i = 0, _ref = this.reindeer.anchors.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = this.reindeer.anchors[i];
        b = this.boids[i];
        c = a.other;
        this.ctx.moveTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
        this.ctx.lineTo(b.pos.x, b.pos.y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
      _ref1 = this.reindeer.anchors;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        a = _ref1[_j];
        this.ctx.beginPath();
        this.ctx.strokeStyle = a.color;
        this.ctx.arc(a.pos.x * scale + hw, a.pos.y * scale + hh, 1, 0, TWO_PI);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      _ref2 = this.boids;
      _results = [];
      for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
        boid = _ref2[_k];
        _results.push(boid.draw());
      }
      return _results;
    };

    SceneRopeBall.prototype.initReindeer = function() {
      return SceneRopeBall.__super__.initReindeer.apply(this, arguments);
      /*
      		for i in [0...@reindeer.anchors.length]
      			a = @reindeer.anchors[i]
      			# num = floor(random(@reindeer.anchors.length))
      			# a.other = @reindeer.anchors[num]
      			a.other = @reindeer.anchors[i + 15]
      			a.color = 'rgb(' + floor(random(160, 220)) + ', ' + floor(random(120, 140)) + ', 0)'
      */

    };

    SceneRopeBall.prototype.initBoids = function() {
      var a, b, color, hh, hw, i, pos, _i, _ref, _results;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      this.boids = [];
      _results = [];
      for (i = _i = 0, _ref = this.numBoids; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = this.reindeer.anchors[i];
        pos = new Vec3D(a.pos.x + hw, a.pos.y + hh, 0);
        color = 'rgb(' + floor(random(160, 220)) + ', ' + floor(random(120, 140)) + ', 0)';
        if (random() > 0.9) {
          color = '#ffff00';
        }
        b = new Boid(this.ctx, pos, color);
        b.radius = random(2, 6);
        b.index = i;
        b.maxSpeed = random(1, 3);
        if (random() > 0.9) {
          b.maxSpeed = 6;
        }
        _results.push(this.boids.push(b));
      }
      return _results;
    };

    return SceneRopeBall;

  })(AbstractScene);

  Scenes = (function() {

    Scenes.prototype.audio = null;

    Scenes.prototype.ctx = null;

    Scenes.prototype.scenes = null;

    Scenes.prototype.current = null;

    Scenes.prototype.playingIntro = null;

    Scenes.prototype.auto = null;

    Scenes.prototype.lastChange = 0;

    function Scenes(ctx) {
      this.ctx = ctx;
      this.audio = app.audio;
      this.initScenes();
      this.goto(0);
      this.playingIntro = true;
      this.auto = true;
    }

    Scenes.prototype.update = function() {
      var dt;
      this.scenes[this.current].update();
      if (!this.audio.startedAt) {
        return;
      }
      if (this.audio.paused) {
        return;
      }
      if (this.playingIntro) {
        return;
      }
      if (!this.auto) {
        return;
      }
      dt = Date.now() - this.audio.startedAt;
      if ((dt - this.lastChange) * this.audio.sourceNode.playbackRate.value > 4320) {
        this.lastChange = dt;
        return this.next();
      }
    };

    Scenes.prototype.draw = function() {
      return this.scenes[this.current].draw();
    };

    Scenes.prototype.goto = function(index) {
      if (this.playingIntro) {
        return;
      }
      this.current = index;
      return this.scenes[this.current].start();
    };

    Scenes.prototype.prev = function() {
      if (this.current > 0) {
        return this.goto(this.current - 1);
      } else {
        return this.goto(this.scenes.length - 1);
      }
    };

    Scenes.prototype.next = function() {
      if (this.current < this.scenes.length - 1) {
        return this.goto(this.current + 1);
      } else {
        return this.goto(0);
      }
    };

    Scenes.prototype.killIntro = function() {
      this.lastChange = 9630;
      this.playingIntro = false;
      this.scenes.shift();
      return this.goto(0);
    };

    Scenes.prototype.initScenes = function() {
      this.scenes = [];
      this.scenes.push(new SceneIntro(this.ctx, this.scenes.length));
      this.scenes.push(new SceneBasic(this.ctx, this.scenes.length));
      this.scenes.push(new SceneCircles(this.ctx, this.scenes.length));
      this.scenes.push(new SceneRays(this.ctx, this.scenes.length));
      this.scenes.push(new SceneRopeBall(this.ctx, this.scenes.length));
      this.scenes.push(new SceneFatso(this.ctx, this.scenes.length));
      return this.scenes.push(new SceneChewbacca(this.ctx, this.scenes.length));
    };

    return Scenes;

  })();

  SceneTest = (function(_super) {

    __extends(SceneTest, _super);

    SceneTest.prototype.ctx = null;

    SceneTest.prototype.index = null;

    SceneTest.prototype.reindeer = null;

    function SceneTest(ctx, index) {
      this.ctx = ctx;
      this.index = index;
      SceneTest.__super__.constructor.apply(this, arguments);
    }

    SceneTest.prototype.update = function() {
      return SceneTest.__super__.update.apply(this, arguments);
      /*
      		for a in @reindeer.anchors
      			a.update()
      */

    };

    SceneTest.prototype.draw = function() {
      var a, b, hh, hw, i, scale, _i, _j, _len, _ref, _ref1, _results;
      hw = this.ctx.width * .5;
      hh = this.ctx.height * .5;
      scale = 1;
      this.ctx.strokeStyle = '#ccc';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      for (i = _i = 0, _ref = this.reindeer.anchors.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = this.reindeer.anchors[i];
        if (!a.other) {
          continue;
        }
        a = this.reindeer.anchors[i];
        b = a.other;
        this.ctx.moveTo(a.pos.x * scale + hw, a.pos.y * scale + hh);
        this.ctx.lineTo(a.pos.x * scale - a.length + hw, a.pos.y * scale + hh);
        this.ctx.lineTo(a.pos.x * scale - a.length + hw, b.pos.y * scale + hh);
        this.ctx.lineTo(b.pos.x * scale + hw, b.pos.y * scale + hh);
      }
      /*
      		a = @reindeer.anchors[23]
      		dy = a.pos.y * scale + hh - 200
      		@ctx.moveTo(200, 200)
      		@ctx.lineTo(350, 200)
      		@ctx.lineTo(350 + dy, 200 + dy)
      		@ctx.lineTo(a.pos.x * scale + hw, a.pos.y * scale + hh)
      */

      this.ctx.stroke();
      this.ctx.closePath();
      _ref1 = this.reindeer.anchors;
      _results = [];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        a = _ref1[_j];
        if (!a.other) {
          continue;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = '#222';
        this.ctx.strokeStyle = '#bbb';
        this.ctx.lineWidth = 1;
        this.ctx.arc(a.pos.x * scale + hw, a.pos.y * scale + hh, a.radius, 0, TWO_PI);
        this.ctx.fill();
        this.ctx.stroke();
        _results.push(this.ctx.closePath());
      }
      return _results;
      /*
      		for a in @reindeer.anchors
      			@ctx.translate(hw, hh)
      			a.draw()
      			@ctx.setTransform(1, 0, 0, 1, 0, 0)
      */

      /*
      		if (app.view.ui.drawLines)
      			@ctx.strokeStyle = '#fff'
      			@ctx.fillStyle = '#E37C49'
      			@ctx.beginPath()
      
      			for i in [0...@reindeer.anchors.length]
      				a = @reindeer.anchors[i]
      				b = { pos:{} }
      				b.pos.x = cos(a.angle) * 80 + a.pos.x
      				b.pos.y = sin(a.angle) * 80 + a.pos.y
      
      				@ctx.moveTo(a.pos.x * scale + hw, a.pos.y * scale + hh)
      				@ctx.lineTo(b.pos.x * scale + hw, b.pos.y * scale + hh)
      
      			b = @reindeer.anchors[0]
      			# @ctx.lineTo(b.pos.x * scale + hw, b.pos.y * scale + hh)
      			# @ctx.fill()
      			@ctx.stroke()
      			@ctx.closePath()
      */

      /*
      		if (app.view.ui.drawAnchors)
      			for a in @reindeer.anchors
      				@ctx.beginPath()
      				# @ctx.strokeStyle = '#ffffff'
      				@ctx.strokeStyle = a.color
      				# @ctx.lineWidth = a.radius * .5
      				@ctx.lineWidth = 2
      				@ctx.arc(a.pos.x * scale + hw, a.pos.y * scale + hh, a.radius, 0, TWO_PI)
      				# @ctx.fill()
      				@ctx.stroke()
      				@ctx.closePath()
      
      
      		if (app.view.ui.drawLines)
      			@ctx.lineCap = 'round'
      			@ctx.lineJoin = 'round'
      
      			scale = 1
      			for i in [0...@reindeer.anchors.length - 1]
      				a = @reindeer.anchors[i]
      				b = @reindeer.anchors[i + 1]
      				offset = 0
      				if (a.left) then offset = -1000
      				else if (a.right) then offset = 1000
      
      				@ctx.beginPath()
      				# @ctx.moveTo(a.pos.x * scale + hw, a.pos.y * scale + hh)
      				# @ctx.lineTo(b.pos.x * scale + hw, b.pos.y * scale + hh)
      				# @ctx.lineTo(a.pos.x + hw + offset, a.pos.y + hh)
      
      				@ctx.moveTo(a.pos.x + cos(a.angle) * 150 + hw, a.pos.y + sin(a.angle) * 150 + hh)
      				@ctx.lineTo(b.pos.x + cos(b.angle) * 150 + hw, b.pos.y + sin(b.angle) * 150 + hh)
      				@ctx.strokeStyle = 'rgb(255, 255, 255)'
      				@ctx.lineWidth = a.lineWidth
      				@ctx.stroke()
      				@ctx.closePath()
      
      			# @ctx.lineTo(@reindeer.anchors[0].pos.x + hw, @reindeer.anchors[0].pos.y + hh)
      */

    };

    SceneTest.prototype.initReindeer = function() {
      var a, index, leftArm, leftFoot, leftHead, leftHip, leftHornLeft, leftLegLeft, rightArm, rightFoot, rightHead, rightHip, rightHornRight, rightLegRight, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _q, _ref, _results;
      SceneTest.__super__.initReindeer.apply(this, arguments);
      leftArm = [];
      rightArm = [];
      leftLegLeft = [];
      rightLegRight = [];
      leftHip = [];
      rightHip = [];
      leftFoot = [];
      rightFoot = [];
      leftHead = [];
      rightHead = [];
      leftHornLeft = [];
      rightHornRight = [];
      _ref = this.reindeer.anchors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        if (a.leftArm) {
          leftArm.push(a);
        } else if (a.rightArm) {
          rightArm.push(a);
        } else if (a.leftLegLeft) {
          leftLegLeft.push(a);
        } else if (a.rightLegRight) {
          rightLegRight.push(a);
        } else if (a.leftHip) {
          leftHip.push(a);
        } else if (a.rightHip) {
          rightHip.push(a);
        } else if (a.leftFoot) {
          leftFoot.push(a);
        } else if (a.rightFoot) {
          rightFoot.push(a);
        } else if (a.leftHead) {
          leftHead.push(a);
        } else if (a.rightHead) {
          rightHead.push(a);
        } else if (a.leftHornLeft) {
          leftHornLeft.push(a);
        } else if (a.rightHornRight) {
          rightHornRight.push(a);
        }
        a.radius = 2;
        if (a.right) {
          a.length = random(20, 60);
        } else {
          a.length = random(-30, -60);
        }
      }
      for (_j = 0, _len1 = leftArm.length; _j < _len1; _j++) {
        a = leftArm[_j];
        index = floor(random(rightArm.length));
        a.other = rightArm[index];
        rightArm.splice(index, 1);
        if (!a.other) {
          index = floor(random(leftArm.length));
          a.other = leftArm[index];
        }
      }
      for (_k = 0, _len2 = leftHip.length; _k < _len2; _k++) {
        a = leftHip[_k];
        index = floor(random(rightHip.length));
        a.other = rightHip[index];
        rightHip.splice(index, 1);
        if (!a.other) {
          index = floor(random(leftHip.length));
          a.other = leftHip[index];
        }
      }
      for (_l = 0, _len3 = rightHead.length; _l < _len3; _l++) {
        a = rightHead[_l];
        index = floor(random(leftHead.length));
        a.other = leftHead[index];
      }
      for (_m = 0, _len4 = leftHead.length; _m < _len4; _m++) {
        a = leftHead[_m];
        index = floor(random(rightHead.length));
        a.other = rightHead[index];
        rightHead.splice(index, 1);
        if (!a.other) {
          index = floor(random(leftHead.length));
          a.other = leftHead[index];
        }
      }
      for (_n = 0, _len5 = leftLegLeft.length; _n < _len5; _n++) {
        a = leftLegLeft[_n];
        if (!a) {
          continue;
        }
        index = floor(random(rightLegRight.length));
        a.other = rightLegRight[index];
        rightLegRight.splice(index, 1);
      }
      /*
      		for a in rightLeg
      			if (!a) then continue
      			index = floor(random(rightLeg.length))
      			a.other = rightLeg[index]
      			rightLeg.splice(index, 1)
      */

      for (_o = 0, _len6 = leftFoot.length; _o < _len6; _o++) {
        a = leftFoot[_o];
        if (!a) {
          continue;
        }
        index = floor(random(leftFoot.length));
        a.other = leftFoot[index];
        leftFoot.splice(index, 1);
      }
      for (_p = 0, _len7 = rightFoot.length; _p < _len7; _p++) {
        a = rightFoot[_p];
        if (!a) {
          continue;
        }
        index = floor(random(rightFoot.length));
        a.other = rightFoot[index];
        rightFoot.splice(index, 1);
      }
      _results = [];
      for (_q = 0, _len8 = leftHornLeft.length; _q < _len8; _q++) {
        a = leftHornLeft[_q];
        if (!a) {
          continue;
        }
        index = floor(random(rightHornRight.length));
        a.other = rightHornRight[index];
        _results.push(rightHornRight.splice(index, 1));
      }
      return _results;
      /*
      		for a in rightHorn
      			if (!a) then continue
      			index = floor(random(rightHorn.length))
      			a.other = rightHorn[index]
      			rightHorn.splice(index, 1)
      */

      /*
      		@reindeer.initRibbonAnchors()
      
      		# set extra properties
      		length = @reindeer.anchors.length
      		for i in [0...length]
      			a = @reindeer.anchors[i]
      			
      			if (i > 0) then p = @reindeer.anchors[i - 1].positions[0]
      			else p = a.positions[0]
      			if (i < length - 1) then n = @reindeer.anchors[i + 1].positions[0]
      			else n = a.positions[0]
      
      			dx = p.x - n.x
      			dy = p.y - n.y
      			# dd = Math.sqrt(dx * dx + dy * dy)
      			a.angle = Math.atan2(dy, dx) + HALF_PI
      
      			# a.color = 'rgb(20, ' + floor(random(50, 255)) + ', ' + floor(random(10, 50)) + ')'
      			# a.color = 'rgb(' + floor(random(150, 255)) + ', ' + floor(random(150, 255)) + ', 25)'
      			# a.color = 'rgb(' + floor(random(140, 200)) + ', ' + floor(random(50, 100)) + ', ' + floor(random(20, 50))+ ')'
      			# a.color = '#000'
      			a.color = 'rgb(' + floor(random(20, 50)) + ', ' + (220 - floor((a.pos.y + 300) / 570 * 150)) + ', ' + floor(random(10, 50)) + ')'
      			a.radius = 4
      			a.ctx = @ctx
      			# a.LENGTH = 10 - (a.pos.y + 300) / 540 * 10
      			a.LENGTH = 8
      */

    };

    return SceneTest;

  })(AbstractScene);

  window.app = {
    view: null,
    audio: null,
    init: function() {
      app.initAudio();
      return app.initView();
    },
    initAudio: function() {
      app.audio = new AppAudio();
      return app.audio.init();
    },
    initView: function() {
      app.view = new AppView();
      return app.view.init();
    }
  };

  app.init();

  StringUtils = (function() {

    function StringUtils() {}

    StringUtils.addLeadingZero = function(num, zeros) {
      var i, string, _i;
      if (zeros == null) {
        zeros = 1;
      }
      string = String(num);
      for (i = _i = 0; 0 <= zeros ? _i < zeros : _i > zeros; i = 0 <= zeros ? ++_i : --_i) {
        if (num < Math.pow(10, i + 1) && num > -1) {
          string = '0' + string;
        }
      }
      return string;
    };

    return StringUtils;

  })();

}).call(this);
