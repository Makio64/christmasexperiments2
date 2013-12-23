Acko.DataTexture = function (w, h, gl) {
  if (w === undefined) return;

  this.w = w;
  this.h = h;
  this.n = w * h * 4;
  this.gl = gl;

  this.build();
};

Acko.DataTexture.prototype = {

  build: function () {
    var gl = this.gl;

    var texture = this.texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    var data = new Float32Array(this.n);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.w, this.h, 0, gl.RGBA, gl.FLOAT, data);

    // Make wrapper texture object.
    var textureObject = this.textureObject = new THREE.Texture(
      new Image(),
      new THREE.UVMapping(),
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.NearestFilter,
      THREE.NearestFilter
    );

    // Pre-init texture to trick WebGLRenderer
    textureObject.__webglInit = true;
    textureObject.__webglTexture = texture;

  },

  write: function (data, x, y, w, h) {
    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.FLOAT, data);
  },

  uniforms: function () {
    return {
      dataResolution: {
        type: 'v2',
        value: new THREE.Vector2(1 / this.w, 1 / this.h),
      },
      dataTexture: {
        type: 't',
        value: this.textureObject,
      },
    };
  },

};

