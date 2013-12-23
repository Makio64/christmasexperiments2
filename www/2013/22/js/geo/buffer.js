Acko.DataBuffer = function (options) {

};

Acko.DataBuffer.iterationLimit = 65536;

Acko.DataBuffer.prototype = {

  build: function () {
  },

  update: function () {
  },

  uniforms: function () {
    return {};
  },

};

/////

Acko.LineBuffer = function (options) {
  if (options === undefined) return;

  options = options || {};

  this.n = options.n || 1;
  this.history = options.history || 1;
  this.gl = options.gl || null;
  this.callback = options.callback || function (i, output) { output() };

  this.build();
};

Acko.LineBuffer.prototype = _.extend(new Acko.DataBuffer(), {

  build: function () {
    var texture = new Acko.DataTexture(this.n, this.history, this.gl);
    this.texture = texture;

    this.data = new Float32Array(this.n * 4);
    this.index = 0;

    this._uniforms = _.extend({
      dataPointer: {
        type: 'v2',
        value: new THREE.Vector2(),
      },
    }, this.texture.uniforms());
  },

  generate: function (n, data) {
    var p = 0;
    var limit = n * 4;
    var done = false;

    var output = function (x, y, z, w) {
      if (!done) {
        data[p++] = x||0;
        data[p++] = y||0;
        data[p++] = z||0;
        data[p++] = w||0;
      }
      return !(done = p >= limit);
    };

    return output;
  },

  iterate: function () {
    var n = this.n;
    var data = this.data;
    var callback = this.callback;
    var output = this.generate(n, data);

    var i = 0;
    while (callback(i++, output) && i < Acko.DataBuffer.iterationLimit) {};
  },

  write: function () {
    this._uniforms.dataPointer.value.set(.5, this.index + .5);

    this.texture.write(this.data, 0, this.index, this.n, 1);
    this.index = (this.index + 1) % this.history;
  },

  update: function () {
    this.iterate();
    this.write();
  },

  uniforms: function () {
    return this._uniforms;
  },

});

/////

Acko.SurfaceBuffer = function (options) {
  if (options === undefined) return;

  options = options || {};

  this.n = options.n || 1;
  this.m = options.m || 1;
  this.history = options.history || 1;
  this.gl = options.gl || null;
  this.callback = options.callback || function (i, output) { output() };

  this.build();
};

Acko.SurfaceBuffer.prototype = _.extend(new Acko.DataBuffer(), {

  build: function () {
    var texture = new Acko.DataTexture(this.n, this.m * this.history, this.gl);
    this.texture = texture;

    this.data = new Float32Array(this.n * this.m * 4);
    this.index = 0;

    this._uniforms = _.extend({
      dataPointer: {
        type: 'v2',
        value: new THREE.Vector2(),
      },
    }, this.texture.uniforms());
  },

  generate: function (n, m, data) {
    var p = 0;
    var limit = n * m * 4;
    var done = false;

    var output = function (x, y, z, w) {
      if (!done) {
        data[p++] = x||0;
        data[p++] = y||0;
        data[p++] = z||0;
        data[p++] = w||0;
      }
      return !(done = p >= limit);
    };

    return output;
  },

  iterate: function () {
    var n = this.n;
    var m = this.m;
    var data = this.data;
    var callback = this.callback;
    var output = this.generate(n, m, data);

    var i = 0, j = 0, k = 0;
    do {
      var loop = callback(i, j, output);
      if (++i == n) {
        i = 0;
        j++;
      }
      k++;
    }
    while (loop && k < Acko.DataBuffer.iterationLimit) {};
  },

  write: function () {
    var y = this.index * this.m;
    this._uniforms.dataPointer.value.set(.5, y + .5);

    this.texture.write(this.data, 0, y, this.n, this.m);
    this.index = (this.index + 1) % this.history;
  },

  update: function () {
    this.iterate();
    this.write();
  },

  uniforms: function () {
    return this._uniforms;
  },

});